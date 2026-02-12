import { Worker, MatchRequest, MatchScore, MatchResult } from '../types';
import { calculateDistance, estimateTravelTime } from '../utils/distance';

export class WorkerMatchingEngine {
  /**
   * Core matching algorithm that scores workers based on multiple factors
   */
  public matchWorkers(
    workers: Worker[],
    request: MatchRequest
  ): MatchResult {
    const maxDistance = request.maxDistance || 25; // Default 25km radius
    const minRating = request.minRating || 0;

    // Filter workers by basic criteria
    const eligibleWorkers = workers.filter(worker => {
      const distance = calculateDistance(request.userLocation, worker.location);
      const matchesProfession = worker.profession.toLowerCase() === request.serviceType.toLowerCase();
      const withinDistance = distance <= maxDistance;
      const meetsRating = worker.rating >= minRating;
      
      return matchesProfession && withinDistance && meetsRating;
    });

    // Score each eligible worker
    const scoredWorkers = eligibleWorkers.map(worker => {
      const score = this.calculateMatchScore(worker, request);
      const distance = calculateDistance(request.userLocation, worker.location);
      const estimatedTime = estimateTravelTime(distance);

      return {
        ...worker,
        matchScore: score.score,
        distance,
        estimatedTime,
        scoreBreakdown: score.breakdown
      };
    });

    // Sort by match score (highest first)
    scoredWorkers.sort((a, b) => b.matchScore - a.matchScore);

    return {
      workers: scoredWorkers,
      totalMatches: scoredWorkers.length,
      searchRadius: maxDistance,
      matchingAlgorithm: 'Multi-Factor-Weighted-v1.0'
    };
  }

  /**
   * Calculate comprehensive match score for a worker
   */
  private calculateMatchScore(worker: Worker, request: MatchRequest): MatchScore {
    const distance = calculateDistance(request.userLocation, worker.location);
    const maxDistance = request.maxDistance || 25;

    // 1. Distance Score (30% weight) - closer is better
    const distanceScore = this.calculateDistanceScore(distance, maxDistance);

    // 2. Rating Score (25% weight) - higher rating is better
    const ratingScore = this.calculateRatingScore(worker.rating, worker.totalRatings);

    // 3. Experience Score (15% weight) - more experience is better
    const experienceScore = this.calculateExperienceScore(worker.experience, worker.completedJobs);

    // 4. Availability Score (15% weight) - available workers preferred
    const availabilityScore = worker.availability ? 100 : 20;

    // 5. Skill Match Score (10% weight) - matching skills bonus
    const skillMatchScore = this.calculateSkillMatchScore(worker.skills, request.skills || []);

    // 6. Load Balance Score (5% weight) - prefer workers with fewer ongoing jobs
    const loadBalanceScore = this.calculateLoadBalanceScore(worker.completedJobs);

    // Weighted total score
    const score =
      distanceScore * 0.30 +
      ratingScore * 0.25 +
      experienceScore * 0.15 +
      availabilityScore * 0.15 +
      skillMatchScore * 0.10 +
      loadBalanceScore * 0.05;

    return {
      workerId: worker._id,
      score: Math.round(score * 100) / 100,
      breakdown: {
        distanceScore,
        ratingScore,
        experienceScore,
        availabilityScore,
        skillMatchScore,
        loadBalanceScore
      },
      distance,
      estimatedTime: estimateTravelTime(distance)
    };
  }

  /**
   * Score based on distance (0-100)
   * Linear decay: 0km = 100, maxDistance = 0
   */
  private calculateDistanceScore(distance: number, maxDistance: number): number {
    if (distance >= maxDistance) return 0;
    const score = ((maxDistance - distance) / maxDistance) * 100;
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Score based on rating and number of ratings (0-100)
   * Considers both rating value and reliability (total ratings)
   */
  private calculateRatingScore(rating: number, totalRatings: number): number {
    const ratingNormalized = (rating / 5) * 100; // Convert 0-5 to 0-100
    
    // Confidence factor based on number of ratings
    let confidenceFactor = 1.0;
    if (totalRatings === 0) confidenceFactor = 0.5; // New workers get 50% confidence
    else if (totalRatings < 5) confidenceFactor = 0.7;
    else if (totalRatings < 10) confidenceFactor = 0.85;
    else if (totalRatings < 20) confidenceFactor = 0.95;
    
    return ratingNormalized * confidenceFactor;
  }

  /**
   * Score based on experience and completed jobs (0-100)
   */
  private calculateExperienceScore(experienceYears: number, completedJobs: number): number {
    const experienceScore = Math.min(experienceYears * 10, 50); // Max 50 points from years
    const jobsScore = Math.min(completedJobs * 2, 50); // Max 50 points from jobs
    return experienceScore + jobsScore;
  }

  /**
   * Score based on skill matching (0-100)
   */
  private calculateSkillMatchScore(workerSkills: string[], requestedSkills: string[]): number {
    if (requestedSkills.length === 0) return 100; // No specific skills required
    
    const matchedSkills = requestedSkills.filter(reqSkill =>
      workerSkills.some(workerSkill => 
        workerSkill.toLowerCase().includes(reqSkill.toLowerCase())
      )
    );
    
    return (matchedSkills.length / requestedSkills.length) * 100;
  }

  /**
   * Score for load balancing (0-100)
   * Prefer workers with fewer completed jobs for better distribution
   */
  private calculateLoadBalanceScore(completedJobs: number): number {
    // Inverse score - fewer jobs = higher score
    if (completedJobs === 0) return 100;
    if (completedJobs < 5) return 90;
    if (completedJobs < 10) return 80;
    if (completedJobs < 20) return 70;
    if (completedJobs < 50) return 60;
    return 50;
  }

  /**
   * Get top N workers from match results
   */
  public getTopMatches(matchResult: MatchResult, limit: number = 5): MatchResult {
    return {
      ...matchResult,
      workers: matchResult.workers.slice(0, limit),
      totalMatches: matchResult.totalMatches
    };
  }

  /**
   * Filter workers by urgency
   */
  public filterByUrgency(
    matchResult: MatchResult,
    urgency: 'low' | 'medium' | 'high'
  ): MatchResult {
    let filteredWorkers = matchResult.workers;

    switch (urgency) {
      case 'high':
        // Only available workers within 10km
        filteredWorkers = filteredWorkers.filter(
          w => w.availability && w.distance <= 10
        );
        break;
      case 'medium':
        // Prefer available workers within 15km
        filteredWorkers = filteredWorkers.filter(
          w => w.distance <= 15
        );
        break;
      case 'low':
        // All workers within max distance
        break;
    }

    return {
      ...matchResult,
      workers: filteredWorkers,
      totalMatches: filteredWorkers.length
    };
  }
}

export const matchingEngine = new WorkerMatchingEngine();

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../utils/constants';
import mainLogo from '../assets/main_logo.png';
import manHoldingMobile from '../assets/man_holding_mobile.png';
import girlInJoy from '../assets/girl_in_joy.png';
import balloons from '../assets/ballons.png';
import bullseye from '../assets/bulleye.png';
import shakehand from '../assets/shakehand.png';
import treasure from '../assets/treasure.png';
import locationImg from '../assets/location.png';

const Landing: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (isAuthenticated && user) {
      if (user.role === 'user') {
        navigate('/user/home');
      } else if (user.role === 'worker') {
        navigate('/worker/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section with Parallax */}
      <div className="relative bg-gradient-to-br from-primary-50 via-secondary-50 to-white overflow-hidden pt-16">
        {/* Animated Background Elements */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div 
              className="text-center md:text-left transform transition-all duration-700"
              style={{
                transform: `translateX(${scrollY * -0.1}px)`,
              }}
            >
              <div className="flex items-center justify-center md:justify-start mb-6 group">
                <div className="relative">
                  <img 
                    src={mainLogo} 
                    alt="Udhyoga Pay Logo" 
                    className="h-20 w-20 object-contain transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6 animate-fade-in-up">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-yellow-600 to-green-600 bg-size-200 animate-gradient">
                  {APP_NAME}
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 animate-fade-in-up animation-delay-200">
                Connect with skilled workers near you. Find plumbers, electricians, carpenters, and more in seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up animation-delay-400">
                <Link to="/register" className="group relative overflow-hidden">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto transform group-hover:scale-105 transition-transform duration-300">
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </Button>
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-yellow-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300 group-hover:animate-pulse"></div>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto transform hover:scale-105 hover:shadow-xl transition-all duration-300 hover:border-green-600 hover:text-green-600">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            
            <div 
              className="relative hidden md:block"
              style={{
                transform: `translateY(${scrollY * -0.2}px)`,
              }}
            >
              <div className="relative group">
                <img 
                  src={manHoldingMobile} 
                  alt="Man using mobile app" 
                  className="w-full h-auto max-w-md mx-auto transform group-hover:scale-105 transition-transform duration-500" 
                />
                <img 
                  src={balloons} 
                  alt="Celebration" 
                  className="absolute top-0 right-0 w-24 h-24 object-contain animate-float" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 rounded-3xl opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div 
        className="py-20 bg-white relative"
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Why Choose{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-600">
                {APP_NAME}
              </span>
              ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We make it easy to find reliable workers and earn money by providing services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { img: locationImg, title: 'Easy to Find', desc: 'Search for workers by profession and location', delay: '0ms' },
              { img: shakehand, title: 'Verified Workers', desc: 'All workers go through a verification process', delay: '100ms' },
              { img: bullseye, title: 'Quick Booking', desc: 'Book services in just a few clicks', delay: '200ms' },
              { img: treasure, title: 'Earn Money', desc: 'Join thousands of satisfied users and workers', delay: '300ms' },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl group cursor-pointer transform hover:-translate-y-3 transition-all duration-500 hover:shadow-2xl bg-white relative overflow-hidden"
                style={{ animationDelay: feature.delay }}
              >
                {/* Glowing background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-4 relative group-hover:scale-110 transition-transform duration-500">
                    <img 
                      src={feature.img} 
                      alt={feature.title} 
                      className="w-full h-full object-contain drop-shadow-lg" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>

                {/* Sparkle effect */}
                <div className="absolute top-2 right-2 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse">
                  ✨
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="relative bg-gradient-to-r from-green-600 via-yellow-600 to-green-600 bg-size-200 animate-gradient py-20 overflow-hidden"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      >
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 animate-fade-in-up">
                Ready to get started?
              </h2>
              <p className="text-green-50 mb-8 text-lg animate-fade-in-up animation-delay-200">
                Join {APP_NAME} today and experience the easiest way to find workers or earn money.
              </p>
              <Link to="/register" className="inline-block group animate-fade-in-up animation-delay-400">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="transform group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 bg-white text-green-600 hover:bg-green-50"
                >
                  <span className="flex items-center gap-2">
                    Sign Up Now
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </Button>
              </Link>
            </div>
            <div className="flex justify-center animate-fade-in-up animation-delay-600">
              <div className="relative group">
                <img 
                  src={girlInJoy} 
                  alt="Happy user" 
                  className="w-64 h-64 object-contain transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-2xl" 
                />
                <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(-50px, -20px) scale(1.05); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .bg-size-200 {
          background-size: 200% 200%;
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Hide scrollbar but keep functionality */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #16a34a, #ca8a04);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #15803d, #a16207);
        }
      `}</style>
    </div>
  );
};

export default Landing;


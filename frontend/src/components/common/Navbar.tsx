import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, Home, Briefcase, Shield, Sparkles, Info, Mail } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';
import mainLogo from '../../assets/main_logo.png';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Public links available to everyone
  const publicLinks = [
    { to: '/about', label: 'About Us', icon: Info },
    { to: '/contact', label: 'Contact', icon: Mail },
  ];

  // Role-based links
  const roleLinks = isAuthenticated
    ? user?.role === 'user'
      ? [
          { to: '/user/home', label: 'Home', icon: Home },
        ]
      : user?.role === 'worker'
      ? [
          { to: '/worker/dashboard', label: 'Dashboard', icon: Briefcase },
        ]
      : user?.role === 'admin'
      ? [
          { to: '/admin', label: 'Admin Panel', icon: Shield },
        ]
      : []
    : [];

  // Auth links for non-authenticated users
  const authLinks = !isAuthenticated ? [
    { to: '/login', label: 'Sign In', icon: User },
    { to: '/register', label: 'Get Started', icon: Sparkles },
  ] : [];

  // Combine all links
  const navLinks = [...roleLinks, ...publicLinks, ...authLinks];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={isAuthenticated ? (user?.role === 'user' ? '/user/home' : user?.role === 'worker' ? '/worker/dashboard' : '/admin') : '/'}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <img 
                src={mainLogo} 
                alt={APP_NAME} 
                className="h-10 w-10 object-contain transform group-hover:scale-110 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
            </div>
            <span className={`font-display font-bold text-xl bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent ${
              !isScrolled && 'drop-shadow-lg'
            }`}>
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 group relative overflow-hidden ${
                    isActive(link.to)
                      ? 'text-white bg-gradient-to-r from-green-600 to-yellow-600 shadow-lg'
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${!isActive(link.to) && 'group-hover:scale-110 group-hover:rotate-12'}`} />
                  <span className="relative z-10">{link.label}</span>
                  {!isActive(link.to) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  )}
                </Link>
              );
            })}

            {isAuthenticated && (
              <div className="flex items-center gap-4 ml-2 pl-6 border-l border-gray-300">
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-50 to-yellow-50 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-yellow-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 group"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 bg-white/95 backdrop-blur-lg shadow-lg space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? 'text-white bg-gradient-to-r from-green-600 to-yellow-600 shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {isAuthenticated && (
            <>
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-yellow-600 flex items-center justify-center text-white font-bold shadow-md">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Glitter Effect on Hover */}
      <style>{`
        @keyframes glitter {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        
        .group:hover::after {
          content: '✨';
          position: absolute;
          top: -10px;
          right: -10px;
          animation: glitter 1s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
    </nav>
  );
};

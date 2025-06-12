import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Trophy, User, Home, BarChart3, Upload } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Desktop and Mobile Navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 px-2">
            <div className="w-8 h-8 bg-gradient-sheesh rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-sheesh bg-clip-text text-transparent hidden sm:block">
              Sheesh
            </span>
          </Link>
          
          {/* Mobile: Horizontal Scrollable Navigation */}
          <div className="flex-1 overflow-x-auto md:overflow-visible px-2">
            <div className="flex space-x-1 min-w-max md:justify-center">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                  className={`flex-shrink-0 transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-gradient-sheesh text-white shadow-md' 
                      : 'hover:bg-orange-50'
                  }`}
                >
                  <Link to={item.path} className="flex items-center space-x-1">
                    <item.icon className="w-4 h-4" />
                    <span className="text-xs sm:text-sm whitespace-nowrap">{item.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
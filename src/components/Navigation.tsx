import React from 'react';
import { Upload, History, Home, BarChart3 } from 'lucide-react';
import { NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Upload', href: '/dashboard', icon: 'upload' },
  { label: 'History', href: '/history', icon: 'history' },
  { label: 'Results', href: '/results', icon: 'chart' },
];

const Navigation = () => {
  const location = useLocation();
  
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'upload': return <Upload className="w-5 h-5" />;
      case 'history': return <History className="w-5 h-5" />;
      case 'chart': return <BarChart3 className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">SmartFoot</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <span className="mr-2">{getIcon(item.icon)}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
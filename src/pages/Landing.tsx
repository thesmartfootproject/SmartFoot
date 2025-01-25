import React from 'react';
import { ArrowRight, Activity, Shield, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Smart Foot</span>
            <span className="block text-blue-600">Accurate Detection of Foot Deformities</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Advanced AI-powered platform for real-time detection and analysis of foot deformities.
            Get accurate results in seconds with our cutting-edge technology.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center">
                <Activity className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Real-time Analysis</h3>
              <p className="mt-2 text-gray-500">
                Get instant results with our advanced AI algorithms
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Shield className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Accurate Results</h3>
              <p className="mt-2 text-gray-500">
                High precision detection of various foot conditions
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Search className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Detailed Reports</h3>
              <p className="mt-2 text-gray-500">
                Comprehensive analysis with detailed recommendations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-64 sm:h-72 md:h-96">
            <img
              src="https://faberpgi.com/wp-content/uploads/2024/11/Untitled-7.png"
              alt="Medical Analysis"
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
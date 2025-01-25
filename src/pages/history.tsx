import React from 'react';
import { Clock, Tag, ChevronRight } from 'lucide-react';
import type { AnalysisResult } from '../types';

// Simulated history data - in a real app, this would come from an API/database
const historyData: AnalysisResult[] = [
  {
    footType: 'Left',
    condition: 'Flat Foot',
    confidence: 0.92,
    date: '2024-03-15T10:30:00Z',
    annotatedImageUrl: 'https://images.unsplash.com/photo-1508387027939-27cccde53673?auto=format&fit=crop&q=80'
  },
  {
    footType: 'Right',
    condition: 'Normal',
    confidence: 0.88,
    date: '2024-03-14T15:45:00Z',
    annotatedImageUrl: 'https://images.unsplash.com/photo-1508387027939-27cccde53673?auto=format&fit=crop&q=80'
  },
  // Add more mock data as needed
];

const History = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {historyData.map((result, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      result.condition === 'Normal' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <Tag className="w-4 h-4 mr-1" />
                      {result.condition}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(result.date).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Foot Type: <span className="font-medium">{result.footType}</span>
                    </p>
                    <div className="mt-1">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-600 rounded-full"
                              style={{ width: `${result.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {(result.confidence * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="ml-4 text-gray-400 hover:text-gray-500">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              {result.annotatedImageUrl && (
                <div className="mt-4">
                  <img
                    src={result.annotatedImageUrl}
                    alt="Analysis result"
                    className="h-32 w-auto rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
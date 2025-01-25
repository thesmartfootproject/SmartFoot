import React, { useState } from 'react';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import type { AnalysisResult, YoloResponse, TensorflowResponse, ModelType } from '../types';

const API_URL = 'http://localhost:8000';

const Dashboard = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>('flat_foot');

  const analyzeImage = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      let response;
      if (selectedModel === 'flat_foot') {
        response = await fetch(`${API_URL}/predict/yolo`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json() as YoloResponse;
        
        if (!data.predictions || data.predictions.length === 0) {
          throw new Error('No predictions received from the model');
        }
        
        const prediction = data.predictions[0];
        setResult({
          footType: 'Left', // This would need to come from another model or user input
          condition: prediction.label,
          confidence: prediction.confidence,
          date: new Date().toISOString(),
          annotatedImageUrl: data.annotated_image_url
        });
      } else {
        response = await fetch(`${API_URL}/predict/tensorflow`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json() as TensorflowResponse;
        
        setResult({
          footType: 'Left',
          condition: data.class,
          confidence: data.confidence,
          date: new Date().toISOString()
        });
      }

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      await analyzeImage(file);
    } else {
      setError('Please upload a valid image file');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      await analyzeImage(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Analysis Type</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedModel('flat_foot')}
                className={`px-4 py-2 rounded-md ${
                  selectedModel === 'flat_foot'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Flat Foot Detection
              </button>
              <button
                onClick={() => setSelectedModel('hallux_valgus')}
                className={`px-4 py-2 rounded-md ${
                  selectedModel === 'hallux_valgus'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hallux Valgus Detection
              </button>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Upload a foot image</h3>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
            <div className="mt-4">
              <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                Choose File
              </label>
            </div>
          </div>

          {selectedImage && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Uploaded Image</h3>
              <img
                src={selectedImage}
                alt="Uploaded foot"
                className="rounded-lg shadow-lg max-h-96 mx-auto"
              />
            </div>
          )}

          {result?.annotatedImageUrl && selectedModel === 'flat_foot' && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Visualization</h3>
              <img
                src={result.annotatedImageUrl}
                alt="Analysis visualization"
                className="rounded-lg shadow-lg max-h-96 mx-auto"
              />
            </div>
          )}
        </div>

        {/* Results Section */}
        <div>
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="mt-2 text-gray-500">Analyzing image...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-lg p-6 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
              <p className="mt-2 text-red-600">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-4 text-sm text-red-600 hover:text-red-500"
              >
                Dismiss
              </button>
            </div>
          ) : result ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Results</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Analysis Type</h3>
                  <p className="mt-1 text-lg font-semibold">
                    {selectedModel === 'flat_foot' ? 'Flat Foot Detection' : 'Hallux Valgus Detection'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Condition Detected</h3>
                  <p className="mt-1 text-lg font-semibold">{result.condition}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Confidence Score</h3>
                  <div className="mt-1 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                      <div
                        style={{ width: `${result.confidence * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="pt-4">
                  <a
                    href="#"
                    className="inline-flex items-center text-blue-600 hover:text-blue-500"
                  >
                    Learn more about {result.condition}
                    <AlertCircle className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-500">Upload an image to see analysis results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for the charts
const monthlyData = [
  { month: 'Jan', flatFoot: 12, normal: 18, halluxValgus: 8 },
  { month: 'Feb', flatFoot: 15, normal: 20, halluxValgus: 10 },
  { month: 'Mar', flatFoot: 10, normal: 22, halluxValgus: 12 },
];

const conditionDistribution = [
  { name: 'Flat Foot', value: 37 },
  { name: 'Normal', value: 60 },
  { name: 'Hallux Valgus', value: 30 },
];

// Model performance metrics
const modelMetrics = {
  flatFoot: {
    accuracy: 0.95,
    precision: 0.93,
    recall: 0.94,
    f1Score: 0.935,
    confusionMatrix: [
      [150, 10],
      [8, 132]
    ]
  },
  halluxValgus: {
    accuracy: 0.92,
    precision: 0.90,
    recall: 0.91,
    f1Score: 0.905,
    confusionMatrix: [
      [145, 15],
      [12, 128]
    ]
  }
};

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b'];

const MetricCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="text-sm font-medium text-gray-500">{label}</div>
    <div className="mt-1 text-2xl font-semibold text-gray-900">{(value * 100).toFixed(1)}%</div>
  </div>
);

const ConfusionMatrix = ({ data, title }: { data: number[][]; title: string }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
    <div className="grid grid-cols-2 gap-2">
      {data.map((row, i) => (
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className={`p-4 rounded-lg text-center ${
              i === j ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="text-lg font-semibold">{cell}</div>
            <div className="text-xs mt-1">
              {i === 0 && j === 0 && 'True Negative'}
              {i === 0 && j === 1 && 'False Positive'}
              {i === 1 && j === 0 && 'False Negative'}
              {i === 1 && j === 1 && 'True Positive'}
            </div>
          </div>
        ))
      ))}
    </div>
  </div>
);

const Results = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Analysis Trends */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Analysis Trends</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="flatFoot" name="Flat Foot" fill="#3b82f6" />
                <Bar dataKey="normal" name="Normal" fill="#22c55e" />
                <Bar dataKey="halluxValgus" name="Hallux Valgus" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Condition Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Condition Distribution</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conditionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conditionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Flat Foot Model Performance */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Flat Foot Detection Model</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <MetricCard label="Accuracy" value={modelMetrics.flatFoot.accuracy} />
            <MetricCard label="Precision" value={modelMetrics.flatFoot.precision} />
            <MetricCard label="Recall" value={modelMetrics.flatFoot.recall} />
            <MetricCard label="F1 Score" value={modelMetrics.flatFoot.f1Score} />
          </div>
          <ConfusionMatrix 
            data={modelMetrics.flatFoot.confusionMatrix} 
            title="Confusion Matrix"
          />
        </div>

        {/* Hallux Valgus Model Performance */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hallux Valgus Detection Model</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <MetricCard label="Accuracy" value={modelMetrics.halluxValgus.accuracy} />
            <MetricCard label="Precision" value={modelMetrics.halluxValgus.precision} />
            <MetricCard label="Recall" value={modelMetrics.halluxValgus.recall} />
            <MetricCard label="F1 Score" value={modelMetrics.halluxValgus.f1Score} />
          </div>
          <ConfusionMatrix 
            data={modelMetrics.halluxValgus.confusionMatrix} 
            title="Confusion Matrix"
          />
        </div>
      </div>
    </div>
  );
};

export default Results;
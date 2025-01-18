import React from 'react';
import { ProductionOutputs, ReverseOutputs } from '../types/api';
import { TrendingUp, Battery, DollarSign, Leaf } from 'lucide-react';

interface Props {
  data: ProductionOutputs | ReverseOutputs | null;
  type: 'production' | 'reverse';
}

export function Results({ data, type }: Props) {
  if (!data) return null;

  if (type === 'production') {
    const output = data as ProductionOutputs;
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Production Analysis Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-medium">Production</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {output.hydrogenProduction.toFixed(2)} kg/day
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Battery className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-medium">Efficiency</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {output.fuelCellEfficiency.toFixed(1)}%
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-yellow-600 mr-2" />
              <h4 className="font-medium">Cost per kg</h4>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              ${output.costPerKg.toFixed(2)}
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Leaf className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-medium">CO2 Emissions</h4>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {output.co2Emissions.toFixed(2)} kg/kg H₂
            </p>
          </div>
        </div>
      </div>
    );
  }

  const output = data as ReverseOutputs;
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Required Parameters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Recommended Setup</h4>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-600">Region:</span>
              <span className="font-medium">{output.recommendedRegion}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Energy Source:</span>
              <span className="font-medium">{output.recommendedEnergySource}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Required Capacity:</span>
              <span className="font-medium">{output.requiredCapacity.toFixed(2)} kg/day</span>
            </li>
          </ul>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Financial Analysis</h4>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-600">Investment:</span>
              <span className="font-medium">${output.estimatedInvestment.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Payback Period:</span>
              <span className="font-medium">{output.paybackPeriod.toFixed(1)} years</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Sustainability Score:</span>
              <span className="font-medium">{output.sustainabilityScore.toFixed(1)}/10</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
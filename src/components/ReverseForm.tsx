import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ReverseInputs } from '../types/api';

interface Props {
  onSubmit: (inputs: ReverseInputs) => void;
  isLoading: boolean;
}

export function ReverseForm({ onSubmit, isLoading }: Props) {
  const [inputs, setInputs] = React.useState<ReverseInputs>({
    targetProduction: 0,
    targetEfficiency: 0,
    targetCostPerKg: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target Production (kg/day)
          </label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={inputs.targetProduction}
            onChange={(e) =>
              setInputs({ ...inputs, targetProduction: parseFloat(e.target.value) })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target Efficiency (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={inputs.targetEfficiency}
            onChange={(e) =>
              setInputs({ ...inputs, targetEfficiency: parseFloat(e.target.value) })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target Cost per kg ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={inputs.targetCostPerKg}
            onChange={(e) =>
              setInputs({ ...inputs, targetCostPerKg: parseFloat(e.target.value) })
            }
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            'Calculating...'
          ) : (
            <>
              Calculate Requirements <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
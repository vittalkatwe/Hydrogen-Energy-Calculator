import React from 'react';
import { ArrowRight, Wind, Sun, Power, Factory } from 'lucide-react';
import { ProductionInputs } from '../types/api';

interface Props {
  onSubmit: (inputs: ProductionInputs) => void;
  isLoading: boolean;
}

export function ProductionForm({ onSubmit, isLoading }: Props) {
  const [inputs, setInputs] = React.useState<ProductionInputs>({
    region: '',
    rawMaterialCost: 0,
    energySource: 'solar',
    productionCapacity: 0,
    temperature: 25,
    pressure: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={inputs.region}
            onChange={(e) => setInputs({ ...inputs, region: e.target.value })}
            required
          >
            <option value="">Select Region</option>
            <option value="north_america">North America</option>
            <option value="europe">Europe</option>
            <option value="asia_pacific">Asia Pacific</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Energy Source</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`flex items-center justify-center p-3 rounded-lg border ${
                inputs.energySource === 'solar'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300'
              }`}
              onClick={() => setInputs({ ...inputs, energySource: 'solar' })}
            >
              <Sun className="w-5 h-5 mr-2" />
              Solar
            </button>
            <button
              type="button"
              className={`flex items-center justify-center p-3 rounded-lg border ${
                inputs.energySource === 'wind'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300'
              }`}
              onClick={() => setInputs({ ...inputs, energySource: 'wind' })}
            >
              <Wind className="w-5 h-5 mr-2" />
              Wind
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Raw Material Cost ($/unit)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={inputs.rawMaterialCost}
            onChange={(e) =>
              setInputs({ ...inputs, rawMaterialCost: parseFloat(e.target.value) })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Production Capacity (kg/day)
          </label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={inputs.productionCapacity}
            onChange={(e) =>
              setInputs({ ...inputs, productionCapacity: parseFloat(e.target.value) })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Temperature (°C)
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={inputs.temperature}
            onChange={(e) =>
              setInputs({ ...inputs, temperature: parseFloat(e.target.value) })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pressure (bar)
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={inputs.pressure}
            onChange={(e) =>
              setInputs({ ...inputs, pressure: parseFloat(e.target.value) })
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
              Calculate <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
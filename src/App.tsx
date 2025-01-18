import React, { useState } from 'react';
import { Beaker, ArrowLeftRight } from 'lucide-react';
import { ProductionForm } from './components/ProductionForm';
import { ReverseForm } from './components/ReverseForm';
import { Results } from './components/Results';
import { apiClient } from './api/client';
import { ProductionInputs, ProductionOutputs, ReverseInputs, ReverseOutputs } from './types/api';

function App() {
  const [mode, setMode] = useState<'production' | 'reverse'>('production');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProductionOutputs | ReverseOutputs | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProductionSubmit = async (inputs: ProductionInputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.predictProduction(inputs);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReverseSubmit = async (inputs: ReverseInputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.reverseCalculate(inputs);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hydrogen Energy Production Calculator
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`flex-1 py-4 px-6 text-center ${
                  mode === 'production'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setMode('production')}
              >
                <Beaker className="h-5 w-5 inline-block mr-2" />
                Production Analysis
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center ${
                  mode === 'reverse'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setMode('reverse')}
              >
                <ArrowLeftRight className="h-5 w-5 inline-block mr-2" />
                Reverse Calculation
              </button>
            </div>
          </div>

          <div className="p-6">
            {mode === 'production' ? (
              <ProductionForm onSubmit={handleProductionSubmit} isLoading={isLoading} />
            ) : (
              <ReverseForm onSubmit={handleReverseSubmit} isLoading={isLoading} />
            )}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {results && <Results data={results} type={mode} />}
      </div>
    </div>
  );
}

export default App;
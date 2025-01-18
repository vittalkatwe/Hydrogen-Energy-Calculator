import { ProductionInputs, ProductionOutputs, ReverseInputs, ReverseOutputs } from '../types/api';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API Error');
    }

    return response.json();
  }

  async predictProduction(inputs: ProductionInputs): Promise<ProductionOutputs> {
    return this.request<ProductionOutputs>('/predict', {
      method: 'POST',
      body: JSON.stringify(inputs),
    });
  }

  async reverseCalculate(inputs: ReverseInputs): Promise<ReverseOutputs> {
    return this.request<ReverseOutputs>('/reverse', {
      method: 'POST',
      body: JSON.stringify(inputs),
    });
  }

  async getRegions(): Promise<string[]> {
    return this.request<string[]>('/regions');
  }
}

export const apiClient = new ApiClient();
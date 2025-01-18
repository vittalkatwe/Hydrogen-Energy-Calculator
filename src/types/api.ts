export interface ProductionInputs {
  region: string;
  rawMaterialCost: number;
  energySource: 'solar' | 'wind' | 'grid' | 'hybrid';
  productionCapacity: number;
  temperature: number;
  pressure: number;
}

export interface ProductionOutputs {
  hydrogenProduction: number; // kg/day
  fuelCellEfficiency: number; // percentage
  costPerKg: number;
  co2Emissions: number; // kg CO2/kg H2
}

export interface ReverseInputs {
  targetProduction: number; // kg/day
  targetEfficiency: number; // percentage
  targetCostPerKg: number;
}

export interface ReverseOutputs {
  recommendedRegion: string;
  recommendedEnergySource: string;
  requiredCapacity: number;
  estimatedInvestment: number;
  paybackPeriod: number;
  sustainabilityScore: number;
}
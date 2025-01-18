import express from 'express';
import cors from 'cors';
import { z } from 'zod';

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Input validation schemas
const ProductionInputSchema = z.object({
  region: z.string(),
  rawMaterialCost: z.number().positive(),
  energySource: z.enum(['solar', 'wind', 'grid', 'hybrid']),
  productionCapacity: z.number().positive(),
  temperature: z.number(),
  pressure: z.number().positive()
});

const ReverseInputSchema = z.object({
  targetProduction: z.number().positive(),
  targetEfficiency: z.number().min(0).max(100),
  targetCostPerKg: z.number().positive()
});

// Constants for efficiency calculations
const FARADAY_CONSTANT = 96485.3321233100184; // Coulombs per mole
const STANDARD_POTENTIAL = 1.23; // V
const GAS_CONSTANT = 8.3144598; // J/(mol·K)
const WATER_FORMATION_ENTROPY = 163.2; // J/(mol·K)

function calculateEfficiency(temperature, pressure, energySource) {
  // Convert temperature to Kelvin
  const tempK = temperature + 273.15;
  
  // Calculate Nernst potential (theoretical cell voltage)
  const nernstPotential = STANDARD_POTENTIAL - 
    (GAS_CONSTANT * tempK * Math.log(pressure)) / (4 * FARADAY_CONSTANT) +
    (WATER_FORMATION_ENTROPY * (tempK - 298.15)) / (2 * FARADAY_CONSTANT);
  
  // Calculate thermoneutral voltage (total energy requirement)
  const thermoneutralVoltage = 1.48; // V at standard conditions
  
  // Energy source efficiency factors
  const sourceEfficiency = {
    solar: 0.85,
    wind: 0.80,
    grid: 0.95,
    hybrid: 0.90
  };
  
  // System losses (activation, ohmic, and mass transport)
  const systemLosses = 0.3 + (Math.abs(temperature - 80) * 0.002); // Optimal temp around 80°C
  const pressureLoss = Math.log10(pressure) * 0.05;
  
  // Calculate actual operating voltage
  const operatingVoltage = nernstPotential + systemLosses + pressureLoss;
  
  // Calculate voltage efficiency
  const voltageEfficiency = (thermoneutralVoltage / operatingVoltage) * 100;
  
  // Calculate total system efficiency
  const totalEfficiency = voltageEfficiency * sourceEfficiency[energySource];
  
  // Clamp efficiency between realistic bounds (40-95%)
  return Math.max(40, Math.min(95, totalEfficiency));
}

function simulateProduction(data) {
  const efficiency = calculateEfficiency(data.temperature, data.pressure, data.energySource);
  
  const regionFactors = {
    north_america: 1.1,
    europe: 1.0,
    asia_pacific: 0.9
  };

  // Production calculation based on efficiency
  const theoreticalProduction = data.productionCapacity;
  const actualProduction = theoreticalProduction * (efficiency / 100) * regionFactors[data.region];
  
  // Cost calculation considering efficiency
  const energyCost = (1 / efficiency) * 50; // Base energy cost per kg
  const costPerKg = (data.rawMaterialCost * 1.5) + 
                   (data.pressure * 0.1) + 
                   energyCost + 
                   (Math.abs(data.temperature - 80) * 0.05); // 80°C is optimal
  
  // CO2 emissions based on energy source and efficiency
  const baseEmissions = {
    solar: 1.5,
    wind: 1.8,
    grid: 10.5,
    hybrid: 4.2
  };
  
  const co2Emissions = baseEmissions[data.energySource] * (100 / efficiency);

  return {
    hydrogenProduction: actualProduction,
    fuelCellEfficiency: efficiency,
    costPerKg: costPerKg,
    co2Emissions: co2Emissions
  };
}

function simulateReverse(data) {
  // Calculate required capacity based on target efficiency
  const requiredCapacity = data.targetProduction / (data.targetEfficiency / 100);
  
  // Choose energy source based on efficiency target
  const recommendedEnergySource = data.targetEfficiency > 80 ? 'solar' : 
                                 data.targetEfficiency > 75 ? 'hybrid' : 
                                 data.targetEfficiency > 70 ? 'wind' : 'grid';
  
  // Choose region based on cost target
  const recommendedRegion = data.targetCostPerKg < 4 ? 'asia_pacific' : 
                          data.targetCostPerKg < 6 ? 'europe' : 'north_america';
  
  // Calculate investment based on capacity and efficiency
  const baseInvestment = requiredCapacity * 1000;
  const efficiencyFactor = Math.pow(data.targetEfficiency / 70, 2); // Higher efficiency requires more investment
  const estimatedInvestment = baseInvestment * efficiencyFactor;
  
  // Calculate payback period considering efficiency and production
  const annualProduction = data.targetProduction * 365;
  const annualRevenue = annualProduction * data.targetCostPerKg;
  const paybackPeriod = estimatedInvestment / annualRevenue;
  
  // Calculate sustainability score based on energy source and efficiency
  const sustainabilityBase = {
    solar: 9.5,
    hybrid: 8.5,
    wind: 9.0,
    grid: 5.0
  };
  const efficiencyBonus = (data.targetEfficiency - 70) / 10; // Bonus points for high efficiency
  const sustainabilityScore = Math.min(10, sustainabilityBase[recommendedEnergySource] + efficiencyBonus);

  return {
    recommendedRegion,
    recommendedEnergySource,
    requiredCapacity,
    estimatedInvestment,
    paybackPeriod,
    sustainabilityScore
  };
}

// API endpoints
app.post('/api/predict', (req, res) => {
  try {
    const input = ProductionInputSchema.parse(req.body);
    const result = simulateProduction(input);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/reverse', (req, res) => {
  try {
    const input = ReverseInputSchema.parse(req.body);
    const result = simulateReverse(input);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/regions', (req, res) => {
  res.json(['north_america', 'europe', 'asia_pacific']);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
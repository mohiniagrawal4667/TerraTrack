/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CarbonFormInput, CarbonFootprintResult, FuelType, HeatingType, DietType, RecyclingLevel } from '../types/carbon';

// --- Pure EMISSION FACTORS (kg CO2e per unit) ---

export const FACTORS = {
  // Transport (per km)
  transport: {
    petrol: 0.17,      // Petrol car average
    diesel: 0.16,      // Diesel car average
    hybrid: 0.09,      // Hybrid car
    electric: 0.04,    // Electric grid charged
    publicTransit: 0.03, // Mixed bus & train average
    flightHour: 90.0,   // Standard commercial jet per hr
  },
  // Electricity & Heating (per kWh)
  energy: {
    electricityGrid: 0.38, // Global average carbon intensity
    natural_gas: 0.18,
    heating_oil: 0.25,
    electricity: 0.12,     // Assuming clean/heat pump average
    biomass: 0.02,         // Low emission offset biogenic
  },
  // Food baseline footprints (monthly average kg CO2e)
  foodDietBase: {
    heavy_meat: 250.0,
    medium_meat: 180.0,
    vegetarian_poultry: 120.0,
    vegetarian: 90.0,
    vegan: 50.0,
  },
  // Waste baseline factors
  waste: {
    perBagKgCO2e: 12.0,    // CO2e decomposition equivalent in landfill per standard bag
    compostingCredit: -6.0, // Composting organic waste saving per month
  }
};

/**
 * Calculates carbon footprint for Transport.
 * All units are evaluated per month.
 */
export function calculateTransportEmissions(carDistance: number, fuelType: FuelType, transitDistance: number, flightHours: number): number {
  const carEmissions = carDistance * FACTORS.transport[fuelType];
  const transitEmissions = transitDistance * FACTORS.transport.publicTransit;
  const flightEmissions = flightHours * FACTORS.transport.flightHour;
  return Number((carEmissions + transitEmissions + flightEmissions).toFixed(1));
}

/**
 * Calculates carbon footprint for Electricity and Heating.
 */
export function calculateEnergyEmissions(electricityUsage: number, heatingType: HeatingType, heatingUsage: number): number {
  const electricityEmissions = electricityUsage * FACTORS.energy.electricityGrid;
  const heatingEmissions = heatingUsage * FACTORS.energy[heatingType];
  return Number((electricityEmissions + heatingEmissions).toFixed(1));
}

/**
 * Calculates carbon footprint for Food consumption, considering diet, locality, and waste.
 */
export function calculateFoodEmissions(dietType: DietType, foodWastePct: number, localFoodPct: number): number {
  const base = FACTORS.foodDietBase[dietType];
  // More waste increases carbon impact footprint (adds up to 25% of baseline)
  const wasteUpcharge = base * (foodWastePct / 100) * 0.25;
  // Local sourcing cuts down transport footprint (saves up to 10% of baseline)
  const localSavings = base * (localFoodPct / 100) * 0.10;
  
  return Number(Math.max(10, base + wasteUpcharge - localSavings).toFixed(1));
}

/**
 * Calculates carbon footprint for Household Waste.
 */
export function calculateWasteEmissions(wasteBags: number, recyclingLevel: RecyclingLevel, compostsOrganics: boolean): number {
  const baseWaste = wasteBags * FACTORS.waste.perBagKgCO2e;
  
  // Recycling reduces landfill carbon footprint
  let recyclingMultiplier = 1.0;
  if (recyclingLevel === 'some') {
    recyclingMultiplier = 0.75; // 25% reduction
  } else if (recyclingLevel === 'all') {
    recyclingMultiplier = 0.40; // 60% reduction
  }
  
  const netWaste = baseWaste * recyclingMultiplier;
  const compostCredit = compostsOrganics ? FACTORS.waste.compostingCredit : 0;
  
  return Number(Math.max(0, netWaste + compostCredit).toFixed(1));
}

/**
 * Main orchestrator of the global calculations. Safe and side-effect free.
 */
export function calculateCarbonFootprint(data: CarbonFormInput): CarbonFootprintResult {
  const transport = calculateTransportEmissions(
    data.carDistance,
    data.fuelType,
    data.transitDistance,
    data.flightHours
  );

  const electricity = calculateEnergyEmissions(
    data.electricityUsage,
    data.heatingType,
    data.heatingUsage
  );

  const food = calculateFoodEmissions(
    data.dietType,
    data.foodWastePct,
    data.localFoodPct
  );

  const waste = calculateWasteEmissions(
    data.wasteBags,
    data.recyclingLevel,
    data.compostsOrganics
  );

  const total = Number((transport + electricity + food + waste).toFixed(1));

  return {
    transport,
    electricity,
    food,
    waste,
    total,
  };
}

/**
 * Returns helper metrics comparing footprint to national averages.
 * average monthly footprint is roughly ~1,200 kg CO2e in Western countries.
 * Target safe carbon budget is ~150 kg CO2e.
 */
export function getComparativeAnalysis(totalEmissions: number) {
  const averageMonthly = 1100; // Average monthly kg CO2e per person in Western countries
  const targetMonthly = 160;   // Target monthly threshold to contain temperature changes under 1.5C

  const percentageOfAverage = Math.round((totalEmissions / averageMonthly) * 100);
  const multipleOfTarget = Number((totalEmissions / targetMonthly).toFixed(1));

  let rating: 'Excellent' | 'Good' | 'Average' | 'High' = 'Average';
  let ratingColor = 'text-amber-600 bg-amber-50 border-amber-100';

  if (totalEmissions <= targetMonthly) {
    rating = 'Excellent';
    ratingColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';
  } else if (totalEmissions <= averageMonthly * 0.6) {
    rating = 'Good';
    ratingColor = 'text-teal-700 bg-teal-50 border-teal-100';
  } else if (totalEmissions > averageMonthly) {
    rating = 'High';
    ratingColor = 'text-rose-700 bg-rose-50 border-rose-100';
  }

  return {
    percentageOfAverage,
    multipleOfTarget,
    rating,
    ratingColor,
    averageMonthly,
    targetMonthly
  };
}

export interface RecommendationItem {
  id: string;
  text: string;
  impactLevel: 'High' | 'Medium' | 'Low';
}

export function getRecommendations(result: CarbonFootprintResult): {
  category: string;
  items: RecommendationItem[];
} {
  const categories = [
    { key: 'transport', name: 'Transport', value: result.transport },
    { key: 'electricity', name: 'Electricity', value: result.electricity },
    { key: 'food', name: 'Food', value: result.food },
    { key: 'waste', name: 'Waste', value: result.waste }
  ];

  // Determine top contributing category for smart mitigation advice
  const highest = [...categories].sort((a, b) => b.value - a.value)[0];

  let items: RecommendationItem[] = [];

  switch (highest.key) {
    case 'transport':
      items = [
        { id: 't1', text: 'Use public transport once a week.', impactLevel: 'High' },
        { id: 't2', text: 'Consider carpooling or ride-sharing to work to split emission footprint with fellow commuters.', impactLevel: 'High' },
        { id: 't3', text: 'Replace medium-distance car trips with biking or walking where safe and practical.', impactLevel: 'Medium' },
        { id: 't4', text: 'When planning travel, prioritize direct flights over multi-stop trips or opt for high-speed rail.', impactLevel: 'Medium' }
      ];
      break;
    case 'electricity':
      items = [
        { id: 'e1', text: 'Turn off unused appliances.', impactLevel: 'High' },
        { id: 'e2', text: 'Upgrade to eco-LED lightbulbs which consume up to eighty-five percent less energy.', impactLevel: 'Medium' },
        { id: 'e3', text: 'Adjust your thermostat by just one or two degrees to significantly trim seasonal heating power load.', impactLevel: 'High' },
        { id: 'e4', text: 'Unplug chargers and idle electronics to eliminate continuous standby phantom power drain.', impactLevel: 'Low' }
      ];
      break;
    case 'food':
      items = [
        { id: 'f1', text: 'Reduce food waste and choose local produce.', impactLevel: 'High' },
        { id: 'f2', text: 'Incorporate more plant-based proteins such as legumes or tofu to offset high-emission meat consumption.', impactLevel: 'High' },
        { id: 'f3', text: 'Plan weekly meals in advance to prevent perishable ingredients from spoiling in store.', impactLevel: 'Medium' },
        { id: 'f4', text: 'Support local farming associations and focus on buying seasonal native crops.', impactLevel: 'Medium' }
      ];
      break;
    case 'waste':
    default:
      items = [
        { id: 'w1', text: 'Separate recyclables and compost organic waste.', impactLevel: 'High' },
        { id: 'w2', text: 'Avoid single-use checkout packaging by carrying durable reusable shopping bags.', impactLevel: 'Medium' },
        { id: 'w3', text: 'Divert food preparation trimmings and raw vegetable skins to a garden heap or compost bin.', impactLevel: 'High' },
        { id: 'w4', text: 'Choose goods with minimal or fully biodegradable cardboard/paper packaging wraps.', impactLevel: 'Medium' }
      ];
      break;
  }

  return {
    category: highest.name,
    items
  };
}

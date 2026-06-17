// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { CarbonFormSchema, CarbonFormInput } from '../types/carbon';
import {
  calculateCarbonFootprint,
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateFoodEmissions,
  calculateWasteEmissions,
  getRecommendations
} from '../lib/carbonCalculations';

describe('Aesthetic Carbon Footprint Edge Cases Suite', () => {
  describe('Zero Values Support', () => {
    it('calculates zero carbon outputs correctly when all input metrics are zero', () => {
      const zeroInput: CarbonFormInput = {
        carDistance: 0,
        fuelType: 'electric',
        transitDistance: 0,
        flightHours: 0,
        electricityUsage: 0,
        heatingType: 'biomass',
        heatingUsage: 0,
        dietType: 'vegan',
        foodWastePct: 0,
        localFoodPct: 0,
        wasteBags: 0,
        recyclingLevel: 'all',
        compostsOrganics: true
      };

      const result = calculateCarbonFootprint(zeroInput);
      expect(result.transport).toBe(0);
      expect(result.electricity).toBe(0);
      // Food baseline for vegan diet is 50. With 0% localFoodPct, savings is 0. With 0% food waste, upcharge is 0.
      expect(result.food).toBe(50);
      expect(result.waste).toBe(0); 
      expect(result.total).toBe(50);
    });
  });

  describe('Negative Values Handling', () => {
    it('rejects negative values in the Zod form validation schema', () => {
      const negativeInput = {
        carDistance: -5,
        fuelType: 'hybrid',
        transitDistance: 0,
        flightHours: 0,
        electricityUsage: -100,
        heatingType: 'electricity',
        heatingUsage: 0,
        dietType: 'vegan',
        foodWastePct: -10,
        localFoodPct: 0,
        wasteBags: 0,
        recyclingLevel: 'none',
        compostsOrganics: false
      };

      const parsed = CarbonFormSchema.safeParse(negativeInput);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues.map(i => i.path[0])).toContain('carDistance');
        expect(parsed.error.issues.map(i => i.path[0])).toContain('electricityUsage');
        expect(parsed.error.issues.map(i => i.path[0])).toContain('foodWastePct');
      }
    });

    it('enforces logical emission boundaries in pure calculator math functions even if negative inputs bypass validation', () => {
      // Waste emissions are floored to >= 0 by design (e.g. if composting credit exceeds negative waste bags)
      const wasteResult = calculateWasteEmissions(-2, 'all', true);
      expect(wasteResult).toBe(0); // Max(0, negative_value - 6) = 0

      // Food emissions are floored to >= 10 by design (base 50 - extreme savings of 50*10 = 500)
      const foodResult = calculateFoodEmissions('vegan', 0, 1000);
      expect(foodResult).toBe(10);
    });
  });

  describe('Decimal Values Support', () => {
    it('correctly accommodates floating and decimal input quantities and outputs standard fixed-point decimals', () => {
      // carDistance = 12.34 km with factor 0.17 -> 2.0978
      // transitDistance = 45.67 km with factor 0.03 -> 1.3701
      // flightHours = 0.5 hours with factor 90.0 -> 45.0
      // Sum = 48.4679 -> Round to 48.5
      const transportResult = calculateTransportEmissions(12.34, 'petrol', 45.67, 0.5);
      expect(transportResult).toBe(48.5);
    });
  });

  describe('Large Numbers Boundaries', () => {
    it('restricts values exceeding established safety guidelines in schema validation', () => {
      const giantInput = {
        carDistance: 1000000, // too big
        fuelType: 'petrol',
        transitDistance: 10000,
        flightHours: 500, // too big
        electricityUsage: 45000, // too big
        heatingType: 'natural_gas',
        heatingUsage: 150,
        dietType: 'vegetarian',
        foodWastePct: 15,
        localFoodPct: 40,
        wasteBags: 3,
        recyclingLevel: 'some',
        compostsOrganics: true
      };

      const parsed = CarbonFormSchema.safeParse(giantInput);
      expect(parsed.success).toBe(false);
    });

    it('handles giant numbers programmatically without crashing our system calculations', () => {
      const giantResult = calculateTransportEmissions(100000000, 'diesel', 100000000, 1000000);
      expect(Number.isFinite(giantResult)).toBe(true);
      expect(giantResult).toBeGreaterThan(0);
    });
  });

  describe('NaN and Infinity Support', () => {
    it('rejects entries of NaN, non-numeric values or strings representing NaN in schema parser', () => {
      const nanInput = {
        carDistance: NaN,
        fuelType: 'electric',
        transitDistance: 120,
        flightHours: 5,
        electricityUsage: 350,
        heatingType: 'natural_gas',
        heatingUsage: 150,
        dietType: 'vegetarian',
        foodWastePct: 15,
        localFoodPct: 40,
        wasteBags: 3,
        recyclingLevel: 'some',
        compostsOrganics: true
      };

      const parsed = CarbonFormSchema.safeParse(nanInput);
      expect(parsed.success).toBe(false);
    });

    it('rejects Infinity inputs via schema validation', () => {
      const infinityInput = {
        carDistance: Infinity,
        fuelType: 'electric',
        transitDistance: 120,
        flightHours: 5,
        electricityUsage: 350,
        heatingType: 'natural_gas',
        heatingUsage: 150,
        dietType: 'vegetarian',
        foodWastePct: 15,
        localFoodPct: 40,
        wasteBags: 3,
        recyclingLevel: 'some',
        compostsOrganics: true
      };

      const parsed = CarbonFormSchema.safeParse(infinityInput);
      expect(parsed.success).toBe(false);
    });
  });

  describe('Corrupted LocalStorage & Missing Keys & Empty Inputs', () => {
    it('rejects a completely empty object or non-matching inputs in form validators', () => {
      const parsed = CarbonFormSchema.safeParse({});
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('ensures category sorting selects gracefully with equal category contributions', () => {
      const result = getRecommendations({
        transport: 100,
        electricity: 100,
        food: 100,
        waste: 100,
        total: 400
      });

      // Priority should fallback to the stable initial configuration order, usually "Transport"
      expect(result.category).toBe('Transport');
    });
  });
});

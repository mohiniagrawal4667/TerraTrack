import { describe, it, expect } from 'vitest';
import {
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateFoodEmissions,
  calculateWasteEmissions,
  calculateCarbonFootprint,
  getComparativeAnalysis
} from '../lib/carbonCalculations';
import { CarbonFormInput } from '../types/carbon';

describe('Carbon Calculator Functions', () => {
  describe('calculateTransportEmissions', () => {
    it('calculates average petrol car distances emissions correctly', () => {
      // Petrol factor is 0.17 / km, transit is 0.03 / km, flight is 90.0 / hr
      // 100 * 0.17 + 50 * 0.03 + 2 * 90 = 17 + 1.5 + 180 = 198.5
      const result = calculateTransportEmissions(100, 'petrol', 50, 2);
      expect(result).toBe(198.5);
    });

    it('handles electric cars with clean energy lower factors', () => {
      // Electric factor is 0.04
      // 200 * 0.04 + 0 * 0.03 + 0 = 8.0
      const result = calculateTransportEmissions(200, 'electric', 0, 0);
      expect(result).toBe(8);
    });

    it('returns zero when all transport distances and hours are zero', () => {
      const result = calculateTransportEmissions(0, 'diesel', 0, 0);
      expect(result).toBe(0);
    });

    it('calculates hybrid cars emissions correctly', () => {
      // Hybrid factor is 0.09
      // 100 * 0.09 = 9
      const result = calculateTransportEmissions(100, 'hybrid', 0, 0);
      expect(result).toBe(9);
    });
  });

  describe('calculateEnergyEmissions', () => {
    it('calculates utility emissions with natural gas correctly', () => {
      // electricityGrid is 0.38, natural_gas is 0.18
      // 100 * 0.38 + 200 * 0.18 = 38 + 36 = 74
      const result = calculateEnergyEmissions(100, 'natural_gas', 200);
      expect(result).toBe(74);
    });

    it('calculates utility emissions with heating oil correctly', () => {
      // heating_oil is 0.25
      // 100 * 0.38 + 200 * 0.25 = 38 + 50 = 88
      const result = calculateEnergyEmissions(100, 'heating_oil', 200);
      expect(result).toBe(88);
    });

    it('calculates utility emissions with biomass correctly', () => {
      // biomass is 0.02
      // 150 * 0.38 + 300 * 0.02 = 57 + 6 = 63
      const result = calculateEnergyEmissions(150, 'biomass', 300);
      expect(result).toBe(63);
    });
  });

  describe('calculateFoodEmissions', () => {
    it('calculates emissions for heavy meat diet with waste and local percentages', () => {
      // heavy_meat base = 250
      // wasteUpcharge = 250 * 0.20 * 0.25 = 12.5
      // localSavings = 250 * 0.40 * 0.10 = 10
      // Expected = 250 + 12.5 - 10 = 252.5
      const result = calculateFoodEmissions('heavy_meat', 20, 40);
      expect(result).toBe(252.5);
    });

    it('calculates emissions for vegan diet with optimal local food and zero waste', () => {
      // vegan base = 50
      // wasteUpcharge = 50 * 0 = 0
      // localSavings = 50 * 1.00 * 0.10 = 5
      // Expected = 50 + 0 - 5 = 45
      const result = calculateFoodEmissions('vegan', 0, 100);
      expect(result).toBe(45);
    });

    it('enforces a floor of 10 if savings exceed base + waste', () => {
      // vegetarian base = 90
      // expected floor should keep it at or above 10
      const result = calculateFoodEmissions('vegetarian', 0, 1000); // extreme savings
      expect(result).toBeGreaterThanOrEqual(10);
    });
  });

  describe('calculateWasteEmissions', () => {
    it('calculates waste emissions for no recycling and no composting', () => {
      // wasteBags = 4, perBagKgCO2e = 12, recyclingMultiplier = 1.0
      // Expected = 48
      const result = calculateWasteEmissions(4, 'none', false);
      expect(result).toBe(48);
    });

    it('calculates waste emissions with all recycled and active composting credit', () => {
      // wasteBags = 2, perBagKgCO2e = 12, recyclingMultiplier = 0.40 (all recycled)
      // netWaste = 24 * 0.40 = 9.6
      // compostingCredit = -6.0
      // Expected = 9.6 - 6.0 = 3.6
      const result = calculateWasteEmissions(2, 'all', true);
      expect(result).toBe(3.6);
    });

    it('enforces a floor of 0 if composting credit exceeds waste footprint', () => {
      // wasteBags = 0, recyclingMultiplier = 0.75, compostingCredit = -6
      // Expected = Max(0, 0 - 6) = 0
      const result = calculateWasteEmissions(0, 'some', true);
      expect(result).toBe(0);
    });
  });

  describe('calculateCarbonFootprint orchestrator', () => {
    it('coordinates sub-calculations to return correct combined result object', () => {
      const mockInput: CarbonFormInput = {
        carDistance: 100,
        fuelType: 'hybrid',
        transitDistance: 100,
        flightHours: 1,
        electricityUsage: 100,
        heatingType: 'electricity',
        heatingUsage: 100,
        dietType: 'vegetarian',
        foodWastePct: 10,
        localFoodPct: 50,
        wasteBags: 3,
        recyclingLevel: 'some',
        compostsOrganics: true
      };

      // transport: 100*0.09 + 100*0.03 + 90 = 9 + 3 + 90 = 102
      // electricity: 100*0.38 + 100*0.12 = 38 + 12 = 50
      // food: base 90 + waste (90*0.1*0.25 = 2.25) - local (90*0.5*0.1 = 4.5) = 87.75 -> 87.8
      // waste: 3*12 * 0.75 (some) - 6 (composting) = 27 - 6 = 21
      // total expectation: 102 + 50 + 87.8 + 21 = 260.8
      const output = calculateCarbonFootprint(mockInput);
      expect(output.transport).toBe(102);
      expect(output.electricity).toBe(50);
      expect(output.food).toBe(87.8);
      expect(output.waste).toBe(21);
      expect(output.total).toBe(260.8);
    });
  });

  describe('getComparativeAnalysis', () => {
    it('returns Excellent rating for carbon footprints below target monthly threshold', () => {
      const analysis = getComparativeAnalysis(120); // targetMonthly = 160
      expect(analysis.rating).toBe('Excellent');
      expect(analysis.ratingColor).toContain('emerald');
    });

    it('returns Good rating for carbon footprints within intermediate boundary', () => {
      const analysis = getComparativeAnalysis(500); // < averageMonthly * 0.6 (660)
      expect(analysis.rating).toBe('Good');
      expect(analysis.ratingColor).toContain('teal');
    });

    it('returns Average rating for general medium range footprints', () => {
      const analysis = getComparativeAnalysis(800); // between 660 and 1100
      expect(analysis.rating).toBe('Average');
      expect(analysis.ratingColor).toContain('amber');
    });

    it('returns High rating for footprints exceeding national averages', () => {
      const analysis = getComparativeAnalysis(1300); // > 1100
      expect(analysis.rating).toBe('High');
      expect(analysis.ratingColor).toContain('rose');
    });
  });
});

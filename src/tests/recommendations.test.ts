import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../lib/carbonCalculations';
import { CarbonFootprintResult } from '../types/carbon';

describe('Mitigation Recommendations Engine', () => {
  it('identifies Transport as highest emission source and offers relevant advices', () => {
    const mockResult: CarbonFootprintResult = {
      transport: 500, // Highest
      electricity: 100,
      food: 120,
      waste: 10,
      total: 730
    };

    const recs = getRecommendations(mockResult);
    expect(recs.category).toBe('Transport');
    expect(recs.items).toHaveLength(4);
    expect(recs.items[0].text).toBe('Use public transport once a week.');
    expect(recs.items[0].impactLevel).toBe('High');
  });

  it('identifies Electricity as highest emission source and offers power reduction advices', () => {
    const mockResult: CarbonFootprintResult = {
      transport: 100,
      electricity: 620, // Highest
      food: 80,
      waste: 20,
      total: 820
    };

    const recs = getRecommendations(mockResult);
    expect(recs.category).toBe('Electricity');
    expect(recs.items).toHaveLength(4);
    expect(recs.items).toContainEqual({ id: 'e1', text: 'Turn off unused appliances.', impactLevel: 'High' });
  });

  it('identifies Food as highest emission source and offers dietary reduction advices', () => {
    const mockResult: CarbonFootprintResult = {
      transport: 150,
      electricity: 120,
      food: 320, // Highest
      waste: 15,
      total: 607
    };

    const recs = getRecommendations(mockResult);
    expect(recs.category).toBe('Food');
    expect(recs.items[0].text).toContain('Reduce food waste');
  });

  it('identifies Waste as highest emission source and offers landfill reduction advices', () => {
    const mockResult: CarbonFootprintResult = {
      transport: 50,
      electricity: 40,
      food: 80,
      waste: 120, // Highest
      total: 290
    };

    const recs = getRecommendations(mockResult);
    expect(recs.category).toBe('Waste');
    expect(recs.items[0].text).toContain('Separate recyclables');
  });

  it('handles equal categories gracefully by selecting first in list order (Transport)', () => {
    const mockResult: CarbonFootprintResult = {
      transport: 200,
      electricity: 200,
      food: 200,
      waste: 200,
      total: 800
    };

    const recs = getRecommendations(mockResult);
    // Since transport, electricity, food, and waste are sorted, stable soft order picks Transport first
    expect(recs.category).toBe('Transport');
    expect(recs.items[0].id).toBe('t1');
  });
});

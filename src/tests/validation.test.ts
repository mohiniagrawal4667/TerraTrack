import { describe, it, expect } from 'vitest';
import { CarbonFormSchema } from '../types/carbon';

describe('Carbon Schema Validation Suite', () => {
  const validBaseInput = {
    carDistance: 250,
    fuelType: 'petrol',
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
    compostsOrganics: true,
  };

  it('successfully validates complete, valid user inputs within reasonable boundaries', () => {
    const parsed = CarbonFormSchema.safeParse(validBaseInput);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.carDistance).toBe(250);
      expect(parsed.data.recyclingLevel).toBe('some');
    }
  });

  it('rejects negative values for numeric variables', () => {
    const invalidInput = {
      ...validBaseInput,
      carDistance: -10,
    };
    const parsed = CarbonFormSchema.safeParse(invalidInput);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.find(issue => issue.path.includes('carDistance'))?.message;
      expect(errorMsg).toBe('Distance cannot be negative');
    }
  });

  it('rejects carDistance values above the logical upper threshold', () => {
    const invalidInput = {
      ...validBaseInput,
      carDistance: 35000, // Limit is 20000
    };
    const parsed = CarbonFormSchema.safeParse(invalidInput);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.find(issue => issue.path.includes('carDistance'))?.message;
      expect(errorMsg).toBe('Distance is unusually high');
    }
  });

  it('rejects invalid enum options for fuel type, heating type, etc.', () => {
    const invalidInput = {
      ...validBaseInput,
      fuelType: 'biodiesel_super_heavy', // not in petrol, diesel, hybrid, electric
    };
    const parsed = CarbonFormSchema.safeParse(invalidInput);
    expect(parsed.success).toBe(false);
  });

  it('rejects flight hours that exceed the maximum allowed duration', () => {
    const invalidInput = {
      ...validBaseInput,
      flightHours: 150, // limit is 100
    };
    const parsed = CarbonFormSchema.safeParse(invalidInput);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.find(issue => issue.path.includes('flightHours'))?.message;
      expect(errorMsg).toBe('Hours cannot exceed 100 per month');
    }
  });

  it('rejects diet and waste percentages greater than 100', () => {
    const invalidInput = {
      ...validBaseInput,
      foodWastePct: 105, // limit is 100
    };
    const parsed = CarbonFormSchema.safeParse(invalidInput);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.find(issue => issue.path.includes('foodWastePct'))?.message;
      expect(errorMsg).toBe('Percentage cannot exceed 100');
    }
  });

  it('rejects inputs missing required properties completely', () => {
    const incompleteInput = {
      carDistance: 100,
      fuelType: 'petrol',
    };
    const parsed = CarbonFormSchema.safeParse(incompleteInput);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const missingKeys = parsed.error.issues.map(issue => issue.path[0]);
      expect(missingKeys).toContain('transitDistance');
      expect(missingKeys).toContain('dietType');
      expect(missingKeys).toContain('wasteBags');
    }
  });
});

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

// Zod schemas for validation
export const FuelTypeSchema = z.enum(['petrol', 'diesel', 'hybrid', 'electric']);
export const HeatingTypeSchema = z.enum(['natural_gas', 'heating_oil', 'electricity', 'biomass']);
export const DietTypeSchema = z.enum(['heavy_meat', 'medium_meat', 'vegetarian_poultry', 'vegetarian', 'vegan']);
export const RecyclingLevelSchema = z.enum(['none', 'some', 'all']);

export const CarbonFormSchema = z.object({
  // Transport
  carDistance: z.number({ message: "Must be a valid number" })
    .min(0, "Distance cannot be negative")
    .max(20000, "Distance is unusually high"),
  fuelType: FuelTypeSchema,
  transitDistance: z.number({ message: "Must be a valid number" })
    .min(0, "Distance cannot be negative")
    .max(10000, "Distance is unusually high"),
  flightHours: z.number({ message: "Must be a valid number" })
    .min(0, "Hours cannot be negative")
    .max(100, "Hours cannot exceed 100 per month"),

  // Electricity / Domestic Energy
  electricityUsage: z.number({ message: "Must be a valid number" })
    .min(0, "Usage cannot be negative")
    .max(5000, "Usage is unusually high"),
  heatingType: HeatingTypeSchema,
  heatingUsage: z.number({ message: "Must be a valid number" })
    .min(0, "Heating usage cannot be negative")
    .max(5000, "Heating usage is unusually high"),

  // Food
  dietType: DietTypeSchema,
  foodWastePct: z.number({ message: "Must be a valid number" })
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100"),
  localFoodPct: z.number({ message: "Must be a valid number" })
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100"),

  // Waste
  wasteBags: z.number({ message: "Must be a number" })
    .min(0, "Count cannot be negative")
    .max(50, "Enter a lower count"),
  recyclingLevel: RecyclingLevelSchema,
  compostsOrganics: z.boolean()
});

export type CarbonFormInput = z.infer<typeof CarbonFormSchema>;

export type FuelType = z.infer<typeof FuelTypeSchema>;
export type HeatingType = z.infer<typeof HeatingTypeSchema>;
export type DietType = z.infer<typeof DietTypeSchema>;
export type RecyclingLevel = z.infer<typeof RecyclingLevelSchema>;

export interface CarbonFootprintResult {
  transport: number; // in kg CO2e
  electricity: number; // in kg CO2e
  food: number; // in kg CO2e
  waste: number; // in kg CO2e
  total: number; // in kg CO2e
}

export interface HistoricalFootprintItem {
  id: string;      // Unique item reference
  date: string;    // Human-readable formatted date string or ISO date
  transport: number;
  electricity: number;
  food: number;
  waste: number;
  total: number;
}

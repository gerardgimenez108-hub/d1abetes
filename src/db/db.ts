import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface GlucoseEntry {
  id?: number;
  date: Date;
  value: number; // mg/dL
  type: 'ayunas' | 'preprandial' | 'postprandial' | 'nocturna' | 'otra';
  notes?: string;
  synced?: boolean;
}

export interface MealEntry {
  id?: number;
  date: Date;
  mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack';
  foods: { name: string; amount: number; carbs: number }[];
  totalCarbs: number;
  targetCarbs: number;
  notes?: string;
  synced?: boolean;
}

export interface InsulinEntry {
  id?: number;
  date: Date;
  type: 'basal' | 'bolo_comida' | 'correccion';
  dose: number;
  notes?: string;
  synced?: boolean;
}

export interface FoodItem {
  id?: number;
  name: string;
  carbsPer100g: number;
  servingSize?: number;
  servingUnit?: string;
  category?: string;
  gi?: 'Bajo' | 'Medio' | 'Alto';
}

export interface DailyGoal {
  id?: string; // e.g., 'almuerzo'
  targetCarbs: number;
}

export class DiabetesDB extends Dexie {
  glucose!: Table<GlucoseEntry>;
  meals!: Table<MealEntry>;
  foodCatalog!: Table<FoodItem>;
  goals!: Table<DailyGoal>;
  insulinas!: Table<InsulinEntry>;

  constructor() {
    super('DiabetesDB');
    this.version(2).stores({
      glucose: '++id, date, type, synced',
      meals: '++id, date, mealType, synced',
      foodCatalog: '++id, name, category, gi',
      goals: 'id',
      insulinas: '++id, date, type, synced'
    });
  }
}

export const localDb = new DiabetesDB();

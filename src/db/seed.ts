import { localDb } from './db';
import type { FoodItem } from './db';

const initialFoods: FoodItem[] = [
  { name: 'Arroz blanco cocido', carbsPer100g: 28, servingSize: 150, servingUnit: 'g', category: 'Cereales', gi: 'Alto' },
  { name: 'Quinoa cocida', carbsPer100g: 21, servingSize: 200, servingUnit: 'g', category: 'Cereales', gi: 'Bajo' },
  { name: 'Pan integral', carbsPer100g: 41, servingSize: 40, servingUnit: 'g', category: 'Pan', gi: 'Medio' },
  { name: 'Manzana', carbsPer100g: 14, servingSize: 150, servingUnit: 'g', category: 'Frutas', gi: 'Bajo' },
  { name: 'Plátano', carbsPer100g: 23, servingSize: 120, servingUnit: 'g', category: 'Frutas', gi: 'Alto' },
  { name: 'Pasta cocida', carbsPer100g: 25, servingSize: 150, servingUnit: 'g', category: 'Cereales', gi: 'Medio' },
  { name: 'Lentejas cocidas', carbsPer100g: 20, servingSize: 180, servingUnit: 'g', category: 'Legumbres', gi: 'Bajo' },
  { name: 'Garbanzos cocidos', carbsPer100g: 27, servingSize: 150, servingUnit: 'g', category: 'Legumbres', gi: 'Bajo' },
  { name: 'Patata cocida', carbsPer100g: 17, servingSize: 200, servingUnit: 'g', category: 'Tuberculos', gi: 'Alto' },
  { name: 'Avena (copos)', carbsPer100g: 66, servingSize: 40, servingUnit: 'g', category: 'Cereales', gi: 'Bajo' },
  { name: 'Leche entera', carbsPer100g: 5, servingSize: 250, servingUnit: 'ml', category: 'Lácteos', gi: 'Bajo' },
  { name: 'Yogur natural', carbsPer100g: 4, servingSize: 125, servingUnit: 'g', category: 'Lácteos', gi: 'Bajo' },
  { name: 'Naranja', carbsPer100g: 12, servingSize: 180, servingUnit: 'g', category: 'Frutas', gi: 'Bajo' },
  { name: 'Arándanos', carbsPer100g: 14, servingSize: 100, servingUnit: 'g', category: 'Frutas', gi: 'Bajo' },
  { name: 'Zumo de naranja', carbsPer100g: 10, servingSize: 200, servingUnit: 'ml', category: 'Bebidas', gi: 'Alto' },
  { name: 'Azúcar blanca', carbsPer100g: 100, servingSize: 10, servingUnit: 'g', category: 'Dulces', gi: 'Alto' },
  { name: 'Miel', carbsPer100g: 82, servingSize: 20, servingUnit: 'g', category: 'Dulces', gi: 'Alto' },
  { name: 'Cuscús cocido', carbsPer100g: 23, servingSize: 150, servingUnit: 'g', category: 'Cereales', gi: 'Medio' },
  { name: 'Guisantes cocidos', carbsPer100g: 14, servingSize: 120, servingUnit: 'g', category: 'Legumbres', gi: 'Bajo' },
  { name: 'Brócoli', carbsPer100g: 7, servingSize: 200, servingUnit: 'g', category: 'Verduras', gi: 'Bajo' },
  { name: 'Zanahoria cruda', carbsPer100g: 10, servingSize: 100, servingUnit: 'g', category: 'Verduras', gi: 'Bajo' },
  { name: 'Judías verdes', carbsPer100g: 7, servingSize: 150, servingUnit: 'g', category: 'Verduras', gi: 'Bajo' },
  { name: 'Tortilla de maíz', carbsPer100g: 45, servingSize: 30, servingUnit: 'g', category: 'Pan', gi: 'Alto' },
  { name: 'Galletas María', carbsPer100g: 70, servingSize: 30, servingUnit: 'g', category: 'Dulces', gi: 'Alto' },
  { name: 'Chocolate negro (>70%)', carbsPer100g: 35, servingSize: 20, servingUnit: 'g', category: 'Dulces', gi: 'Bajo' }
];

export const seedDatabase = async () => {
  const count = await localDb.foodCatalog.count();
  if (count === 0) {
    await localDb.foodCatalog.bulkAdd(initialFoods);
    
    // Initial goals
    await localDb.goals.bulkAdd([
      { id: 'desayuno', targetCarbs: 40 },
      { id: 'almuerzo', targetCarbs: 60 },
      { id: 'cena', targetCarbs: 50 },
      { id: 'snack', targetCarbs: 15 }
    ]);
  }
};

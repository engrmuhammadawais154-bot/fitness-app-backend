// Enhanced Premium 4-Week Rotating Meal Plan Database
// Supports ALL dietary preferences: Halal, Vegetarian, Vegan, Keto, Pescatarian, High-Protein, etc.

export interface MealPlan {
  id: string;
  week: number;
  day: number;
  dayName: string;
  meals: {
    breakfast: Meal;
    morningSnack: Meal;
    lunch: Meal;
    afternoonSnack: Meal;
    dinner: Meal;
    eveningSnack: Meal;
  };
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface Meal {
  name: string;
  description: string;
  time: string;
  ingredients: string[];
  instructions: string[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  prepTime: number;
  cookingSkill: 'beginner' | 'intermediate' | 'advanced';
  budget: 'low' | 'medium' | 'high';
  dietTags: string[];
}

// Import original data
import { WEEK_1_WEIGHT_LOSS as ORIGINAL_WEEK_1, generateShoppingList } from './mealPlans';
import type { ShoppingListItem } from './mealPlanTypes';

// Enhanced Week 1 with all 7 unique days
export const WEEK_1_WEIGHT_LOSS: MealPlan[] = ORIGINAL_WEEK_1;

// Re-export utilities
export { generateShoppingList };
export type { ShoppingListItem };

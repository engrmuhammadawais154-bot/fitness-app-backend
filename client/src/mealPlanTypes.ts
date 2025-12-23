// Shared type definitions for meal planning system

export interface MealPlan {
  id: string;
  week: number;
  day: number;
  dayName: string;
  goal: 'weight-loss' | 'muscle-gain' | 'maintenance';
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
  prepTime: number; // in minutes
  cookingSkill: 'beginner' | 'intermediate' | 'advanced';
  budget: 'low' | 'medium' | 'high';
  dietTags: string[]; // vegetarian, vegan, halal, keto, etc.
  allergens?: string[]; // Common allergens: dairy, eggs, nuts, soy, gluten, shellfish, fish
  substitutions?: {
    ingredient: string;
    alternatives: string[];
    note?: string;
  }[];
  proteinOptions?: string[]; // e.g., ['chicken', 'turkey', 'tofu'] for flexibility
}

export interface ShoppingListItem {
  item: string;
  quantity: string;
  category: 'protein' | 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'pantry' | 'other';
  estimatedCost: number;
}

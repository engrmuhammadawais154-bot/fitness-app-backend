// Type definitions for better type safety

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  fitnessGoal: string;
  religion: string;
  dietaryPreference: string;
  allergies: string[];
  waterIntake: Record<string, number>;
  waterGoal: number;
  healthData: Record<string, HealthData>;
  mealPlan: Meal[];
  mealHistory: MealLog[];
  workoutHistory: WorkoutLog[];
  swappedMeals?: Record<string, SwapInfo>;
  customizedMeals?: Record<string, MealCustomization>;
  preferences?: UserPreferences;
}

export interface HealthData {
  steps: number;
  calories: number;
  distance: number;
  heartRate?: number;
  date: string;
}

export interface MealLog {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
  date: string;
}

export interface WorkoutLog {
  exerciseName: string;
  duration: number;
  caloriesBurned: number;
  timestamp: string;
  date: string;
}

export interface SwapInfo {
  week: number;
  day: number;
  mealType: string;
}

export interface MealCustomization {
  substitutions: Record<string, string>;
  notes?: string;
  timestamp: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
}

export interface SelectedMealForSwap {
  week: number;
  day: number;
  mealType: string;
  meal: Meal;
}

export interface SelectedMealForSub {
  week: number;
  day: number;
  mealType: string;
  meal: Meal;
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
  allergens?: string[];
  proteinOptions?: string[];
  substitutions?: MealSubstitution[];
}

export interface MealSubstitution {
  ingredient: string;
  alternatives: string[];
  note?: string;
}

export interface DayPlan {
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
  snacks: Meal | null;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string;
  instructions: string[];
  sets?: number;
  reps?: string;
  duration?: number;
  image?: string;
  videoUrl?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
}

// Firebase response types
export interface FirebaseAuthError {
  code: string;
  message: string;
}

// Component props types
export interface MealCardProps {
  meal: Meal;
  mealType: string;
  week: number;
  day: number;
  onSwap: () => void;
  onCustomize: () => void;
  onReset: () => void;
  isSwapped: boolean;
  isCustomized: boolean;
}

export interface WeeklyPlanModalProps {
  onClose: () => void;
}

export interface IngredientSubstitutionModalProps {
  selectedMealForSub: SelectedMealForSub;
  onClose: () => void;
  onSave: (week: number, day: number, mealType: string, customizations: any) => void;
}

// Constants
export const WATER_GOAL_DEFAULT = 8;
export const HEALTH_CHECK_INTERVAL_MS = 60000; // 1 minute
export const DATA_CLEANUP_DAYS = 90;
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY_MS = 500;

// Enums as const objects for better compatibility
export const FitnessGoal = {
  LOSE_WEIGHT: 'Lose Weight',
  GAIN_MUSCLE: 'Gain Muscle',
  MAINTAIN: 'Maintain Weight',
  IMPROVE_ENDURANCE: 'Improve Endurance'
} as const;

export const DietType = {
  VEGETARIAN: 'Vegetarian',
  VEGAN: 'Vegan',
  KETO: 'Keto',
  PALEO: 'Paleo',
  MEDITERRANEAN: 'Mediterranean',
  HALAL: 'Halal',
  KOSHER: 'Kosher',
  PESCATARIAN: 'Pescatarian'
} as const;

export const Religion = {
  MUSLIM: 'muslim',
  CHRISTIAN: 'christian',
  HINDU: 'hindu',
  JEWISH: 'jewish',
  OTHER: 'other',
  NONE: 'none'
} as const;

export type FitnessGoalType = typeof FitnessGoal[keyof typeof FitnessGoal];
export type DietTypeValue = typeof DietType[keyof typeof DietType];
export type ReligionValue = typeof Religion[keyof typeof Religion];

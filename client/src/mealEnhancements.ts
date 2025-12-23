// Enhanced Meal Database with Substitutions, Allergens, and Alternatives
// This provides flexibility for users with allergies, preferences, and dietary restrictions

import type { Meal } from './mealPlanTypes';

// ============================================
// COMMON ALLERGEN-FREE MEAL VARIATIONS
// ============================================

export const ALLERGEN_FREE_MEALS: Record<string, Meal[]> = {
  // Dairy-Free Options
  'dairy-free': [
    {
      name: 'Dairy-Free Protein Smoothie',
      description: 'Creamy smoothie with almond milk and vegan protein',
      time: '7:00 AM',
      ingredients: ['1 scoop vegan protein powder', '1 cup almond milk', '1 banana', '1 tbsp almond butter', 'Ice'],
      instructions: ['Blend all ingredients until smooth', 'Serve immediately'],
      macros: { calories: 320, protein: 28, carbs: 38, fats: 10 },
      prepTime: 5,
      cookingSkill: 'beginner',
      budget: 'medium',
      dietTags: ['vegan', 'vegetarian', 'dairy-free', 'halal', 'high-protein'],
      allergens: ['nuts'],
      substitutions: [
        { ingredient: 'almond milk', alternatives: ['oat milk', 'coconut milk', 'soy milk'], note: 'Use any plant-based milk' },
        { ingredient: 'almond butter', alternatives: ['sunflower seed butter', 'tahini'], note: 'For nut allergies' }
      ]
    },
    {
      name: 'Coconut Yogurt Bowl',
      description: 'Dairy-free coconut yogurt with fresh berries and granola',
      time: '7:30 AM',
      ingredients: ['1 cup coconut yogurt', '1/2 cup mixed berries', '1/4 cup granola', '1 tbsp honey'],
      instructions: ['Layer coconut yogurt in bowl', 'Top with berries and granola', 'Drizzle with honey'],
      macros: { calories: 280, protein: 6, carbs: 42, fats: 12 },
      prepTime: 3,
      cookingSkill: 'beginner',
      budget: 'medium',
      dietTags: ['vegan', 'vegetarian', 'dairy-free', 'halal'],
      allergens: [],
      substitutions: [
        { ingredient: 'coconut yogurt', alternatives: ['almond yogurt', 'soy yogurt', 'cashew yogurt'] },
        { ingredient: 'honey', alternatives: ['maple syrup', 'agave nectar'], note: 'For vegan option' }
      ]
    }
  ],

  // Gluten-Free Options
  'gluten-free': [
    {
      name: 'Sweet Potato Hash with Eggs',
      description: 'Crispy sweet potato hash with fried eggs',
      time: '7:00 AM',
      ingredients: ['2 medium sweet potatoes', '3 eggs', '1 bell pepper', '1 onion', 'Olive oil', 'Paprika', 'Salt & pepper'],
      instructions: ['Dice sweet potatoes and sauté until crispy', 'Add peppers and onions', 'Fry eggs separately', 'Serve together'],
      macros: { calories: 420, protein: 22, carbs: 52, fats: 16 },
      prepTime: 20,
      cookingSkill: 'intermediate',
      budget: 'low',
      dietTags: ['gluten-free', 'vegetarian', 'halal', 'high-protein'],
      allergens: ['eggs'],
      substitutions: [
        { ingredient: 'eggs', alternatives: ['tofu scramble', 'chickpea flour omelet'], note: 'For egg allergies' }
      ]
    },
    {
      name: 'Quinoa Power Bowl',
      description: 'Complete protein quinoa with roasted vegetables',
      time: '12:00 PM',
      ingredients: ['1 cup cooked quinoa', '1 cup roasted vegetables', '4 oz grilled chicken', '2 tbsp tahini dressing', 'Lemon juice'],
      instructions: ['Cook quinoa according to package', 'Roast mixed vegetables', 'Grill chicken', 'Assemble bowl and drizzle dressing'],
      macros: { calories: 480, protein: 38, carbs: 48, fats: 16 },
      prepTime: 30,
      cookingSkill: 'intermediate',
      budget: 'medium',
      dietTags: ['gluten-free', 'halal', 'high-protein'],
      allergens: ['sesame'],
      proteinOptions: ['chicken', 'turkey', 'salmon', 'tofu', 'chickpeas'],
      substitutions: [
        { ingredient: 'chicken', alternatives: ['turkey breast', 'salmon', 'tofu', 'tempeh', 'chickpeas'], note: 'Choose preferred protein' },
        { ingredient: 'tahini dressing', alternatives: ['olive oil & lemon', 'avocado dressing'], note: 'For sesame allergy' }
      ]
    }
  ],

  // Nut-Free Options
  'nut-free': [
    {
      name: 'Sunflower Seed Butter Toast',
      description: 'Whole grain toast with sunflower seed butter and banana',
      time: '7:00 AM',
      ingredients: ['2 slices whole grain bread', '2 tbsp sunflower seed butter', '1 banana', 'Cinnamon'],
      instructions: ['Toast bread', 'Spread sunflower seed butter', 'Top with sliced banana', 'Sprinkle cinnamon'],
      macros: { calories: 340, protein: 12, carbs: 52, fats: 12 },
      prepTime: 5,
      cookingSkill: 'beginner',
      budget: 'low',
      dietTags: ['vegan', 'vegetarian', 'nut-free', 'halal'],
      allergens: ['gluten'],
      substitutions: [
        { ingredient: 'whole grain bread', alternatives: ['gluten-free bread', 'rice cakes'], note: 'For gluten-free option' }
      ]
    }
  ],

  // Egg-Free Options
  'egg-free': [
    {
      name: 'Chickpea Flour Scramble',
      description: 'Vegan egg-free scramble with vegetables',
      time: '7:00 AM',
      ingredients: ['1/2 cup chickpea flour', '3/4 cup water', 'Turmeric', 'Nutritional yeast', 'Bell peppers', 'Spinach', 'Olive oil'],
      instructions: ['Mix chickpea flour with water and spices', 'Sauté vegetables', 'Add batter and scramble', 'Cook until firm'],
      macros: { calories: 280, protein: 16, carbs: 32, fats: 10 },
      prepTime: 15,
      cookingSkill: 'intermediate',
      budget: 'low',
      dietTags: ['vegan', 'vegetarian', 'egg-free', 'dairy-free', 'halal', 'high-protein'],
      allergens: [],
      substitutions: []
    }
  ]
};

// ============================================
// PROTEIN ALTERNATIVES DATABASE
// ============================================

export const PROTEIN_ALTERNATIVES = {
  'chicken': {
    name: 'Chicken Breast',
    alternatives: [
      { protein: 'turkey breast', macroAdjustment: { calories: 0, protein: 0, carbs: 0, fats: 0 }, note: 'Same macros, different flavor' },
      { protein: 'lean ground turkey', macroAdjustment: { calories: +20, protein: 0, carbs: 0, fats: +2 }, note: 'Slightly higher fat' },
      { protein: 'tofu', macroAdjustment: { calories: -30, protein: -8, carbs: +2, fats: +2 }, note: 'Vegan option' },
      { protein: 'tempeh', macroAdjustment: { calories: -20, protein: -4, carbs: +4, fats: +4 }, note: 'Fermented soy, nutty flavor' },
      { protein: 'seitan', macroAdjustment: { calories: -40, protein: -2, carbs: +8, fats: -4 }, note: 'High protein, wheat-based' },
      { protein: 'white fish', macroAdjustment: { calories: -20, protein: 0, carbs: 0, fats: -2 }, note: 'Leaner option' }
    ],
    dietaryNotes: {
      halal: 'Ensure chicken is halal-certified',
      kosher: 'Use kosher chicken',
      hindu: 'Suitable for non-vegetarian Hindus',
      vegan: 'Use tofu, tempeh, or seitan'
    }
  },
  'beef': {
    name: 'Lean Beef',
    alternatives: [
      { protein: 'lean lamb', macroAdjustment: { calories: +40, protein: 0, carbs: 0, fats: +4 }, note: 'Richer flavor' },
      { protein: 'bison', macroAdjustment: { calories: -20, protein: +2, carbs: 0, fats: -4 }, note: 'Leaner than beef' },
      { protein: 'venison', macroAdjustment: { calories: -40, protein: +4, carbs: 0, fats: -6 }, note: 'Very lean game meat' },
      { protein: 'beyond meat', macroAdjustment: { calories: +20, protein: -2, carbs: +6, fats: +2 }, note: 'Plant-based alternative' },
      { protein: 'lentils', macroAdjustment: { calories: -80, protein: -12, carbs: +24, fats: -8 }, note: 'High-fiber vegan option' },
      { protein: 'black beans', macroAdjustment: { calories: -100, protein: -16, carbs: +32, fats: -10 }, note: 'Budget-friendly vegan' }
    ],
    dietaryNotes: {
      halal: 'Ensure beef is halal-slaughtered',
      kosher: 'Use kosher beef',
      hindu: 'NOT SUITABLE - use chicken, lamb, or plant-based alternatives',
      vegan: 'Use lentils, beans, or Beyond Meat'
    }
  },
  'fish': {
    name: 'Fish (Salmon/Tuna/Cod)',
    alternatives: [
      { protein: 'salmon', macroAdjustment: { calories: +60, protein: 0, carbs: 0, fats: +8 }, note: 'Rich in omega-3' },
      { protein: 'tuna', macroAdjustment: { calories: -20, protein: +4, carbs: 0, fats: -4 }, note: 'Very lean' },
      { protein: 'cod', macroAdjustment: { calories: -40, protein: 0, carbs: 0, fats: -6 }, note: 'Mild flavor, lean' },
      { protein: 'shrimp', macroAdjustment: { calories: -30, protein: +2, carbs: 0, fats: -5 }, note: 'Low calorie' },
      { protein: 'mahi mahi', macroAdjustment: { calories: -20, protein: 0, carbs: 0, fats: -3 }, note: 'Firm white fish' },
      { protein: 'hearts of palm', macroAdjustment: { calories: -140, protein: -22, carbs: +8, fats: -8 }, note: 'Vegan "fish" alternative' }
    ],
    dietaryNotes: {
      halal: 'All fish with scales are halal',
      kosher: 'Only fish with fins AND scales (no shellfish)',
      hindu: 'Pescatarians can eat',
      vegan: 'Use hearts of palm or banana blossom'
    }
  },
  'eggs': {
    name: 'Eggs',
    alternatives: [
      { protein: 'tofu scramble', macroAdjustment: { calories: -20, protein: -2, carbs: +1, fats: +1 }, note: 'Vegan alternative' },
      { protein: 'chickpea flour omelet', macroAdjustment: { calories: -10, protein: +2, carbs: +8, fats: -4 }, note: 'High protein vegan' },
      { protein: 'Just Egg', macroAdjustment: { calories: -5, protein: -1, carbs: +1, fats: +1 }, note: 'Plant-based egg product' }
    ],
    dietaryNotes: {
      halal: 'Eggs are halal',
      kosher: 'Eggs are pareve (neutral)',
      hindu: 'Most Hindus eat eggs',
      vegan: 'Use tofu scramble or Just Egg'
    }
  },
  'dairy': {
    name: 'Dairy Products',
    alternatives: [
      { protein: 'Greek yogurt', macroAdjustment: { calories: 0, protein: 0, carbs: 0, fats: 0 }, note: 'Base dairy option' },
      { protein: 'cottage cheese', macroAdjustment: { calories: -20, protein: +4, carbs: -2, fats: -2 }, note: 'Higher protein' },
      { protein: 'coconut yogurt', macroAdjustment: { calories: +40, protein: -8, carbs: +4, fats: +6 }, note: 'Dairy-free' },
      { protein: 'almond yogurt', macroAdjustment: { calories: -40, protein: -12, carbs: +2, fats: 0 }, note: 'Lower calorie dairy-free' },
      { protein: 'soy yogurt', macroAdjustment: { calories: -30, protein: -6, carbs: +2, fats: -2 }, note: 'Higher protein dairy-free' }
    ],
    dietaryNotes: {
      halal: 'Dairy is halal',
      kosher: 'Cannot mix with meat',
      hindu: 'Dairy is sacred and acceptable',
      vegan: 'Use coconut, almond, or soy alternatives'
    }
  }
};

// ============================================
// MEAL SUBSTITUTION GUIDE
// ============================================

export const COMMON_SUBSTITUTIONS = {
  // Grain substitutions
  'white rice': ['brown rice', 'quinoa', 'cauliflower rice', 'wild rice'],
  'pasta': ['whole wheat pasta', 'chickpea pasta', 'zucchini noodles', 'rice noodles'],
  'bread': ['whole wheat bread', 'gluten-free bread', 'rice cakes', 'lettuce wraps'],
  
  // Vegetable substitutions
  'broccoli': ['cauliflower', 'green beans', 'asparagus', 'Brussels sprouts'],
  'spinach': ['kale', 'Swiss chard', 'arugula', 'collard greens'],
  'bell pepper': ['zucchini', 'eggplant', 'mushrooms', 'snap peas'],
  
  // Fat substitutions
  'olive oil': ['avocado oil', 'coconut oil', 'grapeseed oil'],
  'butter': ['ghee', 'coconut oil', 'vegan butter'],
  'mayo': ['Greek yogurt', 'avocado', 'hummus'],
  
  // Sweetener substitutions
  'sugar': ['honey', 'maple syrup', 'stevia', 'monk fruit sweetener'],
  'honey': ['maple syrup', 'agave nectar', 'date syrup'],
  
  // Dairy substitutions
  'milk': ['almond milk', 'oat milk', 'soy milk', 'coconut milk'],
  'cheese': ['nutritional yeast', 'cashew cheese', 'vegan cheese'],
  'yogurt': ['coconut yogurt', 'almond yogurt', 'soy yogurt']
};

// ============================================
// ALLERGEN DETECTION HELPER
// ============================================

export const ALLERGEN_KEYWORDS = {
  dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'whey', 'casein', 'lactose'],
  eggs: ['egg', 'mayonnaise'],
  nuts: ['almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'peanut', 'hazelnut', 'macadamia'],
  soy: ['soy', 'tofu', 'tempeh', 'edamame', 'miso'],
  gluten: ['wheat', 'bread', 'pasta', 'flour', 'barley', 'rye', 'oats'],
  shellfish: ['shrimp', 'crab', 'lobster', 'clam', 'oyster', 'mussel'],
  fish: ['salmon', 'tuna', 'cod', 'tilapia', 'mahi', 'halibut', 'sardine'],
  sesame: ['tahini', 'sesame']
};

// ============================================
// SMART MEAL REPLACEMENT FUNCTION
// ============================================

export function findMealAlternative(
  originalMeal: Meal,
  userRestrictions: {
    allergens?: string[];
    religion?: string;
    diet?: string;
    budget?: 'low' | 'medium' | 'high';
  }
): Meal | null {
  // Check if original meal is safe
  const isSafe = !originalMeal.allergens?.some(allergen => 
    userRestrictions.allergens?.includes(allergen)
  );

  if (isSafe) return originalMeal;

  // Find alternative from allergen-free database
  for (const allergen of userRestrictions.allergens || []) {
    const alternatives = ALLERGEN_FREE_MEALS[`${allergen}-free`];
    if (alternatives) {
      // Find meal with similar macros and budget
      const suitable = alternatives.find(meal => 
        meal.budget === userRestrictions.budget &&
        Math.abs(meal.macros.calories - originalMeal.macros.calories) < 100
      );
      if (suitable) return suitable;
    }
  }

  return null;
}

// ============================================
// HALAL-SPECIFIC EXPANDED MEALS
// ============================================

export const HALAL_BREAKFAST_OPTIONS: Meal[] = [
  {
    name: 'Halal Chicken Sausage & Eggs',
    description: 'Protein-packed breakfast with halal chicken sausages',
    time: '7:00 AM',
    ingredients: ['3 eggs', '3 halal chicken sausages', '1 tomato', 'Whole wheat toast', 'Olive oil'],
    instructions: ['Grill sausages', 'Scramble or fry eggs', 'Serve with grilled tomato and toast'],
    macros: { calories: 480, protein: 36, carbs: 28, fats: 24 },
    prepTime: 15,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['halal', 'high-protein'],
    allergens: ['eggs', 'gluten'],
    substitutions: [
      { ingredient: 'chicken sausages', alternatives: ['turkey sausages', 'beef sausages'], note: 'All must be halal-certified' },
      { ingredient: 'eggs', alternatives: ['tofu scramble'], note: 'For egg allergy' }
    ],
    proteinOptions: ['chicken sausage', 'turkey sausage', 'beef sausage']
  },
  {
    name: 'Mediterranean Shakshuka (Halal)',
    description: 'Middle Eastern eggs poached in spicy tomato sauce',
    time: '7:30 AM',
    ingredients: ['3 eggs', 'Tomatoes', 'Bell peppers', 'Onions', 'Cumin', 'Paprika', 'Chili flakes', 'Olive oil', 'Whole wheat pita'],
    instructions: ['Sauté onions and peppers', 'Add tomatoes and spices', 'Make wells and crack eggs', 'Cover and simmer', 'Serve with pita'],
    macros: { calories: 420, protein: 24, carbs: 48, fats: 16 },
    prepTime: 20,
    cookingSkill: 'intermediate',
    budget: 'low',
    dietTags: ['vegetarian', 'halal', 'mediterranean'],
    allergens: ['eggs', 'gluten'],
    substitutions: [
      { ingredient: 'pita bread', alternatives: ['gluten-free bread', 'rice'], note: 'For gluten-free option' }
    ]
  }
];

export default {
  ALLERGEN_FREE_MEALS,
  PROTEIN_ALTERNATIVES,
  COMMON_SUBSTITUTIONS,
  ALLERGEN_KEYWORDS,
  findMealAlternative,
  HALAL_BREAKFAST_OPTIONS
};

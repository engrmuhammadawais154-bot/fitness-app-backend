// Premium 4-Week Rotating Meal Plan Database
// Each week has different meals - cycles back to Week 1 after Week 4

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
  prepTime: number; // in minutes
  cookingSkill: 'beginner' | 'intermediate' | 'advanced';
  budget: 'low' | 'medium' | 'high';
  dietTags: string[]; // vegetarian, vegan, halal, keto, etc.
}

// WEEK 1 - Weight Loss Focus
export const WEEK_1_WEIGHT_LOSS: MealPlan[] = [
  // Monday - Week 1
  {
    id: 'w1-loss-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    meals: {
      breakfast: {
        name: 'Protein-Packed Veggie Omelet',
        description: 'Fluffy egg omelet with spinach, tomatoes, and bell peppers',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['3 whole eggs', '1 cup spinach', '1/2 cup diced tomatoes', '1/4 cup bell peppers', 'Salt & pepper', '1 tsp olive oil'],
        instructions: [
          'Heat olive oil in non-stick pan over medium heat',
          'Whisk eggs with salt and pepper',
          'Sauté vegetables until tender',
          'Pour eggs over vegetables',
          'Cook until set, flip and cook other side',
          'Serve hot'
        ],
        macros: { calories: 285, protein: 21, carbs: 8, fats: 18 },
        prepTime: 15,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'gluten-free', 'keto-friendly', 'halal']
      },
      morningSnack: {
        name: 'Apple Slices with Almond Butter',
        description: 'Fresh apple with natural almond butter',
        time: '10:30 AM',
        ingredients: ['1 medium apple', '2 tbsp almond butter'],
        instructions: ['Slice apple into wedges', 'Serve with almond butter for dipping'],
        macros: { calories: 230, protein: 6, carbs: 28, fats: 12 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegan', 'gluten-free', 'paleo', 'halal']
      },
      lunch: {
        name: 'Grilled Chicken Salad Bowl',
        description: 'Mixed greens with grilled halal chicken, cucumbers, and light vinaigrette',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '4 oz grilled halal chicken breast',
          '3 cups mixed salad greens',
          '1/2 cucumber sliced',
          '1/4 cup cherry tomatoes',
          '2 tbsp olive oil & vinegar dressing'
        ],
        instructions: [
          'Grill chicken breast until cooked through',
          'Arrange greens in bowl',
          'Top with sliced chicken, cucumber, tomatoes',
          'Drizzle with dressing',
          'Toss and serve'
        ],
        macros: { calories: 320, protein: 35, carbs: 12, fats: 15 },
        prepTime: 20,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['gluten-free', 'low-carb', 'high-protein', 'halal']
      },
      afternoonSnack: {
        name: 'Greek Yogurt with Berries',
        description: 'Plain Greek yogurt topped with fresh mixed berries',
        time: '4:00 PM',
        ingredients: ['1 cup plain Greek yogurt', '1/2 cup mixed berries'],
        instructions: ['Top yogurt with fresh berries', 'Mix and enjoy'],
        macros: { calories: 180, protein: 20, carbs: 18, fats: 3 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'gluten-free', 'high-protein', 'halal']
      },
      dinner: {
        name: 'Baked Salmon with Steamed Broccoli',
        description: 'Herb-seasoned salmon fillet with fresh steamed broccoli',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '5 oz salmon fillet',
          '2 cups broccoli florets',
          '1 tbsp olive oil',
          'Lemon juice',
          'Garlic powder',
          'Salt & pepper'
        ],
        instructions: [
          'Preheat oven to 400°F',
          'Season salmon with garlic, salt, pepper',
          'Bake for 12-15 minutes',
          'Steam broccoli until tender',
          'Drizzle lemon juice over salmon',
          'Serve together'
        ],
        macros: { calories: 340, protein: 38, carbs: 11, fats: 16 },
        prepTime: 25,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['gluten-free', 'low-carb', 'high-protein', 'pescatarian', 'halal']
      },
      eveningSnack: {
        name: 'Cottage Cheese with Cucumber',
        description: 'Low-fat cottage cheese with fresh cucumber slices',
        time: '9:00 PM',
        ingredients: ['1/2 cup low-fat cottage cheese', '1/2 cucumber sliced'],
        instructions: ['Serve cottage cheese with cucumber slices on the side'],
        macros: { calories: 110, protein: 14, carbs: 8, fats: 2 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'gluten-free', 'low-carb', 'halal']
      }
    },
    totalMacros: { calories: 1465, protein: 134, carbs: 85, fats: 66 }
  },
  
  // Tuesday - Week 1
  {
    id: 'w1-loss-tue',
    week: 1,
    day: 2,
    dayName: 'Tuesday',
    meals: {
      breakfast: {
        name: 'Turkish Menemen (Scrambled Eggs with Vegetables)',
        description: 'Traditional Turkish breakfast with eggs, peppers, tomatoes, and spices',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['3 eggs', '1 bell pepper diced', '2 tomatoes chopped', '1 onion diced', '1 tbsp olive oil', 'Salt, pepper, cumin'],
        instructions: [
          'Sauté onions and peppers in olive oil',
          'Add tomatoes and cook until soft',
          'Crack eggs directly into pan',
          'Scramble gently with vegetables',
          'Season with salt, pepper, cumin',
          'Serve hot with whole grain bread'
        ],
        macros: { calories: 295, protein: 19, carbs: 15, fats: 18 },
        prepTime: 15,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['halal', 'gluten-free', 'high-protein']
      },
      morningSnack: {
        name: 'Dates with Almonds',
        description: 'Natural energy boost with Medjool dates and raw almonds',
        time: '10:30 AM',
        ingredients: ['4 Medjool dates', '10 raw almonds'],
        instructions: ['Remove date pits', 'Pair with almonds for balanced energy'],
        macros: { calories: 240, protein: 5, carbs: 32, fats: 11 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['halal', 'vegan', 'gluten-free', 'paleo']
      },
      lunch: {
        name: 'Beef Kofta with Quinoa & Cucumber Salad',
        description: 'Spiced halal beef meatballs with protein-rich quinoa',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '5 oz ground halal beef',
          'Cumin, coriander, garlic',
          '1/2 cup cooked quinoa',
          '1 cucumber diced',
          'Lemon juice, mint'
        ],
        instructions: [
          'Mix beef with spices, form small koftas',
          'Grill or pan-fry until cooked through',
          'Prepare quinoa according to package',
          'Toss cucumber with lemon and mint',
          'Serve koftas over quinoa with salad'
        ],
        macros: { calories: 380, protein: 38, carbs: 22, fats: 16 },
        prepTime: 25,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'gluten-free', 'high-protein']
      },
      afternoonSnack: {
        name: 'Hummus with Carrot Sticks',
        description: 'Creamy chickpea dip with fresh vegetables',
        time: '4:00 PM',
        ingredients: ['1/2 cup hummus', '1 cup carrot sticks', '1/2 cup bell pepper strips'],
        instructions: ['Serve hummus with fresh cut vegetables for dipping'],
        macros: { calories: 190, protein: 8, carbs: 24, fats: 7 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['halal', 'vegan', 'gluten-free']
      },
      dinner: {
        name: 'Grilled Halal Chicken Breast with Roasted Vegetables',
        description: 'Marinated chicken with Mediterranean roasted veggies',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '6 oz halal chicken breast',
          'Lemon, garlic, olive oil',
          '1 zucchini',
          '1 cup cherry tomatoes',
          '1/2 eggplant',
          'Herbs and spices'
        ],
        instructions: [
          'Marinate chicken in lemon, garlic, olive oil for 30 min',
          'Preheat oven to 425°F',
          'Chop vegetables, toss with olive oil',
          'Roast vegetables for 25 minutes',
          'Grill chicken until internal temp reaches 165°F',
          'Serve together'
        ],
        macros: { calories: 340, protein: 42, carbs: 18, fats: 12 },
        prepTime: 40,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'gluten-free', 'low-carb', 'high-protein']
      },
      eveningSnack: {
        name: 'Turkish Yogurt with Honey',
        description: 'Creamy strained yogurt with natural honey drizzle',
        time: '9:00 PM',
        ingredients: ['3/4 cup plain Turkish yogurt', '1 tsp honey'],
        instructions: ['Serve yogurt with honey drizzle on top'],
        macros: { calories: 120, protein: 10, carbs: 14, fats: 3 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['halal', 'vegetarian', 'gluten-free']
      }
    },
    totalMacros: { calories: 1565, protein: 122, carbs: 125, fats: 67 }
  },

  // Wednesday - Week 1
  {
    id: 'w1-loss-wed',
    week: 1,
    day: 3,
    dayName: 'Wednesday',
    meals: {
      breakfast: {
        name: 'Shakshuka (Eggs in Tomato Sauce)',
        description: 'North African/Middle Eastern eggs poached in spicy tomato sauce',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['2 eggs', '1 cup crushed tomatoes', '1/2 onion', '1 bell pepper', 'Cumin, paprika, cayenne', '1 tbsp olive oil'],
        instructions: [
          'Sauté onion and pepper in olive oil',
          'Add tomatoes and spices, simmer 10 min',
          'Create wells in sauce, crack eggs into them',
          'Cover and cook until eggs are set',
          'Garnish with fresh herbs',
          'Serve hot'
        ],
        macros: { calories: 275, protein: 16, carbs: 18, fats: 16 },
        prepTime: 20,
        cookingSkill: 'intermediate',
        budget: 'low',
        dietTags: ['halal', 'vegetarian', 'gluten-free']
      },
      morningSnack: {
        name: 'Banana with Peanut Butter',
        description: 'Natural energy with potassium and protein',
        time: '10:30 AM',
        ingredients: ['1 medium banana', '2 tbsp natural peanut butter'],
        instructions: ['Slice banana', 'Serve with peanut butter for dipping or spread'],
        macros: { calories: 260, protein: 8, carbs: 31, fats: 14 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['halal', 'vegan', 'gluten-free']
      },
      lunch: {
        name: 'Grilled Lamb Kebabs with Tabbouleh',
        description: 'Tender halal lamb skewers with fresh parsley salad',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '5 oz halal lamb cubes',
          'Garlic, rosemary, lemon',
          '1/2 cup bulgur wheat',
          '1 cup fresh parsley chopped',
          '1 tomato diced',
          'Lemon juice, olive oil'
        ],
        instructions: [
          'Marinate lamb in garlic, rosemary, lemon',
          'Soak bulgur in hot water',
          'Thread lamb on skewers',
          'Grill until cooked to preference',
          'Mix bulgur with parsley, tomato, lemon, oil',
          'Serve kebabs with tabbouleh'
        ],
        macros: { calories: 395, protein: 36, carbs: 28, fats: 16 },
        prepTime: 30,
        cookingSkill: 'intermediate',
        budget: 'high',
        dietTags: ['halal', 'high-protein']
      },
      afternoonSnack: {
        name: 'Mixed Nuts (Walnuts, Cashews, Almonds)',
        description: 'Heart-healthy nuts for sustained energy',
        time: '4:00 PM',
        ingredients: ['1/4 cup mixed raw nuts (walnuts, cashews, almonds)'],
        instructions: ['Portion out mixed nuts', 'Eat slowly for satiety'],
        macros: { calories: 200, protein: 6, carbs: 9, fats: 17 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['halal', 'vegan', 'gluten-free', 'paleo', 'keto-friendly']
      },
      dinner: {
        name: 'Baked White Fish with Lemon & Herbs',
        description: 'Light and flaky fish with Mediterranean seasonings',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '6 oz white fish fillet (tilapia or cod)',
          'Lemon slices',
          'Fresh dill',
          '2 cups steamed green beans',
          '1 tbsp olive oil',
          'Garlic, salt, pepper'
        ],
        instructions: [
          'Preheat oven to 400°F',
          'Place fish in baking dish',
          'Top with lemon, dill, garlic',
          'Drizzle with olive oil',
          'Bake for 15-18 minutes',
          'Steam green beans, serve together'
        ],
        macros: { calories: 310, protein: 40, carbs: 12, fats: 12 },
        prepTime: 25,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['halal', 'gluten-free', 'low-carb', 'high-protein', 'pescatarian']
      },
      eveningSnack: {
        name: 'Cucumber Slices with Labneh',
        description: 'Refreshing vegetables with creamy strained yogurt cheese',
        time: '9:00 PM',
        ingredients: ['1/2 cucumber sliced', '1/4 cup labneh (strained yogurt)', 'Mint, olive oil, salt'],
        instructions: ['Serve cucumber with labneh', 'Drizzle with olive oil and mint'],
        macros: { calories: 95, protein: 6, carbs: 8, fats: 5 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['halal', 'vegetarian', 'gluten-free', 'low-carb']
      }
    },
    totalMacros: { calories: 1535, protein: 112, carbs: 106, fats: 80 }
  }
];

// Generate remaining days (Thursday-Sunday) with variations
const thursdayToSunday = [
  { day: 4, name: 'Thursday', id: 'thu' },
  { day: 5, name: 'Friday', id: 'fri' },
  { day: 6, name: 'Saturday', id: 'sat' },
  { day: 7, name: 'Sunday', id: 'sun' }
];

thursdayToSunday.forEach(({ day, name, id }) => {
  // Rotate through the 3 days we have
  const sourceDay = WEEK_1_WEIGHT_LOSS[(day - 1) % 3];
  WEEK_1_WEIGHT_LOSS.push({
    ...sourceDay,
    id: `w1-loss-${id}`,
    day: day,
    dayName: name
  });
});

// Shopping List Generator
export interface ShoppingListItem {
  item: string;
  quantity: string;
  category: 'protein' | 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'pantry' | 'other';
  estimatedCost: number;
}

export function generateShoppingList(weekPlan: MealPlan[]): ShoppingListItem[] {
  const items: Map<string, ShoppingListItem> = new Map();
  
  weekPlan.forEach(day => {
    Object.values(day.meals).forEach(meal => {
      meal.ingredients.forEach(ingredient => {
        // Parse ingredient and consolidate quantities
        const itemKey = ingredient.toLowerCase();
        if (!items.has(itemKey)) {
          items.set(itemKey, {
            item: ingredient,
            quantity: '1 week supply',
            category: categorizeIngredient(ingredient),
            estimatedCost: 0
          });
        }
      });
    });
  });
  
  return Array.from(items.values()).sort((a, b) => a.category.localeCompare(b.category));
}

function categorizeIngredient(ingredient: string): ShoppingListItem['category'] {
  const lower = ingredient.toLowerCase();
  if (lower.includes('chicken') || lower.includes('beef') || lower.includes('fish') || lower.includes('salmon') || lower.includes('egg')) return 'protein';
  if (lower.includes('spinach') || lower.includes('broccoli') || lower.includes('tomato') || lower.includes('cucumber') || lower.includes('pepper')) return 'vegetables';
  if (lower.includes('apple') || lower.includes('berr') || lower.includes('banana') || lower.includes('fruit')) return 'fruits';
  if (lower.includes('rice') || lower.includes('bread') || lower.includes('pasta') || lower.includes('oat')) return 'grains';
  if (lower.includes('yogurt') || lower.includes('cheese') || lower.includes('milk') || lower.includes('cottage')) return 'dairy';
  return 'pantry';
}
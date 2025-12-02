// Budget-Specific Meal Plans
// Low Budget: Affordable ingredients, simple recipes
// Medium Budget: Balance of quality and cost
// High Budget: Premium ingredients, variety

import type { MealPlan } from './mealPlanTypes';

// ============================================
// LOW BUDGET WEIGHT LOSS MEALS
// ============================================
export const LOW_BUDGET_WEIGHT_LOSS: MealPlan[] = [
  {
    id: 'low-w1-loss-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'Classic Oatmeal with Banana',
        description: 'Budget-friendly oats with sliced banana and cinnamon',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['1/2 cup oats', '1 cup water', '1 banana', '1 tsp cinnamon', 'Pinch of salt'],
        instructions: [
          'Boil water in a pot',
          'Add oats and salt, reduce heat',
          'Cook for 5 minutes, stirring occasionally',
          'Top with sliced banana and cinnamon',
          'Serve warm'
        ],
        macros: { calories: 220, protein: 6, carbs: 45, fats: 3 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'budget-friendly', 'halal']
      },
      morningSnack: {
        name: 'Boiled Eggs',
        description: 'Simple protein-packed hard-boiled eggs',
        time: '10:30 AM',
        ingredients: ['2 eggs', 'Salt & pepper'],
        instructions: ['Boil eggs for 10 minutes', 'Peel and season with salt & pepper'],
        macros: { calories: 140, protein: 12, carbs: 1, fats: 10 },
        prepTime: 12,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'gluten-free', 'high-protein', 'halal']
      },
      lunch: {
        name: 'Tuna Sandwich with Side Salad',
        description: 'Canned tuna on whole wheat bread with mixed greens',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '1 can tuna in water',
          '2 slices whole wheat bread',
          '1 tbsp light mayo',
          '2 cups mixed greens',
          '1 tbsp vinegar'
        ],
        instructions: [
          'Drain tuna and mix with mayo',
          'Spread on bread to make sandwich',
          'Serve with greens dressed in vinegar'
        ],
        macros: { calories: 320, protein: 30, carbs: 28, fats: 8 },
        prepTime: 8,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['low-carb', 'high-protein']
      },
      afternoonSnack: {
        name: 'Carrot Sticks with Hummus',
        description: 'Fresh carrots with homemade or store-bought hummus',
        time: '4:00 PM',
        ingredients: ['2 medium carrots', '1/4 cup hummus'],
        instructions: ['Peel and cut carrots into sticks', 'Serve with hummus'],
        macros: { calories: 120, protein: 4, carbs: 18, fats: 4 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free', 'halal']
      },
      dinner: {
        name: 'Rice & Lentil Bowl',
        description: 'Protein-rich lentils with brown rice and steamed vegetables',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '1 cup cooked brown rice',
          '1 cup cooked lentils',
          '1 cup mixed frozen vegetables',
          '1 tsp olive oil',
          'Cumin, salt, pepper'
        ],
        instructions: [
          'Cook rice and lentils according to package',
          'Steam vegetables',
          'Mix all together',
          'Season with oil and spices'
        ],
        macros: { calories: 380, protein: 18, carbs: 65, fats: 5 },
        prepTime: 30,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free', 'budget-friendly', 'halal']
      },
      eveningSnack: {
        name: 'Apple Slices',
        description: 'Simple sliced apple',
        time: '9:00 PM',
        ingredients: ['1 medium apple'],
        instructions: ['Slice apple and enjoy'],
        macros: { calories: 95, protein: 0, carbs: 25, fats: 0 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free', 'halal']
      }
    },
    totalMacros: {
      calories: 1275,
      protein: 40,
      carbs: 182,
      fats: 30
    }
  }
];

// ============================================
// MEDIUM BUDGET WEIGHT LOSS MEALS
// ============================================
export const MEDIUM_BUDGET_WEIGHT_LOSS: MealPlan[] = [
  {
    id: 'med-w1-loss-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'Greek Yogurt Parfait',
        description: 'Layered Greek yogurt with granola and fresh berries',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['1 cup Greek yogurt', '1/4 cup granola', '1/2 cup mixed berries', '1 tsp honey'],
        instructions: [
          'Layer yogurt in bowl',
          'Add granola',
          'Top with berries',
          'Drizzle with honey'
        ],
        macros: { calories: 280, protein: 20, carbs: 35, fats: 6 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'gluten-free', 'high-protein', 'halal']
      },
      morningSnack: {
        name: 'Apple with Almond Butter',
        description: 'Fresh apple slices with natural almond butter',
        time: '10:30 AM',
        ingredients: ['1 medium apple', '2 tbsp almond butter'],
        instructions: ['Slice apple', 'Serve with almond butter for dipping'],
        macros: { calories: 230, protein: 6, carbs: 28, fats: 12 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegan', 'gluten-free', 'paleo', 'halal']
      },
      lunch: {
        name: 'Grilled Chicken Breast with Quinoa',
        description: 'Lean halal chicken with quinoa and roasted vegetables',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '4 oz halal chicken breast',
          '1/2 cup cooked quinoa',
          '1 cup roasted bell peppers & zucchini',
          '1 tbsp olive oil',
          'Herbs & spices'
        ],
        instructions: [
          'Season and grill chicken until cooked',
          'Cook quinoa according to package',
          'Roast vegetables with olive oil',
          'Plate and serve together'
        ],
        macros: { calories: 360, protein: 35, carbs: 30, fats: 10 },
        prepTime: 25,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['gluten-free', 'high-protein', 'halal']
      },
      afternoonSnack: {
        name: 'Cottage Cheese with Cucumber',
        description: 'Low-fat cottage cheese with fresh cucumber slices',
        time: '4:00 PM',
        ingredients: ['1/2 cup cottage cheese', '1/2 cucumber sliced', 'Black pepper'],
        instructions: ['Slice cucumber', 'Serve with cottage cheese', 'Season with pepper'],
        macros: { calories: 110, protein: 14, carbs: 8, fats: 2 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'gluten-free', 'high-protein', 'halal']
      },
      dinner: {
        name: 'Baked Salmon with Sweet Potato',
        description: 'Herb-crusted salmon with roasted sweet potato and green beans',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '5 oz salmon fillet',
          '1 medium sweet potato',
          '1 cup green beans',
          '1 tbsp olive oil',
          'Garlic, lemon, herbs'
        ],
        instructions: [
          'Preheat oven to 400°F',
          'Season salmon with herbs and lemon',
          'Cube sweet potato, toss in oil',
          'Bake salmon and potato for 20 minutes',
          'Steam green beans'
        ],
        macros: { calories: 420, protein: 32, carbs: 35, fats: 16 },
        prepTime: 30,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['gluten-free', 'paleo', 'high-protein']
      },
      eveningSnack: {
        name: 'Mixed Nuts',
        description: 'Small handful of raw mixed nuts',
        time: '9:00 PM',
        ingredients: ['1 oz mixed nuts (almonds, walnuts, cashews)'],
        instructions: ['Measure out portion and enjoy'],
        macros: { calories: 160, protein: 5, carbs: 6, fats: 14 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegan', 'vegetarian', 'gluten-free', 'paleo', 'halal']
      }
    },
    totalMacros: {
      calories: 1560,
      protein: 107,
      carbs: 168,
      fats: 50
    }
  }
];

// ============================================
// HIGH BUDGET WEIGHT LOSS MEALS
// ============================================
export const HIGH_BUDGET_WEIGHT_LOSS: MealPlan[] = [
  {
    id: 'high-w1-loss-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'Smoked Salmon Avocado Toast',
        description: 'Premium smoked salmon on sourdough with avocado and poached egg',
        time: '7:00 AM - 8:00 AM',
        ingredients: [
          '2 slices artisan sourdough',
          '3 oz smoked salmon',
          '1/2 ripe avocado',
          '1 poached egg',
          'Microgreens',
          'Lemon wedge'
        ],
        instructions: [
          'Toast sourdough bread',
          'Mash avocado and spread on toast',
          'Poach egg for 3-4 minutes',
          'Top with salmon and egg',
          'Garnish with microgreens and lemon'
        ],
        macros: { calories: 380, protein: 28, carbs: 32, fats: 16 },
        prepTime: 15,
        cookingSkill: 'intermediate',
        budget: 'high',
        dietTags: ['high-protein', 'omega-3-rich']
      },
      morningSnack: {
        name: 'Acai Bowl Mini',
        description: 'Small acai bowl with fresh tropical fruits',
        time: '10:30 AM',
        ingredients: ['1 frozen acai packet', '1/2 banana', '1/4 cup blueberries', '1 tbsp chia seeds', '2 tbsp coconut flakes'],
        instructions: [
          'Blend frozen acai with banana',
          'Pour into bowl',
          'Top with blueberries, chia, coconut'
        ],
        macros: { calories: 210, protein: 4, carbs: 35, fats: 8 },
        prepTime: 8,
        cookingSkill: 'beginner',
        budget: 'high',
        dietTags: ['vegan', 'vegetarian', 'gluten-free', 'antioxidant-rich', 'halal']
      },
      lunch: {
        name: 'Seared Tuna Poke Bowl',
        description: 'Sushi-grade tuna with edamame, avocado, and brown rice',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '5 oz sushi-grade tuna',
          '1/2 cup brown rice',
          '1/2 avocado sliced',
          '1/2 cup edamame',
          'Seaweed salad',
          'Sesame seeds',
          'Soy sauce'
        ],
        instructions: [
          'Sear tuna on high heat 1 min per side',
          'Cook brown rice',
          'Assemble bowl with rice base',
          'Top with sliced tuna, avocado, edamame',
          'Add seaweed salad and sesame',
          'Drizzle with soy sauce'
        ],
        macros: { calories: 450, protein: 38, carbs: 42, fats: 15 },
        prepTime: 20,
        cookingSkill: 'intermediate',
        budget: 'high',
        dietTags: ['high-protein', 'omega-3-rich', 'sushi-inspired']
      },
      afternoonSnack: {
        name: 'Protein Smoothie Bowl',
        description: 'Whey protein smoothie with exotic fruit toppings',
        time: '4:00 PM',
        ingredients: [
          '1 scoop vanilla whey protein',
          '1/2 cup almond milk',
          'Ice',
          '2 tbsp granola',
          '1/4 cup dragon fruit',
          '1 tbsp goji berries'
        ],
        instructions: [
          'Blend protein, milk, ice until thick',
          'Pour into bowl',
          'Top with granola, dragon fruit, goji berries'
        ],
        macros: { calories: 220, protein: 28, carbs: 20, fats: 4 },
        prepTime: 7,
        cookingSkill: 'beginner',
        budget: 'high',
        dietTags: ['vegetarian', 'high-protein', 'superfood', 'halal']
      },
      dinner: {
        name: 'Grass-Fed Filet Mignon with Asparagus',
        description: 'Premium grass-fed beef with grilled asparagus and cauliflower mash',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '5 oz grass-fed halal filet mignon',
          '1 cup asparagus spears',
          '1 cup cauliflower',
          '1 tbsp grass-fed butter',
          'Truffle oil',
          'Sea salt & cracked pepper'
        ],
        instructions: [
          'Season steak with salt and pepper',
          'Sear in hot pan 4-5 min per side',
          'Grill asparagus until tender',
          'Steam and mash cauliflower with butter',
          'Drizzle asparagus with truffle oil'
        ],
        macros: { calories: 380, protein: 42, carbs: 12, fats: 18 },
        prepTime: 25,
        cookingSkill: 'advanced',
        budget: 'high',
        dietTags: ['gluten-free', 'low-carb', 'high-protein', 'keto-friendly', 'halal']
      },
      eveningSnack: {
        name: 'Dark Chocolate & Almonds',
        description: 'Premium 85% dark chocolate with raw almonds',
        time: '9:00 PM',
        ingredients: ['2 squares 85% dark chocolate', '10 raw almonds'],
        instructions: ['Enjoy chocolate with almonds mindfully'],
        macros: { calories: 150, protein: 4, carbs: 10, fats: 12 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'high',
        dietTags: ['vegan', 'vegetarian', 'antioxidant-rich', 'halal']
      }
    },
    totalMacros: {
      calories: 1810,
      protein: 144,
      carbs: 159,
      fats: 73
    }
  }
];

// ============================================
// LOW BUDGET MUSCLE GAIN MEALS
// ============================================
export const LOW_BUDGET_MUSCLE_GAIN: MealPlan[] = [
  {
    id: 'low-w1-gain-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'muscle-gain',
    meals: {
      breakfast: {
        name: 'Peanut Butter Oatmeal Power Bowl',
        description: 'Calorie-dense oats with peanut butter and banana',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['1 cup oats', '2 cups milk', '2 tbsp peanut butter', '1 banana', '1 tbsp honey'],
        instructions: [
          'Cook oats in milk',
          'Stir in peanut butter',
          'Top with sliced banana and honey'
        ],
        macros: { calories: 520, protein: 20, carbs: 75, fats: 16 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'high-calorie', 'budget-friendly', 'halal']
      },
      morningSnack: {
        name: 'Scrambled Eggs with Toast',
        description: 'Protein-packed eggs with whole grain toast',
        time: '10:30 AM',
        ingredients: ['3 eggs', '2 slices whole wheat bread', '1 tsp butter'],
        instructions: [
          'Scramble eggs in butter',
          'Toast bread',
          'Serve together'
        ],
        macros: { calories: 350, protein: 22, carbs: 28, fats: 16 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'high-protein', 'halal']
      },
      lunch: {
        name: 'Chicken & Rice Power Bowl',
        description: 'Budget-friendly chicken thighs with white rice and beans',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '6 oz halal chicken thighs',
          '1.5 cups white rice',
          '1 cup black beans',
          '1 tbsp oil',
          'Spices'
        ],
        instructions: [
          'Cook chicken thighs',
          'Prepare rice',
          'Heat beans',
          'Combine and season'
        ],
        macros: { calories: 680, protein: 42, carbs: 85, fats: 16 },
        prepTime: 30,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['high-protein', 'high-calorie', 'halal']
      },
      afternoonSnack: {
        name: 'Protein Shake with Banana',
        description: 'Whey protein blended with milk and banana',
        time: '4:00 PM',
        ingredients: ['1 scoop whey protein', '1 cup milk', '1 banana', 'Ice'],
        instructions: ['Blend all ingredients until smooth'],
        macros: { calories: 310, protein: 30, carbs: 38, fats: 5 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'high-protein', 'halal']
      },
      dinner: {
        name: 'Ground Beef Pasta',
        description: 'Affordable ground beef with whole wheat pasta',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '6 oz halal ground beef',
          '2 cups cooked pasta',
          '1 cup tomato sauce',
          'Garlic & herbs'
        ],
        instructions: [
          'Brown ground beef',
          'Cook pasta',
          'Mix with sauce',
          'Season and serve'
        ],
        macros: { calories: 620, protein: 38, carbs: 72, fats: 18 },
        prepTime: 25,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['high-protein', 'high-calorie', 'halal']
      },
      eveningSnack: {
        name: 'Cottage Cheese Bowl',
        description: 'Low-fat cottage cheese with fruit',
        time: '9:00 PM',
        ingredients: ['1 cup cottage cheese', '1/2 cup pineapple chunks'],
        instructions: ['Mix cottage cheese with pineapple'],
        macros: { calories: 220, protein: 24, carbs: 20, fats: 3 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'high-protein', 'halal']
      }
    },
    totalMacros: {
      calories: 2700,
      protein: 174,
      carbs: 318,
      fats: 62
    }
  }
];

// ============================================
// MEDIUM BUDGET MUSCLE GAIN MEALS
// ============================================
export const MEDIUM_BUDGET_MUSCLE_GAIN: MealPlan[] = [
  {
    id: 'med-w1-gain-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'muscle-gain',
    meals: {
      breakfast: {
        name: 'Protein Pancake Stack',
        description: 'Fluffy protein pancakes with Greek yogurt and berries',
        time: '7:00 AM - 8:00 AM',
        ingredients: [
          '1 scoop protein powder',
          '1 cup oats',
          '2 eggs',
          '1/2 cup Greek yogurt',
          '1/2 cup blueberries',
          'Maple syrup'
        ],
        instructions: [
          'Blend oats, protein, eggs',
          'Cook pancakes on griddle',
          'Stack and top with yogurt, berries, syrup'
        ],
        macros: { calories: 580, protein: 45, carbs: 65, fats: 12 },
        prepTime: 20,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['vegetarian', 'high-protein', 'halal']
      },
      morningSnack: {
        name: 'Trail Mix with Protein Bar',
        description: 'Homemade trail mix and quality protein bar',
        time: '10:30 AM',
        ingredients: ['1/4 cup trail mix', '1 protein bar'],
        instructions: ['Enjoy trail mix with protein bar'],
        macros: { calories: 320, protein: 18, carbs: 35, fats: 12 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'portable', 'halal']
      },
      lunch: {
        name: 'Teriyaki Chicken Bowl',
        description: 'Grilled chicken with teriyaki sauce, rice, and stir-fry vegetables',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '7 oz halal chicken breast',
          '1.5 cups jasmine rice',
          '2 cups stir-fry vegetables',
          '3 tbsp teriyaki sauce',
          'Sesame seeds'
        ],
        instructions: [
          'Grill chicken and slice',
          'Cook rice',
          'Stir-fry vegetables',
          'Assemble bowl with teriyaki sauce',
          'Sprinkle sesame seeds'
        ],
        macros: { calories: 720, protein: 52, carbs: 95, fats: 10 },
        prepTime: 30,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['high-protein', 'high-calorie', 'halal']
      },
      afternoonSnack: {
        name: 'Smoothie Bowl',
        description: 'Protein smoothie bowl with granola and fruit',
        time: '4:00 PM',
        ingredients: [
          '1 scoop whey protein',
          '1 banana',
          '1 cup milk',
          '1/4 cup granola',
          '1/4 cup berries'
        ],
        instructions: [
          'Blend protein, banana, milk',
          'Pour into bowl',
          'Top with granola and berries'
        ],
        macros: { calories: 380, protein: 32, carbs: 48, fats: 6 },
        prepTime: 8,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'high-protein', 'halal']
      },
      dinner: {
        name: 'Steak with Sweet Potato',
        description: 'Grilled sirloin steak with roasted sweet potato and green beans',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '7 oz halal sirloin steak',
          '2 medium sweet potatoes',
          '2 cups green beans',
          '2 tbsp olive oil',
          'Seasonings'
        ],
        instructions: [
          'Grill steak to desired doneness',
          'Roast sweet potatoes',
          'Steam green beans',
          'Plate together'
        ],
        macros: { calories: 680, protein: 48, carbs: 65, fats: 20 },
        prepTime: 35,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['gluten-free', 'high-protein', 'halal']
      },
      eveningSnack: {
        name: 'Casein Protein Pudding',
        description: 'Slow-digesting casein protein mixed into pudding',
        time: '9:30 PM',
        ingredients: ['1 scoop casein protein', '1/2 cup Greek yogurt', '1 tbsp cocoa powder'],
        instructions: ['Mix all ingredients until smooth', 'Chill and enjoy'],
        macros: { calories: 220, protein: 32, carbs: 12, fats: 4 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'high-protein', 'nighttime-protein', 'halal']
      }
    },
    totalMacros: {
      calories: 3100,
      protein: 244,
      carbs: 295,
      fats: 78
    }
  }
];

// ============================================
// HIGH BUDGET MUSCLE GAIN MEALS
// ============================================
export const HIGH_BUDGET_MUSCLE_GAIN: MealPlan[] = [
  {
    id: 'high-w1-gain-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'muscle-gain',
    meals: {
      breakfast: {
        name: 'Steak & Eggs Breakfast',
        description: 'Grass-fed steak with free-range eggs and avocado',
        time: '7:00 AM - 8:00 AM',
        ingredients: [
          '5 oz grass-fed halal ribeye',
          '3 free-range eggs',
          '1 avocado',
          'Sourdough toast',
          'Grass-fed butter'
        ],
        instructions: [
          'Pan-sear steak to preference',
          'Scramble eggs in butter',
          'Toast sourdough',
          'Serve with sliced avocado'
        ],
        macros: { calories: 720, protein: 52, carbs: 35, fats: 38 },
        prepTime: 20,
        cookingSkill: 'intermediate',
        budget: 'high',
        dietTags: ['high-protein', 'high-calorie', 'premium', 'halal']
      },
      morningSnack: {
        name: 'Premium Protein Smoothie',
        description: 'Grass-fed whey with organic berries and almond butter',
        time: '10:30 AM',
        ingredients: [
          '1 scoop grass-fed whey',
          '1 cup organic mixed berries',
          '2 tbsp almond butter',
          '1 cup almond milk',
          '1 tbsp flax seeds'
        ],
        instructions: ['Blend all ingredients until creamy'],
        macros: { calories: 420, protein: 32, carbs: 35, fats: 18 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'high',
        dietTags: ['vegetarian', 'high-protein', 'organic', 'halal']
      },
      lunch: {
        name: 'Bison Burger Bowl',
        description: 'Grass-fed bison burger with quinoa and roasted vegetables',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '8 oz grass-fed halal bison',
          '1 cup cooked quinoa',
          'Mixed roasted vegetables',
          'Chimichurri sauce',
          'Microgreens'
        ],
        instructions: [
          'Form and grill bison patty',
          'Cook quinoa',
          'Roast seasonal vegetables',
          'Build bowl and top with chimichurri',
          'Garnish with microgreens'
        ],
        macros: { calories: 780, protein: 58, carbs: 68, fats: 28 },
        prepTime: 35,
        cookingSkill: 'advanced',
        budget: 'high',
        dietTags: ['gluten-free', 'high-protein', 'premium', 'halal']
      },
      afternoonSnack: {
        name: 'Smoked Salmon Rice Cakes',
        description: 'Rice cakes with cream cheese and premium smoked salmon',
        time: '4:00 PM',
        ingredients: [
          '3 rice cakes',
          '3 oz smoked salmon',
          '3 tbsp cream cheese',
          'Capers',
          'Dill'
        ],
        instructions: [
          'Spread cream cheese on rice cakes',
          'Top with smoked salmon',
          'Garnish with capers and dill'
        ],
        macros: { calories: 320, protein: 24, carbs: 28, fats: 12 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'high',
        dietTags: ['high-protein', 'omega-3-rich']
      },
      dinner: {
        name: 'Lobster Tail with Wild Rice',
        description: 'Butter-poached lobster with wild rice pilaf and asparagus',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '2 lobster tails (8 oz)',
          '1 cup wild rice blend',
          '2 cups asparagus',
          '3 tbsp grass-fed butter',
          'Lemon & herbs'
        ],
        instructions: [
          'Poach lobster in butter',
          'Cook wild rice',
          'Roast asparagus',
          'Plate elegantly with lemon'
        ],
        macros: { calories: 620, protein: 48, carbs: 55, fats: 18 },
        prepTime: 40,
        cookingSkill: 'advanced',
        budget: 'high',
        dietTags: ['gluten-free', 'high-protein', 'gourmet']
      },
      eveningSnack: {
        name: 'Grass-Fed Protein Ice Cream',
        description: 'Premium protein ice cream with dark chocolate chips',
        time: '9:30 PM',
        ingredients: ['1 serving grass-fed protein ice cream', '1 tbsp dark chocolate chips', 'Almonds'],
        instructions: ['Top ice cream with chocolate and almonds'],
        macros: { calories: 280, protein: 24, carbs: 22, fats: 10 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'high',
        dietTags: ['vegetarian', 'high-protein', 'treat', 'halal']
      }
    },
    totalMacros: {
      calories: 3540,
      protein: 288,
      carbs: 297,
      fats: 126
    }
  }
];

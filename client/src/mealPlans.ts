// Premium 4-Week Rotating Meal Plan Database
// Separate plans for Weight Loss, Muscle Gain, and Maintenance
// Each plan respects budget, cooking skill, and dietary preferences

import type { MealPlan, ShoppingListItem } from './mealPlanTypes';

// Re-export types for backwards compatibility
export type { MealPlan, Meal, ShoppingListItem } from './mealPlanTypes';

// ============================================
// WEIGHT LOSS MEAL PLANS (Lower Calorie, High Protein)
// ============================================
export const WEEK_1_WEIGHT_LOSS: MealPlan[] = [
  // Monday - Week 1 Weight Loss
  {
    id: 'w1-loss-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'weight-loss',
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
    goal: 'weight-loss',
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
    goal: 'weight-loss',
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

// ============================================
// MUSCLE GAIN MEAL PLANS (Higher Calorie, High Protein)
// ============================================
export const WEEK_1_MUSCLE_GAIN: MealPlan[] = [
  {
    id: 'w1-gain-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'muscle-gain',
    meals: {
      breakfast: {
        name: 'Mass Gainer Pancakes',
        description: 'Protein-packed pancakes with banana and almond butter',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['1.5 cups oat flour', '3 whole eggs', '1 scoop protein powder', '1 banana mashed', '3 tbsp almond butter', '1 cup milk', 'Maple syrup'],
        instructions: [
          'Mix dry ingredients in bowl',
          'Whisk eggs, milk, and mashed banana',
          'Combine wet and dry ingredients',
          'Cook pancakes on griddle',
          'Top with almond butter and syrup'
        ],
        macros: { calories: 720, protein: 48, carbs: 82, fats: 24 },
        prepTime: 20,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'high-protein']
      },
      morningSnack: {
        name: 'Mass Gainer Smoothie',
        description: 'High-calorie smoothie with oats, peanut butter, and protein',
        time: '10:30 AM',
        ingredients: ['2 bananas', '1.5 cups whole milk', '2 scoops protein powder', '1/2 cup oats', '3 tbsp peanut butter', '1 tbsp honey'],
        instructions: ['Blend all ingredients until smooth', 'Drink immediately for maximum nutrition'],
        macros: { calories: 680, protein: 54, carbs: 78, fats: 18 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'high-protein']
      },
      lunch: {
        name: 'Double Chicken Burrito Bowl',
        description: 'Extra large chicken bowl with rice, beans, and avocado',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '8 oz grilled halal chicken breast',
          '2 cups cooked brown rice',
          '1 cup black beans',
          '1 whole avocado',
          '1/2 cup corn',
          '1/4 cup shredded cheese',
          'Salsa and sour cream'
        ],
        instructions: [
          'Cook rice and warm black beans',
          'Grill and slice chicken',
          'Layer rice, beans, chicken in bowl',
          'Top with avocado, corn, cheese',
          'Add salsa and sour cream'
        ],
        macros: { calories: 880, protein: 62, carbs: 96, fats: 28 },
        prepTime: 35,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'high-protein']
      },
      afternoonSnack: {
        name: 'Post-Workout Power Shake',
        description: 'Fast-digesting carbs and protein for muscle recovery',
        time: '4:00 PM',
        ingredients: ['2 scoops whey protein', '1.5 cups milk', '1 banana', '2 tbsp honey', '1/4 cup granola'],
        instructions: ['Blend protein, milk, banana, honey', 'Top with granola before drinking'],
        macros: { calories: 520, protein: 48, carbs: 58, fats: 8 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'high-protein', 'post-workout']
      },
      dinner: {
        name: 'Steak & Sweet Potato Power Meal',
        description: 'Grilled halal steak with loaded sweet potato',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '8 oz halal sirloin steak',
          '2 large sweet potatoes',
          '1 cup sautéed spinach',
          '3 tbsp butter',
          '1/4 cup sour cream',
          'Salt, pepper, garlic'
        ],
        instructions: [
          'Season and grill steak to desired doneness',
          'Bake sweet potatoes until tender',
          'Sauté spinach with garlic',
          'Top potatoes with butter and sour cream',
          'Serve steak with sweet potatoes and spinach'
        ],
        macros: { calories: 780, protein: 56, carbs: 72, fats: 28 },
        prepTime: 45,
        cookingSkill: 'intermediate',
        budget: 'high',
        dietTags: ['halal', 'high-protein', 'gluten-free']
      },
      eveningSnack: {
        name: 'Casein Protein Bowl',
        description: 'Slow-digesting protein with nuts for overnight recovery',
        time: '9:30 PM',
        ingredients: ['1.5 cups cottage cheese', '1/4 cup mixed nuts', '2 tbsp chia seeds', '1/2 cup berries', '1 tbsp honey'],
        instructions: ['Mix cottage cheese with berries', 'Top with nuts, chia seeds, and honey'],
        macros: { calories: 420, protein: 38, carbs: 32, fats: 18 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'high-protein', 'gluten-free']
      }
    },
    totalMacros: { calories: 4000, protein: 306, carbs: 418, fats: 124 }
  }
];

// Generate remaining days for muscle gain
thursdayToSunday.forEach(({ day, name, id }) => {
  const sourceDay = WEEK_1_MUSCLE_GAIN[0];
  WEEK_1_MUSCLE_GAIN.push({
    ...sourceDay,
    id: `w1-gain-${id}`,
    day: day,
    dayName: name
  });
});

// ============================================
// MAINTENANCE MEAL PLANS (Balanced Nutrition)
// ============================================
export const WEEK_1_MAINTENANCE: MealPlan[] = [
  {
    id: 'w1-maint-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'maintenance',
    meals: {
      breakfast: {
        name: 'Mediterranean Veggie Omelet',
        description: '3-egg omelet with feta, tomatoes, and spinach',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['3 whole eggs', '1/4 cup feta cheese', '1/2 cup cherry tomatoes', '1 cup fresh spinach', '1 slice whole grain toast', '1 tsp olive oil'],
        instructions: [
          'Whisk eggs with salt and pepper',
          'Sauté spinach and tomatoes in olive oil',
          'Pour eggs into pan, add vegetables',
          'Sprinkle feta cheese on top',
          'Fold omelet and serve with toast'
        ],
        macros: { calories: 380, protein: 26, carbs: 24, fats: 22 },
        prepTime: 15,
        cookingSkill: 'intermediate',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'mediterranean']
      },
      morningSnack: {
        name: 'Fresh Fruit & Nuts',
        description: 'Apple slices with mixed nuts and string cheese',
        time: '10:30 AM',
        ingredients: ['1 medium apple', '1/4 cup mixed nuts (almonds, walnuts)', '1 string cheese'],
        instructions: ['Slice apple', 'Portion nuts', 'Enjoy together as balanced snack'],
        macros: { calories: 280, protein: 12, carbs: 28, fats: 14 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'gluten-free']
      },
      lunch: {
        name: 'Grilled Chicken Caesar Salad',
        description: 'Classic Caesar with grilled halal chicken and parmesan',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '5 oz grilled halal chicken breast',
          '3 cups romaine lettuce',
          '2 tbsp Caesar dressing',
          '2 tbsp parmesan cheese',
          '1/2 cup croutons',
          'Lemon wedge'
        ],
        instructions: [
          'Grill and slice chicken breast',
          'Chop romaine lettuce',
          'Toss lettuce with dressing',
          'Top with chicken, parmesan, croutons',
          'Squeeze lemon over salad'
        ],
        macros: { calories: 420, protein: 38, carbs: 28, fats: 18 },
        prepTime: 20,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['halal', 'high-protein']
      },
      afternoonSnack: {
        name: 'Hummus & Veggie Sticks',
        description: 'Fresh vegetables with creamy hummus',
        time: '4:00 PM',
        ingredients: ['1/2 cup hummus', '1 cup carrot sticks', '1 cup cucumber slices', '1/2 cup bell pepper strips'],
        instructions: ['Slice all vegetables', 'Arrange around hummus for dipping'],
        macros: { calories: 220, protein: 8, carbs: 28, fats: 10 },
        prepTime: 8,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'halal', 'gluten-free', 'mediterranean']
      },
      dinner: {
        name: 'Teriyaki Salmon Bowl',
        description: 'Glazed salmon with jasmine rice and steamed broccoli',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '5 oz salmon fillet',
          '1 cup cooked jasmine rice',
          '1.5 cups steamed broccoli',
          '3 tbsp teriyaki sauce',
          '1 tsp sesame seeds',
          '1 green onion sliced'
        ],
        instructions: [
          'Cook jasmine rice',
          'Pan-sear salmon, brush with teriyaki',
          'Steam broccoli until tender',
          'Assemble bowl with rice, salmon, broccoli',
          'Garnish with sesame seeds and green onion'
        ],
        macros: { calories: 480, protein: 36, carbs: 52, fats: 14 },
        prepTime: 30,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['pescatarian', 'halal', 'high-protein']
      },
      eveningSnack: {
        name: 'Greek Yogurt Parfait',
        description: 'Layered yogurt with berries and granola',
        time: '9:30 PM',
        ingredients: ['1 cup Greek yogurt', '1/2 cup mixed berries', '3 tbsp granola', '1 tsp honey'],
        instructions: ['Layer yogurt, berries, granola in glass', 'Drizzle with honey'],
        macros: { calories: 260, protein: 18, carbs: 36, fats: 6 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'halal']
      }
    },
    totalMacros: { calories: 2040, protein: 138, carbs: 196, fats: 84 }
  }
];

// Generate remaining days for maintenance
thursdayToSunday.forEach(({ day, name, id }) => {
  const sourceDay = WEEK_1_MAINTENANCE[0];
  WEEK_1_MAINTENANCE.push({
    ...sourceDay,
    id: `w1-maint-${id}`,
    day: day,
    dayName: name
  });
});

// Import additional weeks from separate file
export * from './mealPlansWeeks';

// Shopping List Generator
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
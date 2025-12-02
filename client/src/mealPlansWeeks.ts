// ============================================
// ADDITIONAL MEAL PLAN WEEKS (2-4)
// Week 2: Asian-Inspired Cuisine
// Week 3: Mexican/Latin Fusion  
// Week 4: Western/Mediterranean Classics
// ============================================

import { MealPlan } from './mealPlans';

// ============================================
// WEEK 2: ASIAN-INSPIRED - WEIGHT LOSS
// ============================================
export const WEEK_2_WEIGHT_LOSS: MealPlan[] = [
  {
    id: 'w2-loss-mon',
    week: 2,
    day: 1,
    dayName: 'Monday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'Japanese Tamagoyaki',
        description: 'Rolled egg omelette with green tea',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['3 eggs', '1 tbsp soy sauce', '1 tsp mirin', '1/2 cup steamed rice', 'Green onions', 'Green tea'],
        instructions: [
          'Beat eggs with soy sauce and mirin',
          'Pour thin layer in pan, roll when set',
          'Repeat layering and rolling',
          'Slice and serve with rice',
          'Garnish with green onions'
        ],
        macros: { calories: 295, protein: 22, carbs: 28, fats: 10 },
        prepTime: 15,
        cookingSkill: 'intermediate',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'asian', 'gluten-free']
      },
      morningSnack: {
        name: 'Edamame & Seaweed Snack',
        description: 'Steamed soybeans with nori sheets',
        time: '10:30 AM',
        ingredients: ['1 cup edamame', '2 nori sheets', 'Sea salt', 'Lemon juice'],
        instructions: ['Steam edamame until tender', 'Sprinkle with sea salt', 'Serve with nori sheets'],
        macros: { calories: 180, protein: 15, carbs: 12, fats: 7 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'halal', 'asian', 'gluten-free', 'budget-friendly']
      },
      lunch: {
        name: 'Vietnamese Pho Bowl',
        description: 'Light beef broth with rice noodles and herbs',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '4 oz halal beef sirloin',
          '2 oz rice noodles',
          '4 cups beef broth',
          'Bean sprouts',
          'Fresh basil',
          'Lime wedge',
          'Sriracha'
        ],
        instructions: [
          'Bring broth to boil',
          'Cook rice noodles separately',
          'Slice beef thinly',
          'Assemble: noodles, raw beef, hot broth',
          'Top with sprouts, basil, lime, sriracha'
        ],
        macros: { calories: 340, protein: 32, carbs: 35, fats: 8 },
        prepTime: 25,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'asian', 'high-protein']
      },
      afternoonSnack: {
        name: 'Miso Soup',
        description: 'Traditional Japanese soup with tofu',
        time: '4:00 PM',
        ingredients: ['2 cups water', '2 tbsp miso paste', '3 oz silken tofu', 'Wakame seaweed', 'Green onions'],
        instructions: ['Heat water', 'Dissolve miso paste', 'Add tofu and seaweed', 'Garnish with green onions'],
        macros: { calories: 85, protein: 7, carbs: 8, fats: 3 },
        prepTime: 8,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'halal', 'asian', 'gluten-free', 'budget-friendly']
      },
      dinner: {
        name: 'Thai Basil Chicken Stir-Fry',
        description: 'Spicy chicken with holy basil over cauliflower rice',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '5 oz halal chicken breast',
          '2 cups cauliflower rice',
          '1 cup Thai basil',
          '2 cloves garlic',
          '2 tbsp fish sauce',
          '1 tbsp oyster sauce',
          '1 Thai chili'
        ],
        instructions: [
          'Stir-fry chicken until cooked',
          'Add garlic and chili',
          'Add sauces and basil',
          'Serve over cauliflower rice'
        ],
        macros: { calories: 285, protein: 38, carbs: 18, fats: 7 },
        prepTime: 20,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'asian', 'high-protein', 'low-carb']
      },
      eveningSnack: {
        name: 'Matcha Protein Pudding',
        description: 'Green tea pudding with chia seeds',
        time: '9:30 PM',
        ingredients: ['1 scoop vanilla protein powder', '1 tsp matcha powder', '1 cup almond milk', '2 tbsp chia seeds'],
        instructions: ['Mix all ingredients', 'Refrigerate 2 hours or overnight', 'Enjoy chilled'],
        macros: { calories: 165, protein: 22, carbs: 12, fats: 5 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'asian', 'high-protein']
      }
    },
    totalMacros: { calories: 1350, protein: 136, carbs: 113, fats: 40 }
  }
];

// Auto-generate remaining days for Week 2 Weight Loss
const week2Days = [
  { day: 2, name: 'Tuesday', id: 'tue' },
  { day: 3, name: 'Wednesday', id: 'wed' },
  { day: 4, name: 'Thursday', id: 'thu' },
  { day: 5, name: 'Friday', id: 'fri' },
  { day: 6, name: 'Saturday', id: 'sat' },
  { day: 7, name: 'Sunday', id: 'sun' }
];

week2Days.forEach(({ day, name, id }) => {
  const sourceDay = WEEK_2_WEIGHT_LOSS[0];
  WEEK_2_WEIGHT_LOSS.push({
    ...sourceDay,
    id: `w2-loss-${id}`,
    day: day,
    dayName: name
  });
});

// ============================================
// WEEK 2: ASIAN-INSPIRED - MUSCLE GAIN
// ============================================
export const WEEK_2_MUSCLE_GAIN: MealPlan[] = [
  {
    id: 'w2-gain-mon',
    week: 2,
    day: 1,
    dayName: 'Monday',
    goal: 'muscle-gain',
    meals: {
      breakfast: {
        name: 'Korean Bulgogi Rice Bowl',
        description: 'Marinated beef with fried eggs over rice',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['6 oz halal beef', '2 cups white rice', '3 fried eggs', '2 tbsp sesame oil', 'Soy sauce', 'Green onions', 'Sesame seeds'],
        instructions: [
          'Marinate beef in soy and sesame',
          'Stir-fry beef until caramelized',
          'Fry eggs sunny-side up',
          'Serve over rice with eggs on top',
          'Garnish with sesame and green onions'
        ],
        macros: { calories: 780, protein: 52, carbs: 85, fats: 22 },
        prepTime: 25,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'asian', 'high-protein']
      },
      morningSnack: {
        name: 'Peanut Butter Mochi',
        description: 'Sweet rice cakes with peanut butter filling',
        time: '10:30 AM',
        ingredients: ['3 mochi rice cakes', '3 tbsp peanut butter', '1 banana sliced', '1 tbsp honey'],
        instructions: ['Microwave mochi 30 seconds', 'Spread with peanut butter', 'Top with banana and honey'],
        macros: { calories: 520, protein: 15, carbs: 72, fats: 20 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'asian', 'budget-friendly']
      },
      lunch: {
        name: 'Teriyaki Salmon Don',
        description: 'Grilled salmon over sushi rice with avocado',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '7 oz salmon fillet',
          '2 cups sushi rice',
          '1 whole avocado',
          '4 tbsp teriyaki sauce',
          'Pickled ginger',
          'Wasabi',
          'Nori strips'
        ],
        instructions: [
          'Grill salmon with teriyaki glaze',
          'Prepare sushi rice',
          'Slice avocado',
          'Assemble bowl: rice, salmon, avocado',
          'Top with extra teriyaki and nori'
        ],
        macros: { calories: 850, protein: 48, carbs: 95, fats: 28 },
        prepTime: 30,
        cookingSkill: 'intermediate',
        budget: 'high',
        dietTags: ['halal', 'asian', 'high-protein', 'pescatarian']
      },
      afternoonSnack: {
        name: 'Trail Mix with Wasabi Peas',
        description: 'Crunchy Asian-inspired snack mix',
        time: '4:00 PM',
        ingredients: ['1/2 cup wasabi peas', '1/4 cup cashews', '1/4 cup dried mango', '2 tbsp coconut flakes'],
        instructions: ['Mix all ingredients in bowl', 'Portion and enjoy'],
        macros: { calories: 380, protein: 12, carbs: 45, fats: 18 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegan', 'halal', 'asian', 'gluten-free']
      },
      dinner: {
        name: 'Mongolian Beef with Noodles',
        description: 'Sweet and savory beef over thick noodles',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '8 oz halal beef flank steak',
          '3 cups udon noodles',
          '1/4 cup hoisin sauce',
          '3 tbsp soy sauce',
          '2 tbsp brown sugar',
          'Garlic and ginger',
          'Green onions'
        ],
        instructions: [
          'Slice beef thinly',
          'Cook udon noodles',
          'Stir-fry beef with garlic and ginger',
          'Add hoisin, soy, brown sugar',
          'Toss with noodles and green onions'
        ],
        macros: { calories: 720, protein: 56, carbs: 78, fats: 18 },
        prepTime: 25,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'asian', 'high-protein']
      },
      eveningSnack: {
        name: 'Coconut Rice Pudding',
        description: 'Sweet sticky rice with coconut milk',
        time: '9:30 PM',
        ingredients: ['1 cup cooked sticky rice', '1/2 cup coconut milk', '2 tbsp honey', '1 tbsp chia seeds', 'Mango slices'],
        instructions: ['Heat rice with coconut milk', 'Stir in honey and chia', 'Top with fresh mango'],
        macros: { calories: 420, protein: 8, carbs: 68, fats: 14 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'halal', 'asian', 'gluten-free']
      }
    },
    totalMacros: { calories: 3670, protein: 191, carbs: 443, fats: 120 }
  }
];

// Auto-generate Week 2 Muscle Gain remaining days
week2Days.forEach(({ day, name, id }) => {
  const sourceDay = WEEK_2_MUSCLE_GAIN[0];
  WEEK_2_MUSCLE_GAIN.push({
    ...sourceDay,
    id: `w2-gain-${id}`,
    day: day,
    dayName: name
  });
});

// ============================================
// WEEK 2: ASIAN-INSPIRED - MAINTENANCE
// ============================================
export const WEEK_2_MAINTENANCE: MealPlan[] = [
  {
    id: 'w2-maint-mon',
    week: 2,
    day: 1,
    dayName: 'Monday',
    goal: 'maintenance',
    meals: {
      breakfast: {
        name: 'Congee with Century Egg',
        description: 'Rice porridge with preserved egg and ginger',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['1/2 cup rice', '4 cups chicken broth', '1 century egg', 'Fresh ginger', 'Green onions', 'Soy sauce'],
        instructions: [
          'Simmer rice in broth until creamy',
          'Slice century egg',
          'Top congee with egg, ginger, green onions',
          'Drizzle with soy sauce'
        ],
        macros: { calories: 320, protein: 15, carbs: 48, fats: 8 },
        prepTime: 40,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['asian', 'budget-friendly']
      },
      morningSnack: {
        name: 'Steamed Bao Bun',
        description: 'Fluffy steamed bun with sweet red bean paste',
        time: '10:30 AM',
        ingredients: ['2 steamed buns', '4 tbsp red bean paste'],
        instructions: ['Steam buns until fluffy', 'Fill with red bean paste', 'Enjoy warm'],
        macros: { calories: 240, protein: 7, carbs: 45, fats: 3 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'halal', 'asian', 'budget-friendly']
      },
      lunch: {
        name: 'Pad Thai',
        description: 'Classic Thai stir-fried noodles with shrimp',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '4 oz shrimp',
          '3 oz rice noodles',
          '2 eggs',
          'Bean sprouts',
          'Peanuts',
          'Lime',
          'Tamarind sauce',
          'Fish sauce'
        ],
        instructions: [
          'Soak rice noodles',
          'Stir-fry shrimp',
          'Push aside, scramble eggs',
          'Add noodles and sauces',
          'Top with sprouts, peanuts, lime'
        ],
        macros: { calories: 480, protein: 32, carbs: 58, fats: 14 },
        prepTime: 20,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'asian', 'pescatarian']
      },
      afternoonSnack: {
        name: 'Spring Rolls',
        description: 'Fresh Vietnamese rolls with peanut sauce',
        time: '4:00 PM',
        ingredients: ['2 rice paper sheets', 'Lettuce', 'Cucumber', 'Carrots', 'Mint', 'Vermicelli', 'Peanut sauce'],
        instructions: ['Soften rice paper', 'Layer vegetables and vermicelli', 'Roll tightly', 'Serve with peanut sauce'],
        macros: { calories: 220, protein: 6, carbs: 35, fats: 7 },
        prepTime: 15,
        cookingSkill: 'intermediate',
        budget: 'low',
        dietTags: ['vegan', 'halal', 'asian', 'budget-friendly']
      },
      dinner: {
        name: 'Korean Bibimbap',
        description: 'Mixed rice bowl with vegetables and egg',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '1.5 cups white rice',
          '4 oz halal beef bulgogi',
          'Spinach',
          'Carrots',
          'Mushrooms',
          '1 fried egg',
          'Gochujang sauce',
          'Sesame oil'
        ],
        instructions: [
          'Prepare rice',
          'Sauté each vegetable separately',
          'Cook bulgogi beef',
          'Arrange in bowl: rice, vegetables, beef',
          'Top with fried egg and gochujang'
        ],
        macros: { calories: 520, protein: 35, carbs: 62, fats: 16 },
        prepTime: 35,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'asian', 'high-protein']
      },
      eveningSnack: {
        name: 'Green Tea Ice Cream',
        description: 'Homemade matcha ice cream',
        time: '9:30 PM',
        ingredients: ['1/2 cup Greek yogurt', '1 tsp matcha powder', '1 tbsp honey', 'Freeze 2 hours'],
        instructions: ['Mix yogurt, matcha, honey', 'Freeze until firm', 'Scoop and serve'],
        macros: { calories: 180, protein: 12, carbs: 24, fats: 4 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'asian']
      }
    },
    totalMacros: { calories: 1960, protein: 107, carbs: 272, fats: 52 }
  }
];

// Auto-generate Week 2 Maintenance remaining days
week2Days.forEach(({ day, name, id }) => {
  const sourceDay = WEEK_2_MAINTENANCE[0];
  WEEK_2_MAINTENANCE.push({
    ...sourceDay,
    id: `w2-maint-${id}`,
    day: day,
    dayName: name
  });
});

// ============================================
// WEEK 3: MEXICAN/LATIN - WEIGHT LOSS
// ============================================
export const WEEK_3_WEIGHT_LOSS: MealPlan[] = [
  {
    id: 'w3-loss-mon',
    week: 3,
    day: 1,
    dayName: 'Monday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'Huevos Rancheros Light',
        description: 'Eggs on corn tortilla with salsa and black beans',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['2 eggs', '1 corn tortilla', '1/4 cup black beans', '1/4 cup salsa', 'Cilantro', 'Lime'],
        instructions: [
          'Warm tortilla',
          'Fry or poach eggs',
          'Heat black beans',
          'Assemble: tortilla, beans, eggs, salsa',
          'Garnish with cilantro and lime'
        ],
        macros: { calories: 280, protein: 18, carbs: 30, fats: 10 },
        prepTime: 15,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'mexican', 'gluten-free', 'budget-friendly']
      },
      morningSnack: {
        name: 'Jicama with Chile Lime',
        description: 'Crispy jicama sticks with spicy seasoning',
        time: '10:30 AM',
        ingredients: ['1 cup jicama sticks', '1 lime', 'Chili powder', 'Salt'],
        instructions: ['Cut jicama into sticks', 'Squeeze lime juice', 'Sprinkle with chili and salt'],
        macros: { calories: 60, protein: 2, carbs: 14, fats: 0 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'halal', 'mexican', 'gluten-free', 'budget-friendly']
      },
      lunch: {
        name: 'Chicken Taco Lettuce Wraps',
        description: 'Spiced chicken in crisp lettuce cups',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '5 oz halal chicken breast',
          '6 lettuce cups',
          'Taco seasoning',
          'Diced tomatoes',
          'Onions',
          'Cilantro',
          '2 tbsp Greek yogurt'
        ],
        instructions: [
          'Cook chicken with taco seasoning',
          'Shred chicken',
          'Fill lettuce cups',
          'Top with tomatoes, onions, cilantro',
          'Drizzle with Greek yogurt'
        ],
        macros: { calories: 245, protein: 38, carbs: 12, fats: 6 },
        prepTime: 20,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['halal', 'mexican', 'high-protein', 'low-carb', 'budget-friendly']
      },
      afternoonSnack: {
        name: 'Guacamole with Veggies',
        description: 'Fresh avocado dip with cucumber and peppers',
        time: '4:00 PM',
        ingredients: ['1/2 avocado', '1 tomato', 'Lime juice', 'Cilantro', 'Cucumber', 'Bell peppers'],
        instructions: ['Mash avocado', 'Mix with diced tomato, lime, cilantro', 'Serve with veggie sticks'],
        macros: { calories: 150, protein: 3, carbs: 15, fats: 10 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'halal', 'mexican', 'gluten-free', 'budget-friendly']
      },
      dinner: {
        name: 'Grilled Fish Tacos',
        description: 'Lime-marinated white fish with cabbage slaw',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '5 oz white fish',
          '2 small corn tortillas',
          '1 cup cabbage slaw',
          'Lime',
          'Cilantro',
          'Jalapeño',
          'Greek yogurt sauce'
        ],
        instructions: [
          'Marinate fish in lime juice',
          'Grill fish until flaky',
          'Prepare cabbage slaw',
          'Warm tortillas',
          'Assemble tacos with fish, slaw, yogurt'
        ],
        macros: { calories: 320, protein: 35, carbs: 28, fats: 9 },
        prepTime: 25,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'mexican', 'pescatarian', 'high-protein']
      },
      eveningSnack: {
        name: 'Mexican Hot Chocolate Protein',
        description: 'Cinnamon cocoa protein shake',
        time: '9:30 PM',
        ingredients: ['1 scoop chocolate protein', '1 cup almond milk', '1/2 tsp cinnamon', '1/4 tsp cayenne', 'Ice'],
        instructions: ['Blend all ingredients until smooth', 'Serve chilled'],
        macros: { calories: 150, protein: 25, carbs: 8, fats: 3 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'mexican', 'high-protein']
      }
    },
    totalMacros: { calories: 1205, protein: 121, carbs: 107, fats: 38 }
  }
];

// Auto-generate Week 3 Weight Loss remaining days
const week3Days = week2Days;
week3Days.forEach(({ day, name, id }) => {
  const sourceDay = WEEK_3_WEIGHT_LOSS[0];
  WEEK_3_WEIGHT_LOSS.push({
    ...sourceDay,
    id: `w3-loss-${id}`,
    day: day,
    dayName: name
  });
});

// ============================================
// WEEK 3: MEXICAN/LATIN - MUSCLE GAIN
// ============================================
export const WEEK_3_MUSCLE_GAIN: MealPlan[] = [
  {
    id: 'w3-gain-mon',
    week: 3,
    day: 1,
    dayName: 'Monday',
    goal: 'muscle-gain',
    meals: {
      breakfast: {
        name: 'Chilaquiles with Chorizo',
        description: 'Fried tortilla chips with eggs, chorizo, and cheese',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['4 corn tortillas fried', '3 eggs scrambled', '4 oz halal beef chorizo', '1/2 cup refried beans', '1/4 cup cheese', 'Salsa verde', 'Sour cream'],
        instructions: [
          'Fry tortilla strips until crispy',
          'Cook chorizo',
          'Scramble eggs',
          'Layer: chips, beans, chorizo, eggs',
          'Top with cheese, salsa, sour cream'
        ],
        macros: { calories: 720, protein: 42, carbs: 55, fats: 35 },
        prepTime: 25,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'mexican', 'high-protein']
      },
      morningSnack: {
        name: 'Protein Churros',
        description: 'Baked cinnamon protein bites',
        time: '10:30 AM',
        ingredients: ['1 scoop vanilla protein', '1/4 cup almond flour', '1 egg', '2 tbsp honey', 'Cinnamon sugar coating'],
        instructions: ['Mix ingredients into dough', 'Shape into churro sticks', 'Bake at 350°F for 15 min', 'Roll in cinnamon sugar'],
        macros: { calories: 380, protein: 32, carbs: 35, fats: 12 },
        prepTime: 20,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'mexican', 'high-protein']
      },
      lunch: {
        name: 'Loaded Burrito Bowl',
        description: 'Rice, beans, steak, and all the fixings',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '8 oz halal steak',
          '1.5 cups cilantro lime rice',
          '1 cup black beans',
          '1/2 cup corn',
          '1 whole avocado',
          'Cheese',
          'Sour cream',
          'Salsa'
        ],
        instructions: [
          'Grill and slice steak',
          'Prepare cilantro lime rice',
          'Heat beans and corn',
          'Build bowl: rice, beans, corn, steak',
          'Top with avocado, cheese, sour cream, salsa'
        ],
        macros: { calories: 920, protein: 62, carbs: 95, fats: 32 },
        prepTime: 30,
        cookingSkill: 'intermediate',
        budget: 'high',
        dietTags: ['halal', 'mexican', 'high-protein']
      },
      afternoonSnack: {
        name: 'Nachos with Beef',
        description: 'Tortilla chips with seasoned beef and cheese',
        time: '4:00 PM',
        ingredients: ['2 oz tortilla chips', '4 oz halal ground beef', 'Taco seasoning', '1/4 cup cheese', 'Jalapeños', 'Salsa'],
        instructions: ['Brown beef with seasoning', 'Layer chips with beef and cheese', 'Microwave until cheese melts', 'Top with jalapeños and salsa'],
        macros: { calories: 520, protein: 32, carbs: 42, fats: 24 },
        prepTime: 15,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['halal', 'mexican']
      },
      dinner: {
        name: 'Carne Asada Plate',
        description: 'Grilled marinated steak with rice and beans',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '8 oz halal flank steak',
          '1.5 cups Mexican rice',
          '1 cup pinto beans',
          'Lime',
          'Cilantro',
          'Grilled onions',
          'Tortillas'
        ],
        instructions: [
          'Marinate steak in lime and spices',
          'Grill steak to medium-rare',
          'Prepare rice and beans',
          'Grill onions',
          'Serve steak with sides and tortillas'
        ],
        macros: { calories: 780, protein: 58, carbs: 85, fats: 22 },
        prepTime: 35,
        cookingSkill: 'intermediate',
        budget: 'high',
        dietTags: ['halal', 'mexican', 'high-protein']
      },
      eveningSnack: {
        name: 'Tres Leches Protein Shake',
        description: 'Three-milk inspired protein smoothie',
        time: '9:30 PM',
        ingredients: ['1.5 scoops vanilla protein', '1/2 cup whole milk', '1/4 cup condensed milk', '1/4 cup evaporated milk', 'Cinnamon', 'Ice'],
        instructions: ['Blend all ingredients', 'Serve with cinnamon on top'],
        macros: { calories: 450, protein: 42, carbs: 48, fats: 10 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'mexican', 'high-protein']
      }
    },
    totalMacros: { calories: 3770, protein: 268, carbs: 360, fats: 135 }
  }
];

// Auto-generate Week 3 Muscle Gain remaining days
week3Days.forEach(({ day, name, id }) => {
  const sourceDay = WEEK_3_MUSCLE_GAIN[0];
  WEEK_3_MUSCLE_GAIN.push({
    ...sourceDay,
    id: `w3-gain-${id}`,
    day: day,
    dayName: name
  });
});

// ============================================
// WEEK 3: MEXICAN/LATIN - MAINTENANCE
// ============================================
export const WEEK_3_MAINTENANCE: MealPlan[] = [
  {
    id: 'w3-maint-mon',
    week: 3,
    day: 1,
    dayName: 'Monday',
    goal: 'maintenance',
    meals: {
      breakfast: {
        name: 'Breakfast Burrito',
        description: 'Scrambled eggs, black beans, and salsa in tortilla',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['2 eggs', '1 large whole wheat tortilla', '1/4 cup black beans', '2 tbsp cheese', 'Salsa', 'Avocado slices'],
        instructions: [
          'Scramble eggs',
          'Warm tortilla',
          'Layer eggs, beans, cheese in tortilla',
          'Add salsa and avocado',
          'Roll and enjoy'
        ],
        macros: { calories: 420, protein: 22, carbs: 42, fats: 18 },
        prepTime: 12,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'mexican', 'budget-friendly']
      },
      morningSnack: {
        name: 'Elote (Mexican Street Corn)',
        description: 'Grilled corn with lime and cotija',
        time: '10:30 AM',
        ingredients: ['1 ear of corn', '1 tbsp mayo', '1 tbsp cotija cheese', 'Chili powder', 'Lime'],
        instructions: ['Grill corn', 'Brush with mayo', 'Sprinkle cheese and chili', 'Squeeze lime'],
        macros: { calories: 180, protein: 5, carbs: 24, fats: 8 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'mexican', 'budget-friendly']
      },
      lunch: {
        name: 'Chicken Enchiladas',
        description: 'Rolled tortillas with chicken in red sauce',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '5 oz halal chicken',
          '2 corn tortillas',
          '1/2 cup enchilada sauce',
          '1/4 cup cheese',
          'Onions',
          'Cilantro'
        ],
        instructions: [
          'Shred cooked chicken',
          'Fill tortillas with chicken',
          'Roll and place in dish',
          'Cover with sauce and cheese',
          'Bake at 375°F for 20 min'
        ],
        macros: { calories: 480, protein: 42, carbs: 38, fats: 16 },
        prepTime: 35,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'mexican', 'high-protein']
      },
      afternoonSnack: {
        name: 'Bean and Cheese Quesadilla',
        description: 'Crispy tortilla with refried beans and cheese',
        time: '4:00 PM',
        ingredients: ['1 flour tortilla', '1/4 cup refried beans', '2 tbsp shredded cheese', 'Salsa for dipping'],
        instructions: ['Spread beans on half of tortilla', 'Sprinkle cheese', 'Fold and grill until crispy', 'Serve with salsa'],
        macros: { calories: 280, protein: 12, carbs: 35, fats: 10 },
        prepTime: 8,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'mexican', 'budget-friendly']
      },
      dinner: {
        name: 'Shrimp Fajitas',
        description: 'Sizzling shrimp with peppers and onions',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '5 oz shrimp',
          'Bell peppers',
          'Onions',
          'Fajita seasoning',
          '2 small tortillas',
          'Lime',
          'Cilantro'
        ],
        instructions: [
          'Sauté peppers and onions',
          'Add shrimp and seasoning',
          'Cook until shrimp are pink',
          'Serve with warm tortillas',
          'Garnish with lime and cilantro'
        ],
        macros: { calories: 420, protein: 38, carbs: 45, fats: 10 },
        prepTime: 20,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['halal', 'mexican', 'pescatarian', 'high-protein']
      },
      eveningSnack: {
        name: 'Flan',
        description: 'Light caramel custard',
        time: '9:30 PM',
        ingredients: ['1 egg', '1/2 cup milk', '2 tbsp sugar', 'Vanilla', 'Caramel'],
        instructions: ['Whisk egg, milk, sugar, vanilla', 'Pour into ramekin', 'Bake in water bath 30 min', 'Chill and serve with caramel'],
        macros: { calories: 220, protein: 8, carbs: 32, fats: 7 },
        prepTime: 40,
        cookingSkill: 'intermediate',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'mexican']
      }
    },
    totalMacros: { calories: 2000, protein: 127, carbs: 216, fats: 69 }
  }
];

// Auto-generate Week 3 Maintenance remaining days
week3Days.forEach(({ day, name, id }) => {
  const sourceDay = WEEK_3_MAINTENANCE[0];
  WEEK_3_MAINTENANCE.push({
    ...sourceDay,
    id: `w3-maint-${id}`,
    day: day,
    dayName: name
  });
});

// ============================================
// WEEK 4: WESTERN/MEDITERRANEAN - WEIGHT LOSS
// ============================================
export const WEEK_4_WEIGHT_LOSS: MealPlan[] = [
  {
    id: 'w4-loss-mon',
    week: 4,
    day: 1,
    dayName: 'Monday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'Greek Yogurt Parfait',
        description: 'Layered yogurt with berries and nuts',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['1 cup Greek yogurt', '1/2 cup mixed berries', '2 tbsp granola', '1 tbsp honey', '10 almonds'],
        instructions: [
          'Layer yogurt in glass',
          'Add berries',
          'Top with granola and almonds',
          'Drizzle honey'
        ],
        macros: { calories: 320, protein: 20, carbs: 38, fats: 10 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'mediterranean', 'gluten-free']
      },
      morningSnack: {
        name: 'Hummus with Carrot Sticks',
        description: 'Creamy chickpea dip with fresh vegetables',
        time: '10:30 AM',
        ingredients: ['1/3 cup hummus', '1 cup carrot sticks', '1/2 cup cucumber slices'],
        instructions: ['Portion hummus into bowl', 'Arrange vegetables for dipping'],
        macros: { calories: 150, protein: 6, carbs: 20, fats: 6 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'halal', 'mediterranean', 'gluten-free', 'budget-friendly']
      },
      lunch: {
        name: 'Mediterranean Chicken Bowl',
        description: 'Grilled chicken with quinoa, feta, and olives',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '5 oz halal chicken breast',
          '1/2 cup quinoa',
          'Cherry tomatoes',
          'Cucumber',
          '2 tbsp feta cheese',
          'Kalamata olives',
          'Lemon vinaigrette'
        ],
        instructions: [
          'Grill seasoned chicken',
          'Cook quinoa',
          'Dice vegetables',
          'Assemble bowl',
          'Drizzle with lemon vinaigrette'
        ],
        macros: { calories: 385, protein: 42, carbs: 32, fats: 12 },
        prepTime: 25,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'mediterranean', 'high-protein', 'gluten-free']
      },
      afternoonSnack: {
        name: 'Caprese Skewers',
        description: 'Tomato, mozzarella, and basil bites',
        time: '4:00 PM',
        ingredients: ['6 cherry tomatoes', '6 mozzarella balls', 'Fresh basil leaves', 'Balsamic glaze'],
        instructions: ['Skewer tomato, basil, mozzarella', 'Arrange on plate', 'Drizzle with balsamic'],
        macros: { calories: 120, protein: 8, carbs: 6, fats: 8 },
        prepTime: 8,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'mediterranean', 'gluten-free']
      },
      dinner: {
        name: 'Baked Cod with Ratatouille',
        description: 'Herb-crusted fish with French vegetable stew',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '6 oz cod fillet',
          'Zucchini',
          'Eggplant',
          'Tomatoes',
          'Bell peppers',
          'Garlic',
          'Herbs de Provence',
          'Olive oil'
        ],
        instructions: [
          'Bake cod with herbs',
          'Sauté vegetables for ratatouille',
          'Simmer until tender',
          'Serve fish over ratatouille'
        ],
        macros: { calories: 295, protein: 38, carbs: 22, fats: 8 },
        prepTime: 35,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'mediterranean', 'pescatarian', 'high-protein', 'gluten-free']
      },
      eveningSnack: {
        name: 'Dark Chocolate with Berries',
        description: 'Antioxidant-rich evening treat',
        time: '9:30 PM',
        ingredients: ['1 oz dark chocolate (70% cacao)', '1/2 cup strawberries'],
        instructions: ['Melt chocolate', 'Dip strawberries', 'Enjoy'],
        macros: { calories: 180, protein: 3, carbs: 22, fats: 10 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegan', 'halal', 'mediterranean']
      }
    },
    totalMacros: { calories: 1450, protein: 117, carbs: 140, fats: 54 }
  }
];

// Auto-generate Week 4 Weight Loss remaining days
const week4Days = week2Days;
week4Days.forEach(({ day, name, id }) => {
  const sourceDay = WEEK_4_WEIGHT_LOSS[0];
  WEEK_4_WEIGHT_LOSS.push({
    ...sourceDay,
    id: `w4-loss-${id}`,
    day: day,
    dayName: name
  });
});

// ============================================
// WEEK 4: WESTERN/MEDITERRANEAN - MUSCLE GAIN
// ============================================
export const WEEK_4_MUSCLE_GAIN: MealPlan[] = [
  {
    id: 'w4-gain-mon',
    week: 4,
    day: 1,
    dayName: 'Monday',
    goal: 'muscle-gain',
    meals: {
      breakfast: {
        name: 'Full English Breakfast',
        description: 'Eggs, sausage, beans, toast, and mushrooms',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['3 eggs', '3 halal beef sausages', '1 cup baked beans', '2 slices whole wheat toast', 'Mushrooms', '1 tomato', 'Butter'],
        instructions: [
          'Grill sausages',
          'Fry eggs',
          'Heat beans',
          'Sauté mushrooms',
          'Grill tomato',
          'Toast bread',
          'Assemble on plate'
        ],
        macros: { calories: 780, protein: 48, carbs: 72, fats: 32 },
        prepTime: 25,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'western', 'high-protein']
      },
      morningSnack: {
        name: 'Protein Oatmeal with Nuts',
        description: 'Hearty oats with protein powder and mixed nuts',
        time: '10:30 AM',
        ingredients: ['1 cup oats', '1 scoop protein powder', '2 tbsp peanut butter', '1/4 cup mixed nuts', '1 banana', 'Honey'],
        instructions: ['Cook oats', 'Stir in protein powder', 'Top with peanut butter, nuts, banana', 'Drizzle honey'],
        macros: { calories: 620, protein: 42, carbs: 68, fats: 22 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'western', 'high-protein']
      },
      lunch: {
        name: 'Beef Lasagna',
        description: 'Layered pasta with beef ragù and béchamel',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '6 oz halal ground beef',
          'Lasagna noodles',
          'Marinara sauce',
          'Ricotta cheese',
          'Mozzarella',
          'Parmesan',
          'Béchamel sauce'
        ],
        instructions: [
          'Brown beef with marinara',
          'Layer noodles, beef, ricotta, mozzarella',
          'Top with béchamel and parmesan',
          'Bake at 375°F for 35 min'
        ],
        macros: { calories: 850, protein: 54, carbs: 78, fats: 32 },
        prepTime: 60,
        cookingSkill: 'advanced',
        budget: 'high',
        dietTags: ['halal', 'mediterranean', 'high-protein']
      },
      afternoonSnack: {
        name: 'Protein Smoothie Bowl',
        description: 'Thick smoothie with granola and fruit toppings',
        time: '4:00 PM',
        ingredients: ['1.5 scoops protein powder', '1 frozen banana', '1/2 cup Greek yogurt', '1/4 cup granola', 'Berries', 'Coconut flakes'],
        instructions: ['Blend protein, banana, yogurt until thick', 'Pour into bowl', 'Top with granola, berries, coconut'],
        macros: { calories: 480, protein: 45, carbs: 52, fats: 12 },
        prepTime: 8,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'western', 'high-protein']
      },
      dinner: {
        name: 'Ribeye Steak with Loaded Baked Potato',
        description: 'Juicy steak with butter, sour cream, and cheese potato',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '8 oz halal ribeye steak',
          '1 large baked potato',
          '3 tbsp butter',
          '1/4 cup sour cream',
          '1/4 cup shredded cheese',
          'Chives',
          'Steamed broccoli'
        ],
        instructions: [
          'Season and grill steak to desired doneness',
          'Bake potato until fluffy',
          'Steam broccoli',
          'Load potato with butter, sour cream, cheese, chives',
          'Serve steak with potato and broccoli'
        ],
        macros: { calories: 920, protein: 62, carbs: 68, fats: 42 },
        prepTime: 45,
        cookingSkill: 'intermediate',
        budget: 'high',
        dietTags: ['halal', 'western', 'high-protein']
      },
      eveningSnack: {
        name: 'Protein Cheesecake',
        description: 'High-protein mini cheesecake',
        time: '9:30 PM',
        ingredients: ['1/2 cup cottage cheese', '1 scoop vanilla protein', '1 egg', '2 tbsp Greek yogurt', 'Graham cracker crust', 'Strawberries'],
        instructions: ['Blend cheese, protein, egg, yogurt', 'Pour into crust', 'Bake 20 min', 'Top with strawberries'],
        macros: { calories: 420, protein: 38, carbs: 32, fats: 16 },
        prepTime: 30,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'western', 'high-protein']
      }
    },
    totalMacros: { calories: 4070, protein: 289, carbs: 370, fats: 156 }
  }
];

// Auto-generate Week 4 Muscle Gain remaining days
week4Days.forEach(({ day, name, id }) => {
  const sourceDay = WEEK_4_MUSCLE_GAIN[0];
  WEEK_4_MUSCLE_GAIN.push({
    ...sourceDay,
    id: `w4-gain-${id}`,
    day: day,
    dayName: name
  });
});

// ============================================
// WEEK 4: WESTERN/MEDITERRANEAN - MAINTENANCE
// ============================================
export const WEEK_4_MAINTENANCE: MealPlan[] = [
  {
    id: 'w4-maint-mon',
    week: 4,
    day: 1,
    dayName: 'Monday',
    goal: 'maintenance',
    meals: {
      breakfast: {
        name: 'Smoked Salmon Bagel',
        description: 'Whole wheat bagel with cream cheese, salmon, and capers',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['1 whole wheat bagel', '2 tbsp cream cheese', '3 oz smoked salmon', 'Red onion', 'Capers', 'Dill', 'Tomato'],
        instructions: [
          'Toast bagel',
          'Spread cream cheese',
          'Layer salmon, onion, capers',
          'Top with dill and tomato'
        ],
        macros: { calories: 420, protein: 28, carbs: 48, fats: 14 },
        prepTime: 8,
        cookingSkill: 'beginner',
        budget: 'high',
        dietTags: ['pescatarian', 'halal', 'mediterranean']
      },
      morningSnack: {
        name: 'Mixed Nuts and Dried Fruit',
        description: 'Trail mix with almonds, walnuts, and apricots',
        time: '10:30 AM',
        ingredients: ['1/4 cup almonds', '1/4 cup walnuts', '2 tbsp dried apricots'],
        instructions: ['Mix nuts and fruit', 'Portion and enjoy'],
        macros: { calories: 280, protein: 8, carbs: 18, fats: 20 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegan', 'halal', 'mediterranean', 'gluten-free', 'budget-friendly']
      },
      lunch: {
        name: 'Niçoise Salad',
        description: 'French tuna salad with eggs, potatoes, and olives',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '5 oz canned tuna',
          '2 hard-boiled eggs',
          '1 cup baby potatoes',
          'Green beans',
          'Cherry tomatoes',
          'Olives',
          'Lettuce',
          'Dijon vinaigrette'
        ],
        instructions: [
          'Boil potatoes and green beans',
          'Hard-boil eggs',
          'Arrange lettuce, vegetables, tuna, eggs',
          'Drizzle with vinaigrette'
        ],
        macros: { calories: 480, protein: 42, carbs: 38, fats: 18 },
        prepTime: 25,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['pescatarian', 'halal', 'mediterranean', 'gluten-free']
      },
      afternoonSnack: {
        name: 'Tzatziki with Pita',
        description: 'Greek yogurt cucumber dip with whole wheat pita',
        time: '4:00 PM',
        ingredients: ['1/2 cup Greek yogurt', '1/4 cucumber grated', '1 clove garlic', 'Dill', 'Lemon', '1 whole wheat pita'],
        instructions: ['Mix yogurt, cucumber, garlic, dill, lemon', 'Cut pita into triangles', 'Serve with tzatziki'],
        macros: { calories: 220, protein: 14, carbs: 32, fats: 4 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'mediterranean', 'budget-friendly']
      },
      dinner: {
        name: 'Chicken Souvlaki with Greek Salad',
        description: 'Grilled chicken skewers with fresh salad',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '6 oz halal chicken breast',
          'Lemon',
          'Oregano',
          'Skewers',
          'Lettuce',
          'Tomatoes',
          'Cucumber',
          'Feta cheese',
          'Olives',
          'Olive oil'
        ],
        instructions: [
          'Marinate chicken in lemon, oregano, olive oil',
          'Thread onto skewers',
          'Grill until cooked',
          'Prepare Greek salad',
          'Serve together'
        ],
        macros: { calories: 460, protein: 45, carbs: 18, fats: 24 },
        prepTime: 30,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'mediterranean', 'high-protein', 'gluten-free']
      },
      eveningSnack: {
        name: 'Baklava Bites',
        description: 'Mini phyllo pastry with nuts and honey',
        time: '9:30 PM',
        ingredients: ['2 small baklava pieces (store-bought or homemade)', 'Pistachios', 'Honey'],
        instructions: ['Enjoy baklava with tea or coffee'],
        macros: { calories: 200, protein: 4, carbs: 28, fats: 9 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'mediterranean']
      }
    },
    totalMacros: { calories: 2060, protein: 141, carbs: 182, fats: 89 }
  }
];

// Auto-generate Week 4 Maintenance remaining days
week4Days.forEach(({ day, name, id }) => {
  const sourceDay = WEEK_4_MAINTENANCE[0];
  WEEK_4_MAINTENANCE.push({
    ...sourceDay,
    id: `w4-maint-${id}`,
    day: day,
    dayName: name
  });
});

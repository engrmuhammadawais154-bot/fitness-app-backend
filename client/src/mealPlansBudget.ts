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
  },
  // Tuesday - Day 2
  {
    id: 'low-w1-loss-tue',
    week: 1,
    day: 2,
    dayName: 'Tuesday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'Scrambled Eggs & Toast',
        description: 'Simple scrambled eggs with whole wheat toast',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['2 eggs', '2 slices whole wheat bread', '1 tsp butter', 'Salt & pepper'],
        instructions: ['Scramble eggs in pan with butter', 'Toast bread', 'Season and serve'],
        macros: { calories: 240, protein: 16, carbs: 24, fats: 10 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'high-protein']
      },
      morningSnack: {
        name: 'Apple with Peanut Butter',
        description: 'Sliced apple with natural peanut butter',
        time: '10:30 AM',
        ingredients: ['1 medium apple', '1 tbsp peanut butter'],
        instructions: ['Slice apple', 'Serve with peanut butter for dipping'],
        macros: { calories: 150, protein: 4, carbs: 20, fats: 8 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free']
      },
      lunch: {
        name: 'Chicken Rice Bowl',
        description: 'Simple chicken breast with rice and frozen veggies',
        time: '1:00 PM - 2:00 PM',
        ingredients: ['4 oz chicken breast', '1 cup white rice', '1 cup frozen mixed vegetables', 'Soy sauce'],
        instructions: ['Cook chicken in pan', 'Prepare rice', 'Steam vegetables', 'Mix together with soy sauce'],
        macros: { calories: 340, protein: 32, carbs: 42, fats: 4 },
        prepTime: 25,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['high-protein', 'gluten-free']
      },
      afternoonSnack: {
        name: 'Yogurt Cup',
        description: 'Plain yogurt with a drizzle of honey',
        time: '4:00 PM',
        ingredients: ['1 cup plain yogurt', '1 tsp honey'],
        instructions: ['Mix yogurt with honey'],
        macros: { calories: 130, protein: 8, carbs: 20, fats: 2 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'gluten-free']
      },
      dinner: {
        name: 'Pasta Primavera',
        description: 'Whole wheat pasta with mixed vegetables',
        time: '7:00 PM - 8:00 PM',
        ingredients: ['2 oz whole wheat pasta', '1.5 cups mixed vegetables', '1 tbsp olive oil', 'Garlic', 'Italian herbs'],
        instructions: ['Cook pasta', 'Sauté vegetables with garlic and oil', 'Toss together', 'Season with herbs'],
        macros: { calories: 320, protein: 12, carbs: 52, fats: 8 },
        prepTime: 20,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian']
      },
      eveningSnack: {
        name: 'Banana',
        description: 'Fresh banana for natural energy',
        time: '9:30 PM',
        ingredients: ['1 medium banana'],
        instructions: ['Peel and eat'],
        macros: { calories: 105, protein: 1, carbs: 27, fats: 0 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free']
      }
    },
    totalMacros: { calories: 1285, protein: 73, carbs: 185, fats: 32 }
  },
  // Wednesday - Day 3
  {
    id: 'low-w1-loss-wed',
    week: 1,
    day: 3,
    dayName: 'Wednesday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'Whole Wheat Pancakes',
        description: 'Simple homemade whole wheat pancakes with syrup',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['1/2 cup whole wheat flour', '1 egg', '1/2 cup milk', '1 tbsp syrup'],
        instructions: ['Mix ingredients', 'Cook pancakes on griddle', 'Serve with syrup'],
        macros: { calories: 250, protein: 10, carbs: 42, fats: 5 },
        prepTime: 15,
        cookingSkill: 'intermediate',
        budget: 'low',
        dietTags: ['vegetarian']
      },
      morningSnack: {
        name: 'Mixed Nuts',
        description: 'Small handful of roasted mixed nuts',
        time: '10:30 AM',
        ingredients: ['1/4 cup mixed nuts'],
        instructions: ['Portion and eat'],
        macros: { calories: 170, protein: 6, carbs: 6, fats: 15 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free']
      },
      lunch: {
        name: 'Bean Burrito',
        description: 'Flour tortilla with refried beans, rice, and salsa',
        time: '1:00 PM - 2:00 PM',
        ingredients: ['1 large tortilla', '1/2 cup refried beans', '1/2 cup rice', '2 tbsp salsa', 'Lettuce'],
        instructions: ['Warm tortilla', 'Fill with beans and rice', 'Add salsa and lettuce', 'Roll up'],
        macros: { calories: 350, protein: 14, carbs: 60, fats: 6 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'vegan']
      },
      afternoonSnack: {
        name: 'Celery with Cream Cheese',
        description: 'Celery sticks with light cream cheese',
        time: '4:00 PM',
        ingredients: ['3 celery stalks', '2 tbsp light cream cheese'],
        instructions: ['Cut celery', 'Spread cream cheese in stalks'],
        macros: { calories: 80, protein: 3, carbs: 4, fats: 6 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'gluten-free', 'low-carb']
      },
      dinner: {
        name: 'Baked Chicken Thighs with Potatoes',
        description: 'Budget-friendly chicken thighs with roasted potatoes',
        time: '7:00 PM - 8:00 PM',
        ingredients: ['2 chicken thighs', '2 medium potatoes', '1 cup broccoli', 'Olive oil', 'Seasonings'],
        instructions: ['Season chicken', 'Cut potatoes', 'Bake at 400°F for 35 min', 'Steam broccoli'],
        macros: { calories: 360, protein: 28, carbs: 38, fats: 10 },
        prepTime: 45,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['gluten-free', 'high-protein']
      },
      eveningSnack: {
        name: 'Popcorn',
        description: 'Air-popped popcorn lightly salted',
        time: '9:30 PM',
        ingredients: ['3 cups air-popped popcorn', 'Salt'],
        instructions: ['Pop corn', 'Lightly salt'],
        macros: { calories: 90, protein: 3, carbs: 18, fats: 1 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free']
      }
    },
    totalMacros: { calories: 1300, protein: 64, carbs: 168, fats: 43 }
  },
  // Thursday - Day 4
  {
    id: 'low-w1-loss-thu',
    week: 1,
    day: 4,
    dayName: 'Thursday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'Peanut Butter Toast',
        description: 'Whole wheat toast with peanut butter and banana',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['2 slices whole wheat bread', '2 tbsp peanut butter', '1/2 banana'],
        instructions: ['Toast bread', 'Spread peanut butter', 'Top with sliced banana'],
        macros: { calories: 300, protein: 12, carbs: 38, fats: 12 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian']
      },
      morningSnack: {
        name: 'Orange',
        description: 'Fresh orange fruit',
        time: '10:30 AM',
        ingredients: ['1 medium orange'],
        instructions: ['Peel and eat'],
        macros: { calories: 62, protein: 1, carbs: 15, fats: 0 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free']
      },
      lunch: {
        name: 'Egg Fried Rice',
        description: 'Simple fried rice with scrambled eggs and peas',
        time: '1:00 PM - 2:00 PM',
        ingredients: ['1.5 cups cooked rice', '2 eggs', '1/2 cup frozen peas', 'Soy sauce', '1 tsp oil'],
        instructions: ['Scramble eggs in pan', 'Add rice and peas', 'Stir-fry with soy sauce'],
        macros: { calories: 380, protein: 18, carbs: 58, fats: 10 },
        prepTime: 15,
        cookingSkill: 'intermediate',
        budget: 'low',
        dietTags: ['vegetarian']
      },
      afternoonSnack: {
        name: 'Cottage Cheese',
        description: 'Low-fat cottage cheese with tomato',
        time: '4:00 PM',
        ingredients: ['1/2 cup cottage cheese', '1 small tomato'],
        instructions: ['Serve cottage cheese with sliced tomato'],
        macros: { calories: 100, protein: 14, carbs: 6, fats: 2 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'gluten-free', 'high-protein']
      },
      dinner: {
        name: 'Spaghetti with Meat Sauce',
        description: 'Pasta with budget ground beef tomato sauce',
        time: '7:00 PM - 8:00 PM',
        ingredients: ['2 oz spaghetti', '3 oz ground beef', '1 cup tomato sauce', 'Garlic', 'Italian herbs'],
        instructions: ['Cook pasta', 'Brown beef with garlic', 'Add tomato sauce', 'Simmer and serve over pasta'],
        macros: { calories: 340, protein: 24, carbs: 42, fats: 8 },
        prepTime: 25,
        cookingSkill: 'intermediate',
        budget: 'low',
        dietTags: ['high-protein']
      },
      eveningSnack: {
        name: 'Graham Crackers',
        description: 'Whole wheat graham crackers',
        time: '9:30 PM',
        ingredients: ['2 graham cracker sheets'],
        instructions: ['Eat as is'],
        macros: { calories: 130, protein: 2, carbs: 22, fats: 3 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian']
      }
    },
    totalMacros: { calories: 1312, protein: 71, carbs: 181, fats: 35 }
  },
  // Friday - Day 5
  {
    id: 'low-w1-loss-fri',
    week: 1,
    day: 5,
    dayName: 'Friday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'Breakfast Burrito',
        description: 'Scrambled eggs with beans in tortilla',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['1 large tortilla', '2 eggs', '1/4 cup black beans', '2 tbsp salsa'],
        instructions: ['Scramble eggs', 'Warm beans', 'Fill tortilla', 'Add salsa and roll'],
        macros: { calories: 280, protein: 18, carbs: 32, fats: 8 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'high-protein']
      },
      morningSnack: {
        name: 'Cucumber Slices',
        description: 'Fresh cucumber with salt',
        time: '10:30 AM',
        ingredients: ['1 cucumber', 'Salt', 'Lemon juice'],
        instructions: ['Slice cucumber', 'Sprinkle with salt and lemon'],
        macros: { calories: 45, protein: 2, carbs: 10, fats: 0 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free', 'low-carb']
      },
      lunch: {
        name: 'Grilled Cheese & Tomato Soup',
        description: 'Classic grilled cheese with canned tomato soup',
        time: '1:00 PM - 2:00 PM',
        ingredients: ['2 slices bread', '2 slices cheese', '1 cup tomato soup', '1 tsp butter'],
        instructions: ['Butter bread', 'Add cheese and grill', 'Heat soup', 'Serve together'],
        macros: { calories: 360, protein: 16, carbs: 42, fats: 14 },
        prepTime: 12,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian']
      },
      afternoonSnack: {
        name: 'Hard Pretzels',
        description: 'Crunchy salted pretzels',
        time: '4:00 PM',
        ingredients: ['1 oz hard pretzels'],
        instructions: ['Portion and eat'],
        macros: { calories: 110, protein: 3, carbs: 23, fats: 1 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian']
      },
      dinner: {
        name: 'Fish Sticks with Sweet Potato',
        description: 'Baked fish sticks with roasted sweet potato wedges',
        time: '7:00 PM - 8:00 PM',
        ingredients: ['4 fish sticks', '1 medium sweet potato', '1 cup green beans', 'Tartar sauce'],
        instructions: ['Bake fish sticks per package', 'Cut and roast sweet potato', 'Steam green beans'],
        macros: { calories: 340, protein: 18, carbs: 48, fats: 8 },
        prepTime: 30,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['high-protein']
      },
      eveningSnack: {
        name: 'Rice Cakes',
        description: 'Plain rice cakes with honey',
        time: '9:30 PM',
        ingredients: ['2 rice cakes', '1 tsp honey'],
        instructions: ['Drizzle honey on rice cakes'],
        macros: { calories: 90, protein: 2, carbs: 20, fats: 0 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free']
      }
    },
    totalMacros: { calories: 1225, protein: 59, carbs: 175, fats: 31 }
  },
  // Saturday - Day 6
  {
    id: 'low-w1-loss-sat',
    week: 1,
    day: 6,
    dayName: 'Saturday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'Cereal with Milk',
        description: 'Whole grain cereal with low-fat milk',
        time: '8:00 AM - 9:00 AM',
        ingredients: ['1 cup whole grain cereal', '1 cup low-fat milk', '1/2 banana'],
        instructions: ['Pour cereal in bowl', 'Add milk', 'Top with sliced banana'],
        macros: { calories: 260, protein: 12, carbs: 48, fats: 3 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian']
      },
      morningSnack: {
        name: 'String Cheese',
        description: 'Low-fat mozzarella string cheese',
        time: '11:00 AM',
        ingredients: ['1 string cheese stick'],
        instructions: ['Peel and eat'],
        macros: { calories: 80, protein: 7, carbs: 1, fats: 6 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'gluten-free', 'high-protein']
      },
      lunch: {
        name: 'Quesadilla with Salsa',
        description: 'Cheese quesadilla with side salsa',
        time: '1:30 PM - 2:30 PM',
        ingredients: ['1 large tortilla', '1/4 cup shredded cheese', '1/4 cup salsa', 'Sour cream'],
        instructions: ['Sprinkle cheese on half tortilla', 'Fold and cook in pan', 'Serve with salsa'],
        macros: { calories: 320, protein: 14, carbs: 36, fats: 12 },
        prepTime: 8,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian']
      },
      afternoonSnack: {
        name: 'Grapes',
        description: 'Fresh seedless grapes',
        time: '4:30 PM',
        ingredients: ['1 cup grapes'],
        instructions: ['Wash and eat'],
        macros: { calories: 104, protein: 1, carbs: 27, fats: 0 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free']
      },
      dinner: {
        name: 'Beef & Veggie Stir-Fry',
        description: 'Ground beef with mixed frozen vegetables and rice',
        time: '7:00 PM - 8:00 PM',
        ingredients: ['4 oz ground beef', '2 cups frozen stir-fry vegetables', '1 cup rice', 'Soy sauce', 'Ginger'],
        instructions: ['Cook rice', 'Brown beef', 'Add vegetables and sauce', 'Stir-fry together'],
        macros: { calories: 380, protein: 26, carbs: 48, fats: 10 },
        prepTime: 20,
        cookingSkill: 'intermediate',
        budget: 'low',
        dietTags: ['high-protein', 'gluten-free']
      },
      eveningSnack: {
        name: 'Dark Chocolate Square',
        description: 'Small piece of dark chocolate',
        time: '9:00 PM',
        ingredients: ['1 square dark chocolate (10g)'],
        instructions: ['Enjoy slowly'],
        macros: { calories: 54, protein: 1, carbs: 6, fats: 3 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'treat']
      }
    },
    totalMacros: { calories: 1198, protein: 61, carbs: 166, fats: 34 }
  },
  // Sunday - Day 7
  {
    id: 'low-w1-loss-sun',
    week: 1,
    day: 7,
    dayName: 'Sunday',
    goal: 'weight-loss',
    meals: {
      breakfast: {
        name: 'French Toast',
        description: 'Simple French toast with maple syrup',
        time: '8:30 AM - 9:30 AM',
        ingredients: ['2 slices bread', '1 egg', '2 tbsp milk', '1 tbsp syrup', 'Cinnamon'],
        instructions: ['Whisk egg and milk', 'Dip bread', 'Cook in pan', 'Serve with syrup'],
        macros: { calories: 280, protein: 11, carbs: 44, fats: 6 },
        prepTime: 12,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian']
      },
      morningSnack: {
        name: 'Trail Mix',
        description: 'Homemade trail mix with nuts and raisins',
        time: '11:30 AM',
        ingredients: ['2 tbsp peanuts', '2 tbsp raisins'],
        instructions: ['Mix together'],
        macros: { calories: 140, protein: 4, carbs: 16, fats: 7 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free']
      },
      lunch: {
        name: 'Turkey Sandwich',
        description: 'Deli turkey sandwich with lettuce and tomato',
        time: '2:00 PM - 3:00 PM',
        ingredients: ['2 slices bread', '3 oz deli turkey', 'Lettuce', '1 tomato', '1 tbsp mustard'],
        instructions: ['Layer turkey on bread', 'Add vegetables and mustard', 'Close sandwich'],
        macros: { calories: 300, protein: 26, carbs: 36, fats: 5 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['high-protein']
      },
      afternoonSnack: {
        name: 'Baby Carrots & Ranch',
        description: 'Baby carrots with light ranch dip',
        time: '5:00 PM',
        ingredients: ['1 cup baby carrots', '2 tbsp light ranch dressing'],
        instructions: ['Dip and eat'],
        macros: { calories: 90, protein: 1, carbs: 12, fats: 4 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'gluten-free']
      },
      dinner: {
        name: 'Baked Potato with Toppings',
        description: 'Large baked potato with cheese, broccoli, and protein',
        time: '7:00 PM - 8:00 PM',
        ingredients: ['1 large potato', '1/4 cup shredded cheese', '1 cup broccoli', '2 tbsp sour cream', 'Chives'],
        instructions: ['Bake potato at 400°F for 60 min', 'Steam broccoli', 'Top potato with cheese, broccoli, sour cream'],
        macros: { calories: 340, protein: 14, carbs: 56, fats: 8 },
        prepTime: 70,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'gluten-free']
      },
      eveningSnack: {
        name: 'Jello Cup',
        description: 'Sugar-free gelatin dessert',
        time: '9:30 PM',
        ingredients: ['1 cup sugar-free jello'],
        instructions: ['Serve chilled'],
        macros: { calories: 10, protein: 1, carbs: 0, fats: 0 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'gluten-free', 'low-calorie']
      }
    },
    totalMacros: { calories: 1160, protein: 57, carbs: 164, fats: 30 }
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
  },
  // Days 2-7 for MEDIUM_BUDGET_WEIGHT_LOSS (abbreviated for efficiency)
  { id: 'med-w1-loss-tue', week: 1, day: 2, dayName: 'Tuesday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Avocado Toast', description: 'Whole grain toast with mashed avocado', time: '7:00 AM', ingredients: ['2 slices whole grain bread', '1/2 avocado', 'Cherry tomatoes', 'Salt', 'Pepper'], instructions: ['Toast bread', 'Mash avocado', 'Spread on toast', 'Top with tomatoes'], macros: { calories: 290, protein: 8, carbs: 34, fats: 14 }, prepTime: 8, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian'] },
    morningSnack: { name: 'Protein Shake', description: 'Whey protein with almond milk', time: '10:30 AM', ingredients: ['1 scoop whey protein', '1 cup almond milk', '1/2 banana'], instructions: ['Blend all ingredients'], macros: { calories: 180, protein: 24, carbs: 16, fats: 3 }, prepTime: 3, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Salmon Salad', description: 'Grilled salmon over mixed greens', time: '1:00 PM', ingredients: ['5 oz salmon', '3 cups mixed greens', 'Olive oil', 'Lemon', 'Almonds'], instructions: ['Grill salmon', 'Toss greens with oil', 'Top with salmon and almonds'], macros: { calories: 420, protein: 36, carbs: 12, fats: 26 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein', 'omega-3'] },
    afternoonSnack: { name: 'Hummus & Veggies', description: 'Carrot and bell pepper with hummus', time: '4:00 PM', ingredients: ['1 carrot', '1 bell pepper', '1/3 cup hummus'], instructions: ['Cut vegetables', 'Serve with hummus'], macros: { calories: 150, protein: 6, carbs: 20, fats: 6 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian', 'gluten-free'] },
    dinner: { name: 'Turkey Meatballs with Zucchini Noodles', description: 'Lean turkey meatballs over spiralized zucchini', time: '7:00 PM', ingredients: ['6 oz ground turkey', '2 zucchinis', 'Marinara sauce', 'Italian herbs', 'Parmesan'], instructions: ['Form and bake meatballs', 'Spiralize zucchini', 'Heat sauce', 'Combine all'], macros: { calories: 360, protein: 42, carbs: 20, fats: 12 }, prepTime: 35, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    eveningSnack: { name: 'Greek Yogurt with Berries', description: 'Greek yogurt topped with mixed berries', time: '9:30 PM', ingredients: ['3/4 cup Greek yogurt', '1/2 cup berries'], instructions: ['Top yogurt with berries'], macros: { calories: 140, protein: 15, carbs: 18, fats: 2 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] }
  }, totalMacros: { calories: 1540, protein: 131, carbs: 120, fats: 63 } },
  { id: 'med-w1-loss-wed', week: 1, day: 3, dayName: 'Wednesday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Egg White Omelette', description: 'Egg whites with spinach and feta', time: '7:00 AM', ingredients: ['4 egg whites', '1 cup spinach', '1/4 cup feta', 'Olive oil'], instructions: ['Whisk egg whites', 'Sauté spinach', 'Cook omelette', 'Add feta'], macros: { calories: 200, protein: 24, carbs: 6, fats: 8 }, prepTime: 12, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] },
    morningSnack: { name: 'Apple with Almond Butter', description: 'Sliced apple with natural almond butter', time: '10:30 AM', ingredients: ['1 apple', '1.5 tbsp almond butter'], instructions: ['Slice apple', 'Serve with almond butter'], macros: { calories: 190, protein: 4, carbs: 24, fats: 10 }, prepTime: 3, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian', 'gluten-free'] },
    lunch: { name: 'Chicken Caesar Wrap', description: 'Grilled chicken in whole wheat wrap', time: '1:00 PM', ingredients: ['4 oz chicken', '1 wrap', 'Romaine', 'Parmesan', 'Light Caesar'], instructions: ['Grill chicken', 'Fill wrap with ingredients', 'Roll and cut'], macros: { calories: 380, protein: 38, carbs: 32, fats: 12 }, prepTime: 15, cookingSkill: 'beginner', budget: 'medium', dietTags: ['high-protein'] },
    afternoonSnack: { name: 'Edamame', description: 'Steamed edamame with sea salt', time: '4:00 PM', ingredients: ['1 cup edamame', 'Sea salt'], instructions: ['Steam edamame', 'Sprinkle with salt'], macros: { calories: 140, protein: 12, carbs: 11, fats: 6 }, prepTime: 8, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian', 'gluten-free', 'high-protein'] },
    dinner: { name: 'Tilapia with Quinoa', description: 'Baked tilapia with quinoa and asparagus', time: '7:00 PM', ingredients: ['6 oz tilapia', '1 cup quinoa', '1.5 cups asparagus', 'Lemon', 'Herbs'], instructions: ['Bake fish with lemon', 'Cook quinoa', 'Roast asparagus'], macros: { calories: 400, protein: 44, carbs: 42, fats: 8 }, prepTime: 30, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    eveningSnack: { name: 'Cottage Cheese Bowl', description: 'Low-fat cottage cheese with pineapple', time: '9:30 PM', ingredients: ['1/2 cup cottage cheese', '1/4 cup pineapple'], instructions: ['Top cottage cheese with pineapple'], macros: { calories: 120, protein: 14, carbs: 12, fats: 2 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] }
  }, totalMacros: { calories: 1430, protein: 136, carbs: 127, fats: 46 } },
  { id: 'med-w1-loss-thu', week: 1, day: 4, dayName: 'Thursday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Protein Pancakes', description: 'Protein-packed pancakes with blueberries', time: '7:00 AM', ingredients: ['1/2 cup oats', '1 scoop protein powder', '2 eggs', '1/2 cup blueberries', 'Honey'], instructions: ['Blend oats, protein, eggs', 'Cook pancakes', 'Top with blueberries and honey'], macros: { calories: 320, protein: 28, carbs: 36, fats: 8 }, prepTime: 15, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    morningSnack: { name: 'Protein Bar', description: 'Quality protein bar', time: '10:30 AM', ingredients: ['1 protein bar'], instructions: ['Eat'], macros: { calories: 190, protein: 20, carbs: 22, fats: 6 }, prepTime: 1, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Shrimp Stir-Fry', description: 'Shrimp with vegetables over brown rice', time: '1:00 PM', ingredients: ['6 oz shrimp', '2 cups mixed vegetables', '1 cup brown rice', 'Soy sauce', 'Ginger'], instructions: ['Cook rice', 'Stir-fry shrimp and veggies', 'Season with sauce'], macros: { calories: 380, protein: 38, carbs: 46, fats: 6 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    afternoonSnack: { name: 'Mixed Berries with Yogurt', description: 'Fresh berries with Greek yogurt', time: '4:00 PM', ingredients: ['1 cup mixed berries', '1/2 cup Greek yogurt'], instructions: ['Mix together'], macros: { calories: 140, protein: 12, carbs: 20, fats: 2 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'gluten-free'] },
    dinner: { name: 'Lean Beef with Sweet Potato', description: 'Grilled sirloin with roasted sweet potato', time: '7:00 PM', ingredients: ['5 oz sirloin', '1 medium sweet potato', '2 cups broccoli', 'Olive oil'], instructions: ['Grill beef', 'Roast sweet potato', 'Steam broccoli'], macros: { calories: 420, protein: 42, carbs: 38, fats: 12 }, prepTime: 35, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    eveningSnack: { name: 'Dark Chocolate & Almonds', description: 'Dark chocolate square with almonds', time: '9:30 PM', ingredients: ['2 squares dark chocolate', '10 almonds'], instructions: ['Enjoy together'], macros: { calories: 120, protein: 3, carbs: 10, fats: 9 }, prepTime: 1, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian'] }
  }, totalMacros: { calories: 1570, protein: 143, carbs: 172, fats: 43 } },
  { id: 'med-w1-loss-fri', week: 1, day: 5, dayName: 'Friday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Smoked Salmon Bagel', description: 'Whole grain bagel with smoked salmon and cream cheese', time: '7:00 AM', ingredients: ['1/2 whole grain bagel', '2 oz smoked salmon', '1 tbsp light cream cheese', 'Capers', 'Red onion'], instructions: ['Toast bagel', 'Spread cream cheese', 'Top with salmon, capers, onion'], macros: { calories: 280, protein: 20, carbs: 32, fats: 8 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['high-protein', 'omega-3'] },
    morningSnack: { name: 'Celery & Peanut Butter', description: 'Celery sticks with natural peanut butter', time: '10:30 AM', ingredients: ['3 celery stalks', '1.5 tbsp peanut butter'], instructions: ['Fill celery with peanut butter'], macros: { calories: 150, protein: 6, carbs: 8, fats: 12 }, prepTime: 4, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian', 'gluten-free'] },
    lunch: { name: 'Mediterranean Bowl', description: 'Quinoa bowl with chicken, olives, feta, cucumbers', time: '1:00 PM', ingredients: ['4 oz chicken', '1 cup quinoa', 'Cucumbers', 'Olives', 'Feta', 'Lemon'], instructions: ['Cook quinoa', 'Grill chicken', 'Assemble bowl with toppings'], macros: { calories: 420, protein: 36, carbs: 42, fats: 14 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    afternoonSnack: { name: 'Protein Smoothie', description: 'Berry protein smoothie with spinach', time: '4:00 PM', ingredients: ['1 scoop protein', '1 cup berries', '1 cup spinach', 'Almond milk', 'Ice'], instructions: ['Blend all ingredients'], macros: { calories: 160, protein: 24, carbs: 18, fats: 2 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] },
    dinner: { name: 'Pork Tenderloin with Vegetables', description: 'Lean pork with roasted root vegetables', time: '7:00 PM', ingredients: ['5 oz pork tenderloin', 'Carrots', 'Parsnips', 'Brussels sprouts', 'Olive oil'], instructions: ['Roast pork at 375°F', 'Roast vegetables', 'Season with herbs'], macros: { calories: 360, protein: 38, carbs: 28, fats: 10 }, prepTime: 40, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    eveningSnack: { name: 'Kefir with Honey', description: 'Probiotic kefir drink with honey', time: '9:30 PM', ingredients: ['1 cup kefir', '1 tsp honey'], instructions: ['Mix and drink'], macros: { calories: 140, protein: 10, carbs: 16, fats: 4 }, prepTime: 1, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'gluten-free'] }
  }, totalMacros: { calories: 1510, protein: 134, carbs: 144, fats: 50 } },
  { id: 'med-w1-loss-sat', week: 1, day: 6, dayName: 'Saturday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Veggie Scramble', description: 'Eggs scrambled with bell peppers, onions, mushrooms', time: '8:00 AM', ingredients: ['3 eggs', 'Bell peppers', 'Onions', 'Mushrooms', 'Cheese'], instructions: ['Sauté vegetables', 'Add eggs', 'Scramble together', 'Top with cheese'], macros: { calories: 300, protein: 24, carbs: 12, fats: 18 }, prepTime: 12, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] },
    morningSnack: { name: 'Chia Pudding', description: 'Chia seeds with almond milk and berries', time: '11:00 AM', ingredients: ['3 tbsp chia seeds', '1 cup almond milk', 'Berries', 'Honey'], instructions: ['Mix chia and milk overnight', 'Top with berries'], macros: { calories: 180, protein: 6, carbs: 24, fats: 8 }, prepTime: 3, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian', 'gluten-free'] },
    lunch: { name: 'Turkey Burger with Salad', description: 'Lean turkey burger patty over greens', time: '1:30 PM', ingredients: ['6 oz ground turkey', 'Mixed greens', 'Tomato', 'Onion', 'Mustard'], instructions: ['Form and grill burger', 'Serve over salad greens'], macros: { calories: 320, protein: 42, carbs: 14, fats: 12 }, prepTime: 18, cookingSkill: 'beginner', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    afternoonSnack: { name: 'Rice Cakes with Avocado', description: 'Brown rice cakes topped with mashed avocado', time: '4:30 PM', ingredients: ['2 rice cakes', '1/4 avocado', 'Sea salt', 'Red pepper flakes'], instructions: ['Mash avocado on rice cakes', 'Season'], macros: { calories: 130, protein: 3, carbs: 16, fats: 7 }, prepTime: 3, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian', 'gluten-free'] },
    dinner: { name: 'Cod with Cauliflower Rice', description: 'Baked cod over cauliflower rice pilaf', time: '7:00 PM', ingredients: ['6 oz cod', '2 cups cauliflower rice', 'Lemon', 'Herbs', 'Olive oil'], instructions: ['Bake cod with lemon', 'Sauté cauliflower rice', 'Season with herbs'], macros: { calories: 280, protein: 38, carbs: 16, fats: 8 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein', 'low-carb'] },
    eveningSnack: { name: 'Protein Mug Cake', description: 'Quick protein mug cake with berries', time: '9:00 PM', ingredients: ['1 scoop protein powder', '1 egg', 'Baking powder', 'Berries'], instructions: ['Mix ingredients', 'Microwave 90 seconds', 'Top with berries'], macros: { calories: 160, protein: 24, carbs: 12, fats: 4 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] }
  }, totalMacros: { calories: 1370, protein: 137, carbs: 94, fats: 57 } },
  { id: 'med-w1-loss-sun', week: 1, day: 7, dayName: 'Sunday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Breakfast Bowl', description: 'Quinoa bowl with eggs, avocado, and salsa', time: '8:30 AM', ingredients: ['1/2 cup quinoa', '2 eggs', '1/4 avocado', 'Salsa', 'Black beans'], instructions: ['Cook quinoa', 'Fry eggs', 'Assemble bowl with toppings'], macros: { calories: 340, protein: 20, carbs: 36, fats: 14 }, prepTime: 15, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] },
    morningSnack: { name: 'Beef Jerky', description: 'Lean beef jerky snack', time: '11:30 AM', ingredients: ['1 oz beef jerky'], instructions: ['Eat'], macros: { calories: 80, protein: 12, carbs: 4, fats: 2 }, prepTime: 1, cookingSkill: 'beginner', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    lunch: { name: 'Chicken Pho', description: 'Vietnamese-style chicken noodle soup', time: '2:00 PM', ingredients: ['4 oz chicken', 'Rice noodles', 'Bean sprouts', 'Herbs', 'Broth'], instructions: ['Simmer broth', 'Cook noodles', 'Add chicken and vegetables', 'Garnish with herbs'], macros: { calories: 360, protein: 36, carbs: 42, fats: 6 }, prepTime: 30, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    afternoonSnack: { name: 'Seaweed Snacks', description: 'Roasted seaweed sheets', time: '5:00 PM', ingredients: ['1 pack seaweed snacks'], instructions: ['Eat as is'], macros: { calories: 30, protein: 2, carbs: 2, fats: 2 }, prepTime: 1, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian', 'gluten-free', 'low-calorie'] },
    dinner: { name: 'Stuffed Bell Peppers', description: 'Bell peppers stuffed with turkey and quinoa', time: '7:00 PM', ingredients: ['2 bell peppers', '4 oz ground turkey', '1/2 cup quinoa', 'Tomato sauce', 'Cheese'], instructions: ['Cook turkey and quinoa', 'Stuff peppers', 'Bake at 375°F for 30 min', 'Top with cheese'], macros: { calories: 380, protein: 32, carbs: 40, fats: 10 }, prepTime: 50, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    eveningSnack: { name: 'Casein Shake', description: 'Slow-digesting casein protein shake', time: '9:30 PM', ingredients: ['1 scoop casein protein', '1 cup milk'], instructions: ['Mix and drink'], macros: { calories: 160, protein: 28, carbs: 12, fats: 2 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] }
  }, totalMacros: { calories: 1350, protein: 130, carbs: 136, fats: 36 } }
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
  },
  // Days 2-7 for HIGH_BUDGET_WEIGHT_LOSS (condensed format)
  { id: 'high-w1-loss-tue', week: 1, day: 2, dayName: 'Tuesday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Acai Bowl', description: 'Acai with granola, fresh fruits, coconut', time: '7:00 AM', ingredients: ['Acai packet', 'Granola', 'Banana', 'Berries', 'Coconut', 'Honey'], instructions: ['Blend acai', 'Top with ingredients'], macros: { calories: 340, protein: 8, carbs: 52, fats: 14 }, prepTime: 8, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegan', 'vegetarian'] },
    morningSnack: { name: 'Smoked Salmon & Cream Cheese', description: 'Premium smoked salmon with crackers', time: '10:30 AM', ingredients: ['2 oz smoked salmon', 'Whole grain crackers', 'Cream cheese'], instructions: ['Arrange on crackers'], macros: { calories: 190, protein: 14, carbs: 16, fats: 8 }, prepTime: 3, cookingSkill: 'beginner', budget: 'high', dietTags: ['high-protein', 'omega-3'] },
    lunch: { name: 'Sushi Bowl', description: 'Deconstructed sushi with tuna and avocado', time: '1:00 PM', ingredients: ['5 oz sushi-grade tuna', 'Sushi rice', 'Avocado', 'Cucumber', 'Nori', 'Soy sauce'], instructions: ['Cook rice', 'Slice tuna', 'Arrange bowl'], macros: { calories: 480, protein: 42, carbs: 48, fats: 14 }, prepTime: 20, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein'] },
    afternoonSnack: { name: 'Grass-Fed Beef Jerky', description: 'Premium grass-fed beef jerky', time: '4:00 PM', ingredients: ['1.5 oz grass-fed beef jerky'], instructions: ['Eat'], macros: { calories: 120, protein: 18, carbs: 6, fats: 3 }, prepTime: 1, cookingSkill: 'beginner', budget: 'high', dietTags: ['gluten-free', 'high-protein'] },
    dinner: { name: 'Filet Mignon with Truffle Vegetables', description: 'Premium beef with truffle-roasted vegetables', time: '7:00 PM', ingredients: ['6 oz filet mignon', 'Asparagus', 'Brussels sprouts', 'Truffle oil', 'Herbs'], instructions: ['Sear steak', 'Roast vegetables with truffle oil'], macros: { calories: 480, protein: 46, carbs: 20, fats: 24 }, prepTime: 35, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Protein Smoothie Bowl', description: 'Premium protein with exotic fruits', time: '9:30 PM', ingredients: ['Protein powder', 'Dragon fruit', 'Mango', 'Chia seeds', 'Coconut'], instructions: ['Blend and top'], macros: { calories: 220, protein: 26, carbs: 24, fats: 4 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 1830, protein: 154, carbs: 166, fats: 67 } },
  { id: 'high-w1-loss-wed', week: 1, day: 3, dayName: 'Wednesday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Organic Egg Frittata', description: 'Egg frittata with goat cheese and herbs', time: '7:00 AM', ingredients: ['3 organic eggs', 'Goat cheese', 'Sun-dried tomatoes', 'Fresh basil', 'Arugula'], instructions: ['Whisk eggs', 'Bake frittata', 'Top with greens'], macros: { calories: 320, protein: 24, carbs: 8, fats: 22 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'high', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] },
    morningSnack: { name: 'Macadamia Nuts', description: 'Raw macadamia nuts', time: '10:30 AM', ingredients: ['1 oz macadamia nuts'], instructions: ['Portion and eat'], macros: { calories: 200, protein: 2, carbs: 4, fats: 22 }, prepTime: 1, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegan', 'vegetarian', 'gluten-free'] },
    lunch: { name: 'Wild Salmon Nicoise', description: 'Wild salmon with nicoise salad', time: '1:00 PM', ingredients: ['6 oz wild salmon', 'Mixed greens', 'Olives', 'Eggs', 'Green beans', 'Dijon vinaigrette'], instructions: ['Grill salmon', 'Arrange salad', 'Dress'], macros: { calories: 460, protein: 44, carbs: 18, fats: 24 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'omega-3'] },
    afternoonSnack: { name: 'Greek Yogurt Parfait', description: 'Organic Greek yogurt with premium toppings', time: '4:00 PM', ingredients: ['Organic Greek yogurt', 'Raw honey', 'Walnuts', 'Goji berries'], instructions: ['Layer ingredients'], macros: { calories: 180, protein: 16, carbs: 18, fats: 6 }, prepTime: 3, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] },
    dinner: { name: 'Sea Bass with Quinoa Pilaf', description: 'Chilean sea bass with herbed quinoa', time: '7:00 PM', ingredients: ['6 oz Chilean sea bass', 'Quinoa', 'Pine nuts', 'Herbs', 'Lemon'], instructions: ['Pan-sear fish', 'Prepare quinoa pilaf'], macros: { calories: 480, protein: 42, carbs: 36, fats: 18 }, prepTime: 30, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Dark Chocolate Truffles', description: 'Artisan dark chocolate truffles', time: '9:30 PM', ingredients: ['2 dark chocolate truffles'], instructions: ['Enjoy slowly'], macros: { calories: 120, protein: 2, carbs: 12, fats: 8 }, prepTime: 1, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'treat'] }
  }, totalMacros: { calories: 1760, protein: 130, carbs: 96, fats: 100 } },
  { id: 'high-w1-loss-thu', week: 1, day: 4, dayName: 'Thursday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Steak & Eggs', description: 'Grass-fed steak with organic eggs', time: '7:00 AM', ingredients: ['4 oz grass-fed steak', '2 eggs', 'Sautéed spinach', 'Mushrooms'], instructions: ['Grill steak', 'Fry eggs', 'Sauté vegetables'], macros: { calories: 380, protein: 38, carbs: 6, fats: 24 }, prepTime: 15, cookingSkill: 'intermediate', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'low-carb'] },
    morningSnack: { name: 'Prosciutto & Melon', description: 'Italian prosciutto wrapped melon', time: '10:30 AM', ingredients: ['2 oz prosciutto', 'Cantaloupe'], instructions: ['Wrap melon in prosciutto'], macros: { calories: 140, protein: 12, carbs: 12, fats: 6 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['gluten-free', 'high-protein'] },
    lunch: { name: 'Lobster Salad', description: 'Fresh lobster over mixed greens', time: '1:00 PM', ingredients: ['6 oz lobster', 'Arugula', 'Avocado', 'Citrus vinaigrette'], instructions: ['Steam lobster', 'Arrange salad'], macros: { calories: 340, protein: 36, carbs: 14, fats: 16 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Caviar & Crackers', description: 'Premium caviar with whole grain crackers', time: '4:00 PM', ingredients: ['1 oz caviar', 'Crackers', 'Crème fraîche'], instructions: ['Arrange on crackers'], macros: { calories: 160, protein: 10, carbs: 12, fats: 8 }, prepTime: 3, cookingSkill: 'beginner', budget: 'high', dietTags: ['high-protein', 'omega-3', 'gourmet'] },
    dinner: { name: 'Duck Breast with Berry Reduction', description: 'Pan-seared duck with berry sauce', time: '7:00 PM', ingredients: ['6 oz duck breast', 'Mixed berries', 'Wild rice', 'Balsamic', 'Thyme'], instructions: ['Score and sear duck', 'Make berry reduction', 'Cook wild rice'], macros: { calories: 520, protein: 42, carbs: 36, fats: 22 }, prepTime: 40, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Kefir with Raw Honey', description: 'Organic kefir with raw honey', time: '9:30 PM', ingredients: ['1 cup organic kefir', '1 tsp raw honey'], instructions: ['Mix and drink'], macros: { calories: 140, protein: 10, carbs: 16, fats: 4 }, prepTime: 1, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'gluten-free'] }
  }, totalMacros: { calories: 1680, protein: 148, carbs: 96, fats: 80 } },
  { id: 'high-w1-loss-fri', week: 1, day: 5, dayName: 'Friday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Smoked Salmon Scramble', description: 'Scrambled eggs with smoked salmon', time: '7:00 AM', ingredients: ['3 eggs', '2 oz smoked salmon', 'Chives', 'Cream cheese', 'Capers'], instructions: ['Scramble eggs gently', 'Fold in salmon', 'Garnish'], macros: { calories: 320, protein: 28, carbs: 4, fats: 22 }, prepTime: 10, cookingSkill: 'beginner', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'omega-3'] },
    morningSnack: { name: 'Cashew Butter & Apple', description: 'Sliced apple with raw cashew butter', time: '10:30 AM', ingredients: ['1 apple', '2 tbsp cashew butter'], instructions: ['Slice and dip'], macros: { calories: 220, protein: 4, carbs: 28, fats: 12 }, prepTime: 3, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegan', 'vegetarian', 'gluten-free'] },
    lunch: { name: 'Ahi Tuna Poke Bowl', description: 'Sushi-grade tuna poke with vegetables', time: '1:00 PM', ingredients: ['6 oz ahi tuna', 'Brown rice', 'Avocado', 'Edamame', 'Seaweed', 'Sesame'], instructions: ['Marinate tuna', 'Assemble bowl'], macros: { calories: 480, protein: 44, carbs: 42, fats: 14 }, prepTime: 15, cookingSkill: 'intermediate', budget: 'high', dietTags: ['gluten-free', 'high-protein'] },
    afternoonSnack: { name: 'Blue Cheese & Walnuts', description: 'Artisan blue cheese with walnuts', time: '4:00 PM', ingredients: ['1.5 oz blue cheese', '10 walnuts'], instructions: ['Pair and enjoy'], macros: { calories: 200, protein: 8, carbs: 4, fats: 18 }, prepTime: 2, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'gluten-free'] },
    dinner: { name: 'Lamb Chops with Mint', description: 'Grilled lamb chops with mint chimichurri', time: '7:00 PM', ingredients: ['6 oz lamb chops', 'Fresh mint', 'Garlic', 'Olive oil', 'Roasted vegetables'], instructions: ['Grill lamb', 'Make chimichurri', 'Roast vegetables'], macros: { calories: 480, protein: 40, carbs: 16, fats: 28 }, prepTime: 30, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Protein Truffles', description: 'Homemade protein chocolate truffles', time: '9:30 PM', ingredients: ['Protein powder', 'Cocoa', 'Almond butter', 'Honey'], instructions: ['Mix and form balls'], macros: { calories: 160, protein: 20, carbs: 14, fats: 6 }, prepTime: 10, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 1860, protein: 144, carbs: 108, fats: 100 } },
  { id: 'high-w1-loss-sat', week: 1, day: 6, dayName: 'Saturday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Truffle Omelette', description: 'Eggs with truffle oil and mushrooms', time: '8:00 AM', ingredients: ['3 eggs', 'Wild mushrooms', 'Truffle oil', 'Chives', 'Parmesan'], instructions: ['Sauté mushrooms', 'Make omelette', 'Drizzle truffle oil'], macros: { calories: 340, protein: 24, carbs: 8, fats: 24 }, prepTime: 15, cookingSkill: 'intermediate', budget: 'high', dietTags: ['vegetarian', 'gluten-free', 'high-protein', 'gourmet'] },
    morningSnack: { name: 'Smoked Mackerel', description: 'Smoked mackerel with crackers', time: '11:00 AM', ingredients: ['2 oz smoked mackerel', 'Whole grain crackers'], instructions: ['Serve on crackers'], macros: { calories: 180, protein: 14, carbs: 12, fats: 8 }, prepTime: 2, cookingSkill: 'beginner', budget: 'high', dietTags: ['high-protein', 'omega-3'] },
    lunch: { name: 'Wagyu Beef Salad', description: 'Premium wagyu over greens', time: '1:30 PM', ingredients: ['4 oz wagyu beef', 'Arugula', 'Cherry tomatoes', 'Parmesan', 'Balsamic'], instructions: ['Grill wagyu rare', 'Slice and arrange'], macros: { calories: 420, protein: 36, carbs: 12, fats: 28 }, prepTime: 15, cookingSkill: 'intermediate', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Hummus Trio', description: 'Three flavors of gourmet hummus with vegetables', time: '4:30 PM', ingredients: ['Hummus trio', 'Rainbow vegetables'], instructions: ['Arrange and dip'], macros: { calories: 160, protein: 6, carbs: 18, fats: 8 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegan', 'vegetarian', 'gluten-free'] },
    dinner: { name: 'Seared Scallops', description: 'Pan-seared scallops with cauliflower puree', time: '7:00 PM', ingredients: ['8 oz scallops', 'Cauliflower', 'Cream', 'Butter', 'Chives'], instructions: ['Sear scallops', 'Puree cauliflower', 'Plate elegantly'], macros: { calories: 380, protein: 42, carbs: 20, fats: 14 }, prepTime: 25, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Imported Cheese Board', description: 'Small artisan cheese selection', time: '9:00 PM', ingredients: ['Artisan cheese', 'Nuts', 'Fruit'], instructions: ['Arrange and enjoy'], macros: { calories: 200, protein: 10, carbs: 12, fats: 14 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'gluten-free'] }
  }, totalMacros: { calories: 1680, protein: 132, carbs: 82, fats: 96 } },
  { id: 'high-w1-loss-sun', week: 1, day: 7, dayName: 'Sunday', goal: 'weight-loss', meals: {
    breakfast: { name: 'Eggs Benedict', description: 'Poached eggs with hollandaise', time: '8:30 AM', ingredients: ['2 eggs', 'Canadian bacon', 'English muffin', 'Hollandaise', 'Asparagus'], instructions: ['Poach eggs', 'Make hollandaise', 'Assemble'], macros: { calories: 380, protein: 22, carbs: 28, fats: 20 }, prepTime: 20, cookingSkill: 'advanced', budget: 'high', dietTags: ['high-protein'] },
    morningSnack: { name: 'Smoked Trout', description: 'Smoked trout with crème fraîche', time: '11:30 AM', ingredients: ['2 oz smoked trout', 'Crème fraîche', 'Dill'], instructions: ['Serve chilled'], macros: { calories: 140, protein: 14, carbs: 2, fats: 8 }, prepTime: 2, cookingSkill: 'beginner', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'omega-3'] },
    lunch: { name: 'Mediterranean Branzino', description: 'Whole roasted branzino with herbs', time: '2:00 PM', ingredients: ['1 whole branzino', 'Lemon', 'Herbs', 'Olive oil', 'Grilled vegetables'], instructions: ['Stuff and roast fish', 'Grill vegetables'], macros: { calories: 440, protein: 48, carbs: 18, fats: 18 }, prepTime: 40, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Olives & Feta', description: 'Marinated olives with feta cheese', time: '5:00 PM', ingredients: ['Mixed olives', 'Feta cheese', 'Olive oil'], instructions: ['Combine and serve'], macros: { calories: 160, protein: 6, carbs: 6, fats: 14 }, prepTime: 2, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'gluten-free'] },
    dinner: { name: 'Venison Medallions', description: 'Pan-seared venison with berry reduction', time: '7:00 PM', ingredients: ['6 oz venison', 'Blueberries', 'Red wine', 'Root vegetables', 'Herbs'], instructions: ['Sear venison', 'Make reduction', 'Roast vegetables'], macros: { calories: 460, protein: 46, carbs: 28, fats: 16 }, prepTime: 35, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Matcha Latte', description: 'Organic matcha with almond milk', time: '9:30 PM', ingredients: ['Ceremonial matcha', 'Almond milk', 'Honey'], instructions: ['Whisk matcha', 'Steam milk', 'Combine'], macros: { calories: 100, protein: 2, carbs: 18, fats: 2 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegan', 'vegetarian', 'gluten-free'] }
  }, totalMacros: { calories: 1680, protein: 138, carbs: 100, fats: 78 } }
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
  },
  // Days 2-7 LOW_BUDGET_MUSCLE_GAIN (condensed - high calorie for muscle gain)
  { id: 'low-w1-gain-tue', week: 1, day: 2, dayName: 'Tuesday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Pancakes with Peanut Butter', description: 'Stack of pancakes with PB and syrup', time: '7:00 AM', ingredients: ['Pancake mix', 'Eggs', 'Milk', '3 tbsp peanut butter', 'Syrup'], instructions: ['Make pancakes', 'Top with PB and syrup'], macros: { calories: 520, protein: 22, carbs: 68, fats: 18 }, prepTime: 15, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian'] },
    morningSnack: { name: 'Mass Gainer Shake', description: 'Protein shake with oats and banana', time: '10:30 AM', ingredients: ['2 scoops protein', '1/2 cup oats', '2 bananas', 'Milk', 'Peanut butter'], instructions: ['Blend all'], macros: { calories: 580, protein: 48, carbs: 72, fats: 12 }, prepTime: 5, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Double Burger with Fries', description: 'Two beef patties with sweet potato fries', time: '1:00 PM', ingredients: ['8 oz ground beef', '2 buns', 'Cheese', '2 sweet potatoes', 'Ketchup'], instructions: ['Cook burgers', 'Bake fries', 'Assemble'], macros: { calories: 780, protein: 52, carbs: 76, fats: 28 }, prepTime: 30, cookingSkill: 'beginner', budget: 'low', dietTags: ['high-protein'] },
    afternoonSnack: { name: 'Trail Mix & Protein Bar', description: 'High-calorie trail mix with bar', time: '4:00 PM', ingredients: ['1 cup trail mix', '1 protein bar'], instructions: ['Eat together'], macros: { calories: 450, protein: 24, carbs: 52, fats: 18 }, prepTime: 1, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian'] },
    dinner: { name: 'Pasta with Meat Sauce', description: 'Large serving of pasta with beef sauce', time: '7:00 PM', ingredients: ['4 oz pasta', '6 oz ground beef', 'Tomato sauce', 'Parmesan', 'Garlic bread'], instructions: ['Cook pasta', 'Make meat sauce', 'Serve with bread'], macros: { calories: 680, protein: 46, carbs: 78, fats: 18 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'low', dietTags: ['high-protein'] },
    eveningSnack: { name: 'Casein Shake & PB Toast', description: 'Slow protein with carbs before bed', time: '9:30 PM', ingredients: ['Casein protein', 'Milk', '2 bread slices', 'Peanut butter'], instructions: ['Make shake', 'Toast bread with PB'], macros: { calories: 420, protein: 36, carbs: 42, fats: 14 }, prepTime: 5, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 3430, protein: 228, carbs: 388, fats: 108 } },
  { id: 'low-w1-gain-wed', week: 1, day: 3, dayName: 'Wednesday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Breakfast Burrito XL', description: 'Large burrito with eggs, beans, cheese', time: '7:00 AM', ingredients: ['2 tortillas', '4 eggs', 'Black beans', 'Cheese', 'Salsa', 'Avocado'], instructions: ['Scramble eggs', 'Fill and wrap'], macros: { calories: 640, protein: 38, carbs: 68, fats: 22 }, prepTime: 15, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'high-protein'] },
    morningSnack: { name: 'Protein Oats', description: 'Oatmeal with protein powder mixed in', time: '10:30 AM', ingredients: ['1 cup oats', 'Protein powder', 'Banana', 'Honey', 'Milk'], instructions: ['Cook oats', 'Mix in protein'], macros: { calories: 480, protein: 38, carbs: 68, fats: 8 }, prepTime: 8, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Chicken Fried Rice XL', description: 'Large portion chicken fried rice', time: '1:00 PM', ingredients: ['2 cups rice', '6 oz chicken', '2 eggs', 'Vegetables', 'Soy sauce'], instructions: ['Cook rice', 'Fry with chicken and eggs'], macros: { calories: 720, protein: 52, carbs: 88, fats: 16 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'low', dietTags: ['high-protein'] },
    afternoonSnack: { name: 'PB&J Sandwich & Milk', description: 'Classic PB&J with whole milk', time: '4:00 PM', ingredients: ['Bread', 'Peanut butter', 'Jelly', '2 cups milk'], instructions: ['Make sandwich', 'Drink milk'], macros: { calories: 520, protein: 26, carbs: 64, fats: 18 }, prepTime: 5, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian'] },
    dinner: { name: 'Meatloaf with Mashed Potatoes', description: 'Hearty meatloaf with sides', time: '7:00 PM', ingredients: ['8 oz ground beef', 'Breadcrumbs', 'Egg', '2 potatoes', 'Gravy', 'Vegetables'], instructions: ['Bake meatloaf', 'Mash potatoes', 'Make gravy'], macros: { calories: 680, protein: 48, carbs: 64, fats: 22 }, prepTime: 60, cookingSkill: 'intermediate', budget: 'low', dietTags: ['high-protein'] },
    eveningSnack: { name: 'Greek Yogurt Bowl', description: 'Full-fat yogurt with granola and honey', time: '9:30 PM', ingredients: ['2 cups Greek yogurt', 'Granola', 'Honey', 'Berries'], instructions: ['Layer ingredients'], macros: { calories: 420, protein: 32, carbs: 56, fats: 10 }, prepTime: 3, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 3460, protein: 234, carbs: 408, fats: 96 } },
  { id: 'low-w1-gain-thu', week: 1, day: 4, dayName: 'Thursday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'French Toast with Eggs', description: 'French toast stack with side of eggs', time: '7:00 AM', ingredients: ['4 bread slices', '3 eggs total', 'Milk', 'Syrup', 'Butter'], instructions: ['Make French toast', 'Scramble eggs'], macros: { calories: 580, protein: 32, carbs: 72, fats: 18 }, prepTime: 15, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian'] },
    morningSnack: { name: 'Protein Smoothie Bowl', description: 'Thick smoothie with toppings', time: '10:30 AM', ingredients: ['2 scoops protein', 'Frozen berries', 'Banana', 'Granola', 'Nut butter'], instructions: ['Blend thick', 'Top with granola'], macros: { calories: 520, protein: 46, carbs: 62, fats: 12 }, prepTime: 8, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Pulled Chicken Sandwiches', description: 'Two sandwiches with potato chips', time: '1:00 PM', ingredients: ['8 oz chicken', '2 buns', 'BBQ sauce', 'Coleslaw', 'Chips'], instructions: ['Slow cook chicken', 'Shred and sauce', 'Assemble'], macros: { calories: 740, protein: 56, carbs: 82, fats: 18 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'low', dietTags: ['high-protein'] },
    afternoonSnack: { name: 'Bagel with Cream Cheese', description: 'Whole wheat bagel loaded', time: '4:00 PM', ingredients: ['1 large bagel', '4 tbsp cream cheese'], instructions: ['Toast and spread'], macros: { calories: 420, protein: 14, carbs: 62, fats: 14 }, prepTime: 3, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian'] },
    dinner: { name: 'Beef Tacos with Rice', description: 'Multiple tacos with Mexican rice', time: '7:00 PM', ingredients: ['8 oz ground beef', '4 taco shells', 'Cheese', 'Toppings', '1.5 cups rice', 'Beans'], instructions: ['Cook beef', 'Make rice', 'Assemble tacos'], macros: { calories: 780, protein: 52, carbs: 84, fats: 24 }, prepTime: 30, cookingSkill: 'beginner', budget: 'low', dietTags: ['high-protein'] },
    eveningSnack: { name: 'Cottage Cheese & Fruit', description: 'Large serving cottage cheese', time: '9:30 PM', ingredients: ['2 cups cottage cheese', 'Pineapple', 'Honey'], instructions: ['Mix together'], macros: { calories: 380, protein: 38, carbs: 42, fats: 6 }, prepTime: 2, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 3420, protein: 238, carbs: 404, fats: 92 } },
  { id: 'low-w1-gain-fri', week: 1, day: 5, dayName: 'Friday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Big Breakfast Platter', description: 'Eggs, bacon, toast, hashbrowns', time: '7:00 AM', ingredients: ['3 eggs', '4 bacon strips', '2 toast', 'Hashbrowns'], instructions: ['Cook everything', 'Plate together'], macros: { calories: 620, protein: 36, carbs: 52, fats: 28 }, prepTime: 20, cookingSkill: 'beginner', budget: 'low', dietTags: ['high-protein'] },
    morningSnack: { name: 'Protein Pancakes', description: 'Quick protein pancakes', time: '10:30 AM', ingredients: ['Protein powder', 'Oats', 'Eggs', 'Banana', 'Syrup'], instructions: ['Blend and cook'], macros: { calories: 460, protein: 38, carbs: 58, fats: 10 }, prepTime: 12, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Pizza Slices with Salad', description: 'Frozen pizza with side salad', time: '1:00 PM', ingredients: ['Half frozen pizza', 'Salad greens', 'Dressing'], instructions: ['Bake pizza', 'Toss salad'], macros: { calories: 740, protein: 32, carbs: 92, fats: 26 }, prepTime: 15, cookingSkill: 'beginner', budget: 'low', dietTags: [] },
    afternoonSnack: { name: 'Protein Bar & Nuts', description: 'Bar with mixed nuts', time: '4:00 PM', ingredients: ['Protein bar', '1/2 cup mixed nuts'], instructions: ['Eat together'], macros: { calories: 480, protein: 26, carbs: 42, fats: 24 }, prepTime: 1, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian'] },
    dinner: { name: 'Spaghetti & Meatballs', description: 'Large pasta serving with meatballs', time: '7:00 PM', ingredients: ['4 oz spaghetti', '6 meatballs', 'Marinara', 'Parmesan', 'Garlic bread'], instructions: ['Cook pasta', 'Heat meatballs', 'Serve with bread'], macros: { calories: 820, protein: 48, carbs: 96, fats: 26 }, prepTime: 20, cookingSkill: 'beginner', budget: 'low', dietTags: ['high-protein'] },
    eveningSnack: { name: 'Milk & Cookies', description: 'Protein-enriched snack', time: '9:30 PM', ingredients: ['2 cups milk', 'Protein cookies'], instructions: ['Dunk and enjoy'], macros: { calories: 380, protein: 28, carbs: 48, fats: 10 }, prepTime: 2, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian'] }
  }, totalMacros: { calories: 3500, protein: 208, carbs: 388, fats: 124 } },
  { id: 'low-w1-gain-sat', week: 1, day: 6, dayName: 'Saturday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Waffles with Toppings', description: 'Waffles with PB, berries, whipped cream', time: '8:00 AM', ingredients: ['Waffle mix', 'Peanut butter', 'Berries', 'Whipped cream', 'Syrup'], instructions: ['Make waffles', 'Add toppings'], macros: { calories: 640, protein: 24, carbs: 88, fats: 22 }, prepTime: 15, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian'] },
    morningSnack: { name: 'Weight Gainer Shake', description: 'High-calorie shake', time: '11:00 AM', ingredients: ['2 scoops protein', 'Oats', 'Banana', 'Peanut butter', 'Milk'], instructions: ['Blend all ingredients'], macros: { calories: 620, protein: 48, carbs: 72, fats: 16 }, prepTime: 5, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Steak & Potatoes', description: 'Budget steak with loaded baked potato', time: '1:30 PM', ingredients: ['6 oz sirloin', '2 potatoes', 'Butter', 'Sour cream', 'Cheese', 'Vegetables'], instructions: ['Grill steak', 'Bake potatoes', 'Load toppings'], macros: { calories: 820, protein: 52, carbs: 78, fats: 28 }, prepTime: 45, cookingSkill: 'intermediate', budget: 'low', dietTags: ['high-protein', 'gluten-free'] },
    afternoonSnack: { name: 'Quesadilla', description: 'Cheese and bean quesadilla', time: '4:30 PM', ingredients: ['2 tortillas', 'Cheese', 'Refried beans', 'Sour cream'], instructions: ['Fill and grill'], macros: { calories: 480, protein: 22, carbs: 54, fats: 20 }, prepTime: 8, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian'] },
    dinner: { name: 'Chicken Alfredo', description: 'Creamy chicken alfredo pasta', time: '7:00 PM', ingredients: ['4 oz pasta', '6 oz chicken', 'Alfredo sauce', 'Parmesan', 'Broccoli'], instructions: ['Cook pasta and chicken', 'Toss with sauce'], macros: { calories: 760, protein: 56, carbs: 68, fats: 26 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'low', dietTags: ['high-protein'] },
    eveningSnack: { name: 'Protein Ice Cream', description: 'High-protein ice cream with toppings', time: '9:00 PM', ingredients: ['Protein ice cream', 'Peanut butter', 'Chocolate chips'], instructions: ['Top and enjoy'], macros: { calories: 380, protein: 32, carbs: 36, fats: 12 }, prepTime: 2, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 3700, protein: 234, carbs: 396, fats: 124 } },
  { id: 'low-w1-gain-sun', week: 1, day: 7, dayName: 'Sunday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Breakfast Sandwich Stack', description: 'Two breakfast sandwiches', time: '8:30 AM', ingredients: ['2 English muffins', '4 eggs', '4 sausage patties', 'Cheese'], instructions: ['Cook components', 'Stack sandwiches'], macros: { calories: 720, protein: 48, carbs: 52, fats: 32 }, prepTime: 15, cookingSkill: 'beginner', budget: 'low', dietTags: ['high-protein'] },
    morningSnack: { name: 'Banana Protein Bread', description: 'Homemade protein banana bread', time: '11:30 AM', ingredients: ['2 slices protein banana bread', 'Butter'], instructions: ['Toast and butter'], macros: { calories: 380, protein: 22, carbs: 52, fats: 12 }, prepTime: 2, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian'] },
    lunch: { name: 'Sub Sandwich XL', description: 'Large sub with chips', time: '2:00 PM', ingredients: ['12-inch sub bread', 'Deli meats', 'Cheese', 'Toppings', 'Chips'], instructions: ['Build sandwich', 'Serve with chips'], macros: { calories: 880, protein: 52, carbs: 96, fats: 28 }, prepTime: 10, cookingSkill: 'beginner', budget: 'low', dietTags: ['high-protein'] },
    afternoonSnack: { name: 'Hummus & Pita', description: 'Hummus with pita bread', time: '5:00 PM', ingredients: ['1 cup hummus', '2 pita breads'], instructions: ['Dip and eat'], macros: { calories: 420, protein: 16, carbs: 62, fats: 14 }, prepTime: 3, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegan', 'vegetarian'] },
    dinner: { name: 'Pot Roast with Sides', description: 'Slow-cooked beef with vegetables', time: '7:00 PM', ingredients: ['8 oz beef roast', 'Potatoes', 'Carrots', 'Gravy', 'Bread roll'], instructions: ['Slow cook roast', 'Serve with vegetables'], macros: { calories: 740, protein: 56, carbs: 68, fats: 22 }, prepTime: 180, cookingSkill: 'intermediate', budget: 'low', dietTags: ['high-protein'] },
    eveningSnack: { name: 'Protein Pudding', description: 'High-protein chocolate pudding', time: '9:30 PM', ingredients: ['Protein powder', 'Pudding mix', 'Milk'], instructions: ['Mix and chill'], macros: { calories: 320, protein: 36, carbs: 32, fats: 6 }, prepTime: 5, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 3460, protein: 230, carbs: 362, fats: 114 } }
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
  },
  // Days 2-7 MEDIUM_BUDGET_MUSCLE_GAIN (condensed)
  { id: 'med-w1-gain-tue', week: 1, day: 2, dayName: 'Tuesday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Steak & Eggs', description: 'Lean steak with eggs and hash browns', time: '7:00 AM', ingredients: ['5 oz sirloin', '3 eggs', 'Hash browns', 'Toast'], instructions: ['Grill steak', 'Fry eggs', 'Cook hash browns'], macros: { calories: 620, protein: 52, carbs: 48, fats: 22 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['high-protein', 'gluten-free'] },
    morningSnack: { name: 'Protein Smoothie with Nut Butter', description: 'Premium protein shake', time: '10:30 AM', ingredients: ['2 scoops whey', 'Almond butter', 'Banana', 'Oats', 'Milk'], instructions: ['Blend all'], macros: { calories: 580, protein: 52, carbs: 64, fats: 16 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Salmon Bowl XL', description: 'Grilled salmon with quinoa and vegetables', time: '1:00 PM', ingredients: ['8 oz salmon', '1.5 cups quinoa', 'Avocado', 'Vegetables', 'Lemon'], instructions: ['Grill salmon', 'Cook quinoa', 'Assemble bowl'], macros: { calories: 780, protein: 56, carbs: 72, fats: 24 }, prepTime: 30, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein', 'omega-3'] },
    afternoonSnack: { name: 'Greek Yogurt Parfait', description: 'Protein-rich parfait with nuts', time: '4:00 PM', ingredients: ['2 cups Greek yogurt', 'Granola', 'Berries', 'Almonds', 'Honey'], instructions: ['Layer ingredients'], macros: { calories: 480, protein: 38, carbs: 54, fats: 14 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] },
    dinner: { name: 'Chicken Parmesan with Pasta', description: 'Breaded chicken with marinara and pasta', time: '7:00 PM', ingredients: ['8 oz chicken', 'Marinara', 'Mozzarella', 'Pasta', 'Parmesan'], instructions: ['Bread and bake chicken', 'Cook pasta', 'Top with sauce and cheese'], macros: { calories: 840, protein: 68, carbs: 76, fats: 24 }, prepTime: 40, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['high-protein'] },
    eveningSnack: { name: 'Casein Protein Shake', description: 'Slow-release protein before bed', time: '9:30 PM', ingredients: ['2 scoops casein', 'Milk', 'Peanut butter'], instructions: ['Blend'], macros: { calories: 420, protein: 48, carbs: 28, fats: 12 }, prepTime: 3, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 3720, protein: 314, carbs: 342, fats: 112 } },
  { id: 'med-w1-gain-wed', week: 1, day: 3, dayName: 'Wednesday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Protein Pancake Stack', description: 'High-protein pancakes with toppings', time: '7:00 AM', ingredients: ['Protein pancake mix', 'Eggs', 'Berries', 'Greek yogurt', 'Syrup'], instructions: ['Make pancakes', 'Stack with toppings'], macros: { calories: 580, protein: 46, carbs: 68, fats: 14 }, prepTime: 15, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    morningSnack: { name: 'Beef Jerky & Trail Mix', description: 'Quality beef jerky with nuts', time: '10:30 AM', ingredients: ['2 oz beef jerky', 'Trail mix with nuts'], instructions: ['Portion and eat'], macros: { calories: 420, protein: 32, carbs: 36, fats: 18 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    lunch: { name: 'Burrito Bowl Grande', description: 'Chicken burrito bowl with all toppings', time: '1:00 PM', ingredients: ['8 oz chicken', '2 cups rice', 'Black beans', 'Cheese', 'Guacamole', 'Salsa'], instructions: ['Grill chicken', 'Assemble bowl with toppings'], macros: { calories: 920, protein: 68, carbs: 98, fats: 26 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    afternoonSnack: { name: 'Protein Bar & Fruit', description: 'Quality protein bar with banana', time: '4:00 PM', ingredients: ['Premium protein bar', '1 banana', 'Almond butter'], instructions: ['Eat together'], macros: { calories: 420, protein: 28, carbs: 52, fats: 12 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian'] },
    dinner: { name: 'Ribeye with Sweet Potato', description: 'Marbled ribeye with loaded sweet potato', time: '7:00 PM', ingredients: ['8 oz ribeye', '2 sweet potatoes', 'Butter', 'Asparagus', 'Seasonings'], instructions: ['Grill steak', 'Bake potatoes', 'Roast asparagus'], macros: { calories: 840, protein: 62, carbs: 72, fats: 32 }, prepTime: 45, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    eveningSnack: { name: 'Cottage Cheese Bowl', description: 'Full-fat cottage cheese with toppings', time: '9:30 PM', ingredients: ['2 cups cottage cheese', 'Pineapple', 'Almonds', 'Honey'], instructions: ['Mix together'], macros: { calories: 460, protein: 42, carbs: 44, fats: 14 }, prepTime: 3, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] }
  }, totalMacros: { calories: 3640, protein: 278, carbs: 370, fats: 116 } },
  { id: 'med-w1-gain-thu', week: 1, day: 4, dayName: 'Thursday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Breakfast Burrito XXL', description: 'Extra large breakfast burrito', time: '7:00 AM', ingredients: ['2 large tortillas', '4 eggs', 'Sausage', 'Cheese', 'Beans', 'Avocado'], instructions: ['Cook fillings', 'Wrap burritos'], macros: { calories: 720, protein: 46, carbs: 68, fats: 28 }, prepTime: 18, cookingSkill: 'beginner', budget: 'medium', dietTags: ['high-protein'] },
    morningSnack: { name: 'Mass Gainer Shake', description: 'High-calorie protein shake', time: '10:30 AM', ingredients: ['2 scoops whey', 'Oats', 'Banana', 'Peanut butter', 'Milk'], instructions: ['Blend all'], macros: { calories: 640, protein: 54, carbs: 72, fats: 16 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Grilled Chicken Teriyaki Bowl', description: 'Chicken with teriyaki over rice', time: '1:00 PM', ingredients: ['8 oz chicken', '2 cups rice', 'Teriyaki sauce', 'Broccoli', 'Sesame seeds'], instructions: ['Grill chicken', 'Make teriyaki', 'Serve over rice'], macros: { calories: 820, protein: 62, carbs: 96, fats: 16 }, prepTime: 30, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['high-protein'] },
    afternoonSnack: { name: 'Bagel with Cream Cheese & Lox', description: 'Loaded bagel', time: '4:00 PM', ingredients: ['1 bagel', 'Cream cheese', '3 oz smoked salmon', 'Capers'], instructions: ['Toast and assemble'], macros: { calories: 480, protein: 32, carbs: 52, fats: 18 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['high-protein', 'omega-3'] },
    dinner: { name: 'Pork Chops with Mac & Cheese', description: 'Grilled pork with mac and cheese', time: '7:00 PM', ingredients: ['8 oz pork chops', 'Mac and cheese', 'Green beans'], instructions: ['Grill pork', 'Make mac and cheese', 'Steam beans'], macros: { calories: 880, protein: 64, carbs: 78, fats: 32 }, prepTime: 35, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['high-protein'] },
    eveningSnack: { name: 'Protein Ice Cream Bowl', description: 'High-protein ice cream with mix-ins', time: '9:30 PM', ingredients: ['Protein ice cream', 'Peanut butter', 'Chocolate chips', 'Banana'], instructions: ['Top and enjoy'], macros: { calories: 440, protein: 38, carbs: 44, fats: 16 }, prepTime: 3, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 3980, protein: 296, carbs: 410, fats: 126 } },
  { id: 'med-w1-gain-fri', week: 1, day: 5, dayName: 'Friday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'French Toast Protein Stack', description: 'Protein French toast with toppings', time: '7:00 AM', ingredients: ['6 bread slices', '4 eggs', 'Protein powder', 'Berries', 'Syrup'], instructions: ['Make French toast', 'Stack and top'], macros: { calories: 680, protein: 48, carbs: 84, fats: 18 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    morningSnack: { name: 'Protein Muffins', description: 'Homemade protein muffins', time: '10:30 AM', ingredients: ['2 protein muffins', 'Greek yogurt'], instructions: ['Heat and serve with yogurt'], macros: { calories: 420, protein: 36, carbs: 48, fats: 10 }, prepTime: 3, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Shrimp Pasta Alfredo', description: 'Creamy shrimp pasta', time: '1:00 PM', ingredients: ['8 oz shrimp', 'Pasta', 'Alfredo sauce', 'Parmesan', 'Garlic bread'], instructions: ['Cook pasta and shrimp', 'Toss with sauce'], macros: { calories: 920, protein: 68, carbs: 92, fats: 28 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['high-protein'] },
    afternoonSnack: { name: 'Protein Shake & Granola Bar', description: 'Quick protein combo', time: '4:00 PM', ingredients: ['Protein shake', 'Protein granola bar'], instructions: ['Drink and eat'], macros: { calories: 420, protein: 42, carbs: 44, fats: 10 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    dinner: { name: 'BBQ Ribs with Sides', description: 'Pork ribs with loaded sides', time: '7:00 PM', ingredients: ['8 oz pork ribs', 'BBQ sauce', 'Cornbread', 'Coleslaw', 'Baked beans'], instructions: ['Slow cook ribs', 'Prepare sides'], macros: { calories: 920, protein: 56, carbs: 88, fats: 32 }, prepTime: 120, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['high-protein'] },
    eveningSnack: { name: 'Casein Pudding', description: 'Thick casein protein pudding', time: '9:30 PM', ingredients: ['Casein protein', 'Milk', 'Pudding mix', 'Toppings'], instructions: ['Mix thick', 'Chill and top'], macros: { calories: 380, protein: 42, carbs: 36, fats: 8 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 3740, protein: 292, carbs: 392, fats: 106 } },
  { id: 'med-w1-gain-sat', week: 1, day: 6, dayName: 'Saturday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Big Breakfast Combo', description: 'Full breakfast spread', time: '8:00 AM', ingredients: ['4 eggs', 'Bacon', 'Sausage', 'Pancakes', 'Hash browns'], instructions: ['Cook all components'], macros: { calories: 840, protein: 48, carbs: 78, fats: 36 }, prepTime: 30, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['high-protein'] },
    morningSnack: { name: 'Protein Waffles', description: 'Protein-packed waffles', time: '11:00 AM', ingredients: ['Protein waffle mix', 'Peanut butter', 'Banana', 'Honey'], instructions: ['Make waffles', 'Top generously'], macros: { calories: 520, protein: 38, carbs: 64, fats: 16 }, prepTime: 12, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Double Cheeseburger Deluxe', description: 'Two beef patties with all toppings', time: '1:30 PM', ingredients: ['8 oz ground beef', 'Bun', 'Cheese', 'Toppings', 'Sweet potato fries'], instructions: ['Grill burgers', 'Bake fries', 'Assemble'], macros: { calories: 980, protein: 62, carbs: 92, fats: 38 }, prepTime: 25, cookingSkill: 'beginner', budget: 'medium', dietTags: ['high-protein'] },
    afternoonSnack: { name: 'Protein Smoothie Bowl', description: 'Thick smoothie with toppings', time: '4:30 PM', ingredients: ['2 scoops protein', 'Frozen fruit', 'Granola', 'Nut butter', 'Chia seeds'], instructions: ['Blend thick', 'Top heavily'], macros: { calories: 520, protein: 46, carbs: 58, fats: 16 }, prepTime: 8, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    dinner: { name: 'T-Bone Steak Dinner', description: 'Premium T-bone with loaded potato', time: '7:00 PM', ingredients: ['10 oz T-bone', 'Large potato', 'Butter', 'Sour cream', 'Cheese', 'Vegetables'], instructions: ['Grill steak', 'Bake potato', 'Load toppings'], macros: { calories: 940, protein: 72, carbs: 68, fats: 38 }, prepTime: 50, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    eveningSnack: { name: 'Protein Cheesecake', description: 'High-protein cheesecake slice', time: '9:00 PM', ingredients: ['Protein cheesecake slice', 'Berries'], instructions: ['Serve chilled'], macros: { calories: 360, protein: 32, carbs: 32, fats: 12 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 4160, protein: 298, carbs: 392, fats: 156 } },
  { id: 'med-w1-gain-sun', week: 1, day: 7, dayName: 'Sunday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Brunch Platter', description: 'Complete brunch spread', time: '9:00 AM', ingredients: ['3 eggs', 'Smoked salmon', 'Avocado toast', 'Hash browns', 'Fruit'], instructions: ['Prepare all components'], macros: { calories: 720, protein: 44, carbs: 68, fats: 28 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['high-protein', 'omega-3'] },
    morningSnack: { name: 'Protein Donuts', description: 'High-protein donuts', time: '12:00 PM', ingredients: ['2 protein donuts', 'Milk'], instructions: ['Serve with milk'], macros: { calories: 460, protein: 38, carbs: 52, fats: 12 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Chicken Fajita Bowl', description: 'Loaded chicken fajita bowl', time: '2:00 PM', ingredients: ['8 oz chicken', 'Peppers', 'Onions', 'Rice', 'Beans', 'Cheese', 'Guacamole'], instructions: ['Cook chicken and vegetables', 'Assemble bowl'], macros: { calories: 880, protein: 66, carbs: 92, fats: 26 }, prepTime: 30, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['gluten-free', 'high-protein'] },
    afternoonSnack: { name: 'Protein Cookie Dough', description: 'Edible protein cookie dough', time: '5:00 PM', ingredients: ['Protein powder', 'Almond butter', 'Oat flour', 'Chocolate chips'], instructions: ['Mix and portion'], macros: { calories: 420, protein: 36, carbs: 44, fats: 14 }, prepTime: 10, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] },
    dinner: { name: 'Seafood Feast', description: 'Mixed seafood with pasta', time: '7:00 PM', ingredients: ['Shrimp', 'Scallops', 'Mussels', 'Pasta', 'White wine sauce', 'Garlic bread'], instructions: ['Cook seafood', 'Make sauce', 'Toss with pasta'], macros: { calories: 920, protein: 68, carbs: 96, fats: 24 }, prepTime: 40, cookingSkill: 'advanced', budget: 'medium', dietTags: ['high-protein'] },
    eveningSnack: { name: 'Protein Hot Chocolate', description: 'Rich protein hot chocolate', time: '9:30 PM', ingredients: ['Chocolate protein powder', 'Milk', 'Cocoa', 'Marshmallows'], instructions: ['Heat and mix'], macros: { calories: 340, protein: 36, carbs: 36, fats: 8 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 3740, protein: 288, carbs: 388, fats: 112 } }
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
  },
  // Days 2-7 HIGH_BUDGET_MUSCLE_GAIN (condensed - premium ingredients, high calories)
  { id: 'high-w1-gain-tue', week: 1, day: 2, dayName: 'Tuesday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Wagyu Steak & Eggs', description: 'Premium wagyu with organic eggs', time: '7:00 AM', ingredients: ['6 oz wagyu', '4 eggs', 'Truffle hash browns', 'Sourdough toast'], instructions: ['Sear wagyu', 'Fry eggs', 'Prepare sides'], macros: { calories: 840, protein: 62, carbs: 52, fats: 42 }, prepTime: 25, cookingSkill: 'advanced', budget: 'high', dietTags: ['high-protein', 'gourmet'] },
    morningSnack: { name: 'Premium Protein Shake', description: 'Grass-fed whey with superfoods', time: '10:30 AM', ingredients: ['2 scoops grass-fed whey', 'Almond butter', 'Acai', 'Spirulina', 'Coconut milk'], instructions: ['Blend premium ingredients'], macros: { calories: 620, protein: 56, carbs: 58, fats: 20 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Wild Salmon Poke Bowl XL', description: 'Sushi-grade salmon with premium toppings', time: '1:00 PM', ingredients: ['10 oz wild salmon', 'Sushi rice', 'Avocado', 'Edamame', 'Tobiko', 'Truffle oil'], instructions: ['Marinate salmon', 'Assemble gourmet bowl'], macros: { calories: 980, protein: 74, carbs: 88, fats: 32 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'omega-3', 'gourmet'] },
    afternoonSnack: { name: 'Artisan Cheese & Charcuterie', description: 'Premium meats and cheeses', time: '4:00 PM', ingredients: ['Prosciutto', 'Salami', 'Aged cheddar', 'Blue cheese', 'Nuts', 'Fruit'], instructions: ['Arrange board'], macros: { calories: 520, protein: 38, carbs: 24, fats: 32 }, prepTime: 10, cookingSkill: 'beginner', budget: 'high', dietTags: ['gluten-free', 'high-protein'] },
    dinner: { name: 'Lobster Thermidor', description: 'Classic French lobster with sides', time: '7:00 PM', ingredients: ['12 oz lobster', 'Thermidor sauce', 'Wild rice pilaf', 'Asparagus', 'Wine'], instructions: ['Prepare lobster thermidor', 'Cook rice', 'Roast asparagus'], macros: { calories: 880, protein: 82, carbs: 68, fats: 28 }, prepTime: 50, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Grass-Fed Protein Ice Cream', description: 'Premium protein ice cream with toppings', time: '9:30 PM', ingredients: ['Grass-fed protein ice cream', 'Dark chocolate', 'Macadamia nuts', 'Honey'], instructions: ['Top and enjoy'], macros: { calories: 480, protein: 42, carbs: 38, fats: 22 }, prepTime: 3, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 4320, protein: 354, carbs: 328, fats: 176 } },
  { id: 'high-w1-gain-wed', week: 1, day: 3, dayName: 'Wednesday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Smoked Salmon Benedict', description: 'Eggs benedict with premium smoked salmon', time: '7:00 AM', ingredients: ['4 oz smoked salmon', '3 eggs', 'Brioche', 'Hollandaise', 'Caviar'], instructions: ['Poach eggs', 'Make hollandaise', 'Assemble'], macros: { calories: 720, protein: 52, carbs: 48, fats: 34 }, prepTime: 25, cookingSkill: 'advanced', budget: 'high', dietTags: ['high-protein', 'omega-3', 'gourmet'] },
    morningSnack: { name: 'Protein Acai Bowl', description: 'Organic acai with premium toppings', time: '10:30 AM', ingredients: ['Acai', 'Protein powder', 'Granola', 'Exotic fruits', 'Bee pollen', 'Coconut'], instructions: ['Blend acai', 'Top generously'], macros: { calories: 580, protein: 44, carbs: 72, fats: 16 }, prepTime: 10, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Kobe Beef Bowl', description: 'Premium Kobe beef over rice', time: '1:00 PM', ingredients: ['8 oz Kobe beef', 'Japanese rice', 'Vegetables', 'Teriyaki', 'Sesame'], instructions: ['Sear Kobe beef', 'Prepare rice', 'Assemble bowl'], macros: { calories: 1020, protein: 68, carbs: 92, fats: 38 }, prepTime: 30, cookingSkill: 'advanced', budget: 'high', dietTags: ['high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Greek Yogurt with Manuka Honey', description: 'Organic yogurt with premium toppings', time: '4:00 PM', ingredients: ['2 cups Greek yogurt', 'Manuka honey', 'Walnuts', 'Goji berries'], instructions: ['Layer ingredients'], macros: { calories: 520, protein: 46, carbs: 52, fats: 16 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'gluten-free', 'high-protein'] },
    dinner: { name: 'Duck Confit with Truffle Risotto', description: 'French duck with truffle risotto', time: '7:00 PM', ingredients: ['8 oz duck confit', 'Arborio rice', 'Truffle oil', 'Parmesan', 'Wine'], instructions: ['Prepare duck', 'Make risotto', 'Plate elegantly'], macros: { calories: 980, protein: 64, carbs: 82, fats: 42 }, prepTime: 60, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Protein Truffles', description: 'Handmade protein chocolate truffles', time: '9:30 PM', ingredients: ['Protein powder', 'Cocoa', 'Almond butter', 'Dark chocolate', 'Coconut'], instructions: ['Form and coat'], macros: { calories: 420, protein: 38, carbs: 36, fats: 18 }, prepTime: 15, cookingSkill: 'intermediate', budget: 'high', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 4240, protein: 312, carbs: 382, fats: 164 } },
  { id: 'high-w1-gain-thu', week: 1, day: 4, dayName: 'Thursday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Truffle Scramble', description: 'Eggs with truffle and premium mushrooms', time: '7:00 AM', ingredients: ['4 eggs', 'Wild mushrooms', 'Truffle oil', 'Goat cheese', 'Brioche'], instructions: ['Scramble with truffle', 'Toast brioche'], macros: { calories: 680, protein: 48, carbs: 52, fats: 32 }, prepTime: 18, cookingSkill: 'intermediate', budget: 'high', dietTags: ['vegetarian', 'high-protein', 'gourmet'] },
    morningSnack: { name: 'Imported Jerky & Nuts', description: 'Premium grass-fed jerky with exotic nuts', time: '10:30 AM', ingredients: ['3 oz grass-fed jerky', 'Macadamia nuts', 'Brazil nuts'], instructions: ['Portion and eat'], macros: { calories: 520, protein: 42, carbs: 18, fats: 34 }, prepTime: 2, cookingSkill: 'beginner', budget: 'high', dietTags: ['gluten-free', 'high-protein'] },
    lunch: { name: 'Seared Ahi Tuna Steak', description: 'Rare ahi tuna with wasabi mash', time: '1:00 PM', ingredients: ['10 oz ahi tuna', 'Wasabi potatoes', 'Seaweed salad', 'Soy glaze'], instructions: ['Sear tuna rare', 'Make wasabi mash'], macros: { calories: 820, protein: 78, carbs: 68, fats: 22 }, prepTime: 25, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Protein Smoothie with Collagen', description: 'Premium protein with collagen peptides', time: '4:00 PM', ingredients: ['Protein powder', 'Collagen', 'Acai', 'Matcha', 'Almond butter'], instructions: ['Blend premium ingredients'], macros: { calories: 480, protein: 52, carbs: 42, fats: 16 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] },
    dinner: { name: 'Rack of Lamb with Herb Crust', description: 'Premium lamb with mint chimichurri', time: '7:00 PM', ingredients: ['12 oz lamb rack', 'Herb crust', 'Fingerling potatoes', 'Asparagus', 'Mint'], instructions: ['Crust and roast lamb', 'Roast vegetables'], macros: { calories: 1040, protein: 76, carbs: 72, fats: 48 }, prepTime: 45, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Casein Mousse', description: 'Protein mousse with berries', time: '9:30 PM', ingredients: ['Casein protein', 'Heavy cream', 'Berries', 'Dark chocolate'], instructions: ['Whip into mousse'], macros: { calories: 480, protein: 46, carbs: 38, fats: 20 }, prepTime: 10, cookingSkill: 'intermediate', budget: 'high', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 4020, protein: 342, carbs: 290, fats: 172 } },
  { id: 'high-w1-gain-fri', week: 1, day: 5, dayName: 'Friday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Protein Crepes', description: 'French crepes with protein and berries', time: '7:00 AM', ingredients: ['Protein powder', 'Eggs', 'Almond flour', 'Berries', 'Cream', 'Honey'], instructions: ['Make thin crepes', 'Fill and fold'], macros: { calories: 720, protein: 52, carbs: 68, fats: 24 }, prepTime: 25, cookingSkill: 'advanced', budget: 'high', dietTags: ['vegetarian', 'high-protein'] },
    morningSnack: { name: 'Smoked Mackerel', description: 'Premium smoked fish with crackers', time: '10:30 AM', ingredients: ['4 oz smoked mackerel', 'Whole grain crackers', 'Cream cheese'], instructions: ['Serve on crackers'], macros: { calories: 460, protein: 38, carbs: 36, fats: 20 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['high-protein', 'omega-3'] },
    lunch: { name: 'Chilean Sea Bass', description: 'Pan-seared sea bass with quinoa', time: '1:00 PM', ingredients: ['10 oz Chilean sea bass', 'Quinoa', 'Vegetables', 'Lemon butter sauce'], instructions: ['Pan-sear fish', 'Cook quinoa', 'Make sauce'], macros: { calories: 920, protein: 74, carbs: 82, fats: 28 }, prepTime: 35, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Protein Cheesecake', description: 'Premium protein cheesecake slice', time: '4:00 PM', ingredients: ['Protein cheesecake', 'Berry compote', 'Whipped cream'], instructions: ['Serve with toppings'], macros: { calories: 520, protein: 44, carbs: 48, fats: 20 }, prepTime: 3, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] },
    dinner: { name: 'Surf & Turf Premium', description: 'Filet mignon and lobster tail', time: '7:00 PM', ingredients: ['8 oz filet', '8 oz lobster', 'Garlic butter', 'Asparagus', 'Loaded potato'], instructions: ['Grill steak', 'Broil lobster', 'Prepare sides'], macros: { calories: 1080, protein: 86, carbs: 68, fats: 48 }, prepTime: 40, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Protein Hot Cocoa Premium', description: 'Artisan hot chocolate with protein', time: '9:30 PM', ingredients: ['Chocolate protein', 'Dark cocoa', 'Milk', 'Marshmallows', 'Cream'], instructions: ['Heat and mix'], macros: { calories: 420, protein: 42, carbs: 42, fats: 14 }, prepTime: 8, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 4120, protein: 336, carbs: 344, fats: 154 } },
  { id: 'high-w1-gain-sat', week: 1, day: 6, dayName: 'Saturday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Gourmet Breakfast Platter', description: 'Five-star breakfast spread', time: '8:00 AM', ingredients: ['Smoked salmon', '3 eggs', 'Caviar', 'Avocado', 'Brioche', 'Champagne'], instructions: ['Prepare all components elegantly'], macros: { calories: 880, protein: 56, carbs: 68, fats: 42 }, prepTime: 30, cookingSkill: 'advanced', budget: 'high', dietTags: ['high-protein', 'omega-3', 'gourmet'] },
    morningSnack: { name: 'Premium Protein Balls', description: 'Handmade protein energy balls', time: '11:00 AM', ingredients: ['Protein powder', 'Dates', 'Almond butter', 'Cacao nibs', 'Coconut'], instructions: ['Form balls'], macros: { calories: 520, protein: 42, carbs: 56, fats: 18 }, prepTime: 15, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'King Crab Legs', description: 'Alaskan king crab with drawn butter', time: '1:30 PM', ingredients: ['16 oz king crab', 'Clarified butter', 'Wild rice', 'Grilled vegetables'], instructions: ['Steam crab', 'Prepare sides'], macros: { calories: 840, protein: 82, carbs: 68, fats: 24 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Protein Donuts Gourmet', description: 'Artisan protein donuts', time: '4:30 PM', ingredients: ['2 gourmet protein donuts', 'Icing', 'Toppings'], instructions: ['Serve fresh'], macros: { calories: 580, protein: 46, carbs: 64, fats: 16 }, prepTime: 2, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] },
    dinner: { name: 'Prime Rib Dinner', description: 'Premium aged prime rib', time: '7:00 PM', ingredients: ['12 oz prime rib', 'Au jus', 'Horseradish', 'Truffle mashed potatoes', 'Brussels sprouts'], instructions: ['Roast prime rib', 'Make au jus', 'Prepare sides'], macros: { calories: 1140, protein: 84, carbs: 72, fats: 54 }, prepTime: 90, cookingSkill: 'advanced', budget: 'high', dietTags: ['gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Protein Gelato', description: 'Italian protein gelato', time: '9:00 PM', ingredients: ['Protein gelato', 'Amaretto', 'Pistachios', 'Dark chocolate'], instructions: ['Top and enjoy'], macros: { calories: 480, protein: 38, carbs: 48, fats: 20 }, prepTime: 3, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 4440, protein: 348, carbs: 376, fats: 174 } },
  { id: 'high-w1-gain-sun', week: 1, day: 7, dayName: 'Sunday', goal: 'muscle-gain', meals: {
    breakfast: { name: 'Champagne Brunch', description: 'Elegant Sunday brunch', time: '9:00 AM', ingredients: ['Lobster omelette', 'Smoked salmon', 'Caviar', 'Champagne', 'Fresh pastries'], instructions: ['Prepare gourmet brunch'], macros: { calories: 920, protein: 62, carbs: 78, fats: 38 }, prepTime: 40, cookingSkill: 'advanced', budget: 'high', dietTags: ['high-protein', 'gourmet'] },
    morningSnack: { name: 'Protein Croissant', description: 'French protein croissant', time: '12:00 PM', ingredients: ['Protein croissant', 'Almond butter', 'Berries'], instructions: ['Fill and serve'], macros: { calories: 520, protein: 38, carbs: 58, fats: 20 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] },
    lunch: { name: 'Wagyu Burger Deluxe', description: 'Premium wagyu burger', time: '2:00 PM', ingredients: ['10 oz wagyu', 'Brioche bun', 'Truffle aioli', 'Arugula', 'Sweet potato fries'], instructions: ['Grill wagyu', 'Assemble gourmet burger'], macros: { calories: 1080, protein: 72, carbs: 92, fats: 46 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'high', dietTags: ['high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Protein Macarons', description: 'French protein macarons', time: '5:00 PM', ingredients: ['4 protein macarons', 'Various flavors'], instructions: ['Serve elegant'], macros: { calories: 420, protein: 32, carbs: 52, fats: 12 }, prepTime: 2, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'high-protein'] },
    dinner: { name: 'Beef Wellington', description: 'Classic beef wellington', time: '7:00 PM', ingredients: ['10 oz beef tenderloin', 'Puff pastry', 'Mushroom duxelles', 'Foie gras', 'Vegetables'], instructions: ['Wrap and bake wellington', 'Prepare sides'], macros: { calories: 1120, protein: 76, carbs: 86, fats: 52 }, prepTime: 120, cookingSkill: 'advanced', budget: 'high', dietTags: ['high-protein', 'gourmet'] },
    eveningSnack: { name: 'Protein Tiramisu', description: 'Italian protein tiramisu', time: '9:30 PM', ingredients: ['Protein powder', 'Mascarpone', 'Espresso', 'Cocoa', 'Ladyfingers'], instructions: ['Layer and chill'], macros: { calories: 520, protein: 44, carbs: 52, fats: 18 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'high', dietTags: ['vegetarian', 'high-protein'] }
  }, totalMacros: { calories: 4580, protein: 324, carbs: 418, fats: 186 } }
];

// ============================================
// LOW BUDGET MAINTENANCE MEALS
// ============================================
export const LOW_BUDGET_MAINTENANCE: MealPlan[] = [
  {
    id: 'low-w1-maint-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'maintenance',
    meals: {
      breakfast: {
        name: 'Oatmeal with Peanut Butter',
        description: 'Hearty oats with protein-rich peanut butter',
        time: '7:00 AM - 8:00 AM',
        ingredients: ['3/4 cup oats', '1.5 cups water', '2 tbsp peanut butter', '1 tsp honey', 'Pinch of salt'],
        instructions: [
          'Boil water in a pot',
          'Add oats and salt, reduce heat',
          'Cook for 5 minutes, stirring occasionally',
          'Stir in peanut butter and honey',
          'Serve warm'
        ],
        macros: { calories: 400, protein: 14, carbs: 52, fats: 16 },
        prepTime: 10,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'halal', 'budget-friendly']
      },
      morningSnack: {
        name: 'Banana with Almonds',
        description: 'Quick energy snack',
        time: '10:30 AM',
        ingredients: ['1 large banana', '10 almonds'],
        instructions: ['Peel banana', 'Eat with almonds'],
        macros: { calories: 180, protein: 4, carbs: 30, fats: 6 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free', 'halal']
      },
      lunch: {
        name: 'Lentil Dal & Rice',
        description: 'Traditional protein-rich lentils with basmati rice',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '1 cup cooked lentils',
          '1 cup cooked basmati rice',
          '1 tbsp oil',
          'Onion, garlic, ginger',
          'Cumin, turmeric, salt'
        ],
        instructions: [
          'Cook lentils until soft',
          'Sauté spices in oil',
          'Add lentils and simmer',
          'Serve over rice'
        ],
        macros: { calories: 480, protein: 22, carbs: 78, fats: 10 },
        prepTime: 35,
        cookingSkill: 'intermediate',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'gluten-free', 'halal', 'high-protein']
      },
      afternoonSnack: {
        name: 'Yogurt with Cucumber',
        description: 'Refreshing raita-style snack',
        time: '4:00 PM',
        ingredients: ['1 cup plain yogurt', '1/2 cucumber diced', 'Mint', 'Salt'],
        instructions: ['Mix yogurt with cucumber', 'Add mint and salt', 'Chill and serve'],
        macros: { calories: 130, protein: 8, carbs: 15, fats: 4 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegetarian', 'gluten-free', 'halal']
      },
      dinner: {
        name: 'Chicken Thigh Stir-fry',
        description: 'Budget-friendly chicken with mixed vegetables and rice',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '6 oz chicken thighs',
          '2 cups mixed frozen vegetables',
          '1 cup cooked rice',
          '2 tbsp soy sauce',
          '1 tbsp oil',
          'Garlic, ginger'
        ],
        instructions: [
          'Cut chicken into bite-sized pieces',
          'Heat oil, cook chicken until golden',
          'Add vegetables and stir-fry',
          'Add soy sauce and seasonings',
          'Serve over rice'
        ],
        macros: { calories: 500, protein: 38, carbs: 55, fats: 15 },
        prepTime: 25,
        cookingSkill: 'intermediate',
        budget: 'low',
        dietTags: ['halal', 'high-protein']
      },
      eveningSnack: {
        name: 'Toast with Jam',
        description: 'Simple evening carb snack',
        time: '9:00 PM',
        ingredients: ['2 slices whole wheat bread', '2 tbsp jam'],
        instructions: ['Toast bread', 'Spread jam', 'Enjoy'],
        macros: { calories: 220, protein: 6, carbs: 44, fats: 3 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'low',
        dietTags: ['vegan', 'vegetarian', 'halal']
      }
    },
    totalMacros: { calories: 1910, protein: 92, carbs: 274, fats: 54 }
  },
  // Days 2-7 condensed format
  { id: 'low-w1-maint-tue', week: 1, day: 2, dayName: 'Tuesday', goal: 'maintenance', meals: {
    breakfast: { name: 'Scrambled Eggs on Toast', description: '3 eggs with whole wheat toast', time: '7:00 AM', ingredients: ['3 eggs', '2 slices bread', '1 tbsp butter', 'Salt', 'Pepper'], instructions: ['Scramble eggs in butter', 'Toast bread', 'Serve together'], macros: { calories: 380, protein: 22, carbs: 30, fats: 18 }, prepTime: 10, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    morningSnack: { name: 'Apple with Peanut Butter', description: 'Sliced apple with PB', time: '10:30 AM', ingredients: ['1 apple', '1 tbsp peanut butter'], instructions: ['Slice apple', 'Dip in peanut butter'], macros: { calories: 180, protein: 4, carbs: 25, fats: 8 }, prepTime: 3, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegan', 'vegetarian', 'halal'] },
    lunch: { name: 'Tuna Pasta Salad', description: 'Canned tuna with pasta and veggies', time: '1:00 PM', ingredients: ['1 can tuna', '2 cups cooked pasta', 'Mixed vegetables', 'Light mayo', 'Lemon'], instructions: ['Mix tuna with pasta', 'Add veggies and mayo', 'Season with lemon'], macros: { calories: 480, protein: 32, carbs: 65, fats: 10 }, prepTime: 15, cookingSkill: 'beginner', budget: 'low', dietTags: ['halal', 'high-protein'] },
    afternoonSnack: { name: 'Boiled Eggs', description: '2 hard-boiled eggs', time: '4:00 PM', ingredients: ['2 eggs', 'Salt'], instructions: ['Boil eggs for 10 min', 'Peel and season'], macros: { calories: 140, protein: 12, carbs: 2, fats: 10 }, prepTime: 12, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal', 'high-protein'] },
    dinner: { name: 'Ground Beef Curry', description: 'Spiced ground beef with rice', time: '7:00 PM', ingredients: ['6 oz ground beef', '1 cup rice', 'Onion', 'Tomatoes', 'Curry spices', 'Oil'], instructions: ['Brown beef', 'Add spices and tomatoes', 'Simmer', 'Serve with rice'], macros: { calories: 520, protein: 35, carbs: 58, fats: 16 }, prepTime: 30, cookingSkill: 'intermediate', budget: 'low', dietTags: ['halal', 'high-protein'] },
    eveningSnack: { name: 'Crackers with Cheese', description: 'Whole grain crackers with cheese', time: '9:00 PM', ingredients: ['10 crackers', '2 oz cheese'], instructions: ['Arrange and eat'], macros: { calories: 190, protein: 8, carbs: 18, fats: 10 }, prepTime: 2, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] }
  }, totalMacros: { calories: 1890, protein: 113, carbs: 198, fats: 72 } },
  { id: 'low-w1-maint-wed', week: 1, day: 3, dayName: 'Wednesday', goal: 'maintenance', meals: {
    breakfast: { name: 'Yogurt Oats Bowl', description: 'Greek yogurt mixed with oats and berries', time: '7:00 AM', ingredients: ['1 cup Greek yogurt', '1/2 cup oats', '1/2 cup berries', 'Honey'], instructions: ['Mix yogurt with oats', 'Top with berries', 'Drizzle honey'], macros: { calories: 395, protein: 24, carbs: 58, fats: 8 }, prepTime: 5, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    morningSnack: { name: 'Orange & Walnuts', description: 'Fresh orange with nuts', time: '10:30 AM', ingredients: ['1 orange', '6 walnuts'], instructions: ['Peel orange', 'Eat with walnuts'], macros: { calories: 160, protein: 3, carbs: 22, fats: 8 }, prepTime: 2, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegan', 'vegetarian', 'halal'] },
    lunch: { name: 'Chicken Fried Rice', description: 'Simple chicken fried rice with vegetables', time: '1:00 PM', ingredients: ['5 oz chicken breast', '2 cups cooked rice', 'Mixed vegetables', '2 eggs', 'Soy sauce', 'Oil'], instructions: ['Cook chicken and dice', 'Scramble eggs', 'Fry rice with veggies', 'Mix all together'], macros: { calories: 500, protein: 38, carbs: 62, fats: 10 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'low', dietTags: ['halal', 'high-protein'] },
    afternoonSnack: { name: 'Chickpeas Roasted', description: 'Spiced roasted chickpeas', time: '4:00 PM', ingredients: ['1 cup chickpeas', 'Spices', 'Oil'], instructions: ['Roast chickpeas with spices'], macros: { calories: 150, protein: 8, carbs: 24, fats: 3 }, prepTime: 25, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegan', 'vegetarian', 'halal'] },
    dinner: { name: 'Chickpea Stew with Rice', description: 'Hearty chickpea curry over rice', time: '7:00 PM', ingredients: ['2 cups chickpeas', '1 cup rice', 'Tomatoes', 'Onions', 'Spices', 'Oil'], instructions: ['Sauté onions', 'Add chickpeas and spices', 'Simmer with tomatoes', 'Serve with rice'], macros: { calories: 510, protein: 20, carbs: 88, fats: 10 }, prepTime: 35, cookingSkill: 'intermediate', budget: 'low', dietTags: ['vegan', 'vegetarian', 'halal'] },
    eveningSnack: { name: 'Milk & Cookies', description: 'Glass of milk with biscuits', time: '9:00 PM', ingredients: ['1 cup milk', '3 cookies'], instructions: ['Pour milk', 'Enjoy with cookies'], macros: { calories: 190, protein: 8, carbs: 28, fats: 6 }, prepTime: 2, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] }
  }, totalMacros: { calories: 1905, protein: 101, carbs: 282, fats: 45 } },
  { id: 'low-w1-maint-thu', week: 1, day: 4, dayName: 'Thursday', goal: 'maintenance', meals: {
    breakfast: { name: 'Cheese Omelette', description: '3-egg omelette with cheese', time: '7:00 AM', ingredients: ['3 eggs', '2 oz cheese', '1 tbsp butter', 'Salt', 'Pepper'], instructions: ['Beat eggs', 'Cook in butter', 'Add cheese and fold'], macros: { calories: 400, protein: 28, carbs: 4, fats: 32 }, prepTime: 10, cookingSkill: 'intermediate', budget: 'low', dietTags: ['vegetarian', 'halal', 'high-protein'] },
    morningSnack: { name: 'Dates & Almonds', description: 'Natural energy from dates and nuts', time: '10:30 AM', ingredients: ['4 dates', '8 almonds'], instructions: ['Eat dates with almonds'], macros: { calories: 190, protein: 3, carbs: 34, fats: 6 }, prepTime: 1, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegan', 'vegetarian', 'halal'] },
    lunch: { name: 'Lentil Soup with Bread', description: 'Hearty lentil soup with whole grain bread', time: '1:00 PM', ingredients: ['2 cups lentil soup', 'Vegetables', 'Spices', '2 slices bread'], instructions: ['Cook lentil soup', 'Toast bread', 'Serve together'], macros: { calories: 450, protein: 24, carbs: 72, fats: 8 }, prepTime: 30, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegan', 'vegetarian', 'halal'] },
    afternoonSnack: { name: 'Hummus with Pita', description: 'Chickpea hummus with pita bread', time: '4:00 PM', ingredients: ['1/3 cup hummus', '1 pita bread'], instructions: ['Dip pita in hummus'], macros: { calories: 180, protein: 7, carbs: 28, fats: 5 }, prepTime: 2, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegan', 'vegetarian', 'halal'] },
    dinner: { name: 'Spicy Tuna Rice Bowl', description: 'Canned tuna with spicy sauce over rice', time: '7:00 PM', ingredients: ['2 cans tuna', '1.5 cups rice', 'Sriracha mayo', 'Cucumber', 'Seaweed'], instructions: ['Mix tuna with sauce', 'Prepare rice', 'Assemble bowl'], macros: { calories: 480, protein: 45, carbs: 58, fats: 8 }, prepTime: 15, cookingSkill: 'beginner', budget: 'low', dietTags: ['halal', 'high-protein'] },
    eveningSnack: { name: 'Popcorn', description: 'Air-popped popcorn with seasoning', time: '9:00 PM', ingredients: ['3 cups popcorn', 'Salt', 'Seasoning'], instructions: ['Pop corn', 'Season lightly'], macros: { calories: 200, protein: 6, carbs: 38, fats: 4 }, prepTime: 5, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegan', 'vegetarian', 'halal'] }
  }, totalMacros: { calories: 1900, protein: 113, carbs: 234, fats: 63 } },
  { id: 'low-w1-maint-fri', week: 1, day: 5, dayName: 'Friday', goal: 'maintenance', meals: {
    breakfast: { name: 'Egg Mayo Sandwich', description: 'Mashed boiled eggs with mayo on bread', time: '7:00 AM', ingredients: ['3 boiled eggs', '2 tbsp mayo', '2 slices bread', 'Lettuce'], instructions: ['Mash eggs with mayo', 'Spread on bread', 'Add lettuce'], macros: { calories: 390, protein: 20, carbs: 32, fats: 20 }, prepTime: 12, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    morningSnack: { name: 'Grapes & Cheese', description: 'Fresh grapes with cheese cubes', time: '10:30 AM', ingredients: ['1 cup grapes', '1 oz cheese'], instructions: ['Wash grapes', 'Cut cheese', 'Enjoy together'], macros: { calories: 170, protein: 5, carbs: 26, fats: 6 }, prepTime: 3, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    lunch: { name: 'Chicken & Potato Stew', description: 'Hearty chicken stew with potatoes', time: '1:00 PM', ingredients: ['6 oz chicken', '2 medium potatoes', 'Carrots', 'Onions', 'Chicken broth', 'Spices'], instructions: ['Brown chicken', 'Add vegetables and broth', 'Simmer until tender'], macros: { calories: 485, protein: 36, carbs: 54, fats: 12 }, prepTime: 40, cookingSkill: 'intermediate', budget: 'low', dietTags: ['halal', 'high-protein'] },
    afternoonSnack: { name: 'Banana Smoothie', description: 'Banana blended with milk', time: '4:00 PM', ingredients: ['1 banana', '1 cup milk', 'Ice'], instructions: ['Blend all ingredients'], macros: { calories: 180, protein: 8, carbs: 32, fats: 3 }, prepTime: 3, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    dinner: { name: 'Veggie Biryani (Simple)', description: 'Spiced rice with mixed vegetables', time: '7:00 PM', ingredients: ['2 cups rice', 'Mixed vegetables', 'Biryani spices', 'Yogurt', 'Oil'], instructions: ['Layer rice and spiced vegetables', 'Cook on low heat', 'Serve with yogurt'], macros: { calories: 540, protein: 14, carbs: 95, fats: 12 }, prepTime: 45, cookingSkill: 'intermediate', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    eveningSnack: { name: 'Tea & Biscuits', description: 'Hot tea with digestive biscuits', time: '9:00 PM', ingredients: ['Tea', 'Milk', 'Sugar', '3 biscuits'], instructions: ['Brew tea', 'Add milk and sugar', 'Enjoy with biscuits'], macros: { calories: 130, protein: 3, carbs: 25, fats: 3 }, prepTime: 5, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] }
  }, totalMacros: { calories: 1895, protein: 86, carbs: 264, fats: 56 } },
  { id: 'low-w1-maint-sat', week: 1, day: 6, dayName: 'Saturday', goal: 'maintenance', meals: {
    breakfast: { name: 'French Toast', description: 'Egg-dipped bread pan-fried', time: '7:00 AM', ingredients: ['3 slices bread', '2 eggs', '1/4 cup milk', 'Cinnamon', 'Butter', 'Syrup'], instructions: ['Beat eggs with milk', 'Dip bread', 'Fry until golden', 'Top with syrup'], macros: { calories: 420, protein: 16, carbs: 58, fats: 14 }, prepTime: 15, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    morningSnack: { name: 'Trail Mix', description: 'Mixed nuts and dried fruit', time: '10:30 AM', ingredients: ['1/4 cup mixed nuts', '2 tbsp raisins'], instructions: ['Mix and portion'], macros: { calories: 180, protein: 5, carbs: 20, fats: 10 }, prepTime: 1, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegan', 'vegetarian', 'halal'] },
    lunch: { name: 'Bean Burrito Bowl', description: 'Black beans with rice and toppings', time: '1:00 PM', ingredients: ['1.5 cups black beans', '1 cup rice', 'Salsa', 'Lettuce', 'Cheese', 'Sour cream'], instructions: ['Layer rice and beans', 'Top with salsa and toppings'], macros: { calories: 510, protein: 22, carbs: 82, fats: 10 }, prepTime: 20, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    afternoonSnack: { name: 'Cottage Cheese with Tomato', description: 'Simple cottage cheese snack', time: '4:00 PM', ingredients: ['1 cup cottage cheese', '1 tomato', 'Salt', 'Pepper'], instructions: ['Slice tomato', 'Top cottage cheese', 'Season'], macros: { calories: 140, protein: 16, carbs: 10, fats: 4 }, prepTime: 3, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    dinner: { name: 'Chicken Curry with Roti', description: 'Simple chicken curry with flatbread', time: '7:00 PM', ingredients: ['6 oz chicken', 'Curry spices', 'Tomatoes', 'Onions', '2 roti breads', 'Oil'], instructions: ['Cook chicken curry', 'Warm roti', 'Serve together'], macros: { calories: 485, protein: 40, carbs: 48, fats: 14 }, prepTime: 35, cookingSkill: 'intermediate', budget: 'low', dietTags: ['halal', 'high-protein'] },
    eveningSnack: { name: 'Fruit Salad', description: 'Mixed seasonal fruits', time: '9:00 PM', ingredients: ['1 apple', '1 orange', '1/2 banana', 'Berries'], instructions: ['Dice fruits', 'Mix together'], macros: { calories: 180, protein: 2, carbs: 45, fats: 1 }, prepTime: 5, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegan', 'vegetarian', 'halal'] }
  }, totalMacros: { calories: 1915, protein: 101, carbs: 263, fats: 53 } },
  { id: 'low-w1-maint-sun', week: 1, day: 7, dayName: 'Sunday', goal: 'maintenance', meals: {
    breakfast: { name: 'Potato Egg Hash', description: 'Diced potatoes with scrambled eggs', time: '7:00 AM', ingredients: ['2 medium potatoes', '3 eggs', 'Onion', 'Bell pepper', 'Oil', 'Spices'], instructions: ['Dice and fry potatoes', 'Add vegetables', 'Scramble in eggs'], macros: { calories: 410, protein: 20, carbs: 48, fats: 16 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    morningSnack: { name: 'Peanut Butter Toast', description: 'Whole wheat toast with PB', time: '10:30 AM', ingredients: ['2 slices bread', '2 tbsp peanut butter'], instructions: ['Toast bread', 'Spread peanut butter'], macros: { calories: 280, protein: 10, carbs: 32, fats: 14 }, prepTime: 3, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegan', 'vegetarian', 'halal'] },
    lunch: { name: 'Pasta Marinara', description: 'Simple pasta with tomato sauce', time: '1:00 PM', ingredients: ['2.5 cups cooked pasta', 'Marinara sauce', 'Garlic', 'Basil', 'Parmesan'], instructions: ['Cook pasta', 'Heat sauce', 'Toss together', 'Top with cheese'], macros: { calories: 450, protein: 16, carbs: 78, fats: 8 }, prepTime: 15, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    afternoonSnack: { name: 'Carrots & Ranch', description: 'Carrot sticks with ranch dip', time: '4:00 PM', ingredients: ['3 carrots', '3 tbsp ranch dressing'], instructions: ['Cut carrots', 'Dip in ranch'], macros: { calories: 140, protein: 2, carbs: 18, fats: 7 }, prepTime: 5, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] },
    dinner: { name: 'Chicken Rice Bake', description: 'Baked chicken with rice casserole', time: '7:00 PM', ingredients: ['6 oz chicken', '1.5 cups rice', 'Cream soup', 'Mixed vegetables', 'Cheese'], instructions: ['Mix all ingredients', 'Bake at 375°F for 30 min', 'Serve hot'], macros: { calories: 520, protein: 42, carbs: 62, fats: 12 }, prepTime: 40, cookingSkill: 'intermediate', budget: 'low', dietTags: ['halal', 'high-protein'] },
    eveningSnack: { name: 'Graham Crackers & Milk', description: 'Whole grain crackers with milk', time: '9:00 PM', ingredients: ['4 graham crackers', '1 cup milk'], instructions: ['Dip crackers in milk'], macros: { calories: 200, protein: 9, carbs: 33, fats: 4 }, prepTime: 2, cookingSkill: 'beginner', budget: 'low', dietTags: ['vegetarian', 'halal'] }
  }, totalMacros: { calories: 1900, protein: 99, carbs: 271, fats: 61 } }
];

// ============================================
// MEDIUM BUDGET MAINTENANCE MEALS
// ============================================
export const MEDIUM_BUDGET_MAINTENANCE: MealPlan[] = [
  {
    id: 'med-w1-maint-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'maintenance',
    meals: {
      breakfast: {
        name: 'Greek Yogurt Parfait',
        description: 'Layered Greek yogurt with granola, berries, and honey',
        time: '7:00 AM - 8:00 AM',
        ingredients: [
          '1.5 cups Greek yogurt',
          '1/2 cup granola',
          '1/2 cup mixed berries',
          '2 tbsp honey',
          '1 tbsp chia seeds'
        ],
        instructions: [
          'Layer yogurt in a bowl',
          'Add granola and berries',
          'Drizzle with honey',
          'Sprinkle chia seeds on top',
          'Serve immediately'
        ],
        macros: { calories: 450, protein: 28, carbs: 62, fats: 12 },
        prepTime: 8,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegetarian', 'halal', 'high-protein']
      },
      morningSnack: {
        name: 'Protein Bar & Coffee',
        description: 'Quality protein bar with coffee',
        time: '10:30 AM',
        ingredients: ['1 protein bar (20g protein)', 'Coffee with milk'],
        instructions: ['Enjoy protein bar with coffee'],
        macros: { calories: 250, protein: 20, carbs: 28, fats: 8 },
        prepTime: 2,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['halal', 'high-protein']
      },
      lunch: {
        name: 'Chicken Quinoa Bowl',
        description: 'Grilled chicken breast with quinoa and roasted vegetables',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '6 oz chicken breast',
          '1 cup cooked quinoa',
          '2 cups roasted vegetables (bell peppers, zucchini, carrots)',
          '2 tbsp olive oil',
          'Lemon juice, herbs'
        ],
        instructions: [
          'Season and grill chicken breast',
          'Cook quinoa according to package',
          'Roast vegetables with olive oil',
          'Assemble bowl and drizzle with lemon',
          'Garnish with fresh herbs'
        ],
        macros: { calories: 550, protein: 48, carbs: 52, fats: 16 },
        prepTime: 35,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'gluten-free', 'high-protein']
      },
      afternoonSnack: {
        name: 'Apple Slices with Almond Butter',
        description: 'Fresh apple with natural almond butter',
        time: '4:00 PM',
        ingredients: ['1 large apple', '2 tbsp almond butter'],
        instructions: ['Slice apple', 'Dip in almond butter', 'Enjoy'],
        macros: { calories: 220, protein: 6, carbs: 30, fats: 10 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegan', 'vegetarian', 'gluten-free', 'halal']
      },
      dinner: {
        name: 'Beef Keema with Roti',
        description: 'Spiced minced beef curry with whole wheat flatbread',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '7 oz lean ground beef',
          '1/2 cup peas',
          'Onions, tomatoes, garlic, ginger',
          'Garam masala, cumin, turmeric',
          '2 whole wheat roti',
          '1 tbsp oil'
        ],
        instructions: [
          'Sauté onions, garlic, and ginger',
          'Add ground beef and brown',
          'Add spices, tomatoes, and peas',
          'Simmer until cooked through',
          'Serve hot with roti'
        ],
        macros: { calories: 520, protein: 45, carbs: 42, fats: 18 },
        prepTime: 30,
        cookingSkill: 'intermediate',
        budget: 'medium',
        dietTags: ['halal', 'high-protein']
      },
      eveningSnack: {
        name: 'Mixed Nuts',
        description: 'Portion-controlled mixed nuts',
        time: '9:00 PM',
        ingredients: ['1 oz mixed nuts (almonds, cashews, walnuts)'],
        instructions: ['Portion and enjoy'],
        macros: { calories: 170, protein: 6, carbs: 8, fats: 14 },
        prepTime: 1,
        cookingSkill: 'beginner',
        budget: 'medium',
        dietTags: ['vegan', 'vegetarian', 'gluten-free', 'halal']
      }
    },
    totalMacros: { calories: 2160, protein: 153, carbs: 222, fats: 78 }
  },
  // Days 2-7 condensed format
  { id: 'med-w1-maint-tue', week: 1, day: 2, dayName: 'Tuesday', goal: 'maintenance', meals: {
    breakfast: { name: 'Avocado Toast with Egg', description: 'Whole grain toast topped with avocado and poached egg', time: '7:00 AM', ingredients: ['2 slices whole grain bread', '1 avocado', '2 eggs', 'Cherry tomatoes', 'Feta cheese', 'Olive oil'], instructions: ['Toast bread', 'Mash avocado on toast', 'Poach eggs', 'Top with egg and feta'], macros: { calories: 450, protein: 22, carbs: 42, fats: 22 }, prepTime: 15, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['vegetarian', 'halal'] },
    morningSnack: { name: 'Protein Shake', description: 'Whey protein with banana', time: '10:30 AM', ingredients: ['1 scoop whey protein', '1 banana', '1 cup almond milk', 'Ice'], instructions: ['Blend all ingredients'], macros: { calories: 280, protein: 26, carbs: 34, fats: 6 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    lunch: { name: 'Turkey Meatballs & Pasta', description: 'Homemade turkey meatballs with marinara and pasta', time: '1:00 PM', ingredients: ['6 oz ground turkey', '2 cups pasta', 'Marinara sauce', 'Parmesan', 'Herbs'], instructions: ['Form and bake meatballs', 'Cook pasta', 'Toss with sauce'], macros: { calories: 560, protein: 42, carbs: 68, fats: 12 }, prepTime: 35, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    afternoonSnack: { name: 'Hummus & Veggies', description: 'Fresh vegetables with hummus', time: '4:00 PM', ingredients: ['1/2 cup hummus', 'Carrots', 'Cucumber', 'Bell peppers'], instructions: ['Slice vegetables', 'Dip in hummus'], macros: { calories: 180, protein: 8, carbs: 22, fats: 8 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian', 'halal'] },
    dinner: { name: 'Salmon with Sweet Potato', description: 'Baked salmon with roasted sweet potato and asparagus', time: '7:00 PM', ingredients: ['6 oz salmon', '1 large sweet potato', 'Asparagus', 'Olive oil', 'Lemon', 'Herbs'], instructions: ['Season and bake salmon', 'Roast sweet potato', 'Steam asparagus'], macros: { calories: 510, protein: 44, carbs: 48, fats: 16 }, prepTime: 30, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'gluten-free', 'high-protein', 'omega-3'] },
    eveningSnack: { name: 'Cottage Cheese with Berries', description: 'Low-fat cottage cheese with fresh berries', time: '9:00 PM', ingredients: ['1 cup cottage cheese', '1/2 cup berries'], instructions: ['Top cottage cheese with berries'], macros: { calories: 180, protein: 18, carbs: 18, fats: 3 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'halal', 'high-protein'] }
  }, totalMacros: { calories: 2160, protein: 160, carbs: 232, fats: 67 } },
  { id: 'med-w1-maint-wed', week: 1, day: 3, dayName: 'Wednesday', goal: 'maintenance', meals: {
    breakfast: { name: 'Halal Beef & Egg Omelette', description: '3-egg omelette with halal beef strips and vegetables', time: '7:00 AM', ingredients: ['3 eggs', '3 oz halal beef strips', 'Bell peppers', 'Onions', 'Cheese', 'Whole wheat toast'], instructions: ['Cook halal beef strips', 'Make omelette with veggies', 'Serve with toast'], macros: { calories: 420, protein: 32, carbs: 28, fats: 20 }, prepTime: 15, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    morningSnack: { name: 'Greek Yogurt with Honey', description: 'Plain Greek yogurt with honey and walnuts', time: '10:30 AM', ingredients: ['1 cup Greek yogurt', '1 tbsp honey', '6 walnuts'], instructions: ['Top yogurt with honey and nuts'], macros: { calories: 240, protein: 18, carbs: 24, fats: 10 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'halal'] },
    lunch: { name: 'Beef Stir-Fry & Rice', description: 'Tender beef strips with mixed vegetables over rice', time: '1:00 PM', ingredients: ['6 oz beef sirloin', 'Mixed stir-fry vegetables', '1.5 cups rice', 'Soy sauce', 'Garlic', 'Ginger', 'Oil'], instructions: ['Slice beef thinly', 'Stir-fry with vegetables', 'Serve over rice'], macros: { calories: 580, protein: 44, carbs: 64, fats: 14 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    afternoonSnack: { name: 'Trail Mix', description: 'Homemade trail mix with nuts and dried fruit', time: '4:00 PM', ingredients: ['Mixed nuts', 'Dried cranberries', 'Dark chocolate chips'], instructions: ['Mix and portion'], macros: { calories: 200, protein: 6, carbs: 24, fats: 10 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'halal'] },
    dinner: { name: 'Roast Chicken & Vegetables', description: 'Herb-roasted chicken with root vegetables', time: '7:00 PM', ingredients: ['7 oz chicken thighs', 'Potatoes', 'Carrots', 'Onions', 'Herbs', 'Olive oil'], instructions: ['Season chicken and vegetables', 'Roast at 400°F for 35 min', 'Serve hot'], macros: { calories: 500, protein: 42, carbs: 46, fats: 16 }, prepTime: 45, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'gluten-free', 'high-protein'] },
    eveningSnack: { name: 'Dark Chocolate & Almonds', description: 'Quality dark chocolate with almonds', time: '9:00 PM', ingredients: ['2 squares dark chocolate', '10 almonds'], instructions: ['Enjoy together'], macros: { calories: 180, protein: 4, carbs: 16, fats: 12 }, prepTime: 1, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'halal'] }
  }, totalMacros: { calories: 2120, protein: 146, carbs: 202, fats: 82 } },
  { id: 'med-w1-maint-thu', week: 1, day: 4, dayName: 'Thursday', goal: 'maintenance', meals: {
    breakfast: { name: 'Protein Oats', description: 'Oatmeal with protein powder and toppings', time: '7:00 AM', ingredients: ['3/4 cup oats', '1 scoop protein powder', 'Banana', 'Almond butter', 'Cinnamon'], instructions: ['Cook oats', 'Stir in protein powder', 'Top with banana and almond butter'], macros: { calories: 480, protein: 32, carbs: 62, fats: 12 }, prepTime: 10, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'halal', 'high-protein'] },
    morningSnack: { name: 'Boiled Eggs & Fruit', description: '2 boiled eggs with an orange', time: '10:30 AM', ingredients: ['2 eggs', '1 orange'], instructions: ['Boil eggs', 'Peel orange', 'Enjoy together'], macros: { calories: 200, protein: 14, carbs: 18, fats: 10 }, prepTime: 12, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'halal', 'high-protein'] },
    lunch: { name: 'Shrimp Pasta', description: 'Garlic shrimp with linguine and vegetables', time: '1:00 PM', ingredients: ['6 oz shrimp', '2 cups pasta', 'Cherry tomatoes', 'Spinach', 'Garlic', 'Olive oil', 'Parmesan'], instructions: ['Cook pasta', 'Sauté shrimp with garlic', 'Toss with vegetables and pasta'], macros: { calories: 540, protein: 42, carbs: 68, fats: 10 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    afternoonSnack: { name: 'Protein Smoothie', description: 'Berry protein smoothie', time: '4:00 PM', ingredients: ['Protein powder', 'Mixed berries', 'Spinach', 'Almond milk'], instructions: ['Blend all ingredients'], macros: { calories: 180, protein: 22, carbs: 20, fats: 4 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    dinner: { name: 'Chicken Wrap', description: 'Grilled chicken wrap with vegetables and sauce', time: '7:00 PM', ingredients: ['6 oz chicken breast', 'Whole wheat tortilla', 'Lettuce', 'Tomatoes', 'Cheese', 'Ranch dressing'], instructions: ['Grill chicken', 'Assemble wrap with toppings', 'Cut and serve'], macros: { calories: 480, protein: 46, carbs: 42, fats: 14 }, prepTime: 18, cookingSkill: 'beginner', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    eveningSnack: { name: 'String Cheese & Crackers', description: 'Part-skim mozzarella with crackers', time: '9:00 PM', ingredients: ['2 string cheese', '8 whole grain crackers'], instructions: ['Arrange and eat'], macros: { calories: 200, protein: 12, carbs: 18, fats: 10 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'halal'] }
  }, totalMacros: { calories: 2080, protein: 168, carbs: 228, fats: 60 } },
  { id: 'med-w1-maint-fri', week: 1, day: 5, dayName: 'Friday', goal: 'maintenance', meals: {
    breakfast: { name: 'Shakshuka', description: 'Eggs poached in spicy tomato sauce with bread', time: '7:00 AM', ingredients: ['3 eggs', 'Tomato sauce', 'Bell peppers', 'Onions', 'Cumin', 'Paprika', 'Whole grain pita'], instructions: ['Simmer sauce with spices', 'Crack eggs into sauce', 'Cook until eggs set', 'Serve with pita'], macros: { calories: 420, protein: 24, carbs: 48, fats: 16 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['vegetarian', 'halal'] },
    morningSnack: { name: 'Banana & Peanut Butter', description: 'Banana with natural peanut butter', time: '10:30 AM', ingredients: ['1 banana', '1.5 tbsp peanut butter'], instructions: ['Slice banana', 'Dip in peanut butter'], macros: { calories: 220, protein: 6, carbs: 32, fats: 10 }, prepTime: 2, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian', 'halal'] },
    lunch: { name: 'Tuna Niçoise Salad', description: 'Classic French salad with tuna, eggs, and vegetables', time: '1:00 PM', ingredients: ['2 cans tuna', '2 boiled eggs', 'Green beans', 'Potatoes', 'Olives', 'Lettuce', 'Vinaigrette'], instructions: ['Arrange all ingredients on plate', 'Drizzle with dressing'], macros: { calories: 520, protein: 48, carbs: 42, fats: 18 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'gluten-free', 'high-protein'] },
    afternoonSnack: { name: 'Edamame', description: 'Steamed edamame with sea salt', time: '4:00 PM', ingredients: ['1.5 cups edamame', 'Sea salt'], instructions: ['Steam edamame', 'Sprinkle with salt'], macros: { calories: 180, protein: 16, carbs: 14, fats: 8 }, prepTime: 8, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian', 'halal', 'high-protein'] },
    dinner: { name: 'Lamb Chop & Couscous', description: 'Grilled lamb chops with herb couscous and vegetables', time: '7:00 PM', ingredients: ['6 oz lamb chops', '1 cup couscous', 'Mixed vegetables', 'Herbs', 'Olive oil'], instructions: ['Season and grill lamb', 'Prepare couscous', 'Roast vegetables', 'Plate together'], macros: { calories: 540, protein: 42, carbs: 52, fats: 16 }, prepTime: 30, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    eveningSnack: { name: 'Greek Yogurt Bark', description: 'Frozen yogurt bark with berries', time: '9:00 PM', ingredients: ['Greek yogurt', 'Berries', 'Honey'], instructions: ['Freeze yogurt with toppings', 'Break into pieces'], macros: { calories: 160, protein: 12, carbs: 24, fats: 3 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'halal'] }
  }, totalMacros: { calories: 2040, protein: 148, carbs: 212, fats: 71 } },
  { id: 'med-w1-maint-sat', week: 1, day: 6, dayName: 'Saturday', goal: 'maintenance', meals: {
    breakfast: { name: 'Blueberry Pancakes', description: 'Whole wheat pancakes with fresh blueberries', time: '7:00 AM', ingredients: ['1 cup pancake mix', 'Egg', 'Milk', '1/2 cup blueberries', 'Maple syrup', 'Butter'], instructions: ['Mix batter', 'Cook pancakes', 'Top with blueberries and syrup'], macros: { calories: 460, protein: 16, carbs: 72, fats: 14 }, prepTime: 18, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['vegetarian', 'halal'] },
    morningSnack: { name: 'Jerky & Nuts', description: 'Beef jerky with mixed nuts', time: '10:30 AM', ingredients: ['2 oz beef jerky', '1/2 oz almonds'], instructions: ['Portion and enjoy'], macros: { calories: 220, protein: 22, carbs: 10, fats: 12 }, prepTime: 1, cookingSkill: 'beginner', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    lunch: { name: 'Chicken Burger (Quick)', description: 'Grilled chicken burger with sweet potato fries', time: '1:00 PM', ingredients: ['6 oz chicken breast', 'Whole wheat bun', 'Lettuce', 'Tomato', 'Sweet potato', 'Olive oil'], instructions: ['Grill chicken', 'Bake sweet potato fries', 'Assemble burger'], macros: { calories: 540, protein: 46, carbs: 58, fats: 14 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    afternoonSnack: { name: 'Protein Bar', description: 'Quality protein bar', time: '4:00 PM', ingredients: ['1 protein bar'], instructions: ['Enjoy'], macros: { calories: 200, protein: 20, carbs: 22, fats: 8 }, prepTime: 1, cookingSkill: 'beginner', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    dinner: { name: 'Beef & Broccoli', description: 'Stir-fried beef with broccoli over rice', time: '7:00 PM', ingredients: ['6 oz beef', '3 cups broccoli', '1 cup rice', 'Soy sauce', 'Garlic', 'Ginger', 'Oil'], instructions: ['Slice beef thinly', 'Stir-fry with broccoli', 'Serve over rice'], macros: { calories: 500, protein: 42, carbs: 54, fats: 12 }, prepTime: 22, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    eveningSnack: { name: 'Popcorn with Parmesan', description: 'Air-popped popcorn with parmesan', time: '9:00 PM', ingredients: ['3 cups popcorn', '2 tbsp parmesan', 'Olive oil spray'], instructions: ['Pop corn', 'Spray with oil', 'Sprinkle cheese'], macros: { calories: 170, protein: 6, carbs: 22, fats: 8 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'halal'] }
  }, totalMacros: { calories: 2090, protein: 152, carbs: 238, fats: 68 } },
  { id: 'med-w1-maint-sun', week: 1, day: 7, dayName: 'Sunday', goal: 'maintenance', meals: {
    breakfast: { name: 'Halal Full English', description: 'Complete breakfast with halal beef rashers, eggs, beans, tomato', time: '8:00 AM', ingredients: ['3 eggs', '3 halal beef rashers', 'Baked beans', 'Grilled tomato', 'Mushrooms', 'Toast'], instructions: ['Cook all components', 'Arrange on plate'], macros: { calories: 480, protein: 34, carbs: 48, fats: 18 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    morningSnack: { name: 'Smoothie Bowl', description: 'Thick smoothie with toppings', time: '11:00 AM', ingredients: ['Frozen berries', 'Banana', 'Protein powder', 'Granola', 'Coconut'], instructions: ['Blend thick smoothie', 'Top with granola and coconut'], macros: { calories: 280, protein: 22, carbs: 42, fats: 6 }, prepTime: 8, cookingSkill: 'beginner', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    lunch: { name: 'Cod Fish & Chips (Baked)', description: 'Oven-baked cod with potato wedges', time: '1:30 PM', ingredients: ['7 oz cod', '2 medium potatoes', 'Breadcrumbs', 'Lemon', 'Tartar sauce', 'Peas'], instructions: ['Bread and bake cod', 'Bake potato wedges', 'Serve with peas'], macros: { calories: 520, protein: 46, carbs: 58, fats: 10 }, prepTime: 35, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    afternoonSnack: { name: 'Celery & Almond Butter', description: 'Celery sticks with almond butter', time: '4:00 PM', ingredients: ['4 celery sticks', '2 tbsp almond butter'], instructions: ['Fill celery with almond butter'], macros: { calories: 180, protein: 6, carbs: 12, fats: 14 }, prepTime: 3, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegan', 'vegetarian', 'halal'] },
    dinner: { name: 'Healthy Butter Chicken', description: 'Lighter version of butter chicken with naan', time: '7:00 PM', ingredients: ['7 oz chicken breast', 'Tomato sauce', 'Yogurt', 'Butter chicken spices', 'Whole wheat naan'], instructions: ['Marinate chicken in yogurt and spices', 'Cook in sauce', 'Serve with naan'], macros: { calories: 520, protein: 48, carbs: 52, fats: 12 }, prepTime: 35, cookingSkill: 'intermediate', budget: 'medium', dietTags: ['halal', 'high-protein'] },
    eveningSnack: { name: 'Protein Pudding', description: 'Chocolate protein pudding', time: '9:00 PM', ingredients: ['Protein powder', 'Milk', 'Cocoa', 'Sweetener'], instructions: ['Mix and chill'], macros: { calories: 160, protein: 24, carbs: 12, fats: 4 }, prepTime: 5, cookingSkill: 'beginner', budget: 'medium', dietTags: ['vegetarian', 'halal', 'high-protein'] }
  }, totalMacros: { calories: 2140, protein: 180, carbs: 224, fats: 64 } }
];

// ============================================
// HIGH BUDGET MAINTENANCE MEALS
// ============================================
export const HIGH_BUDGET_MAINTENANCE: MealPlan[] = [
  {
    id: 'high-w1-maint-mon',
    week: 1,
    day: 1,
    dayName: 'Monday',
    goal: 'maintenance',
    meals: {
      breakfast: {
        name: 'Smoked Salmon & Avocado',
        description: 'Premium smoked salmon with avocado on sourdough',
        time: '7:00 AM - 8:00 AM',
        ingredients: [
          '4 oz smoked salmon',
          '1 avocado',
          '2 slices sourdough bread',
          '2 eggs (poached)',
          'Capers, red onion',
          'Cream cheese',
          'Fresh dill'
        ],
        instructions: [
          'Toast sourdough bread',
          'Spread cream cheese on toast',
          'Layer smoked salmon and avocado',
          'Top with poached eggs',
          'Garnish with capers, onion, and dill'
        ],
        macros: { calories: 500, protein: 32, carbs: 38, fats: 26 },
        prepTime: 15,
        cookingSkill: 'intermediate',
        budget: 'high',
        dietTags: ['halal', 'high-protein', 'omega-3', 'gourmet']
      },
      morningSnack: {
        name: 'Premium Protein Smoothie',
        description: 'Grass-fed whey with organic fruits',
        time: '10:30 AM',
        ingredients: [
          '1 scoop grass-fed whey protein',
          '1/2 cup blueberries',
          'Acai powder',
          'Almond butter',
          'Coconut water',
          'Chia seeds'
        ],
        instructions: ['Blend all ingredients until smooth', 'Serve immediately'],
        macros: { calories: 280, protein: 28, carbs: 28, fats: 10 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'high',
        dietTags: ['halal', 'high-protein']
      },
      lunch: {
        name: 'Sirloin Steak Salad',
        description: 'Grilled sirloin over mixed greens with premium toppings',
        time: '1:00 PM - 2:00 PM',
        ingredients: [
          '7 oz sirloin steak',
          'Mixed organic greens',
          'Cherry tomatoes',
          'Blue cheese crumbles',
          'Walnuts',
          'Balsamic vinaigrette',
          'Avocado'
        ],
        instructions: [
          'Season and grill steak to medium-rare',
          'Let rest, then slice thinly',
          'Arrange greens with toppings',
          'Top with sliced steak',
          'Drizzle with vinaigrette'
        ],
        macros: { calories: 600, protein: 52, carbs: 28, fats: 34 },
        prepTime: 20,
        cookingSkill: 'intermediate',
        budget: 'high',
        dietTags: ['halal', 'gluten-free', 'high-protein', 'gourmet']
      },
      afternoonSnack: {
        name: 'Artisan Cheese & Crackers',
        description: 'Premium cheese selection with gourmet crackers',
        time: '4:00 PM',
        ingredients: [
          'Aged cheddar',
          'Brie',
          'Gourmet crackers',
          'Fig jam',
          'Walnuts'
        ],
        instructions: ['Arrange cheese board', 'Serve with crackers and jam'],
        macros: { calories: 240, protein: 12, carbs: 20, fats: 14 },
        prepTime: 5,
        cookingSkill: 'beginner',
        budget: 'high',
        dietTags: ['vegetarian', 'halal']
      },
      dinner: {
        name: 'Sea Bass with Quinoa',
        description: 'Pan-seared Chilean sea bass with herb quinoa and asparagus',
        time: '7:00 PM - 8:00 PM',
        ingredients: [
          '7 oz Chilean sea bass',
          '1 cup cooked quinoa',
          'Asparagus',
          'Lemon butter sauce',
          'Fresh herbs',
          'White wine',
          'Olive oil'
        ],
        instructions: [
          'Season sea bass with herbs',
          'Pan-sear in olive oil until crispy',
          'Prepare lemon butter sauce',
          'Cook quinoa with herbs',
          'Roast asparagus',
          'Plate elegantly'
        ],
        macros: { calories: 550, protein: 48, carbs: 42, fats: 20 },
        prepTime: 30,
        cookingSkill: 'advanced',
        budget: 'high',
        dietTags: ['halal', 'gluten-free', 'high-protein', 'gourmet']
      },
      eveningSnack: {
        name: 'Dark Chocolate & Berries',
        description: 'Premium dark chocolate with fresh berries',
        time: '9:00 PM',
        ingredients: [
          '2 oz premium dark chocolate (85%)',
          '1/2 cup mixed berries',
          'Whipped cream'
        ],
        instructions: ['Arrange chocolate and berries', 'Top with whipped cream'],
        macros: { calories: 220, protein: 4, carbs: 24, fats: 14 },
        prepTime: 3,
        cookingSkill: 'beginner',
        budget: 'high',
        dietTags: ['vegetarian', 'halal']
      }
    },
    totalMacros: { calories: 2390, protein: 176, carbs: 180, fats: 118 }
  },
  // Days 2-7 condensed format
  { id: 'high-w1-maint-tue', week: 1, day: 2, dayName: 'Tuesday', goal: 'maintenance', meals: {
    breakfast: { name: 'Steak & Eggs', description: 'Premium beef tenderloin with organic eggs', time: '7:00 AM', ingredients: ['5 oz beef tenderloin', '3 eggs', 'Truffle hash browns', 'Grilled tomatoes', 'Sourdough toast'], instructions: ['Sear steak to preference', 'Fry eggs', 'Prepare hash browns', 'Toast bread'], macros: { calories: 520, protein: 42, carbs: 38, fats: 24 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'high', dietTags: ['halal', 'high-protein', 'gourmet'] },
    morningSnack: { name: 'Greek Yogurt Parfait Premium', description: 'Organic Greek yogurt with gourmet toppings', time: '10:30 AM', ingredients: ['Organic Greek yogurt', 'Manuka honey', 'Granola', 'Exotic berries', 'Pistachios'], instructions: ['Layer yogurt with toppings'], macros: { calories: 300, protein: 22, carbs: 36, fats: 10 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'halal'] },
    lunch: { name: 'Shrimp & Avocado Salad', description: 'Jumbo shrimp with avocado and mixed greens', time: '1:00 PM', ingredients: ['8 oz jumbo shrimp', '1 avocado', 'Arugula', 'Mango', 'Feta', 'Citrus vinaigrette'], instructions: ['Grill shrimp', 'Toss salad with dressing', 'Top with shrimp'], macros: { calories: 580, protein: 52, carbs: 38, fats: 26 }, prepTime: 18, cookingSkill: 'intermediate', budget: 'high', dietTags: ['halal', 'gluten-free', 'high-protein'] },
    afternoonSnack: { name: 'Smoked Almonds & Dates', description: 'Premium smoked almonds with Medjool dates', time: '4:00 PM', ingredients: ['1.5 oz smoked almonds', '3 Medjool dates'], instructions: ['Portion and enjoy'], macros: { calories: 260, protein: 8, carbs: 32, fats: 14 }, prepTime: 1, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegan', 'vegetarian', 'halal'] },
    dinner: { name: 'Lamb Rack & Roasted Vegetables', description: 'Herb-crusted lamb rack with premium vegetables', time: '7:00 PM', ingredients: ['7 oz lamb rack', 'Herb crust', 'Fingerling potatoes', 'Brussels sprouts', 'Carrots', 'Mint jelly'], instructions: ['Crust and roast lamb', 'Roast vegetables with herbs', 'Make mint sauce'], macros: { calories: 540, protein: 44, carbs: 42, fats: 22 }, prepTime: 40, cookingSkill: 'advanced', budget: 'high', dietTags: ['halal', 'gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Protein Mousse', description: 'Chocolate protein mousse', time: '9:00 PM', ingredients: ['Casein protein', 'Heavy cream', 'Cocoa', 'Sweetener'], instructions: ['Whip into mousse', 'Chill and serve'], macros: { calories: 190, protein: 20, carbs: 12, fats: 10 }, prepTime: 10, cookingSkill: 'intermediate', budget: 'high', dietTags: ['vegetarian', 'halal', 'high-protein'] }
  }, totalMacros: { calories: 2390, protein: 188, carbs: 198, fats: 106 } },
  { id: 'high-w1-maint-wed', week: 1, day: 3, dayName: 'Wednesday', goal: 'maintenance', meals: {
    breakfast: { name: 'Crab Omelette (Gourmet)', description: 'Lump crab meat omelette with herbs', time: '7:00 AM', ingredients: ['3 eggs', '3 oz lump crab', 'Gruyere cheese', 'Fresh herbs', 'Croissant', 'Butter'], instructions: ['Make omelette with crab and cheese', 'Serve with warm croissant'], macros: { calories: 540, protein: 38, carbs: 34, fats: 28 }, prepTime: 15, cookingSkill: 'advanced', budget: 'high', dietTags: ['halal', 'high-protein', 'gourmet'] },
    morningSnack: { name: 'Acai Bowl', description: 'Organic acai with superfood toppings', time: '10:30 AM', ingredients: ['Acai puree', 'Granola', 'Fresh berries', 'Coconut', 'Chia seeds', 'Honey'], instructions: ['Blend acai', 'Top with superfoods'], macros: { calories: 280, protein: 8, carbs: 48, fats: 10 }, prepTime: 8, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegan', 'vegetarian', 'halal'] },
    lunch: { name: 'Chicken Pesto Pasta', description: 'Grilled chicken with fresh basil pesto and artisan pasta', time: '1:00 PM', ingredients: ['6 oz chicken breast', 'Fresh pesto', 'Artisan pasta', 'Sun-dried tomatoes', 'Pine nuts', 'Parmesan'], instructions: ['Grill chicken', 'Toss pasta with pesto', 'Combine and garnish'], macros: { calories: 620, protein: 48, carbs: 58, fats: 22 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'high', dietTags: ['halal', 'high-protein'] },
    afternoonSnack: { name: 'Halal Beef Carpaccio & Melon', description: 'Premium halal beef with melon', time: '4:00 PM', ingredients: ['3 oz halal beef carpaccio', 'Fresh cantaloupe', 'Balsamic glaze'], instructions: ['Wrap melon in beef', 'Drizzle with balsamic'], macros: { calories: 200, protein: 18, carbs: 14, fats: 10 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['halal', 'gluten-free', 'high-protein'] },
    dinner: { name: 'Bison Burger (Bunless)', description: 'Premium bison burger with roasted vegetables', time: '7:00 PM', ingredients: ['8 oz ground bison', 'Portobello cap (bun)', 'Aged cheddar', 'Caramelized onions', 'Sweet potato fries', 'Aioli'], instructions: ['Grill bison patty', 'Assemble in portobello', 'Bake sweet potato fries'], macros: { calories: 560, protein: 52, carbs: 42, fats: 22 }, prepTime: 30, cookingSkill: 'intermediate', budget: 'high', dietTags: ['halal', 'gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Imported Cheese', description: 'Selection of European cheeses', time: '9:00 PM', ingredients: ['Manchego', 'Aged gouda', 'Crackers', 'Fruit'], instructions: ['Arrange cheese board'], macros: { calories: 200, protein: 12, carbs: 18, fats: 12 }, prepTime: 3, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'halal'] }
  }, totalMacros: { calories: 2400, protein: 176, carbs: 214, fats: 104 } },
  { id: 'high-w1-maint-thu', week: 1, day: 4, dayName: 'Thursday', goal: 'maintenance', meals: {
    breakfast: { name: 'Protein Pancakes', description: 'Gourmet protein pancakes with premium toppings', time: '7:00 AM', ingredients: ['Protein powder', 'Eggs', 'Almond flour', 'Fresh berries', 'Maple syrup', 'Whipped butter'], instructions: ['Make fluffy pancakes', 'Stack and top generously'], macros: { calories: 480, protein: 36, carbs: 52, fats: 16 }, prepTime: 18, cookingSkill: 'intermediate', budget: 'high', dietTags: ['vegetarian', 'halal', 'high-protein'] },
    morningSnack: { name: 'Smoked Salmon Rolls', description: 'Smoked salmon with cream cheese rolls', time: '10:30 AM', ingredients: ['3 oz smoked salmon', 'Cream cheese', 'Cucumber', 'Dill'], instructions: ['Roll salmon with fillings'], macros: { calories: 220, protein: 20, carbs: 8, fats: 14 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['halal', 'gluten-free', 'high-protein', 'omega-3'] },
    lunch: { name: 'Scallops & Saffron Risotto', description: 'Seared scallops over creamy saffron risotto', time: '1:00 PM', ingredients: ['8 oz scallops', 'Arborio rice', 'Saffron', 'Parmesan', 'White wine', 'Asparagus'], instructions: ['Make risotto', 'Sear scallops perfectly', 'Plate elegantly'], macros: { calories: 640, protein: 44, carbs: 68, fats: 18 }, prepTime: 35, cookingSkill: 'advanced', budget: 'high', dietTags: ['halal', 'gluten-free', 'high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Trail Mix Premium', description: 'Gourmet trail mix with exotic nuts', time: '4:00 PM', ingredients: ['Macadamia nuts', 'Cashews', 'Dried mango', 'Dark chocolate', 'Goji berries'], instructions: ['Mix premium ingredients'], macros: { calories: 260, protein: 6, carbs: 28, fats: 16 }, prepTime: 2, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'halal'] },
    dinner: { name: 'Duck Breast (Halal)', description: 'Pan-seared duck breast with cherry reduction', time: '7:00 PM', ingredients: ['7 oz duck breast', 'Cherry reduction sauce', 'Wild rice pilaf', 'Green beans', 'Shallots'], instructions: ['Score and sear duck', 'Make cherry sauce', 'Prepare sides'], macros: { calories: 580, protein: 46, carbs: 48, fats: 22 }, prepTime: 40, cookingSkill: 'advanced', budget: 'high', dietTags: ['halal', 'gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Protein Gelato', description: 'Italian-style protein gelato', time: '9:00 PM', ingredients: ['Protein gelato', 'Amaretto', 'Pistachios'], instructions: ['Scoop and top'], macros: { calories: 200, protein: 20, carbs: 20, fats: 8 }, prepTime: 2, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'halal', 'high-protein'] }
  }, totalMacros: { calories: 2380, protein: 172, carbs: 224, fats: 94 } },
  { id: 'high-w1-maint-fri', week: 1, day: 5, dayName: 'Friday', goal: 'maintenance', meals: {
    breakfast: { name: 'Goat Cheese Omelette', description: 'Herbed goat cheese omelette with truffle', time: '7:00 AM', ingredients: ['3 eggs', 'Goat cheese', 'Fresh herbs', 'Truffle oil', 'Arugula', 'Croissant'], instructions: ['Make omelette with goat cheese', 'Drizzle truffle oil', 'Serve with croissant'], macros: { calories: 520, protein: 28, carbs: 36, fats: 30 }, prepTime: 15, cookingSkill: 'intermediate', budget: 'high', dietTags: ['vegetarian', 'halal', 'gourmet'] },
    morningSnack: { name: 'Protein Shake Premium', description: 'Grass-fed protein with superfoods', time: '10:30 AM', ingredients: ['Grass-fed whey', 'Almond butter', 'Cacao nibs', 'Maca powder', 'Coconut milk'], instructions: ['Blend all ingredients'], macros: { calories: 300, protein: 30, carbs: 26, fats: 12 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['halal', 'high-protein'] },
    lunch: { name: 'Wagyu Burger (No Bun)', description: 'Premium wagyu burger lettuce wrap style', time: '1:00 PM', ingredients: ['8 oz wagyu beef', 'Butter lettuce', 'Gruyere cheese', 'Truffle aioli', 'Caramelized onions', 'Sweet potato fries'], instructions: ['Grill wagyu to perfection', 'Wrap in lettuce', 'Serve with fries'], macros: { calories: 620, protein: 48, carbs: 42, fats: 32 }, prepTime: 25, cookingSkill: 'intermediate', budget: 'high', dietTags: ['halal', 'gluten-free', 'high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Brie & Crackers', description: 'French brie with gourmet crackers and jam', time: '4:00 PM', ingredients: ['3 oz brie', 'Artisan crackers', 'Fig jam', 'Walnuts'], instructions: ['Arrange cheese board'], macros: { calories: 280, protein: 12, carbs: 24, fats: 18 }, prepTime: 3, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'halal'] },
    dinner: { name: 'Seared Ahi Tuna Steak', description: 'Rare ahi tuna with wasabi mashed potatoes', time: '7:00 PM', ingredients: ['8 oz ahi tuna', 'Wasabi potatoes', 'Seaweed salad', 'Soy glaze', 'Sesame seeds'], instructions: ['Sear tuna rare', 'Make wasabi mash', 'Plate with Asian flair'], macros: { calories: 560, protein: 54, carbs: 52, fats: 14 }, prepTime: 25, cookingSkill: 'advanced', budget: 'high', dietTags: ['halal', 'gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Dark Chocolate Truffles', description: 'Handmade chocolate truffles', time: '9:00 PM', ingredients: ['Premium dark chocolate truffles', 'Sea salt'], instructions: ['Enjoy 2 truffles'], macros: { calories: 180, protein: 3, carbs: 18, fats: 12 }, prepTime: 1, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'halal'] }
  }, totalMacros: { calories: 2460, protein: 175, carbs: 198, fats: 118 } },
  { id: 'high-w1-maint-sat', week: 1, day: 6, dayName: 'Saturday', goal: 'maintenance', meals: {
    breakfast: { name: 'Eggs Benedict (Halal)', description: 'Classic eggs benedict with halal smoked beef', time: '8:00 AM', ingredients: ['English muffin', '2 eggs', '4 slices halal smoked beef', 'Hollandaise sauce', 'Asparagus'], instructions: ['Poach eggs perfectly', 'Make hollandaise', 'Assemble benedict'], macros: { calories: 480, protein: 28, carbs: 36, fats: 26 }, prepTime: 25, cookingSkill: 'advanced', budget: 'high', dietTags: ['halal', 'high-protein', 'gourmet'] },
    morningSnack: { name: 'Organic Smoothie', description: 'Organic greens and protein smoothie', time: '11:00 AM', ingredients: ['Protein powder', 'Spinach', 'Kale', 'Mango', 'Coconut water', 'Chia'], instructions: ['Blend all ingredients'], macros: { calories: 260, protein: 24, carbs: 32, fats: 6 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['halal', 'high-protein'] },
    lunch: { name: 'Veal Cutlet with Potatoes', description: 'Breaded veal cutlet with roasted potatoes', time: '1:00 PM', ingredients: ['7 oz veal cutlet', 'Breadcrumbs', 'Fingerling potatoes', 'Arugula salad', 'Lemon'], instructions: ['Bread and pan-fry veal', 'Roast potatoes', 'Serve with salad'], macros: { calories: 600, protein: 48, carbs: 54, fats: 20 }, prepTime: 30, cookingSkill: 'intermediate', budget: 'high', dietTags: ['halal', 'high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Halal Charcuterie Selection', description: 'Premium halal meats and cheeses', time: '4:00 PM', ingredients: ['Halal beef salami', 'Halal smoked turkey', 'Aged cheddar', 'Olives', 'Crackers'], instructions: ['Arrange board'], macros: { calories: 280, protein: 18, carbs: 16, fats: 18 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['halal', 'high-protein'] },
    dinner: { name: 'Ribeye Steak with Butter', description: 'Prime ribeye with herb butter and sides', time: '7:00 PM', ingredients: ['8 oz ribeye', 'Herb butter', 'Loaded baked potato', 'Creamed spinach'], instructions: ['Grill ribeye to perfection', 'Top with butter', 'Prepare sides'], macros: { calories: 680, protein: 52, carbs: 42, fats: 36 }, prepTime: 35, cookingSkill: 'intermediate', budget: 'high', dietTags: ['halal', 'gluten-free', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Protein Ice Cream', description: 'Premium protein ice cream', time: '9:00 PM', ingredients: ['Protein ice cream', 'Dark chocolate chips', 'Macadamia nuts'], instructions: ['Scoop and top'], macros: { calories: 200, protein: 20, carbs: 20, fats: 10 }, prepTime: 2, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'halal', 'high-protein'] }
  }, totalMacros: { calories: 2500, protein: 190, carbs: 200, fats: 116 } },
  { id: 'high-w1-maint-sun', week: 1, day: 7, dayName: 'Sunday', goal: 'maintenance', meals: {
    breakfast: { name: 'Steak Breakfast Burrito', description: 'Premium steak and egg burrito', time: '8:00 AM', ingredients: ['5 oz steak', '3 eggs', 'Cheese', 'Avocado', 'Salsa', 'Large tortilla'], instructions: ['Scramble eggs with steak', 'Assemble burrito', 'Grill until crispy'], macros: { calories: 560, protein: 42, carbs: 48, fats: 24 }, prepTime: 20, cookingSkill: 'intermediate', budget: 'high', dietTags: ['halal', 'high-protein'] },
    morningSnack: { name: 'Lox & Bagel Bites', description: 'Mini bagels with lox and cream cheese', time: '11:00 AM', ingredients: ['Mini bagels', '3 oz smoked salmon', 'Cream cheese', 'Capers', 'Red onion'], instructions: ['Assemble mini bagels'], macros: { calories: 300, protein: 22, carbs: 32, fats: 10 }, prepTime: 5, cookingSkill: 'beginner', budget: 'high', dietTags: ['halal', 'high-protein', 'omega-3'] },
    lunch: { name: 'Seafood Paella (Gourmet)', description: 'Premium seafood paella with saffron', time: '1:30 PM', ingredients: ['Shrimp', 'Scallops', 'Mussels', 'Saffron rice', 'Peas', 'Bell peppers', 'White wine'], instructions: ['Layer and cook paella', 'Steam seafood on top', 'Serve family-style'], macros: { calories: 580, protein: 48, carbs: 62, fats: 14 }, prepTime: 45, cookingSkill: 'advanced', budget: 'high', dietTags: ['halal', 'gluten-free', 'high-protein', 'gourmet'] },
    afternoonSnack: { name: 'Protein Brownie', description: 'Gourmet protein brownie', time: '4:00 PM', ingredients: ['Protein brownie', 'Whipped cream', 'Berries'], instructions: ['Warm and top'], macros: { calories: 260, protein: 20, carbs: 28, fats: 10 }, prepTime: 3, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'halal', 'high-protein'] },
    dinner: { name: 'Roast Beef Dinner', description: 'Sunday roast with all the trimmings', time: '6:00 PM', ingredients: ['8 oz prime rib roast', 'Yorkshire pudding', 'Roasted vegetables', 'Gravy', 'Horseradish'], instructions: ['Roast beef to medium-rare', 'Make Yorkshire pudding', 'Prepare gravy and sides'], macros: { calories: 620, protein: 54, carbs: 52, fats: 24 }, prepTime: 90, cookingSkill: 'advanced', budget: 'high', dietTags: ['halal', 'high-protein', 'gourmet'] },
    eveningSnack: { name: 'Cheese & Port', description: 'Aged cheese with port wine', time: '8:30 PM', ingredients: ['Stilton cheese', 'Port wine', 'Walnuts', 'Crackers'], instructions: ['Pair cheese with port'], macros: { calories: 200, protein: 8, carbs: 18, fats: 12 }, prepTime: 3, cookingSkill: 'beginner', budget: 'high', dietTags: ['vegetarian', 'halal'] }
  }, totalMacros: { calories: 2520, protein: 194, carbs: 240, fats: 94 } }
];

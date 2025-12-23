// Expanded Pescatarian Meal Database with Protein Options
// Comprehensive pescatarian meals with fish and seafood alternatives

import type { Meal } from './mealPlanTypes';

// ============================================
// PESCATARIAN BREAKFAST COLLECTION (15 options)
// ============================================

export const PESCATARIAN_BREAKFASTS: Meal[] = [
  {
    name: 'Smoked Salmon/Trout Bagel',
    description: 'Classic breakfast with your choice of smoked fish',
    time: '7:00 AM',
    ingredients: ['Whole wheat bagel', '3 oz smoked salmon OR trout', 'Cream cheese OR vegan cream cheese', 'Capers', 'Red onion', 'Tomato', 'Dill'],
    instructions: ['Toast bagel', 'Spread cream cheese', 'Layer smoked fish and toppings', 'Garnish with dill'],
    macros: { calories: 420, protein: 28, carbs: 48, fats: 14 },
    prepTime: 10,
    cookingSkill: 'beginner',
    budget: 'high',
    dietTags: ['pescatarian', 'high-protein', 'omega-3'],
    allergens: ['fish', 'dairy', 'gluten'],
    proteinOptions: ['smoked salmon', 'smoked trout', 'lox', 'gravlax'],
    substitutions: [
      { ingredient: 'smoked salmon', alternatives: ['smoked trout', 'lox', 'gravlax'], note: 'Different fish, similar preparation' },
      { ingredient: 'cream cheese', alternatives: ['vegan cream cheese', 'avocado spread'], note: 'For dairy-free' },
      { ingredient: 'bagel', alternatives: ['gluten-free bagel', 'rice cakes'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Tuna/Salmon Avocado Toast',
    description: 'Omega-3 rich breakfast toast',
    time: '7:00 AM',
    ingredients: ['2 slices whole grain bread', '1 can tuna OR salmon', '1 avocado', 'Lemon juice', 'Eggs (optional)', 'Microgreens'],
    instructions: ['Toast bread', 'Mash avocado with lemon', 'Mix fish with seasonings', 'Layer on toast', 'Top with egg if desired'],
    macros: { calories: 480, protein: 34, carbs: 42, fats: 22 },
    prepTime: 12,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['pescatarian', 'high-protein', 'omega-3'],
    allergens: ['fish', 'eggs', 'gluten'],
    proteinOptions: ['canned tuna', 'canned salmon', 'sardines', 'mackerel'],
    substitutions: [
      { ingredient: 'tuna', alternatives: ['salmon', 'sardines', 'mackerel'], note: 'All canned fish work' },
      { ingredient: 'whole grain bread', alternatives: ['gluten-free bread', 'sweet potato slices'], note: 'For gluten-free/low-carb' }
    ]
  },
  {
    name: 'Sardine/Anchovy Mediterranean Bowl',
    description: 'Protein-packed breakfast bowl',
    time: '7:30 AM',
    ingredients: ['1 can sardines OR anchovies', 'Quinoa OR brown rice', 'Cherry tomatoes', 'Cucumbers', 'Olives', 'Feta cheese', 'Olive oil', 'Lemon'],
    instructions: ['Cook quinoa/rice', 'Prepare fresh vegetables', 'Arrange in bowl', 'Top with fish and feta', 'Drizzle oil and lemon'],
    macros: { calories: 440, protein: 32, carbs: 38, fats: 20 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['pescatarian', 'mediterranean', 'high-protein', 'omega-3'],
    allergens: ['fish', 'dairy'],
    proteinOptions: ['sardines', 'anchovies', 'smoked mackerel'],
    substitutions: [
      { ingredient: 'sardines', alternatives: ['anchovies', 'smoked mackerel'], note: 'Strong flavored fish' },
      { ingredient: 'feta', alternatives: ['vegan feta', 'nutritional yeast'], note: 'For dairy-free' }
    ]
  }
];

// ============================================
// PESCATARIAN LUNCH COLLECTION (25 options)
// ============================================

export const PESCATARIAN_LUNCHES: Meal[] = [
  {
    name: 'Grilled Salmon/Tuna Salad',
    description: 'Fresh fish over mixed greens',
    time: '12:00 PM',
    ingredients: ['6 oz salmon OR tuna steak', 'Mixed greens', 'Cherry tomatoes', 'Cucumbers', 'Avocado', 'Quinoa', 'Lemon vinaigrette'],
    instructions: ['Grill fish to medium-rare', 'Toss greens with vegetables', 'Add quinoa', 'Top with fish', 'Dress with vinaigrette'],
    macros: { calories: 520, protein: 46, carbs: 38, fats: 22 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'high',
    dietTags: ['pescatarian', 'gluten-free', 'high-protein', 'omega-3'],
    allergens: ['fish'],
    proteinOptions: ['salmon', 'tuna steak', 'swordfish', 'mahi mahi', 'halibut'],
    substitutions: [
      { ingredient: 'salmon', alternatives: ['tuna steak', 'swordfish', 'mahi mahi', 'halibut'], note: 'Meaty fish that grill well' },
      { ingredient: 'quinoa', alternatives: ['brown rice', 'farro', 'cauliflower rice'], note: 'Choose preferred base' }
    ]
  },
  {
    name: 'Shrimp/Scallop Stir-Fry',
    description: 'Quick Asian-inspired seafood dish',
    time: '12:30 PM',
    ingredients: ['8 oz shrimp OR scallops', 'Mixed vegetables', 'Soy sauce OR coconut aminos', 'Ginger', 'Garlic', 'Brown rice OR noodles', 'Sesame oil'],
    instructions: ['Stir-fry seafood until pink/opaque', 'Remove and set aside', 'Stir-fry vegetables', 'Add sauce and seafood back', 'Serve over rice/noodles'],
    macros: { calories: 480, protein: 42, carbs: 52, fats: 12 },
    prepTime: 20,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['pescatarian', 'high-protein'],
    allergens: ['shellfish', 'soy', 'sesame'],
    proteinOptions: ['shrimp', 'scallops', 'squid', 'crab'],
    substitutions: [
      { ingredient: 'shrimp', alternatives: ['scallops', 'squid', 'mixed seafood'], note: 'Different textures' },
      { ingredient: 'soy sauce', alternatives: ['coconut aminos', 'tamari'], note: 'For soy-free or gluten-free' }
    ]
  },
  {
    name: 'Cod/Halibut Fish Tacos',
    description: 'Light and fresh fish tacos',
    time: '12:00 PM',
    ingredients: ['6 oz cod OR halibut', 'Corn tortillas', 'Purple cabbage slaw', 'Avocado', 'Lime', 'Cilantro', 'Chipotle mayo', 'Pico de gallo'],
    instructions: ['Season and grill fish', 'Warm tortillas', 'Make cabbage slaw', 'Assemble tacos', 'Top with sauce and garnish'],
    macros: { calories: 440, protein: 38, carbs: 48, fats: 14 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['pescatarian', 'gluten-free', 'high-protein'],
    allergens: ['fish', 'eggs'],
    proteinOptions: ['cod', 'halibut', 'mahi mahi', 'tilapia', 'shrimp'],
    substitutions: [
      { ingredient: 'cod', alternatives: ['halibut', 'mahi mahi', 'tilapia', 'shrimp'], note: 'White flaky fish work best' },
      { ingredient: 'chipotle mayo', alternatives: ['Greek yogurt sauce', 'avocado crema'], note: 'For lighter option' }
    ]
  },
  {
    name: 'Tuna/Salmon Poke Bowl',
    description: 'Hawaiian-style raw fish bowl',
    time: '12:00 PM',
    ingredients: ['6 oz sushi-grade tuna OR salmon', 'Sushi rice', 'Edamame', 'Cucumber', 'Avocado', 'Seaweed', 'Soy sauce', 'Sesame seeds', 'Sriracha mayo'],
    instructions: ['Cook and season rice', 'Cube fish and marinate', 'Prepare toppings', 'Assemble bowl', 'Drizzle with sauces'],
    macros: { calories: 540, protein: 44, carbs: 58, fats: 16 },
    prepTime: 20,
    cookingSkill: 'intermediate',
    budget: 'high',
    dietTags: ['pescatarian', 'high-protein', 'omega-3', 'raw'],
    allergens: ['fish', 'soy', 'sesame', 'eggs'],
    proteinOptions: ['ahi tuna', 'salmon', 'yellowtail', 'octopus'],
    substitutions: [
      { ingredient: 'tuna', alternatives: ['salmon', 'yellowtail', 'cooked shrimp'], note: 'Must be sushi-grade if raw' },
      { ingredient: 'sushi rice', alternatives: ['brown rice', 'cauliflower rice'], note: 'For lower carb' }
    ]
  }
];

// ============================================
// PESCATARIAN DINNER COLLECTION (25 options)
// ============================================

export const PESCATARIAN_DINNERS: Meal[] = [
  {
    name: 'Baked Salmon/Trout with Vegetables',
    description: 'Omega-3 rich fish with roasted vegetables',
    time: '6:00 PM',
    ingredients: ['6 oz salmon OR trout fillet', 'Asparagus', 'Brussels sprouts', 'Sweet potato', 'Olive oil', 'Lemon', 'Dill', 'Garlic'],
    instructions: ['Season fish and vegetables', 'Arrange on baking sheet', 'Bake at 400°F for 20 minutes', 'Garnish with lemon and dill'],
    macros: { calories: 520, protein: 46, carbs: 42, fats: 20 },
    prepTime: 30,
    cookingSkill: 'beginner',
    budget: 'high',
    dietTags: ['pescatarian', 'gluten-free', 'high-protein', 'omega-3'],
    allergens: ['fish'],
    proteinOptions: ['salmon', 'trout', 'arctic char', 'steelhead'],
    substitutions: [
      { ingredient: 'salmon', alternatives: ['trout', 'arctic char', 'steelhead'], note: 'Similar fatty fish' },
      { ingredient: 'asparagus', alternatives: ['green beans', 'broccoli', 'zucchini'], note: 'Any vegetables work' }
    ]
  },
  {
    name: 'Seafood Paella (Shrimp/Mussels/Clams)',
    description: 'Spanish rice dish with mixed seafood',
    time: '6:30 PM',
    ingredients: ['4 oz shrimp', '4 oz mussels OR clams', 'Arborio rice', 'Saffron', 'Tomatoes', 'Peas', 'Bell peppers', 'Paprika', 'White wine (optional)'],
    instructions: ['Sauté aromatics', 'Add rice and saffron', 'Add broth gradually', 'Add seafood near end', 'Let rest before serving'],
    macros: { calories: 580, protein: 44, carbs: 68, fats: 14 },
    prepTime: 45,
    cookingSkill: 'advanced',
    budget: 'high',
    dietTags: ['pescatarian', 'gluten-free', 'high-protein', 'spanish'],
    allergens: ['shellfish'],
    proteinOptions: ['shrimp + mussels', 'shrimp + clams', 'mixed seafood', 'squid + shrimp'],
    substitutions: [
      { ingredient: 'mussels', alternatives: ['clams', 'scallops', 'more shrimp'], note: 'Mix and match seafood' },
      { ingredient: 'arborio rice', alternatives: ['bomba rice', 'short-grain rice'], note: 'Paella rice varieties' }
    ]
  },
  {
    name: 'Grilled Swordfish/Tuna Steak',
    description: 'Meaty fish steak with sides',
    time: '6:00 PM',
    ingredients: ['6 oz swordfish OR tuna steak', 'Quinoa', 'Grilled vegetables', 'Chimichurri sauce', 'Lemon', 'Olive oil'],
    instructions: ['Marinate fish briefly', 'Grill to medium-rare', 'Cook quinoa', 'Grill vegetables', 'Serve with chimichurri'],
    macros: { calories: 520, protein: 48, carbs: 42, fats: 18 },
    prepTime: 30,
    cookingSkill: 'intermediate',
    budget: 'high',
    dietTags: ['pescatarian', 'gluten-free', 'high-protein', 'omega-3'],
    allergens: ['fish'],
    proteinOptions: ['swordfish', 'tuna steak', 'mahi mahi', 'marlin'],
    substitutions: [
      { ingredient: 'swordfish', alternatives: ['tuna steak', 'mahi mahi', 'marlin'], note: 'Firm, meaty fish' },
      { ingredient: 'quinoa', alternatives: ['brown rice', 'cauliflower rice', 'couscous'], note: 'Choose preferred grain' }
    ]
  },
  {
    name: 'Fish Curry (Cod/Halibut/Tilapia)',
    description: 'Creamy Indian-style fish curry',
    time: '6:30 PM',
    ingredients: ['6 oz cod OR halibut OR tilapia', 'Coconut milk', 'Tomatoes', 'Onions', 'Curry spices', 'Ginger', 'Garlic', 'Basmati rice', 'Cilantro'],
    instructions: ['Make curry sauce', 'Simmer until thick', 'Gently add fish chunks', 'Cook until fish is done', 'Serve over rice with cilantro'],
    macros: { calories: 540, protein: 42, carbs: 62, fats: 16 },
    prepTime: 35,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['pescatarian', 'gluten-free', 'high-protein'],
    allergens: ['fish'],
    proteinOptions: ['cod', 'halibut', 'tilapia', 'mahi mahi', 'salmon'],
    substitutions: [
      { ingredient: 'cod', alternatives: ['halibut', 'tilapia', 'mahi mahi', 'salmon'], note: 'Any firm white fish' },
      { ingredient: 'coconut milk', alternatives: ['cashew cream', 'yogurt'], note: 'For different richness' }
    ]
  },
  {
    name: 'Mediterranean Baked Fish (Sea Bass/Snapper)',
    description: 'Whole fish or fillet with Mediterranean flavors',
    time: '6:00 PM',
    ingredients: ['6 oz sea bass OR snapper', 'Tomatoes', 'Olives', 'Capers', 'Garlic', 'White wine', 'Fresh herbs', 'Roasted potatoes'],
    instructions: ['Arrange fish in baking dish', 'Top with tomatoes, olives, capers', 'Add wine and herbs', 'Bake until flaky', 'Serve with potatoes'],
    macros: { calories: 480, protein: 44, carbs: 38, fats: 16 },
    prepTime: 35,
    cookingSkill: 'intermediate',
    budget: 'high',
    dietTags: ['pescatarian', 'gluten-free', 'mediterranean', 'high-protein'],
    allergens: ['fish'],
    proteinOptions: ['sea bass', 'red snapper', 'branzino', 'grouper'],
    substitutions: [
      { ingredient: 'sea bass', alternatives: ['red snapper', 'branzino', 'grouper'], note: 'Delicate white fish' },
      { ingredient: 'white wine', alternatives: ['fish stock', 'lemon juice + water'], note: 'For alcohol-free' }
    ]
  }
];

// ============================================
// PESCATARIAN SNACKS COLLECTION (10 options)
// ============================================

export const PESCATARIAN_SNACKS: Meal[] = [
  {
    name: 'Canned Tuna/Salmon Salad',
    description: 'Quick protein-rich snack',
    time: '3:00 PM',
    ingredients: ['1 can tuna OR salmon', 'Greek yogurt OR mayo', 'Celery', 'Crackers OR vegetables'],
    instructions: ['Mix fish with yogurt/mayo', 'Add chopped celery', 'Serve with crackers or veggie sticks'],
    macros: { calories: 240, protein: 28, carbs: 18, fats: 8 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['pescatarian', 'high-protein', 'omega-3'],
    allergens: ['fish', 'dairy', 'gluten'],
    proteinOptions: ['canned tuna', 'canned salmon', 'canned sardines'],
    substitutions: [
      { ingredient: 'tuna', alternatives: ['salmon', 'sardines', 'mackerel'], note: 'All canned fish work' },
      { ingredient: 'Greek yogurt', alternatives: ['mayo', 'avocado', 'hummus'], note: 'Choose preferred binder' }
    ]
  },
  {
    name: 'Smoked Salmon/Trout Roll-Ups',
    description: 'Elegant high-protein snack',
    time: '3:00 PM',
    ingredients: ['3 oz smoked salmon OR trout', 'Cream cheese OR vegan spread', 'Cucumber strips', 'Dill'],
    instructions: ['Spread cheese on fish', 'Add cucumber strip', 'Roll up', 'Secure with toothpick'],
    macros: { calories: 180, protein: 20, carbs: 4, fats: 10 },
    prepTime: 8,
    cookingSkill: 'beginner',
    budget: 'high',
    dietTags: ['pescatarian', 'low-carb', 'high-protein', 'omega-3'],
    allergens: ['fish', 'dairy'],
    proteinOptions: ['smoked salmon', 'smoked trout', 'gravlax'],
    substitutions: [
      { ingredient: 'cream cheese', alternatives: ['vegan cream cheese', 'avocado'], note: 'For dairy-free' }
    ]
  }
];

export default {
  PESCATARIAN_BREAKFASTS,
  PESCATARIAN_LUNCHES,
  PESCATARIAN_DINNERS,
  PESCATARIAN_SNACKS
};

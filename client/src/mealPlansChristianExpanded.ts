// Expanded Christian Meal Database with Protein Options
// Comprehensive Christian meals - no specific restrictions, focus on wholesome variety

import type { Meal } from './mealPlanTypes';

// ============================================
// CHRISTIAN BREAKFAST COLLECTION (20 options)
// ============================================

export const CHRISTIAN_BREAKFASTS: Meal[] = [
  {
    name: 'Classic American Breakfast (Bacon/Sausage/Ham)',
    description: 'Traditional hearty breakfast',
    time: '7:00 AM',
    ingredients: ['3 eggs', '3 strips bacon OR 2 sausage links OR 2 oz ham', 'Hash browns OR toast', 'Cheese', 'Butter', 'Orange juice'],
    instructions: ['Cook eggs to preference', 'Cook meat until crispy/done', 'Prepare hash browns or toast', 'Serve together with juice'],
    macros: { calories: 580, protein: 32, carbs: 42, fats: 32 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['christian', 'high-protein'],
    allergens: ['eggs', 'dairy', 'gluten'],
    proteinOptions: ['bacon', 'sausage', 'ham', 'turkey bacon', 'chicken sausage'],
    substitutions: [
      { ingredient: 'bacon', alternatives: ['sausage', 'ham', 'turkey bacon'], note: 'Choose preferred protein' },
      { ingredient: 'hash browns', alternatives: ['toast', 'oatmeal', 'grits'], note: 'Different carbs' }
    ]
  },
  {
    name: 'Pancakes/Waffles with Protein (Eggs/Bacon/Sausage)',
    description: 'Sweet breakfast with protein side',
    time: '7:00 AM',
    ingredients: ['Pancake OR waffle mix', 'Eggs', 'Milk', 'Butter', '3 strips bacon OR sausage', 'Maple syrup', 'Berries'],
    instructions: ['Make pancakes or waffles', 'Cook eggs scrambled or fried', 'Cook bacon/sausage', 'Serve together with syrup and berries'],
    macros: { calories: 640, protein: 28, carbs: 78, fats: 24 },
    prepTime: 25,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['christian'],
    allergens: ['eggs', 'dairy', 'gluten'],
    proteinOptions: ['bacon', 'sausage', 'ham', 'chicken sausage'],
    substitutions: [
      { ingredient: 'pancake mix', alternatives: ['waffle mix', 'from scratch'], note: 'Different preparations' },
      { ingredient: 'maple syrup', alternatives: ['honey', 'fruit compote'], note: 'Different sweeteners' }
    ]
  },
  {
    name: 'Breakfast Burrito (Sausage/Bacon/Ham)',
    description: 'Portable protein-packed breakfast',
    time: '7:30 AM',
    ingredients: ['Large tortilla', '3 scrambled eggs', '3 oz sausage OR bacon OR ham', 'Cheese', 'Salsa', 'Sour cream', 'Hash browns'],
    instructions: ['Scramble eggs', 'Cook meat', 'Warm tortilla', 'Fill with eggs, meat, cheese, hash browns', 'Top with salsa and sour cream'],
    macros: { calories: 620, protein: 36, carbs: 48, fats: 32 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['christian', 'high-protein'],
    allergens: ['eggs', 'dairy', 'gluten'],
    proteinOptions: ['sausage', 'bacon', 'ham', 'chorizo', 'steak'],
    substitutions: [
      { ingredient: 'sausage', alternatives: ['bacon', 'ham', 'chorizo', 'steak'], note: 'Different proteins' },
      { ingredient: 'tortilla', alternatives: ['wrap', 'bowl format'], note: 'For gluten-free' }
    ]
  }
];

// ============================================
// CHRISTIAN LUNCH COLLECTION (25 options)
// ============================================

export const CHRISTIAN_LUNCHES: Meal[] = [
  {
    name: 'Grilled Chicken/Steak/Pork Salad',
    description: 'Hearty protein salad',
    time: '12:00 PM',
    ingredients: ['6 oz grilled chicken OR steak OR pork', 'Mixed greens', 'Cherry tomatoes', 'Cucumbers', 'Cheese', 'Croutons', 'Ranch OR Caesar dressing'],
    instructions: ['Grill protein', 'Toss salad ingredients', 'Slice protein on top', 'Add cheese and croutons', 'Dress generously'],
    macros: { calories: 540, protein: 46, carbs: 28, fats: 28 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['christian', 'high-protein'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['grilled chicken', 'steak', 'pork chops', 'turkey', 'shrimp'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['steak', 'pork', 'turkey', 'shrimp'], note: 'Choose preferred protein' },
      { ingredient: 'ranch', alternatives: ['Caesar', 'Italian', 'blue cheese'], note: 'Different dressings' }
    ]
  },
  {
    name: 'Burger/Sandwich (Beef/Chicken/Turkey)',
    description: 'Classic American lunch',
    time: '12:00 PM',
    ingredients: ['6 oz burger OR chicken breast OR turkey', 'Burger bun OR bread', 'Lettuce', 'Tomato', 'Onion', 'Cheese', 'Mayo', 'Pickles', 'Fries OR chips'],
    instructions: ['Grill or cook protein', 'Toast bun', 'Assemble with toppings', 'Serve with fries or chips'],
    macros: { calories: 680, protein: 42, carbs: 58, fats: 32 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['christian', 'high-protein'],
    allergens: ['dairy', 'gluten', 'eggs'],
    proteinOptions: ['beef burger', 'chicken breast', 'turkey burger', 'pulled pork'],
    substitutions: [
      { ingredient: 'beef burger', alternatives: ['chicken', 'turkey burger', 'pulled pork'], note: 'Different proteins' },
      { ingredient: 'bun', alternatives: ['lettuce wrap', 'gluten-free bun'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Pasta with Meat Sauce (Beef/Pork/Turkey)',
    description: 'Italian-inspired comfort food',
    time: '12:30 PM',
    ingredients: ['6 oz ground beef OR pork OR turkey', 'Pasta', 'Marinara sauce', 'Garlic', 'Onions', 'Parmesan cheese', 'Italian seasoning', 'Garlic bread'],
    instructions: ['Cook pasta', 'Brown meat with garlic and onions', 'Add marinara and seasonings', 'Simmer', 'Toss with pasta', 'Serve with garlic bread'],
    macros: { calories: 620, protein: 42, carbs: 72, fats: 18 },
    prepTime: 30,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['christian', 'high-protein'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['ground beef', 'ground pork', 'ground turkey', 'Italian sausage'],
    substitutions: [
      { ingredient: 'ground beef', alternatives: ['ground pork', 'ground turkey', 'sausage'], note: 'Different proteins' },
      { ingredient: 'pasta', alternatives: ['gluten-free pasta', 'zucchini noodles'], note: 'For gluten-free or low-carb' }
    ]
  },
  {
    name: 'Tacos/Burritos (Beef/Chicken/Pork)',
    description: 'Mexican-inspired meal',
    time: '12:00 PM',
    ingredients: ['6 oz ground beef OR chicken OR carnitas pork', 'Tortillas', 'Cheese', 'Lettuce', 'Tomatoes', 'Sour cream', 'Salsa', 'Guacamole', 'Rice', 'Beans'],
    instructions: ['Cook seasoned meat', 'Warm tortillas', 'Prepare toppings', 'Assemble tacos/burritos', 'Serve with rice and beans'],
    macros: { calories: 680, protein: 44, carbs: 68, fats: 26 },
    prepTime: 25,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['christian', 'high-protein'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['ground beef', 'chicken', 'carnitas pork', 'steak', 'shrimp'],
    substitutions: [
      { ingredient: 'ground beef', alternatives: ['chicken', 'pork', 'steak', 'shrimp'], note: 'Different proteins' },
      { ingredient: 'tortillas', alternatives: ['lettuce wraps', 'bowl format'], note: 'For gluten-free or low-carb' }
    ]
  }
];

// ============================================
// CHRISTIAN DINNER COLLECTION (25 options)
// ============================================

export const CHRISTIAN_DINNERS: Meal[] = [
  {
    name: 'Grilled Steak/Chicken/Pork with Sides',
    description: 'Classic American dinner',
    time: '6:00 PM',
    ingredients: ['8 oz steak OR chicken OR pork chops', 'Baked potato OR mashed potatoes', 'Green beans OR broccoli', 'Butter', 'Sour cream', 'Roll'],
    instructions: ['Season and grill protein', 'Bake or prepare potatoes', 'Steam vegetables', 'Warm rolls', 'Serve together'],
    macros: { calories: 680, protein: 52, carbs: 58, fats: 26 },
    prepTime: 40,
    cookingSkill: 'intermediate',
    budget: 'high',
    dietTags: ['christian', 'high-protein'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['steak', 'chicken breast', 'pork chops', 'lamb chops', 'salmon'],
    substitutions: [
      { ingredient: 'steak', alternatives: ['chicken', 'pork chops', 'lamb', 'salmon'], note: 'Choose preferred protein' },
      { ingredient: 'baked potato', alternatives: ['mashed potatoes', 'rice', 'sweet potato'], note: 'Different starches' }
    ]
  },
  {
    name: 'Roasted Chicken/Turkey/Pork with Vegetables',
    description: 'Oven-roasted dinner',
    time: '6:30 PM',
    ingredients: ['8 oz chicken OR turkey OR pork tenderloin', 'Carrots', 'Potatoes', 'Brussels sprouts', 'Olive oil', 'Herbs', 'Gravy (optional)'],
    instructions: ['Season protein and vegetables', 'Roast at 400°F until done', 'Make gravy from drippings if desired', 'Serve together'],
    macros: { calories: 620, protein: 52, carbs: 52, fats: 22 },
    prepTime: 50,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['christian', 'high-protein'],
    allergens: ['gluten'],
    proteinOptions: ['chicken', 'turkey', 'pork tenderloin', 'beef roast'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['turkey', 'pork', 'beef roast'], note: 'Different roasted proteins' },
      { ingredient: 'potatoes', alternatives: ['sweet potatoes', 'rice', 'stuffing'], note: 'Different sides' }
    ]
  },
  {
    name: 'Spaghetti/Lasagna (Beef/Sausage)',
    description: 'Italian comfort food',
    time: '6:30 PM',
    ingredients: ['8 oz ground beef OR sausage', 'Pasta OR lasagna noodles', 'Marinara sauce', 'Ricotta cheese', 'Mozzarella', 'Parmesan', 'Garlic bread', 'Salad'],
    instructions: ['Brown meat', 'Prepare sauce', 'Cook pasta or layer lasagna', 'Bake if lasagna', 'Serve with garlic bread and salad'],
    macros: { calories: 720, protein: 48, carbs: 78, fats: 26 },
    prepTime: 45,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['christian', 'high-protein'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['ground beef', 'Italian sausage', 'ground turkey', 'mixed beef and pork'],
    substitutions: [
      { ingredient: 'ground beef', alternatives: ['sausage', 'ground turkey', 'mixed meats'], note: 'Different proteins' },
      { ingredient: 'pasta', alternatives: ['gluten-free pasta', 'zucchini noodles'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Baked/Grilled Fish (Salmon/Tilapia/Cod) with Sides',
    description: 'Healthy seafood dinner',
    time: '6:00 PM',
    ingredients: ['8 oz salmon OR tilapia OR cod', 'Rice OR quinoa', 'Asparagus OR broccoli', 'Lemon', 'Butter OR olive oil', 'Herbs'],
    instructions: ['Season fish', 'Bake or grill until flaky', 'Cook rice/quinoa', 'Steam vegetables', 'Serve with lemon and butter'],
    macros: { calories: 580, protein: 48, carbs: 48, fats: 20 },
    prepTime: 30,
    cookingSkill: 'beginner',
    budget: 'high',
    dietTags: ['christian', 'high-protein', 'omega-3'],
    allergens: ['fish', 'dairy'],
    proteinOptions: ['salmon', 'tilapia', 'cod', 'halibut', 'shrimp'],
    substitutions: [
      { ingredient: 'salmon', alternatives: ['tilapia', 'cod', 'halibut', 'shrimp'], note: 'Different fish options' },
      { ingredient: 'rice', alternatives: ['quinoa', 'couscous', 'potatoes'], note: 'Different starches' }
    ]
  },
  {
    name: 'Meatloaf/Meatballs (Beef/Pork/Turkey)',
    description: 'Classic comfort food',
    time: '6:30 PM',
    ingredients: ['8 oz ground beef OR pork OR turkey', 'Breadcrumbs', 'Eggs', 'Onions', 'Ketchup OR marinara', 'Mashed potatoes', 'Green beans'],
    instructions: ['Mix meat with breadcrumbs, eggs, onions', 'Form loaf or balls', 'Bake with sauce', 'Prepare mashed potatoes and green beans', 'Serve together'],
    macros: { calories: 640, protein: 46, carbs: 58, fats: 24 },
    prepTime: 60,
    cookingSkill: 'intermediate',
    budget: 'low',
    dietTags: ['christian', 'high-protein', 'comfort-food'],
    allergens: ['eggs', 'gluten', 'dairy'],
    proteinOptions: ['ground beef', 'ground pork', 'ground turkey', 'mixed beef and pork'],
    substitutions: [
      { ingredient: 'ground beef', alternatives: ['ground pork', 'ground turkey', 'mixed'], note: 'Different proteins' },
      { ingredient: 'breadcrumbs', alternatives: ['crushed crackers', 'oats', 'gluten-free breadcrumbs'], note: 'For gluten-free' }
    ]
  }
];

// ============================================
// CHRISTIAN SNACKS COLLECTION (15 options)
// ============================================

export const CHRISTIAN_SNACKS: Meal[] = [
  {
    name: 'Cheese and Crackers',
    description: 'Simple protein snack',
    time: '3:00 PM',
    ingredients: ['Cheese (cheddar, Swiss, pepper jack)', 'Whole grain crackers', 'Deli meat (optional)'],
    instructions: ['Slice cheese', 'Arrange with crackers', 'Add deli meat if desired'],
    macros: { calories: 280, protein: 14, carbs: 24, fats: 14 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['christian'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['cheddar', 'Swiss', 'pepper jack', 'string cheese'],
    substitutions: [
      { ingredient: 'crackers', alternatives: ['pretzels', 'bread', 'vegetables'], note: 'Different bases' }
    ]
  },
  {
    name: 'Greek Yogurt with Toppings',
    description: 'Protein-rich snack',
    time: '3:00 PM',
    ingredients: ['Greek yogurt', 'Granola', 'Berries', 'Honey', 'Nuts'],
    instructions: ['Spoon yogurt into bowl', 'Top with granola, berries, honey', 'Add nuts'],
    macros: { calories: 320, protein: 18, carbs: 42, fats: 10 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['christian', 'high-protein'],
    allergens: ['dairy', 'nuts'],
    proteinOptions: ['Greek yogurt', 'Icelandic yogurt', 'regular yogurt'],
    substitutions: [
      { ingredient: 'Greek yogurt', alternatives: ['Icelandic yogurt', 'cottage cheese'], note: 'Different dairy options' },
      { ingredient: 'granola', alternatives: ['cereal', 'nuts only'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Protein Shake/Smoothie (Whey/Milk)',
    description: 'Quick liquid protein',
    time: '3:00 PM',
    ingredients: ['Protein powder (whey OR plant-based)', 'Milk OR almond milk', 'Banana', 'Peanut butter', 'Ice'],
    instructions: ['Blend all ingredients until smooth', 'Serve immediately'],
    macros: { calories: 380, protein: 32, carbs: 38, fats: 12 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['christian', 'high-protein'],
    allergens: ['dairy', 'nuts'],
    proteinOptions: ['whey protein', 'casein protein', 'plant-based protein'],
    substitutions: [
      { ingredient: 'whey protein', alternatives: ['plant-based protein', 'Greek yogurt'], note: 'For dairy-free' },
      { ingredient: 'peanut butter', alternatives: ['almond butter', 'sunflower seed butter'], note: 'For nut-free' }
    ]
  }
];

export default {
  CHRISTIAN_BREAKFASTS,
  CHRISTIAN_LUNCHES,
  CHRISTIAN_DINNERS,
  CHRISTIAN_SNACKS
};

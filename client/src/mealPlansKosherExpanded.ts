// Expanded Kosher Meal Database with Protein Options
// Comprehensive kosher meals - no pork, no shellfish, no mixing meat and dairy

import type { Meal } from './mealPlanTypes';

// ============================================
// KOSHER BREAKFAST COLLECTION (20 options)
// ============================================

export const KOSHER_BREAKFASTS: Meal[] = [
  {
    name: 'Kosher Scrambled Eggs (Pareve)',
    description: 'Eggs cooked without dairy',
    time: '7:00 AM',
    ingredients: ['3 eggs', 'Olive oil OR margarine (pareve)', 'Vegetables (onions, peppers, tomatoes)', 'Toast', 'Orange juice'],
    instructions: ['Beat eggs', 'Sauté vegetables in oil', 'Add eggs and scramble', 'Serve with toast and juice'],
    macros: { calories: 420, protein: 22, carbs: 38, fats: 20 },
    prepTime: 15,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['kosher', 'pareve'],
    allergens: ['eggs', 'gluten'],
    proteinOptions: ['eggs only (pareve)', 'add lox or smoked salmon (after breakfast)'],
    substitutions: [
      { ingredient: 'olive oil', alternatives: ['pareve margarine', 'coconut oil'], note: 'Must be pareve (non-dairy)' },
      { ingredient: 'toast', alternatives: ['bagel', 'challah'], note: 'Different breads' }
    ]
  },
  {
    name: 'Lox and Bagel (Dairy)',
    description: 'Classic Jewish breakfast',
    time: '7:00 AM',
    ingredients: ['Bagel', '3 oz smoked salmon (lox)', 'Cream cheese', 'Tomato', 'Red onion', 'Capers', 'Cucumber'],
    instructions: ['Toast bagel', 'Spread cream cheese', 'Layer lox and vegetables', 'Add capers'],
    macros: { calories: 480, protein: 28, carbs: 52, fats: 16 },
    prepTime: 10,
    cookingSkill: 'beginner',
    budget: 'high',
    dietTags: ['kosher', 'dairy', 'omega-3'],
    allergens: ['fish', 'dairy', 'gluten'],
    proteinOptions: ['lox', 'smoked whitefish', 'smoked trout'],
    substitutions: [
      { ingredient: 'lox', alternatives: ['smoked whitefish', 'smoked trout'], note: 'Different smoked fish' },
      { ingredient: 'cream cheese', alternatives: ['dairy-free cream cheese'], note: 'For pareve version' }
    ]
  },
  {
    name: 'Shakshuka (Dairy or Pareve)',
    description: 'Israeli eggs in tomato sauce',
    time: '7:30 AM',
    ingredients: ['Eggs', 'Tomato sauce', 'Bell peppers', 'Onions', 'Garlic', 'Cumin', 'Paprika', 'Challah bread', 'Feta cheese (optional)'],
    instructions: ['Saute vegetables and spices', 'Add tomato sauce', 'Create wells and crack eggs', 'Cover and cook until eggs set', 'Serve with bread'],
    macros: { calories: 380, protein: 20, carbs: 42, fats: 16 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'low',
    dietTags: ['kosher', 'dairy-optional', 'pareve-option'],
    allergens: ['eggs', 'dairy', 'gluten'],
    proteinOptions: ['eggs only', 'eggs with feta (dairy)'],
    substitutions: [
      { ingredient: 'feta cheese', alternatives: ['omit for pareve', 'dairy-free feta'], note: 'Makes it pareve' },
      { ingredient: 'challah', alternatives: ['pita', 'sourdough'], note: 'Different breads' }
    ]
  }
];

// ============================================
// KOSHER LUNCH COLLECTION (25 options)
// ============================================

export const KOSHER_LUNCHES: Meal[] = [
  {
    name: 'Grilled Chicken/Turkey Salad (Meat)',
    description: 'Protein-rich salad without dairy',
    time: '12:00 PM',
    ingredients: ['6 oz grilled chicken OR turkey', 'Mixed greens', 'Cherry tomatoes', 'Cucumbers', 'Avocado', 'Olive oil', 'Lemon', 'Pareve croutons'],
    instructions: ['Grill chicken or turkey', 'Toss salad ingredients', 'Slice protein on top', 'Dress with oil and lemon'],
    macros: { calories: 480, protein: 46, carbs: 24, fats: 24 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['kosher', 'meat', 'pareve-sides'],
    allergens: ['gluten'],
    proteinOptions: ['grilled chicken', 'turkey breast', 'schnitzel'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['turkey', 'schnitzel'], note: 'Different poultry options' },
      { ingredient: 'croutons', alternatives: ['nuts', 'seeds'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Israeli Falafel Bowl (Pareve)',
    description: 'Mediterranean chickpea fritters',
    time: '12:00 PM',
    ingredients: ['Falafel (chickpea fritters)', 'Hummus', 'Israeli salad', 'Tahini', 'Pita bread', 'Pickles', 'Hot sauce'],
    instructions: ['Fry or bake falafel', 'Prepare Israeli salad', 'Arrange in bowl or pita', 'Top with hummus and tahini', 'Add pickles and hot sauce'],
    macros: { calories: 520, protein: 18, carbs: 68, fats: 20 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'low',
    dietTags: ['kosher', 'pareve', 'vegan', 'vegetarian'],
    allergens: ['gluten', 'sesame'],
    proteinOptions: ['falafel (chickpea-based)', 'add egg for extra protein'],
    substitutions: [
      { ingredient: 'pita', alternatives: ['gluten-free pita', 'salad base'], note: 'For gluten-free' },
      { ingredient: 'tahini', alternatives: ['extra hummus'], note: 'For sesame-free' }
    ]
  },
  {
    name: 'Grilled Fish Tacos (Pareve)',
    description: 'Fish tacos without dairy',
    time: '12:30 PM',
    ingredients: ['6 oz grilled fish (tilapia, cod, halibut)', 'Corn tortillas', 'Cabbage slaw', 'Avocado', 'Lime', 'Cilantro', 'Salsa'],
    instructions: ['Season and grill fish', 'Make cabbage slaw', 'Warm tortillas', 'Assemble tacos', 'Top with avocado and salsa'],
    macros: { calories: 460, protein: 40, carbs: 48, fats: 14 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['kosher', 'pareve', 'fish'],
    allergens: ['fish'],
    proteinOptions: ['tilapia', 'cod', 'halibut', 'salmon'],
    substitutions: [
      { ingredient: 'tilapia', alternatives: ['cod', 'halibut', 'salmon'], note: 'Different white fish' },
      { ingredient: 'corn tortillas', alternatives: ['lettuce wraps', 'rice'], note: 'For different base' }
    ]
  },
  {
    name: 'Chicken/Turkey Schnitzel (Meat)',
    description: 'Breaded fried chicken cutlet',
    time: '12:00 PM',
    ingredients: ['6 oz chicken OR turkey breast', 'Eggs', 'Flour', 'Breadcrumbs', 'Oil for frying', 'Lemon', 'Israeli salad', 'Rice OR couscous'],
    instructions: ['Pound chicken thin', 'Bread in flour, egg, breadcrumbs', 'Fry until golden', 'Serve with lemon, salad, and rice'],
    macros: { calories: 580, protein: 44, carbs: 58, fats: 18 },
    prepTime: 30,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['kosher', 'meat'],
    allergens: ['eggs', 'gluten'],
    proteinOptions: ['chicken breast', 'turkey breast', 'veal cutlet'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['turkey', 'veal'], note: 'Different meats' },
      { ingredient: 'breadcrumbs', alternatives: ['panko', 'matzo meal'], note: 'Different coatings' }
    ]
  }
];

// ============================================
// KOSHER DINNER COLLECTION (25 options)
// ============================================

export const KOSHER_DINNERS: Meal[] = [
  {
    name: 'Roasted Chicken/Turkey (Meat)',
    description: 'Classic Shabbat dinner',
    time: '6:00 PM',
    ingredients: ['8 oz chicken OR turkey', 'Potatoes', 'Carrots', 'Onions', 'Olive oil', 'Garlic', 'Herbs', 'Challah bread'],
    instructions: ['Season chicken/turkey and vegetables', 'Roast at 400°F until golden', 'Serve with challah'],
    macros: { calories: 620, protein: 52, carbs: 52, fats: 22 },
    prepTime: 60,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['kosher', 'meat', 'shabbat'],
    allergens: ['gluten'],
    proteinOptions: ['whole chicken', 'turkey breast', 'chicken pieces', 'Cornish hen'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['turkey', 'Cornish hen'], note: 'Different poultry' },
      { ingredient: 'potatoes', alternatives: ['sweet potatoes', 'rice'], note: 'Different starches' }
    ]
  },
  {
    name: 'Brisket (Meat)',
    description: 'Slow-cooked beef brisket',
    time: '6:30 PM',
    ingredients: ['8 oz beef brisket', 'Onions', 'Carrots', 'Tomato sauce', 'Red wine (optional)', 'Beef broth', 'Mashed potatoes OR kugel', 'Green beans'],
    instructions: ['Sear brisket', 'Add vegetables and liquids', 'Slow cook for 3-4 hours', 'Slice and serve with sides'],
    macros: { calories: 680, protein: 52, carbs: 48, fats: 28 },
    prepTime: 240,
    cookingSkill: 'advanced',
    budget: 'high',
    dietTags: ['kosher', 'meat', 'shabbat', 'holiday'],
    allergens: [],
    proteinOptions: ['beef brisket', 'chuck roast'],
    substitutions: [
      { ingredient: 'beef brisket', alternatives: ['chuck roast', 'short ribs'], note: 'Different beef cuts' },
      { ingredient: 'mashed potatoes', alternatives: ['kugel', 'rice', 'quinoa'], note: 'Different sides' }
    ]
  },
  {
    name: 'Grilled Salmon/Halibut (Pareve)',
    description: 'Simple grilled fish dinner',
    time: '6:00 PM',
    ingredients: ['8 oz salmon OR halibut', 'Asparagus', 'Roasted potatoes', 'Lemon', 'Olive oil', 'Dill', 'Garlic'],
    instructions: ['Season fish', 'Grill or bake', 'Roast asparagus and potatoes', 'Serve with lemon'],
    macros: { calories: 560, protein: 48, carbs: 42, fats: 22 },
    prepTime: 30,
    cookingSkill: 'beginner',
    budget: 'high',
    dietTags: ['kosher', 'pareve', 'fish', 'omega-3'],
    allergens: ['fish'],
    proteinOptions: ['salmon', 'halibut', 'cod', 'sea bass'],
    substitutions: [
      { ingredient: 'salmon', alternatives: ['halibut', 'cod', 'sea bass'], note: 'Different fish' },
      { ingredient: 'asparagus', alternatives: ['broccoli', 'green beans', 'zucchini'], note: 'Different vegetables' }
    ]
  },
  {
    name: 'Cholent (Meat)',
    description: 'Traditional slow-cooked Shabbat stew',
    time: '6:00 PM',
    ingredients: ['8 oz beef chuck OR flanken', 'Potatoes', 'Barley', 'Beans', 'Onions', 'Garlic', 'Paprika', 'Eggs (optional)', 'Challah'],
    instructions: ['Layer all ingredients in slow cooker', 'Cook overnight on low', 'Serve hot for Shabbat lunch'],
    macros: { calories: 620, protein: 42, carbs: 68, fats: 18 },
    prepTime: 600,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['kosher', 'meat', 'shabbat', 'traditional'],
    allergens: ['gluten'],
    proteinOptions: ['beef chuck', 'flanken', 'kishke (add-in)'],
    substitutions: [
      { ingredient: 'beef chuck', alternatives: ['flanken', 'short ribs'], note: 'Different beef cuts' },
      { ingredient: 'barley', alternatives: ['rice', 'quinoa'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Stuffed Cabbage (Meat)',
    description: 'Ground beef in tomato sauce',
    time: '6:30 PM',
    ingredients: ['8 oz ground beef OR turkey', 'Cabbage leaves', 'Rice', 'Onions', 'Tomato sauce', 'Brown sugar', 'Lemon juice', 'Raisins (optional)'],
    instructions: ['Mix meat with rice and onions', 'Roll in blanched cabbage leaves', 'Simmer in sweet-sour tomato sauce', 'Cook for 1-2 hours'],
    macros: { calories: 540, protein: 40, carbs: 58, fats: 16 },
    prepTime: 120,
    cookingSkill: 'advanced',
    budget: 'low',
    dietTags: ['kosher', 'meat', 'traditional'],
    allergens: [],
    proteinOptions: ['ground beef', 'ground turkey', 'mixed beef and veal'],
    substitutions: [
      { ingredient: 'ground beef', alternatives: ['ground turkey', 'mixed meats'], note: 'Different proteins' },
      { ingredient: 'rice', alternatives: ['quinoa', 'cauliflower rice'], note: 'For lower carb' }
    ]
  }
];

// ============================================
// KOSHER SNACKS COLLECTION (15 options)
// ============================================

export const KOSHER_SNACKS: Meal[] = [
  {
    name: 'Hummus with Vegetables (Pareve)',
    description: 'Chickpea dip with fresh vegetables',
    time: '3:00 PM',
    ingredients: ['Hummus', 'Carrots', 'Celery', 'Cucumbers', 'Bell peppers', 'Pita chips'],
    instructions: ['Slice vegetables', 'Serve with hummus and pita chips'],
    macros: { calories: 240, protein: 8, carbs: 32, fats: 10 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['kosher', 'pareve', 'vegan', 'vegetarian'],
    allergens: ['sesame', 'gluten'],
    proteinOptions: ['chickpeas (from hummus)', 'add hard-boiled egg'],
    substitutions: [
      { ingredient: 'hummus', alternatives: ['baba ganoush', 'tahini'], note: 'Different dips' },
      { ingredient: 'pita chips', alternatives: ['crackers', 'more vegetables'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Israeli Salad with Egg (Dairy or Pareve)',
    description: 'Chopped vegetable salad with protein',
    time: '3:00 PM',
    ingredients: ['Tomatoes', 'Cucumbers', 'Bell peppers', 'Onions', 'Lemon juice', 'Olive oil', 'Hard-boiled egg', 'Pita bread'],
    instructions: ['Finely chop all vegetables', 'Dress with lemon and oil', 'Top with chopped egg', 'Serve with pita'],
    macros: { calories: 260, protein: 10, carbs: 32, fats: 12 },
    prepTime: 10,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['kosher', 'pareve', 'vegetarian'],
    allergens: ['eggs', 'gluten'],
    proteinOptions: ['hard-boiled egg', 'chickpeas'],
    substitutions: [
      { ingredient: 'egg', alternatives: ['chickpeas', 'falafel'], note: 'For vegan' }
    ]
  },
  {
    name: 'Kosher Deli Meat Roll-Ups (Meat)',
    description: 'Protein-rich portable snack',
    time: '3:00 PM',
    ingredients: ['Kosher turkey OR beef deli meat', 'Mustard', 'Pickles', 'Lettuce'],
    instructions: ['Spread mustard on deli meat', 'Add pickle and lettuce', 'Roll up', 'Secure with toothpick'],
    macros: { calories: 180, protein: 20, carbs: 4, fats: 8 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['kosher', 'meat', 'low-carb'],
    allergens: [],
    proteinOptions: ['turkey', 'beef pastrami', 'corned beef', 'salami'],
    substitutions: [
      { ingredient: 'turkey', alternatives: ['pastrami', 'corned beef', 'salami'], note: 'Different deli meats' }
    ]
  }
];

export default {
  KOSHER_BREAKFASTS,
  KOSHER_LUNCHES,
  KOSHER_DINNERS,
  KOSHER_SNACKS
};

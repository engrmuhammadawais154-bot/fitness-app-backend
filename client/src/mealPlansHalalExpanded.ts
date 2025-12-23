// Expanded Halal Meal Database with Protein Options
// Comprehensive halal-compliant meals with multiple protein alternatives

import type { Meal } from './mealPlanTypes';

// ============================================
// HALAL BREAKFAST COLLECTION (15 options)
// ============================================

export const HALAL_BREAKFASTS: Meal[] = [
  {
    name: 'Turkish Menemen',
    description: 'Scrambled eggs with tomatoes, peppers, and spices',
    time: '7:00 AM',
    ingredients: ['3 eggs', '2 tomatoes', '1 green pepper', 'Onion', 'Olive oil', 'Cumin', 'Black pepper', 'Feta cheese (optional)'],
    instructions: ['Sauté peppers and onions', 'Add diced tomatoes', 'Scramble in eggs', 'Season and serve hot'],
    macros: { calories: 320, protein: 22, carbs: 18, fats: 20 },
    prepTime: 15,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['halal', 'vegetarian', 'high-protein', 'mediterranean'],
    allergens: ['eggs', 'dairy'],
    substitutions: [
      { ingredient: 'eggs', alternatives: ['tofu scramble', 'chickpea flour'], note: 'Vegan option' },
      { ingredient: 'feta cheese', alternatives: ['omit', 'vegan feta'], note: 'Optional ingredient' }
    ]
  },
  {
    name: 'Halal Beef/Turkey Breakfast Burrito',
    description: 'Protein-packed breakfast wrap with your choice of meat',
    time: '7:30 AM',
    ingredients: ['Whole wheat tortilla', '2 eggs', '3 oz ground halal beef OR turkey', 'Black beans', 'Cheese', 'Salsa', 'Avocado'],
    instructions: ['Brown meat with spices', 'Scramble eggs', 'Warm tortilla', 'Layer all ingredients', 'Wrap and serve'],
    macros: { calories: 520, protein: 38, carbs: 42, fats: 22 },
    prepTime: 18,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['halal', 'high-protein'],
    allergens: ['eggs', 'dairy', 'gluten'],
    proteinOptions: ['halal ground beef', 'halal ground turkey', 'halal ground chicken'],
    substitutions: [
      { ingredient: 'halal beef', alternatives: ['halal turkey', 'halal chicken', 'black beans'], note: 'Choose preferred protein' },
      { ingredient: 'tortilla', alternatives: ['gluten-free tortilla', 'lettuce wrap'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Chicken/Turkey Breakfast Sausage Bowl',
    description: 'Savory breakfast bowl with halal sausage',
    time: '7:00 AM',
    ingredients: ['3 halal chicken OR turkey sausages', '2 eggs', 'Sweet potato cubes', 'Spinach', 'Olive oil', 'Seasonings'],
    instructions: ['Roast sweet potato cubes', 'Cook sausages', 'Sauté spinach', 'Fry eggs', 'Combine in bowl'],
    macros: { calories: 480, protein: 34, carbs: 38, fats: 22 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['halal', 'gluten-free', 'high-protein'],
    allergens: ['eggs'],
    proteinOptions: ['halal chicken sausage', 'halal turkey sausage', 'halal beef sausage'],
    substitutions: [
      { ingredient: 'chicken sausages', alternatives: ['turkey sausages', 'beef sausages'], note: 'All must be halal' }
    ]
  },
  {
    name: 'Middle Eastern Ful Medames',
    description: 'Traditional fava bean breakfast dish',
    time: '7:00 AM',
    ingredients: ['1 cup cooked fava beans', 'Lemon juice', 'Garlic', 'Cumin', 'Olive oil', 'Tomatoes', 'Parsley', 'Whole wheat pita'],
    instructions: ['Mash beans partially', 'Mix with lemon, garlic, cumin', 'Top with diced tomatoes and parsley', 'Drizzle olive oil', 'Serve with pita'],
    macros: { calories: 380, protein: 18, carbs: 58, fats: 10 },
    prepTime: 15,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['halal', 'vegan', 'vegetarian', 'high-fiber'],
    allergens: ['gluten'],
    substitutions: [
      { ingredient: 'fava beans', alternatives: ['chickpeas', 'white beans'], note: 'Similar texture' }
    ]
  },
  {
    name: 'Halal Lamb/Beef Breakfast Kebab',
    description: 'Grilled meat kebab with eggs and vegetables',
    time: '7:30 AM',
    ingredients: ['4 oz halal lamb OR beef', '2 eggs', 'Tomatoes', 'Cucumbers', 'Yogurt sauce', 'Whole wheat pita'],
    instructions: ['Grill seasoned meat', 'Fry eggs', 'Prepare fresh vegetables', 'Assemble with yogurt sauce'],
    macros: { calories: 520, protein: 42, carbs: 32, fats: 24 },
    prepTime: 20,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['halal', 'high-protein'],
    allergens: ['eggs', 'dairy', 'gluten'],
    proteinOptions: ['halal lamb', 'halal beef', 'halal chicken'],
    substitutions: [
      { ingredient: 'lamb', alternatives: ['beef', 'chicken'], note: 'Choose preferred halal meat' }
    ]
  }
];

// ============================================
// HALAL LUNCH COLLECTION (20 options)
// ============================================

export const HALAL_LUNCHES: Meal[] = [
  {
    name: 'Chicken/Turkey Shawarma Bowl',
    description: 'Mediterranean bowl with your choice of protein',
    time: '12:00 PM',
    ingredients: ['6 oz halal chicken OR turkey', 'Rice', 'Lettuce', 'Tomatoes', 'Cucumbers', 'Tahini sauce', 'Pickles', 'Spices'],
    instructions: ['Season and grill meat with shawarma spices', 'Cook rice', 'Prepare fresh vegetables', 'Assemble bowl', 'Drizzle tahini'],
    macros: { calories: 540, protein: 46, carbs: 52, fats: 16 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['halal', 'high-protein', 'mediterranean'],
    allergens: ['sesame', 'gluten'],
    proteinOptions: ['halal chicken breast', 'halal turkey breast', 'halal lamb'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['turkey', 'lamb', 'beef'], note: 'All must be halal' },
      { ingredient: 'tahini sauce', alternatives: ['Greek yogurt', 'hummus'], note: 'For sesame allergy' }
    ]
  },
  {
    name: 'Beef/Lamb Kofta with Quinoa',
    description: 'Grilled meat balls with quinoa and vegetables',
    time: '12:30 PM',
    ingredients: ['6 oz halal ground beef OR lamb', '1 cup quinoa', 'Parsley', 'Onion', 'Spices', 'Yogurt sauce', 'Mixed vegetables'],
    instructions: ['Mix meat with spices and parsley', 'Form into kofta balls', 'Grill or bake', 'Serve over quinoa with vegetables'],
    macros: { calories: 580, protein: 44, carbs: 48, fats: 22 },
    prepTime: 30,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['halal', 'gluten-free', 'high-protein'],
    allergens: ['dairy'],
    proteinOptions: ['halal beef', 'halal lamb', 'halal turkey'],
    substitutions: [
      { ingredient: 'beef', alternatives: ['lamb', 'turkey', 'chicken'], note: 'Choose preferred halal ground meat' }
    ]
  },
  {
    name: 'Grilled Chicken/Fish with Rice Pilaf',
    description: 'Choice of protein with aromatic rice',
    time: '1:00 PM',
    ingredients: ['6 oz halal chicken OR fish', '1 cup basmati rice', 'Onions', 'Carrots', 'Raisins', 'Almonds', 'Cumin', 'Cardamom'],
    instructions: ['Grill seasoned protein', 'Sauté rice with spices', 'Add broth and simmer', 'Top with nuts and raisins'],
    macros: { calories: 560, protein: 46, carbs: 62, fats: 14 },
    prepTime: 35,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['halal', 'gluten-free', 'high-protein'],
    allergens: ['nuts', 'fish'],
    proteinOptions: ['halal chicken', 'salmon', 'cod', 'halibut', 'halal turkey'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['fish (any white fish)', 'turkey'], note: 'Choose preferred protein' },
      { ingredient: 'almonds', alternatives: ['omit', 'sunflower seeds'], note: 'For nut allergy' }
    ]
  },
  {
    name: 'Turkish Chicken/Beef Doner Wrap',
    description: 'Authentic doner with choice of meat',
    time: '12:00 PM',
    ingredients: ['6 oz halal chicken OR beef', 'Whole wheat lavash', 'Lettuce', 'Tomatoes', 'Onions', 'Yogurt sauce', 'Hot sauce'],
    instructions: ['Marinate and cook meat doner-style', 'Warm lavash', 'Layer meat and vegetables', 'Add sauces', 'Wrap tightly'],
    macros: { calories: 520, protein: 44, carbs: 48, fats: 18 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['halal', 'high-protein'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['halal chicken', 'halal beef', 'halal lamb'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['beef', 'lamb'], note: 'Traditional doner meats' }
    ]
  },
  {
    name: 'Moroccan Chicken/Lamb Tagine',
    description: 'Slow-cooked North African stew',
    time: '1:00 PM',
    ingredients: ['6 oz halal chicken OR lamb', 'Chickpeas', 'Dried apricots', 'Onions', 'Carrots', 'Cumin', 'Cinnamon', 'Couscous'],
    instructions: ['Brown meat', 'Add vegetables and spices', 'Simmer with broth', 'Add apricots and chickpeas', 'Serve over couscous'],
    macros: { calories: 580, protein: 42, carbs: 68, fats: 16 },
    prepTime: 45,
    cookingSkill: 'advanced',
    budget: 'medium',
    dietTags: ['halal', 'high-protein', 'mediterranean'],
    allergens: ['gluten'],
    proteinOptions: ['halal chicken thighs', 'halal lamb', 'halal beef'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['lamb', 'beef'], note: 'Lamb is traditional' },
      { ingredient: 'couscous', alternatives: ['quinoa', 'rice'], note: 'Gluten-free option' }
    ]
  }
];

// ============================================
// HALAL DINNER COLLECTION (20 options)
// ============================================

export const HALAL_DINNERS: Meal[] = [
  {
    name: 'Grilled Salmon/Chicken with Vegetables',
    description: 'Healthy grilled protein with roasted vegetables',
    time: '6:00 PM',
    ingredients: ['6 oz salmon OR halal chicken', 'Broccoli', 'Bell peppers', 'Zucchini', 'Olive oil', 'Lemon', 'Herbs', 'Brown rice'],
    instructions: ['Season protein with herbs', 'Grill until cooked', 'Roast vegetables with olive oil', 'Serve with rice'],
    macros: { calories: 520, protein: 46, carbs: 42, fats: 18 },
    prepTime: 30,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['halal', 'gluten-free', 'high-protein', 'omega-3'],
    allergens: ['fish'],
    proteinOptions: ['salmon', 'halal chicken', 'halal turkey', 'cod', 'halibut'],
    substitutions: [
      { ingredient: 'salmon', alternatives: ['chicken breast', 'turkey', 'any white fish'], note: 'Choose preferred protein' }
    ]
  },
  {
    name: 'Beef/Lamb Biryani',
    description: 'Fragrant South Asian rice dish',
    time: '6:30 PM',
    ingredients: ['5 oz halal beef OR lamb', 'Basmati rice', 'Yogurt', 'Onions', 'Tomatoes', 'Ginger', 'Garlic', 'Biryani spices', 'Saffron'],
    instructions: ['Marinate meat in yogurt and spices', 'Cook meat partially', 'Layer with rice', 'Cook on low heat', 'Serve with raita'],
    macros: { calories: 620, protein: 42, carbs: 72, fats: 18 },
    prepTime: 60,
    cookingSkill: 'advanced',
    budget: 'medium',
    dietTags: ['halal', 'high-protein', 'south-asian'],
    allergens: ['dairy'],
    proteinOptions: ['halal beef', 'halal lamb', 'halal chicken', 'halal goat'],
    substitutions: [
      { ingredient: 'beef', alternatives: ['lamb', 'chicken', 'goat'], note: 'All are traditional biryani proteins' }
    ]
  },
  {
    name: 'Turkish Adana Kebab with Bulgur',
    description: 'Spicy ground meat kebab',
    time: '6:00 PM',
    ingredients: ['6 oz halal ground lamb OR beef', 'Red pepper paste', 'Onions', 'Parsley', 'Bulgur wheat', 'Grilled vegetables', 'Yogurt'],
    instructions: ['Mix meat with spices and herbs', 'Form onto skewers', 'Grill until charred', 'Serve with bulgur and vegetables'],
    macros: { calories: 580, protein: 44, carbs: 52, fats: 22 },
    prepTime: 30,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['halal', 'high-protein', 'mediterranean'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['halal ground lamb', 'halal ground beef', 'halal ground turkey'],
    substitutions: [
      { ingredient: 'lamb', alternatives: ['beef', 'turkey'], note: 'Lamb is most traditional' },
      { ingredient: 'bulgur', alternatives: ['rice', 'quinoa'], note: 'Gluten-free option' }
    ]
  },
  {
    name: 'Honey Glazed Chicken/Duck',
    description: 'Sweet and savory roasted poultry',
    time: '6:30 PM',
    ingredients: ['6 oz halal chicken OR duck breast', 'Honey', 'Soy sauce', 'Ginger', 'Garlic', 'Sweet potatoes', 'Green beans'],
    instructions: ['Marinate protein in honey-soy glaze', 'Roast with vegetables', 'Baste periodically', 'Serve hot'],
    macros: { calories: 540, protein: 44, carbs: 56, fats: 14 },
    prepTime: 40,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['halal', 'gluten-free', 'high-protein'],
    allergens: ['soy'],
    proteinOptions: ['halal chicken', 'halal duck', 'halal turkey'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['duck', 'turkey'], note: 'Duck is richer in flavor' },
      { ingredient: 'soy sauce', alternatives: ['coconut aminos', 'tamari'], note: 'Gluten-free/soy-free option' }
    ]
  },
  {
    name: 'Mediterranean Fish/Chicken Bake',
    description: 'One-pan baked protein with Mediterranean flavors',
    time: '6:00 PM',
    ingredients: ['6 oz white fish OR halal chicken', 'Tomatoes', 'Olives', 'Capers', 'Olive oil', 'Oregano', 'Feta cheese', 'Spinach'],
    instructions: ['Layer vegetables in baking dish', 'Place protein on top', 'Drizzle with oil and season', 'Bake until cooked', 'Top with feta'],
    macros: { calories: 460, protein: 46, carbs: 22, fats: 22 },
    prepTime: 35,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['halal', 'gluten-free', 'mediterranean', 'high-protein'],
    allergens: ['fish', 'dairy'],
    proteinOptions: ['cod', 'halibut', 'halal chicken', 'salmon', 'mahi mahi'],
    substitutions: [
      { ingredient: 'fish', alternatives: ['chicken breast', 'turkey'], note: 'Choose preferred protein' },
      { ingredient: 'feta cheese', alternatives: ['omit', 'vegan feta'], note: 'Optional' }
    ]
  }
];

// ============================================
// HALAL SNACKS COLLECTION (10 options)
// ============================================

export const HALAL_SNACKS: Meal[] = [
  {
    name: 'Chicken/Turkey Jerky with Nuts',
    description: 'High-protein portable snack',
    time: '3:00 PM',
    ingredients: ['2 oz halal chicken OR turkey jerky', '1/4 cup mixed nuts'],
    instructions: ['Portion jerky and nuts', 'Enjoy together'],
    macros: { calories: 240, protein: 24, carbs: 8, fats: 14 },
    prepTime: 2,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['halal', 'high-protein', 'gluten-free'],
    allergens: ['nuts'],
    proteinOptions: ['halal chicken jerky', 'halal turkey jerky', 'halal beef jerky'],
    substitutions: [
      { ingredient: 'chicken jerky', alternatives: ['turkey jerky', 'beef jerky'], note: 'All must be halal' },
      { ingredient: 'mixed nuts', alternatives: ['seeds', 'dried chickpeas'], note: 'For nut allergy' }
    ]
  },
  {
    name: 'Hummus with Veggie Sticks',
    description: 'Classic Middle Eastern dip',
    time: '3:00 PM',
    ingredients: ['1/2 cup hummus', 'Carrots', 'Celery', 'Cucumbers', 'Bell peppers'],
    instructions: ['Cut vegetables into sticks', 'Serve with hummus'],
    macros: { calories: 180, protein: 8, carbs: 24, fats: 8 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['halal', 'vegan', 'vegetarian', 'gluten-free'],
    allergens: ['sesame'],
    substitutions: [
      { ingredient: 'hummus', alternatives: ['baba ganoush', 'white bean dip'], note: 'For sesame allergy' }
    ]
  }
];

// Export all collections
export default {
  HALAL_BREAKFASTS,
  HALAL_LUNCHES,
  HALAL_DINNERS,
  HALAL_SNACKS
};

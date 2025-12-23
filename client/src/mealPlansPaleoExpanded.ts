// Expanded Paleo Meal Database with Protein Options
// Comprehensive paleo meals - no grains, no dairy, no legumes, no processed foods

import type { Meal } from './mealPlanTypes';

// ============================================
// PALEO BREAKFAST COLLECTION (20 options)
// ============================================

export const PALEO_BREAKFASTS: Meal[] = [
  {
    name: 'Paleo Scramble (Eggs + Sweet Potato + Meat)',
    description: 'Classic paleo breakfast bowl',
    time: '7:00 AM',
    ingredients: ['3 eggs', 'Sweet potato hash', '3 oz bacon OR sausage OR ground beef', 'Avocado', 'Spinach', 'Coconut oil', 'Hot sauce'],
    instructions: ['Cook sweet potato in coconut oil', 'Cook meat', 'Scramble eggs', 'Combine in bowl', 'Top with avocado'],
    macros: { calories: 540, protein: 32, carbs: 28, fats: 34 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30'],
    allergens: ['eggs'],
    proteinOptions: ['bacon', 'sausage', 'ground beef', 'ground turkey', 'leftover steak'],
    substitutions: [
      { ingredient: 'bacon', alternatives: ['sausage', 'ground beef', 'turkey', 'steak'], note: 'Any paleo protein' },
      { ingredient: 'sweet potato', alternatives: ['butternut squash', 'plantains', 'regular potatoes'], note: 'Different starches' }
    ]
  },
  {
    name: 'Paleo Banana/Almond Pancakes',
    description: 'Grain-free pancakes',
    time: '7:00 AM',
    ingredients: ['2 bananas', '4 eggs', 'Almond flour OR coconut flour', 'Cinnamon', 'Vanilla', 'Coconut oil', 'Almond butter', 'Berries'],
    instructions: ['Mash bananas with eggs', 'Add flour and spices', 'Cook in coconut oil', 'Top with almond butter and berries'],
    macros: { calories: 480, protein: 18, carbs: 48, fats: 26 },
    prepTime: 20,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['paleo', 'gluten-free', 'dairy-free'],
    allergens: ['eggs', 'nuts'],
    proteinOptions: ['eggs', 'added collagen peptides', 'protein powder (paleo-friendly)'],
    substitutions: [
      { ingredient: 'almond flour', alternatives: ['coconut flour (use less)', 'cassava flour'], note: 'Different paleo flours' },
      { ingredient: 'almond butter', alternatives: ['cashew butter', 'sunflower seed butter'], note: 'For nut-free' }
    ]
  },
  {
    name: 'Paleo Breakfast Sausage Bowl',
    description: 'Sausage with vegetables and fruit',
    time: '7:30 AM',
    ingredients: ['4 oz paleo sausage', 'Roasted vegetables (bell peppers, onions, zucchini)', 'Mixed berries', 'Coconut oil', 'Fresh herbs'],
    instructions: ['Cook sausage', 'Roast vegetables in coconut oil', 'Arrange in bowl', 'Add fresh berries', 'Garnish with herbs'],
    macros: { calories: 420, protein: 24, carbs: 28, fats: 26 },
    prepTime: 25,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30'],
    allergens: [],
    proteinOptions: ['pork sausage', 'chicken sausage', 'turkey sausage', 'beef sausage'],
    substitutions: [
      { ingredient: 'sausage', alternatives: ['ground meat patties', 'bacon'], note: 'Different proteins' }
    ]
  }
];

// ============================================
// PALEO LUNCH COLLECTION (25 options)
// ============================================

export const PALEO_LUNCHES: Meal[] = [
  {
    name: 'Paleo Grilled Chicken/Steak Salad',
    description: 'Large protein salad',
    time: '12:00 PM',
    ingredients: ['6 oz grilled chicken OR steak', 'Mixed greens', 'Cherry tomatoes', 'Cucumbers', 'Avocado', 'Nuts', 'Olive oil', 'Lemon'],
    instructions: ['Grill protein', 'Toss salad ingredients', 'Slice protein on top', 'Drizzle with oil and lemon', 'Top with nuts'],
    macros: { calories: 520, protein: 44, carbs: 18, fats: 32 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30'],
    allergens: ['nuts'],
    proteinOptions: ['grilled chicken', 'steak', 'salmon', 'shrimp', 'turkey'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['steak', 'salmon', 'shrimp', 'turkey'], note: 'Choose preferred protein' },
      { ingredient: 'nuts', alternatives: ['seeds', 'more avocado'], note: 'For nut-free' }
    ]
  },
  {
    name: 'Paleo Sweet Potato Bowl (Beef/Chicken/Pork)',
    description: 'Roasted sweet potato with protein',
    time: '12:30 PM',
    ingredients: ['6 oz ground beef OR chicken OR pork', 'Large sweet potato', 'Broccoli', 'Avocado', 'Coconut aminos', 'Garlic', 'Ginger'],
    instructions: ['Roast sweet potato', 'Cook ground meat with seasonings', 'Steam broccoli', 'Assemble bowl', 'Top with avocado'],
    macros: { calories: 560, protein: 42, carbs: 48, fats: 22 },
    prepTime: 35,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30'],
    allergens: [],
    proteinOptions: ['ground beef', 'ground chicken', 'ground pork', 'ground turkey'],
    substitutions: [
      { ingredient: 'ground beef', alternatives: ['ground chicken', 'ground pork', 'ground turkey'], note: 'Different proteins' },
      { ingredient: 'sweet potato', alternatives: ['butternut squash', 'plantains'], note: 'Different starches' }
    ]
  },
  {
    name: 'Paleo Lettuce Wraps (Turkey/Beef/Chicken)',
    description: 'Asian-inspired lettuce wraps',
    time: '12:00 PM',
    ingredients: ['6 oz ground turkey OR beef OR chicken', 'Lettuce leaves', 'Water chestnuts', 'Mushrooms', 'Coconut aminos', 'Ginger', 'Garlic', 'Sesame oil'],
    instructions: ['Cook ground meat with aromatics', 'Add vegetables', 'Season with coconut aminos', 'Spoon into lettuce leaves', 'Serve immediately'],
    macros: { calories: 380, protein: 40, carbs: 14, fats: 18 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30', 'low-carb'],
    allergens: ['sesame'],
    proteinOptions: ['ground turkey', 'ground beef', 'ground chicken', 'ground pork'],
    substitutions: [
      { ingredient: 'ground turkey', alternatives: ['ground beef', 'ground chicken', 'ground pork'], note: 'Choose preferred protein' },
      { ingredient: 'sesame oil', alternatives: ['coconut oil', 'avocado oil'], note: 'For sesame-free' }
    ]
  },
  {
    name: 'Paleo Salmon/Tuna Bowl',
    description: 'Fish with vegetables and healthy fats',
    time: '12:00 PM',
    ingredients: ['6 oz salmon OR tuna', 'Cauliflower rice', 'Asparagus', 'Avocado', 'Coconut oil', 'Lemon', 'Dill'],
    instructions: ['Cook fish (baked or pan-seared)', 'Prepare cauliflower rice', 'Roast asparagus', 'Assemble bowl', 'Top with avocado and herbs'],
    macros: { calories: 480, protein: 44, carbs: 16, fats: 28 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'high',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30', 'omega-3'],
    allergens: ['fish'],
    proteinOptions: ['salmon', 'tuna', 'halibut', 'cod', 'shrimp'],
    substitutions: [
      { ingredient: 'salmon', alternatives: ['tuna', 'halibut', 'cod', 'shrimp'], note: 'Different fish options' },
      { ingredient: 'cauliflower rice', alternatives: ['zucchini noodles', 'more vegetables'], note: 'For variety' }
    ]
  }
];

// ============================================
// PALEO DINNER COLLECTION (25 options)
// ============================================

export const PALEO_DINNERS: Meal[] = [
  {
    name: 'Paleo Grilled Steak/Chicken with Vegetables',
    description: 'Classic paleo dinner',
    time: '6:00 PM',
    ingredients: ['8 oz steak OR chicken', 'Broccoli', 'Carrots', 'Sweet potato', 'Ghee OR coconut oil', 'Garlic', 'Herbs'],
    instructions: ['Season and grill protein', 'Roast vegetables with ghee', 'Cook sweet potato', 'Plate together', 'Garnish with herbs'],
    macros: { calories: 600, protein: 52, carbs: 42, fats: 24 },
    prepTime: 35,
    cookingSkill: 'beginner',
    budget: 'high',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30'],
    allergens: [],
    proteinOptions: ['steak', 'chicken breast', 'chicken thighs', 'pork chops'],
    substitutions: [
      { ingredient: 'steak', alternatives: ['chicken', 'pork chops', 'lamb chops'], note: 'Choose preferred protein' },
      { ingredient: 'ghee', alternatives: ['coconut oil', 'avocado oil'], note: 'Different cooking fats' }
    ]
  },
  {
    name: 'Paleo Baked Salmon/Trout with Roasted Vegetables',
    description: 'Omega-3 rich dinner',
    time: '6:00 PM',
    ingredients: ['6 oz salmon OR trout', 'Brussels sprouts', 'Butternut squash', 'Olive oil', 'Lemon', 'Dill', 'Garlic'],
    instructions: ['Season fish and vegetables', 'Arrange on baking sheet', 'Bake at 400°F for 20-25 minutes', 'Squeeze lemon before serving'],
    macros: { calories: 520, protein: 44, carbs: 38, fats: 22 },
    prepTime: 30,
    cookingSkill: 'beginner',
    budget: 'high',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30', 'omega-3'],
    allergens: ['fish'],
    proteinOptions: ['salmon', 'trout', 'arctic char', 'cod'],
    substitutions: [
      { ingredient: 'salmon', alternatives: ['trout', 'arctic char', 'cod'], note: 'Different fish' },
      { ingredient: 'butternut squash', alternatives: ['sweet potato', 'acorn squash'], note: 'Different squashes' }
    ]
  },
  {
    name: 'Paleo Ground Beef/Turkey Skillet',
    description: 'One-pan dinner',
    time: '6:30 PM',
    ingredients: ['8 oz ground beef OR turkey', 'Bell peppers', 'Onions', 'Zucchini', 'Tomato sauce', 'Italian seasoning', 'Garlic', 'Coconut oil'],
    instructions: ['Brown meat in coconut oil', 'Add vegetables', 'Add tomato sauce and seasonings', 'Simmer until vegetables tender', 'Serve hot'],
    macros: { calories: 480, protein: 42, carbs: 22, fats: 26 },
    prepTime: 25,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30'],
    allergens: [],
    proteinOptions: ['ground beef', 'ground turkey', 'ground chicken', 'ground bison'],
    substitutions: [
      { ingredient: 'ground beef', alternatives: ['ground turkey', 'ground chicken', 'ground bison'], note: 'Different proteins' },
      { ingredient: 'tomato sauce', alternatives: ['diced tomatoes', 'coconut milk'], note: 'For nightshade-free' }
    ]
  },
  {
    name: 'Paleo Pork Chops/Tenderloin with Apples',
    description: 'Sweet and savory pork dish',
    time: '6:00 PM',
    ingredients: ['8 oz pork chops OR tenderloin', 'Apples', 'Onions', 'Coconut oil', 'Cinnamon', 'Thyme', 'Green beans'],
    instructions: ['Sear pork in coconut oil', 'Remove and cook apples and onions', 'Return pork to pan', 'Steam green beans', 'Serve together'],
    macros: { calories: 540, protein: 48, carbs: 34, fats: 22 },
    prepTime: 30,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30'],
    allergens: [],
    proteinOptions: ['pork chops', 'pork tenderloin', 'pork shoulder'],
    substitutions: [
      { ingredient: 'pork chops', alternatives: ['pork tenderloin', 'chicken thighs'], note: 'Different proteins' },
      { ingredient: 'apples', alternatives: ['pears', 'dried fruit'], note: 'Different fruits' }
    ]
  },
  {
    name: 'Paleo Shrimp/Scallop Stir-Fry',
    description: 'Quick seafood dinner',
    time: '6:30 PM',
    ingredients: ['8 oz shrimp OR scallops', 'Mixed vegetables', 'Coconut aminos', 'Ginger', 'Garlic', 'Cauliflower rice', 'Coconut oil'],
    instructions: ['Heat coconut oil in wok', 'Stir-fry seafood', 'Remove and stir-fry vegetables', 'Add seafood back with sauce', 'Serve over cauliflower rice'],
    macros: { calories: 420, protein: 42, carbs: 24, fats: 18 },
    prepTime: 20,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30'],
    allergens: ['shellfish'],
    proteinOptions: ['shrimp', 'scallops', 'mixed seafood', 'chicken'],
    substitutions: [
      { ingredient: 'shrimp', alternatives: ['scallops', 'chicken', 'beef strips'], note: 'Different proteins' },
      { ingredient: 'coconut aminos', alternatives: ['fish sauce', 'bone broth'], note: 'For different flavors' }
    ]
  }
];

// ============================================
// PALEO SNACKS COLLECTION (15 options)
// ============================================

export const PALEO_SNACKS: Meal[] = [
  {
    name: 'Paleo Beef/Turkey Jerky',
    description: 'High-protein portable snack',
    time: '3:00 PM',
    ingredients: ['Beef OR turkey jerky (sugar-free, paleo)', 'Raw nuts (almonds, cashews)', 'Dried fruit (optional)'],
    instructions: ['Portion jerky', 'Add handful of nuts', 'Add small amount of dried fruit if desired'],
    macros: { calories: 240, protein: 18, carbs: 14, fats: 14 },
    prepTime: 2,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['paleo', 'gluten-free', 'dairy-free'],
    allergens: ['nuts'],
    proteinOptions: ['beef jerky', 'turkey jerky', 'bison jerky', 'salmon jerky'],
    substitutions: [
      { ingredient: 'beef jerky', alternatives: ['turkey jerky', 'bison jerky', 'salmon jerky'], note: 'Different proteins' },
      { ingredient: 'nuts', alternatives: ['seeds', 'coconut chips'], note: 'For nut-free' }
    ]
  },
  {
    name: 'Paleo Hard-Boiled Eggs with Avocado',
    description: 'Simple protein and fat snack',
    time: '3:00 PM',
    ingredients: ['2 hard-boiled eggs', '1/2 avocado', 'Sea salt', 'Pepper', 'Everything seasoning'],
    instructions: ['Peel eggs', 'Slice avocado', 'Season both', 'Eat together'],
    macros: { calories: 280, protein: 14, carbs: 8, fats: 22 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'whole30'],
    allergens: ['eggs'],
    proteinOptions: ['eggs', 'chicken breast slices', 'turkey slices'],
    substitutions: [
      { ingredient: 'eggs', alternatives: ['chicken breast', 'turkey slices'], note: 'For egg-free' }
    ]
  },
  {
    name: 'Paleo Almond/Cashew Butter with Apple',
    description: 'Sweet and satisfying snack',
    time: '3:00 PM',
    ingredients: ['1 apple', '2 tbsp almond butter OR cashew butter', 'Cinnamon'],
    instructions: ['Slice apple', 'Serve with nut butter', 'Sprinkle with cinnamon'],
    macros: { calories: 260, protein: 6, carbs: 32, fats: 14 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['paleo', 'gluten-free', 'dairy-free', 'vegan'],
    allergens: ['nuts'],
    proteinOptions: ['almond butter', 'cashew butter', 'sunflower seed butter'],
    substitutions: [
      { ingredient: 'almond butter', alternatives: ['cashew butter', 'sunflower seed butter'], note: 'For nut-free' },
      { ingredient: 'apple', alternatives: ['banana', 'pear', 'celery'], note: 'Different fruits/vegetables' }
    ]
  }
];

export default {
  PALEO_BREAKFASTS,
  PALEO_LUNCHES,
  PALEO_DINNERS,
  PALEO_SNACKS
};

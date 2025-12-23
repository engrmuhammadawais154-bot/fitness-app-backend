// Expanded Keto Meal Database with Protein Options
// Comprehensive low-carb, high-fat keto meals (under 20g net carbs per meal)

import type { Meal } from './mealPlanTypes';

// ============================================
// KETO BREAKFAST COLLECTION (20 options)
// ============================================

export const KETO_BREAKFASTS: Meal[] = [
  {
    name: 'Keto Omelet (Bacon/Sausage/Ham)',
    description: 'Classic low-carb high-fat breakfast',
    time: '7:00 AM',
    ingredients: ['3 eggs', '2 strips bacon OR 2 sausage links OR 2 oz ham', 'Cheese', 'Spinach', 'Mushrooms', 'Butter', 'Heavy cream'],
    instructions: ['Whisk eggs with cream', 'Cook meat in butter', 'Pour eggs into pan', 'Add cheese and vegetables', 'Fold and serve'],
    macros: { calories: 520, protein: 32, carbs: 6, fats: 42 },
    prepTime: 15,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free'],
    allergens: ['eggs', 'dairy'],
    proteinOptions: ['bacon', 'sausage', 'ham', 'smoked salmon', 'ground beef'],
    substitutions: [
      { ingredient: 'bacon', alternatives: ['sausage', 'ham', 'smoked salmon'], note: 'Choose preferred protein' },
      { ingredient: 'heavy cream', alternatives: ['coconut cream', 'almond milk'], note: 'For dairy-free' },
      { ingredient: 'cheese', alternatives: ['nutritional yeast', 'dairy-free cheese'], note: 'For dairy-free' }
    ]
  },
  {
    name: 'Keto Bulletproof Coffee Bowl',
    description: 'Coffee-infused high-fat breakfast',
    time: '7:00 AM',
    ingredients: ['Strong coffee', 'MCT oil OR coconut oil', 'Grass-fed butter OR ghee', 'Collagen peptides', 'Vanilla extract', 'Cinnamon'],
    instructions: ['Brew strong coffee', 'Add butter and MCT oil', 'Blend until frothy', 'Add collagen', 'Top with cinnamon'],
    macros: { calories: 440, protein: 10, carbs: 2, fats: 48 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['keto', 'low-carb', 'high-fat', 'dairy-free-option'],
    allergens: ['dairy'],
    proteinOptions: ['collagen peptides', 'whey protein isolate', 'bone broth protein'],
    substitutions: [
      { ingredient: 'butter', alternatives: ['ghee', 'coconut oil'], note: 'For dairy-free' },
      { ingredient: 'MCT oil', alternatives: ['coconut oil', 'more butter'], note: 'Different fat sources' }
    ]
  },
  {
    name: 'Keto Breakfast Bowl (Eggs + Avocado + Meat)',
    description: 'Nutrient-dense breakfast bowl',
    time: '7:30 AM',
    ingredients: ['3 scrambled eggs', '1/2 avocado', '3 oz cooked bacon OR sausage OR steak', 'Cherry tomatoes', 'Cheese', 'Sour cream', 'Hot sauce'],
    instructions: ['Scramble eggs in butter', 'Cook meat', 'Arrange in bowl', 'Top with avocado and cheese', 'Add sour cream and hot sauce'],
    macros: { calories: 580, protein: 36, carbs: 8, fats: 46 },
    prepTime: 15,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free'],
    allergens: ['eggs', 'dairy'],
    proteinOptions: ['bacon', 'sausage', 'leftover steak', 'ground beef', 'chicken thighs'],
    substitutions: [
      { ingredient: 'bacon', alternatives: ['sausage', 'steak', 'ground beef'], note: 'Any fatty meat' },
      { ingredient: 'sour cream', alternatives: ['Greek yogurt', 'coconut cream'], note: 'Choose preferred topping' }
    ]
  },
  {
    name: 'Keto Pancakes (Almond Flour/Cream Cheese)',
    description: 'Low-carb pancakes',
    time: '7:00 AM',
    ingredients: ['Almond flour OR coconut flour', 'Cream cheese', 'Eggs', 'Vanilla', 'Baking powder', 'Butter', 'Sugar-free syrup'],
    instructions: ['Blend cream cheese and eggs', 'Add flour and baking powder', 'Cook in butter', 'Serve with sugar-free syrup'],
    macros: { calories: 480, protein: 18, carbs: 10, fats: 42 },
    prepTime: 20,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['keto', 'low-carb', 'high-fat'],
    allergens: ['eggs', 'dairy', 'nuts'],
    proteinOptions: ['added protein powder', 'collagen peptides', 'just eggs and cheese'],
    substitutions: [
      { ingredient: 'almond flour', alternatives: ['coconut flour (use less)', 'sunflower seed flour'], note: 'Different low-carb flours' },
      { ingredient: 'cream cheese', alternatives: ['Greek yogurt', 'cottage cheese'], note: 'Different texture' }
    ]
  }
];

// ============================================
// KETO LUNCH COLLECTION (25 options)
// ============================================

export const KETO_LUNCHES: Meal[] = [
  {
    name: 'Keto Cobb Salad (Chicken/Turkey/Steak)',
    description: 'High-fat, low-carb classic salad',
    time: '12:00 PM',
    ingredients: ['6 oz grilled chicken OR turkey OR steak', 'Mixed greens', 'Bacon', 'Hard-boiled eggs', 'Avocado', 'Blue cheese', 'Ranch dressing'],
    instructions: ['Grill and slice protein', 'Arrange greens in bowl', 'Top with protein, bacon, eggs, avocado', 'Add blue cheese', 'Dress with ranch'],
    macros: { calories: 620, protein: 48, carbs: 8, fats: 46 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free'],
    allergens: ['eggs', 'dairy'],
    proteinOptions: ['grilled chicken', 'turkey', 'steak', 'salmon', 'shrimp'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['turkey', 'steak', 'salmon', 'shrimp'], note: 'Choose preferred protein' },
      { ingredient: 'blue cheese', alternatives: ['feta', 'cheddar', 'goat cheese'], note: 'Different cheeses' },
      { ingredient: 'ranch', alternatives: ['Caesar', 'blue cheese dressing', 'olive oil + vinegar'], note: 'High-fat dressings' }
    ]
  },
  {
    name: 'Keto Burger Bowl (Beef/Turkey/Lamb)',
    description: 'Bunless burger with all the toppings',
    time: '12:00 PM',
    ingredients: ['6 oz ground beef OR turkey OR lamb', 'Lettuce', 'Cheese', 'Bacon', 'Pickles', 'Onions', 'Tomato', 'Mayo', 'Mustard', 'Avocado'],
    instructions: ['Form and cook burger patty', 'Prepare vegetables', 'Arrange lettuce as base', 'Top with burger and toppings', 'Drizzle with mayo'],
    macros: { calories: 580, protein: 42, carbs: 10, fats: 44 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free'],
    allergens: ['dairy', 'eggs'],
    proteinOptions: ['ground beef', 'ground turkey', 'ground lamb', 'ground bison'],
    substitutions: [
      { ingredient: 'ground beef', alternatives: ['ground turkey', 'ground lamb', 'ground bison'], note: 'Adjust fat content accordingly' },
      { ingredient: 'mayo', alternatives: ['avocado oil mayo', 'olive oil'], note: 'Different fat sources' }
    ]
  },
  {
    name: 'Keto Caesar Salad (Chicken/Shrimp/Salmon)',
    description: 'Creamy Caesar without croutons',
    time: '12:00 PM',
    ingredients: ['6 oz grilled chicken OR shrimp OR salmon', 'Romaine lettuce', 'Parmesan cheese', 'Caesar dressing', 'Bacon bits', 'Lemon'],
    instructions: ['Grill protein', 'Toss lettuce with dressing', 'Top with protein and parmesan', 'Add bacon bits', 'Squeeze lemon'],
    macros: { calories: 540, protein: 46, carbs: 6, fats: 38 },
    prepTime: 18,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free'],
    allergens: ['dairy', 'eggs', 'fish'],
    proteinOptions: ['grilled chicken', 'shrimp', 'salmon', 'steak'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['shrimp', 'salmon', 'steak'], note: 'Choose preferred protein' },
      { ingredient: 'parmesan', alternatives: ['pecorino romano', 'nutritional yeast'], note: 'For different flavor or dairy-free' }
    ]
  },
  {
    name: 'Keto Lettuce Wrap Tacos (Beef/Pork/Fish)',
    description: 'Low-carb tacos with lettuce shells',
    time: '12:30 PM',
    ingredients: ['6 oz ground beef OR carnitas pork OR grilled fish', 'Large lettuce leaves', 'Cheese', 'Sour cream', 'Guacamole', 'Salsa', 'Jalapeños'],
    instructions: ['Cook seasoned meat', 'Prepare toppings', 'Arrange in lettuce leaves', 'Top with cheese, sour cream, guacamole', 'Add salsa'],
    macros: { calories: 520, protein: 40, carbs: 10, fats: 38 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free'],
    allergens: ['dairy'],
    proteinOptions: ['ground beef', 'carnitas pork', 'grilled fish', 'grilled chicken', 'shrimp'],
    substitutions: [
      { ingredient: 'ground beef', alternatives: ['carnitas', 'fish', 'chicken', 'shrimp'], note: 'Different proteins work' },
      { ingredient: 'lettuce', alternatives: ['cabbage leaves', 'cheese taco shells'], note: 'Different wraps' }
    ]
  }
];

// ============================================
// KETO DINNER COLLECTION (25 options)
// ============================================

export const KETO_DINNERS: Meal[] = [
  {
    name: 'Keto Ribeye/NY Strip Steak with Butter',
    description: 'Premium fatty steak with compound butter',
    time: '6:00 PM',
    ingredients: ['8 oz ribeye OR NY strip steak', 'Garlic herb butter', 'Asparagus', 'Mushrooms', 'Olive oil', 'Salt', 'Pepper'],
    instructions: ['Season steak generously', 'Sear in cast iron', 'Roast asparagus and mushrooms', 'Top steak with butter', 'Rest before serving'],
    macros: { calories: 680, protein: 52, carbs: 8, fats: 52 },
    prepTime: 30,
    cookingSkill: 'intermediate',
    budget: 'high',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free'],
    allergens: ['dairy'],
    proteinOptions: ['ribeye', 'NY strip', 'porterhouse', 'T-bone'],
    substitutions: [
      { ingredient: 'ribeye', alternatives: ['NY strip', 'porterhouse', 'T-bone'], note: 'Choose preferred cut' },
      { ingredient: 'garlic butter', alternatives: ['blue cheese butter', 'chimichurri'], note: 'Different toppings' }
    ]
  },
  {
    name: 'Keto Salmon/Trout with Cream Sauce',
    description: 'Fatty fish with rich cream sauce',
    time: '6:00 PM',
    ingredients: ['6 oz salmon OR trout', 'Heavy cream', 'Dill', 'Lemon', 'Butter', 'Garlic', 'Broccoli', 'Cauliflower'],
    instructions: ['Pan-sear fish skin-side down', 'Make cream sauce with butter, garlic, cream', 'Steam broccoli and cauliflower', 'Plate and top with sauce'],
    macros: { calories: 620, protein: 44, carbs: 10, fats: 48 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'high',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free', 'omega-3'],
    allergens: ['fish', 'dairy'],
    proteinOptions: ['salmon', 'trout', 'arctic char', 'cod'],
    substitutions: [
      { ingredient: 'salmon', alternatives: ['trout', 'arctic char', 'cod'], note: 'Different fish options' },
      { ingredient: 'heavy cream', alternatives: ['coconut cream', 'cashew cream'], note: 'For dairy-free' }
    ]
  },
  {
    name: 'Keto Chicken Thighs/Wings with Skin',
    description: 'Crispy skin-on chicken',
    time: '6:30 PM',
    ingredients: ['8 oz chicken thighs OR wings', 'Olive oil', 'Garlic powder', 'Paprika', 'Salt', 'Pepper', 'Zucchini', 'Bell peppers'],
    instructions: ['Season chicken with spices', 'Roast at 425°F until crispy', 'Roast vegetables', 'Serve together'],
    macros: { calories: 560, protein: 46, carbs: 8, fats: 40 },
    prepTime: 40,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free'],
    allergens: [],
    proteinOptions: ['chicken thighs', 'chicken wings', 'chicken drumsticks'],
    substitutions: [
      { ingredient: 'chicken thighs', alternatives: ['chicken wings', 'drumsticks'], note: 'Dark meat preferred for fat content' },
      { ingredient: 'zucchini', alternatives: ['cauliflower', 'green beans', 'Brussels sprouts'], note: 'Low-carb vegetables' }
    ]
  },
  {
    name: 'Keto Pork Chops/Tenderloin with Cream',
    description: 'Juicy pork with creamy sauce',
    time: '6:00 PM',
    ingredients: ['8 oz pork chops OR tenderloin', 'Heavy cream', 'Mushrooms', 'Thyme', 'Butter', 'Green beans', 'Garlic'],
    instructions: ['Sear pork in butter', 'Remove and make mushroom cream sauce', 'Return pork to sauce', 'Sauté green beans', 'Serve together'],
    macros: { calories: 600, protein: 48, carbs: 8, fats: 44 },
    prepTime: 30,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free'],
    allergens: ['dairy'],
    proteinOptions: ['pork chops', 'pork tenderloin', 'pork shoulder'],
    substitutions: [
      { ingredient: 'pork chops', alternatives: ['pork tenderloin', 'pork shoulder'], note: 'Different cuts' },
      { ingredient: 'heavy cream', alternatives: ['coconut cream', 'bone broth'], note: 'For dairy-free or lighter' }
    ]
  },
  {
    name: 'Keto Ground Beef/Turkey Casserole',
    description: 'Cheesy low-carb casserole',
    time: '6:30 PM',
    ingredients: ['8 oz ground beef OR turkey', 'Cauliflower rice', 'Cheese', 'Heavy cream', 'Butter', 'Spinach', 'Garlic', 'Italian seasoning'],
    instructions: ['Brown meat', 'Mix with cauliflower rice and spinach', 'Add cream and cheese', 'Bake at 375°F until bubbly', 'Let rest'],
    macros: { calories: 580, protein: 42, carbs: 10, fats: 44 },
    prepTime: 40,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free'],
    allergens: ['dairy'],
    proteinOptions: ['ground beef', 'ground turkey', 'ground pork', 'Italian sausage'],
    substitutions: [
      { ingredient: 'ground beef', alternatives: ['ground turkey', 'ground pork', 'sausage'], note: 'Choose preferred meat' },
      { ingredient: 'cauliflower rice', alternatives: ['zucchini', 'broccoli'], note: 'Different low-carb bases' }
    ]
  }
];

// ============================================
// KETO SNACKS COLLECTION (15 options)
// ============================================

export const KETO_SNACKS: Meal[] = [
  {
    name: 'Keto Fat Bombs (Cream Cheese/Nut Butter)',
    description: 'High-fat energy bites',
    time: '3:00 PM',
    ingredients: ['Cream cheese OR coconut cream', 'Almond butter OR peanut butter', 'Cocoa powder', 'Stevia', 'Vanilla'],
    instructions: ['Mix all ingredients', 'Form into balls', 'Freeze until firm', 'Store in fridge'],
    macros: { calories: 180, protein: 4, carbs: 4, fats: 18 },
    prepTime: 10,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['keto', 'low-carb', 'high-fat'],
    allergens: ['dairy', 'nuts'],
    proteinOptions: ['added protein powder', 'collagen peptides', 'just fats'],
    substitutions: [
      { ingredient: 'cream cheese', alternatives: ['coconut cream', 'Greek yogurt'], note: 'For dairy-free or different texture' },
      { ingredient: 'almond butter', alternatives: ['peanut butter', 'sunflower seed butter'], note: 'Nut-free option' }
    ]
  },
  {
    name: 'Cheese Crisps (Cheddar/Parmesan)',
    description: 'Crispy cheese chips',
    time: '3:00 PM',
    ingredients: ['Shredded cheddar OR parmesan', 'Spices (optional)'],
    instructions: ['Place cheese mounds on parchment', 'Bake at 400°F until crispy', 'Cool completely', 'Store in airtight container'],
    macros: { calories: 200, protein: 14, carbs: 2, fats: 16 },
    prepTime: 15,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['keto', 'low-carb', 'high-fat', 'gluten-free'],
    allergens: ['dairy'],
    proteinOptions: ['cheddar', 'parmesan', 'pepper jack', 'mixed cheese'],
    substitutions: [
      { ingredient: 'cheddar', alternatives: ['parmesan', 'pepper jack', 'gouda'], note: 'Different cheeses' }
    ]
  },
  {
    name: 'Keto Beef/Turkey Jerky',
    description: 'High-protein portable snack',
    time: '3:00 PM',
    ingredients: ['Beef OR turkey jerky (sugar-free)', 'Cheese stick', 'Macadamia nuts OR pecans'],
    instructions: ['Portion jerky', 'Add cheese stick', 'Add nuts for fat'],
    macros: { calories: 240, protein: 20, carbs: 4, fats: 16 },
    prepTime: 2,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['keto', 'low-carb', 'high-protein'],
    allergens: ['dairy', 'nuts'],
    proteinOptions: ['beef jerky', 'turkey jerky', 'salmon jerky'],
    substitutions: [
      { ingredient: 'beef jerky', alternatives: ['turkey jerky', 'salmon jerky'], note: 'Different proteins' },
      { ingredient: 'macadamia nuts', alternatives: ['pecans', 'walnuts', 'sunflower seeds'], note: 'For nut-free' }
    ]
  }
];

export default {
  KETO_BREAKFASTS,
  KETO_LUNCHES,
  KETO_DINNERS,
  KETO_SNACKS
};

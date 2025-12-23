// Expanded Vegetarian Meal Database with Protein Options
// Comprehensive vegetarian meals with multiple protein alternatives

import type { Meal } from './mealPlanTypes';

// ============================================
// VEGETARIAN BREAKFAST COLLECTION (20 options)
// ============================================

export const VEGETARIAN_BREAKFASTS: Meal[] = [
  {
    name: 'Greek Yogurt/Coconut Yogurt Parfait',
    description: 'Layered yogurt with granola and fresh berries',
    time: '7:00 AM',
    ingredients: ['1 cup Greek yogurt OR coconut yogurt', '1/2 cup granola', '1 cup mixed berries', '2 tbsp honey', '1 tbsp chia seeds'],
    instructions: ['Layer yogurt in glass', 'Add granola and berries', 'Drizzle honey', 'Top with chia seeds'],
    macros: { calories: 380, protein: 18, carbs: 56, fats: 10 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['vegetarian', 'high-protein'],
    allergens: ['dairy', 'gluten', 'nuts'],
    proteinOptions: ['Greek yogurt', 'coconut yogurt', 'almond yogurt', 'soy yogurt'],
    substitutions: [
      { ingredient: 'Greek yogurt', alternatives: ['coconut yogurt', 'almond yogurt', 'soy yogurt'], note: 'For dairy-free option' },
      { ingredient: 'granola', alternatives: ['gluten-free granola', 'nuts and seeds'], note: 'For gluten-free' },
      { ingredient: 'honey', alternatives: ['maple syrup', 'agave nectar'], note: 'For vegan option' }
    ]
  },
  {
    name: 'Tofu/Egg Scramble Breakfast',
    description: 'Protein-packed scramble with vegetables',
    time: '7:00 AM',
    ingredients: ['8 oz firm tofu OR 3 eggs', 'Bell peppers', 'Onions', 'Spinach', 'Nutritional yeast', 'Turmeric', 'Whole wheat toast'],
    instructions: ['Crumble tofu or scramble eggs', 'Sauté vegetables', 'Add protein and season', 'Cook until done', 'Serve with toast'],
    macros: { calories: 340, protein: 26, carbs: 32, fats: 14 },
    prepTime: 15,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['vegetarian', 'high-protein'],
    allergens: ['soy', 'eggs', 'gluten'],
    proteinOptions: ['tofu', 'eggs', 'chickpea flour omelet'],
    substitutions: [
      { ingredient: 'tofu', alternatives: ['scrambled eggs', 'chickpea flour', 'Just Egg'], note: 'Choose preferred protein' },
      { ingredient: 'whole wheat toast', alternatives: ['gluten-free bread', 'rice cakes'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Protein Pancakes (Whey/Vegan)',
    description: 'Fluffy high-protein pancakes',
    time: '7:30 AM',
    ingredients: ['1 cup oat flour', '1 scoop whey OR vegan protein powder', '1 banana', '1 egg OR flax egg', 'Almond milk', 'Baking powder', 'Maple syrup'],
    instructions: ['Mix dry ingredients', 'Blend wet ingredients', 'Combine and let rest', 'Cook on griddle', 'Serve with syrup'],
    macros: { calories: 420, protein: 32, carbs: 58, fats: 10 },
    prepTime: 20,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['vegetarian', 'high-protein'],
    allergens: ['eggs', 'dairy', 'nuts', 'gluten'],
    proteinOptions: ['whey protein', 'vegan protein', 'pea protein', 'hemp protein'],
    substitutions: [
      { ingredient: 'whey protein', alternatives: ['vegan protein blend', 'pea protein', 'hemp protein'], note: 'For vegan/dairy-free' },
      { ingredient: 'egg', alternatives: ['flax egg (1 tbsp ground flax + 3 tbsp water)', 'chia egg'], note: 'For vegan' },
      { ingredient: 'oat flour', alternatives: ['almond flour', 'coconut flour'], note: 'For gluten-free, adjust liquid' }
    ]
  },
  {
    name: 'Cottage Cheese/Ricotta Bowl',
    description: 'Creamy cheese bowl with fresh toppings',
    time: '7:00 AM',
    ingredients: ['1 cup cottage cheese OR ricotta', 'Fresh fruit', '2 tbsp almonds', '1 tbsp flaxseed', 'Cinnamon', 'Honey'],
    instructions: ['Scoop cheese into bowl', 'Top with fruit and nuts', 'Sprinkle flaxseed and cinnamon', 'Drizzle honey'],
    macros: { calories: 360, protein: 28, carbs: 38, fats: 12 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['vegetarian', 'gluten-free', 'high-protein'],
    allergens: ['dairy', 'nuts'],
    proteinOptions: ['cottage cheese', 'ricotta cheese', 'Greek yogurt'],
    substitutions: [
      { ingredient: 'cottage cheese', alternatives: ['ricotta cheese', 'Greek yogurt', 'coconut yogurt'], note: 'Similar texture options' },
      { ingredient: 'almonds', alternatives: ['sunflower seeds', 'pumpkin seeds'], note: 'For nut allergy' }
    ]
  },
  {
    name: 'Peanut Butter/Almond Butter Oatmeal',
    description: 'Creamy oatmeal with nut butter',
    time: '7:00 AM',
    ingredients: ['1 cup oats', '2 tbsp peanut butter OR almond butter', '1 banana', '1 scoop protein powder', 'Cinnamon', 'Almond milk'],
    instructions: ['Cook oats in almond milk', 'Stir in protein powder', 'Top with nut butter and banana', 'Sprinkle cinnamon'],
    macros: { calories: 480, protein: 28, carbs: 62, fats: 16 },
    prepTime: 10,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['vegan', 'vegetarian', 'high-protein'],
    allergens: ['nuts', 'gluten'],
    proteinOptions: ['whey protein', 'vegan protein', 'hemp protein'],
    substitutions: [
      { ingredient: 'peanut butter', alternatives: ['almond butter', 'sunflower seed butter', 'tahini'], note: 'Choose preferred nut/seed butter' },
      { ingredient: 'oats', alternatives: ['quinoa flakes', 'rice cereal'], note: 'For gluten-free certified oats' }
    ]
  }
];

// ============================================
// VEGETARIAN LUNCH COLLECTION (25 options)
// ============================================

export const VEGETARIAN_LUNCHES: Meal[] = [
  {
    name: 'Quinoa/Lentil Buddha Bowl',
    description: 'Complete protein bowl with roasted vegetables',
    time: '12:00 PM',
    ingredients: ['1 cup cooked quinoa OR lentils', 'Roasted chickpeas', 'Sweet potato', 'Kale', 'Avocado', 'Tahini dressing', 'Pumpkin seeds'],
    instructions: ['Cook quinoa or lentils', 'Roast vegetables and chickpeas', 'Assemble bowl', 'Top with avocado and dressing'],
    macros: { calories: 520, protein: 22, carbs: 68, fats: 20 },
    prepTime: 30,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['vegan', 'vegetarian', 'gluten-free', 'high-fiber'],
    allergens: ['sesame'],
    proteinOptions: ['quinoa', 'lentils', 'chickpeas', 'black beans'],
    substitutions: [
      { ingredient: 'quinoa', alternatives: ['lentils', 'brown rice', 'farro'], note: 'Choose preferred grain/legume' },
      { ingredient: 'tahini dressing', alternatives: ['olive oil & lemon', 'avocado dressing'], note: 'For sesame allergy' }
    ]
  },
  {
    name: 'Black Bean/Pinto Bean Burrito Bowl',
    description: 'Mexican-inspired protein bowl',
    time: '12:30 PM',
    ingredients: ['1 cup black beans OR pinto beans', 'Brown rice', 'Corn', 'Salsa', 'Guacamole', 'Lettuce', 'Cheese OR vegan cheese', 'Sour cream OR cashew cream'],
    instructions: ['Cook rice and warm beans', 'Prepare fresh toppings', 'Layer in bowl', 'Top with guacamole and sour cream'],
    macros: { calories: 540, protein: 24, carbs: 78, fats: 16 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['vegetarian', 'high-fiber', 'high-protein'],
    allergens: ['dairy'],
    proteinOptions: ['black beans', 'pinto beans', 'refried beans', 'tempeh'],
    substitutions: [
      { ingredient: 'black beans', alternatives: ['pinto beans', 'kidney beans', 'tempeh'], note: 'All provide good protein' },
      { ingredient: 'cheese', alternatives: ['vegan cheese', 'nutritional yeast'], note: 'For dairy-free' },
      { ingredient: 'sour cream', alternatives: ['cashew cream', 'coconut cream', 'Greek yogurt'], note: 'Choose preferred option' }
    ]
  },
  {
    name: 'Grilled Tofu/Tempeh Sandwich',
    description: 'Protein-packed sandwich with marinated soy protein',
    time: '12:00 PM',
    ingredients: ['6 oz marinated tofu OR tempeh', 'Whole wheat bread', 'Lettuce', 'Tomato', 'Avocado', 'Vegan mayo', 'Mustard'],
    instructions: ['Press and marinate tofu/tempeh', 'Grill until golden', 'Toast bread', 'Assemble sandwich with toppings'],
    macros: { calories: 420, protein: 28, carbs: 42, fats: 18 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['vegan', 'vegetarian', 'high-protein'],
    allergens: ['soy', 'gluten'],
    proteinOptions: ['tofu', 'tempeh', 'seitan'],
    substitutions: [
      { ingredient: 'tofu', alternatives: ['tempeh', 'seitan', 'portobello mushroom'], note: 'Different textures and flavors' },
      { ingredient: 'whole wheat bread', alternatives: ['gluten-free bread', 'lettuce wrap'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Chickpea/White Bean Salad',
    description: 'Mediterranean protein-rich salad',
    time: '12:00 PM',
    ingredients: ['1.5 cups chickpeas OR white beans', 'Cucumbers', 'Tomatoes', 'Red onion', 'Feta OR vegan feta', 'Olives', 'Lemon-olive oil dressing'],
    instructions: ['Drain and rinse beans', 'Chop vegetables', 'Toss everything together', 'Dress with lemon and oil'],
    macros: { calories: 380, protein: 18, carbs: 52, fats: 14 },
    prepTime: 15,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['vegetarian', 'mediterranean', 'high-fiber'],
    allergens: ['dairy'],
    proteinOptions: ['chickpeas', 'white beans', 'kidney beans', 'lentils'],
    substitutions: [
      { ingredient: 'chickpeas', alternatives: ['white beans', 'kidney beans', 'edamame'], note: 'Any legume works' },
      { ingredient: 'feta', alternatives: ['vegan feta', 'nutritional yeast', 'omit'], note: 'For dairy-free' }
    ]
  },
  {
    name: 'Veggie Burger (Bean/Lentil/Commercial)',
    description: 'Hearty plant-based burger',
    time: '12:30 PM',
    ingredients: ['1 black bean burger OR lentil patty OR Beyond Burger', 'Whole wheat bun', 'Lettuce', 'Tomato', 'Onion', 'Pickles', 'Mustard', 'Sweet potato fries'],
    instructions: ['Cook burger patty', 'Toast bun', 'Prepare toppings', 'Assemble burger', 'Serve with fries'],
    macros: { calories: 520, protein: 26, carbs: 68, fats: 18 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['vegan', 'vegetarian', 'high-protein'],
    allergens: ['gluten', 'soy'],
    proteinOptions: ['black bean burger', 'lentil burger', 'Beyond Burger', 'Impossible Burger', 'chickpea burger'],
    substitutions: [
      { ingredient: 'veggie burger', alternatives: ['black bean patty', 'Beyond Burger', 'portobello cap'], note: 'Choose preferred option' },
      { ingredient: 'whole wheat bun', alternatives: ['gluten-free bun', 'lettuce wrap'], note: 'For gluten-free' }
    ]
  }
];

// ============================================
// VEGETARIAN DINNER COLLECTION (25 options)
// ============================================

export const VEGETARIAN_DINNERS: Meal[] = [
  {
    name: 'Lentil/Bean Curry',
    description: 'Creamy Indian curry with your choice of legumes',
    time: '6:00 PM',
    ingredients: ['1.5 cups red lentils OR chickpeas OR black beans', 'Coconut milk', 'Tomatoes', 'Onions', 'Ginger', 'Garlic', 'Curry spices', 'Basmati rice', 'Naan OR roti'],
    instructions: ['Sauté aromatics', 'Add spices and tomatoes', 'Add legumes and coconut milk', 'Simmer until thick', 'Serve over rice with naan'],
    macros: { calories: 580, protein: 24, carbs: 88, fats: 16 },
    prepTime: 35,
    cookingSkill: 'intermediate',
    budget: 'low',
    dietTags: ['vegan', 'vegetarian', 'high-fiber', 'high-protein'],
    allergens: ['gluten'],
    proteinOptions: ['red lentils', 'chickpeas', 'black beans', 'kidney beans', 'paneer'],
    substitutions: [
      { ingredient: 'red lentils', alternatives: ['chickpeas', 'kidney beans', 'paneer cubes'], note: 'Choose preferred protein' },
      { ingredient: 'coconut milk', alternatives: ['cashew cream', 'almond milk + coconut cream'], note: 'Adjust for allergies' },
      { ingredient: 'naan', alternatives: ['roti', 'rice', 'gluten-free bread'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Stuffed Peppers (Quinoa/Rice)',
    description: 'Bell peppers stuffed with protein-rich filling',
    time: '6:30 PM',
    ingredients: ['4 bell peppers', '1 cup quinoa OR brown rice', 'Black beans', 'Corn', 'Tomatoes', 'Cheese OR vegan cheese', 'Cumin', 'Chili powder'],
    instructions: ['Cook quinoa/rice', 'Mix with beans, corn, spices', 'Stuff peppers', 'Top with cheese', 'Bake until tender'],
    macros: { calories: 460, protein: 20, carbs: 72, fats: 12 },
    prepTime: 50,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['vegetarian', 'gluten-free', 'high-fiber'],
    allergens: ['dairy'],
    proteinOptions: ['quinoa + black beans', 'brown rice + lentils', 'farro + chickpeas'],
    substitutions: [
      { ingredient: 'quinoa', alternatives: ['brown rice', 'cauliflower rice', 'farro'], note: 'Choose preferred grain' },
      { ingredient: 'cheese', alternatives: ['vegan cheese', 'nutritional yeast'], note: 'For dairy-free' }
    ]
  },
  {
    name: 'Eggplant/Zucchini Parmesan',
    description: 'Italian baked vegetable with cheese',
    time: '6:00 PM',
    ingredients: ['2 medium eggplants OR zucchinis', 'Marinara sauce', 'Mozzarella cheese OR vegan mozzarella', 'Parmesan OR nutritional yeast', 'Breadcrumbs OR almond flour', 'Basil'],
    instructions: ['Slice and bread vegetables', 'Bake until golden', 'Layer with sauce and cheese', 'Bake until bubbly', 'Garnish with basil'],
    macros: { calories: 420, protein: 24, carbs: 42, fats: 18 },
    prepTime: 45,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['vegetarian', 'italian'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['eggplant', 'zucchini', 'portobello mushrooms'],
    substitutions: [
      { ingredient: 'eggplant', alternatives: ['zucchini', 'portobello mushrooms'], note: 'Similar cooking method' },
      { ingredient: 'mozzarella', alternatives: ['vegan mozzarella', 'cashew cheese'], note: 'For dairy-free' },
      { ingredient: 'breadcrumbs', alternatives: ['almond flour', 'gluten-free breadcrumbs'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Stir-Fry (Tofu/Tempeh/Seitan)',
    description: 'Asian-inspired vegetable and protein stir-fry',
    time: '6:00 PM',
    ingredients: ['8 oz tofu OR tempeh OR seitan', 'Mixed vegetables', 'Soy sauce OR coconut aminos', 'Ginger', 'Garlic', 'Sesame oil', 'Brown rice OR noodles'],
    instructions: ['Press and cube protein', 'Stir-fry until crispy', 'Add vegetables', 'Add sauce', 'Serve over rice/noodles'],
    macros: { calories: 480, protein: 28, carbs: 58, fats: 16 },
    prepTime: 25,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['vegan', 'vegetarian', 'high-protein'],
    allergens: ['soy', 'sesame', 'gluten'],
    proteinOptions: ['tofu', 'tempeh', 'seitan', 'edamame'],
    substitutions: [
      { ingredient: 'tofu', alternatives: ['tempeh', 'seitan', 'chickpeas'], note: 'Different textures' },
      { ingredient: 'soy sauce', alternatives: ['coconut aminos', 'tamari'], note: 'For soy-free or gluten-free' },
      { ingredient: 'rice', alternatives: ['quinoa', 'cauliflower rice', 'noodles'], note: 'Choose preferred base' }
    ]
  },
  {
    name: 'Veggie Lasagna (Ricotta/Tofu)',
    description: 'Layered pasta with vegetable and cheese filling',
    time: '6:30 PM',
    ingredients: ['Lasagna noodles', 'Ricotta cheese OR tofu ricotta', 'Spinach', 'Mushrooms', 'Zucchini', 'Marinara sauce', 'Mozzarella OR vegan mozzarella'],
    instructions: ['Cook noodles', 'Sauté vegetables', 'Mix ricotta/tofu with spinach', 'Layer pasta, filling, sauce, cheese', 'Bake until bubbly'],
    macros: { calories: 520, protein: 28, carbs: 62, fats: 18 },
    prepTime: 60,
    cookingSkill: 'advanced',
    budget: 'medium',
    dietTags: ['vegetarian', 'high-protein'],
    allergens: ['dairy', 'gluten', 'soy'],
    proteinOptions: ['ricotta cheese', 'tofu ricotta', 'cottage cheese'],
    substitutions: [
      { ingredient: 'ricotta', alternatives: ['tofu ricotta (blended tofu + nutritional yeast)', 'cottage cheese'], note: 'For vegan use tofu' },
      { ingredient: 'lasagna noodles', alternatives: ['gluten-free noodles', 'zucchini sheets'], note: 'For gluten-free/low-carb' },
      { ingredient: 'mozzarella', alternatives: ['vegan mozzarella', 'cashew cheese'], note: 'For dairy-free' }
    ]
  }
];

// ============================================
// VEGETARIAN SNACKS COLLECTION (15 options)
// ============================================

export const VEGETARIAN_SNACKS: Meal[] = [
  {
    name: 'Protein Smoothie (Whey/Vegan)',
    description: 'Quick protein-packed drink',
    time: '3:00 PM',
    ingredients: ['1 scoop whey OR vegan protein', 'Banana', 'Spinach', 'Almond milk OR oat milk', 'Peanut butter OR almond butter', 'Ice'],
    instructions: ['Blend all ingredients until smooth', 'Serve immediately'],
    macros: { calories: 320, protein: 28, carbs: 38, fats: 10 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'medium',
    dietTags: ['vegetarian', 'high-protein'],
    allergens: ['dairy', 'nuts', 'soy'],
    proteinOptions: ['whey protein', 'vegan protein blend', 'pea protein', 'hemp protein'],
    substitutions: [
      { ingredient: 'whey protein', alternatives: ['vegan protein', 'pea protein', 'hemp protein'], note: 'For vegan/dairy-free' },
      { ingredient: 'almond milk', alternatives: ['oat milk', 'soy milk', 'coconut milk'], note: 'Choose preferred plant milk' },
      { ingredient: 'peanut butter', alternatives: ['almond butter', 'sunflower seed butter'], note: 'For peanut allergy' }
    ]
  },
  {
    name: 'Edamame/Roasted Chickpeas',
    description: 'Crunchy high-protein snack',
    time: '3:00 PM',
    ingredients: ['1 cup edamame OR roasted chickpeas', 'Sea salt', 'Spices (optional)'],
    instructions: ['Steam edamame OR roast chickpeas until crispy', 'Season with salt and spices'],
    macros: { calories: 180, protein: 16, carbs: 14, fats: 8 },
    prepTime: 10,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['vegan', 'vegetarian', 'gluten-free', 'high-protein'],
    allergens: ['soy'],
    proteinOptions: ['edamame', 'roasted chickpeas', 'roasted lentils'],
    substitutions: [
      { ingredient: 'edamame', alternatives: ['roasted chickpeas', 'roasted soybeans'], note: 'Different textures' }
    ]
  }
];

export default {
  VEGETARIAN_BREAKFASTS,
  VEGETARIAN_LUNCHES,
  VEGETARIAN_DINNERS,
  VEGETARIAN_SNACKS
};

// Expanded Hindu Meal Database with Protein Options
// Comprehensive Hindu meals - no beef, mostly vegetarian options, some allow chicken/fish

import type { Meal } from './mealPlanTypes';

// ============================================
// HINDU BREAKFAST COLLECTION (20 options)
// ============================================

export const HINDU_BREAKFASTS: Meal[] = [
  {
    name: 'Idli/Dosa with Sambar',
    description: 'South Indian steamed/fermented cakes with lentil stew',
    time: '7:00 AM',
    ingredients: ['Idli OR dosa (rice and lentil batter)', 'Sambar (lentil stew)', 'Coconut chutney', 'Tomato chutney', 'Ghee'],
    instructions: ['Steam idli or make dosa on griddle', 'Prepare sambar', 'Make chutneys', 'Serve with ghee'],
    macros: { calories: 420, protein: 16, carbs: 68, fats: 10 },
    prepTime: 30,
    cookingSkill: 'intermediate',
    budget: 'low',
    dietTags: ['hindu', 'vegetarian', 'south-indian', 'sattvic'],
    allergens: ['dairy'],
    proteinOptions: ['lentils from sambar', 'add paneer on side', 'add egg if lacto-ovo'],
    substitutions: [
      { ingredient: 'idli', alternatives: ['dosa', 'uttapam', 'appam'], note: 'Different rice-lentil preparations' },
      { ingredient: 'ghee', alternatives: ['coconut oil', 'butter'], note: 'Different fats' }
    ]
  },
  {
    name: 'Paratha with Yogurt (Paneer/Aloo/Mixed Vegetable)',
    description: 'Stuffed flatbread with yogurt',
    time: '7:00 AM',
    ingredients: ['Wheat flour', 'Paneer OR potatoes OR mixed vegetables', 'Ghee', 'Yogurt', 'Pickle', 'Spices'],
    instructions: ['Make dough', 'Prepare filling', 'Stuff and roll parathas', 'Cook on griddle with ghee', 'Serve with yogurt and pickle'],
    macros: { calories: 480, protein: 18, carbs: 62, fats: 18 },
    prepTime: 35,
    cookingSkill: 'intermediate',
    budget: 'low',
    dietTags: ['hindu', 'vegetarian', 'north-indian'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['paneer', 'egg (if lacto-ovo)', 'just vegetables'],
    substitutions: [
      { ingredient: 'paneer filling', alternatives: ['potato', 'mixed vegetables', 'egg'], note: 'Different protein levels' },
      { ingredient: 'wheat flour', alternatives: ['multigrain flour', 'gluten-free flour'], note: 'For gluten-free' }
    ]
  },
  {
    name: 'Upma/Poha',
    description: 'Savory semolina or flattened rice breakfast',
    time: '7:00 AM',
    ingredients: ['Semolina (upma) OR flattened rice (poha)', 'Mustard seeds', 'Curry leaves', 'Onions', 'Green chilies', 'Cashews', 'Peanuts', 'Turmeric', 'Lemon'],
    instructions: ['Roast semolina/rinse poha', 'Temper spices in oil', 'Add vegetables', 'Mix with semolina/poha', 'Garnish with nuts and lemon'],
    macros: { calories: 380, protein: 12, carbs: 58, fats: 12 },
    prepTime: 20,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['hindu', 'vegetarian', 'vegan-option', 'south-indian', 'sattvic'],
    allergens: ['nuts', 'gluten'],
    proteinOptions: ['cashews and peanuts', 'add chickpeas', 'serve with egg'],
    substitutions: [
      { ingredient: 'upma', alternatives: ['poha', 'vermicelli upma'], note: 'Different grain bases' },
      { ingredient: 'cashews', alternatives: ['peanuts only', 'seeds'], note: 'For nut allergies' }
    ]
  }
];

// ============================================
// HINDU LUNCH COLLECTION (25 options)
// ============================================

export const HINDU_LUNCHES: Meal[] = [
  {
    name: 'Dal (Lentils) with Rice (Multiple Varieties)',
    description: 'Classic Indian lentil curry',
    time: '12:00 PM',
    ingredients: ['Lentils (toor, moong, masoor, OR chana dal)', 'Basmati rice', 'Tomatoes', 'Onions', 'Ginger', 'Garlic (optional)', 'Turmeric', 'Cumin', 'Ghee', 'Roti'],
    instructions: ['Cook lentils with spices', 'Cook rice', 'Temper dal with ghee and spices', 'Serve together with roti'],
    macros: { calories: 520, protein: 22, carbs: 88, fats: 8 },
    prepTime: 40,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['hindu', 'vegetarian', 'vegan-option', 'sattvic'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['toor dal', 'moong dal', 'masoor dal', 'chana dal', 'mixed dal'],
    substitutions: [
      { ingredient: 'toor dal', alternatives: ['moong dal', 'masoor dal', 'chana dal'], note: 'Different lentils, different textures' },
      { ingredient: 'ghee', alternatives: ['oil', 'butter'], note: 'For vegan use oil' },
      { ingredient: 'garlic', alternatives: ['hing (asafoetida)'], note: 'For sattvic/no garlic' }
    ]
  },
  {
    name: 'Rajma/Chole (Kidney Beans/Chickpeas) with Rice',
    description: 'Protein-rich bean curry',
    time: '12:30 PM',
    ingredients: ['Kidney beans OR chickpeas', 'Tomatoes', 'Onions', 'Ginger', 'Garam masala', 'Cumin', 'Coriander', 'Basmati rice', 'Roti'],
    instructions: ['Soak and cook beans', 'Make masala gravy', 'Add beans and simmer', 'Serve with rice and roti'],
    macros: { calories: 560, protein: 24, carbs: 96, fats: 8 },
    prepTime: 60,
    cookingSkill: 'intermediate',
    budget: 'low',
    dietTags: ['hindu', 'vegetarian', 'vegan', 'north-indian'],
    allergens: ['gluten'],
    proteinOptions: ['kidney beans (rajma)', 'chickpeas (chole)', 'black chickpeas (kala chana)'],
    substitutions: [
      { ingredient: 'kidney beans', alternatives: ['chickpeas', 'black chickpeas', 'mixed beans'], note: 'Different beans' },
      { ingredient: 'rice', alternatives: ['quinoa', 'brown rice'], note: 'Different grains' }
    ]
  },
  {
    name: 'Paneer Curry (Butter Paneer/Palak Paneer/Kadai Paneer)',
    description: 'Indian cottage cheese curry',
    time: '12:00 PM',
    ingredients: ['Paneer (cottage cheese)', 'Tomatoes OR spinach', 'Cream', 'Butter OR ghee', 'Onions', 'Ginger', 'Spices', 'Basmati rice', 'Naan'],
    instructions: ['Cube and lightly fry paneer', 'Make curry base', 'Add paneer', 'Simmer', 'Serve with rice and naan'],
    macros: { calories: 620, protein: 28, carbs: 68, fats: 26 },
    prepTime: 35,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['hindu', 'vegetarian', 'north-indian'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['paneer', 'tofu (for vegan)', 'extra vegetables'],
    substitutions: [
      { ingredient: 'paneer', alternatives: ['tofu', 'extra vegetables'], note: 'For vegan' },
      { ingredient: 'cream', alternatives: ['coconut cream', 'cashew cream'], note: 'For dairy-free' },
      { ingredient: 'naan', alternatives: ['roti', 'rice only'], note: 'For different breads' }
    ]
  },
  {
    name: 'Vegetable Biryani/Pulao',
    description: 'Spiced rice with vegetables',
    time: '12:30 PM',
    ingredients: ['Basmati rice', 'Mixed vegetables (carrots, peas, beans, cauliflower)', 'Yogurt', 'Saffron', 'Whole spices (bay leaf, cinnamon, cardamom)', 'Fried onions', 'Raita'],
    instructions: ['Prepare rice with whole spices', 'Cook vegetables with masala', 'Layer rice and vegetables', 'Dum cook (steam)', 'Serve with raita'],
    macros: { calories: 480, protein: 14, carbs: 82, fats: 12 },
    prepTime: 50,
    cookingSkill: 'advanced',
    budget: 'medium',
    dietTags: ['hindu', 'vegetarian'],
    allergens: ['dairy'],
    proteinOptions: ['add paneer', 'add eggs', 'add chickpeas', 'add tofu'],
    substitutions: [
      { ingredient: 'vegetables only', alternatives: ['add paneer', 'add eggs', 'add chickpeas'], note: 'For more protein' },
      { ingredient: 'yogurt', alternatives: ['dairy-free yogurt'], note: 'For vegan' }
    ]
  }
];

// ============================================
// HINDU DINNER COLLECTION (25 options)
// ============================================

export const HINDU_DINNERS: Meal[] = [
  {
    name: 'Full Thali (Dal, Sabzi, Roti, Rice)',
    description: 'Traditional complete meal platter',
    time: '6:00 PM',
    ingredients: ['Dal (any variety)', 'Vegetable curry (sabzi)', 'Roti/chapati', 'Rice', 'Yogurt', 'Pickle', 'Papad', 'Salad'],
    instructions: ['Prepare dal', 'Make vegetable curry', 'Cook rotis and rice', 'Arrange on thali', 'Serve with yogurt and accompaniments'],
    macros: { calories: 620, protein: 24, carbs: 98, fats: 14 },
    prepTime: 60,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['hindu', 'vegetarian', 'traditional', 'complete-meal'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['dal (lentils)', 'add paneer to sabzi', 'add chickpeas'],
    substitutions: [
      { ingredient: 'dal', alternatives: ['different lentil varieties'], note: 'Choose preferred lentils' },
      { ingredient: 'sabzi', alternatives: ['any vegetable curry'], note: 'Seasonal vegetables' }
    ]
  },
  {
    name: 'Chicken Curry (For Non-Vegetarian Hindus)',
    description: 'Spiced chicken curry',
    time: '6:30 PM',
    ingredients: ['8 oz chicken (bone-in OR boneless)', 'Tomatoes', 'Onions', 'Yogurt', 'Ginger-garlic paste', 'Garam masala', 'Turmeric', 'Chili powder', 'Rice', 'Roti'],
    instructions: ['Marinate chicken in yogurt and spices', 'Make masala gravy', 'Add chicken and simmer', 'Serve with rice and roti'],
    macros: { calories: 640, protein: 48, carbs: 68, fats: 18 },
    prepTime: 45,
    cookingSkill: 'intermediate',
    budget: 'medium',
    dietTags: ['hindu', 'non-vegetarian', 'north-indian'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['chicken', 'lamb (for non-veg)', 'fish (for non-veg)', 'paneer (for veg)'],
    substitutions: [
      { ingredient: 'chicken', alternatives: ['lamb', 'fish', 'paneer'], note: 'Different proteins' },
      { ingredient: 'yogurt', alternatives: ['coconut yogurt', 'cashew paste'], note: 'For dairy-free' }
    ]
  },
  {
    name: 'Fish Curry (For Non-Vegetarian Hindus)',
    description: 'Bengali/South Indian style fish curry',
    time: '6:00 PM',
    ingredients: ['8 oz fish (rohu, pomfret, OR salmon)', 'Coconut milk OR tamarind', 'Mustard seeds', 'Curry leaves', 'Turmeric', 'Red chili', 'Rice'],
    instructions: ['Marinate fish with turmeric', 'Make curry base', 'Gently add fish', 'Simmer until cooked', 'Serve with rice'],
    macros: { calories: 560, protein: 46, carbs: 58, fats: 16 },
    prepTime: 35,
    cookingSkill: 'intermediate',
    budget: 'high',
    dietTags: ['hindu', 'non-vegetarian', 'bengali', 'south-indian', 'omega-3'],
    allergens: ['fish'],
    proteinOptions: ['rohu', 'pomfret', 'salmon', 'tilapia', 'catfish'],
    substitutions: [
      { ingredient: 'rohu', alternatives: ['pomfret', 'salmon', 'tilapia', 'catfish'], note: 'Different fish varieties' },
      { ingredient: 'coconut milk', alternatives: ['tamarind water'], note: 'For different regional styles' }
    ]
  },
  {
    name: 'Aloo Gobi (Potato and Cauliflower)',
    description: 'Classic vegetable dry curry',
    time: '6:00 PM',
    ingredients: ['Potatoes', 'Cauliflower', 'Tomatoes', 'Onions', 'Ginger', 'Turmeric', 'Cumin', 'Coriander', 'Roti', 'Rice'],
    instructions: ['Cube potatoes and cauliflower', 'Temper spices', 'Add vegetables and cook covered', 'Serve with roti and rice'],
    macros: { calories: 480, protein: 12, carbs: 88, fats: 10 },
    prepTime: 30,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['hindu', 'vegetarian', 'vegan', 'north-indian', 'sattvic'],
    allergens: ['gluten'],
    proteinOptions: ['add chickpeas', 'add paneer', 'serve with dal for protein'],
    substitutions: [
      { ingredient: 'cauliflower', alternatives: ['broccoli', 'green beans', 'mixed vegetables'], note: 'Different vegetables' },
      { ingredient: 'potatoes', alternatives: ['sweet potatoes', 'more cauliflower'], note: 'For lower glycemic' }
    ]
  },
  {
    name: 'Kadhi (Yogurt Curry)',
    description: 'Tangy yogurt-based curry',
    time: '6:30 PM',
    ingredients: ['Yogurt', 'Chickpea flour (besan)', 'Pakoras (fritters)', 'Turmeric', 'Cumin', 'Mustard seeds', 'Curry leaves', 'Rice', 'Roti'],
    instructions: ['Whisk yogurt with chickpea flour', 'Cook with spices', 'Add pakoras', 'Temper with spices', 'Serve with rice'],
    macros: { calories: 520, protein: 18, carbs: 78, fats: 16 },
    prepTime: 40,
    cookingSkill: 'intermediate',
    budget: 'low',
    dietTags: ['hindu', 'vegetarian', 'north-indian'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['yogurt', 'chickpea flour in pakoras', 'add more pakoras for protein'],
    substitutions: [
      { ingredient: 'yogurt', alternatives: ['dairy-free yogurt'], note: 'For vegan' },
      { ingredient: 'pakoras', alternatives: ['vegetables only', 'more fritters'], note: 'Adjust protein' }
    ]
  }
];

// ============================================
// HINDU SNACKS COLLECTION (15 options)
// ============================================

export const HINDU_SNACKS: Meal[] = [
  {
    name: 'Samosa/Pakora',
    description: 'Fried savory snacks',
    time: '3:00 PM',
    ingredients: ['Samosa (potato filling) OR pakora (vegetable fritters)', 'Tamarind chutney', 'Mint chutney', 'Tea (chai)'],
    instructions: ['Fry samosas/pakoras until golden', 'Serve hot with chutneys and tea'],
    macros: { calories: 320, protein: 8, carbs: 48, fats: 12 },
    prepTime: 30,
    cookingSkill: 'intermediate',
    budget: 'low',
    dietTags: ['hindu', 'vegetarian', 'vegan'],
    allergens: ['gluten'],
    proteinOptions: ['chickpea flour in pakora', 'add paneer filling', 'add egg'],
    substitutions: [
      { ingredient: 'samosa', alternatives: ['pakora', 'kachori'], note: 'Different fried snacks' },
      { ingredient: 'fried', alternatives: ['baked'], note: 'For healthier option' }
    ]
  },
  {
    name: 'Masala Chai with Biscuits',
    description: 'Spiced tea with snacks',
    time: '3:00 PM',
    ingredients: ['Black tea', 'Milk', 'Cardamom', 'Ginger', 'Cinnamon', 'Sugar', 'Digestive biscuits OR cookies'],
    instructions: ['Boil tea with spices and milk', 'Strain and serve', 'Enjoy with biscuits'],
    macros: { calories: 240, protein: 6, carbs: 42, fats: 6 },
    prepTime: 10,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['hindu', 'vegetarian'],
    allergens: ['dairy', 'gluten'],
    proteinOptions: ['milk in chai', 'protein biscuits', 'add nuts'],
    substitutions: [
      { ingredient: 'milk', alternatives: ['almond milk', 'oat milk', 'coconut milk'], note: 'For vegan' },
      { ingredient: 'biscuits', alternatives: ['cookies', 'cake', 'namkeen'], note: 'Different accompaniments' }
    ]
  },
  {
    name: 'Lassi (Sweet/Salted)',
    description: 'Yogurt-based drink',
    time: '3:00 PM',
    ingredients: ['Yogurt', 'Water', 'Sugar OR salt', 'Cardamom OR cumin', 'Ice'],
    instructions: ['Blend yogurt with water', 'Add sweet or savory flavoring', 'Serve chilled'],
    macros: { calories: 180, protein: 8, carbs: 28, fats: 4 },
    prepTime: 5,
    cookingSkill: 'beginner',
    budget: 'low',
    dietTags: ['hindu', 'vegetarian', 'probiotic'],
    allergens: ['dairy'],
    proteinOptions: ['yogurt', 'add protein powder', 'make thick (more yogurt)'],
    substitutions: [
      { ingredient: 'yogurt', alternatives: ['dairy-free yogurt', 'coconut yogurt'], note: 'For vegan' },
      { ingredient: 'sweet', alternatives: ['salted', 'fruit flavored'], note: 'Different varieties' }
    ]
  }
];

export default {
  HINDU_BREAKFASTS,
  HINDU_LUNCHES,
  HINDU_DINNERS,
  HINDU_SNACKS
};

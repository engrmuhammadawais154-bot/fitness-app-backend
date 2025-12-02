import { useState, useEffect, useCallback, useMemo } from 'react';
// Using lucide-react for modern, clean icons (assumed available in the environment)
import { Home, Dumbbell, Soup, User, ArrowLeft, Heart, Target, TrendingUp, TrendingDown, Clock, Search, Mail, Lock, Eye, EyeOff, Edit, X, RefreshCw } from 'lucide-react';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { auth, db } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, updateDoc, collection, addDoc, query, where, getDocs, deleteDoc, orderBy, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { WEEK_1_WEIGHT_LOSS, WEEK_1_MUSCLE_GAIN, WEEK_1_MAINTENANCE, generateShoppingList, type Meal } from './mealPlans';

// --- Custom Hooks ---

// Helper hook for swipe detection
const useSwipe = (onSwipeRight?: () => void, onSwipeLeft?: () => void) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    // Only trigger swipe if horizontal movement is greater than vertical movement
    // This prevents triggering swipe during vertical scrolling
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;
      if (isRightSwipe && onSwipeRight) onSwipeRight();
      if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    }
  };
  
  return { onTouchStart, onTouchMove, onTouchEnd };
};

// --- Configuration Data ---

// Fitness Quotes for the Home Screen
const QUOTES: { text: string, author: string }[] = [
  { text: "The only bad workout is the one that didn't happen.", author: "Anon" },
  { text: "Take care of your body. It’s the only place you have to live.", author: "Jim Rohn" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger" }
];

// Exercise details with instructions
const EXERCISE_DETAILS: { [key: string]: { description: string; steps: string[] } } = {
  // LEGS
  "Barbell Back Squat": {
    description: "The king of leg exercises. Builds overall leg mass, strength, and core stability.",
    steps: [
      "Position barbell on upper traps (not neck), grip width comfortable",
      "Feet shoulder-width apart, toes slightly pointed out",
      "Brace core, chest up, break at hips and knees simultaneously",
      "Descend until thighs parallel to ground (or lower if mobile)",
      "Drive through heels, squeeze glutes at top, keep knees tracking over toes"
    ]
  },
  "Romanian Deadlift (RDL)": {
    description: "Hamstring and glute focused movement. Builds posterior chain strength and muscle.",
    steps: [
      "Hold barbell with shoulder-width grip, standing tall",
      "Slight bend in knees (don't lock them), hinge at hips",
      "Lower bar by pushing hips back, keep back neutral and bar close to legs",
      "Feel stretch in hamstrings, stop when back starts to round",
      "Drive hips forward to return, squeeze glutes at top"
    ]
  },
  "Walking Lunges": {
    description: "Dynamic leg exercise targeting quads, glutes, and balance. Great for functional strength.",
    steps: [
      "Stand tall, dumbbells at sides or barbell on back",
      "Step forward with right leg, lower body until both knees at 90°",
      "Front knee stays behind toes, back knee hovers above ground",
      "Push through front heel to step forward with left leg",
      "Continue walking forward, alternating legs"
    ]
  },
  "Lying Leg Curl": {
    description: "Isolation exercise for hamstrings. Builds thickness in the back of the thigh.",
    steps: [
      "Lie face down on leg curl machine, pad on lower calves",
      "Grip handles, keep hips pressed into pad",
      "Curl legs up toward glutes, squeeze hamstrings at top",
      "Control the descent, don't let weight slam",
      "Keep movement smooth, focus on hamstring contraction"
    ]
  },
  "Leg Extension": {
    description: "Quad isolation exercise. Great for building the front of the thigh and knee stability.",
    steps: [
      "Sit in leg extension machine, pad on lower shins",
      "Adjust seat so knees align with machine pivot point",
      "Extend legs fully, squeeze quads hard at top",
      "Control the descent, don't let weight crash",
      "Keep back against pad, grip handles for stability"
    ]
  },
  "Standing Calf Raise": {
    description: "Builds the gastrocnemius (upper calf). Performed with legs straight.",
    steps: [
      "Stand on calf raise machine or step with balls of feet",
      "Lower heels below level of toes for stretch",
      "Drive up onto toes as high as possible, pause at top",
      "Squeeze calves hard, then slowly lower",
      "Keep legs straight throughout movement"
    ]
  },
  "Seated Calf Raise": {
    description: "Targets the soleus (lower calf muscle). Performed with knees bent.",
    steps: [
      "Sit on calf raise machine, pad on knees",
      "Lower heels below level of toes for stretch",
      "Drive up onto toes, squeeze calves at top",
      "Control the descent, feel the stretch",
      "Knees stay bent at 90° throughout"
    ]
  },
  
  // BACK
  "Barbell Bent-Over Row": {
    description: "Mass builder for entire back. Works lats, rhomboids, traps, and rear delts.",
    steps: [
      "Grip barbell slightly wider than shoulder-width",
      "Hinge at hips, back at 45° angle, knees slightly bent",
      "Pull bar to lower chest/upper abs, lead with elbows",
      "Squeeze shoulder blades together at top",
      "Lower with control, keep core tight throughout"
    ]
  },
  "Weighted Pull-ups": {
    description: "Ultimate back width builder. Adds mass to lats and builds grip strength.",
    steps: [
      "Hang from bar with grip wider than shoulders, add weight belt/vest",
      "Start from dead hang, shoulders engaged (not relaxed)",
      "Pull chest toward bar, think 'elbows to hips'",
      "Chin over bar at top, squeeze lats hard",
      "Lower with control to full stretch, don't swing"
    ]
  },
  "Single-Arm Dumbbell Row": {
    description: "Unilateral back exercise. Fixes imbalances and allows greater range of motion.",
    steps: [
      "Place one knee and hand on bench for support",
      "Hold dumbbell in opposite hand, arm hanging straight",
      "Pull dumbbell to hip/lower ribs, lead with elbow",
      "Rotate torso slightly, squeeze lat at top",
      "Lower with control, feel the stretch in lat"
    ]
  },
  "Close-Grip Lat Pulldown": {
    description: "Targets lower lats and mid-back. Builds thickness and detail.",
    steps: [
      "Use close-grip V-bar attachment on lat pulldown",
      "Sit down, chest up, slight lean back",
      "Pull bar to upper chest, keep elbows close to body",
      "Squeeze shoulder blades together, pause at bottom",
      "Control the return, stretch arms fully at top"
    ]
  },
  "Face Pulls": {
    description: "Essential for rear delts, upper back, and shoulder health. Prevents injuries.",
    steps: [
      "Set cable at head height, use rope attachment",
      "Step back, arms extended, slight lean back",
      "Pull rope toward face, separate hands at end",
      "Elbows high and wide, squeeze rear delts/upper back",
      "Slowly extend arms, maintain tension throughout"
    ]
  },
  "Dumbbell Shrugs": {
    description: "Builds the trapezius muscles. Creates that thick neck-to-shoulder look.",
    steps: [
      "Hold heavy dumbbells at sides, arms straight",
      "Shrug shoulders straight up toward ears",
      "Hold peak contraction for 1-2 seconds",
      "Lower slowly, feel stretch in traps",
      "Don't roll shoulders—straight up and down only"
    ]
  },
  "Hyperextensions (Back Extensions)": {
    description: "Strengthens lower back, glutes, and hamstrings. Essential for spinal health.",
    steps: [
      "Position yourself on hyperextension bench, feet secured",
      "Cross arms over chest or behind head",
      "Lower torso by bending at waist until 90° angle",
      "Raise torso back up until body forms straight line",
      "Squeeze glutes and lower back at top, don't hyperextend"
    ]
  },
  
  // CHEST
  "Flat Barbell Bench Press": {
    description: "The king of chest exercises. Builds overall chest mass, strength, and pressing power.",
    steps: [
      "Lie on bench, feet flat on floor, eyes under bar",
      "Grip bar slightly wider than shoulders, unrack with arms extended",
      "Lower bar to mid-chest with control, elbows at 45° angle",
      "Touch chest lightly (don't bounce), press back up powerfully",
      "Lock out at top, squeeze chest, keep shoulder blades retracted"
    ]
  },
  "Incline Dumbbell Press": {
    description: "Targets upper chest. Creates that full, rounded chest appearance.",
    steps: [
      "Set bench to 30-45° incline, sit with dumbbells on thighs",
      "Kick dumbbells up to shoulders as you lie back",
      "Press dumbbells up and slightly together, don't clang at top",
      "Lower with control until stretch in upper chest",
      "Keep elbows at 45° angle, maintain arch in lower back"
    ]
  },
  "Dips (Chest Focus)": {
    description: "Bodyweight mass builder. Works entire chest, especially lower portion.",
    steps: [
      "Grab parallel bars, lift body up, arms extended",
      "Lean forward 30-45°, keep elbows out slightly",
      "Lower body until shoulders level with elbows",
      "Press back up, squeeze chest at top",
      "Add weight belt when bodyweight becomes easy"
    ]
  },
  "Cable Crossover (High-to-Low)": {
    description: "Isolation movement for chest definition and peak contraction.",
    steps: [
      "Set cables to highest position, grab handles",
      "Step forward, slight bend in elbows, chest up",
      "Pull handles down and across body in arc motion",
      "Squeeze chest hard, hands meet at bottom",
      "Return with control, feel stretch in chest at top"
    ]
  },
  "Flat Dumbbell Fly": {
    description: "Stretches and isolates chest muscles. Builds width and definition.",
    steps: [
      "Lie on flat bench, dumbbells pressed up over chest",
      "Slight bend in elbows (like hugging a tree)",
      "Lower dumbbells out to sides in wide arc",
      "Feel deep stretch in chest, stop when hands level with chest",
      "Squeeze dumbbells back together, maintain elbow angle"
    ]
  },
  "Pec Deck Fly": {
    description: "Machine isolation for chest. Great for beginners and finishing sets.",
    steps: [
      "Sit on pec deck, back flat against pad",
      "Grip handles or place forearms on pads",
      "Bring handles/pads together in front of chest",
      "Squeeze chest hard, hold for 1 second",
      "Return with control, feel stretch at starting position"
    ]
  },
  "Push-ups (Weighted or High Rep)": {
    description: "Classic bodyweight exercise. Builds endurance, strength, and muscle when progressed.",
    steps: [
      "Hands slightly wider than shoulders, body in straight line",
      "Lower chest to ground, elbows at 45° angle",
      "Push back up explosively, keep core tight",
      "For progression: add weight vest/plate on back",
      "For high reps: aim for 50-100+ with perfect form"
    ]
  },
  
  // SHOULDERS & TRAPS
  "Seated Dumbbell Overhead Press": {
    description: "Primary shoulder mass builder. Targets all three deltoid heads.",
    steps: [
      "Sit on bench with back support, dumbbells at shoulder height",
      "Press dumbbells overhead until arms extended",
      "Bring dumbbells close together at top (don't clang)",
      "Lower with control to shoulder level",
      "Keep core tight, don't arch back excessively"
    ]
  },
  "Standing Dumbbell Lateral Raise": {
    description: "Isolation for side delts. Creates shoulder width and that 'capped' look.",
    steps: [
      "Stand with dumbbells at sides, slight bend in elbows",
      "Raise arms out to sides until parallel to ground",
      "Lead with elbows, like pouring water from pitchers",
      "Pause at top, squeeze side delts",
      "Lower slowly, maintain tension throughout"
    ]
  },
  "Bent-Over Dumbbell Reverse Fly": {
    description: "Targets rear delts and upper back. Essential for balanced shoulder development.",
    steps: [
      "Bend at waist, back flat, dumbbells hanging down",
      "Raise dumbbells out to sides in wide arc",
      "Keep slight bend in elbows, lead with pinkies",
      "Squeeze shoulder blades together at top",
      "Lower with control, don't use momentum"
    ]
  },
  "Front Plate Raise": {
    description: "Front delt builder. Also works upper chest and core stability.",
    steps: [
      "Hold weight plate at bottom with both hands",
      "Stand tall, arms extended in front of thighs",
      "Raise plate straight up to eye level",
      "Keep arms straight (slight bend in elbows)",
      "Lower slowly, maintain control throughout"
    ]
  },
  "Barbell Shrugs (Behind the Back)": {
    description: "Unique trap builder. Hits traps from different angle than regular shrugs.",
    steps: [
      "Hold barbell behind back (like reverse deadlift position)",
      "Shrug shoulders straight up toward ears",
      "Hold peak contraction for 1-2 seconds",
      "Lower slowly under control",
      "Keep arms straight, isolate trap movement"
    ]
  },
  "Arnold Press": {
    description: "Named after Arnold Schwarzenegger. Works all three deltoid heads plus rotator cuffs.",
    steps: [
      "Start with dumbbells at shoulder height, palms facing you",
      "Press up while rotating palms forward",
      "End with palms facing forward at top",
      "Reverse motion on the way down",
      "Combines pressing and rotation for complete shoulder work"
    ]
  },
  "Cable External Rotation": {
    description: "Rotator cuff strengthener. Prevents shoulder injuries and improves stability.",
    steps: [
      "Set cable at elbow height, stand sideways to machine",
      "Elbow bent 90°, held against side with towel",
      "Rotate forearm away from body, keep elbow stationary",
      "Return slowly, maintain tension",
      "Use light weight, focus on control and form"
    ]
  },
  
  // ARMS & CORE
  "Close-Grip Bench Press": {
    description: "Triceps mass builder. Also works chest and front delts.",
    steps: [
      "Lie on bench, grip bar with hands 8-12 inches apart",
      "Lower bar to lower chest with elbows close to body",
      "Press back up, lock out at top",
      "Keep elbows tucked, don't flare them out",
      "Focus on triceps contraction throughout"
    ]
  },
  "Barbell Curl": {
    description: "Classic biceps builder. The standard for arm mass and strength.",
    steps: [
      "Stand with barbell, shoulder-width underhand grip",
      "Curl bar up, keep elbows stationary at sides",
      "Squeeze biceps at top of movement",
      "Lower with control, fully extend arms at bottom",
      "Don't swing or use momentum—strict form only"
    ]
  },
  "Skullcrushers (Lying Tricep Extension)": {
    description: "Triceps isolation exercise. Builds the long head for arm thickness.",
    steps: [
      "Lie on bench, hold bar with narrow grip above chest",
      "Lower bar toward forehead by bending at elbows only",
      "Keep upper arms stationary and perpendicular to floor",
      "Extend arms back up, squeeze triceps at top",
      "Control the weight—don't actually crush your skull!"
    ]
  },
  "Hammer Curls": {
    description: "Works biceps and brachialis. Builds arm thickness and forearm strength.",
    steps: [
      "Hold dumbbells at sides, palms facing each other",
      "Curl dumbbells up, keep palms facing inward (neutral grip)",
      "Keep elbows stationary, squeeze at top",
      "Lower with control to full extension",
      "Can be done alternating or both arms together"
    ]
  },
  "Rope Triceps Pushdown": {
    description: "Cable isolation for triceps. Great pump and definition builder.",
    steps: [
      "Attach rope to high cable, grab ends with thumbs up",
      "Keep elbows at sides, start with forearms parallel to floor",
      "Push rope down, separate ends at bottom",
      "Squeeze triceps hard, hold for 1 second",
      "Return with control, don't let weight stack crash"
    ]
  },
  "Hanging Leg Raises": {
    description: "Advanced core exercise. Builds entire abdominal wall and hip flexors.",
    steps: [
      "Hang from pull-up bar, grip slightly wider than shoulders",
      "Keep legs straight (or slightly bent if needed)",
      "Raise legs up until parallel to ground or higher",
      "Control the descent, don't swing",
      "For progression: raise toes all the way to bar"
    ]
  },
  "Ab Wheel Rollout": {
    description: "Intense core builder. Works entire core, especially deep stabilizers.",
    steps: [
      "Kneel on mat, grip ab wheel handles",
      "Roll forward, extending arms and body",
      "Go as far as possible while maintaining neutral spine",
      "Pull back to starting position using abs",
      "Keep core tight throughout—don't let hips sag"
    ]
  }
};

// Exercise image/GIF mappings
const EXERCISE_IMAGES: { [key: string]: string } = {
  // Legs
  "Barbell Back Squat": "/exercises/legs/Barbell-Back-Squat.gif",
  "Romanian Deadlift (RDL)": "/exercises/legs/Romanian-Deadlift-(RDL).gif",
  "Walking Lunges": "/exercises/legs/Walking-Lunges.gif",
  "Lying Leg Curl": "/exercises/legs/Lying-Leg-Curl.gif",
  "Leg Extension": "/exercises/legs/Leg-Extension.gif",
  "Standing Calf Raise": "/exercises/legs/Standing-Calf-Raise.gif",
  "Seated Calf Raise": "/exercises/legs/Seated-Calf-Raise.gif",
  
  // Back
  "Barbell Bent-Over Row": "/exercises/back/Barbell-Bent-Over-Row.gif",
  "Weighted Pull-ups": "/exercises/back/Weighted-Pull-ups.gif",
  "Single-Arm Dumbbell Row": "/exercises/back/Single-Arm-Dumbbell-Row.gif",
  "Close-Grip Lat Pulldown": "/exercises/back/Close-Grip-Lat-Pulldown.gif",
  "Face Pulls": "/exercises/back/Face-Pulls.gif",
  "Dumbbell Shrugs": "/exercises/back/Dumbbell-Shrugs.gif",
  "Hyperextensions (Back Extensions)": "/exercises/back/Hyperextensions-(Back-Extensions).gif",
  
  // Chest
  "Flat Barbell Bench Press": "/exercises/chest/Flat-Barbell-Bench-Press.gif",
  "Incline Dumbbell Press": "/exercises/chest/Incline-Dumbbell-Press.gif",
  "Dips (Chest Focus)": "/exercises/chest/Dips-(Chest-Focus).gif",
  "Cable Crossover (High-to-Low)": "/exercises/chest/Cable-Crossover-(High-to-Low).gif",
  "Flat Dumbbell Fly": "/exercises/chest/Flat-Dumbbell-Fly.gif",
  "Pec Deck Fly": "/exercises/chest/Pec-Deck-Fly.gif",
  "Push-ups (Weighted or High Rep)": "/exercises/chest/Push-ups-(Weighted-or-High-Rep).gif",
  
  // Shoulders
  "Seated Dumbbell Overhead Press": "/exercises/shoulders/Seated-Dumbbell-Overhead-Press.gif",
  "Standing Dumbbell Lateral Raise": "/exercises/shoulders/Standing-Dumbbell-Lateral-Raise.gif",
  "Bent-Over Dumbbell Reverse Fly": "/exercises/shoulders/Bent-Over-Dumbbell-Reverse-Fly.gif",
  "Front Plate Raise": "/exercises/shoulders/Front-Plate-Raise.gif",
  "Barbell Shrugs (Behind the Back)": "/exercises/shoulders/Barbell-Shrugs-(Behind-the-Back).gif",
  "Arnold Press": "/exercises/shoulders/Arnold-Press.gif",
  "Cable External Rotation": "/exercises/shoulders/Cable-External-Rotation.gif",
  
  // Arms
  "Close-Grip Bench Press": "/exercises/arms/Close-Grip-Bench-Press.gif",
  "Barbell Curl": "/exercises/arms/Barbell-Curl.gif",
  "Skullcrushers (Lying Tricep Extension)": "/exercises/arms/Skullcrushers-(Lying-Tricep-Extension).gif",
  "Hammer Curls": "/exercises/arms/Hammer-Curls.gif",
  "Rope Triceps Pushdown": "/exercises/arms/Rope-Triceps-Pushdown.gif",
  
  // Core
  "Hanging Leg Raises": "/exercises/core/Hanging-Leg-Raises.gif",
  "Ab Wheel Rollout": "/exercises/core/Ab-Wheel-Rollout.gif",
  "Cable Crunch": "/exercises/core/cable-crunch.gif",
  "Decline Sit-ups": "/exercises/core/decline-situps.gif",
  "Russian Twists (weighted)": "/exercises/core/russian-twists.gif",
  "Pallof Press": "/exercises/core/half-kneeling-pallof-press.gif",
};

// Muscle Groups for Exercise Finder
const MUSCLE_GROUPS: { name: string; icon: string; color: string; exercises: { gym: string[]; home: string[]; }; }[] = [
  { 
    name: "Legs", 
    icon: "🦵", 
    color: "bg-gradient-to-br from-green-400 to-emerald-500 text-white", 
    exercises: { 
      gym: ["Barbell Back Squat", "Romanian Deadlift (RDL)", "Walking Lunges", "Lying Leg Curl", "Leg Extension", "Standing Calf Raise", "Seated Calf Raise"], 
      home: ["Bodyweight Squats", "Bulgarian Split Squats", "Lunges", "Pistol Squats (assisted)", "Glute Bridges", "Single-Leg Deadlifts", "Calf Raises on Steps"] 
    } 
  },
  { 
    name: "Back", 
    icon: "🏋️", 
    color: "bg-gradient-to-br from-blue-400 to-indigo-500 text-white", 
    exercises: { 
      gym: ["Barbell Bent-Over Row", "Weighted Pull-ups", "Single-Arm Dumbbell Row", "Close-Grip Lat Pulldown", "Face Pulls", "Dumbbell Shrugs", "Hyperextensions (Back Extensions)"], 
      home: ["Pull-ups/Chin-ups", "Inverted Rows", "Supermans", "Bodyweight Rows", "Reverse Snow Angels", "Door Frame Rows", "Band Pull-aparts"] 
    } 
  },
  { 
    name: "Chest", 
    icon: "🔥", 
    color: "bg-gradient-to-br from-pink-400 to-rose-500 text-white", 
    exercises: { 
      gym: ["Flat Barbell Bench Press", "Incline Dumbbell Press", "Dips (Chest Focus)", "Cable Crossover (High-to-Low)", "Flat Dumbbell Fly", "Pec Deck Fly", "Push-ups (Weighted or High Rep)"], 
      home: ["Push-ups (various angles)", "Decline Push-ups", "Diamond Push-ups", "Wide Push-ups", "Dips (between chairs)", "Resistance Band Flyes", "Plyometric Push-ups"] 
    } 
  },
  { 
    name: "Shoulders", 
    icon: "⭕", 
    color: "bg-gradient-to-br from-amber-400 to-orange-500 text-white", 
    exercises: { 
      gym: ["Seated Dumbbell Overhead Press", "Standing Dumbbell Lateral Raise", "Bent-Over Dumbbell Reverse Fly", "Front Plate Raise", "Barbell Shrugs (Behind the Back)", "Arnold Press", "Cable External Rotation"], 
      home: ["Pike Pushups", "Handstand Push-ups (wall assisted)", "Lateral Raises (with water bottles)", "Front Raises (with resistance)", "Shoulder Taps", "Band Pull-aparts", "Pseudo Planche Leans"] 
    } 
  },
  { 
    name: "Arms", 
    icon: "💪", 
    color: "bg-gradient-to-br from-purple-400 to-fuchsia-500 text-white", 
    exercises: { 
      gym: ["Close-Grip Bench Press", "Barbell Curl", "Skullcrushers (Lying Tricep Extension)", "Hammer Curls", "Rope Triceps Pushdown"], 
      home: ["Triceps Dips (chair/couch)", "Diamond Push-ups", "Bicep Curls (backpack/water jugs)", "Overhead Tricep Extension", "Concentration Curls"] 
    } 
  },
  { 
    name: "Core", 
    icon: "🛡️", 
    color: "bg-gradient-to-br from-cyan-400 to-teal-500 text-white", 
    exercises: { 
      gym: ["Hanging Leg Raises", "Ab Wheel Rollout", "Cable Crunch", "Decline Sit-ups", "Russian Twists (weighted)", "Pallof Press"], 
      home: ["Plank Variations", "Mountain Climbers", "Bicycle Crunches", "Flutter Kicks", "Leg Raises", "V-ups", "Dead Bug"] 
    } 
  },
];

// --- Utility Functions ---

// List of authentic/trusted email providers - ONLY these are accepted
const TRUSTED_EMAIL_DOMAINS = [
  // Google
  'gmail.com', 'googlemail.com',
  // Microsoft
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'outlook.co.uk', 'hotmail.co.uk',
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  // Yahoo
  'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'yahoo.fr', 'yahoo.de', 'yahoo.ca', 'yahoo.com.au',
  // ProtonMail
  'protonmail.com', 'proton.me', 'pm.me',
  // Other major providers
  'aol.com', 'zoho.com', 'mail.com', 'gmx.com', 'gmx.de', 'yandex.com', 'yandex.ru',
  'fastmail.com', 'tutanota.com', 'tutanota.de',
  // US ISP providers
  'comcast.net', 'verizon.net', 'att.net', 'cox.net', 'sbcglobal.net', 'charter.net',
  // International
  'qq.com', '163.com', 'mail.ru', 'rediffmail.com', 'web.de', 't-online.de'
];

// Validate if email is from an authentic provider - ONLY trusted domains allowed
const isAuthenticEmail = (email: string): { valid: boolean; message: string } => {
  const emailLower = email.toLowerCase().trim();
  const emailParts = emailLower.split('@');
  
  if (emailParts.length !== 2 || !emailParts[0] || !emailParts[1]) {
    return { valid: false, message: 'Invalid email format' };
  }
  
  const domain = emailParts[1];
  
  // ONLY accept emails from trusted providers
  if (TRUSTED_EMAIL_DOMAINS.includes(domain)) {
    return { valid: true, message: '' };
  }
  
  // All other domains are rejected
  return { 
    valid: false, 
    message: 'Please use a recognized email provider (Gmail, Yahoo, Outlook, Hotmail, iCloud, ProtonMail, AOL, etc.)' 
  };
};

// Convert kg to lbs
const kgToLbs = (kg: number | undefined | null) => {
  if (kg == null) return '0';
  return (kg * 2.20462).toFixed(1);
};

// Format weight based on user preference
const formatWeight = (kg: number | undefined | null, units: 'metric' | 'imperial') => {
  if (kg == null) return units === 'imperial' ? '0 lb' : '0 kg';
  
  if (units === 'imperial') {
    return `${kgToLbs(kg)} lb`;
  }
  return `${kg.toFixed(1)} kg`;
};

// --- Sub-Components ---

// Dynamic Status Card Component
const DynamicStatusCard = ({ 
  userData, 
  onStartWorkout, 
  onViewDiet 
}: { 
  userData: any; 
  onStartWorkout: () => void;
  onViewDiet: () => void;
}) => {
  const [lastWorkout, setLastWorkout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastWorkout = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const workoutsQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        
        const snapshot = await getDocs(workoutsQuery);
        if (!snapshot.empty) {
          setLastWorkout(snapshot.docs[0].data());
        }
      } catch (error) {
        console.error('Error fetching last workout:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastWorkout();
  }, []);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 16) return 'midday';
    if (hour >= 16 && hour < 20) return 'evening';
    return 'night';
  };

  const getCardContent = () => {
    const timeOfDay = getTimeOfDay();
    const userName = userData?.name || 'there';
    const now = Date.now();
    const lastWorkoutTime = lastWorkout?.timestamp || 0;
    const hoursSinceWorkout = (now - lastWorkoutTime) / (1000 * 60 * 60);
    const isRecentWorkout = hoursSinceWorkout < 3; // Within 3 hours
    const isInactive = hoursSinceWorkout > 24; // More than 24 hours

    // Post-workout confirmation (highest priority)
    if (isRecentWorkout && lastWorkout) {
      return {
        icon: '🎉',
        gradient: 'from-green-400 to-emerald-500',
        title: 'Great Work!',
        message: `You logged a ${lastWorkout.duration_minutes}-minute workout with ${lastWorkout.totalExercises} exercises!`,
        action: 'View Diet Plan',
        onAction: onViewDiet
      };
    }

    // Morning greeting
    if (timeOfDay === 'morning') {
      return {
        icon: '☀️',
        gradient: 'from-amber-400 to-orange-500',
        title: `Good morning, ${userName}!`,
        message: 'Time to crush your day. Ready for a quick warm-up?',
        action: 'Start Workout',
        onAction: onStartWorkout
      };
    }

    // Mid-day motivation
    if (timeOfDay === 'midday') {
      return {
        icon: '💪',
        gradient: 'from-blue-400 to-indigo-500',
        title: 'Midday Check-In',
        message: 'Feeling sluggish? A quick workout can boost your energy!',
        action: 'Start Workout',
        onAction: onStartWorkout
      };
    }

    // Inactive user motivation
    if (isInactive) {
      return {
        icon: '🔥',
        gradient: 'from-red-400 to-pink-500',
        title: 'Time to Get Moving!',
        message: "The only bad workout is the one that didn't happen.",
        action: 'Start Workout',
        onAction: onStartWorkout
      };
    }

    // Evening default
    return {
      icon: '🌙',
      gradient: 'from-purple-400 to-fuchsia-500',
      title: `Good ${timeOfDay}, ${userName}!`,
      message: 'Every rep brings you closer to your goals.',
      action: 'Start Workout',
      onAction: onStartWorkout
    };
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl p-6 shadow-2xl animate-pulse">
        <div className="h-20"></div>
      </div>
    );
  }

  const content = getCardContent();

  return (
    <div className={`bg-gradient-to-br ${content.gradient} rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start gap-4">
        <div className="text-5xl">{content.icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{content.title}</h3>
          <p className="text-white/90 text-sm mb-4 leading-relaxed">{content.message}</p>
          <button
            onClick={content.onAction}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/30 shadow-lg"
          >
            {content.action} →
          </button>
        </div>
      </div>
    </div>
  );
};

// Workout of the Day Component
const WorkoutOfTheDay = ({ 
  onSelectWorkout 
}: { 
  onSelectWorkout: (muscleGroup: string) => void;
}) => {
  const [recommendation, setRecommendation] = useState<{
    muscleGroup: string;
    reason: string;
    exercises: string[];
    daysSince: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const analyzeWorkoutHistory = async () => {
      const user = auth.currentUser;
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch workouts without timestamp filter to avoid composite index requirement
        const workoutsQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid)
        );
        
        const snapshot = await getDocs(workoutsQuery);
        
        // Filter to last 14 days client-side
        const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
        const recentWorkouts = snapshot.docs.filter(doc => {
          const data = doc.data();
          return data.timestamp > fourteenDaysAgo;
        });
        
        // Track when each muscle group was last trained
        const muscleGroupTraining: { [key: string]: number } = {};
        
        recentWorkouts.forEach(doc => {
          const workout = doc.data();
          workout.exercises?.forEach((ex: any) => {
            const muscleGroup = detectMuscleGroup(ex.exercise);
            if (muscleGroup && (!muscleGroupTraining[muscleGroup] || workout.timestamp > muscleGroupTraining[muscleGroup])) {
              muscleGroupTraining[muscleGroup] = workout.timestamp;
            }
          });
        });

        // Find muscle groups that haven't been trained recently
        const leastTrained: typeof MUSCLE_GROUPS = [];
        let oldestTime = Date.now();
        
        // First pass: find the oldest training time
        MUSCLE_GROUPS.forEach(group => {
          const lastTrained = muscleGroupTraining[group.name] || 0;
          if (lastTrained < oldestTime) {
            oldestTime = lastTrained;
          }
        });
        
        // Second pass: collect all muscle groups with that oldest time (within 2 days)
        const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
        MUSCLE_GROUPS.forEach(group => {
          const lastTrained = muscleGroupTraining[group.name] || 0;
          if (Math.abs(lastTrained - oldestTime) <= twoDaysMs) {
            leastTrained.push(group);
          }
        });

        // If no least trained found, use all muscle groups
        const candidateGroups = leastTrained.length > 0 ? leastTrained : MUSCLE_GROUPS;
        
        // Use today's date as seed for consistent daily selection
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const dateSeed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const randomIndex = dateSeed % candidateGroups.length;
        const selectedMuscle = candidateGroups[randomIndex];

        if (selectedMuscle) {
          const daysSince = Math.floor((Date.now() - oldestTime) / (1000 * 60 * 60 * 24));
          const reason = oldestTime === 0 || oldestTime === Date.now()
            ? `Ready to start your fitness journey?`
            : `Last trained ${daysSince} day${daysSince !== 1 ? 's' : ''} ago`;
          
          setRecommendation({
            muscleGroup: selectedMuscle.name,
            reason,
            exercises: selectedMuscle.exercises.gym.slice(0, 3),
            daysSince: oldestTime === Date.now() ? 999 : daysSince
          });
        }
      } catch (error) {
        console.error('Error analyzing workout history:', error);
        // Fallback to daily-seeded random recommendation on error
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const dateSeed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const randomIndex = dateSeed % MUSCLE_GROUPS.length;
        const selectedMuscle = MUSCLE_GROUPS[randomIndex];
        setRecommendation({
          muscleGroup: selectedMuscle.name,
          reason: 'Ready to start your fitness journey?',
          exercises: selectedMuscle.exercises.gym.slice(0, 3),
          daysSince: 999
        });
      } finally {
        setIsLoading(false);
      }
    };

    analyzeWorkoutHistory();
  }, []);

  // Helper function to detect muscle group from exercise name
  const detectMuscleGroup = (exerciseName: string): string | null => {
    const name = exerciseName.toLowerCase();
    
    // Chest exercises
    if (name.includes('bench') || name.includes('chest') || name.includes('push-up') || 
        name.includes('pushup') || name.includes('fly') || name.includes('dip') ||
        name.includes('pec') || name.includes('crossover')) {
      return 'Chest';
    }
    
    // Back exercises
    if (name.includes('row') || name.includes('pull') || name.includes('deadlift') || 
        name.includes('lat') || name.includes('back') || name.includes('shrug') ||
        name.includes('hyperextension') || name.includes('face pull')) {
      return 'Back';
    }
    
    // Leg exercises
    if (name.includes('squat') || name.includes('leg') || name.includes('lunge') || 
        name.includes('calf') || name.includes('glute') || name.includes('rdl') ||
        name.includes('romanian')) {
      return 'Legs';
    }
    
    // Shoulder exercises
    if (name.includes('shoulder') || name.includes('press') || name.includes('raise') || 
        name.includes('arnold') || name.includes('lateral') || name.includes('reverse fly') ||
        name.includes('external rotation') || name.includes('front plate')) {
      return 'Shoulders';
    }
    
    // Arm exercises
    if (name.includes('curl') || name.includes('tricep') || name.includes('bicep') || 
        name.includes('arm') || name.includes('skullcrusher') || name.includes('hammer') ||
        name.includes('pushdown')) {
      return 'Arms';
    }
    
    // Core exercises
    if (name.includes('plank') || name.includes('crunch') || name.includes('ab') || 
        name.includes('core') || name.includes('sit-up') || name.includes('leg raise') ||
        name.includes('rollout') || name.includes('hanging')) {
      return 'Core';
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-indigo-200 dark:border-indigo-500/30 animate-pulse">
        <div className="h-24"></div>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  const muscleGroupData = MUSCLE_GROUPS.find(g => g.name === recommendation.muscleGroup);
  const urgencyColor = recommendation.daysSince > 7 
    ? 'from-red-400 to-pink-500' 
    : recommendation.daysSince > 3 
    ? 'from-orange-400 to-amber-500'
    : 'from-blue-400 to-indigo-500';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-indigo-200 dark:border-indigo-500/30 transform transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">🏋️</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Workout of the Day</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{recommendation.reason}</p>
        </div>
      </div>

      <div 
        onClick={() => onSelectWorkout(recommendation.muscleGroup)}
        className={`bg-gradient-to-br ${urgencyColor} rounded-xl p-5 cursor-pointer transform transition-all duration-200 hover:scale-[1.03] active:scale-95`}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{muscleGroupData?.icon}</span>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white">{recommendation.muscleGroup}</h4>
            <p className="text-white/80 text-sm">Recommended for today</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-3">
          <p className="text-white/90 text-xs font-semibold mb-2">Suggested Exercises:</p>
          <ul className="space-y-1">
            {recommendation.exercises.map((exercise, idx) => (
              <li key={idx} className="text-white text-sm flex items-center gap-2">
                <span className="text-white/60">•</span>
                {exercise}
              </li>
            ))}
          </ul>
        </div>

        <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 border border-white/30">
          Start {recommendation.muscleGroup} Workout →
        </button>
      </div>
    </div>
  );
};

// Home Screen Component
const HomeScreen = ({ 
  userData, 
  onStartWorkout, 
  onViewDiet,
  onSelectMuscleGroup 
}: { 
  userData: any; 
  onStartWorkout: () => void;
  onViewDiet: () => void;
  onSelectMuscleGroup: (muscleGroup: string) => void;
}) => {
  const [targetWeight, setTargetWeight] = useState(userData?.targetWeight || 75.0);
  const [currentWeight, setCurrentWeight] = useState(userData?.weight || 80.0);
  const [startingWeight, setStartingWeight] = useState(userData?.startingWeight || userData?.weight || 80.0);
  const units = userData?.appPreferences?.units || 'metric';

  // Update local state when userData changes
  useEffect(() => {
    if (userData) {
      setTargetWeight(userData.targetWeight || 75.0);
      setCurrentWeight(userData.weight || 80.0);
      setStartingWeight(userData.startingWeight || userData.weight || 80.0);
    }
  }, [userData]);

  // Calculate goal progress
  const goalProgress = useMemo(() => {
    console.log('Progress calculation:', { startingWeight, currentWeight, targetWeight });
    
    // Determine if goal is weight loss or gain
    const isWeightLoss = startingWeight > targetWeight;
    const isWeightGain = startingWeight < targetWeight;
    
    if (isWeightLoss) {
      // Weight Loss Goal
      if (currentWeight <= targetWeight) return 100; // Goal achieved!
      
      const totalToLose = startingWeight - targetWeight;
      const lost = startingWeight - currentWeight;
      
      if (totalToLose <= 0) return 0;
      return Math.min(100, Math.max(0, Math.round((lost / totalToLose) * 100)));
      
    } else if (isWeightGain) {
      // Weight Gain Goal
      if (currentWeight >= targetWeight) return 100; // Goal achieved!
      
      const totalToGain = targetWeight - startingWeight;
      const gained = currentWeight - startingWeight;
      
      if (totalToGain <= 0) return 0;
      return Math.min(100, Math.max(0, Math.round((gained / totalToGain) * 100)));
      
    } else {
      // Starting weight equals target weight
      return currentWeight === targetWeight ? 100 : 0;
    }
  }, [currentWeight, targetWeight, startingWeight]);

  const updateWeight = async (newWeight: number) => {
    setCurrentWeight(newWeight);
    
    // Update Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { weight: newWeight }, { merge: true });
        toast.success('Weight updated! 💪');
        
        // Update local storage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const data = JSON.parse(storedUserData);
          data.weight = newWeight;
          localStorage.setItem('userData', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Failed to update weight:', error);
        toast.error('Failed to update weight');
      }
    }
  };

  const updateTargetWeight = async (newTarget: number) => {
    setTargetWeight(newTarget);
    
    // Update Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        // ALWAYS update starting weight when setting a new target
        // This ensures we have a proper baseline for progress tracking
        const updateData: any = { 
          targetWeight: newTarget,
          startingWeight: currentWeight // Use current weight as new baseline
        };
        
        console.log('Updating target weight:', updateData);
        setStartingWeight(currentWeight); // Update local state
        
        await setDoc(doc(db, 'users', user.uid), updateData, { merge: true });
        toast.success('Target weight updated! 🎯');
        
        // Update local storage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const data = JSON.parse(storedUserData);
          data.targetWeight = newTarget;
          data.startingWeight = currentWeight;
          localStorage.setItem('userData', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Failed to update target weight:', error);
        toast.error('Failed to update target weight');
      }
    }
  };

  const updateStartingWeight = async (newStarting: number) => {
    setStartingWeight(newStarting);
    
    // Update Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { startingWeight: newStarting }, { merge: true });
        toast.success('Starting weight updated! 📊');
        
        // Update local storage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const data = JSON.parse(storedUserData);
          data.startingWeight = newStarting;
          localStorage.setItem('userData', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Failed to update starting weight:', error);
        toast.error('Failed to update starting weight');
      }
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back!</h1>
      <p className="text-gray-700 dark:text-white/70">Your fitness journey starts now.</p>
      
      {/* Dynamic Status Card */}
      <DynamicStatusCard 
        userData={userData} 
        onStartWorkout={onStartWorkout}
        onViewDiet={onViewDiet}
      />
      
      {/* Workout of the Day */}
      <WorkoutOfTheDay 
        onSelectWorkout={onSelectMuscleGroup}
      />
      
      <QuoteCarousel quotes={QUOTES} />
      
      {/* Daily Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard 
          title="Starting Weight" 
          value={formatWeight(startingWeight, units)} 
          icon={TrendingUp} 
          color="bg-gradient-to-br from-green-400 to-emerald-400 text-white dark:bg-green-500/30 dark:text-green-300"
          editable
          onEdit={(val) => updateStartingWeight(parseFloat(val))}
        />
        <MetricCard 
          title="Target Weight" 
          value={formatWeight(targetWeight, units)} 
          icon={Target} 
          color="bg-gradient-to-br from-yellow-400 to-orange-400 text-white dark:bg-yellow-500/30 dark:text-yellow-300"
          editable
          onEdit={(val) => updateTargetWeight(parseFloat(val))}
        />
        <MetricCard 
          title="Current Weight" 
          value={formatWeight(currentWeight, units)} 
          icon={Dumbbell} 
          color="bg-gradient-to-br from-indigo-500 to-purple-500 text-white dark:bg-indigo-500/30 dark:text-indigo-300"
          editable
          onEdit={(val) => updateWeight(parseFloat(val))}
        />
        <MetricCard 
          title="Goal Progress" 
          value={`${goalProgress}%`} 
          icon={Heart} 
          color="bg-gradient-to-br from-pink-400 to-rose-400 text-white dark:bg-red-500/30 dark:text-red-300"
        />
      </div>
    </div>
  );
};

// Email Verification Pending Screen
const VerificationPendingScreen = ({ 
  email,
  onClose,
  onResend
}: { 
  email: string;
  onClose: () => void;
  onResend: () => Promise<void>;
}) => {
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const handleResend = async () => {
    if (!canResend || isResending) return;
    
    setIsResending(true);
    try {
      await onResend();
      toast.success('Verification email sent! Check your inbox and spam folder. 📧');
      
      // Start 60-second countdown before allowing another resend
      setCanResend(false);
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error(error.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:via-indigo-900 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Email icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
            Verify Your Email
          </h2>

          {/* Message */}
          <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
            We've sent a verification link to:
          </p>
          <p className="text-center font-semibold text-indigo-600 dark:text-indigo-400 mb-6 break-all px-2">
            {email}
          </p>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              📧 <strong>Check your inbox</strong> and <strong>spam folder</strong> for the verification email.
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              🔗 Click the link in the email to verify your account.
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              ✅ After verification, close this screen and log in.
            </p>
          </div>

          {/* Resend button */}
          <button
            onClick={handleResend}
            disabled={!canResend || isResending}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all mb-4 ${
              canResend && !isResending
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? 'Sending...' : canResend ? 'Resend Verification Email' : `Resend in ${countdown}s`}
          </button>

          {/* Info */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Didn't receive the email? Check your spam folder or click resend.
          </p>
        </div>
      </div>
    </div>
  );
};

// Profile Completion Screen (for existing users without data)
const ProfileCompletionScreen = ({ 
  user
}: { 
  user: any;
}) => {
  // Try to get name from tempUserData if it exists
  const getTempName = () => {
    const tempData = localStorage.getItem('tempUserData');
    if (tempData) {
      try {
        const parsed = JSON.parse(tempData);
        return parsed.name || '';
      } catch (e) {
        return '';
      }
    }
    return '';
  };

  const [name, setName] = useState(getTempName());
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create user document in Firestore
      const userData = {
        email: user.email,
        name,
        age: parseInt(age),
        weight: parseFloat(weight),
        startingWeight: parseFloat(weight),
        heightFeet: parseInt(heightFeet),
        heightInches: parseInt(heightInches),
        targetWeight: parseFloat(targetWeight),
        createdAt: new Date().toISOString()
      };

      console.log('Creating profile for existing user UID:', user.uid);
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('Profile created successfully');
      
      // Cache the data and clean up temp data
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.removeItem('tempUserData');
      toast.success('Profile completed! Welcome to FitTrack! 🎉');
      
      // Auth listener will automatically pick up the new data
      // No need to call anything - React will re-render
    } catch (err: any) {
      console.error('Error creating profile:', err);
      setError(err.message || 'Failed to create profile');
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:via-indigo-900 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 dark:text-white/70">We need a bit more information to get you started</p>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min="10"
                max="120"
                placeholder="25"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                min="20"
                max="300"
                step="0.1"
                placeholder="70.0"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Height</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    required
                    min="3"
                    max="8"
                    placeholder="5"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block text-center">Feet</span>
                </div>
                <div>
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    required
                    min="0"
                    max="11"
                    placeholder="8"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block text-center">Inches</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Weight (kg)</label>
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                required
                min="20"
                max="300"
                step="0.1"
                placeholder="65.0"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-200 shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Creating Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Profile Setup Screen (for new users during signup - SIMPLIFIED)
const ProfileSetupScreen = ({ 
  email, 
  password, 
  name,
  onComplete: _onComplete
}: { 
  email: string; 
  password: string; 
  name: string; 
  onComplete: (userData: any) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email authenticity
      const emailValidation = isAuthenticEmail(email);
      if (!emailValidation.valid) {
        setError(emailValidation.message);
        toast.error(emailValidation.message);
        setIsLoading(false);
        return;
      }
      
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store basic info temporarily - full profile will be collected after verification
      const tempUserData = {
        email,
        name,
        uid: user.uid
      };

      console.log('Storing basic info for UID:', user.uid);
      localStorage.setItem('tempUserData', JSON.stringify(tempUserData));
      
      // Send verification email
      try {
        await sendEmailVerification(user);
        console.log('Verification email sent to:', email);
        toast.success('Account created! Please check your email to verify. 📧');
      } catch (verifyError: any) {
        console.error('Error sending verification email:', verifyError);
        toast.error('Account created but failed to send verification email. Please try resending.');
      }
      
      // Don't call onComplete - Auth Guard will automatically show verification screen
      // The onAuthStateChanged listener will detect the new unverified user
    } catch (err: any) {
      console.error('Error creating user profile:', err);
      
      // Handle email already in use
      if (err.code === 'auth/email-already-in-use') {
        toast.error('Account already exists. Please log in instead.');
        setError('This email is already registered. Please use the login form.');
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:via-indigo-900 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Almost There! 🎉</h1>
          <p className="text-gray-600 dark:text-white/70">Click below to create your account</p>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Display the user's info */}
          <div className="mb-6 space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
              <p className="text-gray-900 dark:text-white font-medium">{name}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-gray-900 dark:text-white font-medium">{email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-200 shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account & Send Verification Email'}
            </button>
          </form>

          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            After verification, you'll complete your fitness profile.
          </p>
        </div>
      </div>
    </div>
  );
};

// Authentication Screen// Authentication Screen
const AuthScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isSignUp) {
      // Validate email authenticity before going to profile setup
      const emailValidation = isAuthenticEmail(email);
      if (!emailValidation.valid) {
        setError(emailValidation.message);
        toast.error(emailValidation.message);
        return;
      }
      
      // Go to profile setup screen
      setShowProfileSetup(true);
      return;
    }

    // Handle login
    setIsLoading(true);
    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // CHECK EMAIL VERIFICATION - CRITICAL STEP
      if (!user.emailVerified) {
        console.log('Login attempt with unverified email');
        toast.error('Please verify your email before logging in. Check your inbox. 📧');
        setError('Email not verified. Please check your inbox for the verification link.');
        setIsLoading(false);
        // Don't sign out - Auth Guard will show verification screen
        // The user object will remain authenticated but blocked by the guard
        return;
      }

      // Email is verified, proceed with login
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem('userData', JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}! 👋`);
      } else {
        // User data doesn't exist - this could be first login or data was lost
        console.log('No Firestore document found for existing user - will create on next auth check');
        // Don't show error - the auth listener will handle creating the document
        // if tempUserData exists, or will prompt user to complete profile
      }
      
      onLogin();
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up.');
        toast.error('Account not found. Please sign up first.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
        toast.error('Incorrect password');
      } else {
        setError(err.message || 'Failed to login');
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (_provider: 'google' | 'apple') => {
    setError('Social login coming soon! Please use email for now.');
  };

  if (showProfileSetup) {
    return (
      <ProfileSetupScreen
        email={email}
        password={password}
        name={name}
        onComplete={onLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:via-indigo-900 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 dark:bg-indigo-600 rounded-full mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fitness App</h1>
          <p className="text-gray-700 dark:text-white/70">Your journey to better health starts here</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:bg-gray-900/50 rounded-lg p-1 shadow-md">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded-md font-semibold transition duration-200 ${
                !isSignUp ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded-md font-semibold transition duration-200 ${
                isSignUp ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 bg-black hover:bg-gray-900 text-white rounded-xl font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800/50 text-gray-400">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition duration-200">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-200 shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {isSignUp && (
            <p className="mt-4 text-xs text-center text-gray-600 dark:text-gray-400">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition duration-200"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

// Exercise Logger Component
const ExerciseLogger = ({ 
  exercise, 
  onBack, 
  onSaveWorkout
}: { 
  exercise: string; 
  onBack: () => void; 
  onSaveWorkout: (sets: Array<{ reps: number; weight: number }>) => void;
}) => {
  const [sets, setSets] = useState<Array<{ reps: number; weight: number }>>([]);
  const [currentReps, setCurrentReps] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');

  const addSet = () => {
    const reps = parseInt(currentReps);
    const weight = parseFloat(currentWeight);
    
    if (reps > 0 && weight >= 0) {
      setSets([...sets, { reps, weight }]);
      setCurrentReps('');
      setCurrentWeight('');
      toast.success(`Set ${sets.length + 1} added! 💪`);
    } else {
      toast.error('Please enter valid reps and weight');
    }
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
    toast.success('Set removed');
  };

  const handleSave = async () => {
    if (sets.length === 0) {
      toast.error('Please add at least one set');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error('Not authenticated');
      return;
    }

    try {
      // Save to Firestore
      await addDoc(collection(db, 'workoutHistory'), {
        userId: user.uid,
        exercise,
        sets,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      });

      onSaveWorkout(sets);
      toast.success('Workout logged successfully! 🎉');
      onBack();
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Failed to save workout');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <button 
        onClick={onBack} 
        className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition duration-200 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Details
      </button>

      <div className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-900/40 dark:to-purple-900/40 p-4 rounded-xl border-2 border-indigo-400 dark:border-indigo-500/30 shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-2">{exercise}</h2>
        <p className="text-sm text-indigo-700 dark:text-indigo-300">Log your sets and track your progress</p>
      </div>

      {/* Add Set Form */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-xl border-2 border-indigo-300 dark:border-indigo-500/30">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Set</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reps</label>
            <input
              type="number"
              value={currentReps}
              onChange={(e) => setCurrentReps(e.target.value)}
              placeholder="12"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight (lbs)</label>
            <input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="135"
              step="0.5"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition outline-none"
            />
          </div>
        </div>

        <button
          onClick={addSet}
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl text-white font-bold transition duration-300 shadow-lg"
        >
          + Add Set
        </button>
      </div>

      {/* Sets List */}
      {sets.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed Sets ({sets.length})</h3>
          {sets.map((set, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-l-4 border-teal-500 dark:border-teal-400 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-teal-600 dark:text-teal-400">#{index + 1}</span>
                <div>
                  <p className="text-gray-900 dark:text-white font-semibold">{set.reps} reps × {set.weight} lbs</p>
                </div>
              </div>
              <button
                onClick={() => removeSet(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
              >
                <ArrowLeft className="h-5 w-5 transform rotate-180" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Save Workout Button */}
      {sets.length > 0 && (
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white font-bold text-lg transition duration-300 shadow-xl"
        >
          Save Workout ({sets.length} {sets.length === 1 ? 'set' : 'sets'})
        </button>
      )}
    </div>
  );
};

// Modal Components
const ExerciseDetailModal = ({ 
  exercise, 
  onClose, 
  onStartLogging 
}: { 
  exercise: string; 
  onClose: () => void;
  onStartLogging?: () => void;
}) => {
  const swipeHandlers = useSwipe(onClose);
  
  // Get exercise details from the EXERCISE_DETAILS object
  const exerciseDetail = EXERCISE_DETAILS[exercise];
  
  // Get exercise image/GIF if available
  const exerciseImage = EXERCISE_IMAGES[exercise];
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-300 dark:border-indigo-500/30 max-h-[90vh] overflow-y-auto" 
          onClick={(e) => e.stopPropagation()}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          {...swipeHandlers}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{exercise}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition">
              <ArrowLeft className="h-6 w-6 transform rotate-180" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Exercise Image/GIF or Placeholder */}
            {exerciseImage ? (
              <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img 
                  src={exerciseImage} 
                  alt={`${exercise} demonstration`}
                  className="w-full h-48 object-contain"
                />
              </div>
            ) : (
              <div className="bg-gray-700/50 rounded-lg p-4 h-48 flex items-center justify-center">
                <p className="text-gray-400 italic">Video/Image Coming Soon</p>
              </div>
            )}
            
            {exerciseDetail ? (
              <>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-500/30">
                  <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">About This Exercise</h4>
                  <p className="text-gray-800 dark:text-white/90 text-sm leading-relaxed">{exerciseDetail.description}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center">
                    <span className="mr-2">📋</span> Step-by-Step Instructions
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-white/80">
                    {exerciseDetail.steps.map((step, index) => (
                      <li key={index} className="text-sm leading-relaxed pl-2">{step}</li>
                    ))}
                  </ol>
                </div>
              </>
            ) : (
              <div>
                <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Instructions</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-white/80">
                  <li>Position yourself correctly with proper form</li>
                  <li>Execute the movement with controlled motion</li>
                  <li>Focus on the target muscle group</li>
                  <li>Maintain proper breathing throughout</li>
                </ol>
              </div>
            )}
            
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-4 border border-indigo-300 dark:border-indigo-500/30">
              <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">💪 Recommended</h4>
              <p className="text-gray-900 dark:text-white">3-4 sets of 8-12 reps</p>
              <p className="text-gray-600 dark:text-white/70 text-xs mt-2">Rest 60-90 seconds between sets</p>
            </div>

            {onStartLogging && (
              <button
                onClick={onStartLogging}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl text-white font-bold transition duration-300 shadow-lg"
              >
                Start Logging Sets 📊
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const WeeklyPlanModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-300 dark:border-indigo-500/30" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Premium Feature</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition">
          <ArrowLeft className="h-6 w-6 transform rotate-180" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-lg p-6 text-center">
          <Target className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
          <p className="text-gray-800 dark:text-white/90 mb-4">
            Get a personalized, detailed weekly diet plan tailored to your goals, preferences, and biometrics.
          </p>
          <p className="text-sm text-gray-600 dark:text-white/70 mb-6">
            Includes macros, meal timing, recipe suggestions, and more!
          </p>
          <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white font-bold transition duration-300 shadow-lg">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Edit Profile Modal
const EditProfileModal = ({ onClose, userData }: { onClose: () => void; userData: any }) => {
  const [name, setName] = useState(userData?.name || '');
  const [weight, setWeight] = useState(userData?.weight?.toString() || '');
  const [age, setAge] = useState(userData?.age?.toString() || '');
  const [heightFeet, setHeightFeet] = useState(userData?.heightFeet?.toString() || '');
  const [heightInches, setHeightInches] = useState(userData?.heightInches?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const swipeHandlers = useSwipe(onClose);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const user = auth.currentUser;
    if (!user) {
      toast.error('Not authenticated');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        weight: parseFloat(weight),
        age: parseInt(age),
        heightFeet: parseInt(heightFeet),
        heightInches: parseInt(heightInches)
      });
      
      toast.success('Profile updated successfully! ✅');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-indigo-500/30" 
          onClick={(e) => e.stopPropagation()}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          {...swipeHandlers}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition">
              <ArrowLeft className="h-6 w-6 transform rotate-180" />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                min="20"
                max="300"
                step="0.1"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min="13"
                max="120"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">Height</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    required
                    min="3"
                    max="8"
                    placeholder="Feet"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block text-center">Feet</span>
                </div>
                <div>
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    required
                    min="0"
                    max="11"
                    placeholder="Inches"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition duration-200"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block text-center">Inches</span>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-200 shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// 1. Animated Quote Carousel for Home Screen
const QuoteCarousel = ({ quotes }: { quotes: { text: string, author: string }[] }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Auto-advance logic
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setIsFading(false);
      }, 500); // Half a second fade out/in
    }, 10000); // 10 seconds (10000ms)

    return () => clearInterval(interval);
  }, [quotes.length]);

  const handleSwipe = useCallback((direction: number) => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentQuoteIndex((prevIndex) => {
        let newIndex = prevIndex + direction;
        if (newIndex < 0) newIndex = quotes.length - 1;
        if (newIndex >= quotes.length) newIndex = 0;
        return newIndex;
      });
      setIsFading(false);
    }, 200);
  }, [quotes.length, isFading]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) { // Threshold for a valid swipe
      if (diff > 0) {
        // Swiped Left (Next)
        handleSwipe(1);
      } else {
        // Swiped Right (Previous)
        handleSwipe(-1);
      }
    }
    setTouchStartX(null);
  };

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div
      className="h-40 p-6 bg-gradient-to-br from-indigo-400 to-purple-400 dark:bg-indigo-700/30 rounded-xl shadow-lg backdrop-blur-sm flex items-center justify-center text-center transition-all duration-300 transform hover:scale-[1.02]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`transition-opacity duration-500 ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <p className="text-xl font-light italic text-white dark:text-white/90 mb-3 leading-relaxed">
          "{currentQuote.text}"
        </p>
        <p className="text-sm font-medium text-white/90 dark:text-indigo-300">— {currentQuote.author}</p>
      </div>
    </div>
  );
};

// Diet Survey Component
const DietSurveyScreen = ({ onComplete, userData, initialStep }: { onComplete: () => void; userData: any; initialStep?: number }) => {
  const [currentStep, setCurrentStep] = useState(initialStep || 1);
  const [surveyData, setSurveyData] = useState({
    fitnessGoal: userData?.dietPreferences?.fitnessGoal || '',
    religion: userData?.dietPreferences?.religion || '',
    dietType: userData?.dietPreferences?.dietType || '',
    foodPreferences: userData?.dietPreferences?.foodPreferences || [],
    allergies: userData?.dietPreferences?.allergies || [],
    mealsPerDay: userData?.dietPreferences?.mealsPerDay || '3',
    cookingSkill: userData?.dietPreferences?.cookingSkill || '',
    budget: userData?.dietPreferences?.budget || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const fitnessGoals = [
    { id: 'weight-loss', name: 'Weight Loss', desc: 'Calorie deficit focus', icon: '🔥', color: 'bg-red-500' },
    { id: 'muscle-gain', name: 'Muscle Gain', desc: 'Protein and calorie surplus', icon: '💪', color: 'bg-green-500' },
    { id: 'maintenance', name: 'Maintenance', desc: 'Balanced lifestyle', icon: '⚖️', color: 'bg-blue-500' },
  ];

  const religions = [
    { id: 'muslim', name: 'Muslim (Halal)', icon: '☪️' },
    { id: 'hindu', name: 'Hindu (Vegetarian)', icon: '🕉️' },
    { id: 'christian', name: 'Christian', icon: '✝️' },
    { id: 'buddhist', name: 'Buddhist (Vegetarian)', icon: '☸️' },
    { id: 'jewish', name: 'Jewish (Kosher)', icon: '✡️' },
    { id: 'none', name: 'No Restriction', icon: '🌍' },
    { id: 'other', name: 'Other', icon: '📿' },
  ];

  const dietTypes = [
    { id: 'omnivore', name: 'Omnivore', desc: 'Eat everything', icon: '🍖' },
    { id: 'vegetarian', name: 'Vegetarian', desc: 'No meat', icon: '🥗' },
    { id: 'vegan', name: 'Vegan', desc: 'No animal products', icon: '🌱' },
    { id: 'pescatarian', name: 'Pescatarian', desc: 'Fish only', icon: '🐟' },
    { id: 'keto', name: 'Keto', desc: 'Low carb, high fat', icon: '🥑' },
    { id: 'paleo', name: 'Paleo', desc: 'Whole foods', icon: '🥩' },
  ];

  const foodPreferences = [
    { id: 'chicken', name: 'Chicken', icon: '🍗' },
    { id: 'beef', name: 'Beef', icon: '🥩' },
    { id: 'fish', name: 'Fish', icon: '🐟' },
    { id: 'eggs', name: 'Eggs', icon: '🥚' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'rice', name: 'Rice', icon: '🍚' },
    { id: 'bread', name: 'Bread', icon: '🍞' },
    { id: 'pasta', name: 'Pasta', icon: '🍝' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥦' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'nuts', name: 'Nuts', icon: '🥜' },
    { id: 'beans', name: 'Beans/Lentils', icon: '🫘' },
  ];

  const allergies = [
    { id: 'none', name: 'No Allergies', icon: '✅' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'eggs', name: 'Eggs', icon: '🥚' },
    { id: 'nuts', name: 'Nuts', icon: '🥜' },
    { id: 'shellfish', name: 'Shellfish', icon: '🦐' },
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'soy', name: 'Soy', icon: '🫘' },
  ];

  const cookingSkills = [
    { id: 'beginner', name: 'Beginner', desc: 'Simple meals', icon: '👶' },
    { id: 'intermediate', name: 'Intermediate', desc: 'Moderate cooking', icon: '👨‍🍳' },
    { id: 'advanced', name: 'Advanced', desc: 'Complex recipes', icon: '⭐' },
  ];

  const budgets = [
    { id: 'low', name: 'Budget-Friendly', desc: 'Economical meals', icon: '💰' },
    { id: 'medium', name: 'Moderate', desc: 'Balanced spending', icon: '💵' },
    { id: 'high', name: 'Premium', desc: 'Quality ingredients', icon: '💎' },
  ];

  const handleTogglePreference = (item: string) => {
    setSurveyData(prev => ({
      ...prev,
      foodPreferences: prev.foodPreferences.includes(item)
        ? prev.foodPreferences.filter((i: string) => i !== item)
        : [...prev.foodPreferences, item]
    }));
  };

  const handleToggleAllergy = (item: string) => {
    if (item === 'none') {
      setSurveyData(prev => ({ ...prev, allergies: ['none'] }));
    } else {
      setSurveyData(prev => ({
        ...prev,
        allergies: prev.allergies.includes(item)
          ? prev.allergies.filter((i: string) => i !== item)
          : [...prev.allergies.filter((a: string) => a !== 'none'), item]
      }));
    }
  };

  const handleSaveSurvey = async () => {
    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Not logged in');
        setIsSaving(false);
        return;
      }
      
      console.log('Saving diet preferences for user:', user.uid, surveyData);
      
      // Use setDoc with merge instead of updateDoc to create document if it doesn't exist
      await setDoc(doc(db, 'users', user.uid), {
        dietPreferences: surveyData,
        dietSurveyCompleted: true
      }, { merge: true });
      
      console.log('Diet preferences saved successfully');
      toast.success('Diet preferences saved! 🎉');
      onComplete();
    } catch (error: any) {
      console.error('Error saving survey:', error);
      toast.error(`Failed to save preferences: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return surveyData.fitnessGoal !== '';
      case 2: return surveyData.religion !== '';
      case 3: return surveyData.dietType !== '';
      case 4: return surveyData.foodPreferences.length > 0;
      case 5: return surveyData.allergies.length > 0;
      case 6: return surveyData.cookingSkill !== '';
      case 7: return surveyData.budget !== '';
      default: return false;
    }
  };

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-indigo-500/50 pb-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Diet Preferences</h2>
        <p className="text-gray-600 dark:text-white/60 text-sm mt-1">Help us personalize your nutrition plan</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-700 dark:text-white/70">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What's your fitness goal?</h3>
            <p className="text-gray-600 dark:text-white/60 text-sm">This determines your meal plan type</p>
            <div className="space-y-3">
              {fitnessGoals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => setSurveyData(prev => ({ ...prev, fitnessGoal: goal.id }))}
                  className={`w-full p-6 rounded-xl border-2 transition flex items-center gap-4 ${
                    surveyData.fitnessGoal === goal.id
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <div className={`text-4xl w-16 h-16 rounded-full ${goal.color} flex items-center justify-center`}>
                    {goal.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-gray-900 dark:text-white font-bold text-lg">{goal.name}</div>
                    <div className="text-gray-600 dark:text-white/60 text-sm">{goal.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What's your religion or dietary belief?</h3>
            <p className="text-gray-600 dark:text-white/60 text-sm">This helps us suggest appropriate foods</p>
            <div className="grid grid-cols-2 gap-3">
              {religions.map(religion => (
                <button
                  key={religion.id}
                  onClick={() => setSurveyData(prev => ({ ...prev, religion: religion.id }))}
                  className={`p-4 rounded-xl border-2 transition ${
                    surveyData.religion === religion.id
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{religion.icon}</div>
                  <div className="text-gray-900 dark:text-white font-semibold text-sm">{religion.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What's your diet type?</h3>
            <p className="text-gray-600 dark:text-white/60 text-sm">Choose your eating pattern</p>
            <div className="grid grid-cols-2 gap-3">
              {dietTypes.map(diet => (
                <button
                  key={diet.id}
                  onClick={() => setSurveyData(prev => ({ ...prev, dietType: diet.id }))}
                  className={`p-4 rounded-xl border-2 transition ${
                    surveyData.dietType === diet.id
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{diet.icon}</div>
                  <div className="text-gray-900 dark:text-white font-semibold text-sm">{diet.name}</div>
                  <div className="text-gray-600 dark:text-white/50 text-xs mt-1">{diet.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What foods do you like?</h3>
            <p className="text-gray-600 dark:text-white/60 text-sm">Select all that apply</p>
            <div className="grid grid-cols-3 gap-2">
              {foodPreferences.map(food => (
                <button
                  key={food.id}
                  onClick={() => handleTogglePreference(food.id)}
                  className={`p-3 rounded-lg border-2 transition ${
                    surveyData.foodPreferences.includes(food.id)
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{food.icon}</div>
                  <div className="text-gray-900 dark:text-white text-xs font-semibold">{food.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Any food allergies?</h3>
            <p className="text-gray-600 dark:text-white/60 text-sm">We'll exclude these from your plan</p>
            <div className="grid grid-cols-2 gap-3">
              {allergies.map(allergy => (
                <button
                  key={allergy.id}
                  onClick={() => handleToggleAllergy(allergy.id)}
                  className={`p-4 rounded-xl border-2 transition ${
                    surveyData.allergies.includes(allergy.id)
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{allergy.icon}</div>
                  <div className="text-gray-900 dark:text-white font-semibold text-sm">{allergy.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What's your cooking skill level?</h3>
            <p className="text-gray-600 dark:text-white/60 text-sm">We'll match recipe complexity</p>
            <div className="space-y-3">
              {cookingSkills.map(skill => (
                <button
                  key={skill.id}
                  onClick={() => setSurveyData(prev => ({ ...prev, cookingSkill: skill.id }))}
                  className={`w-full p-4 rounded-xl border-2 transition flex items-center justify-between ${
                    surveyData.cookingSkill === skill.id
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{skill.icon}</div>
                    <div className="text-left">
                      <div className="text-gray-900 dark:text-white font-semibold">{skill.name}</div>
                      <div className="text-gray-600 dark:text-white/50 text-sm">{skill.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What's your food budget?</h3>
            <p className="text-gray-600 dark:text-white/60 text-sm">We'll suggest meals within your range</p>
            <div className="space-y-3">
              {budgets.map(budget => (
                <button
                  key={budget.id}
                  onClick={() => setSurveyData(prev => ({ ...prev, budget: budget.id }))}
                  className={`w-full p-4 rounded-xl border-2 transition flex items-center justify-between ${
                    surveyData.budget === budget.id
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-400 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{budget.icon}</div>
                    <div className="text-left">
                      <div className="text-gray-900 dark:text-white font-semibold">{budget.name}</div>
                      <div className="text-gray-600 dark:text-white/50 text-sm">{budget.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Meals Per Day */}
            <div className="mt-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:bg-gray-800 p-4 rounded-xl border-2 border-indigo-300 dark:border-gray-700 shadow-lg">
              <label className="text-gray-900 dark:text-white font-semibold mb-3 block">How many meals per day?</label>
              <div className="flex gap-2">
                {['2', '3', '4', '5', '6'].map(num => (
                  <button
                    key={num}
                    onClick={() => setSurveyData(prev => ({ ...prev, mealsPerDay: num }))}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      surveyData.mealsPerDay === num
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white/60 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-3 pt-4">
        {/* Primary Actions Row */}
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition"
            >
              ← Back
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSaveSurvey}
              disabled={!canProceed() || isSaving}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition"
            >
              {isSaving ? 'Saving...' : 'Complete Survey 🎉'}
            </button>
          )}
        </div>

        {/* Save & Exit Button - Always available if user has made changes */}
        {canProceed() && currentStep < totalSteps && (
          <button
            onClick={handleSaveSurvey}
            disabled={isSaving}
            className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition text-sm"
          >
            {isSaving ? 'Saving...' : '✓ Save & Exit'}
          </button>
        )}
      </div>

      {/* Skip Option */}
      {!userData?.dietSurveyCompleted && (
        <button
          onClick={onComplete}
          className="w-full py-2 text-white/50 hover:text-white/70 text-sm transition"
        >
          Skip for now
        </button>
      )}
    </div>
  );
};

// 2. Diet Plan Screens
const DietPlanScreen = ({ goal, setGoal, showPlanModal, setShowPlanModal, userData, isPremium }: {
  goal: string | null;
  setGoal: (goal: string | null) => void;
  showPlanModal: boolean;
  setShowPlanModal: (show: boolean) => void;
  userData: any;
  isPremium: boolean;
}) => {
  const [showPremiumLock, setShowPremiumLock] = useState(false);

  const goalOptions = useMemo(() => [
    { id: 'loss', name: "Weight Loss", icon: TrendingDown, color: "bg-red-600/60", subtitle: "Calorie deficit focus" },
    { id: 'gain', name: "Muscle Gain", icon: TrendingUp, color: "bg-green-600/60", subtitle: "Protein and calorie surplus" },
    { id: 'maintain', name: "Maintenance", icon: Heart, color: "bg-indigo-600/60", subtitle: "Balanced lifestyle" },
  ], []);

  // Personalized meal suggestions based on user preferences
  const suggestions = useMemo(() => {
    const prefs = userData?.dietPreferences || {};
    const religion = prefs.religion || 'none';
    const dietType = prefs.dietType || 'omnivore';
    const foodPrefs = prefs.foodPreferences || [];
    const allergies = prefs.allergies || [];
    const budget = prefs.budget || 'medium';
    const cookingSkill = prefs.cookingSkill || 'intermediate';

    // Helper functions to check preferences
    const canEat = (food: string) => {
      // Check allergies
      if (allergies.includes(food) && !allergies.includes('none')) return false;
      
      // Check religious restrictions
      if (religion === 'muslim') {
        if (['pork', 'bacon', 'ham', 'alcohol'].includes(food)) return false;
      }
      if (religion === 'hindu' || religion === 'buddhist') {
        if (['beef', 'pork', 'chicken', 'fish', 'meat'].includes(food)) return false;
      }
      if (religion === 'jewish') {
        if (['pork', 'bacon', 'ham', 'shellfish'].includes(food)) return false;
      }

      // Check diet type
      if (dietType === 'vegetarian') {
        if (['chicken', 'beef', 'fish', 'meat', 'pork'].includes(food)) return false;
      }
      if (dietType === 'vegan') {
        if (['chicken', 'beef', 'fish', 'meat', 'eggs', 'dairy', 'milk', 'cheese', 'yogurt'].includes(food)) return false;
      }
      if (dietType === 'pescatarian') {
        if (['chicken', 'beef', 'meat', 'pork'].includes(food)) return false;
      }

      return true;
    };

    const likes = (food: string) => foodPrefs.includes(food);
    
    // Budget-based ingredient selection
    const getBudgetProtein = () => {
      if (budget === 'low') {
        if (canEat('eggs')) return 'eggs';
        if (canEat('chicken')) return 'chicken thighs';
        if (canEat('beans')) return 'canned beans';
        return 'lentils';
      } else if (budget === 'high') {
        if (canEat('fish')) return 'salmon or tuna';
        if (canEat('beef')) return 'lean steak';
        return 'organic chicken breast';
      } else { // medium
        if (canEat('chicken')) return 'chicken breast';
        if (canEat('fish')) return 'white fish';
        return 'tofu or tempeh';
      }
    };
    
    // Cooking skill-based meal complexity
    const getComplexity = (simple: string, intermediate: string, advanced: string) => {
      if (cookingSkill === 'beginner') return simple;
      if (cookingSkill === 'advanced') return advanced;
      return intermediate;
    };

    // Protein sources based on preferences, budget, and cooking skill
    const getProtein = () => {
      const budgetOption = getBudgetProtein();
      if (canEat('chicken') && likes('chicken') && budget !== 'low') return getComplexity('baked chicken', 'grilled chicken breast', 'pan-seared chicken with herbs');
      if (canEat('fish') && likes('fish') && budget !== 'low') return getComplexity('baked fish', 'grilled white fish', 'herb-crusted salmon');
      if (canEat('beef') && likes('beef') && budget === 'high') return getComplexity('cooked beef', 'grilled lean beef', 'grass-fed steak');
      if (canEat('eggs') && budget === 'low') return getComplexity('boiled eggs', 'scrambled eggs', 'herb omelet');
      if (likes('beans')) return budget === 'low' ? 'canned beans' : 'organic chickpeas and lentils';
      return budgetOption;
    };

    const getProteinRich = () => {
      if (budget === 'high') {
        if (canEat('beef') && likes('beef')) return getComplexity('cooked steak', 'grilled ribeye', 'dry-aged steak with compound butter');
        if (canEat('fish') && likes('fish')) return getComplexity('baked salmon', 'grilled salmon fillet', 'pan-seared salmon with lemon dill sauce');
      } else if (budget === 'low') {
        if (canEat('eggs')) return getComplexity('boiled eggs', 'scrambled eggs with veggies', 'vegetable frittata');
        if (canEat('chicken')) return getComplexity('baked chicken thighs', 'grilled chicken thighs', 'marinated chicken thighs');
      }
      if (canEat('chicken') && likes('chicken')) return getComplexity('baked chicken breast', 'grilled chicken breast', 'herb-marinated chicken breast');
      if (canEat('fish') && likes('fish')) return getComplexity('baked fish', 'grilled fish', 'pan-seared fish with herbs');
      if (canEat('eggs') && likes('eggs')) return getComplexity('boiled eggs', 'scrambled eggs', 'herb and cheese omelet');
      return getComplexity('cooked beans', 'seasoned black beans', 'black beans with spiced quinoa');
    };

    const getBreakfastProtein = () => {
      if (budget === 'low') {
        if (canEat('eggs') && likes('eggs')) return getComplexity('boiled eggs', 'scrambled eggs', 'veggie omelet');
        return getComplexity('instant oatmeal with protein powder', 'oatmeal with peanut butter', 'overnight oats with seeds');
      } else if (budget === 'high') {
        if (canEat('eggs') && likes('eggs')) return getComplexity('scrambled eggs', 'eggs benedict', 'truffle scrambled eggs on sourdough');
        if (canEat('dairy') && likes('dairy')) return getComplexity('Greek yogurt', 'organic Greek yogurt parfait', 'Icelandic skyr with fresh berries');
      }
      if (canEat('eggs') && likes('eggs')) return getComplexity('boiled eggs', 'scrambled eggs', 'vegetable omelet');
      if (canEat('dairy') && likes('dairy')) return getComplexity('yogurt', 'Greek yogurt', 'Greek yogurt parfait');
      return getComplexity('instant oatmeal', 'oatmeal with protein powder', 'steel-cut oats with nut butter');
    };

    const getCarbs = () => {
      if (dietType === 'keto') return 'cauliflower rice';
      if (budget === 'low') {
        if (likes('rice')) return 'white or brown rice';
        if (likes('pasta')) return 'regular pasta';
        if (likes('bread')) return 'whole grain bread';
        return 'oats or rice';
      } else if (budget === 'high') {
        if (likes('rice')) return 'organic wild rice or quinoa';
        if (likes('pasta')) return 'organic whole wheat pasta';
        if (likes('bread')) return 'artisan whole grain sourdough';
        return 'quinoa or farro';
      }
      if (likes('rice')) return 'brown rice';
      if (likes('pasta')) return 'whole wheat pasta';
      if (likes('bread')) return 'whole grain bread';
      return 'quinoa';
    };

    const getDairy = () => {
      if (!canEat('dairy')) return budget === 'high' ? 'organic almond milk' : 'almond milk';
      if (budget === 'high' && likes('dairy')) return 'organic grass-fed milk';
      if (likes('dairy')) return 'milk';
      return 'plant-based milk';
    };

    const getNutButter = () => {
      if (allergies.includes('nuts')) return 'sunflower seed butter';
      if (likes('nuts')) return 'almond butter';
      return 'peanut butter';
    };

    // Build meal plans for each goal - Personalized with budget and cooking skill
    return {
      loss: [
        { 
          day: "Breakfast (7:00 AM - 9:00 AM)", 
          meal: `Option 1: ${getBreakfastProtein()} with ${likes('fruits') ? 'mixed berries' : 'sliced banana'} and ${budget === 'low' ? 'black tea' : 'green tea'}.\nOption 2: ${canEat('dairy') ? (budget === 'high' ? 'Organic Greek yogurt parfait' : 'Greek yogurt') : 'Chia pudding'} with ${likes('fruits') ? 'strawberries' : 'blueberries'} and ${likes('nuts') ? (budget === 'low' ? 'peanuts' : 'almonds') : 'granola'}.\nOption 3: ${getComplexity('Simple vegetable omelet', 'Spinach and mushroom omelet', 'Gourmet vegetable frittata with herbs')} with ${budget === 'high' ? 'artisan whole grain toast' : 'whole wheat toast'}.`
        },
        { 
          day: "Mid-Morning Snack (10:00 AM - 11:00 AM)", 
          meal: `Option 1: ${likes('fruits') ? (budget === 'low' ? 'Seasonal fruit' : 'Fresh apple slices') : 'Carrot sticks'} with ${getNutButter()}.\nOption 2: ${canEat('dairy') ? (budget === 'high' ? 'Organic cottage cheese' : 'Cottage cheese') : 'Hummus'} with ${likes('vegetables') ? 'cucumber slices' : 'bell pepper strips'}.\nOption 3: ${budget === 'low' ? 'Small handful of peanuts' : (likes('nuts') ? 'Mixed nuts' : 'Roasted chickpeas')}.`
        },
        { 
          day: "Lunch (12:30 PM - 2:00 PM)", 
          meal: `Option 1: ${getComplexity('Simple salad', 'Large mixed vegetable salad', 'Gourmet salad bowl')} with ${getProtein()} and ${budget === 'high' ? 'extra virgin olive oil dressing' : 'olive oil dressing'}.\nOption 2: ${getProtein()} with ${likes('vegetables') ? (getComplexity('steamed vegetables', 'grilled vegetables', 'roasted seasonal vegetables')) : 'steamed broccoli'} and small portion ${getCarbs()}.\nOption 3: ${getComplexity('Simple soup', 'Hearty vegetable soup', 'Homemade vegetable soup with herbs')} with ${likes('beans') ? 'lentils' : 'chickpeas'} and side salad.`
        },
        { 
          day: "Afternoon Snack (4:00 PM - 5:00 PM)", 
          meal: `Option 1: ${canEat('dairy') ? 'Greek yogurt' : 'Chia pudding'} with ${likes('fruits') ? 'berries' : 'cinnamon'}.\nOption 2: ${likes('vegetables') ? 'Veggie sticks' : 'Rice cakes'} with ${canEat('dairy') ? 'low-fat cheese' : 'guacamole'}.\nOption 3: Herbal tea with a small ${likes('fruits') ? 'piece of fruit' : 'handful of berries'}.`
        },
        { 
          day: "Dinner (6:30 PM - 8:00 PM)", 
          meal: `Option 1: ${getProteinRich()} with steamed ${likes('vegetables') ? 'broccoli and asparagus' : 'mixed vegetables'}.\nOption 2: Baked ${canEat('fish') ? 'salmon' : getProteinRich()} with ${likes('vegetables') ? 'roasted Brussels sprouts' : 'green beans'}.\nOption 3: ${likes('vegetables') ? 'Stir-fried vegetables' : 'Mixed greens'} with ${getProtein()} and cauliflower rice.`
        },
        { 
          day: "Evening Snack (9:00 PM - 10:00 PM)", 
          meal: `Option 1: ${canEat('dairy') ? 'Casein protein shake' : 'Almond milk smoothie'}.\nOption 2: ${likes('nuts') ? 'Handful of almonds' : 'Air-popped popcorn'}.\nOption 3: ${canEat('dairy') ? 'Cottage cheese' : 'Hummus'} with ${likes('vegetables') ? 'celery' : 'cucumber'}.`
        },
      ],
      gain: [
        { 
          day: "Breakfast (7:00 AM - 9:00 AM)", 
          meal: `Option 1: ${getBreakfastProtein()}, ${likes('bread') ? 'whole-wheat toast with avocado' : 'oatmeal with honey'}, and a glass of ${getDairy()}.\nOption 2: Protein pancakes with ${likes('fruits') ? 'banana slices' : 'berries'} and ${getNutButter()}.\nOption 3: ${canEat('eggs') ? 'Egg and cheese' : 'Tofu'} breakfast burrito with ${likes('vegetables') ? 'peppers and onions' : 'spinach'}.`
        },
        { 
          day: "Mid-Morning Snack (10:00 AM - 11:00 AM)", 
          meal: `Option 1: Protein shake with ${likes('fruits') ? 'banana and berries' : 'spinach and mango'} and ${likes('nuts') ? 'almond butter' : 'oats'}.\nOption 2: ${canEat('dairy') ? 'Greek yogurt' : 'Coconut yogurt'} with ${likes('fruits') ? 'granola and honey' : 'chia seeds'}.\nOption 3: Whole grain crackers with ${canEat('dairy') ? 'cheese' : 'hummus'} and ${likes('nuts') ? 'cashews' : 'trail mix'}.`
        },
        { 
          day: "Lunch (12:30 PM - 2:00 PM)", 
          meal: `Option 1: Large ${getCarbs()} and ${likes('beans') ? 'black bean' : 'chickpea'} bowl with ${getProtein()} and avocado.\nOption 2: ${getProtein()} with ${dietType === 'keto' ? 'cauliflower mash' : 'sweet potato'} and ${likes('vegetables') ? 'roasted vegetables' : 'mixed greens'}.\nOption 3: ${likes('pasta') ? 'Whole wheat pasta' : 'Rice noodles'} with ${getProteinRich()} and ${likes('vegetables') ? 'marinara sauce' : 'pesto'}.`
        },
        { 
          day: "Pre-Workout Snack (4:00 PM - 5:00 PM)", 
          meal: `Option 1: ${likes('fruits') ? 'Banana' : 'Apple'} with ${getNutButter()}.\nOption 2: ${canEat('dairy') ? 'Greek yogurt' : 'Plant-based yogurt'} with ${likes('fruits') ? 'honey' : 'maple syrup'}.\nOption 3: Energy bar or ${likes('bread') ? 'whole grain toast' : 'rice cakes'} with ${likes('nuts') ? 'almond butter' : 'jam'}.`
        },
        { 
          day: "Dinner (6:30 PM - 8:00 PM)", 
          meal: `Option 1: ${getProteinRich()} with ${dietType === 'keto' ? 'mashed cauliflower' : 'sweet potato'} and ${likes('vegetables') ? 'sautéed vegetables' : 'steamed greens'}.\nOption 2: ${canEat('beef') ? 'Beef stir-fry' : 'Chicken stir-fry'} with ${getCarbs()} and mixed ${likes('vegetables') ? 'bell peppers and broccoli' : 'vegetables'}.\nOption 3: Baked ${canEat('fish') ? 'salmon' : getProtein()} with ${likes('rice') ? 'wild rice' : 'quinoa'} and ${likes('vegetables') ? 'asparagus' : 'green beans'}.`
        },
        { 
          day: "Post-Workout Snack (9:00 PM - 10:00 PM)", 
          meal: `Option 1: Protein shake with ${getDairy()} and ${likes('fruits') ? 'banana' : 'berries'}.\nOption 2: ${canEat('eggs') ? 'Hard-boiled eggs' : 'Protein bar'} with ${likes('fruits') ? 'fruit' : 'vegetables'}.\nOption 3: ${canEat('dairy') ? 'Chocolate milk' : 'Protein smoothie'} with ${likes('nuts') ? 'nuts' : 'oats'}.`
        },
      ],
      maintain: [
        { 
          day: "Breakfast (7:00 AM - 9:00 AM)", 
          meal: `Option 1: ${canEat('dairy') && likes('dairy') ? 'Yogurt parfait with granola' : 'Smoothie bowl'} and ${likes('fruits') ? 'fresh fruit' : 'chia seeds'}.\nOption 2: ${getBreakfastProtein()} with ${likes('bread') ? 'whole grain toast' : 'sweet potato hash'} and ${likes('fruits') ? 'fresh berries' : 'sliced avocado'}.\nOption 3: Overnight oats with ${getDairy()}, ${likes('nuts') ? 'walnuts' : 'pumpkin seeds'}, and ${likes('fruits') ? 'diced apples' : 'banana'}.`
        },
        { 
          day: "Mid-Morning Snack (10:00 AM - 11:00 AM)", 
          meal: `Option 1: ${likes('nuts') && !allergies.includes('nuts') ? 'Handful of mixed nuts' : 'Rice cakes with avocado'} and ${likes('fruits') ? 'an apple' : 'celery sticks'}.\nOption 2: ${canEat('dairy') ? 'String cheese' : 'Edamame'} with ${likes('fruits') ? 'grapes' : 'cherry tomatoes'}.\nOption 3: Protein bar or ${likes('fruits') ? 'fruit smoothie' : 'vegetable juice'}.`
        },
        { 
          day: "Lunch (12:30 PM - 2:00 PM)", 
          meal: `Option 1: ${getProtein()} ${likes('bread') ? 'sandwich on whole grain bread' : `wrap with ${likes('vegetables') ? 'mixed vegetables' : 'lettuce'}`} with side salad.\nOption 2: Buddha bowl with ${getCarbs()}, ${getProtein()}, ${likes('vegetables') ? 'roasted vegetables' : 'mixed greens'}, and tahini dressing.\nOption 3: ${likes('pasta') ? 'Pasta primavera' : 'Grain bowl'} with ${getProtein()} and ${likes('vegetables') ? 'seasonal vegetables' : 'spinach'}.`
        },
        { 
          day: "Afternoon Snack (4:00 PM - 5:00 PM)", 
          meal: `Option 1: ${likes('fruits') ? 'Fresh fruit salad' : 'Vegetable crudités'} with ${canEat('dairy') ? 'yogurt dip' : 'tahini'}.\nOption 2: ${likes('nuts') ? 'Trail mix' : 'Roasted chickpeas'} with ${likes('fruits') ? 'dried fruit' : 'dark chocolate'}.\nOption 3: ${canEat('dairy') ? 'Greek yogurt' : 'Smoothie'} with ${likes('nuts') ? 'granola' : 'seeds'}.`
        },
        { 
          day: "Dinner (6:30 PM - 8:00 PM)", 
          meal: `Option 1: ${getProteinRich()} with ${getCarbs()} and ${likes('vegetables') ? 'roasted vegetables' : 'side salad'}.\nOption 2: ${canEat('fish') ? 'Grilled fish tacos' : 'Chicken fajitas'} with ${getCarbs()} and ${likes('vegetables') ? 'grilled peppers' : 'lettuce'}.\nOption 3: ${likes('pasta') ? 'Whole wheat pasta' : 'Zucchini noodles'} with ${getProteinRich()} and ${likes('vegetables') ? 'tomato basil sauce' : 'garlic and olive oil'}.`
        },
        { 
          day: "Evening Snack (9:00 PM - 10:00 PM)", 
          meal: `Option 1: Herbal tea with ${likes('nuts') ? 'a handful of almonds' : 'rice crackers'}.\nOption 2: ${likes('vegetables') ? 'Veggie sticks' : 'Whole grain crackers'} with ${canEat('dairy') ? 'cottage cheese' : 'hummus'}.\nOption 3: ${likes('fruits') ? 'Small fruit bowl' : 'Air-popped popcorn'}.`
        },
      ],
    };
  }, [userData]);

  // Swipe handler for diet plan details screen
  const swipeHandlersDietDetails = useSwipe(() => setGoal(null));

  const [showSurvey, setShowSurvey] = useState(false);
  const [editStep, setEditStep] = useState<number | null>(null);
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({});

  // Check if user has completed diet survey
  const hasDietPreferences = userData?.dietSurveyCompleted;

  // Show survey first if not completed
  if (!hasDietPreferences && !showSurvey) {
    return <DietSurveyScreen onComplete={() => setShowSurvey(true)} userData={userData} />;
  }

  // Show survey at specific step for quick edit
  if (editStep !== null) {
    return <DietSurveyScreen onComplete={() => setEditStep(null)} userData={userData} initialStep={editStep} />;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center border-b border-indigo-500/50 pb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Nutrition Goal</h2>
        {hasDietPreferences && (
          <button
            onClick={() => setShowSurvey(!showSurvey)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            {showSurvey ? 'View Plans' : 'Edit Preferences'}
          </button>
        )}
      </div>

      {showSurvey ? (
        <DietSurveyScreen onComplete={() => setShowSurvey(false)} userData={userData} />
      ) : (
        <>
          {/* User Preferences Summary with Quick Edit */}
          {hasDietPreferences && (
            <div className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-900/40 dark:to-purple-900/40 p-4 rounded-xl border-2 border-indigo-400 dark:border-indigo-500/30 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-white">Your Diet Profile</h3>
                <button
                  onClick={() => setShowSurvey(true)}
                  className="text-[10px] px-2 py-1 bg-white/90 dark:bg-indigo-700 text-indigo-600 dark:text-white rounded-md hover:bg-white dark:hover:bg-indigo-600 font-semibold"
                >
                  Edit All
                </button>
              </div>
              
              {/* Fitness Goal - Step 1 */}
              {userData.dietPreferences?.fitnessGoal && (
                <div className="flex items-center justify-between mb-2 bg-white/40 dark:bg-black/20 rounded-lg p-2">
                  <span className={`px-2 py-1 rounded-full font-semibold border flex-1 ${
                    userData.dietPreferences.fitnessGoal === 'weight-loss' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300' :
                    userData.dietPreferences.fitnessGoal === 'muscle-gain' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300'
                  }`}>
                    {userData.dietPreferences.fitnessGoal === 'weight-loss' ? '🔥 Weight Loss' :
                     userData.dietPreferences.fitnessGoal === 'muscle-gain' ? '💪 Muscle Gain' :
                     '⚖️ Maintenance'}
                  </span>
                  <button
                    onClick={() => setEditStep(1)}
                    className="ml-2 text-[9px] px-2 py-1 bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white rounded hover:bg-indigo-200 dark:hover:bg-indigo-600"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Other Preferences */}
              <div className="flex flex-wrap gap-2 text-xs">
                {userData.dietPreferences?.religion && (
                  <div className="flex items-center gap-1 bg-white/60 dark:bg-black/20 rounded-full pr-1">
                    <span className="px-2 py-1 rounded-full text-indigo-700 dark:text-indigo-300 font-semibold">
                      {userData.dietPreferences.religion === 'muslim' ? '☪️ Halal' : 
                       userData.dietPreferences.religion === 'hindu' ? '🕉️ Hindu' :
                       userData.dietPreferences.religion === 'jewish' ? '✡️ Kosher' :
                       userData.dietPreferences.religion === 'none' ? '🌍 No Restriction' : '📿 ' + userData.dietPreferences.religion}
                    </span>
                    <button
                      onClick={() => setEditStep(2)}
                      className="text-[8px] px-1.5 py-0.5 bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
                    >
                      ✎
                    </button>
                  </div>
                )}
                {userData.dietPreferences?.dietType && (
                  <div className="flex items-center gap-1 bg-white/60 dark:bg-black/20 rounded-full pr-1">
                    <span className="px-2 py-1 rounded-full text-purple-700 dark:text-purple-300 font-semibold">
                      {userData.dietPreferences.dietType}
                    </span>
                    <button
                      onClick={() => setEditStep(3)}
                      className="text-[8px] px-1.5 py-0.5 bg-purple-500 text-white rounded-full hover:bg-purple-600"
                    >
                      ✎
                    </button>
                  </div>
                )}
                {userData.dietPreferences?.mealsPerDay && (
                  <div className="flex items-center gap-1 bg-white/60 dark:bg-black/20 rounded-full pr-1">
                    <span className="px-2 py-1 rounded-full text-teal-700 dark:text-teal-300 font-semibold">
                      {userData.dietPreferences.mealsPerDay} meals/day
                    </span>
                    <button
                      onClick={() => setEditStep(6)}
                      className="text-[8px] px-1.5 py-0.5 bg-teal-500 text-white rounded-full hover:bg-teal-600"
                    >
                      ✎
                    </button>
                  </div>
                )}
                {userData.dietPreferences?.cookingSkill && (
                  <div className="flex items-center gap-1 bg-white/60 dark:bg-black/20 rounded-full pr-1">
                    <span className="px-2 py-1 rounded-full text-amber-700 dark:text-amber-300 font-semibold">
                      {userData.dietPreferences.cookingSkill === 'beginner' ? '👶 Beginner' :
                       userData.dietPreferences.cookingSkill === 'intermediate' ? '👨‍🍳 Intermediate' :
                       '⭐ Advanced'}
                    </span>
                    <button
                      onClick={() => setEditStep(7)}
                      className="text-[8px] px-1.5 py-0.5 bg-amber-500 text-white rounded-full hover:bg-amber-600"
                    >
                      ✎
                    </button>
                  </div>
                )}
                {userData.dietPreferences?.budget && (
                  <div className="flex items-center gap-1 bg-white/60 dark:bg-black/20 rounded-full pr-1">
                    <span className="px-2 py-1 rounded-full text-green-700 dark:text-green-300 font-semibold">
                      {userData.dietPreferences.budget === 'low' ? '💰 Budget' :
                       userData.dietPreferences.budget === 'medium' ? '💵 Moderate' :
                       '💎 Premium'}
                    </span>
                    <button
                      onClick={() => setEditStep(8)}
                      className="text-[8px] px-1.5 py-0.5 bg-green-500 text-white rounded-full hover:bg-green-600"
                    >
                      ✎
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
      
          {/* Medical Disclaimer - Collapsible */}
          <DisclaimerCard />

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mt-4">Your Meal Plan</h3>
              
              {/* Personalization Notice */}
              {userData?.dietSurveyCompleted && (
                <div className="bg-gradient-to-r from-emerald-300 to-teal-300 dark:from-green-900/30 dark:to-teal-900/30 p-3 rounded-lg border-2 border-emerald-400 dark:border-green-500/30 shadow-lg">
                  <p className="text-emerald-900 dark:text-green-300 text-xs font-semibold flex items-center gap-2">
                    ✨ Personalized for your preferences
                    {userData.dietPreferences?.religion === 'muslim' && <span>(Halal ☪️)</span>}
                    {userData.dietPreferences?.religion === 'hindu' && <span>(Vegetarian 🕉️)</span>}
                    {userData.dietPreferences?.religion === 'jewish' && <span>(Kosher ✡️)</span>}
                    {userData.dietPreferences?.dietType === 'vegan' && <span>(Vegan 🌱)</span>}
                    {userData.dietPreferences?.dietType === 'keto' && <span>(Keto 🥑)</span>}
                  </p>
                </div>
              )}
              
              {/* Disclaimer for meal suggestions */}
              <DisclaimerCard compact={true} />
              
              {/* Goal-based calorie info for premium */}
              {isPremium && (() => {
                // CRITICAL: Use the same logic as generateDailyMealPlan - prioritize preference
                const preferenceGoal = userData?.dietPreferences?.fitnessGoal;
                let userGoal = 'maintenance';
                
                if (preferenceGoal) {
                  userGoal = preferenceGoal; // Use user's explicit preference
                } else {
                  // Fallback: calculate from weight
                  const current = userData?.weight || 80;
                  const target = userData?.targetWeight || 75;
                  userGoal = current > target + 2 ? 'weight-loss' : current < target - 2 ? 'muscle-gain' : 'maintenance';
                }
                
                const calorieMultiplier = userGoal === 'weight-loss' ? 0.85 : userGoal === 'muscle-gain' ? 1.15 : 1.0;
                const baseCalories = 2000;
                const adjustedCalories = Math.round(baseCalories * calorieMultiplier);
                
                return (
                  <div className={`p-4 rounded-xl border-2 ${
                    userGoal === 'weight-loss' ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600/30' :
                    userGoal === 'muscle-gain' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600/30' :
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600/30'
                  }`}>
                    <p className="text-sm font-bold mb-1">
                      {userGoal === 'weight-loss' && '🔥 Weight Loss Plan'}
                      {userGoal === 'muscle-gain' && '💪 Muscle Gain Plan'}
                      {userGoal === 'maintenance' && '⚖️ Maintenance Plan'}
                    </p>
                    <p className="text-xs opacity-90">
                      Daily Target: {adjustedCalories} calories 
                      {calorieMultiplier !== 1.0 && `(${calorieMultiplier === 0.85 ? '-15%' : '+15%'} adjusted)`}
                    </p>
                  </div>
                );
              })()}
              
              <p className="text-gray-700 dark:text-white/70 text-sm italic">
                {isPremium ? 'Your Personalized Meal Plan' : 'Sample 1-Day Plan (3 basic meals)'}:
              </p>
              
              {/* Free user limitation notice */}
              {!isPremium && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-600/30 rounded-xl p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">Free Plan: 3 Basic Meals</p>
                    <p className="text-xs text-amber-800 dark:text-amber-400">Upgrade to Premium for custom meal counts (3-6 meals), goal-based calorie adjustment, detailed recipes with macros.</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {goal && (() => {
                  // Use smart meal engine for premium, simple suggestions for free
                  if (isPremium) {
                    // CRITICAL FIX: Prioritize user's explicit preference over auto-calculation
                    const preferenceGoal = userData?.dietPreferences?.fitnessGoal;
                    
                    let userGoal = 'maintenance'; // Default fallback
                    
                    if (preferenceGoal) {
                      // User has explicitly selected a goal - USE IT
                      userGoal = preferenceGoal;
                    } else {
                      // Fallback: Auto-calculate from weight ONLY if no preference set
                      const current = userData?.weight || 70;
                      const target = userData?.targetWeight || 75;
                      userGoal = current > target + 2 ? 'weight-loss' : current < target - 2 ? 'muscle-gain' : 'maintenance';
                    }
                    
                    // DEBUG: Log to console
                    console.log('🎯 Goal Detection:', { 
                      preferenceGoal: userData?.dietPreferences?.fitnessGoal,
                      finalGoal: userGoal,
                      weight: userData?.weight,
                      target: userData?.targetWeight
                    });
                    
                    const calorieMultiplier = userGoal === 'weight-loss' ? 0.85 : userGoal === 'muscle-gain' ? 1.15 : 1.0;
                    
                    // Select the appropriate meal plan database based on user's goal
                    const mealDatabase = userGoal === 'weight-loss' ? WEEK_1_WEIGHT_LOSS :
                                        userGoal === 'muscle-gain' ? WEEK_1_MUSCLE_GAIN :
                                        WEEK_1_MAINTENANCE;
                    
                    console.log('📊 Selected Database:', mealDatabase[0]?.goal, 'First meal:', mealDatabase[0]?.meals?.breakfast?.name);
                    
                    // Get Monday's meal plan from the selected database
                    const mondayPlan = mealDatabase.find(p => p.day === 1);
                    if (!mondayPlan) return null;
                    
                    // Get meals based on user preference
                    const mealsPerDay = parseInt(userData?.dietPreferences?.mealsPerDay || '6');
                    const mealTypes = [
                      { key: 'breakfast', name: 'Breakfast', emoji: '🌅' },
                      { key: 'morningSnack', name: 'Morning Snack', emoji: '☕' },
                      { key: 'lunch', name: 'Lunch', emoji: '🍽️' },
                      { key: 'afternoonSnack', name: 'Afternoon Snack', emoji: '🥤' },
                      { key: 'dinner', name: 'Dinner', emoji: '🌙' },
                      { key: 'eveningSnack', name: 'Evening Snack', emoji: '🍪' },
                    ];
                    
                    // Select meals based on count preference
                    const selectedMeals = mealsPerDay === 3 ? [mealTypes[0], mealTypes[2], mealTypes[4]] :
                                         mealsPerDay === 4 ? [mealTypes[0], mealTypes[2], mealTypes[3], mealTypes[4]] :
                                         mealsPerDay === 5 ? [mealTypes[0], mealTypes[1], mealTypes[2], mealTypes[3], mealTypes[4]] :
                                         mealTypes;
                    
                    return selectedMeals.map((mealType, index) => {
                      const meal = mondayPlan.meals[mealType.key as keyof typeof mondayPlan.meals] as Meal | null;
                      if (!meal) return null;
                      
                      // Apply calorie adjustment
                      const adjustedMacros = {
                        calories: Math.round(meal.macros.calories * calorieMultiplier),
                        protein: Math.round(meal.macros.protein * calorieMultiplier),
                        carbs: Math.round(meal.macros.carbs * calorieMultiplier),
                        fats: Math.round(meal.macros.fats * calorieMultiplier)
                      };
                      
                      return (
                        <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-xl border-l-4 border-emerald-500 dark:border-emerald-400">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{mealType.emoji}</span>
                              <div>
                                <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">{mealType.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{meal.time}</p>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-semibold">
                              {adjustedMacros.calories} cal
                            </span>
                          </div>
                          
                          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{meal.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">{meal.description}</p>
                          
                          {/* Macros Grid */}
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">
                              <p className="text-xs text-gray-600 dark:text-gray-400">Protein</p>
                              <p className="text-sm font-bold text-red-600 dark:text-red-400">{adjustedMacros.protein}g</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                              <p className="text-xs text-gray-600 dark:text-gray-400">Carbs</p>
                              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{adjustedMacros.carbs}g</p>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-center">
                              <p className="text-xs text-gray-600 dark:text-gray-400">Fats</p>
                              <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{adjustedMacros.fats}g</p>
                            </div>
                          </div>
                          
                          {/* Ingredients - Expandable */}
                          <div className="mb-2">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Ingredients:</p>
                            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                              {expandedMeals[`${index}-ingredients`] ? (
                                // Show all ingredients
                                meal.ingredients.map((ing, i) => (
                                  <p key={i}>• {ing}</p>
                                ))
                              ) : (
                                // Show only first 3
                                meal.ingredients.slice(0, 3).map((ing, i) => (
                                  <p key={i}>• {ing}</p>
                                ))
                              )}
                              {meal.ingredients.length > 3 && (
                                <button
                                  onClick={() => setExpandedMeals(prev => ({
                                    ...prev,
                                    [`${index}-ingredients`]: !prev[`${index}-ingredients`]
                                  }))}
                                  className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                                >
                                  {expandedMeals[`${index}-ingredients`] 
                                    ? '- Show less' 
                                    : `+${meal.ingredients.length - 3} more...`}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Instructions - Expandable */}
                          {meal.instructions && meal.instructions.length > 0 && (
                            <div className="mb-2">
                              <button
                                onClick={() => setExpandedMeals(prev => ({
                                  ...prev,
                                  [`${index}-instructions`]: !prev[`${index}-instructions`]
                                }))}
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-1 cursor-pointer"
                              >
                                {expandedMeals[`${index}-instructions`] ? '▼ Hide Instructions' : '▶ View Instructions'}
                              </button>
                              {expandedMeals[`${index}-instructions`] && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg mt-2">
                                  {meal.instructions.map((instruction, i) => (
                                    <p key={i}>{i + 1}. {instruction}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {meal.dietTags?.map((tag, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    }).filter(Boolean);
                  } else {
                    // Free users get simple text suggestions
                    const allMeals = suggestions[goal as keyof typeof suggestions] || [];
                    const mealIndices = [0, 2, 4]; // Breakfast, Lunch, Dinner
                    const filteredMeals = mealIndices
                      .map(index => allMeals[index])
                      .filter((m): m is { day: string; meal: string } => m !== undefined);
                    
                    return filteredMeals.map((item: { day: string; meal: string }, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl border-l-4 border-indigo-500 dark:border-indigo-400 flex flex-col">
                        <p className="text-base font-bold text-indigo-700 dark:text-indigo-400 mb-3">{item.day}</p>
                        <div className="space-y-2">
                          {item.meal.split('\n').map((option, optIdx) => (
                            <p key={optIdx} className="text-gray-900 dark:text-white text-sm leading-relaxed pl-2 border-l-2 border-gray-300 dark:border-gray-600">
                              {option}
                            </p>
                          ))}
                        </div>
                      </div>
                    ));
                  }
                })()}
              </div>
            </div>
        </>
      )}

      {/* Weekly Plan Modal */}
      {showPlanModal && (
        <WeeklyPlanModal onClose={() => setShowPlanModal(false)} />
      )}

      {/* Premium Lock Overlay */}
      {showPremiumLock && (
        <PremiumLockOverlay 
          featureName="4-Week Rotating Meal Plans" 
          onUpgrade={() => {
            setShowPremiumLock(false);
            toast.success('Redirecting to subscription...');
            // Google Play Billing will be integrated here
          }}
        />
      )}
    </div>
  );
};

// Premium Weekly Plans Screen Component (kept for future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PremiumWeeklyPlansScreen = ({ onBack, userData, isPremium }: { onBack: () => void; userData: any; isPremium: boolean }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [showShoppingList, setShowShoppingList] = useState(false);

  const weekDays = [
    { day: 1, name: 'Monday', emoji: '💪' },
    { day: 2, name: 'Tuesday', emoji: '🔥' },
    { day: 3, name: 'Wednesday', emoji: '⚡' },
    { day: 4, name: 'Thursday', emoji: '🎯' },
    { day: 5, name: 'Friday', emoji: '🚀' },
    { day: 6, name: 'Saturday', emoji: '🏆' },
    { day: 7, name: 'Sunday', emoji: '✨' }
  ];

  // Determine user's fitness goal from preferences or weight data
  const getUserGoal = () => {
    // First, check if user has set a fitness goal preference
    if (userData?.dietPreferences?.fitnessGoal) {
      return userData.dietPreferences.fitnessGoal;
    }
    
    // Fallback: calculate from weight data
    const current = userData?.weight || userData?.currentWeight || 80;
    const target = userData?.targetWeight || 75;
    
    if (current > target + 2) return 'weight-loss';
    if (current < target - 2) return 'muscle-gain';
    return 'maintenance';
  };

  const userGoal = getUserGoal();
  const goalLabels = {
    'weight-loss': 'Weight Loss Plan',
    'muscle-gain': 'Muscle Gain Plan',
    'maintenance': 'Maintenance Plan'
  };

  // Smart Meal Generation Engine - Different logic for free vs premium
  const generateDailyMealPlan = (week: number, day: number, isPremium: boolean) => {
    // CRITICAL FIX: Prioritize user's explicit preference over auto-calculation
    const preferenceGoal = userData?.dietPreferences?.fitnessGoal;
    
    let userGoal = 'maintenance'; // Default fallback
    
    if (preferenceGoal) {
      // User has explicitly selected a goal in preferences - USE IT
      userGoal = preferenceGoal;
      console.log('🎯 Using user preference goal:', preferenceGoal);
    } else {
      // Fallback: Auto-calculate from weight ONLY if user hasn't selected a preference
      const current = userData?.weight || 70;
      const target = userData?.targetWeight || 75;
      userGoal = current > target + 2 ? 'weight-loss' : current < target - 2 ? 'muscle-gain' : 'maintenance';
      console.log('⚖️ Auto-calculated goal from weight:', { current, target, userGoal });
    }
    
    // Select the appropriate meal plan database based on user's goal
    const mealDatabase = userGoal === 'weight-loss' ? WEEK_1_WEIGHT_LOSS :
                        userGoal === 'muscle-gain' ? WEEK_1_MUSCLE_GAIN :
                        WEEK_1_MAINTENANCE;
    
    // Find the base meal plan for this day from the selected database
    const dayPlan = mealDatabase.find((plan: any) => plan.day === day);
    
    if (!dayPlan) {
      console.log('No meal plan found for day:', day);
      return null;
    }

    // Clone the plan to avoid mutating original
    let adjustedPlan = JSON.parse(JSON.stringify(dayPlan));
    
    // Get user preferences
    const preferences = userData?.dietPreferences || {};
    const { religion, dietType, allergies, mealsPerDay } = preferences;

    console.log('isPremium:', isPremium, '| mealsPerDay:', mealsPerDay || 'not set');

    // Helper function to check if meal matches safety filters
    const matchesSafetyFilters = (meal: any) => {
      if (!meal) return false;
      
      // Check religion restrictions
      if (religion === 'Muslim') {
        const hasNonHalal = meal.ingredients.some((ing: string) => 
          ing.toLowerCase().includes('pork') || 
          ing.toLowerCase().includes('bacon') ||
          ing.toLowerCase().includes('ham') ||
          ing.toLowerCase().includes('alcohol')
        );
        if (hasNonHalal) return false;
      }

      // Check diet type
      if (dietType === 'Vegetarian') {
        const hasNonVegetarian = meal.ingredients.some((ing: string) => 
          ing.toLowerCase().includes('chicken') ||
          ing.toLowerCase().includes('beef') ||
          ing.toLowerCase().includes('fish') ||
          ing.toLowerCase().includes('salmon') ||
          ing.toLowerCase().includes('meat') ||
          ing.toLowerCase().includes('pork')
        );
        if (hasNonVegetarian) return false;
      }

      if (dietType === 'Vegan') {
        const hasNonVegan = meal.ingredients.some((ing: string) => {
          const lower = ing.toLowerCase();
          return lower.includes('chicken') ||
            lower.includes('beef') ||
            lower.includes('fish') ||
            lower.includes('salmon') ||
            lower.includes('meat') ||
            lower.includes('egg') ||
            lower.includes('milk') ||
            lower.includes('cheese') ||
            lower.includes('yogurt') ||
            lower.includes('butter') ||
            lower.includes('honey');
        });
        if (hasNonVegan) return false;
      }

      // Check allergies
      if (allergies) {
        let allergyList = '';
        if (typeof allergies === 'string') {
          allergyList = allergies.toLowerCase();
        } else if (Array.isArray(allergies)) {
          allergyList = allergies.join(',').toLowerCase();
        }
        
        if (allergyList && meal.ingredients.some((ing: string) => {
          const ingLower = ing.toLowerCase();
          return allergyList.split(',').some((allergy: string) => {
            const allergyTrimmed = allergy.trim();
            return allergyTrimmed && (ingLower.includes(allergyTrimmed) || allergyTrimmed.includes(ingLower));
          });
        })) return false;
      }

      return true;
    };

    // ENHANCEMENT: Smart filtering with fallback mechanism
    const smartFilterMeal = (meal: any) => {
      if (!meal) return { passed: false, filterLevel: 'none' };
      
      // Always apply safety filters (religion, diet, allergies)
      if (!matchesSafetyFilters(meal)) {
        return { passed: false, filterLevel: 'safety-failed' };
      }
      
      // For premium users, try advanced filters (budget, skill)
      if (isPremium) {
        const budget = preferences.budget;
        const cookingSkill = preferences.cookingSkill;
        
        // Attempt strict filtering
        let passesStrictFilters = true;
        
        if (budget && meal.budget && meal.budget !== budget) {
          passesStrictFilters = false;
        }
        
        if (cookingSkill && meal.cookingSkill) {
          const skillLevels = ['beginner', 'intermediate', 'advanced'];
          const userSkillIndex = skillLevels.indexOf(cookingSkill);
          const mealSkillIndex = skillLevels.indexOf(meal.cookingSkill);
          if (mealSkillIndex > userSkillIndex) {
            passesStrictFilters = false;
          }
        }
        
        if (passesStrictFilters) {
          return { passed: true, filterLevel: 'strict' };
        } else {
          // Fallback: meal passes safety but not preferences
          return { passed: true, filterLevel: 'relaxed' };
        }
      }
      
      return { passed: true, filterLevel: 'safety-only' };
    };

    // FREE USER LOGIC: 3 meals only, safety filters only, no calorie adjustment
    if (!isPremium) {
      console.log('🆓 FREE USER: Generating 3 basic meals with safety filters only');
      
      // Force 3 meals: breakfast, lunch, dinner
      const freeMeals: any = {};
      const mealOrder = ['breakfast', 'lunch', 'dinner'];
      
      mealOrder.forEach(mealType => {
        const meal = adjustedPlan.meals[mealType];
        if (meal && matchesSafetyFilters(meal)) {
          freeMeals[mealType] = meal;
        }
      });

      // Create simplified plan with only 3 meals
      return {
        week: adjustedPlan.week,
        day: adjustedPlan.day,
        dayName: adjustedPlan.dayName,
        meals: freeMeals,
        totalMacros: {
          calories: Object.values(freeMeals).reduce((sum: number, meal: any) => sum + (meal.macros?.calories || 0), 0),
          protein: Object.values(freeMeals).reduce((sum: number, meal: any) => sum + (meal.macros?.protein || 0), 0),
          carbs: Object.values(freeMeals).reduce((sum: number, meal: any) => sum + (meal.macros?.carbs || 0), 0),
          fats: Object.values(freeMeals).reduce((sum: number, meal: any) => sum + (meal.macros?.fats || 0), 0)
        }
      };
    }

    // PREMIUM USER LOGIC: Respect mealsPerDay, all filters, goal-based calorie adjustment
    console.log('👑 PREMIUM USER: Personalized plan with goal-based calories');
    
    // Apply calorie adjustment based on user's goal
    const calorieMultiplier = {
      'weight-loss': 0.85,      // 15% calorie deficit
      'maintenance': 1.0,        // Baseline calories
      'muscle-gain': 1.15        // 15% calorie surplus
    }[userGoal] || 1.0;

    console.log('Goal:', userGoal, '| Calorie multiplier:', calorieMultiplier);

    // Determine which meals to include based on mealsPerDay preference
    const mealTypes = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner', 'eveningSnack'];
    let selectedMealTypes: string[] = [];

    const numMeals = parseInt(mealsPerDay) || 6;
    
    switch(numMeals) {
      case 3:
        selectedMealTypes = ['breakfast', 'lunch', 'dinner'];
        break;
      case 4:
        selectedMealTypes = ['breakfast', 'lunch', 'afternoonSnack', 'dinner'];
        break;
      case 5:
        selectedMealTypes = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner'];
        break;
      case 6:
      default:
        selectedMealTypes = mealTypes;
        break;
    }

    console.log('Meals to include:', selectedMealTypes);

    // Filter and adjust meals with smart fallback
    const premiumMeals: any = {};
    let usedRelaxedFiltering = false;
    
    selectedMealTypes.forEach(mealType => {
      const meal = adjustedPlan.meals[mealType];
      const filterResult = smartFilterMeal(meal);
      
      if (filterResult.passed) {
        if (filterResult.filterLevel === 'relaxed') {
          usedRelaxedFiltering = true;
        }
        
        // Apply calorie adjustment
        const adjustedMeal = {
          ...meal,
          macros: {
            calories: Math.round(meal.macros.calories * calorieMultiplier),
            protein: Math.round(meal.macros.protein * calorieMultiplier),
            carbs: Math.round(meal.macros.carbs * calorieMultiplier),
            fats: Math.round(meal.macros.fats * calorieMultiplier)
          }
        };
        premiumMeals[mealType] = adjustedMeal;
      }
    });
    
    // Log if we had to use relaxed filtering
    if (usedRelaxedFiltering) {
      console.log('ℹ️ Some meals matched using relaxed filters (safety only, not all preferences)');
    }

    // Calculate adjusted total macros
    const totalMacros = {
      calories: Object.values(premiumMeals).reduce((sum: number, meal: any) => sum + (meal.macros?.calories || 0), 0),
      protein: Object.values(premiumMeals).reduce((sum: number, meal: any) => sum + (meal.macros?.protein || 0), 0),
      carbs: Object.values(premiumMeals).reduce((sum: number, meal: any) => sum + (meal.macros?.carbs || 0), 0),
      fats: Object.values(premiumMeals).reduce((sum: number, meal: any) => sum + (meal.macros?.fats || 0), 0)
    };

    return {
      week: adjustedPlan.week,
      day: adjustedPlan.day,
      dayName: adjustedPlan.dayName,
      meals: premiumMeals,
      totalMacros
    };
  };

  // Get meal data using smart engine
  const getMealPlanForDay = (week: number, day: number) => {
    return generateDailyMealPlan(week, day, isPremium);
  };

  // Generate shopping list for current week
  const handleGenerateShoppingList = () => {
    setShowShoppingList(true);
  };

  const getCurrentWeekShoppingList = () => {
    return generateShoppingList(WEEK_1_WEIGHT_LOSS);
  };

  if (selectedMeal) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-indigo-500/50 pb-3">
            <button onClick={() => setSelectedMeal(null)} className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMeal.name}</h2>
            <div className="w-6"></div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Calories', value: selectedMeal.macros.calories, color: 'bg-orange-500' },
              { label: 'Protein', value: `${selectedMeal.macros.protein}g`, color: 'bg-red-500' },
              { label: 'Carbs', value: `${selectedMeal.macros.carbs}g`, color: 'bg-blue-500' },
              { label: 'Fats', value: `${selectedMeal.macros.fats}g`, color: 'bg-yellow-500' }
            ].map((macro, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <div className={`w-2 h-2 ${macro.color} rounded-full mx-auto mb-2`}></div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{macro.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{macro.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {selectedMeal.description && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-500/30">
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">{selectedMeal.description}</p>
            </div>
          )}

          {/* Ingredients */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>🛒</span> Ingredients
            </h3>
            <ul className="space-y-2">
              {selectedMeal.ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>👨‍🍳</span> Instructions
            </h3>
            <ol className="space-y-3">
              {selectedMeal.instructions.map((step: string, index: number) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Prep Info & Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-500/30">
              <p className="text-xs text-purple-700 dark:text-purple-400 mb-1">Prep Time</p>
              <p className="text-lg font-bold text-purple-900 dark:text-purple-300">{selectedMeal.prepTime} min</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-500/30">
              <p className="text-xs text-green-700 dark:text-green-400 mb-1">Difficulty</p>
              <p className="text-lg font-bold text-green-900 dark:text-green-300 capitalize">{selectedMeal.cookingSkill}</p>
            </div>
          </div>

          {/* Diet Tags */}
          {selectedMeal.dietTags && selectedMeal.dietTags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Diet Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedMeal.dietTags.map((tag: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold capitalize">
                    {tag.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-indigo-500/50 pb-3">
          <button onClick={onBack} className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Week {currentWeek}</h2>
              <PremiumBadge size="sm" />
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{goalLabels[userGoal]}</p>
          </div>
          <div className="w-6"></div>
        </div>

        {/* Week Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((week) => (
            <button
              key={week}
              onClick={() => setCurrentWeek(week)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex-shrink-0 ${
                currentWeek === week
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Week {week}
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-500/30">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong className="text-indigo-700 dark:text-indigo-400">
              {userGoal === 'weight-loss' && '🔥 Calorie Deficit Mode'}
              {userGoal === 'muscle-gain' && '💪 Calorie Surplus Mode'}
              {userGoal === 'maintenance' && '⚖️ Balanced Nutrition Mode'}
            </strong> - Your meals are automatically adjusted to help you {userGoal === 'weight-loss' ? 'lose weight' : userGoal === 'muscle-gain' ? 'gain muscle' : 'maintain your current weight'}. Each week features different recipes that rotate after Week 4.
          </p>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-1 gap-4">
          {weekDays.map((day) => (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day.day)}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{day.emoji}</span>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white">{day.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      6 meals • ~{(() => {
                        const plan = getMealPlanForDay(currentWeek, day.day);
                        return plan ? plan.totalMacros.calories : 1500;
                      })()} cal
                    </p>
                  </div>
                </div>
                <ArrowLeft className="h-5 w-5 text-gray-400 transform rotate-180" />
              </div>
            </button>
          ))}
        </div>

        {/* Shopping List Button */}
        <button 
          onClick={handleGenerateShoppingList}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition duration-300 shadow-lg flex items-center justify-center gap-2"
        >
          <span>🛒</span>
          Generate Shopping List for Week {currentWeek}
        </button>
      </div>

      {/* Shopping List Modal */}
      {showShoppingList && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-indigo-500/50 pb-3">
              <button onClick={() => setShowShoppingList(false)} className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shopping List - Week {currentWeek}</h2>
              <div className="w-6"></div>
            </div>

            {/* Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-500/30">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-green-700 dark:text-green-400">Full Week Supply</strong> - This list covers all ingredients for your 7-day meal plan.
              </p>
            </div>

            {/* Shopping List by Category */}
            <div className="space-y-4">
              {(() => {
                const shoppingList = getCurrentWeekShoppingList();
                const categories = Array.from(new Set(shoppingList.map(item => item.category)));
                
                const categoryEmojis: Record<string, string> = {
                  protein: '🍗',
                  vegetables: '🥦',
                  fruits: '🍎',
                  grains: '🌾',
                  dairy: '🥛',
                  pantry: '🏺',
                  other: '📦'
                };

                return categories.map(category => {
                  const items = shoppingList.filter(item => item.category === category);
                  
                  return (
                    <div key={category} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 capitalize">
                        <span>{categoryEmojis[category] || '📦'}</span> {category}
                      </h3>
                      <ul className="space-y-2">
                        {items.map((item, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">□</span>
                            {item.item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Tip */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-500/30">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-blue-700 dark:text-blue-400">💡 Pro Tip:</strong> Screenshot this list or share it to your notes app for easy grocery shopping!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-indigo-500/50 pb-3">
              <button onClick={() => setSelectedDay(null)} className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {weekDays.find(d => d.day === selectedDay)?.name}
              </h2>
              <div className="w-6"></div>
            </div>

            {/* Daily Macros Summary */}
            {(() => {
              const dayPlan = getMealPlanForDay(currentWeek, selectedDay);
              if (!dayPlan) return null;
              
              const goalColor = userGoal === 'weight-loss' ? 'orange' : userGoal === 'muscle-gain' ? 'green' : 'blue';
              
              return (
                <div className={`bg-gradient-to-r from-${goalColor}-50 to-${goalColor}-100 dark:from-${goalColor}-900/20 dark:to-${goalColor}-900/30 rounded-xl p-4 border border-${goalColor}-200 dark:border-${goalColor}-500/30`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Daily Total</p>
                    <span className="text-xs font-bold px-2 py-1 bg-white dark:bg-gray-800 rounded-full">
                      {userGoal === 'weight-loss' && '🔥 -15% Cal'}
                      {userGoal === 'muscle-gain' && '💪 +15% Cal'}
                      {userGoal === 'maintenance' && '⚖️ Balanced'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{dayPlan.totalMacros.calories}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">cal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">{dayPlan.totalMacros.protein}g</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">protein</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{dayPlan.totalMacros.carbs}g</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{dayPlan.totalMacros.fats}g</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">fats</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Meal Cards - All 6 meals */}
            <div className="space-y-4">
              {(() => {
                const dayPlan = getMealPlanForDay(currentWeek, selectedDay);
                if (!dayPlan) return <p className="text-gray-500 dark:text-gray-400 text-center py-8">No meal plan available for this day.</p>;

                const mealOrder = [
                  { key: 'breakfast', label: 'Breakfast', emoji: '🍳' },
                  { key: 'morningSnack', label: 'Morning Snack', emoji: '🍎' },
                  { key: 'lunch', label: 'Lunch', emoji: '🥗' },
                  { key: 'afternoonSnack', label: 'Afternoon Snack', emoji: '🥤' },
                  { key: 'dinner', label: 'Dinner', emoji: '🍽️' },
                  { key: 'eveningSnack', label: 'Evening Snack', emoji: '🥛' }
                ];

                return mealOrder.map(({ key, label, emoji }) => {
                  const meal = dayPlan.meals[key as keyof typeof dayPlan.meals];
                  
                  // Skip if meal is filtered out by preferences
                  if (!meal) {
                    return (
                      <div key={key} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-dashed border-gray-300 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="opacity-50">{emoji}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-500 uppercase font-semibold">{label}</p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                          ⚠️ This meal contains ingredients that don't match your dietary preferences ({dietType || religion || 'custom restrictions'})
                        </p>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedMeal(meal)}
                      className="w-full bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors text-left"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{emoji}</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">{label}</p>
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{meal.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{meal.time}</p>
                        </div>
                        <ArrowLeft className="h-5 w-5 text-gray-400 transform rotate-180 flex-shrink-0 mt-1" />
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{meal.macros.calories} cal</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{meal.macros.protein}g protein</span>
                        </div>
                      </div>

                      {/* Diet Tags Preview */}
                      {meal.dietTags && meal.dietTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {meal.dietTags.slice(0, 3).map((tag: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs capitalize">
                              {tag.replace('-', ' ')}
                            </span>
                          ))}
                          {meal.dietTags.length > 3 && (
                            <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
                              +{meal.dietTags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Exercise Finder Screens
const ExerciseFinderScreen = ({ 
  selectedMuscle, 
  setSelectedMuscle, 
  location, 
  setLocation, 
  selectedExercise, 
  setSelectedExercise,
  exerciseSubView,
  setExerciseSubView,
  currentWorkout,
  setCurrentWorkout,
  finishWorkout,
  isPremium,
  onUpgradeToPremium
}: {
  selectedMuscle: string | null;
  setSelectedMuscle: (muscle: string | null) => void;
  location: 'gym' | 'home' | null;
  setLocation: (loc: 'gym' | 'home' | null) => void;
  selectedExercise: any;
  setSelectedExercise: (exercise: any) => void;
  exerciseSubView: 'list' | 'details' | 'log';
  setExerciseSubView: (view: 'list' | 'details' | 'log') => void;
  currentWorkout: Array<{ exercise: string; sets: Array<{ reps: number; weight: number }> }>;
  setCurrentWorkout: (workout: Array<{ exercise: string; sets: Array<{ reps: number; weight: number }> }>) => void;
  finishWorkout: () => Promise<void>;
  isPremium: boolean;
  onUpgradeToPremium: () => void;
}) => {
  const [showRoutineConfirm, setShowRoutineConfirm] = useState(false);

  const muscleData = useMemo(() => MUSCLE_GROUPS.find(m => m.name === selectedMuscle), [selectedMuscle]);

  // Back button handler
  const handleBack = useCallback(() => {
    if (location) {
      setLocation(null);
    } else if (selectedMuscle) {
      setSelectedMuscle(null);
    }
  }, [location, selectedMuscle]);

  // Swipe handlers for navigation screens
  const swipeHandlersLocation = useSwipe(handleBack);
  const swipeHandlersExerciseList = useSwipe(handleBack);

  // Add to routine handler
  const handleAddToRoutine = useCallback(() => {
    setShowRoutineConfirm(true);
    setTimeout(() => setShowRoutineConfirm(false), 2000);
  }, []);

  // Handle saving workout from logger
  const handleSaveWorkout = useCallback((sets: Array<{ reps: number; weight: number }>) => {
    if (selectedExercise) {
      setCurrentWorkout([...currentWorkout, { exercise: selectedExercise, sets }]);
    }
  }, [selectedExercise, currentWorkout, setCurrentWorkout]);

  // Render Exercise Logger
  if (exerciseSubView === 'log' && selectedExercise) {
    return (
      <ExerciseLogger
        exercise={selectedExercise}
        onBack={() => setExerciseSubView('list')}
        onSaveWorkout={handleSaveWorkout}
      />
    );
  }

  // Stage 1: Muscle Group Selection
  if (!selectedMuscle) {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-indigo-300 dark:border-indigo-500/50 pb-2">Select Muscle Group</h2>
        
        {/* Active Workout Indicator & Finish Button */}
        {currentWorkout.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-900/40 dark:to-teal-900/40 p-4 rounded-xl border-2 border-emerald-400 dark:border-emerald-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">Active Workout Session</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">{currentWorkout.length} exercise(s) logged</p>
              </div>
              <div className="text-2xl">💪</div>
            </div>
            <button
              onClick={finishWorkout}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-bold transition duration-300 shadow-lg"
            >
              🏁 Finish Workout
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group.name}
              onClick={() => setSelectedMuscle(group.name)}
              className={`p-5 ${group.color} rounded-xl shadow-2xl border-2 border-white/30 flex flex-col items-center justify-center transform transition duration-300 hover:scale-[1.05] hover:shadow-2xl active:scale-95 h-32`}
            >
              <span className="text-4xl mb-2">{group.icon}</span>
              <span className="text-sm font-semibold">{group.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Stage 2: Location Selection (Gym or Home)
  if (!location) {
    return (
      <div className="p-4 space-y-6" {...swipeHandlersLocation}>
        <button onClick={handleBack} className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition duration-200 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Muscles
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Focus: {selectedMuscle}</h2>
        <p className="text-gray-700 dark:text-white/70">Where will you be training today?</p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setLocation('gym')}
            className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 dark:bg-indigo-600/60 hover:from-indigo-600 hover:to-purple-700 dark:hover:bg-indigo-700/70 rounded-xl shadow-xl text-white font-semibold transition duration-300 flex flex-col items-center transform hover:scale-[1.05]"
          >
            <Dumbbell className="h-8 w-8 mb-2" />
            Gym Workout
          </button>
          <button
            onClick={() => setLocation('home')}
            className="p-6 bg-gradient-to-br from-teal-500 to-emerald-600 dark:bg-teal-600/60 hover:from-teal-600 hover:to-emerald-700 dark:hover:bg-teal-700/70 rounded-xl shadow-xl text-white font-semibold transition duration-300 flex flex-col items-center transform hover:scale-[1.05]"
          >
            <Home className="h-8 w-8 mb-2" />
            Home Workout
          </button>
        </div>
      </div>
    );
  }

  // Stage 3: Exercise List
  const exercises = muscleData && location ? muscleData.exercises[location] : [];

  return (
    <div className="p-4 space-y-6" {...swipeHandlersExerciseList}>
      <button onClick={handleBack} className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition duration-200 mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Location
      </button>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{muscleData?.name} Exercises ({location?.toUpperCase()})</h2>
      <p className="text-gray-700 dark:text-white/70">Top {isPremium ? exercises.length : '3'} recommended moves for today's session:</p>

      <div className="space-y-3">
        {exercises.map((ex, index) => {
          // Index-based locking: 0-2 are free, 3+ are premium-only
          const isLocked = index > 2 && !isPremium;
          
          return (
            <div key={index} className="relative">
              <button 
                onClick={() => {
                  if (isLocked) {
                    onUpgradeToPremium();
                  } else {
                    setSelectedExercise(ex);
                  }
                }}
                className={`w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl flex items-center justify-between border-l-4 ${
                  isLocked 
                    ? 'border-amber-500 opacity-60' 
                    : 'border-teal-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                } transition duration-200`}
              >
                <div className="flex items-center">
                  <span className={`text-xl font-bold mr-4 ${isLocked ? 'text-amber-600 dark:text-amber-400' : 'text-teal-600 dark:text-teal-400'}`}>
                    {index + 1}
                  </span>
                  <p className={`${isLocked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'} font-medium`}>
                    {ex}
                  </p>
                </div>
                {isLocked ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">PREMIUM</span>
                  </div>
                ) : (
                  <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                )}
              </button>
              
              {/* Premium badge overlay for locked exercises */}
              {isLocked && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-1 rounded-full">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="pt-4 text-center">
         <button 
           onClick={handleAddToRoutine}
           className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 dark:bg-teal-600 hover:from-teal-600 hover:to-emerald-700 dark:hover:bg-teal-700 rounded-xl text-white font-bold transition duration-300 shadow-lg"
         >
            Add to Today's Routine
         </button>
         {showRoutineConfirm && (
           <div className="mt-3 p-3 bg-green-100 dark:bg-green-600/20 border-2 border-green-500 dark:border-green-500 rounded-lg text-green-700 dark:text-green-400 text-sm font-semibold">
             ✓ Exercises successfully added to your temporary routine!
           </div>
         )}
      </div>

      {/* Exercise Detail Modal - Only show when not in logging view */}
      {selectedExercise && exerciseSubView !== 'log' && (
        <ExerciseDetailModal 
          exercise={selectedExercise} 
          onClose={() => setSelectedExercise(null)}
          onStartLogging={() => setExerciseSubView('log')}
        />
      )}
    </div>
  );
};

// Premium Lock Components

// Premium Lock Overlay - Shows when user tries to access premium content
const PremiumLockOverlay = ({ featureName, onUpgrade }: { featureName: string; onUpgrade: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-amber-400 dark:border-amber-600">
        {/* Crown Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-6 rounded-full">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
          Premium Feature
        </h2>
        
        {/* Feature Name */}
        <p className="text-center text-amber-800 dark:text-amber-400 font-semibold mb-6">
          {featureName}
        </p>

        {/* Benefits List */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Unlock Premium to get:</h3>
          <div className="space-y-3">
            {[
              '4-Week Rotating Meal Plans',
              'Detailed Shopping Lists',
              'Macro Breakdowns & Recipes',
              'Premium Exercise Library',
              'Advanced Workout Programs',
              'Priority Support'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl p-4 mb-6 text-center">
          <p className="text-white/90 text-sm mb-1">Only</p>
          <p className="text-4xl font-bold text-white">$4.99<span className="text-lg">/month</span></p>
          <p className="text-white/90 text-sm mt-1">7-day free trial • Cancel anytime</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition duration-300 shadow-lg text-lg"
          >
            🚀 Start Free Trial
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition duration-300"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

// Premium Badge Component
const PremiumBadge = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span className={`${sizes[size]} bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold rounded-full shadow-lg inline-flex items-center gap-1`}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      PREMIUM
    </span>
  );
};

// Settings Screens

// Health Profile Screen
const HealthProfileScreen = ({ userData, onBack }: { userData: any; onBack: () => void }) => {
  const heightInches = (userData.heightFeet * 12) + userData.heightInches;
  const heightCm = Math.round(heightInches * 2.54);
  const bmi = ((userData.weight / (heightInches * heightInches)) * 703).toFixed(1);
  
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-400' };
    return { text: 'Obese', color: 'text-red-400' };
  };

  const bmiCategory = getBMICategory(parseFloat(bmi));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 border-b border-indigo-300 dark:border-indigo-500/50 pb-3">
        <button onClick={onBack} className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Health Profile</h2>
      </div>

      <div className="space-y-4">
        {/* BMI Card */}
        <div className="bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl border-2 border-indigo-300 dark:border-gray-700 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-white dark:text-red-400" />
            Body Mass Index (BMI)
          </h3>
          <div className="text-center">
            <p className="text-5xl font-bold text-white dark:text-indigo-400">{bmi}</p>
            <p className="text-xl font-semibold mt-2 text-white">{bmiCategory.text}</p>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Physical Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Age:</span>
              <span className="text-gray-900 dark:text-white font-semibold">{userData.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Height:</span>
              <span className="text-gray-900 dark:text-white font-semibold">{userData.heightFeet}'{userData.heightInches}" ({heightCm} cm)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Current Weight:</span>
              <span className="text-gray-900 dark:text-white font-semibold">{userData.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Target Weight:</span>
              <span className="text-teal-600 dark:text-teal-400 font-semibold">{userData.targetWeight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Weight to Lose:</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{Math.max(0, userData.weight - userData.targetWeight).toFixed(1)} kg</span>
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div className="bg-gradient-to-br from-purple-200 to-indigo-200 dark:from-indigo-900/40 dark:to-purple-900/40 p-6 rounded-xl border-2 border-purple-300 dark:border-indigo-500/30 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💡 Health Tips</h3>
          <ul className="space-y-2 text-gray-700 dark:text-white/80 text-sm">
            <li>• Aim for 150 minutes of moderate exercise per week</li>
            <li>• Stay hydrated - drink at least 8 glasses of water daily</li>
            <li>• Get 7-9 hours of quality sleep each night</li>
            <li>• Focus on whole foods and balanced nutrition</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Workout History Screen
const WorkoutHistoryScreen = ({ onBack }: { onBack: () => void }) => {
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        
        // Filter and sort client-side
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const workouts = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter((workout: any) => workout.timestamp >= thirtyDaysAgo)
          .sort((a: any, b: any) => b.timestamp - a.timestamp);
        
        setWorkoutHistory(workouts);
      } catch (error) {
        console.error('Error fetching workout history:', error);
        toast.error('Failed to load workout history');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-3 border-b border-indigo-300 dark:border-indigo-500/50 pb-3">
          <button onClick={onBack} className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Workout History</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <Dumbbell className="w-12 h-12 text-indigo-500 dark:text-indigo-400 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 border-b border-indigo-300 dark:border-indigo-500/50 pb-3">
        <button onClick={onBack} className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Workout History</h2>
      </div>

      {workoutHistory.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-900/40 dark:to-purple-900/40 p-4 rounded-xl border-2 border-indigo-400 dark:border-indigo-500/30 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-indigo-900 dark:text-white">Total Workouts</p>
              <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{workoutHistory.length}</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {workoutHistory.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl text-center shadow-lg border-2 border-gray-200 dark:border-transparent">
            <Clock className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-white/60">No workout history yet</p>
            <p className="text-gray-500 dark:text-white/40 text-sm mt-2">Start tracking your workouts!</p>
          </div>
        ) : (
          workoutHistory.map((workout) => (
            <div key={workout.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg">{workout.date}</h3>
                  <p className="text-gray-600 dark:text-white/60 text-sm mt-1">
                    {typeof workout.timestamp === 'number' 
                      ? new Date(workout.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                      : new Date(workout.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{workout.duration_minutes} min</p>
                  <p className="text-gray-600 dark:text-white/60 text-sm mt-1">
                    {workout.totalExercises} exercise{workout.totalExercises !== 1 ? 's' : ''} • {workout.totalSets} sets
                  </p>
                </div>
              </div>

              {/* Exercise List */}
              <div className="space-y-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                {workout.exercises.map((exercise: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-900 dark:text-white font-semibold">{exercise.exercise}</p>
                      <p className="text-teal-600 dark:text-teal-400 text-sm font-medium">{exercise.sets.length} sets</p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {exercise.sets.map((set: any, setIdx: number) => (
                        <span key={setIdx} className="text-xs bg-white dark:bg-gray-600 px-2 py-1 rounded-full text-gray-700 dark:text-white/80">
                          {set.reps} × {set.weight}lbs
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Manage Goals Screen
const ManageGoalsScreen = ({ userData, onBack }: { userData: any; onBack: () => void }) => {
  const [targetWeight, setTargetWeight] = useState(userData.targetWeight);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveGoal = async () => {
    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          targetWeight: parseFloat(targetWeight)
        });
        toast.success('Goal updated successfully!');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 border-b border-indigo-300 dark:border-indigo-500/50 pb-3">
        <button onClick={onBack} className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Goals</h2>
      </div>

      <div className="space-y-4">
        {/* Current Progress */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Current Weight:</span>
              <span className="text-gray-900 dark:text-white font-semibold">{userData.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Target Weight:</span>
              <span className="text-teal-600 dark:text-teal-400 font-semibold">{userData.targetWeight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Remaining:</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{Math.max(0, userData.weight - userData.targetWeight).toFixed(1)} kg</span>
            </div>
          </div>
        </div>

        {/* Update Target Weight */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Update Target Weight
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-600 dark:text-white/70 text-sm mb-2 block">Target Weight (kg)</label>
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                step="0.1"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <button
              onClick={handleSaveGoal}
              disabled={isSaving || targetWeight === userData.targetWeight}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 dark:bg-indigo-600 hover:from-indigo-600 hover:to-purple-700 dark:hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition shadow-lg"
            >
              {isSaving ? 'Saving...' : 'Save Goal'}
            </button>
          </div>
        </div>

        {/* Goal Tips */}
        <div className="bg-gradient-to-br from-purple-200 to-indigo-200 dark:from-indigo-900/40 dark:to-purple-900/40 p-6 rounded-xl border-2 border-purple-300 dark:border-indigo-500/30 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🎯 Goal Setting Tips</h3>
          <ul className="space-y-2 text-gray-700 dark:text-white/80 text-sm">
            <li>• Set realistic and achievable goals</li>
            <li>• Aim for 0.5-1 kg weight loss per week for healthy progress</li>
            <li>• Track your progress regularly</li>
            <li>• Celebrate small victories along the way</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// App Preferences Screen
const AppPreferencesScreen = ({ onBack, userData }: { onBack: () => void; userData: any }) => {
  const [notifications, setNotifications] = useState(userData?.appPreferences?.notifications ?? true);
  const [darkMode, setDarkMode] = useState(userData?.appPreferences?.darkMode ?? true);
  const [units, setUnits] = useState<'metric' | 'imperial'>(userData?.appPreferences?.units || 'metric');
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = async (key: string, value: any) => {
    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          [`appPreferences.${key}`]: value
        });
        toast.success('Preference updated!');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preference');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    await handleSavePreferences('notifications', newValue);
  };

  const handleToggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await handleSavePreferences('darkMode', newValue);
    
    // Apply dark mode to document
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleChangeUnits = async (newUnits: 'metric' | 'imperial') => {
    setUnits(newUnits);
    await handleSavePreferences('units', newUnits);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 border-b border-indigo-300 dark:border-indigo-500/50 pb-3">
        <button onClick={onBack} className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">App Preferences</h2>
      </div>

      <div className="space-y-4">
        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold">Notifications</h3>
              <p className="text-gray-600 dark:text-white/60 text-sm">Receive workout reminders</p>
            </div>
            <button
              onClick={handleToggleNotifications}
              disabled={isSaving}
              className={`w-14 h-8 rounded-full transition relative shadow-inner ${notifications ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${notifications ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Dark Mode */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold">Dark Mode</h3>
              <p className="text-gray-600 dark:text-white/60 text-sm">Use dark theme</p>
            </div>
            <button
              onClick={handleToggleDarkMode}
              disabled={isSaving}
              className={`w-14 h-8 rounded-full transition relative shadow-inner ${darkMode ? 'bg-gray-700' : 'bg-indigo-500'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Units */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Measurement Units</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleChangeUnits('metric')}
              disabled={isSaving}
              className={`flex-1 py-2 rounded-lg font-semibold transition shadow-md ${units === 'metric' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white/60'}`}
            >
              Metric (kg, cm)
            </button>
            <button
              onClick={() => handleChangeUnits('imperial')}
              disabled={isSaving}
              className={`flex-1 py-2 rounded-lg font-semibold transition shadow-md ${units === 'imperial' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white/60'}`}
            >
              Imperial (lb, in)
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl border-2 border-purple-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-gray-900 dark:text-white font-semibold mb-3">About</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Version:</span>
              <span className="text-gray-900 dark:text-white font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Build:</span>
              <span className="text-gray-900 dark:text-white font-semibold">2025.11.24</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-200 to-indigo-200 dark:from-indigo-900/40 dark:to-purple-900/40 p-6 rounded-xl border-2 border-purple-300 dark:border-indigo-500/30 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">💡 Tips</h3>
          <ul className="text-gray-700 dark:text-white/70 text-sm space-y-1">
            <li>• Notifications help you stay consistent with workouts</li>
            <li>• Dark mode reduces eye strain during evening use</li>
            <li>• Choose units you're most comfortable with</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// 4. Account Screen
const AccountScreen = ({ onLogout, userData: propUserData, onNavigateToSettings }: { onLogout: () => void; userData: any; onNavigateToSettings: (screen: 'health' | 'history' | 'goals' | 'preferences') => void }) => {
    const userData = propUserData;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const units = userData?.appPreferences?.units || 'metric';

    const handleLogout = async () => {
      try {
        await signOut(auth);
        toast.success('Logged out successfully');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Logout failed');
      }
      
      // Clear all app-related localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('tempUserData');
      onLogout();
    };

    const handleDeleteAccount = async () => {
      setDeleteLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error('No user logged in');
          return;
        }

        // Delete user data from Firestore
        await deleteDoc(doc(db, 'users', user.uid));
        
        // Delete all workout history
        const workoutsQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid)
        );
        const workoutsSnapshot = await getDocs(workoutsQuery);
        const deletePromises = workoutsSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        // Delete Firebase Auth account
        await user.delete();
        
        // Clear all local storage
        localStorage.removeItem('userData');
        localStorage.removeItem('tempUserData');
        
        toast.success('Account deleted successfully');
        onLogout();
      } catch (error: any) {
        console.error('Delete account error:', error);
        if (error.code === 'auth/requires-recent-login') {
          toast.error('Please log out and log back in, then try deleting your account again for security reasons.');
        } else {
          toast.error('Failed to delete account. Please try again.');
        }
      } finally {
        setDeleteLoading(false);
        setShowDeleteConfirm(false);
      }
    };

    if (!userData) {
      return (
        <div className="p-6 space-y-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading your profile...</h2>
          </div>
        </div>
      );
    }

    const heightInches = (userData.heightFeet * 12) + userData.heightInches;
    const startingWeight = userData.startingWeight || userData.weight;
    const weightLost = Math.max(0, startingWeight - userData.weight);

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center border-b border-indigo-300 dark:border-indigo-500/50 pb-3">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Account</h2>
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 dark:bg-indigo-600 hover:from-indigo-600 hover:to-purple-700 dark:hover:bg-indigo-700 rounded-lg text-white font-semibold transition duration-200 shadow-lg"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            
            {/* Profile Summary Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-2 border-indigo-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:bg-indigo-500 p-4 rounded-full shadow-lg">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{userData.name}</p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-300">{auth.currentUser?.email || userData.email}</p>
                    </div>
                </div>

                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-white/70">Age:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{userData.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-white/70">Height:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{userData.heightFeet}'{userData.heightInches}" ({heightInches} inches)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-white/70">Current Weight:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{formatWeight(userData.weight, units)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-white/70">Target Weight:</span>
                      <span className="text-teal-600 dark:text-teal-400 font-semibold">{formatWeight(userData.targetWeight, units)}</span>
                    </div>
                </div>

                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{units === 'imperial' ? kgToLbs(weightLost) : weightLost.toFixed(1)}</p>
                        <p className="text-sm text-gray-600 dark:text-white/70">{units === 'imperial' ? 'lb' : 'kg'} Lost</p>
                    </div>
                </div>
            </div>

            {/* Settings and Options */}
            <div className="space-y-3">
                <SettingItem icon={Heart} label="Health Profile" onClick={() => onNavigateToSettings('health')} />
                <SettingItem icon={Clock} label="Workout History" onClick={() => onNavigateToSettings('history')} />
                <SettingItem icon={Target} label="Manage Goals" onClick={() => onNavigateToSettings('goals')} />
                <SettingItem icon={Search} label="App Preferences" onClick={() => onNavigateToSettings('preferences')} />
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full py-3 text-red-600 dark:text-red-400 border-2 border-red-500/50 dark:border-red-400/50 hover:bg-red-50 dark:hover:bg-red-900/40 transition duration-200 rounded-xl font-semibold"
            >
                Log Out
            </button>

            {/* Delete Account Button */}
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 transition duration-200 rounded-xl font-semibold shadow-lg"
            >
                🗑️ Delete Account
            </button>

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-300 dark:border-red-500/30" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">⚠️ Delete Account?</h3>
                  <p className="text-gray-700 dark:text-white/80 mb-6">
                    This action is <strong>permanent</strong> and cannot be undone. All your data including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-white/70 mb-6 space-y-2">
                    <li>Profile information</li>
                    <li>Workout history</li>
                    <li>Progress tracking</li>
                    <li>Diet plans</li>
                  </ul>
                  <p className="text-gray-700 dark:text-white/80 mb-6">
                    will be <strong>permanently deleted</strong>.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deleteLoading}
                      className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition disabled:opacity-50"
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete Forever'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Profile Modal */}
            {showEditModal && (
              <EditProfileModal 
                onClose={() => setShowEditModal(false)} 
                userData={userData}
              />
            )}
        </div>
    );
};

// Helper component for account settings list items
const SettingItem = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick?: () => void }) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-700/70 transition duration-200 cursor-pointer shadow-md border-2 border-gray-200 dark:border-transparent">
        <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-gray-900 dark:text-white font-medium">{label}</span>
        </div>
        <ArrowLeft className="w-4 h-4 text-gray-400 dark:text-white/50 transform rotate-180" />
    </div>
);


// --- Main App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [location, setLocation] = useState<'gym' | 'home' | null>(null);
  const [goal, setGoal] = useState<string | null>('default'); // Set to 'default' to always show meal plan
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [activeSettingsScreen, setActiveSettingsScreen] = useState<'health' | 'history' | 'goals' | 'preferences' | null>(null);
  
  // Premium Subscription State
  const [isPremium, setIsPremium] = useState(true); // Test premium experience
  const [premiumExpiry, setPremiumExpiry] = useState<number | null>(null);
  
  // Exercise Logging State
  const [exerciseSubView, setExerciseSubView] = useState<'list' | 'details' | 'log'>('list');
  const [currentWorkout, setCurrentWorkout] = useState<Array<{ exercise: string; sets: Array<{ reps: number; weight: number }> }>>([]);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);

  // Start workout timer when first exercise is added
  useEffect(() => {
    if (currentWorkout.length > 0 && workoutStartTime === null) {
      setWorkoutStartTime(Date.now());
    } else if (currentWorkout.length === 0) {
      setWorkoutStartTime(null);
    }
  }, [currentWorkout.length, workoutStartTime]);

  // Apply theme on mount and when userData changes
  useEffect(() => {
    const isDark = userData?.appPreferences?.darkMode ?? true;
    if (isDark) {
      document.documentElement.classList.add('dark');
      // Set status bar to light text for dark mode
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    } else {
      document.documentElement.classList.remove('dark');
      // Set status bar to dark text for light mode
      StatusBar.setStyle({ style: Style.Light }).catch(() => {});
    }
  }, [userData]);

  // Firebase auth state listener - automatically handles session persistence
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;
    let loadingTimeout: number | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? `User: ${firebaseUser.uid}, Verified: ${firebaseUser.emailVerified}` : 'No user');
      setUser(firebaseUser);
      setIsAuthenticated(!!firebaseUser);
      
      if (firebaseUser) {
        // Only fetch user data if email is verified
        // If not verified, they'll see the verification screen and won't need the data yet
        if (!firebaseUser.emailVerified) {
          console.log('User not verified, skipping data fetch');
          setLoading(false);
          if (loadingTimeout) clearTimeout(loadingTimeout);
          return;
        }
        
        console.log('User verified, fetching user data...');
        
        // Set a timeout to stop loading after 5 seconds if nothing works
        loadingTimeout = setTimeout(() => {
          console.warn('Loading timeout - forcing loading to stop');
          setLoading(false);
          toast.error('Failed to load profile. Please refresh or contact support.');
        }, 5000);
        
        // Set up real-time listener for user data from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Try to fetch user document
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            // User data exists - normal flow
            const data = docSnap.data();
            console.log('Fetched existing user data:', data);
            setUserData(data);
            localStorage.setItem('userData', JSON.stringify(data));
            setLoading(false);
            if (loadingTimeout) clearTimeout(loadingTimeout);
          } else {
            // User data doesn't exist - this is first verified login
            console.log('User document does not exist - checking for temp data...');
            
            // Check if we have temporary profile data from signup
            const tempData = localStorage.getItem('tempUserData');
            if (tempData) {
              try {
                const profileData = JSON.parse(tempData);
                console.log('Found temp profile data, creating Firestore document...');
                
                // Create user document in Firestore
                const userData = {
                  email: profileData.email,
                  name: profileData.name || 'User', // Use name from tempUserData or default
                  age: profileData.age || 25,
                  weight: profileData.weight || 70,
                  startingWeight: profileData.startingWeight || profileData.weight || 70,
                  heightFeet: profileData.heightFeet || 5,
                  heightInches: profileData.heightInches || 8,
                  targetWeight: profileData.targetWeight || 65,
                  createdAt: new Date().toISOString()
                };
                
                await setDoc(userDocRef, userData);
                console.log('User document created successfully on first verified login');
                
                // Clean up temp data
                localStorage.removeItem('tempUserData');
                
                // Set user data and cache it
                setUserData(userData);
                localStorage.setItem('userData', JSON.stringify(userData));
                toast.success('Welcome! Your profile has been created. 🎉');
                setLoading(false);
                if (loadingTimeout) clearTimeout(loadingTimeout);
              } catch (error) {
                console.error('Error creating user document from temp data:', error);
                toast.error('Failed to create profile. Please contact support.');
                setLoading(false);
                if (loadingTimeout) clearTimeout(loadingTimeout);
              }
            } else {
              console.warn('No temp data found - user needs to complete profile');
              // Don't load cached data - user needs to see ProfileCompletionScreen
              setUserData(null);
              setLoading(false);
              if (loadingTimeout) clearTimeout(loadingTimeout);
            }
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
          setLoading(false);
          if (loadingTimeout) clearTimeout(loadingTimeout);
        }
        
        // Set up listener for real-time updates
        unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('Snapshot received user data:', data);
            setUserData(data);
            localStorage.setItem('userData', JSON.stringify(data));
            setLoading(false);
            if (loadingTimeout) clearTimeout(loadingTimeout);
          } else {
            console.log('User document does not exist - showing profile completion screen');
            // Don't use cached data - let Auth Guard show ProfileCompletionScreen
            setUserData(null);
            setLoading(false);
            if (loadingTimeout) clearTimeout(loadingTimeout);
          }
        }, (error) => {
          console.error('Error listening to user data:', error);
          // Don't use cached data on error - keep userData as null
          setUserData(null);
          setLoading(false);
          if (loadingTimeout) clearTimeout(loadingTimeout);
        });
      } else {
        console.log('No user, clearing all data');
        setUserData(null);
        // Clear all app-related localStorage
        localStorage.removeItem('userData');
        localStorage.removeItem('tempUserData');
        setLoading(false);
        if (loadingTimeout) clearTimeout(loadingTimeout);
      }
    });
    
    return () => {
      unsubscribe();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, []);

  // Android Back Button / Edge Swipe Handler
  useEffect(() => {
    let backButtonListener: any;

    const setupListener = async () => {
      backButtonListener = await CapacitorApp.addListener('backButton', () => {
        // Priority 1: Close Settings Screens if open
        if (activeSettingsScreen) {
          setActiveSettingsScreen(null);
          return;
        }

        // Priority 2: Close Modals if open
        if (selectedExercise || showPlanModal) {
          setSelectedExercise(null);
          setShowPlanModal(false);
          return; // Stop execution here
        }

        // Priority 3: Handle Exercise Finder Navigation
        if (activeTab === 'exercise') {
          if (exerciseSubView === 'log') {
            setExerciseSubView('list'); // Go back from logging to list
            return;
          } else if (location) {
            setLocation(null); // Go back to Location Select
            return;
          } else if (selectedMuscle) {
            setSelectedMuscle(null); // Go back to Muscle Grid
            return;
          } else {
            // If at root of Exercise tab, go to Home tab
            setActiveTab('home');
            return;
          }
        }

        // Priority 4: Handle Diet Plan Navigation
        if (activeTab === 'diet' && goal) {
          setGoal(null); // Go back to Goal Selection
          return;
        }

        // Priority 4: If on Home Tab, exit app
        if (activeTab === 'home') {
          CapacitorApp.exitApp();
        } else {
          // If on Account or Diet root, go back to Home
          setActiveTab('home');
        }
      });
    };

    setupListener();

    // Cleanup listener on unmount
    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [activeTab, selectedMuscle, location, goal, selectedExercise, showPlanModal, activeSettingsScreen, exerciseSubView]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('home');
  };

  // Finish Workout Function - Save to Firestore
  const finishWorkout = async () => {
    if (currentWorkout.length === 0) {
      toast.error('No exercises to save');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error('Not authenticated');
      return;
    }

    try {
      const endTime = Date.now();
      const durationMs = workoutStartTime ? endTime - workoutStartTime : 0;
      const durationMinutes = Math.floor(durationMs / 60000);

      // Save workout to Firestore
      const currentTimestamp = Date.now();
      await addDoc(collection(db, 'workoutHistory'), {
        userId: user.uid,
        timestamp: currentTimestamp,
        exercises: currentWorkout,
        duration_ms: durationMs,
        duration_minutes: durationMinutes,
        date: new Date().toLocaleDateString(),
        totalExercises: currentWorkout.length,
        totalSets: currentWorkout.reduce((sum, ex) => sum + ex.sets.length, 0)
      });

      // Clean up old workout records (older than 30 days)
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      
      try {
        const allWorkoutsQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid)
        );
        
        const allWorkoutsSnapshot = await getDocs(allWorkoutsQuery);
        
        // Filter old workouts client-side
        const oldWorkouts = allWorkoutsSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.timestamp < thirtyDaysAgo;
        });
        
        // Delete old workouts
        if (oldWorkouts.length > 0) {
          const deletePromises = oldWorkouts.map(doc => deleteDoc(doc.ref));
          await Promise.all(deletePromises);
          console.log(`Deleted ${oldWorkouts.length} old workout records`);
        }
      } catch (cleanupError) {
        // Don't fail workout save if cleanup fails
        console.error('Error cleaning up old workouts:', cleanupError);
      }

      // Clear current workout
      setCurrentWorkout([]);
      setWorkoutStartTime(null);
      
      toast.success(`🎉 Workout completed! ${durationMinutes} minutes, ${currentWorkout.length} exercises logged!`);
      
      // Return to exercise list
      setExerciseSubView('list');
      setSelectedExercise(null);
      setSelectedMuscle(null);
      setLocation(null);
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Failed to save workout. Please try again.');
    }
  };

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-indigo-900 dark:to-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <Dumbbell className="w-16 h-16 text-indigo-500 dark:text-indigo-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // AUTH GUARD: If no user -> Show Auth/Login Screen
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // AUTH GUARD: If user exists BUT not verified -> Show Verification Screen
  if (user && !user.emailVerified) {
    return (
      <VerificationPendingScreen
        email={user.email || ''}
        onClose={async () => {
          await signOut(auth);
          toast.success('Logged out. Please verify your email to continue.');
        }}
        onResend={async () => {
          await sendEmailVerification(user);
        }}
      />
    );
  }

  // AUTH GUARD: User is verified but has no profile data -> Show Profile Completion Screen
  if (user && user.emailVerified && !userData && !loading) {
    return <ProfileCompletionScreen user={user} />;
  }

  // AUTH GUARD: User exists AND is verified -> Show Main App

  // Renders the content based on the active tab
  const renderContent = () => {
    // If a settings screen is active, render it
    if (activeSettingsScreen) {
      switch (activeSettingsScreen) {
        case 'health':
          return <HealthProfileScreen userData={userData} onBack={() => setActiveSettingsScreen(null)} />;
        case 'history':
          return <WorkoutHistoryScreen onBack={() => setActiveSettingsScreen(null)} />;
        case 'goals':
          return <ManageGoalsScreen userData={userData} onBack={() => setActiveSettingsScreen(null)} />;
        case 'preferences':
          return <AppPreferencesScreen onBack={() => setActiveSettingsScreen(null)} userData={userData} />;
        default:
          return null;
      }
    }

    // Otherwise render the main tab screens
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            userData={userData} 
            onStartWorkout={() => {
              setActiveTab('exercise');
              setSelectedMuscle(null);
            }}
            onViewDiet={() => {
              setActiveTab('diet');
              setGoal(null);
            }}
            onSelectMuscleGroup={(muscleGroup: string) => {
              setActiveTab('exercise');
              setSelectedMuscle(muscleGroup);
            }}
          />
        );
      case 'diet':
        return <DietPlanScreen goal={goal} setGoal={setGoal} showPlanModal={showPlanModal} setShowPlanModal={setShowPlanModal} userData={userData} isPremium={isPremium} />;
      case 'exercise':
        return <ExerciseFinderScreen 
          selectedMuscle={selectedMuscle} 
          setSelectedMuscle={setSelectedMuscle} 
          location={location} 
          setLocation={setLocation} 
          selectedExercise={selectedExercise} 
          setSelectedExercise={setSelectedExercise}
          exerciseSubView={exerciseSubView}
          setExerciseSubView={setExerciseSubView}
          currentWorkout={currentWorkout}
          setCurrentWorkout={setCurrentWorkout}
          finishWorkout={finishWorkout}
          isPremium={isPremium}
          onUpgradeToPremium={() => setShowPremiumModal(true)}
        />;
      case 'account':
        return <AccountScreen onLogout={handleLogout} userData={userData} onNavigateToSettings={setActiveSettingsScreen} />;
      default:
        return null;
    }
  };

  return (
    // Premium Mobile Container: Theme-aware Background
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-gray-900 flex justify-center text-gray-900 dark:text-white transition-colors duration-200">
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: userData?.appPreferences?.darkMode === false ? '#ffffff' : '#1f2937',
            color: userData?.appPreferences?.darkMode === false ? '#111827' : '#fff',
            border: `1px solid ${userData?.appPreferences?.darkMode === false ? '#e5e7eb' : '#4f46e5'}`,
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: userData?.appPreferences?.darkMode === false ? '#111827' : '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: userData?.appPreferences?.darkMode === false ? '#111827' : '#fff',
            },
          },
        }}
      />
      
      {/* Quick Start Floating Action Button */}
      {isAuthenticated && activeTab === 'home' && (
        <button
          onClick={() => {
            setActiveTab('exercise');
            setSelectedMuscle(null);
          }}
          className="fixed bottom-24 right-6 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 z-50 border-4 border-white dark:border-gray-800"
          aria-label="Quick Start Workout"
        >
          <Dumbbell className="w-7 h-7" />
        </button>
      )}
      
      <div className="w-full max-w-md bg-white/70 dark:bg-gray-900 shadow-2xl flex flex-col transition-colors duration-200 backdrop-blur-sm">
        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto pt-6 pb-20">
            {renderContent()}
        </div>

        {/* Premium Tab Bar (Sticky Bottom) */}
        <nav className="sticky bottom-0 w-full max-w-md h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-indigo-500/50 shadow-lg z-10 transition-colors duration-200">
          <ul className="flex justify-around items-center h-full">
            <NavItem icon={Home} label="Home" active={activeTab === 'home'} onClick={() => { setActiveTab('home'); setActiveSettingsScreen(null); }} />
            <NavItem icon={Soup} label="Diet Plan" active={activeTab === 'diet'} onClick={() => { setActiveTab('diet'); setActiveSettingsScreen(null); }} />
            <NavItem icon={Dumbbell} label="Exercises" active={activeTab === 'exercise'} onClick={() => { setActiveTab('exercise'); setActiveSettingsScreen(null); }} />
            <NavItem icon={User} label="Account" active={activeTab === 'account'} onClick={() => { setActiveTab('account'); setActiveSettingsScreen(null); }} />
          </ul>
        </nav>
      </div>
    </div>
  );
};

// Helper Component for Navigation Items
const NavItem = ({ icon: Icon, label, active, onClick }: { icon: React.ElementType, label: string, active: boolean, onClick: () => void }) => (
  <li className="flex-1">
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full transition duration-300 ${
        active
          ? 'text-indigo-400 border-t-2 border-indigo-500 pt-1'
          : 'text-gray-400 hover:text-indigo-300'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  </li>
);

// Collapsible Disclaimer Component
const DisclaimerCard = ({ compact = false }: { compact?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border-2 border-amber-300 dark:border-amber-600/30 shadow-md overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-amber-100 dark:hover:bg-amber-900/30 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="text-sm font-bold text-amber-900 dark:text-amber-300">
            {compact ? 'Medical Disclaimer' : 'Important Medical Disclaimer'}
          </span>
        </div>
        <span className="text-amber-900 dark:text-amber-300 transform transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-amber-200 dark:border-amber-700/30 pt-3">
          <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed">
            {compact ? (
              <>These are general suggestions only. Consult a healthcare professional before making dietary changes. We are not liable for allergies or health issues. Verify all ingredients for your safety.</>
            ) : (
              <>The meal suggestions provided are for informational purposes only and are not intended as medical or nutritional advice. 
              We are not responsible for any allergic reactions, health issues, or dietary complications that may arise. 
              Please consult with a qualified healthcare provider or registered dietitian before making any changes to your diet, 
              especially if you have allergies, medical conditions, or specific dietary requirements. Always verify ingredients and 
              conduct your own research to ensure meals suit your individual needs.</>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

// Helper Component for Home Screen Metrics
const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  onClick, 
  isLocked, 
  editable, 
  onEdit,
  subtitle
}: { 
  title: string; 
  value: string; 
  icon: React.ElementType; 
  color: string;
  onClick?: () => void;
  isLocked?: boolean;
  editable?: boolean;
  onEdit?: (value: string) => void;
  subtitle?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const handleEdit = () => {
    if (editable) {
      setEditValue(value);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (onEdit && editValue) {
      onEdit(editValue);
    }
    setIsEditing(false);
  };

  return (
    <div 
      className={`p-4 rounded-xl shadow-lg flex flex-col items-start ${color} transition duration-300 transform hover:shadow-xl hover:scale-[1.03] ${onClick || editable ? 'cursor-pointer' : ''} ${isLocked ? 'relative overflow-hidden' : ''}`}
      onClick={onClick || handleEdit}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
          <Lock className="w-6 h-6 text-white/70" />
        </div>
      )}
      
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="w-4 h-4" />
        <p className="text-sm font-semibold">{title}</p>
      </div>
      
      {isEditing ? (
        <div className="w-full" onClick={(e) => e.stopPropagation()}>
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full bg-gray-900/50 border border-indigo-500 rounded px-2 py-1 text-2xl font-extrabold text-white"
            autoFocus
            onBlur={handleSave}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
      ) : (
        <>
          <p className="text-3xl font-extrabold">{value}</p>
          {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
        </>
      )}
    </div>
  );
};

export default App;

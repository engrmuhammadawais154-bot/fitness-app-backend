import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import React from 'react';
// Using lucide-react for modern, clean icons (assumed available in the environment)
import { Home, Dumbbell, Soup, User, ArrowLeft, Heart, Target, TrendingUp, TrendingDown, Clock, Search, Mail, Lock, Eye, EyeOff, Edit, X, RefreshCw, Award, Trophy, ChevronRight, Play, Trash2, CheckCircle } from 'lucide-react';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { LocalNotifications } from '@capacitor/local-notifications';
import HealthConnect from './plugins/HealthConnect';
import { auth, db } from './firebase';
import { APP_VERSION, BUILD_DATE } from './config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, updateDoc, collection, addDoc, query, where, getDocs, deleteDoc, orderBy, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { WEEK_1_WEIGHT_LOSS, WEEK_1_MAINTENANCE, generateShoppingList, type Meal } from './mealPlans';
import { 
  LOW_BUDGET_WEIGHT_LOSS, 
  MEDIUM_BUDGET_WEIGHT_LOSS, 
  HIGH_BUDGET_WEIGHT_LOSS,
  LOW_BUDGET_MUSCLE_GAIN,
  MEDIUM_BUDGET_MUSCLE_GAIN,
  HIGH_BUDGET_MUSCLE_GAIN,
  LOW_BUDGET_MAINTENANCE,
  MEDIUM_BUDGET_MAINTENANCE,
  HIGH_BUDGET_MAINTENANCE
} from './mealPlansBudget';
import {
  LOW_BUDGET_HINDU_WEIGHT_LOSS,
  MEDIUM_BUDGET_HINDU_WEIGHT_LOSS,
  HIGH_BUDGET_HINDU_WEIGHT_LOSS,
  LOW_BUDGET_HINDU_MUSCLE_GAIN,
  MEDIUM_BUDGET_HINDU_MUSCLE_GAIN,
  HIGH_BUDGET_HINDU_MUSCLE_GAIN,
  LOW_BUDGET_HINDU_MAINTENANCE,
  MEDIUM_BUDGET_HINDU_MAINTENANCE,
  HIGH_BUDGET_HINDU_MAINTENANCE
} from './mealPlansHindu';
import {
  LOW_BUDGET_KOSHER_WEIGHT_LOSS,
  MEDIUM_BUDGET_KOSHER_WEIGHT_LOSS,
  HIGH_BUDGET_KOSHER_WEIGHT_LOSS,
  LOW_BUDGET_KOSHER_MUSCLE_GAIN,
  MEDIUM_BUDGET_KOSHER_MUSCLE_GAIN,
  HIGH_BUDGET_KOSHER_MUSCLE_GAIN,
  LOW_BUDGET_KOSHER_MAINTENANCE,
  MEDIUM_BUDGET_KOSHER_MAINTENANCE,
  HIGH_BUDGET_KOSHER_MAINTENANCE
} from './mealPlansKosher';
import {
  LOW_BUDGET_CHRISTIAN_WEIGHT_LOSS,
  MEDIUM_BUDGET_CHRISTIAN_WEIGHT_LOSS,
  HIGH_BUDGET_CHRISTIAN_WEIGHT_LOSS,
  LOW_BUDGET_CHRISTIAN_MUSCLE_GAIN,
  MEDIUM_BUDGET_CHRISTIAN_MUSCLE_GAIN,
  HIGH_BUDGET_CHRISTIAN_MUSCLE_GAIN,
  LOW_BUDGET_CHRISTIAN_MAINTENANCE,
  MEDIUM_BUDGET_CHRISTIAN_MAINTENANCE,
  HIGH_BUDGET_CHRISTIAN_MAINTENANCE
} from './mealPlansChristian';

// ==========================================
// PERFORMANCE: Disable console.log in production
// ==========================================
const isDev = import.meta.env.DEV;
const log = isDev ? console.log.bind(console) : () => {};
const warn = isDev ? console.warn.bind(console) : () => {};

// Simplified budget-based meal preferences
const mealStyles = [
  { id: 'budget-friendly', name: 'Budget Friendly', desc: 'Affordable meals ($5-8/day)', icon: '💰', budget: 'low', cookingSkill: 'intermediate' },
  { id: 'medium-budget', name: 'Medium Budget', desc: 'Balanced quality ($10-15/day)', icon: '⚖️', budget: 'medium', cookingSkill: 'intermediate' },
  { id: 'expensive', name: 'Premium', desc: 'High-end ingredients ($20-30/day)', icon: '💎', budget: 'high', cookingSkill: 'intermediate' },
];

// Custom dismissible toast helper - shows toast with X button to close and swipe to dismiss
const showDismissibleToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  return toast.custom(
    (t) => {
      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      
      const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        const el = e.currentTarget;
        el.style.transition = 'none';
      };
      
      const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        const el = e.currentTarget;
        el.style.transform = `translateX(${deltaX}px)`;
        el.style.opacity = `${1 - Math.abs(deltaX) / 200}`;
      };
      
      const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        isDragging = false;
        const deltaX = currentX - startX;
        const el = e.currentTarget;
        
        if (Math.abs(deltaX) > 80) {
          // Swipe threshold met - dismiss
          el.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
          el.style.transform = `translateX(${deltaX > 0 ? 300 : -300}px)`;
          el.style.opacity = '0';
          setTimeout(() => toast.dismiss(t.id), 200);
        } else {
          // Reset position
          el.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
          el.style.transform = 'translateX(0)';
          el.style.opacity = '1';
        }
      };
      
      return (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-[90vw] w-full bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex items-center justify-between ring-1 ring-black ring-opacity-5 p-3 cursor-grab active:cursor-grabbing`}
          style={{
            background: type === 'success' ? '#065f46' : type === 'error' ? '#991b1b' : '#1f2937',
            border: `1px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#4f46e5'}`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg">
              {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-3 flex-shrink-0 rounded-md p-1.5 inline-flex text-white hover:bg-white/20 focus:outline-none transition"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    },
    { duration: 5000 }
  );
};

// Swipeable toast wrappers - these replace toast.success/error/info with swipeable versions
const swipeableToast = {
  success: (message: string, icon?: string) => {
    return toast.custom(
      (t) => {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
          startX = e.touches[0].clientX;
          isDragging = true;
          const el = e.currentTarget;
          el.style.transition = 'none';
        };
        
        const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
          if (!isDragging) return;
          currentX = e.touches[0].clientX;
          const deltaX = currentX - startX;
          const el = e.currentTarget;
          el.style.transform = `translateX(${deltaX}px)`;
          el.style.opacity = `${1 - Math.abs(deltaX) / 200}`;
        };
        
        const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
          if (!isDragging) return;
          isDragging = false;
          const deltaX = currentX - startX;
          const el = e.currentTarget;
          
          if (Math.abs(deltaX) > 80) {
            el.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
            el.style.transform = `translateX(${deltaX > 0 ? 300 : -300}px)`;
            el.style.opacity = '0';
            setTimeout(() => toast.dismiss(t.id), 200);
          } else {
            el.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
            el.style.transform = 'translateX(0)';
            el.style.opacity = '1';
          }
        };
        
        return (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-[90vw] w-full shadow-lg rounded-lg pointer-events-auto flex items-center gap-2 p-3`}
            style={{ background: '#065f46', border: '1px solid #10b981' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <span className="text-lg">{icon || '✅'}</span>
            <p className="text-sm font-medium text-white flex-1">{message}</p>
          </div>
        );
      },
      { duration: 4000 }
    );
  },
  
  error: (message: string) => {
    return toast.custom(
      (t) => {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
          startX = e.touches[0].clientX;
          isDragging = true;
          const el = e.currentTarget;
          el.style.transition = 'none';
        };
        
        const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
          if (!isDragging) return;
          currentX = e.touches[0].clientX;
          const deltaX = currentX - startX;
          const el = e.currentTarget;
          el.style.transform = `translateX(${deltaX}px)`;
          el.style.opacity = `${1 - Math.abs(deltaX) / 200}`;
        };
        
        const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
          if (!isDragging) return;
          isDragging = false;
          const deltaX = currentX - startX;
          const el = e.currentTarget;
          
          if (Math.abs(deltaX) > 80) {
            el.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
            el.style.transform = `translateX(${deltaX > 0 ? 300 : -300}px)`;
            el.style.opacity = '0';
            setTimeout(() => toast.dismiss(t.id), 200);
          } else {
            el.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
            el.style.transform = 'translateX(0)';
            el.style.opacity = '1';
          }
        };
        
        return (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-[90vw] w-full shadow-lg rounded-lg pointer-events-auto flex items-center gap-2 p-3`}
            style={{ background: '#991b1b', border: '1px solid #ef4444' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <span className="text-lg">❌</span>
            <p className="text-sm font-medium text-white flex-1">{message}</p>
          </div>
        );
      },
      { duration: 4000 }
    );
  },
  
  info: (message: string, icon?: string) => {
    return toast.custom(
      (t) => {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
          startX = e.touches[0].clientX;
          isDragging = true;
          const el = e.currentTarget;
          el.style.transition = 'none';
        };
        
        const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
          if (!isDragging) return;
          currentX = e.touches[0].clientX;
          const deltaX = currentX - startX;
          const el = e.currentTarget;
          el.style.transform = `translateX(${deltaX}px)`;
          el.style.opacity = `${1 - Math.abs(deltaX) / 200}`;
        };
        
        const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
          if (!isDragging) return;
          isDragging = false;
          const deltaX = currentX - startX;
          const el = e.currentTarget;
          
          if (Math.abs(deltaX) > 80) {
            el.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
            el.style.transform = `translateX(${deltaX > 0 ? 300 : -300}px)`;
            el.style.opacity = '0';
            setTimeout(() => toast.dismiss(t.id), 200);
          } else {
            el.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
            el.style.transform = 'translateX(0)';
            el.style.opacity = '1';
          }
        };
        
        return (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-[90vw] w-full shadow-lg rounded-lg pointer-events-auto flex items-center gap-2 p-3`}
            style={{ background: '#1f2937', border: '1px solid #4f46e5' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <span className="text-lg">{icon || 'ℹ️'}</span>
            <p className="text-sm font-medium text-white flex-1">{message}</p>
          </div>
        );
      },
      { duration: 4000 }
    );
  }
};

// --- Custom Hooks ---

// Helper hook for swipe detection with debouncing and improved scroll detection
const useSwipe = (onSwipeRight?: () => void, onSwipeLeft?: () => void) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const lastSwipeTime = useRef<number>(0);
  const isSwipingRef = useRef<boolean>(false);
  
  const minSwipeDistance = 80; // Increased threshold to prevent accidental triggers
  const debounceTime = 300; // Prevent rapid swipes (ms)
  const maxVerticalDeviation = 50; // Maximum vertical movement allowed for horizontal swipe
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    isSwipingRef.current = false;
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    
    setTouchEnd({ x: currentX, y: currentY });
    
    // Detect if user is clearly trying to scroll vertically
    const deltaX = Math.abs(currentX - touchStart.x);
    const deltaY = Math.abs(currentY - touchStart.y);
    
    // If vertical movement is dominant, disable swipe
    if (deltaY > deltaX * 1.5) {
      isSwipingRef.current = false;
    } else if (deltaX > 20) {
      isSwipingRef.current = true;
    }
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    // Check debounce time
    const now = Date.now();
    if (now - lastSwipeTime.current < debounceTime) {
      return;
    }
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = Math.abs(touchStart.y - touchEnd.y); // Fixed: was touchStart.y - touchEnd.y (wrong calculation)
    
    // Only trigger swipe if:
    // 1. Horizontal movement exceeds threshold
    // 2. Vertical deviation is minimal (not scrolling)
    // 3. User was clearly swiping horizontally
    if (Math.abs(distanceX) > minSwipeDistance && 
        distanceY < maxVerticalDeviation && 
        isSwipingRef.current) {
      
      const isLeftSwipe = distanceX > 0;
      const isRightSwipe = distanceX < 0;
      
      if (isRightSwipe && onSwipeRight) {
        lastSwipeTime.current = now;
        onSwipeRight();
      }
      if (isLeftSwipe && onSwipeLeft) {
        lastSwipeTime.current = now;
        onSwipeLeft();
      }
    }
    
    // Reset
    setTouchStart(null);
    setTouchEnd(null);
    isSwipingRef.current = false;
  };
  
  return { onTouchStart, onTouchMove, onTouchEnd };
};

// Hook for handling Escape key in modals
const useEscapeKey = (onEscape: () => void, isActive: boolean = true) => {
  useEffect(() => {
    if (!isActive) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, isActive]);
};

// Hook for persistent active workout state - prevents data loss on refresh
interface ActiveWorkoutState {
  exercises: Array<{ 
    exercise: string; 
    sets: Array<{ 
      reps: number; 
      weight: number; 
      type: 'normal' | 'warmup' | 'drop' | 'failure';
      completed: boolean;
    }> 
  }>;
  startTime: number; // Timestamp when workout started
  lastUpdated: number;
}

const ACTIVE_WORKOUT_KEY = 'aura_active_workout';

const useActiveWorkout = () => {
  const [activeWorkout, setActiveWorkoutState] = useState<ActiveWorkoutState | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [pendingWorkout, setPendingWorkout] = useState<ActiveWorkoutState | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_WORKOUT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ActiveWorkoutState;
        // Check if workout is less than 24 hours old
        const hoursSince = (Date.now() - parsed.lastUpdated) / (1000 * 60 * 60);
        if (hoursSince < 24 && parsed.exercises.length > 0) {
          setPendingWorkout(parsed);
          setShowResumePrompt(true);
        } else {
          // Clear stale workout
          localStorage.removeItem(ACTIVE_WORKOUT_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading active workout:', error);
      localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    }
  }, []);

  // Save to localStorage whenever workout changes
  const setActiveWorkout = useCallback((workout: ActiveWorkoutState | null) => {
    setActiveWorkoutState(workout);
    if (workout) {
      const toSave = { ...workout, lastUpdated: Date.now() };
      localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(toSave));
    } else {
      localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    }
  }, []);

  // Start a new workout
  const startWorkout = useCallback(() => {
    const newWorkout: ActiveWorkoutState = {
      exercises: [],
      startTime: Date.now(),
      lastUpdated: Date.now()
    };
    setActiveWorkout(newWorkout);
    return newWorkout;
  }, [setActiveWorkout]);

  // Add exercise to workout
  const addExerciseToWorkout = useCallback((exerciseName: string) => {
    setActiveWorkoutState(prev => {
      const updated = prev || { exercises: [], startTime: Date.now(), lastUpdated: Date.now() };
      // Check if exercise already exists
      if (updated.exercises.some(e => e.exercise === exerciseName)) {
        return updated;
      }
      const newState = {
        ...updated,
        exercises: [...updated.exercises, { exercise: exerciseName, sets: [] }],
        lastUpdated: Date.now()
      };
      localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Add set to exercise
  const addSetToExercise = useCallback((exerciseName: string, set: { reps: number; weight: number; type: 'normal' | 'warmup' | 'drop' | 'failure'; completed: boolean }) => {
    setActiveWorkoutState(prev => {
      if (!prev) return prev;
      const newState = {
        ...prev,
        exercises: prev.exercises.map(e => 
          e.exercise === exerciseName 
            ? { ...e, sets: [...e.sets, set] }
            : e
        ),
        lastUpdated: Date.now()
      };
      localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Update set in exercise
  const updateSet = useCallback((exerciseName: string, setIndex: number, updates: Partial<{ reps: number; weight: number; type: 'normal' | 'warmup' | 'drop' | 'failure'; completed: boolean }>) => {
    setActiveWorkoutState(prev => {
      if (!prev) return prev;
      const newState = {
        ...prev,
        exercises: prev.exercises.map(e => 
          e.exercise === exerciseName 
            ? { 
                ...e, 
                sets: e.sets.map((s, i) => i === setIndex ? { ...s, ...updates } : s)
              }
            : e
        ),
        lastUpdated: Date.now()
      };
      localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Get elapsed time since workout started
  const getElapsedTime = useCallback(() => {
    if (!activeWorkout) return 0;
    return Math.floor((Date.now() - activeWorkout.startTime) / 1000 / 60); // Returns minutes
  }, [activeWorkout]);

  // Resume pending workout
  const resumeWorkout = useCallback(() => {
    if (pendingWorkout) {
      setActiveWorkoutState(pendingWorkout);
      setShowResumePrompt(false);
      setPendingWorkout(null);
    }
  }, [pendingWorkout]);

  // Discard pending workout
  const discardPendingWorkout = useCallback(() => {
    localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    setShowResumePrompt(false);
    setPendingWorkout(null);
  }, []);

  // Finish and clear workout
  const finishWorkout = useCallback(() => {
    const workout = activeWorkout;
    setActiveWorkout(null);
    return workout;
  }, [activeWorkout, setActiveWorkout]);

  return {
    activeWorkout,
    setActiveWorkout,
    startWorkout,
    addExerciseToWorkout,
    addSetToExercise,
    updateSet,
    getElapsedTime,
    finishWorkout,
    showResumePrompt,
    pendingWorkout,
    resumeWorkout,
    discardPendingWorkout
  };
};

// ==========================================
// WORKOUT STORE - Enterprise State Management
// ==========================================
// This hook is the SINGLE SOURCE OF TRUTH for all workout state.
// It syncs to localStorage for persistence and prevents data loss.
// @ts-ignore - Reserved for future state management integration

interface WorkoutExercise {
  exercise: string;
  sets: Array<{ reps: number; weight: number; type?: 'normal' | 'warmup' | 'drop' | 'failure' }>;
  targetSets?: number;
  targetReps?: number;
}

interface WorkoutStoreState {
  exercises: WorkoutExercise[];
  currentExerciseIndex: number;
  viewMode: 'FOCUS' | 'LOGGING';
  isResting: boolean;
  restTimeRemaining: number;
  startTime: number;
  lastUpdated: number;
}

const WORKOUT_STORE_KEY = 'AURA_WORKOUT_STORE';

// @ts-ignore - Reserved for future state management integration
const useWorkoutStore = () => {
  // Core state
  const [workout, setWorkoutState] = useState<WorkoutStoreState | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingResume, setPendingResume] = useState<WorkoutStoreState | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WORKOUT_STORE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as WorkoutStoreState;
        const hoursSince = (Date.now() - parsed.lastUpdated) / (1000 * 60 * 60);
        if (hoursSince < 24 && parsed.exercises.length > 0) {
          setPendingResume(parsed);
          setShowResumeModal(true);
        } else {
          localStorage.removeItem(WORKOUT_STORE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading workout store:', error);
      localStorage.removeItem(WORKOUT_STORE_KEY);
    }
  }, []);

  // Sync to localStorage whenever workout changes
  useEffect(() => {
    if (workout) {
      const toSave = { ...workout, lastUpdated: Date.now() };
      localStorage.setItem(WORKOUT_STORE_KEY, JSON.stringify(toSave));
    }
  }, [workout]);

  // Initialize a new workout
  const initWorkout = useCallback((exercises: WorkoutExercise[]) => {
    const newWorkout: WorkoutStoreState = {
      exercises,
      currentExerciseIndex: 0,
      viewMode: 'FOCUS',
      isResting: false,
      restTimeRemaining: 90,
      startTime: Date.now(),
      lastUpdated: Date.now()
    };
    setWorkoutState(newWorkout);
    return newWorkout;
  }, []);

  // Log a set to the current exercise
  const logSet = useCallback((weight: number, reps: number, type: 'normal' | 'warmup' | 'drop' | 'failure' = 'normal') => {
    setWorkoutState(prev => {
      if (!prev) return prev;
      const updatedExercises = prev.exercises.map((ex, idx) => {
        if (idx === prev.currentExerciseIndex) {
          return {
            ...ex,
            sets: [...ex.sets, { weight, reps, type }]
          };
        }
        return ex;
      });
      return {
        ...prev,
        exercises: updatedExercises,
        isResting: true,
        lastUpdated: Date.now()
      };
    });
  }, []);

  // Remove a set from current exercise
  const removeSet = useCallback((setIndex: number) => {
    setWorkoutState(prev => {
      if (!prev) return prev;
      const updatedExercises = prev.exercises.map((ex, idx) => {
        if (idx === prev.currentExerciseIndex) {
          return {
            ...ex,
            sets: ex.sets.filter((_, i) => i !== setIndex)
          };
        }
        return ex;
      });
      return {
        ...prev,
        exercises: updatedExercises,
        lastUpdated: Date.now()
      };
    });
  }, []);

  // Advance to next exercise
  const advanceExercise = useCallback(() => {
    setWorkoutState(prev => {
      if (!prev) return prev;
      if (prev.currentExerciseIndex < prev.exercises.length - 1) {
        return {
          ...prev,
          currentExerciseIndex: prev.currentExerciseIndex + 1,
          viewMode: 'FOCUS',
          isResting: true,
          lastUpdated: Date.now()
        };
      }
      return prev;
    });
  }, []);

  // Check if on last exercise
  const isLastExercise = useCallback(() => {
    if (!workout) return false;
    return workout.currentExerciseIndex >= workout.exercises.length - 1;
  }, [workout]);

  // Set view mode
  const setViewMode = useCallback((mode: 'FOCUS' | 'LOGGING') => {
    setWorkoutState(prev => prev ? { ...prev, viewMode: mode, lastUpdated: Date.now() } : prev);
  }, []);

  // Set resting state
  const setIsResting = useCallback((resting: boolean) => {
    setWorkoutState(prev => prev ? { ...prev, isResting: resting, lastUpdated: Date.now() } : prev);
  }, []);

  // Get current exercise
  const getCurrentExercise = useCallback((): WorkoutExercise | null => {
    if (!workout) return null;
    return workout.exercises[workout.currentExerciseIndex] || null;
  }, [workout]);

  // Get completed count
  const getCompletedCount = useCallback((): number => {
    if (!workout) return 0;
    return workout.exercises.filter(ex => ex.sets.length > 0).length;
  }, [workout]);

  // Resume pending workout
  const resumeWorkout = useCallback(() => {
    if (pendingResume) {
      setWorkoutState(pendingResume);
      setShowResumeModal(false);
      setPendingResume(null);
    }
  }, [pendingResume]);

  // Discard pending workout
  const discardWorkout = useCallback(() => {
    localStorage.removeItem(WORKOUT_STORE_KEY);
    setShowResumeModal(false);
    setPendingResume(null);
  }, []);

  // Finish and clear workout - returns the workout data for saving
  const finishWorkout = useCallback((): WorkoutStoreState | null => {
    const currentWorkout = workout;
    localStorage.removeItem(WORKOUT_STORE_KEY);
    setWorkoutState(null);
    return currentWorkout;
  }, [workout]);

  // Clear workout without returning data (for quitting)
  const clearWorkout = useCallback(() => {
    localStorage.removeItem(WORKOUT_STORE_KEY);
    setWorkoutState(null);
  }, []);

  return {
    // State
    workout,
    isActive: workout !== null,
    showResumeModal,
    pendingResume,
    
    // Getters
    getCurrentExercise,
    getCompletedCount,
    isLastExercise,
    
    // Actions
    initWorkout,
    logSet,
    removeSet,
    advanceExercise,
    setViewMode,
    setIsResting,
    resumeWorkout,
    discardWorkout,
    finishWorkout,
    clearWorkout
  };
};

// Plate calculator utility - calculates which plates to put on each side of the bar
const calculatePlates = (totalWeight: number, barWeight: number = 45, unit: 'lbs' | 'kg' = 'lbs'): { plates: { weight: number; count: number }[]; error?: string } => {
  const availablePlates = unit === 'lbs' 
    ? [45, 35, 25, 10, 5, 2.5] 
    : [25, 20, 15, 10, 5, 2.5, 1.25];
  
  const weightPerSide = (totalWeight - barWeight) / 2;
  
  if (weightPerSide < 0) {
    return { plates: [], error: `Weight must be at least ${barWeight}${unit} (bar weight)` };
  }
  
  if (weightPerSide === 0) {
    return { plates: [] };
  }
  
  const plates: { weight: number; count: number }[] = [];
  let remaining = weightPerSide;
  
  for (const plateWeight of availablePlates) {
    const count = Math.floor(remaining / plateWeight);
    if (count > 0) {
      plates.push({ weight: plateWeight, count });
      remaining -= count * plateWeight;
    }
  }
  
  if (remaining > 0.01) { // Small tolerance for floating point
    return { plates, error: `Cannot make exact weight. ${remaining.toFixed(2)}${unit} remaining per side.` };
  }
  
  return { plates };
};

// Skeleton loading component for better loading states (reserved for future use)
// @ts-ignore - Reserved for future loading states implementation
const _SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
  </div>
);

// @ts-ignore - Reserved for future loading states implementation
const _SkeletonMealCard = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-3"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-3"></div>
    <div className="flex justify-between">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
    </div>
  </div>
);

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
  // Legs - Gym
  "Barbell Back Squat": "/exercises/legs/gym/Barbell-Back-Squat.gif",
  "Romanian Deadlift (RDL)": "/exercises/legs/gym/Romanian-Deadlift-(RDL).gif",
  "Walking Lunges": "/exercises/legs/gym/Walking-Lunges.gif",
  "Lying Leg Curl": "/exercises/legs/gym/Lying-Leg-Curl.gif",
  "Leg Extension": "/exercises/legs/gym/Leg-Extension.gif",
  "Standing Calf Raise": "/exercises/legs/gym/Standing-Calf-Raise.gif",
  "Seated Calf Raise": "/exercises/legs/gym/Seated-Calf-Raise.gif",
  
  // Legs - Home
  "Bodyweight Squats": "/exercises/legs/home/bodyweight-squats.gif",
  "Bulgarian Split Squats": "/exercises/legs/home/bulgarian-split-squats.gif",
  "Lunges": "/exercises/legs/home/lunges.gif",
  "Pistol Squats (assisted)": "/exercises/legs/home/pistol-squates-(assisted).gif",
  "Glute Bridges": "/exercises/legs/home/glute-bridges.gif",
  "Single-Leg Deadlifts": "/exercises/legs/home/single-led-deadlifts.gif",
  "Calf Raises on Steps": "/exercises/legs/home/bodyweight-calf-raises-on-steps.gif",
  
  // Back - Gym
  "Barbell Bent-Over Row": "/exercises/back/gym/Barbell-Bent-Over-Row.gif",
  "Weighted Pull-ups": "/exercises/back/gym/Weighted-Pull-ups.gif",
  "Single-Arm Dumbbell Row": "/exercises/back/gym/Single-Arm-Dumbbell-Row.gif",
  "Close-Grip Lat Pulldown": "/exercises/back/gym/Close-Grip-Lat-Pulldown.gif",
  "Face Pulls": "/exercises/back/gym/Face-Pulls.gif",
  "Dumbbell Shrugs": "/exercises/back/gym/Dumbbell-Shrugs.gif",
  "Hyperextensions (Back Extensions)": "/exercises/back/gym/Hyperextensions-(Back-Extensions).gif",
  
  // Back - Home
  "Pull-ups/Chin-ups": "/exercises/back/home/pull-ups--chin-ups.gif",
  "Inverted Rows": "/exercises/back/home/inverted-rows.gif",
  "Supermans": "/exercises/back/home/supermans.gif",
  "Bodyweight Rows": "/exercises/back/home/bodyweight-rows.gif",
  "Reverse Snow Angels": "/exercises/back/home/reverse-snow-angels.gif",
  "Door Frame Rows": "/exercises/back/home/Door Frame-Rows.gif",
  "Band Pull-aparts": "/exercises/back/home/band-pull-aparts.gif",
  
  // Chest - Gym
  "Flat Barbell Bench Press": "/exercises/chest/gym/Flat-Barbell-Bench-Press.gif",
  "Incline Dumbbell Press": "/exercises/chest/gym/Incline-Dumbbell-Press.gif",
  "Dips (Chest Focus)": "/exercises/chest/gym/Dips-(Chest-Focus).gif",
  "Cable Crossover (High-to-Low)": "/exercises/chest/gym/Cable-Crossover-(High-to-Low).gif",
  "Flat Dumbbell Fly": "/exercises/chest/gym/Flat-Dumbbell-Fly.gif",
  "Pec Deck Fly": "/exercises/chest/gym/Pec-Deck-Fly.gif",
  "Push-ups (Weighted or High Rep)": "/exercises/chest/gym/Push-ups-(Weighted-or-High-Rep).gif",
  
  // Chest - Home
  "Push-ups (various angles)": "/exercises/chest/home/pushups.gif",
  "Decline Push-ups": "/exercises/chest/home/decline-pushups.gif",
  "Diamond Push-ups": "/exercises/chest/home/diamond-push-ups.gif",
  "Wide Push-ups": "/exercises/chest/home/wide-push-ups.gif",
  "Dips (between chairs)": "/exercises/chest/home/dips-between-chairs.gif",
  "Resistance Band Flyes": "/exercises/chest/home/resistance-band-flyes.gif",
  "Plyometric Push-ups": "/exercises/chest/home/plyometric-push-ups.gif",
  "Incline Push-ups": "/exercises/chest/home/incline-pushups.gif",
  
  // Shoulders - Gym (moved to gym subfolder)
  "Seated Dumbbell Overhead Press": "/exercises/shoulders/gym/Seated-Dumbbell-Overhead-Press.gif",
  "Standing Dumbbell Lateral Raise": "/exercises/shoulders/gym/Standing-Dumbbell-Lateral-Raise.gif",
  "Bent-Over Dumbbell Reverse Fly": "/exercises/shoulders/gym/Bent-Over-Dumbbell-Reverse-Fly.gif",
  "Front Plate Raise": "/exercises/shoulders/gym/Front-Plate-Raise.gif",
  "Barbell Shrugs (Behind the Back)": "/exercises/shoulders/gym/Barbell-Shrugs-(Behind-the-Back).gif",
  "Arnold Press": "/exercises/shoulders/gym/Arnold-Press.gif",
  "Cable External Rotation": "/exercises/shoulders/gym/Cable-External-Rotation.gif",
  
  // Shoulders - Home
  "Pike Pushups": "/exercises/shoulders/home/pike-push-up.gif",
  "Handstand Push-ups (wall assisted)": "/exercises/shoulders/home/handstand-push-up.gif",
  "Lateral Raises (with water bottles)": "/exercises/shoulders/home/lateral-raises.gif",
  "Front Raises (with resistance)": "/exercises/shoulders/home/front-raises-with-resistance.gif",
  "Shoulder Taps": "/exercises/shoulders/home/shoulder-taps.gif",
  "Pseudo Planche Leans": "/exercises/shoulders/home/pseudo-planche-leans.gif",
  
  // Arms - Gym
  "Close-Grip Bench Press": "/exercises/arms/gym/Close-Grip-Bench-Press.gif",
  "Barbell Curl": "/exercises/arms/gym/Barbell-Curl.gif",
  "Skullcrushers (Lying Tricep Extension)": "/exercises/arms/gym/Skullcrushers-(Lying-Tricep-Extension).gif",
  "Hammer Curls": "/exercises/arms/gym/Hammer-Curls.gif",
  "Rope Triceps Pushdown": "/exercises/arms/gym/Rope-Triceps-Pushdown.gif",
  
  // Arms - Home
  "Triceps Dips (chair/couch)": "/exercises/arms/home/triceps-dips-chair.gif",
  "Bicep Curls (backpack/water jugs)": "/exercises/arms/home/biceps-curls-water-bottle.gif",
  "Overhead Tricep Extension": "/exercises/arms/home/overhead-tricep-extension.gif",
  "Concentration Curls": "/exercises/arms/home/concentration-curls.gif",
  
  // Core - Gym
  "Hanging Leg Raises": "/exercises/core/gym/Hanging-Leg-Raises.gif",
  "Ab Wheel Rollout": "/exercises/core/gym/Ab-Wheel-Rollout.gif",
  "Cable Crunch": "/exercises/core/gym/cable-crunch.gif",
  "Decline Sit-ups": "/exercises/core/gym/decline-situps.gif",
  "Russian Twists (weighted)": "/exercises/core/gym/russian-twists.gif",
  "Pallof Press": "/exercises/core/gym/half-kneeling-pallof-press.gif",
  
  // Core - Home
  "Plank Variations": "/exercises/core/home/dead-bug.gif",
  "Mountain Climbers": "/exercises/core/home/mountain-climbers.gif",
  "Bicycle Crunches": "/exercises/core/home/bicycle-crunches.gif",
  "Flutter Kicks": "/exercises/core/home/flutter-kisks.gif",
  "Leg Raises": "/exercises/core/home/leg-raises.gif",
  "V-ups": "/exercises/core/home/v-ups.gif",
  "Dead Bug": "/exercises/core/home/dead-bug.gif",
};

// Muscle Groups for Exercise Finder
const MUSCLE_GROUPS: { 
  name: string; 
  icon: string; 
  color: string; 
  exercises: { gym: string[]; home: string[]; }; 
  warmups: string[]; // Dynamic warmup exercises for this muscle group
  category: 'upper' | 'lower' | 'core';
}[] = [
  { 
    name: "Legs", 
    icon: "🦵", 
    color: "bg-gradient-to-br from-green-400 to-emerald-500 text-white", 
    exercises: { 
      gym: ["Barbell Back Squat", "Romanian Deadlift (RDL)", "Walking Lunges", "Lying Leg Curl", "Leg Extension", "Standing Calf Raise", "Seated Calf Raise"], 
      home: ["Bodyweight Squats", "Bulgarian Split Squats", "Lunges", "Pistol Squats (assisted)", "Glute Bridges", "Single-Leg Deadlifts", "Calf Raises on Steps"] 
    },
    warmups: ["Leg Swings (front-to-back)", "Leg Swings (side-to-side)", "Bodyweight Squats", "Walking Lunges", "High Knees", "Butt Kicks", "Hip Circles"],
    category: 'lower'
  },
  { 
    name: "Back", 
    icon: "🏋️", 
    color: "bg-gradient-to-br from-blue-400 to-indigo-500 text-white", 
    exercises: { 
      gym: ["Barbell Bent-Over Row", "Weighted Pull-ups", "Single-Arm Dumbbell Row", "Close-Grip Lat Pulldown", "Face Pulls", "Dumbbell Shrugs", "Hyperextensions (Back Extensions)"], 
      home: ["Pull-ups/Chin-ups", "Inverted Rows", "Supermans", "Bodyweight Rows", "Reverse Snow Angels", "Door Frame Rows", "Band Pull-aparts"] 
    },
    warmups: ["Band Pull-aparts", "Arm Circles", "Cat-Cow Stretch", "Scapular Push-ups", "Dead Hangs", "Thoracic Rotations"],
    category: 'upper'
  },
  { 
    name: "Chest", 
    icon: "🔥", 
    color: "bg-gradient-to-br from-pink-400 to-rose-500 text-white", 
    exercises: { 
      gym: ["Flat Barbell Bench Press", "Incline Dumbbell Press", "Dips (Chest Focus)", "Cable Crossover (High-to-Low)", "Flat Dumbbell Fly", "Pec Deck Fly", "Push-ups (Weighted or High Rep)"], 
      home: ["Push-ups (various angles)", "Decline Push-ups", "Diamond Push-ups", "Wide Push-ups", "Dips (between chairs)", "Resistance Band Flyes", "Plyometric Push-ups"] 
    },
    warmups: ["Band Pull-aparts", "Arm Circles", "Push-ups (slow)", "Shoulder Dislocations", "Wall Angels", "Dynamic Chest Stretch"],
    category: 'upper'
  },
  { 
    name: "Shoulders", 
    icon: "⭕", 
    color: "bg-gradient-to-br from-amber-400 to-orange-500 text-white", 
    exercises: { 
      gym: ["Seated Dumbbell Overhead Press", "Standing Dumbbell Lateral Raise", "Bent-Over Dumbbell Reverse Fly", "Front Plate Raise", "Barbell Shrugs (Behind the Back)", "Arnold Press", "Cable External Rotation"], 
      home: ["Pike Pushups", "Handstand Push-ups (wall assisted)", "Lateral Raises (with water bottles)", "Front Raises (with resistance)", "Shoulder Taps", "Band Pull-aparts", "Pseudo Planche Leans"] 
    },
    warmups: ["Arm Circles (small to large)", "Shoulder Dislocations", "Band Pull-aparts", "Wall Slides", "External Rotations", "YTWL Raises"],
    category: 'upper'
  },
  { 
    name: "Arms", 
    icon: "💪", 
    color: "bg-gradient-to-br from-purple-400 to-fuchsia-500 text-white", 
    exercises: { 
      gym: ["Close-Grip Bench Press", "Barbell Curl", "Skullcrushers (Lying Tricep Extension)", "Hammer Curls", "Rope Triceps Pushdown"], 
      home: ["Triceps Dips (chair/couch)", "Diamond Push-ups", "Bicep Curls (backpack/water jugs)", "Overhead Tricep Extension", "Concentration Curls"] 
    },
    warmups: ["Wrist Circles", "Arm Circles", "Light Band Curls", "Tricep Extensions (no weight)", "Forearm Stretches", "Finger Spreads"],
    category: 'upper'
  },
  { 
    name: "Core", 
    icon: "🛡️", 
    color: "bg-gradient-to-br from-cyan-400 to-teal-500 text-white", 
    exercises: { 
      gym: ["Hanging Leg Raises", "Ab Wheel Rollout", "Cable Crunch", "Decline Sit-ups", "Russian Twists (weighted)", "Pallof Press"], 
      home: ["Plank Variations", "Mountain Climbers", "Bicycle Crunches", "Flutter Kicks", "Leg Raises", "V-ups", "Dead Bug"] 
    },
    warmups: ["Cat-Cow Stretch", "Dead Bug", "Bird Dog", "Plank (30 sec)", "Hip Circles", "Torso Rotations"],
    category: 'core'
  },
];

// Workout Programs Data - Pre-built training programs
const WORKOUT_PROGRAMS = [
  {
    id: 'ppl',
    name: 'Push/Pull/Legs',
    description: '6-day split focusing on push muscles, pull muscles, and legs separately',
    duration: '6 weeks',
    daysPerWeek: 6,
    level: 'intermediate',
    location: 'gym',
    icon: '🔁',
    color: 'from-blue-400 to-indigo-500',
    schedule: [
      {
        day: 1,
        name: 'Push Day',
        focus: ['Chest', 'Shoulders', 'Arms'],
        exercises: ['Flat Barbell Bench Press', 'Incline Dumbbell Press', 'Seated Dumbbell Overhead Press', 'Standing Dumbbell Lateral Raise', 'Rope Triceps Pushdown']
      },
      {
        day: 2,
        name: 'Pull Day',
        focus: ['Back', 'Arms'],
        exercises: ['Weighted Pull-ups', 'Barbell Bent-Over Row', 'Single-Arm Dumbbell Row', 'Face Pulls', 'Barbell Curl']
      },
      {
        day: 3,
        name: 'Leg Day',
        focus: ['Legs', 'Core'],
        exercises: ['Barbell Back Squat', 'Romanian Deadlift (RDL)', 'Walking Lunges', 'Lying Leg Curl', 'Standing Calf Raise', 'Hanging Leg Raises']
      },
      {
        day: 4,
        name: 'Push Day',
        focus: ['Chest', 'Shoulders', 'Arms'],
        exercises: ['Incline Dumbbell Press', 'Flat Barbell Bench Press', 'Arnold Press', 'Cable Crossover (High-to-Low)', 'Close-Grip Bench Press']
      },
      {
        day: 5,
        name: 'Pull Day',
        focus: ['Back', 'Arms'],
        exercises: ['Romanian Deadlift (RDL)', 'Close-Grip Lat Pulldown', 'Barbell Bent-Over Row', 'Dumbbell Shrugs', 'Hammer Curls']
      },
      {
        day: 6,
        name: 'Leg Day',
        focus: ['Legs', 'Core'],
        exercises: ['Barbell Back Squat', 'Walking Lunges', 'Leg Extension', 'Lying Leg Curl', 'Seated Calf Raise', 'Cable Crunch']
      }
    ]
  },
  {
    id: 'upper-lower',
    name: 'Upper/Lower Split',
    description: '4-day split alternating between upper and lower body',
    duration: '8 weeks',
    daysPerWeek: 4,
    level: 'beginner',
    location: 'gym',
    icon: '⬆️',
    color: 'from-green-400 to-emerald-500',
    schedule: [
      {
        day: 1,
        name: 'Upper Body A',
        focus: ['Chest', 'Back', 'Shoulders', 'Arms'],
        exercises: ['Flat Barbell Bench Press', 'Barbell Bent-Over Row', 'Seated Dumbbell Overhead Press', 'Close-Grip Lat Pulldown', 'Barbell Curl', 'Rope Triceps Pushdown']
      },
      {
        day: 2,
        name: 'Lower Body A',
        focus: ['Legs', 'Core'],
        exercises: ['Barbell Back Squat', 'Romanian Deadlift (RDL)', 'Walking Lunges', 'Leg Extension', 'Standing Calf Raise', 'Hanging Leg Raises']
      },
      {
        day: 3,
        name: 'Upper Body B',
        focus: ['Chest', 'Back', 'Shoulders', 'Arms'],
        exercises: ['Incline Dumbbell Press', 'Weighted Pull-ups', 'Standing Dumbbell Lateral Raise', 'Single-Arm Dumbbell Row', 'Hammer Curls', 'Skullcrushers (Lying Tricep Extension)']
      },
      {
        day: 4,
        name: 'Lower Body B',
        focus: ['Legs', 'Core'],
        exercises: ['Barbell Back Squat', 'Walking Lunges', 'Lying Leg Curl', 'Leg Extension', 'Seated Calf Raise', 'Hanging Leg Raises']
      }
    ]
  },
  {
    id: 'full-body',
    name: 'Full Body',
    description: '3-day full body workout hitting all major muscle groups',
    duration: '6 weeks',
    daysPerWeek: 3,
    level: 'beginner',
    location: 'gym',
    icon: '💪',
    color: 'from-purple-400 to-fuchsia-500',
    schedule: [
      {
        day: 1,
        name: 'Full Body A',
        focus: ['Chest', 'Back', 'Legs', 'Core'],
        exercises: ['Barbell Back Squat', 'Flat Barbell Bench Press', 'Barbell Bent-Over Row', 'Seated Dumbbell Overhead Press', 'Romanian Deadlift (RDL)', 'Cable Crunch']
      },
      {
        day: 2,
        name: 'Full Body B',
        focus: ['Legs', 'Chest', 'Back', 'Arms'],
        exercises: ['Romanian Deadlift (RDL)', 'Incline Dumbbell Press', 'Weighted Pull-ups', 'Walking Lunges', 'Barbell Curl', 'Rope Triceps Pushdown']
      },
      {
        day: 3,
        name: 'Full Body C',
        focus: ['Chest', 'Back', 'Legs', 'Shoulders'],
        exercises: ['Barbell Back Squat', 'Dips (Chest Focus)', 'Close-Grip Lat Pulldown', 'Walking Lunges', 'Standing Dumbbell Lateral Raise', 'Hanging Leg Raises']
      }
    ]
  },
  {
    id: 'bro-split',
    name: 'Bro Split',
    description: '5-day split with one muscle group per day',
    duration: '8 weeks',
    daysPerWeek: 5,
    level: 'intermediate',
    location: 'gym',
    icon: '🎯',
    color: 'from-red-400 to-pink-500',
    schedule: [
      {
        day: 1,
        name: 'Chest Day',
        focus: ['Chest'],
        exercises: ['Flat Barbell Bench Press', 'Incline Dumbbell Press', 'Dips (Chest Focus)', 'Cable Crossover (High-to-Low)', 'Flat Dumbbell Fly', 'Push-ups (Weighted or High Rep)']
      },
      {
        day: 2,
        name: 'Back Day',
        focus: ['Back'],
        exercises: ['Romanian Deadlift (RDL)', 'Weighted Pull-ups', 'Barbell Bent-Over Row', 'Single-Arm Dumbbell Row', 'Close-Grip Lat Pulldown', 'Face Pulls']
      },
      {
        day: 3,
        name: 'Shoulder Day',
        focus: ['Shoulders'],
        exercises: ['Seated Dumbbell Overhead Press', 'Standing Dumbbell Lateral Raise', 'Bent-Over Dumbbell Reverse Fly', 'Arnold Press', 'Front Plate Raise', 'Cable External Rotation']
      },
      {
        day: 4,
        name: 'Leg Day',
        focus: ['Legs'],
        exercises: ['Barbell Back Squat', 'Romanian Deadlift (RDL)', 'Walking Lunges', 'Leg Extension', 'Lying Leg Curl', 'Standing Calf Raise', 'Seated Calf Raise']
      },
      {
        day: 5,
        name: 'Arm + Core Day',
        focus: ['Arms', 'Core'],
        exercises: ['Close-Grip Bench Press', 'Barbell Curl', 'Skullcrushers (Lying Tricep Extension)', 'Hammer Curls', 'Rope Triceps Pushdown', 'Hanging Leg Raises', 'Cable Crunch']
      }
    ]
  },
  // ==========================================
  // HOME WORKOUT PROGRAMS
  // ==========================================
  {
    id: 'home-ppl',
    name: 'Push/Pull/Legs',
    description: '6-day bodyweight split for home training',
    duration: '6 weeks',
    daysPerWeek: 6,
    level: 'intermediate',
    location: 'home',
    icon: '🏠',
    color: 'from-blue-400 to-indigo-500',
    schedule: [
      {
        day: 1,
        name: 'Push Day',
        focus: ['Chest', 'Shoulders', 'Arms'],
        exercises: ['Push-ups (various angles)', 'Diamond Push-ups', 'Pike Pushups', 'Decline Push-ups', 'Triceps Dips (chair/couch)']
      },
      {
        day: 2,
        name: 'Pull Day',
        focus: ['Back', 'Arms'],
        exercises: ['Pull-ups/Chin-ups', 'Inverted Rows', 'Bodyweight Rows', 'Bicep Curls (backpack/water jugs)', 'Supermans']
      },
      {
        day: 3,
        name: 'Leg Day',
        focus: ['Legs', 'Core'],
        exercises: ['Bodyweight Squats', 'Lunges', 'Bulgarian Split Squats', 'Glute Bridges', 'Calf Raises on Steps', 'Mountain Climbers']
      },
      {
        day: 4,
        name: 'Push Day',
        focus: ['Chest', 'Shoulders', 'Arms'],
        exercises: ['Wide Push-ups', 'Incline Push-ups', 'Handstand Push-ups (wall assisted)', 'Plyometric Push-ups', 'Overhead Tricep Extension']
      },
      {
        day: 5,
        name: 'Pull Day',
        focus: ['Back', 'Arms'],
        exercises: ['Pull-ups/Chin-ups', 'Door Frame Rows', 'Reverse Snow Angels', 'Concentration Curls', 'Band Pull-aparts']
      },
      {
        day: 6,
        name: 'Leg Day',
        focus: ['Legs', 'Core'],
        exercises: ['Pistol Squats (assisted)', 'Single-Leg Deadlifts', 'Lunges', 'Glute Bridges', 'Bicycle Crunches', 'Leg Raises']
      }
    ]
  },
  {
    id: 'home-upper-lower',
    name: 'Upper/Lower Split',
    description: '4-day home split alternating upper and lower body',
    duration: '8 weeks',
    daysPerWeek: 4,
    level: 'beginner',
    location: 'home',
    icon: '🏡',
    color: 'from-green-400 to-emerald-500',
    schedule: [
      {
        day: 1,
        name: 'Upper Body A',
        focus: ['Chest', 'Back', 'Shoulders', 'Arms'],
        exercises: ['Push-ups (various angles)', 'Inverted Rows', 'Pike Pushups', 'Diamond Push-ups', 'Bicep Curls (backpack/water jugs)', 'Triceps Dips (chair/couch)']
      },
      {
        day: 2,
        name: 'Lower Body A',
        focus: ['Legs', 'Core'],
        exercises: ['Bodyweight Squats', 'Lunges', 'Glute Bridges', 'Single-Leg Deadlifts', 'Calf Raises on Steps', 'Mountain Climbers']
      },
      {
        day: 3,
        name: 'Upper Body B',
        focus: ['Chest', 'Back', 'Shoulders', 'Arms'],
        exercises: ['Wide Push-ups', 'Pull-ups/Chin-ups', 'Shoulder Taps', 'Bodyweight Rows', 'Concentration Curls', 'Overhead Tricep Extension']
      },
      {
        day: 4,
        name: 'Lower Body B',
        focus: ['Legs', 'Core'],
        exercises: ['Bulgarian Split Squats', 'Pistol Squats (assisted)', 'Glute Bridges', 'Lunges', 'Bicycle Crunches', 'Leg Raises']
      }
    ]
  },
  {
    id: 'home-full-body',
    name: 'Full Body',
    description: '3-day full body home workout with no equipment needed',
    duration: '6 weeks',
    daysPerWeek: 3,
    level: 'beginner',
    location: 'home',
    icon: '🏠',
    color: 'from-purple-400 to-fuchsia-500',
    schedule: [
      {
        day: 1,
        name: 'Full Body A',
        focus: ['Chest', 'Back', 'Legs', 'Core'],
        exercises: ['Bodyweight Squats', 'Push-ups (various angles)', 'Inverted Rows', 'Lunges', 'Pike Pushups', 'Mountain Climbers']
      },
      {
        day: 2,
        name: 'Full Body B',
        focus: ['Legs', 'Chest', 'Back', 'Arms'],
        exercises: ['Glute Bridges', 'Diamond Push-ups', 'Pull-ups/Chin-ups', 'Bulgarian Split Squats', 'Bicep Curls (backpack/water jugs)', 'Triceps Dips (chair/couch)']
      },
      {
        day: 3,
        name: 'Full Body C',
        focus: ['Chest', 'Back', 'Legs', 'Shoulders'],
        exercises: ['Lunges', 'Wide Push-ups', 'Bodyweight Rows', 'Single-Leg Deadlifts', 'Shoulder Taps', 'Bicycle Crunches']
      }
    ]
  },
  {
    id: 'home-hiit',
    name: 'HIIT Circuit',
    description: '4-day high intensity interval training for fat burn',
    duration: '4 weeks',
    daysPerWeek: 4,
    level: 'intermediate',
    location: 'home',
    icon: '🔥',
    color: 'from-orange-400 to-red-500',
    schedule: [
      {
        day: 1,
        name: 'Upper Body HIIT',
        focus: ['Chest', 'Back', 'Arms'],
        exercises: ['Push-ups (various angles)', 'Diamond Push-ups', 'Plyometric Push-ups', 'Inverted Rows', 'Shoulder Taps', 'Mountain Climbers']
      },
      {
        day: 2,
        name: 'Lower Body HIIT',
        focus: ['Legs', 'Core'],
        exercises: ['Bodyweight Squats', 'Lunges', 'Glute Bridges', 'Calf Raises on Steps', 'Flutter Kicks', 'Bicycle Crunches']
      },
      {
        day: 3,
        name: 'Full Body Burn',
        focus: ['Full Body', 'Core'],
        exercises: ['Bodyweight Squats', 'Push-ups (various angles)', 'Lunges', 'Supermans', 'Mountain Climbers', 'V-ups']
      },
      {
        day: 4,
        name: 'Core & Cardio',
        focus: ['Core', 'Legs'],
        exercises: ['Mountain Climbers', 'Bicycle Crunches', 'Flutter Kicks', 'Leg Raises', 'Dead Bug', 'V-ups']
      }
    ]
  }
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

// Normalize exercise name for matching - strips all non-alphanumeric, lowercases
// Fixes fuzzy matching bug: "Pull-ups" -> "pullups" matches "Pull Ups"
const normalizeExerciseName = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Find exercise data from MUSCLE_GROUPS by normalized name matching
const findExerciseInMuscleGroups = (exerciseName: string): { exercise: string; muscle: string; location: string } | null => {
  const normalizedSearch = normalizeExerciseName(exerciseName);
  
  for (const muscleGroup of MUSCLE_GROUPS) {
    // Check gym exercises - exercises.gym is string[]
    for (const exerciseName of muscleGroup.exercises.gym) {
      if (normalizeExerciseName(exerciseName) === normalizedSearch ||
          normalizedSearch.includes(normalizeExerciseName(exerciseName)) ||
          normalizeExerciseName(exerciseName).includes(normalizedSearch)) {
        return { exercise: exerciseName, muscle: muscleGroup.name, location: 'gym' };
      }
    }
    // Check home exercises - exercises.home is string[]
    for (const exerciseName of muscleGroup.exercises.home) {
      if (normalizeExerciseName(exerciseName) === normalizedSearch ||
          normalizedSearch.includes(normalizeExerciseName(exerciseName)) ||
          normalizeExerciseName(exerciseName).includes(normalizedSearch)) {
        return { exercise: exerciseName, muscle: muscleGroup.name, location: 'home' };
      }
    }
  }
  return null;
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
      } catch (error: any) {
        // Silently handle index error - it's not critical for app functionality
        if (error?.code === 'failed-precondition') {
          // Index not created yet - ignore
          console.log('ℹ️ Workout history index not yet created (non-critical)');
        } else {
          console.error('Error fetching last workout:', error);
        }
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
  const [waterIntake, setWaterIntake] = useState(0); // glasses of water today
  const [waterGoal] = useState(8); // recommended 8 glasses per day
  const [healthData, setHealthData] = useState({ steps: 0, calories: 0, distance: 0, heartRate: 0 });
  const [healthConnected, setHealthConnected] = useState(false);
  const units = userData?.appPreferences?.units || 'metric';

  // Smart water intake loading with automatic day change detection and cleanup
  useEffect(() => {
    if (!userData) return;

    const today = new Date().toISOString().split('T')[0];
    const lastWaterDate = localStorage.getItem('lastWaterDate');
    
    // Check if it's a new day
    if (lastWaterDate !== today) {
      // New day detected - reset water intake
      console.log('New day detected! Resetting water intake. Last date:', lastWaterDate, 'Today:', today);
      localStorage.setItem('lastWaterDate', today);
      
      // Clean up old water intake data (older than 90 days)
      const cleanupOldWaterData = async () => {
        const user = auth.currentUser;
        if (!user || !userData.waterIntake) return;
        
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const cutoffDate = ninetyDaysAgo.toISOString().split('T')[0];
        
        const cleanedWaterIntake: Record<string, number> = {};
        let needsCleanup = false;
        
        Object.keys(userData.waterIntake).forEach(date => {
          if (date >= cutoffDate) {
            cleanedWaterIntake[date] = userData.waterIntake[date];
          } else {
            needsCleanup = true;
            console.log('Removing old water data for date:', date);
          }
        });
        
        if (needsCleanup) {
          try {
            await updateDoc(doc(db, 'users', user.uid), {
              waterIntake: cleanedWaterIntake
            });
            console.log('Cleaned up old water intake data from database');
          } catch (error) {
            console.error('Failed to cleanup old water data:', error);
          }
        }
      };
      
      cleanupOldWaterData();
      
      // Load today's water intake (will be 0 if not set)
      const todayWater = userData.waterIntake?.[today] || 0;
      setWaterIntake(todayWater);
    } else {
      // Same day - load existing data
      const todayWater = userData.waterIntake?.[today] || 0;
      setWaterIntake(todayWater);
    }
  }, [userData]);

  // Auto-reset water intake at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const lastWaterDate = localStorage.getItem('lastWaterDate');
      
      if (lastWaterDate !== today) {
        console.log('Midnight passed! Auto-resetting water intake.');
        localStorage.setItem('lastWaterDate', today);
        
        // Reset to 0 for new day
        setWaterIntake(0);
        
        // Optionally save 0 to database for the new day
        const user = auth.currentUser;
        if (user) {
          updateDoc(doc(db, 'users', user.uid), {
            [`waterIntake.${today}`]: 0
          }).catch(err => console.error('Failed to initialize new day water intake:', err));
        }
      }
    };

    // Check every minute if day has changed
    const interval = setInterval(checkMidnight, 60000); // Check every 60 seconds
    
    // Also check immediately
    checkMidnight();
    
    return () => clearInterval(interval);
  }, []);

  // Schedule water reminder notifications
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Check if we've already asked for permissions today to prevent spam
        const lastPermissionCheck = localStorage.getItem('lastNotificationPermissionCheck');
        const today = new Date().toISOString().split('T')[0];
        
        // Request notification permissions first
        const permission = await LocalNotifications.requestPermissions();
        
        if (permission.display !== 'granted') {
          console.log('Notification permission denied');
          // Only show toast once per day to prevent spam
          if (lastPermissionCheck !== today) {
            localStorage.setItem('lastNotificationPermissionCheck', today);
            showDismissibleToast('Please enable notifications in settings for water reminders', 'error');
          }
          return;
        }

        // Create notification channel for Android 8+
        try {
          await LocalNotifications.createChannel({
            id: 'water-reminders',
            name: 'Water Reminders',
            description: 'Daily hydration reminders',
            importance: 5, // High importance
            visibility: 1, // Public
            sound: 'default',
            vibration: true,
            lights: true,
            lightColor: '#4F46E5'
          });
          console.log('Notification channel created');
        } catch (channelError) {
          console.log('Channel creation not needed or failed:', channelError);
        }

        await scheduleWaterReminders();
      } catch (error) {
        console.error('Notification initialization error:', error);
      }
    };

    const scheduleWaterReminders = async () => {
      try {
        // Cancel existing notifications first
        await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] });
        
        // Get current time
        const now = new Date();
        const notifications = [];
        
        // Schedule 4 DAILY REPEATING reminders (10 AM, 1 PM, 4 PM, 7 PM)
        const reminderTimes = [
          { hour: 10, minute: 0, id: 1, title: 'Morning Hydration 💧', body: 'Time for a glass of water! Stay refreshed.' },
          { hour: 13, minute: 0, id: 2, title: 'Afternoon Hydration 💧', body: 'Keep hydrated! Drink a glass of water.' },
          { hour: 16, minute: 0, id: 3, title: 'Evening Hydration 💧', body: 'Don\'t forget to drink water!' },
          { hour: 19, minute: 0, id: 4, title: 'Dinner Time Hydration 💧', body: 'Last reminder! Reach your daily water goal.' }
        ];

        for (const reminder of reminderTimes) {
          const scheduleDate = new Date();
          scheduleDate.setHours(reminder.hour, reminder.minute, 0, 0);
          
          // If the time has passed today, schedule for tomorrow
          if (scheduleDate <= now) {
            scheduleDate.setDate(scheduleDate.getDate() + 1);
          }

          notifications.push({
            id: reminder.id,
            title: reminder.title,
            body: reminder.body,
            schedule: {
              at: scheduleDate,
              every: 'day' as any, // Repeat daily
              allowWhileIdle: true
            },
            sound: 'default' as any,
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#4F46E5',
            channelId: 'water-reminders'
          });
        }

        await LocalNotifications.schedule({ notifications });
        console.log('Daily water reminders scheduled:', notifications.length);
        
        // Get pending notifications to verify
        const pending = await LocalNotifications.getPending();
        console.log('Pending notifications:', pending.notifications.length);
        
      } catch (error) {
        console.error('Error scheduling water reminders:', error);
        throw error;
      }
    };

    initializeNotifications();
  }, []);

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
        swipeableToast.success('Weight updated! 💪');
        
        // Update local storage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const data = JSON.parse(storedUserData);
          data.weight = newWeight;
          localStorage.setItem('userData', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Failed to update weight:', error);
        swipeableToast.error('Failed to update weight');
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
        swipeableToast.success('Target weight updated! 🎯');
        
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
        swipeableToast.error('Failed to update target weight');
      }
    }
  };

  // Add water glass
  const addWaterGlass = async () => {
    // Prevent adding water beyond reasonable limit (50 glasses)
    if (waterIntake >= 50) {
      swipeableToast.error('Maximum water intake limit reached!');
      return;
    }
    
    const newIntake = waterIntake + 1;
    setWaterIntake(newIntake);
    
    const user = auth.currentUser;
    if (user) {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Ensure lastWaterDate is updated
        localStorage.setItem('lastWaterDate', today);
        
        await updateDoc(doc(db, 'users', user.uid), {
          [`waterIntake.${today}`]: newIntake
        });
        
        // Only show goal reached toast when crossing the threshold (not already above it)
        if (newIntake >= waterGoal && waterIntake < waterGoal) {
          swipeableToast.success('🎉 Daily water goal reached!');
        } else if (newIntake === Math.floor(waterGoal / 2) && waterIntake < Math.floor(waterGoal / 2)) {
          swipeableToast.success('💧 Halfway there! Keep hydrating!');
        }
      } catch (error) {
        console.error('Failed to update water intake:', error);
        // Revert on error
        setWaterIntake(waterIntake);
        swipeableToast.error('Failed to save water intake');
      }
    }
  };

  // Remove water glass
  const removeWaterGlass = async () => {
    if (waterIntake === 0) return;
    const newIntake = waterIntake - 1;
    setWaterIntake(newIntake);
    
    const user = auth.currentUser;
    if (user) {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Ensure lastWaterDate is updated
        localStorage.setItem('lastWaterDate', today);
        
        await updateDoc(doc(db, 'users', user.uid), {
          [`waterIntake.${today}`]: newIntake
        });
      } catch (error) {
        console.error('Failed to update water intake:', error);
        // Revert on error
        setWaterIntake(waterIntake);
        swipeableToast.error('Failed to save water intake');
      }
    }
  };

  // Connect to Health Connect
  const connectHealthConnect = async () => {
    try {
      const result = await HealthConnect.isAvailable();
      console.log('Health Connect availability:', result);
      
      if (!result.available) {
        if (result.status === 'update_required') {
          swipeableToast.error('Please update Health Connect app from Play Store');
        } else if (result.status === 'unavailable') {
          swipeableToast.error('Health Connect is not available. Please install it from Play Store.');
        } else {
          swipeableToast.error(`Health Connect status: ${result.status || 'unavailable'}`);
        }
        return;
      }

      const permResult = await HealthConnect.requestPermissions();
      console.log('Permission result:', permResult);
      
      if (permResult.granted) {
        setHealthConnected(true);
        
        // Save connection status to Firebase for future auto-sync
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, 'users', user.uid), {
            healthConnectConnected: true
          }, { merge: true });
        }
        
        swipeableToast.success('✅ Connected to Health Connect!');
        await syncHealthData();
      } else {
        swipeableToast.success('Opening Health Connect for permissions...');
        // Will open Health Connect app for user to grant permissions
      }
    } catch (error) {
      console.error('Failed to connect Health Connect:', error);
      swipeableToast.error('Failed to connect Health Connect. Please try again.');
    }
  };

  // Sync health data from Health Connect (manual refresh)
  const syncHealthData = async () => {
    try {
      const result = await HealthConnect.fetchHealthData();
      
      if (result.success) {
        const newHealthData = {
          steps: result.steps || 0,
          calories: result.calories || 0,
          distance: result.distance || 0,
          heartRate: result.heartRate || 0
        };

        setHealthData(newHealthData);
        setHealthConnected(true);

        // Save to Firebase using dot notation to preserve history
        const user = auth.currentUser;
        if (user) {
          const today = new Date().toISOString().split('T')[0];
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, {
            [`healthData.${today}`]: newHealthData,
            healthConnectConnected: true
          });
        }

        swipeableToast.success('🔄 Health data synced!');
      } else {
        swipeableToast.error('Permissions not granted. Please connect to Health Connect first.');
      }
    } catch (error) {
      console.error('Failed to sync health data:', error);
      swipeableToast.error('Failed to sync health data. Please try again.');
    }
  };

  // Load health data from Firebase on mount AND auto-fetch from Health Connect
  useEffect(() => {
    // Only run if we have a logged-in user
    if (!userData?.uid) return;
    
    const checkAndSyncHealth = async () => {
      // 1. First, check if we already have data saved for TODAY in our database
      const today = new Date().toISOString().split('T')[0];
      const savedTodayData = userData.healthData?.[today];

      if (savedTodayData) {
        // If we have data, show it immediately!
        setHealthData(savedTodayData);
        setHealthConnected(true);
      }

      // 2. Then, try to fetch fresh data from the phone silently
      try {
        console.log('🔄 Auto-fetching health data...');
        const result = await HealthConnect.fetchHealthData();
        
        if (result.success) {
          console.log('✅ Health data fetched:', result);
          const newHealthData = {
            steps: result.steps || 0,
            calories: result.calories || 0,
            distance: result.distance || 0,
            heartRate: result.heartRate || 0
          };
          
          setHealthConnected(true);
          setHealthData(newHealthData);
          
          // 3. Save it properly using "dot notation" so we don't overwrite history
          const userDocRef = doc(db, 'users', userData.uid);
          await updateDoc(userDocRef, {
            [`healthData.${today}`]: newHealthData,
            healthConnectConnected: true
          });
        } else {
          console.log('⚠️ Auto-sync failed (silent):', result.error);
          // If we don't have cached data, show the connect button
          if (!savedTodayData) {
            setHealthConnected(false);
          }
        }
      } catch (error) {
        // If it fails silently, that's okay, the user can still tap the button manually
        console.log('Auto-sync failed, user may need to tap connect');
        // Keep showing cached data if available
        if (!savedTodayData) {
          setHealthConnected(false);
        }
      }
    };

    checkAndSyncHealth();
  }, [userData?.uid]); // Run whenever the user ID is confirmed

  const updateStartingWeight = async (newStarting: number) => {
    setStartingWeight(newStarting);
    
    // Update Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { startingWeight: newStarting }, { merge: true });
        swipeableToast.success('Starting weight updated! 📊');
        
        // Update local storage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const data = JSON.parse(storedUserData);
          data.startingWeight = newStarting;
          localStorage.setItem('userData', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Failed to update starting weight:', error);
        swipeableToast.error('Failed to update starting weight');
      }
    }
  };

  return (
    <>
      {/* Sticky Header with Safe Area */}
      <div style={{ paddingTop: 'var(--safe-area-top)' }} className="sticky top-0 z-40 w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-gray-900 backdrop-blur-md border-b border-indigo-200 dark:border-indigo-500/30 px-4 py-4 shadow-sm">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back!</h1>
        <p className="text-gray-700 dark:text-white/70">Your fitness journey starts now.</p>
      </div>
      
      <div className="p-4 space-y-6 pb-24">
      
      {/* Dynamic Status Card */}
      <DynamicStatusCard 
        userData={userData} 
        onStartWorkout={onStartWorkout}
        onViewDiet={onViewDiet}
      />
      
      {/* Water Intake Tracker */}
      <div className="bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl shadow-blue-500/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-3xl">💧</div>
            <div>
              <h3 className="text-xl font-bold text-white">Water Intake</h3>
              <p className="text-sm text-blue-100">Stay hydrated!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{waterIntake}/{waterGoal}</p>
            <p className="text-xs text-blue-100">glasses</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-blue-900/30 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-300 to-blue-200 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
          />
        </div>

        {/* Water Glasses Visualization */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[...Array(waterGoal)].map((_, i) => (
            <div 
              key={i} 
              className={`text-2xl transition-all ${i < waterIntake ? 'opacity-100 scale-110' : 'opacity-30'}`}
            >
              {i < waterIntake ? '💧' : '🫗'}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={addWaterGlass}
            disabled={waterIntake >= 50}
            className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/20"
          >
            <span className="text-xl">+</span>
            <span>{waterIntake >= 50 ? 'Max Reached' : 'Add Glass'}</span>
          </button>
          <button
            onClick={removeWaterGlass}
            disabled={waterIntake === 0}
            className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="text-xl">-</span>
            <span>Remove</span>
          </button>
        </div>

        {/* Daily Recommendation */}
        <p className="text-xs text-blue-100 text-center mt-3">
          💡 Recommended: 8 glasses (2 liters) per day
        </p>
      </div>

      {/* Health Connect Integration */}
      {!healthConnected ? (
        <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl shadow-green-500/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">📊 Connect Health App</h3>
              <p className="text-sm text-green-100">Sync data from your smartwatch & fitness trackers</p>
            </div>
            <div className="text-4xl">⌚</div>
          </div>
          <p className="text-sm text-green-100 mb-4">
            Automatically track steps, calories, heart rate, and more from:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-3 py-1 bg-white/20 rounded-full text-white">Fitbit</span>
            <span className="text-xs px-3 py-1 bg-white/20 rounded-full text-white">Garmin</span>
            <span className="text-xs px-3 py-1 bg-white/20 rounded-full text-white">Samsung Health</span>
            <span className="text-xs px-3 py-1 bg-white/20 rounded-full text-white">Mi Band</span>
            <span className="text-xs px-3 py-1 bg-white/20 rounded-full text-white">Wear OS</span>
          </div>
          <button
            onClick={connectHealthConnect}
            className="w-full bg-white text-green-600 font-bold py-3 px-4 rounded-xl hover:bg-green-50 transition shadow-lg"
          >
            Connect Health Connect
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 rounded-2xl p-6 shadow-xl shadow-purple-500/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">📊 Today's Activity</h3>
              <p className="text-sm text-purple-100">Synced from Health Connect</p>
            </div>
            <button
              onClick={syncHealthData}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">👟</div>
              <p className="text-2xl font-bold text-white">{healthData.steps.toLocaleString()}</p>
              <p className="text-xs text-purple-100">Steps</p>
              <div className="w-full bg-purple-900/30 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-white h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min((healthData.steps / 10000) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">🔥</div>
              <p className="text-2xl font-bold text-white">{healthData.calories}</p>
              <p className="text-xs text-purple-100">Calories Burned</p>
              <div className="w-full bg-purple-900/30 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-orange-400 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min((healthData.calories / 500) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">📏</div>
              <p className="text-2xl font-bold text-white">{healthData.distance.toFixed(1)}</p>
              <p className="text-xs text-purple-100">km Traveled</p>
            </div>

            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">❤️</div>
              <p className="text-2xl font-bold text-white">{healthData.heartRate || '--'}</p>
              <p className="text-xs text-purple-100">Avg Heart Rate</p>
            </div>
          </div>

          <p className="text-xs text-purple-100 text-center">
            ✅ Connected to Health Connect
          </p>
        </div>
      )}

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
          color="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50"
          editable
          onEdit={(val) => updateStartingWeight(parseFloat(val))}
        />
        <MetricCard 
          title="Target Weight" 
          value={formatWeight(targetWeight, units)} 
          icon={Target} 
          color="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50"
          editable
          onEdit={(val) => updateTargetWeight(parseFloat(val))}
        />
        <MetricCard 
          title="Current Weight" 
          value={formatWeight(currentWeight, units)} 
          icon={Dumbbell} 
          color="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
          editable
          onEdit={(val) => updateWeight(parseFloat(val))}
        />
        <MetricCard 
          title="Goal Progress" 
          value={`${goalProgress}%`} 
          icon={Heart} 
          color="bg-gradient-to-br from-pink-400 via-rose-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/50"
        />
      </div>
    </div>
    </>
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
      swipeableToast.success('Verification email sent! Check your inbox and spam folder. 📧');
      
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
      swipeableToast.error(error.message || 'Failed to resend verification email');
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
            <div className="w-20 h-20 flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
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
      swipeableToast.success('Profile completed! Welcome to FitTrack! 🎉');
      
      // Auth listener will automatically pick up the new data
      // No need to call anything - React will re-render
    } catch (err: any) {
      console.error('Error creating profile:', err);
      setError(err.message || 'Failed to create profile');
      swipeableToast.error('Failed to create profile. Please try again.');
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
        swipeableToast.error(emailValidation.message);
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
        swipeableToast.success('Account created! Please check your email to verify. 📧');
      } catch (verifyError: any) {
        console.error('Error sending verification email:', verifyError);
        swipeableToast.error('Account created but failed to send verification email. Please try resending.');
      }
      
      // Don't call onComplete - Auth Guard will automatically show verification screen
      // The onAuthStateChanged listener will detect the new unverified user
    } catch (err: any) {
      console.error('Error creating user profile:', err);
      
      // Handle email already in use
      if (err.code === 'auth/email-already-in-use') {
        swipeableToast.error('Account already exists. Please log in instead.');
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      swipeableToast.error('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      swipeableToast.success('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'No account found with this email'
        : 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      swipeableToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isSignUp) {
      // Validate email authenticity before going to profile setup
      const emailValidation = isAuthenticEmail(email);
      if (!emailValidation.valid) {
        setError(emailValidation.message);
        swipeableToast.error(emailValidation.message);
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
        swipeableToast.error('Please verify your email before logging in. Check your inbox. 📧');
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
        swipeableToast.success(`Welcome back, ${userData.name}! 👋`);
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
        swipeableToast.error('Account not found. Please sign up first.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
        swipeableToast.error('Incorrect password');
      } else {
        setError(err.message || 'Failed to login');
        swipeableToast.error('Login failed. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:via-indigo-900 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-200" style={{ paddingTop: 'var(--safe-area-top)', paddingBottom: 'calc(1.25rem + var(--safe-area-bottom))' }}>
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 dark:bg-indigo-600 rounded-full mb-3 sm:mb-4">
            <Dumbbell className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Aura Flow</h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-white/70">Your journey to better health starts here</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
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
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex-shrink-0 text-gray-400" />
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
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex-shrink-0 text-gray-400" />
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
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex-shrink-0 text-gray-400" />
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition duration-200 w-10 h-10 flex items-center justify-center flex-shrink-0"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 flex-shrink-0" /> : <Eye className="w-5 h-5 flex-shrink-0" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition duration-200"
                >
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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal 
          onClose={() => setShowForgotPassword(false)}
          email={email}
          setEmail={setEmail}
          error={error}
          isLoading={isLoading}
          onSubmit={handleForgotPassword}
        />
      )}
    </div>
  );
};

// Forgot Password Modal Component
const ForgotPasswordModal = ({
  onClose,
  email,
  setEmail,
  error,
  isLoading,
  onSubmit
}: {
  onClose: () => void;
  email: string;
  setEmail: (value: string) => void;
  error: string;
  isLoading: boolean;
  onSubmit: () => void;
}) => {
  useEscapeKey(onClose);
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 id="forgot-password-title" className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close reset password dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-lg text-red-700 dark:text-red-300 text-sm" role="alert">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition duration-200 text-gray-900 dark:text-white"
            placeholder="your@email.com"
          />
        </div>
        
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-200 shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </div>
    </div>
  );
};

// Helper function to calculate estimated 1RM using Epley formula
const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
};

// Helper function to get best set from a workout
const getBestSet = (sets: Array<{ reps: number; weight: number }>) => {
  return sets.reduce((best, current) => {
    const currentMax = calculate1RM(current.weight, current.reps);
    const bestMax = calculate1RM(best.weight, best.reps);
    return currentMax > bestMax ? current : best;
  });
};

// ==========================================
// CUSTOM HOOK: Persistent Workout Timer
// ==========================================
const useWorkoutTimer = (startTime: number | null) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (!startTime) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);
  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return { elapsedTime, formatTime };
};

// ==========================================
// EXERCISE FORM TIPS - Curated coaching cues
// ==========================================
const EXERCISE_TIPS: { [key: string]: { tips: string[]; muscles: string[] } } = {
  // Legs - Gym
  "Barbell Back Squat": { tips: ["Keep chest up, core braced", "Drive through heels", "Knees track over toes"], muscles: ["Quads", "Glutes", "Hamstrings"] },
  "Romanian Deadlift (RDL)": { tips: ["Hinge at hips, not waist", "Keep bar close to legs", "Feel the hamstring stretch"], muscles: ["Hamstrings", "Glutes", "Lower Back"] },
  "Walking Lunges": { tips: ["Take big steps", "Keep torso upright", "Push through front heel"], muscles: ["Quads", "Glutes"] },
  "Lying Leg Curl": { tips: ["Control the negative", "Don't arch your back", "Squeeze at the top"], muscles: ["Hamstrings"] },
  "Leg Extension": { tips: ["Don't lock out knees", "Control the movement", "Squeeze quads at top"], muscles: ["Quads"] },
  "Standing Calf Raise": { tips: ["Full range of motion", "Pause at the top", "Slow eccentric"], muscles: ["Calves"] },
  "Seated Calf Raise": { tips: ["Full stretch at bottom", "Pause at peak contraction", "Target the soleus"], muscles: ["Calves"] },
  "Front Squat": { tips: ["Keep elbows high", "Stay upright", "Core tight throughout"], muscles: ["Quads", "Core"] },
  "Bulgarian Split Squats": { tips: ["Rear foot elevated", "Control the descent", "Drive through front heel"], muscles: ["Quads", "Glutes"] },
  "Barbell Deadlift": { tips: ["Keep back flat", "Drive through legs first", "Lock out with glutes"], muscles: ["Hamstrings", "Glutes", "Back"] },
  
  // Legs - Home
  "Bodyweight Squats": { tips: ["Sit back into the squat", "Keep knees over toes", "Full depth if mobile"], muscles: ["Quads", "Glutes"] },
  "Lunges": { tips: ["Big steps forward", "Keep torso upright", "Push through front heel"], muscles: ["Quads", "Glutes"] },
  "Glute Bridges": { tips: ["Squeeze glutes at top", "Keep core engaged", "Pause at the top"], muscles: ["Glutes", "Hamstrings"] },
  
  // Back - Gym
  "Barbell Bent-Over Row": { tips: ["Keep back flat", "Pull to lower chest", "Squeeze shoulder blades"], muscles: ["Lats", "Rhomboids", "Rear Delts"] },
  "Weighted Pull-ups": { tips: ["Full dead hang at bottom", "Chin over bar", "Control the descent"], muscles: ["Lats", "Biceps", "Rear Delts"] },
  "Single-Arm Dumbbell Row": { tips: ["Keep elbow close to body", "Pull to hip", "Avoid rotation"], muscles: ["Lats", "Rhomboids"] },
  "Close-Grip Lat Pulldown": { tips: ["Lean back slightly", "Pull to upper chest", "Squeeze lats"], muscles: ["Lats", "Biceps"] },
  "Face Pulls": { tips: ["Pull to face level", "External rotate at end", "Light weight, high reps"], muscles: ["Rear Delts", "Rotator Cuff"] },
  "Dumbbell Shrugs": { tips: ["Shrug straight up", "Hold at top", "Control the weight"], muscles: ["Traps"] },
  "Hyperextensions (Back Extensions)": { tips: ["Don't hyperextend", "Squeeze glutes at top", "Slow and controlled"], muscles: ["Lower Back", "Glutes"] },
  
  // Back - Home
  "Pull-ups/Chin-ups": { tips: ["Full hang at bottom", "Pull chest to bar", "Control descent"], muscles: ["Lats", "Biceps"] },
  "Inverted Rows": { tips: ["Keep body straight", "Pull chest to bar", "Squeeze shoulder blades"], muscles: ["Upper Back", "Biceps"] },
  "Supermans": { tips: ["Lift arms and legs together", "Hold at top", "Control the movement"], muscles: ["Lower Back", "Glutes"] },
  
  // Chest - Gym
  "Flat Barbell Bench Press": { tips: ["Arch upper back, not lower", "Touch chest lightly", "Drive feet into floor"], muscles: ["Chest", "Triceps", "Front Delts"] },
  "Incline Dumbbell Press": { tips: ["30-45° incline", "Don't flare elbows 90°", "Feel upper chest stretch"], muscles: ["Upper Chest", "Front Delts"] },
  "Dips (Chest Focus)": { tips: ["Lean forward slightly", "Go deep for chest stretch", "Control the movement"], muscles: ["Lower Chest", "Triceps"] },
  "Cable Crossover (High-to-Low)": { tips: ["Slight bend in elbows", "Squeeze at center", "Control the negative"], muscles: ["Chest", "Front Delts"] },
  "Flat Dumbbell Fly": { tips: ["Slight bend in elbows", "Feel the stretch", "Squeeze at top"], muscles: ["Chest"] },
  "Pec Deck Fly": { tips: ["Keep slight bend in arms", "Squeeze at center", "Control the negative"], muscles: ["Chest"] },
  "Incline Barbell Press": { tips: ["30-45° angle", "Control the bar path", "Drive through chest"], muscles: ["Upper Chest", "Triceps"] },
  "Flat Dumbbell Press": { tips: ["Neutral or slight angle grip", "Full range of motion", "Press up and in"], muscles: ["Chest", "Triceps"] },
  
  // Chest - Home  
  "Push-ups (various angles)": { tips: ["Keep body straight", "Elbows at 45°", "Full range of motion"], muscles: ["Chest", "Triceps"] },
  "Decline Push-ups": { tips: ["Feet elevated", "Targets upper chest", "Keep core tight"], muscles: ["Upper Chest", "Shoulders"] },
  "Diamond Push-ups": { tips: ["Hands together", "Elbows close to body", "Targets triceps"], muscles: ["Triceps", "Inner Chest"] },
  
  // Shoulders
  "Seated Dumbbell Overhead Press": { tips: ["Don't arch back", "Press in slight arc", "Full lockout overhead"], muscles: ["Shoulders", "Triceps"] },
  "Standing Dumbbell Lateral Raise": { tips: ["Slight bend in elbows", "Lead with elbows", "Don't go above shoulder height"], muscles: ["Side Delts"] },
  "Arnold Press": { tips: ["Rotate as you press", "Full range of motion", "Control the rotation"], muscles: ["Front Delts", "Side Delts"] },
  "Bent-Over Dumbbell Reverse Fly": { tips: ["Keep back flat", "Squeeze rear delts", "Light weight, control"], muscles: ["Rear Delts", "Upper Back"] },
  "Front Plate Raise": { tips: ["Don't swing", "Stop at shoulder height", "Control the descent"], muscles: ["Front Delts"] },
  
  // Arms
  "Close-Grip Bench Press": { tips: ["Hands shoulder-width apart", "Keep elbows tucked", "Focus on triceps"], muscles: ["Triceps", "Chest"] },
  "Barbell Curl": { tips: ["No swinging", "Keep elbows pinned", "Squeeze at the top"], muscles: ["Biceps"] },
  "Hammer Curls": { tips: ["Neutral grip throughout", "Alternate or together", "Control the weight"], muscles: ["Biceps", "Brachialis"] },
  "Rope Triceps Pushdown": { tips: ["Keep elbows at sides", "Split rope at bottom", "Squeeze triceps"], muscles: ["Triceps"] },
  "Skullcrushers (Lying Tricep Extension)": { tips: ["Keep elbows stable", "Lower to forehead", "Full extension at top"], muscles: ["Triceps"] },
  
  // Core
  "Hanging Leg Raises": { tips: ["Don't swing", "Curl pelvis up", "Control the descent"], muscles: ["Lower Abs", "Hip Flexors"] },
  "Cable Crunch": { tips: ["Round the spine", "Pull with abs not arms", "Hold the contraction"], muscles: ["Abs"] },
  "Ab Wheel Rollout": { tips: ["Keep core tight", "Don't arch back", "Full extension if able"], muscles: ["Abs", "Core"] },
  "Plank Variations": { tips: ["Keep body straight", "Engage core", "Breathe steadily"], muscles: ["Core", "Shoulders"] },
  "Russian Twists (weighted)": { tips: ["Rotate from core", "Keep feet elevated", "Control the twist"], muscles: ["Obliques", "Abs"] },
  "Decline Sit-ups": { tips: ["Control the descent", "Don't use momentum", "Exhale on the way up"], muscles: ["Upper Abs"] },
};

// Helper to find muscle group for an exercise
const findMuscleGroupForExercise = (exerciseName: string): { name: string; icon: string } | null => {
  for (const group of MUSCLE_GROUPS) {
    if (group.exercises.gym.includes(exerciseName) || group.exercises.home.includes(exerciseName)) {
      return { name: group.name, icon: group.icon };
    }
  }
  return null;
};

// ==========================================
// ACTIVE WORKOUT SESSION - Focus Mode Architecture
// Two internal views: FOCUS (immersive) and LOGGING (data entry)
// ==========================================
const ActiveWorkoutSession = ({
  workoutExercises,
  currentExerciseIndex: _parentExerciseIndex,
  onExerciseComplete,
  onFinishWorkout,
  onQuit,
  userData,
  workoutStartTime
}: {
  workoutExercises: Array<{ exercise?: string; name?: string; sets: Array<{ reps: number; weight: number }> }>;
  currentExerciseIndex: number;
  onExerciseComplete: (exerciseIndex: number, sets: Array<{ reps: number; weight: number }>) => void;
  onFinishWorkout: (workoutData?: Array<{ name?: string; exercise?: string; sets: Array<{ reps: number; weight: number }> }>) => void;
  onQuit: () => void;
  userData: any;
  workoutStartTime: number | null;
}) => {
  // ==========================================
  // CENTRALIZED STATE MANAGEMENT
  // ==========================================
  // All state is managed here for reliability
  
  // Deep clone exercises to manage internally
  const [exercises, setExercises] = useState(() => 
    workoutExercises.map(ex => ({ ...ex, sets: [...ex.sets] }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'FOCUS' | 'LOGGING'>('FOCUS');
  const [isResting, setIsResting] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  
  // Refs for scroll management
  const focusContainerRef = useRef<HTMLDivElement>(null);
  
  // Persistent timer hook
  const { elapsedTime, formatTime } = useWorkoutTimer(workoutStartTime);
  
  // User preferences
  const restDuration = userData?.restTimerDefault || 90;
  
  // Current exercise data (derived)
  const currentExercise = exercises[currentIndex];
  const currentExerciseName = currentExercise?.exercise || currentExercise?.name || 'Exercise';
  const totalExercises = exercises.length;
  const completedCount = exercises.filter(ex => ex.sets && ex.sets.length > 0).length;
  const isLastExercise = currentIndex >= totalExercises - 1;
  
  // Get exercise metadata
  const muscleGroup = findMuscleGroupForExercise(currentExerciseName);
  const exerciseTips = EXERCISE_TIPS[currentExerciseName];
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [lastWorkoutForExercise, setLastWorkoutForExercise] = useState<any>(null);
  const [gifLoading, setGifLoading] = useState(true);
  
  // Check if this is a bodyweight/home exercise (no weights needed)
  const isBodyweightExercise = useMemo(() => {
    for (const group of MUSCLE_GROUPS) {
      if (group.exercises.home.some(ex => 
        ex.toLowerCase() === currentExerciseName.toLowerCase() ||
        currentExerciseName.toLowerCase().includes(ex.toLowerCase()) ||
        ex.toLowerCase().includes(currentExerciseName.toLowerCase())
      )) {
        return true;
      }
    }
    // Also check for common bodyweight exercise keywords
    const bodyweightKeywords = ['push-up', 'pushup', 'pull-up', 'pullup', 'plank', 'bodyweight', 'dip', 'lunge', 'squat', 'crunch', 'burpee', 'mountain climber', 'flutter', 'leg raise', 'v-up', 'dead bug', 'bird dog', 'superman', 'glute bridge'];
    return bodyweightKeywords.some(kw => currentExerciseName.toLowerCase().includes(kw));
  }, [currentExerciseName]);
  
  // Cycle through tips every 4 seconds
  useEffect(() => {
    if (!exerciseTips?.tips?.length) return;
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % exerciseTips.tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [exerciseTips?.tips?.length, currentIndex]);
  
  // Reset tip index when exercise changes
  useEffect(() => {
    setCurrentTipIndex(0);
    setGifLoading(true);
  }, [currentIndex]);
  
  // Load last workout data for current exercise
  useEffect(() => {
    const loadLastWorkout = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      try {
        const workoutQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid),
          where('exercise', '==', currentExerciseName),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const snapshot = await getDocs(workoutQuery);
        if (!snapshot.empty) {
          setLastWorkoutForExercise(snapshot.docs[0].data());
        } else {
          setLastWorkoutForExercise(null);
        }
      } catch (error) {
        console.error('Error loading last workout:', error);
        setLastWorkoutForExercise(null);
      }
    };
    
    loadLastWorkout();
  }, [currentExerciseName]);
  
  // Smart set recommendation based on history
  const getRecommendation = () => {
    if (lastWorkoutForExercise?.sets?.length > 0) {
      const lastSets = lastWorkoutForExercise.sets;
      const avgWeight = Math.round(lastSets.reduce((sum: number, s: any) => sum + s.weight, 0) / lastSets.length);
      const avgReps = Math.round(lastSets.reduce((sum: number, s: any) => sum + s.reps, 0) / lastSets.length);
      return { sets: lastSets.length, reps: avgReps, weight: avgWeight };
    }
    return { sets: 3, reps: 10, weight: null }; // Default
  };
  const recommendation = getRecommendation();
  
  // ==========================================
  // SYNC TO localStorage FOR PERSISTENCE
  // ==========================================
  useEffect(() => {
    const storeData = {
      exercises,
      currentIndex,
      viewMode,
      startTime: workoutStartTime,
      lastUpdated: Date.now()
    };
    localStorage.setItem('AURA_FOCUS_MODE', JSON.stringify(storeData));
  }, [exercises, currentIndex, viewMode, workoutStartTime]);
  
  // Scroll to top when exercise changes
  useEffect(() => {
    if (focusContainerRef.current) {
      focusContainerRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  // ==========================================
  // CORE ACTIONS
  // ==========================================
  
  // Log a set to current exercise
  const logSet = useCallback((weight: number, reps: number, _type: 'normal' | 'warmup' | 'drop' | 'failure' = 'normal') => {
    setExercises(prev => {
      const updated = [...prev];
      if (updated[currentIndex]) {
        updated[currentIndex] = {
          ...updated[currentIndex],
          sets: [...updated[currentIndex].sets, { reps, weight }]
        };
      }
      return updated;
    });
    
    // Also sync to parent
    const currentSets = exercises[currentIndex]?.sets || [];
    onExerciseComplete(currentIndex, [...currentSets, { reps, weight }]);
    
    // Start rest timer
    if (userData?.restTimerEnabled !== false) {
      setIsResting(true);
    }
    
    swipeableToast.success(`Set logged: ${weight}${userData?.measurementUnit === 'imperial' ? 'lbs' : 'kg'} × ${reps} 💪`);
  }, [currentIndex, exercises, onExerciseComplete, userData]);
  
  // Remove a set from current exercise
  const removeSet = useCallback((setIndex: number) => {
    setExercises(prev => {
      const updated = [...prev];
      if (updated[currentIndex]) {
        updated[currentIndex] = {
          ...updated[currentIndex],
          sets: updated[currentIndex].sets.filter((_, i) => i !== setIndex)
        };
      }
      return updated;
    });
  }, [currentIndex]);
  
  // Advance to next exercise
  const advanceExercise = useCallback(() => {
    if (currentIndex < totalExercises - 1) {
      // Sync current exercise data to parent before advancing
      onExerciseComplete(currentIndex, exercises[currentIndex]?.sets || []);
      
      setCurrentIndex(prev => prev + 1);
      setViewMode('FOCUS');
      
      // Don't start rest timer when advancing - user is ready to continue
      // Rest timer only shows after logging a set
    } else {
      // Last exercise - finish workout
      handleFinishWorkout();
    }
  }, [currentIndex, totalExercises, exercises, onExerciseComplete]);
  
  // Skip to next exercise (no logging)
  const skipExercise = useCallback(() => {
    if (currentIndex < totalExercises - 1) {
      setCurrentIndex(prev => prev + 1);
      setViewMode('FOCUS');
    } else {
      handleFinishWorkout();
    }
  }, [currentIndex, totalExercises]);
  
  // Finish entire workout - Reliable transaction workflow
  const handleFinishWorkout = useCallback(async () => {
    try {
      // Build final workout data directly from internal state
      const finalWorkoutData = exercises.map(ex => ({
        name: ex.name || ex.exercise,
        exercise: ex.exercise || ex.name,
        sets: ex.sets || []
      }));
      
      // Filter out exercises with no sets
      const validWorkoutData = finalWorkoutData.filter(ex => ex.sets && ex.sets.length > 0);
      
      if (validWorkoutData.length === 0) {
        swipeableToast.error('No exercises with sets to save. Log at least one set!');
        return;
      }
      
      console.log('Focus Mode finishing workout with data:', validWorkoutData);
      
      // Clear localStorage BEFORE calling parent (parent will also clear, but this is a safety)
      localStorage.removeItem('AURA_FOCUS_MODE');
      
      // Pass workout data directly to parent's finishWorkout function
      // The parent function handles all Firebase saves, state cleanup, and UI transitions
      await onFinishWorkout(validWorkoutData);
      
      // Note: We do NOT call onQuit() here anymore!
      // The parent's finishWorkout function now handles:
      // - setGuidedWorkoutMode(false)
      // - setExerciseSubView('list')
      // - All localStorage cleanup
      // - Showing the workout summary
      
      console.log('Focus Mode: Workout finish transaction completed');
    } catch (error) {
      console.error('Focus Mode: Error finishing workout:', error);
      swipeableToast.error('Failed to save workout. Please try again.');
    }
  }, [exercises, onFinishWorkout]);
  
  // ==========================================
  // MULTI-LEVEL BACK BUTTON HANDLER
  // ==========================================
  const handleBack = useCallback(() => {
    // Level 1: If in LOGGING view, go back to FOCUS
    if (viewMode === 'LOGGING') {
      setViewMode('FOCUS');
      return;
    }
    
    // Level 2: If rest timer is active, cancel it
    if (isResting) {
      setIsResting(false);
      return;
    }
    
    // Level 3: If in FOCUS view, show quit confirmation
    setShowQuitConfirm(true);
  }, [viewMode, isResting]);
  
  // Handle quit confirmation - Save incomplete workout to history
  const handleQuit = useCallback(async () => {
    try {
      // Check if there are any logged sets to save
      const exercisesWithSets = exercises.filter(ex => ex.sets && ex.sets.length > 0);
      
      if (exercisesWithSets.length > 0) {
        const user = auth.currentUser;
        if (user) {
          const now = new Date();
          const totalSets = exercisesWithSets.reduce((sum, ex) => sum + ex.sets.length, 0);
          const totalVolume = exercisesWithSets.reduce((sum, ex) => 
            sum + ex.sets.reduce((setSum, s) => setSum + (s.weight * s.reps), 0), 0
          );
          const duration = workoutStartTime ? Math.floor((Date.now() - workoutStartTime) / 1000) : 0;
          
          // Save each exercise individually to workoutHistory (for exercise history/PRs)
          for (const ex of exercisesWithSets) {
            const exerciseName = ex.exercise || ex.name || 'Unknown Exercise';
            const bestSet = ex.sets.reduce((best, set) => 
              (set.weight * set.reps > best.weight * best.reps) ? set : best, ex.sets[0]
            );
            
            await addDoc(collection(db, 'workoutHistory'), {
              userId: user.uid,
              exercise: exerciseName,
              sets: ex.sets.map(s => ({ reps: s.reps, weight: s.weight, type: 'normal' })),
              timestamp: now.getTime(),
              date: now.toISOString().split('T')[0],
              bestSet,
              incomplete: true // Mark as from incomplete workout
            });
          }
          
          // Save workout session to workoutSessions (for session history)
          await addDoc(collection(db, 'workoutSessions'), {
            userId: user.uid,
            exercises: exercisesWithSets.map(ex => ({
              name: ex.exercise || ex.name,
              sets: ex.sets
            })),
            totalSets,
            totalVolume,
            duration,
            timestamp: now.getTime(),
            date: now.toISOString().split('T')[0],
            status: 'incomplete', // Mark as incomplete
            completedExercises: exercisesWithSets.length,
            totalExercises: exercises.length
          });
          
          swipeableToast.success(`Saved ${exercisesWithSets.length} exercise(s) to history`);
          console.log('Incomplete workout saved:', exercisesWithSets.length, 'exercises');
        }
      }
    } catch (error) {
      console.error('Error saving incomplete workout:', error);
      // Don't block quit even if save fails
    }
    
    // Clear all localStorage entries related to workout
    localStorage.removeItem('AURA_FOCUS_MODE');
    localStorage.removeItem('aura_active_workout');
    localStorage.removeItem('AURA_WORKOUT_STORE');
    onQuit();
  }, [exercises, workoutStartTime, onQuit]);
  
  if (!currentExercise) return null;
  
  // ==========================================
  // VIEW A: FOCUS SCREEN (Default, Immersive)
  // ==========================================
  if (viewMode === 'FOCUS') {
    const weightUnit = userData?.measurementUnit === 'imperial' ? 'lbs' : 'kg';
    
    return (
      <div ref={focusContainerRef} className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex flex-col overflow-y-auto" style={{ paddingTop: 'env(safe-area-inset-top, 48px)' }}>
        {/* TOP: Header with Timer */}
        <div className="flex flex-col items-center justify-center pt-4 pb-4 px-4 bg-black/20">
          {/* Workout Timer - BIG & BOLD */}
          <div className="text-6xl font-bold text-white font-mono mb-2">
            {formatTime(elapsedTime)}
          </div>
          
          {/* Exercise Navigation Dots */}
          <div className="flex items-center gap-1.5 mb-2">
            {exercises.map((ex, idx) => {
              const hasLogs = ex.sets && ex.sets.length > 0;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    isCurrent 
                      ? 'w-6 bg-white' 
                      : hasLogs 
                        ? 'bg-green-500' 
                        : 'bg-white/30'
                  }`}
                  aria-label={`Go to exercise ${idx + 1}`}
                />
              );
            })}
          </div>
          
          {/* Progress Text */}
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>Exercise {currentIndex + 1} of {totalExercises}</span>
            <span>•</span>
            <span>{completedCount} completed</span>
          </div>
        </div>
        
        {/* MIDDLE: Hero Section */}
        <div className="flex-1 flex flex-col items-center px-6 py-4 overflow-y-auto">
          {/* Muscle Group Badge */}
          {muscleGroup && (
            <div className="flex items-center gap-2 mb-3 bg-white/10 px-4 py-1.5 rounded-full">
              <span className="text-lg">{muscleGroup.icon}</span>
              <span className="text-white/80 text-sm font-medium">{muscleGroup.name}</span>
              {exerciseTips?.muscles && (
                <span className="text-white/50 text-xs">• {exerciseTips.muscles.slice(0, 2).join(', ')}</span>
              )}
            </div>
          )}
          
          {/* Exercise GIF/Visual with Loading State - Larger container for better visibility */}
          <div className="relative w-full max-w-[320px] sm:max-w-[380px] min-h-[200px] sm:min-h-[280px] bg-white/5 rounded-2xl overflow-hidden mb-4 shadow-2xl border-2 border-white/10 flex items-center justify-center">
            {gifLoading && EXERCISE_IMAGES[currentExerciseName] && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
            {EXERCISE_IMAGES[currentExerciseName] ? (
              <img 
                src={EXERCISE_IMAGES[currentExerciseName]} 
                alt={currentExerciseName}
                className={`w-full h-full object-contain p-1 transition-opacity duration-300 ${gifLoading ? 'opacity-0' : 'opacity-100'}`}
                style={{ maxHeight: '280px' }}
                onLoad={() => setGifLoading(false)}
                onError={(e) => {
                  setGifLoading(false);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center min-h-[200px]">
                <Dumbbell className="w-20 h-20 text-white/40" />
              </div>
            )}
          </div>
          
          {/* Exercise Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-3 leading-tight">
            {currentExerciseName}
          </h1>
          
          {/* Form Tips Carousel */}
          {exerciseTips?.tips && exerciseTips.tips.length > 0 && (
            <div className="w-full max-w-sm mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div className="flex-1">
                  <p className="text-amber-300 text-sm font-medium transition-all duration-300">
                    {exerciseTips.tips[currentTipIndex]}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {exerciseTips.tips.map((_, idx) => (
                      <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentTipIndex ? 'bg-amber-400 w-4' : 'bg-amber-400/30'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Smart Goal Recommendation */}
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/20 mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">
                {lastWorkoutForExercise ? '📊 Based on last session' : '🎯 Suggested Goal'}
              </p>
              {lastWorkoutForExercise && (
                <span className="text-white/40 text-xs">
                  {new Date(lastWorkoutForExercise.timestamp).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-white text-xl font-bold text-center">
              {recommendation.sets} Sets × {recommendation.reps} Reps
              {recommendation.weight && !isBodyweightExercise && (
                <span className="text-indigo-300"> @ {recommendation.weight}{weightUnit}</span>
              )}
            </p>
            {isBodyweightExercise && (
              <p className="text-green-400 text-xs text-center mt-1">🏠 Bodyweight Exercise</p>
            )}
          </div>
          
          {/* Current Progress */}
          {currentExercise.sets && currentExercise.sets.length > 0 && (
            <div className="w-full max-w-sm bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-400 text-sm font-semibold">
                  ✓ {currentExercise.sets.length}/{recommendation.sets} Sets Logged
                </p>
                <span className="text-green-300 text-xs">
                  {isBodyweightExercise 
                    ? `${currentExercise.sets.reduce((sum, s) => sum + s.reps, 0)} total reps`
                    : `${currentExercise.sets.reduce((sum, s) => sum + s.weight * s.reps, 0).toLocaleString()} ${weightUnit} volume`
                  }
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {currentExercise.sets.map((set, idx) => (
                  <span key={idx} className="px-2 py-1 bg-green-500/30 rounded text-green-300 text-xs font-medium">
                    {isBodyweightExercise ? `${set.reps} reps` : `${set.weight}${weightUnit} × ${set.reps}`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* BOTTOM: Action Area */}
        <div className="px-6 pb-8 space-y-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 100px)' }}>
          {/* If exercise has logged sets, show Next Exercise button */}
          {currentExercise.sets && currentExercise.sets.length > 0 ? (
            <>
              <button
                onClick={advanceExercise}
                className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl text-white text-lg font-bold shadow-2xl transition-all transform hover:scale-[1.02]"
              >
                {isLastExercise ? '✓ Finish Workout' : 'Next Exercise →'}
              </button>
              
              {/* Secondary: Log More Sets */}
              <button
                onClick={() => setViewMode('LOGGING')}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white/60 font-medium transition-all"
              >
                Log More Sets
              </button>
            </>
          ) : (
            <>
              {/* Secondary Action: Skip Exercise */}
              <button
                onClick={skipExercise}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white/60 font-medium transition-all"
              >
                Skip Exercise →
              </button>
              
              {/* Primary Action: Log Sets */}
              <button
                onClick={() => setViewMode('LOGGING')}
                className="w-full py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 rounded-2xl text-white text-lg font-bold shadow-2xl transition-all transform hover:scale-[1.02]"
              >
                Log Sets
              </button>
            </>
          )}
          
          {/* Quick Actions Row */}
          <div className="flex gap-3">
            {/* Exit Button */}
            <button
              onClick={handleBack}
              className="flex-1 py-3 text-white/40 hover:text-white/60 text-sm font-medium transition-colors"
            >
              Exit Workout
            </button>
            
            {/* Instant Finish Button - Complete workout immediately */}
            {completedCount > 0 && (
              <button
                onClick={() => {
                  // Mark any remaining exercises with 0 sets and finish
                  handleFinishWorkout();
                }}
                className="flex-1 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-xl text-green-400 text-sm font-medium transition-colors"
              >
                ✓ Finish Now
              </button>
            )}
          </div>
        </div>
        
        {/* REST TIMER OVERLAY - Full Screen Modal */}
        {isResting && (
          <RestTimerOverlay
            key={`rest-focus-${currentIndex}-${Date.now()}`}
            duration={restDuration}
            onComplete={() => setIsResting(false)}
            onSkip={() => setIsResting(false)}
            onExtend={() => {}}
            nextExercise={
              currentIndex < exercises.length - 1 
                ? (exercises[currentIndex + 1]?.exercise || exercises[currentIndex + 1]?.name)
                : 'Workout Complete!'
            }
            timerKey={`focus-${currentIndex}-${exercises[currentIndex]?.sets?.length || 0}`}
          />
        )}
        
        {/* Quit Confirmation Modal */}
        {showQuitConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-[60]" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
            <div className="bg-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">Exit Workout?</h3>
              <p className="text-white/60 mb-4">
                Choose how you'd like to exit:
              </p>
              
              {/* Progress indicator */}
              {completedCount > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2 mb-4">
                  <p className="text-green-400 text-sm">
                    ✓ {completedCount}/{totalExercises} exercises completed
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                {/* Pause Option - Keep workout for later */}
                <button
                  onClick={() => {
                    // Just close the modal - workout is already saved to localStorage
                    setShowQuitConfirm(false);
                    onQuit();
                  }}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span>⏸️</span>
                  Pause & Resume Later
                </button>
                <p className="text-white/40 text-xs text-center -mt-1">
                  Your progress is saved. Continue anytime within 24 hours.
                </p>
                
                {/* Save & Quit - Save to history as incomplete */}
                {completedCount > 0 && (
                  <>
                    <button
                      onClick={handleQuit}
                      className="w-full py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-xl text-green-400 font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <span>💾</span>
                      Save to History & Quit
                    </button>
                    <p className="text-white/40 text-xs text-center -mt-1">
                      Saves {completedCount} exercise{completedCount > 1 ? 's' : ''} to your workout history.
                    </p>
                  </>
                )}
                
                {/* Cancel */}
                <button
                  onClick={() => setShowQuitConfirm(false)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
                >
                  Continue Workout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // ==========================================
  // VIEW B: LOGGING SCREEN (Data Entry)
  // ==========================================
  return (
    <>
      <LoggingScreenIntegrated
        exercise={currentExercise}
        exerciseIndex={currentIndex}
        totalExercises={totalExercises}
        isLastExercise={isLastExercise}
        onBack={() => setViewMode('FOCUS')}
        onLogSet={logSet}
        onRemoveSet={removeSet}
        onAdvance={advanceExercise}
        onFinishWorkout={handleFinishWorkout}
        userData={userData}
        workoutStartTime={workoutStartTime}
        existingSets={currentExercise.sets || []}
      />
      
      {/* REST TIMER OVERLAY - Rendered on top of LOGGING view */}
      {isResting && (
        <RestTimerOverlay
          key={`rest-logging-${currentIndex}-${Date.now()}`}
          duration={restDuration}
          onComplete={() => setIsResting(false)}
          onSkip={() => setIsResting(false)}
          onExtend={() => {}}
          nextExercise={
            currentIndex < exercises.length - 1 
              ? (exercises[currentIndex + 1]?.exercise || exercises[currentIndex + 1]?.name)
              : (currentExercise?.exercise || currentExercise?.name || 'Continue')
          }
          timerKey={`logging-${currentIndex}-${currentExercise?.sets?.length || 0}`}
        />
      )}
    </>
  );
};

// ==========================================
// INTEGRATED LOGGING SCREEN - Data Entry Component
// ==========================================
const LoggingScreenIntegrated = ({
  exercise,
  exerciseIndex,
  totalExercises,
  isLastExercise,
  onBack,
  onLogSet,
  onRemoveSet,
  onAdvance,
  onFinishWorkout,
  userData,
  workoutStartTime,
  existingSets
}: {
  exercise: { exercise?: string; name?: string; sets: Array<{ reps: number; weight: number }> };
  exerciseIndex: number;
  totalExercises: number;
  isLastExercise: boolean;
  onBack: () => void;
  onLogSet: (weight: number, reps: number, type: 'normal' | 'warmup' | 'drop' | 'failure') => void;
  onRemoveSet: (index: number) => void;
  onAdvance: () => void;
  onFinishWorkout: () => void;
  userData: any;
  workoutStartTime: number | null;
  existingSets: Array<{ reps: number; weight: number }>;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Derive exercise name from either field
  const exerciseName = exercise.exercise || exercise.name || 'Exercise';
  
  // Check if this is a bodyweight/home exercise (no weights needed)
  const isBodyweightExercise = useMemo(() => {
    for (const group of MUSCLE_GROUPS) {
      if (group.exercises.home.some(ex => 
        ex.toLowerCase() === exerciseName.toLowerCase() ||
        exerciseName.toLowerCase().includes(ex.toLowerCase()) ||
        ex.toLowerCase().includes(exerciseName.toLowerCase())
      )) {
        return true;
      }
    }
    // Also check for common bodyweight exercise keywords
    const bodyweightKeywords = ['push-up', 'pushup', 'pull-up', 'pullup', 'plank', 'bodyweight', 'dip', 'lunge', 'squat', 'crunch', 'burpee', 'mountain climber', 'flutter', 'leg raise', 'v-up', 'dead bug', 'bird dog', 'superman', 'glute bridge'];
    return bodyweightKeywords.some(kw => exerciseName.toLowerCase().includes(kw));
  }, [exerciseName]);
  
  const [currentReps, setCurrentReps] = useState('');
  const [currentWeight, setCurrentWeight] = useState(isBodyweightExercise ? '0' : '');
  const [currentSetType, setCurrentSetType] = useState<'normal' | 'warmup' | 'drop' | 'failure'>('normal');
  const [lastWorkoutData, setLastWorkoutData] = useState<any>(null);
  
  const useMetric = userData?.measurementUnit !== 'imperial';
  const weightUnit = useMetric ? 'kg' : 'lbs';
  
  // Persistent timer
  const { elapsedTime, formatTime } = useWorkoutTimer(workoutStartTime);
  
  // Scroll to top on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);
  
  // Load last workout data for this exercise
  useEffect(() => {
    const loadLastWorkout = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      try {
        const workoutQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid),
          where('exercise', '==', exercise.exercise),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const snapshot = await getDocs(workoutQuery);
        if (!snapshot.empty) {
          setLastWorkoutData(snapshot.docs[0].data());
        }
      } catch (error) {
        console.error('Error loading last workout:', error);
      }
    };
    
    loadLastWorkout();
  }, [exercise.exercise]);
  
  const addSet = () => {
    const reps = parseInt(currentReps);
    const weight = isBodyweightExercise ? 0 : parseFloat(currentWeight);
    
    if (reps > 0 && (isBodyweightExercise || weight >= 0)) {
      onLogSet(weight, reps, currentSetType);
      setCurrentReps('');
      if (!isBodyweightExercise) {
        setCurrentWeight('');
      }
      setCurrentSetType('normal');
    } else {
      swipeableToast.error(isBodyweightExercise ? 'Enter valid reps' : 'Enter valid reps and weight');
    }
  };
  
  const quickAddSet = (weight: number, reps: number) => {
    onLogSet(isBodyweightExercise ? 0 : weight, reps, 'normal');
  };
  
  const handleFinish = async () => {
    if (existingSets.length === 0) {
      swipeableToast.error('Log at least one set before finishing');
      return;
    }
    
    // Save individual exercise to Firebase (for history/PRs)
    const user = auth.currentUser;
    if (user) {
      try {
        const now = new Date();
        const bestSet = getBestSet(existingSets.map(s => ({ ...s, type: 'normal' as const })));
        await addDoc(collection(db, 'workoutHistory'), {
          userId: user.uid,
          exercise: exerciseName,
          sets: existingSets.map(s => ({ reps: s.reps, weight: s.weight, type: 'normal' })),
          timestamp: now.getTime(),
          date: now.toISOString().split('T')[0],
          bestSet
        });
        console.log(`Saved exercise: ${exerciseName} with ${existingSets.length} sets`);
      } catch (error) {
        console.error('Error saving exercise:', error);
        swipeableToast.error('Failed to save exercise data');
      }
    }
    
    // Advance or finish
    if (isLastExercise) {
      await onFinishWorkout();
    } else {
      onAdvance();
    }
  };
  
  return (
    <div ref={scrollContainerRef} className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 to-indigo-900 flex flex-col overflow-y-auto" style={{ paddingTop: 'env(safe-area-inset-top, 48px)' }}>
      {/* Header */}
      <div className="bg-black/30 px-4 py-4 flex items-center justify-between border-b border-white/10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        
        <div className="text-center">
          <p className="text-white/60 text-xs">Logging</p>
          <p className="text-white font-bold">{exerciseName}</p>
        </div>
        
        <div className="text-white/60 text-sm font-mono">
          {formatTime(elapsedTime)}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ paddingBottom: '160px' }}>
        {/* Progress Indicator */}
        <div className="bg-white/5 rounded-xl px-4 py-2 flex items-center justify-between">
          <span className="text-white/60 text-sm">Exercise {exerciseIndex + 1} of {totalExercises}</span>
          <span className="text-white font-medium">{existingSets.length} sets logged</span>
        </div>
        
        {/* Last Session History - LoggingScreenIntegrated */}
        {lastWorkoutData && lastWorkoutData.sets && lastWorkoutData.sets.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-400 text-sm font-semibold mb-3">📊 Last Session ({new Date(lastWorkoutData.timestamp).toLocaleDateString()})</p>
            <div className="flex flex-wrap gap-2">
              {lastWorkoutData.sets.slice(0, 4).map((set: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => quickAddSet(set.weight, set.reps)}
                  className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <span>{isBodyweightExercise ? `${set.reps} reps` : `${set.weight}${weightUnit}×${set.reps}`}</span>
                  <span className="text-xs">+</span>
                </button>
              ))}
            </div>
            <p className="text-yellow-400/60 text-xs mt-2">Tap to quick-add</p>
          </div>
        )}
        
        {/* Input Form */}
        <div className="bg-white/5 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold">Add Set #{existingSets.length + 1}</h3>
            {isBodyweightExercise && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                🏠 Bodyweight
              </span>
            )}
          </div>
          
          {/* Weight & Reps Inputs - Different layout for bodyweight */}
          {isBodyweightExercise ? (
            // Simplified bodyweight input - only reps
            <div className="space-y-3">
              <div>
                <label className="text-white/60 text-sm mb-2 block text-center">How many reps?</label>
                <input
                  type="number"
                  value={currentReps}
                  onChange={(e) => setCurrentReps(e.target.value)}
                  placeholder={lastWorkoutData?.sets?.[existingSets.length]?.reps?.toString() || "15"}
                  className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white text-center text-3xl font-bold focus:border-green-500 focus:outline-none placeholder:text-white/20"
                  autoFocus
                />
              </div>
              
              {/* Quick rep buttons for bodyweight */}
              <div className="flex gap-2 justify-center">
                {[10, 15, 20, 25, 30].map((rep) => (
                  <button
                    key={rep}
                    onClick={() => setCurrentReps(rep.toString())}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      currentReps === rep.toString()
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {rep}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Standard weight + reps input for gym exercises
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Weight ({weightUnit})</label>
                <input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder={lastWorkoutData?.sets?.[existingSets.length]?.weight?.toString() || (useMetric ? "60" : "135")}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center text-xl font-bold focus:border-indigo-500 focus:outline-none placeholder:text-white/20"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Reps</label>
                <input
                  type="number"
                  value={currentReps}
                  onChange={(e) => setCurrentReps(e.target.value)}
                  placeholder={lastWorkoutData?.sets?.[existingSets.length]?.reps?.toString() || "12"}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center text-xl font-bold focus:border-indigo-500 focus:outline-none placeholder:text-white/20"
                />
              </div>
            </div>
          )}
          
          {/* Set Type Selector */}
          <div className="flex gap-2">
            {[
              { type: 'normal', label: 'Normal', color: 'bg-gray-600' },
              { type: 'warmup', label: 'Warmup', color: 'bg-orange-500' },
              { type: 'drop', label: 'Drop', color: 'bg-purple-500' },
              { type: 'failure', label: 'Failure', color: 'bg-red-500' }
            ].map((t) => (
              <button
                key={t.type}
                onClick={() => setCurrentSetType(t.type as any)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  currentSetType === t.type 
                    ? `${t.color} text-white` 
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          
          {/* Add Set Button */}
          <button
            onClick={addSet}
            disabled={!currentReps || (!isBodyweightExercise && !currentWeight)}
            className={`w-full py-3 ${isBodyweightExercise ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700'} disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold transition-all`}
          >
            + Add Set
          </button>
        </div>
        
        {/* Logged Sets */}
        {existingSets.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="text-white font-bold mb-3">Logged Sets</h3>
            <div className="space-y-2">
              {existingSets.map((set, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 ${isBodyweightExercise ? 'bg-green-500' : 'bg-indigo-500'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                      {idx + 1}
                    </span>
                    <span className="text-white font-semibold">
                      {isBodyweightExercise ? `${set.reps} reps` : `${set.weight}${weightUnit} × ${set.reps}`}
                    </span>
                  </div>
                  <button onClick={() => onRemoveSet(idx)} className="text-red-400 hover:text-red-500 p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Volume Summary - different for bodyweight */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-white/60 text-sm">{isBodyweightExercise ? 'Total Reps' : 'Total Volume'}</span>
              <span className="text-white font-bold">
                {isBodyweightExercise 
                  ? existingSets.reduce((sum, s) => sum + s.reps, 0).toLocaleString()
                  : `${existingSets.reduce((sum, s) => sum + s.weight * s.reps, 0).toLocaleString()} ${weightUnit}`
                }
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Action - Fixed to bottom with safe area padding */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg px-4 py-4 border-t border-white/10" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}>
        <button
          onClick={handleFinish}
          disabled={existingSets.length === 0}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white text-lg font-bold shadow-2xl transition-all"
        >
          {isLastExercise ? '✓ Finish Workout' : 'Finish Exercise →'}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// LEGACY LOGGING SCREEN - Keep for compatibility
// ==========================================
// @ts-ignore - Reserved for legacy compatibility
const LoggingScreen = ({
  exercise,
  exerciseIndex,
  totalExercises,
  onBack,
  onFinishExercise,
  userData,
  workoutStartTime
}: {
  exercise: { exercise?: string; name?: string; sets: Array<{ reps: number; weight: number }> };
  exerciseIndex: number;
  totalExercises: number;
  onBack: () => void;
  onFinishExercise: (sets: Array<{ reps: number; weight: number }>) => void;
  userData: any;
  workoutStartTime: number | null;
}) => {
  // Derive exercise name from either field
  const exerciseName = exercise.exercise || exercise.name || 'Exercise';
  
  // Ref for scroll management
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [sets, setSets] = useState<Array<{ reps: number; weight: number; type: 'normal' | 'warmup' | 'drop' | 'failure' }>>(
    exercise.sets.map(s => ({ ...s, type: 'normal' as const })) || []
  );
  const [currentReps, setCurrentReps] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentSetType, setCurrentSetType] = useState<'normal' | 'warmup' | 'drop' | 'failure'>('normal');
  const [lastWorkoutData, setLastWorkoutData] = useState<any>(null);
  
  const useMetric = userData?.measurementUnit !== 'imperial';
  const weightUnit = useMetric ? 'kg' : 'lbs';
  
  // Persistent timer
  const { elapsedTime, formatTime } = useWorkoutTimer(workoutStartTime);
  
  // Load last workout data for this exercise
  useEffect(() => {
    const loadLastWorkout = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      try {
        const workoutQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid),
          where('exercise', '==', exercise.exercise),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const snapshot = await getDocs(workoutQuery);
        if (!snapshot.empty) {
          setLastWorkoutData(snapshot.docs[0].data());
        }
      } catch (error) {
        console.error('Error loading last workout:', error);
      }
    };
    
    loadLastWorkout();
  }, [exercise.exercise]);
  
  const addSet = () => {
    const reps = parseInt(currentReps);
    const weight = parseFloat(currentWeight);
    
    if (reps > 0 && weight >= 0) {
      const newSet = { reps, weight, type: currentSetType };
      setSets([...sets, newSet]);
      setCurrentReps('');
      setCurrentWeight('');
      setCurrentSetType('normal');
      swipeableToast.success(`Set ${sets.length + 1} logged! 💪`);
    } else {
      swipeableToast.error('Enter valid reps and weight');
    }
  };
  
  const quickAddSet = (weight: number, reps: number) => {
    const newSet = { reps, weight, type: 'normal' as const };
    setSets([...sets, newSet]);
    swipeableToast.success(`Set added: ${weight}${weightUnit} × ${reps}`);
  };
  
  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
  };
  
  const handleFinish = async () => {
    if (sets.length === 0) {
      swipeableToast.error('Log at least one set before finishing');
      return;
    }
    
    // Save individual exercise to Firebase (for history/PRs)
    const user = auth.currentUser;
    if (user) {
      try {
        const now = new Date();
        const bestSet = getBestSet(sets);
        await addDoc(collection(db, 'workoutHistory'), {
          userId: user.uid,
          exercise: exerciseName,
          sets: sets.map(s => ({ reps: s.reps, weight: s.weight, type: s.type })),
          timestamp: now.getTime(),
          date: now.toISOString().split('T')[0],
          bestSet
        });
        console.log(`Saved exercise: ${exerciseName} with ${sets.length} sets`);
      } catch (error) {
        console.error('Error saving exercise:', error);
        swipeableToast.error('Failed to save exercise data');
      }
    }
    
    // Call parent handler - this will update currentWorkout and trigger next action
    onFinishExercise(sets.map(s => ({ reps: s.reps, weight: s.weight })));
  };
  
  return (
    <div ref={scrollContainerRef} className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 to-indigo-900 flex flex-col overflow-y-auto" style={{ paddingTop: 'env(safe-area-inset-top, 48px)' }}>
      {/* Header */}
      <div className="bg-black/30 px-4 py-4 flex items-center justify-between border-b border-white/10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        
        <div className="text-center">
          <p className="text-white/60 text-xs">Logging</p>
          <p className="text-white font-bold">{exerciseName}</p>
        </div>
        
        <div className="text-white/60 text-sm font-mono">
          {formatTime(elapsedTime)}
        </div>
      </div>
      
      {/* Content - Legacy LoggingScreen */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ paddingBottom: '160px' }}>
        {/* Progress Indicator */}
        <div className="bg-white/5 rounded-xl px-4 py-2 flex items-center justify-between">
          <span className="text-white/60 text-sm">Exercise {exerciseIndex + 1} of {totalExercises}</span>
          <span className="text-white font-medium">{sets.length} sets logged</span>
        </div>
        
        {/* Last Session History */}
        {lastWorkoutData && lastWorkoutData.sets && lastWorkoutData.sets.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-400 text-sm font-semibold mb-3">📊 Last Session ({new Date(lastWorkoutData.timestamp).toLocaleDateString()})</p>
            <div className="flex flex-wrap gap-2">
              {lastWorkoutData.sets.slice(0, 4).map((set: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => quickAddSet(set.weight, set.reps)}
                  className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <span>{set.weight}{weightUnit}×{set.reps}</span>
                  <span className="text-xs">+</span>
                </button>
              ))}
            </div>
            <p className="text-yellow-400/60 text-xs mt-2">Tap to quick-add</p>
          </div>
        )}
        
        {/* Input Form */}
        <div className="bg-white/5 rounded-2xl p-4 space-y-4">
          <h3 className="text-white font-bold">Add Set #{sets.length + 1}</h3>
          
          {/* Weight & Reps Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/60 text-sm mb-2 block">Weight ({weightUnit})</label>
              <input
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder={lastWorkoutData?.sets?.[sets.length]?.weight?.toString() || (useMetric ? "60" : "135")}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center text-xl font-bold focus:border-indigo-500 focus:outline-none placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">Reps</label>
              <input
                type="number"
                value={currentReps}
                onChange={(e) => setCurrentReps(e.target.value)}
                placeholder={lastWorkoutData?.sets?.[sets.length]?.reps?.toString() || "12"}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center text-xl font-bold focus:border-indigo-500 focus:outline-none placeholder:text-white/20"
              />
            </div>
          </div>
          
          {/* Set Type Selector */}
          <div className="flex gap-2">
            {[
              { type: 'normal', label: 'Normal', color: 'bg-gray-600' },
              { type: 'warmup', label: 'Warmup', color: 'bg-orange-500' },
              { type: 'drop', label: 'Drop', color: 'bg-purple-500' },
              { type: 'failure', label: 'Failure', color: 'bg-red-500' }
            ].map((t) => (
              <button
                key={t.type}
                onClick={() => setCurrentSetType(t.type as any)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  currentSetType === t.type 
                    ? `${t.color} text-white` 
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          
          {/* Add Set Button */}
          <button
            onClick={addSet}
            disabled={!currentReps || !currentWeight}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold transition-all"
          >
            + Add Set
          </button>
        </div>
        
        {/* Logged Sets */}
        {sets.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="text-white font-bold mb-3">Logged Sets</h3>
            <div className="space-y-2">
              {sets.map((set, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-white font-semibold">{set.weight}{weightUnit} × {set.reps}</span>
                    {set.type !== 'normal' && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        set.type === 'warmup' ? 'bg-orange-500/30 text-orange-300' :
                        set.type === 'drop' ? 'bg-purple-500/30 text-purple-300' :
                        'bg-red-500/30 text-red-300'
                      }`}>
                        {set.type}
                      </span>
                    )}
                  </div>
                  <button onClick={() => removeSet(idx)} className="text-red-400 hover:text-red-500 p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Volume Summary */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-white/60 text-sm">Total Volume</span>
              <span className="text-white font-bold">
                {sets.reduce((sum, s) => sum + s.weight * s.reps, 0).toLocaleString()} {weightUnit}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Action - Fixed to bottom with safe area padding */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg px-4 py-4 border-t border-white/10" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}>
        <button
          onClick={handleFinish}
          disabled={sets.length === 0}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white text-lg font-bold shadow-2xl transition-all"
        >
          {exerciseIndex >= totalExercises - 1 ? '✓ Finish Workout' : 'Finish Exercise →'}
        </button>
      </div>
    </div>
  );
};

// Exercise Logger Component
const ExerciseLogger = ({ 
  exercise, 
  onBack, 
  onSaveWorkout,
  userData
}: { 
  exercise: string; 
  onBack: () => void; 
  onSaveWorkout: (sets: Array<{ reps: number; weight: number }>) => void;
  userData: any;
}) => {
  // Set type with normal, warmup, drop, failure
  type SetType = 'normal' | 'warmup' | 'drop' | 'failure';
  
  interface LoggedSet {
    reps: number;
    weight: number;
    type: SetType;
    completed: boolean;
  }
  
  const [sets, setSets] = useState<LoggedSet[]>([]);
  const [currentReps, setCurrentReps] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentSetType, setCurrentSetType] = useState<SetType>('normal');
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, _setRestDuration] = useState(userData?.restTimerDefault || 90);
  const [currentPR, setCurrentPR] = useState<any>(null);
  const [showPRCelebration, setShowPRCelebration] = useState(false);
  const [newPRData, setNewPRData] = useState<any>(null);
  const [lastWorkouts, setLastWorkouts] = useState<any[]>([]); // Last 3 workouts for this exercise
  const [progressSuggestion, setProgressSuggestion] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false); // Inline history panel
  const [showPlateCalculator, setShowPlateCalculator] = useState(false);
  const [plateCalcWeight, setPlateCalcWeight] = useState('');
  
  // Swipe handler for back navigation
  const swipeHandlers = useSwipe(onBack);
  
  // Get user's measurement unit preference (default to metric/kg)
  const useMetric = userData?.measurementUnit !== 'imperial';
  const weightUnit = useMetric ? 'kg' : 'lbs';
  const barWeight = useMetric ? 20 : 45; // Standard Olympic bar

  // Load current PR for this exercise
  useEffect(() => {
    const loadCurrentPR = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const prQuery = query(
          collection(db, 'personalRecords'),
          where('userId', '==', user.uid),
          where('exercise', '==', exercise),
          limit(1)
        );
        const snapshot = await getDocs(prQuery);
        if (!snapshot.empty) {
          setCurrentPR(snapshot.docs[0].data());
        }
      } catch (error) {
        console.error('Error loading PR:', error);
      }
    };

    loadCurrentPR();
  }, [exercise]);

  // Load last 3 workouts for this exercise and calculate progressive overload suggestion
  useEffect(() => {
    const loadWorkoutHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const workoutQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid),
          where('exercise', '==', exercise),
          orderBy('timestamp', 'desc'),
          limit(3)
        );
        const snapshot = await getDocs(workoutQuery);
        
        if (!snapshot.empty) {
          const workouts = snapshot.docs.map(doc => doc.data());
          setLastWorkouts(workouts);
          
          // Set ghost sets from most recent workout
          const lastWorkout = workouts[0];
          if (lastWorkout?.sets?.length > 0) {
            // Pre-fill with ghost sets (placeholders from last workout)
            // We don't actually set them, just use for placeholder display
          }
          
          // Calculate progressive overload suggestion
          const lastBestSet = lastWorkout.bestSet || lastWorkout.sets[0];
          if (lastBestSet) {
            const lastWeight = lastBestSet.weight;
            const lastReps = lastBestSet.reps;
            
            // Suggest progression based on reps achieved
            if (lastReps >= 12) {
              const suggestedIncrease = useMetric ? 2.5 : 5;
              const newWeight = lastWeight + suggestedIncrease;
              setProgressSuggestion(
                `Last: ${lastWeight}${weightUnit} × ${lastReps}. Try ${newWeight}${weightUnit} × 8-10 reps! 💪`
              );
            } else if (lastReps >= 8) {
              setProgressSuggestion(
                `Last: ${lastWeight}${weightUnit} × ${lastReps}. Try ${lastWeight}${weightUnit} × ${lastReps + 1} reps or add ${useMetric ? '1.25' : '2.5'}${weightUnit}! 🎯`
              );
            } else {
              setProgressSuggestion(
                `Last: ${lastWeight}${weightUnit} × ${lastReps}. Focus on hitting ${Math.min(lastReps + 2, 8)} reps! 🔥`
              );
            }
          }
        } else {
          setProgressSuggestion('First time doing this exercise! Start with a weight you can handle for 8-12 reps. 🌟');
        }
      } catch (error) {
        console.error('Error loading workout history:', error);
      }
    };

    loadWorkoutHistory();
  }, [exercise, useMetric, weightUnit]);

  // Get ghost set placeholders from last workout
  const getGhostSet = (setIndex: number) => {
    if (lastWorkouts.length > 0 && lastWorkouts[0].sets?.[setIndex]) {
      return lastWorkouts[0].sets[setIndex];
    }
    return null;
  };

  const addSet = () => {
    const reps = parseInt(currentReps);
    const weight = parseFloat(currentWeight);
    
    if (reps > 0 && weight >= 0) {
      const newSet: LoggedSet = { 
        reps, 
        weight, 
        type: currentSetType, 
        completed: true 
      };
      setSets([...sets, newSet]);
      setCurrentReps('');
      setCurrentWeight('');
      setCurrentSetType('normal');
      swipeableToast.success(`Set ${sets.length + 1} added! 💪`);
      
      // AUTO-REST: Automatically trigger rest timer after completing a set
      if (userData?.restTimerEnabled !== false) {
        setShowRestTimer(true);
      }
    } else {
      swipeableToast.error('Please enter valid reps and weight');
    }
  };

  // Toggle set type cyclically: normal -> warmup -> drop -> failure -> normal
  const cycleSetType = () => {
    const types: SetType[] = ['normal', 'warmup', 'drop', 'failure'];
    const currentIndex = types.indexOf(currentSetType);
    setCurrentSetType(types[(currentIndex + 1) % types.length]);
  };

  const getSetTypeConfig = (type: SetType) => {
    const configs = {
      normal: { label: 'Normal', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300', icon: '💪' },
      warmup: { label: 'Warmup', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', icon: '🔥' },
      drop: { label: 'Drop', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300', icon: '⬇️' },
      failure: { label: 'Failure', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: '💀' }
    };
    return configs[type];
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
    swipeableToast.success('Set removed');
  };

  // Calculate plate breakdown
  const plateResult = plateCalcWeight ? calculatePlates(parseFloat(plateCalcWeight), barWeight, weightUnit as 'lbs' | 'kg') : null;

  const handleSave = async () => {
    if (sets.length === 0) {
      swipeableToast.error('Please add at least one set');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      swipeableToast.error('Not authenticated');
      return;
    }

    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Filter out warmup sets for PR calculation (warmups don't count as working sets)
      const workingSets = sets.filter(s => s.type !== 'warmup');
      const allSetsSimple = sets.map(s => ({ reps: s.reps, weight: s.weight }));
      
      // Get best set from working sets
      const bestSet = workingSets.length > 0 ? getBestSet(workingSets) : getBestSet(sets);
      const bestEstimatedMax = calculate1RM(bestSet.weight, bestSet.reps);
      
      // Check for PR (only from working sets)
      let isNewPR = false;
      if (workingSets.length > 0) {
        if (currentPR) {
          const currentBestMax = calculate1RM(currentPR.weight, currentPR.reps);
          isNewPR = bestEstimatedMax > currentBestMax;
        } else {
          isNewPR = true;
        }
      }
      
      // Save to Firestore
      await addDoc(collection(db, 'workoutHistory'), {
        userId: user.uid,
        exercise,
        sets: sets.map(s => ({ reps: s.reps, weight: s.weight, type: s.type })),
        timestamp: now.getTime(),
        timestampISO: now.toISOString(),
        date: today,
        dateFormatted: now.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        timeOfDay: now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        bestSet,
        estimatedMax: bestEstimatedMax,
        isNewPR,
        setTypes: {
          warmup: sets.filter(s => s.type === 'warmup').length,
          normal: sets.filter(s => s.type === 'normal').length,
          drop: sets.filter(s => s.type === 'drop').length,
          failure: sets.filter(s => s.type === 'failure').length
        }
      });

      // If new PR, save to personalRecords
      if (isNewPR) {
        const prData = {
          userId: user.uid,
          exercise,
          weight: bestSet.weight,
          reps: bestSet.reps,
          estimatedMax: bestEstimatedMax,
          date: today,
          timestamp: now.getTime()
        };

        const prQuery = query(
          collection(db, 'personalRecords'),
          where('userId', '==', user.uid),
          where('exercise', '==', exercise)
        );
        const prSnapshot = await getDocs(prQuery);
        
        if (!prSnapshot.empty) {
          await updateDoc(prSnapshot.docs[0].ref, prData);
        } else {
          await addDoc(collection(db, 'personalRecords'), prData);
        }

        setNewPRData({
          newPR: { weight: bestSet.weight, reps: bestSet.reps, estimatedMax: bestEstimatedMax },
          oldPR: currentPR
        });
        setShowPRCelebration(true);
      }

      onSaveWorkout(allSetsSimple);
      swipeableToast.success(isNewPR ? '🏆 NEW PR! Workout saved!' : 'Workout logged successfully! 🏋️');
      
      if (!isNewPR) {
        onBack();
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      swipeableToast.error('Failed to save workout');
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24" {...swipeHandlers}>
      {/* Header */}
      <button 
        onClick={onBack} 
        className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition duration-200 mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </button>

      {/* Exercise Title Card */}
      <div className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-900/40 dark:to-purple-900/40 p-4 rounded-xl border-2 border-indigo-400 dark:border-indigo-500/30 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-indigo-900 dark:text-white">{exercise}</h2>
            <p className="text-xs text-indigo-700 dark:text-indigo-300">Log your sets with precision</p>
          </div>
          {/* History Toggle Button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
              showHistory 
                ? 'bg-indigo-500 text-white' 
                : 'bg-white/50 dark:bg-gray-800/50 text-indigo-700 dark:text-indigo-300'
            }`}
          >
            📊 History
          </button>
        </div>
        
        {/* Current PR Display */}
        {currentPR && (
          <div className="mt-3 p-2 bg-white/30 dark:bg-black/20 rounded-lg border border-indigo-300 dark:border-indigo-500/30 flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">🏆 Current PR:</span>
            <span className="text-sm font-bold text-indigo-900 dark:text-white">
              {currentPR.weight}{weightUnit} × {currentPR.reps}
            </span>
          </div>
        )}
      </div>

      {/* Inline History Panel */}
      {showHistory && lastWorkouts.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            📈 Last 3 Sessions
          </h3>
          {lastWorkouts.map((workout, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(workout.timestamp).toLocaleDateString()}
                </span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {workout.sets?.length || 0} sets
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {workout.sets?.slice(0, 5).map((set: any, setIdx: number) => (
                  <span key={setIdx} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                    {set.weight}{weightUnit}×{set.reps}
                  </span>
                ))}
                {workout.sets?.length > 5 && (
                  <span className="text-xs text-gray-400">+{workout.sets.length - 5} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progressive Overload Suggestion */}
      {progressSuggestion && (
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 p-3 rounded-xl border border-yellow-400 dark:border-yellow-500/50 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">{progressSuggestion}</p>
          </div>
        </div>
      )}

      {/* Add Set Form - PRO version with ghost sets and set types */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border-2 border-indigo-300 dark:border-indigo-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Set #{sets.length + 1}</h3>
          {/* Set Type Toggle */}
          <button
            onClick={cycleSetType}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${getSetTypeConfig(currentSetType).color}`}
          >
            {getSetTypeConfig(currentSetType).icon} {getSetTypeConfig(currentSetType).label}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Weight ({weightUnit})</label>
            <div className="relative">
              <input
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder={getGhostSet(sets.length)?.weight?.toString() || (useMetric ? "60" : "135")}
                step="0.5"
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition outline-none placeholder:text-gray-400/50 placeholder:italic"
              />
              {/* Plate Calculator Button */}
              <button
                onClick={() => {
                  setPlateCalcWeight(currentWeight || getGhostSet(sets.length)?.weight?.toString() || '');
                  setShowPlateCalculator(!showPlateCalculator);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-500 transition"
                title="Plate Calculator"
              >
                🏋️
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Reps</label>
            <input
              type="number"
              value={currentReps}
              onChange={(e) => setCurrentReps(e.target.value)}
              placeholder={getGhostSet(sets.length)?.reps?.toString() || "12"}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition outline-none placeholder:text-gray-400/50 placeholder:italic"
            />
          </div>
        </div>

        {/* Plate Calculator Panel */}
        {showPlateCalculator && (
          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900 dark:text-white">🏋️ Plate Calculator</span>
              <span className="text-xs text-gray-500">Bar: {barWeight}{weightUnit}</span>
            </div>
            <input
              type="number"
              value={plateCalcWeight}
              onChange={(e) => setPlateCalcWeight(e.target.value)}
              placeholder={`Total weight (${weightUnit})`}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm mb-2"
            />
            {plateResult && (
              <div className="space-y-1">
                {plateResult.error ? (
                  <p className="text-xs text-red-500">{plateResult.error}</p>
                ) : plateResult.plates.length === 0 ? (
                  <p className="text-xs text-gray-500">Just the bar!</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-gray-500">Per side:</span>
                    {plateResult.plates.map((plate, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-semibold">
                        {plate.count}×{plate.weight}{weightUnit}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Ghost Set Hint */}
        {getGhostSet(sets.length) && !currentWeight && !currentReps && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 italic">
            💡 Last time: {getGhostSet(sets.length)?.weight}{weightUnit} × {getGhostSet(sets.length)?.reps} reps
          </p>
        )}

        <button
          onClick={addSet}
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl text-white font-bold transition duration-300 shadow-lg"
        >
          ✓ Log Set
        </button>
      </div>

      {/* Sets List - PRO version with set types */}
      {sets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Logged Sets ({sets.length})</h3>
            {lastWorkouts[0] && (
              <span className="text-xs text-gray-500">Last: {lastWorkouts[0].sets?.length || 0} sets</span>
            )}
          </div>
          
          {sets.map((set, index) => {
            const lastSet = lastWorkouts[0]?.sets?.[index];
            const typeConfig = getSetTypeConfig(set.type);
            let comparisonIcon = '';
            
            if (lastSet && set.type === 'normal') {
              const currentVolume = set.weight * set.reps;
              const lastVolume = lastSet.weight * lastSet.reps;
              if (currentVolume > lastVolume) comparisonIcon = '📈';
              else if (currentVolume < lastVolume) comparisonIcon = '📉';
              else comparisonIcon = '➡️';
            }
            
            return (
              <div 
                key={index}
                className={`p-3 rounded-lg shadow-md flex items-center justify-between ${typeConfig.color} border-l-4 ${
                  set.type === 'warmup' ? 'border-orange-500' :
                  set.type === 'drop' ? 'border-purple-500' :
                  set.type === 'failure' ? 'border-red-500' :
                  'border-teal-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold opacity-60">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">
                      {set.weight}{weightUnit} × {set.reps}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-70">{typeConfig.icon} {typeConfig.label}</span>
                      {comparisonIcon && lastSet && (
                        <span className="text-xs">
                          {comparisonIcon} vs {lastSet.weight}{weightUnit}×{lastSet.reps}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeSet(index)}
                  className="text-red-500 hover:text-red-700 transition p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          
          {/* Volume Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700/30">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Total Volume:</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {sets.filter(s => s.type !== 'warmup').reduce((sum, set) => sum + (set.weight * set.reps), 0).toFixed(0)}{weightUnit}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {sets.filter(s => s.type === 'warmup').length} warmup, {sets.filter(s => s.type === 'normal').length} working, {sets.filter(s => s.type === 'drop').length} drop, {sets.filter(s => s.type === 'failure').length} failure
            </p>
          </div>
        </div>
      )}

      {/* Save Workout Button */}
      {sets.length > 0 && (
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white font-bold text-lg transition duration-300 shadow-xl"
        >
          💾 Save Workout ({sets.filter(s => s.type !== 'warmup').length} working sets)
        </button>
      )}

      {/* Rest Timer - Auto-triggered after each set */}
      {showRestTimer && (
        <RestTimer
          duration={restDuration}
          exerciseName={exercise}
          onComplete={() => {
            setShowRestTimer(false);
            swipeableToast.success('Rest complete! Ready for next set 💪');
          }}
          onSkip={() => {
            setShowRestTimer(false);
            swipeableToast.info('Rest skipped', '⏭️');
          }}
        />
      )}

      {/* PR Celebration Modal */}
      {showPRCelebration && newPRData && (
        <PRCelebrationModal
          exercise={exercise}
          newPR={newPRData.newPR}
          oldPR={newPRData.oldPR}
          onClose={() => {
            setShowPRCelebration(false);
            onBack();
          }}
        />
      )}
    </div>
  );
};

// Modal Components
// @ts-ignore - preserved for potential future use
const _ExerciseDetailModal = ({ 
  exercise, 
  onClose, 
  onStartLogging 
}: { 
  exercise: string; 
  onClose: () => void;
  onStartLogging?: () => void;
}) => {
  const swipeHandlers = useSwipe(onClose);
  useEscapeKey(onClose);
  
  // Get exercise details from the EXERCISE_DETAILS object
  const exerciseDetail = EXERCISE_DETAILS[exercise];
  
  // Get exercise image/GIF if available
  const exerciseImage = EXERCISE_IMAGES[exercise];
  
  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-modal-title"
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-300 dark:border-indigo-500/30 max-h-[85vh] flex flex-col" 
          onClick={(e) => e.stopPropagation()}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          {...swipeHandlers}
        >
          {/* Header - Fixed at top */}
          <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 id="exercise-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">{exercise}</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
              aria-label="Close exercise details"
            >
              <ArrowLeft className="h-6 w-6 transform rotate-180" />
            </button>
          </div>
          
          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
            <div className="p-6 pt-4 space-y-4">{/* Exercise Image/GIF or Placeholder */}
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
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl text-white font-bold transition duration-300 shadow-lg mb-4"
              >
                Start Logging Sets 📊
              </button>
            )}
            </div>
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
  useEscapeKey(onClose);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const user = auth.currentUser;
    if (!user) {
      swipeableToast.error('Not authenticated');
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
      
      swipeableToast.success('Profile updated successfully! ✅');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      swipeableToast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
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
            <h3 id="edit-profile-title" className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"
              aria-label="Close edit profile"
            >
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
    mealStyle: userData?.dietPreferences?.mealStyle || '', // MERGED: replaces cookingSkill + budget
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
    { id: 'chicken', name: 'Chicken', icon: '🍗', category: 'meat' },
    { id: 'beef', name: 'Beef', icon: '🥩', category: 'meat' },
    { id: 'lamb', name: 'Lamb/Mutton', icon: '🍖', category: 'meat' },
    { id: 'fish', name: 'Fish', icon: '🐟', category: 'seafood' },
    { id: 'eggs', name: 'Eggs', icon: '🥚', category: 'animal-product' },
    { id: 'dairy', name: 'Dairy', icon: '🥛', category: 'animal-product' },
    { id: 'rice', name: 'Rice', icon: '🍚', category: 'grain' },
    { id: 'bread', name: 'Bread', icon: '🍞', category: 'grain' },
    { id: 'pasta', name: 'Pasta', icon: '🍝', category: 'grain' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥦', category: 'plant' },
    { id: 'fruits', name: 'Fruits', icon: '🍎', category: 'plant' },
    { id: 'nuts', name: 'Nuts', icon: '🥜', category: 'plant' },
    { id: 'beans', name: 'Beans/Lentils', icon: '🫘', category: 'plant' },
    { id: 'tofu', name: 'Tofu/Soy', icon: '🧈', category: 'plant' },
  ];

  // Smart filtering of food preferences based on diet type and religion
  const getFilteredFoodPreferences = useMemo(() => {
    const { dietType, religion } = surveyData;
    
    return foodPreferences.filter(food => {
      // Vegetarian diets - no meat or seafood
      if (dietType === 'vegetarian' || religion === 'hindu' || religion === 'buddhist') {
        if (food.category === 'meat' || food.category === 'seafood') return false;
      }
      
      // Vegan - no animal products at all
      if (dietType === 'vegan') {
        if (['meat', 'seafood', 'animal-product'].includes(food.category)) return false;
      }
      
      // Pescatarian - no meat, but fish is okay
      if (dietType === 'pescatarian') {
        if (food.category === 'meat') return false;
      }
      
      // Keto - limit grains
      if (dietType === 'keto') {
        // Don't filter grains out completely, but they're still shown (user can choose)
      }
      
      // Muslim (Halal) - no pork (we don't have pork in our list, beef/chicken/lamb are halal)
      // Jewish (Kosher) - complex rules, we show all and they can select
      
      return true;
    });
  }, [surveyData.dietType, surveyData.religion]);

  const allergies = [
    { id: 'none', name: 'No Allergies', icon: '✅' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'eggs', name: 'Eggs', icon: '🥚' },
    { id: 'nuts', name: 'Nuts', icon: '🥜' },
    { id: 'shellfish', name: 'Shellfish', icon: '🦐' },
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'soy', name: 'Soy', icon: '🫘' },
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
        swipeableToast.error('Not logged in');
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
      swipeableToast.success('Diet preferences saved! 🎉');
      onComplete();
    } catch (error: any) {
      console.error('Error saving survey:', error);
      swipeableToast.error(`Failed to save preferences: ${error.message || 'Unknown error'}`);
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
      case 6: return surveyData.mealStyle !== ''; // Changed from budget
      default: return false;
    }
  };

  const totalSteps = 6; // Reduced from 7 (removed separate cooking skill step)
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-indigo-500/50 pb-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Diet Preferences</h2>
        <p className="text-gray-600 dark:text-white/80 text-sm mt-1">Help us personalize your nutrition plan</p>
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
            <p className="text-gray-600 dark:text-white/80 text-sm">This determines your meal plan type</p>
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
                  <div className={`text-4xl w-16 h-16 flex-shrink-0 rounded-full ${goal.color} flex items-center justify-center`}>
                    {goal.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-gray-900 dark:text-white font-bold text-lg">{goal.name}</div>
                    <div className="text-gray-600 dark:text-white/80 text-sm">{goal.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What's your religion or dietary belief?</h3>
            <p className="text-gray-600 dark:text-white/80 text-sm">This helps us suggest appropriate foods</p>
            <div className="grid grid-cols-2 gap-3">
              {religions.map(religion => (
                <button
                  key={religion.id}
                  onClick={() => {
                    // Clear incompatible food preferences for vegetarian religions
                    const meatFoods = ['chicken', 'beef', 'lamb'];
                    const seafoodFoods = ['fish'];
                    
                    let newFoodPrefs = surveyData.foodPreferences;
                    
                    if (religion.id === 'hindu' || religion.id === 'buddhist') {
                      // Remove meat and seafood for vegetarian religions
                      newFoodPrefs = newFoodPrefs.filter((f: string) => !meatFoods.includes(f) && !seafoodFoods.includes(f));
                    }
                    
                    setSurveyData(prev => ({ 
                      ...prev, 
                      religion: religion.id,
                      foodPreferences: newFoodPrefs
                    }));
                  }}
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
            <p className="text-gray-600 dark:text-white/80 text-sm">Choose your eating pattern</p>
            <div className="grid grid-cols-2 gap-3">
              {dietTypes.map(diet => (
                <button
                  key={diet.id}
                  onClick={() => {
                    // Clear incompatible food preferences when changing diet type
                    const meatFoods = ['chicken', 'beef', 'lamb'];
                    const seafoodFoods = ['fish'];
                    const animalProducts = ['eggs', 'dairy'];
                    
                    let newFoodPrefs = surveyData.foodPreferences;
                    
                    if (diet.id === 'vegetarian') {
                      // Remove meat and seafood
                      newFoodPrefs = newFoodPrefs.filter((f: string) => !meatFoods.includes(f) && !seafoodFoods.includes(f));
                    } else if (diet.id === 'vegan') {
                      // Remove all animal products
                      newFoodPrefs = newFoodPrefs.filter((f: string) => 
                        !meatFoods.includes(f) && !seafoodFoods.includes(f) && !animalProducts.includes(f)
                      );
                    } else if (diet.id === 'pescatarian') {
                      // Remove meat only
                      newFoodPrefs = newFoodPrefs.filter((f: string) => !meatFoods.includes(f));
                    }
                    
                    setSurveyData(prev => ({ 
                      ...prev, 
                      dietType: diet.id,
                      foodPreferences: newFoodPrefs
                    }));
                  }}
                  className={`p-4 rounded-xl border-2 transition ${
                    surveyData.dietType === diet.id
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{diet.icon}</div>
                  <div className="text-gray-900 dark:text-white font-semibold text-sm">{diet.name}</div>
                  <div className="text-gray-600 dark:text-white/70 text-xs mt-1">{diet.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What foods do you like?</h3>
            <p className="text-gray-600 dark:text-white/80 text-sm">
              {surveyData.dietType === 'vegetarian' || surveyData.religion === 'hindu' || surveyData.religion === 'buddhist'
                ? 'Showing vegetarian-friendly options'
                : surveyData.dietType === 'vegan'
                ? 'Showing vegan-friendly options'
                : surveyData.dietType === 'pescatarian'
                ? 'Showing pescatarian-friendly options'
                : 'Select all that apply'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {getFilteredFoodPreferences.map(food => (
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
            <p className="text-gray-600 dark:text-white/80 text-sm">We'll exclude these from your plan</p>
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What's your meal style?</h3>
            <p className="text-gray-600 dark:text-white/80 text-sm">Choose a style that fits your budget and cooking skills</p>
            <div className="space-y-3">
              {mealStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSurveyData(prev => ({ ...prev, mealStyle: style.id }))}
                  className={`w-full p-4 rounded-xl border-2 transition flex items-center justify-between ${
                    surveyData.mealStyle === style.id
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{style.icon}</div>
                    <div className="text-left">
                      <div className="text-gray-900 dark:text-white font-semibold">{style.name}</div>
                      <div className="text-gray-600 dark:text-white/70 text-sm">{style.desc}</div>
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
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white/80 hover:bg-gray-300 dark:hover:bg-gray-600'
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

// Ingredient Substitution Modal Component
const IngredientSubstitutionModal = ({ 
  selectedMealForSub, 
  onClose, 
  onSave 
}: { 
  selectedMealForSub: {week: number, day: number, mealType: string, meal: any};
  onClose: () => void;
  onSave: (week: number, day: number, mealType: string, customizations: any) => void;
}) => {
  const [localIngredients, setLocalIngredients] = useState(selectedMealForSub.meal.ingredients || []);
  const [portionSize, setPortionSize] = useState(1.0);
  useEscapeKey(onClose);

  // Common substitutions database
  const substitutions: Record<string, string[]> = {
    'chicken': ['turkey', 'tofu', 'tempeh', 'seitan', 'chickpeas'],
    'beef': ['turkey', 'lamb', 'bison', 'portobello mushrooms', 'lentils'],
    'fish': ['salmon', 'tuna', 'cod', 'tilapia', 'shrimp', 'tofu'],
    'milk': ['almond milk', 'oat milk', 'soy milk', 'coconut milk'],
    'butter': ['olive oil', 'coconut oil', 'ghee', 'avocado oil'],
    'eggs': ['flax eggs', 'chia eggs', 'applesauce', 'silken tofu'],
    'rice': ['quinoa', 'cauliflower rice', 'couscous', 'pasta'],
    'pasta': ['zucchini noodles', 'shirataki noodles', 'whole wheat pasta', 'rice noodles'],
  };

  const handleSubstituteIngredient = (index: number, oldIngredient: string) => {
    const ingredientLower = oldIngredient.toLowerCase();
    const matchedKey = Object.keys(substitutions).find(key => ingredientLower.includes(key));
    
    if (matchedKey) {
      const alternatives = substitutions[matchedKey];
      const selected = alternatives[0]; // Use first alternative
      
      const newIngredients = [...localIngredients];
      newIngredients[index] = oldIngredient.replace(new RegExp(matchedKey, 'gi'), selected);
      setLocalIngredients(newIngredients);
    }
  };

  const handleSaveCustomization = () => {
    onSave(selectedMealForSub.week, selectedMealForSub.day, selectedMealForSub.mealType, {
      ingredients: localIngredients,
      portionSize
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ingredient-sub-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-300 dark:border-orange-500/30" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 id="ingredient-sub-title" className="text-2xl font-bold text-orange-600 dark:text-orange-400">✏️ Customize Meal</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"
            aria-label="Close customization"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg mb-4">
          <p className="text-sm font-semibold text-orange-900 dark:text-orange-300">{selectedMealForSub.meal.name}</p>
          <p className="text-xs text-orange-700 dark:text-orange-400">Week {selectedMealForSub.week}, Day {selectedMealForSub.day}</p>
        </div>

        {/* Portion Size Adjuster */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Portion Size</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPortionSize(Math.max(0.5, portionSize - 0.25))}
              className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold"
            >
              -
            </button>
            <span className="text-lg font-bold text-gray-900 dark:text-white min-w-[60px] text-center">
              {portionSize.toFixed(2)}x
            </span>
            <button
              onClick={() => setPortionSize(Math.min(2.0, portionSize + 0.25))}
              className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Macros will be adjusted: {Math.round(selectedMealForSub.meal.macros.calories * portionSize)} cal
          </p>
        </div>

        {/* Ingredients List with Substitution */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Ingredients</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {localIngredients.map((ingredient: string, idx: number) => {
              const ingredientLower = ingredient.toLowerCase();
              const hasSubstitution = Object.keys(substitutions).some(key => ingredientLower.includes(key));
              
              return (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => {
                      const newIngredients = [...localIngredients];
                      newIngredients[idx] = e.target.value;
                      setLocalIngredients(newIngredients);
                    }}
                    className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-xs rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  />
                  {hasSubstitution && (
                    <button
                      onClick={() => handleSubstituteIngredient(idx, ingredient)}
                      className="px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg"
                      title="Suggest substitute"
                    >
                      🔁
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveCustomization}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition mb-2"
        >
          Save Customization
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Meal Swap Modal Component
const MealSwapModal = ({
  selectedMealForSwap,
  onClose,
  onSwap
}: {
  selectedMealForSwap: { week: number; day: number; mealType: string; meal: any };
  onClose: () => void;
  onSwap: (week: number, day: number, mealType: string) => void;
}) => {
  useEscapeKey(onClose);

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="swap-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-300 dark:border-purple-500/30" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="swap-modal-title" className="text-2xl font-bold text-purple-600 dark:text-purple-400">🔄 Swap Meal</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition"
            aria-label="Close swap dialog"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mb-4">
          <p className="text-sm font-semibold text-purple-900 dark:text-purple-300">Selected Meal:</p>
          <p className="text-xs text-purple-700 dark:text-purple-400">{selectedMealForSwap.meal.name}</p>
          <p className="text-xs text-purple-600 dark:text-purple-500">Week {selectedMealForSwap.week}, Day {selectedMealForSwap.day}</p>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Select a meal to swap with:</p>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {[1, 2, 3, 4].map(week => (
            <div key={week} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Week {week}</p>
              <div className="grid grid-cols-7 gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <button
                    key={day}
                    onClick={() => onSwap(week, day, selectedMealForSwap.mealType)}
                    disabled={week === selectedMealForSwap.week && day === selectedMealForSwap.day}
                    className="p-2 text-xs bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300 rounded disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label={`Swap with Week ${week}, Day ${day}`}
                  >
                    D{day}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Meal Detail Screen
const MealDetailScreen = ({
  meal,
  onBack,
  onLog
}: {
  meal: any;
  onBack: () => void;
  onLog: () => void;
}) => {
  // Swipe handler for back navigation
  const swipeHandlers = useSwipe(onBack);
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 z-50 overflow-y-auto" {...swipeHandlers}>
      <div style={{ paddingTop: 'var(--safe-area-top)', paddingBottom: 'var(--safe-area-bottom)' }} className="min-h-screen pb-24">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-gray-900 backdrop-blur-md border-b border-indigo-200 dark:border-indigo-500/30 px-4 py-4 shadow-sm">
          <button onClick={onBack} className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{meal.name}</h1>
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* Macros Card */}
          <div className="bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600/60 dark:to-purple-700/60 p-5 rounded-xl shadow-xl text-white">
            <h3 className="text-lg font-bold mb-3">Nutrition Facts</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold">{meal.calories}</p>
                <p className="text-xs opacity-90">Calories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{meal.protein}g</p>
                <p className="text-xs opacity-90">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{meal.carbs}g</p>
                <p className="text-xs opacity-90">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{meal.fats}g</p>
                <p className="text-xs opacity-90">Fats</p>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          {meal.ingredients && (
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-indigo-500/30">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                🛒 Ingredients
              </h3>
              <ul className="space-y-2">
                {meal.ingredients.map((ingredient: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {meal.instructions && (
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-indigo-500/30">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                👨‍🍳 Instructions
              </h3>
              <ol className="space-y-3">
                {meal.instructions.map((step: string, idx: number) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Diet Tags */}
          {meal.dietTags && meal.dietTags.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-500/30">
              <h3 className="text-sm font-bold text-green-900 dark:text-green-200 mb-2">🌱 Diet Tags</h3>
              <div className="flex flex-wrap gap-2">
                {meal.dietTags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold capitalize"
                  >
                    {tag.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prep Time & Servings */}
          <div className="grid grid-cols-2 gap-4">
            {meal.prepTime && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-indigo-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Prep Time</p>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{meal.prepTime}</p>
              </div>
            )}
            {meal.servings && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-indigo-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-indigo-500" />
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Servings</p>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{meal.servings}</p>
              </div>
            )}
          </div>
        </div>

        {/* Log Meal Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40" style={{ paddingBottom: 'calc(1rem + var(--safe-area-bottom))' }}>
          <button
            onClick={onLog}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-bold text-lg transition duration-300 shadow-xl"
          >
            Log This Meal
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Diet Plan Screens
const DietPlanScreen = ({ 
  goal, setGoal, showPlanModal, setShowPlanModal, userData, isPremium, 
  currentDay, setCurrentDay, currentWeek, setCurrentWeek, expandedMeals, setExpandedMeals, 
  logMeal, loggedMeals, removeLoggedMeal, calculateDailyTotals, showMacroSummary, setShowMacroSummary,
  swappedMeals, selectedMealForSwap, setSelectedMealForSwap, showSwapModal, setShowSwapModal, swapMeal, resetSwap,
  customizedMeals, selectedMealForSub, setSelectedMealForSub, showSubstitutionModal, setShowSubstitutionModal, 
  customizeMeal, resetCustomization
}: {
  goal: string | null;
  setGoal: (goal: string | null) => void;
  showPlanModal: boolean;
  setShowPlanModal: (show: boolean) => void;
  userData: any;
  isPremium: boolean;
  currentDay: number;
  setCurrentDay: (day: number | ((prev: number) => number)) => void;
  currentWeek: number;
  setCurrentWeek: (week: number | ((prev: number) => number)) => void;
  expandedMeals: Record<string, boolean>;
  setExpandedMeals: (meals: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  logMeal: (mealData: any, mealType: string) => Promise<void>;
  loggedMeals: Record<string, any[]>;
  removeLoggedMeal: (date: string, index: number) => Promise<void>;
  calculateDailyTotals: (date: string) => { calories: number; protein: number; carbs: number; fats: number };
  showMacroSummary: boolean;
  setShowMacroSummary: (show: boolean) => void;
  swappedMeals: Record<string, any>;
  selectedMealForSwap: {week: number, day: number, mealType: string, meal: any} | null;
  setSelectedMealForSwap: (meal: {week: number, day: number, mealType: string, meal: any} | null) => void;
  showSwapModal: boolean;
  setShowSwapModal: (show: boolean) => void;
  swapMeal: (targetWeek: number, targetDay: number, targetMealType: string) => Promise<void>;
  resetSwap: (week: number, day: number, mealType: string) => Promise<void>;
  customizedMeals: Record<string, any>;
  selectedMealForSub: {week: number, day: number, mealType: string, meal: any} | null;
  setSelectedMealForSub: (meal: {week: number, day: number, mealType: string, meal: any} | null) => void;
  showSubstitutionModal: boolean;
  setShowSubstitutionModal: (show: boolean) => void;
  customizeMeal: (week: number, day: number, mealType: string, customizations: any) => Promise<void>;
  resetCustomization: (week: number, day: number, mealType: string) => Promise<void>;
}) => {
  const [showPremiumLock, setShowPremiumLock] = useState(false);
  const [selectedMealDetail, setSelectedMealDetail] = useState<any>(null);

  // Render Meal Detail Screen if selected (overlay on all views)
  if (selectedMealDetail) {
    return (
      <MealDetailScreen
        meal={selectedMealDetail}
        onBack={() => setSelectedMealDetail(null)}
        onLog={() => {
          logMeal({ name: selectedMealDetail.name, macros: { calories: selectedMealDetail.calories, protein: selectedMealDetail.protein, carbs: selectedMealDetail.carbs, fats: selectedMealDetail.fats } }, selectedMealDetail.mealTypeName || 'Meal');
          setSelectedMealDetail(null);
        }}
      />
    );
  }

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get current day of week for highlighting
  const getCurrentDayOfWeek = () => {
    const jsDay = new Date().getDay();
    return ((jsDay + 6) % 7) + 1;
  };
  const todayDayOfWeek = getCurrentDayOfWeek();
  
  // Handler to jump to today
  const jumpToToday = async () => {
    setCurrentDay(todayDayOfWeek);
    
    // Calculate week based on current week of the year (rotating 1-4)
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysSinceYearStart = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const weekOfYear = Math.floor(daysSinceYearStart / 7);
    const calculatedWeek = ((weekOfYear + 1) % 4) + 1; // Rotate weeks 1-4 with offset
    
    console.log('Jump to Today:', {
      date: now.toLocaleDateString(),
      day: todayDayOfWeek,
      weekOfYear,
      calculatedWeek
    });
    
    setCurrentWeek(calculatedWeek);
  };

  // @ts-ignore - unused but kept for future feature
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
  // @ts-ignore - unused but kept for future feature
  const swipeHandlersDietDetails = useSwipe(() => setGoal(null));

  const [showSurvey, setShowSurvey] = useState(false);
  const [editStep, setEditStep] = useState<number | null>(null);

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
    <>
      {/* Sticky Header with Safe Area */}
      <div style={{ paddingTop: 'var(--safe-area-top)' }} className="sticky top-0 z-40 w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-gray-900 backdrop-blur-md border-b border-indigo-200 dark:border-indigo-500/30 px-4 py-4 shadow-sm">
        <div className="flex justify-between items-center">
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
      </div>
      
      <div className="p-4 space-y-6 pb-24">

      {showSurvey ? (
        <DietSurveyScreen onComplete={() => setShowSurvey(false)} userData={userData} />
      ) : (
        <>
          {/* User Preferences Summary with Quick Edit */}
          {hasDietPreferences && (
            <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 dark:from-purple-600 dark:via-pink-600 dark:to-purple-700 rounded-2xl p-6 shadow-xl" style={{ boxShadow: '0 10px 25px rgba(167, 139, 250, 0.3)' }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white" style={{ opacity: 0.95 }}>Your Diet Profile</h3>
                <button
                  onClick={() => setShowSurvey(true)}
                  className="text-xs px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white hover:text-purple-500 font-semibold shadow-md transition-all flex-shrink-0 border border-white/30"
                >
                  Edit All
                </button>
              </div>
              
              {/* Main Goal - Highlighted */}
              {userData.dietPreferences?.fitnessGoal && (
                <div className="bg-white/95 rounded-2xl p-4 flex items-center gap-3 mb-4 shadow-md">
                  <span className="text-2xl">
                    {userData.dietPreferences.fitnessGoal === 'weight-loss' ? '🔥' :
                     userData.dietPreferences.fitnessGoal === 'muscle-gain' ? '💪' :
                     '⚖️'}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wide">Current Goal</span>
                    <span className={`text-base font-extrabold ${
                      userData.dietPreferences.fitnessGoal === 'weight-loss' ? 'text-pink-600' :
                      userData.dietPreferences.fitnessGoal === 'muscle-gain' ? 'text-green-600' :
                      'text-blue-600'
                    }`}>
                      {userData.dietPreferences.fitnessGoal === 'weight-loss' ? 'Weight Loss' :
                       userData.dietPreferences.fitnessGoal === 'muscle-gain' ? 'Muscle Gain' :
                       'Maintenance'}
                    </span>
                  </div>
                </div>
              )}

              {/* Details Grid - 2x2 Layout */}
              <div className="grid grid-cols-2 gap-2.5">
                {userData.dietPreferences?.religion && (
                  <button
                    onClick={() => setEditStep(2)}
                    className="bg-white/25 backdrop-blur-sm border border-white/30 rounded-xl p-3 flex flex-col justify-center hover:bg-white/35 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm font-semibold">
                        {userData.dietPreferences.religion === 'muslim' ? '🌙 Halal' : 
                         userData.dietPreferences.religion === 'hindu' ? '🕉️ Hindu' :
                         userData.dietPreferences.religion === 'jewish' ? '✡️ Kosher' :
                         userData.dietPreferences.religion === 'none' ? '🌍 None' : '📿 ' + userData.dietPreferences.religion}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </div>
                  </button>
                )}
                {userData.dietPreferences?.dietType && (
                  <button
                    onClick={() => setEditStep(3)}
                    className="bg-white/25 backdrop-blur-sm border border-white/30 rounded-xl p-3 flex flex-col justify-center hover:bg-white/35 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm font-semibold">🥩 {userData.dietPreferences.dietType}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </div>
                  </button>
                )}
                {userData.dietPreferences?.mealsPerDay && (
                  <button
                    onClick={() => setEditStep(6)}
                    className="bg-white/25 backdrop-blur-sm border border-white/30 rounded-xl p-3 flex flex-col justify-center hover:bg-white/35 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm font-semibold">🍽️ {userData.dietPreferences.mealsPerDay}/day</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </div>
                  </button>
                )}
                {userData.dietPreferences?.mealStyle && (
                  <button
                    onClick={() => setEditStep(6)}
                    className="bg-white/25 backdrop-blur-sm border border-white/30 rounded-xl p-3 flex flex-col justify-center hover:bg-white/35 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm font-semibold truncate">{mealStyles.find(s => s.id === userData.dietPreferences?.mealStyle)?.icon || '💰'} {mealStyles.find(s => s.id === userData.dietPreferences?.mealStyle)?.name || 'Style'}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </div>
                  </button>
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
              
              {/* Day Navigation - Premium Only */}
              {isPremium && (
                <div className="space-y-3">
                  {/* Week Selector */}
                  <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-xl">
                    <button
                      onClick={() => setCurrentWeek(w => Math.max(1, w - 1))}
                      disabled={currentWeek === 1}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm font-semibold text-purple-600 dark:text-purple-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
                    >
                      ← Prev
                    </button>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Week</p>
                      <p className="text-lg font-bold text-purple-700 dark:text-purple-300">Week {currentWeek}</p>
                    </div>
                    <button
                      onClick={() => setCurrentWeek(w => Math.min(4, w + 1))}
                      disabled={currentWeek === 4}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm font-semibold text-purple-600 dark:text-purple-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
                    >
                      Next →
                    </button>
                  </div>

                  {/* Day Tabs */}
                  <div className="space-y-2">
                    <div className="flex gap-1 overflow-x-auto pb-2">
                      {dayNamesShort.map((day, idx) => {
                        const isToday = (idx + 1) === todayDayOfWeek;
                        const isSelected = currentDay === (idx + 1);
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => setCurrentDay(idx + 1)}
                            className={`relative flex-1 min-w-[50px] py-2.5 px-2 rounded-lg text-xs font-semibold transition ${
                              isSelected
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg scale-105'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            {day}
                            {isToday && (
                              <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isSelected ? 'bg-yellow-300' : 'bg-green-500'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Today Button */}
                    <button
                      onClick={jumpToToday}
                      className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-lg shadow-md transition flex items-center justify-center gap-2"
                    >
                      <span>📍</span>
                      <span>Jump to Today ({dayNames[todayDayOfWeek - 1]})</span>
                    </button>
                  </div>

                  {/* Current Day Display */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-3 rounded-xl text-center">
                    <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                      📅 {dayNames[currentDay - 1]} - Week {currentWeek}
                      {currentDay === todayDayOfWeek && <span className="ml-2 text-green-600 dark:text-green-400">• Today</span>}
                    </p>
                  </div>

                  {/* Daily Macro Tracking Summary */}
                  {(() => {
                    const today = new Date().toISOString().split('T')[0];
                    const dailyTotals = calculateDailyTotals(today);
                    const loggedMealsToday = loggedMeals[today] || [];
                    
                    // Calculate daily goals based on user's fitness goal
                    const preferenceGoal = userData?.dietPreferences?.fitnessGoal;
                    let userGoal = 'maintenance';
                    if (preferenceGoal) {
                      userGoal = preferenceGoal;
                    } else {
                      const current = userData?.weight || 70;
                      const target = userData?.targetWeight || 75;
                      userGoal = current > target + 2 ? 'weight-loss' : current < target - 2 ? 'muscle-gain' : 'maintenance';
                    }
                    
                    const calorieMultiplier = userGoal === 'weight-loss' ? 0.85 : userGoal === 'muscle-gain' ? 1.15 : 1.0;
                    const dailyGoals = {
                      calories: Math.round(2000 * calorieMultiplier),
                      protein: Math.round(150 * calorieMultiplier),
                      carbs: Math.round(200 * calorieMultiplier),
                      fats: Math.round(65 * calorieMultiplier)
                    };

                    const calorieProgress = Math.min((dailyTotals.calories / dailyGoals.calories) * 100, 100);
                    const proteinProgress = Math.min((dailyTotals.protein / dailyGoals.protein) * 100, 100);
                    const carbsProgress = Math.min((dailyTotals.carbs / dailyGoals.carbs) * 100, 100);
                    const fatsProgress = Math.min((dailyTotals.fats / dailyGoals.fats) * 100, 100);

                    return (
                      <div className="space-y-3">
                        {/* Toggle Button */}
                        <button
                          onClick={() => setShowMacroSummary(!showMacroSummary)}
                          className="w-full py-2 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-lg shadow-md transition flex items-center justify-between"
                        >
                          <span>📊 Today's Nutrition</span>
                          <span>{showMacroSummary ? '▼' : '▶'}</span>
                        </button>

                        {showMacroSummary && (
                          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 p-4 rounded-xl border-2 border-teal-300 dark:border-teal-600/30 space-y-3">
                            {/* Calories Progress */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">🔥 Calories</span>
                                <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                                  {dailyTotals.calories} / {dailyGoals.calories}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500 rounded-full"
                                  style={{ width: `${calorieProgress}%` }}
                                />
                              </div>
                            </div>

                            {/* Macros Grid */}
                            <div className="grid grid-cols-3 gap-2">
                              {/* Protein */}
                              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">Protein</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden mb-1">
                                  <div 
                                    className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                                    style={{ width: `${proteinProgress}%` }}
                                  />
                                </div>
                                <p className="text-[10px] font-bold text-red-600 dark:text-red-400 text-center">
                                  {dailyTotals.protein}g / {dailyGoals.protein}g
                                </p>
                              </div>

                              {/* Carbs */}
                              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">Carbs</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden mb-1">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                                    style={{ width: `${carbsProgress}%` }}
                                  />
                                </div>
                                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 text-center">
                                  {dailyTotals.carbs}g / {dailyGoals.carbs}g
                                </p>
                              </div>

                              {/* Fats */}
                              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">Fats</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden mb-1">
                                  <div 
                                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                                    style={{ width: `${fatsProgress}%` }}
                                  />
                                </div>
                                <p className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 text-center">
                                  {dailyTotals.fats}g / {dailyGoals.fats}g
                                </p>
                              </div>
                            </div>

                            {/* Logged Meals Count */}
                            <div className="text-center pt-2 border-t border-teal-200 dark:border-teal-700">
                              <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold">
                                🍽️ {loggedMealsToday.length} meal{loggedMealsToday.length !== 1 ? 's' : ''} logged today
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
              
              <p className="text-gray-700 dark:text-white/70 text-sm italic">
                {isPremium ? `Your Personalized Meal Plan - ${dayNames[currentDay - 1]}` : 'Sample 1-Day Plan (3 basic meals)'}:
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
                    
                    // Select meal database based on goal and meal style
                    const userMealStyle = userData?.dietPreferences?.mealStyle || 'medium-budget';
                    const mealStyleConfig = mealStyles.find(s => s.id === userMealStyle) || mealStyles[1]; // Default to medium budget
                    const userBudget = mealStyleConfig.budget;
                    const userCookingSkill = mealStyleConfig.cookingSkill;
                    const userReligion = userData?.dietPreferences?.religion || 'none';
                    
                    console.log('🎯 Meal Selection Criteria:', {
                      goal: userGoal,
                      mealStyle: userMealStyle,
                      budget: userBudget,
                      cookingSkill: userCookingSkill,
                      religion: userReligion
                    });
                    
                    let mealDatabase;
                    
                    // Check religion for appropriate meal databases
                    const isHindu = userReligion === 'hindu' || userReligion === 'buddhist';
                    const isJewish = userReligion === 'jewish';
                    const isChristian = userReligion === 'christian' || userReligion === 'none' || !userReligion;
                    
                    if (userGoal === 'weight-loss') {
                      if (isHindu) {
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_HINDU_WEIGHT_LOSS :
                                      userBudget === 'high' ? HIGH_BUDGET_HINDU_WEIGHT_LOSS :
                                      MEDIUM_BUDGET_HINDU_WEIGHT_LOSS;
                      } else if (isJewish) {
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_KOSHER_WEIGHT_LOSS :
                                      userBudget === 'high' ? HIGH_BUDGET_KOSHER_WEIGHT_LOSS :
                                      MEDIUM_BUDGET_KOSHER_WEIGHT_LOSS;
                      } else if (isChristian) {
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_CHRISTIAN_WEIGHT_LOSS :
                                      userBudget === 'high' ? HIGH_BUDGET_CHRISTIAN_WEIGHT_LOSS :
                                      MEDIUM_BUDGET_CHRISTIAN_WEIGHT_LOSS;
                      } else {
                        // Fallback to Muslim/halal for other religions
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_WEIGHT_LOSS :
                                      userBudget === 'high' ? HIGH_BUDGET_WEIGHT_LOSS :
                                      MEDIUM_BUDGET_WEIGHT_LOSS;
                      }
                    } else if (userGoal === 'muscle-gain') {
                      if (isHindu) {
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_HINDU_MUSCLE_GAIN :
                                      userBudget === 'high' ? HIGH_BUDGET_HINDU_MUSCLE_GAIN :
                                      MEDIUM_BUDGET_HINDU_MUSCLE_GAIN;
                      } else if (isJewish) {
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_KOSHER_MUSCLE_GAIN :
                                      userBudget === 'high' ? HIGH_BUDGET_KOSHER_MUSCLE_GAIN :
                                      MEDIUM_BUDGET_KOSHER_MUSCLE_GAIN;
                      } else if (isChristian) {
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_CHRISTIAN_MUSCLE_GAIN :
                                      userBudget === 'high' ? HIGH_BUDGET_CHRISTIAN_MUSCLE_GAIN :
                                      MEDIUM_BUDGET_CHRISTIAN_MUSCLE_GAIN;
                      } else {
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_MUSCLE_GAIN :
                                      userBudget === 'high' ? HIGH_BUDGET_MUSCLE_GAIN :
                                      MEDIUM_BUDGET_MUSCLE_GAIN;
                      }
                    } else if (userGoal === 'maintenance') {
                      if (isHindu) {
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_HINDU_MAINTENANCE :
                                      userBudget === 'high' ? HIGH_BUDGET_HINDU_MAINTENANCE :
                                      MEDIUM_BUDGET_HINDU_MAINTENANCE;
                      } else if (isJewish) {
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_KOSHER_MAINTENANCE :
                                      userBudget === 'high' ? HIGH_BUDGET_KOSHER_MAINTENANCE :
                                      MEDIUM_BUDGET_KOSHER_MAINTENANCE;
                      } else if (isChristian) {
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_CHRISTIAN_MAINTENANCE :
                                      userBudget === 'high' ? HIGH_BUDGET_CHRISTIAN_MAINTENANCE :
                                      MEDIUM_BUDGET_CHRISTIAN_MAINTENANCE;
                      } else {
                        mealDatabase = userBudget === 'low' ? LOW_BUDGET_MAINTENANCE :
                                      userBudget === 'high' ? HIGH_BUDGET_MAINTENANCE :
                                      MEDIUM_BUDGET_MAINTENANCE;
                      }
                    } else {
                      mealDatabase = WEEK_1_MAINTENANCE;
                    }
                    
                    console.log('✅ Selected meal plan:', mealDatabase[0]?.id);
                    
                    // Get the meal plan for the selected day and week
                    // Rotate weeks 2-4 by shifting days (week 2 = start from day 2, week 3 = day 3, etc.)
                    let dayPlan = mealDatabase.find(p => p.day === currentDay && p.week === currentWeek);
                    
                    // If week doesn't exist, rotate through week 1 meals
                    if (!dayPlan && currentWeek > 1) {
                      // Rotate: Week 2 starts from day 2, Week 3 from day 3, Week 4 from day 4
                      const rotatedDay = ((currentDay - 1 + (currentWeek - 1)) % 7) + 1;
                      dayPlan = mealDatabase.find(p => p.day === rotatedDay && p.week === 1);
                    }
                    
                    // Ultimate fallback
                    if (!dayPlan) {
                      dayPlan = mealDatabase[0];
                    }
                    
                    if (!dayPlan) return null;
                    
                    // Filter meals by cooking skill preference - DISABLED to prevent filtering out meals
                    // All mealStyles are set to 'intermediate' so this was blocking valid meals
                    const filterMealBySkill = (_meal: any) => {
                      // Always return true - show all meals regardless of cooking skill
                      // Users can decide if a meal is too complex for them
                      return true;
                      
                      /* ORIGINAL LOGIC - Too restrictive, disabled
                      if (!meal?.cookingSkill) return true;
                      
                      // Match exact cooking skill or show meals that match user's preference
                      if (userCookingSkill === 'beginner') {
                        return meal.cookingSkill === 'beginner';
                      } else if (userCookingSkill === 'intermediate') {
                        return ['beginner', 'intermediate'].includes(meal.cookingSkill);
                      } else {
                        return true; // Advanced users see all
                      }
                      */
                    };

                    // Filter meals by allergy preferences
                    const filterMealByAllergies = (meal: any) => {
                      // Get user's allergies
                      const userAllergies = userData?.dietPreferences?.allergies || [];
                      
                      // If user has no allergies or selected 'none', show all meals
                      if (userAllergies.length === 0 || userAllergies.includes('none')) {
                        return true;
                      }
                      
                      // If meal has no ingredients listed, show it (safety: can't verify)
                      if (!meal?.ingredients || meal.ingredients.length === 0) {
                        return true;
                      }
                      
                      // Check if any ingredient contains an allergen
                      // Convert both to lowercase for case-insensitive matching
                      const ingredientsText = meal.ingredients.join(' ').toLowerCase();
                      
                      // Define allergen keywords to search for
                      const allergenKeywords: { [key: string]: string[] } = {
                        'dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'whey', 'lactose', 'casein', 'ghee', 'paneer'],
                        'eggs': ['egg', 'eggs'],
                        'nuts': ['almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'macadamia', 'peanut', 'nut'],
                        'shellfish': ['shrimp', 'crab', 'lobster', 'prawn', 'crawfish', 'crayfish', 'shellfish'],
                        'gluten': ['wheat', 'flour', 'bread', 'pasta', 'barley', 'rye', 'gluten', 'couscous', 'seitan'],
                        'soy': ['soy', 'tofu', 'tempeh', 'edamame', 'miso'],
                      };
                      
                      // Check each user allergy
                      for (const allergy of userAllergies) {
                        if (allergy === 'none') continue;
                        
                        const keywords = allergenKeywords[allergy] || [];
                        
                        // Check if any keyword appears in ingredients
                        for (const keyword of keywords) {
                          if (ingredientsText.includes(keyword)) {
                            return false; // Filter out this meal - contains allergen
                          }
                        }
                      }
                      
                      return true; // Safe - no allergens found
                    };
                    
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
                      let meal = dayPlan.meals[mealType.key as keyof typeof dayPlan.meals] as Meal | null;
                      if (!meal) return null;

                      // Check if this meal slot has been swapped
                      const swapKey = `w${currentWeek}-d${currentDay}-${mealType.key}`;
                      const swapInfo = swappedMeals[swapKey];
                      
                      // If swapped, fetch the meal from the swapped location
                      if (swapInfo) {
                        const swappedDayPlan = mealDatabase.find((p: any) => 
                          p.week === swapInfo.week && p.day === swapInfo.day
                        );
                        if (swappedDayPlan) {
                          meal = swappedDayPlan.meals[swapInfo.mealType as keyof typeof swappedDayPlan.meals] as Meal | null;
                        }
                      }

                      // Apply customizations if any
                      const customKey = `w${currentWeek}-d${currentDay}-${mealType.key}`;
                      const customizations = customizedMeals[customKey];
                      
                      if (customizations && meal) {
                        // Apply ingredient customizations
                        if (customizations.ingredients) {
                          meal = { ...meal, ingredients: customizations.ingredients };
                        }
                        
                        // Apply portion size adjustments to macros
                        if (customizations.portionSize) {
                          const portionMultiplier = customizations.portionSize;
                          meal = {
                            ...meal,
                            macros: {
                              calories: Math.round(meal.macros.calories * portionMultiplier),
                              protein: Math.round(meal.macros.protein * portionMultiplier),
                              carbs: Math.round(meal.macros.carbs * portionMultiplier),
                              fats: Math.round(meal.macros.fats * portionMultiplier)
                            }
                          };
                        }
                      }

                      if (!meal) return null;
                      
                      // Check if meal matches cooking skill preference
                      const skillMatch = filterMealBySkill(meal);
                      
                      // Check if meal is safe for user's allergies
                      const allergyMatch = filterMealByAllergies(meal);
                      
                      // Skip meals that don't match skill level (show placeholder)
                      if (!skillMatch) {
                        return (
                          <div key={index} className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                              <span className="text-xl opacity-40">{mealType.emoji}</span>
                              <div>
                                <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">{mealType.name}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-600 italic">
                                  Meal filtered by cooking skill preference
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Skip meals that contain allergens (show placeholder)
                      if (!allergyMatch) {
                        return (
                          <div key={index} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-2 border-dashed border-red-300 dark:border-red-700">
                            <div className="flex items-center gap-3">
                              <span className="text-xl opacity-40">⚠️</span>
                              <div>
                                <p className="text-sm font-semibold text-red-600 dark:text-red-400">{mealType.name}</p>
                                <p className="text-xs text-red-500 dark:text-red-400 italic">
                                  Contains allergen - filtered for your safety
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
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
                            <button
                              onClick={() => setSelectedMealDetail({ ...meal, calories: adjustedMacros.calories, protein: adjustedMacros.protein, carbs: adjustedMacros.carbs, fats: adjustedMacros.fats, mealTypeName: mealType.name })}
                              className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition flex items-center gap-1 cursor-pointer"
                            >
                              {adjustedMacros.calories} cal
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <p 
                            onClick={() => setSelectedMealDetail({ ...meal, calories: adjustedMacros.calories, protein: adjustedMacros.protein, carbs: adjustedMacros.carbs, fats: adjustedMacros.fats, mealTypeName: mealType.name })}
                            className="text-lg font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                          >{meal.name}</p>
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

                          {/* Log This Meal Button */}
                          {(() => {
                            const today = new Date().toISOString().split('T')[0];
                            const todaysMeals = loggedMeals[today] || [];
                            const isAlreadyLogged = todaysMeals.some((m: any) => m.mealType === mealType.name);
                            
                            return (
                              <button
                                onClick={() => logMeal({ name: meal.name, macros: adjustedMacros }, mealType.name)}
                                className={`w-full py-2 px-4 ${
                                  isAlreadyLogged 
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' 
                                    : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'
                                } text-white text-xs font-semibold rounded-lg shadow-md transition flex items-center justify-center gap-2 mb-2`}
                                aria-label={`Log ${meal.name} to meal history`}
                              >
                                <span>{isAlreadyLogged ? '🔄' : '✓'}</span>
                                <span>{isAlreadyLogged ? 'Update Logged Meal' : 'Log This Meal'}</span>
                              </button>
                            );
                          })()}

                          {/* Action Buttons Grid */}
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            {/* Swap Meal Button */}
                            <button
                              onClick={() => {
                                setSelectedMealForSwap({ week: currentWeek, day: currentDay, mealType: mealType.key, meal });
                                setShowSwapModal(true);
                              }}
                              className="py-2 px-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-semibold rounded-lg shadow-md transition flex items-center justify-center gap-1"
                              aria-label={`Swap ${meal.name} with another meal`}
                            >
                              <span>🔄</span>
                              <span>Swap</span>
                            </button>

                            {/* Customize Meal Button */}
                            <button
                              onClick={() => {
                                setSelectedMealForSub({ week: currentWeek, day: currentDay, mealType: mealType.key, meal });
                                setShowSubstitutionModal(true);
                              }}
                              aria-label={`Customize ingredients for ${meal.name}`}
                              className="py-2 px-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-semibold rounded-lg shadow-md transition flex items-center justify-center gap-1"
                            >
                              <span>✏️</span>
                              <span>Customize</span>
                            </button>
                          </div>

                          {/* Show if meal is swapped or customized */}
                          {(() => {
                            const swapKey = `w${currentWeek}-d${currentDay}-${mealType.key}`;
                            const isSwapped = swappedMeals[swapKey];
                            const isCustomized = customizedMeals[swapKey];

                            if (isSwapped || isCustomized) {
                              return (
                                <div className="flex gap-2 mb-2">
                                  {isSwapped && (
                                    <div className="flex-1 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg flex items-center justify-between">
                                      <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold">
                                        🔄 Showing meal from W{isSwapped.week}D{isSwapped.day}
                                      </span>
                                      <button
                                        onClick={() => resetSwap(currentWeek, currentDay, mealType.key)}
                                        className="text-[10px] bg-purple-600 hover:bg-purple-700 text-white px-2 py-0.5 rounded"
                                      >
                                        Reset
                                      </button>
                                    </div>
                                  )}
                                  {isCustomized && (
                                    <div className="flex-1 bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg flex items-center justify-between">
                                      <span className="text-[10px] text-orange-700 dark:text-orange-300 font-semibold">
                                        ✨ Customized
                                      </span>
                                      <button
                                        onClick={() => resetCustomization(currentWeek, currentDay, mealType.key)}
                                        className="text-[10px] bg-orange-600 hover:bg-orange-700 text-white px-2 py-0.5 rounded"
                                      >
                                        Reset
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })()}
                          
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

              {/* Meal History Section */}
              <div className="mt-6 space-y-4">
                <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">📜 Meal History</h3>
                
                {(() => {
                  // Get last 7 days of logged meals
                  const today = new Date();
                  const dates = [];
                  for (let i = 0; i < 7; i++) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    dates.push(date.toISOString().split('T')[0]);
                  }

                  // Filter dates that have logged meals
                  const datesWithMeals = dates.filter(date => loggedMeals[date] && loggedMeals[date].length > 0);

                  if (datesWithMeals.length === 0) {
                    return (
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800 p-8 rounded-xl text-center border-2 border-orange-200 dark:border-orange-500/30">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Soup className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Meals Logged</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          Start tracking your meals to see your nutrition summary here!
                        </p>
                        <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 text-sm font-medium">
                          <span>🍽️</span>
                          <span>Tap "Log This Meal" on any meal card above</span>
                        </div>
                      </div>
                    );
                  }

                  return datesWithMeals.map(date => {
                    const dateObj = new Date(date + 'T00:00:00');
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                    const meals = loggedMeals[date] || [];
                    const totals = calculateDailyTotals(date);

                    return (
                      <div key={date} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Date Header */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3">
                          <div className="flex justify-between items-center">
                            <p className="text-white font-bold">{dayName}</p>
                            <div className="text-white text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                              {totals.calories} cal
                            </div>
                          </div>
                        </div>

                        {/* Meals List */}
                        <div className="p-4 space-y-2">
                          {meals.map((meal: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{meal.mealType}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{meal.name}</p>
                                <div className="flex gap-3 mt-1">
                                  <span className="text-xs text-red-600 dark:text-red-400">P: {meal.macros.protein}g</span>
                                  <span className="text-xs text-blue-600 dark:text-blue-400">C: {meal.macros.carbs}g</span>
                                  <span className="text-xs text-yellow-600 dark:text-yellow-400">F: {meal.macros.fats}g</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeLoggedMeal(date, idx)}
                                className="ml-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}

                          {/* Daily Totals */}
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Calories</p>
                                <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{totals.calories}</p>
                              </div>
                              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Protein</p>
                                <p className="text-sm font-bold text-red-600 dark:text-red-400">{totals.protein}g</p>
                              </div>
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Carbs</p>
                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{totals.carbs}g</p>
                              </div>
                              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
                                <p className="text-xs text-gray-600 dark:text-gray-400">Fats</p>
                                <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{totals.fats}g</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
        </>
      )}

      {/* Weekly Plan Modal */}
      {showPlanModal && (
        <WeeklyPlanModal onClose={() => setShowPlanModal(false)} />
      )}

      {/* Meal Swap Modal */}
      {showSwapModal && selectedMealForSwap && (
        <MealSwapModal
          selectedMealForSwap={selectedMealForSwap}
          onClose={() => {
            setShowSwapModal(false);
            setSelectedMealForSwap(null);
          }}
          onSwap={swapMeal}
        />
      )}

      {/* Ingredient Substitution Modal */}
      {showSubstitutionModal && selectedMealForSub && (
        <IngredientSubstitutionModal
          selectedMealForSub={selectedMealForSub}
          onClose={() => setShowSubstitutionModal(false)}
          onSave={customizeMeal}
        />
      )}

      {/* Premium Lock Overlay */}
      {showPremiumLock && (
        <PremiumLockOverlay 
          featureName="4-Week Rotating Meal Plans" 
          onUpgrade={() => {
            setShowPremiumLock(false);
            swipeableToast.success('Redirecting to subscription...');
            // Google Play Billing will be integrated here
          }}
        />
      )}
    </div>
    </>
  );
};

// Premium Weekly Plans Screen Component (kept for future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore - unused but kept for future feature
const PremiumWeeklyPlansScreen = ({ onBack, userData, isPremium }: { onBack: () => void; userData: any; isPremium: boolean }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [showShoppingList, setShowShoppingList] = useState(false);

  // Swipe handlers for nested views
  const swipeHandlersMealDetail = useSwipe(() => setSelectedMeal(null));
  const swipeHandlersDayDetail = useSwipe(() => setSelectedDay(null));
  const swipeHandlersShoppingList = useSwipe(() => setShowShoppingList(false));
  const swipeHandlersMain = useSwipe(onBack);

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
  const generateDailyMealPlan = (_week: number, day: number, isPremium: boolean) => {
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
    
    // Get user preferences
    const preferences = userData?.dietPreferences || {};
    const { religion, dietType, allergies, mealsPerDay } = preferences;

    console.log('📋 User Preferences:', preferences);
    console.log('isPremium:', isPremium, '| mealsPerDay:', mealsPerDay || 'not set');
    
    // Select the appropriate meal plan database based on user's goal, budget AND religion
    const userBudget = preferences.budget || 'medium'; // Default to medium if not set
    const userReligion = religion?.toLowerCase() || '';
    
    console.log('💰 MEAL SELECTION:', {
      rawBudget: preferences.budget,
      selectedBudget: userBudget,
      goal: userGoal,
      religion: userReligion
    });
    
    let mealDatabase;
    
    // Check if user has religion-specific meal plan preference
    const useKosher = userReligion === 'jewish';
    const useChristian = userReligion === 'christian' || userReligion === 'catholic';
    const useHindu = userReligion === 'hindu' || userReligion === 'hinduism';
    
    if (userGoal === 'weight-loss') {
      // Weight loss - select by religion first, then budget tier
      if (useKosher) {
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Kosher Weight Loss meals');
          mealDatabase = LOW_BUDGET_KOSHER_WEIGHT_LOSS;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Kosher Weight Loss meals');
          mealDatabase = HIGH_BUDGET_KOSHER_WEIGHT_LOSS;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Kosher Weight Loss meals');
          mealDatabase = MEDIUM_BUDGET_KOSHER_WEIGHT_LOSS;
        }
      } else if (useChristian) {
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Christian Weight Loss meals');
          mealDatabase = LOW_BUDGET_CHRISTIAN_WEIGHT_LOSS;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Christian Weight Loss meals');
          mealDatabase = HIGH_BUDGET_CHRISTIAN_WEIGHT_LOSS;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Christian Weight Loss meals');
          mealDatabase = MEDIUM_BUDGET_CHRISTIAN_WEIGHT_LOSS;
        }
      } else if (useHindu) {
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Hindu Weight Loss meals');
          mealDatabase = LOW_BUDGET_HINDU_WEIGHT_LOSS;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Hindu Weight Loss meals');
          mealDatabase = HIGH_BUDGET_HINDU_WEIGHT_LOSS;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Hindu Weight Loss meals');
          mealDatabase = MEDIUM_BUDGET_HINDU_WEIGHT_LOSS;
        }
      } else {
        // Generic/default plans for other religions
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Weight Loss meals');
          mealDatabase = LOW_BUDGET_WEIGHT_LOSS;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Weight Loss meals');
          mealDatabase = HIGH_BUDGET_WEIGHT_LOSS;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Weight Loss meals');
          mealDatabase = MEDIUM_BUDGET_WEIGHT_LOSS;
        }
      }
    } else if (userGoal === 'muscle-gain') {
      // Muscle gain - select by religion first, then budget tier
      if (useKosher) {
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Kosher Muscle Gain meals');
          mealDatabase = LOW_BUDGET_KOSHER_MUSCLE_GAIN;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Kosher Muscle Gain meals');
          mealDatabase = HIGH_BUDGET_KOSHER_MUSCLE_GAIN;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Kosher Muscle Gain meals');
          mealDatabase = MEDIUM_BUDGET_KOSHER_MUSCLE_GAIN;
        }
      } else if (useChristian) {
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Christian Muscle Gain meals');
          mealDatabase = LOW_BUDGET_CHRISTIAN_MUSCLE_GAIN;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Christian Muscle Gain meals');
          mealDatabase = HIGH_BUDGET_CHRISTIAN_MUSCLE_GAIN;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Christian Muscle Gain meals');
          mealDatabase = MEDIUM_BUDGET_CHRISTIAN_MUSCLE_GAIN;
        }
      } else if (useHindu) {
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Hindu Muscle Gain meals');
          mealDatabase = LOW_BUDGET_HINDU_MUSCLE_GAIN;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Hindu Muscle Gain meals');
          mealDatabase = HIGH_BUDGET_HINDU_MUSCLE_GAIN;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Hindu Muscle Gain meals');
          mealDatabase = MEDIUM_BUDGET_HINDU_MUSCLE_GAIN;
        }
      } else {
        // Generic/default plans for other religions
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Muscle Gain meals');
          mealDatabase = LOW_BUDGET_MUSCLE_GAIN;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Muscle Gain meals');
          mealDatabase = HIGH_BUDGET_MUSCLE_GAIN;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Muscle Gain meals');
          mealDatabase = MEDIUM_BUDGET_MUSCLE_GAIN;
        }
      }
    } else if (userGoal === 'maintenance') {
      // Maintenance - select by religion first, then budget tier
      if (useKosher) {
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Kosher Maintenance meals');
          mealDatabase = LOW_BUDGET_KOSHER_MAINTENANCE;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Kosher Maintenance meals');
          mealDatabase = HIGH_BUDGET_KOSHER_MAINTENANCE;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Kosher Maintenance meals');
          mealDatabase = MEDIUM_BUDGET_KOSHER_MAINTENANCE;
        }
      } else if (useChristian) {
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Christian Maintenance meals');
          mealDatabase = LOW_BUDGET_CHRISTIAN_MAINTENANCE;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Christian Maintenance meals');
          mealDatabase = HIGH_BUDGET_CHRISTIAN_MAINTENANCE;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Christian Maintenance meals');
          mealDatabase = MEDIUM_BUDGET_CHRISTIAN_MAINTENANCE;
        }
      } else if (useHindu) {
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Hindu Maintenance meals');
          mealDatabase = LOW_BUDGET_HINDU_MAINTENANCE;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Hindu Maintenance meals');
          mealDatabase = HIGH_BUDGET_HINDU_MAINTENANCE;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Hindu Maintenance meals');
          mealDatabase = MEDIUM_BUDGET_HINDU_MAINTENANCE;
        }
      } else {
        // Generic/default plans for other religions
        if (userBudget === 'low') {
          console.log('✅ Loading LOW BUDGET Maintenance meals');
          mealDatabase = LOW_BUDGET_MAINTENANCE;
        } else if (userBudget === 'high') {
          console.log('✅ Loading HIGH BUDGET Maintenance meals');
          mealDatabase = HIGH_BUDGET_MAINTENANCE;
        } else {
          console.log('✅ Loading MEDIUM BUDGET Maintenance meals');
          mealDatabase = MEDIUM_BUDGET_MAINTENANCE;
        }
      }
    } else {
      // Fallback to old maintenance database
      console.log('⚠️ Using fallback maintenance database');
      mealDatabase = WEEK_1_MAINTENANCE;
    }
    
    console.log('🍽️ Meal database selected:', mealDatabase[0]?.id || 'unknown');
    
    // Find the base meal plan for this day from the selected database
    const dayPlan = mealDatabase.find((plan: any) => plan.day === day);
    
    if (!dayPlan) {
      console.log('No meal plan found for day:', day);
      return null;
    }

    // Clone the plan to avoid mutating original
    let adjustedPlan = JSON.parse(JSON.stringify(dayPlan));

    // Helper function to check if meal matches safety filters
    const matchesSafetyFilters = (meal: any) => {
      if (!meal) return false;
      
      // Check religion restrictions
      if (religion === 'muslim') { // FIX: lowercase to match religion ID
        const hasNonHalal = meal.ingredients.some((ing: string) => {
          const ingredient = ing.toLowerCase();
          return (
            ingredient.includes('pork') ||
            ingredient.includes('bacon') || // NO bacon of any kind - not even turkey bacon
            ingredient.includes('ham') ||
            ingredient.includes('prosciutto') || // PORK - Italian cured ham
            ingredient.includes('salami') || // Often contains pork
            ingredient.includes('pepperoni') || // Usually pork-based
            ingredient.includes('chorizo') || // Spanish chorizo often pork-based
            ingredient.includes('gelatin') || // Often from pork
            ingredient.includes('lard') || // Pork fat
            (ingredient.includes('sausage') && !ingredient.includes('beef') && !ingredient.includes('turkey') && !ingredient.includes('chicken') && !ingredient.includes('halal')) || // Allow halal sausages only
            ingredient.includes('alcohol') ||
            ingredient.includes('wine') ||
            ingredient.includes('beer')
          );
        });
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
      
      console.log(`🍴 ${mealType}:`, meal?.name || 'N/A');
      
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
      <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto" {...swipeHandlersMealDetail}>
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
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto" {...swipeHandlersMain}>
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
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{goalLabels[userGoal as keyof typeof goalLabels]}</p>
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
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto" {...swipeHandlersShoppingList}>
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
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto" {...swipeHandlersDayDetail}>
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
                          ⚠️ This meal contains ingredients that don't match your dietary preferences
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

// Enhanced Exercise Detail Screen
const ExerciseDetailScreen = ({
  exercise,
  onBack,
  onStartLogging,
  onToggleFavorite,
  isFavorite,
  userData,
  onMuscleClick,
  onExerciseClick
}: {
  exercise: string;
  onBack: () => void;
  onStartLogging: () => void;
  onToggleFavorite: (exercise: string) => void;
  isFavorite: boolean;
  userData: any;
  onMuscleClick?: (muscle: string) => void;
  onExerciseClick?: (exercise: string) => void;
}) => {
  const [exerciseHistory, setExerciseHistory] = useState<any[]>([]);
  const [currentPR, setCurrentPR] = useState<any>(null);
  
  // Swipe handler for back navigation
  const swipeHandlers = useSwipe(onBack);

  useEffect(() => {
    const loadExerciseData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Load exercise history from BOTH individual logs AND batch workout entries
        const allHistory: any[] = [];
        
        // 1. Query individual exercise logs (where exercise field matches directly)
        const individualQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid),
          where('exercise', '==', exercise),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        const individualSnapshot = await getDocs(individualQuery);
        individualSnapshot.docs.forEach(doc => {
          allHistory.push(doc.data());
        });
        
        // 2. Also query batch workouts and extract matching exercises
        // These are workouts with 'exercises' array containing multiple exercises
        const batchQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(50) // Check more to find matching exercises
        );
        const batchSnapshot = await getDocs(batchQuery);
        batchSnapshot.docs.forEach(doc => {
          const data = doc.data();
          // Check if this is a batch workout entry (has exercises array)
          if (data.exercises && Array.isArray(data.exercises)) {
            // Find the exercise in the batch
            const matchingExercise = data.exercises.find((ex: any) => 
              ex.exercise === exercise || ex.name === exercise
            );
            if (matchingExercise) {
              // Create a history entry from the batch data
              const bestSet = matchingExercise.sets?.reduce((best: any, s: any) => {
                if (!best || (s.weight * s.reps) > (best.weight * best.reps)) return s;
                return best;
              }, null);
              
              allHistory.push({
                exercise: exercise,
                sets: matchingExercise.sets,
                timestamp: data.timestamp,
                date: data.date,
                bestSet: bestSet,
                isFromBatch: true
              });
            }
          }
        });
        
        // Sort by timestamp and remove duplicates (same timestamp)
        const uniqueHistory = allHistory
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
          .filter((item, index, arr) => 
            index === 0 || item.timestamp !== arr[index - 1].timestamp
          )
          .slice(0, 10);
        
        setExerciseHistory(uniqueHistory);

        // Load PR
        const prQuery = query(
          collection(db, 'personalRecords'),
          where('userId', '==', user.uid),
          where('exercise', '==', exercise),
          limit(1)
        );
        const prSnapshot = await getDocs(prQuery);
        if (!prSnapshot.empty) {
          setCurrentPR(prSnapshot.docs[0].data());
        }
      } catch (error) {
        console.error('Error loading exercise data:', error);
      }
    };

    loadExerciseData();
  }, [exercise]);

  // Find which muscle groups this exercise belongs to
  const getMuscleGroups = () => {
    const muscles: string[] = [];
    MUSCLE_GROUPS.forEach(group => {
      if (group.exercises.gym.includes(exercise) || group.exercises.home.includes(exercise)) {
        muscles.push(group.name);
      }
    });
    return muscles;
  };
  
  const exerciseMuscles = getMuscleGroups();
  const exerciseDetail = EXERCISE_DETAILS[exercise];
  const exerciseImage = EXERCISE_IMAGES[exercise];
  const useMetric = userData?.measurementUnit !== 'imperial';
  const weightUnit = useMetric ? 'kg' : 'lbs';

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 z-50 overflow-y-auto" {...swipeHandlers}>
      <div style={{ paddingTop: 'var(--safe-area-top)', paddingBottom: 'var(--safe-area-bottom)' }} className="min-h-screen pb-24">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-gray-900 backdrop-blur-md border-b border-indigo-200 dark:border-indigo-500/30 px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onBack} className="flex items-center text-indigo-600 dark:text-indigo-400">
              <ArrowLeft className="h-5 w-5 mr-2" /> Back
            </button>
            <button
              onClick={() => onToggleFavorite(exercise)}
              className={`p-2 rounded-xl transition ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{exercise}</h1>
          
          {/* Clickable Muscle Tags */}
          {exerciseMuscles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {exerciseMuscles.map((muscle, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onMuscleClick) {
                      onMuscleClick(muscle);
                    }
                  }}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-800/60 transition flex items-center gap-1"
                >
                  <span>{MUSCLE_GROUPS.find(g => g.name === muscle)?.icon || '💪'}</span>
                  <span>{muscle}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* Exercise Image/GIF */}
          {exerciseImage && (
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-indigo-500/30">
              <img
                src={exerciseImage}
                alt={exercise}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {currentPR && (
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 dark:from-yellow-600/40 dark:to-amber-700/40 p-4 rounded-xl shadow-lg">
                <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-200 mb-1">🏆 Your PR</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-white">
                  {currentPR.weight}{weightUnit} × {currentPR.reps}
                </p>
                <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-1">
                  {new Date(currentPR.timestamp).toLocaleDateString()}
                </p>
              </div>
            )}
            <div className="bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-indigo-600/40 dark:to-purple-700/40 p-4 rounded-xl shadow-lg">
              <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 mb-1">📊 Times Done</p>
              <p className="text-2xl font-bold text-indigo-900 dark:text-white">
                {exerciseHistory.length}
              </p>
              <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1">Total workouts</p>
            </div>
          </div>

          {/* Exercise Details */}
          {exerciseDetail && (
            <>
              {/* Description */}
              {exerciseDetail.description && (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-indigo-500/30">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📖 About</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{exerciseDetail.description}</p>
                </div>
              )}

              {/* Instructions/Steps */}
              {exerciseDetail.steps && exerciseDetail.steps.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-indigo-500/30">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    📝 How To Perform
                  </h3>
                  <ol className="space-y-2">
                    {exerciseDetail.steps.map((step: string, idx: number) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </>
          )}

          {/* History */}
          {exerciseHistory.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-indigo-500/30">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                📈 Your History
              </h3>
              <div className="space-y-2">
                {exerciseHistory.slice(0, 5).map((workout, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {workout.sets?.length || 0} sets
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(workout.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {workout.bestSet?.weight}{weightUnit} × {workout.bestSet?.reps}
                      </p>
                      {workout.isNewPR && (
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">🏆 PR</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercise Alternatives */}
          {exerciseMuscles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-indigo-500/30">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                🔄 Similar Exercises
              </h3>
              <div className="space-y-2">
                {(() => {
                  // Get alternatives from same muscle groups
                  const alternatives: { name: string; location: string }[] = [];
                  exerciseMuscles.forEach(muscleName => {
                    const muscleGroup = MUSCLE_GROUPS.find(g => g.name === muscleName);
                    if (muscleGroup) {
                      muscleGroup.exercises.gym.forEach(ex => {
                        if (ex !== exercise && alternatives.length < 5 && !alternatives.find(a => a.name === ex)) {
                          alternatives.push({ name: ex, location: 'gym' });
                        }
                      });
                      muscleGroup.exercises.home.forEach(ex => {
                        if (ex !== exercise && alternatives.length < 5 && !alternatives.find(a => a.name === ex)) {
                          alternatives.push({ name: ex, location: 'home' });
                        }
                      });
                    }
                  });
                  
                  return alternatives.slice(0, 4).map((alt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        // Navigate directly to this alternative exercise's detail
                        if (onExerciseClick) {
                          onExerciseClick(alt.name);
                        }
                      }}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{alt.location === 'gym' ? '🏋️' : '🏠'}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{alt.name}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded-full">
                        {alt.location === 'gym' ? 'Gym' : 'Home'}
                      </span>
                    </button>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Start Exercise Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40" style={{ paddingBottom: 'calc(1rem + var(--safe-area-bottom))' }}>
            <button
              onClick={onStartLogging}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white font-bold text-lg transition duration-300 shadow-xl"
            >
              Start Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// PR History Screen
const PRHistoryScreen = ({
  onBack,
  userData
}: {
  onBack: () => void;
  userData: any;
}) => {
  const [prs, setPRs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Swipe handler for back navigation
  const swipeHandlers = useSwipe(onBack);

  useEffect(() => {
    const loadPRs = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const prQuery = query(
          collection(db, 'personalRecords'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(prQuery);
        const prData = snapshot.docs.map(doc => doc.data());
        setPRs(prData);
      } catch (error) {
        console.error('Error loading PRs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPRs();
  }, []);

  const useMetric = userData?.measurementUnit !== 'imperial';
  const weightUnit = useMetric ? 'kg' : 'lbs';

  return (
    <div {...swipeHandlers}>
      {/* Header */}
      <div className="mb-4">
        <button onClick={onBack} className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Today
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🏆 Personal Records</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your best performances</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : prs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No PRs yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Start working out to set your first records!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {prs.map((pr, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border-l-4 border-yellow-500 dark:border-yellow-400"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {pr.exercise}
                      </h3>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {pr.weight}{weightUnit} × {pr.reps}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Est. 1RM: {pr.estimatedMax.toFixed(1)}{weightUnit}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(pr.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-4xl">🏆</div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

// Workout Programs Screen - REFACTORED: Props-controlled, fixed math, single source of truth
const WorkoutProgramsScreen = ({ 
  userData,
  onBack,
  onExerciseClick,
  onStartTodaysWorkout,
  // Props controlled by parent ExerciseFinderScreen
  programView,
  setProgramView,
  pendingWorkout,
  onResumePendingWorkout,
  onDiscardPendingWorkout,
  location
}: {
  userData: any;
  onBack: () => void;
  onExerciseClick?: (exercise: string) => void;
  onStartTodaysWorkout?: (exercises: string[], programId: string) => void;
  programView: { mode: 'list' | 'detail'; programId: string | null };
  setProgramView: (view: { mode: 'list' | 'detail'; programId: string | null }) => void;
  pendingWorkout?: any;
  onResumePendingWorkout?: () => void;
  onDiscardPendingWorkout?: () => void;
  location?: 'gym' | 'home' | null;
}) => {
  // Filter programs by location - defaults to 'gym' if no location selected
  const filteredPrograms = useMemo(() => {
    const filterLocation = location || 'gym';
    return WORKOUT_PROGRAMS.filter(p => p.location === filterLocation);
  }, [location]);
  
  // Get the selected program from props
  const programData = useMemo(() => {
    if (!programView.programId) return null;
    return WORKOUT_PROGRAMS.find(p => p.id === programView.programId);
  }, [programView.programId]);
  
  const userProgram = userData?.activeProgram || null;
  
  // Check if today's workout is already completed
  const isTodayCompleted = useMemo(() => {
    if (!userProgram?.lastWorkoutDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return userProgram.lastWorkoutDate === today;
  }, [userProgram?.lastWorkoutDate]);
  
  // Day names for display
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Get current calendar day of week (1=Monday, 7=Sunday)
  const getCalendarDayOfWeek = useCallback(() => {
    const jsDay = new Date().getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    return ((jsDay + 6) % 7) + 1; // Convert to 1=Monday, 7=Sunday
  }, []);
  
  const calendarDay = getCalendarDayOfWeek(); // Today's actual calendar day (1-7)
  const calendarDayName = dayNames[calendarDay - 1]; // e.g., "Monday"
  
  // Check if today is a rest day based on program schedule
  const isRestDay = useCallback(() => {
    if (!programData) return false;
    // If calendar day exceeds program's days per week, it's a rest day
    return calendarDay > programData.daysPerWeek;
  }, [programData, calendarDay]);
  
  // Calculate current schedule index based on CALENDAR day, not program progress
  // Maps actual day of week to the program's schedule
  const getCurrentScheduleIndex = useCallback(() => {
    if (!programData) return 0;
    // Use calendar day to determine which workout to show
    // Calendar day 1-7 maps to schedule index 0-(daysPerWeek-1)
    // If it's a rest day, show the last workout as preview
    if (calendarDay > programData.daysPerWeek) {
      return 0; // Show first workout on rest days as "next up"
    }
    // Calendar day is 1-indexed, schedule is 0-indexed
    // Also use modulo for programs with repeating schedules (e.g., PPL has 3 workouts for 6 days)
    return (calendarDay - 1) % programData.schedule.length;
  }, [programData, calendarDay]);
  
  // Calculate accurate progress based on total program duration
  const getProgressInfo = useCallback(() => {
    if (!userProgram || !programData) {
      return { currentWeek: 1, currentDay: calendarDay, totalDays: 0, daysCompleted: 0, progressPercent: 0, calendarDayName };
    }
    
    const currentWeek = userProgram.currentWeek || 1;
    const totalWeeks = parseInt(programData.duration.split(' ')[0]) || 6;
    const daysPerWeek = programData.daysPerWeek;
    
    // Total days in entire program
    const totalDays = totalWeeks * daysPerWeek;
    // Days completed from stored progress
    const daysCompleted = userProgram.daysCompleted || 0;
    // Progress percentage
    const progressPercent = totalDays > 0 ? (daysCompleted / totalDays) * 100 : 0;
    
    return { currentWeek, currentDay: calendarDay, totalDays, daysCompleted, progressPercent, calendarDayName };
  }, [userProgram, programData, calendarDay, calendarDayName]);
  
  // Hierarchical back handler - controlled by parent
  const handleBack = useCallback(() => {
    if (programView.mode === 'detail') {
      setProgramView({ mode: 'list', programId: null });
    } else {
      onBack();
    }
  }, [programView.mode, setProgramView, onBack]);
  
  // Swipe handler for back navigation
  const swipeHandlers = useSwipe(handleBack);
  
  const handleStartProgram = async (programId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      await updateDoc(doc(db, 'users', user.uid), {
        activeProgram: {
          programId,
          currentWeek: 1,
          currentDay: 1,
          startDate: new Date().toISOString()
        }
      });
      
      // Navigate to detail view
      setProgramView({ mode: 'detail', programId });
      swipeableToast.success('Program started! Let\'s begin your journey. 💪');
    } catch (error) {
      console.error('Error starting program:', error);
      swipeableToast.error('Failed to start program');
    }
  };
  
  const handleResetProgram = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      await updateDoc(doc(db, 'users', user.uid), {
        activeProgram: null
      });
      
      setProgramView({ mode: 'list', programId: null });
      swipeableToast.success('Program reset successfully');
    } catch (error) {
      console.error('Error resetting program:', error);
      swipeableToast.error('Failed to reset program');
    }
  };
  
  // Handle starting today's workout - adds exercises to currentWorkout
  const handleStartWorkout = () => {
    if (!programData) return;
    
    const scheduleIndex = getCurrentScheduleIndex();
    const todayWorkout = programData.schedule[scheduleIndex];
    
    if (todayWorkout && onStartTodaysWorkout) {
      onStartTodaysWorkout(todayWorkout.exercises, programData.id);
    }
  };
  
  // Program List View
  if (programView.mode === 'list') {
    return (
      <div {...swipeHandlers}>
        {/* Header - now inline, not sticky (main header handles sticky) */}
        <div className="mb-4">
          <button onClick={handleBack} className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition duration-200 mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Today
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workout Programs</h2>
        </div>
        
        <div className="space-y-4">
          {/* Active Program Banner */}
          {userProgram && (() => {
            const activeProgram = WORKOUT_PROGRAMS.find(p => p.id === userProgram.programId);
            return (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white/80 text-xs font-medium">ACTIVE PROGRAM</p>
                      <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                        {activeProgram?.location === 'gym' ? '🏋️ Gym' : '🏠 Home'}
                      </span>
                    </div>
                    <p className="text-white font-bold text-lg">
                      {activeProgram?.name || 'Unknown'}
                    </p>
                    <p className="text-white/70 text-sm">
                      Week {userProgram.currentWeek || 1} • {calendarDayName}
                      {isRestDay() && ' (Rest Day)'}
                    </p>
                  </div>
                  <button
                    onClick={() => setProgramView({ mode: 'detail', programId: userProgram.programId })}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-semibold transition"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            );
          })()}
          
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 dark:from-indigo-900/40 dark:to-purple-900/40 p-4 rounded-xl border border-indigo-300 dark:border-indigo-500/30">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Choose Your Path</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Follow a structured program designed by fitness experts. Each program includes progressive overload and recovery optimization.
            </p>
          </div>
          
          {/* Location indicator */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-lg">{(location || 'gym') === 'gym' ? '🏋️' : '🏠'}</span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {(location || 'gym') === 'gym' ? 'Gym' : 'Home'} Programs
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              (Use toggle above to switch)
            </span>
          </div>
          
          {filteredPrograms.map((program) => {
            const isActive = userProgram?.programId === program.id;
            
            return (
              <div 
                key={program.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-xl border-2 ${
                  isActive 
                    ? 'border-green-500 dark:border-green-400' 
                    : 'border-gray-200 dark:border-indigo-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center text-2xl`}>
                      {program.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{program.name}</h3>
                        {isActive && (
                          <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {program.level} • {program.daysPerWeek} days/week
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {program.description}
                </p>
                
                <div className="flex items-center gap-2 mb-4 text-xs text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{program.duration} program</span>
                </div>
                
                {isActive ? (
                  <button
                    onClick={() => setProgramView({ mode: 'detail', programId: program.id })}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-bold transition duration-300 shadow-lg"
                  >
                    Continue Program →
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartProgram(program.id)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white font-bold transition duration-300 shadow-lg"
                  >
                    Start Program
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Program Details View
  if (!programData) return null;
  
  const scheduleIndex = getCurrentScheduleIndex();
  const currentWorkoutData = programData.schedule[scheduleIndex];
  const { currentWeek, progressPercent } = getProgressInfo();
  const totalWeeks = parseInt(programData.duration.split(' ')[0]) || 6;
  const isActive = userProgram?.programId === programData.id;
  
  return (
    <div {...swipeHandlers}>
      {/* Header - now inline, not sticky (main header handles sticky) */}
      <div className="mb-4">
        <button onClick={handleBack} className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition duration-200 mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Programs
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{programData.name}</h2>
          {isActive && (
            <button
              onClick={handleResetProgram}
              className="p-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-xl transition shadow-lg"
              aria-label="Reset program"
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Rest Day Banner */}
        {isActive && isRestDay() && (
          <div className="bg-gradient-to-r from-blue-400/20 to-cyan-500/20 dark:from-blue-900/40 dark:to-cyan-900/40 p-4 rounded-xl border border-blue-300 dark:border-blue-500/30">
            <div className="flex items-center gap-3">
              <span className="text-3xl">😴</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rest Day - {calendarDayName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recovery is essential! Next workout on Monday.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress Card - Only show if active */}
        {isActive && (
          <div className="bg-gradient-to-r from-green-400/20 to-emerald-500/20 dark:from-green-900/40 dark:to-emerald-900/40 p-4 rounded-xl border border-green-300 dark:border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Program Progress</h3>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Week {currentWeek} of {totalWeeks} • {calendarDayName}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {Math.round(progressPercent)}% complete
            </p>
          </div>
        )}
        
        {/* Current Workout Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-xl border-2 border-indigo-400 dark:border-indigo-500/50">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${programData.color} flex items-center justify-center text-2xl`}>
              {programData.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{currentWorkoutData.name}</h3>
                {isActive && !isRestDay() && (
                  <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full font-bold">
                    TODAY
                  </span>
                )}
                {isActive && isRestDay() && (
                  <span className="px-2 py-0.5 bg-gray-400 text-white text-xs rounded-full font-bold">
                    NEXT UP
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {calendarDayName} • {currentWorkoutData.exercises.length} exercises
              </p>
            </div>
          </div>
          
          {/* Muscle Focus */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Muscles:</p>
            <div className="flex flex-wrap gap-2">
              {currentWorkoutData.focus.map((muscle, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
          
          {/* Exercise List */}
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {isRestDay() ? 'Next Workout:' : `${calendarDayName}'s Exercises:`}
            </p>
            <div className="space-y-2">
              {currentWorkoutData.exercises.map((exercise, idx) => {
                const exerciseData = findExerciseInMuscleGroups(exercise);
                const hasMatch = exerciseData !== null;
                
                return (
                  <button 
                    key={idx}
                    onClick={() => onExerciseClick?.(exercise)}
                    className={`w-full p-3 rounded-lg flex items-center gap-3 text-left transition ${
                      hasMatch 
                        ? 'bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30' 
                        : 'bg-gray-50 dark:bg-gray-700/50 opacity-70'
                    }`}
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium flex-1">
                      {exercise}
                    </span>
                    {hasMatch && <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Pending Workout Banner - Show if there's an unfinished workout */}
          {isActive && pendingWorkout && onResumePendingWorkout && onDiscardPendingWorkout && (
            <div className="mt-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 dark:from-amber-900/40 dark:to-orange-900/40 p-4 rounded-xl border-2 border-amber-400 dark:border-amber-500/50">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⏸️</span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Unfinished Workout</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    You have {pendingWorkout.exercises?.length || 0} exercise(s) in progress
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onResumePendingWorkout}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white font-bold transition duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Continue
                </button>
                <button
                  onClick={onDiscardPendingWorkout}
                  className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-bold transition duration-300 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Start Workout Button - Shows different states based on completion */}
          {isActive && onStartTodaysWorkout && !pendingWorkout && (
            <>
              {isTodayCompleted ? (
                <div className="mt-4 space-y-3">
                  {/* Completed State */}
                  <div className="py-4 bg-gradient-to-r from-green-400/20 to-emerald-500/20 dark:from-green-900/40 dark:to-emerald-900/40 rounded-xl border-2 border-green-400 dark:border-green-500/50 flex items-center justify-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300 font-bold text-lg">Today's Workout Complete!</span>
                  </div>
                  {/* Start Again Option */}
                  <button
                    onClick={handleStartWorkout}
                    className="w-full py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold transition duration-300 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Start Again (Extra Session)
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartWorkout}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-bold text-lg transition duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Today's Workout
                </button>
              )}
            </>
          )}
          
          {!isActive && (
            <button
              onClick={() => handleStartProgram(programData.id)}
              className="w-full mt-4 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white font-bold text-lg transition duration-300 shadow-lg"
            >
              Start This Program
            </button>
          )}
        </div>
        
        {/* Full Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-200 dark:border-indigo-500/30">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Weekly Schedule</h3>
          <div className="space-y-2">
            {programData.schedule.map((workout, idx) => {
              // Calculate which calendar day this schedule item represents
              // For repeating schedules (like PPL with 3 items for 6 days), map appropriately
              const scheduleRepeats = programData.schedule.length < programData.daysPerWeek;
              const calendarDayForItem = scheduleRepeats 
                ? (idx % programData.schedule.length) + 1  // For display, show rotation
                : idx + 1; // 1-indexed calendar day
              const dayNameForItem = dayNames[calendarDayForItem - 1] || `Day ${idx + 1}`;
              
              // Check if this is today's workout
              const isCurrentDay = isActive && idx === scheduleIndex && !isRestDay();
              
              return (
                <button
                  key={idx}
                  onClick={() => {
                    // Preview this day's workout (just show exercises)
                  }}
                  className={`w-full p-3 rounded-lg border-l-4 text-left transition ${
                    isCurrentDay 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500' 
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-bold ${
                        isCurrentDay 
                          ? 'text-indigo-700 dark:text-indigo-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {scheduleRepeats ? `Day ${idx + 1}` : dayNameForItem}: {workout.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {workout.focus.join(', ')} • {workout.exercises.length} exercises
                      </p>
                    </div>
                    {isCurrentDay && (
                      <span className="px-2 py-1 bg-indigo-500 text-white rounded-full text-xs font-bold">
                        TODAY
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Rest Days Indicator */}
          {programData.daysPerWeek < 7 && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-500/30">
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                😴 Rest Days: {dayNames.slice(programData.daysPerWeek).join(', ')}
              </p>
            </div>
          )}
          
          {/* Note about repeating schedule */}
          {programData.schedule.length < programData.daysPerWeek && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center italic">
              This {programData.schedule.length}-day rotation repeats {Math.ceil(programData.daysPerWeek / programData.schedule.length)} times per week
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Exercise Finder Screens - REFACTORED: Flat navigation, no stages
const ExerciseFinderScreen = ({ 
  selectedMuscle, 
  setSelectedMuscle, 
  location, 
  setLocation, 
  selectedExercise, 
  setSelectedExercise,
  exerciseSubView,
  setExerciseSubView,
  exerciseTab,
  setExerciseTab,
  selectedExerciseForDetail,
  setSelectedExerciseForDetail,
  guidedWorkoutMode,
  setGuidedWorkoutMode,
  currentWorkout,
  setCurrentWorkout,
  finishWorkout,
  userData,
  workoutStartTime,
  setWorkoutStartTime,
  workoutSummary,
  setWorkoutSummary,
  pendingWorkout,
  onResumePendingWorkout,
  onDiscardPendingWorkout
}: {
  selectedMuscle: string | null;
  setSelectedMuscle: (muscle: string | null) => void;
  location: 'gym' | 'home' | null;
  setLocation: (loc: 'gym' | 'home' | null) => void;
  selectedExercise: any;
  userData: any;
  setSelectedExercise: (exercise: any) => void;
  exerciseSubView: 'list' | 'details' | 'log';
  setExerciseSubView: (view: 'list' | 'details' | 'log') => void;
  exerciseTab: 'today' | 'programs' | 'library' | 'prs';
  setExerciseTab: (tab: 'today' | 'programs' | 'library' | 'prs') => void;
  selectedExerciseForDetail: string | null;
  setSelectedExerciseForDetail: (exercise: string | null) => void;
  guidedWorkoutMode: boolean;
  setGuidedWorkoutMode: (mode: boolean) => void;
  currentWorkout: Array<{ exercise?: string; name?: string; sets: Array<{ reps: number; weight: number }> }>;
  setCurrentWorkout: (workout: Array<{ exercise?: string; name?: string; sets: Array<{ reps: number; weight: number }> }>) => void;
  finishWorkout: (passedWorkout?: Array<{ name?: string; exercise?: string; sets: Array<{ reps: number; weight: number }> }>) => Promise<void>;
  workoutStartTime: number | null;
  setWorkoutStartTime: (time: number | null) => void;
  workoutSummary: {
    show: boolean;
    duration: number;
    exercises: any[];
    totalSets: number;
    totalVolume: number;
    newPRs: { exercise: string; weight: number; reps: number }[];
  } | null;
  setWorkoutSummary: (summary: any) => void;
  pendingWorkout?: any;
  onResumePendingWorkout?: () => void;
  onDiscardPendingWorkout?: () => void;
}) => {
  const [_showRoutineConfirm, _setShowRoutineConfirm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  // REFACTORED: Programs now use unified state controlled by ExerciseFinderScreen
  const [programView, setProgramView] = useState<{ mode: 'list' | 'detail'; programId: string | null }>({ mode: 'list', programId: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [muscleRecovery, setMuscleRecovery] = useState<Record<string, { daysSince: number; status: 'ready' | 'recovering' | 'partial' }>>({});
  const [equipmentFilter, setEquipmentFilter] = useState<string[]>([]);
  const [showEquipmentFilter, setShowEquipmentFilter] = useState(false);
  const [showAdvancedTimer, setShowAdvancedTimer] = useState(false);
  const [timerMode, setTimerMode] = useState<'hiit' | 'tabata' | 'emom' | 'custom' | null>(null);
  const [showWarmupCooldown, setShowWarmupCooldown] = useState<'warmup' | 'cooldown' | null>(null);
  // REFACTORED: Expanded muscle for inline exercise viewing in Library
  const [expandedMuscle, setExpandedMuscle] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  // Paused workout state - check for AURA_FOCUS_MODE on mount
  const [pausedWorkout, setPausedWorkout] = useState<{
    exercises: Array<{ exercise?: string; name?: string; sets: Array<{ reps: number; weight: number }> }>;
    currentIndex: number;
    startTime: number;
    lastUpdated: number;
  } | null>(null);
  
  // Check for paused Focus Mode workout on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('AURA_FOCUS_MODE');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if workout is less than 24 hours old and has exercises
        const hoursSince = (Date.now() - parsed.lastUpdated) / (1000 * 60 * 60);
        if (hoursSince < 24 && parsed.exercises && parsed.exercises.length > 0) {
          // Check if any exercises have logged sets
          const hasProgress = parsed.exercises.some((ex: any) => ex.sets && ex.sets.length > 0);
          if (hasProgress || parsed.currentIndex > 0) {
            setPausedWorkout(parsed);
          } else {
            // No progress, clear it
            localStorage.removeItem('AURA_FOCUS_MODE');
          }
        } else {
          // Stale workout, clear it
          localStorage.removeItem('AURA_FOCUS_MODE');
        }
      }
    } catch (error) {
      console.error('Error loading paused workout:', error);
      localStorage.removeItem('AURA_FOCUS_MODE');
    }
  }, []);
  
  // Resume paused workout
  const handleResumePausedWorkout = useCallback(() => {
    if (pausedWorkout) {
      // Restore the workout state
      setCurrentWorkout(pausedWorkout.exercises);
      setCurrentExerciseIndex(pausedWorkout.currentIndex);
      setWorkoutStartTime(pausedWorkout.startTime);
      setGuidedWorkoutMode(true);
      setExerciseTab('today');
      setPausedWorkout(null);
      swipeableToast.success('Resumed workout! 💪');
    }
  }, [pausedWorkout, setCurrentWorkout, setWorkoutStartTime, setGuidedWorkoutMode, setExerciseTab]);
  
  // Discard paused workout
  const handleDiscardPausedWorkout = useCallback(() => {
    localStorage.removeItem('AURA_FOCUS_MODE');
    setPausedWorkout(null);
    swipeableToast.success('Workout discarded');
  }, []);

  // Reset program view when switching to Programs tab - always start with list
  useEffect(() => {
    if (exerciseTab === 'programs') {
      // Always show list view first when entering Programs tab
      // User can click on their active program to see details
      setProgramView({ mode: 'list', programId: null });
    }
  }, [exerciseTab]);

  // Handle starting today's workout from a program
  const handleStartTodaysWorkout = useCallback((exercises: string[], _programId: string) => {
    if (exercises.length === 0) {
      swipeableToast.error('No exercises in today\'s workout');
      return;
    }
    
    // Add each exercise to currentWorkout
    const newWorkoutExercises: Array<{ exercise: string; sets: Array<{ reps: number; weight: number }> }> = exercises.map(exerciseName => ({
      exercise: exerciseName,
      sets: []
    }));
    
    // Batch state updates to prevent jarring transitions
    // First, switch tab to avoid seeing intermediate states
    setExerciseTab('today');
    
    // Then update all workout-related state in one render cycle
    requestAnimationFrame(() => {
      setCurrentWorkout(newWorkoutExercises);
      setCurrentExerciseIndex(0);
      setGuidedWorkoutMode(true);
      
      // Set workout start time if not already set
      if (!workoutStartTime) {
        setWorkoutStartTime(Date.now());
      }
      
      swipeableToast.success(`Starting guided workout with ${exercises.length} exercises! 🚀`);
    });
  }, [workoutStartTime, setCurrentWorkout, setWorkoutStartTime]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('exerciseFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = useCallback((exercise: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(exercise)
        ? prev.filter(e => e !== exercise)
        : [...prev, exercise];
      localStorage.setItem('exerciseFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  // Calculate muscle recovery status
  useEffect(() => {
    const calculateRecovery = async () => {
      if (!userData?.uid) return;
      
      const user = { uid: userData.uid };
      
      try {
        // Get workouts from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
        
        const workoutsQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid),
          where('date', '>=', sevenDaysAgoStr),
          orderBy('date', 'desc')
        );
        
        const workoutsSnapshot = await getDocs(workoutsQuery);
        const recoveryMap: Record<string, number> = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Find last workout date for each muscle group
        workoutsSnapshot.forEach((doc) => {
          const workout = doc.data();
          const exercises = workout.exercises || [];
          
          exercises.forEach((ex: any) => {
            const exerciseName = ex.exercise || '';
            
            // Match exercise to muscle group
            MUSCLE_GROUPS.forEach((group) => {
              const allExercises = [...group.exercises.gym, ...group.exercises.home];
              if (allExercises.some(e => exerciseName.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(exerciseName.toLowerCase()))) {
                const workoutDate = new Date(workout.date);
                workoutDate.setHours(0, 0, 0, 0);
                const daysSince = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
                
                // Keep the most recent (smallest daysSince) workout for this muscle
                if (!(group.name in recoveryMap) || daysSince < recoveryMap[group.name]) {
                  recoveryMap[group.name] = daysSince;
                }
              }
            });
          });
        });
        
        // Calculate recovery status
        const statusMap: Record<string, { daysSince: number; status: 'ready' | 'recovering' | 'partial' }> = {};
        Object.entries(recoveryMap).forEach(([muscle, daysSince]) => {
          let status: 'ready' | 'recovering' | 'partial';
          
          if (daysSince === 0) {
            status = 'recovering'; // Trained today
          } else if (daysSince === 1) {
            status = 'recovering'; // Trained yesterday
          } else if (daysSince === 2) {
            status = 'partial'; // 2 days rest - partial recovery
          } else {
            status = 'ready'; // 3+ days - fully recovered
          }
          
          statusMap[muscle] = { daysSince, status };
        });
        
        // Muscles not found in history are ready
        MUSCLE_GROUPS.forEach((group) => {
          if (!(group.name in statusMap)) {
            statusMap[group.name] = { daysSince: 7, status: 'ready' };
          }
        });
        
        setMuscleRecovery(statusMap);
      } catch (error) {
        console.error('Error calculating muscle recovery:', error);
      }
    };
    
    calculateRecovery();
  }, [userData]);

  // @ts-ignore - preserved for potential future use
  const _muscleData = useMemo(() => MUSCLE_GROUPS.find(m => m.name === selectedMuscle), [selectedMuscle]);

  // REFACTORED: Unified back button handler - hierarchical navigation
  const handleBack = useCallback(() => {
    // 0. Close stats modal if open
    if (showStats) {
      setShowStats(false);
      return;
    }
    
    // 1. Close exercise detail first
    if (selectedExerciseForDetail) {
      setSelectedExerciseForDetail(null);
      return;
    }
    
    // 2. Exit single exercise logging
    if (exerciseSubView === 'log') {
      setExerciseSubView('list');
      return;
    }
    
    // 3. Handle program navigation (detail -> list -> exit)
    if (exerciseTab === 'programs') {
      if (programView.mode === 'detail') {
        setProgramView({ mode: 'list', programId: null });
        return;
      } else {
        setExerciseTab('today');
        return;
      }
    }
    
    // 4. Handle PRs tab
    if (exerciseTab === 'prs') {
      setExerciseTab('today');
      return;
    }
    
    // 5. Collapse expanded muscle in library
    if (expandedMuscle) {
      setExpandedMuscle(null);
      return;
    }
    
    // 6. Handle Library tab
    if (exerciseTab === 'library') {
      // If search is active or equipment filter is active, clear them first
      if (searchQuery) {
        setSearchQuery('');
        return;
      }
      if (equipmentFilter.length > 0) {
        setEquipmentFilter([]);
        return;
      }
      if (showEquipmentFilter) {
        setShowEquipmentFilter(false);
        return;
      }
      // Otherwise go back to Today
      setExerciseTab('today');
      return;
    }
    
    // 7. Clear location filter (legacy - for Today tab)
    if (location) {
      setLocation(null);
      return;
    }
    
    // 8. Clear muscle selection (legacy - for Today tab)
    if (selectedMuscle) {
      setSelectedMuscle(null);
      return;
    }
    
    // 9. If on Today tab but with active workout, do nothing (let Android handler deal with it)
    // Otherwise, this is the root of Exercise tab, user should exit to main app
  }, [showStats, selectedExerciseForDetail, exerciseSubView, programView, exerciseTab, expandedMuscle, searchQuery, equipmentFilter, showEquipmentFilter, location, selectedMuscle]);

  // Swipe handlers for navigation
  const swipeHandlersMain = useSwipe(handleBack);

  // Add to routine handler
  // @ts-ignore - preserved for potential future use
  const _handleAddToRoutine = useCallback(() => {
    _setShowRoutineConfirm(true);
    setTimeout(() => _setShowRoutineConfirm(false), 2000);
  }, []);

  // Handle saving workout from logger
  const handleSaveWorkout = useCallback((sets: Array<{ reps: number; weight: number }>) => {
    if (selectedExercise) {
      setCurrentWorkout([...currentWorkout, { exercise: selectedExercise, sets }]);
    }
  }, [selectedExercise, currentWorkout, setCurrentWorkout]);

  // Handle updating exercise sets in guided workout
  const handleExerciseComplete = useCallback((exerciseIndex: number, sets: Array<{ reps: number; weight: number }>) => {
    const updated = [...currentWorkout];
    if (updated[exerciseIndex]) {
      updated[exerciseIndex] = { ...updated[exerciseIndex], sets };
    }
    setCurrentWorkout(updated);
  }, [currentWorkout, setCurrentWorkout]);

  // Render FOCUS MODE Workout Session - Immersive single-exercise experience
  if (guidedWorkoutMode && currentWorkout.length > 0) {
    return (
      <ActiveWorkoutSession
        workoutExercises={currentWorkout}
        currentExerciseIndex={currentExerciseIndex}
        onExerciseComplete={handleExerciseComplete}
        onFinishWorkout={finishWorkout}
        onQuit={() => {
          // Clear all workout state to ensure clean exit
          setGuidedWorkoutMode(false);
          setExerciseSubView('list');
          setCurrentWorkout([]);
          setWorkoutStartTime(null);
          // localStorage is already cleared by ActiveWorkoutSession.handleQuit
        }}
        userData={userData}
        workoutStartTime={workoutStartTime}
      />
    );
  }

  // Render Exercise Logger (single exercise mode)
  if (exerciseSubView === 'log' && selectedExercise) {
    return (
      <ExerciseLogger
        exercise={selectedExercise}
        onBack={() => setExerciseSubView('list')}
        onSaveWorkout={handleSaveWorkout}
        userData={userData}
      />
    );
  }

  // Render Exercise Detail Screen
  if (selectedExerciseForDetail) {
    return (
      <ExerciseDetailScreen
        exercise={selectedExerciseForDetail}
        onBack={() => setSelectedExerciseForDetail(null)}
        onStartLogging={() => {
          setSelectedExercise(selectedExerciseForDetail);
          setExerciseSubView('log');
          setSelectedExerciseForDetail(null);
        }}
        onToggleFavorite={toggleFavorite}
        isFavorite={favorites.includes(selectedExerciseForDetail)}
        userData={userData}
        onMuscleClick={(muscle) => {
          setSelectedExerciseForDetail(null);
          setExpandedMuscle(muscle);
          setExerciseTab('library');
        }}
        onExerciseClick={(exercise) => {
          // Navigate to another exercise's detail directly
          setSelectedExerciseForDetail(exercise);
        }}
      />
    );
  }

  // REFACTORED: Programs tab now uses flat programView state - no modal pattern
  // Removed: if (showPrograms) condition - now inline

  // REFACTORED: PRs tab now renders inline - removed showPRHistory modal pattern

  // REFACTORED: Removed Stage navigation - flat navigation model now in use
  // Main UI always renders (previously "Stage 1")
  
  // Get all exercises for search
  const allExercises = MUSCLE_GROUPS.flatMap(group => [
    ...group.exercises.gym.map(ex => ({ name: ex, muscle: group.name, location: 'gym' })),
    ...group.exercises.home.map(ex => ({ name: ex, muscle: group.name, location: 'home' }))
  ]);
  
  // Helper function to detect equipment from exercise name
  const getEquipmentType = (exerciseName: string): string[] => {
    const name = exerciseName.toLowerCase();
    const equipment: string[] = [];
      
      if (name.includes('barbell') || name.includes('bench press') || name.includes('deadlift') || (name.includes('squat') && !name.includes('bodyweight'))) {
        equipment.push('barbell');
      }
      if (name.includes('dumbbell') || name.includes('db ')) {
        equipment.push('dumbbell');
      }
      if (name.includes('cable') || name.includes('pulley')) {
        equipment.push('cable');
      }
      if (name.includes('machine') || name.includes('leg press') || name.includes('smith')) {
        equipment.push('machine');
      }
      if (name.includes('push-up') || name.includes('pull-up') || name.includes('chin-up') || name.includes('plank') || name.includes('bodyweight') || name.includes('dip') || name.includes('lunge') || name.includes('crunch') || name.includes('sit-up')) {
        equipment.push('bodyweight');
      }
      if (name.includes('kettlebell') || name.includes('kb ')) {
        equipment.push('kettlebell');
      }
      if (name.includes('band') || name.includes('resistance')) {
        equipment.push('band');
      }
      
      if (equipment.length === 0) equipment.push('other');
      return equipment;
    };
    
    // Filter exercises based on search and equipment
    let filteredExercises = searchQuery
      ? allExercises.filter(ex => 
          ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.muscle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
    
    // Apply equipment filter
    if (equipmentFilter.length > 0) {
      filteredExercises = filteredExercises.filter(ex => {
        const exEquipment = getEquipmentType(ex.name);
        return equipmentFilter.some(filter => exEquipment.includes(filter));
      });
    }
    
    // REFACTORED: Apply global location filter
    if (location) {
      filteredExercises = filteredExercises.filter(ex => ex.location === location);
    }

    return (
      <>
        {/* Sticky Header with Safe Area - REFACTORED: Added global Gym/Home toggle */}
        <div style={{ paddingTop: 'var(--safe-area-top)' }} className="sticky top-0 z-40 w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-gray-900 backdrop-blur-md border-b border-indigo-200 dark:border-indigo-500/30 shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">💪 Exercises</h2>
              <div className="flex items-center gap-2">
                {/* REFACTORED: Global Gym/Home Toggle - always visible */}
                <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setLocation(location === 'gym' ? null : 'gym')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                      location === 'gym' 
                        ? 'bg-indigo-500 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Dumbbell className="w-3.5 h-3.5 inline mr-1" />
                    Gym
                  </button>
                  <button
                    onClick={() => setLocation(location === 'home' ? null : 'home')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                      location === 'home' 
                        ? 'bg-teal-500 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5 inline mr-1" />
                    Home
                  </button>
                </div>
                <button
                  onClick={() => setShowStats(true)}
                  className="p-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl transition shadow-lg"
                  aria-label="View workout statistics"
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'today', label: 'Today', icon: '🔥' },
                { id: 'programs', label: 'Programs', icon: '🎯' },
                { id: 'library', label: 'Library', icon: '📚' },
                { id: 'prs', label: 'PRs', icon: '🏆' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    // Warn if workout in progress
                    if (guidedWorkoutMode && currentWorkout.length > 0 && tab.id !== exerciseTab) {
                      const confirmed = confirm('You have a workout in progress. Switch tabs anyway? Your workout will continue.');
                      if (!confirmed) return;
                    }
                    
                    setExerciseTab(tab.id as any);
                    // Complete state cleanup when changing tabs
                    setProgramView({ mode: 'list', programId: null });
                    setExpandedMuscle(null);
                    setSelectedExerciseForDetail(null);
                    if (!guidedWorkoutMode) {
                      setExerciseSubView('list');
                    }
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition ${
                    exerciseTab === tab.id
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="px-4 space-y-6 pt-4 pb-24" {...swipeHandlersMain}>
        
        {/* TODAY TAB */}
        {exerciseTab === 'today' && (
          <>
            {/* Paused Workout Banner - Show if there's a paused Focus Mode workout */}
            {pausedWorkout && !guidedWorkoutMode && (
              <div className="bg-gradient-to-r from-amber-400/30 to-orange-500/30 dark:from-amber-900/50 dark:to-orange-900/50 p-4 rounded-xl border-2 border-amber-400 dark:border-amber-500/50 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">⏸️</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">Paused Workout</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {pausedWorkout.exercises.filter((ex: any) => ex.sets && ex.sets.length > 0).length}/{pausedWorkout.exercises.length} exercises completed • 
                      {' '}{Math.round((Date.now() - pausedWorkout.lastUpdated) / (1000 * 60))} min ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleResumePausedWorkout}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white font-bold transition duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Resume Workout
                  </button>
                  <button
                    onClick={handleDiscardPausedWorkout}
                    className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-bold transition duration-300 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
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
                  onClick={() => finishWorkout()}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-bold transition duration-300 shadow-lg"
                >
                  🏁 Finish Workout
                </button>
              </div>
            )}
            
            {/* Quick Timer Access */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-indigo-500/30">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                ⏱️ Quick Timers
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'tabata', label: 'Tabata', desc: '20s work / 10s rest', icon: '🔥', color: 'from-red-400 to-orange-500' },
                  { id: 'hiit', label: 'HIIT', desc: '30s work / 30s rest', icon: '⚡', color: 'from-yellow-400 to-amber-500' },
                  { id: 'emom', label: 'EMOM', desc: 'Every Minute', icon: '⏰', color: 'from-blue-400 to-indigo-500' },
                  { id: 'custom', label: 'Custom', desc: 'Set your own', icon: '⚙️', color: 'from-purple-400 to-pink-500' }
                ].map(timer => (
                  <button
                    key={timer.id}
                    onClick={() => {
                      setTimerMode(timer.id as any);
                      setShowAdvancedTimer(true);
                    }}
                    className={`p-3 rounded-xl bg-gradient-to-br ${timer.color} text-white text-left transition hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{timer.icon}</span>
                      <span className="font-bold text-sm">{timer.label}</span>
                    </div>
                    <p className="text-xs text-white/80">{timer.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Warm-up & Cool-down Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-indigo-500/30">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                🧘 Warm-up & Cool-down
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowWarmupCooldown('warmup')}
                  className="p-4 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white text-left transition hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🔥</span>
                    <span className="font-bold">Warm-up</span>
                  </div>
                  <p className="text-xs text-white/80">Dynamic stretches to prepare muscles</p>
                </button>
                <button
                  onClick={() => setShowWarmupCooldown('cooldown')}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-left transition hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">❄️</span>
                    <span className="font-bold">Cool-down</span>
                  </div>
                  <p className="text-xs text-white/80">Static stretches for recovery</p>
                </button>
              </div>
            </div>

            {/* Smart Suggestions Widget */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 shadow-lg border border-indigo-200 dark:border-indigo-500/30">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-lg">🧠</span> Smart Suggestions
              </h3>
              
              {/* Today's Recommendation */}
              {(() => {
                // Find muscles that are ready to train
                const readyMuscles = MUSCLE_GROUPS.filter(g => {
                  const recovery = muscleRecovery[g.name];
                  return !recovery || recovery.status === 'ready';
                });
                
                // Find muscles that haven't been trained in a while (based on recovery data)
                const neglectedMuscles = MUSCLE_GROUPS.filter(g => {
                  const recovery = muscleRecovery[g.name];
                  return recovery && recovery.daysSince >= 5;
                });
                
                // Prioritize neglected muscles, then ready muscles
                // Use stable selection based on today's date (changes once per day, not on every touch)
                const todaySeed = new Date().toDateString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const stableIndex = readyMuscles.length > 0 ? todaySeed % readyMuscles.length : 0;
                const suggestedMuscle = neglectedMuscles[0] || readyMuscles[stableIndex];
                
                if (!suggestedMuscle) return null;
                
                const suggestedExercises = location === 'gym' 
                  ? suggestedMuscle.exercises.gym.slice(0, 3)
                  : suggestedMuscle.exercises.home.slice(0, 3);
                
                const isNeglected = neglectedMuscles.includes(suggestedMuscle);
                
                return (
                  <div className="space-y-3">
                    {/* Main Suggestion */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{suggestedMuscle.icon}</span>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{suggestedMuscle.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {isNeglected ? '⚠️ Needs attention!' : '✅ Ready to train'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // REFACTORED: Go directly to Library tab with muscle expanded
                            setExpandedMuscle(suggestedMuscle.name);
                            setExerciseTab('library');
                          }}
                          className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition"
                        >
                          Start →
                        </button>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        {suggestedExercises.map((ex, i) => (
                          <span 
                            key={i}
                            className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">{readyMuscles.length}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Ready</p>
                      </div>
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                          {MUSCLE_GROUPS.filter(g => muscleRecovery[g.name]?.status === 'partial').length}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Partial</p>
                      </div>
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          {MUSCLE_GROUPS.filter(g => muscleRecovery[g.name]?.status === 'recovering').length}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Resting</p>
                      </div>
                    </div>

                    {/* Tip of the Day */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 flex items-start gap-2">
                      <span className="text-lg">💡</span>
                      <p className="text-xs text-amber-800 dark:text-amber-200">
                        {[
                          'Train opposing muscle groups together for balanced development!',
                          'Allow 48-72 hours between training the same muscle group.',
                          'Progressive overload is key - add weight or reps each week!',
                          'Stay hydrated! Aim for at least 8 glasses of water on workout days.',
                          'Sleep 7-9 hours for optimal muscle recovery.',
                          'Warm up properly to prevent injuries and improve performance.',
                          'Track your workouts to see progress over time!',
                          'Compound exercises like squats and deadlifts build overall strength.',
                        ][new Date().getDay()]}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
            
            {/* Recovery Legend */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-indigo-200 dark:border-indigo-500/30 shadow-md">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Muscle Recovery Status</h3>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-[8px]">✓</div>
                  <span className="text-gray-700 dark:text-gray-300">Ready</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-[8px]">⚡</div>
                  <span className="text-gray-700 dark:text-gray-300">Partial</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-[8px]">○</div>
                  <span className="text-gray-700 dark:text-gray-300">Rest</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {MUSCLE_GROUPS.map((group) => {
                const recovery = muscleRecovery[group.name];
                const recoveryStatus = recovery?.status || 'ready';
                const daysSince = recovery?.daysSince || 7;
                
                const recoveryConfig = {
                  ready: { 
                    color: 'bg-green-500', 
                    textColor: 'text-green-700 dark:text-green-300',
                    label: 'Ready',
                    icon: '✓'
                  },
                  partial: { 
                    color: 'bg-yellow-500', 
                    textColor: 'text-yellow-700 dark:text-yellow-300',
                    label: 'Partial',
                    icon: '⚡'
                  },
                  recovering: { 
                    color: 'bg-red-500', 
                    textColor: 'text-red-700 dark:text-red-300',
                    label: 'Rest',
                    icon: '○'
                  }
                };
                
                const config = recoveryConfig[recoveryStatus];
                
                return (
                  <button
                    key={group.name}
                    onClick={() => {
                      // REFACTORED: Go directly to Library tab with muscle expanded
                      setExpandedMuscle(group.name);
                      setExerciseTab('library');
                    }}
                    className={`relative p-5 ${group.color} rounded-xl shadow-2xl border-2 border-white/30 flex flex-col items-center justify-center transform transition duration-300 hover:scale-[1.05] hover:shadow-2xl active:scale-95 h-32`}
                  >
                    <div className={`absolute top-2 right-2 ${config.color} w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                      {config.icon}
                    </div>
                    
                    <span className="text-4xl mb-2">{group.icon}</span>
                    <span className="text-sm font-semibold">{group.name}</span>
                    
                    {daysSince < 7 && (
                      <span className={`text-xs mt-1 ${config.textColor} font-medium`}>
                        {daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince}d ago`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
        
        {/* PROGRAMS TAB - REFACTORED: Flat conditional rendering, no modal */}
        {exerciseTab === 'programs' && (
          <WorkoutProgramsScreen
            userData={userData}
            programView={programView}
            setProgramView={setProgramView}
            onBack={() => setExerciseTab('today')}
            onExerciseClick={(exercise) => {
              setSelectedExerciseForDetail(exercise);
            }}
            onStartTodaysWorkout={handleStartTodaysWorkout}
            pendingWorkout={pendingWorkout}
            onResumePendingWorkout={onResumePendingWorkout}
            onDiscardPendingWorkout={onDiscardPendingWorkout}
            location={location}
          />
        )}
        
        {/* LIBRARY TAB - REFACTORED: Inline muscle expansion instead of navigation */}
        {exerciseTab === 'library' && (
          <div className="space-y-4">
            {/* Search Bar with Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exercises..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/20 transition outline-none"
                />
              </div>
              
              {/* Equipment Filter Toggle */}
              <button
                onClick={() => setShowEquipmentFilter(!showEquipmentFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition ${
                  equipmentFilter.length > 0 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>🔧</span>
                <span>Equipment Filter</span>
                {equipmentFilter.length > 0 && (
                  <span className="bg-white text-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {equipmentFilter.length}
                  </span>
                )}
              </button>
              
              {/* Equipment Filter Panel */}
              {showEquipmentFilter && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Filter by Equipment</p>
                    {equipmentFilter.length > 0 && (
                      <button
                        onClick={() => setEquipmentFilter([])}
                        className="text-xs text-red-500 hover:text-red-600 font-semibold"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'barbell', label: 'Barbell', icon: '🏋️' },
                      { id: 'dumbbell', label: 'Dumbbells', icon: '🪨' },
                      { id: 'cable', label: 'Cable', icon: '🔗' },
                      { id: 'machine', label: 'Machine', icon: '⚙️' },
                      { id: 'bodyweight', label: 'Bodyweight', icon: '🧍' },
                      { id: 'kettlebell', label: 'Kettlebell', icon: '🔔' },
                      { id: 'band', label: 'Bands', icon: '〰️' },
                      { id: 'other', label: 'Other', icon: '📦' },
                    ].map(equip => (
                      <button
                        key={equip.id}
                        onClick={() => {
                          setEquipmentFilter(prev => 
                            prev.includes(equip.id) 
                              ? prev.filter(e => e !== equip.id)
                              : [...prev, equip.id]
                          );
                        }}
                        className={`p-3 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                          equipmentFilter.includes(equip.id)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span>{equip.icon}</span>
                        <span>{equip.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Favorites Section */}
            {favorites.length > 0 && !searchQuery && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                  Favorites
                </h3>
                <div className="space-y-2">
                  {favorites.slice(0, 5).map((exercise, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedExerciseForDetail(exercise)}
                      className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{exercise}</span>
                      <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Search Results or Browse by Muscle */}
            {searchQuery ? (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Results ({filteredExercises.length})
                </h3>
                {filteredExercises.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">No exercises found</p>
                ) : (
                  <div className="space-y-2">
                    {filteredExercises.map((exercise, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedExerciseForDetail(exercise.name)}
                        className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{exercise.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {exercise.muscle} • {exercise.location === 'gym' ? '🏋️ Gym' : '🏠 Home'}
                          </p>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Browse by Muscle {location && <span className="text-sm font-normal text-indigo-500">({location === 'gym' ? '🏋️ Gym' : '🏠 Home'})</span>}
                </h3>
                {/* REFACTORED: Inline expandable muscle groups */}
                <div className="space-y-3">
                  {MUSCLE_GROUPS.map((group) => {
                    const isExpanded = expandedMuscle === group.name;
                    const exercises = location 
                      ? group.exercises[location] 
                      : [...group.exercises.gym, ...group.exercises.home].filter((v, i, a) => a.indexOf(v) === i);
                    
                    return (
                      <div key={group.name} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-indigo-500/30 overflow-hidden">
                        <button
                          onClick={() => setExpandedMuscle(isExpanded ? null : group.name)}
                          className={`w-full p-4 flex items-center justify-between transition ${isExpanded ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl ${group.color} flex items-center justify-center text-2xl shadow-lg`}>
                              {group.icon}
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-900 dark:text-white">{group.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {exercises.length} exercises
                              </p>
                            </div>
                          </div>
                          <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                            <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
                          </div>
                        </button>
                        
                        {/* REFACTORED: Inline exercise list - no navigation needed */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                              {exercises.map((ex, idx) => {
                                const isFav = favorites.includes(ex);
                                const isGym = group.exercises.gym.includes(ex);
                                const isHome = group.exercises.home.includes(ex);
                                
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedExerciseForDetail(ex)}
                                    className={`w-full p-3 rounded-lg flex items-center justify-between ${
                                      isFav 
                                        ? 'bg-red-50 dark:bg-red-900/20 border-l-3 border-red-500' 
                                        : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    } transition`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {isFav && <Heart className="w-4 h-4 text-red-500 fill-current" />}
                                      <span className="text-sm font-medium text-gray-900 dark:text-white">{ex}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {!location && (
                                        <span className="text-[10px] text-gray-400">
                                          {isGym && isHome ? '🏋️🏠' : isGym ? '🏋️' : '🏠'}
                                        </span>
                                      )}
                                      <ArrowLeft className="w-4 h-4 text-gray-300 transform rotate-180" />
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* PRs TAB - REFACTORED: Render PRHistoryScreen inline */}
        {exerciseTab === 'prs' && (
          <PRHistoryScreen
            onBack={() => setExerciseTab('today')}
            userData={userData}
          />
        )}
        
        </div>
        
        {/* Global Modals - REFACTORED: Moved from Stage 3 to main screen */}
        
        {/* Workout Statistics Modal */}
        {showStats && (
          <WorkoutStatsDashboard
            onClose={() => setShowStats(false)}
            userData={userData}
          />
        )}

        {/* Workout Summary Screen with fade-in animation */}
        {workoutSummary?.show && (
          <div className="fixed inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 z-[80] overflow-y-auto animate-fade-in">
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
              }
              .animate-fade-in {
                animation: fadeIn 0.3s ease-in-out;
              }
              .animate-fade-out {
                animation: fadeOut 0.2s ease-in-out forwards;
              }
            `}} />
            <div style={{ paddingTop: 'var(--safe-area-top)', paddingBottom: 'var(--safe-area-bottom)' }} className="min-h-screen pb-24">
              {/* Confetti Animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 50}%`,
                      backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#F472B6'][i % 5],
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`
                    }}
                  />
                ))}
              </div>

              <div className="relative px-4 pt-8 space-y-6">
                {/* Celebration Header */}
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h1 className="text-3xl font-bold text-white mb-2">Workout Complete!</h1>
                  <p className="text-white/80 text-lg">Great job crushing it today!</p>
                </div>

                {/* Main Stats Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
                      <div className="text-3xl mb-1">⏱️</div>
                      <p className="text-3xl font-bold text-indigo-600">{workoutSummary.duration}</p>
                      <p className="text-sm text-gray-600">Minutes</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl">
                      <div className="text-3xl mb-1">🏋️</div>
                      <p className="text-3xl font-bold text-orange-600">{workoutSummary.exercises.length}</p>
                      <p className="text-sm text-gray-600">Exercises</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl">
                      <div className="text-3xl mb-1">📊</div>
                      <p className="text-3xl font-bold text-emerald-600">{workoutSummary.totalSets}</p>
                      <p className="text-sm text-gray-600">Total Sets</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl">
                      <div className="text-3xl mb-1">💪</div>
                      <p className="text-3xl font-bold text-purple-600">{workoutSummary.totalVolume.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Volume ({userData?.measurementUnit === 'imperial' ? 'lbs' : 'kg'})</p>
                    </div>
                  </div>

                  {/* Estimated Calories */}
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-4 text-white text-center mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">🔥</span>
                      <span className="text-2xl font-bold">~{Math.round(workoutSummary.duration * 6)} cal</span>
                    </div>
                    <p className="text-sm text-white/80">Estimated calories burned</p>
                  </div>
                </div>

                {/* New PRs Section */}
                {workoutSummary.newPRs.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">🏆</span>
                      <div>
                        <h2 className="text-xl font-bold text-white">New Personal Records!</h2>
                        <p className="text-white/80 text-sm">{workoutSummary.newPRs.length} new PR{workoutSummary.newPRs.length > 1 ? 's' : ''} set today</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {workoutSummary.newPRs.map((pr, idx) => (
                        <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
                          <span className="text-white font-semibold">{pr.exercise}</span>
                          <span className="text-white font-bold">{pr.weight}{userData?.measurementUnit === 'imperial' ? 'lbs' : 'kg'} × {pr.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exercise Breakdown */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📝</span> Exercise Breakdown
                  </h3>
                  <div className="space-y-3">
                    {workoutSummary.exercises.map((ex, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900">{ex.exercise}</p>
                          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full font-medium">
                            {ex.sets.length} sets
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ex.sets.map((set: any, setIdx: number) => (
                            <span key={setIdx} className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-lg">
                              {set.weight}{userData?.measurementUnit === 'imperial' ? 'lbs' : 'kg'} × {set.reps}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 px-4">
                  <button
                    onClick={() => {
                      // Smooth fade-out before closing
                      const summaryDiv = document.querySelector('.animate-fade-in');
                      if (summaryDiv) {
                        summaryDiv.classList.add('animate-fade-out');
                        setTimeout(() => setWorkoutSummary(null), 200);
                      } else {
                        setWorkoutSummary(null);
                      }
                    }}
                    className="w-full py-4 bg-white rounded-2xl text-emerald-600 font-bold text-lg shadow-xl transition hover:bg-gray-50"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Timer Modal */}
        {showAdvancedTimer && (
          <AdvancedTimerModal 
            mode={timerMode || 'tabata'}
            onClose={() => {
              setShowAdvancedTimer(false);
              setTimerMode(null);
            }}
          />
        )}

        {/* Warm-up / Cool-down Modal */}
        {showWarmupCooldown && (
          <WarmupCooldownModal 
            mode={showWarmupCooldown}
            targetMuscles={expandedMuscle ? [expandedMuscle] : currentWorkout.map(ex => {
              // Extract muscle from logged exercises
              const exerciseName = ex.exercise || ex.name || '';
              const muscleGroup = MUSCLE_GROUPS.find(g => 
                [...g.exercises.gym, ...g.exercises.home].includes(exerciseName)
              );
              return muscleGroup?.name || '';
            }).filter(Boolean)}
            onClose={() => setShowWarmupCooldown(null)}
          />
        )}
      </>
    );
  // REFACTORED: Stage 2 and Stage 3 removed - flat navigation now uses Library tab with inline expansion
};

// Premium Lock Components

// Advanced Timer Modal Component for HIIT, Tabata, EMOM, Custom timers
const AdvancedTimerModal = ({ 
  mode, 
  onClose 
}: { 
  mode: 'hiit' | 'tabata' | 'emom' | 'custom';
  onClose: () => void;
}) => {
  // Timer presets for each mode
  const presets = {
    tabata: { workTime: 20, restTime: 10, rounds: 8, name: 'Tabata', icon: '🔥', color: 'from-red-500 to-orange-500' },
    hiit: { workTime: 30, restTime: 30, rounds: 10, name: 'HIIT', icon: '⚡', color: 'from-yellow-500 to-amber-500' },
    emom: { workTime: 60, restTime: 0, rounds: 10, name: 'EMOM', icon: '⏰', color: 'from-blue-500 to-indigo-500' },
    custom: { workTime: 45, restTime: 15, rounds: 8, name: 'Custom', icon: '⚙️', color: 'from-purple-500 to-pink-500' }
  };

  const preset = presets[mode];
  const [workTime, setWorkTime] = useState(preset.workTime);
  const [restTime, setRestTime] = useState(preset.restTime);
  const [totalRounds, setTotalRounds] = useState(preset.rounds);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(preset.workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [showSettings, setShowSettings] = useState(mode === 'custom');

  // Calculate total workout time
  const totalTime = (workTime + restTime) * totalRounds;
  const totalMinutes = Math.floor(totalTime / 60);
  const totalSeconds = totalTime % 60;

  // Reset timer when settings change
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(workTime);
      setCurrentRound(1);
      setIsWorkPhase(true);
      setIsComplete(false);
    }
  }, [workTime, restTime, totalRounds]);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning && !isPaused && !isComplete) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up for current phase
            if (isWorkPhase) {
              // Work phase done
              if (restTime > 0) {
                // Switch to rest
                setIsWorkPhase(false);
                playBeep('rest');
                return restTime;
              } else {
                // No rest (EMOM mode), go to next round
                if (currentRound >= totalRounds) {
                  setIsComplete(true);
                  setIsRunning(false);
                  playBeep('complete');
                  return 0;
                }
                setCurrentRound(r => r + 1);
                playBeep('work');
                return workTime;
              }
            } else {
              // Rest phase done
              if (currentRound >= totalRounds) {
                setIsComplete(true);
                setIsRunning(false);
                playBeep('complete');
                return 0;
              }
              // Switch to work
              setCurrentRound(r => r + 1);
              setIsWorkPhase(true);
              playBeep('work');
              return workTime;
            }
          }
          
          // Countdown beep at 3, 2, 1
          if (prev <= 4 && prev > 1) {
            playBeep('countdown');
          }
          
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, isPaused, isWorkPhase, currentRound, totalRounds, workTime, restTime, isComplete]);

  // Audio and vibration feedback
  const playBeep = (type: 'work' | 'rest' | 'countdown' | 'complete') => {
    // Vibration feedback
    if ('vibrate' in navigator) {
      if (type === 'work') {
        navigator.vibrate([200, 100, 200]);
      } else if (type === 'rest') {
        navigator.vibrate([100, 50, 100]);
      } else if (type === 'countdown') {
        navigator.vibrate(50);
      } else if (type === 'complete') {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }
    }
    
    // Audio feedback using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'work') {
        oscillator.frequency.value = 880; // High pitch for work
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      } else if (type === 'rest') {
        oscillator.frequency.value = 440; // Lower pitch for rest
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      } else if (type === 'countdown') {
        oscillator.frequency.value = 660;
        gainNode.gain.value = 0.2;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } else if (type === 'complete') {
        oscillator.frequency.value = 1320;
        gainNode.gain.value = 0.4;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    setShowSettings(false);
    playBeep('work');
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(workTime);
    setCurrentRound(1);
    setIsWorkPhase(true);
    setIsComplete(false);
  };

  // Calculate progress for circular timer
  const maxTime = isWorkPhase ? workTime : restTime;
  const progress = maxTime > 0 ? ((maxTime - timeLeft) / maxTime) * 100 : 0;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${preset.color} px-4 py-4 pt-12`}>
        <div className="flex items-center justify-between">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 text-white/80 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{preset.icon}</span>
            {preset.name} Timer
          </h1>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 -mr-2 text-white/80 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        
        {/* Round Progress */}
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: totalRounds }, (_, i) => (
            <div 
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < currentRound - 1 
                  ? 'bg-white w-6' 
                  : i === currentRound - 1 
                    ? 'bg-white/90 w-8' 
                    : 'bg-white/30 w-4'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-white/80 text-sm mt-2">
          Round {currentRound} of {totalRounds}
        </p>
      </div>

      {/* Settings Panel */}
      {showSettings && !isRunning && (
        <div className="bg-gray-900 p-4 border-b border-gray-800">
          <div className="grid grid-cols-3 gap-4">
            {/* Work Time */}
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Work (sec)</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setWorkTime(Math.max(5, workTime - 5))}
                  className="w-8 h-8 bg-gray-800 rounded-lg text-white font-bold"
                >-</button>
                <span className="text-white font-bold text-lg flex-1 text-center">{workTime}</span>
                <button 
                  onClick={() => setWorkTime(Math.min(300, workTime + 5))}
                  className="w-8 h-8 bg-gray-800 rounded-lg text-white font-bold"
                >+</button>
              </div>
            </div>
            
            {/* Rest Time */}
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Rest (sec)</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setRestTime(Math.max(0, restTime - 5))}
                  className="w-8 h-8 bg-gray-800 rounded-lg text-white font-bold"
                >-</button>
                <span className="text-white font-bold text-lg flex-1 text-center">{restTime}</span>
                <button 
                  onClick={() => setRestTime(Math.min(300, restTime + 5))}
                  className="w-8 h-8 bg-gray-800 rounded-lg text-white font-bold"
                >+</button>
              </div>
            </div>
            
            {/* Rounds */}
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Rounds</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setTotalRounds(Math.max(1, totalRounds - 1))}
                  className="w-8 h-8 bg-gray-800 rounded-lg text-white font-bold"
                >-</button>
                <span className="text-white font-bold text-lg flex-1 text-center">{totalRounds}</span>
                <button 
                  onClick={() => setTotalRounds(Math.min(50, totalRounds + 1))}
                  className="w-8 h-8 bg-gray-800 rounded-lg text-white font-bold"
                >+</button>
              </div>
            </div>
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-3">
            Total workout: {totalMinutes}:{totalSeconds.toString().padStart(2, '0')}
          </p>
        </div>
      )}

      {/* Timer Display */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="min-h-full flex flex-col items-center justify-center">
        {isComplete ? (
          /* Completion Screen */
          <div className="text-center">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">Workout Complete!</h2>
            <p className="text-gray-400 text-lg">
              {totalRounds} rounds • {totalMinutes}:{totalSeconds.toString().padStart(2, '0')} total
            </p>
            <button
              onClick={resetTimer}
              className={`mt-8 px-8 py-4 bg-gradient-to-r ${preset.color} rounded-2xl text-white font-bold text-lg shadow-xl`}
            >
              🔄 Do It Again
            </button>
          </div>
        ) : (
          /* Timer Circle */
          <>
            <div className="relative">
              {/* Background circle */}
              <svg className="w-72 h-72 transform -rotate-90">
                <circle
                  cx="144"
                  cy="144"
                  r="140"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-800"
                />
                {/* Progress circle */}
                <circle
                  cx="144"
                  cy="144"
                  r="140"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className={isWorkPhase ? 'text-green-500' : 'text-blue-500'}
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                    transition: 'stroke-dashoffset 0.5s linear'
                  }}
                />
              </svg>
              
              {/* Time display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-sm font-semibold uppercase tracking-wider mb-2 ${
                  isWorkPhase ? 'text-green-400' : 'text-blue-400'
                }`}>
                  {isWorkPhase ? '💪 WORK' : '😮‍💨 REST'}
                </span>
                <span className="text-6xl font-bold text-white tabular-nums">
                  {formatTime(timeLeft)}
                </span>
                {isPaused && (
                  <span className="text-yellow-400 text-sm font-semibold mt-2 animate-pulse">
                    PAUSED
                  </span>
                )}
              </div>
            </div>

            {/* Phase Indicator */}
            <div className="mt-6 flex gap-4">
              <div className={`px-4 py-2 rounded-xl ${isWorkPhase ? 'bg-green-500/20 border-2 border-green-500' : 'bg-gray-800'}`}>
                <span className="text-white font-semibold">Work: {workTime}s</span>
              </div>
              {restTime > 0 && (
                <div className={`px-4 py-2 rounded-xl ${!isWorkPhase ? 'bg-blue-500/20 border-2 border-blue-500' : 'bg-gray-800'}`}>
                  <span className="text-white font-semibold">Rest: {restTime}s</span>
                </div>
              )}
            </div>
          </>
        )}
        </div>
        {/* Bottom spacer for scrolling */}
        <div className="h-24" />
      </div>

      {/* Control Buttons */}
      {!isComplete && (
        <div className="p-6 pb-24 bg-gradient-to-t from-black via-black to-transparent">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className={`w-full py-5 bg-gradient-to-r ${preset.color} rounded-2xl text-white font-bold text-xl shadow-xl flex items-center justify-center gap-3`}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              START
            </button>
          ) : (
            <div className="flex gap-4">
              {isPaused ? (
                <button
                  onClick={resumeTimer}
                  className="flex-1 py-5 bg-green-500 rounded-2xl text-white font-bold text-xl shadow-xl flex items-center justify-center gap-2"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  RESUME
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex-1 py-5 bg-yellow-500 rounded-2xl text-white font-bold text-xl shadow-xl flex items-center justify-center gap-2"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                  PAUSE
                </button>
              )}
              <button
                onClick={resetTimer}
                className="py-5 px-6 bg-gray-800 rounded-2xl text-white font-bold text-xl shadow-xl"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Warm-up & Cool-down Modal Component
const WarmupCooldownModal = ({
  mode,
  targetMuscles,
  onClose
}: {
  mode: 'warmup' | 'cooldown';
  targetMuscles: string[];
  onClose: () => void;
}) => {
  // Smart warmup/cooldown generation based on target muscles
  // Uses MUSCLE_GROUPS.warmups for dynamic exercise selection
  
  const [viewMode, setViewMode] = useState<'checklist' | 'guided'>('checklist'); // New: checklist or guided mode
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  
  // Comprehensive stretching exercises database
  const stretchExercises = {
    warmup: {
      general: [
        { name: 'Jumping Jacks', duration: 30, icon: '⭐', description: 'Get blood flowing with full body movement' },
        { name: 'High Knees', duration: 30, icon: '🏃', description: 'Drive knees up alternately' },
        { name: 'Arm Circles', duration: 20, icon: '🔄', description: 'Small to large circles, both directions' },
        { name: 'Hip Circles', duration: 20, icon: '💫', description: 'Rotate hips in circular motion' },
        { name: 'Torso Twists', duration: 20, icon: '🌀', description: 'Rotate upper body side to side' },
      ],
      'Chest': [
        { name: 'Arm Swings', duration: 30, icon: '💪', description: 'Horizontal arm swings across body' },
        { name: 'Wall Push-ups', duration: 30, icon: '🧱', description: 'Light push-ups against wall' },
        { name: 'Chest Opener', duration: 20, icon: '🔓', description: 'Clasp hands behind, open chest' },
      ],
      'Back': [
        { name: 'Cat-Cow Stretch', duration: 30, icon: '🐱', description: 'Alternate arching and rounding spine' },
        { name: 'Arm Reaches', duration: 20, icon: '🙋', description: 'Reach arms overhead alternately' },
        { name: 'Trunk Rotations', duration: 30, icon: '🔄', description: 'Rotate torso while standing' },
      ],
      'Shoulders': [
        { name: 'Shoulder Rolls', duration: 30, icon: '🔄', description: 'Roll shoulders forward and back' },
        { name: 'Arm Circles', duration: 30, icon: '⭕', description: 'Small to large circles' },
        { name: 'Cross-body Arm Swings', duration: 20, icon: '✖️', description: 'Swing arms across body' },
      ],
      'Arms': [
        { name: 'Wrist Circles', duration: 20, icon: '🔄', description: 'Rotate wrists both directions' },
        { name: 'Arm Shakes', duration: 15, icon: '👋', description: 'Shake arms loosely' },
        { name: 'Tricep Reaches', duration: 20, icon: '🙆', description: 'Reach behind head alternately' },
      ],
      'Core': [
        { name: 'Standing Side Bends', duration: 30, icon: '↔️', description: 'Bend side to side' },
        { name: 'Standing Knee Raises', duration: 30, icon: '🦵', description: 'Bring knees to chest alternately' },
        { name: 'Torso Twists', duration: 30, icon: '🌀', description: 'Rotate upper body side to side' },
      ],
      'Legs': [
        { name: 'Leg Swings', duration: 30, icon: '🦿', description: 'Swing legs front to back' },
        { name: 'Walking Lunges', duration: 30, icon: '🚶', description: 'Dynamic lunge steps' },
        { name: 'Bodyweight Squats', duration: 30, icon: '🏋️', description: 'Light tempo squats' },
        { name: 'High Knees', duration: 30, icon: '🏃', description: 'Drive knees up alternately' },
      ],
    },
    cooldown: {
      general: [
        { name: 'Deep Breathing', duration: 60, icon: '🧘', description: 'Slow, deep breaths to lower heart rate' },
        { name: 'Gentle Walking', duration: 60, icon: '🚶', description: 'Slow pace to cool down gradually' },
      ],
      'Chest': [
        { name: 'Doorway Chest Stretch', duration: 30, icon: '🚪', description: 'Hold arm against doorway, lean forward' },
        { name: 'Chest Opener', duration: 30, icon: '🔓', description: 'Clasp hands behind, lift and hold' },
        { name: 'Lying Chest Stretch', duration: 30, icon: '🛏️', description: 'Lie on foam roller, arms out wide' },
      ],
      'Back': [
        { name: 'Child\'s Pose', duration: 45, icon: '🧒', description: 'Kneel, reach arms forward, relax' },
        { name: 'Cat-Cow Hold', duration: 30, icon: '🐱', description: 'Slowly transition and hold each position' },
        { name: 'Lying Knee-to-Chest', duration: 30, icon: '🦵', description: 'Pull knees to chest while lying down' },
        { name: 'Seated Spinal Twist', duration: 30, icon: '🔄', description: 'Sit and rotate torso, hold each side' },
      ],
      'Shoulders': [
        { name: 'Cross-body Shoulder Stretch', duration: 30, icon: '↔️', description: 'Pull arm across body, hold' },
        { name: 'Behind-back Shoulder Stretch', duration: 30, icon: '🔙', description: 'Reach behind back, clasp hands' },
        { name: 'Neck Rolls', duration: 30, icon: '🔄', description: 'Slowly roll head in circles' },
      ],
      'Arms': [
        { name: 'Tricep Stretch', duration: 30, icon: '💪', description: 'Reach behind head, hold elbow' },
        { name: 'Bicep Wall Stretch', duration: 30, icon: '🧱', description: 'Place palm on wall, rotate away' },
        { name: 'Wrist Flexor Stretch', duration: 20, icon: '🤚', description: 'Extend arm, pull fingers back' },
        { name: 'Wrist Extensor Stretch', duration: 20, icon: '✋', description: 'Extend arm, pull fingers down' },
      ],
      'Core': [
        { name: 'Cobra Stretch', duration: 30, icon: '🐍', description: 'Lie face down, push up with arms' },
        { name: 'Lying Spinal Twist', duration: 30, icon: '🔄', description: 'Lie down, drop knees to each side' },
        { name: 'Standing Side Stretch', duration: 30, icon: '↔️', description: 'Reach overhead, lean to each side' },
      ],
      'Legs': [
        { name: 'Standing Quad Stretch', duration: 30, icon: '🦵', description: 'Pull heel to glute, hold' },
        { name: 'Standing Hamstring Stretch', duration: 30, icon: '🦿', description: 'Prop foot up, lean forward' },
        { name: 'Calf Stretch', duration: 30, icon: '🏃', description: 'Step back, press heel down' },
        { name: 'Pigeon Pose', duration: 45, icon: '🐦', description: 'Hip flexor and glute stretch' },
        { name: 'Seated Forward Fold', duration: 45, icon: '🧘', description: 'Sit with legs extended, reach for toes' },
        { name: 'Butterfly Stretch', duration: 30, icon: '🦋', description: 'Sit with feet together, press knees down' },
      ],
    }
  };

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [routine, setRoutine] = useState<any[]>([]);

  // SMART GENERATION: Build routine based on target muscles with upper/lower body logic
  useEffect(() => {
    const exercises = stretchExercises[mode];
    const generatedRoutine: any[] = [];
    
    // Determine workout type (upper, lower, full body) from target muscles
    const upperMuscles = ['Chest', 'Back', 'Shoulders', 'Arms'];
    const lowerMuscles = ['Legs'];
    const coreMuscles = ['Core'];
    
    const hasUpper = targetMuscles.some(m => upperMuscles.includes(m));
    const hasLower = targetMuscles.some(m => lowerMuscles.includes(m));
    const hasCore = targetMuscles.some(m => coreMuscles.includes(m));
    
    // Always add general exercises first
    generatedRoutine.push(...exercises.general.slice(0, 2));
    
    // SMART LOGIC: Generate based on workout type
    if (targetMuscles.length === 0) {
      // Full body default: 2 upper + 2 lower
      if (exercises['Chest']) generatedRoutine.push(exercises['Chest'][0]);
      if (exercises['Back']) generatedRoutine.push(exercises['Back'][0]);
      if (exercises['Legs']) generatedRoutine.push(...(exercises['Legs'] as any[]).slice(0, 2));
    } else if (hasUpper && hasLower) {
      // Full body: 2 upper + 2 lower
      const upperExercises: any[] = [];
      const lowerExercises: any[] = [];
      
      targetMuscles.forEach(muscle => {
        const muscleExercises = exercises[muscle as keyof typeof exercises];
        if (Array.isArray(muscleExercises)) {
          if (upperMuscles.includes(muscle)) {
            upperExercises.push(...muscleExercises.slice(0, 1));
          } else if (lowerMuscles.includes(muscle)) {
            lowerExercises.push(...muscleExercises.slice(0, 2));
          }
        }
      });
      
      generatedRoutine.push(...upperExercises.slice(0, 2), ...lowerExercises.slice(0, 2));
    } else if (hasUpper) {
      // Upper body focus
      targetMuscles.forEach(muscle => {
        if (upperMuscles.includes(muscle)) {
          const muscleExercises = exercises[muscle as keyof typeof exercises];
          if (Array.isArray(muscleExercises)) {
            generatedRoutine.push(...muscleExercises.slice(0, 2));
          }
        }
      });
    } else if (hasLower) {
      // Lower body focus
      const legExercises = exercises['Legs'];
      if (Array.isArray(legExercises)) {
        generatedRoutine.push(...legExercises.slice(0, 3));
      }
    }
    
    // Add core if targeted or for full body
    if (hasCore || (hasUpper && hasLower)) {
      const coreExercises = exercises['Core'];
      if (Array.isArray(coreExercises)) {
        generatedRoutine.push(coreExercises[0]);
      }
    }
    
    setRoutine(generatedRoutine);
    if (generatedRoutine.length > 0) {
      setTimeLeft(generatedRoutine[0].duration);
    }
  }, [mode, targetMuscles]);

  // Toggle item completion in checklist mode
  const toggleItem = (itemName: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  // Check if all items are completed
  const allCompleted = routine.length > 0 && completedItems.size >= routine.length;

  // Timer logic for guided mode
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning && !isComplete && routine.length > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next exercise
            if (currentExerciseIndex < routine.length - 1) {
              const nextIndex = currentExerciseIndex + 1;
              setCurrentExerciseIndex(nextIndex);
              playNotification();
              return routine[nextIndex].duration;
            } else {
              // Routine complete
              setIsComplete(true);
              setIsRunning(false);
              playComplete();
              return 0;
            }
          }
          
          // Countdown beep at 3
          if (prev === 4) {
            playBeep();
          }
          
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, isComplete, currentExerciseIndex, routine]);

  const playBeep = () => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 660;
      gain.gain.value = 0.2;
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
  };

  const playNotification = () => {
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch(e) {}
  };

  const playComplete = () => {
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 400]);
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1320;
      gain.gain.value = 0.4;
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch(e) {}
  };

  const startRoutine = () => {
    setIsRunning(true);
    playNotification();
  };

  const skipExercise = () => {
    if (currentExerciseIndex < routine.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setTimeLeft(routine[nextIndex].duration);
    } else {
      setIsComplete(true);
      setIsRunning(false);
    }
  };

  const resetRoutine = () => {
    setCurrentExerciseIndex(0);
    setTimeLeft(routine[0]?.duration || 0);
    setIsRunning(false);
    setIsComplete(false);
  };

  const currentExercise = routine[currentExerciseIndex];
  const totalDuration = routine.reduce((sum, ex) => sum + ex.duration, 0);
  const completedDuration = routine.slice(0, currentExerciseIndex).reduce((sum, ex) => sum + ex.duration, 0) + (currentExercise ? currentExercise.duration - timeLeft : 0);
  const overallProgress = totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0;

  const isWarmup = mode === 'warmup';
  const gradientClass = isWarmup ? 'from-orange-500 to-red-500' : 'from-blue-500 to-indigo-500';
  const checklistProgress = routine.length > 0 ? (completedItems.size / routine.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradientClass} px-4 py-4 pt-12`}>
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="p-2 -ml-2 text-white/80 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{isWarmup ? '🔥' : '❄️'}</span>
            {isWarmup ? 'Warm-up' : 'Cool-down'} Routine
          </h1>
          <div className="w-10" />
        </div>
        
        {/* Mode Toggle */}
        <div className="mt-3 flex justify-center">
          <div className="inline-flex bg-white/20 rounded-full p-0.5">
            <button
              onClick={() => setViewMode('checklist')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                viewMode === 'checklist' ? 'bg-white text-gray-900' : 'text-white/80'
              }`}
            >
              ✓ Checklist
            </button>
            <button
              onClick={() => setViewMode('guided')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                viewMode === 'guided' ? 'bg-white text-gray-900' : 'text-white/80'
              }`}
            >
              ⏱️ Guided
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-white/80 text-xs mb-1">
            {viewMode === 'checklist' ? (
              <>
                <span>{completedItems.size} of {routine.length} complete</span>
                <span>{Math.floor(checklistProgress)}%</span>
              </>
            ) : (
              <>
                <span>Exercise {currentExerciseIndex + 1} of {routine.length}</span>
                <span>{Math.floor(overallProgress)}% complete</span>
              </>
            )}
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${viewMode === 'checklist' ? checklistProgress : overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* CHECKLIST MODE */}
        {viewMode === 'checklist' && !allCompleted && (
          <div className="space-y-3">
            <p className="text-gray-400 text-center text-sm mb-4">
              Tap each exercise as you complete it
            </p>
            {routine.map((exercise, idx) => {
              const isChecked = completedItems.has(exercise.name);
              return (
                <button
                  key={idx}
                  onClick={() => toggleItem(exercise.name)}
                  className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
                    isChecked 
                      ? 'bg-green-500/20 border-2 border-green-500' 
                      : 'bg-gray-800/70 border-2 border-gray-700'
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                    isChecked 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-500'
                  }`}>
                    {isChecked && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Exercise Info */}
                  <span className="text-2xl">{exercise.icon}</span>
                  <div className="flex-1 text-left">
                    <div className={`font-semibold ${isChecked ? 'text-green-400 line-through' : 'text-white'}`}>
                      {exercise.name}
                    </div>
                    <div className="text-gray-500 text-sm">{exercise.duration}s • {exercise.description}</div>
                  </div>
                </button>
              );
            })}
            {/* Bottom spacer */}
            <div className="h-32" />
          </div>
        )}

        {/* CHECKLIST COMPLETE */}
        {viewMode === 'checklist' && allCompleted && (
          <div className="min-h-full flex flex-col items-center justify-center text-center">
            <div className="text-8xl mb-4">{isWarmup ? '💪' : '😌'}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isWarmup ? 'All Warmed Up!' : 'Great Recovery!'}
            </h2>
            <p className="text-gray-400 text-lg mb-2">
              {routine.length} exercises completed
            </p>
            <p className="text-gray-500 text-sm">
              {isWarmup ? 'Your muscles are ready for action!' : 'Your body will thank you tomorrow!'}
            </p>
          </div>
        )}

        {/* GUIDED MODE */}
        {viewMode === 'guided' && (
          <div className="min-h-full flex flex-col items-center justify-center">
          {isComplete ? (
            /* Completion Screen */
            <div className="text-center">
              <div className="text-8xl mb-4">{isWarmup ? '💪' : '😌'}</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {isWarmup ? 'Ready to Train!' : 'Great Recovery!'}
              </h2>
              <p className="text-gray-400 text-lg mb-2">
                {routine.length} stretches • {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')} total
              </p>
              <p className="text-gray-500 text-sm">
                {isWarmup ? 'Your muscles are warm and ready!' : 'Your muscles will thank you tomorrow!'}
              </p>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={resetRoutine}
                  className="px-6 py-4 bg-gray-800 rounded-2xl text-white font-bold shadow-xl"
                >
                  🔄 Repeat
                </button>
                <button
                  onClick={onClose}
                  className={`px-8 py-4 bg-gradient-to-r ${gradientClass} rounded-2xl text-white font-bold shadow-xl`}
                >
                  ✓ Done
                </button>
              </div>
            </div>
          ) : currentExercise ? (
            /* Current Exercise Display */
            <>
              <div className="text-center mb-8">
                <span className="text-7xl mb-4 block">{currentExercise.icon}</span>
                <h2 className="text-2xl font-bold text-white mb-2">{currentExercise.name}</h2>
                <p className="text-gray-400">{currentExercise.description}</p>
              </div>

              {/* Timer Display */}
              <div className="relative mb-8">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96" cy="96" r="88"
                    stroke="currentColor" strokeWidth="8" fill="none"
                    className="text-gray-800"
                  />
                  <circle
                    cx="96" cy="96" r="88"
                    stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"
                    className={isWarmup ? 'text-orange-500' : 'text-blue-500'}
                    style={{
                      strokeDasharray: 2 * Math.PI * 88,
                      strokeDashoffset: 2 * Math.PI * 88 * (1 - timeLeft / currentExercise.duration),
                      transition: 'stroke-dashoffset 0.5s linear'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white tabular-nums">{timeLeft}</span>
                  <span className="text-gray-400 text-sm">seconds</span>
                </div>
              </div>

              {/* Up Next */}
              {currentExerciseIndex < routine.length - 1 && (
                <div className="bg-gray-800/50 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-gray-500 text-xs">NEXT:</span>
                  <span className="text-xl">{routine[currentExerciseIndex + 1].icon}</span>
                  <span className="text-white font-medium">{routine[currentExerciseIndex + 1].name}</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400">Loading routine...</div>
          )}
          </div>
        )}
        {/* Bottom spacer for scrolling */}
        <div className="h-24" />
      </div>

      {/* Control Buttons */}
      <div className="p-6 pb-24 bg-gradient-to-t from-black via-black to-transparent">
        {/* CHECKLIST MODE BUTTONS */}
        {viewMode === 'checklist' && (
          allCompleted ? (
            <button
              onClick={onClose}
              className={`w-full py-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white font-bold text-xl shadow-xl flex items-center justify-center gap-3`}
            >
              <span className="text-2xl">🏋️</span>
              {isWarmup ? 'READY TO LIFT!' : 'FINISH WORKOUT'}
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Complete all {routine.length} exercises to continue
              </p>
            </div>
          )
        )}

        {/* GUIDED MODE BUTTONS */}
        {viewMode === 'guided' && !isComplete && currentExercise && (
          !isRunning ? (
            <button
              onClick={startRoutine}
              className={`w-full py-5 bg-gradient-to-r ${gradientClass} rounded-2xl text-white font-bold text-xl shadow-xl flex items-center justify-center gap-3`}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              START {isWarmup ? 'WARM-UP' : 'COOL-DOWN'}
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={skipExercise}
                className="flex-1 py-5 bg-gray-700 rounded-2xl text-white font-bold text-xl shadow-xl flex items-center justify-center gap-2"
              >
                ⏭️ Skip
              </button>
              <button
                onClick={resetRoutine}
                className="py-5 px-6 bg-gray-800 rounded-2xl text-white font-bold text-xl shadow-xl"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Workout Statistics Dashboard Component
const WorkoutStatsDashboard = ({ 
  onClose,
  userData 
}: { 
  onClose: () => void;
  userData: any;
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [topExercises, setTopExercises] = useState<any[]>([]);
  const [volumeByDay, setVolumeByDay] = useState<any[]>([]);
  useEscapeKey(onClose);
  
  // Swipe handler for back navigation
  const swipeHandlers = useSwipe(onClose);
  
  // Helper function to categorize exercises into muscle groups
  const countMuscleGroup = (exerciseName: string, muscleGroups: Record<string, number>) => {
    const exerciseLower = exerciseName.toLowerCase();
    
    // First, try to find the exercise in MUSCLE_GROUPS for accurate categorization
    for (const group of MUSCLE_GROUPS) {
      const allExercises = [...group.exercises.gym, ...group.exercises.home];
      if (allExercises.some(ex => ex.toLowerCase() === exerciseLower || exerciseLower.includes(ex.toLowerCase()))) {
        muscleGroups[group.name] = (muscleGroups[group.name] || 0) + 1;
        return;
      }
    }
    
    // Fallback to keyword matching
    if (exerciseLower.includes('chest') || exerciseLower.includes('bench') || exerciseLower.includes('push up') || exerciseLower.includes('push-up') || exerciseLower.includes('fly') || exerciseLower.includes('pec')) {
      muscleGroups['Chest'] = (muscleGroups['Chest'] || 0) + 1;
    } else if (exerciseLower.includes('back') || exerciseLower.includes('row') || exerciseLower.includes('pull') || exerciseLower.includes('lat') || exerciseLower.includes('deadlift')) {
      muscleGroups['Back'] = (muscleGroups['Back'] || 0) + 1;
    } else if (exerciseLower.includes('leg') || exerciseLower.includes('squat') || exerciseLower.includes('lunge') || exerciseLower.includes('quad') || exerciseLower.includes('hamstring') || exerciseLower.includes('calf') || exerciseLower.includes('glute')) {
      muscleGroups['Legs'] = (muscleGroups['Legs'] || 0) + 1;
    } else if (exerciseLower.includes('shoulder') || exerciseLower.includes('delt') || exerciseLower.includes('overhead') || exerciseLower.includes('lateral raise') || exerciseLower.includes('arnold')) {
      muscleGroups['Shoulders'] = (muscleGroups['Shoulders'] || 0) + 1;
    } else if (exerciseLower.includes('arm') || exerciseLower.includes('bicep') || exerciseLower.includes('tricep') || exerciseLower.includes('curl') || exerciseLower.includes('extension')) {
      muscleGroups['Arms'] = (muscleGroups['Arms'] || 0) + 1;
    } else if (exerciseLower.includes('ab') || exerciseLower.includes('core') || exerciseLower.includes('plank') || exerciseLower.includes('crunch') || exerciseLower.includes('sit-up')) {
      muscleGroups['Core'] = (muscleGroups['Core'] || 0) + 1;
    } else {
      muscleGroups['Other'] = (muscleGroups['Other'] || 0) + 1;
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const days = timeRange === 'week' ? 7 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startTimestamp = startDate.getTime();

        // Query using timestamp (our new data structure)
        const workoutsQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid),
          where('timestamp', '>=', startTimestamp),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(workoutsQuery);
        
        let totalVolume = 0;
        let totalWorkouts = 0;
        let totalSets = 0;
        const muscleGroups: Record<string, number> = {};
        const exerciseNames = new Set<string>();
        const workoutDates = new Set<string>();
        const exerciseVolumes: Record<string, number> = {};
        const volumesByDate: Record<string, number> = {};
        
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          
          // Use date field (format: YYYY-MM-DD)
          const workoutDate = data.date || new Date(data.timestamp).toISOString().split('T')[0];
          workoutDates.add(workoutDate);
          
          // Handle both data structures:
          // 1. New structure with exercises array (from finishWorkout)
          // 2. Individual exercise documents (from logging each exercise separately)
          
          if (data.exercises && Array.isArray(data.exercises)) {
            // New structure with exercises array
            totalWorkouts++;
            data.exercises.forEach((exercise: any) => {
              const exerciseName = exercise.exercise || exercise.name || 'Unknown';
              exerciseNames.add(exerciseName);
              
              // Calculate volume from sets
              if (exercise.sets && Array.isArray(exercise.sets)) {
                exercise.sets.forEach((set: any) => {
                  const setVolume = (set.weight || 0) * (set.reps || 0);
                  totalVolume += setVolume;
                  exerciseVolumes[exerciseName] = (exerciseVolumes[exerciseName] || 0) + setVolume;
                  volumesByDate[workoutDate] = (volumesByDate[workoutDate] || 0) + setVolume;
                  totalSets++;
                });
              }
              
              // Count muscle groups
              countMuscleGroup(exerciseName, muscleGroups);
            });
          } else if (data.exercise && data.sets) {
            // Individual exercise document structure
            const exerciseName = data.exercise || 'Unknown';
            exerciseNames.add(exerciseName);
            
            // Calculate volume from sets
            if (Array.isArray(data.sets)) {
              data.sets.forEach((set: any) => {
                const setVolume = (set.weight || 0) * (set.reps || 0);
                totalVolume += setVolume;
                exerciseVolumes[exerciseName] = (exerciseVolumes[exerciseName] || 0) + setVolume;
                volumesByDate[workoutDate] = (volumesByDate[workoutDate] || 0) + setVolume;
                totalSets++;
              });
            }
            
            // Count muscle groups
            countMuscleGroup(exerciseName, muscleGroups);
          }
        });
        
        // Count unique workout dates as total workouts (more accurate)
        totalWorkouts = workoutDates.size;

        // Calculate streak
        let streak = 0;
        const sortedDates = Array.from(workoutDates).sort().reverse();
        const today = new Date().toISOString().split('T')[0];
        if (sortedDates[0] === today || sortedDates[0] === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
          streak = 1;
          for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);
            const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              streak++;
            } else {
              break;
            }
          }
        }

        // Get top exercises by volume
        const sortedExercises = Object.entries(exerciseVolumes)
          .sort(([, a]: any, [, b]: any) => b - a)
          .slice(0, 5)
          .map(([name, volume]) => ({ name, volume }));
        
        setTopExercises(sortedExercises);

        // Prepare volume by day for chart
        const volumeData = Object.entries(volumesByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, volume]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            volume
          }));
        
        setVolumeByDay(volumeData);

        setStats({
          totalVolume,
          totalWorkouts,
          totalSets,
          uniqueExercises: exerciseNames.size,
          muscleGroups,
          streak,
          avgWorkoutLength: totalWorkouts > 0 ? Math.round(totalSets / totalWorkouts) : 0,
          avgExercisesPerWorkout: totalWorkouts > 0 ? Math.round(exerciseNames.size / totalWorkouts) : 0
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        swipeableToast.error('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [timeRange]);

  const useMetric = userData?.measurementUnit !== 'imperial';
  const weightUnit = useMetric ? 'kg' : 'lbs';

  const maxVolume = Math.max(...volumeByDay.map(d => d.volume as number), 1);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 z-[70] overflow-y-auto" {...swipeHandlers}>
      <div style={{ paddingTop: 'var(--safe-area-top)', paddingBottom: 'var(--safe-area-bottom)' }} className="min-h-screen pb-24">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 backdrop-blur-md px-4 py-4 shadow-lg">
          <button onClick={onClose} className="flex items-center text-white mb-2">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-white">📊 Workout Statistics</h1>
          <p className="text-white/80 text-sm">Your training analytics</p>
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* Time Range Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`flex-1 py-3 rounded-xl font-semibold transition shadow-lg ${
                timeRange === 'week'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`flex-1 py-3 rounded-xl font-semibold transition shadow-lg ${
                timeRange === 'month'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              This Month
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading statistics...</p>
            </div>
          ) : stats ? (
            <>
              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-4 text-white shadow-xl">
                  <div className="text-3xl mb-1">🔥</div>
                  <p className="text-3xl font-bold">{stats.streak}</p>
                  <p className="text-white/90 text-sm">Day Streak</p>
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl p-4 text-white shadow-xl">
                  <div className="text-3xl mb-1">🏋️</div>
                  <p className="text-3xl font-bold">{stats.totalWorkouts}</p>
                  <p className="text-white/90 text-sm">Workouts</p>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl p-4 text-white shadow-xl">
                  <div className="text-3xl mb-1">💪</div>
                  <p className="text-3xl font-bold">{stats.totalVolume.toLocaleString()}</p>
                  <p className="text-white/90 text-sm">Volume ({weightUnit})</p>
                </div>
                <div className="bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl p-4 text-white shadow-xl">
                  <div className="text-3xl mb-1">📝</div>
                  <p className="text-3xl font-bold">{stats.uniqueExercises}</p>
                  <p className="text-white/90 text-sm">Exercises</p>
                </div>
              </div>

              {/* Volume Over Time Chart */}
              {volumeByDay.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-200 dark:border-indigo-500/30">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    <span>Volume Over Time</span>
                  </h3>
                  <div className="space-y-3">
                    {volumeByDay.map((day, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{day.date}</span>
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{day.volume.toLocaleString()} {weightUnit}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-indigo-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(day.volume / maxVolume) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Exercises by Volume */}
              {topExercises.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-200 dark:border-indigo-500/30">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>Top Exercises</span>
                  </h3>
                  <div className="space-y-3">
                    {topExercises.map((exercise, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                          idx === 1 ? 'bg-gray-300 text-gray-700' :
                          idx === 2 ? 'bg-orange-300 text-orange-900' :
                          'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{exercise.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{exercise.volume.toLocaleString()} {weightUnit} total</p>
                        </div>
                        {idx === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Muscle Group Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-200 dark:border-indigo-500/30">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-500" />
                  <span>Muscle Groups Trained</span>
                </h3>
                {Object.keys(stats.muscleGroups).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(stats.muscleGroups)
                      .sort(([, a]: any, [, b]: any) => b - a)
                      .map(([muscle, count]: any) => (
                        <div key={muscle}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{muscle}</span>
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{count} workouts</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-teal-400 to-emerald-500 h-2 rounded-full"
                              style={{ width: `${(count / stats.totalWorkouts) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center py-4">No muscle groups tracked yet</p>
                )}
              </div>

              {/* Additional Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-200 dark:border-indigo-500/30">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Additional Metrics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Sets</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalSets}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Sets/Workout</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.avgWorkoutLength}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Dumbbell className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No workout data available</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Start logging workouts to see your stats!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Rest Timer Component for workouts
const RestTimer = ({ 
  duration, 
  onComplete, 
  onSkip,
  exerciseName 
}: { 
  duration: number; 
  onComplete: () => void;
  onSkip: () => void;
  exerciseName: string;
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  useEscapeKey(onSkip);

  // Timer countdown - runs once on mount
  useEffect(() => {
    if (isCompleted || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          
          // Play completion sound
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTUIGmm98OScTRALUKfj8LZjHAU5kdfy0HssBS');
            audio.play().catch(() => {});
          } catch (e) {
            // Silently fail
          }
          
          // Vibrate if available
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
          
          // Call completion
          setTimeout(() => onComplete(), 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isCompleted, onComplete]); // NOT timeLeft!

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = Math.min(100, Math.max(0, ((duration - timeLeft) / duration) * 100));
  const isAlmostDone = timeLeft <= 10 && timeLeft > 0;

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rest-timer-title"
    >
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-indigo-500/50">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 id="rest-timer-title" className="text-2xl font-bold text-white mb-2">Rest Timer</h3>
          <p className="text-indigo-300 text-sm">{exerciseName}</p>
        </div>

        {/* Circular Progress */}
        <div className="relative flex items-center justify-center mb-8">
          <svg className="transform -rotate-90 w-64 h-64">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-indigo-800"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              className={isAlmostDone ? "text-green-400" : "text-teal-400"}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-6xl font-bold ${isAlmostDone ? 'text-green-400 animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-indigo-300 text-sm mt-2">
              {timeLeft > 0 ? 'seconds left' : 'Ready!'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition border border-white/20"
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button
            onClick={onSkip}
            className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl text-white font-bold transition shadow-lg"
          >
            Skip Rest ⏭️
          </button>
        </div>

        {/* Quick adjust buttons */}
        <div className="mt-4 flex gap-2 justify-center">
          <button
            onClick={() => setTimeLeft(Math.max(0, timeLeft - 15))}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition border border-white/20"
          >
            -15s
          </button>
          <button
            onClick={() => setTimeLeft(timeLeft + 15)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition border border-white/20"
          >
            +15s
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// REST TIMER OVERLAY - Full Screen Modal for Focus Mode
// ==========================================
const RestTimerOverlay = ({ 
  duration, 
  onComplete, 
  onSkip,
  onExtend: _onExtend,
  nextExercise,
  timerKey // Unique key to force remount and reset timer
}: { 
  duration: number; 
  onComplete: () => void;
  onSkip: () => void;
  onExtend: (seconds: number) => void;
  nextExercise?: string;
  timerKey?: string | number;
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [totalDuration, setTotalDuration] = useState(duration); // Track total for progress
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  useEscapeKey(onSkip);

  // Reset timer when duration or key changes (for remounting)
  useEffect(() => {
    setTimeLeft(duration);
    setTotalDuration(duration);
    setIsCompleted(false);
  }, [duration, timerKey]);

  // Handle +30 seconds extension
  const handleExtendTime = useCallback(() => {
    setTimeLeft(prev => prev + 30);
    setTotalDuration(prev => prev + 30);
  }, []);

  // Timer countdown logic - runs once on mount and manages its own lifecycle
  useEffect(() => {
    // Don't start if already completed
    if (isCompleted) return;

    // Create interval that counts down every second
    const intervalId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer complete - clear interval and trigger completion
          clearInterval(intervalId);
          setIsCompleted(true);
          
          // Play completion sound
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTUIGmm98OScTRALUKfj8LZjHAU5kdfy0HssBS');
            audio.play().catch(() => {});
          } catch (e) {
            // Silently fail audio
          }
          
          // Vibrate if available
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
          
          // Call onComplete after brief delay
          setTimeout(() => {
            onComplete();
          }, 300);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Store ref for cleanup
    timerRef.current = intervalId;

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      timerRef.current = null;
    };
  }, [onComplete, isCompleted]); // Only re-run if these change, NOT timeLeft

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Use totalDuration for progress calculation so +30 extension works correctly
  const progress = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));
  const isAlmostDone = timeLeft <= 10 && timeLeft > 0;

  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center z-[70]"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Rest Timer"
    >
      {/* Animated Background Pulse */}
      <div className={`absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 ${isAlmostDone ? 'animate-pulse' : ''}`} />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8">
        {/* Rest Label */}
        <p className="text-indigo-300 text-xl font-medium mb-4">REST</p>
        
        {/* Big Countdown */}
        <div className={`text-9xl font-bold mb-8 transition-colors duration-300 ${isAlmostDone ? 'text-green-400 animate-pulse' : 'text-white'}`}>
          {formatTime(timeLeft)}
        </div>
        
        {/* Circular Progress Ring */}
        <div className="relative w-48 h-48 mb-8">
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/10"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
              strokeLinecap="round"
              className={isAlmostDone ? "text-green-400" : "text-indigo-400"}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/60 text-sm">
              {timeLeft > 0 ? 'seconds left' : 'Ready!'}
            </p>
          </div>
        </div>
        
        {/* Next Exercise Preview */}
        {nextExercise && (
          <div className="bg-white/10 rounded-2xl px-6 py-3 mb-8 border border-white/20">
            <p className="text-white/60 text-sm text-center">Up Next</p>
            <p className="text-white font-bold text-lg text-center">{nextExercise}</p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-4 w-full max-w-sm">
          <button
            onClick={handleExtendTime}
            className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-semibold transition border border-white/20"
          >
            +30 sec
          </button>
          <button
            onClick={onSkip}
            className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-2xl text-white font-bold transition shadow-2xl"
          >
            Skip Rest
          </button>
        </div>
      </div>
    </div>
  );
};

// PR Celebration Modal Component
const PRCelebrationModal = ({ 
  exercise, 
  newPR, 
  oldPR, 
  onClose 
}: { 
  exercise: string; 
  newPR: { weight: number; reps: number; estimatedMax: number };
  oldPR?: { weight: number; reps: number; estimatedMax: number };
  onClose: () => void;
}) => {
  useEscapeKey(onClose);

  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const improvement = oldPR 
    ? ((newPR.estimatedMax - oldPR.estimatedMax) / oldPR.estimatedMax * 100).toFixed(1)
    : null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[80] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pr-celebration-title"
    >
      <motion.div
        className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-yellow-300"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0.5 }}
      >
        {/* Trophy Animation */}
        <motion.div 
          className="flex justify-center mb-6"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 0.5, 
            repeat: 3,
            repeatDelay: 0.2
          }}
        >
          <div className="text-8xl">🏆</div>
        </motion.div>

        {/* Title */}
        <h2 id="pr-celebration-title" className="text-4xl font-bold text-center text-white mb-3 drop-shadow-lg">
          NEW PR!
        </h2>
        
        {/* Exercise Name */}
        <p className="text-center text-white/90 font-semibold text-xl mb-6">
          {exercise}
        </p>

        {/* PR Details */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 space-y-3">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-1">Your New Record</p>
            <p className="text-3xl font-bold text-white">
              {newPR.weight}kg × {newPR.reps}
            </p>
            <p className="text-white/70 text-sm mt-2">
              Est. 1RM: {newPR.estimatedMax.toFixed(1)}kg
            </p>
          </div>

          {oldPR && improvement && (
            <div className="pt-3 border-t border-white/30">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">📈</span>
                <div className="text-center">
                  <p className="text-white/80 text-sm">Improvement</p>
                  <p className="text-2xl font-bold text-white">+{improvement}%</p>
                </div>
              </div>
              <p className="text-center text-white/70 text-xs mt-2">
                Previous best: {oldPR.weight}kg × {oldPR.reps}
              </p>
            </div>
          )}
        </div>

        {/* Motivational Message */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
          <p className="text-center text-white font-medium text-sm">
            💪 Keep crushing it! You're getting stronger every day!
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-white hover:bg-white/90 rounded-xl text-amber-600 font-bold transition shadow-lg"
        >
          Continue Workout
        </button>
      </motion.div>
    </div>
  );
};

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
  
  // Swipe handler for back navigation
  const swipeHandlers = useSwipe(onBack);
  
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-400' };
    return { text: 'Obese', color: 'text-red-400' };
  };

  const bmiCategory = getBMICategory(parseFloat(bmi));

  return (
    <div className="p-6 space-y-6 pb-24" {...swipeHandlers}>
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
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [filterDays, setFilterDays] = useState<7 | 30 | 90>(30);
  
  // Swipe handler for back navigation
  const swipeHandlers = useSwipe(onBack);

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
        
        // Sort with proper date handling
        const workouts = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              // Ensure we have a valid timestamp
              timestamp: data.timestamp || new Date(data.timestampISO || data.date).getTime()
            };
          })
          .sort((a: any, b: any) => b.timestamp - a.timestamp);
        
        console.log(`Loaded ${workouts.length} total workouts`);
        setWorkoutHistory(workouts);
      } catch (error) {
        console.error('Error fetching workout history:', error);
        swipeableToast.error('Failed to load workout history');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutHistory();
  }, []);

  // Filter workouts based on selected time range
  const filteredHistory = workoutHistory.filter((workout: any) => {
    const daysAgo = Date.now() - (filterDays * 24 * 60 * 60 * 1000);
    return workout.timestamp >= daysAgo;
  });

  // Calculate stats (with null safety)
  const totalVolume = filteredHistory.reduce((sum, w) => {
    return sum + ((w.exercises || []).reduce((eSum: number, ex: any) => {
      return eSum + ((ex.sets || []).reduce((sSum: number, s: any) => sSum + ((s.weight || 0) * (s.reps || 0)), 0));
    }, 0));
  }, 0);

  const totalDuration = filteredHistory.reduce((sum, w) => sum + (w.duration_minutes || 0), 0);

  if (loading) {
    return (
      <div className="p-6 space-y-6 pb-24">
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
    <div className="p-6 space-y-6 pb-24" {...swipeHandlers}>
      <div className="flex items-center space-x-3 border-b border-indigo-300 dark:border-indigo-500/50 pb-3">
        <button onClick={onBack} className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Workout History</h2>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-2">
        {[
          { days: 7, label: '7 Days' },
          { days: 30, label: '30 Days' },
          { days: 90, label: '90 Days' }
        ].map(({ days, label }) => (
          <button
            key={days}
            onClick={() => setFilterDays(days as any)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition ${
              filterDays === days
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      {filteredHistory.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-indigo-400 to-purple-500 p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🏋️</span>
              <span className="text-white/80 text-xs">Workouts</span>
            </div>
            <p className="text-2xl font-bold text-white">{filteredHistory.length}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">⏱️</span>
              <span className="text-white/80 text-xs">Total Time</span>
            </div>
            <p className="text-2xl font-bold text-white">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</p>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">💪</span>
              <span className="text-white/80 text-xs">Total Volume</span>
            </div>
            <p className="text-2xl font-bold text-white">{(totalVolume / 1000).toFixed(1)}k lbs</p>
          </div>
          <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📊</span>
              <span className="text-white/80 text-xs">Avg/Workout</span>
            </div>
            <p className="text-2xl font-bold text-white">{filteredHistory.length > 0 ? Math.round(totalDuration / filteredHistory.length) : 0}m</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-8 rounded-xl text-center shadow-lg border-2 border-indigo-200 dark:border-indigo-500/30">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Workouts Yet</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {workoutHistory.length > 0 
                ? `No workouts in the last ${filterDays} days. Try a longer time range!`
                : 'Complete your first workout to see your progress here!'}
            </p>
            <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              <span>💪</span>
              <span>Head to the Workouts tab to get started</span>
            </div>
          </div>
        ) : (
          filteredHistory.map((workout) => {
            const isExpanded = expandedWorkout === workout.id;
            const workoutVolume = (workout.exercises || []).reduce((sum: number, ex: any) => {
              return sum + ((ex.sets || []).reduce((sSum: number, s: any) => sSum + ((s.weight || 0) * (s.reps || 0)), 0));
            }, 0);
            
            return (
              <div 
                key={workout.id} 
                className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300 shadow-md overflow-hidden ${
                  isExpanded 
                    ? 'border-indigo-400 dark:border-indigo-500' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500/50'
                }`}
              >
                {/* Workout Header - Always Visible */}
                <button 
                  onClick={() => setExpandedWorkout(isExpanded ? null : workout.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isExpanded 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        <Dumbbell className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 dark:text-white font-bold">{workout.date}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {typeof workout.timestamp === 'number' 
                            ? new Date(workout.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            : ''
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold">{workout.duration_minutes}m</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {workout.totalExercises} ex • {workout.totalSets} sets
                        </p>
                      </div>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Quick Stats Bar */}
                  <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-orange-500">🔥</span>
                      <span className="text-gray-600 dark:text-gray-400">~{Math.round(workout.duration_minutes * 5)} cal</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-blue-500">💪</span>
                      <span className="text-gray-600 dark:text-gray-400">{workoutVolume.toLocaleString()} lbs</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-600 dark:text-gray-400">{workout.totalSets} sets</span>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    {/* Workout Summary */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-3 rounded-xl">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{workout.duration_minutes}m</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Volume</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{(workoutVolume / 1000).toFixed(1)}k</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Est. Calories</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">~{Math.round(workout.duration_minutes * 5)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Exercise List */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span>📋</span> Exercises Performed
                      </h4>
                      {(workout.exercises || []).map((exercise: any, idx: number) => {
                        const exerciseVolume = (exercise.sets || []).reduce((sum: number, s: any) => sum + ((s.weight || 0) * (s.reps || 0)), 0);
                        const bestSet = (exercise.sets || []).reduce((best: any, s: any) => 
                          ((s.weight || 0) > (best?.weight || 0)) ? s : best, null);
                        
                        return (
                          <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">💪</span>
                                <p className="text-gray-900 dark:text-white font-semibold">{exercise.exercise}</p>
                              </div>
                              <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
                                {(exercise.sets || []).length} sets
                              </span>
                            </div>
                            
                            {/* Sets Grid */}
                            <div className="grid grid-cols-4 gap-1.5 mb-2">
                              {(exercise.sets || []).map((set: any, setIdx: number) => (
                                <div 
                                  key={setIdx} 
                                  className={`text-center py-1.5 px-2 rounded-lg text-xs ${
                                    set.weight === bestSet?.weight 
                                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-bold'
                                      : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white/80'
                                  }`}
                                >
                                  <span className="font-semibold">{set.weight}</span>
                                  <span className="text-gray-500 dark:text-gray-400">×</span>
                                  <span>{set.reps}</span>
                                </div>
                              ))}
                            </div>
                            
                            {/* Exercise Stats */}
                            <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                              <span>Volume: <span className="text-gray-700 dark:text-gray-300 font-medium">{exerciseVolume.toLocaleString()} lbs</span></span>
                              {bestSet && (
                                <span>Best: <span className="text-yellow-600 dark:text-yellow-400 font-medium">{bestSet.weight}×{bestSet.reps}</span></span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Manage Goals Screen
const ManageGoalsScreen = ({ userData, onBack }: { userData: any; onBack: () => void }) => {
  const [targetWeight, setTargetWeight] = useState(userData.targetWeight);
  const [isSaving, setIsSaving] = useState(false);
  
  // Swipe handler for back navigation
  const swipeHandlers = useSwipe(onBack);

  const handleSaveGoal = async () => {
    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          targetWeight: parseFloat(targetWeight)
        });
        swipeableToast.success('Goal updated successfully!');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      swipeableToast.error('Failed to update goal');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24" {...swipeHandlers}>
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
  
  // Swipe handler for back navigation
  const swipeHandlers = useSwipe(onBack);

  const handleSavePreferences = async (key: string, value: any) => {
    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          [`appPreferences.${key}`]: value
        });
        swipeableToast.success('Preference updated!');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      swipeableToast.error('Failed to update preference');
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
    <div className="p-6 space-y-6 pb-24" {...swipeHandlers}>
      <div className="flex items-center space-x-3 border-b border-indigo-300 dark:border-indigo-500/50 pb-3">
        <button onClick={onBack} className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">App Preferences</h2>
      </div>

      <div className="space-y-4">
        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg" style={{ height: 'auto' }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold">Notifications</h3>
              <p className="text-gray-600 dark:text-white/80 text-sm">Receive workout reminders</p>
            </div>
            <button
              onClick={handleToggleNotifications}
              disabled={isSaving}
              className={`w-12 h-6 rounded-md transition relative shadow-inner border-2 ${notifications ? 'bg-indigo-600 border-indigo-700' : 'bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-sm shadow-md transform transition absolute top-0.5 ${notifications ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Dark Mode */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg" style={{ height: 'auto' }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold">Dark Mode</h3>
              <p className="text-gray-600 dark:text-white/80 text-sm">Use dark theme</p>
            </div>
            <button
              onClick={handleToggleDarkMode}
              disabled={isSaving}
              className={`w-12 h-6 rounded-md transition relative shadow-inner border-2 ${darkMode ? 'bg-gray-700 border-gray-800' : 'bg-indigo-500 border-indigo-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-sm shadow-md transform transition absolute top-0.5 ${darkMode ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Units */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg" style={{ height: 'auto' }}>
          <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Measurement Units</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleChangeUnits('metric')}
              disabled={isSaving}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition shadow-md text-sm ${units === 'metric' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white/80'}`}
            >
              Metric (kg, cm)
            </button>
            <button
              onClick={() => handleChangeUnits('imperial')}
              disabled={isSaving}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition shadow-md text-sm ${units === 'imperial' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white/80'}`}
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
              <span className="text-gray-900 dark:text-white font-semibold">{APP_VERSION}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Build:</span>
              <span className="text-gray-900 dark:text-white font-semibold">{BUILD_DATE}</span>
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
const AccountScreen = ({ onLogout, userData: propUserData, onNavigateToSettings }: { 
  onLogout: () => void; 
  userData: any; 
  onNavigateToSettings: (screen: 'health' | 'history' | 'goals' | 'preferences') => void;
}) => {
    const userData = propUserData;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const units = userData?.appPreferences?.units || 'metric';

    const handleLogout = async () => {
      // Clear device session in Firestore first
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userDocRef, {
            activeDeviceId: null,
            lastActive: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error clearing device session:', error);
        }
      }
      
      try {
        await signOut(auth);
        swipeableToast.success('Logged out successfully');
      } catch (error) {
        console.error('Logout error:', error);
        swipeableToast.error('Logout failed');
      }
      
      // Clear all app-related localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('tempUserData');
      // Note: Keep deviceId for future logins on this device
      onLogout();
    };

    const handleDeleteAccount = async () => {
      setDeleteLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          swipeableToast.error('No user logged in');
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
        
        swipeableToast.success('Account deleted successfully');
        onLogout();
      } catch (error: any) {
        console.error('Delete account error:', error);
        if (error.code === 'auth/requires-recent-login') {
          swipeableToast.error('Please log out and log back in, then try deleting your account again for security reasons.');
        } else {
          swipeableToast.error('Failed to delete account. Please try again.');
        }
      } finally {
        setDeleteLoading(false);
        setShowDeleteConfirm(false);
      }
    };

    if (!userData) {
      return (
        <>
        <div className="p-6 space-y-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading your profile...</h2>
          </div>
        </div>
        </>
      );
    }

    const heightInches = (userData.heightFeet * 12) + userData.heightInches;
    const startingWeight = userData.startingWeight || userData.weight;
    const weightLost = Math.max(0, startingWeight - userData.weight);

    return (
        <>
            {/* Sticky Header with Safe Area */}
            <div style={{ paddingTop: 'var(--safe-area-top)' }} className="sticky top-0 z-40 w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-gray-900 backdrop-blur-md border-b border-indigo-200 dark:border-indigo-500/30 px-4 py-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Account</h2>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 dark:bg-indigo-600 hover:from-indigo-600 hover:to-purple-700 dark:hover:bg-indigo-700 rounded-lg text-white font-semibold transition duration-200 shadow-lg"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-8 pb-24">
            
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

            {/* Achievement Badges */}
            <AchievementBadges userId={auth.currentUser?.uid || ''} />

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
              className="w-full py-3 text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 transition duration-200 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
            >
                <Trash2 className="w-5 h-5" /> Delete Account
            </button>

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
              <DeleteAccountModal
                onClose={() => setShowDeleteConfirm(false)}
                onDelete={handleDeleteAccount}
                isLoading={deleteLoading}
              />
            )}

            {/* Edit Profile Modal */}
            {showEditModal && (
              <EditProfileModal 
                onClose={() => setShowEditModal(false)} 
                userData={userData}
              />
            )}
        </div>
        </>
    );
};

// Helper component for account settings list items
const SettingItem = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick?: () => void }) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-700/70 transition duration-200 cursor-pointer shadow-md border-2 border-gray-200 dark:border-transparent">
        <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-gray-900 dark:text-white font-medium">{label}</span>
        </div>
        <ArrowLeft className="w-4 h-4 text-gray-400 dark:text-white/70 transform rotate-180" />
    </div>
);

// Achievement Badges Component
const AchievementBadges = ({ userId }: { userId: string }) => {
  const [achievements, setAchievements] = useState<{ [key: string]: boolean }>({});
  const [showAll, setShowAll] = useState(false);

  // Define all possible achievements
  const allBadges = [
    { id: 'first_workout', icon: '🎯', name: 'First Steps', description: 'Complete your first workout', tier: 'bronze' },
    { id: 'workout_3', icon: '🔥', name: 'Getting Warmed Up', description: 'Complete 3 workouts', tier: 'bronze' },
    { id: 'workout_7', icon: '⚡', name: 'Week Warrior', description: 'Complete 7 workouts', tier: 'silver' },
    { id: 'workout_30', icon: '💪', name: 'Monthly Master', description: 'Complete 30 workouts', tier: 'gold' },
    { id: 'workout_100', icon: '🏆', name: 'Century Club', description: 'Complete 100 workouts', tier: 'platinum' },
    { id: 'streak_3', icon: '🔗', name: 'Chain Starter', description: '3-day workout streak', tier: 'bronze' },
    { id: 'streak_7', icon: '📅', name: 'Week Streak', description: '7-day workout streak', tier: 'silver' },
    { id: 'streak_30', icon: '🗓️', name: 'Monthly Streak', description: '30-day workout streak', tier: 'gold' },
    { id: 'volume_10k', icon: '🏋️', name: 'Heavy Lifter', description: 'Lift 10,000 lbs total', tier: 'bronze' },
    { id: 'volume_100k', icon: '💎', name: 'Iron Will', description: 'Lift 100,000 lbs total', tier: 'silver' },
    { id: 'volume_1m', icon: '👑', name: 'Legendary Lifter', description: 'Lift 1,000,000 lbs total', tier: 'platinum' },
    { id: 'early_bird', icon: '🌅', name: 'Early Bird', description: 'Complete a workout before 7 AM', tier: 'bronze' },
    { id: 'night_owl', icon: '🌙', name: 'Night Owl', description: 'Complete a workout after 9 PM', tier: 'bronze' },
    { id: 'all_muscles', icon: '🎖️', name: 'Full Body', description: 'Train all muscle groups in a week', tier: 'silver' },
    { id: 'pr_1', icon: '📈', name: 'New Heights', description: 'Set your first PR', tier: 'bronze' },
    { id: 'pr_10', icon: '🚀', name: 'PR Machine', description: 'Set 10 PRs', tier: 'silver' },
    { id: 'pr_50', icon: '⭐', name: 'Record Breaker', description: 'Set 50 PRs', tier: 'gold' },
  ];

  const tierColors: { [key: string]: string } = {
    bronze: 'from-amber-600 to-orange-700',
    silver: 'from-gray-300 to-gray-500',
    gold: 'from-yellow-400 to-amber-500',
    platinum: 'from-cyan-300 to-blue-400'
  };

  // Fetch and calculate achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!userId) return;

      try {
        // Fetch workout history
        const workoutQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', userId)
        );
        const workoutSnap = await getDocs(workoutQuery);
        const workouts = workoutSnap.docs.map(d => d.data());

        // Fetch PRs
        const prQuery = query(
          collection(db, 'personalRecords'),
          where('userId', '==', userId)
        );
        const prSnap = await getDocs(prQuery);
        const prCount = prSnap.docs.length;

        // Calculate achievements
        const earned: { [key: string]: boolean } = {};
        const workoutCount = workouts.length;
        
        // Workout count badges
        earned['first_workout'] = workoutCount >= 1;
        earned['workout_3'] = workoutCount >= 3;
        earned['workout_7'] = workoutCount >= 7;
        earned['workout_30'] = workoutCount >= 30;
        earned['workout_100'] = workoutCount >= 100;

        // Calculate total volume
        const totalVolume = workouts.reduce((sum, w) => {
          return sum + ((w.exercises || []).reduce((eSum: number, ex: any) => {
            return eSum + ((ex.sets || []).reduce((sSum: number, s: any) => sSum + ((s.weight || 0) * (s.reps || 0)), 0));
          }, 0));
        }, 0);

        earned['volume_10k'] = totalVolume >= 10000;
        earned['volume_100k'] = totalVolume >= 100000;
        earned['volume_1m'] = totalVolume >= 1000000;

        // PR badges
        earned['pr_1'] = prCount >= 1;
        earned['pr_10'] = prCount >= 10;
        earned['pr_50'] = prCount >= 50;

        // Time-based badges
        workouts.forEach((w: any) => {
          const hour = new Date(w.timestamp).getHours();
          if (hour < 7) earned['early_bird'] = true;
          if (hour >= 21) earned['night_owl'] = true;
        });

        // Calculate streaks (simplified)
        if (workoutCount >= 3) {
          const sortedDates = workouts
            .map((w: any) => new Date(w.timestamp).toDateString())
            .filter((v, i, a) => a.indexOf(v) === i) // unique dates
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          
          let maxStreak = 1;
          let currentStreak = 1;
          for (let i = 1; i < sortedDates.length; i++) {
            const diff = (new Date(sortedDates[i-1]).getTime() - new Date(sortedDates[i]).getTime()) / (1000 * 60 * 60 * 24);
            if (diff <= 1.5) {
              currentStreak++;
              maxStreak = Math.max(maxStreak, currentStreak);
            } else {
              currentStreak = 1;
            }
          }
          
          earned['streak_3'] = maxStreak >= 3;
          earned['streak_7'] = maxStreak >= 7;
          earned['streak_30'] = maxStreak >= 30;
        }

        // Check all muscles in a week
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const weekWorkouts = workouts.filter((w: any) => w.timestamp >= oneWeekAgo);
        const musclesTrained = new Set<string>();
        weekWorkouts.forEach((w: any) => {
          (w.exercises || []).forEach((ex: any) => {
            MUSCLE_GROUPS.forEach(mg => {
              if ([...mg.exercises.gym, ...mg.exercises.home].includes(ex.exercise)) {
                musclesTrained.add(mg.name);
              }
            });
          });
        });
        earned['all_muscles'] = musclesTrained.size >= 6;

        setAchievements(earned);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
  }, [userId]);

  const earnedBadges = allBadges.filter(b => achievements[b.id]);
  const displayBadges = showAll ? allBadges : earnedBadges.slice(0, 6);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🏅 Achievements
        </h3>
        <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
          {earnedBadges.length}/{allBadges.length}
        </span>
      </div>

      {earnedBadges.length === 0 ? (
        <div className="text-center py-4">
          <span className="text-4xl mb-2 block">🎯</span>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Complete workouts to unlock badges!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {displayBadges.map(badge => {
              const isEarned = achievements[badge.id];
              return (
                <div
                  key={badge.id}
                  className={`relative p-3 rounded-xl text-center transition ${
                    isEarned 
                      ? `bg-gradient-to-br ${tierColors[badge.tier]} shadow-lg` 
                      : 'bg-gray-100 dark:bg-gray-700/50 opacity-50'
                  }`}
                >
                  <span className={`text-2xl ${!isEarned && 'grayscale opacity-50'}`}>{badge.icon}</span>
                  <p className={`text-[10px] font-semibold mt-1 ${isEarned ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {badge.name}
                  </p>
                  {isEarned && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
          >
            {showAll ? 'Show Less' : `View All ${allBadges.length} Badges`}
          </button>
        </>
      )}
    </div>
  );
};

// Delete Account Confirmation Modal
const DeleteAccountModal = ({
  onClose,
  onDelete,
  isLoading
}: {
  onClose: () => void;
  onDelete: () => void;
  isLoading: boolean;
}) => {
  useEscapeKey(onClose, !isLoading);

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
      onClick={isLoading ? undefined : onClose}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
      aria-describedby="delete-account-desc"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-300 dark:border-red-500/30" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="delete-account-title" className="text-2xl font-bold text-red-600 dark:text-red-400">⚠️ Delete Account?</h3>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition disabled:opacity-50"
            aria-label="Close delete confirmation"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div id="delete-account-desc">
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
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete Forever'}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [location, setLocation] = useState<'gym' | 'home' | null>('gym');
  const [goal, setGoal] = useState<string | null>('loss'); // Default to 'loss' for free users to see sample meals
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [activeSettingsScreen, setActiveSettingsScreen] = useState<'health' | 'history' | 'goals' | 'preferences' | null>(null);
  
  // Ref for main scroll container
  const mainScrollRef = useRef<HTMLElement>(null);
  
  // Disable context menu on long press (mobile native feel)
  useEffect(() => {
    const preventContextMenu = (e: Event) => {
      // Allow context menu only on input and textarea elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      e.preventDefault();
    };
    
    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, []);
  
  // Scroll to top when tab changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeTab]);
  
  // Premium Subscription State
  const [isPremium, setIsPremium] = useState(false); // Changed from true - now requires actual subscription
  // @ts-ignore - premiumExpiry used for future subscription management features
  const [premiumExpiry, setPremiumExpiry] = useState<number | null>(null);
  
  // Active Workout Persistence Hook - manages localStorage sync and resume
  const {
    activeWorkout,
    showResumePrompt,
    pendingWorkout,
    resumeWorkout,
    discardPendingWorkout,
    addExerciseToWorkout: _addExerciseToPersistence,
    addSetToExercise: _addSetToPersistence,
    finishWorkout: _finishPersistentWorkout,
    startWorkout: _startPersistentWorkout,
    getElapsedTime: _getElapsedTime
  } = useActiveWorkout();
  
  // Exercise Logging State
  const [exerciseSubView, setExerciseSubView] = useState<'list' | 'details' | 'log'>('list');
  const [exerciseTab, setExerciseTab] = useState<'today' | 'programs' | 'library' | 'prs'>('today');
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<string | null>(null);
  const [guidedWorkoutMode, setGuidedWorkoutMode] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Array<{ exercise?: string; name?: string; sets: Array<{ reps: number; weight: number }> }>>([]);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [workoutSummary, setWorkoutSummary] = useState<{
    show: boolean;
    duration: number;
    exercises: any[];
    totalSets: number;
    totalVolume: number;
    newPRs: { exercise: string; weight: number; reps: number }[];
  } | null>(null);
  
  // Sync activeWorkout from hook to local state when resuming
  useEffect(() => {
    if (activeWorkout && activeWorkout.exercises.length > 0) {
      setCurrentWorkout(activeWorkout.exercises.map(e => ({
        exercise: e.exercise,
        sets: e.sets.map(s => ({ reps: s.reps, weight: s.weight }))
      })));
      setWorkoutStartTime(activeWorkout.startTime);
    }
  }, [activeWorkout]);
  
  // Helper function to get current day (1=Monday, 7=Sunday) based on timezone
  const getCurrentDayOfWeek = () => {
    const jsDay = new Date().getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    return ((jsDay + 6) % 7) + 1; // Convert to 1=Monday, 7=Sunday
  };
  
  // Meal Plan State - Lifted to persist across navigation
  const [currentDay, setCurrentDay] = useState(getCurrentDayOfWeek()); // Auto-detect current day
  const [currentWeek, setCurrentWeek] = useState(1); // 1-4 for weeks
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({});

  // Macro Tracking State
  const [loggedMeals, setLoggedMeals] = useState<Record<string, any[]>>({});
  const [showMacroSummary, setShowMacroSummary] = useState(true);

  // Meal Swapping State
  const [swappedMeals, setSwappedMeals] = useState<Record<string, any>>({});
  const [selectedMealForSwap, setSelectedMealForSwap] = useState<{week: number, day: number, mealType: string, meal: any} | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Ingredient Substitution State
  const [customizedMeals, setCustomizedMeals] = useState<Record<string, any>>({});
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [selectedMealForSub, setSelectedMealForSub] = useState<{week: number, day: number, mealType: string, meal: any} | null>(null);

  // Start workout timer when first exercise is added
  useEffect(() => {
    if (currentWorkout.length > 0 && workoutStartTime === null) {
      setWorkoutStartTime(Date.now());
    } else if (currentWorkout.length === 0) {
      setWorkoutStartTime(null);
    }
  }, [currentWorkout.length, workoutStartTime]);

  // Initialize meal plan - auto-detect current week and day from user's timezone
  useEffect(() => {
    const initializeMealPlan = async () => {
      if (!user?.uid) return;
      
      try {
        // Always set current day to today based on user's timezone
        const todayDay = getCurrentDayOfWeek();
        setCurrentDay(todayDay);
        
        // Calculate week based on current week of the year (rotating 1-4)
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const daysSinceYearStart = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        const weekOfYear = Math.floor(daysSinceYearStart / 7);
        const calculatedWeek = ((weekOfYear + 1) % 4) + 1; // Rotate weeks 1-4 with offset
        
        console.log('Meal Plan Auto-Detection:', {
          date: now.toLocaleDateString(),
          day: todayDay,
          weekOfYear,
          calculatedWeek
        });
        
        setCurrentWeek(calculatedWeek);
      } catch (error) {
        console.error('Error initializing meal plan:', error);
      }
    };

    initializeMealPlan();
  }, [user?.uid]);
  
  // Load logged meals from Firebase with smart date detection
  useEffect(() => {
    const loadLoggedMeals = async () => {
      if (!user?.uid) return;
      
      try {
        const today = new Date().toISOString().split('T')[0];
        const lastMealDate = localStorage.getItem('lastMealCheckDate');
        
        // Update last check date
        if (lastMealDate !== today) {
          console.log('New day detected for meals! Last check:', lastMealDate, 'Today:', today);
          localStorage.setItem('lastMealCheckDate', today);
        }
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.loggedMeals) {
            // Clean up old meal data (older than 90 days)
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            const cutoffDate = ninetyDaysAgo.toISOString().split('T')[0];
            
            const cleanedMeals: Record<string, any[]> = {};
            let needsCleanup = false;
            
            Object.keys(data.loggedMeals).forEach(date => {
              if (date >= cutoffDate) {
                cleanedMeals[date] = data.loggedMeals[date];
              } else {
                needsCleanup = true;
                console.log('Removing old meal data for date:', date);
              }
            });
            
            setLoggedMeals(cleanedMeals);
            
            // Update Firebase if cleanup occurred
            if (needsCleanup) {
              await updateDoc(userDocRef, { loggedMeals: cleanedMeals });
              console.log('Cleaned up old meal data from database');
            }
          }
        }
      } catch (error) {
        console.error('Error loading logged meals:', error);
      }
    };
    
    loadLoggedMeals();
  }, [user?.uid]);

  // Function to log a meal (prevents duplicate meal types per day)
  const logMeal = async (mealData: any, mealType: string) => {
    if (!user?.uid) return;
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const now = new Date();
    const logEntry = {
      ...mealData,
      mealType,
      loggedAt: now.getTime(),
      loggedAtISO: now.toISOString(),
      date: today,
      timeOfDay: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    try {
      // Update localStorage date tracker
      localStorage.setItem('lastMealCheckDate', today);
      
      const newLoggedMeals = { ...loggedMeals };
      if (!newLoggedMeals[today]) {
        newLoggedMeals[today] = [];
      }
      
      // Check if this meal type is already logged for today
      const existingIndex = newLoggedMeals[today].findIndex(
        (meal: any) => meal.mealType === mealType
      );
      
      if (existingIndex !== -1) {
        // Replace existing meal of the same type
        newLoggedMeals[today][existingIndex] = logEntry;
        swipeableToast.success(`${mealType} updated! 🍽️`);
      } else {
        // Add new meal
        newLoggedMeals[today].push(logEntry);
        swipeableToast.success(`${mealType} logged! 🍽️`);
      }
      
      setLoggedMeals(newLoggedMeals);
      
      // Save to Firebase
      await updateDoc(doc(db, 'users', user.uid), {
        loggedMeals: newLoggedMeals
      });
    } catch (error) {
      console.error('Error logging meal:', error);
      swipeableToast.error('Failed to log meal');
    }
  };

  // Function to remove a logged meal
  const removeLoggedMeal = async (date: string, index: number) => {
    if (!user?.uid) return;
    
    try {
      const newLoggedMeals = { ...loggedMeals };
      if (newLoggedMeals[date]) {
        newLoggedMeals[date].splice(index, 1);
        if (newLoggedMeals[date].length === 0) {
          delete newLoggedMeals[date];
        }
      }
      
      setLoggedMeals(newLoggedMeals);
      
      // Save to Firebase
      await updateDoc(doc(db, 'users', user.uid), {
        loggedMeals: newLoggedMeals
      });

      swipeableToast.success('Meal removed');
    } catch (error) {
      console.error('Error removing meal:', error);
      swipeableToast.error('Failed to remove meal');
    }
  };

  // Calculate daily totals for a specific date
  const calculateDailyTotals = (date: string) => {
    const meals = loggedMeals[date] || [];
    return meals.reduce((totals, meal) => ({
      calories: totals.calories + (meal.macros?.calories || 0),
      protein: totals.protein + (meal.macros?.protein || 0),
      carbs: totals.carbs + (meal.macros?.carbs || 0),
      fats: totals.fats + (meal.macros?.fats || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  // Load swapped meals and customizations from Firebase
  useEffect(() => {
    const loadMealCustomizations = async () => {
      if (!user?.uid) return;
      
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.swappedMeals) {
            setSwappedMeals(data.swappedMeals);
          }
          if (data.customizedMeals) {
            setCustomizedMeals(data.customizedMeals);
          }
        }
      } catch (error) {
        console.error('Error loading meal customizations:', error);
      }
    };
    
    loadMealCustomizations();
  }, [user?.uid]);

  // Function to swap meals between days/weeks
  const swapMeal = async (targetWeek: number, targetDay: number, targetMealType: string) => {
    if (!user?.uid || !selectedMealForSwap) return;
    
    try {
      const swapKey1 = `w${selectedMealForSwap.week}-d${selectedMealForSwap.day}-${selectedMealForSwap.mealType}`;
      const swapKey2 = `w${targetWeek}-d${targetDay}-${targetMealType}`;
      
      const newSwappedMeals = { ...swappedMeals };
      
      // Store the swap mapping
      newSwappedMeals[swapKey1] = { week: targetWeek, day: targetDay, mealType: targetMealType };
      newSwappedMeals[swapKey2] = { week: selectedMealForSwap.week, day: selectedMealForSwap.day, mealType: selectedMealForSwap.mealType };
      
      setSwappedMeals(newSwappedMeals);
      
      // Save to Firebase
      await updateDoc(doc(db, 'users', user.uid), {
        swappedMeals: newSwappedMeals
      });

      swipeableToast.success('Meals swapped successfully! 🔄');
      setShowSwapModal(false);
      setSelectedMealForSwap(null);
    } catch (error) {
      console.error('Error swapping meals:', error);
      swipeableToast.error('Failed to swap meals');
    }
  };

  // Function to reset a swap
  const resetSwap = async (week: number, day: number, mealType: string) => {
    if (!user?.uid) return;
    
    try {
      const swapKey = `w${week}-d${day}-${mealType}`;
      const newSwappedMeals = { ...swappedMeals };
      
      // Find and remove both sides of the swap
      const swappedTo = newSwappedMeals[swapKey];
      if (swappedTo) {
        const reverseKey = `w${swappedTo.week}-d${swappedTo.day}-${swappedTo.mealType}`;
        delete newSwappedMeals[reverseKey];
      }
      delete newSwappedMeals[swapKey];
      
      setSwappedMeals(newSwappedMeals);
      
      // Save to Firebase
      await updateDoc(doc(db, 'users', user.uid), {
        swappedMeals: newSwappedMeals
      });

      swipeableToast.success('Swap reset!');
    } catch (error) {
      console.error('Error resetting swap:', error);
      swipeableToast.error('Failed to reset swap');
    }
  };

  // Function to customize meal ingredients
  const customizeMeal = async (week: number, day: number, mealType: string, customizations: any) => {
    if (!user?.uid) return;
    
    try {
      const customKey = `w${week}-d${day}-${mealType}`;
      const newCustomizedMeals = { ...customizedMeals };
      
      newCustomizedMeals[customKey] = customizations;
      
      setCustomizedMeals(newCustomizedMeals);
      
      // Save to Firebase
      await updateDoc(doc(db, 'users', user.uid), {
        customizedMeals: newCustomizedMeals
      });

      swipeableToast.success('Meal customized! ✨');
      setShowSubstitutionModal(false);
      setSelectedMealForSub(null);
    } catch (error) {
      console.error('Error customizing meal:', error);
      swipeableToast.error('Failed to customize meal');
    }
  };

  // Function to reset customizations
  const resetCustomization = async (week: number, day: number, mealType: string) => {
    if (!user?.uid) return;
    
    try {
      const customKey = `w${week}-d${day}-${mealType}`;
      const newCustomizedMeals = { ...customizedMeals };
      
      delete newCustomizedMeals[customKey];
      
      setCustomizedMeals(newCustomizedMeals);
      
      // Save to Firebase
      await updateDoc(doc(db, 'users', user.uid), {
        customizedMeals: newCustomizedMeals
      });

      swipeableToast.success('Customization reset!');
    } catch (error) {
      console.error('Error resetting customization:', error);
      swipeableToast.error('Failed to reset customization');
    }
  };

  // Helper function to get the actual meal (considering swaps) - Reserved for future feature
  // @ts-ignore - kept for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getActualMeal = (week: number, day: number, mealType: string, originalMeal: any) => {
    const swapKey = `w${week}-d${day}-${mealType}`;
    const swapInfo = swappedMeals[swapKey];
    
    if (swapInfo) {
      // This meal has been swapped, return the swapped meal info
      return { ...originalMeal, isSwapped: true, swappedFrom: swapInfo };
    }
    
    return { ...originalMeal, isSwapped: false };
  };

  // Helper function to apply customizations to a meal - Reserved for future feature
  // @ts-ignore - kept for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const applyCustomizations = (week: number, day: number, mealType: string, meal: any) => {
    const customKey = `w${week}-d${day}-${mealType}`;
    const customizations = customizedMeals[customKey];
    
    if (!customizations) return meal;
    
    return {
      ...meal,
      ingredients: customizations.ingredients || meal.ingredients,
      portionSize: customizations.portionSize || 1.0,
      macros: {
        calories: Math.round(meal.macros.calories * (customizations.portionSize || 1.0)),
        protein: Math.round(meal.macros.protein * (customizations.portionSize || 1.0)),
        carbs: Math.round(meal.macros.carbs * (customizations.portionSize || 1.0)),
        fats: Math.round(meal.macros.fats * (customizations.portionSize || 1.0))
      },
      isCustomized: true
    };
  };
  
  // Save last viewed day/week to Firebase when changed
  useEffect(() => {
    const saveMealPlanPreferences = async () => {
      if (!user?.uid) return;
      
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          'mealPlanPreferences.lastViewedDay': currentDay,
          'mealPlanPreferences.lastViewedWeek': currentWeek
        });
      } catch (error) {
        console.error('Error saving meal plan preferences:', error);
      }
    };
    
    // Debounce save to avoid too many writes
    const timeoutId = setTimeout(saveMealPlanPreferences, 1000);
    return () => clearTimeout(timeoutId);
  }, [currentDay, currentWeek, user?.uid]);

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

  // Real-time premium subscription status listener
  useEffect(() => {
    if (!user?.uid) {
      setIsPremium(false);
      setPremiumExpiry(null);
      return;
    }

    // Real-time listener for premium status changes
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        // Debug logging
        console.log('🔍 Premium Status Check:', {
          hasPremiumField: !!data.premium,
          premiumData: data.premium,
          isActive: data.premium?.isActive,
          expiryDate: data.premium?.expiryDate,
          now: Date.now()
        });
        
        if (data.premium?.isActive) {
          const expiryDate = data.premium.expiryDate;
          const now = Date.now();
          
          console.log('✅ Premium is active, checking expiry:', {
            expiryDate,
            now,
            isValid: expiryDate && expiryDate > now
          });
          
          if (expiryDate && expiryDate > now) {
            setIsPremium(true);
            setPremiumExpiry(expiryDate);
            console.log('🎉 User is PREMIUM!');
          } else {
            setIsPremium(false);
            setPremiumExpiry(null);
            console.log('❌ Premium expired or no valid expiry date');
          }
        } else {
          setIsPremium(false);
          setPremiumExpiry(null);
          console.log('❌ Premium not active or field missing');
        }
      } else {
        setIsPremium(false);
        setPremiumExpiry(null);
        console.log('❌ User document does not exist');
      }
    }, (error) => {
      console.error('Error listening to premium status:', error);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  // Firebase auth state listener - automatically handles session persistence
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;
    let loadingTimeout: number | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      log('Auth state changed:', firebaseUser ? `User: ${firebaseUser.uid}, Verified: ${firebaseUser.emailVerified}` : 'No user');
      setUser(firebaseUser);
      setIsAuthenticated(!!firebaseUser);
      
      if (firebaseUser) {
        // Only fetch user data if email is verified
        // If not verified, they'll see the verification screen and won't need the data yet
        if (!firebaseUser.emailVerified) {
          log('User not verified, skipping data fetch');
          setLoading(false);
          if (loadingTimeout) clearTimeout(loadingTimeout);
          return;
        }
        
        log('User verified, fetching user data...');
        
        // PERFORMANCE: Try to use cached data first for instant load
        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
          try {
            const parsedCache = JSON.parse(cachedData);
            // Use cached data immediately for fast initial render
            setUserData(parsedCache);
            setLoading(false);
            log('Using cached user data for instant load');
          } catch (e) {
            // Invalid cache, will fetch fresh
          }
        }
        
        // Set a shorter timeout (3 seconds) since we have cache fallback
        loadingTimeout = setTimeout(() => {
          warn('Loading timeout - forcing loading to stop');
          setLoading(false);
          if (!cachedData) {
            swipeableToast.error('Slow connection. Some data may not be loaded.');
          }
        }, 3000);
        
        // Set up real-time listener for user data from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Generate or retrieve device ID for single-device login enforcement
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
          deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
          localStorage.setItem('deviceId', deviceId);
        }
        
        // Try to fetch user document
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            // User data exists
            const data = docSnap.data();
            console.log('Fetched existing user data:', data);
            
            // Check if user is logged in on a different device
            if (data.activeDeviceId && data.activeDeviceId !== deviceId) {
              console.warn('User was logged in on another device. Taking over session...');
              swipeableToast.info('Logging in... Previous session will be terminated.', '🔐');
            }
            
            // Always update active device ID to this device (claim the session)
            // This will trigger the onSnapshot listener on other devices to log them out
            await updateDoc(userDocRef, {
              activeDeviceId: deviceId,
              lastActive: new Date().toISOString()
            });
            
            setUserData(data);
            localStorage.setItem('userData', JSON.stringify(data));
            setLoading(false);
            if (loadingTimeout) clearTimeout(loadingTimeout);
          } else {
            // User data doesn't exist - this is first verified login
            log('User document does not exist - checking for temp data...');
            
            // Check if we have temporary profile data from signup
            const tempData = localStorage.getItem('tempUserData');
            if (tempData) {
              try {
                const profileData = JSON.parse(tempData);
                log('Found temp profile data, creating Firestore document...');
                
                // Create user document in Firestore with device session
                const userData = {
                  email: profileData.email,
                  name: profileData.name || 'User', // Use name from tempUserData or default
                  age: profileData.age || 25,
                  weight: profileData.weight || 70,
                  startingWeight: profileData.startingWeight || profileData.weight || 70,
                  heightFeet: profileData.heightFeet || 5,
                  heightInches: profileData.heightInches || 8,
                  targetWeight: profileData.targetWeight || 65,
                  createdAt: new Date().toISOString(),
                  activeDeviceId: deviceId,
                  lastActive: new Date().toISOString()
                };
                
                await setDoc(userDocRef, userData);
                log('User document created successfully on first verified login');
                
                // Clean up temp data
                localStorage.removeItem('tempUserData');
                
                // Set user data and cache it
                setUserData(userData);
                localStorage.setItem('userData', JSON.stringify(userData));
                swipeableToast.success('Welcome! Your profile has been created. 🎉');
                setLoading(false);
                if (loadingTimeout) clearTimeout(loadingTimeout);
              } catch (error) {
                console.error('Error creating user document from temp data:', error);
                swipeableToast.error('Failed to create profile. Please contact support.');
                setLoading(false);
                if (loadingTimeout) clearTimeout(loadingTimeout);
              }
            } else {
              warn('No temp data found - user needs to complete profile');
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
            log('Snapshot received user data:', data);
            
            // Check if device ID has changed (user logged in on another device)
            if (data.activeDeviceId && data.activeDeviceId !== deviceId) {
              warn('Device ID changed - user logged in on another device');
              swipeableToast.error('Your account was logged in on another device. Logging out...');
              signOut(auth);
              localStorage.removeItem('userData');
              localStorage.removeItem('tempUserData');
              setLoading(false);
              if (loadingTimeout) clearTimeout(loadingTimeout);
              return;
            }
            
            setUserData(data);
            localStorage.setItem('userData', JSON.stringify(data));
            setLoading(false);
            if (loadingTimeout) clearTimeout(loadingTimeout);
          } else {
            log('User document does not exist - showing profile completion screen');
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
        log('No user, clearing all data');
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
        if (showPlanModal) {
          setShowPlanModal(false);
          return;
        }

        // Priority 3: Handle Exercise Tab Navigation (hierarchical)
        if (activeTab === 'exercise') {
          // Priority 3a: Close workout summary if showing
          if (workoutSummary?.show) {
            setWorkoutSummary(null);
            return;
          }
          
          // Priority 3b: Exit guided workout mode (Focus Mode)
          if (guidedWorkoutMode) {
            // Show confirmation if workout in progress
            if (currentWorkout.length > 0 && currentWorkout.some(ex => ex.sets && ex.sets.length > 0)) {
              const confirmed = confirm('Quit workout? Your progress will be lost.');
              if (confirmed) {
                // Clear localStorage to match in-app quit behavior
                localStorage.removeItem('AURA_FOCUS_MODE');
                localStorage.removeItem('aura_active_workout');
                setGuidedWorkoutMode(false);
                setExerciseSubView('list');
                setCurrentWorkout([]);
                setWorkoutStartTime(null);
              }
            } else {
              // Clear localStorage even if no sets logged
              localStorage.removeItem('AURA_FOCUS_MODE');
              localStorage.removeItem('aura_active_workout');
              setGuidedWorkoutMode(false);
              setExerciseSubView('list');
              setCurrentWorkout([]);
              setWorkoutStartTime(null);
            }
            return;
          }
          
          // Priority 3c: Close exercise detail modal
          if (selectedExerciseForDetail) {
            setSelectedExerciseForDetail(null);
            return;
          }
          
          // Priority 3d: Exit single exercise logging
          if (exerciseSubView === 'log') {
            setExerciseSubView('list');
            return;
          }
          
          // Priority 3e: Navigate from sub-tabs back to Today (will handle program detail internally via handleBack)
          if (exerciseTab !== 'today') {
            setExerciseTab('today');
            return;
          }
          
          // Priority 3f: Clear location filter
          if (location) {
            setLocation(null);
            return;
          }
          
          // Priority 3g: Clear muscle filter
          if (selectedMuscle) {
            setSelectedMuscle(null);
            return;
          }
          
          // Priority 3g: Go to Home tab
          setActiveTab('home');
          return;
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
  }, [activeTab, selectedMuscle, location, goal, showPlanModal, activeSettingsScreen, exerciseSubView, guidedWorkoutMode, selectedExerciseForDetail, exerciseTab, currentWorkout]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('home');
  };

  // ==========================================
  // FINISH WORKOUT - COMPLETE TRANSACTION WORKFLOW
  // ==========================================
  // This function handles the entire workout completion process:
  // 1. Validate workout data
  // 2. Calculate metrics
  // 3. Save to Firebase
  // 4. Advance program (if applicable)
  // 5. Clear all state and localStorage
  // 6. Show summary UI
  // ==========================================
  const finishWorkout = async (passedWorkout?: Array<{ name?: string; exercise?: string; sets: Array<{ reps: number; weight: number }> }>) => {
    console.log('=== FINISH WORKOUT TRANSACTION STARTED ===');
    
    // ==========================================
    // STEP 1: STATE CHECK - Ensure workout data exists
    // ==========================================
    const workoutData = passedWorkout || currentWorkout;
    
    if (!workoutData || workoutData.length === 0) {
      console.error('Attempted to finish workout, but no workout data available.');
      swipeableToast.error('No workout to save');
      return;
    }
    
    // Filter out exercises with no sets
    const workoutToSave = workoutData.filter(ex => ex.sets && ex.sets.length > 0);
    
    if (workoutToSave.length === 0) {
      console.error('Attempted to finish workout, but no exercises have logged sets.');
      swipeableToast.error('No exercises with sets to save. Log at least one set!');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      console.error('Attempted to finish workout, but user is not authenticated.');
      swipeableToast.error('Not authenticated. Please log in and try again.');
      return;
    }

    try {
      // ==========================================
      // STEP 2: CALCULATE WORKOUT METRICS
      // ==========================================
      const endTime = Date.now();
      const startTime = workoutStartTime || endTime; // Fallback to endTime if no start time
      const durationMs = endTime - startTime;
      const durationMinutes = Math.max(1, Math.floor(durationMs / 60000)); // Minimum 1 minute

      // Calculate total volume and sets
      let totalVolume = 0;
      let totalSets = 0;
      let totalReps = 0;
      
      workoutToSave.forEach(ex => {
        ex.sets.forEach(set => {
          totalVolume += (set.weight || 0) * (set.reps || 0);
          totalSets++;
          totalReps += set.reps || 0;
        });
      });

      // Calculate estimated calories burned (rough estimate: 5-8 cal/min for strength training)
      const caloriesBurned = Math.round(durationMinutes * 6);

      console.log('Workout Metrics Calculated:', {
        exercises: workoutToSave.length,
        sets: totalSets,
        reps: totalReps,
        volume: totalVolume,
        duration: durationMinutes,
        calories: caloriesBurned
      });

      // ==========================================
      // STEP 3: CHECK FOR NEW PERSONAL RECORDS
      // ==========================================
      const newPRs: { exercise: string; weight: number; reps: number }[] = [];
      
      try {
        const prsQuery = query(
          collection(db, 'personalRecords'),
          where('userId', '==', user.uid)
        );
        const prsSnapshot = await getDocs(prsQuery);
        const existingPRs: Record<string, { weight: number; reps: number; docId: string }> = {};
        
        prsSnapshot.docs.forEach(docSnapshot => {
          const data = docSnapshot.data();
          existingPRs[data.exercise] = { 
            weight: data.weight, 
            reps: data.reps,
            docId: docSnapshot.id 
          };
        });

        // Check each exercise for new PRs and update if found
        for (const ex of workoutToSave) {
          if (!ex.sets || ex.sets.length === 0) continue;
          
          const bestSet = ex.sets.reduce((best, set) => {
            const current1RM = (set.weight || 0) * (1 + (set.reps || 0) / 30);
            const best1RM = (best.weight || 0) * (1 + (best.reps || 0) / 30);
            return current1RM > best1RM ? set : best;
          }, ex.sets[0]);

          const exerciseName = (ex as any).name || ex.exercise || 'Unknown Exercise';
          const existingPR = existingPRs[exerciseName];
          const new1RM = (bestSet.weight || 0) * (1 + (bestSet.reps || 0) / 30);
          const existing1RM = existingPR ? (existingPR.weight || 0) * (1 + (existingPR.reps || 0) / 30) : 0;

          if (new1RM > existing1RM && bestSet.weight > 0) {
            newPRs.push({ exercise: exerciseName, weight: bestSet.weight, reps: bestSet.reps });
            
            // Update or create PR in Firestore
            try {
              if (existingPR?.docId) {
                await updateDoc(doc(db, 'personalRecords', existingPR.docId), {
                  weight: bestSet.weight,
                  reps: bestSet.reps,
                  date: new Date().toISOString(),
                  estimated1RM: new1RM
                });
              } else {
                await addDoc(collection(db, 'personalRecords'), {
                  userId: user.uid,
                  exercise: exerciseName,
                  weight: bestSet.weight,
                  reps: bestSet.reps,
                  date: new Date().toISOString(),
                  estimated1RM: new1RM
                });
              }
            } catch (prError) {
              console.error('Error saving PR:', prError);
              // Continue even if PR save fails
            }
          }
        }
        
        if (newPRs.length > 0) {
          console.log('New PRs detected:', newPRs);
        }
      } catch (prError) {
        console.error('Error checking PRs:', prError);
        // Continue even if PR check fails
      }

      // ==========================================
      // STEP 4: SAVE WORKOUT TO FIREBASE (CORE ACTION)
      // ==========================================
      const workoutHistoryEntry = {
        userId: user.uid,
        timestamp: endTime,
        exercises: workoutToSave.map(ex => ({
          exercise: ex.exercise || (ex as any).name || 'Unknown Exercise',
          name: (ex as any).name || ex.exercise || 'Unknown Exercise',
          sets: ex.sets.map(s => ({ 
            reps: s.reps || 0, 
            weight: s.weight || 0 
          }))
        })),
        duration_ms: durationMs,
        duration_minutes: durationMinutes,
        date: new Date().toISOString().split('T')[0],
        dateFormatted: new Date().toLocaleDateString(),
        totalExercises: workoutToSave.length,
        totalSets: totalSets,
        totalReps: totalReps,
        totalVolume: totalVolume,
        caloriesBurned: caloriesBurned,
        completedAt: new Date().toISOString(),
        startedAt: workoutStartTime ? new Date(workoutStartTime).toISOString() : new Date().toISOString()
      };

      await addDoc(collection(db, 'workoutHistory'), workoutHistoryEntry);
      console.log('✅ Workout saved to Firebase successfully');

      // ==========================================
      // STEP 5: PROGRAM ADVANCEMENT (If on a program)
      // ==========================================
      if (userData?.activeProgram?.programId) {
        try {
          const program = WORKOUT_PROGRAMS.find(p => p.id === userData.activeProgram.programId);
          if (program) {
            const programCurrentDay = userData.activeProgram.currentDay || 1;
            const programCurrentWeek = userData.activeProgram.currentWeek || 1;
            
            let nextDay = programCurrentDay + 1;
            let nextWeek = programCurrentWeek;
            
            // Check if we've completed the week
            if (nextDay > program.daysPerWeek) {
              nextDay = 1;
              nextWeek = programCurrentWeek + 1;
            }
            
            // Calculate days completed
            const daysCompleted = ((programCurrentWeek - 1) * program.daysPerWeek) + programCurrentDay;
            
            // Update Firestore
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
              'activeProgram.currentDay': nextDay,
              'activeProgram.currentWeek': nextWeek,
              'activeProgram.daysCompleted': daysCompleted,
              'activeProgram.lastWorkoutDate': new Date().toISOString().split('T')[0]
            });
            
            // Update local userData state for immediate UI reflection
            setUserData((prev: any) => ({
              ...prev,
              activeProgram: {
                ...prev?.activeProgram,
                currentDay: nextDay,
                currentWeek: nextWeek,
                daysCompleted: daysCompleted,
                lastWorkoutDate: new Date().toISOString().split('T')[0]
              }
            }));
            
            console.log(`✅ Program advanced: Day ${programCurrentDay} → ${nextDay}, Week ${programCurrentWeek} → ${nextWeek}`);
          }
        } catch (progError) {
          console.error('Error advancing program:', progError);
          swipeableToast.error('Workout saved, but failed to update program progress.');
          // Don't fail the workout save if program advancement fails
        }
      }

      // ==========================================
      // STEP 6: CLEANUP - Clear ALL state and localStorage
      // ==========================================
      // Clear localStorage entries BEFORE clearing state
      localStorage.removeItem('AURA_FOCUS_MODE');
      localStorage.removeItem('AURA_WORKOUT_STORE');
      localStorage.removeItem('aura_active_workout');
      
      console.log('✅ localStorage cleared');

      // ==========================================
      // STEP 7: SHOW WORKOUT SUMMARY FIRST (UI Transition)
      // ==========================================
      // Show summary BEFORE clearing guided mode to prevent jarring transition
      setWorkoutSummary({
        show: true,
        duration: durationMinutes,
        exercises: [...workoutToSave],
        totalSets: totalSets,
        totalVolume: totalVolume,
        newPRs: newPRs
      });

      // ==========================================
      // STEP 8: RESET ALL WORKOUT STATE (batched for smooth transition)
      // ==========================================
      // Use setTimeout to allow summary modal to render first, then cleanup state
      setTimeout(() => {
        setCurrentWorkout([]);
        setWorkoutStartTime(null);
        setGuidedWorkoutMode(false);
        setExerciseSubView('list');
      }, 50); // 50ms delay for smooth transition
      
      console.log('✅ Workout state reset');

      // ==========================================
      // STEP 9: SUCCESS NOTIFICATION
      // ==========================================
      const successMessage = newPRs.length > 0 
        ? `Workout complete! 🎉 ${newPRs.length} new PR${newPRs.length > 1 ? 's' : ''}!`
        : 'Workout saved successfully! 💪';
      
      swipeableToast.success(successMessage);
      console.log('=== FINISH WORKOUT TRANSACTION COMPLETED ===');

      // ==========================================
      // OPTIONAL: Cleanup old workout records (background task)
      // ==========================================
      try {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const allWorkoutsQuery = query(
          collection(db, 'workoutHistory'),
          where('userId', '==', user.uid)
        );
        
        const allWorkoutsSnapshot = await getDocs(allWorkoutsQuery);
        const oldWorkouts = allWorkoutsSnapshot.docs.filter(docSnapshot => {
          const data = docSnapshot.data();
          return data.timestamp < thirtyDaysAgo;
        });
        
        if (oldWorkouts.length > 0) {
          const deletePromises = oldWorkouts.map(docSnapshot => deleteDoc(docSnapshot.ref));
          await Promise.all(deletePromises);
          console.log(`Cleaned up ${oldWorkouts.length} old workout records`);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up old workouts:', cleanupError);
        // Silent fail - cleanup is not critical
      }

    } catch (error) {
      console.error('=== FINISH WORKOUT TRANSACTION FAILED ===', error);
      swipeableToast.error('Failed to save workout. Please try again.');
      
      // Even on error, try to preserve the workout data in localStorage for recovery
      try {
        const recoveryData = {
          exercises: workoutToSave,
          startTime: workoutStartTime,
          lastUpdated: Date.now(),
          failedAt: new Date().toISOString()
        };
        localStorage.setItem('AURA_WORKOUT_RECOVERY', JSON.stringify(recoveryData));
        console.log('Workout data saved to recovery storage');
      } catch (recoveryError) {
        console.error('Failed to save recovery data:', recoveryError);
      }
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
          swipeableToast.success('Logged out. Please verify your email to continue.');
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
        return <DietPlanScreen 
          goal={goal} 
          setGoal={setGoal} 
          showPlanModal={showPlanModal} 
          setShowPlanModal={setShowPlanModal} 
          userData={userData} 
          isPremium={isPremium} 
          currentDay={currentDay} 
          setCurrentDay={setCurrentDay} 
          currentWeek={currentWeek} 
          setCurrentWeek={setCurrentWeek} 
          expandedMeals={expandedMeals} 
          setExpandedMeals={setExpandedMeals} 
          logMeal={logMeal} 
          loggedMeals={loggedMeals} 
          removeLoggedMeal={removeLoggedMeal} 
          calculateDailyTotals={calculateDailyTotals} 
          showMacroSummary={showMacroSummary} 
          setShowMacroSummary={setShowMacroSummary}
          swappedMeals={swappedMeals}
          selectedMealForSwap={selectedMealForSwap}
          setSelectedMealForSwap={setSelectedMealForSwap}
          showSwapModal={showSwapModal}
          setShowSwapModal={setShowSwapModal}
          swapMeal={swapMeal}
          resetSwap={resetSwap}
          customizedMeals={customizedMeals}
          selectedMealForSub={selectedMealForSub}
          setSelectedMealForSub={setSelectedMealForSub}
          showSubstitutionModal={showSubstitutionModal}
          setShowSubstitutionModal={setShowSubstitutionModal}
          customizeMeal={customizeMeal}
          resetCustomization={resetCustomization}
        />;
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
          exerciseTab={exerciseTab}
          setExerciseTab={setExerciseTab}
          selectedExerciseForDetail={selectedExerciseForDetail}
          setSelectedExerciseForDetail={setSelectedExerciseForDetail}
          guidedWorkoutMode={guidedWorkoutMode}
          setGuidedWorkoutMode={setGuidedWorkoutMode}
          currentWorkout={currentWorkout}
          setCurrentWorkout={setCurrentWorkout}
          finishWorkout={finishWorkout}
          userData={userData}
          workoutStartTime={workoutStartTime}
          setWorkoutStartTime={setWorkoutStartTime}
          workoutSummary={workoutSummary}
          setWorkoutSummary={setWorkoutSummary}
          pendingWorkout={pendingWorkout}
          onResumePendingWorkout={resumeWorkout}
          onDiscardPendingWorkout={discardPendingWorkout}
        />;
      case 'account':
        return <AccountScreen onLogout={handleLogout} userData={userData} onNavigateToSettings={setActiveSettingsScreen} />;
      default:
        return null;
    }
  };

  return (
    // Premium Mobile Container: Theme-aware Background
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-gray-900 flex justify-center text-gray-900 dark:text-white transition-colors duration-200" style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
      <Toaster 
        position="top-center"
        containerStyle={{
          top: 60,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: userData?.appPreferences?.darkMode === false ? '#ffffff' : '#1f2937',
            color: userData?.appPreferences?.darkMode === false ? '#111827' : '#fff',
            border: `1px solid ${userData?.appPreferences?.darkMode === false ? '#e5e7eb' : '#4f46e5'}`,
            maxWidth: '90vw',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: userData?.appPreferences?.darkMode === false ? '#ffffff' : '#1f2937',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: userData?.appPreferences?.darkMode === false ? '#ffffff' : '#1f2937',
            },
          },
        }}
      />
      
      {/* Resume Workout Prompt - shown when there's a pending workout from localStorage */}
      {showResumePrompt && pendingWorkout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border-2 border-indigo-500 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Resume Workout?</h2>
              <p className="text-gray-400 text-sm">
                You have an unfinished workout from earlier
              </p>
            </div>
            
            {/* Workout Summary */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Exercises</span>
                <span className="text-white font-semibold">{pendingWorkout.exercises.length}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Total Sets</span>
                <span className="text-white font-semibold">
                  {pendingWorkout.exercises.reduce((sum, e) => sum + e.sets.length, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Time Elapsed</span>
                <span className="text-white font-semibold">
                  {Math.floor((Date.now() - pendingWorkout.startTime) / 1000 / 60)} min
                </span>
              </div>
              
              {/* Exercise List */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-500 mb-2">Exercises:</p>
                <div className="flex flex-wrap gap-1">
                  {pendingWorkout.exercises.slice(0, 4).map((e, i) => (
                    <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                      {e.exercise.split(' ').slice(0, 2).join(' ')}
                    </span>
                  ))}
                  {pendingWorkout.exercises.length > 4 && (
                    <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      +{pendingWorkout.exercises.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  discardPendingWorkout();
                  swipeableToast.success('Previous workout discarded');
                }}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold transition-colors"
              >
                Discard
              </button>
              <button
                onClick={() => {
                  resumeWorkout();
                  setActiveTab('exercise');
                  swipeableToast.success('Workout resumed!');
                }}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white font-semibold transition-colors"
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      )}
      
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
      
      {/* CRITICAL: Single Scroll Container Pattern */}
      <div className="fixed inset-0 flex flex-col w-full max-w-md mx-auto bg-white/70 dark:bg-gray-900 shadow-2xl transition-colors duration-200 backdrop-blur-sm overflow-hidden" style={{ paddingTop: 'var(--safe-area-top)' }}>
        
        {/* --- SECTION A: MAIN SCROLLABLE AREA --- */}
        {/* This is the ONLY element with overflow-y-auto */}
        <main 
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto w-full relative"
          id="main-scroll-container"
          style={{ overscrollBehavior: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {/* Padding bottom prevents content from being hidden behind fixed nav */}
          <div className="min-h-full" style={{ paddingBottom: 'calc(80px + var(--safe-area-bottom))' }}>
            {renderContent()}
          </div>
        </main>

        {/* --- SECTION B: FIXED BOTTOM NAVIGATION --- */}
        {/* Completely outside scrolling context */}
        <nav className="block w-full z-50 bg-white dark:bg-gray-800 border-t-2 border-gray-300 dark:border-indigo-400 shadow-2xl transition-colors duration-200">
          <div style={{ paddingBottom: 'var(--safe-area-bottom)' }}>
            <ul className="flex justify-around items-center px-2" style={{ height: '72px' }}>
              <NavItem icon={Home} label="Home" active={activeTab === 'home'} onClick={() => { setActiveTab('home'); setActiveSettingsScreen(null); }} />
              <NavItem icon={Soup} label="Diet Plan" active={activeTab === 'diet'} onClick={() => { setActiveTab('diet'); setActiveSettingsScreen(null); }} />
              <NavItem icon={Dumbbell} label="Exercises" active={activeTab === 'exercise'} onClick={() => { setActiveTab('exercise'); setActiveSettingsScreen(null); }} />
              <NavItem icon={User} label="Account" active={activeTab === 'account'} onClick={() => { setActiveTab('account'); setActiveSettingsScreen(null); }} />
            </ul>
          </div>
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

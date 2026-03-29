import React, { createContext, useContext, useEffect, useState } from 'react';
import { localDb } from '../db/db';
import type { GlucoseEntry, MealEntry, DailyGoal, InsulinEntry } from '../db/db';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

interface AppContextType {
  user: User | null;
  loading: boolean;
  glucoseEntries: GlucoseEntry[];
  mealEntries: MealEntry[];
  insulinEntries: InsulinEntry[];
  goals: DailyGoal[];
  addGlucose: (entry: Omit<GlucoseEntry, 'id'>) => Promise<void>;
  addMeal: (entry: Omit<MealEntry, 'id'>) => Promise<void>;
  addInsulin: (entry: Omit<InsulinEntry, 'id'>) => Promise<void>;
  updateGoal: (goal: DailyGoal) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [glucoseEntries, setGlucoseEntries] = useState<GlucoseEntry[]>([]);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [insulinEntries, setInsulinEntries] = useState<InsulinEntry[]>([]);
  const [goals, setGoals] = useState<DailyGoal[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sync entries from Dexie to state
  useEffect(() => {
    const fetchLocalData = async () => {
      const g = await localDb.glucose.reverse().toArray();
      const m = await localDb.meals.reverse().toArray();
      const ins = await localDb.insulinas.reverse().toArray();
      const go = await localDb.goals.toArray();
      setGlucoseEntries(g);
      setMealEntries(m);
      setInsulinEntries(ins);
      setGoals(go);
    };

    fetchLocalData();

    const interval = setInterval(fetchLocalData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sync Engine: Dexie -> Firestore
  useEffect(() => {
    if (!user) return;

    const syncToFirebase = async () => {
      // Sync Glucose
      const unsyncedGlucose = await localDb.glucose.where('synced').equals(0).toArray();
      for (const entry of unsyncedGlucose) {
        try {
          await addDoc(collection(db, `users/${user.uid}/glucose`), {
            ...entry,
            date: Timestamp.fromDate(entry.date),
            synced: true
          });
          await localDb.glucose.update(entry.id!, { synced: true as any });
        } catch (e) {
          console.error("Error syncing glucose:", e);
        }
      }

      // Sync Meals
      const unsyncedMeals = await localDb.meals.where('synced').equals(0).toArray();
      for (const entry of unsyncedMeals) {
        try {
          await addDoc(collection(db, `users/${user.uid}/meals`), {
            ...entry,
            date: Timestamp.fromDate(entry.date),
            synced: true
          });
          await localDb.meals.update(entry.id!, { synced: true as any });
        } catch (e) {
          console.error("Error syncing meals:", e);
        }
      }

      // Sync Insulin
      const unsyncedInsulin = await localDb.insulinas.where('synced').equals(0).toArray();
      for (const entry of unsyncedInsulin) {
        try {
          await addDoc(collection(db, `users/${user.uid}/insulinas`), {
            ...entry,
            date: Timestamp.fromDate(entry.date),
            synced: true
          });
          await localDb.insulinas.update(entry.id!, { synced: true as any });
        } catch (e) {
          console.error("Error syncing insulin:", e);
        }
      }
    };

    const interval = setInterval(syncToFirebase, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const addGlucose = async (entry: Omit<GlucoseEntry, 'id'>) => {
    await localDb.glucose.add({ ...entry, synced: false as any });
  };

  const addMeal = async (entry: Omit<MealEntry, 'id'>) => {
    await localDb.meals.add({ ...entry, synced: false as any });
  };

  const addInsulin = async (entry: Omit<InsulinEntry, 'id'>) => {
    await localDb.insulinas.add({ ...entry, synced: false as any });
  };

  const updateGoal = async (goal: DailyGoal) => {
    await localDb.goals.put(goal);
    setGoals(await localDb.goals.toArray());
  };

  return (
    <AppContext.Provider value={{ 
      user, loading, glucoseEntries, mealEntries, insulinEntries, goals, 
      addGlucose, addMeal, addInsulin, updateGoal 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

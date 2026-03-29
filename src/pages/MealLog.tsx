import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { localDb } from '../db/db';
import type { FoodItem } from '../db/db';
import { X, Save, Plus, Search, AlertCircle, ChevronRight, Info, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MealLogProps {
  onClose: () => void;
}

const MealLog: React.FC<MealLogProps> = ({ onClose }) => {
  const { addMeal, goals } = useAppContext();
  const [mealType, setMealType] = useState<any>('almuerzo');
  const [selectedFoods, setSelectedFoods] = useState<{ name: string; amount: number; carbs: number }[]>([]);
  const [catalog, setCatalog] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState('');
  const [showCatalog, setShowCatalog] = useState<boolean | 'substitution'>(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      const foods = await localDb.foodCatalog.toArray();
      setCatalog(foods);
    };
    fetchCatalog();
  }, []);

  const totalCarbs = selectedFoods.reduce((sum, f) => sum + f.carbs, 0);
  const targetGoal = goals.find(g => g.id === mealType)?.targetCarbs || 0;
  const deviation = totalCarbs - targetGoal;
  const isAlert = Math.abs(deviation) > 10;

  const calculateSubstitution = (food: FoodItem) => {
    const diff = targetGoal - totalCarbs;
    if (diff === 0) return;
    const neededGrams = Math.round((diff * 100) / food.carbsPer100g);
    if (neededGrams > 0) {
      setSuggestion(`Añade ${neededGrams}g de ${food.name} para llegar a los ${targetGoal}g.`);
    } else {
      setSuggestion(`Quita comida o cambia algo por ${Math.abs(neededGrams)}g de ${food.name}.`);
    }
  };

  const handleAddFood = (food: FoodItem) => {
    if (showCatalog === 'substitution') {
      calculateSubstitution(food);
      setShowCatalog(false);
      return;
    }
    const amount = food.servingSize || 100;
    const carbs = (food.carbsPer100g * amount) / 100;
    setSelectedFoods([...selectedFoods, { name: food.name, amount, carbs }]);
    setShowCatalog(false);
  };

  const handleSubmit = async () => {
    if (selectedFoods.length === 0) return;
    await addMeal({
      date: new Date(),
      mealType,
      foods: selectedFoods,
      totalCarbs,
      targetCarbs: targetGoal,
    });
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-panel" 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 2000,
        display: 'flex', flexDirection: 'column',
        borderRadius: 0,
        padding: '24px', 
        background: 'var(--bg-gradient)'
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Registrar Comida</h2>
        <button onClick={onClose} className="btn-ghost" style={{ padding: '12px', background: 'var(--glass-bg)', borderRadius: '50%' }}>
          <X size={24} />
        </button>
      </header>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Momento del día</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {['desayuno', 'almuerzo', 'cena', 'snack'].map(type => (
            <button 
              key={type}
              onClick={() => setMealType(type)}
              style={{
                padding: '10px 4px',
                fontSize: '0.75rem',
                background: mealType === type ? 'var(--primary)' : 'var(--glass-bg)',
                color: mealType === type ? 'white' : 'var(--text-main)',
                border: mealType === type ? 'none' : '1px solid var(--glass-border)'
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        animate={{ 
          backgroundColor: isAlert ? 'rgba(244, 63, 94, 0.05)' : 'rgba(14, 165, 233, 0.05)',
          borderColor: isAlert ? 'var(--warning)' : 'var(--primary)'
        }}
        className="glass-panel" 
        style={{ 
          padding: '24px', 
          marginBottom: '28px',
          borderWidth: '2px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
             <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Total Carbohidratos</div>
             <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: isAlert ? 'var(--warning)' : 'var(--primary)' }}>{totalCarbs.toFixed(1)}g</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>/ {targetGoal}g</span>
             </div>
          </div>
          <div style={{ background: isAlert ? 'var(--warning)' : 'var(--primary)', padding: '12px', borderRadius: '16px' }}>
            {isAlert ? <AlertCircle color="white" size={24} /> : <Save color="white" size={24} />}
          </div>
        </div>
        
        <AnimatePresence>
          {isAlert && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Info size={18} color="var(--warning)" style={{ marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--warning)', fontSize: '1rem', fontWeight: 700 }}>
                    Desviación de {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}g HC
                  </p>
                  <button 
                    onClick={() => setShowCatalog('substitution')}
                    className="btn-ghost"
                    style={{ padding: '8px 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}
                  >
                    ¿Cómo ajustar con equivalencias? <ChevronRight size={16} />
                  </button>
                  {suggestion && (
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      style={{ fontSize: '0.9rem', marginTop: '10px', color: 'var(--text-main)', background: 'var(--glass-bg)', padding: '12px', borderRadius: '12px', fontStyle: 'italic' }}
                    >
                      💡 {suggestion}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Alimentos seleccionados</h4>
        {selectedFoods.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', opacity: 0.6 }}>
            <Utensils size={40} style={{ marginBottom: '12px' }} />
            <p>Todavía no has añadido ningún alimento.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedFoods.map((food, i) => (
              <motion.div 
                key={i} 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card" 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{food.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{food.amount}g</div>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)' }}>{food.carbs.toFixed(1)}g</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
        <button 
          onClick={() => setShowCatalog(true)}
          className="glass-panel"
          style={{ padding: '18px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
        >
          <Plus size={24} />
        </button>

        <button 
          onClick={handleSubmit} 
          className="btn-primary" 
          disabled={selectedFoods.length === 0}
          style={{ padding: '18px', fontSize: '1.2rem', opacity: selectedFoods.length === 0 ? 0.5 : 1 }}
        >
          <Save size={24} /> Guardar
        </button>
      </div>

      <AnimatePresence>
        {showCatalog && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-panel" 
            style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'var(--bg-gradient)', padding: '24px', zIndex: 2100,
              borderRadius: 0
            }}
          >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.5rem' }}>{showCatalog === 'substitution' ? 'Ajustar con...' : 'Catálogo'}</h3>
              <button onClick={() => setShowCatalog(false)} className="btn-ghost" style={{ background: 'var(--glass-bg)', borderRadius: '50%', padding: '10px' }}>
                <X size={24} />
              </button>
            </header>
            
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <Search style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} size={20} />
              <input 
                className="glass-panel"
                style={{ paddingLeft: '52px', marginBottom: 0 }}
                placeholder="Buscar alimento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ overflowY: 'auto', height: 'calc(100% - 140px)', paddingRight: '4px' }}>
              {catalog.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map((food, i) => (
                <motion.div 
                  key={food.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => handleAddFood(food)}
                  className="glass-card"
                  style={{ padding: '20px', marginBottom: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{food.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{food.carbsPer100g}g HC / 100g</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    {food.gi && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '4px 10px', 
                        borderRadius: '10px', 
                        backgroundColor: food.gi === 'Bajo' ? 'rgba(16, 185, 129, 0.15)' : food.gi === 'Alto' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: food.gi === 'Bajo' ? 'var(--success)' : food.gi === 'Alto' ? 'var(--warning)' : 'var(--hyper)',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}>
                        IG {food.gi}
                      </span>
                    )}
                    <ChevronRight size={20} color="var(--text-muted)" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MealLog;

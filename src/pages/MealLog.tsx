import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { localDb } from '../db/db';
import type { FoodItem } from '../db/db';
import { X, Save, Plus, Search, AlertCircle } from 'lucide-react';

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
      setSuggestion(`Para alcanzar tu objetivo, podrías añadir ${neededGrams}g de ${food.name}.`);
    } else {
      setSuggestion(`Para alcanzar tu objetivo, podrías quitar alimentos o cambiar alguno por ${Math.abs(neededGrams)}g de ${food.name}.`);
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
    <div className="glass" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 2000,
      display: 'flex', flexDirection: 'column',
      padding: '24px', backgroundColor: 'white'
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Registrar Comida</h2>
        <button onClick={onClose} className="btn-ghost" style={{ padding: '8px' }}><X size={24} /></button>
      </header>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)' }}>Tipo de Comida</label>
        <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option value="desayuno">Desayuno</option>
          <option value="almuerzo">Almuerzo</option>
          <option value="cena">Cena</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div className="glass" style={{ 
        padding: '20px', borderRadius: '24px', marginBottom: '20px',
        backgroundColor: isAlert ? '#fff1f2' : '#f0f9ff',
        border: `2px solid ${isAlert ? 'var(--warning)' : 'var(--primary)'}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
             <span style={{ fontSize: '1.5rem', fontWeight: 800, color: isAlert ? 'var(--warning)' : 'inherit' }}>{totalCarbs.toFixed(1)}g</span>
             <span style={{ color: 'var(--text-light)', marginLeft: '8px' }}>de {targetGoal}g objetivo</span>
          </div>
          {isAlert && <AlertCircle color="var(--warning)" />}
        </div>
        {isAlert && (
          <div style={{ marginTop: '12px' }}>
            <p style={{ color: 'var(--warning)', fontSize: '0.9rem', fontWeight: 600 }}>
              ⚠️ Desviación de {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}g HC.
            </p>
            <button 
              onClick={() => setShowCatalog('substitution')}
              style={{ background: 'none', color: 'var(--primary)', padding: '4px 0', fontSize: '0.9rem', fontWeight: 600, border: 'none' }}
            >
              ¿Cómo lo ajusto?
            </button>
            {suggestion && <p style={{ fontSize: '0.85rem', marginTop: '8px', color: 'var(--text)', fontStyle: 'italic' }}>{suggestion}</p>}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '12px' }}>Alimentos seleccionados</h4>
        {selectedFoods.length === 0 ? (
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Pulsa + para añadir alimentos de tu catálogo.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedFoods.map((food, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #eee' }}>
                <span>{food.name} ({food.amount}g)</span>
                <span style={{ fontWeight: 600 }}>{food.carbs.toFixed(1)}g</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        onClick={() => setShowCatalog(true)}
        style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius)', backgroundColor: '#f1f5f9', color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none' }}
      >
        <Plus size={20} /> Añadir Alimento
      </button>

      <button onClick={handleSubmit} className="btn-primary" style={{ padding: '18px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <Save size={24} /> Guardar Registro
      </button>

      {showCatalog && (
        <div className="glass" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', padding: '24px', zIndex: 2100 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>{showCatalog === 'substitution' ? 'Elegir para ajustar' : 'Catálogo'}</h3>
            <button onClick={() => setShowCatalog(false)} className="btn-ghost"><X size={24} /></button>
          </header>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-light)' }} size={20} />
            <input 
              style={{ paddingLeft: '44px' }}
              placeholder="Buscar alimento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ overflowY: 'auto', height: 'calc(100% - 120px)' }}>
            {catalog.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map(food => (
              <div 
                key={food.id} 
                onClick={() => handleAddFood(food)}
                style={{ padding: '16px', borderBottom: '1px solid #eee', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{food.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{food.carbsPer100g}g HC cada 100g</div>
                </div>
                {food.gi && (
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '2px 8px', 
                    borderRadius: '8px', 
                    backgroundColor: food.gi === 'Bajo' ? '#dcfce7' : food.gi === 'Alto' ? '#fee2e2' : '#fef9c3',
                    color: food.gi === 'Bajo' ? '#166534' : food.gi === 'Alto' ? '#991b1b' : '#854d0e',
                    fontWeight: 700
                  }}>
                    IG {food.gi}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealLog;

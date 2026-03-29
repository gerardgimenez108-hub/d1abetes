import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Save, User as UserIcon, Bell, ShieldCheck, Moon, Sun, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const { goals, updateGoal, user, theme, toggleTheme } = useAppContext();
  const [localGoals, setLocalGoals] = useState(goals);

  const handleChange = (id: string, value: string) => {
    setLocalGoals(prev => prev.map(g => g.id === id ? { ...g, targetCarbs: parseInt(value) || 0 } : g));
  };

  const handleSave = async () => {
    for (const goal of localGoals) {
      await updateGoal(goal);
    }
    alert('Configuración guardada correctamente');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container"
    >
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary)', marginBottom: '4px' }}>Configuración</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Personaliza tu experiencia</p>
      </header>

      <section className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {theme === 'light' ? <Sun size={20} color="var(--hyper)" /> : <Moon size={20} color="var(--primary)" />} 
            Apariencia
          </h3>
          <button 
            onClick={toggleTheme}
            className="glass-card"
            style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700, background: 'var(--accent-glow)', border: 'none' }}
          >
            Modo {theme === 'light' ? 'Oscuro' : 'Claro'}
          </button>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Cambia entre el modo claro y oscuro para tu comodidad visual.
        </p>
      </section>

      <section className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
          <ShieldCheck size={20} color="var(--primary)" /> Objetivos de Carbohidratos
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {localGoals.map(goal => (
            <div key={goal.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
              <span style={{ textTransform: 'capitalize', fontWeight: 700, fontSize: '1rem' }}>{goal.id}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="number" 
                  value={goal.targetCarbs} 
                  onChange={(e) => handleChange(goal.id!, e.target.value)}
                  style={{ width: '80px', marginBottom: 0, textAlign: 'right', fontWeight: 800, padding: '8px', border: 'none', background: 'transparent' }}
                />
                <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>g</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleSave} className="btn-primary" style={{ width: '100%', marginTop: '24px' }}>
          <Save size={20} /> Guardar Objetivos
        </button>
      </section>

      <section className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
          <UserIcon size={20} color="var(--primary)" /> Cuenta
        </h3>
        <div className="glass-card" style={{ padding: '16px', background: 'rgba(14, 165, 233, 0.05)' }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
            {user ? user.email : 'Usuario Local'}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {user ? 'Sincronización activa con Firebase' : 'Los datos se guardan solo en este dispositivo.'}
          </p>
        </div>
        {!user && (
          <button className="btn-ghost" style={{ width: '100%', marginTop: '16px', fontWeight: 700 }}>
            Iniciar sesión para sincronizar
          </button>
        )}
      </section>

      <section className="glass-panel" style={{ padding: '24px', opacity: 0.6 }}>
        <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
          <Bell size={20} color="var(--text-muted)" /> Notificaciones
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Recordatorios automáticos en desarrollo.
        </p>
      </section>
      
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
         <button style={{ color: 'var(--warning)', background: 'transparent', fontSize: '0.9rem', fontWeight: 700, gap: '8px' }}>
            <LogOut size={18} /> Cerrar Sesión
         </button>
      </div>
    </motion.div>
  );
};

export default Settings;

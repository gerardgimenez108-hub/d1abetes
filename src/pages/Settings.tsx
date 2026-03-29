import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Save, User as UserIcon, Bell, ShieldCheck } from 'lucide-react';

const Settings: React.FC = () => {
  const { goals, updateGoal, user } = useAppContext();
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
    <div className="container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary)' }}>Configuración</h1>
        <p style={{ color: 'var(--text-light)' }}>Personaliza tus objetivos y perfil</p>
      </header>

      <section className="glass" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="var(--primary)" /> Objetivos de Carbohidratos (g)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {localGoals.map(goal => (
            <div key={goal.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{goal.id}</span>
              <input 
                type="number" 
                value={goal.targetCarbs} 
                onChange={(e) => handleChange(goal.id!, e.target.value)}
                style={{ width: '100px', marginBottom: 0, textAlign: 'right' }}
              />
            </div>
          ))}
        </div>
        <button onClick={handleSave} className="btn-primary" style={{ width: '100%', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Save size={20} /> Guardar Objetivos
        </button>
      </section>

      <section className="glass" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserIcon size={20} color="var(--primary)" /> Perfil de Usuario
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '12px' }}>
          {user ? `Conectado como: ${user.email || 'Usuario Anónimo'}` : 'No has iniciado sesión. Los datos se guardan solo localmente.'}
        </p>
        {!user && <button className="btn-ghost" style={{ padding: 0, color: 'var(--primary)' }}>Iniciar sesión para sincronizar</button>}
      </section>

      <section className="glass" style={{ padding: '24px', borderRadius: '24px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={20} color="var(--primary)" /> Recordatorios
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Módulo de notificaciones en desarrollo...</p>
      </section>
    </div>
  );
};

export default Settings;

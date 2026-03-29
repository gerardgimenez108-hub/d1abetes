import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { X, Save, Syringe, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsulinLogProps {
  onClose: () => void;
}

const InsulinLog: React.FC<InsulinLogProps> = ({ onClose }) => {
  const { addInsulin } = useAppContext();
  const [dose, setDose] = useState('');
  const [type, setType] = useState<any>('bolo_comida');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dose) return;
    
    await addInsulin({
      dose: parseFloat(dose),
      type,
      notes,
      date: new Date(),
    });
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
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
        <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--success)', padding: '10px', borderRadius: '14px' }}>
            <Syringe color="white" size={24} />
          </div>
          Insulina
        </h2>
        <button onClick={onClose} className="btn-ghost" style={{ padding: '12px', background: 'var(--glass-bg)', borderRadius: '50%' }}>
          <X size={24} />
        </button>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <label style={{ display: 'block', marginBottom: '16px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Dosis Administrada (Unidades)</label>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <input 
              type="number" 
              step="0.5"
              autoFocus
              inputMode="decimal"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="0.0"
              style={{ 
                fontSize: '4.5rem', 
                fontWeight: 900, 
                textAlign: 'center', 
                background: 'transparent', 
                border: 'none', 
                width: '180px',
                padding: '0',
                margin: '0',
                color: 'var(--success)',
                letterSpacing: '-0.05em'
              }}
            />
            <div style={{ position: 'absolute', bottom: '12px', right: '-30px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '1rem' }}>U</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>
            <Clock size={16} /> TIPO DE INSULINA
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { id: 'bolo_comida', label: 'Bolo Comida (Rápida)' },
              { id: 'basal', label: 'Basal (Lenta)' },
              { id: 'correccion', label: 'Corrección' }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setType(m.id)}
                className="glass-card"
                style={{
                  padding: '16px',
                  justifyContent: 'flex-start',
                  fontSize: '1rem',
                  background: type === m.id ? 'var(--success)' : 'var(--glass-bg)',
                  color: type === m.id ? 'white' : 'var(--text-main)',
                  border: type === m.id ? 'none' : '1px solid var(--glass-border)',
                }}
              >
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: type === m.id ? 'white' : 'var(--success)',
                  marginRight: '12px'
                }} />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>
            <FileText size={16} /> NOTAS (OPCIONAL)
          </label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Inyectada en el muslo..."
            style={{ 
              width: '100%', 
              padding: '16px', 
              borderRadius: '16px', 
              border: '1px solid var(--glass-border)', 
              background: 'var(--glass-bg)',
              minHeight: '100px', 
              fontSize: '1rem',
              marginBottom: 0
            }}
          ></textarea>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: 'auto', padding: '20px', fontSize: '1.2rem', backgroundColor: 'var(--success)' }}>
          <Save size={24} /> Guardar Insulina
        </button>
      </form>
    </motion.div>
  );
};

export default InsulinLog;

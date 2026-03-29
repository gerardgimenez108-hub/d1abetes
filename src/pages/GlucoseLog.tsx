import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { X, Save, Droplets, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface GlucoseLogProps {
  onClose: () => void;
}

const GlucoseLog: React.FC<GlucoseLogProps> = ({ onClose }) => {
  const { addGlucose } = useAppContext();
  const [value, setValue] = useState('');
  const [type, setType] = useState<any>('preprandial');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    
    await addGlucose({
      value: parseInt(value),
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
          <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '14px' }}>
            <Droplets color="white" size={24} />
          </div>
          Glucemia
        </h2>
        <button onClick={onClose} className="btn-ghost" style={{ padding: '12px', background: 'var(--glass-bg)', borderRadius: '50%' }}>
          <X size={24} />
        </button>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <label style={{ display: 'block', marginBottom: '16px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Valor Actual (mg/dL)</label>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <input 
              type="number" 
              autoFocus
              inputMode="numeric"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="000"
              style={{ 
                fontSize: '4.5rem', 
                fontWeight: 900, 
                textAlign: 'center', 
                background: 'transparent', 
                border: 'none', 
                width: '240px',
                padding: '0',
                margin: '0',
                color: 'var(--primary)',
                letterSpacing: '-0.05em'
              }}
            />
            <div style={{ position: 'absolute', bottom: '12px', right: '-40px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '1rem' }}>mg/dL</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>
            <Clock size={16} /> MOMENTO DE LA MEDICIÓN
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {['ayunas', 'preprandial', 'postprandial', 'nocturna', 'otra'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setType(m)}
                style={{
                  padding: '12px 8px',
                  fontSize: '0.85rem',
                  background: type === m ? 'var(--primary)' : 'var(--glass-bg)',
                  color: type === m ? 'white' : 'var(--text-main)',
                  border: type === m ? 'none' : '1px solid var(--glass-border)',
                  borderRadius: '12px'
                }}
              >
                {m.charAt(0).toUpperCase() + m.slice(1).replace('prandial', '')}
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
            placeholder="¿Algún comentario sobre esta medición?"
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

        <button type="submit" className="btn-primary" style={{ marginTop: 'auto', padding: '20px', fontSize: '1.2rem' }}>
          <Save size={24} /> Guardar Glucemia
        </button>
      </form>
    </motion.div>
  );
};

export default GlucoseLog;

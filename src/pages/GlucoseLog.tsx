import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { X, Save } from 'lucide-react';

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
    <div className="glass" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      backgroundColor: 'white'
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Registrar Glucemia</h2>
        <button onClick={onClose} className="btn-ghost" style={{ padding: '8px' }}><X size={24} /></button>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)' }}>Valor (mg/dL)</label>
          <input 
            type="number" 
            autoFocus
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Introduce valor"
            style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center' }}
          />
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)' }}>Momento</label>
           <select value={type} onChange={(e) => setType(e.target.value)}>
             <option value="ayunas">Ayunas</option>
             <option value="preprandial">Pre-comida</option>
             <option value="postprandial">Post-comida</option>
             <option value="nocturna">Nocturna</option>
             <option value="otra">Otra</option>
           </select>
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)' }}>Notas</label>
           <textarea 
             value={notes} 
             onChange={(e) => setNotes(e.target.value)}
             placeholder="Algún comentario..."
             style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid #e2e8f0', minHeight: '100px', fontSize: '1rem' }}
           ></textarea>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: 'auto', padding: '18px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Save size={24} /> Guardar Registro
        </button>
      </form>
    </div>
  );
};

export default GlucoseLog;

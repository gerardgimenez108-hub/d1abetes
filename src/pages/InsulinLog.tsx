import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { X, Save, Syringe } from 'lucide-react';

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
    <div className="glass" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 2000,
      display: 'flex', flexDirection: 'column',
      padding: '24px', backgroundColor: 'white'
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <Syringe color="var(--primary)" /> Registrar Insulina
        </h2>
        <button onClick={onClose} className="btn-ghost" style={{ padding: '8px' }}><X size={24} /></button>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)' }}>Dosis (Unidades)</label>
          <input 
            type="number" 
            step="0.5"
            autoFocus
            inputMode="decimal"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="0.0"
            style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center' }}
          />
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)' }}>Tipo de Insulina</label>
           <select value={type} onChange={(e) => setType(e.target.value)}>
             <option value="bolo_comida">Bolo Comida (Rápida)</option>
             <option value="basal">Basal (Lenta)</option>
             <option value="correccion">Corrección</option>
           </select>
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)' }}>Notas</label>
           <textarea 
             value={notes} 
             onChange={(e) => setNotes(e.target.value)}
             placeholder="Ej: Inyectada en el brazo..."
             style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid #e2e8f0', minHeight: '100px', fontSize: '1rem' }}
           ></textarea>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: 'auto', padding: '18px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Save size={24} /> Guardar Insulina
        </button>
      </form>
    </div>
  );
};

export default InsulinLog;

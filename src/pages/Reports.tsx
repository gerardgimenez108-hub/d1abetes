import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { FileText, Download, CheckCircle, BarChart3, TrendingUp, Calendar, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Reports: React.FC = () => {
  const { glucoseEntries, mealEntries, insulinEntries } = useAppContext();

  // Simple stats
  const avgGlucose = glucoseEntries.length > 0 
    ? Math.round(glucoseEntries.reduce((sum, e) => sum + e.value, 0) / glucoseEntries.length)
    : 0;
  
  const inRangeCount = glucoseEntries.filter(e => e.value >= 70 && e.value <= 180).length;
  const tir = glucoseEntries.length > 0 ? Math.round((inRangeCount / glucoseEntries.length) * 100) : 0;

  const exportGlucose = () => {
    let csvContent = "data:text/csv;charset=utf-8,Fecha,Hora,Tipo,Valor(mg/dL),Notas\n";
    glucoseEntries.forEach(e => {
      csvContent += `${e.date.toLocaleDateString()},${e.date.toLocaleTimeString()},${e.type},${e.value},${e.notes || ''}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_glucemias.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportInsulin = () => {
    let csvContent = "data:text/csv;charset=utf-8,Fecha,Hora,Tipo,Dosis(U),Notas\n";
    insulinEntries.forEach(e => {
      csvContent += `${e.date.toLocaleDateString()},${e.date.toLocaleTimeString()},${e.type},${e.dose},${e.notes || ''}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_insulinas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container"
    >
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary)', marginBottom: '4px' }}>Informes</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Análisis y exportación de datos</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <TrendingUp size={24} color="var(--primary)" />
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Media Glucosa</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{avgGlucose}</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>mg/dL</span>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <BarChart3 size={24} color="var(--success)" />
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tiempo en Rango</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--success)' }}>{tir}%</span>
          </div>
        </div>
      </div>

      <section className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem' }}>
          <CheckCircle size={20} color="var(--success)" /> Resumen de Actividad
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Mediciones de glucosa', count: glucoseEntries.length, icon: TrendingUp },
            { label: 'Comidas registradas', count: mealEntries.length, icon: Calendar },
            { label: 'Inyecciones de insulina', count: insulinEntries.length, icon: TrendingUp }
          ].map((item, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 600 }}>{item.label}</span>
                <span style={{ background: 'var(--glass-bg)', padding: '4px 12px', borderRadius: '12px', fontWeight: 800 }}>{item.count}</span>
             </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button onClick={exportGlucose} className="btn-primary" style={{ padding: '20px', borderRadius: '20px' }}>
          <Download size={24} /> Exportar Glucemias (CSV)
        </button>
        <button 
          onClick={exportInsulin} 
          className="glass-panel"
          style={{ padding: '20px', borderRadius: '20px', background: 'var(--accent-glow)', color: 'var(--primary)', border: 'none', fontWeight: 700 }}
        >
          <Download size={24} /> Exportar Insulinas (CSV)
        </button>
        <button className="glass-card" style={{ padding: '20px', opacity: 0.6, cursor: 'not-allowed', justifyContent: 'center' }}>
          <FileText size={24} color="var(--text-muted)" /> 
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Informe PDF (Muy pronto)</span>
        </button>
        
        <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
           <Info size={20} color="var(--primary)" />
           <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
             Puedes compartir estos archivos directamente con tu endocrinólogo vía email o app de mensajería.
           </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;

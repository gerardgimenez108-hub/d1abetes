import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { FileText, Download, Share2, CheckCircle } from 'lucide-react';

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
    <div className="container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary)' }}>Informes</h1>
        <p style={{ color: 'var(--text-light)' }}>Resumen de salud y exportación</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="glass" style={{ padding: '20px', borderRadius: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', display: 'block' }}>Media Glucosa</span>
          <span style={{ fontSize: '2rem', fontWeight: 800 }}>{avgGlucose}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}> mg/dL</span>
        </div>
        <div className="glass" style={{ padding: '20px', borderRadius: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', display: 'block' }}>Tiempo en Rango</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{tir}%</span>
        </div>
      </div>

      <section className="glass" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={20} color="var(--success)" /> Resumen de Actividad
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '8px' }}>
           • {glucoseEntries.length} mediciones de glucosa.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '8px' }}>
           • {mealEntries.length} comidas registradas.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '8px' }}>
           • {insulinEntries.length} inyecciones de insulina.
        </p>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button onClick={exportGlucose} className="btn-primary" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Download size={24} /> Exportar Glucemias (CSV)
        </button>
        <button onClick={exportInsulin} style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#059669', backgroundColor: '#ecfdf5', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600 }}>
          <Download size={24} /> Exportar Insulinas (CSV)
        </button>
        <button className="glass" style={{ border: 'none', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--primary)' }}>
          <FileText size={24} /> Generar Informe PDF (Próximamente)
        </button>
        <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Share2 size={24} /> Compartir con Endocrino
        </button>
      </div>
    </div>
  );
};

export default Reports;

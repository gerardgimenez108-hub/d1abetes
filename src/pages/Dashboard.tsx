import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Plus, Droplets, Utensils, BarChart3, Syringe, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

interface DashboardProps {
  onLogGlucose: () => void;
  onLogMeal: () => void;
  onLogInsulin: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogGlucose, onLogMeal, onLogInsulin }) => {
  const { glucoseEntries, insulinEntries } = useAppContext();
  
  const lastGlucose = glucoseEntries[0];
  const lastInsulin = insulinEntries[0];

  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { label: 'Baja', color: 'var(--warning)', bg: 'rgba(244, 63, 94, 0.1)' };
    if (value > 180) return { label: 'Alta', color: 'var(--hyper)', bg: 'rgba(245, 158, 11, 0.1)' };
    return { label: 'Normal', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)' };
  };

  const detectPattern = () => {
    if (glucoseEntries.length < 5) return null;
    const hypos = glucoseEntries.filter(e => e.value < 70).slice(0, 5);
    if (hypos.length >= 3) {
      const hours = hypos.map(h => h.date.getHours());
      const meanHour = hours.reduce((a,b) => a+b) / hours.length;
      const deviation = Math.sqrt(hours.map(h => Math.pow(h - meanHour, 2)).reduce((a,b) => a+b) / hours.length);
      if (deviation < 1.5) {
        return `Varias hipoglucemias cerca de las ${Math.round(meanHour)}:00.`;
      }
    }
    return null;
  };

  const patternAlert = detectPattern();

  const chartData = {
    labels: [...glucoseEntries].reverse().slice(-10).map(e => e.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [
      {
        label: 'Glucemia',
        data: [...glucoseEntries].reverse().slice(-10).map(e => e.value),
        borderColor: '#0ea5e9',
        borderWidth: 3,
        pointBackgroundColor: '#0ea5e9',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
          gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
          return gradient;
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 14 },
      }
    },
    scales: {
      y: { 
        min: 40, 
        max: 300,
        grid: { display: false },
        ticks: { color: 'var(--text-muted)', font: { size: 12 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-muted)', font: { size: 12 } }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container"
    >
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary)', marginBottom: '4px' }}>Hola de nuevo</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Aquí tienes tu resumen diario</p>
        </div>
        <div className="glass-card" style={{ padding: '8px 16px', fontSize: '0.9rem', fontWeight: 600 }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
        </div>
      </header>

      {patternAlert && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel" 
          style={{ 
            padding: '16px', 
            marginBottom: '28px', 
            background: 'rgba(245, 158, 11, 0.1)', 
            border: '1px solid rgba(245, 158, 11, 0.2)', 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center' 
          }}
        >
          <div style={{ background: 'var(--hyper)', padding: '10px', borderRadius: '14px' }}>
            <AlertTriangle color="white" size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--hyper)', fontWeight: 700, fontSize: '0.95rem' }}>Aviso de Patrón</p>
            <p style={{ color: 'var(--text-main)', fontSize: '0.85rem', opacity: 0.8 }}>{patternAlert}</p>
          </div>
          <ChevronRight size={20} color="var(--hyper)" />
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <section className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '8px', borderRadius: '12px' }}>
              <Droplets size={18} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)' }}>Glucemia</span>
          </div>
          {lastGlucose ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>{lastGlucose.value}</span>
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>mg/dL</span>
              </div>
              <div style={{ 
                display: 'inline-block',
                marginTop: '8px',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem', 
                backgroundColor: getGlucoseStatus(lastGlucose.value).bg,
                color: getGlucoseStatus(lastGlucose.value).color, 
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                • {getGlucoseStatus(lastGlucose.value).label}
              </div>
            </div>
          ) : <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-muted)', opacity: 0.3 }}>--</div>}
        </section>

        <section className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '12px' }}>
              <Syringe size={18} color="var(--success)" />
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)' }}>Última Dosis</span>
          </div>
          {lastInsulin ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>{lastInsulin.dose}</span>
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>U</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 600 }}>
                {lastInsulin.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </p>
            </div>
          ) : <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-muted)', opacity: 0.3 }}>--</div>}
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <button onClick={onLogGlucose} className="glass-panel" style={{ padding: '20px 10px', flexDirection: 'column', background: 'var(--primary)', color: 'white', border: 'none' }}>
          <Plus size={24} strokeWidth={3} />
          <span style={{ fontSize: '0.85rem', marginTop: '4px' }}>Glucemia</span>
        </button>
        <button onClick={onLogInsulin} className="glass-panel" style={{ padding: '20px 10px', flexDirection: 'column' }}>
          <Syringe size={24} color="var(--success)" />
          <span style={{ fontSize: '0.85rem', marginTop: '4px', color: 'var(--text-muted)' }}>Insulina</span>
        </button>
        <button onClick={onLogMeal} className="glass-panel" style={{ padding: '20px 10px', flexDirection: 'column' }}>
          <Utensils size={24} color="var(--primary)" />
          <span style={{ fontSize: '0.85rem', marginTop: '4px', color: 'var(--text-muted)' }}>Comida</span>
        </button>
      </div>

      <section className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={20} color="var(--primary)" /> Tendencia
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Últimas 10 lecturas</span>
        </div>
        <div style={{ height: '220px', width: '100%' }}>
          {glucoseEntries.length > 0 ? (
             <Line data={chartData} options={chartOptions} />
          ) : (
             <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', opacity: 0.3 }}>
                <BarChart3 size={48} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sin datos todavía</p>
             </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default Dashboard;

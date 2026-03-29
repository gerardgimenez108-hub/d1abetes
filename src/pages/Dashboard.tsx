import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Plus, Droplets, Utensils, BarChart3, Syringe, AlertTriangle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
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
    if (value < 70) return { label: 'Baja', color: 'var(--warning)' };
    if (value > 180) return { label: 'Alta', color: 'var(--hyper)' };
    return { label: 'Normal', color: 'var(--success)' };
  };

  // Detect recursion of hypos at same hour (+/- 1h)
  const detectPattern = () => {
    if (glucoseEntries.length < 5) return null;
    const hypos = glucoseEntries.filter(e => e.value < 70).slice(0, 5);
    if (hypos.length >= 3) {
      const hours = hypos.map(h => h.date.getHours());
      const meanHour = hours.reduce((a,b) => a+b) / hours.length;
      const deviation = Math.sqrt(hours.map(h => Math.pow(h - meanHour, 2)).reduce((a,b) => a+b) / hours.length);
      if (deviation < 1.5) {
        return `Patrón detectado: Varias hipoglucemias cerca de las ${Math.round(meanHour)}:00. Revisa tu pauta.`;
      }
    }
    return null;
  };

  const patternAlert = detectPattern();

  const chartData = {
    labels: [...glucoseEntries].reverse().slice(-7).map(e => e.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [
      {
        label: 'Glucemia (mg/dL)',
        data: [...glucoseEntries].reverse().slice(-7).map(e => e.value),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { min: 40, max: 300 }
    }
  };

  return (
    <div className="container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary)' }}>Estado Actual</h1>
        <p style={{ color: 'var(--text-light)' }}>Resumen de tus mediciones</p>
      </header>

      {patternAlert && (
        <div className="glass" style={{ padding: '16px', borderRadius: '16px', marginBottom: '24px', backgroundColor: '#fff7ed', border: '1px solid #fdba74', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <AlertTriangle color="#f97316" />
          <p style={{ color: '#9a3412', fontWeight: 600, fontSize: '0.9rem' }}>{patternAlert}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <section className="glass" style={{ padding: '20px', borderRadius: '24px' }}>
          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
            <Droplets size={16} color="var(--primary)" /> Glucemia
          </h4>
          {lastGlucose ? (
            <div>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>{lastGlucose.value}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: '4px' }}>mg/dL</span>
              <div style={{ fontSize: '0.75rem', color: getGlucoseStatus(lastGlucose.value).color, fontWeight: 700 }}>
                {getGlucoseStatus(lastGlucose.value).label}
              </div>
            </div>
          ) : <p style={{ fontSize: '0.85rem' }}>-</p>}
        </section>

        <section className="glass" style={{ padding: '20px', borderRadius: '24px' }}>
          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
            <Syringe size={16} color="var(--primary)" /> Insulina
          </h4>
          {lastInsulin ? (
            <div>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>{lastInsulin.dose}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: '4px' }}>U</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                {lastInsulin.type.replace('_', ' ')}
              </div>
            </div>
          ) : <p style={{ fontSize: '0.85rem' }}>-</p>}
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onLogGlucose} className="btn-primary" style={{ padding: '16px 8px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <Plus size={24} /> <span style={{ fontSize: '0.8rem' }}>Glucemia</span>
        </button>
        <button onClick={onLogInsulin} style={{ padding: '16px 8px', borderRadius: '20px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', border: 'none' }}>
          <Syringe size={24} /> <span style={{ fontSize: '0.8rem' }}>Insulina</span>
        </button>
        <button onClick={onLogMeal} style={{ padding: '16px 8px', borderRadius: '20px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', border: 'none' }}>
          <Utensils size={24} /> <span style={{ fontSize: '0.8rem' }}>Comida</span>
        </button>
      </div>

      <section className="glass" style={{ padding: '20px', borderRadius: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Tendencia</h3>
        <div style={{ height: '180px' }}>
          {glucoseEntries.length > 0 ? (
             <Line data={chartData} options={chartOptions} />
          ) : (
             <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={48} opacity={0.2} />
             </div>
          )}
        </div>
      </section>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

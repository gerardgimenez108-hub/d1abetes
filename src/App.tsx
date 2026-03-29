import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import GlucoseLog from './pages/GlucoseLog';
import MealLog from './pages/MealLog';
import InsulinLog from './pages/InsulinLog';
import Education from './pages/Education';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import { useAppContext } from './contexts/AppContext';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showGlucoseLog, setShowGlucoseLog] = useState(false);
  const [showMealLog, setShowMealLog] = useState(false);
  const [showInsulinLog, setShowInsulinLog] = useState(false);
  const { loading } = useAppContext();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          onLogGlucose={() => setShowGlucoseLog(true)} 
          onLogMeal={() => setShowMealLog(true)}
          onLogInsulin={() => setShowInsulinLog(true)}
        />;
      case 'education':
        return <Education />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard 
          onLogGlucose={() => setShowGlucoseLog(true)} 
          onLogMeal={() => setShowMealLog(true)}
          onLogInsulin={() => setShowInsulinLog(true)}
        />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      {renderContent()}
      {showGlucoseLog && <GlucoseLog onClose={() => setShowGlucoseLog(false)} />}
      {showMealLog && <MealLog onClose={() => setShowMealLog(false)} />}
      {showInsulinLog && <InsulinLog onClose={() => setShowInsulinLog(false)} />}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;

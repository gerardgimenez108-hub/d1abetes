import React from 'react';
import { LayoutDashboard, Utensils, BookOpen, BarChart3, Settings as SettingsIcon } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' },
    { id: 'meals', icon: Utensils, label: 'Comidas' },
    { id: 'education', icon: BookOpen, label: 'Aprender' },
    { id: 'reports', icon: BarChart3, label: 'Informes' },
    { id: 'settings', icon: SettingsIcon, label: 'Config' },
  ];

  return (
    <nav className="glass" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '80px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 1000,
      borderRadius: '24px 24px 0 0',
      borderTop: '1px solid rgba(255,255,255,0.3)'
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-light)',
              padding: '8px',
              gap: '4px',
              fontSize: '0.75rem',
              border: 'none',
              transform: 'none'
            }}
          >
            <Icon size={isActive ? 28 : 24} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;

import React from 'react';
import { LayoutDashboard, Utensils, BookOpen, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <nav className="glass-panel" style={{
      position: 'fixed',
      bottom: '16px',
      left: '16px',
      right: '16px',
      height: '70px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 1000,
      borderRadius: '24px',
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              padding: '8px',
              gap: '2px',
              fontSize: '0.7rem',
              border: 'none',
              boxShadow: 'none',
              transition: 'color 0.3s ease'
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="active-bg"
                style={{
                  position: 'absolute',
                  top: '0',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  backgroundColor: 'var(--accent-glow)',
                  borderRadius: '16px',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{ fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;

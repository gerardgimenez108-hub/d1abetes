import React, { useState } from 'react';
import knowledgeData from '../knowledge/knowledgeBase.json';
import { ChevronRight, BookOpen, ArrowLeft, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Education: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container"
    >
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary)', marginBottom: '4px' }}>Educación</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tu guía interactiva para el control</p>
      </header>

      <AnimatePresence mode="wait">
        {selectedTopic ? (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel" 
            style={{ padding: '32px' }}
          >
            <button 
              onClick={() => setSelectedTopic(null)} 
              className="btn-ghost" 
              style={{ marginBottom: '24px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
            >
              <ArrowLeft size={20} /> Volver al listado
            </button>
            <h2 style={{ fontSize: '2rem', marginBottom: '24px', color: 'var(--primary)' }}>{selectedTopic.title}</h2>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
               <button 
                 onClick={() => speak(selectedTopic.content)} 
                 className="btn-primary" 
                 style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '16px' }}
               >
                  <Headphones size={20} /> Escuchar Audio
               </button>
            </div>

            <div style={{ lineHeight: '1.8', fontSize: '1.15rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap', marginBottom: '32px' }}>
              {selectedTopic.content}
            </div>

            <footer style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={16} color="var(--text-muted)" />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Fuente: {selectedTopic.source}
              </p>
            </footer>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {knowledgeData.map((topic, i) => (
              <motion.div 
                key={topic.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedTopic(topic)}
                className="glass-panel" 
                style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: 'var(--primary)', padding: '14px', borderRadius: '18px' }}>
                    <BookOpen color="white" size={24} />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{topic.title}</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Toca para leer más</p>
                  </div>
                </div>
                <ChevronRight color="var(--primary)" size={24} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Education;

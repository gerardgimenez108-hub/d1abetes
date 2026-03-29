import React, { useState } from 'react';
import knowledgeData from '../knowledge/knowledgeBase.json';
import { Volume2, ChevronRight, BookOpen } from 'lucide-react';

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
    <div className="container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--primary)' }}>Aprender</h1>
        <p style={{ color: 'var(--text-light)' }}>Guía médica y recomendaciones</p>
      </header>

      {selectedTopic ? (
        <div className="glass" style={{ padding: '24px', borderRadius: '24px' }}>
          <button onClick={() => setSelectedTopic(null)} className="btn-ghost" style={{ marginBottom: '16px', padding: 0 }}>← Volver</button>
          <h2 style={{ marginBottom: '16px' }}>{selectedTopic.title}</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
             <button onClick={() => speak(selectedTopic.content)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
                <Volume2 size={20} /> Escuchar
             </button>
          </div>
          <div style={{ lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap', marginBottom: '24px' }}>
            {selectedTopic.content}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            Fuente: {selectedTopic.source}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {knowledgeData.map(topic => (
            <div 
              key={topic.id} 
              onClick={() => setSelectedTopic(topic)}
              className="glass" 
              style={{ padding: '20px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: '#e0f2fe', padding: '12px', borderRadius: '16px' }}>
                  <BookOpen color="var(--primary)" size={24} />
                </div>
                <span style={{ fontWeight: 600 }}>{topic.title}</span>
              </div>
              <ChevronRight color="var(--text-light)" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Education;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const INTEGRATIONS = [
  { icon: '⚡', title: 'Dynamic Surge Engine', desc: 'Prices adjust autonomously based on historical velocity and real-time area demand.', color: 'var(--primary)' },
  { icon: '📍', title: 'Live Latency Mapping', desc: 'Geolocation pinpoints your trajectory to find the absolute closest terminal in under 5ms.', color: 'var(--accent)' },
  { icon: '🔒', title: 'Cryptographic Locking', desc: 'When initiated, the slot is locked system-wide for 5 minutes. Zero double-booking collisions.', color: 'var(--warning)' },
  { icon: '🧠', title: 'Predictive Routing', desc: 'AI analyzes your terminal velocity and booking hashes to suggest optimal daily layouts.', color: 'var(--secondary)' },
  { icon: '📊', title: 'Owner Analytics', desc: 'Visualize volume and compute heatmaps directly injected into your dashboard.', color: 'var(--info)' },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page bg-gradient-mesh min-h-screen">
      {/* Hero Section */}
      <section className="hero-section text-center relative overflow-hidden" style={{ paddingTop: '120px', paddingBottom: '6rem' }}>
        <div className="animate-pulse-glow" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%', filter: 'blur(100px)', zIndex: -1, pointerEvents: 'none' }}></div>
        
        <div className="container relative z-10 animate-slide-up">
          <div className="badge badge-info mb-8 animate-float" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            ParkSmart Next-Gen Architecture
          </div>
          <h1 className="hero-title font-black mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Infrastructure designed <br/>
            to move <span className="text-primary text-gradient">frictionlessly</span>.
          </h1>
          <p className="hero-subtitle text-lg text-muted mb-8 max-w-2xl mx-auto" style={{ lineHeight: 1.6 }}>
            A high-performance parking engine built on top-tier stack methodologies. 
            Real-time availability locking, distributed smart-pricing networks, and lightning-fast terminal routing.
          </p>
          <div className="hero-actions flex justify-center gap-4 py-4">
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary shadow-xl animate-bounce-in" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Initialize Terminal
            </button>
            <button onClick={() => navigate('/add-parking')} className="btn btn-outline glass" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Deploy Infrastructure
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="how-it-works relative" style={{ padding: '5rem 0' }}>
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-slide-up stagger-1">
            <h4 className="font-black text-secondary mb-2" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Architecture</h4>
            <h2 className="text-4xl font-black text-main">System Paradigms</h2>
          </div>

          <div className="grid md-grid-cols-2 lg-grid-cols-3 gap-6 relative z-10">
            {/* Find a Spot */}
            <div className="card glass card-hover animate-slide-up stagger-2" style={{ borderTop: '4px solid var(--primary)' }}>
              <div className="text-4xl mb-4">🛰️</div>
              <h3 className="text-xl font-bold mb-2">Global Search</h3>
              <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>Instantly query the decentralized database for available terminals near your active trajectory.</p>
            </div>

            <div className="card glass card-hover animate-slide-up stagger-3" style={{ borderTop: '4px solid var(--secondary)' }}>
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-2">Thread-Safe Locking</h3>
              <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>Distributed state ensures nodes are locked strictly for 5 minutes during transaction processing.</p>
            </div>

            <div className="card glass card-hover animate-slide-up stagger-4" style={{ borderTop: '4px solid var(--accent)' }}>
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-2">Zero-Latency Pay</h3>
              <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>Secure protocol execution with automated cryptographic PDF invoice generation upon completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Tech Grid */}
      <section className="features-section relative overflow-hidden" style={{ padding: '5rem 0' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '600px', height: '600px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%', filter: 'blur(120px)', zIndex: -1, pointerEvents: 'none' }}></div>

        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-slide-up">
            <h4 className="font-black text-accent mb-2" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Platform Scale</h4>
            <h2 className="text-4xl font-black text-main">Production-Ready Matrix</h2>
          </div>

          <div className="grid md-grid-cols-2 gap-8">
            {INTEGRATIONS.map((feat, idx) => (
              <div key={idx} className={`p-6 card glass card-hover animate-slide-up stagger-${(idx % 5) + 1} flex items-start`} style={{ gap: '1.5rem' }}>
                <div className="text-3xl" style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'var(--surface-color)', color: feat.color, boxShadow: 'var(--shadow-soft)' }}>
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">{feat.title}</h3>
                  <p className="text-muted" style={{ lineHeight: 1.6 }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

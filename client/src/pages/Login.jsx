import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Login.css';

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'DRIVER' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        showToast(`Welcome back, ${formData.email.split('@')[0]}! 🎉`, 'success');
      } else {
        await register(formData);
        showToast(`Account created! Welcome to ParkSmart 🚗`, 'success');
      }
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err?.response?.data?.msg || (mode === 'login' ? 'Invalid credentials' : 'Registration failed. Email may be in use.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const DEMO_ACCOUNTS = [
    { label: 'Driver Demo', email: 'driver@demo.com', pass: 'demo123', className: 'demo-btn btn-driver' },
    { label: 'Owner Demo', email: 'owner@demo.com', pass: 'demo123', className: 'demo-btn btn-owner' },
    { label: 'Admin Demo', email: 'admin@demo.com', pass: 'admin123', className: 'demo-btn btn-admin' },
  ];

  return (
    <div className="login-page bg-gradient-mesh">
      {/* Background blobs */}
      <div className="blob blob-blue animate-float" />
      <div className="blob blob-purple animate-pulse-glow" style={{ animationDuration: '5s' }} />

      <div className="login-container z-index-10 animate-zoom">
        <div className="glass login-card">
          {/* Mode toggle */}
          <div className="login-tabs">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`login-tab ${mode === m ? 'active' : ''}`}
              >
                {m === 'login' ? '🔑 Access Node' : '✨ Initialize Cluster'}
              </button>
            ))}
          </div>

          <div className="login-form-container">
            <div className="text-center mb-8 animate-slide-up stagger-1">
              <div className="login-logo">🅿️</div>
              <h2 className="text-3xl font-black">{mode === 'login' ? 'Authentication' : 'Registration Platform'}</h2>
              <p className="text-sm text-muted mt-2">{mode === 'login' ? 'Securely access your terminal dashboard' : 'Provision a new identity directly on the chain'}</p>
            </div>

            {mode === 'login' && (
              <div className="demo-accounts mb-6 animate-slide-up stagger-2">
                <p className="demo-label">Dev Overrides</p>
                <div className="demo-grid">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, email: acc.email, password: acc.pass });
                        showToast(`Injected ${acc.label}`, 'info');
                      }}
                      className={acc.className}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="login-form animate-slide-up stagger-3">
              {mode === 'register' && (
                <>
                  <div className="input-group">
                    <label className="input-label">Identity Hash (Name)</label>
                    <input name="name" value={formData.name} onChange={onChange} className="input-field" placeholder="Jane Doe" required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Mobile Vector (Phone)</label>
                    <input name="phone" value={formData.phone} onChange={onChange} className="input-field" placeholder="+91 00000 00000" />
                  </div>
                </>
              )}

              <div className="input-group">
                <label className="input-label">Communication Protocol (Email)</label>
                <input type="email" name="email" value={formData.email} onChange={onChange} className="input-field" placeholder="node@network.com" required />
              </div>

              <div className="input-group">
                <label className="input-label">Cryptographic Key (Password)</label>
                <input type="password" name="password" value={formData.password} onChange={onChange} className="input-field" placeholder="••••••••" required />
              </div>

              {mode === 'register' && (
                <div className="role-selection mb-6">
                  <label className="input-label">Node Designation</label>
                  <div className="role-grid">
                    {[
                      { value: 'DRIVER', icon: '🚗', label: 'Navigator', sub: 'I will consume slots' },
                      { value: 'OWNER', icon: '🏠', label: 'Host', sub: 'I will provision slots' },
                    ].map((r) => (
                      <label key={r.value} className={`role-card ${formData.role === r.value ? 'active' : ''}`}>
                        <input type="radio" name="role" value={r.value} checked={formData.role === r.value} onChange={onChange} className="hidden" />
                        <div className="role-icon">{r.icon}</div>
                        <div className="role-title">{r.label}</div>
                        <div className="role-sub">{r.sub}</div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary shadow-xl submit-btn mt-4 w-full text-lg">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="spinner" />
                    {mode === 'login' ? 'Authenticating...' : 'Compiling...'}
                  </span>
                ) : (
                  mode === 'login' ? 'Establish Connection →' : 'Deploy Identity →'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-muted mt-8 animate-slide-up stagger-4">
              {mode === 'login' ? "Require access?" : 'Already provisioned?'}
              <button type="button" onClick={(e) => { e.preventDefault(); setMode(mode === 'login' ? 'register' : 'login'); }} className="switch-mode-btn">
                {mode === 'login' ? 'Request permissions' : 'Authenticate'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

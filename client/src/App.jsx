import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SlotDetails from './pages/SlotDetails';
import BookingPage from './pages/BookingPage';
import Payment from './pages/Payment';
import AddParking from './pages/AddParking';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import MyBookings from './pages/MyBookings';
import './index.css';

const RouterWrapper = () => {
  const location = useLocation();
  
  return (
    <div key={location.pathname} className="animate-fade w-full h-full">
      <Routes location={location}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected: Any authenticated user */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/slot/:id" element={
          <ProtectedRoute>
            <SlotDetails />
          </ProtectedRoute>
        } />
        <Route path="/book/:slotId" element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } />

        {/* Protected: Owner only */}
        <Route path="/add-parking" element={
          <ProtectedRoute roles={['OWNER', 'ADMIN']}>
            <AddParking />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={
          <div className="flex justify-center flex-col items-center min-h-screen text-center pt-header">
            <div>
              <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }}>🅿️</div>
              <h1 className="text-4xl font-black mb-4">404 — Not Found</h1>
              <a href="/" className="text-primary font-semibold">Go Home →</a>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Navbar />
            <main className="flex-1 w-full bg-gradient-mesh" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <RouterWrapper />
            </main>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

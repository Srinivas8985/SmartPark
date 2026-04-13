// Register redirects to Login (which has combined auth toggle)
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login?mode=register', { replace: true });
  }, [navigate]);
  return null;
};

export default Register;

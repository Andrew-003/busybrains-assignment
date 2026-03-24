import React, { useState } from 'react';
import '../styles/App.css';

const PasswordInput = ({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required, 
  minLength, 
  autoComplete 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-input-container">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="password-input"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="password-toggle-btn"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? 'X' : '👁️‍🗨️'}
      </button>
    </div>
  );
};

export default PasswordInput;

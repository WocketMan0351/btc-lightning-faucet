import React from 'react';
import './text-input.styles.css';

export const TextInput = ({ placeHolder, handleChange }) => {
  return (
    <input type='number' placeholder={placeHolder} onChange={handleChange} />
  );
};

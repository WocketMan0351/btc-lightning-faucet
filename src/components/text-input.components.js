import React from 'react';
import './text-input.styles.css';

const TextInput = ({ placeHolder, handleChange }) => {
  return <input type='number' placeholder={placeHolder} onChange={handleChange} />;
};

export default TextInput;

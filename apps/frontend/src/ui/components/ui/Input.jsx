import React from "react";
import './input.css'

const Input = ({ label, error, hint, id, ...props }) => {
  const inputId = id || props.name;
  return (
    <div className="ui-field">
      {label && <label htmlFor={inputId} className="ui-label">{label}</label>}
      <input id={inputId} className={`ui-input ${error ? 'is-error' : ''}`} {...props} />
      {error ? (
        <div className="ui-error" role="alert">{error}</div>
      ) : hint ? (
        <div className="ui-hint">{hint}</div>
      ) : null}
    </div>
  );
};

export default Input;


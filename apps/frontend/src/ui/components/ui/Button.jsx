import React from "react";
import './button.css'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  iconLeft = null,
  iconRight = null,
  ...props
}) => {
  const cls = [
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    full ? 'ui-btn--full' : ''
  ].join(' ');

  return (
    <button className={cls} {...props}>
      {iconLeft && <span className="ui-btn__icon">{iconLeft}</span>}
      <span className="ui-btn__label">{children}</span>
      {iconRight && <span className="ui-btn__icon">{iconRight}</span>}
    </button>
  );
}

export default Button;


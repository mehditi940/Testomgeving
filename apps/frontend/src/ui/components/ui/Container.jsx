import React from "react";
import './container.css'

const Container = ({ size = 'lg', children, style }) => {
  const cls = `ui-container ui-container--${size}`;
  return (
    <div className={cls} style={style}>{children}</div>
  );
};

export default Container;


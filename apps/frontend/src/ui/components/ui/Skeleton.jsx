import React from "react";
import './skeleton.css'

const Skeleton = ({ lines = 3 }) => {
  return (
    <div className="ui-skeleton">
      {Array.from({ length: lines }).map((_, i) => (
        <div className="ui-skeleton__line" key={i} />
      ))}
    </div>
  );
};

export default Skeleton;


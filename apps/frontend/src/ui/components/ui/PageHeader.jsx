import React from "react";
import './pageheader.css'

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="ui-pageheader">
      <div className="ui-pageheader__titles">
        <h1>{title}</h1>
        {subtitle && <p className="ui-pageheader__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="ui-pageheader__actions">{actions}</div>}
    </div>
  );
};

export default PageHeader;


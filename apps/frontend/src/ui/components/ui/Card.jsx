import React from "react";
import './card.css'

const Card = ({ title, subtitle, actions, children }) => {
  return (
    <section className="ui-card">
      {(title || actions) && (
        <div className="ui-card__header">
          <div>
            {title && <h3 className="ui-card__title">{title}</h3>}
            {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="ui-card__actions">{actions}</div>}
        </div>
      )}
      <div className="ui-card__body">{children}</div>
    </section>
  );
}

export default Card;


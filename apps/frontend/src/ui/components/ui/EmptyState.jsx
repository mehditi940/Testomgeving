import React from "react";
import './emptystate.css'

const EmptyState = ({ icon = 'bi bi-inboxes', title = 'Nog niets geselecteerd', description = 'Selecteer een item in de lijst of maak een nieuw item aan.', action = null }) => {
  return (
    <div className="ui-emptystate">
      <i className={`${icon} ui-emptystate__icon`} aria-hidden="true"></i>
      <h3 className="ui-emptystate__title">{title}</h3>
      <p className="ui-emptystate__desc">{description}</p>
      {action}
    </div>
  );
}

export default EmptyState;


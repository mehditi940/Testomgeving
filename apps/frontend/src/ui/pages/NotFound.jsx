import React from "react";

const NotFound = () => {
  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "10vh auto", textAlign: "center" }}>
      <h1>Pagina niet gevonden</h1>
      <p>De opgevraagde pagina bestaat niet of is verplaatst.</p>
      <a href="/">
        <button>Terug naar home</button>
      </a>
    </div>
  );
};

export default NotFound;


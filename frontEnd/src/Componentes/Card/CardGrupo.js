import React from "react";
import PropTypes from "prop-types";

import "./Card.css";

function CardJuego({ id, imagen, nombre, juegos, estudiantes}) {
  return (
    <div className="card bg-dark animate__animated animate__fadeInUp mb-3 h-100">
      <div className="overflow">
        <img src={imagen} alt="a wallpaper" className="card-img-top" />
      </div>
      <div className="card-body">
        <h4 className="card-title text-light text-start text-wrap">
          {nombre}
        </h4> 
      </div>
      <div className="card-footer">
        <small className="text-muted">
          <div className="d-flex justify-content-between">
            <p>{juegos} juegos</p>
            <p>{estudiantes} participantes</p>
          </div>
        </small>
      </div>
    </div>
  );
}

CardJuego.propTypes = {
  id: PropTypes.string.isRequired,
  imagen: PropTypes.string,
  nombre: PropTypes.string,
  juegos: PropTypes.number,
  estudiantes: PropTypes.number
};

export default CardJuego;

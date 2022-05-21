import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import 'moment/locale/es'

import "./Card.css";

function CardJuego({ imageSource, juego, grupo, estado, url, fecha }) {
  let msg = "";
  if (estado) {
    msg = "Abierto Hasta";
  }
  else {
    msg = "Cerrado Desde";
  }
  moment.locale('es')
  let fechaA = moment(new Date(fecha)).format('L');
  let hora = moment(new Date(fecha)).format('LT');

  return (
    <div className="card bg-dark animate__animated animate__fadeInUp mb-3 h-100">
      <div className="overflow">
        <img src={imageSource} alt="a wallpaper" className="card-img-top" />
      </div>
      <div className="card-body">
        <h4 className="card-title text-light text-start">
          {juego}
        </h4>
        <p className="card-text text-secondary text-sm-start text-wrap">
          {grupo ? grupo : "Sin Grupo"}
        </p>
      </div>
      <div className="card-footer">
        <small className="text-muted">
          <div className="d-flex justify-content-between">
            <p>{msg}</p>
            <div className="d-flex flex-row-reverse bd-highlight">
              <p className="mx-2">{hora}</p>
              <p>{fechaA}</p>
            </div>
          </div>
        </small>
      </div>
    </div>
  );
}

CardJuego.propTypes = {
  juego: PropTypes.string.isRequired,
  grupo: PropTypes.string,
  estado: PropTypes.bool,
  url: PropTypes.string,
  fecha: PropTypes.string
};

export default CardJuego;
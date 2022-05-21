import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import axios from "axios";
import "moment/locale/es";

import "./Card.css";

function CardTrivia({ id, imagen, nombre, fecha_creacion }) {
  const [cantidadPreguntas, setCantidadPreguntas] = useState();
  axios
    .post("/extraerPreguntas/" + id, {
      idTrivia: id,
    })
    .then(function (res) {
      if (res.data != []) {
        setCantidadPreguntas(res.data.length);
      }
    });

  moment.locale("es");
  let fechaA = moment(new Date(fecha_creacion)).format("L");
  let hora = moment(new Date(fecha_creacion)).format("LT");

  return (
    <div className="card bg-dark animate__animated animate__fadeInUp mb-3 h-100">
      <div className="overflow">
        <img src={imagen} alt="a wallpaper" className="card-img-top" />
      </div>
      <div className="card-body">
        <h4 className="card-title text-light text-start text-wrap">{nombre}</h4>
        <h6 className="card-title text-secondary text-start text-wrap">
          {cantidadPreguntas} Preguntas
        </h6>
      </div>
      <div className="card-footer">
        <small className="text-muted">
          <div className="d-flex justify-content-between">
            <p>Fecha Creación: </p>
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

CardTrivia.propTypes = {
  id: PropTypes.string.isRequired,
  imagen: PropTypes.string,
  nombre: PropTypes.string,
  preguntas: PropTypes.number,
  fecha_creacion: PropTypes.string,
};

export default CardTrivia;

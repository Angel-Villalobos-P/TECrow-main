import React from "react";
import { Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; //biblioteca

function CardSalaJuego({ icono, titulo, descripcion, color }) {
  return (
    <div className="h-100">
      <Row className="justify-content-center align-items-center">
        <FontAwesomeIcon
          icon={icono}
          size="8x"
          style={{ color: color, marginTop: "0.2em" }}
        />
        {/* <img src={icono} alt="a wallpaper" className="card-img-top" /> */}
      </Row>
      <div className="card-body">
        <h3
          className="card-title text-dark text-wrap"
          style={{ fontWeight: "normal" }}
        >
          {titulo}
        </h3>
        <h4
          className="card-title text-dark text-wrap"
          style={{ fontWeight: "lighter" }}
        >
          {descripcion}
        </h4>
      </div>
    </div>
  );
}

export default CardSalaJuego;

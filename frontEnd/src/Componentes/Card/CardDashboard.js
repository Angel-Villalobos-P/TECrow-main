import React from "react";
import PropTypes from "prop-types";

import "./Card.css";

function CardDashbord({ imageSource, titulo, descripcion, cantidad, url, imageHeight }) {
    return (
        <div className="card bg-dark animate__animated animate__fadeInUp mb-3 h-100">
            <div className="overflow">
                {imageHeight != null
                    ? <img src={imageSource} height={imageHeight} alt="a wallpaper" className="card-img-top" />
                    : <img src={imageSource} alt="a wallpaper" className="card-img-top" />
                }
            </div>
            <div className="card-body">
                <h4 className="card-title text-light text-start">
                    {titulo}
                </h4>
                <p className="card-text text-secondary text-sm-start">
                    {descripcion}
                </p>
            </div>
            <div className="card-footer">
                <small className="text-muted">
                    <div className="d-flex justify-content-between">
                        <p>{cantidad}</p>
                    </div>
                </small>
            </div>
        </div>
    );
}

CardDashbord.propTypes = {
    titulo: PropTypes.string.isRequired,
    text: PropTypes.string,
    cantidad: PropTypes.string,
    url: PropTypes.string,
    imageSource: PropTypes.string
};

export default CardDashbord;
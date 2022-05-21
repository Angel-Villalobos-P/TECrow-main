import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import "./CardAgregar.css";

const CardAgregar = ({seccion}) => {
  return (
    <div className="card bg-dark animate__animated animate__fadeInUp mb-3 h-100">
      <div>
        
      </div>
      <div className="card-body">
        <div className="row">
          <h4 className="card-title-ca">
            <FontAwesomeIcon icon={faPlusCircle} />
          </h4>
        </div>
        <div className="row">
          <h4 className="card-title text-light text-wrap">
              {seccion}
        </h4>
        </div>
      </div>
    </div>
  );
};

export default CardAgregar;
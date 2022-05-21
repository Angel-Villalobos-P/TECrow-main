import React, { Component } from 'react'
import { Link } from "react-router-dom";

//icon imports
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
//fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, Form, FormGroup, Label, Input, FormText, Container, Col, Row, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle} from 'reactstrap';

class estandares extends Component {
    render() {
        return (
            <>
                <Container className="my-5" >
                    <Row>
                        <Container style={{ display: "inline-flex" }}>
                            <Link className="link" to="/Trivias">
                                <FontAwesomeIcon
                                    className="homeLink"
                                    style={{ marginRight: "0.5em" }}
                                    icon={faArrowCircleLeft}
                                    size="2x"
                                />
                            </Link>
                            <h3>Crear Trivia</h3>
                        </Container>
                    </Row>

                    <hr style={{
                        color: '#000000',
                        backgroundColor: '#000000',
                        height: .5,
                        borderColor: '#000000',
                        border: 3
                    }} />

                    <Row className="justify-content-center">
                        <Col xs="6">
                            <Card>
                                <CardImg top width="100%" src="https://raw.githubusercontent.com/FaztWeb/react-cards-bootstrap/main/src/assets/image2.jpg" alt="Card image cap" />
                                <CardBody>
                                    <CardBody>
                                        <CardTitle tag="h5">Card title</CardTitle>
                                        <CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle>
                                    </CardBody>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default estandares;
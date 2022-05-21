import React, { Component } from "react";
import { Alert, Card, CardImg, CardBody, CardFooter } from "reactstrap";
import "./imageLoader.css";

class ImageLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgPreview: "",
      error: false,
      firstLoad: true,
    };

    this.handleImageChange = this.handleImageChange.bind(this);
    this.btnDeleteImg = this.btnDeleteImg.bind(this);
    console.log(this.state.imgPreview);
    console.log(this.props);
  }

  handleImageChange = (e) => {
    const selected = e.target.files[0];
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "imgae/jpg"];
    if (selected && ALLOWED_TYPES.includes(selected.type)) {
      let reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ imgPreview: reader.result });
        this.state.imgPreview = reader.result;
        this.props.setImgPath(reader.result);
      };
      reader.readAsDataURL(selected);
      this.setState({ firstLoad: false });
      this.setState({ error: false });
    } else {
      this.setState({ error: true });
    }
  };

  btnDeleteImg = (e) => {
    this.setState({ imgPreview: null });
    this.setState({ firstLoad: false });

    this.props.setImgPath(null);
  };

  render() {
    if (this.state.firstLoad && this.props.imagen !== undefined) {
      this.state.imgPreview = this.props.imagen;
    }
    return (
      <>
        <Card>
          {this.state.imgPreview ? (
            <>
              {" "}
              <CardImg
                src={this.state.imgPreview}
                className="card-img-top-imgloader"
              />
              <button className="btnEliminarImg" onClick={this.btnDeleteImg}>
                Eliminar imagen
              </button>
            </>
          ) : null}

          {!this.state.imgPreview ? (
            <CardBody
              className="imgPreview"
              style={{
                background: this.state.imgPreview ? (
                  <CardImg
                    src={this.state.imgPreview}
                    className="card-img-top-imgloader"
                  />
                ) : (
                  "#F1F1F1"
                ),
              }}
            >
              {!this.state.imgPreview && (
                <CardBody>
                  <label htmlFor="fileUpload" className="customFileUpload">
                    Insertar imagen
                  </label>
                  <input
                    type="file"
                    id="fileUpload"
                    onChange={this.handleImageChange}
                  />
                  <br />
                  <span>(jpg, jpeg or png)</span>
                </CardBody>
              )}
            </CardBody>
          ) : null}
          {this.state.error && (
            <CardFooter>
              {this.state.error && (
                <Alert color="danger" className="errorMsg">
                  Formato de imagen no vÃ¡lido. Intente nuevamente.
                </Alert>
              )}
            </CardFooter>
          )}
        </Card>
      </>
    );
  }
}

export default ImageLoader;

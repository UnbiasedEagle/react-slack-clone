import React, { Component } from "react";
import mime from "mime-types";

class FileModal extends Component {
  state = {
    file: null,
    allowedFileTypes: ["image/jpeg", "image/png"],
  };

  addFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({
        file,
      });
    }
  };

  sendFile = () => {
    const { file } = this.state;
    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        this.props.uploadFile(file, metadata);
        this.props.modalClose();
        this.clearFile();
      }
    }
  };

  clearFile = () => {
    this.setState({
      file: null,
    });
  };

  isAuthorized = (fileName) => {
    if (this.state.allowedFileTypes.includes(mime.lookup(fileName))) {
      return true;
    }
    return false;
  };

  render() {
    const { modalClose } = this.props;
    return (
      <div
        className="modal fade"
        id="mediaModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Select an Image File
              </h5>
              <button
                onClick={modalClose}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      File types: jpg, png
                    </span>
                  </div>
                  <input
                    type="file"
                    name="file"
                    onChange={this.addFile}
                    className="form-control"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                onClick={this.sendFile}
                type="button"
                className="btn btn-success"
                data-dismiss="modal"
              >
                <i style={{ marginRight: "4px" }} className="fas fa-check"></i>
                Send
              </button>
              <button
                onClick={modalClose}
                type="button"
                data-dismiss="modal"
                aria-label="Close"
                className="btn btn-danger"
              >
                <i style={{ marginRight: "4px" }} className="fas fa-times"></i>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FileModal;

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../../firebase/firebase";

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: [],
    });
  };

  isFormValid = () => {
    let error;
    if (!this.state.email || !this.state.password) {
      error = "Please enter all the fields";
      this.setState({
        errors: [{ message: error }],
      });
      return false;
    }
    return true;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.isFormValid()) {
      this.setState({
        errors: [],
        loading: true,
      });
      auth
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((currentUser) => {
          this.setState({
            loading: false,
          });
        })
        .catch((err) => {
          this.setState({
            errors: [err],
            loading: false,
          });
        });
    }
  };

  handleInputError = (errors, inputName) => {
    const isInvalidInput = errors.some((err) => {
      return err.message.toLowerCase().includes(inputName);
    });
    return isInvalidInput ? "is-invalid" : "";
  };

  displayErrors = (errors) => {
    return errors.map((error, idx) => {
      return (
        <p style={{ margin: "0", fontSize: "16px" }} key={idx}>
          {error.message}
        </p>
      );
    });
  };

  render() {
    const { email, password, errors, loading } = this.state;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
        className="row"
      >
        <div className="col-md-4">
          <div className="text-center mb-3">
            <i
              style={{ fontSize: "8rem" }}
              className="fas fa-comments text-info"
            ></i>
          </div>
          <h1 className="text-center text-info mb-2">Login to DevChat</h1>
          <div className="card">
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={this.handleChange}
                    name="email"
                    placeholder="Email Address"
                    className={`form-control ${this.handleInputError(
                      errors,
                      "email"
                    )}`}
                  />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fas fa-lock"></i>
                    </span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={this.handleChange}
                    name="password"
                    placeholder="Password"
                    className={`form-control ${this.handleInputError(
                      errors,
                      "password"
                    )}`}
                  />
                </div>

                <button disabled={loading} className="btn btn-info btn-block">
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            </div>
          </div>
          {errors.length > 0 && (
            <div
              style={{ backgroundColor: "#ff414d" }}
              className="alert mt-2  text-center"
            >
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </div>
          )}
          <div className="card mt-2">
            <div className="card-body text-center">
              <p style={{ fontSize: "1.2rem", margin: 0 }}>
                Don't have an account?
                <Link style={{ marginLeft: "4px" }} to="/register">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

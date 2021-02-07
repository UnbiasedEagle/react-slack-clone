import React, { Component } from "react";
import md5 from "md5";
import { Link } from "react-router-dom";
import { auth, generateUserDocument } from "../../../firebase/firebase";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
  };

  isFormValid = () => {
    const { username, email, password, passwordConfirmation } = this.state;
    let error;

    if (!username || !email || !password || !passwordConfirmation) {
      error = { message: "Please fill in all the fields" };
      this.setState({
        errors: [error],
      });
      return false;
    } else if (password.length < 6 || passwordConfirmation !== password) {
      error = { message: "Password is invalid" };
      this.setState({
        errors: [error],
      });
      return false;
    } else {
      return true;
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: [],
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      const { email, username, password } = this.state;
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((createdUser) => {
          const { user } = createdUser;
          user.updateProfile({
            displayName: username,
            photoURL: `http://gravatar.com/avatar/${md5(
              user.email
            )}?d=identicon`,
          });
          return createdUser;
        })
        .then(async (createdUser) => {
          await generateUserDocument(createdUser.user);
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
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading,
    } = this.state;
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
          <h1 className="text-center text-info mb-2">Register for DevChat</h1>
          <div className="card">
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={this.handleChange}
                    name="username"
                    placeholder="Username"
                    className="form-control"
                  />
                </div>
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
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fas fa-redo"></i>
                    </span>
                  </div>
                  <input
                    onChange={this.handleChange}
                    type="password"
                    value={passwordConfirmation}
                    name="passwordConfirmation"
                    placeholder="Password Confirmation"
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
                Already a user?{" "}
                <Link style={{ marginLeft: "1px" }} to="/login">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;

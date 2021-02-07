import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import { Provider } from "react-redux";
import { auth, generateUserDocument } from "./firebase/firebase";
import store from "./redux/store";
import { connect } from "react-redux";
import { setCurrentUser } from "./redux/user/userActions";
import "./bootstrap.min.css";
import Spinner from "./components/Spinner/Spinner";

class Root extends React.Component {
  unsubscribeFromAuth = null;
  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const user = await generateUserDocument(currentUser);
        this.props.setCurrentUser(user);
        this.props.history.push("/");
      } else {
        this.props.setCurrentUser(null);
        this.props.history.push("/login");
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return this.props.isLoading ? (
      <Spinner></Spinner>
    ) : (
      <Switch>
        <Route exact path="/" component={App}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/register" component={Register}></Route>
      </Switch>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.user.isLoading,
  };
};

const RootWithAuth = connect(mapStateToProps, { setCurrentUser })(
  withRouter(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

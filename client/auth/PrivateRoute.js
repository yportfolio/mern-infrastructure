import { Redirect, Route } from "react-router-dom";
import auth from "./auth-helper";

/* 
component in this route will only be loaded when the user is authenticated, 
which is determined by calling the isAuthenticated

if user didn't pass authenticated,
redirected to Signin component
*/
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default PrivateRoute;

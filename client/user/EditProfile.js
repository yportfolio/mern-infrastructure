import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import auth from "./../auth/auth-helper";
import { read, update } from "./api-user.js";
import { Redirect } from "react-router-dom";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
  },
  error: {
    verticalAlign: "middle",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
}));

export default function EditProfile({ match }) {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    open: false,
    error: "",
    redirectToProfile: false,
    about: "",
    photo: "",
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const clickSubmit = () => {
    let userData = new FormData();
    values.name && userData.append("name", values.name);
    values.email && userData.append("email", values.email);
    values.password && userData.append("password", values.password);
    values.about && userData.append("about", values.about);
    values.photo && userData.append("photo", values.photo);

    update(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      userData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, userId: data._id, redirectToProfile: true });
      }
    });
  };

  /*   
  Handle all event here
 */
  const handleEvent = (props) => (event) => {
    switch (event.type) {
      //Handle input event
      case "change":
        const value =
          props === "photo" ? event.target.files[0] : event.target.value;
        setValues({ ...values, [props]: value });
        break;
      default:
        break;
    }
  };

  if (values.redirectToProfile) {
    return <Redirect to={"/user/" + values.userId} />;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Edit Profile
        </Typography>
        <span>{values.photo ? values.photo.name : ""}</span>
        <input
          id="icon-button-file"
          type="file"
          accept="image/*"
          onChange={handleEvent("photo")}
          style={{ display: "none" }}
        />
        <label htmlFor="icon-button-file">
          <Button variant="contained" color="default" component="span">
            Upload <AddPhotoAlternate />
          </Button>
        </label>
        <TextField
          id="name"
          label="Name"
          className={classes.textField}
          value={values.name}
          onChange={handleEvent("name")}
          margin="normal"
        />
        <br />
        <TextField
          id="multiple-flexible"
          label="About"
          className={classes.textField}
          multiline
          rows="2"
          value={values.about}
          onChange={handleEvent("about")}
          margin="normal"
        />
        <br />
        <TextField
          id="email"
          type="email"
          label="Email"
          className={classes.textField}
          value={values.email}
          onChange={handleEvent("email")}
          margin="normal"
        />
        <br />
        <TextField
          id="password"
          type="password"
          label="Password"
          className={classes.textField}
          value={values.password}
          onChange={handleEvent("password")}
          margin="normal"
        />
        <br />
        {values.error && (
          <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>
              error
            </Icon>
            {values.error}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={clickSubmit}
          className={classes.submit}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import unicornbikeImg from "./../assets/images/unicornbike.jpg";
import FindPeople from "../user/FindPeople";
import Grid from "@material-ui/core/Grid";
import auth from "../auth/auth-helper";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.text.secondary,
  },
  media: {
    minHeight: 400,
  },
  credit: {
    padding: 10,
    textAlign: "right",
    backgroundColor: "#ededed",
    borderBottom: "1px solid #d0d0d0",
    "& a": {
      color: "#3f4771",
    },
  },
}));

const signin = auth.isAuthenticated();

export default function Home() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <Typography variant="h6" className={classes.title}>
          Home Page
        </Typography>
        <CardMedia
          className={classes.media}
          image={unicornbikeImg}
          title="Unicorn Bicycle"
        />
        <Typography
          variant="body2"
          component="p"
          className={classes.credit}
          color="textSecondary"
        >
          Photo by
          <a
            href="https://unsplash.com/@boudewijn_huysmans"
            target="_blank"
            rel="noopener noreferrer"
          >
            Boudewijn Huysmans
          </a>
          on Unsplash
        </Typography>
        <CardContent>
          <Typography variant="body1" component="p">
            Welcome to the MERN Infra home page.
          </Typography>
        </CardContent>
      </Card>
      {signin && (
        <Grid container space={8}>
          <Grid item xs={6} sm={5}>
            <FindPeople />
          </Grid>
        </Grid>
      )}
    </div>
  );
}

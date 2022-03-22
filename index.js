const express = require("express");
const helmet = require("helmet");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.get(`/health/isAlive`, (req, res) => res.sendStatus(200));
app.get(`/health/isReady`, (req, res) => res.sendStatus(200));

// Test redirect - videresender til https://sykdom-i-familien.dev.nav.no/familie/sykdom-i-familien
app.get(`${process.env.PUBLIC_PATH}/`, (req, res) => {
  res.redirect(301, process.env.REDIRECT_INGRESS);
});

// Test redirect - videresender til https://sykdom-i-familien.dev.nav.no/familie/sykdom-i-familien/arbeidsgiver
app.get(`${process.env.PUBLIC_PATH}/arbeidsgiver`, (req, res) => {
  res.redirect(301, `${process.env.REDIRECT_INGRESS}/arbeidsgiver`);
});

// Test redirect - videresender til https://sykdom-i-familien.dev.nav.no/familie/sykdom-i-familien/helsepersonell
app.get(`${process.env.PUBLIC_PATH}/helsepersonell`, (req, res) => {
  res.redirect(301, `${process.env.REDIRECT_INGRESS}/helsepersonell`);
});

// Test redirect - videresender til https://sykdom-i-familien.dev.nav.no/familie/sykdom-i-familien/*
/*app.get(`/*`, (req, res) => {
  const redirectPath = req.originalUrl;
  res.redirect(301, `${process.env.REDIRECT_INGRESS}${redirectPath}`);
});*/

app.listen(PORT, () => {
  console.log(`Server has been startet on PORT=${PORT}`);
});

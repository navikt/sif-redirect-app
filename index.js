const express = require("express");
const helmet = require("helmet");
require("dotenv").config();

// Obs! ved bruk av kode 301 - nettlesser lagrer route cache
// Det trenges å slette cache i nettleser eller bruke inkognito mode ved endringer i routes
// issue: Det kan påvirke på brukeren - endringer vil ikke fungere hos brukeren på grunn av cache
// Bruk kode 307 ved test
// Info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301
// Info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307

const STATUS_CODE = 307; // Bruk 301 etter test

const PORT = process.env.PORT || 8080;
const PUBLIC_PATH = process.env.PUBLIC_PATH;
const REDIRECT_HOST = process.env.REDIRECT_HOST;

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.get(`/familie/sykdom-i-familien/health/isAlive`, (req, res) =>
  res.sendStatus(200)
);
app.get(`/familie/sykdom-i-familien/health/isReady`, (req, res) =>
  res.sendStatus(200)
);

app.get(`${PUBLIC_PATH}/`, (req, res) =>
  res.redirect(STATUS_CODE, `${REDIRECT_HOST}/tar-vare-pa`)
);

// Redirect til søknad omsorgsdager-aleneomsorg
// Til test. Kun PROD. Kan testes kun i prod.
// https://www.nav.no/familie/sykdom-i-familien/soknad/omsorgsdager-aleneomsorg

/*
app.get(`${PUBLIC_PATH}/soknad/omsorgsdager-aleneomsorg`, (req, res) => {
  res.redirect(STATUS_CODE, `${REDIRECT_HOST}/[NY INGRESS FOR ALENEOMSØRG DIALOG]}`);
});
*/

// Redirect til søknader
// Kun til prod. Kan testes kun i prod
// https://www.nav.no/familie/sykdom-i-familien/soknad/*

/*
app.get(`${PUBLIC_PATH}/soknad/*`, (req, res) => {
  
  const path = getSoknadRedirectPath(req.originalUrl);

  if (path) {
    res.redirect(STATUS_CODE, `${REDIRECT_HOST}/${path}`);
  } else {
    next();
  }
});
*/

app.get(`${PUBLIC_PATH}/*`, (req, res, next) => {
  const path =
    req.originalUrl !== undefined && req.originalUrl !== null
      ? getRedirectPath(req.originalUrl.toLowerCase())
      : undefined;
  if (path) {
    res.redirect(STATUS_CODE, `${REDIRECT_HOST}/${path}`);
  } else {
    next();
  }
});

const getRedirectPath = (pathFromRequest) => {
  const path = pathFromRequest
    .replace(PUBLIC_PATH, "")
    .replace("/nn", "")
    .replace("/nb", "")
    .replace(/\/$/gi, "");
  switch (path) {
    // For personbruker:
    case "":
      return "tar-vare-pa"; // /nb eller /nn path

    case "/pleiepenger-for-sykt-barn":
      return "pleiepenger-barn";
    case "/pleiepenger-for-personer-over-18-ar":
      return "pleiepenger-over-18";
    case "/pleiepenger-i-livets-sluttfase":
      return "pleiepenger-sluttfase";
    case "/omsorgspenger":
      return "omsorgspenger";
    case "/opplaringspenger":
      return "opplaringspenger";
    //
    // For arbeidsgiver:
    case "/arbeidsgiver":
      return "arbeidsgiver/sykdom-i-familien";

    case "/arbeidsgiver/pleiepenger-for-arbeidsgiver":
      return "arbeidsgiver/pleiepenger-barn";
    case "/arbeidsgiver/pleiepenger-for-person-over-18-ar-arbeidsgivers-rolle":
      return "arbeidsgiver/pleiepenger-over-18";
    case "/arbeidsgiver/pleiepenger-i-livets-sluttfase-arbeidsgivers-rolle":
      return "arbeidsgiver/pleiepenger-i-livets-sluttfase";
    case "/arbeidsgiver/omsorgspenger-for-arbeidsgiver":
      return "arbeidsgiver/omsorgspenger";
    case "/arbeidsgiver/opplaeringspenger-for-arbeidsgiver":
      return "arbeidsgiver/opplaringspenger";
    //
    // For samarbeidspartner:
    case "/helsepersonell":
      return "samarbeidspartner/sykdom-i-familien";

    case "/helsepersonell/pleiepenger-for-sykt-barn-legens-rolle":
      return "samarbeidspartner/pleiepenger-barn";
    case "/helsepersonell/pleiepenger-for-person-over-18-ar-legens-rolle":
      return "samarbeidspartner/pleiepenger-over-18";
    case "/helsepersonell/pleiepenger-i-livets-sluttfase-legens-rolle":
      return "samarbeidspartner/pleiepenger-sluttfase";
    case "/helsepersonell/omsorgspenger-legens-rolle":
      return "samarbeidspartner/omsorgspenger";
    case "/helsepersonell/opplaeringspenger-legens-rolle":
      return "samarbeidspartner/opplaringspenger";
    //
    default:
      return undefined;
  }
};

/*
const getSoknadRedirectPath = (pathFromRequest) => {
  const path = pathFromRequest
    .replace(PUBLIC_PATH, "")
    .replace("/soknad", "");
  
  switch (path) {
    //
    // Søknader
    case "/innsyn":
      return "NEW PATH";
    case "/pleiepenger":
      return "NEW PATH";
    case "/omsorgspenger":
      return "NEW PATH";
    case "/omsorgspengerutbetaling-arbeidstaker":
      return "NEW PATH";
    case "/omsorgspenger":
      return "NEW PATH";
    case "/omsorgspengerutbetaling":
      return "NEW PATH";
    case "/deling-omsorgsdager":
      return "NEW PATH";
    case "/ettersending":
      return "NEW PATH";
    case "/ekstra-omsorgsdager-andre-forelder-ikke-tilsyn":
      return "NEW PATH";

    default:
      return undefined;
  }
};
*/

app.listen(PORT, () => {
  console.log(`Server has been startet on PORT=${PORT}`);
});

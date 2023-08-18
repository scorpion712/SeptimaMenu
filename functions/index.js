const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({origin: true}));

app.use(require("./routes/menu.routes"));

exports.app = functions.https.onRequest(app);

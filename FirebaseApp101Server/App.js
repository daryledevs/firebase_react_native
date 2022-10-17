const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const fastify = require("fastify")({ logger: true, keepAliveTimeout: 5000 });
var cors = require("cors");
const {
  alarmNotification,
  partialNotification,
} = require("./Notification_android.js");
// import { sendAlarmNotification,  sendPartialNotification } from './Notification_android.js';
// import express from 'express';
// import bodyParser from 'body-parser';
// import morgan from 'morgan';
// import mongoose from 'mongoose';
// import Fastify from 'fastify';
// import * as dotenv from "dotenv";
// dotenv.config();
// const fastify = Fastify({
//   logger: true,
//   keepAliveTimeout: 5000,
// });

const app = express();
require("dotenv/config");
app.use(cors());
app.options("*", cors());


app.use(bodyParser.json());
app.use(morgan("tiny"));

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: Number,
});

const Product = mongoose.model("Product", productSchema);

const api = process.env.API_URL;

app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

// Declare a notification route
fastify.get("/notifications", async (request, response) => {
  const body = request.body;
  console.log("body: ", body);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await partialNotification(token);
  process.setMaxListeners(0);
  return "OK";
});

// Declare a alarm route
fastify.post("/alarm", async (request, response) => {
  const body = request.body;
  const { token } = body;
  console.log("token: ", token);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await alarmNotification(token);
  process.setMaxListeners(0);
  return "OK";
});

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Firebase101",
  })
  .then(() => {
    console.log("Database connection is ready!");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log("Server is running now! http://localhost:3000");
});

fastify.listen({ port: 3001 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});

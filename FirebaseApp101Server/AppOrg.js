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

require("dotenv/config");
const app = express();
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
  const products = await Product.find();
  if (!products) res.status(500).json({ success: false });
  res.send(products);
});

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    id: req.body.id,
    name: req.body.name,
    image: req.body.image,
  });
  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
        successful: false,
      });
    });
});

// Declare a notification route
app.get("/notifications", async (request, response) => {
  response.send({ token: "" });
  // console.log(JSON.parse(request.body).token);
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  // await partialNotification(JSON.parse(request.body).token);
  // process.setMaxListeners(0);
  // return "OK";
});

// Declare a alarm route
app.post("/notifications", async (request, response) => {
  const body = request.body;
  try {
    await newPost.save();
    response.status(201).json(body);
  } catch (error) {
    response.status(409).json({ message: error.message });
  }
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  // await alarmNotification(JSON.parse(request.body).token);
  // process.setMaxListeners(0);
  // return "OK";
});

fastify.listen({ port: 3001 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
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

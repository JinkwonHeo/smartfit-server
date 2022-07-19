const express = require('express');
const router = express.Router();
const tensorflowController = require('./controllers/tensorflow.controllers');
const createTensorImage = require('../middlewares/createTensorImage');
const createTensorData = require('../middlewares/createTensorData');

router.post(
  '/posenet',
  createTensorImage,
  createTensorData,
  tensorflowController.analyzeVideo
);

module.exports = router;

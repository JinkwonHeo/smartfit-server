const { createVideoData } = require('../../services/tensorflow.services');

exports.analyzeVideo = (req, res, next) => {
  try {
    createVideoData(req.body, req.posenetData);
    res.json('success');
  } catch (error) {
    next(error);
  }
};

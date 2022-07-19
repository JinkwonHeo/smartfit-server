exports.analyzeVideo = (req, res, next) => {
  try {
    res.json({
      title: req.body.fileName,
      url: req.body.url,
      thumbnail: req.body.thumbnail,
      poseData: req.posenetData,
    });
  } catch (error) {
    next(error);
  }
};

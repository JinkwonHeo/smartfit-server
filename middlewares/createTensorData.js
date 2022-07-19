const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-wasm');
const posenet = require('@tensorflow-models/posenet');

const { createCanvas, Image } = require('canvas');
const path = require('path');

const createTensorData = async (req, res, next) => {
  const tensorImageArray = req.images;
  const tensorData = [];

  try {
    const tryModel = () => {
      return new Promise(async (resolve, reject) => {
        await tf.setBackend('wasm');
        await tf.ready();
        const imageScaleFactor = 0.5;
        const outputStride = 16;
        const flipHorizontal = false;

        tensorImageArray.forEach(async (element) => {
          const net = await posenet.load();
          const img = new Image();
          img.src = path.resolve(__dirname, `../images/${element}`);

          const canvas = createCanvas(img.width, img.height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const input = tf.browser.fromPixels(canvas);
          const pose = await net.estimateSinglePose(
            input,
            imageScaleFactor,
            flipHorizontal,
            outputStride
          );
          tensorData.push(pose);

          if (tensorData.length === tensorImageArray.length) {
            resolve();
          }
        });
      });
    };

    await tryModel();

    req.posenetData = tensorData;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = createTensorData;

const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const { Storage } = require('@google-cloud/storage');

const createTensorImage = async (req, res, next) => {
  try {
    const storage = new Storage({
      keyFilename: path.resolve(__dirname, '../smartfit-key.json'),
    });

    function downloadFilsSync() {
      return new Promise((resolve, reject) => {
        const downloadFile = async () => {
          let destFileName = path.resolve(__dirname, '../images/video.mp4');
          const options = {
            destination: destFileName,
          };

          await storage
            .bucket('smartfit-ef7ee.appspot.com')
            .file(`videos/${req.body.user}/${req.body.fileName}.mp4`)
            .download(options);

          setTimeout(() => {
            resolve();
          }, 2000);
        };

        downloadFile();
      });
    }

    await downloadFilsSync();

    function ffmpegSync() {
      return new Promise((resolve, reject) => {
        console.log('creating tensorImage...');
        ffmpeg({
          source: path.resolve(__dirname, '../images/video.mp4'),
        })
          .on('filenames', (filenames) => {
            req.images = filenames;
          })
          .on('end', () => {
            console.log('finished');
            resolve();
          })
          .on('error', (err) => {
            console.log(err);
          })
          .takeScreenshots(
            {
              filename: 'tensorImage.jpg',
              timemarks: [
                '40%',
                '42%',
                '44%',
                '46%',
                '48%',
                '50%',
                '52%',
                '54%',
                '56%',
                '58%',
                '60%',
              ],
            },
            path.resolve(__dirname, '../images')
          );
      });
    }

    await ffmpegSync();
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = createTensorImage;

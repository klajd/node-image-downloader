const fs = require('fs');
const path = require('path');
const request = require('request');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const dateFormat = require('dateformat');
const env = require('dotenv').config();

// .env
const url = process.env.URL;
const output = process.env.OUT_DIR || 'out';
const temp = process.env.TEMP_DIR || '.temp';
const fileFormat = process.env.FILE_FORMAT;
const jpegQuality = process.env.JPEG_QUALITY;
const idle = process.env.IDLE;

console.log(`Configuration: ${process.env}`);

(async function () {
  if (!fs.existsSync(temp)) fs.mkdirSync(temp);

  while (true) {
    await grepImage(url);
    await sleep(idle);
  }

}());

async function grepImage(url) {
  let datetime = dateFormat(Date.now(), fileFormat);
  let filename = path.join(temp, `${datetime}.jpg`);

  await download(url, filename);
  await compress(filename, output);
  await clean(filename);
}

async function download(uri, filename, callback) {
  await new Promise((resolve, reject) => {

    request.head(uri, function (err, res, body) {
      let size = res.headers['content-length'];
      let type = res.headers['content-type'];

      request(uri)
        .pipe(fs.createWriteStream(filename))
        .on('close', () => {
          log(`Image ${type} with ${size} b save on ${filename} downloaded.`);
          resolve();
        });

    });
  });
}

async function compress(filename, output) {
  await imagemin([filename], output, {
    plugins: [
      imageminMozjpeg({ quality: jpegQuality }),
    ]
  });
}

async function clean(filename) {
  await new Promise((resolve, reject) => {

    fs.unlink(filename, (err) => {
      if (err) reject(err);

      resolve();
    });
  });
}

function sleep(ms) {
  log(`Waiting ${ms} ms...`);

  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function log() {
  console.log.apply(this, arguments);
}
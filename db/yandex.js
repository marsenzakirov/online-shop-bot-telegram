var EasyYandexS3 = require("easy-yandex-s3");
require("dotenv").config();
var s3 = new EasyYandexS3({
  auth: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  Bucket: "sadavod", // например, "my-storage",
  debug: true, // Дебаг в консоли, потом можете удалить в релизе
});

async function upload(dir, file) {
  var upload = await s3.Upload(
    {
      buffer: file,
    },
    `${dir}`
  );
  return upload.key;
}

async function download(dir) {
  var download = await s3.Download(`${dir}`);
  return download;
}

module.exports = { upload, download };

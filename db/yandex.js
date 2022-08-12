var EasyYandexS3 = require("easy-yandex-s3");
var s3 = new EasyYandexS3({
  auth: {
    accessKeyId: "YCAJEoGdeCKBwq1OR3bo4BSKg",
    secretAccessKey: "YCMPznKUEWUTNnwo206CYnhqEbBMscEJdBJUBF3i",
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
module.exports = { upload };

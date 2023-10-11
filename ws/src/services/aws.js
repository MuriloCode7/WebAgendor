const AWS = require('aws-sdk');

module.exports = {
  IAM_USER_KEY: 'AKIAZ5RJV5EXB67GBTOY',
  IAM_USER_SECRET: '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',
  BUCKET_NAME: 'web-agendor',
  AWS_REGION: 'us-east-1',

  /* Função de upload de arquivos no aws  */
  uploadToS3: function (file, filename, acl = 'public-read') {
    return new Promise((resolve, reject) => {
      /* Infos necessarias */
      let IAM_USER_KEY = this.IAM_USER_KEY;
      let IAM_USER_SECRET = this.IAM_USER_SECRET;
      let BUCKET_NAME = this.BUCKET_NAME;

      let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME,
      });

      s3bucket.createBucket(function () {
        var params = {
          Bucket: BUCKET_NAME,
          key: filename,
          Body: file.data,
          ACL: acl,
        };

        s3bucket.upload(params, function (err, data) {
          if (err) {
            console.log(err);
            return resolve({ error: true, message: err.message });
          }
          console.log(data);
          return resolve({ error: false, message: data });
        });
      });
    });
  },

  /* Função de deletar arquivos do aws */
  deleteFileS3: function (key) {
    return new Promise((resolve, reject) => {
      /* Infos necessarias */
      let IAM_USER_KEY = this.IAM_USER_KEY;
      let IAM_USER_SECRET = this.IAM_USER_SECRET;
      let BUCKET_NAME = this.BUCKET_NAME;

      let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME,
      });

      s3bucket.createBucket(function () {
        s3bucket.deleteObject(
          {
            Bucket: BUCKET_NAME,
            key: key,
          },
          function (err, data) {
            if (err) {
              console.log(err);
              return resolve({ error: true, message: err.message });
            }
            console.log(data);
            return resolve({ error: false, message: data });
          },
        );
      });
    });
  },
};
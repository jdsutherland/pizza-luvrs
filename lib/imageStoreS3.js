const AWS = require('aws-sdk');

const s3 = new AWS.S3();

module.exports.save = (name, data, callback) => {
  const params = {
    Bucket: 'pizza-luvrs-jsuth',
    Key: `pizzas/${name}.png`,
    Body: new Buffer(data, 'base64'),
    ContentEncoding: 'base64',
    ContentType: 'image/png',
  };

  s3.putObject(params, (err, pData) => {
    callback(err, `//s3-ap-southeast-1.amazonaws.com/pizza-luvrs-jsuth/${params.Key}`);
  });
};

exports.generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.getExpiry = (minutes = 5) =>
  new Date(Date.now() + minutes * 60 * 1000);

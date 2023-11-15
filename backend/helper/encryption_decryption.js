const crypto = require('crypto');

exports.encryptData = (data) => {
  const secretKey = ');;?wDNPUWpT4qL;*gx@q*\'Kj@dG{jT)H!N[^LNAhk!U4|kKB]ggb-,?i{&qY[;';
  const algorithm = 'aes-256-cbc';
  const cipher = crypto.createCipher(algorithm, secretKey);
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
}
  
  // Function to decrypt data
  exports.decryptData = (encryptedData) => {
    const secretKey = ');;?wDNPUWpT4qL;*gx@q*\'Kj@dG{jT)H!N[^LNAhk!U4|kKB]ggb-,?i{&qY[;';
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipher(algorithm, secretKey);
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return decryptedData;
  }
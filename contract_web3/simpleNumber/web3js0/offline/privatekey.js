const fs = require('fs');
const keythereum = require('keythereum');
const env = require('./env');

const keystoreFileName = env.PrivateKeyFileName;
const accountPassWd = env.Man.Password;

const keystoreContent = fs.readFileSync(keystoreFileName).toString();
const keystore = JSON.parse(keystoreContent);
const keyObje = {version: keystore.version, crypto:keystore.crypto};

const privatekey = keythereum.recover(accountPassWd,keyObje);

exports.privatekey = privatekey;


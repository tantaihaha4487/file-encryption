const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

/**
 * Create Key, IV, salt file in Path directory.
 * @param {String} passkey Password that use to make key file.
 * @param {Path} keyDir where you keep key, iv, salt file.
 */

function  createKey(passkey, keyDir) {

    const keyFile = path.join(keyDir, 'key.bin');
    const saltFile = path.join(keyDir, 'salt.bin');
    const ivFile = path.join(keyDir, 'iv.bin');

    // create 'key' directory if it doesn't exits
    if(!fs.existsSync(keyDir)) {
        fs.mkdirSync(keyDir, { recursive: true });
    }

    // create 'salt' file if it doesn't exits
    if(!fs.existsSync(saltFile)) {
        const salt = crypto.randomBytes(16);
        fs.writeFileSync(saltFile, salt);
    }

    // Read salt value from file.
    const salt = fs.readFileSync(saltFile);

    // create 'IV' file it doesn't exits
    if(!fs.existsSync(ivFile)) {
        const iv = crypto.pbkdf2Sync(passkey, salt, 100000, 16, 'sha256');
        fs.writeFileSync(ivFile, iv);
    }

    // create 'key' file it doesn't exits
    if(!fs.existsSync(keyFile)) {
        const key = crypto.pbkdf2Sync(passkey, salt, 100000, 32, 'sha256');
        fs.writeFileSync(keyFile, key);
    }

}

module.exports = { createKey }
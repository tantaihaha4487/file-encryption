/**
 * This is example way to use :)
 */

const path = require('path');
const { encrypt } = require('./utils/encrypt');
const { decrypt } = require('./utils/decrypt');


/**
 * Difine path to key directory.
 */
const keyDir = path.join(__dirname, 'key');

/**
 * Encrypt a single file.
 */
encrypt('./files/download.mp4', keyDir, 'encrypted')
    .then((file) => {
        console.log(`encrypt succuessfully: ${file}`);
        /**
         * Start decrypt file with previous a encrypted file.
         */
        decrypt(file, keyDir, 'output')
            .then((file) => {
                console.log(`decrypted succuessfully: ${file}`)
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .catch((err) => {
        console.log(err);
    });
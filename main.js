/**
 * This is example way to use :)
 */

const path = require('path');
require('dotenv').config();
const { createKey } = require("./utils/keyManager");
const { encrypt } = require('./utils/encrypt');
const { decrypt } = require('./utils/decrypt');
const { KEY } = process.env;

const keyDir = path.join(__dirname, 'key');

// List of files to be encrypted
const filesToEncrypt = [
    'files/download.mp4',
];

// Create the encryption key
createKey(KEY, keyDir);

// Function to handle encryption and decryption
async function processFiles() {
    try {
        // Encrypt all files concurrently
        const encryptedFiles = await Promise.all(
            filesToEncrypt.map(filePath => 
                encrypt(filePath, keyDir, 'encrypted')
            )
        );

        // Log encryption success
        encryptedFiles.forEach(message => console.log(message));

        // Decrypt all files concurrently
        const decryptedFiles = await Promise.all(
            filesToEncrypt.map(filePath => {
                const encryptedFilePath = path.join('encrypted', `${path.basename(filePath)}.enc`);
                return decrypt(encryptedFilePath, keyDir, 'decrypted');
            })
        );

        // Log decryption success
        decryptedFiles.forEach(message => console.log(message));

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Start processing files
processFiles();

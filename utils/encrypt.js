const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { createKey } = require('./keyManager');
require('dotenv').config();

const { KEY } = process.env;

/**
 * Encrypt file with key file.
 * Output format will be like example.mp4.enc
 * @param {string} inputFile Path to the file that will be encrypted.
 * @param {string} keyDir Directory containing key and iv files.
 * @param {string} outputDir Directory to save the encrypted file.
 * @returns {Promise<string>} A promise that resolves with a success message will be complete encrypted file directory or rejects with an error message.
 */
function encrypt(inputFile, keyDir, outputDir) {
    return new Promise((resolve, reject) => {
        // Create outputDir if it doesn't exist.
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const keyFile = path.join(keyDir, 'key.bin');
        const ivFile = path.join(keyDir, 'iv.bin');

        // key doesn't exits.
        if (!fs.existsSync(keyDir) || !fs.existsSync(keyFile) || !fs.existsSync(ivFile)) {
            createKey(KEY, keyDir);
        }

        const key = fs.readFileSync(keyFile);
        const iv = fs.readFileSync(ivFile);

        const outputFile = path.join(outputDir, `${path.basename(inputFile)}.enc`);
        const algorithm = 'aes-256-cbc';
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const input = fs.createReadStream(inputFile);
        const output = fs.createWriteStream(outputFile);

        input.pipe(cipher).pipe(output);

        output.on('finish', () => {
            try {
                fs.unlinkSync(inputFile); // Delete the original file after encryption.
                resolve(`${outputFile}`);
            } catch (err) {
                reject(`Error deleting original file: ${err.message}`);
            }
        });

        input.on('error', (err) => {
            cleanupOnError(err, outputFile, reject, 'Error reading input file');
            input.destroy();
            output.destroy();
            cipher.destroy();
        });

        output.on('error', (err) => {
            cleanupOnError(err, outputFile, reject, 'Error writing output file');
            input.destroy();
            output.destroy();
            cipher.destroy();
        });

        cipher.on('error', (err) => {
            cleanupOnError(err, outputFile, reject, 'Error during encryption');
            input.destroy();
            output.destroy();
            cipher.destroy();
        });

        // Function to handle cleanup and reject the promise
        function cleanupOnError(err, fileToDelete, rejectFunction, message) {
            if (fs.existsSync(fileToDelete)) {
                fs.unlink(fileToDelete, (unlinkErr) => {
                    if (unlinkErr) {
                        rejectFunction(`${message}: ${err.message} (also failed to delete partial file: ${unlinkErr.message})`);
                    } else {
                        rejectFunction(`${message}: ${err.message} (partial file deleted)`);
                    }
                });
            } else {
                rejectFunction(`${message}: ${err.message}`);
            }
        }
    });
}

module.exports = { encrypt };

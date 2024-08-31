const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Decrypt file with key file.
 * @param {string} inputFile Path to the file that will be decrypted.
 * @param {string} keyDir Directory containing key and iv files.
 * @param {string} outputDir Directory to save the decrypted file.
 * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
 */
function decrypt(inputFile, keyDir, outputDir) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const keyFile = path.join(keyDir, 'key.bin');
        const ivFile = path.join(keyDir, 'iv.bin');

        const key = fs.readFileSync(keyFile);
        const iv = fs.readFileSync(ivFile);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        const outputFile = path.join(outputDir, `${path.basename(inputFile, '.enc')}`);
        const input = fs.createReadStream(inputFile);
        const output = fs.createWriteStream(outputFile);

        input.pipe(decipher).pipe(output);

        output.on('finish', () => {
            resolve(`File decrypted successfully: ${outputFile}`);
        });

        input.on('error', (err) => {
            reject(`Error reading input file: ${err.message}`);
            input.destroy();
            output.destroy();
            decipher.destroy();
        });

        output.on('error', (err) => {
            reject(`Error writing output file: ${err.message}`);
            input.destroy();
            output.destroy();
            decipher.destroy();
        });

        decipher.on('error', (err) => {
            reject(`Error during decryption: ${err.message}`);
            input.destroy();
            output.destroy();
            decipher.destroy();
        });
    });
}

module.exports = { decrypt };

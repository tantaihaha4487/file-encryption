# File Encryption and Decryption System

This project provides a simple file encryption and decryption system using Node.js and the `crypto` module. It allows you to securely encrypt and decrypt files using a password-derived key. 

## Features

- **Encryption**: Encrypts files and saves them with a `.enc` extension.
- **Decryption**: Decrypts previously encrypted files.


## Prerequisites

- Node.js installed on your system.
- Basic knowledge of using the command line.

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/tantaihaha4487/file-encryption
    cd file-encryption
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root of your project with the following content:

    ```bash
    KEY=your-secret-password
    ```

   Replace `your-secret-password` with your own secret password that will be used to generate encryption keys.

## Usage

### Example Script (`main.js`)
  This code will encrypt download.mp4 file from `files/download.mp4` encrypt to `encrypted` folder.
  <br>
  Then use return path from `encrypt()` and use function `decrypt()` decrypt `download.mp4` back to `decrypted` folder.  


```javascript
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
 * @param {string} inputFile Path to the file that will be encrypted.
 * @param {string} keyDir Directory containing key and iv files.
 * @param {string} outputDir Directory to save the encrypted file.
 */
encrypt('./files/download.mp4', keyDir, 'encrypted')
    .then((file) => {
        console.log(`encrypt succuessfully: ${file}`);
          /**
          * Start decrypt file with previous a encrypted file.
          * @param {string} inputFile Path to the file that will be decrypted.
          * @param {string} keyDir Directory containing key and iv files.
          * @param {string} outputDir Directory to save the decrypted file.
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
```

# Developer
* [@tantaihaha4487](https://github.com/tantaihaha4487)
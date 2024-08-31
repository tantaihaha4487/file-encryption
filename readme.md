# File Encryption and Decryption System

This project provides a simple file encryption and decryption system using Node.js and the `crypto` module. It allows you to securely encrypt and decrypt files using a password-derived key. 

## Features

- **Encryption**: Encrypts files and saves them with a `.enc` extension.
- **Decryption**: Decrypts previously encrypted files.
- **Key Management**: Generates and manages cryptographic keys using a password and salt.


## Prerequisites

- Node.js installed on your system.
- Basic knowledge of using the command line.

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/tantaihaha4487/file-encryption
    cd yourrepository
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

4. Create directories for your files:

    - `files/`: Contains files to be encrypted.
    - `encrypted/`: Stores encrypted files.
    - `decrypted/`: Stores decrypted files.
    - `key/`: Stores key, salt, and iv files.

    Make sure the `files/` directory contains a file named `download.mp4` for the example.

## Usage

### 1. Main Script (`main.js`)

This script demonstrates how to use the encryption and decryption functions to process multiple files:

```javascript
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
```
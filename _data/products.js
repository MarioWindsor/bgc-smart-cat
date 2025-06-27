// _data/products.js

const fs = require('fs');
const path = require('path');

module.exports = function() {
    const filePath = path.join(__dirname, '../media/uploads/variations.json'); // Adjust path as needed

    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const productsdb = JSON.parse(fileContents);
        const products = Object.values(productsdb.data.variations);
        return products;
    } catch (error) {
        console.error('Error reading products.json:', error);
        return []; // Return an empty array if the file is not found or malformed
    }
};
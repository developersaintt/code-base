const axios = require('axios')
const fs = require("fs");
const readline = require("readline");
const stream = fs.createReadStream("C:/Users/Lenovo/Downloads/products_export_simple.csv");
const rl = readline.createInterface({ input: stream });
const https = require('https');
const path = require('path');

let data = [];

rl.on("line", (row) => {
  data.push(row.split(","));
});

const productMap = {}
rl.on("close", () => {
  data.map(itm => {
    if (productMap[itm[0]]) {
      productMap[itm[0]] = [...productMap[itm[0]], itm[1], itm[2]]
    } else {
      productMap[itm[0]] = [itm[1], itm[2]]
    }
  })
  // console.log(productMap)
  downloadImages(productMap)
});


async function downloadImages(folders) {
  for (const [folderName, urls] of Object.entries(folders)) {
    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    // Download each image in the array
    for (const url of urls) {
      if (!url.includes(".jpg")) continue; // Skip blank URLs

      try {
        const response = await axios({ url, responseType: 'stream', timeout: 10000 });
        const fileName = url.includes("?") ? path.basename(url.split("?")[0]) : path.basename(url);
        const filePath = path.join(folderName, fileName);

        await new Promise((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(filePath))
            .on('finish', () => resolve())
            .on('error', e => reject(e));
        });

        // Add a delay of 1.5 seconds before the next request
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`Error downloading ${url}: ${error}`);
      }
    }
  }
}

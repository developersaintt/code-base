const fs = require("fs");
const path = require("path");

// Specify the folder to scan (adjust 'your-folder-name' to your target directory)
const baseDir = path.resolve(__dirname);

// Output README.md file path
const readmePath = path.join(baseDir, "README.md");

// Optional custom mapping for folder names to alt text
const altTextMapping = {
  "1.OneMillionHappyCustomers": "Happy Customer",
  "2.Reviewsv1": "Reviews V1",
};

fs.readdir(baseDir, { withFileTypes: true }, (err, items) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  let markdownContent = "";

  // Process each item in the base folder
  items.forEach((item) => {
    // Only process directories
    if (item.isDirectory()) {
      const folderName = item.name;
      // Use custom alt text if available; otherwise, generate it.
      const altText = altTextMapping[folderName] || generateAltText(folderName);
      // Construct the expected path to the image
      const imagePath = path.join(baseDir, folderName, "image.png");

      // Only include the folder if image.png exists
      if (fs.existsSync(imagePath)) {
        markdownContent += `[![${altText}](./${folderName}/image.png)](./${folderName})\n\n`;
      } else {
        console.warn(
          `Skipping folder "${folderName}" as image.png was not found.`
        );
      }
    }
  });

  // Write the generated markdown content to README.md
  fs.writeFile(readmePath, markdownContent, "utf8", (err) => {
    if (err) {
      console.error("Error writing README.md:", err);
    } else {
      console.log("README.md generated successfully!");
    }
  });
});

// A helper function to generate alt text from a folder name.
// This example removes a leading number and dot, then inserts spaces before uppercase letters.
function generateAltText(folderName) {
  let name = folderName.replace(/^\d+\./, "");
  name = name.replace(/([a-z])([A-Z])/g, "$1 $2");
  return name.trim();
}

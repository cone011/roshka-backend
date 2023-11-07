const axios = require("axios");

async function imageToBase(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });

  const base64String = btoa(
    String.fromCharCode(...new Uint8Array(response.data))
  );

  return base64String;
}

function getExtensionFile(filename) {
  return filename.split(".").pop();
}

module.exports = { imageToBase, getExtensionFile };

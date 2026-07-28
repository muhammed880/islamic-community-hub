{
  "name": "pdf-renderer",
  "version": "1.0.0",
  "description": "Cloud Run PDF renderer for Nikah certificates",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "puppeteer": "^20.0.0",
    "@google-cloud/storage": "^6.9.0",
    "body-parser": "^1.20.2"
  }
}

const multer = require("multer");

// Files are kept in memory and streamed straight to cloudinary (see
// config/cloudinary.js#uploadBuffer) instead of being written to local
// disk, since the server's filesystem isn't guaranteed to persist
// (e.g. ephemeral containers) or to be writable relative to process cwd.
const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;
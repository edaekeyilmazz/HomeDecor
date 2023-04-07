// Create a Multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload"); // Save files to the public/uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Add a timestamp to the filename
  },
});

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Create a Multer instance with the storage engine and file size limit
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 1024 * 1024, // 1 MB
  },
});
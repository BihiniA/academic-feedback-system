
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const allowedExtensions = [
  ".pdf",
  ".docx",
  ".txt",
  ".py",
  ".java",
  ".js",
  ".cpp",
  ".c",
];

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extension)) {
    return callback(null, true);
  }

  return callback(
    new Error(`Unsupported file type: ${extension}`)
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 3,
  },
});

module.exports = upload.fields([
  { name: "questionDocument", maxCount: 1 },
  { name: "markingRubricDocument", maxCount: 1 },
  { name: "studentAnswerDocument", maxCount: 1 },
]);

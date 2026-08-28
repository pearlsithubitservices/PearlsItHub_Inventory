const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { uploadSingle, uploadGalleryImages, deleteImage } = require("../../controller/Upload/upload");

router.use(protect);
router.post("/single", uploadSingle);
router.post("/gallery", uploadGalleryImages);
router.delete("/:publicId", deleteImage);

module.exports = router;
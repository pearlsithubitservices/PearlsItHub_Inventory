const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { protect } = require("../../middleware/auth");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "inventory-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "inventory-products/gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [{ width: 600, height: 600, crop: "limit" }],
  },
});

const upload = multer({ storage });
const uploadGallery = multer({ storage: galleryStorage });

const uploadSingle = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadGalleryImages = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files provided" });
    }
    const images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    const decoded = decodeURIComponent(publicId);
    await cloudinary.uploader.destroy(decoded);
    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  upload,
  uploadGallery,
  uploadSingle,
  uploadGalleryImages,
  deleteImage,
};

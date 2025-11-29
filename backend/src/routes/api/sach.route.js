import express from "express";
import SachController from "../../controllers/SachController.js";
import {
  authenticateToken,
  requirePermission,
} from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validation.js";
import { catchAsync } from "../../middlewares/errorHandler.js";
import path from "path";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// Apply authentication to all routes
// TODO: Uncomment when authentication is working
// router.use(authenticateToken);
// Tạo thư mục nếu chưa có
const uploadDir = path.join(process.cwd(), "uploads", "covers");
fs.mkdirSync(uploadDir, { recursive: true });
// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads", "covers");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // sanitize + unique name
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
    const filename = `${base}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// file filter (chỉ ảnh)
function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // limit 2MB
});
// 2. === MIDDLEWARE QUAN TRỌNG NHẤT: CHUYỂN ĐỔI DỮ LIỆU ===
// Hàm này sẽ biến chuỗi thành số để vượt qua bộ lọc validate
const parseFormData = (req, res, next) => {
  if (!req.body) return next();

  // Danh sách các trường bắt buộc phải là số
  const numberFields = ['DonGia', 'SoQuyen', 'SoQuyenConLai', 'NamXuatBan'];
  
  numberFields.forEach(field => {
    // Chỉ chuyển đổi nếu có dữ liệu và không phải chuỗi rỗng
    if (req.body[field] && req.body[field] !== "") {
      req.body[field] = Number(req.body[field]);
    } else if (req.body[field] === "") {
        // Nếu gửi lên chuỗi rỗng thì xóa đi để tránh lỗi
        delete req.body[field];
    }
  });

  next();
};

// Validation schemas
const sachCreateSchema = {
  MaSach: {
    required: true,
    type: "string",
    pattern: /^S\d{3,}$/,
    patternMessage: "Mã sách phải có định dạng S001, S002, ...",
    label: "Mã sách",
  },
  TenSach: {
    required: true,
    type: "string",
    maxLength: 200,
    label: "Tên sách",
  },
  DonGia: {
    required: true,
    type: "number",
    min: 0,
    max: 10000000,
    label: "Đơn giá",
  },
  SoQuyen: {
    required: true,
    type: "number",
    min: 0,
    max: 1000,
    label: "Số quyển",
  },
  SoQuyenConLai: {
    required: false,
    type: "number",
    min: 0,
    max: 1000,
    label: "Số quyển còn lại",
  },
  NamXuatBan: {
    required: true,
    type: "number",
    min: 1900,
    max: new Date().getFullYear(),
    label: "Năm xuất bản",
  },
  MaNhaXuatBan: {
    required: true,
    type: "string",
    label: "Mã nhà xuất bản",
  },
  NhaXuatBan: {
    required: true,
    type: "string",
    label: "Tên nhà xuất bản",
  },
  NguonGoc: {
    required: true,
    type: "string",
    maxLength: 100,
    label: "Tác giả",
  },
  AnhBia: {
    required: false,
    type: "string",
    maxLength: 500,
    label: "Ảnh bìa (đường dẫn)",
  },
};

const sachUpdateSchema = {
  ...sachCreateSchema,
  MaSach: { ...sachCreateSchema.MaSach, required: false },
  TenSach: { ...sachCreateSchema.TenSach, required: false },
  DonGia: { ...sachCreateSchema.DonGia, required: false },
  SoQuyen: { ...sachCreateSchema.SoQuyen, required: false },
  SoQuyenConLai: { ...sachCreateSchema.SoQuyenConLai, required: false },
  NamXuatBan: { ...sachCreateSchema.NamXuatBan, required: false },
  MaNhaXuatBan: { ...sachCreateSchema.MaNhaXuatBan, required: false },
  NhaXuatBan: { ...sachCreateSchema.NhaXuatBan, required: false },
  NguonGoc: { ...sachCreateSchema.NguonGoc, required: false },
  AnhBia: { ...sachCreateSchema.AnhBia, required: false },
};


// Use upload.single('AnhBia') on create and update routes
router.post(
  "/", 
  upload.single("AnhBia"), 
  parseFormData, // <--- THÊM DÒNG NÀY
  validate(sachCreateSchema), 
  catchAsync(SachController.create)
);

router.put(
  "/:maSach", 
  upload.single("AnhBia"), 
  parseFormData, // <--- THÊM DÒNG NÀY
  validate(sachUpdateSchema), 
  catchAsync(SachController.update)
);
// Routes with error handling
router.get("/", catchAsync(SachController.getAll));
router.get("/available", catchAsync(SachController.getAvailable));
router.get("/search/:query", catchAsync(SachController.search));
router.get("/:maSach", catchAsync(SachController.getById));

router.delete("/:maSach", catchAsync(SachController.remove));

export default router;

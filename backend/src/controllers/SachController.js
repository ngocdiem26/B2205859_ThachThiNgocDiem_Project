import fs from "fs";
import path from "path";
import Sach from "../models/Sach.js";
import { AppError } from "../middlewares/errorHandler.js";
import {
  optimizeQuery,   
  createOptimizedResponse,
} from "../utils/responseOptimizer.js";
import TheoDoiMuonSach from "../models/TheoDoiMuonSach.js";
function deleteFileIfExists(filePath) {
  try {
    if (filePath) {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.log("Không thể xóa file:", err.message);
  }
}
function buildSearchQuery(search) {
  console.log('Building search query for:', search);
  
  
  if (!search || typeof search !== 'string' || search.trim().length === 0) {
    console.log('No valid search term, returning empty query');
    return {};
  }
  
  try {
    
    const searchTerm = search.trim();
    
    
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    
    const searchRegex = new RegExp(escapedSearchTerm, 'i');
    
    const query = {
      $or: [
        { MaSach: searchRegex },
        { TenSach: searchRegex },
        { NguonGoc: searchRegex },
        { NhaXuatBan: searchRegex }
      ]
    };
    
    console.log('Search query created successfully');
    return query;
    
  } catch (error) {
    console.error('Error building search query:', error);
    
    return {};
  }
}

export default {
  
  async getAll(req, res) {
    try {
      console.log("=== Starting getAll function ===");

      
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
      const search = req.query.search || "";
      const sortBy = req.query.sortBy || "MaSach";
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

      console.log("Query params:", { page, limit, search, sortBy, sortOrder });

      
      const searchQuery = buildSearchQuery(search);
      console.log("Search query built:", JSON.stringify(searchQuery));

      
      console.log("Getting total count...");
      const total = await Sach.countDocuments(searchQuery);
      console.log("Total documents found:", total);

      
      console.log("Building main query...");
      const skip = (page - 1) * limit;

      
      let query = Sach.find(searchQuery);

      
      query = query.skip(skip);
      query = query.limit(limit);

      
      const validSortFields = [
        "MaSach",
        "TenSach",
        "NguonGoc",
        "NhaXuatBan",
        "DonGia",
        "SoQuyen",
        "NamXuatBan",
      ];
      const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "MaSach";
      query = query.sort({ [finalSortBy]: sortOrder });

      console.log("Query configured with:", {
        skip,
        limit,
        sort: { [finalSortBy]: sortOrder },
      });


      console.log("Executing query...");
      const data = await query.lean();
      console.log("Query executed successfully, got", data.length, "items");

      
      const totalPages = Math.ceil(total / limit);
      const paginatedResponse = {
        data,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };

      console.log("Pagination info:", paginatedResponse.pagination);

      
      res.json({
        success: true,
        message: "Lấy danh sách sách thành công",
        data: paginatedResponse.data,
        pagination: paginatedResponse.pagination,
      });

      console.log("=== getAll function completed successfully ===");
    } catch (error) {
      console.error("=== Error in getAll function ===");
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });

      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách sách: " + error.message,
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  
  async getById(req, res) {
    let query = Sach.findOne({ MaSach: req.params.maSach });
    query = optimizeQuery(query, "sach", "detail");

    const sach = await query.lean();

    if (!sach) {
      throw new AppError("Không tìm thấy sách", 404, "SACH_NOT_FOUND");
    }

    return createOptimizedResponse(res, sach, {
      message: "Lấy thông tin sách thành công",
      context: "detail",
      model: "sach",
    });
  },

  
async create(req, res) {
    // 1. Xử lý đường dẫn ảnh (đúng rồi)
    if (req.file) {
      const relPath = `/uploads/covers/${req.file.filename}`;
      req.body.AnhBia = relPath;
    }

    // 2. === KHẮC PHỤC LỖI QUAN TRỌNG NHẤT ===
    // Chuyển chuỗi thành số để tránh lỗi Validation của Mongoose
    if (req.body.DonGia) req.body.DonGia = Number(req.body.DonGia);
    if (req.body.SoQuyen) req.body.SoQuyen = Number(req.body.SoQuyen);
    if (req.body.NamXuatBan) req.body.NamXuatBan = Number(req.body.NamXuatBan);
    
    // Nếu SoQuyenConLai không gửi lên hoặc là chuỗi rỗng, lấy bằng SoQuyen
    if (req.body.SoQuyenConLai) {
        req.body.SoQuyenConLai = Number(req.body.SoQuyenConLai);
    } else if (req.body.SoQuyen) {
        req.body.SoQuyenConLai = Number(req.body.SoQuyen);
    }

    // 3. Kiểm tra trùng mã sách (giữ nguyên logic cũ)
    if (req.body.MaSach) {
      const existingSach = await Sach.findOne({ MaSach: req.body.MaSach });
      if (existingSach) {
        if (req.file) {
          try { fs.unlinkSync(path.join(process.cwd(), "uploads", "covers", req.file.filename)); } catch (e) {}
        }
        throw new AppError("Mã sách đã tồn tại", 400, "DUPLICATE_MA_SACH");
      }
    }

    const sach = new Sach(req.body);
    await sach.save();

    res.status(201).json({
      success: true,
      message: "Tạo sách mới thành công",
      data: sach,
    });
  },

 async update(req, res) {
    // 1. Xử lý ảnh mới nếu có (đúng rồi)
    if (req.file) {
      req.body.AnhBia = `/uploads/covers/${req.file.filename}`;
    }

    // 2. === KHẮC PHỤC LỖI QUAN TRỌNG NHẤT ===
    // Chuyển chuỗi thành số TRƯỚC KHI so sánh logic
    if (req.body.DonGia) req.body.DonGia = Number(req.body.DonGia);
    if (req.body.SoQuyen) req.body.SoQuyen = Number(req.body.SoQuyen);
    if (req.body.SoQuyenConLai) req.body.SoQuyenConLai = Number(req.body.SoQuyenConLai);
    if (req.body.NamXuatBan) req.body.NamXuatBan = Number(req.body.NamXuatBan);

    // 3. Logic kiểm tra số lượng (Giờ mới chạy đúng vì đã chuyển thành Number)
    if (req.body.SoQuyenConLai !== undefined && req.body.SoQuyen !== undefined) {
      if (req.body.SoQuyenConLai > req.body.SoQuyen) {
        if (req.file) {
          try { fs.unlinkSync(path.join(process.cwd(), "uploads", "covers", req.file.filename)); } catch (e) {}
        }
        throw new AppError("Số quyển còn lại không được lớn hơn tổng số quyển", 400, "INVALID_SO_QUYEN_CON_LAI");
      }
    }

    // 4. Lấy sách cũ để xóa ảnh cũ sau khi update thành công
    const oldSach = await Sach.findOne({ MaSach: req.params.maSach }).lean();

    const sach = await Sach.findOneAndUpdate(
      { MaSach: req.params.maSach },
      req.body,
      { new: true, runValidators: true }
    );

    if (!sach) {
      if (req.file) {
        try { fs.unlinkSync(path.join(process.cwd(), "uploads", "covers", req.file.filename)); } catch (e) {}
      }
      throw new AppError("Không tìm thấy sách", 404, "SACH_NOT_FOUND");
    }

    // Xóa ảnh cũ nếu update thành công và có upload ảnh mới
    if (req.file && oldSach && oldSach.AnhBia) {
      try {
        const oldFile = path.join(process.cwd(), oldSach.AnhBia);
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      } catch (err) {
        console.warn("Không xóa được file cũ:", err.message);
      }
    }

    res.json({
      success: true,
      message: "Cập nhật thông tin sách thành công",
      data: sach,
    });
  },

  async remove(req, res) {
    const borrowCount = await TheoDoiMuonSach.countDocuments({
      MaSach: req.params.maSach,
      NgayTra: null
    });

    if (borrowCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa sách đang được mượn",
      });
    }

    // find the book to get AnhBia before delete
    const sach = await Sach.findOne({ MaSach: req.params.maSach });
    if (!sach) {
      throw new AppError("Không tìm thấy sách", 404, "SACH_NOT_FOUND");
    }

    // delete cover file if exists
    if (sach.AnhBia) {
      try {
        const filePath = path.join(process.cwd(), sach.AnhBia);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Không xóa được ảnh bìa:", err.message);
        // không throw — vẫn có thể xóa doc
      }
    }

    await Sach.findOneAndDelete({ MaSach: req.params.maSach });

    res.json({
      success: true,
      message: "Xóa sách thành công",
      data: { deletedId: req.params.maSach },
    });
  },
  
  async search(req, res) {
    const query = req.params.query;
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));

    if (!query || query.trim().length === 0) {
      throw new AppError(
        "Từ khóa tìm kiếm không được để trống",
        400,
        "EMPTY_SEARCH_QUERY"
      );
    }

    const sach = await Sach.find(buildSearchQuery(query))
      .limit(limit)
      .select("MaSach TenSach NguonGoc NhaXuatBan SoQuyen")
      .lean();

    res.json({
      success: true,
      message: "Tìm kiếm sách thành công",
      data: sach,
    });
  },


  async getAvailable(req, res) {
    const sach = await Sach.find({ SoQuyen: { $gt: 0 } })
      .select("MaSach TenSach NguonGoc SoQuyen")
      .sort({ TenSach: 1 });

    res.json({
      success: true,
      message: "Lấy danh sách sách còn hàng thành công",
      data: sach,
    });
  },
};

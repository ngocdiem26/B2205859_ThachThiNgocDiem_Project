import axios from "axios";

// Tạo instance axios mặc định
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
//  REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
//  RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Không có response → lỗi mạng
    if (!error.response) {
      error.userMessage =
        "Không thể kết nối tới server. Vui lòng kiểm tra mạng.";
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = error.config.url;

    // ============================
    // API KHÔNG YÊU CẦU LOGIN (PUBLIC API)
    // ============================
    const publicApiPrefixes = [
      "/books",
      "/categories",
      "/public",
      "/about",
      "/contact",
      "/help",
      "/privacy",
      "/terms",
    ];

    const isPublicApi = publicApiPrefixes.some((p) => url.startsWith(p));

    // ============================
    // API YÊU CẦU LOGIN (PRIVATE API)
    // ============================
    const protectedApiPrefixes = [
      "/user",
      "/profile",
      "/borrow",
      "/borrow-history",
      "/my-borrows",
      "/admin",
      "/staff",
    ];

    const isProtectedApi = protectedApiPrefixes.some((p) =>
      url.startsWith(p)
    );

    // ============================
    // HANDLE 401 — CHỈ PRIVATE API
    // ============================
    if (status === 401 && isProtectedApi) {
      // Xoá token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");

      // Không dùng window.redirect — để router xử lý
      // Emit sự kiện để App.vue / router biết xử lý
      window.dispatchEvent(new Event("auth-expired"));

      error.userMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      return Promise.reject(error);
    }

    // ============================
    // 403 — Không đủ quyền
    // ============================
    if (status === 403) {
      error.userMessage = "Bạn không có quyền truy cập tài nguyên này.";
      return Promise.reject(error);
    }

    // ============================
    // 404
    // ============================
    if (status === 404) {
      error.userMessage = "Không tìm thấy tài nguyên yêu cầu.";
      return Promise.reject(error);
    }

    // ============================
    // 500 — Lỗi server
    // ============================
    if (status === 500) {
      error.userMessage = "Lỗi server. Vui lòng thử lại sau.";
      return Promise.reject(error);
    }

    // Mặc định
    error.userMessage = "Đã xảy ra lỗi không xác định.";
    return Promise.reject(error);
  }
);

export default api;

// import axios from "axios";

// // Tạo instance axios mặc định
// const api = axios.create({
//   baseURL: "/api",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // =======================
// //  REQUEST INTERCEPTOR
// // =======================
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // =======================
// //  RESPONSE INTERCEPTOR
// // =======================
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Không có response → lỗi mạng
//     if (!error.response) {
//       error.userMessage =
//         "Không thể kết nối tới server. Vui lòng kiểm tra mạng.";
//       return Promise.reject(error);
//     }

//     const status = error.response.status;
//     const url = error.config.url;

//     // ============================
//     // API KHÔNG YÊU CẦU LOGIN (PUBLIC API)
//     // ============================
//     const publicApiPrefixes = [
//       "/books",
//       "/categories",
//       "/public",
//       "/about",
//       "/contact",
//       "/help",
//       "/privacy",
//       "/terms",
//     ];

//     const isPublicApi = publicApiPrefixes.some((p) => url.startsWith(p));

//     // ============================
//     // API YÊU CẦU LOGIN (PRIVATE API)
//     // ============================
//     const protectedApiPrefixes = [
//       "/user",
//       "/profile",
//       "/borrow",
//       "/borrow-history",
//       "/my-borrows",
//       "/admin",
//       "/staff",
//     ];

//     const isProtectedApi = protectedApiPrefixes.some((p) =>
//       url.startsWith(p)
//     );

//     // ============================
//     // HANDLE 401 — CHỈ PRIVATE API
//     // ============================
//     if (status === 401 && isProtectedApi) {
//       // Xoá token
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       localStorage.removeItem("userRole");

//       // Không dùng window.redirect — để router xử lý
//       // Emit sự kiện để App.vue / router biết xử lý
//       window.dispatchEvent(new Event("auth-expired"));

//       error.userMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
//       return Promise.reject(error);
//     }

//     // ============================
//     // 403 — Không đủ quyền
//     // ============================
//     if (status === 403) {
//       error.userMessage = "Bạn không có quyền truy cập tài nguyên này.";
//       return Promise.reject(error);
//     }

//     // ============================
//     // 404
//     // ============================
//     if (status === 404) {
//       error.userMessage = "Không tìm thấy tài nguyên yêu cầu.";
//       return Promise.reject(error);
//     }

//     // ============================
//     // 500 — Lỗi server
//     // ============================
//     if (status === 500) {
//       error.userMessage = "Lỗi server. Vui lòng thử lại sau.";
//       return Promise.reject(error);
//     }

//     // Mặc định
//     error.userMessage = "Đã xảy ra lỗi không xác định.";
//     return Promise.reject(error);
//   }
// );

// export default api;
// import axios from 'axios'

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: '/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error) => {
//     // Handle different error types
//     if (error.response) {
//       // Server responded with error status
//       const { status, data } = error.response
      
//       switch (status) {
//         case 401:
//           // Unauthorized - token expired or invalid
//           localStorage.removeItem('token')
//           localStorage.removeItem('user')
//           localStorage.removeItem('userRole')
//           if (window.location.pathname !== '/login') {
//             window.location.href = '/login'
//           }
//           break
          
//         case 403:
//           // Forbidden - insufficient permissions
//           console.error('Không có quyền truy cập:', data.message)
//           // Could show a toast notification here
//           break
          
//         case 404:
//           // Not found
//           console.error('Không tìm thấy:', data.message)
//           break
          
//         case 422:
//           // Validation error
//           console.error('Lỗi validation:', data.message)
//           break
          
//         case 500:
//           // Server error
//           console.error('Lỗi server:', data.message)
//           break
          
//         default:
//           console.error('Lỗi API:', data.message || 'Đã xảy ra lỗi')
//       }
      
//       // Enhance error object with user-friendly message
//       error.userMessage = data.message || 'Đã xảy ra lỗi'
//       error.errorCode = data.error || 'UNKNOWN_ERROR'
      
//     } else if (error.request) {
//       // Network error - no response received
//       error.userMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
//       error.errorCode = 'NETWORK_ERROR'
//       console.error('Network error:', error.message)
      
//     } else {
//       // Something else happened
//       error.userMessage = 'Đã xảy ra lỗi không xác định'
//       error.errorCode = 'UNKNOWN_ERROR'
//       console.error('Error:', error.message)
//     }
    
//     return Promise.reject(error)
//   }
// )

// export default api
// axios.js (Sửa)

// axios.js (Đã sửa: Xóa logic 401 tự động xóa localStorage và redirect)
import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Header Authorization đã được set trong useAuth, giữ nguyên
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          // KHÔNG XÓA localStorage VÀ KHÔNG REDIRECT TẠI ĐÂY NỮA
          // Lỗi 401 sẽ được ném ra và xử lý bởi `getProfile` hoặc `withErrorHandling`
          break;
          
        case 403:
          // Forbidden - insufficient permissions
          console.error('Không có quyền truy cập:', data.message)
          break
          
        case 404:
          // Not found
          console.error('Không tìm thấy:', data.message)
          break
          
        case 422:
          // Validation error
          console.error('Lỗi validation:', data.message)
          break
          
        case 500:
          // Server error
          console.error('Lỗi server:', data.message)
          break
          
        default:
          console.error('Lỗi API:', data.message || 'Đã xảy ra lỗi')
      }
      
      // Enhance error object with user-friendly message
      error.userMessage = data.message || 'Đã xảy ra lỗi'
      error.errorCode = data.error || 'UNKNOWN_ERROR'
      
    } else if (error.request) {
      // Network error - no response received
      error.userMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
      error.errorCode = 'NETWORK_ERROR'
      console.error('Network error:', error.message)
      
    } else {
      // Something else happened
      error.userMessage = 'Đã xảy ra lỗi không xác định'
      error.errorCode = 'UNKNOWN_ERROR'
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api
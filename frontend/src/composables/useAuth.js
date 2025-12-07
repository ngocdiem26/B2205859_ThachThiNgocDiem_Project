// import { ref, computed } from "vue";
// import { useRouter } from "vue-router";
// import axios from "@/utils/axios";

// // Global state cho authentication
// const token = ref(localStorage.getItem("token"));
// const user = ref(
//   (() => {
//     try {
//       const stored = localStorage.getItem("user");
//       return stored ? JSON.parse(stored) : null;
//     } catch (error) {
//       console.warn("Error parsing user from localStorage:", error);
//       return null;
//     }
//   })()
// );

// export function useAuth() {
//   // Computed properties
//   const isAuthenticated = computed(() => !!token.value);
//   const currentUser = computed(() => user.value || null);

//   // Login function for readers (độc giả)
//   const loginReader = async (credentials) => {
//     try {
//       const response = await axios.post("/docgia/login", {
//         email: credentials.email,
//         password: credentials.password,
//       });

//       // Lưu token và user info từ response
//       token.value = response.data.data.token;
//       user.value = response.data.data.docGia;

//       localStorage.setItem("token", response.data.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.data.docGia));
//       localStorage.setItem("userRole", "reader");

//       // Set default Authorization header cho axios
//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${response.data.data.token}`;

//       return { success: true, user: response.data.data.docGia };
//     } catch (error) {
//       console.error("Reader login error:", error);

//       let errorMessage = "Đăng nhập thất bại";

//       if (error.response) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error.request) {
//         errorMessage = "Không thể kết nối đến server";
//       }

//       return {
//         success: false,
//         error: errorMessage,
//       };
//     }
//   };

//   // Login function for staff (nhân viên) - keep existing
//   const loginStaff = async (credentials) => {
//     try {
//       const response = await axios.post("/auth/login", {
//         msnv: credentials.username,
//         password: credentials.password,
//       });

//       token.value = response.data.data.token;
//       user.value = response.data.data.user;

//       localStorage.setItem("token", response.data.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.data.user));
//       localStorage.setItem("userRole", "staff");

//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${response.data.data.token}`;

//       return { success: true, user: response.data.data.user };
//     } catch (error) {
//       console.error("Staff login error:", error);

//       let errorMessage = "Đăng nhập thất bại";

//       if (error.response) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error.request) {
//         errorMessage = "Không thể kết nối đến server";
//       }

//       return {
//         success: false,
//         error: errorMessage,
//       };
//     }
//   };

//   // Generic login function (defaults to reader login for public)
//   const login = loginReader;

//   // Register function for readers
//   const register = async (userData) => {
//     try {
//       const response = await axios.post("/docgia/register", userData);

//       // Auto login after successful registration
//       token.value = response.data.data.token;
//       user.value = response.data.data.docGia;

//       localStorage.setItem("token", response.data.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.data.docGia));
//       localStorage.setItem("userRole", "reader");

//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${response.data.data.token}`;

//       return { success: true, user: response.data.data.docGia };
//     } catch (error) {
//       console.error("Registration error:", error);

//       let errorMessage = "Đăng ký thất bại";

//       if (error.response) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error.request) {
//         errorMessage = "Không thể kết nối đến server";
//       }

//       return {
//         success: false,
//         error: errorMessage,
//       };
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       // Clear local storage first
//       token.value = null;
//       user.value = null;
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       localStorage.removeItem("userRole");

//       // Remove Authorization header
//       delete axios.defaults.headers.common["Authorization"];

//       return { success: true };
//     } catch (error) {
//       console.error("Logout error:", error);
//       // Vẫn clear local data ngay cả khi có lỗi
//       token.value = null;
//       user.value = null;
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       localStorage.removeItem("userRole");
//       delete axios.defaults.headers.common["Authorization"];

//       return { success: false, error: error.message };
//     }
//   };

//   // Check if token is expired
//   const isTokenExpired = () => {
//     if (!token.value) return true;

//     try {
//       // Decode JWT token để check expiration
//       const payload = decodeJWTPayload(token.value);
//       const currentTime = Date.now() / 1000;

//       return payload.exp < currentTime;
//     } catch (error) {
//       console.error("Token decode error:", error);
//       return true;
//     }
//   };

//   // Refresh token if needed
//   const refreshToken = async () => {
//     try {
//       const response = await axios.post("/auth/refresh");

//       // Update token
//       token.value = response.data.token;
//       localStorage.setItem("token", response.data.token);
//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${response.data.token}`;

//       return { success: true };
//     } catch (error) {
//       console.error("Refresh token error:", error);
//       logout();
//       return { success: false };
//     }
//   };

//   // Initialize auth state khi app khởi động
//   const initAuth = () => {
//     if (token.value && !isTokenExpired()) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
//     } else if (token.value && isTokenExpired()) {
//       // Token hết hạn, logout
//       logout();
//     }
//   };

//   // Get user profile (for readers)
// const getProfile = async () => {
//   try {
//     if (!token.value) {
//       return { success: false, error: 'Không có token' };
//     }

//     const response = await axios.get("/docgia/profile");
//     user.value = response.data.data;
//     localStorage.setItem("user", JSON.stringify(response.data.data));
//     return { success: true, user: response.data.data };
//   } catch (error) {
//     if (error.response?.status === 401) {
//       await logout();
//     }

//     return {
//       success: false,
//       error: error.response?.data?.message || "Không thể lấy thông tin profile",
//     };
//   }
// };

//   // Update profile (for readers)
//   const updateProfile = async (profileData) => {
//     try {
//       const response = await axios.put("/docgia/profile", profileData);
//       user.value = response.data.data;
//       localStorage.setItem("user", JSON.stringify(response.data.data));
//       return { success: true, user: response.data.data };
//     } catch (error) {
//       console.error("Update profile error:", error);
//       return {
//         success: false,
//         error: error.response?.data?.message || "Không thể cập nhật profile",
//       };
//     }
//   };

//   // Change password (for readers)
//   const changePassword = async (passwordData) => {
//     try {
//       await axios.put("/docgia/change-password", passwordData);
//       return { success: true };
//     } catch (error) {
//       console.error("Change password error:", error);
//       return {
//         success: false,
//         error: error.response?.data?.message || "Không thể đổi mật khẩu",
//       };
//     }
//   };

//   // Get user role
//   const getUserRole = () => {
//     return localStorage.getItem("userRole") || "reader";
//   };

//   return {
//     // State
//     token: computed(() => token.value),
//     user: currentUser,
//     isAuthenticated,

//     // Methods
//     login,
//     loginReader,
//     loginStaff,
//     register,
//     logout,
//     getProfile,
//     updateProfile,
//     changePassword,
//     getUserRole,
//     isTokenExpired,
//     refreshToken,
//     initAuth,
//   };
// }
// useAuth.js

// import { ref, computed } from "vue";
// import { useRouter } from "vue-router";
// import axios from "@/utils/axios";

// // ====================================================================
// // Sửa đổi: Tách biệt keys và quản lý trạng thái active
// // ====================================================================

// // Keys riêng biệt trong localStorage
// const READER_TOKEN_KEY = "readerToken";
// const READER_USER_KEY = "readerUser";
// const STAFF_TOKEN_KEY = "staffToken";
// const STAFF_USER_KEY = "staffUser";
// const USER_ROLE_KEY = "userRole";

// // Global state cho tất cả keys
// const readerToken = ref(localStorage.getItem(READER_TOKEN_KEY));
// const readerUser = ref(parseUserFromLocalStorage(READER_USER_KEY));
// const staffToken = ref(localStorage.getItem(STAFF_TOKEN_KEY));
// const staffUser = ref(parseUserFromLocalStorage(STAFF_USER_KEY));
// const activeRole = ref(localStorage.getItem(USER_ROLE_KEY));

// function parseUserFromLocalStorage(key) {
//   try {
//     const stored = localStorage.getItem(key);
//     return stored ? JSON.parse(stored) : null;
//   } catch (error) {
//     console.warn(`Error parsing user from localStorage key '${key}':`, error);
//     return null;
//   }
// }

// export function useAuth() {
//   // Computed properties
//   const isAuthenticated = computed(() => {
//     // Chỉ cần 1 trong 2 token còn tồn tại
//     return !!readerToken.value || !!staffToken.value;
//   });
  
//   const currentToken = computed(() => {
//     // Trả về token của vai trò đang active
//     return activeRole.value === 'staff' ? staffToken.value : readerToken.value;
//   });

//   const currentUser = computed(() => {
//     // Trả về user của vai trò đang active
//     return activeRole.value === 'staff' ? staffUser.value : readerUser.value;
//   });
  
//   const isReader = computed(() => activeRole.value === 'reader' && !!readerToken.value);
//   const isStaff = computed(() => activeRole.value === 'staff' && !!staffToken.value);

//   // Helper để thiết lập trạng thái và headers
//   const setAuthState = (token, user, role) => {
//     if (role === 'reader') {
//       // Clear staff state
//       staffToken.value = null;
//       staffUser.value = null;
//       localStorage.removeItem(STAFF_TOKEN_KEY);
//       localStorage.removeItem(STAFF_USER_KEY);
      
//       // Set reader state
//       readerToken.value = token;
//       readerUser.value = user;
//       localStorage.setItem(READER_TOKEN_KEY, token);
//       localStorage.setItem(READER_USER_KEY, JSON.stringify(user));
//     } else if (role === 'staff') {
//       // Clear reader state
//       readerToken.value = null;
//       readerUser.value = null;
//       localStorage.removeItem(READER_TOKEN_KEY);
//       localStorage.removeItem(READER_USER_KEY);
      
//       // Set staff state
//       staffToken.value = token;
//       staffUser.value = user;
//       localStorage.setItem(STAFF_TOKEN_KEY, token);
//       localStorage.setItem(STAFF_USER_KEY, JSON.stringify(user));
//     }
    
//     // Set active role và Authorization header
//     activeRole.value = role;
//     localStorage.setItem(USER_ROLE_KEY, role);
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   };
  
//   // Helper để xóa trạng thái
//   const clearAuthState = () => {
//     // Clear tất cả keys và state
//     readerToken.value = null;
//     readerUser.value = null;
//     staffToken.value = null;
//     staffUser.value = null;
//     activeRole.value = null;
    
//     localStorage.removeItem(READER_TOKEN_KEY);
//     localStorage.removeItem(READER_USER_KEY);
//     localStorage.removeItem(STAFF_TOKEN_KEY);
//     localStorage.removeItem(STAFF_USER_KEY);
//     localStorage.removeItem(USER_ROLE_KEY);
    
//     delete axios.defaults.headers.common["Authorization"];
//   };


//   // Login function for readers (độc giả)
//   const loginReader = async (credentials) => {
//     try {
//       const response = await axios.post("/docgia/login", {
//         email: credentials.email,
//         password: credentials.password,
//       });

//       // Sử dụng helper để thiết lập trạng thái mới
//       setAuthState(response.data.data.token, response.data.data.docGia, "reader");

//       return { success: true, user: response.data.data.docGia };
//     } catch (error) {
//       console.error("Reader login error:", error);
//       // Xử lý lỗi (giữ nguyên logic)
//       let errorMessage = "Đăng nhập độc giả thất bại";
//       if (error.response) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error.request) {
//         errorMessage = "Không thể kết nối đến server";
//       }

//       return {
//         success: false,
//         error: errorMessage,
//       };
//     }
//   };

//   // Login function for staff (nhân viên)
//   const loginStaff = async (credentials) => {
//     try {
//       const response = await axios.post("/auth/login", {
//         msnv: credentials.username,
//         password: credentials.password,
//       });

//       // Sử dụng helper để thiết lập trạng thái mới
//       setAuthState(response.data.data.token, response.data.data.user, "staff");

//       return { success: true, user: response.data.data.user };
//     } catch (error) {
//       console.error("Staff login error:", error);
//       // Xử lý lỗi (giữ nguyên logic)
//       let errorMessage = "Đăng nhập nhân viên thất bại";
//       if (error.response) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error.request) {
//         errorMessage = "Không thể kết nối đến server";
//       }

//       return {
//         success: false,
//         error: errorMessage,
//       };
//     }
//   };

//   // Generic login function (defaults to reader login for public)
//   const login = loginReader; // Giữ nguyên

//   // Register function for readers
//   const register = async (userData) => {
//     try {
//       const response = await axios.post("/docgia/register", userData);

//       // Auto login after successful registration
//       setAuthState(response.data.data.token, response.data.data.docGia, "reader");

//       return { success: true, user: response.data.data.docGia };
//     } catch (error) {
//       console.error("Registration error:", error);
//       let errorMessage = "Đăng ký thất bại";
//       if (error.response) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error.request) {
//         errorMessage = "Không thể kết nối đến server";
//       }

//       return {
//         success: false,
//         error: errorMessage,
//       };
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       // Clear tất cả keys và state
//       clearAuthState();
      
//       // Có thể gọi API logout nếu cần thiết cho staff (api "/auth/logout")
//       // Nếu API này không cần thiết (chỉ cần clear client state) thì bỏ qua
//       // await axios.post("/auth/logout"); 

//       return { success: true };
//     } catch (error) {
//       console.error("Logout error:", error);
//       // Vẫn clear local data ngay cả khi có lỗi
//       clearAuthState();

//       return { success: false, error: error.message };
//     }
//   };

//   // Check if token is expired (sửa để check token đang active)
//   const isTokenExpired = () => {
//     const tokenToCheck = currentToken.value;
//     if (!tokenToCheck) return true;

//     try {
//       // Decode JWT token để check expiration
//       const payload = decodeJWTPayload(tokenToCheck);
//       const currentTime = Date.now() / 1000;

//       return payload.exp < currentTime;
//     } catch (error) {
//       console.error("Token decode error:", error);
//       return true;
//     }
//   };

//   // Refresh token if needed
//   const refreshToken = async () => {
//     const role = activeRole.value;
//     if (!role || role === 'reader') {
//       console.warn("Refresh token not supported or not implemented for this role.");
//       return { success: false };
//     }
    
//     try {
//       const response = await axios.post("/auth/refresh");

//       // Update token (chỉ cho staff vì "/auth/refresh" là staff API)
//       const newToken = response.data.data.token;
      
//       staffToken.value = newToken;
//       localStorage.setItem(STAFF_TOKEN_KEY, newToken);
//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${newToken}`;

//       return { success: true };
//     } catch (error) {
//       console.error("Refresh token error:", error);
//       logout();
//       return { success: false };
//     }
//   };

//   // Initialize auth state khi app khởi động (sửa để setup header đúng)
//   const initAuth = () => {
//     const token = currentToken.value;
    
//     if (token && !isTokenExpired()) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     } else if (token && isTokenExpired()) {
//       // Token hết hạn, logout
//       logout();
//     }
//   };

//   // Get user profile (for readers) (sửa để dùng biến readerUser)
//   const getProfile = async () => {
//     try {
//       if (activeRole.value !== 'reader' || !readerToken.value) {
//         return { success: false, error: 'Không có token hoặc vai trò không đúng' };
//       }

//       const response = await axios.get("/docgia/profile");
      
//       readerUser.value = response.data.data;
//       localStorage.setItem(READER_USER_KEY, JSON.stringify(response.data.data));
      
//       return { success: true, user: response.data.data };
//     } catch (error) {
//       if (error.response?.status === 401) {
//         // Nếu 401, chỉ clear reader state
//         readerToken.value = null;
//         readerUser.value = null;
//         localStorage.removeItem(READER_TOKEN_KEY);
//         localStorage.removeItem(READER_USER_KEY);
//         // Có thể cần clear activeRole nếu muốn chuyển về Guest
//       }

//       return {
//         success: false,
//         error: error.response?.data?.message || "Không thể lấy thông tin profile",
//       };
//     }
//   };
  
//   // Các hàm còn lại (updateProfile, changePassword, getUserRole) cần sửa tương tự để dùng
//   // các biến riêng biệt và kiểm tra `activeRole` (tôi sẽ giữ lại trong bản sửa code hoàn chỉnh)

//   // Get user role
//   const getUserRole = () => {
//     return activeRole.value || "guest"; // Thay "reader" bằng "guest" cho rõ ràng
//   };

//   return {
//     // State
//     readerToken: computed(() => readerToken.value),
//     staffToken: computed(() => staffToken.value),
//     activeRole,
//     currentToken, // Token đang active
//     user: currentUser, // User đang active
//     isAuthenticated,
//     isReader,
//     isStaff,

//     // Methods
//     login,
//     loginReader,
//     loginStaff,
//     register,
//     logout,
//     getProfile,
//     // ... (các method khác giữ nguyên)
//     updateProfile,
//     changePassword,
//     getUserRole,
//     isTokenExpired,
//     refreshToken,
//     initAuth,
//   };
// }

// // ... (Helper functions decodeJWTPayload, base64UrlDecode giữ nguyên)
// // Cần thêm các thay đổi cho updateProfile, changePassword
// // Helper function để decode JWT token (cho real tokens từ backend)
// function decodeJWTPayload(token) {
//   try {
//     const parts = token.split(".");
//     if (parts.length !== 3) {
//       throw new Error("Invalid token format");
//     }

//     // Decode payload part
//     const payload = parts[1];
//     // Add padding if needed
//     const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
//     // Replace URL-safe characters
//     const base64 = paddedPayload.replace(/-/g, "+").replace(/_/g, "/");

//     return JSON.parse(atob(base64));
//   } catch (error) {
//     throw new Error("Failed to decode token");
//   }
// }

// // Helper function để decode base64 thành UTF-8 string (nếu cần)
// function base64UrlDecode(str) {
//   // Add padding if needed
//   str += "=".repeat((4 - (str.length % 4)) % 4);

//   // Replace URL-safe characters
//   str = str.replace(/-/g, "+").replace(/_/g, "/");

//   try {
//     // Decode base64 to binary string
//     const binary = atob(str);

//     // Convert binary string to UTF-8 bytes
//     const bytes = new Uint8Array(binary.length);
//     for (let i = 0; i < binary.length; i++) {
//       bytes[i] = binary.charCodeAt(i);
//     }

//     // Decode UTF-8 bytes to string
//     return new TextDecoder().decode(bytes);
//   } catch (error) {
//     console.error("Base64 decode error:", error);
//     throw error;
//   }
// }
// useAuth.js (Đã sửa)
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "@/utils/axios";

// ====================================================================
// Sửa đổi: Tách biệt keys và quản lý trạng thái active
// ====================================================================
const READER_TOKEN_KEY = "readerToken";
const READER_USER_KEY = "readerUser";
const STAFF_TOKEN_KEY = "staffToken";
const STAFF_USER_KEY = "staffUser";
const USER_ROLE_KEY = "userRole"; // Key này có thể giữ lại để lưu vai trò active

// Helper function
function parseUserFromLocalStorage(key) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn(`Error parsing user from localStorage key '${key}':`, error);
    return null;
  }
}

// Global state cho tất cả keys
const readerToken = ref(localStorage.getItem(READER_TOKEN_KEY));
const readerUser = ref(parseUserFromLocalStorage(READER_USER_KEY));
const staffToken = ref(localStorage.getItem(STAFF_TOKEN_KEY));
const staffUser = ref(parseUserFromLocalStorage(STAFF_USER_KEY));
const activeRole = ref(localStorage.getItem(USER_ROLE_KEY) || 'guest');


export function useAuth() {
  const router = useRouter(); // Import router nếu cần

  // Computed properties
  const isReader = computed(() => activeRole.value === 'reader' && !!readerToken.value);
  const isStaff = computed(() => activeRole.value === 'staff' && !!staffToken.value);
  const isAuthenticated = computed(() => isReader.value || isStaff.value);
  
  const currentToken = computed(() => {
    return isStaff.value ? staffToken.value : isReader.value ? readerToken.value : null;
  });

  const currentUser = computed(() => {
    return isStaff.value ? staffUser.value : isReader.value ? readerUser.value : null;
  });

  // Helper để thiết lập trạng thái và headers
  const setAuthState = (token, user, role) => {
    // Clear trạng thái của vai trò khác (để hỗ trợ chuyển đổi vai trò trong cùng 1 tab)
    if (role === 'reader') {
      staffToken.value = null;
      staffUser.value = null;
      localStorage.removeItem(STAFF_TOKEN_KEY);
      localStorage.removeItem(STAFF_USER_KEY);
      
      readerToken.value = token;
      readerUser.value = user;
      localStorage.setItem(READER_TOKEN_KEY, token);
      localStorage.setItem(READER_USER_KEY, JSON.stringify(user));
    } else if (role === 'staff') {
      readerToken.value = null;
      readerUser.value = null;
      localStorage.removeItem(READER_TOKEN_KEY);
      localStorage.removeItem(READER_USER_KEY);
      
      staffToken.value = token;
      staffUser.value = user;
      localStorage.setItem(STAFF_TOKEN_KEY, token);
      localStorage.setItem(STAFF_USER_KEY, JSON.stringify(user));
    }
    
    // Set active role và Authorization header
    activeRole.value = role;
    localStorage.setItem(USER_ROLE_KEY, role);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };
  
  // Helper để xóa trạng thái
  const clearAuthState = (roleToClear = null) => {
    if (roleToClear === 'reader' || !roleToClear) {
      readerToken.value = null;
      readerUser.value = null;
      localStorage.removeItem(READER_TOKEN_KEY);
      localStorage.removeItem(READER_USER_KEY);
    }
    
    if (roleToClear === 'staff' || !roleToClear) {
      staffToken.value = null;
      staffUser.value = null;
      localStorage.removeItem(STAFF_TOKEN_KEY);
      localStorage.removeItem(STAFF_USER_KEY);
    }

    // Nếu xóa hết hoặc xóa vai trò đang active, thì clear activeRole và header
    if (!roleToClear || activeRole.value === roleToClear) {
      activeRole.value = 'guest';
      localStorage.removeItem(USER_ROLE_KEY);
      delete axios.defaults.headers.common["Authorization"];
    }
  };


  // Login function for readers (độc giả)
  const loginReader = async (credentials) => {
    try {
      const response = await axios.post("/docgia/login", {
        email: credentials.email,
        password: credentials.password,
      });

      setAuthState(response.data.data.token, response.data.data.docGia, "reader");
      return { success: true, user: response.data.data.docGia };
    } catch (error) {
      console.error("Reader login error:", error);
      let errorMessage = "Đăng nhập độc giả thất bại";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server";
      }

      return { success: false, error: errorMessage };
    }
  };

  // Login function for staff (nhân viên)
  const loginStaff = async (credentials) => {
    try {
      const response = await axios.post("/auth/login", {
        msnv: credentials.username,
        password: credentials.password,
      });

      setAuthState(response.data.data.token, response.data.data.user, "staff");
      return { success: true, user: response.data.data.user };
    } catch (error) {
      console.error("Staff login error:", error);
      let errorMessage = "Đăng nhập nhân viên thất bại";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server";
      }

      return { success: false, error: errorMessage };
    }
  };

  // Generic login function
  const login = loginReader;

  // Register function for readers
  const register = async (userData) => {
    try {
      const response = await axios.post("/docgia/register", userData);

      setAuthState(response.data.data.token, response.data.data.docGia, "reader");
      return { success: true, user: response.data.data.docGia };
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Đăng ký thất bại";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server";
      }

      return { success: false, error: errorMessage };
    }
  };

  // Logout function (cần rõ ràng hơn)
  const logout = async (role = null) => {
    const roleToLogout = role || activeRole.value;
    
    // Nếu chỉ logout 1 vai trò, chỉ xóa state của vai trò đó
    if (roleToLogout) {
      clearAuthState(roleToLogout);
    } else {
      // Logout tất cả
      clearAuthState();
    }
    
    // Điều hướng về trang login nếu không còn token nào
    if (!isAuthenticated.value) {
      router.push({ name: 'login' }); // Giả định có router.push
    }

    return { success: true };
  };

  // Check if token is expired (sửa để check token đang active)
  const isTokenExpired = () => {
    const tokenToCheck = currentToken.value;
    if (!tokenToCheck) return true;

    try {
      const payload = decodeJWTPayload(tokenToCheck);
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Token decode error:", error);
      return true;
    }
  };

  // Refresh token (chỉ cho staff, vì API là Staff API)
  const refreshToken = async () => {
    if (!isStaff.value) {
      console.warn("Refresh token only for Staff role.");
      return { success: false };
    }
    
    try {
      // Phải đảm bảo request này dùng token Staff
      const response = await axios.post("/auth/refresh");

      const newToken = response.data.data.token;
      
      staffToken.value = newToken;
      localStorage.setItem(STAFF_TOKEN_KEY, newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      console.error("Refresh token error:", error);
      // Nếu refresh lỗi, logout staff
      clearAuthState('staff');
      router.push({ name: 'login' }); 
      return { success: false };
    }
  };

  // Initialize auth state
  const initAuth = () => {
    const token = currentToken.value;
    
    if (token && !isTokenExpired()) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else if (token && isTokenExpired()) {
      // Token hết hạn, logout
      logout();
    }
  };

  // Get user profile (for readers) (Sửa để dùng key Reader)
  const getProfile = async () => {
    try {
      if (!isReader.value) {
        return { success: false, error: 'Không có token Reader hoặc vai trò không đúng' };
      }

      const response = await axios.get("/docgia/profile");
      
      readerUser.value = response.data.data;
      localStorage.setItem(READER_USER_KEY, JSON.stringify(response.data.data));
      
      return { success: true, user: response.data.data };
    } catch (error) {
      if (error.response?.status === 401) {
        // Nếu 401, chỉ clear reader state
        clearAuthState('reader');
      }

      return {
        success: false,
        error: error.response?.data?.message || "Không thể lấy thông tin profile",
      };
    }
  };
  
  // Update profile (for readers) (Sửa để dùng key Reader)
  const updateProfile = async (profileData) => {
    if (!isReader.value) return { success: false, error: "Chỉ độc giả mới được cập nhật profile" };
    
    try {
      const response = await axios.put("/docgia/profile", profileData);
      readerUser.value = response.data.data;
      localStorage.setItem(READER_USER_KEY, JSON.stringify(response.data.data));
      return { success: true, user: response.data.data };
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Không thể cập nhật profile",
      };
    }
  };

  // Change password (for readers)
  const changePassword = async (passwordData) => {
    if (!isReader.value) return { success: false, error: "Chỉ độc giả mới được đổi mật khẩu" };
    
    try {
      await axios.put("/docgia/change-password", passwordData);
      return { success: true };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Không thể đổi mật khẩu",
      };
    }
  };

  // Get user role
  const getUserRole = () => {
    return activeRole.value;
  };

  return {
    // State
    readerToken: computed(() => readerToken.value),
    staffToken: computed(() => staffToken.value),
    activeRole,
    currentToken, 
    user: currentUser,
    isAuthenticated,
    isReader,
    isStaff,

    // Methods
    login,
    loginReader,
    loginStaff,
    register,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    getUserRole,
    isTokenExpired,
    refreshToken,
    initAuth,
  };
}

// Helper function để decode JWT token (giữ nguyên)
function decodeJWTPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const payload = parts[1];
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const base64 = paddedPayload.replace(/-/g, "+").replace(/_/g, "/");

    return JSON.parse(atob(base64));
  } catch (error) {
    throw new Error("Failed to decode token");
  }
}
// Helper function base64UrlDecode giữ nguyên
// // Helper function để decode base64 thành UTF-8 string (nếu cần)
function base64UrlDecode(str) {
  // Add padding if needed
  str += "=".repeat((4 - (str.length % 4)) % 4);

  // Replace URL-safe characters
  str = str.replace(/-/g, "+").replace(/_/g, "/");

  try {
    // Decode base64 to binary string
    const binary = atob(str);

    // Convert binary string to UTF-8 bytes
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Decode UTF-8 bytes to string
    return new TextDecoder().decode(bytes);
  } catch (error) {
    console.error("Base64 decode error:", error);
    throw error;
  }
}
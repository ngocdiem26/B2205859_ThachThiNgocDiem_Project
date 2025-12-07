import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/composables/useAuth.js"; // Đảm bảo đường dẫn đúng
// Lazy load components for better performance
const Home = () => import("../views/Home.vue");
const Login = () => import("../views/Login.vue");
const Register = () => import("../views/Register.vue");
const UserList = () => import("../views/UserList.vue");
const DocGia = () => import("../views/DocGia.vue");
const NhanVien = () => import("../views/NhanVien.vue");
const Dashboard = () => import("../views/Dashboard.vue");

const SachNew = () => import("../views/SachNew.vue");
const NhaXuatBanNew = () => import("../views/NhaXuatBanNew.vue");
const TheoDoiMuonSach = () => import("../views/TheoDoiMuonSach.vue");
const AdminLayout = () => import("../layouts/AdminLayout.vue");
const PhieuDangKy = () => import("../views/PhieuDangKy.vue");

// Public interface components
const PublicLayout = () => import("../layouts/PublicLayout.vue");
const PublicHome = () => import("../views/PublicHome.vue");
const BooksList = () => import("../views/BooksList.vue");
const BookDetail = () => import("../views/BookDetail.vue");
const Profile = () => import("../views/Profile.vue");
const About = () => import("../views/About.vue");
const Contact = () => import("../views/Contact.vue");
const Help = () => import("../views/Help.vue");
const Privacy = () => import("../views/Privacy.vue");
const Terms = () => import("../views/Terms.vue");

const routes = [
  // Public routes with layout
  {
    path: "/",
    component: PublicLayout,
    children: [
      { path: "", name: "PublicHome", component: PublicHome },
       // ⭐⭐ THÊM ROUTE NÀY để fix lỗi
  { path: "categories", name: "Categories", component: BooksList },
      { path: "categories/:id", name: "CategoryBooks", component: BooksList },
      { path: "books", name: "Books", component: BooksList },
      { path: "books/:id", name: "BookDetail", component: BookDetail },
{ path: "profile", name: "Profile", component: Profile, meta: { requiresAuth: true, role: 'reader' } },      { path: "about", name: "About", component: About },
      { path: "contact", name: "Contact", component: Contact },
      { path: "help", name: "Help", component: Help },
      { path: "privacy", name: "Privacy", component: Privacy },
      { path: "terms", name: "Terms", component: Terms },
    ],
  },

 // Auth routes (standalone)
  { path: "/login", name: "Login", component: Login, meta: { isPublic: true } },
  { path: "/register", name: "Register", component: Register, meta: { isPublic: true } },
  
  // Admin routes with layout
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'staff' }, // Thêm meta cho tất cả children
    children: [
      { path: "", name: "Dashboard", component: Dashboard },
      { path: "docgia", name: "DocGia", component: DocGia },
      { path: "nhanvien", name: "NhanVien", component: NhanVien },
      { path: "sach", name: "Sach", component: SachNew },
      { path: "nhaxuatban", name: "NhaXuatBan", component: NhaXuatBanNew },
      { path: "users", name: "UserList", component: UserList },
      {
        path: "theodoimuonsach",
        name: "TheoDoiMuonSach",
        component: TheoDoiMuonSach,
      },
      {
        path: "phieudangky",
        name: "PhieuDangKy",
        component: PhieuDangKy,
      },
      { path: "thongke", name: "ThongKe", component: Dashboard },
      { path: "settings", name: "Settings", component: Dashboard },
      { path: "profile", name: "AdminProfile", component: Dashboard },
      { 
        path: "categories", 
        name: "Categories", 
        component: BooksList 
      },

    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for authentication (ĐÃ SỬA LẠI HOÀN TOÀN)
router.beforeEach(async (to, from, next) => {
  const { 
    isAuthenticated, 
    isReader, 
    isStaff, 
    getUserRole, 
    logout, 
    currentToken,
    initAuth 
  } = useAuth();
  
  // Gọi initAuth để đảm bảo header được thiết lập lại nếu có token trong storage
  initAuth();

  const token = currentToken.value;
  const userRole = getUserRole();
  
  // Kiểm tra meta data trên route hoặc route cha
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRole = to.matched.some(record => record.meta.role) 
    ? to.matched.find(record => record.meta.role).meta.role 
    : null;
  const isAuthPage = to.name === 'Login' || to.name === 'Register';


  // 1. Kiểm tra Token hết hạn/Không hợp lệ
  if (token && requiresAuth) {
    try {
        // Chỉ decode local token để check expiration nhanh
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
            throw new Error("Invalid token format");
        }
        
        const payload = JSON.parse(
            atob(tokenParts[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
            // Token expired. Gọi logout an toàn (sẽ tự clear role đang active)
            console.warn("Token expired. Logging out.");
            await logout(); 
            return next({ name: "Login", query: { redirect: to.fullPath } });
        }
    } catch (error) {
        // Token không hợp lệ. Gọi logout an toàn.
        console.error("Invalid token detected:", error);
        await logout();
        return next({ name: "Login", query: { redirect: to.fullPath } });
    }
  }


  // 2. Xử lý truy cập vào trang yêu cầu đăng nhập
  if (requiresAuth && !isAuthenticated.value) {
    // Không có token hợp lệ, redirect về Login
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  // 3. Kiểm tra phân quyền dựa trên vai trò
  if (requiresAuth && isAuthenticated.value) {
    if (requiredRole === 'staff' && !isStaff.value) {
      // Yêu cầu Staff nhưng đang là Reader
      console.warn(`Access denied. Staff role required for ${to.path}. Current role: ${userRole}`);
      return next({ name: 'PublicHome' }); // Hoặc trang lỗi 403
    }

    if (requiredRole === 'reader' && !isReader.value) {
      // Yêu cầu Reader nhưng đang là Staff
      console.warn(`Access denied. Reader role required for ${to.path}. Current role: ${userRole}`);
      return next({ name: 'Dashboard' }); // Hoặc trang lỗi 403
    }
  }

  // 4. Xử lý người dùng đã đăng nhập truy cập trang Login/Register
  if (isAuthPage && isAuthenticated.value) {
    // Redirect authenticated users away from login/register
    if (isStaff.value) {
      return next({ name: "Dashboard" });
    } else if (isReader.value) {
      return next({ name: "PublicHome" });
    }
  }

  // 5. Mọi thứ hợp lệ
  next();
});

export default router;
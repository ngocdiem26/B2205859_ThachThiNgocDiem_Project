<template>
    <header class="navbar navbar-expand-lg library-header">
        <div class="container-fluid px-4">
            <router-link to="/admin" class="navbar-brand d-flex align-items-center">
                <div class="logo-wrapper">
                    <img class="logo" src="/images/logo.jpg" alt="Logo" @error="$event.target.style.display='none'">
                </div>
                <div class="brand-text ms-3">
                    <h1 class="m-0">Quản lý thư viện</h1>
                    <span class="subtitle">Administrator Portal</span>
                </div>
            </router-link>

            <button class="navbar-toggler custom-toggler" type="button" @click="toggleMobileMenu" aria-label="Toggle navigation">
                <span class="burger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </button>

            <div class="navbar-nav ms-auto align-items-center" :class="{ 'show-mobile': showMobileMenu }">
                <div class="nav-item dropdown user-dropdown position-relative">
                    <a class="nav-link dropdown-toggle d-flex align-items-center gap-3" href="#" role="button"
                        @click.prevent="toggleUserMenu" aria-expanded="false">
                        
                        <div class="user-info d-none d-md-block text-end">
                            <span class="d-block fw-bold text-white user-name">
                                {{ displayUser.HoTenNV || 'Admin' }}
                            </span>
                            <span class="d-block text-white-50 small user-role">
                                {{ displayUser.ChucVu || 'Quản trị viên' }}
                            </span>
                        </div>

                        <div class="avatar-circle">
                            <span class="avatar-initials">
                                {{ (displayUser.HoTenNV || 'A').charAt(0).toUpperCase() }}
                            </span>
                            <div class="status-indicator"></div>
                        </div>
                    </a>

                    <transition name="dropdown-anim">
                        <ul class="dropdown-menu dropdown-menu-end custom-dropdown" :class="{ show: showUserMenu }">
                            <div class="dropdown-header d-md-none text-center pb-2 border-bottom mb-2">
                                <strong>{{ displayUser.HoTenNV || 'Admin' }}</strong>
                                <div class="small text-muted">{{ displayUser.ChucVu || 'Quản trị viên' }}</div>
                            </div>
                            <li>
                                <router-link to="/admin/profile" class="dropdown-item">
                                    <div class="icon-box bg-light-primary text-primary">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <span>Thông tin cá nhân</span>
                                </router-link>
                            </li>
                            <li>
                                <a href="#" class="dropdown-item" @click="handleChangePassword">
                                    <div class="icon-box bg-light-warning text-warning">
                                        <i class="fas fa-key"></i>
                                    </div>
                                    <span>Đổi mật khẩu</span>
                                </a>
                            </li>
                            <li>
                                <hr class="dropdown-divider my-2">
                            </li>
                            <li>
                                <a href="#" class="dropdown-item logout-item" @click="handleLogout">
                                    <div class="icon-box bg-light-danger text-danger">
                                        <i class="fas fa-sign-out-alt"></i>
                                    </div>
                                    <span>Đăng xuất</span>
                                </a>
                            </li>
                        </ul>
                    </transition>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { currentUser, logout } = useAuth() // currentUser có thể bị undefined lúc đầu

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

// --- FIX LỖI SẬP TRANG TẠI ĐÂY ---
const displayUser = computed(() => {
    // 1. Kiểm tra an toàn: Nếu currentUser tồn tại VÀ là ref (có .value)
    if (currentUser && currentUser.value) {
        return currentUser.value;
    }
    
    // 2. Nếu currentUser là object thường (không phải ref) và có dữ liệu
    if (currentUser && !currentUser.value && Object.keys(currentUser).length > 0) {
        return currentUser;
    }

    // 3. Fallback: Lấy trực tiếp từ LocalStorage (Đây là cách chắc chắn nhất để hiển thị ngay)
    try {
        const stored = localStorage.getItem('user');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Lỗi đọc user từ localStorage", e);
    }

    // 4. Trả về rỗng nếu không tìm thấy gì để không gây lỗi
    return {};
});

const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value
}

const handleLogout = async () => {
    try {
        await logout()
        router.push('/login')
    } catch (error) {
        console.error('Logout error:', error)
    }
}

const handleChangePassword = () => {
    console.log('Change password clicked')
}

// Đóng dropdown khi click ra ngoài
const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown') && !event.target.closest('.navbar-toggler')) {
        showUserMenu.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* --- Header Background & Layout --- */
.library-header {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
    padding: 0.8rem 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1000;
}

/* --- Branding --- */
.logo-wrapper {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* .logo {
    max-height: 28px;
    object-fit: contain;
} */
.logo {
  width: 40px;
  height: 40px;
  /* object-fit: contain; */
  object-fit: cover; /* Dùng cover để ảnh lấp đầy khung tròn đẹp hơn */
  border-radius: 50%; /* <--- Dòng này biến hình vuông thành hình tròn */
  
  /* (Tùy chọn) Thêm viền nhẹ nếu logo bị chìm vào nền trắng */
  border: 1px solid #eee;

}

.brand-text h1 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0;
    line-height: 1.2;
}

.brand-text .subtitle {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 300;
    letter-spacing: 0.5px;
}

/* --- Avatar & User Area --- */
.avatar-circle {
    width: 40px;
    height: 40px;
    background: linear-gradient(45deg, #FFB75E, #ED8F03);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
    position: relative;
    border: 2px solid rgba(255,255,255,0.3);
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background-color: #2ecc71;
    border: 2px solid #fff;
    border-radius: 50%;
}

.dropdown-toggle {
    text-decoration: none;
}
.dropdown-toggle::after {
    display: none;
}

/* --- Custom Dropdown Menu --- */
.custom-dropdown {
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    padding: 0.5rem;
    margin-top: 15px !important;
    min-width: 250px;
}

.custom-dropdown::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: white;
    transform: rotate(45deg);
    border-top: 1px solid rgba(0,0,0,0.05);
    border-left: 1px solid rgba(0,0,0,0.05);
}

.dropdown-item {
    border-radius: 8px;
    padding: 0.7rem 1rem;
    display: flex;
    align-items: center;
    font-weight: 500;
    color: #4a5568;
    margin-bottom: 2px;
}

.dropdown-item:hover {
    background-color: #f7fafc;
    color: #2a5298;
    transform: translateX(5px);
    transition: all 0.2s;
}

.logout-item:hover {
    background-color: #fff5f5;
    color: #e53e3e;
}

.icon-box {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin-right: 12px;
}
.bg-light-primary { background: #ebf8ff; color: #3182ce; }
.bg-light-warning { background: #fffaf0; color: #dd6b20; }
.bg-light-danger { background: #fff5f5; color: #e53e3e; }

/* --- Mobile Toggle Button Custom --- */
.navbar-toggler {
    border: none;
    padding: 0;
}
.navbar-toggler:focus {
    box-shadow: none;
}
.burger-icon span {
    display: block;
    width: 25px;
    height: 2px;
    background-color: #fff;
    margin-bottom: 5px;
    border-radius: 2px;
    transition: all 0.3s;
}
.burger-icon span:last-child {
    margin-bottom: 0;
}

/* --- Vue Animation --- */
.dropdown-anim-enter-active,
.dropdown-anim-leave-active {
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.dropdown-anim-enter-from,
.dropdown-anim-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
<template>
  <header class="app-header">
    <div class="header-content container-fluid">
      
      <div class="d-flex align-items-center gap-3">
        <button class="btn-icon d-lg-none" @click="toggleMobileMenu">
          <i class="bi bi-list fs-3 text-dark"></i>
        </button>

        <div class="d-flex flex-column" style="margin-left: 65px;">
          <div class="text-muted x-small text-uppercase fw-bold ls-1 mb-1">
            {{ currentDate }}
          </div>
          <h5 class="mb-0 fw-bolder text-dark d-flex align-items-center">
             Dashboard
          </h5>
        </div>
      </div>

      <div class="d-flex align-items-center gap-3">


        <div class="dropdown user-dropdown">
          <a class="d-flex align-items-center gap-3 text-decoration-none cursor-pointer p-1 rounded-pill hover-bg" 
             href="#" @click.prevent="toggleUserMenu" data-bs-toggle="dropdown" aria-expanded="false">
            
            <div class="text-end d-none d-md-block lh-1">
              <div class="fw-bold text-dark small mb-1">
                {{ user?.HoTenNV || 'Administrator' }}
              </div>
              <div class="x-small text-muted text-uppercase fw-bold">
                {{ user?.ChucVu || 'Quản trị viên' }}
              </div>
            </div>

            <div class="avatar-wrapper">
              <div class="avatar-img gradient-bg">
                <span>{{ (user?.HoTenNV || 'A').charAt(0).toUpperCase() }}</span>
              </div>
              
              <div class="status-indicator"></div>
            </div>
          </a>

          <transition name="dropdown-fade">
            <ul class="dropdown-menu dropdown-menu-end custom-menu shadow-lg border-0 rounded-4 mt-3 p-2" :class="{ show: showUserMenu }">
              <li class="d-md-none px-3 py-3 border-bottom mb-2 bg-light rounded-top-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="avatar-img gradient-bg" style="width: 40px; height: 40px; font-size: 1.2rem;">
                    <span>{{ (user?.HoTenNV || 'A').charAt(0).toUpperCase() }}</span>
                  </div>
                  <div>
                    <div class="fw-bold text-dark">{{ user?.HoTenNV || 'Admin' }}</div>
                    <small class="text-muted">{{ user?.ChucVu || 'Admin' }}</small>
                  </div>
                </div>
              </li>

              <li>
                <router-link to="/admin/profile" class="dropdown-item rounded-3 py-2 d-flex align-items-center">
                  <div class="icon-sm bg-primary-subtle text-primary me-3 rounded-circle">
                    <i class="bi bi-person-fill"></i>
                  </div>
                  <span>Hồ sơ cá nhân</span>
                </router-link>
              </li>
              <li>
                <a href="#" class="dropdown-item rounded-3 py-2 d-flex align-items-center" @click.prevent>
                  <div class="icon-sm bg-info-subtle text-info me-3 rounded-circle">
                    <i class="bi bi-shield-lock-fill"></i>
                  </div>
                  <span>Đổi mật khẩu</span>
                </a>
              </li>
              <li><hr class="dropdown-divider my-2 border-light"></li>
              <li>
                <a href="#" class="dropdown-item rounded-3 py-2 d-flex align-items-center text-danger" @click="handleLogout">
                  <div class="icon-sm bg-danger-subtle text-danger me-3 rounded-circle">
                    <i class="bi bi-box-arrow-right"></i>
                  </div>
                  <span class="fw-medium">Đăng xuất</span>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'nav-click'])

const route = useRoute()
const collapsed = ref(props.modelValue)
const user = ref(null)


// Load user info from localStorage
onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    try {
      user.value = JSON.parse(userData)
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }
})
// Date display formatter
const currentDate = computed(() => {
  const date = new Date()
  return new Intl.DateTimeFormat('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date)
})

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
  emit('update:modelValue', collapsed.value)
}

const isActive = (path) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

const handleNavClick = () => {
  emit('nav-click')
}
</script>

<style scoped>
/* --- MAIN HEADER STYLE --- */
.app-header {
  height: 80px; /* Tăng chiều cao một chút cho thoáng */
  background-color: rgba(255, 255, 255, 0.8); /* Nền trắng mờ */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  /* Z-index thấp hơn Sidebar (thường là 1000) để Sidebar đè lên khi mở trên mobile */
  z-index: 900; 
  transition: all 0.3s ease;
  /* Đường viền dưới tinh tế */
  border-bottom: 1px solid rgba(0,0,0,0.03);
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

/* --- TYPOGRAPHY --- */
.ls-1 { letter-spacing: 0.5px; }
.x-small { font-size: 0.7rem; }
.lh-1 { line-height: 1.3; }

/* --- ACTION BUTTONS --- */
.btn-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid transparent;
  background-color: #fff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;
}

.btn-icon:hover, .btn-icon[aria-expanded="true"] {
  background-color: #fff;
  color: #4361ee;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.15);
  transform: translateY(-2px);
}

/* --- USER PROFILE --- */
.hover-bg {
  transition: background-color 0.2s;
}
.hover-bg:hover {
  background-color: rgba(0,0,0,0.02);
}

.avatar-wrapper {
  position: relative;
  padding: 3px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.user-dropdown:hover .avatar-wrapper {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.2);
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.2rem;
}

.gradient-bg {
  /* Gradient màu tím-hồng hiện đại */
  background: linear-gradient(135deg, #4361ee, #7209b7); 
}

.status-indicator {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 10px;
  height: 10px;
  background-color: #10b981; /* Green success */
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.05);
}

/* --- DROPDOWN MENU CUSTOMIZATION --- */
.custom-menu {
  min-width: 260px;
  margin-top: 1rem !important;
  border: 1px solid rgba(0,0,0,0.05);
  animation: menuSlideUp 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dropdown-item {
  font-weight: 500;
  color: #475569;
  border-radius: 8px;
  margin-bottom: 2px;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: #f8fafc;
  color: #4361ee;
  transform: translateX(4px);
}

.dropdown-item.text-danger:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

.icon-sm {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.icon-circle-sm {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bg-primary-subtle { background-color: #e0f2fe; }
.bg-success-subtle { background-color: #dcfce7; }
.bg-info-subtle { background-color: #cffafe; }
.bg-warning-subtle { background-color: #fef3c7; }
.bg-danger-subtle { background-color: #fee2e2; }

/* --- ANIMATIONS --- */
@keyframes menuSlideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.cursor-pointer { cursor: pointer; }

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .app-header {
    height: 70px;
  }
  .header-content {
    padding: 0 1rem;
  }
  .header-info {
      display: none;
  }
}
</style>
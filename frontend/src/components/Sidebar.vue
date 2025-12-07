<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': collapsed }">
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <i class="bi bi-book-half"></i>
        </div>
        <div v-if="!collapsed" class="brand-info">
          <span class="brand-title">LibManager</span>
          <span class="brand-subtitle">System</span>
        </div>
      </div>
      <button class="sidebar-toggle" @click="toggleSidebar">
        <i class="bi" :class="collapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
      </button>
    </div>

    <div class="sidebar-content">
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item" v-for="item in menuItems" :key="item.name">
            <router-link :to="item.path" class="nav-link" :class="{ 'active': isActive(item.path) }"
              @click="handleNavClick" :title="collapsed ? item.label : ''">
              <i class="nav-icon" :class="item.icon"></i>
              <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
              
              <span v-if="item.badge && !collapsed" class="nav-badge" :class="item.badgeClass">
                {{ item.badge }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <div class="sidebar-footer">
      <div class="user-card" :class="{ 'collapsed': collapsed }">
        <div class="user-avatar">
          <span>{{ (user?.HoTenNV || 'A').charAt(0).toUpperCase() }}</span>
        </div>
        <div v-if="!collapsed" class="user-details">
          <div class="user-name">{{ user?.HoTenNV || 'Admin' }}</div>
          <div class="user-role">{{ user?.ChucVu || 'Quản trị viên' }}</div>
        </div>
      </div>
    </div>
  </aside>
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

// Menu items - show all tabs for all users
const menuItems = computed(() => {
  return [
    {
      name: 'dashboard',
      path: '/admin',
      label: 'Thống kê',
      icon: 'bi bi-grid-1x2-fill' // Đổi icon hiện đại hơn
    },
    {
      name: 'docgia',
      path: '/admin/docgia',
      label: 'Độc giả',
      icon: 'bi bi-people-fill'
    },
    {
      name: 'nhanvien',
      path: '/admin/nhanvien',
      label: 'Nhân viên',
      icon: 'bi bi-person-badge-fill'
    },
    {
      name: 'sach',
      path: '/admin/sach',
      label: 'Kho sách',
      icon: 'bi bi-collection-fill'
    },
    {
      name: 'nhaxuatban',
      path: '/admin/nhaxuatban',
      label: 'Nhà xuất bản',
      icon: 'bi bi-building-fill'
    },
    {
      name: 'theodoimuonsach',
      path: '/admin/theodoimuonsach',
      label: 'Mượn trả sách',
      icon: 'bi bi-arrow-left-right'
    },
    {
      name: 'phieudangky',
      path: '/admin/phieudangky',
      label: 'Phiếu đăng ký',
      icon: 'bi bi-file-earmark-check-fill'
    }
  ]
})

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
/* Variables for consistency */
:root {
  --sidebar-width: 260px;
  --sidebar-width-collapsed: 80px;
  --primary-gradient: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  --hover-bg: rgba(255, 255, 255, 0.1);
  --active-bg: rgba(255, 255, 255, 0.2);
}

.sidebar {
  width: 260px;
  height: 100vh;
  background: var(--primary-gradient, linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%));
  color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 25px rgba(0, 0, 0, 0.15);
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

.sidebar-collapsed {
  width: 80px;
}

/* Header */
.sidebar-header {
  padding: 1.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-bottom: 1rem;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.brand-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-title {
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
}

.brand-subtitle {
  font-size: 0.7rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Toggle Button */
.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: #fff;
  color: #4361ee;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  z-index: 100;
}

.sidebar-toggle:hover {
  transform: translateY(-50%) scale(1.1);
}

/* Navigation */
.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
  /* Hide Scrollbar */
  scrollbar-width: none;
}
.sidebar-content::-webkit-scrollbar { 
  display: none; 
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 6px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-link.active {
  color: #4361ee; /* Text color matches sidebar theme */
  background-color: #fff; /* White background for active state */
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.nav-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  margin-right: 12px;
  transition: transform 0.2s;
}

.nav-link:hover .nav-icon {
  transform: scale(1.1);
}

.nav-text {
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s;
}

/* Footer / User */
.sidebar-footer {
  padding: 20px;
  margin-top: auto;
}

.user-card {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  border: 1px solid rgba(255,255,255,0.1);
}

.user-card.collapsed {
  padding: 0;
  background: transparent;
  border: none;
  justify-content: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #f72585, #b5179e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.user-details {
  overflow: hidden;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.user-role {
  font-size: 0.75rem;
  opacity: 0.7;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 260px;
    border-radius: 0;
  }
  .sidebar.show {
    transform: translateX(0);
  }
  .sidebar-toggle {
    display: none;
  }
}
</style>
<template>
  <div class="admin-layout-container">
    <Sidebar v-model="sidebarCollapsed" @nav-click="handleNavClick" />

    <div class="main-wrapper" :class="{ 'is-collapsed': sidebarCollapsed }">
      
      <Header />

      <main class="content-body">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import Footer from '../components/Footer.vue'

const sidebarCollapsed = ref(false)

const handleNavClick = () => {
    // Tự động đóng sidebar trên mobile khi click menu
    if (window.innerWidth <= 768) {
        sidebarCollapsed.value = true
    }
}

// Hàm toggle sidebar (được gọi từ Header thông qua Event Bus hoặc Window Event)
const toggleSidebarHandler = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    // Lưu trạng thái vào localStorage để nhớ khi F5
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value)
}

onMounted(() => {
    // Khôi phục trạng thái sidebar từ localStorage
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
        sidebarCollapsed.value = savedState === 'true'
    }

    // Lắng nghe sự kiện toggle từ Header (do Header dùng window.dispatchEvent)
    window.addEventListener('toggle-sidebar', toggleSidebarHandler)
})

onUnmounted(() => {
    window.removeEventListener('toggle-sidebar', toggleSidebarHandler)
})
</script>

<style scoped>
.admin-layout-container {
  display: flex;
  min-height: 100vh;
  background-color: #f3f4f6; /* Màu nền xám nhạt tổng thể */
  overflow-x: hidden; /* Tránh thanh cuộn ngang */
}

/* MAIN WRAPPER: Chứa Header + Content + Footer */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
  /* QUAN TRỌNG: Margin-left bằng chiều rộng Sidebar (260px) */
  margin-left: 260px; 
  width: calc(100% - 260px); /* Chiều rộng còn lại */
  
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* Hiệu ứng trượt mượt mà */
}

/* KHI SIDEBAR THU NHỎ */
.main-wrapper.is-collapsed {
  /* Margin-left giảm xuống bằng chiều rộng Sidebar thu nhỏ (80px) */
  margin-left: 80px; 
  width: calc(100% - 80px);
}

.content-body {
  flex: 1; /* Đẩy footer xuống dưới cùng nếu nội dung ngắn */
  padding: 0; /* Padding được xử lý bên trong từng trang (page-container) */
  position: relative;
}

/* Hiệu ứng chuyển trang (Fade) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* RESPONSIVE: Màn hình nhỏ (Mobile/Tablet) */
@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 0 !important; /* Không margin vì Sidebar ẩn/đè lên */
    width: 100% !important;
  }
}
</style>
<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-white fixed-top shadow-sm py-2">
      <div class="container-fluid px-4">
        
        <router-link to="/" class="navbar-brand d-flex align-items-center me-0" style="min-width: 150px;">
          <img src="/images/logo.jpg" alt="Logo" class="logo me-2 rounded-circle border" 
               style="width: 40px; height: 40px; object-fit: cover;" 
               @error="handleLogoError">
          <span class="fw-bold text-primary fs-4">MagicBook</span>
        </router-link>

        <button class="navbar-toggler border-0 shadow-none" type="button" 
                data-bs-toggle="collapse" data-bs-target="#navbarContent"
                aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
          
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 align-items-center justify-content-center gap-4 w-100 main-nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link px-2 fw-medium" :class="{ active: $route.name === 'PublicHome' }">
                Trang chủ
              </router-link>
            </li>

            <!-- <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle px-2 fw-medium" href="#" id="categoriesDropdown" role="button"
                @click.prevent="toggleCategoriesDropdown"
                :class="{ active: $route.name === 'Categories' || $route.name === 'CategoryBooks' }">
                Nhà xuất bản
              </a>
              <ul class="dropdown-menu border-0 shadow-lg rounded-4 mt-3 p-2" :class="{ show: showCategoriesDropdown }">
                <li>
                  <router-link to="/categories" class="dropdown-item py-2 fw-medium rounded-2" @click="closeDropdowns">
                    <i class="bi bi-grid me-2 text-primary"></i>Tất cả
                  </router-link>
                </li>
                <li><hr class="dropdown-divider mx-2"></li>
                <li v-for="category in topCategories" :key="category.MaNhaXuatBan">
                  <router-link :to="`/categories/${category.MaNhaXuatBan}`" class="dropdown-item py-2 rounded-2" @click="closeDropdowns">
                    {{ category.TenNhaXuatBan }}
                  </router-link>
                </li>
                 <li v-if="topCategories.length === 0">
                  <span class="dropdown-item text-muted small">Đang tải...</span>
                </li>
              </ul>
            </li> -->

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="categoriesDropdown" role="button"
                @click.prevent="toggleCategoriesDropdown"
                :aria-expanded="showCategoriesDropdown"
                :class="{ active: $route.name === 'Categories' || $route.name === 'CategoryBooks' }">
                <i class="fas fa-tags me-1"></i>
                Nhà xuất bản
              </a>
              <ul class="dropdown-menu" :class="{ show: showCategoriesDropdown }" aria-labelledby="categoriesDropdown">
                <li>
                  <router-link to="books" class="dropdown-item py-2 fw-medium rounded-2" @click="closeDropdowns">
                    <i class="bi bi-grid me-2 text-primary"></i>Tất cả
                  </router-link>
                </li>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li v-for="category in topCategories" :key="category.MaNhaXuatBan">
                  <router-link
                  :to="{ name: 'CategoryBooks', params: { id: category.MaNhaXuatBan } }"
                  class="dropdown-item"
                  @click="closeDropdowns"
                >
                  {{ category.TenNhaXuatBan }}
                </router-link>

                </li>
                <li v-if="topCategories.length === 0">
                  <span class="dropdown-item text-muted">Đang tải...</span>
                </li>
              </ul>
            </li>

            <li class="nav-item">
              <router-link to="/books" class="nav-link px-2 fw-medium" :class="{ active: $route.name === 'Books' }">
                Kho sách
              </router-link>
            </li>
            
            <li class="nav-item">
              <router-link to="/about" class="nav-link px-2 fw-medium" :class="{ active: $route.name === 'About' }">
                Giới thiệu
              </router-link>
            </li>

            <li class="nav-item">
              <router-link to="/contact" class="nav-link px-2 fw-medium" :class="{ active: $route.name === 'Contact' }">
                Liên hệ
              </router-link>
            </li>

            <li class="nav-item" v-if="isAuthenticated">
              <a href="#" @click.prevent="showBorrowRegistrationModal" class="nav-link px-2 fw-bold text-primary">
                <i class="bi bi-bookmark-plus-fill me-1"></i>Đăng ký mượn
              </a>
            </li>
          </ul>

<div class="d-flex align-items-center gap-3 ms-auto right-actions" style="justify-content: flex-end;">
            
            <form class="search-form position-relative d-none d-xl-block" @submit.prevent="handleSearch">
              <i class="bi bi-search position-absolute text-muted search-icon"></i>
              <input v-model="searchQuery" class="form-control rounded-pill ps-5 bg-light border-0" 
                     type="search" placeholder="Tìm kiếm..." aria-label="Search" style="width: 220px;">
            </form>

            <div v-if="isAuthenticated" class="d-flex align-items-center gap-3 position-relative">
              <div class="dropdown">
                <a class="d-flex align-items-center gap-2 text-decoration-none cursor-pointer p-1 pe-3 rounded-pill user-pill border" 
                   href="#" @click.prevent="toggleUserDropdown">
                  <img :src="user?.avatar || '/images/avatar-default.svg'" 
                       class="rounded-circle border shadow-sm" style="width: 34px; height: 34px; object-fit: cover;"
                       @error="handleAvatarError">
                  <span class="fw-bold small text-dark d-none d-sm-inline text-nowrap">{{ user?.Ten }}</span>
                  <i class="bi bi-chevron-down text-muted x-small"></i>
                </a>
                
                <ul class="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 mt-2 p-2 custom-dropdown" 
                    :class="{ show: showUserDropdown }">
                  <li class="px-3 py-2 border-bottom mb-2">
                      <div class="fw-bold text-dark text-truncate" style="max-width: 180px;">{{ user?.HoLot }} {{ user?.Ten }}</div>
                      <div class="small text-muted font-monospace">{{ user?.MaDocGia }}</div>
                  </li>
                  <li>
                    <router-link to="/profile" class="dropdown-item rounded-2 py-2" @click="closeDropdowns">
                      <i class="bi bi-person me-2 text-primary"></i>Hồ sơ cá nhân
                    </router-link>
                  </li>
                  <li><hr class="dropdown-divider mx-2"></li>
                  <li>
                    <button @click="handleLogout" class="dropdown-item rounded-2 py-2 text-danger">
                      <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div v-else class="d-flex align-items-center gap-2 flex-shrink-0">
              <router-link to="/login" class="btn btn-link text-decoration-none fw-bold text-secondary text-nowrap px-2">
                Đăng nhập
              </router-link>
              
              <router-link to="/register" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm text-nowrap">
                Đăng ký
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </nav>

    <transition name="slide-fade">
        <div v-if="message" class="alert-toast">
          <div class="alert shadow-lg border-0 d-flex align-items-center rounded-4 py-3 px-4"
            :class="messageType === 'success' ? 'bg-success text-white' : 'bg-danger text-white'" role="alert">
            <i :class="messageType === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'" class="me-3 fs-5"></i>
            <div class="fw-medium">{{ message }}</div>
            <button type="button" class="btn-close btn-close-white ms-auto" @click="clearMessage"></button>
          </div>
        </div>
    </transition>

    <div v-if="isAuthenticated">
        <div class="modal-backdrop fade" :class="{ show: showBorrowModal }" v-if="showBorrowModal"></div>
        <div class="modal fade" :class="{ show: showBorrowModal }" 
             style="display: block;" v-if="showBorrowModal" tabindex="-1" @click.self="closeBorrowModal">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
              <div class="modal-header border-bottom-0 pb-0 px-4 pt-4">
                <h5 class="modal-title fw-bold text-dark d-flex align-items-center">
                  <div class="icon-square bg-primary-subtle text-primary rounded-3 me-3">
                      <i class="bi bi-journal-bookmark-fill"></i>
                  </div>
                  Đăng ký mượn sách
                </h5>
                <button type="button" class="btn-close" @click="closeBorrowModal"></button>
              </div>
              <div class="modal-body p-4">
                <form @submit.prevent="submitBorrowRegistration">
                  <div class="user-info-card bg-light border p-3 rounded-3 mb-4">
                    <div class="row align-items-center">
                        <div class="col-md-6 mb-2 mb-md-0 d-flex align-items-center">
                            <div class="avatar-sm bg-secondary bg-opacity-25 rounded-circle me-2 d-flex align-items-center justify-content-center text-secondary fw-bold">
                                {{ user?.Ten?.charAt(0) }}
                            </div>
                            <div>
                                <small class="text-muted d-block lh-1">Độc giả</small>
                                <span class="fw-bold text-dark">{{ user?.HoLot }} {{ user?.Ten }}</span>
                            </div>
                        </div>
                        <div class="col-md-6 text-md-end">
                            <span class="badge bg-white text-dark border px-3 py-2 rounded-pill font-monospace">
                                <i class="bi bi-card-heading me-1 text-muted"></i> {{ user?.MaDocGia }}
                            </span>
                        </div>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-bold small text-uppercase text-secondary">Chọn sách <span class="text-danger">*</span></label>
                    <select v-model="borrowForm.MaSach" class="form-select form-select-lg rounded-3 bg-white shadow-sm border-light" 
                            :class="{ 'is-invalid': borrowErrors.MaSach }">
                      <option value="">-- Tìm sách muốn mượn --</option>
                      <option v-for="book in availableBooks" :key="book.MaSach" :value="book.MaSach">
                        {{ book.TenSach }} (Còn: {{ book.SoQuyenConLai || book.SoQuyen }})
                      </option>
                    </select>
                    <div v-if="borrowErrors.MaSach" class="invalid-feedback">{{ borrowErrors.MaSach }}</div>
                  </div>

                  <div class="row g-3 mb-3">
                     <div class="col-md-6">
                        <label class="form-label fw-bold small text-uppercase text-secondary">Ngày hẹn trả <span class="text-danger">*</span></label>
                        <input type="date" v-model="borrowForm.NgayHenTra" class="form-control form-control-lg rounded-3 shadow-sm border-light" 
                               :class="{ 'is-invalid': borrowErrors.NgayHenTra }" :min="tomorrow">
                        <div v-if="borrowErrors.NgayHenTra" class="invalid-feedback">{{ borrowErrors.NgayHenTra }}</div>
                     </div>
                     <div class="col-12">
                        <label class="form-label fw-bold small text-uppercase text-secondary">Ghi chú</label>
                        <textarea v-model="borrowForm.GhiChu" class="form-control rounded-3 shadow-sm border-light" rows="2" 
                                  placeholder="Ghi chú thêm cho thủ thư..."></textarea>
                     </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer border-top-0 px-4 pb-4 pt-0">
                <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" @click="closeBorrowModal">Hủy bỏ</button>
                <button type="button" class="btn btn-primary rounded-pill px-5 fw-bold shadow-sm hover-lift" 
                        @click="submitBorrowRegistration" :disabled="submitting">
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  {{ submitting ? 'Đang gửi...' : 'Xác nhận đăng ký' }}
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  </header>
</template>

<script>
// SCRIPT GIỮ NGUYÊN NHƯ CŨ (KHÔNG CẦN THAY ĐỔI LOGIC)
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import axios from '@/utils/axios'

export default {
  name: 'PublicHeader',
  setup() {
    const router = useRouter()
    const { user, isAuthenticated, logout } = useAuth()
    const searchQuery = ref(''); const topCategories = ref([]); const message = ref(''); const messageType = ref('success')
    const showUserDropdown = ref(false); const showCategoriesDropdown = ref(false); const showBorrowModal = ref(false)
    const submitting = ref(false); const availableBooks = ref([]); const borrowForm = ref({ MaSach: '', NgayHenTra: '', GhiChu: '' })
    const borrowErrors = ref({}); const isScrolled = ref(false)

    const handleScroll = () => { isScrolled.value = window.scrollY > 10; }
    const loadTopCategories = async () => { try { const res = await axios.get('/nhaxuatban?limit=6&sortBy=TenNhaXuatBan'); topCategories.value = res.data.data.nhaxuatban || [] } catch (e) { console.error(e) } }
    const handleSearch = () => { if (searchQuery.value.trim()) { router.push({ name: 'Books', query: { search: searchQuery.value.trim() } }); searchQuery.value = '' } }
    const handleLogout = async () => { await logout(); closeDropdowns(); router.push('/login') }
    const showMessage = (msg, type = 'success') => { message.value = msg; messageType.value = type; setTimeout(() => { message.value = '' }, 5000) }
    const clearMessage = () => { message.value = '' }
    const handleLogoError = (e) => { e.target.style.display = 'none' }
    const handleAvatarError = (e) => { e.target.src = '/images/avatar-default.svg' }
    const toggleUserDropdown = () => { showUserDropdown.value = !showUserDropdown.value; showCategoriesDropdown.value = false }
    const toggleCategoriesDropdown = () => { showCategoriesDropdown.value = !showCategoriesDropdown.value; showUserDropdown.value = false }
    const closeDropdowns = () => { showUserDropdown.value = false; showCategoriesDropdown.value = false }
    const tomorrow = computed(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0] })
    const loadAvailableBooks = async () => { try { const res = await axios.get('/sach/available'); if (res.data.success) availableBooks.value = res.data.data || [] } catch (e) { console.error(e) } }
    const showBorrowRegistrationModal = async () => { if (!isAuthenticated.value) { router.push('/login'); return; } await loadAvailableBooks(); borrowForm.value = { MaSach: '', NgayHenTra: '', GhiChu: '' }; borrowErrors.value = {}; showBorrowModal.value = true; closeDropdowns(); document.body.style.overflow = 'hidden' }
    const closeBorrowModal = () => { showBorrowModal.value = false; document.body.style.overflow = '' }
    const validateBorrowForm = () => { borrowErrors.value = {}; if (!borrowForm.value.MaSach) borrowErrors.value.MaSach = 'Chọn sách'; if (!borrowForm.value.NgayHenTra) borrowErrors.value.NgayHenTra = 'Chọn ngày'; else { const d = new Date(borrowForm.value.NgayHenTra); const t = new Date(); const max = new Date(); max.setDate(t.getDate()+30); if(d<=t) borrowErrors.value.NgayHenTra='Sau hôm nay'; else if(d>max) borrowErrors.value.NgayHenTra='Max 30 ngày'; } return Object.keys(borrowErrors.value).length === 0 }
    const submitBorrowRegistration = async () => { if (!validateBorrowForm()) return; submitting.value = true; try { const req = { MaDocGia: user.value.MaDocGia, MaSach: borrowForm.value.MaSach, NgayHenTra: borrowForm.value.NgayHenTra, GhiChu: borrowForm.value.GhiChu }; const res = await axios.post('/theodoimuonsach/register', req); if (res.data.success) { showMessage('Thành công!', 'success'); closeBorrowModal() } else { showMessage(res.data.message, 'error') } } catch (e) { showMessage(e.response?.data?.message || 'Lỗi', 'error') } finally { submitting.value = false } }
    const handleGlobalMessage = (e) => { if (e.detail) showMessage(e.detail.message, e.detail.type) }
    const handleOutsideClick = (e) => {
      const isClickUserDropdown = e.target.closest('.custom-dropdown') || e.target.closest('.user-pill')
      const isClickCategoryDropdown = e.target.closest('.dropdown-menu') || e.target.closest('.dropdown-toggle')

      if (!isClickUserDropdown) showUserDropdown.value = false
      if (!isClickCategoryDropdown) showCategoriesDropdown.value = false
    }
    onMounted(() => { loadTopCategories(); window.addEventListener('show-message', handleGlobalMessage); document.addEventListener('click', handleOutsideClick); window.addEventListener('scroll', handleScroll) })
    onUnmounted(() => { window.removeEventListener('show-message', handleGlobalMessage); document.removeEventListener('click', handleOutsideClick); window.removeEventListener('scroll', handleScroll) })

    return { searchQuery, topCategories, message, messageType, user, isAuthenticated, isScrolled, showUserDropdown, showCategoriesDropdown, showBorrowModal, submitting, availableBooks, borrowForm, borrowErrors, tomorrow, handleSearch, handleLogout, clearMessage, handleLogoError, handleAvatarError, toggleUserDropdown, toggleCategoriesDropdown, closeDropdowns, showBorrowRegistrationModal, closeBorrowModal, submitBorrowRegistration }
  }
}
</script>

<style scoped>
/* --- FIX Z-INDEX & POSITION CHO DROPDOWN --- */
.custom-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 9999 !important; /* Đẩy lên trên cùng */
  min-width: 220px;
}

/* Navbar Links */
.nav-link {
  color: #4b5563;
  transition: all 0.2s;
  border-radius: 8px;
}
.nav-link:hover, .nav-link.active {
  color: #0d6efd;
  background-color: rgba(13, 110, 253, 0.04);
}

/* User Pill */
.user-pill:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6 !important;
}

/* Search Icon */
.search-icon { left: 15px; top: 50%; transform: translateY(-50%); z-index: 5; }
.search-form input:focus { box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1); background-color: #fff !important; }

/* Alert */
.alert-toast { position: fixed; top: 90px; right: 20px; z-index: 1060; min-width: 350px; animation: slideIn 0.4s ease-out; }
@keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

/* Responsive */
@media (max-width: 991px) {
  .main-nav { margin: 15px 0 !important; width: 100%; align-items: flex-start !important; }
  .main-nav .nav-link { width: 100%; padding: 10px 0 !important; border-bottom: 1px solid #f1f1f1; border-radius: 0; }
  .right-actions { width: 100%; justify-content: space-between !important; margin-top: 15px; }
  .search-form { display: block !important; width: 100%; margin-bottom: 15px; }
  .navbar-collapse {
    background: white; padding: 20px; border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1); margin-top: 15px;
    max-height: 80vh; overflow-y: auto;
  }
}
</style>
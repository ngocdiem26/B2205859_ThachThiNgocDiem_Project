<template>
  <footer class="container-fluid main-footer mt-5 pt-5 pb-3">
    <div class="container py-5">

      <div class="row footer-content">
        <div class="col-md-5 mb-4 mb-md-0">
          <div class="d-flex align-items-start mb-3">
            <img src="/images/logo.jpg" alt="Thư viện" class="footer-logo me-3 mt-1" @error="handleLogoError">
            <div>
              <h4 class="fw-bold text-dark mb-1">MagicBook Library System</h4>
              <p class="text-muted small">Nền tảng quản lý thư viện điện tử thế hệ mới.</p>
            </div>
          </div>
          
          <p class="text-secondary small mb-4 pe-md-5">
            Hệ thống cung cấp dịch vụ mượn trả sách trực tuyến, giúp độc giả dễ dàng tiếp cận kho tàng tri thức phong phú và đa dạng.
          </p>

          <h6 class="text-uppercase fw-bold mb-3 text-primary">
            <i class="fas fa-headset me-2"></i> Thông tin liên hệ
          </h6>
          <ul class="list-unstyled contact-list">
            <li class="mb-2">
              <i class="fas fa-map-marker-alt me-2 text-primary opacity-75"></i>
              <span class="text-muted">Khu dân cư 91B, Quận Ninh Kiều, Cần Thơ</span>
            </li>
            <li class="mb-2">
              <i class="fas fa-phone me-2 text-primary opacity-75"></i>
              <a href="tel:+84123456789" class="text-decoration-none text-muted">(+84) 123 456 789</a>
            </li>
            <li class="mb-2">
              <i class="fas fa-envelope me-2 text-primary opacity-75"></i>
              <a href="mailto:contact@Magicbook.com" class="text-decoration-none text-muted">contact@magicbook.com</a>
            </li>
          </ul>
        </div>

        <div class="col-md-4 mb-4 mb-md-0">
          <h5 class="text-uppercase fw-bold mb-4 text-dark">
            <i class="fas fa-link me-2 text-primary"></i>
            Liên kết nhanh
          </h5>
          <div class="row">
            <div class="col-6">
              <ul class="list-unstyled link-group">
                <li class="mb-2">
                  <router-link to="/" class="text-decoration-none text-muted"><i class="fas fa-home me-2"></i>Trang chủ</router-link>
                </li>
                <li class="mb-2">
                  <router-link to="/books" class="text-decoration-none text-muted"><i class="fas fa-book me-2"></i>Tất cả sách</router-link>
                </li>
                <li class="mb-2">
                  <router-link to="/categories" class="text-decoration-none text-muted"><i class="fas fa-tags me-2"></i>Nhà xuất bản</router-link>
                </li>
                <li class="mb-2">
                  <router-link to="/about" class="text-decoration-none text-muted"><i class="fas fa-info-circle me-2"></i>Giới thiệu</router-link>
                </li>
              </ul>
            </div>
            <div class="col-6">
              <ul class="list-unstyled link-group">
                <li class="mb-2">
                  <router-link to="/privacy" class="text-decoration-none text-muted"><i class="fas fa-shield-alt me-2"></i>Bảo mật</router-link>
                </li>
                <li class="mb-2">
                  <router-link to="/terms" class="text-decoration-none text-muted"><i class="fas fa-file-contract me-2"></i>Điều khoản</router-link>
                </li>
                <li class="mb-2">
                  <router-link to="/help" class="text-decoration-none text-muted"><i class="fas fa-question-circle me-2"></i>Trợ giúp</router-link>
                </li>
                <li class="mb-2">
                  <router-link to="/contact" class="text-decoration-none text-muted"><i class="fas fa-envelope me-2"></i>Liên hệ</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
            <h5 class="text-uppercase fw-bold mb-4 text-dark">
                <i class="fas fa-share-alt me-2 text-primary"></i>
                Theo dõi chúng tôi
            </h5>
             <div class="social-links mb-4">
              <a href="#" class="social-btn btn btn-outline-primary me-2" title="Facebook">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-btn btn btn-outline-info me-2" title="Twitter">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-btn btn btn-outline-danger me-2" title="YouTube">
                <i class="fab fa-youtube"></i>
              </a>
            </div>

            <h6 class="text-uppercase fw-bold mb-2 text-dark">
                <i class="fas fa-clock me-2 text-primary"></i>
                Giờ làm việc
            </h6>
            <p class="text-muted small">
                Thứ 2 - Thứ 6: 8:00 - 17:00
                <br>
                Thứ 7: 8:00 - 12:00
            </p>
        </div>
      </div>
    </div>


    <div class="text-center py-3 border-top bg-white-custom">
        <p class="mb-0 small text-muted">
            &copy; {{ currentYear }} MagicBook Library System. All Rights Reserved.
        </p>
    </div>

    <button v-show="showBackToTop" @click="scrollToTop" class="btn btn-primary btn-floating back-to-top"
      title="Về đầu trang">
      <i class="fas fa-arrow-up"></i>
    </button>
  </footer>
</template>

<script>
// Logic được giữ nguyên hoàn toàn
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from '@/utils/axios'

export default {
 name: 'PublicFooter',
 setup() {
  const showBackToTop = ref(false)
  // Khởi tạo với 0 để tránh lỗi NaN
  const stats = ref({
   totalBooks: 0,
   totalMembers: 0,
   totalBorrows: 0,
   totalCategories: 0
  })

  const currentYear = computed(() => new Date().getFullYear())

  const loadStats = async () => {
   try {
    // Lời gọi API cho các thống kê cơ bản
    // Giảm limit xuống 1 để tiết kiệm băng thông nếu cần pagination.total
    const [booksRes, membersRes, categoriesRes, borrowsRes] = await Promise.all([
     axios.get('/sach?limit=1').catch(() => ({ data: { data: [], pagination: { total: 0 } } })),
     axios.get('/docgia?limit=1').catch(() => ({ data: { data: [], pagination: { total: 0 } } })),
     axios.get('/nhaxuatban?limit=1').catch(() => ({ data: { data: [], pagination: { total: 0 } } })),
          axios.get('/theodoimuonsach?limit=1').catch(() => ({ data: { data: [], pagination: { total: 0 } } })), // Bổ sung borrowsRes
    ])

    // Hàm lấy tổng số linh hoạt: ưu tiên pagination.total
    const getTotal = (res, key = 'total') => {
            const data = res.data.data;
       if (res.data && res.data.pagination && typeof res.data.pagination[key] === 'number') {
          return res.data.pagination[key];
       }
            // Trường hợp response trả về data lồng (ví dụ: {data: {nhaxuatban: [...]}})
            if (data && data.nhaxuatban && data.pagination) {
                 return data.pagination.total;
            }
       if (Array.isArray(data)) {
          return data.length;
       }
       return 0;
    }

    stats.value = {
     totalBooks: getTotal(booksRes),
     totalMembers: getTotal(membersRes),
     totalBorrows: getTotal(borrowsRes),
     totalCategories: getTotal(categoriesRes)
    }
   } catch (error) {
    // console.error('Error loading footer stats:', error)
    // Sử dụng giá trị ngẫu nhiên nếu API thất bại hoàn toàn
    stats.value = {
     totalBooks: 500,
     totalMembers: 200,
     totalBorrows: 800,
     totalCategories: 50
    }
   }
  }

  const handleScroll = () => {
   showBackToTop.value = window.pageYOffset > 300
  }

  const scrollToTop = () => {
   window.scrollTo({
    top: 0,
    behavior: 'smooth'
   })
  }

  onMounted(() => {
   loadStats()
   window.addEventListener('scroll', handleScroll)
  })

  const handleLogoError = (event) => {
   // Hide logo and show text if it fails to load
   event.target.style.display = 'none'
   const parent = event.target.parentElement;
      if (parent) {
         parent.innerHTML = '<span class="fw-bold fs-5 text-primary">MagicBook</span>'
      }
  }

  onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll)
  })

  return {
   showBackToTop,
   stats,
   currentYear,
   scrollToTop,
   handleLogoError
  }
 }
}
</script>

<style scoped>
/* ==================================== */
/* 1. GENERAL & COLORS */
/* ==================================== */
.main-footer {
  background-color: #f8f9fa; /* Nền sáng */
  color: #343a40; /* Màu chữ tối */
}

.bg-white-custom {
    background-color: #fcfcfc !important; /* Hơi khác nền footer một chút */
}

/* Custom Subtle Backgrounds (Lấy từ PublicHome.vue để đồng bộ) */
.bg-primary-subtle { background-color: #eef2ff !important; color: #4f46e5 !important; }
.bg-success-subtle { background-color: #ecfdf5 !important; color: #1cc88a !important; }
.bg-info-subtle { background-color: #cffafe !important; color: #36a2eb !important; }
.bg-warning-subtle { background-color: #fffbeb !important; color: #ffc107 !important; }

.fw-bolder { font-weight: 800 !important; }

/* ==================================== */
/* 2. STATS SECTION */
/* ==================================== */
.footer-stats-container {
    padding-bottom: 2rem !important;
}

.stat-item {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: default;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-number {
    font-size: 2rem;
    margin-bottom: 0.25rem;
}


/* ==================================== */
/* 3. INFO & LINKS */
/* ==================================== */
.footer-logo {
 width: 50px;
 height: 50px;
 object-fit: cover;
 border-radius: 50%;
 border: 1px solid #e9ecef;
}

/* Link Group Styles */
.link-group a {
    color: #6c757d !important;
    font-weight: 500;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
}

.link-group a:hover {
    color: #0d6efd !important;
    padding-left: 5px;
}

.link-group i {
    width: 20px;
}

/* Contact List */
.contact-list i {
    width: 20px;
    text-align: center;
}

/* Social Media */
.social-links .social-btn {
 width: 36px;
 height: 36px;
 border-radius: 50%;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 transition: all 0.3s ease;
}

.social-links .social-btn:hover {
 transform: translateY(-2px);
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* ==================================== */
/* 4. BACK TO TOP BUTTON */
/* ==================================== */
.back-to-top {
 position: fixed;
 bottom: 30px;
 right: 30px;
 width: 50px;
 height: 50px;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 z-index: 1000;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
 transition: all 0.3s ease;
}

.back-to-top:hover {
 transform: translateY(-3px);
 box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}
</style>
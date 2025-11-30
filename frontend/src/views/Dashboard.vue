<template>
  <div class="page-wrapper">
    <div class="container-fluid page-container">
      <div class="d-flex justify-content-between align-items-center mb-5 mt-3 fade-in">
        <div>
          <h3 class="fw-bold text-dark mb-1">Tổng quan hệ thống</h3>
          <p class="text-secondary mb-0">Chào mừng trở lại, chúc bạn một ngày làm việc hiệu quả!</p>
        </div>
        <button @click="refreshData" class="btn btn-light btn-icon-lg shadow-sm hover-scale" :disabled="loading" title="Làm mới dữ liệu">
          <i class="bi bi-arrow-clockwise text-primary" :class="{ 'spin-icon': loading }"></i>
        </button>
      </div>

      <div class="row g-4 mb-5 fade-in-up">
        <div class="col-xl-3 col-md-6">
          <div class="stat-card bg-primary-subtle h-100">
            <div class="stat-body">
              <div class="stat-icon text-primary">
                <i class="bi bi-book-half"></i>
              </div>
              <div class="stat-content">
                <h6 class="stat-title text-primary">Tổng số sách</h6>
                <h2 class="stat-value">{{ stats.overview?.totalBooks || 0 }}</h2>
                <p class="stat-desc text-muted mb-0">
                  <i class="bi bi-layers-fill me-1"></i> {{ stats.overview?.totalQuantity || 0 }} bản lưu kho
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-xl-3 col-md-6">
          <div class="stat-card bg-success-subtle h-100">
            <div class="stat-body">
              <div class="stat-icon text-success">
                <i class="bi bi-people-fill"></i>
              </div>
              <div class="stat-content">
                <h6 class="stat-title text-success">Độc giả</h6>
                <h2 class="stat-value">{{ stats.overview?.totalReaders || 0 }}</h2>
                <p class="stat-desc text-muted mb-0">
                  <i class="bi bi-person-plus-fill me-1"></i> {{ stats.today?.newReaders || 0 }} mới hôm nay
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-xl-3 col-md-6">
          <div class="stat-card bg-info-subtle h-100">
            <div class="stat-body">
              <div class="stat-icon text-info">
                <i class="bi bi-journal-bookmark-fill"></i>
              </div>
              <div class="stat-content">
                <h6 class="stat-title text-info">Đang mượn</h6>
                <h2 class="stat-value">{{ stats.overview?.activeBorrows || 0 }}</h2>
                <p class="stat-desc text-danger mb-0 fw-medium">
                  <i class="bi bi-exclamation-circle-fill me-1"></i> {{ stats.overview?.overdueBorrows || 0 }} quá hạn
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-xl-3 col-md-6">
          <div class="stat-card bg-warning-subtle h-100">
            <div class="stat-body">
              <div class="stat-icon text-warning">
                <i class="bi bi-building-fill"></i>
              </div>
              <div class="stat-content">
                <h6 class="stat-title text-warning">Nhà xuất bản</h6>
                <h2 class="stat-value">{{ stats.overview?.totalPublishers || 0 }}</h2>
                <p class="stat-desc text-muted mb-0">
                  <i class="bi bi-check-circle-fill me-1"></i> {{ stats.overview?.availableBooks || 0 }} sách sẵn sàng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-5">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 h-100 fade-in-up delay-1">
            <div class="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 class="fw-bold text-dark mb-0">
                <i class="bi bi-bar-chart-line-fill text-primary me-2"></i> Xu hướng mượn trả
              </h5>
              <span class="badge bg-light text-secondary border">7 ngày gần nhất</span>
            </div>
            <div class="card-body px-4 pb-4">
              <div class="chart-container" style="position: relative; height: 300px;">
                <DashboardChart :chartData="chartData" :options="chartOptions" type="bar" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 h-100 bg-gradient-dark text-white fade-in-up delay-2" 
               style="background: linear-gradient(145deg, #2d3436 0%, #000000 100%);">
            <div class="card-body p-4 d-flex flex-column justify-content-center">
              <h5 class="fw-bold mb-4 text-white-50 text-uppercase ls-1">Hôm nay</h5>
              
              <div class="d-flex align-items-center mb-4">
                <div class="icon-square bg-primary bg-opacity-25 text-primary me-3 rounded-3">
                  <i class="bi bi-journal-plus fs-4"></i>
                </div>
                <div>
                  <h2 class="mb-0 fw-bold">{{ stats.today?.borrows || 0 }}</h2>
                  <span class="text-white-50 small">Lượt mượn sách</span>
                </div>
              </div>

              <div class="d-flex align-items-center mb-4">
                <div class="icon-square bg-success bg-opacity-25 text-success me-3 rounded-3">
                  <i class="bi bi-journal-check fs-4"></i>
                </div>
                <div>
                  <h2 class="mb-0 fw-bold">{{ stats.today?.returns || 0 }}</h2>
                  <span class="text-white-50 small">Lượt trả sách</span>
                </div>
              </div>

              <div class="d-flex align-items-center">
                <div class="icon-square bg-info bg-opacity-25 text-info me-3 rounded-3">
                  <i class="bi bi-person-plus fs-4"></i>
                </div>
                <div>
                  <h2 class="mb-0 fw-bold">{{ stats.today?.newReaders || 0 }}</h2>
                  <span class="text-white-50 small">Độc giả đăng ký mới</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm rounded-4 h-100 fade-in-up delay-3">
            <div class="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
              <h5 class="fw-bold text-dark mb-0">Sách mới nhập</h5>
              <router-link to="/admin/sach" class="btn btn-sm btn-light text-primary fw-bold rounded-pill px-3 hover-scale">
                Xem tất cả <i class="bi bi-arrow-right ms-1"></i>
              </router-link>
            </div>
            <div class="card-body p-0">
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div v-else-if="recentBooks.length === 0" class="text-center py-5 text-muted">
                <i class="bi bi-inbox display-4 mb-3 d-block opacity-50"></i> Chưa có dữ liệu
              </div>
              <div v-else class="list-group list-group-flush">
                <div v-for="book in recentBooks" :key="book.MaSach" class="list-group-item border-0 px-4 py-3 d-flex align-items-center hover-bg-light">
                  <div class="book-icon-placeholder bg-light text-secondary rounded-3 me-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 64px;">
                    <i class="bi bi-book fs-4"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-bold text-dark">{{ book.TenSach }}</h6>
                    <p class="mb-0 small text-muted">
                      <i class="bi bi-pen me-1"></i> {{ book.TacGia || book.NguonGoc }}
                    </p>
                  </div>
                  <span class="badge bg-light text-dark border">{{ book.NamXuatBan }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card border-0 shadow-sm rounded-4 h-100 fade-in-up delay-3">
            <div class="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
              <h5 class="fw-bold text-dark mb-0">Hoạt động gần đây</h5>
              <router-link to="/admin/theodoimuonsach" class="btn btn-sm btn-light text-primary fw-bold rounded-pill px-3 hover-scale">
                Chi tiết <i class="bi bi-arrow-right ms-1"></i>
              </router-link>
            </div>
            <div class="card-body p-0">
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div v-else-if="recentTransactions.length === 0" class="text-center py-5 text-muted">
                <i class="bi bi-clock-history display-4 mb-3 d-block opacity-50"></i> Chưa có hoạt động
              </div>
              <div v-else class="list-group list-group-flush">
                <div v-for="transaction in recentTransactions" :key="transaction.MaTheoDoiMuonSach" class="list-group-item border-0 px-4 py-3 hover-bg-light">
                  <div class="d-flex align-items-center justify-content-between mb-1">
                    <div class="d-flex align-items-center">
                      <div class="avatar-sm rounded-circle bg-light text-primary me-2 d-flex align-items-center justify-content-center fw-bold">
                        {{ getReaderInitial(transaction.MaDocGia) }}
                      </div>
                      <span class="fw-bold text-dark">{{ getReaderName(transaction.MaDocGia) }}</span>
                    </div>
                    <small class="text-muted">{{ formatDate(transaction.NgayTra || transaction.NgayMuon) }}</small>
                  </div>
                  <div class="d-flex align-items-center justify-content-between ps-5">
                    <span class="text-secondary small text-truncate" style="max-width: 200px;">
                      <i class="bi bi-book me-1"></i> {{ getBookTitle(transaction.MaSach) }}
                    </span>
                    <span :class="getStatusBadgeClass(transaction.TrangThai)" class="badge-pill">
                      {{ transaction.TrangThai }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="stats.overview?.overdueBorrows > 0" class="fixed-bottom m-4" style="z-index: 1050; left: auto;">
        <div class="alert alert-danger shadow-lg border-0 rounded-4 d-flex align-items-center animate-bounce" role="alert">
          <div class="icon-square bg-white text-danger rounded-circle me-3 shadow-sm">
            <i class="bi bi-bell-fill"></i>
          </div>
          <div>
            <h6 class="alert-heading fw-bold mb-0">Cảnh báo quá hạn!</h6>
            <p class="mb-0 small">Có <strong>{{ stats.overview.overdueBorrows }}</strong> sách đang quá hạn trả.</p>
          </div>
          <router-link to="/admin/theodoimuonsach?status=qua_han" class="btn btn-sm btn-danger ms-4 rounded-pill px-3 shadow-sm">
            Xử lý ngay
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// --- LOGIC GIỮ NGUYÊN 100% ---
import { ref, onMounted } from 'vue'
import api from '../utils/axios.js'
import StatsCard from '../components/StatsCard.vue' // Có thể bỏ nếu không dùng component con nữa
import DashboardChart from '../components/DashboardChart.vue'

const loading = ref(false)
const stats = ref({ overview: {}, today: {} })
const recentBooks = ref([])
const recentTransactions = ref([])
const recentReaders = ref([])
const chartData = ref({ labels: [], datasets: [] })
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false, // Thêm cái này để chart tự do chiều cao
  plugins: { legend: { position: 'bottom' }, title: { display: false } },
  scales: { y: { beginAtZero: true, grid: { borderDash: [2, 4] } }, x: { grid: { display: false } } }
})

const loadDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats')
    if (response.data.success) stats.value = response.data.data
  } catch (error) { stats.value = { overview: {}, today: {} } }
}

const loadRecentActivities = async () => {
  try {
    const response = await api.get('/dashboard/recent-activities?limit=5')
    if (response.data.success) {
      const data = response.data.data
      recentBooks.value = data.recentBooks || []
      recentTransactions.value = data.recentTransactions || []
      recentReaders.value = data.recentReaders || []
    }
  } catch (error) { recentBooks.value = []; recentTransactions.value = []; recentReaders.value = [] }
}

const loadChartData = async () => {
  try {
    const response = await api.get('/dashboard/charts?period=7days')
    if (response.data.success) {
      const data = response.data.data;
      const trends = Array.isArray(data.borrowTrends) ? data.borrowTrends : [];
      chartData.value = {
        labels: trends.map(item => item._id),
        datasets: [
          { label: 'Mượn', backgroundColor: '#4e73df', borderRadius: 4, data: trends.map(item => item.borrows) },
          { label: 'Trả', backgroundColor: '#1cc88a', borderRadius: 4, data: trends.map(item => item.returns) }
        ]
      }
    }
  } catch (error) { chartData.value = { labels: [], datasets: [] } }
}

const loadDashboardData = async () => {
  loading.value = true
  try { await Promise.all([loadDashboardStats(), loadRecentActivities(), loadChartData()]) } finally { loading.value = false }
}

const refreshData = () => { loadDashboardData() }

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

const getReaderName = (docgia) => {
  if (typeof docgia === 'object' && docgia !== null) {
    if (docgia.HoLot || docgia.Ten) return `${docgia.HoLot ? docgia.HoLot : ''} ${docgia.Ten ? docgia.Ten : ''}`.trim();
    if (docgia.MaDocGia) return docgia.MaDocGia;
    return JSON.stringify(docgia);
  }
  return docgia || '-';
}

// Helper mới để lấy chữ cái đầu
const getReaderInitial = (docgia) => {
  const name = getReaderName(docgia);
  return name.charAt(0).toUpperCase();
}

const getBookTitle = (sach) => {
  if (typeof sach === 'object' && sach !== null) return sach.TenSach || '-'
  return sach || '-'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'Đang mượn': 'bg-info-subtle text-info border-info-subtle',
    'Đã trả': 'bg-success-subtle text-success border-success-subtle',
    'Quá hạn': 'bg-danger-subtle text-danger border-danger-subtle',
    'qua_han': 'bg-danger-subtle text-danger border-danger-subtle',
    'muon': 'bg-info-subtle text-info border-info-subtle',
    'da_tra': 'bg-success-subtle text-success border-success-subtle'
  }
  return classes[status] || 'bg-secondary-subtle text-secondary'
}

onMounted(() => { loadDashboardData() })
</script>

<style scoped>
@import '@/assets/styles/main.css';

/* --- PAGE WRAPPER --- */
.page-wrapper {
    background-color: #f3f4f6;
    min-height: 100vh;
    width: 100%;
    margin: -24px; padding: 24px; width: calc(100% + 48px);
}
.page-container { max-width: 1400px; margin: 0 auto; }

/* --- STAT CARDS --- */
.stat-card {
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(0,0,0,0.05);
}
.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
}
.stat-body { padding: 1.5rem; position: relative; z-index: 2; }
.stat-icon {
    position: absolute;
    right: -10px; top: -10px;
    font-size: 6rem;
    opacity: 0.15;
    transform: rotate(15deg);
    z-index: 1;
}
.stat-title { text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 0.5rem; font-weight: 700; }
.stat-value { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.25rem; color: #2d3436; }
.stat-desc { font-size: 0.85rem; }

/* --- COLORS SUBTLE --- */
.bg-primary-subtle { background-color: #e0f2fe; }
.bg-success-subtle { background-color: #dcfce7; }
.bg-info-subtle { background-color: #cffafe; }
.bg-warning-subtle { background-color: #fef3c7; }

/* --- ICONS & BADGES --- */
.icon-square { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; }
.avatar-sm { width: 32px; height: 32px; font-size: 0.8rem; }
.badge-pill { padding: 0.35em 0.8em; border-radius: 50rem; font-size: 0.75em; font-weight: 600; border: 1px solid transparent; }
.btn-icon-lg { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }

/* --- ANIMATIONS --- */
.hover-scale:hover { transform: scale(1.05); }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.fade-in { animation: fadeIn 0.6s ease-out; }
.fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.animate-bounce { animation: bounce 2s infinite; }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-10px);} 60% {transform: translateY(-5px);} }
</style>
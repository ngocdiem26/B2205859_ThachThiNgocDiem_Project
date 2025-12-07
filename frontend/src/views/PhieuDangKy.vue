<template>
    <div class="page-wrapper">
        <div class="container-fluid page-container">
            <div class="row justify-content-center">
                <div class="col-12">
                    
                    <div class="d-flex justify-content-between align-items-center mb-4 mt-2 fade-in">
                        <div>
                            <h4 class="fw-bold text-dark mb-1 d-flex align-items-center">
                                <div class="icon-square bg-gradient-primary text-white shadow-sm me-3">
                                    <i class="bi bi-clipboard-check-fill"></i>
                                </div>
                                Quản lý phiếu đăng ký
                            </h4>
                            <p class="text-secondary small ms-1 mb-0 mt-1">Duyệt các yêu cầu mượn sách từ độc giả</p>
                        </div>
                        <div>
                            <button class="btn btn-light text-primary fw-bold shadow-sm hover-lift" @click="loadPendingAndActiveRequests" :disabled="loading">
                                <i class="bi bi-arrow-clockwise me-2" :class="{ 'spin-icon': loading }"></i>
                                {{ loading ? 'Đang tải...' : 'Làm mới dữ liệu' }}
                            </button>
                        </div>
                    </div>

                    <div class="row g-3 mb-4 fade-in-up">
                        <div class="col-md-3">
                            <div class="card border-0 shadow-sm rounded-4 bg-warning-subtle text-warning h-100 hover-lift">
                                <div class="card-body d-flex align-items-center justify-content-between p-4">
                                    <div>
                                        <h6 class="fw-bold text-uppercase small opacity-75 mb-2">Chờ duyệt</h6>
                                        <h2 class="mb-0 fw-bold text-dark">{{ pendingCount }}</h2>
                                    </div>
                                    <div class="icon-circle bg-white text-warning shadow-sm">
                                        <i class="bi bi-hourglass-split fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card border-0 shadow-sm rounded-4 bg-success-subtle text-success h-100 hover-lift">
                                <div class="card-body d-flex align-items-center justify-content-between p-4">
                                    <div>
                                        <h6 class="fw-bold text-uppercase small opacity-75 mb-2">Hôm nay</h6>
                                        <h2 class="mb-0 fw-bold text-dark">{{ todayRequests }}</h2>
                                    </div>
                                    <div class="icon-circle bg-white text-success shadow-sm">
                                        <i class="bi bi-calendar-check-fill fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card border-0 shadow-sm rounded-4 bg-danger-subtle text-danger h-100 hover-lift">
                                <div class="card-body d-flex align-items-center justify-content-between p-4">
                                    <div>
                                        <h6 class="fw-bold text-uppercase small opacity-75 mb-2">Cần gấp</h6>
                                        <h2 class="mb-0 fw-bold text-dark">{{ urgentRequests }}</h2>
                                    </div>
                                    <div class="icon-circle bg-white text-danger shadow-sm">
                                        <i class="bi bi-exclamation-circle-fill fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card border-0 shadow-sm rounded-4 bg-info-subtle text-info h-100 hover-lift">
                                <div class="card-body d-flex align-items-center justify-content-between p-4">
                                    <div>
                                        <h6 class="fw-bold text-uppercase small opacity-75 mb-2">Tổng cộng</h6>
                                        <h2 class="mb-0 fw-bold text-dark">{{ totalRequests }}</h2>
                                    </div>
                                    <div class="icon-circle bg-white text-info shadow-sm">
                                        <i class="bi bi-list-task fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-lg rounded-4 overflow-hidden fade-in-up">
                        <div class="card-body p-0">
                            
                            <div class="p-4 bg-white border-bottom">
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <div class="position-relative search-group">
                                            <i class="bi bi-search position-absolute text-muted search-icon"></i>
                                            <input type="text" class="form-control form-control-lg border-0 bg-light rounded-pill ps-5"
                                                placeholder="Tìm theo mã, độc giả, sách..."
                                                v-model="searchQuery" @input="handleSearch">
                                        </div>
                                    </div>

                                    <div class="col-md-3">
                                        <div class="dropdown custom-select-dropdown">
                                            <button class="btn btn-light w-100 d-flex align-items-center justify-content-between rounded-pill border-0 bg-light py-2 px-3" 
                                                type="button" data-bs-toggle="dropdown" aria-expanded="false" style="height: 48px;">
                                                
                                                <div class="d-flex align-items-center">
                                                    <i class="bi me-2 text-primary" :class="getCurrentSortIcon"></i>
                                                    <span class="text-dark fw-medium">{{ getCurrentSortLabel }}</span>
                                                </div>
                                                <i class="bi bi-chevron-down text-muted small"></i>
                                            </button>

                                            <ul class="dropdown-menu border-0 shadow-lg rounded-4 w-100 p-2 mt-2">
                                                <li>
                                                    <a class="dropdown-item rounded-3 py-2 d-flex align-items-center" 
                                                       :class="{ 'active': sortOrder === 'newest' }" 
                                                       href="#" @click.prevent="setSortOrder('newest')">
                                                        <i class="bi bi-clock-history me-2 text-success"></i>
                                                        <span>Mới nhất</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item rounded-3 py-2 d-flex align-items-center" 
                                                       :class="{ 'active': sortOrder === 'oldest' }" 
                                                       href="#" @click.prevent="setSortOrder('oldest')">
                                                        <i class="bi bi-hourglass-bottom me-2 text-secondary"></i>
                                                        <span>Cũ nhất</span>
                                                    </a>
                                                </li>
                                                <li><hr class="dropdown-divider my-1"></li>
                                                <li>
                                                    <a class="dropdown-item rounded-3 py-2 d-flex align-items-center" 
                                                       :class="{ 'active': sortOrder === 'dueDate' }"
                                                       href="#" @click.prevent="setSortOrder('dueDate')">
                                                        <i class="bi bi-calendar-event me-2 text-warning"></i>
                                                        <span>Theo ngày hẹn trả</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="col-md-3">
                                        <input type="date" class="form-control form-control-lg border-0 bg-light rounded-pill ps-3" 
                                            v-model="dateFilter" @change="handleDateFilter" style="height: 48px;">
                                    </div>
                                    <div class="col-md-2">
                                        <button class="btn btn-light border-0 btn-lg rounded-pill w-100 text-muted hover-scale" 
                                            @click="clearFilters" style="height: 48px;">
                                            <i class="bi bi-x-circle-fill me-1"></i> Xóa lọc
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="py-3 ps-4 text-uppercase text-secondary x-small fw-bolder">Mã phiếu</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Độc giả</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Sách đăng ký</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Thời gian</th>
                                            <th class="py-3 text-end pe-4 text-uppercase text-secondary x-small fw-bolder">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white">
                                        <tr v-for="request in paginatedRecords" :key="request.MaTheoDoiMuonSach" class="fade-in-row">
                                            <td class="ps-4">
                                                <span class="badge bg-light text-primary border font-monospace">#{{ request.MaTheoDoiMuonSach }}</span>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-circle me-3" :class="getRandomColorClass(getReaderName(request))">
                                                        {{ getReaderName(request).charAt(0).toUpperCase() }}
                                                    </div>
                                                    <div>
                                                        <h6 class="mb-0 fw-bold text-dark">{{ getReaderName(request) }}</h6>
                                                        <small class="text-muted">Mã: {{ request.MaDocGia }}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <i class="bi bi-book text-muted me-2"></i>
                                                    <span class="fw-medium text-dark">{{ getBookTitle(request) }}</span>
                                                </div>
                                                <small class="text-muted ms-4 ps-1">Mã sách: {{ request.MaSach }}</small>
                                            </td>
                                            <td>
                                                <div class="d-flex flex-column gap-1 small">
                                                    <div class="text-secondary">
                                                        <i class="bi bi-calendar-plus me-1"></i>ĐK: {{ formatDate(request.NgayMuon) }}
                                                    </div>
                                                    <div :class="getDueDateClass(request)">
                                                        <i class="bi bi-calendar-event me-1"></i>Hẹn: {{ formatDate(request.NgayHenTra) }}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="text-end pe-4">
                                                <div class="d-inline-flex gap-2">
                                                    <button class="btn btn-success btn-sm rounded-pill px-3 shadow-sm hover-scale" 
                                                        @click="approveRequest(request)" 
                                                        :disabled="processing || hasOverdueBooks(request.MaDocGia) || getBorrowedCount(request.MaDocGia) >= MAX_BORROW_LIMIT"
                                                        :title="getApprovalTitle(request)">
                                                        <i class="bi bi-check-lg me-1"></i>Duyệt
                                                    </button>

                                                    <button class="btn btn-danger btn-sm rounded-pill px-3 shadow-sm hover-scale" 
                                                        @click="rejectRequest(request)" :disabled="processing">
                                                        <i class="bi bi-x-lg me-1"></i>Từ chối
                                                    </button>
                                                    <button class="btn btn-icon btn-light text-info shadow-sm hover-scale ms-1" 
                                                        @click="viewDetails(request)" title="Chi tiết">
                                                        <i class="bi bi-eye-fill"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        <tr v-if="filteredRequests.length === 0 && !loading">
                                            <td colspan="5" class="text-center py-5">
                                                <div class="py-4">
                                                    <div class="empty-icon bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
                                                        <i class="bi bi-inbox text-muted display-6"></i>
                                                    </div>
                                                    <h5 class="text-muted fw-normal">Không có yêu cầu nào</h5>
                                                    <p class="text-secondary small mb-0">Danh sách đăng ký hiện đang trống.</p>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-if="loading">
                                            <td colspan="5" class="text-center py-5">
                                                <div class="spinner-border text-primary" role="status"></div>
                                                <p class="mt-2 text-muted small">Đang tải dữ liệu...</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="p-3 border-top bg-light d-flex justify-content-between align-items-center" v-if="filteredRequests.length > 0">
                                <span class="text-muted small ms-2">
                                    Hiển thị <strong>{{ startIndex + 1 }}-{{ Math.min(endIndex, filteredRequests.length) }}</strong> / <strong>{{ filteredRequests.length }}</strong> phiếu
                                </span>
                                <nav>
                                    <ul class="pagination pagination-sm mb-0 shadow-sm rounded-pill overflow-hidden">
                                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                            <button class="page-link border-0" @click="currentPage = 1" :disabled="currentPage === 1">
                                                <i class="bi bi-chevron-double-left"></i>
                                            </button>
                                        </li>
                                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                            <button class="page-link border-0" @click="currentPage--" :disabled="currentPage === 1">
                                                <i class="bi bi-chevron-left"></i>
                                            </button>
                                        </li>
                                        <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage }">
                                            <button class="page-link border-0" @click="currentPage = page">{{ page }}</button>
                                        </li>
                                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                            <button class="page-link border-0" @click="currentPage++" :disabled="currentPage === totalPages">
                                                <i class="bi bi-chevron-right"></i>
                                            </button>
                                        </li>
                                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                            <button class="page-link border-0" @click="currentPage = totalPages" :disabled="currentPage === totalPages">
                                                <i class="bi bi-chevron-double-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" :class="{ show: showDetailsModal }" 
                    :style="{ display: showDetailsModal ? 'block' : 'none' }" 
                    tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content border-0 shadow-lg rounded-4">
                            <div class="modal-header border-bottom-0 pb-0 ps-4 pe-4 pt-4">
                                <h5 class="modal-title fw-bold text-primary">
                                    <i class="bi bi-info-circle-fill me-2"></i>Chi tiết phiếu đăng ký
                                </h5>
                                <button type="button" class="btn-close" @click="closeDetailsModal"></button>
                            </div>
                            <div class="modal-body p-4" v-if="viewingRequest">
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <div class="p-3 bg-light rounded-3 h-100">
                                            <h6 class="text-primary fw-bold mb-3 border-bottom pb-2">Thông tin độc giả</h6>
                                            
                                            <p class="mb-2 d-flex justify-content-between">
                                                <small class="text-muted">Họ tên:</small> 
                                                <strong class="text-dark">{{ getReaderName(viewingRequest) }}</strong>
                                            </p>
                                            
                                            <p class="mb-2 d-flex justify-content-between">
                                                <small class="text-muted">Mã ĐG:</small> 
                                                <span>{{ viewingRequest.MaDocGia }}</span>
                                            </p>
                                            
                                            <p class="mb-2 d-flex justify-content-between align-items-center">
                                                <small class="text-muted">Mã phiếu:</small> 
                                                <span class="badge bg-white text-dark border">{{ viewingRequest.MaTheoDoiMuonSach }}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="p-3 bg-light rounded-3 h-100">
                                            <h6 class="text-success fw-bold mb-3 border-bottom pb-2">Thông tin sách</h6>
                                            
                                            <p class="mb-2 d-flex justify-content-between">
                                                <small class="text-muted">Tên sách:</small> 
                                                <strong class="text-dark text-end" style="max-width: 200px;">{{ getBookTitle(viewingRequest) }}</strong>
                                            </p>
                                            
                                            <p class="mb-2 d-flex justify-content-between">
                                                <small class="text-muted">Mã sách:</small> 
                                                <span>{{ viewingRequest.MaSach }}</span>
                                            </p>
                                            
                                            <p class="mb-2 d-flex justify-content-between align-items-center">
                                                <small class="text-muted">Trạng thái:</small> 
                                                <span class="badge bg-warning text-dark">Chờ duyệt</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <div class="p-3 bg-light rounded-3">
                                            <h6 class="text-secondary fw-bold mb-3 border-bottom pb-2">Thời gian & Ghi chú</h6>
                                            
                                            <div class="d-flex gap-5 mb-3">
                                                <div>
                                                    <small class="text-muted d-block">Ngày đăng ký</small> 
                                                    <strong class="text-primary">{{ formatDate(viewingRequest.NgayMuon) }}</strong>
                                                </div>
                                                <div>
                                                    <small class="text-muted d-block">Ngày hẹn trả</small> 
                                                    <strong class="text-danger">{{ formatDate(viewingRequest.NgayHenTra) }}</strong>
                                                </div>
                                            </div>

                                            <div v-if="viewingRequest.GhiChu">
                                                <small class="text-muted d-block mb-1">Ghi chú:</small>
                                                <div class="bg-white p-3 rounded border text-secondary fst-italic">
                                                    "{{ viewingRequest.GhiChu }}"
                                                </div>
                                            </div>
                                            <div v-else class="text-muted small fst-italic">Không có ghi chú nào.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
                                <button type="button" class="btn btn-secondary rounded-pill px-4" @click="closeDetailsModal">Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
        
        <div class="modal-backdrop fade show glass-backdrop" v-if="showDetailsModal"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../utils/axios.js'

// Reactive data
const requestsList = ref([]) // Phiếu chờ duyệt
const allActiveBorrows = ref([]) // Phiếu đang mượn/quá hạn
const docGiaList = ref([])
const sachList = ref([])
const loading = ref(false)
const processing = ref(false)
const searchQuery = ref('')
const sortOrder = ref('newest')
const dateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Constants
const MAX_BORROW_LIMIT = 4;

// Modal states
const showDetailsModal = ref(false)
const viewingRequest = ref(null)

// --- Logic kiểm tra MƯỢN/QUÁ HẠN ---

const hasOverdueBooks = (readerId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ về 0h để so sánh ngày chính xác

    return allActiveBorrows.value.some(record => 
        record.MaDocGia === readerId && 
        new Date(record.NgayHenTra) < today
    );
}

const getBorrowedCount = (readerId) => {
    // Đếm tất cả các phiếu mượn đang hoạt động (Đang mượn, Quá hạn)
    return allActiveBorrows.value.filter(record => 
        record.MaDocGia === readerId
    ).length;
}

const getApprovalTitle = (request) => {
    const readerId = request.MaDocGia;
    const currentBorrowedCount = getBorrowedCount(readerId);
    
    if (hasOverdueBooks(readerId)) {
        return 'Độc giả có sách quá hạn, không thể duyệt!';
    }
    
    if (currentBorrowedCount >= MAX_BORROW_LIMIT) {
        return `Độc giả đã đạt giới hạn mượn ${MAX_BORROW_LIMIT} cuốn (Đang mượn: ${currentBorrowedCount} cuốn).`;
    }

    return 'Duyệt phiếu đăng ký này';
}

// --- Computed for Custom Dropdown ---
const getCurrentSortLabel = computed(() => {
    switch (sortOrder.value) {
        case 'newest': return 'Mới nhất'
        case 'oldest': return 'Cũ nhất'
        case 'dueDate': return 'Theo ngày hẹn trả'
        default: return 'Sắp xếp'
    }
})

const getCurrentSortIcon = computed(() => {
    switch (sortOrder.value) {
        case 'newest': return 'bi-clock-history text-success'
        case 'oldest': return 'bi-hourglass-bottom text-secondary'
        case 'dueDate': return 'bi-calendar-event text-warning'
        default: return 'bi-funnel'
    }
})

const setSortOrder = (order) => {
    sortOrder.value = order
    currentPage.value = 1
}
// ---------------------------------------

// Stats - All requests are pending (isActivate = 0)
const pendingCount = computed(() => requestsList.value.length)
const todayRequests = computed(() => {
    const today = new Date().toDateString()
    return requestsList.value.filter(r => new Date(r.NgayMuon).toDateString() === today).length
})
const urgentRequests = computed(() => {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
    return requestsList.value.filter(r => new Date(r.NgayHenTra) <= tomorrow).length
})
const totalRequests = computed(() => requestsList.value.length)

const filteredRequests = computed(() => {
    if (!Array.isArray(requestsList.value)) return []
    let filtered = requestsList.value
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase().trim()
        filtered = filtered.filter(request =>
            request.MaTheoDoiMuonSach.toLowerCase().includes(query) ||
            request.MaDocGia.toLowerCase().includes(query) ||
            request.MaSach.toLowerCase().includes(query) ||
            getReaderName(request).toLowerCase().includes(query) ||
            getBookTitle(request).toLowerCase().includes(query)
        )
    }
    if (dateFilter.value) {
        const filterDate = new Date(dateFilter.value).toDateString()
        filtered = filtered.filter(request => new Date(request.NgayMuon).toDateString() === filterDate)
    }
    return filtered.sort((a, b) => {
        switch (sortOrder.value) {
            case 'oldest': return new Date(a.NgayMuon) - new Date(b.NgayMuon)
            case 'dueDate': return new Date(a.NgayHenTra) - new Date(b.NgayHenTra)
            case 'newest': default: return new Date(b.NgayMuon) - new Date(a.NgayMuon)
        }
    })
})

const totalPages = computed(() => Math.ceil(filteredRequests.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)
const paginatedRecords = computed(() => filteredRequests.value.slice(startIndex.value, endIndex.value))
const visiblePages = computed(() => {
    const pages = []; const start = Math.max(1, currentPage.value - 2); const end = Math.min(totalPages.value, currentPage.value + 2)
    for (let i = start; i <= end; i++) { pages.push(i) }
    return pages
})

// Methods
const loadPendingRequests = async () => {
    try {
        const response = await api.get('/theodoimuonsach?onlyPending=true')
        if (response.data.success) requestsList.value = response.data.data || []
    } catch (error) { console.error("Lỗi tải phiếu chờ duyệt:", error); requestsList.value = [] } 
}

const loadActiveBorrows = async () => {
    try {
        // Tải các phiếu chưa trả (TrangThai = 'Đang mượn' hoặc 'Quá hạn')
        const response = await api.get('/theodoimuonsach/active'); 
        if (response.data.success) {
            allActiveBorrows.value = response.data.data || [];
        } else {
            allActiveBorrows.value = [];
        }
    } catch (error) {
        console.error("Lỗi khi tải phiếu mượn đang hoạt động:", error);
        allActiveBorrows.value = [];
    }
}

const loadPendingAndActiveRequests = async () => {
    loading.value = true
    await Promise.all([loadPendingRequests(), loadActiveBorrows()])
    loading.value = false
}

const loadReferenceData = async () => {
    try {
        const [docGiaResponse, sachResponse] = await Promise.all([
            api.get('/docgia?limit=1000'), 
            api.get('/sach?limit=1000')
        ])
        if (docGiaResponse.data.success) docGiaList.value = docGiaResponse.data.data?.docgia || docGiaResponse.data.data || []
        if (sachResponse.data.success) sachList.value = sachResponse.data.data?.sach || sachResponse.data.data || []
    } catch (error) { console.error(error) }
}

const getReaderName = (request) => {
    if (!request || !request.MaDocGia) return 'N/A';
    // Nếu API trả về object đầy đủ
    if (typeof request.MaDocGia === 'object') {
        return `${request.MaDocGia.HoLot} ${request.MaDocGia.Ten}`.trim();
    }
    // Nếu chỉ trả về mã string, tìm trong danh sách đã load
    const docGia = docGiaList.value.find(dg => dg.MaDocGia === request.MaDocGia);
    return docGia ? `${docGia.HoLot} ${docGia.Ten}` : request.MaDocGia;
}

const getBookTitle = (request) => {
    if (!request || !request.MaSach) return 'N/A';
    if (typeof request.MaSach === 'object') {
        return request.MaSach.TenSach;
    }
    const sach = sachList.value.find(s => s.MaSach === request.MaSach);
    return sach ? sach.TenSach : request.MaSach;
}
const formatDate = (dateString) => { if (!dateString) return 'N/A'; return new Date(dateString).toLocaleDateString('vi-VN') }
const getDueDateClass = (record) => {
    const today = new Date(); const dueDate = new Date(record.NgayHenTra)
    if (dueDate < today) return 'text-danger fw-bold'
    else if (dueDate.getTime() - today.getTime() <= 24 * 60 * 60 * 1000) return 'text-warning fw-bold'
    return ''
}
// Helper màu avatar
const getRandomColorClass = (name) => {
    const colors = ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-indigo', 'bg-purple'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) { hash = name.charCodeAt(i) + ((hash << 5) - hash); }
    const index = Math.abs(hash) % colors.length;
    const color = colors[index];
    if(color === 'bg-indigo') return 'bg-indigo-subtle text-indigo';
    if(color === 'bg-purple') return 'bg-purple-subtle text-purple';
    return `${color} bg-opacity-10 text-${color.replace('bg-', '')}`;
}

const approveRequest = async (request) => {
    const readerId = request.MaDocGia;
    const currentBorrowedCount = getBorrowedCount(readerId);
    
    if (hasOverdueBooks(readerId)) {
        alert('Duyệt thất bại: Độc giả còn sách quá hạn, không thể duyệt mượn thêm!');
        return;
    }
    
    if (currentBorrowedCount >= MAX_BORROW_LIMIT) {
        alert(`Duyệt thất bại: Độc giả đã đạt giới hạn mượn ${MAX_BORROW_LIMIT} cuốn sách (đang mượn: ${currentBorrowedCount}).`);
        return;
    }

    if (!confirm(`Duyệt phiếu ${request.MaTheoDoiMuonSach} của độc giả ${getReaderName(request)}?`)) return
    
    processing.value = true
    try {
        const response = await api.post(`/theodoimuonsach/${request.MaTheoDoiMuonSach}/approve`)
        if (response.data.success) { 
            alert('Duyệt thành công! Sách đã được chuyển sang trạng thái "Đang mượn".'); 
            // Tải lại cả phiếu chờ duyệt và phiếu đang hoạt động
            await loadPendingAndActiveRequests(); 
        } else { 
            alert(`Lỗi duyệt: ${response.data.message}`); 
        }
    } catch (error) { 
        console.error("Lỗi khi duyệt:", error);
        alert('Lỗi xảy ra trong quá trình duyệt phiếu.'); 
    } finally { 
        processing.value = false 
    }
}

const rejectRequest = async (request) => {
    if (!confirm(`Từ chối phiếu ${request.MaTheoDoiMuonSach}?`)) return
    processing.value = true
    try {
        const response = await api.delete(`/theodoimuonsach/${request.MaTheoDoiMuonSach}/reject`)
        if (response.data.success) { 
            alert('Từ chối thành công!'); 
            await loadPendingAndActiveRequests(); 
        } else { 
            alert(response.data.message); 
        }
    } catch (error) { 
        console.error("Lỗi khi từ chối:", error);
        alert('Lỗi xảy ra'); 
    } finally { 
        processing.value = false 
    }
}

const viewDetails = (request) => { viewingRequest.value = request; showDetailsModal.value = true }
const closeDetailsModal = () => { showDetailsModal.value = false; viewingRequest.value = null }
const handleSearch = () => { currentPage.value = 1 }
const handleSortChange = () => { currentPage.value = 1 }
const handleDateFilter = () => { currentPage.value = 1 }
const clearFilters = () => { searchQuery.value = ''; sortOrder.value = 'newest'; dateFilter.value = ''; currentPage.value = 1 }

watch([searchQuery, sortOrder, dateFilter], () => { currentPage.value = 1 })
onMounted(async () => {
    // Tải cả danh sách tham chiếu, phiếu chờ duyệt và phiếu đang hoạt động
    await Promise.all([loadReferenceData(), loadPendingRequests(), loadActiveBorrows()])
})
</script>

<style scoped>
@import '@/assets/styles/main.css';

/* --- PAGE WRAPPER --- */
.page-wrapper {
    background-color: #f3f4f6;
    min-height: 100vh;
    width: 100%;
    margin: -24px; padding: 24px; width: calc(100% + 48px);
    display: flex; flex-direction: column;
}
.page-container { max-width: 1400px; margin: 0 auto; width: 100%; }

/* --- CUSTOM DROPDOWN --- */
.custom-select-dropdown .dropdown-toggle {
    background-color: #f8f9fa;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}
.custom-select-dropdown .dropdown-toggle:hover {
    background-color: #fff;
    border-color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
}
.custom-select-dropdown .dropdown-item {
    font-weight: 500;
    transition: all 0.15s;
    margin-bottom: 2px;
}
.custom-select-dropdown .dropdown-item:hover {
    background-color: #f8f9fa;
    transform: translateX(4px);
}
.custom-select-dropdown .dropdown-item.active {
    background-color: #eef2ff;
    color: #4f46e5;
    font-weight: 600;
}
.dropdown-toggle::after { display: none; }

/* --- ICONS & GRADIENTS --- */
.bg-gradient-primary { background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); }
.icon-square { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 1.5rem; }
.icon-circle { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.avatar-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem; }

/* --- COLORS --- */
.bg-warning-subtle { background-color: #fffbeb !important; }
.bg-success-subtle { background-color: #ecfdf5 !important; }
.bg-danger-subtle { background-color: #fef2f2 !important; }
.bg-info-subtle { background-color: #eff6ff !important; }
.bg-indigo-subtle { background-color: #e0e7ff; }
.text-indigo { color: #4338ca; }
.bg-purple-subtle { background-color: #f3e8ff; }
.text-purple { color: #7e22ce; }

/* --- SEARCH --- */
.search-icon { left: 20px; top: 50%; transform: translateY(-50%); z-index: 5; }
.form-control:focus, .form-select:focus { box-shadow: none; background-color: #fff; border: 1px solid #4f46e5; }

/* --- BUTTONS --- */
.btn-icon { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.2s; border: 1px solid transparent; }
.btn-icon:hover { transform: translateY(-2px); background-color: white; border-color: #e5e7eb; }
.shadow-primary-btn { box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
.hover-scale:hover { transform: scale(1.1); }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* --- PAGINATION --- */
.pagination .page-link { border: none; border-radius: 8px; margin: 0 3px; color: #4b5563; font-weight: 500; transition: all 0.2s; }
.pagination .page-item.active .page-link { background-color: #4f46e5; color: #fff; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3); }
.pagination .page-link:hover:not(.active) { background-color: #e5e7eb; }

/* --- MODAL & ANIMATIONS --- */
.glass-backdrop { backdrop-filter: blur(5px); background-color: rgba(0, 0, 0, 0.2); }
.fade-in { animation: fadeIn 0.5s ease-out; }
.fade-in-up { animation: fadeInUp 0.5s ease-out; }
.fade-in-row { animation: fadeInRow 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInRow { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
<template>
    <div class="page-wrapper">
        <div class="container-fluid page-container">
            <div class="row justify-content-center">
                <div class="col-12">
                    
                    <div class="card border-0 shadow-lg rounded-4 overflow-hidden fade-in-up">
                        <div class="card-body p-0">
                            
                            <div class="p-4 bg-white border-bottom">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h4 class="fw-bold text-dark mb-1 d-flex align-items-center">
                                            <div class="icon-square bg-gradient-primary text-white shadow-sm me-3">
                                                <i class="bi bi-journal-bookmark-fill"></i>
                                            </div>
                                            Quản lý mượn trả sách
                                        </h4>
                                        <p class="text-secondary small ms-1 mb-0 mt-1">Theo dõi quá trình mượn và trả sách của độc giả</p>
                                    </div>
                                    <div class="d-none d-md-block text-end">
                                        <div class="badge bg-light text-secondary border p-2 rounded-pill px-3 fw-normal">
                                            <i class="bi bi-person-circle me-1"></i>
                                            NV: <strong>{{ currentUser?.HoTenNV || currentUser?.hoTenNV || 'Không xác định' }}</strong>
                                            <span class="text-muted ms-1">({{ currentStaffId }})</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="row g-3 align-items-center">
                                    <div class="col-md-5">
                                        <div class="position-relative search-group">
                                            <i class="bi bi-search position-absolute text-muted search-icon"></i>
                                            <input type="text" class="form-control form-control-lg border-0 bg-light rounded-pill ps-5"
                                                placeholder="Tìm theo mã, độc giả, sách..."
                                                v-model="searchQuery" @input="handleSearch">
                                            <button v-if="searchQuery" @click="clearSearch" class="btn position-absolute end-0 top-50 translate-middle-y me-2 text-muted rounded-circle btn-sm p-1">
                                                <i class="bi bi-x-circle-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="dropdown custom-select-dropdown">
                                            <button class="btn btn-light w-100 d-flex align-items-center justify-content-between rounded-pill border-0 shadow-sm py-2 px-3" 
                                                type="button" data-bs-toggle="dropdown" aria-expanded="false" style="height: 48px;">
                                                <div class="d-flex align-items-center">
                                                    <i class="bi me-2" :class="getCurrentStatusIcon"></i>
                                                    <span :class="getCurrentStatusColor">{{ statusFilter || 'Tất cả trạng thái' }}</span>
                                                </div>
                                                <i class="bi bi-chevron-down text-muted small"></i>
                                            </button>
                                            <ul class="dropdown-menu border-0 shadow-lg rounded-4 w-100 p-2 mt-2">
                                                <li><a class="dropdown-item rounded-3 py-2" href="#" @click.prevent="setStatusFilter('')">Tất cả</a></li>
                                                <li><hr class="dropdown-divider my-1"></li>
                                                <li><a class="dropdown-item rounded-3 py-2 text-primary" href="#" @click.prevent="setStatusFilter('Đang mượn')"><i class="bi bi-journal-bookmark-fill me-2"></i>Đang mượn</a></li>
                                                <li><a class="dropdown-item rounded-3 py-2 text-success" href="#" @click.prevent="setStatusFilter('Đã trả')"><i class="bi bi-check-circle-fill me-2"></i>Đã trả</a></li>
                                                <li><a class="dropdown-item rounded-3 py-2 text-danger" href="#" @click.prevent="setStatusFilter('Quá hạn')"><i class="bi bi-exclamation-triangle-fill me-2"></i>Quá hạn</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-md-4 text-end">
                                        <button class="btn btn-primary bg-gradient border-0 btn-lg rounded-pill px-4 shadow-primary-btn w-100 w-md-auto hover-lift" 
                                                @click="showBorrowModal">
                                            <i class="bi bi-journal-plus me-2"></i>Mượn sách
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
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Sách mượn</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Thời gian</th>
                                            <th class="py-3 text-center text-uppercase text-secondary x-small fw-bolder">Trạng thái</th>
                                            <th class="py-3 text-end pe-4 text-uppercase text-secondary x-small fw-bolder">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white">
                                        <tr v-for="record in paginatedRecords" :key="record.MaTheoDoiMuonSach" class="fade-in-row">
                                            <td class="ps-4">
                                                <span class="badge bg-light text-primary border font-monospace">#{{ record.MaTheoDoiMuonSach }}</span>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-circle me-3 bg-info-subtle text-info">
                                                        <i class="bi bi-person-fill"></i>
                                                    </div>
                                                    <div>
                                                        <h6 class="mb-0 fw-bold text-dark">{{ getReaderName(record) }}</h6>
                                                        <small class="text-muted">Mã ĐG: {{ record.MaDocGia.MaDocGia || record.MaDocGia }}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <i class="bi bi-book text-muted me-2"></i>
                                                    <span class="fw-medium text-dark">{{ getBookTitle(record) }}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex flex-column gap-1 small">
                                                    <div class="text-secondary">
                                                        <i class="bi bi-calendar-check me-1"></i>Mượn: {{ formatDate(record.NgayMuon) }}
                                                    </div>
                                                    <div :class="getDueDateClass(record)">
                                                        <i class="bi bi-calendar-event me-1"></i>Hẹn: {{ formatDate(record.NgayHenTra) }}
                                                    </div>
                                                    <div v-if="record.NgayTra" class="text-success">
                                                        <i class="bi bi-calendar2-check-fill me-1"></i>Đã trả: {{ formatDate(record.NgayTra) }}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="text-center">
                                                <span class="status-pill" :class="getStatusPillClass(record.TrangThai)">
                                                    {{ record.TrangThai }}
                                                </span>
                                                <div v-if="getQuickOverdueInfo(record.NgayHenTra, record.TrangThai)" class="mt-2 animate-bounce">
                                                    <small class="d-block text-danger fw-bold" style="font-size: 0.7rem;">
                                                        <i class="bi bi-cash-coin"></i> 
                                                        {{ getQuickOverdueInfo(record.NgayHenTra, record.TrangThai).money }} ₫
                                                    </small>
                                                </div>
                                            </td>
                                            <td class="text-end pe-4">
                                                <div class="d-inline-flex gap-2">
                                                    <button v-if="record.TrangThai === 'Đang mượn' || record.TrangThai === 'Quá hạn'" class="btn btn-icon btn-light text-success shadow-sm hover-scale" 
                                                        @click="showReturnModal(record)" title="Trả sách">
                                                        <i class="bi bi-check-lg"></i>
                                                    </button>
                                                    
                                                    <button v-if="record.TrangThai === 'Đang mượn'" class="btn btn-icon btn-light text-warning shadow-sm hover-scale" 
                                                        @click="showExtendModal(record)" title="Gia hạn">
                                                        <i class="bi bi-calendar-plus"></i>
                                                    </button>
                                                    
                                                    <button class="btn btn-icon btn-light text-info shadow-sm hover-scale" 
                                                        @click="viewDetails(record)" title="Xem chi tiết">
                                                        <i class="bi bi-eye-fill"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="p-3 border-top bg-light d-flex justify-content-between align-items-center" v-if="totalItems > 0">
                                <span class="text-muted small ms-2">
                                    Hiển thị <strong>{{ startIndex + 1 }}-{{ Math.min(endIndex, filteredRecords.length) }}</strong> / <strong>{{ filteredRequests.length }}</strong> phiếu
                                </span>
                                <nav>
                                    <ul class="pagination pagination-sm mb-0 shadow-sm rounded-pill overflow-hidden">
                                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                            <button class="page-link border-0" @click="goToPage(currentPage - 1)"><i class="bi bi-chevron-left"></i></button>
                                        </li>
                                        <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage }">
                                            <button class="page-link border-0" @click="goToPage(page)">{{ page }}</button>
                                        </li>
                                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                            <button class="page-link border-0" @click="goToPage(currentPage + 1)"><i class="bi bi-chevron-right"></i></button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" :class="{ show: showBorrowModalState }" :style="{ display: showBorrowModalState ? 'block' : 'none' }" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-bottom-0 pb-0 ps-4 pe-4 pt-4">
                        <h5 class="modal-title fw-bold text-primary"><i class="bi bi-journal-plus me-2"></i>Mượn sách</h5>
                        <button type="button" class="btn-close" @click="closeBorrowModal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form @submit.prevent="borrowBook">
                             <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Độc giả <span class="text-danger">*</span></label>
                                    <select class="form-select rounded-3 bg-light border-0" v-model="borrowForm.MaDocGia" :class="{ 'is-invalid': borrowErrors.MaDocGia }">
                                        <option value="">Chọn độc giả...</option>
                                        <option v-for="dg in docGiaList" :key="dg.MaDocGia" :value="dg.MaDocGia">{{ dg.HoLot }} {{ dg.Ten }} ({{ dg.MaDocGia }})</option>
                                    </select>
                                    <div class="invalid-feedback">{{ borrowErrors.MaDocGia }}</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Sách <span class="text-danger">*</span></label>
                                    <select class="form-select rounded-3 bg-light border-0" v-model="borrowForm.MaSach" :class="{ 'is-invalid': borrowErrors.MaSach }">
                                        <option value="">Chọn sách...</option>
                                        <option v-for="s in availableBooks" :key="s.MaSach" :value="s.MaSach">{{ s.TenSach }} (Còn: {{ s.SoQuyenConLai || s.SoQuyen }})</option>
                                    </select>
                                    <div class="invalid-feedback">{{ borrowErrors.MaSach }}</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Ngày hẹn trả <span class="text-danger">*</span></label>
                                    <input type="date" class="form-control rounded-3 bg-light border-0" v-model="borrowForm.NgayHenTra" :min="tomorrow" :class="{ 'is-invalid': borrowErrors.NgayHenTra }">
                                    <div class="invalid-feedback">{{ borrowErrors.NgayHenTra }}</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted">Nhân viên xử lý</label>
                                    <input type="text" class="form-control rounded-3 bg-light border-0" v-model="borrowForm.NhanVienMuon" readonly>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold text-muted">Ghi chú</label>
                                    <textarea class="form-control rounded-3 bg-light border-0" rows="2" v-model="borrowForm.GhiChu"></textarea>
                                </div>
                             </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
                        <button class="btn btn-light rounded-pill px-4" @click="closeBorrowModal">Hủy</button>
                        <button class="btn btn-primary rounded-pill px-4 shadow-sm" @click="borrowBook" :disabled="borrowing">
                            <span v-if="borrowing" class="spinner-border spinner-border-sm me-2"></span> Xác nhận mượn
                        </button>
                    </div>
                </div>
             </div>
        </div>

        <div class="modal fade" :class="{ show: showReturnModalState }" :style="{ display: showReturnModalState ? 'block' : 'none' }" tabindex="-1">
             <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-bottom-0">
                        <h5 class="modal-title fw-bold text-success"><i class="bi bi-check-circle-fill me-2"></i>Trả sách</h5>
                        <button type="button" class="btn-close" @click="closeReturnModal"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="returningRecord" class="bg-light p-3 rounded-3 mb-3">
                            <p class="mb-1"><strong>Độc giả:</strong> {{ getReaderName(returningRecord) }}</p>
                            <p class="mb-1"><strong>Sách:</strong> {{ getBookTitle(returningRecord) }}</p>
                            <p class="mb-0 text-muted small">Hẹn trả: {{ formatDate(returningRecord.NgayHenTra) }}</p>
                        </div>

                        <div v-if="overdueDetails.isOverdue" class="alert alert-danger border-danger bg-danger-subtle mb-3 rounded-3 fade-in">
                            <div class="d-flex align-items-center mb-2">
                                <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                                <h6 class="mb-0 fw-bold">Sách đã quá hạn!</h6>
                            </div>
                            <div class="d-flex justify-content-between small mb-1">
                                <span>Số ngày quá hạn:</span>
                                <strong>{{ overdueDetails.days }} ngày</strong>
                            </div>
                            <div class="d-flex justify-content-between align-items-center border-top border-danger-subtle pt-2 mt-1">
                                <span>Tiền phạt (5.000đ/ngày):</span>
                                <strong class="fs-5 text-danger">{{ overdueDetails.penalty.toLocaleString('vi-VN') }} ₫</strong>
                            </div>
                        </div>
                        <div v-else class="alert alert-success border-success bg-success-subtle mb-3 d-flex align-items-center py-2 rounded-3 fade-in">
                            <i class="bi bi-check-circle-fill me-2"></i>
                            <span class="small fw-bold">Trả sách đúng hạn. Không có phí phạt.</span>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Ghi chú tình trạng sách</label>
                            <textarea class="form-control rounded-3 bg-light border-0" v-model="returnForm.GhiChu" rows="3" placeholder="Ghi chú..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer border-top-0">
                        <button class="btn btn-light rounded-pill px-4" @click="closeReturnModal">Hủy</button>
                        <button class="btn btn-success rounded-pill px-4 shadow-sm" @click="returnBook" :disabled="returning">
                            <span v-if="returning" class="spinner-border spinner-border-sm me-2"></span> Hoàn tất trả
                        </button>
                    </div>
                </div>
             </div>
        </div>

        <div class="modal fade" :class="{ show: showExtendModalState }" :style="{ display: showExtendModalState ? 'block' : 'none' }" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-bottom-0 pb-0 ps-4 pe-4 pt-4">
                        <h5 class="modal-title fw-bold text-warning">
                            <i class="bi bi-calendar-plus-fill me-2"></i>Gia hạn sách
                        </h5>
                        <button type="button" class="btn-close" @click="closeExtendModal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div v-if="extendingRecord" class="bg-light p-3 rounded-3 mb-3">
                            <p class="mb-1 small text-muted">Hẹn trả hiện tại:</p>
                            <h6 class="fw-bold text-dark">{{ formatDate(extendingRecord.NgayHenTra) }}</h6>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Ngày hẹn trả mới <span class="text-danger">*</span></label>
                            <input type="date" class="form-control rounded-3" v-model="extendForm.NgayHenTra" 
                                :class="{ 'is-invalid': extendErrors.NgayHenTra }" :min="tomorrow">
                            <div class="invalid-feedback">{{ extendErrors.NgayHenTra }}</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-muted">Lý do gia hạn</label>
                            <textarea class="form-control rounded-3" v-model="extendForm.GhiChu" rows="2"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
                        <button class="btn btn-light rounded-pill px-4" @click="closeExtendModal">Hủy</button>
                        <button class="btn btn-warning rounded-pill px-4 text-white shadow-sm" @click="extendDueDate" :disabled="extending">
                            <span v-if="extending" class="spinner-border spinner-border-sm me-2"></span>
                            Xác nhận gia hạn
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" :class="{ show: showDetailsModalState }" :style="{ display: showDetailsModalState ? 'block' : 'none' }" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-bottom-0 pb-0 ps-4 pe-4 pt-4">
                        <h5 class="modal-title fw-bold text-info">
                            <i class="bi bi-info-circle-fill me-2"></i>Chi tiết phiếu mượn
                        </h5>
                        <button type="button" class="btn-close" @click="closeDetailsModal"></button>
                    </div>
                    <div class="modal-body p-4" v-if="viewingRecord">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="p-3 bg-light rounded-3 h-100">
                                    <h6 class="text-primary fw-bold mb-3 border-bottom pb-2">Thông tin mượn</h6>
                                    <p class="mb-2"><small class="text-muted">Mã phiếu:</small> <strong>{{ viewingRecord.MaTheoDoiMuonSach }}</strong></p>
                                    <p class="mb-2"><small class="text-muted">Ngày mượn:</small> {{ formatDate(viewingRecord.NgayMuon) }}</p>
                                    <p class="mb-2"><small class="text-muted">Hẹn trả:</small> {{ formatDate(viewingRecord.NgayHenTra) }}</p>
                                    <p class="mb-2"><small class="text-muted">Trạng thái:</small> <span class="badge" :class="getStatusPillClass(viewingRecord.TrangThai)">{{ viewingRecord.TrangThai }}</span></p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 bg-light rounded-3 h-100">
                                    <h6 class="text-success fw-bold mb-3 border-bottom pb-2">Độc giả & Sách</h6>
                                    <p class="mb-2"><small class="text-muted">Độc giả:</small> {{ getReaderName(viewingRecord) }}</p>
                                    <p class="mb-2"><small class="text-muted">Sách:</small> {{ getBookTitle(viewingRecord) }}</p>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="p-3 bg-light rounded-3">
                                    <h6 class="text-secondary fw-bold mb-3 border-bottom pb-2">Ghi chú</h6>
                                    <p class="mb-0 fst-italic text-muted">{{ viewingRecord.GhiChu || 'Không có ghi chú.' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
                         <button type="button" class="btn btn-secondary rounded-pill px-4" @click="closeDetailsModal">Đóng</button>
                         
                         <div v-if="viewingRecord && (viewingRecord.TrangThai === 'Đang mượn' || viewingRecord.TrangThai === 'Quá hạn')">
                            <button type="button" class="btn btn-success me-2 rounded-pill" @click="showReturnModalFromDetails">
                                <i class="bi bi-check-circle me-2"></i>Trả sách
                            </button>
                            <button type="button" class="btn btn-warning rounded-pill" @click="showExtendModalFromDetails">
                                <i class="bi bi-calendar-plus me-2"></i>Gia hạn
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-backdrop fade show glass-backdrop" v-if="showBorrowModalState || showReturnModalState || showExtendModalState || showDetailsModalState"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../utils/axios.js'

const recordsList = ref([]); const docGiaList = ref([]); const sachList = ref([]);
const loading = ref(false); const borrowing = ref(false); const returning = ref(false); const extending = ref(false);
const searchQuery = ref(''); const statusFilter = ref(''); const currentPage = ref(1); const itemsPerPage = ref(10);
const showBorrowModalState = ref(false); const showReturnModalState = ref(false); const showExtendModalState = ref(false); const showDetailsModalState = ref(false);
const returningRecord = ref(null); const extendingRecord = ref(null); const viewingRecord = ref(null);

const overdueDetails = ref({ days: 0, penalty: 0, isOverdue: false });

// Hàm tính tiền phạt cho modal và hiển thị nhanh
const getQuickOverdueInfo = (dueDateStr, status) => {
    if (status === 'Đã trả') return null;
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0);
    if (today > dueDate) {
        const diffTime = Math.abs(today - dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const money = diffDays * 5000;
        return { days: diffDays, money: money.toLocaleString('vi-VN') };
    }
    return null;
}

const calculatePenalty = (dueDateString) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0);
    if (today > dueDate) {
        const diffTime = Math.abs(today - dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const penaltyPerDay = 5000;
        return { isOverdue: true, days: diffDays, penalty: diffDays * penaltyPerDay };
    }
    return { isOverdue: false, days: 0, penalty: 0 };
};

const getCurrentUser = () => { try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} } }
const currentUser = getCurrentUser(); const currentStaffId = currentUser?.MSNV || currentUser?.msnv || 'NV001';

const borrowForm = ref({ MaDocGia: '', MaSach: '', NgayHenTra: '', GhiChu: '', NhanVienMuon: currentStaffId });
const returnForm = ref({ NhanVienTra: currentStaffId, GhiChu: '' });
const extendForm = ref({ NgayHenTra: '', GhiChu: '' });
const borrowErrors = ref({}); const returnErrors = ref({}); const extendErrors = ref({});

const getCurrentStatusIcon = computed(() => {
    switch (statusFilter.value) {
        case 'Đang mượn': return 'bi-journal-bookmark-fill text-primary';
        case 'Đã trả': return 'bi-check-circle-fill text-success';
        case 'Quá hạn': return 'bi-exclamation-triangle-fill text-danger';
        default: return 'bi-funnel-fill text-secondary';
    }
})
const getCurrentStatusColor = computed(() => {
    switch (statusFilter.value) {
        case 'Đang mượn': return 'text-primary fw-bold';
        case 'Đã trả': return 'text-success fw-bold';
        case 'Quá hạn': return 'text-danger fw-bold';
        default: return 'text-secondary fw-medium';
    }
})
const setStatusFilter = (status) => { statusFilter.value = status; currentPage.value = 1; }
const getStatusPillClass = (status) => {
    switch (status) {
        case 'Đang mượn': return 'bg-primary-subtle text-primary';
        case 'Đã trả': return 'bg-success-subtle text-success';
        case 'Quá hạn': return 'bg-danger-subtle text-danger';
        default: return 'bg-secondary-subtle text-secondary';
    }
}

const filteredRecords = computed(() => {
  if (!Array.isArray(recordsList.value)) return []
  let filtered = recordsList.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(record =>
      record.MaTheoDoiMuonSach.toLowerCase().includes(query) ||
      record.MaDocGia.toLowerCase().includes(query) ||
      record.MaSach.toLowerCase().includes(query) ||
      getReaderName(record).toLowerCase().includes(query) ||
      getBookTitle(record).toLowerCase().includes(query)
    )
  }
  if (statusFilter.value) filtered = filtered.filter(record => record.TrangThai === statusFilter.value)
  return filtered
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredRecords.value.length))
const paginatedRecords = computed(() => filteredRecords.value.slice(startIndex.value, endIndex.value))
const visiblePages = computed(() => {
  const pages = []; const totalPages = Math.ceil(filteredRecords.value.length / itemsPerPage.value)
  const start = Math.max(1, currentPage.value - 2); const end = Math.min(totalPages, currentPage.value + 2)
  for (let i = start; i <= end; i++) { pages.push(i) }
  return pages
})
const totalPages = computed(() => Math.ceil(filteredRecords.value.length / itemsPerPage.value))
const availableBooks = computed(() => sachList.value.filter(sach => (sach.SoQuyenConLai || sach.SoQuyen) > 0))
const tomorrow = computed(() => { const date = new Date(); date.setDate(date.getDate() + 1); return date.toISOString().split('T')[0] })

const loadRecords = async () => {
  loading.value = true
  try {
    const response = await api.get('/theodoimuonsach')
    if (response.data.success) { recordsList.value = response.data.data || [] } else { recordsList.value = [] }
  } catch (error) { recordsList.value = [] } finally { loading.value = false }
}
const loadDocGia = async () => {
  try { const response = await api.get('/docgia'); if (response.data.success) docGiaList.value = Array.isArray(response.data.data?.docgia || response.data.data) ? (response.data.data?.docgia || response.data.data) : [] } catch {}
}
const loadSach = async () => {
  try { const response = await api.get('/sach/available'); if (response.data.success) sachList.value = Array.isArray(response.data.data) ? response.data.data : [] } catch {}
}

const handleSearch = () => { currentPage.value = 1 }
const clearSearch = () => { searchQuery.value = ''; statusFilter.value = ''; currentPage.value = 1 }
const goToPage = (page) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }

const getReaderName = (record) => {
  if (record.MaDocGia && typeof record.MaDocGia === 'object') return `${record.MaDocGia.HoLot} ${record.MaDocGia.Ten}`.trim()
  const docgia = docGiaList.value.find(d => d.MaDocGia === record.MaDocGia)
  return docgia ? `${docgia.HoLot} ${docgia.Ten}`.trim() : record.MaDocGia || 'N/A'
}
const getBookTitle = (record) => {
  if (record.MaSach && typeof record.MaSach === 'object') return record.MaSach.TenSach
  const sach = sachList.value.find(s => s.MaSach === record.MaSach)
  return sach ? sach.TenSach : record.MaSach || 'N/A'
}
const formatDate = (dateString) => { if (!dateString) return '-'; return new Date(dateString).toLocaleDateString('vi-VN') }
const getDueDateClass = (record) => {
  if (record.TrangThai === 'Đã trả') return ''
  const today = new Date(); const dueDate = new Date(record.NgayHenTra)
  if (dueDate < today) return 'text-danger fw-bold'
  else if (dueDate.getTime() - today.getTime() <= 24 * 60 * 60 * 1000) return 'text-warning fw-bold'
  return ''
}

const showBorrowModal = () => { resetBorrowForm(); showBorrowModalState.value = true }
const closeBorrowModal = () => { showBorrowModalState.value = false; resetBorrowForm() }
const resetBorrowForm = () => { borrowForm.value = { MaDocGia: '', MaSach: '', NgayHenTra: '', GhiChu: '', NhanVienMuon: currentStaffId }; borrowErrors.value = {} }
const validateBorrowForm = () => {
    borrowErrors.value = {}
    if (!borrowForm.value.MaDocGia) borrowErrors.value.MaDocGia = 'Vui lòng chọn độc giả'
    if (!borrowForm.value.MaSach) borrowErrors.value.MaSach = 'Vui lòng chọn sách'
    if (!borrowForm.value.NgayHenTra) borrowErrors.value.NgayHenTra = 'Vui lòng chọn ngày hẹn trả'
    return Object.keys(borrowErrors.value).length === 0
}
const borrowBook = async () => {
    if (!validateBorrowForm()) return
    borrowing.value = true
    try { await api.post('/theodoimuonsach/muon', borrowForm.value); closeBorrowModal(); await loadRecords(); } 
    catch (error) { if (error.response?.data?.errors) borrowErrors.value = error.response.data.errors } finally { borrowing.value = false }
}

const showReturnModal = (record) => {
    returningRecord.value = record;
    overdueDetails.value = calculatePenalty(record.NgayHenTra);
    let autoNote = '';
    if (overdueDetails.value.isOverdue) {
        autoNote = `[QUÁ HẠN] Trễ ${overdueDetails.value.days} ngày. Phạt: ${overdueDetails.value.penalty.toLocaleString('vi-VN')}đ.`;
    }
    returnForm.value = { NhanVienTra: currentStaffId, GhiChu: autoNote };
    returnErrors.value = {};
    showReturnModalState.value = true;
}
const closeReturnModal = () => { showReturnModalState.value = false; returningRecord.value = null }
const returnBook = async () => {
    returning.value = true
    try { await api.put(`/theodoimuonsach/${returningRecord.value.MaTheoDoiMuonSach}/tra`, returnForm.value); closeReturnModal(); await loadRecords() } 
    catch (e) { console.error(e) } finally { returning.value = false }
}

// --- LOGIC CẬP NHẬT NGÀY GIA HẠN (Đã sửa lỗi) ---
const showExtendModal = (record) => { 
    extendingRecord.value = record; 
    // Gợi ý ngày trả mới (mặc định +7 ngày)
    const currentDueDate = new Date(record.NgayHenTra);
    currentDueDate.setDate(currentDueDate.getDate() + 7);
    const defaultNewDate = currentDueDate.toISOString().split('T')[0];
    
    extendForm.value = { NgayHenTra: defaultNewDate, GhiChu: '' }; 
    extendErrors.value = {}; 
    showExtendModalState.value = true 
}
const closeExtendModal = () => { showExtendModalState.value = false; extendingRecord.value = null }
const validateExtendForm = () => {
    extendErrors.value = {};
    if (!extendForm.value.NgayHenTra) extendErrors.value.NgayHenTra = 'Vui lòng chọn ngày hẹn trả mới';
    return Object.keys(extendErrors.value).length === 0;
}
const extendDueDate = async () => {
    if (!validateExtendForm()) return;
    extending.value = true;
    try {
        await api.put(`/theodoimuonsach/${extendingRecord.value.MaTheoDoiMuonSach}/giahan`, extendForm.value);
        closeExtendModal();
        await loadRecords();
        alert("Gia hạn thành công!");
    } catch (error) {
        console.error("Lỗi gia hạn:", error);
        alert("Lỗi khi gia hạn sách.");
    } finally {
        extending.value = false;
    }
}
// --------------------------------------------------

const viewDetails = (record) => { viewingRecord.value = record; showDetailsModal.value = true }
const closeDetailsModal = () => { showDetailsModal.value = false; viewingRecord.value = null }
const showReturnModalFromDetails = () => { const rec = viewingRecord.value; closeDetailsModal(); showReturnModal(rec) }
const showExtendModalFromDetails = () => { const rec = viewingRecord.value; closeDetailsModal(); showExtendModal(rec) }

watch([searchQuery, statusFilter], () => { currentPage.value = 1 })
onMounted(async () => { await Promise.all([loadDocGia(), loadSach()]); await loadRecords() })
</script>

<style scoped>
@import '@/assets/styles/main.css';

.page-wrapper {
    background-color: #f3f4f6;
    min-height: 100vh;
    width: 100%;
    margin: -24px; padding: 24px; width: calc(100% + 48px);
    display: flex; flex-direction: column;
}
.page-container { max-width: 1400px; margin: 0 auto; width: 100%; }

.custom-select-dropdown .dropdown-toggle { background-color: #f8f9fa; transition: all 0.2s ease; border: 1px solid transparent; }
.custom-select-dropdown .dropdown-toggle:hover { background-color: #fff; border-color: #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); transform: translateY(-1px); }
.custom-select-dropdown .dropdown-item { font-weight: 500; transition: all 0.15s; margin-bottom: 2px; }
.custom-select-dropdown .dropdown-item:hover { background-color: #f8f9fa; transform: translateX(4px); }
.dropdown-toggle::after { display: none; }

.bg-gradient-primary { background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); }
.icon-square { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 1.5rem; }
.avatar-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem; }

.status-pill { padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
.bg-primary-subtle { background-color: #e0f2fe; color: #0369a1; }
.bg-success-subtle { background-color: #dcfce7; color: #15803d; }
.bg-danger-subtle { background-color: #fee2e2; color: #b91c1c; }
.bg-secondary-subtle { background-color: #f3f4f6; color: #4b5563; }

.search-icon { left: 20px; top: 50%; transform: translateY(-50%); z-index: 5; }
.form-control:focus, .form-select:focus { box-shadow: none; background-color: #fff; border: 1px solid #4f46e5; }

.btn-icon { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; padding: 0; transition: all 0.2s; border: 1px solid transparent; }
.btn-icon:hover { transform: translateY(-2px); background-color: white; border-color: #e5e7eb; }
.shadow-primary-btn { box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
.hover-scale:hover { transform: scale(1.1); }

.glass-backdrop { backdrop-filter: blur(5px); background-color: rgba(0, 0, 0, 0.2); }
.fade-in-up { animation: fadeInUp 0.5s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-bounce { animation: bounce 2s infinite; }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-3px);} 60% {transform: translateY(-2px);} }
</style>
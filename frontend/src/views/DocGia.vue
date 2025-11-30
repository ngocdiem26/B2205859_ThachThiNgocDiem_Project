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
                                                <i class="bi bi-people-fill"></i>
                                            </div>
                                            Quản lý độc giả
                                        </h4>
                                        <p class="text-secondary small ms-1 mb-0 mt-1">Danh sách và thông tin thẻ độc giả</p>
                                    </div>
                                </div>

                                <div class="row g-3 align-items-center">
                                    <div class="col-md-8">
                                        <div class="position-relative search-group">
                                            <i class="bi bi-search position-absolute text-muted search-icon"></i>
                                            <input type="text" class="form-control form-control-lg border-0 bg-light rounded-pill ps-5"
                                                placeholder="Tìm kiếm theo mã, tên, số điện thoại..."
                                                v-model="searchQuery" @input="handleSearch">
                                            <button v-if="searchQuery" @click="clearSearch" class="btn position-absolute end-0 top-50 translate-middle-y me-2 text-muted rounded-circle btn-sm p-1">
                                                <i class="bi bi-x-circle-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-4 text-end">
                                        <button class="btn btn-primary bg-gradient border-0 btn-lg rounded-pill px-4 shadow-primary-btn w-100 w-md-auto hover-lift" 
                                                @click="showAddModal">
                                            <i class="bi bi-person-plus-fill me-2"></i>Thêm độc giả
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="py-3 ps-4 text-uppercase text-secondary x-small fw-bolder">Mã ĐG</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Thông tin độc giả</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Giới tính & Ngày sinh</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Liên hệ</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Địa chỉ</th>
                                            <th class="py-3 text-end pe-4 text-uppercase text-secondary x-small fw-bolder">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white">
                                        <tr v-for="docgia in docgiaList" :key="docgia.MaDocGia" class="fade-in-row">
                                            <td class="ps-4">
                                                <span class="badge bg-light text-primary border font-monospace">#{{ docgia.MaDocGia }}</span>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-circle me-3" :class="getRandomColorClass(docgia.Ten)">
                                                        {{ docgia.Ten.charAt(0).toUpperCase() }}
                                                    </div>
                                                    <div>
                                                        <h6 class="mb-0 fw-bold text-dark">{{ docgia.HoLot }} {{ docgia.Ten }}</h6>
                                                        <small class="text-muted">Thẻ thành viên</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex flex-column gap-1">
                                                    <div>
                                                        <span class="badge rounded-pill border fw-normal" 
                                                            :class="docgia.Phai === 'Nam' ? 'bg-blue-subtle text-primary border-primary-subtle' : 'bg-pink-subtle text-danger border-danger-subtle'">
                                                            <i class="bi me-1" :class="docgia.Phai === 'Nam' ? 'bi-gender-male' : 'bi-gender-female'"></i>
                                                            {{ docgia.Phai }}
                                                        </span>
                                                    </div>
                                                    <small class="text-secondary">
                                                        <i class="bi bi-cake2 me-1"></i>{{ formatDate(docgia.NgaySinh) }}
                                                    </small>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center text-dark fw-medium">
                                                    <i class="bi bi-telephone-fill text-muted me-2 small"></i>
                                                    {{ docgia.DienThoai }}
                                                </div>
                                            </td>
                                            <td style="max-width: 200px;">
                                                <div class="text-truncate small text-secondary" :title="docgia.DiaChi">
                                                    <i class="bi bi-geo-alt-fill me-1 text-muted"></i>{{ docgia.DiaChi }}
                                                </div>
                                            </td>
                                            <td class="text-end pe-4">
                                                <div class="d-inline-flex gap-2">
                                                    <button class="btn btn-icon btn-light text-primary shadow-sm hover-scale" 
                                                        @click="editDocGia(docgia)" title="Chỉnh sửa">
                                                        <i class="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button class="btn btn-icon btn-light text-danger shadow-sm hover-scale" 
                                                        @click="confirmDelete(docgia)" title="Xóa">
                                                        <i class="bi bi-trash-fill"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        <tr v-if="docgiaList.length === 0 && !loading">
                                            <td colspan="6" class="text-center py-5">
                                                <div class="py-4">
                                                    <div class="empty-icon bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
                                                        <i class="bi bi-search text-muted display-6"></i>
                                                    </div>
                                                    <h5 class="text-muted fw-normal">Không tìm thấy độc giả</h5>
                                                    <p class="text-secondary small mb-0">Thử thay đổi từ khóa tìm kiếm hoặc thêm mới.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="p-3 border-top bg-light d-flex justify-content-between align-items-center" v-if="totalItems > 0">
                                <span class="text-muted small ms-2">
                                    Hiển thị <strong>{{ startIndex + 1 }}-{{ endIndex }}</strong> / <strong>{{ totalItems }}</strong>
                                </span>
                                <nav>
                                    <ul class="pagination pagination-sm mb-0 shadow-sm rounded-pill overflow-hidden">
                                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                            <button class="page-link border-0" @click="goToPage(currentPage - 1)">
                                                <i class="bi bi-chevron-left"></i>
                                            </button>
                                        </li>
                                        <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage }">
                                            <button class="page-link border-0" @click="goToPage(page)">{{ page }}</button>
                                        </li>
                                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                            <button class="page-link border-0" @click="goToPage(currentPage + 1)">
                                                <i class="bi bi-chevron-right"></i>
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

        <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-bottom-0 pb-0 ps-4 pe-4 pt-4">
                        <h5 class="modal-title fw-bold d-flex align-items-center">
                            <div class="icon-square-sm rounded-3 me-2 text-white" :class="editingDocGia ? 'bg-warning' : 'bg-primary'">
                                <i class="bi" :class="editingDocGia ? 'bi-pencil-square' : 'bi-person-plus-fill'"></i>
                            </div>
                            {{ editingDocGia ? 'Cập nhật thông tin' : 'Thêm độc giả mới' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form @submit.prevent="saveDocGia" class="needs-validation">
                            <div class="card bg-light border-0 p-3 mb-3 rounded-3">
                                <h6 class="text-primary x-small fw-bold text-uppercase mb-3">Thông tin định danh</h6>
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label class="form-label small fw-bold text-muted">Mã độc giả <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control rounded-3 border-0 bg-white" 
                                            v-model="formData.MaDocGia" :disabled="editingDocGia"
                                            :class="{ 'is-invalid': errors.MaDocGia }" placeholder="VD: DG001">
                                        <div class="invalid-feedback">{{ errors.MaDocGia }}</div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label small fw-bold text-muted">Họ lót <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control rounded-3 border-0 bg-white" 
                                            v-model="formData.HoLot" :class="{ 'is-invalid': errors.HoLot }" placeholder="Nguyễn Văn">
                                        <div class="invalid-feedback">{{ errors.HoLot }}</div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label small fw-bold text-muted">Tên <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control rounded-3 border-0 bg-white" 
                                            v-model="formData.Ten" :class="{ 'is-invalid': errors.Ten }" placeholder="An">
                                        <div class="invalid-feedback">{{ errors.Ten }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="card bg-white border p-3 rounded-3">
                                <h6 class="text-secondary x-small fw-bold text-uppercase mb-3">Thông tin chi tiết</h6>
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label class="form-label small fw-bold text-muted">Ngày sinh <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control rounded-3" 
                                            v-model="formData.NgaySinh" :class="{ 'is-invalid': errors.NgaySinh }" :max="maxDate">
                                        <div class="invalid-feedback">{{ errors.NgaySinh }}</div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label small fw-bold text-muted">Phái <span class="text-danger">*</span></label>
                                        <select class="form-select rounded-3" v-model="formData.Phai" :class="{ 'is-invalid': errors.Phai }">
                                            <option value="">Chọn giới tính</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                        <div class="invalid-feedback">{{ errors.Phai }}</div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label small fw-bold text-muted">Điện thoại <span class="text-danger">*</span></label>
                                        <input type="tel" class="form-control rounded-3" 
                                            v-model="formData.DienThoai" :class="{ 'is-invalid': errors.DienThoai }" placeholder="09xxxx">
                                        <div class="invalid-feedback">{{ errors.DienThoai }}</div>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label small fw-bold text-muted">Địa chỉ <span class="text-danger">*</span></label>
                                        <textarea class="form-control rounded-3" rows="2" 
                                            v-model="formData.DiaChi" :class="{ 'is-invalid': errors.DiaChi }" placeholder="Nhập địa chỉ..."></textarea>
                                        <div class="invalid-feedback">{{ errors.DiaChi }}</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
                        <button type="button" class="btn btn-light rounded-pill px-4" @click="closeModal">Hủy</button>
                        <button type="button" class="btn btn-primary rounded-pill px-4 shadow-primary-btn" 
                            @click="saveDocGia" :disabled="saving">
                            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                            {{ editingDocGia ? 'Lưu thay đổi' : 'Tạo mới' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" :class="{ show: showDeleteModal }" :style="{ display: showDeleteModal ? 'block' : 'none' }" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div class="modal-body text-center p-4">
                        <div class="avatar-circle bg-danger bg-opacity-10 text-danger mx-auto mb-3" style="width: 60px; height: 60px; font-size: 1.5rem;">
                            <i class="bi bi-trash3"></i>
                        </div>
                        <h5 class="fw-bold">Xóa độc giả?</h5>
                        <p class="text-muted small mb-4">
                            Bạn sắp xóa độc giả <strong>{{ deletingDocGia?.HoLot }} {{ deletingDocGia?.Ten }}</strong>.<br>Hành động này không thể hoàn tác.
                        </p>
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-danger rounded-pill shadow-danger-btn" @click="deleteDocGia" :disabled="deleting">
                                <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
                                Xác nhận xóa
                            </button>
                            <button type="button" class="btn btn-light rounded-pill text-muted" @click="showDeleteModal = false">Hủy bỏ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-backdrop fade show glass-backdrop" v-if="showModal || showDeleteModal"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../utils/axios.js'

// Helper tạo màu avatar ngẫu nhiên (Thêm mới)
const getRandomColorClass = (name) => {
    const colors = ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-indigo', 'bg-purple'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    const color = colors[index];
    if(color === 'bg-indigo') return 'bg-indigo-subtle text-indigo';
    if(color === 'bg-purple') return 'bg-purple-subtle text-purple';
    return `${color} bg-opacity-10 text-${color.replace('bg-', '')}`;
}

const docgiaList = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingDocGia = ref(null)
const deletingDocGia = ref(null)
const formData = ref({ MaDocGia: '', HoLot: '', Ten: '', NgaySinh: '', Phai: '', DiaChi: '', DienThoai: '' })
const errors = ref({})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value))
const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, currentPage.value + 2)
    for (let i = start; i <= end; i++) { pages.push(i) }
    return pages
})
const maxDate = computed(() => {
    const today = new Date()
    const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate())
    return maxDate.toISOString().split('T')[0]
})

const loadDocGia = async () => {
    loading.value = true
    try {
        const params = { page: currentPage.value, limit: itemsPerPage.value, search: searchQuery.value }
        const response = await api.get('/docgia', { params })
        const data = response.data.data
        if (data) {
            docgiaList.value = data.docgia || []
            totalItems.value = data.pagination?.totalItems || 0
            totalPages.value = data.pagination?.totalPages || 0
        } else {
            docgiaList.value = []; totalItems.value = 0; totalPages.value = 0
        }
    } catch (error) {
        console.error('Error loading:', error)
        docgiaList.value = []; totalItems.value = 0; totalPages.value = 0
    } finally { loading.value = false }
}

const handleSearch = () => { currentPage.value = 1; loadDocGia() }
const clearSearch = () => { searchQuery.value = ''; currentPage.value = 1; loadDocGia() }
const goToPage = (page) => { if (page >= 1 && page <= totalPages.value) { currentPage.value = page; loadDocGia() } }
const showAddModal = () => { editingDocGia.value = null; resetForm(); showModal.value = true }
const editDocGia = (docgia) => { editingDocGia.value = docgia; formData.value = { ...docgia, NgaySinh: docgia.NgaySinh ? new Date(docgia.NgaySinh).toISOString().split('T')[0] : '' }; errors.value = {}; showModal.value = true }
const resetForm = () => { formData.value = { MaDocGia: '', HoLot: '', Ten: '', NgaySinh: '', Phai: '', DiaChi: '', DienThoai: '' }; errors.value = {} }
const closeModal = () => { showModal.value = false; resetForm(); editingDocGia.value = null }

const validateForm = () => {
    errors.value = {}
    if (!formData.value.MaDocGia.trim()) errors.value.MaDocGia = 'Mã ĐG là bắt buộc'
    else if (!/^DG\d{3,}$/.test(formData.value.MaDocGia)) errors.value.MaDocGia = 'Định dạng DGxxx'
    if (!formData.value.HoLot.trim()) errors.value.HoLot = 'Họ lót là bắt buộc'
    if (!formData.value.Ten.trim()) errors.value.Ten = 'Tên là bắt buộc'
    if (!formData.value.NgaySinh) errors.value.NgaySinh = 'Ngày sinh là bắt buộc'
    else {
        const birthDate = new Date(formData.value.NgaySinh)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        if (age < 5 || age > 100) errors.value.NgaySinh = 'Tuổi từ 5-100'
    }
    if (!formData.value.Phai) errors.value.Phai = 'Phái là bắt buộc'
    if (!formData.value.DiaChi.trim()) errors.value.DiaChi = 'Địa chỉ là bắt buộc'
    if (!formData.value.DienThoai.trim()) errors.value.DienThoai = 'SĐT là bắt buộc'
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.value.DienThoai)) errors.value.DienThoai = 'SĐT không hợp lệ'
    return Object.keys(errors.value).length === 0
}

const saveDocGia = async () => {
    if (!validateForm()) return
    saving.value = true
    try {
        if (editingDocGia.value) await api.put(`/docgia/${editingDocGia.value.MaDocGia}`, formData.value)
        else await api.post('/docgia', formData.value)
        closeModal(); loadDocGia()
    } catch (error) {
        if (error.response?.data?.errors) errors.value = error.response.data.errors
    } finally { saving.value = false }
}

const confirmDelete = (docgia) => { deletingDocGia.value = docgia; showDeleteModal.value = true }
const deleteDocGia = async () => {
    if (!deletingDocGia.value) return
    deleting.value = true
    try { await api.delete(`/docgia/${deletingDocGia.value.MaDocGia}`); showDeleteModal.value = false; deletingDocGia.value = null; loadDocGia() }
    catch (error) { console.error(error) } finally { deleting.value = false }
}
const formatDate = (dateString) => { if (!dateString) return ''; return new Date(dateString).toLocaleDateString('vi-VN') }

let searchTimeout
watch(searchQuery, () => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { currentPage.value = 1; loadDocGia() }, 500) })
onMounted(() => { loadDocGia() })
</script>

<style scoped>
@import '@/assets/styles/main.css';

/* --- PAGE WRAPPER (Full Height Background) --- */
.page-wrapper {
    background-color: #f3f4f6; /* Cool Gray */
    /* Sử dụng min-height thay vì absolute để nội dung đẩy wrapper */
    min-height: 100vh;
    width: 100%;
    /* Flexbox giúp mở rộng content nếu cần */
    display: flex;
    flex-direction: column;
}

.page-container {
    max-width: 1400px;
}

/* --- ICONS & GRADIENTS --- */
.bg-gradient-primary {
    background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
}

.icon-square {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 1.5rem;
}

.icon-square-sm {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
}

.avatar-circle {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.1rem;
}

/* --- COLORS & BADGES --- */
.bg-blue-subtle { background-color: #dbeafe; }
.bg-pink-subtle { background-color: #fce7f3; }
.text-indigo { color: #4338ca; }
.bg-indigo-subtle { background-color: #e0e7ff; }
.text-purple { color: #7e22ce; }
.bg-purple-subtle { background-color: #f3e8ff; }

/* --- SEARCH --- */
.search-icon {
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
}

/* --- BUTTONS --- */
.btn-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.btn-icon:hover {
    transform: translateY(-2px);
    background-color: white;
    border-color: #e5e7eb;
}

.shadow-primary-btn { box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3); }
.shadow-danger-btn { box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); }

.hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
.hover-scale:hover { transform: scale(1.1); }

/* --- PAGINATION & TYPOGRAPHY --- */
.x-small { font-size: 0.7rem; letter-spacing: 0.8px; }
.empty-icon { width: 80px; height: 80px; font-size: 2rem; }

.pagination .page-link { border: none; border-radius: 8px; margin: 0 3px; color: #4b5563; font-weight: 500; transition: all 0.2s; }
.pagination .page-item.active .page-link { background-color: #4361ee; color: #fff; box-shadow: 0 4px 10px rgba(67, 97, 238, 0.3); }
.pagination .page-link:hover:not(.active) { background-color: #e5e7eb; }

/* --- MODAL & ANIMATIONS --- */
.glass-backdrop { backdrop-filter: blur(5px); background-color: rgba(0, 0, 0, 0.2); }
.fade-in { animation: fadeIn 0.5s ease-out; }
.fade-in-up { animation: fadeInUp 0.5s ease-out; }
.fade-in-row { animation: fadeInRow 0.3s ease-out forwards; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInRow { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.form-control:focus, .form-select:focus { box-shadow: none; background-color: #fff; border: 1px solid #4361ee; }
</style>
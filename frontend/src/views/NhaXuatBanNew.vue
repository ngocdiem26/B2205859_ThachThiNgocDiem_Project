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
                                            <div class="icon-square bg-gradient-warning text-white shadow-sm me-3">
                                                <i class="bi bi-building-fill"></i>
                                            </div>
                                            Quản lý nhà xuất bản
                                        </h4>
                                        <p class="text-secondary small ms-1 mb-0 mt-1">Đối tác cung cấp sách và tài liệu</p>
                                    </div>
                                </div>

                                <div class="row g-3 align-items-center">
                                    <div class="col-md-8">
                                        <div class="position-relative search-group">
                                            <i class="bi bi-search position-absolute text-muted search-icon"></i>
                                            <input type="text" class="form-control form-control-lg border-0 bg-light rounded-pill ps-5"
                                                placeholder="Tìm kiếm theo mã, tên NXB, địa chỉ..."
                                                v-model="searchQuery" @input="handleSearch">
                                            <button v-if="searchQuery" @click="clearSearch" class="btn position-absolute end-0 top-50 translate-middle-y me-2 text-muted rounded-circle btn-sm p-1">
                                                <i class="bi bi-x-circle-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-4 text-end">
                                        <button class="btn btn-primary bg-gradient border-0 btn-lg rounded-pill px-4 shadow-primary-btn w-100 w-md-auto hover-lift" 
                                                @click="showAddModal">
                                            <i class="bi bi-building-add me-2"></i>Thêm NXB
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="py-3 ps-4 text-uppercase text-secondary x-small fw-bolder" style="width: 120px;">Mã NXB</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Tên nhà xuất bản</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Địa chỉ</th>
                                            <th class="py-3 text-end pe-4 text-uppercase text-secondary x-small fw-bolder" style="width: 150px;">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white">
                                        <tr v-for="nxb in nxbList" :key="nxb.MaNhaXuatBan" class="fade-in-row">
                                            <td class="ps-4">
                                                <span class="badge bg-light text-primary border font-monospace">#{{ nxb.MaNhaXuatBan }}</span>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="icon-circle-sm bg-warning bg-opacity-10 text-warning me-3">
                                                        <i class="bi bi-building"></i>
                                                    </div>
                                                    <span class="fw-bold text-dark">{{ nxb.TenNhaXuatBan }}</span>
                                                </div>
                                            </td>
                                            <td style="max-width: 300px;">
                                                <div class="text-truncate text-secondary" :title="nxb.DiaChi">
                                                    <i class="bi bi-geo-alt me-1 text-muted"></i>{{ nxb.DiaChi }}
                                                </div>
                                            </td>
                                            <td class="text-end pe-4">
                                                <div class="d-inline-flex gap-2">
                                                    <button class="btn btn-icon btn-light text-primary shadow-sm hover-scale" 
                                                        @click="editNXB(nxb)" title="Chỉnh sửa">
                                                        <i class="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button class="btn btn-icon btn-light text-danger shadow-sm hover-scale" 
                                                        @click="confirmDelete(nxb)" title="Xóa">
                                                        <i class="bi bi-trash-fill"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        <tr v-if="nxbList.length === 0 && !loading">
                                            <td colspan="4" class="text-center py-5">
                                                <div class="py-4">
                                                    <div class="empty-icon bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
                                                        <i class="bi bi-building-slash text-muted display-6"></i>
                                                    </div>
                                                    <h5 class="text-muted fw-normal">Không tìm thấy nhà xuất bản</h5>
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
                            <div class="icon-square-sm rounded-3 me-2 text-white" :class="editingNXB ? 'bg-warning' : 'bg-primary'">
                                <i class="bi" :class="editingNXB ? 'bi-pencil-square' : 'bi-building-add'"></i>
                            </div>
                            {{ editingNXB ? 'Cập nhật nhà xuất bản' : 'Thêm nhà xuất bản mới' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form @submit.prevent="saveNXB" class="needs-validation">
                            <div class="card bg-light border-0 p-3 mb-3 rounded-3">
                                <h6 class="text-primary x-small fw-bold text-uppercase mb-3">Thông tin chi tiết</h6>
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label class="form-label small fw-bold text-muted">Mã NXB <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control rounded-3 border-0 bg-white" 
                                            v-model="formData.MaNhaXuatBan" :disabled="editingNXB"
                                            :class="{ 'is-invalid': errors.MaNhaXuatBan }" placeholder="VD: NXB001">
                                        <div class="invalid-feedback">{{ errors.MaNhaXuatBan }}</div>
                                    </div>
                                    <div class="col-md-8">
                                        <label class="form-label small fw-bold text-muted">Tên nhà xuất bản <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control rounded-3 border-0 bg-white" 
                                            v-model="formData.TenNhaXuatBan" :class="{ 'is-invalid': errors.TenNhaXuatBan }" 
                                            placeholder="Nhập tên nhà xuất bản...">
                                        <div class="invalid-feedback">{{ errors.TenNhaXuatBan }}</div>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label small fw-bold text-muted">Địa chỉ <span class="text-danger">*</span></label>
                                        <textarea class="form-control rounded-3 border-0 bg-white" rows="2" 
                                            v-model="formData.DiaChi" :class="{ 'is-invalid': errors.DiaChi }" 
                                            placeholder="Nhập địa chỉ trụ sở..."></textarea>
                                        <div class="invalid-feedback">{{ errors.DiaChi }}</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
                        <button type="button" class="btn btn-light rounded-pill px-4" @click="closeModal">Hủy</button>
                        <button type="button" class="btn btn-primary rounded-pill px-4 shadow-primary-btn" 
                            @click="saveNXB" :disabled="saving">
                            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                            {{ editingNXB ? 'Lưu thay đổi' : 'Thêm mới' }}
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
                        <h5 class="fw-bold">Xóa NXB?</h5>
                        <p class="text-muted small mb-4">
                            Bạn sắp xóa <strong>{{ deletingNXB?.TenNhaXuatBan }}</strong>.<br>Hành động này không thể hoàn tác.
                        </p>
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-danger rounded-pill shadow-danger-btn" @click="deleteNXB" :disabled="deleting">
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
// LOGIC GIỮ NGUYÊN 100%
import { ref, computed, onMounted, watch } from 'vue'
import api from '../utils/axios.js'

const nxbList = ref([])
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
const editingNXB = ref(null)
const deletingNXB = ref(null)
const formData = ref({ MaNhaXuatBan: '', TenNhaXuatBan: '', DiaChi: '' })
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

const loadNXB = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, limit: itemsPerPage.value, search: searchQuery.value }
    const response = await api.get('/nhaxuatban', { params })
    const data = response.data.data
    if (data) {
      nxbList.value = data.nhaxuatban || []
      totalItems.value = data.pagination?.totalItems || 0
      totalPages.value = data.pagination?.totalPages || 0
    } else {
      nxbList.value = []; totalItems.value = 0; totalPages.value = 0
    }
  } catch (error) {
    nxbList.value = []; totalItems.value = 0; totalPages.value = 0
  } finally { loading.value = false }
}

const handleSearch = () => { currentPage.value = 1; loadNXB() }
const clearSearch = () => { searchQuery.value = ''; currentPage.value = 1; loadNXB() }
const goToPage = (page) => { if (page >= 1 && page <= totalPages.value) { currentPage.value = page; loadNXB() } }
const showAddModal = () => { editingNXB.value = null; resetForm(); showModal.value = true }
const editNXB = (nxb) => { editingNXB.value = nxb; formData.value = { ...nxb }; errors.value = {}; showModal.value = true }
const resetForm = () => { formData.value = { MaNhaXuatBan: '', TenNhaXuatBan: '', DiaChi: '' }; errors.value = {} }
const closeModal = () => { showModal.value = false; resetForm(); editingNXB.value = null }

const validateForm = () => {
  errors.value = {}
  if (!formData.value.MaNhaXuatBan.trim()) errors.value.MaNhaXuatBan = 'Mã NXB là bắt buộc'
  else if (!/^NXB\d{3,}$/.test(formData.value.MaNhaXuatBan)) errors.value.MaNhaXuatBan = 'Định dạng NXBxxx'
  if (!formData.value.TenNhaXuatBan.trim()) errors.value.TenNhaXuatBan = 'Tên NXB là bắt buộc'
  else if (formData.value.TenNhaXuatBan.length > 100) errors.value.TenNhaXuatBan = 'Tối đa 100 ký tự'
  if (!formData.value.DiaChi.trim()) errors.value.DiaChi = 'Địa chỉ là bắt buộc'
  return Object.keys(errors.value).length === 0
}

const saveNXB = async () => {
  if (!validateForm()) return
  saving.value = true
  try {
    if (editingNXB.value) await api.put(`/nhaxuatban/${editingNXB.value.MaNhaXuatBan}`, formData.value)
    else await api.post('/nhaxuatban', formData.value)
    closeModal(); loadNXB(); console.log('Lưu thành công')
  } catch (error) {
    if (error.response?.data?.errors) errors.value = error.response.data.errors
  } finally { saving.value = false }
}

const confirmDelete = (nxb) => { deletingNXB.value = nxb; showDeleteModal.value = true }
const deleteNXB = async () => {
  if (!deletingNXB.value) return
  deleting.value = true
  try { await api.delete(`/nhaxuatban/${deletingNXB.value.MaNhaXuatBan}`); showDeleteModal.value = false; deletingNXB.value = null; loadNXB() }
  catch (error) { console.error(error) } finally { deleting.value = false }
}

let searchTimeout
watch(searchQuery, () => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { currentPage.value = 1; loadNXB() }, 500) })
onMounted(() => { loadNXB() })
</script>

<style scoped>
@import '@/assets/styles/main.css';

/* --- PAGE WRAPPER --- */
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
.bg-gradient-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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

.icon-circle-sm {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

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

.shadow-primary-btn { box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); } /* Warning shadow for NXB theme */
.shadow-danger-btn { box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); }
.hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
.hover-scale:hover { transform: scale(1.1); }

/* --- PAGINATION & TYPOGRAPHY --- */
.x-small { font-size: 0.7rem; letter-spacing: 0.8px; }
.empty-icon { width: 80px; height: 80px; font-size: 2rem; }

.pagination .page-link { border: none; border-radius: 8px; margin: 0 3px; color: #4b5563; font-weight: 500; transition: all 0.2s; }
.pagination .page-item.active .page-link { background-color: #f59e0b; color: #fff; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3); }
.pagination .page-link:hover:not(.active) { background-color: #e5e7eb; }

/* --- MODAL & ANIMATIONS --- */
.glass-backdrop { backdrop-filter: blur(5px); background-color: rgba(0, 0, 0, 0.2); }
.fade-in { animation: fadeIn 0.5s ease-out; }
.fade-in-up { animation: fadeInUp 0.5s ease-out; }
.fade-in-row { animation: fadeInRow 0.3s ease-out forwards; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInRow { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.form-control:focus, .form-select:focus { box-shadow: none; background-color: #fff; border: 1px solid #f59e0b; }
</style>
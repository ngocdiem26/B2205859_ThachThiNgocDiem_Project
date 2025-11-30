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
                                            <div class="icon-square bg-gradient-info text-white shadow-sm me-3">
                                                <i class="bi bi-book-half"></i>
                                            </div>
                                            Quản lý sách
                                        </h4>
                                        <p class="text-secondary small ms-1 mb-0 mt-1">Kho tàng tri thức và tài liệu thư viện</p>
                                    </div>
                                </div>

                                <div class="row g-3 align-items-center">
                                    <div class="col-md-8">
                                        <div class="position-relative search-group">
                                            <i class="bi bi-search position-absolute text-muted search-icon"></i>
                                            <input type="text" class="form-control form-control-lg border-0 bg-light rounded-pill ps-5"
                                                placeholder="Tìm theo mã, tên sách, tác giả, NXB..."
                                                v-model="searchQuery" @input="handleSearch">
                                            <button v-if="searchQuery" @click="clearSearch" class="btn position-absolute end-0 top-50 translate-middle-y me-2 text-muted rounded-circle btn-sm p-1">
                                                <i class="bi bi-x-circle-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-4 text-end">
                                        <button class="btn btn-primary bg-gradient border-0 btn-lg rounded-pill px-4 shadow-primary-btn w-100 w-md-auto hover-lift" 
                                                @click="showAddModal">
                                            <i class="bi bi-journal-plus me-2"></i>Thêm sách
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="py-3 ps-4 text-uppercase text-secondary x-small fw-bolder" style="width: 100px;">Mã sách</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder" style="width: 350px;">Thông tin sách</th>
                                            <th class="py-3 text-center text-uppercase text-secondary x-small fw-bolder">Số lượng</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Xuất bản</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Nhà xuất bản</th>
                                            <th class="py-3 text-end pe-4 text-uppercase text-secondary x-small fw-bolder">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white">
                                        <tr v-for="sach in sachList" :key="sach.MaSach" class="fade-in-row">
                                            <td class="ps-4">
                                                <span class="badge bg-light text-primary border font-monospace">#{{ sach.MaSach }}</span>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="book-cover-wrapper shadow-sm me-3">
                                                        <img v-if="sach.AnhBia" :src="getFullImageUrl(sach.AnhBia)" class="book-cover-img" />
                                                        <div v-else class="book-cover-placeholder bg-light text-muted d-flex align-items-center justify-content-center">
                                                            <i class="bi bi-image"></i>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h6 class="mb-1 fw-bold text-dark text-wrap" style="max-width: 250px;">{{ sach.TenSach }}</h6>
                                                        <div class="small text-secondary">
                                                            <i class="bi bi-pen-fill me-1 text-muted"></i>{{ sach.NguonGoc }}
                                                        </div>
                                                        <div class="small text-primary mt-1 fw-bold">
                                                            {{ Number(sach.DonGia).toLocaleString('vi-VN') }} ₫
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="text-center">
                                                <div class="d-flex flex-column align-items-center gap-1">
                                                    <span class="badge rounded-pill bg-light border text-dark">
                                                        Tổng: {{ sach.SoQuyen }}
                                                    </span>
                                                    <span class="badge rounded-pill" 
                                                        :class="(sach.SoQuyenConLai || sach.SoQuyen) > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                                                        Còn: {{ sach.SoQuyenConLai !== undefined ? sach.SoQuyenConLai : sach.SoQuyen }}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="text-dark fw-medium">{{ sach.NamXuatBan }}</span>
                                            </td>
                                            <td style="max-width: 200px;">
                                                <div class="text-truncate small text-secondary" :title="sach.NhaXuatBan">
                                                    <i class="bi bi-building me-1 text-muted"></i>{{ sach.NhaXuatBan }}
                                                </div>
                                            </td>
                                            <td class="text-end pe-4">
                                                <div class="d-inline-flex gap-2">
                                                    <button class="btn btn-icon btn-light text-primary shadow-sm hover-scale" 
                                                        @click="editSach(sach)" title="Chỉnh sửa">
                                                        <i class="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button class="btn btn-icon btn-light text-danger shadow-sm hover-scale" 
                                                        @click="confirmDelete(sach)" title="Xóa">
                                                        <i class="bi bi-trash-fill"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        <tr v-if="sachList.length === 0 && !loading">
                                            <td colspan="6" class="text-center py-5">
                                                <div class="py-4">
                                                    <div class="empty-icon bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
                                                        <i class="bi bi-book text-muted display-6"></i>
                                                    </div>
                                                    <h5 class="text-muted fw-normal">Không tìm thấy sách</h5>
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
                            <div class="icon-square-sm rounded-3 me-2 text-white" :class="editingSach ? 'bg-warning' : 'bg-primary'">
                                <i class="bi" :class="editingSach ? 'bi-pencil-square' : 'bi-journal-plus'"></i>
                            </div>
                            {{ editingSach ? 'Cập nhật sách' : 'Thêm sách mới' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form @submit.prevent="saveSach" class="needs-validation">
                            
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="card bg-light border-0 p-3 mb-3 rounded-3">
                                        <h6 class="text-primary x-small fw-bold text-uppercase mb-3">Thông tin cơ bản</h6>
                                        <div class="row g-3">
                                            <div class="col-md-4">
                                                <label class="form-label small fw-bold text-muted">Mã sách <span class="text-danger">*</span></label>
                                                <input type="text" class="form-control rounded-3 border-0 bg-white" id="maSach" 
                                                    v-model="formData.MaSach" :disabled="editingSach" 
                                                    :class="{ 'is-invalid': errors.MaSach }" placeholder="S001">
                                                <div class="invalid-feedback">{{ errors.MaSach }}</div>
                                            </div>
                                            <div class="col-md-8">
                                                <label class="form-label small fw-bold text-muted">Tên sách <span class="text-danger">*</span></label>
                                                <input type="text" class="form-control rounded-3 border-0 bg-white" id="tenSach" 
                                                    v-model="formData.TenSach" :class="{ 'is-invalid': errors.TenSach }" 
                                                    placeholder="Nhập tên sách...">
                                                <div class="invalid-feedback">{{ errors.TenSach }}</div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label small fw-bold text-muted">Đơn giá (VNĐ)</label>
                                                <input type="number" class="form-control rounded-3 border-0 bg-white" id="donGia" 
                                                    v-model="formData.DonGia" :class="{ 'is-invalid': errors.DonGia }" min="0" step="1000">
                                                <div class="invalid-feedback">{{ errors.DonGia }}</div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label small fw-bold text-muted">Tổng số quyển</label>
                                                <input type="number" class="form-control rounded-3 border-0 bg-white" id="soQuyen" 
                                                    v-model="formData.SoQuyen" :class="{ 'is-invalid': errors.SoQuyen }" min="0" @input="updateSoQuyenConLai">
                                                <div class="invalid-feedback">{{ errors.SoQuyen }}</div>
                                            </div>
                                            <div class="col-12" v-if="editingSach">
                                                <label class="form-label small fw-bold text-muted">Số quyển còn lại</label>
                                                <input type="number" class="form-control rounded-3 border-0 bg-white" id="soQuyenConLai" 
                                                    v-model="formData.SoQuyenConLai" :class="{ 'is-invalid': errors.SoQuyenConLai }" :max="formData.SoQuyen">
                                                <div class="invalid-feedback">{{ errors.SoQuyenConLai }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="card bg-white border p-3 rounded-3">
                                        <h6 class="text-secondary x-small fw-bold text-uppercase mb-3">Chi tiết xuất bản</h6>
                                        <div class="row g-3">
                                            <div class="col-md-4">
                                                <label class="form-label small fw-bold text-muted">Năm XB</label>
                                                <input type="number" class="form-control rounded-3" id="namXuatBan" 
                                                    v-model="formData.NamXuatBan" :class="{ 'is-invalid': errors.NamXuatBan }" :max="currentYear">
                                                <div class="invalid-feedback">{{ errors.NamXuatBan }}</div>
                                            </div>
                                            <div class="col-md-8">
                                                <label class="form-label small fw-bold text-muted">Nhà xuất bản</label>
                                                <select class="form-select rounded-3" id="nhaXuatBan" v-model="formData.MaNhaXuatBan" 
                                                    :class="{ 'is-invalid': errors.MaNhaXuatBan }">
                                                    <option value="">-- Chọn NXB --</option>
                                                    <option v-for="nxb in nhaXuatBanList" :key="nxb.MaNhaXuatBan" :value="nxb.MaNhaXuatBan">
                                                        {{ nxb.TenNhaXuatBan }}
                                                    </option>
                                                </select>
                                                <div class="invalid-feedback">{{ errors.MaNhaXuatBan }}</div>
                                            </div>
                                            <div class="col-12">
                                                <label class="form-label small fw-bold text-muted">Tác giả</label>
                                                <input type="text" class="form-control rounded-3" id="nguonGoc" 
                                                    v-model="formData.NguonGoc" :class="{ 'is-invalid': errors.NguonGoc }" placeholder="Tên tác giả">
                                                <div class="invalid-feedback">{{ errors.NguonGoc }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="card bg-white border h-100 p-3 rounded-3 text-center">
                                        <h6 class="text-secondary x-small fw-bold text-uppercase mb-3">Ảnh bìa sách</h6>
                                        
                                        <div class="mb-3 d-flex justify-content-center">
                                            <div class="border rounded-3 overflow-hidden position-relative bg-light d-flex align-items-center justify-content-center" 
                                                style="width: 100%; height: 280px; max-width: 200px;">
                                                <img v-if="previewImage" :src="previewImage" class="w-100 h-100 object-fit-cover" />
                                                <img v-else-if="editingSach && editingSach.AnhBia" :src="getFullImageUrl(editingSach.AnhBia)" class="w-100 h-100 object-fit-cover" />
                                                <div v-else class="text-muted text-center p-3">
                                                    <i class="bi bi-image display-4 d-block mb-2"></i>
                                                    <small>Chưa có ảnh</small>
                                                </div>
                                            </div>
                                        </div>

                                        <input type="file" class="form-control form-control-sm rounded-3 mt-auto" 
                                            accept="image/*" @change="handleImageUpload" />
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
                        <button type="button" class="btn btn-light rounded-pill px-4" @click="closeModal">Hủy</button>
                        <button type="button" class="btn btn-primary rounded-pill px-4 shadow-primary-btn" 
                            @click="saveSach" :disabled="saving">
                            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                            {{ editingSach ? 'Lưu thay đổi' : 'Thêm mới' }}
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
                        <h5 class="fw-bold">Xóa sách?</h5>
                        <p class="text-muted small mb-4">
                            Bạn sắp xóa sách <strong>{{ deletingSach?.TenSach }}</strong>.<br>Hành động này không thể hoàn tác.
                        </p>
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-danger rounded-pill shadow-danger-btn" @click="deleteSach" :disabled="deleting">
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

const sachList = ref([])
const nhaXuatBanList = ref([])
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
const editingSach = ref(null)
const deletingSach = ref(null)
const formData = ref({ MaSach: '', TenSach: '', DonGia: '', SoQuyen: '', SoQuyenConLai: '', NamXuatBan: '', MaNhaXuatBan: '', NguonGoc: '' })
const selectedImage = ref(null);
const previewImage = ref(null);
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
const currentYear = computed(() => new Date().getFullYear())

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  selectedImage.value = file;
  previewImage.value = URL.createObjectURL(file);
};

const getFullImageUrl = (imagePath) => {
  if (!imagePath) return "";
  const baseUrl = (import.meta.env.VITE_API_BASE || "http://localhost:3000").replace(/\/$/, "");
  return `${baseUrl}${imagePath}`;
};

const loadSach = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, limit: itemsPerPage.value, search: searchQuery.value }
    const response = await api.get('/sach', { params })
    if (response.data.success) {
      sachList.value = response.data.data || []
      totalItems.value = response.data.pagination?.totalItems || 0
      totalPages.value = response.data.pagination?.totalPages || 0
    } else { sachList.value = [] }
  } catch (error) { sachList.value = [] } finally { loading.value = false }
}

const loadNhaXuatBan = async () => {
  try {
    const response = await api.get('/nhaxuatban')
    if (response.data.success) {
      const apiData = response.data.data?.nhaxuatban || response.data.data || []
      nhaXuatBanList.value = Array.isArray(apiData) ? apiData : []
    } else { nhaXuatBanList.value = [] }
  } catch (error) { nhaXuatBanList.value = [] }
}

const handleSearch = () => { currentPage.value = 1; loadSach() }
const clearSearch = () => { searchQuery.value = ''; currentPage.value = 1; loadSach() }
const goToPage = (page) => { if (page >= 1 && page <= totalPages.value) { currentPage.value = page; loadSach() } }
const showAddModal = () => { editingSach.value = null; resetForm(); showModal.value = true }
const editSach = (sach) => {
  editingSach.value = sach
  formData.value = { ...sach, SoQuyenConLai: (sach.SoQuyenConLai !== undefined && sach.SoQuyenConLai !== null && sach.SoQuyenConLai !== '') ? sach.SoQuyenConLai : sach.SoQuyen }
  selectedImage.value = null; previewImage.value = null; errors.value = {}; showModal.value = true
}
const resetForm = () => { formData.value = { MaSach: '', TenSach: '', DonGia: '', SoQuyen: '', SoQuyenConLai: '', NamXuatBan: '', MaNhaXuatBan: '', NguonGoc: '' }; selectedImage.value = null; previewImage.value = null; errors.value = {} }
const updateSoQuyenConLai = () => { if (!editingSach.value && formData.value.SoQuyen) { formData.value.SoQuyenConLai = formData.value.SoQuyen } }
const closeModal = () => { showModal.value = false; resetForm(); editingSach.value = null }

const validateForm = () => {
  errors.value = {}
  if (!formData.value.MaSach.trim()) errors.value.MaSach = 'Mã sách là bắt buộc'
  else if (!/^S\d{3,}$/.test(formData.value.MaSach)) errors.value.MaSach = 'Định dạng Sxxx'
  if (!formData.value.TenSach.trim()) errors.value.TenSach = 'Tên sách là bắt buộc'
  if (!formData.value.DonGia || formData.value.DonGia <= 0) errors.value.DonGia = 'Đơn giá > 0'
  if (!formData.value.SoQuyen || formData.value.SoQuyen < 0) errors.value.SoQuyen = 'Số quyển >= 0'
  if (editingSach.value) {
    const soQuyenConLai = Number(formData.value.SoQuyenConLai)
    if (isNaN(soQuyenConLai) || soQuyenConLai < 0) errors.value.SoQuyenConLai = 'Số còn lại >= 0'
    else if (soQuyenConLai > Number(formData.value.SoQuyen)) errors.value.SoQuyenConLai = 'Không được lớn hơn tổng số'
  }
  if (!formData.value.NamXuatBan) errors.value.NamXuatBan = 'Năm XB là bắt buộc'
  if (!formData.value.MaNhaXuatBan) errors.value.MaNhaXuatBan = 'NXB là bắt buộc'
  if (!formData.value.NguonGoc.trim()) errors.value.NguonGoc = 'Tác giả là bắt buộc'
  return Object.keys(errors.value).length === 0
}

const saveSach = async () => {
  if (!validateForm()) return
  saving.value = true
  try {
    const nxb = nhaXuatBanList.value.find(n => n.MaNhaXuatBan === formData.value.MaNhaXuatBan)
    const basicData = { ...formData.value, NhaXuatBan: nxb?.TenNhaXuatBan || '' }
    if (!editingSach.value) basicData.SoQuyenConLai = basicData.SoQuyen
    const form = new FormData();
    Object.keys(basicData).forEach(key => { if (basicData[key] !== null && basicData[key] !== undefined && basicData[key] !== "") form.append(key, basicData[key]) });
    if (selectedImage.value) form.append("AnhBia", selectedImage.value);
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    if (editingSach.value) await api.put(`/sach/${editingSach.value.MaSach}`, form, config)
    else await api.post('/sach', form, config)
    closeModal(); loadSach(); console.log('Sách đã được lưu thành công')
  } catch (error) {
    console.error('Error saving:', error)
    if (error.response?.data?.errors) errors.value = error.response.data.errors
  } finally { saving.value = false }
}

const confirmDelete = (sach) => { deletingSach.value = sach; showDeleteModal.value = true }
const deleteSach = async () => {
  if (!deletingSach.value) return
  deleting.value = true
  try { await api.delete(`/sach/${deletingSach.value.MaSach}`); showDeleteModal.value = false; deletingSach.value = null; loadSach() } 
  catch (error) { console.error('Error deleting:', error) } finally { deleting.value = false }
}

let searchTimeout
watch(searchQuery, () => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { currentPage.value = 1; loadSach() }, 500) })
onMounted(() => { loadSach(); loadNhaXuatBan() })
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
    top: 0;
    left: 0;
}

.page-container {
    max-width: 1400px;
}

/* --- ICONS & GRADIENTS --- */
.bg-gradient-info {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
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

/* --- BOOK COVER STYLES --- */
.book-cover-wrapper {
    width: 50px;
    height: 70px;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid #e5e7eb;
}

.book-cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.book-cover-placeholder {
    width: 100%;
    height: 100%;
    font-size: 1.5rem;
}

.object-fit-cover {
    object-fit: cover;
}

/* --- COLORS & BADGES --- */
.bg-success-subtle { background-color: #d1fae5; }
.bg-danger-subtle { background-color: #fee2e2; }

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

.shadow-primary-btn { box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3); }
.shadow-danger-btn { box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); }
.hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
.hover-scale:hover { transform: scale(1.1); }

/* --- PAGINATION & TYPOGRAPHY --- */
.x-small { font-size: 0.7rem; letter-spacing: 0.8px; }
.empty-icon { width: 80px; height: 80px; font-size: 2rem; }

.pagination .page-link { border: none; border-radius: 8px; margin: 0 3px; color: #4b5563; font-weight: 500; transition: all 0.2s; }
.pagination .page-item.active .page-link { background-color: #0ea5e9; color: #fff; box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3); }
.pagination .page-link:hover:not(.active) { background-color: #e5e7eb; }

/* --- MODAL & ANIMATIONS --- */
.glass-backdrop { backdrop-filter: blur(5px); background-color: rgba(0, 0, 0, 0.2); }
.fade-in { animation: fadeIn 0.5s ease-out; }
.fade-in-up { animation: fadeInUp 0.5s ease-out; }
.fade-in-row { animation: fadeInRow 0.3s ease-out forwards; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInRow { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.form-control:focus, .form-select:focus { box-shadow: none; background-color: #fff; border: 1px solid #0ea5e9; }
</style>
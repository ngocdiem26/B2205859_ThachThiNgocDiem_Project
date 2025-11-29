<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card shadow">
          <div class="card-header py-3">
            <h5 class="card-title mb-0 text-primary font-weight-bold">
              <i class="bi bi-book me-2"></i>Quản lý sách
            </h5>
          </div>
          <div class="card-body">
            <div class="row mb-4">
              <div class="col-md-8">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-search"></i>
                  </span>
                  <input type="text" class="form-control"
                    placeholder="Tìm kiếm theo mã sách, tên sách, tác giả, nhà xuất bản..." v-model="searchQuery"
                    @input="handleSearch">
                  <button class="btn btn-outline-secondary" @click="clearSearch" v-if="searchQuery">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
              <div class="col-md-4 text-end">
                <button class="btn btn-primary" @click="showAddModal">
                  <i class="bi bi-plus-circle me-2"></i>Thêm sách
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th style="width: 100px;">Mã sách</th>
                    <th style="width: 90px;">Ảnh bìa</th>
                    <th>Tên sách</th>
                    <th style="width: 100px;">Tổng số</th>
                    <th style="width: 100px;">Còn lại</th>
                    <th style="width: 100px;">Năm XB</th>
                    <th style="width: 150px;">Nhà XB</th>
                    <th style="width: 150px;">Tác giả</th>
                    <th style="width: 120px;" class="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sach in sachList" :key="sach.MaSach">

                    <td>
                      <span class="badge bg-primary">{{ sach.MaSach }}</span>
                    </td>
                    <td>
                      <img v-if="sach.AnhBia" :src="getFullImageUrl(sach.AnhBia)" class="img-thumbnail"
                        style="width: 60px; height: 80px; object-fit: cover;" />
                      <span v-else class="text-muted small">Không có</span>
                    </td>
                    <td class="fw-bold">{{ sach.TenSach }}</td>

                    <td class="text-center">
                      <span class="badge bg-info">{{ sach.SoQuyen }}</span>
                    </td>
                    <td class="text-center">
                      <span
                        :class="(sach.SoQuyenConLai || sach.SoQuyen) > 0 ? 'badge bg-success' : 'badge bg-danger'">
                        {{ sach.SoQuyenConLai !== undefined ? sach.SoQuyenConLai : sach.SoQuyen }}
                      </span>
                    </td>
                    <td class="text-center">{{ sach.NamXuatBan }}</td>
                    <td class="text-truncate" style="max-width: 150px;" :title="sach.NhaXuatBan">
                      {{ sach.NhaXuatBan }}
                    </td>
                    <td class="text-truncate" style="max-width: 150px;" :title="sach.NguonGoc">
                      {{ sach.NguonGoc }}
                    </td>
                    <td class="text-center">
                      <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" @click="editSach(sach)" title="Chỉnh sửa">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(sach)" title="Xóa">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="sachList.length === 0 && !loading">
                    <td colspan="9" class="text-center text-muted py-4">
                      <i class="bi bi-inbox display-4 d-block mb-2"></i>
                      {{ searchQuery ? 'Không tìm thấy sách nào' : 'Chưa có sách nào' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
              </div>
              <p class="mt-2 text-muted">Đang tải danh sách sách...</p>
            </div>

            <div class="row mt-4" v-if="totalItems > 0">
              <div class="col-md-6">
                <p class="text-muted">
                  Hiển thị {{ startIndex + 1 }} - {{ endIndex }} trong tổng số {{
                    totalItems }} sách
                </p>
              </div>
              <div class="col-md-6">
                <nav aria-label="Pagination">
                  <ul class="pagination justify-content-end mb-0">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                        <i class="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    <li class="page-item" v-for="page in visiblePages" :key="page"
                      :class="{ active: page === currentPage }">
                      <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <button class="page-link" @click="goToPage(currentPage + 1)"
                        :disabled="currentPage === totalPages">
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

    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }"
      tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-book-half me-2" v-if="!editingSach"></i>
              <i class="bi bi-pencil-square me-2" v-else></i>
              {{ editingSach ? 'Chỉnh sửa sách' : 'Thêm sách mới' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSach">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="maSach" class="form-label">Mã sách <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="maSach" v-model="formData.MaSach"
                      :disabled="editingSach" :class="{ 'is-invalid': errors.MaSach }" placeholder="VD: S001">
                    <div class="invalid-feedback" v-if="errors.MaSach">{{ errors.MaSach }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="namXuatBan" class="form-label">Năm xuất bản <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="namXuatBan" v-model="formData.NamXuatBan"
                      :class="{ 'is-invalid': errors.NamXuatBan }" :min="1900" :max="currentYear"
                      placeholder="VD: 2023">
                    <div class="invalid-feedback" v-if="errors.NamXuatBan">{{ errors.NamXuatBan }}</div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="tenSach" class="form-label">Tên sách <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="tenSach" v-model="formData.TenSach"
                  :class="{ 'is-invalid': errors.TenSach }" placeholder="VD: Lập trình JavaScript cơ bản">
                <div class="invalid-feedback" v-if="errors.TenSach">{{ errors.TenSach }}</div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="donGia" class="form-label">Đơn giá mượn <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <input type="number" class="form-control" id="donGia" v-model="formData.DonGia"
                        :class="{ 'is-invalid': errors.DonGia }" min="0" step="1000" placeholder="15000">
                      <span class="input-group-text">VNĐ</span>
                    </div>
                    <small class="form-text text-muted">Giá mượn sách một lần</small>
                    <div class="invalid-feedback" v-if="errors.DonGia">{{ errors.DonGia }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="soQuyen" class="form-label">Tổng số quyển <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="soQuyen" v-model="formData.SoQuyen"
                      :class="{ 'is-invalid': errors.SoQuyen }" min="0" placeholder="10" @input="updateSoQuyenConLai">
                    <div class="invalid-feedback" v-if="errors.SoQuyen">{{ errors.SoQuyen }}</div>
                  </div>
                </div>
              </div>

              <div class="row" v-if="editingSach">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="soQuyenConLai" class="form-label">Số quyển còn lại <span
                        class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="soQuyenConLai" v-model="formData.SoQuyenConLai"
                      :class="{ 'is-invalid': errors.SoQuyenConLai }" min="0" :max="formData.SoQuyen" placeholder="10">
                    <small class="form-text text-muted">Số sách có thể mượn</small>
                    <div class="invalid-feedback" v-if="errors.SoQuyenConLai">{{ errors.SoQuyenConLai }}</div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="nhaXuatBan" class="form-label">Nhà xuất bản <span class="text-danger">*</span></label>
                    <select class="form-select" id="nhaXuatBan" v-model="formData.MaNhaXuatBan"
                      :class="{ 'is-invalid': errors.MaNhaXuatBan }">
                      <option value="">Chọn nhà xuất bản</option>
                      <option v-for="nxb in nhaXuatBanList" :key="nxb.MaNhaXuatBan" :value="nxb.MaNhaXuatBan">
                        {{ nxb.TenNhaXuatBan }}
                      </option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.MaNhaXuatBan">{{ errors.MaNhaXuatBan }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="nguonGoc" class="form-label">Tác giả <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="nguonGoc" v-model="formData.NguonGoc"
                      :class="{ 'is-invalid': errors.NguonGoc }" placeholder="VD: Nguyễn Văn A">
                    <div class="invalid-feedback" v-if="errors.NguonGoc">{{ errors.NguonGoc }}</div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Ảnh bìa</label>
                <input type="file" class="form-control" accept="image/*" @change="handleImageUpload" />

                <div v-if="previewImage" class="mt-2">
                  <p class="small text-muted">Xem trước:</p>
                  <img :src="previewImage" class="img-fluid rounded border" style="max-height: 180px;" />
                </div>

                <div v-else-if="editingSach && editingSach.AnhBia" class="mt-2">
                  <p class="small text-muted">Ảnh hiện tại:</p>
                  <img :src="getFullImageUrl(editingSach.AnhBia)" class="img-fluid rounded border"
                    style="max-height: 180px;" />
                </div>
              </div>

            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              <i class="bi bi-x-circle me-2"></i>Hủy
            </button>
            <button type="button" class="btn btn-primary" @click="saveSach" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-check-circle me-2" v-else></i>
              {{ editingSach ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" :class="{ show: showDeleteModal }" :style="{ display: showDeleteModal ? 'block' : 'none' }"
      tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>Xác nhận xóa
            </h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa sách <strong>{{ deletingSach?.TenSach }}</strong>?</p>
            <p class="text-muted small">Hành động này không thể hoàn tác.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
              <i class="bi bi-x-circle me-2"></i>Hủy
            </button>
            <button type="button" class="btn btn-danger" @click="deleteSach" :disabled="deleting">
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-trash me-2" v-else></i>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show" v-if="showModal || showDeleteModal"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../utils/axios.js'

// Reactive data
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

// Modal states
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingSach = ref(null)
const deletingSach = ref(null)

// Form data
const formData = ref({
  MaSach: '',
  TenSach: '',
  DonGia: '',
  SoQuyen: '',
  SoQuyenConLai: '',
  NamXuatBan: '',
  MaNhaXuatBan: '',
  NguonGoc: ''
})

// === PHẦN ẢNH BÌA ===
const selectedImage = ref(null);
const previewImage = ref(null);

// Form errors
const errors = ref({})

// Computed properties
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage.value, totalItems.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const currentYear = computed(() => new Date().getFullYear())

// Methods

// === HÀM XỬ LÝ ẢNH ===
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
// =====================

const loadSach = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchQuery.value
    }
    const response = await api.get('/sach', { params })

    if (response.data.success) {
      sachList.value = response.data.data || []
      totalItems.value = response.data.pagination?.totalItems || 0
      totalPages.value = response.data.pagination?.totalPages || 0
    } else {
      sachList.value = []
    }
  } catch (error) {
    console.error('Error loading sach from API:', error)
    sachList.value = []
  } finally {
    loading.value = false
  }
}

const loadNhaXuatBan = async () => {
  try {
    const response = await api.get('/nhaxuatban')
    if (response.data.success) {
      const apiData = response.data.data?.nhaxuatban || response.data.data || []
      nhaXuatBanList.value = Array.isArray(apiData) ? apiData : []
    } else {
      nhaXuatBanList.value = []
    }
  } catch (error) {
    nhaXuatBanList.value = []
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadSach()
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  loadSach()
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadSach()
  }
}

const showAddModal = () => {
  editingSach.value = null
  resetForm()
  showModal.value = true
}

const editSach = (sach) => {
  editingSach.value = sach
  formData.value = {
    ...sach,
    SoQuyenConLai: (sach.SoQuyenConLai !== undefined && sach.SoQuyenConLai !== null && sach.SoQuyenConLai !== '')
      ? sach.SoQuyenConLai
      : sach.SoQuyen
  }
  // Setup preview ảnh cũ
  selectedImage.value = null;
  previewImage.value = null;

  errors.value = {}
  showModal.value = true
}

const resetForm = () => {
  formData.value = {
    MaSach: '',
    TenSach: '',
    DonGia: '',
    SoQuyen: '',
    SoQuyenConLai: '',
    NamXuatBan: '',
    MaNhaXuatBan: '',
    NguonGoc: ''
  }
  // Reset ảnh
  selectedImage.value = null;
  previewImage.value = null;
  errors.value = {}
}

const updateSoQuyenConLai = () => {
  if (!editingSach.value && formData.value.SoQuyen) {
    formData.value.SoQuyenConLai = formData.value.SoQuyen
  }
}

const closeModal = () => {
  showModal.value = false
  resetForm()
  editingSach.value = null
}

const validateForm = () => {
  errors.value = {}

  if (!formData.value.MaSach.trim()) {
    errors.value.MaSach = 'Mã sách là bắt buộc'
  } else if (!/^S\d{3,}$/.test(formData.value.MaSach)) {
    errors.value.MaSach = 'Mã sách phải có định dạng S001, S002, ...'
  }

  if (!formData.value.TenSach.trim()) {
    errors.value.TenSach = 'Tên sách là bắt buộc'
  }

  if (!formData.value.DonGia || formData.value.DonGia <= 0) {
    errors.value.DonGia = 'Đơn giá phải lớn hơn 0'
  }

  if (!formData.value.SoQuyen || formData.value.SoQuyen < 0) {
    errors.value.SoQuyen = 'Số quyển phải lớn hơn hoặc bằng 0'
  }

  if (editingSach.value) {
    const soQuyenConLai = Number(formData.value.SoQuyenConLai)
    if (isNaN(soQuyenConLai) || soQuyenConLai < 0) {
      errors.value.SoQuyenConLai = 'Số quyển còn lại phải lớn hơn hoặc bằng 0'
    } else if (soQuyenConLai > Number(formData.value.SoQuyen)) {
      errors.value.SoQuyenConLai = 'Số quyển còn lại không được lớn hơn tổng số quyển'
    }
  }

  if (!formData.value.NamXuatBan) {
    errors.value.NamXuatBan = 'Năm xuất bản là bắt buộc'
  }

  if (!formData.value.MaNhaXuatBan) {
    errors.value.MaNhaXuatBan = 'Nhà xuất bản là bắt buộc'
  }

  if (!formData.value.NguonGoc.trim()) {
    errors.value.NguonGoc = 'Tác giả là bắt buộc'
  }

  return Object.keys(errors.value).length === 0
}

const saveSach = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    const nxb = nhaXuatBanList.value.find(n => n.MaNhaXuatBan === formData.value.MaNhaXuatBan)

    // Chuẩn bị dữ liệu cơ bản theo logic cũ
    const basicData = {
      ...formData.value,
      NhaXuatBan: nxb?.TenNhaXuatBan || '',
    }

    // Logic tính số quyển còn lại cho sách mới
    if (!editingSach.value) {
      basicData.SoQuyenConLai = basicData.SoQuyen
    }

    // === CHUYỂN ĐỔI SANG FORMDATA ĐỂ GỬI ẢNH ===
    const form = new FormData();

    Object.keys(basicData).forEach(key => {
      // Chỉ gửi dữ liệu nếu có giá trị (không null, undefined, rỗng)
      // Để backend tự xử lý hoặc middleware parseFormData hoạt động đúng
      if (basicData[key] !== null && basicData[key] !== undefined && basicData[key] !== "") {
        form.append(key, basicData[key]);
      }
    });

    // Nếu có chọn ảnh mới thì append vào
    if (selectedImage.value) {
      form.append("AnhBia", selectedImage.value);
    }

    // Cấu hình header Multipart
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    if (editingSach.value) {
      await api.put(`/sach/${editingSach.value.MaSach}`, form, config)
    } else {
      await api.post('/sach', form, config)
    }

    closeModal()
    loadSach()
    console.log('Sách đã được lưu thành công')
  } catch (error) {
    console.error('Error saving sach:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
  } finally {
    saving.value = false
  }
}

const confirmDelete = (sach) => {
  deletingSach.value = sach
  showDeleteModal.value = true
}

const deleteSach = async () => {
  if (!deletingSach.value) return
  deleting.value = true
  try {
    await api.delete(`/sach/${deletingSach.value.MaSach}`)
    showDeleteModal.value = false
    deletingSach.value = null
    loadSach()
  } catch (error) {
    console.error('Error deleting sach:', error)
  } finally {
    deleting.value = false
  }
}

let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadSach()
  }, 500)
})

onMounted(() => {
  loadSach()
  loadNhaXuatBan()
})
</script>

<style scoped>
@import '@/assets/styles/main.css';

.card {
  border: none;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #5a5c69;
  background-color: #f8f9fc;
}

.badge {
  font-size: 0.75rem;
}

.btn-group .btn {
  padding: 0.25rem 0.5rem;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination .page-link {
  border-radius: 0.35rem;
  margin: 0 0.125rem;
  border: 1px solid #e3e6f0;
  color: #5a5c69;
}

.pagination .page-item.active .page-link {
  background-color: #4e73df;
  border-color: #4e73df;
}

.form-control:focus,
.form-select:focus {
  border-color: #bac8f3;
  box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
}

.is-invalid {
  border-color: #e74a3b;
}

.invalid-feedback {
  display: block;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }

  .btn-group .btn {
    padding: 0.125rem 0.25rem;
  }

  .modal-dialog {
    margin: 0.5rem;
  }
}
</style>
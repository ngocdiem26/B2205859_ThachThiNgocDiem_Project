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
                                            <div class="icon-square bg-primary bg-gradient text-white shadow-sm me-3">
                                                <i class="bi bi-people-fill"></i>
                                            </div>
                                            Quản lý nhân viên
                                        </h4>
                                        <p class="text-secondary small ms-1 mb-0 mt-1">Hệ thống quản lý nguồn nhân lực thư viện</p>
                                    </div>
                                </div>

                                <div class="alert rounded-3 border-0 d-flex align-items-center shadow-sm mb-4" 
                                    :class="isManager ? 'alert-success-soft' : 'alert-warning-soft'">
                                    <div class="alert-icon me-3">
                                        <i class="bi" :class="isManager ? 'bi-shield-fill-check' : 'bi-shield-lock-fill'"></i>
                                    </div>
                                    <div>
                                        <h6 class="fw-bold mb-1">
                                            {{ isManager ? 'Quyền hạn: Quản trị viên' : 'Chế độ xem: Hạn chế' }}
                                        </h6>
                                        <p class="mb-0 small opacity-75">
                                            <span v-if="isManager">Bạn có toàn quyền thêm, sửa, xóa và quản lý nhân viên.</span>
                                            <span v-else>Bạn chỉ có thể xem danh sách. Liên hệ Admin để cấp quyền thao tác.</span>
                                        </p>
                                    </div>
                                    <div class="ms-auto d-none d-md-block text-end small opacity-75">
                                        <div>Tài khoản: <strong>{{ currentUser?.HoTenNV || currentUser?.hoTenNV }}</strong></div>
                                        <div class="badge bg-white bg-opacity-50 text-dark border mt-1">{{ currentUser?.ChucVu || currentUser?.chucVu }}</div>
                                    </div>
                                </div>

                                <div class="row g-3">
                                    <div class="col-md-8">
                                        <div class="position-relative search-group">
                                            <i class="bi bi-search position-absolute text-muted search-icon"></i>
                                            <input type="text" class="form-control form-control-lg border-0 bg-light rounded-pill ps-5"
                                                placeholder="Tìm kiếm theo tên, mã, số điện thoại..."
                                                v-model="searchQuery" @input="handleSearch">
                                            <button v-if="searchQuery" @click="clearSearch" class="btn position-absolute end-0 top-50 translate-middle-y me-2 text-muted rounded-circle btn-sm p-1">
                                                <i class="bi bi-x-circle-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-4 text-end">
                                        <button class="btn btn-primary bg-gradient border-0 btn-lg rounded-pill px-4 shadow-primary w-100 w-md-auto" 
                                                @click="showAddModal" :disabled="!isManager">
                                            <i class="bi bi-plus-lg me-2"></i>Thêm nhân viên
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="py-3 ps-4 text-uppercase text-secondary x-small fw-bolder">Mã NV</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Thông tin nhân viên</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Liên hệ</th>
                                            <th class="py-3 text-uppercase text-secondary x-small fw-bolder">Địa chỉ</th>
                                            <th class="py-3 text-center text-uppercase text-secondary x-small fw-bolder">Trạng thái</th>
                                            <th class="py-3 text-end pe-4 text-uppercase text-secondary x-small fw-bolder">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white">
                                        <tr v-for="nhanvien in nhanvienList" :key="nhanvien.MSNV" class="align-middle">
                                            <td class="ps-4">
                                                <span class="badge bg-light text-primary border font-monospace">#{{ nhanvien.MSNV }}</span>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-circle me-3" :class="getRandomColorClass(nhanvien.HoTenNV)">
                                                        {{ nhanvien.HoTenNV.charAt(0).toUpperCase() }}
                                                    </div>
                                                    <div>
                                                        <h6 class="mb-0 fw-bold text-dark">{{ nhanvien.HoTenNV }}</h6>
                                                        <small class="text-muted">{{ nhanvien.ChucVu }}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex flex-column gap-1">
                                                    <div class="small"><i class="bi bi-telephone text-muted me-2"></i>{{ nhanvien.SoDienThoai }}</div>
                                                    <div class="small text-muted" v-if="nhanvien.Email"><i class="bi bi-envelope me-2"></i>{{ nhanvien.Email }}</div>
                                                </div>
                                            </td>
                                            <td style="max-width: 200px;">
                                                <div class="text-truncate small text-secondary" :title="nhanvien.DiaChi">
                                                    <i class="bi bi-geo-alt me-1"></i>{{ nhanvien.DiaChi }}
                                                </div>
                                            </td>
                                            <td class="text-center">
                                                <span class="status-pill" 
                                                    :class="nhanvien.isActivate === 1 ? 'status-active' : 'status-inactive'">
                                                    {{ nhanvien.isActivate === 1 ? 'Hoạt động' : 'Đã khóa' }}
                                                </span>
                                            </td>
                                            <td class="text-end pe-4">
                                                <div class="d-inline-flex gap-2" v-if="isManager">
                                                    <button class="btn btn-icon btn-light text-primary shadow-sm" 
                                                        @click="editNhanVien(nhanvien)" title="Chỉnh sửa">
                                                        <i class="bi bi-pencil-fill"></i>
                                                    </button>
                                                    
                                                    <button class="btn btn-icon shadow-sm"
                                                        :class="nhanvien.isActivate === 1 ? 'btn-light text-warning' : 'btn-light text-success'"
                                                        @click="toggleActivate(nhanvien)"
                                                        :title="nhanvien.isActivate === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'">
                                                        <i :class="nhanvien.isActivate === 1 ? 'bi bi-lock-fill' : 'bi bi-unlock-fill'"></i>
                                                    </button>
                                                    
                                                    <button class="btn btn-icon btn-light text-danger shadow-sm" 
                                                        @click="confirmDelete(nhanvien)" title="Xóa">
                                                        <i class="bi bi-trash-fill"></i>
                                                    </button>
                                                </div>
                                                <span v-else class="badge bg-light text-muted border">Read-only</span>
                                            </td>
                                        </tr>
                                        
                                        <tr v-if="nhanvienList.length === 0 && !loading">
                                            <td colspan="6" class="text-center py-5">
                                                <div class="py-4">
                                                    <div class="mb-3">
                                                        <i class="bi bi-search display-1 text-light"></i>
                                                    </div>
                                                    <h5 class="text-muted fw-normal">Không tìm thấy dữ liệu</h5>
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
                            <div class="icon-square-sm rounded-3 me-2 text-white" :class="editingNhanVien ? 'bg-warning' : 'bg-primary'">
                                <i class="bi" :class="editingNhanVien ? 'bi-pencil-square' : 'bi-person-plus-fill'"></i>
                            </div>
                            {{ editingNhanVien ? 'Cập nhật thông tin' : 'Thêm nhân viên mới' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form @submit.prevent="saveNhanVien" class="needs-validation">
                            <div class="card bg-light border-0 p-3 mb-3 rounded-3">
                                <h6 class="text-primary x-small fw-bold text-uppercase mb-3">Thông tin định danh</h6>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label small fw-bold">Mã số nhân viên <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control rounded-3" 
                                            v-model="formData.MSNV" :disabled="editingNhanVien"
                                            :class="{ 'is-invalid': errors.MSNV }" placeholder="VD: NV001">
                                        <div class="invalid-feedback">{{ errors.MSNV }}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label small fw-bold">Chức vụ <span class="text-danger">*</span></label>
                                        <select class="form-select rounded-3" v-model="formData.ChucVu"
                                            :class="{ 'is-invalid': errors.ChucVu }">
                                            <option value="">-- Chọn chức vụ --</option>
                                            <option value="Quản lý thư viện">Quản lý thư viện</option>
                                            <option value="Thủ thư">Thủ thư</option>
                                            <option value="Nhân viên">Nhân viên</option>
                                            <option value="Thực tập sinh">Thực tập sinh</option>
                                        </select>
                                        <div class="invalid-feedback">{{ errors.ChucVu }}</div>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label small fw-bold">Họ và tên <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control rounded-3" 
                                            v-model="formData.HoTenNV" :class="{ 'is-invalid': errors.HoTenNV }" 
                                            placeholder="VD: Nguyễn Văn A">
                                        <div class="invalid-feedback">{{ errors.HoTenNV }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="card bg-white border p-3 rounded-3">
                                <h6 class="text-secondary x-small fw-bold text-uppercase mb-3">Thông tin chi tiết</h6>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label small fw-bold">Số điện thoại <span class="text-danger">*</span></label>
                                        <input type="tel" class="form-control rounded-3"
                                            v-model="formData.SoDienThoai" :class="{ 'is-invalid': errors.SoDienThoai }">
                                        <div class="invalid-feedback">{{ errors.SoDienThoai }}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label small fw-bold">Email</label>
                                        <input type="email" class="form-control rounded-3"
                                            v-model="formData.Email" :class="{ 'is-invalid': errors.Email }">
                                        <div class="invalid-feedback">{{ errors.Email }}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label small fw-bold">Ngày sinh</label>
                                        <input type="date" class="form-control rounded-3" 
                                            v-model="formData.NgaySinh" :class="{ 'is-invalid': errors.NgaySinh }" :max="maxDate">
                                        <div class="invalid-feedback">{{ errors.NgaySinh }}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label small fw-bold">Ngày vào làm</label>
                                        <input type="date" class="form-control rounded-3" 
                                            v-model="formData.NgayVaoLam" :class="{ 'is-invalid': errors.NgayVaoLam }" :max="todayDate">
                                        <div class="invalid-feedback">{{ errors.NgayVaoLam }}</div>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label small fw-bold">Địa chỉ <span class="text-danger">*</span></label>
                                        <textarea class="form-control rounded-3" rows="2" 
                                            v-model="formData.DiaChi" :class="{ 'is-invalid': errors.DiaChi }"></textarea>
                                        <div class="invalid-feedback">{{ errors.DiaChi }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="alert alert-warning d-flex align-items-center mt-3 p-2 rounded-3" v-if="!editingNhanVien">
                                <i class="bi bi-key-fill fs-4 me-3 text-warning"></i>
                                <div class="flex-grow-1">
                                    <label class="form-label small fw-bold mb-0">Mật khẩu khởi tạo <span class="text-danger">*</span></label>
                                    <input type="password" class="form-control form-control-sm mt-1 border-warning" 
                                        v-model="formData.Password" :class="{ 'is-invalid': errors.Password }"
                                        placeholder="Nhập mật khẩu (min 6 ký tự)">
                                    <div class="invalid-feedback">{{ errors.Password }}</div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
                        <button type="button" class="btn btn-light rounded-pill px-4" @click="closeModal">Hủy</button>
                        <button type="button" class="btn btn-primary rounded-pill px-4 shadow-sm" 
                            @click="saveNhanVien" :disabled="saving">
                            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                            {{ editingNhanVien ? 'Lưu thay đổi' : 'Tạo mới' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" :class="{ show: showDeleteModal }" :style="{ display: showDeleteModal ? 'block' : 'none' }" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-body text-center p-4">
                        <div class="avatar-circle bg-danger bg-opacity-10 text-danger mx-auto mb-3" style="width: 60px; height: 60px; font-size: 1.5rem;">
                            <i class="bi bi-trash3"></i>
                        </div>
                        <h5 class="fw-bold">Xóa nhân viên?</h5>
                        <p class="text-muted small mb-4">
                            Bạn sắp xóa <strong>{{ deletingNhanVien?.HoTenNV }}</strong>. <br>Hành động này không thể hoàn tác.
                        </p>
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-danger rounded-pill shadow-sm" @click="deleteNhanVien" :disabled="deleting">
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
// GIỮ NGUYÊN 100% LOGIC CŨ CỦA BẠN
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/axios.js'

const router = useRouter()
const currentUser = ref(null)
const nhanvienList = ref([])
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
const editingNhanVien = ref(null)
const deletingNhanVien = ref(null)
const formData = ref({ MSNV: '', HoTenNV: '', Password: '', ChucVu: '', DiaChi: '', SoDienThoai: '', Email: '', NgaySinh: '', NgayVaoLam: '' })
const errors = ref({})

// Helper function for random avatar color
const getRandomColorClass = (name) => {
    const colors = ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-dark'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return `${colors[index]} bg-opacity-10 text-${colors[index].replace('bg-', '')}`;
}

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
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    return maxDate.toISOString().split('T')[0]
})
const todayDate = computed(() => new Date().toISOString().split('T')[0])
const isManager = computed(() => {
    const chucVu = currentUser.value?.ChucVu || currentUser.value?.chucVu
    return chucVu === 'Quản lý thư viện'
})

const loadNhanVien = async () => {
    loading.value = true
    try {
        const params = { page: currentPage.value, limit: itemsPerPage.value, search: searchQuery.value }
        const response = await api.get('/nhanvien', { params })
        const data = response.data.data
        if (data) {
            nhanvienList.value = data.nhanviens || []
            totalItems.value = data.pagination?.total || 0
            totalPages.value = data.pagination?.totalPages || 0
        } else {
            nhanvienList.value = []; totalItems.value = 0; totalPages.value = 0
        }
    } catch (error) {
        console.error('Error loading:', error)
        nhanvienList.value = []; totalItems.value = 0; totalPages.value = 0
    } finally { loading.value = false }
}

const handleSearch = () => { currentPage.value = 1; loadNhanVien() }
const clearSearch = () => { searchQuery.value = ''; currentPage.value = 1; loadNhanVien() }
const goToPage = (page) => { if (page >= 1 && page <= totalPages.value) { currentPage.value = page; loadNhanVien() } }
const showAddModal = () => { if (!isManager.value) { alert('Chỉ Quản lý thư viện mới có quyền!'); return } editingNhanVien.value = null; resetForm(); showModal.value = true }
const editNhanVien = (nhanvien) => { 
    if (!isManager.value) { alert('Chỉ Quản lý thư viện mới có quyền!'); return } 
    editingNhanVien.value = nhanvien
    formData.value = { ...nhanvien, NgaySinh: nhanvien.NgaySinh ? new Date(nhanvien.NgaySinh).toISOString().split('T')[0] : '', NgayVaoLam: nhanvien.NgayVaoLam ? new Date(nhanvien.NgayVaoLam).toISOString().split('T')[0] : '' }
    errors.value = {}; showModal.value = true 
}
const resetForm = () => { formData.value = { MSNV: '', HoTenNV: '', Password: '', ChucVu: '', DiaChi: '', SoDienThoai: '', Email: '', NgaySinh: '', NgayVaoLam: '' }; errors.value = {} }
const closeModal = () => { showModal.value = false; resetForm(); editingNhanVien.value = null }
const validateForm = () => {
    errors.value = {}
    if (!formData.value.MSNV.trim()) errors.value.MSNV = 'Mã số nhân viên là bắt buộc'
    else if (!/^NV\d{3,}$/.test(formData.value.MSNV)) errors.value.MSNV = 'Định dạng NVxxx'
    if (!formData.value.HoTenNV.trim()) errors.value.HoTenNV = 'Họ tên là bắt buộc'
    if (!editingNhanVien.value && !formData.value.Password.trim()) errors.value.Password = 'Mật khẩu là bắt buộc'
    else if (formData.value.Password && formData.value.Password.length < 6) errors.value.Password = 'Tối thiểu 6 ký tự'
    if (!formData.value.ChucVu) errors.value.ChucVu = 'Chức vụ là bắt buộc'
    if (!formData.value.DiaChi.trim()) errors.value.DiaChi = 'Địa chỉ là bắt buộc'
    if (!formData.value.SoDienThoai.trim()) errors.value.SoDienThoai = 'SĐT là bắt buộc'
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.value.SoDienThoai)) errors.value.SoDienThoai = 'SĐT không hợp lệ'
    if (formData.value.Email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.value.Email)) errors.value.Email = 'Email không hợp lệ'
    return Object.keys(errors.value).length === 0
}
const saveNhanVien = async () => {
    if (!isManager.value) return
    if (!validateForm()) return
    saving.value = true
    try {
        if (editingNhanVien.value) {
            const updateData = { ...formData.value }; delete updateData.Password
            await api.put(`/nhanvien/${editingNhanVien.value._id}`, updateData)
        } else { await api.post('/nhanvien', formData.value) }
        closeModal(); loadNhanVien()
    } catch (error) { 
        if (error.response?.data?.errors) errors.value = error.response.data.errors
    } finally { saving.value = false }
}
const toggleActivate = async (nhanvien) => {
    if (nhanvien.MSNV === currentUser.value.MSNV) { alert('Bạn không thể tự vô hiệu hóa chính mình!'); return; }
    if (!isManager.value) return
    try { await api.patch(`/nhanvien/${nhanvien._id}/activate`); loadNhanVien() } catch (error) { console.error(error) }
}
const confirmDelete = (nhanvien) => { if (!isManager.value) return; deletingNhanVien.value = nhanvien; showDeleteModal.value = true }
const deleteNhanVien = async () => {
    if (!deletingNhanVien.value) return
    deleting.value = true
    try { await api.delete(`/nhanvien/${deletingNhanVien.value._id}`); showDeleteModal.value = false; deletingNhanVien.value = null; loadNhanVien() } 
    catch (error) { console.error(error) } finally { deleting.value = false }
}
const initializeUser = () => {
    const userStr = localStorage.getItem('user'); const userRole = localStorage.getItem('userRole')
    if (!userStr) { router.push('/login'); return false }
    try {
        currentUser.value = JSON.parse(userStr)
        if (userRole !== 'staff') { router.push('/admin'); return false }
        return true
    } catch { router.push('/login'); return false }
}
let searchTimeout
watch(searchQuery, () => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { currentPage.value = 1; loadNhanVien() }, 500) })
onMounted(() => { if (initializeUser()) loadNhanVien() })
</script>

<style scoped>
@import '@/assets/styles/main.css';

/* --- FULL PAGE BACKGROUND FIX --- */
.page-wrapper {
    background-color: #f3f4f6; /* Màu xám hiện đại (Cool Gray) */
    min-height: 100vh;
    width: 100%;
  
    top: 0;
    left: 0;
    padding-top: 1rem;
    padding-bottom: 2rem;
}

.page-container {
    max-width: 1400px;
}

/* --- ICONS & AVATARS --- */
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

/* --- ALERTS --- */
.alert-success-soft {
    background-color: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
}

.alert-warning-soft {
    background-color: #fffbeb;
    color: #92400e;
    border: 1px solid #fde68a;
}

.alert-icon {
    font-size: 2rem;
    opacity: 0.8;
}

/* --- SEARCH --- */
.search-icon {
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
}

/* --- STATUS PILLS --- */
.status-pill {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    display: inline-block;
}

.status-active {
    background-color: #d1fae5;
    color: #065f46;
}

.status-inactive {
    background-color: #fee2e2;
    color: #991b1b;
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

.shadow-primary {
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}

/* --- TYPOGRAPHY --- */
.x-small {
    font-size: 0.7rem;
    letter-spacing: 0.8px;
}

/* --- ANIMATIONS --- */
.fade-in {
    animation: fadeIn 0.5s ease-out;
}

.fade-in-up {
    animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* --- MODAL --- */
.glass-backdrop {
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.2);
}
</style>
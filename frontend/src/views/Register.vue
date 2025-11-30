<template>
  <div class="auth-wrapper">
    <div class="container-fluid p-0">
      <div class="row g-0">
        
        <div class="col-lg-6 col-md-12 bg-white d-flex flex-column min-vh-100">
          <div class="auth-scroll-container px-4 px-md-5 py-5 mx-auto w-100" style="max-width: 650px;">
            
            <div class="text-center mb-4">
              <img src="/images/logo.jpg" alt="Logo" class="logo-icon mb-3" @error="handleLogoError">
              <h2 class="fw-bold mb-1">Tạo tài khoản mới</h2>
              <p class="text-muted">Tham gia cộng đồng thư viện ngay hôm nay</p>
            </div>

            <div class="role-switcher p-1 mb-4 rounded-pill bg-light d-flex justify-content-center mx-auto" style="max-width: 300px;">
              <button 
                type="button"
                class="btn rounded-pill flex-grow-1 fw-bold transition-all"
                :class="registerType === 'reader' ? 'btn-white shadow-sm text-primary' : 'text-muted border-0'"
                @click="registerType = 'reader'">
                Độc giả
              </button>
              <button 
                type="button"
                class="btn rounded-pill flex-grow-1 fw-bold transition-all"
                :class="registerType === 'staff' ? 'btn-white shadow-sm text-success' : 'text-muted border-0'"
                @click="registerType = 'staff'">
                Nhân viên
              </button>
            </div>

            <form @submit.prevent="handleRegister" class="auth-form">
              <h6 class="text-uppercase text-muted fw-bold small mb-3 border-bottom pb-2">Thông tin tài khoản</h6>
              
              <div class="mb-3">
                <label class="form-label small fw-bold">Email <span class="text-danger">*</span></label>
                <div class="input-group-custom">
                  <span class="icon"><i class="fas fa-envelope"></i></span>
                  <input v-model="form.email" type="email" class="form-control-custom" 
                    :placeholder="registerType === 'reader' ? 'reader@library.com' : 'staff@library.com'" 
                    required :disabled="loading">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-bold">Mật khẩu <span class="text-danger">*</span></label>
                  <div class="input-group-custom">
                    <span class="icon"><i class="fas fa-lock"></i></span>
                    <input v-model="form.password" :type="showPassword ? 'text' : 'password'" 
                      class="form-control-custom" placeholder="Min 6 ký tự" minlength="6" required :disabled="loading">
                    <button type="button" class="btn-toggle-pass" @click="showPassword = !showPassword">
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-bold">Xác nhận <span class="text-danger">*</span></label>
                  <div class="input-group-custom">
                    <span class="icon"><i class="fas fa-check-circle"></i></span>
                    <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" 
                      class="form-control-custom" placeholder="Nhập lại mật khẩu" required :disabled="loading">
                    <button type="button" class="btn-toggle-pass" @click="showConfirmPassword = !showConfirmPassword">
                      <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>
              </div>

              <h6 class="text-uppercase text-muted fw-bold small mb-3 mt-2 border-bottom pb-2">Thông tin cá nhân</h6>

              <div class="row" v-if="registerType === 'reader'">
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-bold">Họ lót <span class="text-danger">*</span></label>
                  <div class="input-group-custom">
                    <span class="icon"><i class="fas fa-user"></i></span>
                    <input v-model="form.HoLot" type="text" class="form-control-custom" placeholder="Nguyễn Văn" maxlength="50" required :disabled="loading">
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-bold">Tên <span class="text-danger">*</span></label>
                  <div class="input-group-custom">
                    <span class="icon"><i class="fas fa-user-tag"></i></span>
                    <input v-model="form.Ten" type="text" class="form-control-custom" placeholder="An" maxlength="20" required :disabled="loading">
                  </div>
                </div>
              </div>

              <div class="mb-3" v-if="registerType === 'staff'">
                <label class="form-label small fw-bold">Họ tên đầy đủ <span class="text-danger">*</span></label>
                <div class="input-group-custom">
                  <span class="icon"><i class="fas fa-user"></i></span>
                  <input v-model="form.fullName" type="text" class="form-control-custom" placeholder="Nguyễn Văn An" maxlength="100" required :disabled="loading">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label small fw-bold">Ngày sinh <span class="text-danger">*</span></label>
                  <div class="input-group-custom">
                    <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                    <input v-model="form.NgaySinh" type="date" class="form-control-custom" :max="maxDate" :min="minDate" required :disabled="loading">
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                   <label class="form-label small fw-bold">
                     {{ registerType === 'reader' ? 'Giới tính' : 'Chức vụ' }} <span class="text-danger">*</span>
                   </label>
                   <div class="input-group-custom">
                      <span class="icon">
                        <i v-if="registerType === 'reader'" class="fas fa-venus-mars"></i>
                        <i v-if="registerType === 'staff'" class="fas fa-briefcase"></i>
                      </span>
                      <select v-if="registerType === 'reader'" v-model="form.Phai" class="form-control-custom cursor-pointer" required :disabled="loading">
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                      <select v-if="registerType === 'staff'" v-model="form.chucVu" class="form-control-custom cursor-pointer" required :disabled="loading">
                        <option value="">Chọn chức vụ</option>
                        <option value="Thủ thư">Thủ thư</option>
                        <option value="Nhân viên">Nhân viên</option>
                        <option value="Thực tập sinh">Thực tập sinh</option>
                      </select>
                   </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold">Địa chỉ <span class="text-danger">*</span></label>
                <div class="input-group-custom align-items-start pt-2">
                  <span class="icon mt-1"><i class="fas fa-map-marker-alt"></i></span>
                  <textarea v-model="form.DiaChi" class="form-control-custom" rows="2" placeholder="Địa chỉ liên hệ" required :disabled="loading"></textarea>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label small fw-bold">Số điện thoại <span class="text-danger">*</span></label>
                <div class="input-group-custom">
                  <span class="icon"><i class="fas fa-phone-alt"></i></span>
                  <input v-if="registerType === 'reader'" v-model="form.DienThoai" type="tel" class="form-control-custom" placeholder="0901234567" pattern="^(0|\+84)[0-9]{9,10}$" required :disabled="loading">
                  <input v-else v-model="form.phone" type="tel" class="form-control-custom" placeholder="0901234567" pattern="^(0|\+84)[0-9]{9,10}$" required :disabled="loading">
                </div>
              </div>

              <div class="mb-4 form-check">
                <input v-model="form.acceptTerms" type="checkbox" class="form-check-input custom-checkbox" id="acceptTerms" required :disabled="loading">
                <label class="form-check-label text-muted small" for="acceptTerms">
                  Tôi đồng ý với <a href="#" class="text-primary text-decoration-none fw-bold">điều khoản sử dụng</a> và <a href="#" class="text-primary text-decoration-none fw-bold">chính sách bảo mật</a>
                </label>
              </div>

              <div v-if="error" class="alert alert-danger shadow-sm border-0" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i> {{ error }}
              </div>

              <button type="submit" class="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-primary transition-all" :disabled="loading || !isFormValid">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="fas fa-user-plus me-2"></i>
                {{ loading ? 'Đang tạo tài khoản...' : 'Đăng ký' }}
              </button>

              <div class="text-center mt-4">
                <p class="mb-0 text-muted">
                  Đã có tài khoản?
                  <router-link to="/login" class="text-decoration-none fw-bold text-primary">
                    Đăng nhập ngay
                  </router-link>
                </p>
              </div>

               <div class="text-center mt-3">
                <router-link to="/" class="text-decoration-none small text-muted">
                  <i class="fas fa-arrow-left me-1"></i> Về trang chủ
                </router-link>
              </div>
            </form>
          </div>
        </div>

        <div class="col-lg-6 d-none d-lg-block fixed-image-section">
          <div class="bg-image-cover h-100 w-100">
            <!-- <div class="overlay-gradient"></div> -->
            <div class="content-overlay text-white p-5 text-end">
              <h1 class="display-4 fw-bold mb-3">Đọc sách là nuôi dưỡng tâm hồn</h1>
              <p class="lead text-light">"Sách là ngọn đèn sáng bất diệt của trí tuệ con người"</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const { register, isAuthenticated } = useAuth()
    const registerType = ref('reader') 
    const form = ref({
      email: '', NgaySinh: '', DiaChi: '', password: '', confirmPassword: '', acceptTerms: false,
      HoLot: '', Ten: '', Phai: '', DienThoai: '', fullName: '', phone: '', chucVu: ''
    })
    const loading = ref(false)
    const error = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const today = new Date()
    const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate()).toISOString().split('T')[0]
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()).toISOString().split('T')[0]
    const isFormValid = computed(() => form.value.password === form.value.confirmPassword && form.value.password.length >= 6 && form.value.acceptTerms)

    onMounted(() => {
      if (isAuthenticated.value) router.push('/')
    })

    const handleRegister = async () => {
      if (loading.value || !isFormValid.value) return
      if (form.value.password !== form.value.confirmPassword) {
        error.value = 'Mật khẩu xác nhận không khớp'
        return
      }
      loading.value = true; error.value = ''
      try {
        let result
        if (registerType.value === 'reader') {
          const userData = { email: form.value.email, HoLot: form.value.HoLot, Ten: form.value.Ten, NgaySinh: form.value.NgaySinh, Phai: form.value.Phai, DiaChi: form.value.DiaChi, DienThoai: form.value.DienThoai, password: form.value.password }
          result = await register(userData)
        } else {
          const staffData = { fullName: form.value.fullName, password: form.value.password, email: form.value.email, phone: form.value.phone, address: form.value.DiaChi, birthDate: form.value.NgaySinh }
          const response = await fetch('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(staffData) })
          const data = await response.json()
          if (data.success) {
            localStorage.setItem('token', data.data.token); localStorage.setItem('user', JSON.stringify(data.data.user)); localStorage.setItem('userRole', 'staff')
            result = { success: true }
          } else { result = { success: false, error: data.message } }
        }
        if (result.success) {
          window.dispatchEvent(new CustomEvent('show-message', { detail: { message: 'Đăng ký tài khoản thành công!', type: 'success' } }))
          router.push(registerType.value === 'staff' ? '/admin' : '/')
        } else { error.value = result.error || 'Đăng ký thất bại' }
      } catch (err) { error.value = 'Có lỗi xảy ra, vui lòng thử lại' } finally { loading.value = false }
    }
    const handleLogoError = (event) => { event.target.style.display = 'none' }

    return { registerType, form, loading, error, showPassword, showConfirmPassword, maxDate, minDate, isFormValid, handleRegister, handleLogoError }
  }
}
</script>

<style scoped>
.auth-wrapper { overflow-x: hidden; }

/* QUAN TRỌNG: CSS ĐỂ CỐ ĐỊNH ẢNH */
.fixed-image-section {
  position: fixed; /* Cố định vị trí */
  top: 0;
  right: 0;
  bottom: 0; /* Kéo dài xuống tận đáy màn hình */
  width: 50%; /* Chiếm 50% chiều ngang (tương ứng col-lg-6) */
  height: 100vh; /* Cao bằng màn hình */
  z-index: 1;
}

.bg-image-cover {
  /* Chọn 1 trong các link ảnh ở trên và dán vào đây */
  background-image: url('images/kesach1.jpg');
  background-size: cover; /* Đảm bảo ảnh luôn phủ kín khung */
  background-position: center;
  position: relative;
}

.overlay-gradient {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to left, rgba(0,0,0,0.5), rgba(102, 126, 234, 0.4));
}
.content-overlay {
  position: absolute; bottom: 0; right: 0; width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

/* Các style khác giữ nguyên */
.logo-icon {
  width: 100px;
  height: 100px;
  /* object-fit: contain; */
  object-fit: cover; /* Dùng cover để ảnh lấp đầy khung tròn đẹp hơn */
  border-radius: 50%; /* <--- Dòng này biến hình vuông thành hình tròn */
  
  /* (Tùy chọn) Thêm viền nhẹ nếu logo bị chìm vào nền trắng */
  border: 1px solid #eee;
}
.input-group-custom {
  position: relative; display: flex; align-items: center;
  border: 1px solid #e1e5eb; border-radius: 0.5rem; padding: 0.5rem 1rem;
  transition: all 0.3s ease; background-color: #f8f9fa;
}
.input-group-custom:focus-within { border-color: #667eea; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); background-color: #fff; }
.input-group-custom .icon { margin-right: 12px; color: #a0aec0; min-width: 20px; text-align: center; }
.input-group-custom:focus-within .icon { color: #667eea; }
.form-control-custom { border: none; width: 100%; background: transparent; padding: 0.5rem 0; outline: none; color: #2d3748; }
.cursor-pointer { cursor: pointer; }
.btn-toggle-pass { background: none; border: none; cursor: pointer; padding: 0; margin-left: 10px; color: #a0aec0; }
.btn-toggle-pass:hover { color: #4a5568; }
.role-switcher { border: 1px solid #edf2f7; }
.btn-white { background-color: #fff; }
.transition-all { transition: all 0.3s ease; }
.btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; }
.btn-primary:hover { filter: brightness(110%); transform: translateY(-1px); }
.shadow-primary { box-shadow: 0 4px 14px 0 rgba(118, 75, 162, 0.39); }
.custom-checkbox { width: 1.2em; height: 1.2em; margin-top: 0.15em; cursor: pointer; }
.custom-checkbox:checked { background-color: #764ba2; border-color: #764ba2; }

@media (max-width: 991px) {
  /* Ẩn ảnh trên mobile */
  .fixed-image-section { display: none; }
}
</style>
<template>
  <div class="auth-wrapper">
    <div class="container-fluid p-0">
      <div class="row g-0">
        
        <div class="col-lg-5 col-md-6 d-flex flex-column align-items-center justify-content-center bg-white min-vh-100 position-relative">
          <div class="auth-content px-4 px-md-5 w-100" style="max-width: 500px;">
            
            <div class="mb-5 text-center">
              <h2 class="fw-bold mb-2">Chào mừng trở lại</h2>
              <p class="text-muted">Vui lòng đăng nhập để tiếp tục</p>
              <div class="d-flex justify-content-center align-items-center mb-3">
                <img src="/images/logo.jpg" alt="Logo" class="logo-icon" @error="handleLogoError">
              </div>
              <h4 class="fw-bold m-0 text-primary text-center">Library Manager</h4>
            </div>

            <div class="role-switcher p-1 mb-4 rounded-pill bg-light d-flex">
              <button 
                class="btn rounded-pill flex-grow-1 fw-bold transition-all"
                :class="loginType === 'reader' ? 'btn-white shadow-sm text-primary' : 'text-muted border-0'"
                @click="loginType = 'reader'">
                Độc giả
              </button>
              <button 
                class="btn rounded-pill flex-grow-1 fw-bold transition-all"
                :class="loginType === 'staff' ? 'btn-white shadow-sm text-success' : 'text-muted border-0'"
                @click="loginType = 'staff'">
                Nhân viên
              </button>
            </div>

            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="mb-4">
                <label class="form-label small fw-bold text-muted">{{ loginType === 'reader' ? 'Email' : 'Mã nhân viên' }}</label>
                <div class="input-group-custom">
                  <span class="icon text-muted">
                    <i :class="loginType === 'reader' ? 'fas fa-envelope' : 'fas fa-id-badge'"></i>
                  </span>
                  <input 
                    v-model="form.email" 
                    :type="loginType === 'reader' ? 'email' : 'text'" 
                    class="form-control-custom"
                    id="email" 
                    :placeholder="loginType === 'reader' ? 'name@example.com' : 'NV001'"
                    required 
                    :disabled="loading"
                  >
                </div>
              </div>

              <div class="mb-4">
                <div class="d-flex justify-content-between">
                  <label class="form-label small fw-bold text-muted">Mật khẩu</label>
                  <router-link to="/forgot-password" class="small text-decoration-none text-primary">
                    Quên mật khẩu?
                  </router-link>
                </div>
                <div class="input-group-custom">
                  <span class="icon text-muted">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input 
                    v-model="form.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control-custom"
                    id="password" 
                    placeholder="••••••••" 
                    required 
                    :disabled="loading"
                  >
                  <button type="button" class="btn-toggle-pass text-muted" @click="showPassword = !showPassword" :disabled="loading">
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="mb-4 form-check">
                <input v-model="form.rememberMe" type="checkbox" class="form-check-input custom-checkbox" id="rememberMe" :disabled="loading">
                <label class="form-check-label user-select-none" for="rememberMe">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div v-if="error" class="alert alert-danger d-flex align-items-center border-0 shadow-sm" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                <div>{{ error }}</div>
              </div>

              <button type="submit" class="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-primary transition-all" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <span v-else>Đăng nhập</span>
              </button>

              <div class="text-center mt-4">
                <span class="text-muted">Chưa có tài khoản? </span>
                <router-link to="/register" class="text-decoration-none fw-bold text-primary">
                  Đăng ký ngay
                </router-link>
              </div>
            </form>
          </div>
          
          <div class="mt-auto py-3">
             <router-link to="/" class="text-muted text-decoration-none small">
              <i class="fas fa-arrow-left me-1"></i> Về trang chủ
            </router-link>
          </div>
        </div>

        <div class="col-lg-7 col-md-6 d-none d-md-block position-relative overflow-hidden">
          <div class="bg-image-cover h-100 w-100">
            <!-- <div class="overlay-gradient"></div> -->
            <div class="content-overlay text-white p-5">
              <h1 class="display-4 fw-bold mb-4">Khám phá tri thức vô tận</h1>
              <p class="lead">Hệ thống quản lý thư viện hiện đại, giúp bạn kết nối với hàng ngàn đầu sách một cách dễ dàng.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { login, loginStaff, isAuthenticated } = useAuth()

    const loginType = ref('reader') // 'reader' hoặc 'staff'
    const form = ref({
      email: '',
      password: '',
      rememberMe: false
    })

    const loading = ref(false)
    const error = ref('')
    const showPassword = ref(false)

    // Redirect if already authenticated
    onMounted(() => {
      if (isAuthenticated.value) {
        router.push('/')
      }
    })

    const handleLogin = async () => {
      if (loading.value) return

      // Validate input
      if (loginType.value === 'reader') {
        // Email required & đúng định dạng
        if (!form.value.email || !/^\S+@\S+\.\S+$/.test(form.value.email)) {
          error.value = 'Vui lòng nhập đúng email!'
          return
        }
      } else {
        // Mã NVxxx required
        if (!/^NV\d{3,}$/.test(form.value.email.trim())) {
          error.value = 'Vui lòng nhập đúng mã nhân viên (VD: NV003)!'
          return
        }
      }

      loading.value = true
      error.value = ''

      try {
        let result
        let userRole
        if (loginType.value === 'staff') {
          result = await loginStaff({
            username: form.value.email.trim(),
            password: form.value.password
          })
          userRole = 'staff'
        } else {
          result = await login({
            email: form.value.email,
            password: form.value.password
          })
          userRole = 'reader'
        }

        if (result.success) {
          window.dispatchEvent(new CustomEvent('show-message', {
            detail: {
              message: 'Đăng nhập thành công!',
              type: 'success'
            }
          }))
          let redirectTo = route.query.redirect
          if (!redirectTo) {
            redirectTo = userRole === 'staff' ? '/admin' : '/'
          }
          router.push(redirectTo)
        } else {
          error.value = result.error || 'Đăng nhập thất bại'
        }
      } catch (err) {
        console.error('Login error:', err)
        error.value = 'Có lỗi xảy ra, vui lòng thử lại'
      } finally {
        loading.value = false
      }
    }

    const handleLogoError = (event) => {
      event.target.style.display = 'none'
    }

    return {
      form,
      loading,
      error,
      showPassword,
      handleLogin,
      handleLogoError,
      loginType
    }
  }
}
</script>

<style scoped>
/* Main Layout */
.auth-wrapper {
  overflow-x: hidden;
}

/* Background Image Side */
.bg-image-cover {
  /* Bạn có thể thay đổi URL hình ảnh ở đây */
  background-image: url('images/thuvien4.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.4), rgba(102, 126, 234, 0.3));
}

.content-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

/* Form Styles */
.auth-content {
  animation: fadeIn 0.6s ease-out;
}

.logo-icon {
  width: 80px;
  height: 80px;
  /* object-fit: contain; */
  object-fit: cover; /* Dùng cover để ảnh lấp đầy khung tròn đẹp hơn */
  border-radius: 50%; /* <--- Dòng này biến hình vuông thành hình tròn */
  
  /* (Tùy chọn) Thêm viền nhẹ nếu logo bị chìm vào nền trắng */
  border: 1px solid #eee;
}

/* Custom Input Group */
.input-group-custom {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #e1e5eb;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.input-group-custom:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  background-color: #fff;
}

.input-group-custom .icon {
  margin-right: 12px;
  color: #a0aec0;
}

.input-group-custom:focus-within .icon {
  color: #667eea;
}

.form-control-custom {
  border: none;
  width: 100%;
  background: transparent;
  padding: 0.5rem 0;
  outline: none;
  color: #2d3748;
}

.btn-toggle-pass {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  transition: color 0.2s;
}

.btn-toggle-pass:hover {
  color: #4a5568;
}

/* Role Switcher */
.btn-white {
  background-color: #fff;
}

.transition-all {
  transition: all 0.3s ease;
}

/* Button & Checkbox */
.btn-primary {
  background: #667eea; /* Màu chủ đạo mới */
  border: none;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.shadow-primary {
  box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.39);
}

.custom-checkbox {
  width: 1.2em;
  height: 1.2em;
  margin-top: 0.15em;
  cursor: pointer;
}

.custom-checkbox:checked {
  background-color: #667eea;
  border-color: #667eea;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .auth-content {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
</style>
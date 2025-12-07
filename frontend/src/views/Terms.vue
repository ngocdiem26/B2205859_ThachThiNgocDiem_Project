<template>
  <div class="terms-page">
    <div class="page-header bg-primary-gradient text-white py-5 mb-5 shadow-lg">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="display-4 fw-bold mb-3">Điều khoản sử dụng</h1>
            <p class="lead opacity-75">
              Quy định và điều khoản ràng buộc khi sử dụng dịch vụ thư viện
            </p>
          </div>
          <div class="col-md-4 text-center">
            <i class="fas fa-file-contract fa-6x opacity-75"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-lg-3 mb-4">
          <div class="toc-sidebar sticky-top" style="top: 100px;">
            <div class="card border-0 shadow-lg rounded-3">
              <div class="card-header bg-primary text-white border-0 py-3 rounded-top-3">
                <h6 class="mb-0 fw-bold">
                  <i class="fas fa-list-alt me-2"></i> Mục lục
                </h6>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <a 
                    v-for="section in sections" 
                    :key="section.id"
                    :href="`#${section.id}`"
                    class="list-group-item list-group-item-action border-0 py-2"
                    @click.prevent="scrollToSection(section.id)"
                  >
                    {{ section.title }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-9">
          <div class="terms-content">
            <section id="introduction" class="content-section mb-5 p-4 rounded-3 shadow-sm bg-white">
              <h2 class="text-primary border-bottom pb-2 mb-3">1. Giới thiệu</h2>
              <p class="lead">
                Chào mừng bạn đến với Hệ thống Thư viện Điện tử. Bằng cách truy cập 
                và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản 
                và điều kiện được nêu trong tài liệu này.
              </p>
              <p class="text-muted">
                Vui lòng đọc kỹ các điều khoản này trước khi sử dụng dịch vụ. 
                Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.
              </p>
              <div class="alert alert-info border-info bg-info-subtle">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Có hiệu lực từ:</strong> {{ effectiveDate }}
              </div>
            </section>

            <section id="definitions" class="content-section mb-5 p-4 rounded-3 shadow-sm bg-white">
              <h2 class="text-primary border-bottom pb-2 mb-3">2. Định nghĩa</h2>
              <div class="definitions-list">
                <div class="definition-item bg-light border-start border-primary border-4 p-3 mb-3">
                  <h5 class="fw-bold text-dark mb-1">"Thư viện"</h5>
                  <p class="mb-0 text-muted">Đề cập đến Hệ thống Thư viện Điện tử và tất cả các dịch vụ liên quan.</p>
                </div>
                <div class="definition-item bg-light border-start border-primary border-4 p-3 mb-3">
                  <h5 class="fw-bold text-dark mb-1">"Người dùng" hoặc "Bạn"</h5>
                  <p class="mb-0 text-muted">Đề cập đến bất kỳ cá nhân nào truy cập hoặc sử dụng dịch vụ của chúng tôi.</p>
                </div>
                <div class="definition-item bg-light border-start border-primary border-4 p-3 mb-3">
                  <h5 class="fw-bold text-dark mb-1">"Tài khoản"</h5>
                  <p class="mb-0 text-muted">Tài khoản cá nhân được tạo để truy cập các dịch vụ của thư viện.</p>
                </div>
                <div class="definition-item bg-light border-start border-primary border-4 p-3">
                  <h5 class="fw-bold text-dark mb-1">"Nội dung"</h5>
                  <p class="mb-0 text-muted">Bao gồm sách, tài liệu, thông tin và dữ liệu có sẵn trên hệ thống.</p>
                </div>
              </div>
            </section>

            <section id="registration" class="content-section mb-5 p-4 rounded-3 shadow-sm bg-white">
              <h2 class="text-primary border-bottom pb-2 mb-3">3. Đăng ký tài khoản</h2>
              
              <h4>3.1. Điều kiện đăng ký</h4>
              <ul class="list-group list-group-flush mb-4">
                <li class="list-group-item"><i class="fas fa-check text-success me-2"></i> Bạn phải từ 16 tuổi trở lên để đăng ký tài khoản</li>
                <li class="list-group-item"><i class="fas fa-check text-success me-2"></i> Cung cấp thông tin chính xác và đầy đủ</li>
                <li class="list-group-item"><i class="fas fa-check text-success me-2"></i> Có CMND/CCCD hợp lệ để xác thực danh tính</li>
                <li class="list-group-item"><i class="fas fa-check text-success me-2"></i> Đồng ý tuân thủ các quy định của thư viện</li>
              </ul>

              <h4>3.2. Trách nhiệm tài khoản</h4>
              <div class="responsibility-cards row g-3">
                <div class="col-md-4">
                  <div class="card h-100 bg-light border-top border-primary border-3 shadow-sm">
                    <div class="card-body">
                      <h6><i class="fas fa-lock text-primary me-2"></i>Bảo mật tài khoản</h6>
                      <p class="mb-0 small text-muted">Bạn có trách nhiệm bảo vệ mật khẩu và thông tin đăng nhập.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card h-100 bg-light border-top border-success border-3 shadow-sm">
                    <div class="card-body">
                      <h6><i class="fas fa-user-check text-success me-2"></i>Thông tin chính xác</h6>
                      <p class="mb-0 small text-muted">Cập nhật thông tin cá nhân khi có thay đổi.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card h-100 bg-light border-top border-warning border-3 shadow-sm">
                    <div class="card-body">
                      <h6><i class="fas fa-exclamation-triangle text-warning me-2"></i>Báo cáo vi phạm</h6>
                      <p class="mb-0 small text-muted">Thông báo ngay khi phát hiện tài khoản bị xâm nhập.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="services" class="content-section mb-5 p-4 rounded-3 shadow-sm bg-white">
              <h2 class="text-primary border-bottom pb-2 mb-3">4. Dịch vụ thư viện</h2>
              
              <h4>4.1. Dịch vụ mượn sách</h4>
              <div class="service-rules row g-3 mb-4">
                <div class="col-md-4">
                  <div class="rule-item bg-light border-bottom border-primary border-3 h-100">
                    <i class="fas fa-book text-primary fa-2x mb-2"></i>
                    <div>
                      <h6 class="fw-bold mb-1">Số lượng mượn</h6>
                      <p class="mb-0 small">Tối đa **5 cuốn sách** cùng một lúc</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="rule-item bg-light border-bottom border-success border-3 h-100">
                    <i class="fas fa-calendar text-success fa-2x mb-2"></i>
                    <div>
                      <h6 class="fw-bold mb-1">Thời gian mượn</h6>
                      <p class="mb-0 small">**30 ngày**, có thể gia hạn thêm 7 ngày</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="rule-item bg-light border-bottom border-danger border-3 h-100">
                    <i class="fas fa-money-bill text-danger fa-2x mb-2"></i>
                    <div>
                      <h6 class="fw-bold mb-1">Phí phạt</h6>
                      <p class="mb-0 small">**5,000 VNĐ/ngày** cho mỗi sách trả muộn</p>
                    </div>
                  </div>
                </div>
              </div>

              <h4>4.2. Quy định sử dụng & Nghiêm cấm</h4>
              <div class="alert alert-danger-subtle border-danger border-2">
                <h6 class="alert-heading fw-bold text-danger"><i class="fas fa-exclamation-triangle me-2"></i>Nghiêm cấm</h6>
                <ul class="mb-0 small">
                  <li>Làm hỏng, mất sách (có thể bị phạt bằng giá trị sách)</li>
                  <li>Cho người khác mượn sách bằng tài khoản của bạn</li>
                  <li>Sao chép, phân phối nội dung trái phép</li>
                  <li>Sử dụng dịch vụ cho mục đích thương mại</li>
                </ul>
              </div>
            </section>

            <section id="conduct" class="content-section mb-5 p-4 rounded-3 shadow-sm bg-white">
              <h2 class="text-primary border-bottom pb-2 mb-3">5. Quy tắc ứng xử</h2>
              
              <div class="conduct-section">
                <h4>5.1. Hành vi được khuyến khích</h4>
                <div class="conduct-grid positive row g-3 mb-4">
                  <div class="col-md-6">
                    <div class="conduct-item bg-light border-start border-success border-3">
                      <i class="fas fa-thumbs-up text-success"></i>
                      <span class="small">Sử dụng dịch vụ đúng mục đích</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="conduct-item bg-light border-start border-success border-3">
                      <i class="fas fa-handshake text-success"></i>
                      <span class="small">Hợp tác với nhân viên thư viện</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="conduct-item bg-light border-start border-success border-3">
                      <i class="fas fa-heart text-success"></i>
                      <span class="small">Tôn trọng tài sản thư viện</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="conduct-item bg-light border-start border-success border-3">
                      <i class="fas fa-share-alt text-success"></i>
                      <span class="small">Chia sẻ phản hồi tích cực</span>
                    </div>
                  </div>
                </div>

                <h4>5.2. Hành vi bị cấm</h4>
                <div class="conduct-grid negative row g-3">
                  <div class="col-md-6">
                    <div class="conduct-item bg-light border-start border-danger border-3">
                      <i class="fas fa-ban text-danger"></i>
                      <span class="small">Vi phạm bản quyền tài liệu</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="conduct-item bg-light border-start border-danger border-3">
                      <i class="fas fa-virus text-danger"></i>
                      <span class="small">Tải lên malware</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="conduct-item bg-light border-start border-danger border-3">
                      <i class="fas fa-user-times text-danger"></i>
                      <span class="small">Quấy rối người khác/nhân viên</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="conduct-item bg-light border-start border-danger border-3">
                      <i class="fas fa-exclamation-triangle text-danger"></i>
                      <span class="small">Cung cấp thông tin sai lệch</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="intellectual-property" class="content-section mb-5 p-4 rounded-3 shadow-sm bg-white">
              <h2 class="text-primary border-bottom pb-2 mb-3">6. Quyền sở hữu trí tuệ</h2>
              
              <div class="ip-section">
                <h4>6.1. Quyền của thư viện</h4>
                <p class="text-muted small">
                  Tất cả nội dung, thiết kế, logo, và phần mềm của hệ thống thuộc 
                  quyền sở hữu của thư viện hoặc được cấp phép sử dụng hợp pháp.
                </p>

                <h4>6.2. Quyền của người dùng</h4>
                <p class="text-muted small">
                  Bạn được cấp quyền sử dụng có giới hạn, không độc quyền để truy cập 
                  và sử dụng dịch vụ cho mục đích cá nhân, phi thương mại.
                </p>

                <div class="alert alert-info border-info bg-info-subtle small">
                  <i class="fas fa-info-circle me-2"></i>
                  Việc sử dụng nội dung phải tuân thủ luật bản quyền và các quy định liên quan.
                </div>
              </div>
            </section>

            <section id="liability" class="content-section mb-5 p-4 rounded-3 shadow-sm bg-white">
              <h2 class="text-primary border-bottom pb-2 mb-3">7. Trách nhiệm pháp lý & Chấm dứt</h2>
              
              <div class="row g-4">
                <div class="col-md-6">
                  <h4 class="text-secondary">7.1. Giới hạn trách nhiệm</h4>
                  <p class="text-muted small">
                    Thư viện không chịu trách nhiệm cho các thiệt hại gián tiếp, 
                    ngẫu nhiên hoặc hậu quả phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.
                  </p>
                  <h4 class="text-secondary">7.2. Tuyên bố từ chối</h4>
                  <div class="disclaimer-box bg-light border-start border-warning border-3 p-3">
                    <p class="mb-0 small">
                      Dịch vụ được cung cấp "như hiện tại" mà không có bất kỳ bảo đảm nào. 
                      Chúng tôi không đảm bảo rằng dịch vụ sẽ không bị gián đoạn hoặc không có lỗi.
                    </p>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <h4 class="text-secondary">8. Chấm dứt dịch vụ</h4>
                  <p class="text-muted small mb-2">Chúng tôi có quyền chấm dứt tài khoản của bạn nếu:</p>
                  <ul class="list-group list-group-flush small">
                    <li class="list-group-item bg-light"><i class="fas fa-times text-danger me-2"></i> Vi phạm các điều khoản sử dụng</li>
                    <li class="list-group-item bg-light"><i class="fas fa-times text-danger me-2"></i> Không thanh toán phí phạt quá hạn</li>
                    <li class="list-group-item bg-light"><i class="fas fa-times text-danger me-2"></i> Cung cấp thông tin sai lệch</li>
                  </ul>
                </div>
              </div>
            </section>
            
            <section id="changes-contact" class="content-section mb-5 p-4 rounded-3 shadow-sm bg-white">
              <h2 class="text-primary border-bottom pb-2 mb-3">9. Thay đổi & 10. Liên hệ</h2>
              
              <div class="row g-4">
                <div class="col-md-6">
                  <h4 class="text-secondary">9. Thay đổi điều khoản</h4>
                  <p class="text-muted small">
                    Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào. 
                    Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website.
                  </p>
                  <div class="alert alert-warning border-warning bg-warning-subtle small">
                    <i class="fas fa-bell me-2"></i>
                    Bạn sẽ được thông báo về các thay đổi quan trọng qua email đã đăng ký.
                  </div>
                </div>
                
                <div class="col-md-6">
                  <h4 class="text-secondary">10. Liên hệ</h4>
                  <div class="contact-info bg-light p-3 rounded-3">
                    <div class="contact-item small mb-2">
                      <i class="fas fa-envelope text-primary"></i>
                      <span>Email: <a href="mailto:legal@library.com">legal@library.com</a></span>
                    </div>
                    <div class="contact-item small mb-2">
                      <i class="fas fa-phone text-success"></i>
                      <span>Điện thoại: (84) 123 456 789</span>
                    </div>
                    <div class="contact-item small">
                      <i class="fas fa-map-marker-alt text-info"></i>
                      <span>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
          </div>

          <div class="acceptance-section mt-5">
            <div class="card border-0 shadow-lg bg-primary-subtle rounded-3">
              <div class="card-body text-center py-5">
                <h3 class="mb-3 text-primary fw-bold">Xác nhận chấp nhận điều khoản</h3>
                <p class="text-secondary mb-4 lead">
                  Bằng cách tiếp tục sử dụng dịch vụ, bạn xác nhận đã đọc, 
                  hiểu và đồng ý với tất cả các điều khoản và quy định trên.
                </p>
                <div class="d-flex gap-3 justify-content-center flex-wrap">
                  <router-link to="/register" class="btn btn-primary btn-lg shadow-sm">
                    <i class="fas fa-user-plus me-2"></i>
                    Đăng ký tài khoản ngay
                  </router-link>
                  <router-link to="/contact" class="btn btn-outline-primary btn-lg shadow-sm">
                    <i class="fas fa-question-circle me-2"></i>
                    Cần hỗ trợ thêm?
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Terms',
  setup() {
    const effectiveDate = ref('15/01/2025')
    
    // Cập nhật lại các ID cho các phần được gộp
    const sections = ref([
      { id: 'introduction', title: '1. Giới thiệu' },
      { id: 'definitions', title: '2. Định nghĩa' },
      { id: 'registration', title: '3. Đăng ký tài khoản' },
      { id: 'services', title: '4. Dịch vụ thư viện' },
      { id: 'conduct', title: '5. Quy tắc ứng xử' },
      { id: 'intellectual-property', title: '6. Quyền sở hữu trí tuệ' },
      { id: 'liability', title: '7. Trách nhiệm pháp lý & Chấm dứt' }, // Đổi tên mục
      { id: 'changes-contact', title: '9. & 10. Thay đổi & Liên hệ' } // Đổi tên mục
    ])

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        // Scroll với offset 100px để không bị dính vào header sticky
        const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }

    return {
      effectiveDate,
      sections,
      scrollToSection
    }
  }
}
</script>

<style scoped>
/* ==================================== */
/* 1. GENERAL & COLORS */
/* ==================================== */
.terms-page {
    background-color: #f4f7fa; /* Nền nhẹ nhàng cho cả trang */
}

/* Custom Backgrounds (Dùng Primary color) */
.bg-primary-gradient {
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
}
.bg-info-subtle { background-color: #dbeafe !important; }
.bg-warning-subtle { background-color: #fffbe6 !important; }
.bg-danger-subtle { background-color: #fef2f2 !important; }

/* Các thẻ nội dung chính */
.terms-content h2 {
    font-weight: 700;
    margin-bottom: 1rem;
}

/* ==================================== */
/* 2. TABLE OF CONTENTS (TOC) */
/* ==================================== */
.toc-sidebar {
    z-index: 10;
}

.list-group-item-action:hover {
    background-color: #f8f9fa;
    color: #4f46e5;
    font-weight: 500;
}

.list-group-item-action {
    padding-left: 1.5rem;
}


/* ==================================== */
/* 3. CONTENT SECTIONS */
/* ==================================== */
.content-section {
    scroll-margin-top: 100px;
    background-color: white;
    border: 1px solid #e9ecef;
}

.content-section h4 {
    font-weight: 600;
    color: #343a40;
    margin-top: 1.5rem;
    margin-bottom: 0.8rem;
}

/* Definitions & Rules */
.definitions-list .definition-item,
.service-rules .rule-item,
.conduct-item {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.definitions-list .definition-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.1);
}

/* Service Rules */
.service-rules .rule-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
    text-align: left;
}

.rule-item i {
    margin-right: 0;
    margin-bottom: 0.75rem;
}

/* Conduct Grid */
.conduct-item {
    padding: 1rem;
}

.conduct-item i {
    margin-right: 0.75rem;
    font-size: 1.2rem;
}

/* Acceptance */
.acceptance-section {
    padding: 1rem;
}

/* Contact Info */
.contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
}

.contact-item i {
    width: 20px;
    margin-right: 1rem;
    text-align: center;
}

/* Responsive adjustments */
@media (max-width: 992px) {
    .toc-sidebar {
        position: static !important;
    }
}
</style>
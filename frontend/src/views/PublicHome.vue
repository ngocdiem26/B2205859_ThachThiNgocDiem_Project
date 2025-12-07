<template>
    <div class="public-home container py-4">

        <div class="hero-section mb-5">
            <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner rounded-4 hero-shadow">
                    <div class="carousel-item active">
                        <img src="/images/slider_4.jpg" class="d-block w-100 hero-image" alt="Thư viện sách"
                            @error="handleImageError">
                        <div class="carousel-caption d-none d-md-block hero-caption-bg">
                            <h2 class="fw-bolder">Khám phá thế giới tri thức</h2>
                            <p class="lead">Hàng ngàn đầu sách đang chờ bạn khám phá</p>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img src="/images/slider_5.jpg" class="d-block w-100 hero-image" alt="Đọc sách"
                            @error="handleImageError">
                        <div class="carousel-caption d-none d-md-block hero-caption-bg">
                            <h2 class="fw-bolder">Mượn sách dễ dàng</h2>
                            <p class="lead">Hệ thống quản lý mượn trả hiện đại và tiện lợi</p>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img src="/images/slider_6.jpg" class="d-block w-100 hero-image" alt="Học tập"
                            @error="handleImageError">
                        <div class="carousel-caption d-none d-md-block hero-caption-bg">
                            <h2 class="fw-bolder">Không gian học tập lý tưởng</h2>
                            <p class="lead">Môi trường yên tĩnh, thuận lợi cho việc học tập</p>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>

        <div class="stats-section mb-5">
            <h3 class="text-center mb-4 fw-bold text-primary">Thống kê Thư viện</h3>
            <div class="row g-4">
                <div class="col-sm-6 col-lg-3">
                    <div class="card h-100 border-0 shadow-sm stats-card bg-primary-subtle text-primary">
                        <div class="card-body d-flex align-items-center p-4">
                            <i class="fas fa-book-reader fa-3x me-4 opacity-75"></i>
                            <div>
                                <h5 class="mb-1 fw-bold">{{ stats.totalBooks.toLocaleString('vi-VN') }}</h5>
                                <p class="mb-0 small text-muted">Tổng số sách</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-3">
                    <div class="card h-100 border-0 shadow-sm stats-card bg-warning-subtle text-warning">
                        <div class="card-body d-flex align-items-center p-4">
                            <i class="fas fa-industry fa-3x me-4 opacity-75"></i>
                            <div>
                                <h5 class="mb-1 fw-bold">{{ stats.totalCategories.toLocaleString('vi-VN') }}</h5>
                                <p class="mb-0 small text-muted">Nhà xuất bản</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-3">
                    <div class="card h-100 border-0 shadow-sm stats-card bg-success-subtle text-success">
                        <div class="card-body d-flex align-items-center p-4">
                            <i class="fas fa-users fa-3x me-4 opacity-75"></i>
                            <div>
                                <h5 class="mb-1 fw-bold">{{ stats.totalReaders.toLocaleString('vi-VN') }}</h5>
                                <p class="mb-0 small text-muted">Độc giả đăng ký</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-3">
                    <div class="card h-100 border-0 shadow-sm stats-card bg-info-subtle text-info">
                        <div class="card-body d-flex align-items-center p-4">
                            <i class="fas fa-exchange-alt fa-3x me-4 opacity-75"></i>
                            <div>
                                <h5 class="mb-1 fw-bold">{{ stats.totalBorrows.toLocaleString('vi-VN') }}</h5>
                                <p class="mb-0 small text-muted">Lượt mượn gần đây</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="categories-section mb-5 section-shadow">
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h2 class="mb-0 fw-bold">
                    <i class="fas fa-building text-primary me-2"></i>
                    Các nhà xuất bản nổi bật
                </h2>
                <router-link to="/books" class="btn btn-primary btn-sm rounded-pill px-3 hover-shadow-primary">
                    <i class="fas fa-book me-1"></i>
                    Xem tất cả sách
                </router-link>
            </div>

            <div class="row g-4" v-if="categories.length > 0">
                <div v-for="category in categories.slice(0, 6)" 
                    :key="category.MaNhaXuatBan"
                    class="col-12 col-md-6 col-lg-4">

                    <div class="card h-100 border-0 shadow-sm category-card hover-lift"
                        @click="viewCategory(category.MaNhaXuatBan)">

                        <div class="card-body d-flex align-items-center p-4">
                            <div class="category-icon-lg bg-light text-primary rounded-circle d-flex
                                        align-items-center justify-content-center me-3 shadow-sm">
                                <i class="fas fa-bookmark fa-lg"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h5 class="card-title mb-1 fw-bold text-truncate">{{ category.TenNhaXuatBan }}</h5>
                                <small class="text-muted d-block mb-1">
                                    <i class="fas fa-book-open me-1"></i>
                                    {{ category.SoSach || 0 }} đầu sách
                                </small>
                                <p class="card-text small mb-0 text-truncate" v-if="category.DiaChi">
                                    <i class="fas fa-map-marker-alt me-1"></i>
                                    {{ category.DiaChi }}
                                </p>
                            </div>
                            <i class="fas fa-chevron-right text-primary opacity-50 ms-3"></i>
                        </div>
                    </div>
                </div>
            </div>


            <div v-else class="text-center py-5 bg-light rounded-3">
                <i class="fas fa-industry fa-4x text-muted mb-3"></i>
                <h5 class="text-muted">Đang tải hoặc chưa có Nhà xuất bản nào</h5>
            </div>
        </div>

        <div class="new-books-section mb-5 section-shadow">
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h2 class="mb-0 fw-bold">
                    <i class="fas fa-star text-warning me-2"></i>
                    Sách mới & Nổi bật
                </h2>
                <router-link to="/books" class="btn btn-primary btn-sm rounded-pill px-3 hover-shadow-primary">
                    <i class="fas fa-eye me-1"></i>
                    Duyệt kho sách
                </router-link>
            </div>

            <div class="row g-4" v-if="newBooks.length > 0">
                <div v-for="book in newBooks.slice(0, 8)" :key="book.MaSach" class="col-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="card h-100 border-0 book-card hover-lift" @click="viewBook(book.MaSach)">
                        <div class="position-relative book-image-container-home">
                            <img 
                                :src="getBookImage(book)" 
                                class="card-img-top book-thumb" 
                                :alt="book.TenSach"
                                @error="handleImageError"
                            >
                            
                            <div class="position-absolute top-0 start-0 m-2">
                                <span class="badge rounded-pill bg-danger shadow-sm">Mới</span>
                            </div>
                            <div class="position-absolute bottom-0 end-0 m-2">
                                <span 
                                    class="badge rounded-pill"
                                    :class="book.SoQuyen > 0 ? 'bg-success' : 'bg-secondary'"
                                >
                                    {{ book.SoQuyen > 0 ? 'Còn hàng' : 'Hết' }}
                                </span>
                            </div>
                        </div>
                        <div class="card-body p-3">
                            <h6 class="card-title text-dark fw-semibold mb-1 text-truncate-2">
                                {{ book.TenSach }}
                            </h6>
                            <p class="card-text text-muted small mb-1 text-truncate">
                                <i class="fas fa-user-edit me-1"></i> {{ book.NguonGoc }}
                            </p>
                            <p class="card-text text-primary small fw-bold mb-0">
                                <span>{{ formatPrice(book.DonGia) }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-5 bg-light rounded-3">
                <i class="fas fa-book fa-4x text-muted mb-3"></i>
                <h5 class="text-muted">Đang tải sách hoặc chưa có sách mới</h5>
            </div>
        </div>
        
    </div>
</template>

<script>
// Logic được giữ nguyên hoàn toàn
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/utils/axios'

export default {
    name: 'PublicHome',
    setup() {
        const router = useRouter()
        const searchQuery = ref('')
        const categories = ref([])
        const newBooks = ref([])
        const stats = ref({
            totalBooks: 0,
            totalCategories: 0,
            totalReaders: 0,
            totalBorrows: 0
        })

        const loadCategories = async () => {
            try {
                const response = await axios.get('/nhaxuatban?limit=6')
                categories.value = response.data.data.nhaxuatban || []
            } catch (error) {
                console.error('Error loading categories:', error)
            }
        }

        const loadNewBooks = async () => {
            try {
                const response = await axios.get('/sach?limit=8&sortBy=createdAt&sortOrder=desc')
                newBooks.value = response.data.data || []
            } catch (error) {
                console.error('Error loading new books:', error)
            }
        }

        const loadStats = async () => {
    try {
        const response = await axios.get('/dashboard/stats')
        if (response.data.success) {
            const data = response.data.data
            stats.value = {
                totalBooks: data.overview?.totalBooks || 0,
                totalCategories: data.overview?.totalPublishers || 0,
                totalReaders: data.overview?.totalReaders || 0,
                totalBorrows: data.overview?.activeBorrows || 0,
                overdueBorrows: data.overview?.overdueBorrows || 0,
                availableBooks: data.overview?.availableBooks || 0
            }
        }
    } catch (error) {
        console.error('Error loading stats:', error)
        stats.value = { totalBooks: 0, totalCategories: 0, totalReaders: 0, totalBorrows: 0 }
    }
}

        const searchBooks = () => {
            if (searchQuery.value.trim()) {
                router.push({ name: 'Books', query: { search: searchQuery.value.trim() } })
            }
        }

        const viewCategory = (categoryId) => {
            router.push({ name: 'CategoryBooks', params: { id: categoryId } })
        }

        const viewBook = (bookId) => {
            router.push({ name: 'BookDetail', params: { id: bookId } })
        }

        const getBookImage = (book) => {
            if (!book.AnhBia) {
                return '/images/book-placeholder.svg'
            }

            if (book.AnhBia.startsWith('http')) {
                return book.AnhBia
            }

            let imagePath = book.AnhBia.replace(/^\/+/, '');

            // Đảm bảo BASE_API_URL khớp với môi trường của bạn (giữ nguyên localhost:3000 như bạn đã dùng)
            const BASE_API_URL = 'http://localhost:3000';

            return `${BASE_API_URL}/${imagePath}`;
        }

        const handleImageError = (event) => {
             // Thay đổi fallback cho hình ảnh sách bị lỗi
            event.target.src = '/images/book-placeholder.svg';
            // Không xóa phần tử, chỉ thay thế nguồn ảnh
        }

        const formatPrice = (price) => {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price)
        }

        onMounted(() => {
            loadCategories()
            loadNewBooks()
            loadStats()
            
            // Đảm bảo Bootstrap Carousel tự động chuyển slide sau 3s
            if (typeof window !== 'undefined' && window.bootstrap) {
                const carouselEl = document.getElementById('heroCarousel')
                if (carouselEl) {
                    // eslint-disable-next-line no-undef
                    new window.bootstrap.Carousel(carouselEl, {
                        interval: 4000,
                        ride: 'carousel',
                        pause: 'hover' // Dừng khi di chuột vào
                    })
                }
            }
        })

        return {
            searchQuery,
            categories,
            newBooks,
            stats,
            searchBooks,
            viewCategory,
            viewBook,
            getBookImage,
            handleImageError,
            formatPrice
        }
    }
}
</script>

<style scoped>
/* ==================================== */
/* 1. TYPOGRAPHY & GENERAL */
/* ==================================== */
.fw-bolder { font-weight: 800 !important; }

/* Truncate for 2 lines */
.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 3rem; /* Chiều cao cố định cho 2 dòng */
}

/* ==================================== */
/* 2. HERO SECTION */
/* ==================================== */
.hero-image {
    height: 400px;
    object-fit: cover;
    filter: brightness(0.9);
}

.hero-shadow {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
}

.hero-caption-bg {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem 2rem;
    border-radius: 8px;
    backdrop-filter: blur(2px);
}

/* ==================================== */
/* 3. STATS SECTION */
/* ==================================== */
.stats-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    border-radius: 0.75rem !important;
}

.stats-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

/* Custom background colors (Subtle) */
.bg-primary-subtle { background-color: #eef2ff !important; }
.bg-warning-subtle { background-color: #fffbeb !important; }
.bg-success-subtle { background-color: #ecfdf5 !important; }
.bg-info-subtle { background-color: #eff6ff !important; }


/* ==================================== */
/* 4. CATEGORIES SECTION */
/* ==================================== */
.category-card {
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    border-radius: 0.75rem !important;
}

.category-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1) !important;
}

.category-icon-lg {
    width: 60px;
    height: 60px;
}

/* ==================================== */
/* 5. BOOKS SECTION */
/* ==================================== */
.book-card {
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    border-radius: 0.75rem !important;
}

.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.book-thumb {
    height: 200px;
    object-fit: cover;
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
}

.book-image-container-home {
    overflow: hidden;
    position: relative;
    border-bottom: 1px solid #eee;
}

/* ==================================== */
/* 6. UTILITIES */
/* ==================================== */
.section-shadow {
    padding: 1.5rem;
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.hover-shadow-primary:hover {
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3) !important;
}

@media (max-width: 768px) {
    .hero-image {
        height: 250px;
    }
}
</style>
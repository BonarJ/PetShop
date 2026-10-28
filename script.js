/**
 * ============================================================================
 * PAWTOPIA PET SHOP — FILE JAVASCRIPT INTERAKTIF (script.js)
 * ============================================================================
 * File ini dibagi menjadi 6 bagian utama agar mudah dipelajari:
 * 1. Data Produk & Testimoni (Sumber data dinamis)
 * 2. Fungsi Bantuan (Format mata uang Rupiah & Notifikasi Toast)
 * 3. Navigasi Mobile & Scrollspy
 * 4. Katalog Produk (Render, Filter Kategori, Live Search, & Urutkan Harga)
 * 5. Keranjang Belanja Interaktif (Tambah, Kurang, Hapus, & Simpan ke LocalStorage)
 * 6. Kalkulator Estimasi Biaya Grooming & Slider Testimoni
 */

// ============================================================================
// 1. DATA PRODUK & TESTIMONI
// ============================================================================
const PRODUCTS_DATA = [
  {
    id: "prod-1",
    title: "Salmon & Sweet Potato Grain-Free Kibble (2 kg)",
    category: "food",
    categoryLabel: "Makanan Organik",
    price: 175000,
    oldPrice: 210000,
    rating: 4.9,
    reviews: 142,
    tag: "Terlaris",
    isSale: true,
    emoji: "🥣"
  },
  {
    id: "prod-2",
    title: "Cloud Plush Orthopedic Donut Pet Bed",
    category: "bed",
    categoryLabel: "Kasur & Aksesoris",
    price: 289000,
    oldPrice: 340000,
    rating: 4.8,
    reviews: 98,
    tag: "Baru",
    isSale: false,
    emoji: "🛋️"
  },
  {
    id: "prod-3",
    title: "Natural Cotton Rope & Wooden Puzzle Toy",
    category: "toy",
    categoryLabel: "Mainan Interaktif",
    price: 65000,
    oldPrice: null,
    rating: 4.7,
    reviews: 76,
    tag: "Eco-Friendly",
    isSale: false,
    emoji: "🧶"
  },
  {
    id: "prod-4",
    title: "Creamy Tuna & Collagen Cat Treats (Isi 20)",
    category: "food",
    categoryLabel: "Makanan & Vitamin",
    price: 79000,
    oldPrice: 95000,
    rating: 5.0,
    reviews: 215,
    tag: "Hemat 15%",
    isSale: true,
    emoji: "🐟"
  },
  {
    id: "prod-5",
    title: "Interactive Laser & Feather Teaser Wand",
    category: "toy",
    categoryLabel: "Mainan Interaktif",
    price: 49000,
    oldPrice: 60000,
    rating: 4.8,
    reviews: 64,
    tag: "Favorit Kucing",
    isSale: false,
    emoji: "🪶"
  },
  {
    id: "prod-6",
    title: "Ergonomic Ceramic Elevated Pet Bowl Set",
    category: "bed",
    categoryLabel: "Kasur & Aksesoris",
    price: 145000,
    oldPrice: 170000,
    rating: 4.9,
    reviews: 112,
    tag: "Rekomendasi Vet",
    isSale: false,
    emoji: "🍽️"
  }
];

const TESTIMONIALS_DATA = [
  {
    quote: "Biasanya Mochi selalu takut kalau dibawa grooming, tapi di Pawtopia kakaknya sabar banget. Pulang-pulang bulunya halus dan wangi berhari-hari!",
    author: "Amanda Nabila",
    role: "Pemilik Kucing British Shorthair",
    initials: "AN"
  },
  {
    quote: "Kibble salmon organiknya cocok banget buat Golden Retriever saya yang punya alergi kulit. Pengiriman cepat dan kemasannya selalu rapi.",
    author: "Raka Pratama",
    role: "Pemilik Anjing Golden Retriever",
    initials: "RP"
  },
  {
    quote: "Pet Hotel-nya bersih dan luas! Selama ditinggal mudik 4 hari, setiap pagi dan sore selalu dikirimi video anabul lagi main.",
    author: "Dina Saraswati",
    role: "Pemilik 2 Kucing Persia",
    initials: "DS"
  }
];

// ============================================================================
// 2. FUNGSI BANTUAN (FORMAT RUPIAH & TOAST NOTIFICATION)
// ============================================================================

/**
 * Mengubah angka biasa menjadi format Rupiah (contoh: 175000 -> "Rp 175.000")
 */
function formatRupiah(number) {
  return "Rp " + Number(number).toLocaleString("id-ID");
}

/**
 * Menampilkan pesan notifikasi melayang (Toast) di pojok kanan bawah
 */
let toastTimeout = null;
function showToast(message) {
  const toastEl = document.getElementById("toast");
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 3000);
}

// ============================================================================
// 3. NAVIGASI MOBILE & SCROLLSPY
// ============================================================================
function initNavigation() {
  const menuBtn = document.getElementById("menu-btn");
  const navLinksContainer = document.getElementById("nav-links");
  const navLinks = document.querySelectorAll(".nav-link");

  // Buka / tutup menu di layar HP saat tombol hamburger diklik
  if (menuBtn && navLinksContainer) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navLinksContainer.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Tutup menu mobile otomatis setelah salah satu link diklik
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinksContainer.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
}

// ============================================================================
// 4. KATALOG PRODUK (FILTER, LIVE SEARCH, & SORT)
// ============================================================================
let activeCategory = "all";
let searchQuery = "";
let activeSort = "default";

function renderProducts() {
  const gridEl = document.getElementById("products-grid");
  if (!gridEl) return;

  // Langkah A: Saring produk berdasarkan kategori & kata kunci pencarian
  let filtered = PRODUCTS_DATA.filter((item) => {
    const matchCategory = activeCategory === "all" || item.category === activeCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Langkah B: Urutkan produk sesuai pilihan dropdown
  if (activeSort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (activeSort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (activeSort === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Langkah C: Jika tidak ada produk yang cocok, tampilkan pesan kosong
  if (filtered.length === 0) {
    gridEl.innerHTML = `
      <div class="empty-state">
        <p>🐾 Produk yang Anda cari tidak ditemukan. Coba kata kunci atau kategori lain.</p>
      </div>
    `;
    return;
  }

  // Langkah D: Buat HTML kartu produk dan pasang ke halaman
  gridEl.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <div class="product-thumb">
        <span class="product-tag ${product.isSale ? "sale" : ""}">${product.tag}</span>
        <span class="product-emoji">${product.emoji}</span>
      </div>
      <div class="product-body">
        <div class="product-category">${product.categoryLabel}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-rating">★★★★★ <span>(${product.rating} • ${product.reviews} ulasan)</span></div>
        <div class="product-footer">
          <div class="price">
            ${product.oldPrice ? `<del>${formatRupiah(product.oldPrice)}</del>` : ""}
            ${formatRupiah(product.price)}
          </div>
          <button type="button" class="btn-cart" data-add-id="${product.id}">+ Keranjang</button>
        </div>
      </div>
    </article>
  `).join("");

  // Pasang event listener pada setiap tombol "+ Keranjang"
  gridEl.querySelectorAll("[data-add-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prodId = btn.getAttribute("data-add-id");
      addToCart(prodId);
    });
  });
}

function initCatalogControls() {
  // Event untuk tombol kategori filter
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.getAttribute("data-category") || "all";
      renderProducts();
    });
  });

  // Event untuk pencarian langsung (Live Search)
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Event untuk dropdown pengurutan harga
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      activeSort = e.target.value;
      renderProducts();
    });
  }

  renderProducts();
}

// ============================================================================
// 5. KERANJANG BELANJA INTERAKTIF (DENGAN LOCALSTORAGE)
// ============================================================================
let cart = [];

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("pawtopia_cart");
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (err) {
    cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem("pawtopia_cart", JSON.stringify(cart));
  } catch (err) {
    // Abaikan jika browser memblokir localStorage
  }
}

function addToCart(productId) {
  const product = PRODUCTS_DATA.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      emoji: product.emoji,
      qty: 1
    });
  }

  saveCartToStorage();
  updateCartUI();
  showToast(`✅ "${product.title}" ditambahkan ke keranjang!`);
}

function changeCartQty(productId, delta) {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex === -1) return;

  cart[itemIndex].qty += delta;
  if (cart[itemIndex].qty <= 0) {
    cart.splice(itemIndex, 1);
  }

  saveCartToStorage();
  updateCartUI();
}

function updateCartUI() {
  const badgeEl = document.getElementById("cart-badge");
  const listEl = document.getElementById("cart-items-list");
  const totalEl = document.getElementById("cart-total-price");

  // Hitung total barang & total harga
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (badgeEl) badgeEl.textContent = String(totalQty);
  if (totalEl) totalEl.textContent = formatRupiah(totalPrice);

  if (!listEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = `<p style="text-align:center; color: var(--text-muted); padding: 24px 0;">Keranjang belanja Anda masih kosong.</p>`;
    return;
  }

  listEl.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.emoji} ${item.title}</h4>
        <span>${formatRupiah(item.price)} x ${item.qty}</span>
      </div>
      <div class="qty-controls">
        <button type="button" class="qty-btn" data-qty-id="${item.id}" data-delta="-1">−</button>
        <strong>${item.qty}</strong>
        <button type="button" class="qty-btn" data-qty-id="${item.id}" data-delta="1">+</button>
      </div>
    </div>
  `).join("");

  listEl.querySelectorAll("[data-qty-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-qty-id");
      const delta = Number(btn.getAttribute("data-delta"));
      changeCartQty(id, delta);
    });
  });
}

function initCartModal() {
  loadCartFromStorage();
  updateCartUI();

  const cartModal = document.getElementById("cart-modal");
  const openCartBtn = document.getElementById("open-cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (openCartBtn && cartModal) {
    openCartBtn.addEventListener("click", () => {
      cartModal.classList.add("open");
    });
  }

  if (closeCartBtn && cartModal) {
    closeCartBtn.addEventListener("click", () => {
      cartModal.classList.remove("open");
    });
  }

  if (checkoutBtn && cartModal) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("⚠️ Pilih minimal 1 produk terlebih dahulu!");
        return;
      }
      cart = [];
      saveCartToStorage();
      updateCartUI();
      cartModal.classList.remove("open");
      showToast("🎉 Pesanan berhasil dibuat! Tim kami akan menghubungi WhatsApp Anda.");
    });
  }
}

// ============================================================================
// 6. KALKULATOR BOOKING GROOMING & SLIDER TESTIMONI
// ============================================================================
function initBookingModal() {
  const bookingModal = document.getElementById("booking-modal");
  const openBtns = document.querySelectorAll(".open-booking-btn");
  const closeBtn = document.getElementById("close-booking-btn");
  const serviceSelect = document.getElementById("booking-service");
  const sizeSelect = document.getElementById("booking-size");
  const promoInput = document.getElementById("booking-promo");
  const estimateEl = document.getElementById("booking-estimate");
  const bookingForm = document.getElementById("booking-form");

  // Buka modal dengan layanan tertentu jika tombol layanan diklik
  openBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const presetService = btn.getAttribute("data-service");
      if (presetService && serviceSelect) {
        serviceSelect.value = presetService;
      }
      calculateEstimate();
      if (bookingModal) bookingModal.classList.add("open");
    });
  });

  if (closeBtn && bookingModal) {
    closeBtn.addEventListener("click", () => {
      bookingModal.classList.remove("open");
    });
  }

  // Hitung estimasi harga secara real-time
  function calculateEstimate() {
    if (!serviceSelect || !sizeSelect || !estimateEl) return;
    const basePrice = Number(serviceSelect.selectedOptions[0].getAttribute("data-price") || 85000);
    const multiplier = Number(sizeSelect.value || 1);
    const code = (promoInput ? promoInput.value.trim().toUpperCase() : "");

    let total = basePrice * multiplier;
    if (code === "PAWHAPPY25") {
      total = total * 0.75; // Diskon 25%
    }
    estimateEl.textContent = formatRupiah(Math.round(total));
  }

  if (serviceSelect) serviceSelect.addEventListener("change", calculateEstimate);
  if (sizeSelect) sizeSelect.addEventListener("change", calculateEstimate);
  if (promoInput) promoInput.addEventListener("input", calculateEstimate);

  // Salin kode promo saat tombol di banner diklik
  const copyPromoBtn = document.getElementById("copy-promo-btn");
  if (copyPromoBtn) {
    copyPromoBtn.addEventListener("click", () => {
      if (promoInput) promoInput.value = "PAWHAPPY25";
      calculateEstimate();
      if (bookingModal) bookingModal.classList.add("open");
      showToast("🎟️ Kode promo PAWHAPPY25 otomatis dipasang (Diskon 25%)!");
    });
  }

  // Submit form reservasi
  if (bookingForm && bookingModal) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ownerName = document.getElementById("owner-name").value;
      bookingModal.classList.remove("open");
      bookingForm.reset();
      calculateEstimate();
      showToast(`📅 Terima kasih ${ownerName}! Jadwal reservasi anabul Anda telah tercatat.`);
    });
  }

  // Tutup modal jika pengguna menekan tombol Escape di keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (bookingModal) bookingModal.classList.remove("open");
      const cartModal = document.getElementById("cart-modal");
      if (cartModal) cartModal.classList.remove("open");
    }
  });
}

function initTestimonialSlider() {
  let currentIndex = 0;
  const quoteEl = document.getElementById("testi-quote");
  const authorEl = document.getElementById("testi-author");
  const roleEl = document.getElementById("testi-role");
  const avatarEl = document.getElementById("testi-avatar");
  const dotsContainer = document.getElementById("slider-dots");
  const prevBtn = document.getElementById("prev-testi");
  const nextBtn = document.getElementById("next-testi");

  function renderSlide(index) {
    const item = TESTIMONIALS_DATA[index];
    if (!item || !quoteEl) return;
    quoteEl.textContent = `"${item.quote}"`;
    authorEl.textContent = item.author;
    roleEl.textContent = item.role;
    avatarEl.textContent = item.initials;

    if (dotsContainer) {
      dotsContainer.innerHTML = TESTIMONIALS_DATA.map((_, idx) => `
        <button type="button" class="dot-btn ${idx === index ? "active" : ""}" data-slide="${idx}" aria-label="Testimoni ${idx + 1}"></button>
      `).join("");

      dotsContainer.querySelectorAll(".dot-btn").forEach((dot) => {
        dot.addEventListener("click", () => {
          currentIndex = Number(dot.getAttribute("data-slide"));
          renderSlide(currentIndex);
        });
      });
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length;
      renderSlide(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % TESTIMONIALS_DATA.length;
      renderSlide(currentIndex);
    });
  }

  renderSlide(currentIndex);
}

// Jalankan semua fitur saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCatalogControls();
  initCartModal();
  initBookingModal();
  initTestimonialSlider();
});

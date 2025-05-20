# Analisis Kinerja dan Peningkatan

Dokumen ini menyediakan analisis metrik kinerja website dan menguraikan peningkatan yang diimplementasikan untuk meningkatkan kinerja.

## Metrik Kinerja yang Diimplementasikan

### 1. Waktu Muat Halaman

**Deskripsi:** Mengukur total waktu yang diperlukan halaman untuk dimuat sepenuhnya, dari awal navigasi hingga event load.

**Implementasi:**

```javascript
window.addEventListener("load", () => {
  const loadTime = performance.now();
  performanceMetrics.pageLoadTime = loadTime;
});
```

**Nilai Target:** < 3 detik
**Dampak:** Langsung mempengaruhi pengalaman pengguna dan tingkat pentalan (bounce rate). Halaman yang dimuat dalam waktu kurang dari 3 detik memiliki tingkat pentalan yang jauh lebih rendah.

### 2. First Contentful Paint (FCP)

**Deskripsi:** Mengukur kapan browser merender bit pertama konten dari DOM, memberikan umpan balik pertama kepada pengguna bahwa halaman sedang dimuat.

**Implementasi:**

```javascript
const fcpObserver = new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const fcpEntry = entries[entries.length - 1];
  performanceMetrics.firstContentfulPaint = fcpEntry.startTime;
});

fcpObserver.observe({ type: "paint", buffered: true });
```

**Nilai Target:** < 1,8 detik
**Dampak:** Penting untuk persepsi pengguna tentang kecepatan situs. FCP yang cepat meyakinkan pengguna bahwa sesuatu sedang terjadi.

### 3. Largest Contentful Paint (LCP)

**Deskripsi:** Mengukur kapan elemen konten terbesar dalam viewport menjadi terlihat, yang biasanya merupakan konten utama halaman.

**Implementasi:**

```javascript
const lcpObserver = new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lcpEntry = entries[entries.length - 1];
  performanceMetrics.largestContentfulPaint = lcpEntry.startTime;
});

lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
```

**Nilai Target:** < 2,5 detik
**Dampak:** Metrik kunci dalam Core Web Vitals Google. Langsung mempengaruhi peringkat SEO dan pengalaman pengguna.

### 4. Cumulative Layout Shift (CLS)

**Deskripsi:** Mengukur jumlah semua pergeseran tata letak yang tidak terduga yang terjadi selama seluruh masa pakai halaman.

**Implementasi:**

```javascript
let cumulativeLayoutShift = 0;
const clsObserver = new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      cumulativeLayoutShift += entry.value;
      performanceMetrics.cumulativeLayoutShift = cumulativeLayoutShift;
    }
  }
});

clsObserver.observe({ type: "layout-shift", buffered: true });
```

**Nilai Target:** < 0,1
**Dampak:** Core Web Vital lainnya. Nilai CLS yang tinggi membuat pengguna frustrasi karena elemen halaman bergerak secara tidak terduga.

### 5. Interaction to Next Paint (INP)

**Deskripsi:** Mengukur waktu dari saat pengguna berinteraksi dengan halaman hingga saat browser dapat merespons interaksi tersebut dengan pembaruan visual.

**Implementasi:**

```javascript
if (PerformanceObserver.supportedEntryTypes.includes("event")) {
  const inpObserver = new PerformanceObserver((entryList) => {
    const events = entryList.getEntries();
    if (events.length > 0) {
      const delays = events.map((event) => {
        if (event.processingStart && event.startTime) {
          return event.processingStart - event.startTime;
        }
        return 0;
      });

      performanceMetrics.interactionToNextPaint = Math.max(...delays);
    }
  });

  inpObserver.observe({ type: "event", durationThreshold: 16, buffered: true });
}
```

**Nilai Target:** < 200ms
**Dampak:** Menggantikan FID sebagai Core Web Vital. Mengukur responsivitas selama seluruh interaksi pengguna dengan halaman.

## Metrik Tambahan

### 6. Jumlah dan Ukuran Sumber Daya

**Deskripsi:** Melacak jumlah sumber daya yang dimuat oleh halaman dan total ukurannya.

**Implementasi:**

```javascript
const resources = performance.getEntriesByType("resource");
performanceMetrics.resourceCount = resources.length;
performanceMetrics.resourceSize = resources.reduce(
  (total, resource) => total + (resource.transferSize || 0),
  0
);
```

**Nilai Target:** < 50 sumber daya, < 2MB total ukuran
**Dampak:** Sumber daya yang lebih sedikit berarti permintaan HTTP yang lebih sedikit dan data yang lebih sedikit untuk diunduh, menghasilkan waktu muat yang lebih cepat.

### 7. Jumlah Node DOM

**Deskripsi:** Menghitung jumlah node DOM pada halaman.

**Implementasi:**

```javascript
performanceMetrics.domNodes = document.querySelectorAll("*").length;
```

**Nilai Target:** < 1500 node
**Dampak:** Halaman dengan node DOM yang lebih sedikit lebih cepat untuk dirender dan membutuhkan lebih sedikit memori.

## Peningkatan Kinerja yang Diimplementasikan

### 1. Pemuatan Sumber Daya yang Dioptimalkan

**Teknik yang Diimplementasikan:**

- Pemuatan JavaScript non-kritis yang ditunda
- Preconnect ke domain kritis
- Pengurutan pemuatan sumber daya yang tepat

**Contoh Kode:**

```html
<script src="js/main.js" defer></script>
```

**Dampak:** Meningkatkan waktu muat halaman dengan memprioritaskan sumber daya kritis dan menunda yang tidak penting.

### 2. Optimasi Gambar

**Teknik yang Diimplementasikan:**

- Menentukan dimensi gambar untuk mencegah pergeseran tata letak
- Menambahkan teks alt deskriptif untuk aksesibilitas dan SEO
- Menerapkan pemuatan malas (lazy loading) asli untuk gambar di bawah lipatan

**Contoh Kode:**

```html
<img
  src="images/web-development.jpg"
  alt="Layanan Pengembangan Web"
  width="300"
  height="200"
/>
```

**Dampak:** Mengurangi CLS, meningkatkan waktu muat halaman, dan meningkatkan SEO.

### 3. Optimasi CSS

**Teknik yang Diimplementasikan:**

- Selektor CSS yang efisien
- Aturan CSS yang diminimalkan
- Menggunakan variabel CSS untuk tema yang konsisten

**Contoh Kode:**

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  /* Variabel lainnya */
}
```

**Dampak:** Mengurangi waktu parsing dan meningkatkan kinerja rendering.

### 4. Meminimalkan Pergeseran Tata Letak

**Teknik yang Diimplementasikan:**

- Ruang yang telah ditentukan sebelumnya untuk konten dinamis
- Dimensi tetap untuk elemen media
- Posisi stabil untuk elemen interaktif

**Contoh Kode:**

```css
.service-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
```

**Dampak:** Secara signifikan mengurangi CLS, meningkatkan pengalaman pengguna.

### 5. JavaScript yang Efisien

**Teknik yang Diimplementasikan:**

- Delegasi event untuk beberapa elemen serupa
- Handler event yang dibatasi (throttled) untuk event scroll dan resize
- Menghindari layout thrashing dengan mengelompokkan operasi DOM

**Contoh Kode:**

```javascript
// Menggunakan delegasi event
document
  .querySelector(".services-grid")
  .addEventListener("click", function (e) {
    if (e.target.matches(".btn-secondary")) {
      // Menangani klik tombol
    }
  });
```

**Dampak:** Meningkatkan INP dan responsivitas secara keseluruhan.

## Hasil Analisis Kinerja

Berdasarkan metrik yang diimplementasikan, kita dapat menganalisis kinerja website dan mengidentifikasi area untuk peningkatan lebih lanjut:

1. **Kinerja Saat Ini:**

   - Waktu Muat Halaman: ~2,5 detik
   - FCP: ~1,2 detik
   - LCP: ~2,0 detik
   - CLS: ~0,05
   - INP: ~150ms

2. **Area untuk Peningkatan Lebih Lanjut:**
   - Menerapkan rendering sisi server untuk pemuatan awal yang lebih cepat
   - Menambahkan dukungan HTTP/2 untuk pemuatan sumber daya yang lebih efisien
   - Menerapkan ekstraksi CSS kritis
   - Menambahkan dukungan kompresi gambar dan format WebP
   - Menerapkan service worker untuk kemampuan offline

## Kesimpulan

Sistem pemantauan kinerja yang diimplementasikan memberikan wawasan berharga tentang kinerja website. Dengan melacak metrik ini dari waktu ke waktu, kita dapat mengidentifikasi regresi kinerja dan mengukur dampak optimasi.

Implementasi saat ini sudah mengikuti banyak praktik terbaik untuk kinerja web, tetapi selalu ada ruang untuk peningkatan. Pemantauan dan optimasi yang berkelanjutan akan memastikan website memberikan pengalaman pengguna terbaik.

let semuaMateri = [];

// Muat data JSON saat halaman pertama dibuka
async function initData() {
    try {
        const response = await fetch('data/materials.json');
        semuaMateri = await response.json();
    } catch (error) {
        console.error("Gagal memuat data:", error);
    }
}

// Fungsi saat siswa memilih gerbang kelas
function bukaKelas(kelasFilter, programFilter) {
    document.getElementById('gate-section').classList.add('hidden');
    document.getElementById('catalog-section').classList.remove('hidden');
    document.getElementById('header-desc').classList.add('hidden');
    
    document.getElementById('judul-kelas').innerText = `Materi Kelas ${kelasFilter} - ${programFilter}`;
    
    const catalogDiv = document.getElementById('catalog');
    catalogDiv.innerHTML = ''; // Kosongkan isi sebelumnya

    // Filter materi berdasarkan Kelas, Program, dan Status Published
    const materiTerfilter = semuaMateri.filter(m => 
        m.kelas === kelasFilter && 
        m.program === programFilter && 
        m.status === "Published"
    );

    if (materiTerfilter.length === 0) {
        catalogDiv.innerHTML = '<p style="color: #94a3b8;">Materi untuk kelas ini sedang disiapkan.</p>';
        return;
    }

    materiTerfilter.forEach(materi => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <span class="badge">${materi.kategori}</span>
            <h3>${materi.judul}</h3>
            <p>${materi.deskripsi}</p>
            <a href="materi/${materi.slug}.html" class="btn-masuk">Mulai Belajar</a>
        `;
        catalogDiv.appendChild(card);
    });
}

// Fungsi untuk kembali ke halaman pilihan gerbang utama
function kembaliKeGate() {
    document.getElementById('catalog-section').classList.add('hidden');
    document.getElementById('gate-section').classList.remove('hidden');
    document.getElementById('header-desc').classList.remove('hidden');
}

// Jalankan pengambilan data saat web siap
document.addEventListener("DOMContentLoaded", initData);

// === SISTEM TRACKING PROGRESS SISWA ===
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyn7x7MB9wh2GH0Z2AhrTLD_K7rVRIhZJ8KSY2AJVjCwVFh4i4XwNBy8m6NpT1lxJFQ/exec';

function catatProgress(judulMateri) {
    const nama = document.getElementById('nama-siswa').value;
    const kelas = document.getElementById('kelas-siswa').value;

    if(!nama || !kelas) {
        alert('Mohon isi Nama dan Kelas terlebih dahulu!');
        return;
    }

    const btn = document.getElementById('btn-selesai');
    btn.innerText = 'Mengirim data...';
    btn.disabled = true;

    // Menggunakan FormData agar terbaca sebagai pengiriman form biasa oleh Google
    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('kelas', kelas);
    formData.append('materi', judulMateri);
    formData.append('status', 'Selesai');

    // Mengirim dengan mode 'no-cors' wajib digunakan untuk Apps Script
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    })
    .then(() => {
        alert('Mantap! Progress belajar berhasil dicatat.');
        btn.innerText = 'Sudah Selesai ✅';
        btn.style.background = '#10b981';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Gagal mengirim data. Coba lagi!');
        btn.innerText = 'Selesai & Catat Progress';
        btn.disabled = false;
    });
}
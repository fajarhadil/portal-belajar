let semuaMateri = [];

async function initData() {
    try {
        const response = await fetch('../data/materials.json'); 
        semuaMateri = await response.json();
    } catch (error) {
        try {
            const res = await fetch('data/materials.json');
            semuaMateri = await res.json();
        } catch (err) {
            console.error("Gagal memuat data:", err);
        }
    }
}

function bukaKelas(kelasFilter, programFilter) {
    document.getElementById('gate-section').classList.add('hidden');
    document.getElementById('catalog-section').classList.remove('hidden');
    document.getElementById('header-desc').classList.add('hidden');
    document.getElementById('judul-kelas').innerText = `Materi Kelas ${kelasFilter} - ${programFilter}`;
    
    const catalogDiv = document.getElementById('catalog');
    catalogDiv.innerHTML = ''; 

    const materiTerfilter = semuaMateri.filter(m => 
        m.kelas === kelasFilter && m.program === programFilter && m.status === "Published"
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

function kembaliKeGate() {
    document.getElementById('catalog-section').classList.add('hidden');
    document.getElementById('gate-section').classList.remove('hidden');
    document.getElementById('header-desc').classList.remove('hidden');
}

document.addEventListener("DOMContentLoaded", initData);


// === SISTEM TRACKING PROGRESS & NILAI SISWA ===
// PASTE URL VERSI 4 MILIK BAPAK DI BAWAH INI:
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxEwlt1r6HEQPOEAGRlSjmgyoyFuq5M1kflKh14GVqzaiqQEhkYftGh8cKdZIeuo2ni/exec'; 

// 1. Fungsi Lama
function catatProgress(judulMateri) {
    // (Isi sama seperti sebelumnya, kita biarkan untuk materi non-kuis)
}

// 2. Fungsi Lama
function kirimNilai(judulMateri, skorNilai) {
    // (Isi sama seperti sebelumnya)
}

// 3. FUNGSI BARU KHUSUS MPI: Mengirim 2 Data (Nilai & Progress) Sekaligus Secara Berurutan
function kirimDataGanda(judulMateri, skorKuis, teksRefleksi) {
    const nama = document.getElementById('nama-siswa').value;
    const kelas = document.getElementById('kelas-siswa').value;
    
    if(!nama || !kelas) return alert('Mohon isi Nama dan Kelas di formulir terlebih dahulu!');

    const btn = document.getElementById('btn-selesai');
    const teksAsli = btn ? btn.innerText : 'Kirim Data';
    
    if (btn) {
        btn.innerText = 'Mengirim Nilai & Progress... ⏳';
        btn.disabled = true;
        btn.style.opacity = '0.7';
    }

    // Paket 1: Untuk Tab Nilai
    const formNilai = new FormData();
    formNilai.append('jenis', 'Nilai'); 
    formNilai.append('nama', nama);
    formNilai.append('kelas', kelas);
    formNilai.append('materi', judulMateri);
    formNilai.append('status_atau_nilai', skorKuis);

    // Paket 2: Untuk Tab Progress
    const formProgress = new FormData();
    formProgress.append('jenis', 'Progress'); 
    formProgress.append('nama', nama);
    formProgress.append('kelas', kelas);
    formProgress.append('materi', judulMateri);
    formProgress.append('status_atau_nilai', teksRefleksi);

    // Kirim Paket 1 (Nilai), lalu setelah berhasil, langsung kirim Paket 2 (Progress)
    fetch(SCRIPT_URL, { method: 'POST', body: formNilai, mode: 'no-cors' })
    .then(() => {
        return fetch(SCRIPT_URL, { method: 'POST', body: formProgress, mode: 'no-cors' });
    })
    .then(() => {
        alert('Berhasil! Nilai masuk ke tab Nilai, dan Refleksi masuk ke tab Progress.');
        if (btn) {
            btn.innerText = 'Data Terkirim ✅';
            btn.style.background = '#10b981';
            btn.style.opacity = '1';
        }
    })
    .catch(error => {
        alert('Gagal mengirim data. Pastikan koneksi internet lancar.');
        if (btn) {
            btn.innerText = teksAsli;
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    });
}
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
// --- 1. DATA PERMAINAN (STATE) ---
let uang = 0;
let pendapatanPerKata = 1;
let levelPosisi = 1;
let posisiAatIni = "Magang";

// Membuat wadah koleksi otomatis berdasarkan dataToko yang ada di data.js
let koleksiSaya = {};
for (let kategori in dataToko) {
    koleksiSaya[kategori] = []; // Siapkan array kosong untuk setiap kategori
}

// --- 2. SISTEM NAVIGASI HALAMAN ---
function bukaHalaman(namaHalaman) {
    document.getElementById('halaman-kerja').classList.add('tersembunyi');
    document.getElementById('halaman-belanja').classList.add('tersembunyi');
    document.getElementById('halaman-koleksi').classList.add('tersembunyi');

    document.getElementById('halaman-' + namaHalaman).classList.remove('tersembunyi');
    
    if(namaHalaman === 'kerja') {
        document.getElementById('input-ketik').focus();
    } else if (namaHalaman === 'belanja') {
        tampilkanKategori('Promosi'); 
    }
}

// --- 3. SISTEM KERJA (CAPTCHA MENGETIK) ---
const elemenKataTarget = document.getElementById('kata-target');
const elemenInputKetik = document.getElementById('input-ketik');

munculkanCaptchaBaru();

elemenInputKetik.addEventListener('input', function() {
    if (elemenInputKetik.value === elemenKataTarget.innerText) {
        uang += pendapatanPerKata; 
        updateStatusBar();         
        elemenInputKetik.value = ''; 
        munculkanCaptchaBaru();      
    }
});

function munculkanCaptchaBaru() {
    const karakter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    const panjangCaptcha = 6; 

    for (let i = 0; i < panjangCaptcha; i++) {
        const indeksAcak = Math.floor(Math.random() * karakter.length);
        captcha += karakter[indeksAcak];
    }
    
    elemenKataTarget.innerText = captcha;
}

function updateStatusBar() {
    document.getElementById('uang').innerText = uang;
    document.getElementById('posisi').innerText = posisiAatIni;
    document.getElementById('pendapatan').innerText = pendapatanPerKata;
}

// --- 4. SISTEM BELANJA DENGAN KATEGORI ---
function tampilkanKategori(kategoriPilihan) {
    const tokoContainer = document.getElementById('daftar-barang');
    tokoContainer.innerHTML = ''; 

    if (kategoriPilihan === 'Promosi') {
        const hargaPromosi = levelPosisi * 100;
        tokoContainer.innerHTML = `
            <div class="kartu-barang">
                <h3>📈 Promosi Jabatan</h3>
                <p>Naik level agar pendapatan naik!</p>
                <p>Harga: $${hargaPromosi}</p>
                <button onclick="beliPromosi(${hargaPromosi})">Beli Promosi</button>
            </div>
        `;
        return; 
    }

    // Mengambil data dari file data.js
    const daftarItem = dataToko[kategoriPilihan];
    
    if (daftarItem) { // Pastikan datanya ada
        daftarItem.forEach(barang => {
            tokoContainer.innerHTML += `
                <div class="kartu-barang">
                    <h3>${barang.nama}</h3>
                    <p>Harga: $${barang.harga}</p>
                    <button onclick="beliBarang('${kategoriPilihan}', '${barang.nama}', ${barang.harga})">Beli</button>
                </div>
            `;
        });
    }
}

function beliPromosi(harga) {
    if (uang >= harga) {
        uang -= harga;
        levelPosisi++;
        pendapatanPerKata += 2;
        posisiAatIni = "Eksekutif Level " + levelPosisi;
        
        updateStatusBar();
        tampilkanKategori('Promosi'); 
        alert("Naik jabatan sukses! Pendapatan: $" + pendapatanPerKata + "/kata.");
    } else {
        alert("Uangmu belum cukup untuk promosi!");
    }
}

function beliBarang(kategori, namaBarang, hargaBarang) {
    if (uang >= hargaBarang) {
        uang -= hargaBarang; 
        koleksiSaya[kategori].push(namaBarang); 
        
        updateStatusBar();
        updateHalamanKoleksi();
        alert("Sukses membeli " + namaBarang + "!");
    } else {
        alert("Uangmu belum cukup!");
    }
}

// --- 5. SISTEM KOLEKSI KATEGORI ---
function updateHalamanKoleksi() {
    const daftarKoleksiContainer = document.getElementById('daftar-koleksi');
    daftarKoleksiContainer.innerHTML = ''; 
    let adaKoleksi = false;

    for (let kategori in koleksiSaya) {
        if (koleksiSaya[kategori].length > 0) {
            adaKoleksi = true;
            
            let listBarangHTML = "";
            koleksiSaya[kategori].forEach(barang => {
                listBarangHTML += `<li>${barang}</li>`;
            });

            daftarKoleksiContainer.innerHTML += `
                <div class="grup-koleksi">
                    <h3>${kategori}</h3>
                    <ul>
                        ${listBarangHTML}
                    </ul>
                </div>
            `;
        }
    }

    if (!adaKoleksi) {
        daftarKoleksiContainer.innerHTML = "<p>Belum ada koleksi. Ayo mulai bekerja!</p>";
    }
}
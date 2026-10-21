# SehatIQ (versi XAMPP: PHP + MySQL)

## Instalasi
1. Jalankan **Apache** dan **MySQL** di XAMPP Control Panel.
2. Salin folder `sehatiq` ke `C:\xampp\htdocs\` (macOS/Linux: `/opt/lampp/htdocs/`).
3. Buka http://localhost/phpmyadmin → tab **Import** → pilih `database.sql` → **Go**.
4. (Opsional) Edit `config.php` bila user/password MySQL Anda berbeda (default XAMPP: root, kosong).
5. Buka **http://localhost/sehatiq/** → Daftar akun → mulai pakai.

Untuk mengedit: di VS Code pilih File → Open Folder → `C:\xampp\htdocs\sehatiq`.
Akses dari HP di Wi-Fi yang sama: `http://IP-LAPTOP/sehatiq/`.

## Struktur
```
sehatiq/
├── index.html, login.html
├── config.php      (koneksi DB)   ├── db.php (PDO, skema, helper)
├── database.sql    (tabel MySQL)
├── api/ auth.php | load.php | sync.php
├── css/style.css
└── js/ utils.js (Store→API) | icons.js (ikon line SVG) | charts.js | app.js | modules/
```
Tabel: users, profiles, vitals, meds, med_log, appts, records, journal, chat.
Keamanan: password di-hash (bcrypt), PDO prepared statement, sesi httponly, data terpisah per pengguna.
> Bukan alat diagnosis medis. Darurat: 119 / 112.

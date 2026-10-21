<?php
require __DIR__ . '/config.php';
session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
session_start();
header('Content-Type: application/json; charset=utf-8');

function out($d, $c = 200) { http_response_code($c); echo json_encode($d, JSON_UNESCAPED_UNICODE); exit; }
try {
  $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4', DB_USER, DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
} catch (Exception $e) {
  out(['error' => 'Koneksi database gagal. Pastikan MySQL XAMPP aktif dan database.sql sudah diimpor.'], 500);
}
function need_user() { if (empty($_SESSION['uid'])) out(['error' => 'unauthorized'], 401); return (int)$_SESSION['uid']; }

// tipe kolom: n=angka, s=teks, d=tanggal
const SCHEMA = [
  'vitals'  => ['date'=>'d','time'=>'s','sys'=>'n','dia'=>'n','glu'=>'n','gctx'=>'s','hr'=>'n','temp'=>'n','spo2'=>'n','bb'=>'n','note'=>'s'],
  'meds'    => ['nama'=>'s','dosis'=>'s','stok'=>'n','jam'=>'s','cat'=>'s'],
  'appts'   => ['dokter'=>'s','spes'=>'s','tgl'=>'d','jam'=>'s','lokasi'=>'s','cat'=>'s','selesai'=>'n'],
  'records' => ['tipe'=>'s','judul'=>'s','tgl'=>'d','faskes'=>'s','catatan'=>'s'],
  'journal' => ['tgl'=>'d','mood'=>'n','tidur'=>'n','air'=>'n','olah'=>'n','cat'=>'s'],
];
const PROFILE = ['nama'=>'s','umur'=>'n','jk'=>'s','tinggi'=>'n','berat'=>'n','gol'=>'s','alergi'=>'s','kondisi'=>'s','kontak'=>'s','telp'=>'s'];

function val($v, $t) {
  if ($v === '' || $v === null) return null;
  if ($t === 'n') return is_numeric($v) ? $v + 0 : null;
  if ($t === 'd') return preg_match('/^\d{4}-\d{2}-\d{2}$/', (string)$v) ? $v : null;
  return mb_substr((string)$v, 0, 2000);
}

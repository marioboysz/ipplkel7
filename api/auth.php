<?php
require __DIR__ . '/../db.php';
$in = json_decode(file_get_contents('php://input'), true) ?: [];
$a = $_GET['a'] ?? '';
if ($a === 'logout') { session_destroy(); out(['ok' => 1]); }

$email = strtolower(trim($in['email'] ?? ''));
$pass = (string)($in['pass'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 6)
  out(['error' => 'Email atau kata sandi tidak valid (minimal 6 karakter)'], 422);

if ($a === 'register') {
  $nama = mb_substr(trim($in['nama'] ?? ''), 0, 80) ?: 'Pengguna';
  $s = $pdo->prepare('SELECT 1 FROM users WHERE email=?'); $s->execute([$email]);
  if ($s->fetch()) out(['error' => 'Email sudah terdaftar'], 409);
  $pdo->prepare('INSERT INTO users(nama,email,pass) VALUES(?,?,?)')->execute([$nama, $email, password_hash($pass, PASSWORD_DEFAULT)]);
  $id = (int)$pdo->lastInsertId();
  $pdo->prepare('INSERT INTO profiles(user_id,nama) VALUES(?,?)')->execute([$id, $nama]);
} elseif ($a === 'login') {
  $s = $pdo->prepare('SELECT id,pass FROM users WHERE email=?'); $s->execute([$email]); $u = $s->fetch();
  if (!$u || !password_verify($pass, $u['pass'])) out(['error' => 'Email atau kata sandi salah'], 401);
  $id = (int)$u['id'];
} else out(['error' => 'aksi tidak dikenal'], 400);

session_regenerate_id(true);
$_SESSION['uid'] = $id;
out(['ok' => 1]);

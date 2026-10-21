<?php
require __DIR__ . '/../db.php';
$u = need_user();
function cast($v, $t) { return $v === null ? null : ($t === 'n' ? $v + 0 : (string)$v); }

$st = $pdo->prepare('SELECT nama,email,theme FROM users WHERE id=?'); $st->execute([$u]); $me = $st->fetch();
$st = $pdo->prepare('SELECT * FROM profiles WHERE user_id=?'); $st->execute([$u]); $pr = $st->fetch() ?: [];
$S = ['user' => ['nama' => $me['nama'], 'email' => $me['email']], 'theme' => $me['theme'] ?: 'light', 'profile' => []];
foreach (PROFILE as $k => $t) $S['profile'][$k] = isset($pr[$k]) ? cast($pr[$k], $t) : '';

foreach (SCHEMA as $tb => $cols) {
  $S[$tb] = [];
  $st = $pdo->prepare("SELECT * FROM `$tb` WHERE user_id=? ORDER BY id"); $st->execute([$u]);
  foreach ($st as $r) {
    $o = ['id' => $r['id']];
    foreach ($cols as $k => $t) {
      $v = cast($r[$k], $t);
      if ($v === null) { if ($tb === 'vitals') continue; $v = ''; }
      $o[$k] = $v;
    }
    $S[$tb][] = $o;
  }
}
$st = $pdo->prepare('SELECT log_key FROM med_log WHERE user_id=?'); $st->execute([$u]);
$S['medLog'] = new stdClass; foreach ($st as $r) $S['medLog']->{$r['log_key']} = 1;
$st = $pdo->prepare('SELECT role,msg FROM chat WHERE user_id=? ORDER BY id'); $st->execute([$u]);
$S['chat'] = []; foreach ($st as $r) $S['chat'][] = ['r' => $r['role'], 't' => $r['msg']];
out($S);

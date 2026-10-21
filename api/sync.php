<?php
require __DIR__ . '/../db.php';
$u = need_user();
$in = json_decode(file_get_contents('php://input'), true) ?: [];
$pdo->beginTransaction();
try {
  foreach (SCHEMA as $tb => $cols) {
    $del = $pdo->prepare("DELETE FROM `$tb` WHERE user_id=? AND id=?");
    foreach (($in['del'][$tb] ?? []) as $id) $del->execute([$u, (string)$id]);
    $n = array_keys($cols);
    $up = $pdo->prepare("INSERT INTO `$tb`(user_id,id,`" . implode('`,`', $n) . '`) VALUES(?,?' . str_repeat(',?', count($n)) . ') ON DUPLICATE KEY UPDATE '
      . implode(',', array_map(fn($c) => "`$c`=VALUES(`$c`)", $n)));
    foreach (($in['up'][$tb] ?? []) as $r) {
      $id = substr(preg_replace('/[^a-zA-Z0-9]/', '', (string)($r['id'] ?? '')), 0, 16);
      if ($id === '') continue;
      $p = [$u, $id]; foreach ($cols as $k => $t) $p[] = val($r[$k] ?? null, $t);
      $up->execute($p);
    }
  }
  if (isset($in['profile'])) {
    $n = array_keys(PROFILE);
    $p = [$u]; foreach (PROFILE as $k => $t) $p[] = val($in['profile'][$k] ?? null, $t);
    $pdo->prepare('INSERT INTO profiles(user_id,`' . implode('`,`', $n) . '`) VALUES(?' . str_repeat(',?', count($n)) . ') ON DUPLICATE KEY UPDATE '
      . implode(',', array_map(fn($c) => "`$c`=VALUES(`$c`)", $n)))->execute($p);
  }
  if (isset($in['theme']) && in_array($in['theme'], ['light', 'dark'], true))
    $pdo->prepare('UPDATE users SET theme=? WHERE id=?')->execute([$in['theme'], $u]);
  if (isset($in['log'])) {
    $ins = $pdo->prepare('INSERT IGNORE INTO med_log(user_id,log_key) VALUES(?,?)');
    foreach (($in['log']['set'] ?? []) as $k) $ins->execute([$u, mb_substr((string)$k, 0, 80)]);
    $dl = $pdo->prepare('DELETE FROM med_log WHERE user_id=? AND log_key=?');
    foreach (($in['log']['unset'] ?? []) as $k) $dl->execute([$u, (string)$k]);
  }
  if (isset($in['chat'])) {
    $pdo->prepare('DELETE FROM chat WHERE user_id=?')->execute([$u]);
    $ins = $pdo->prepare('INSERT INTO chat(user_id,role,msg) VALUES(?,?,?)');
    foreach (array_slice($in['chat'], -60) as $m) $ins->execute([$u, ($m['r'] ?? 'b') === 'u' ? 'u' : 'b', mb_substr((string)($m['t'] ?? ''), 0, 4000)]);
  }
  $pdo->commit(); out(['ok' => 1]);
} catch (Exception $e) { $pdo->rollBack(); out(['error' => 'Gagal menyimpan data'], 500); }

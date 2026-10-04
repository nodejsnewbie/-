/**
 * 迁移后的写操作与错误响应烟测。
 *
 * GET 的基线比对覆盖不了这些：POST/PUT/PATCH 会改内存状态，而 404/400 的**响应体形状**
 * 恰恰是 NestJS 与 Express 最容易出现差异的地方（Nest 的 HttpException 可能附加 statusCode）。
 *
 * 用法：node scripts/smoke-mutations.mjs
 */
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

let failed = 0;

async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }
  return { status: res.status, body: parsed };
}

/** 断言：状态码 + 响应体键集合（不看值，值会随状态变化） */
function check(label, actual, expectStatus, expectKeys) {
  const problems = [];
  if (actual.status !== expectStatus) {
    problems.push(`状态码 ${actual.status} != ${expectStatus}`);
  }
  const keys = Object.keys(actual.body ?? {}).sort();
  const want = [...expectKeys].sort();
  if (JSON.stringify(keys) !== JSON.stringify(want)) {
    problems.push(`响应体键 [${keys}] != [${want}]`);
  }
  if (problems.length) {
    failed += 1;
    console.log(`  [FAIL] ${label}`);
    for (const p of problems) console.log(`         ${p}`);
    console.log(`         body: ${JSON.stringify(actual.body).slice(0, 200)}`);
  } else {
    console.log(`  [ok]   ${label}  → ${actual.status} ${JSON.stringify(keys)}`);
  }
}

async function main() {
  console.log('=== 企业后台：404 形状（legacy 为 { error }）===');
  check(
    'POST /api/orders/NOPE/dispatch',
    await call('POST', '/api/orders/NOPE/dispatch', {}),
    404,
    ['error'],
  );
  check('PUT /api/orders/NOPE/step', await call('PUT', '/api/orders/NOPE/step', { step: 3 }), 404, [
    'error',
  ]);
  check(
    'PUT /api/technicians/NOPE/status',
    await call('PUT', '/api/technicians/NOPE/status', {}),
    404,
    ['error'],
  );
  check('POST /api/audits/NOPE/approve', await call('POST', '/api/audits/NOPE/approve', {}), 404, [
    'error',
  ]);
  check('POST /api/audits/NOPE/reject', await call('POST', '/api/audits/NOPE/reject', {}), 404, [
    'error',
  ]);
  check(
    'POST /api/amoeba/single-settle/NOPE',
    await call('POST', '/api/amoeba/single-settle/NOPE', {}),
    404,
    ['error'],
  );

  console.log('\n=== 企业后台：写操作成功形状 ===');
  check(
    'PUT /api/technicians/tech-001/status',
    await call('PUT', '/api/technicians/tech-001/status', { dispatchStatus: 'active' }),
    200,
    ['success', 'technician'],
  );
  check(
    'POST /api/orders/#ORD-20241028-0902/dispatch',
    await call('POST', '/api/orders/%23ORD-20241028-0902/dispatch', { technicianId: 'tech-001' }),
    200,
    ['success', 'message', 'order'],
  );
  check(
    'PUT /api/orders/#ORD-20241028-0902/step',
    await call('PUT', '/api/orders/%23ORD-20241028-0902/step', { step: 3 }),
    200,
    ['success', 'order'],
  );
  check(
    'POST /api/supply-chain/generate-codes',
    await call('POST', '/api/supply-chain/generate-codes', { count: 100 }),
    200,
    ['success', 'message', 'batchCode'],
  );
  check(
    'POST /api/supply-chain/freeze-batch',
    await call('POST', '/api/supply-chain/freeze-batch', { batchNumber: 'HN-20240315-A' }),
    200,
    ['success', 'message'],
  );
  check('POST /api/sync/ministry', await call('POST', '/api/sync/ministry', {}), 200, [
    'success',
    'message',
    'syncTimestamp',
    'apiStatus',
    'matchedRate',
  ]);
  check('POST /api/amoeba/batch-settle', await call('POST', '/api/amoeba/batch-settle', {}), 200, [
    'success',
    'message',
    'settledCount',
    'netPaid',
  ]);

  console.log('\n=== 技师端：404 / 400 形状（legacy 为 { success, message }）===');
  check('GET /api/tech/orders/NOPE', await call('GET', '/api/tech/orders/NOPE'), 404, [
    'success',
    'message',
  ]);
  check(
    'POST /api/tech/orders/NOPE/claim',
    await call('POST', '/api/tech/orders/NOPE/claim', {}),
    404,
    ['success', 'message'],
  );
  check(
    'POST /api/tech/orders/ord-01/evidence (缺 url)',
    await call('POST', '/api/tech/orders/ord-01/evidence', {}),
    400,
    ['success', 'message'],
  );
  check('GET /api/tech/pesticides/NOPE', await call('GET', '/api/tech/pesticides/NOPE'), 404, [
    'success',
    'message',
  ]);
  check(
    'POST /api/tech/amoeba/withdraw (金额非法)',
    await call('POST', '/api/tech/amoeba/withdraw', { amount: -1 }),
    400,
    ['success', 'message'],
  );
  check(
    'POST /api/tech/amoeba/withdraw (超额)',
    await call('POST', '/api/tech/amoeba/withdraw', { amount: 99999999 }),
    400,
    ['success', 'message'],
  );

  console.log('\n=== 技师端：写操作成功形状 ===');
  check(
    'PATCH /api/tech/technician/status',
    await call('PATCH', '/api/tech/technician/status', { isOnline: true }),
    200,
    ['success', 'message', 'data'],
  );
  check(
    'POST /api/tech/orders/ord-02/claim',
    await call('POST', '/api/tech/orders/ord-02/claim', {}),
    200,
    ['success', 'message', 'data'],
  );
  check(
    'POST /api/tech/orders/ord-02/decline',
    await call('POST', '/api/tech/orders/ord-02/decline', {}),
    200,
    ['success', 'message', 'data'],
  );
  check(
    'POST /api/tech/orders/ord-02/evidence',
    await call('POST', '/api/tech/orders/ord-02/evidence', {
      url: 'https://x/y.png',
      label: '测试',
    }),
    200,
    ['success', 'message', 'data', 'order'],
  );
  check(
    'POST /api/tech/orders/ord-02/prescribe',
    await call('POST', '/api/tech/orders/ord-02/prescribe', { agronomicAdvice: '测试建议' }),
    200,
    ['success', 'message', 'data'],
  );
  check(
    'POST /api/tech/orders/ord-01/sign',
    await call('POST', '/api/tech/orders/ord-01/sign', { signature: '张三' }),
    200,
    ['success', 'message', 'data'],
  );
  check(
    'POST /api/tech/amoeba/withdraw',
    await call('POST', '/api/tech/amoeba/withdraw', { amount: 10, channel: 'wechat' }),
    200,
    ['success', 'message', 'data'],
  );

  console.log('\n=== C 端商城（zymall 并入）：404 / 400 形状（legacy 为 { success, error }）===');
  check('GET /api/products/NOPE', await call('GET', '/api/products/NOPE'), 404, [
    'success',
    'error',
  ]);
  check('POST /api/trace/verify (空 code)', await call('POST', '/api/trace/verify', {}), 400, [
    'success',
    'error',
  ]);
  check(
    'POST /api/trace/verify (空白 code)',
    await call('POST', '/api/trace/verify', { code: '   ' }),
    400,
    ['success', 'error'],
  );
  check('POST /api/orders (空清单)', await call('POST', '/api/orders', { items: [] }), 400, [
    'success',
    'error',
  ]);

  console.log('\n=== C 端商城：写操作成功形状 ===');
  check(
    'POST /api/trace/verify (正品码)',
    await call('POST', '/api/trace/verify', { code: '1020210892090124883901' }),
    200,
    ['success', 'data'],
  );
  check(
    'POST /api/trace/verify (异常码)',
    await call('POST', '/api/trace/verify', { code: '88899999' }),
    200,
    ['success', 'data'],
  );
  check(
    'POST /api/bookings',
    await call('POST', '/api/bookings', { contactName: '烟测用户', acreage: 12 }),
    200,
    ['success', 'data'],
  );
  check(
    'POST /api/orders',
    await call('POST', '/api/orders', {
      items: [{ product: { id: 'prod-1', price: 48 }, quantity: 2 }],
      station: '烟测站',
    }),
    200,
    ['success', 'data'],
  );

  console.log(`\n失败项: ${failed}`);
  // 用 exitCode 而不是 process.exit()：后者在 Windows 上会与 fetch 的 keep-alive
  // 句柄关闭竞争，触发 libuv 断言崩溃（exit code 0xC0000409），把测试结果吞掉。
  process.exitCode = failed === 0 ? 0 : 1;
}

main().catch((error) => {
  console.error('烟测异常:', error);
  process.exitCode = 1;
});

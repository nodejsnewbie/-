// 跨平台启动 AI 智能代理层（services/ai）的 uvicorn 开发服务。
// 用法：npm run dev:ai  （等价于在 services/ai 里用 .venv 的 python 跑 uvicorn）
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const aiDir = path.join(root, 'services', 'ai');
const isWin = process.platform === 'win32';
const pythonBin = path.join(aiDir, '.venv', isWin ? 'Scripts' : 'bin', isWin ? 'python.exe' : 'python');

if (!existsSync(pythonBin)) {
  console.error('[dev:ai] 未找到虚拟环境，请先执行：');
  console.error('  cd services/ai && python -m venv .venv && .venv/Scripts/pip install -e ".[dev]"');
  process.exitCode = 1;
} else {
  const port = process.env.AI_PORT ?? '8100';
  const child = spawn(
    pythonBin,
    ['-m', 'uvicorn', 'app.main:app', '--host', process.env.HOST ?? '0.0.0.0', '--port', port, '--reload'],
    { cwd: aiDir, stdio: 'inherit' },
  );
  child.on('exit', (code) => {
    process.exitCode = code ?? 0;
  });
}

/**
 * ESLint 平面配置（flat config，ESLint 9+ 主流形态）。
 *
 * 分工约定：
 * - `npm run lint`（tsc --noEmit）负责**类型正确性**（红线 R1 的门禁）
 * - `npm run lint:eslint`（本文件）负责**代码质量**（未用变量、错误吞掉、hooks 依赖等）
 * 不放格式类规则——格式交给 Prettier（见 .prettierrc.json）。
 */
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '.dsh/**',
      'services/ai/.venv/**',
      '**/__pycache__/**',
      'services/server/prisma/migrations/**',
    ],
  },

  // JS / 脚本（scripts/*.mjs 等）
  js.configs.recommended,

  // CJS 配置文件（babel/tailwind 等用 module.exports；需要显式声明 CommonJS 语境）
  {
    files: ['**/*.config.cjs', 'apps/*/babel.config.js', 'apps/*/tailwind.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },

  // TS / TSX（不启用 type-aware 规则：类型问题由 tsc 门禁负责，避免双份慢检查）
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),

  {
    files: ['**/*.tsx', '**/*.ts'],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // hooks 的顶层依赖数组里出现函数是常态（showToast 等 useCallback 已保证稳定）
      'react-hooks/exhaustive-deps': 'warn',
      // v6 新增的性能规则：原型在 effect 里同步 setState（加载态/弹窗复位），
      // 保持行为不变优先，降级为警告；接入测试框架后统一重构
      'react-hooks/set-state-in-effect': 'warn',
      // 显式 any 一律禁止（红线 R1）；确需豁免的点位用行内 eslint-disable 并写明原因
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // 服务端运行于 Node（NestJS），补充 node 全局
  {
    files: ['services/server/src/**/*.ts', 'services/server/test/**/*.ts', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);

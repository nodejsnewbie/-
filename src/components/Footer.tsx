import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest py-3 px-6 border-t border-surface-container mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between text-on-surface-variant text-[12px] gap-2">
        <p>华农农业综合服务集团 统一运营后台 v2.4.0 · 智能数字植保调度总控</p>
        <p>湘ICP备20240018号 · 国家农业农村部可追溯代码对接规范认证</p>
      </div>
    </footer>
  );
};

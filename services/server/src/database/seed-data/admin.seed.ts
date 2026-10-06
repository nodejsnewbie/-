/**
 * 企业后台的**种子数据**（原型 Mock，逐字迁入，未改任何一条数据）。
 *
 * ⚠️ 这不是业务逻辑，只用于把数据库初始化成原型的样子，好让接口响应可验证。
 * ⚠️ 含大量已被否定的虚构字段与数值（窜货、OCR 比对率、KPI 绝对值、示意距离等）。
 *    清理时点见 AGENTS.md 的「已知遗留」——清理需要客户确认需求。
 *
 * 金额在本文件里仍是**元（浮点）**，由 `seed.ts` 统一转成「分」入库（红线 R7）。
 */

import type { AuditApplication, Technician } from '@hnhall/shared';

/**
 * 企业后台内存数据（迁移期）。
 *
 * 来源：本仓库原根目录 `server.ts`，经 `legacy/admin/admin-mock.router.ts` 逐字迁入，
 * **未改任何一条数据**。类型取自 `@hnhall/shared`（跨端类型真源）。
 *
 * ⚠️ 含大量已被否定的虚构字段与数值（窜货、OCR 比对率、KPI 绝对值、定位距离等）。
 * 它们是**存量数据**，清理时点见 AGENTS.md 的「已知遗留」——清理需要客户确认需求，
 * 不在本次结构迁移的范围内。
 *
 * ⚠️ 进程重启即清空；不得作为任何功能「已完成」的依据。
 */
export class AdminSeed {
  technicians: Technician[] = [
    {
      id: 'tech-001',
      code: 'HN-TEC-0108',
      name: '周建国',
      title: '资深农艺师',
      phone: '138****7819',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuARRvuQ04-wXbsqOK8hora7FfBRvIp1u0zm0TwyooOP7qJLSwNq6QOLNk3UvlWVjlktgvuIkYmKt2PsmCQWMXu6V5kvVNAMN8w2UR2w7ixAdj8_Rw6I2ixq8QngDHKsTTsZe7a9V59pecyX0jXhAwwfLtUJGS1QO3NWLYIFvMJPqQOBkw91QWDn_OLuuD3XwsdeuSfQDHe10S6U8NfKXuahKZXiEdcgdllx0j3Pi0pTBNhym5mChHhh',
      licenseNumber: '湘(2023)0421号',
      licenseThumb:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBTn4rGwCN_ZUflPdNj_HmY6w4DCNn6oLh-MIXZIaxj7HJBoUHkbTqmMtQTeQKgIsGjd-PWMqLc88qWf-C9roidwUQM2HS95xZNkHrH51osaJRyA9ibP3lRD9jiH-4JicTHVNvzgJdrd0eHf4HRgiSjB0GYLU7zdaHT0v_3i7SeswQA4AMTn2TbqP9C5EHgQEhGWjaSOtrw3UIu3KfBLJeyHDa_DwznIOelGprvQUUZr1bRf3WUhnAm',
      licenseAuthority: '长沙县农业农村局颁发',
      licenseExpiry: '2026-11-15',
      licenseStatus: 'normal',
      amoebaTier: 'gold',
      amoebaTierName: '黄金合伙人',
      amoebaCoefficient: 1.25,
      teamName: '安沙创客先锋战队',
      commissionRatio: '基础75% + 团队分红5%',
      menteeCount: 3,
      independentMentees: 2,
      teamMonthlyOutput: 42800,
      mentorshipAllowanceCents: 214000,
      gridName: '长沙县 · 安沙镇综合服务站',
      coverageRadius: 25,
      boundEquipment: '大疆 T60 (湘A-8821)',
      completedOrders: 412,
      operationAcreage: 18200,
      rating: 4.96,
      reviewCount: 412,
      goodReviewRate: 99.2,
      dispatchStatus: 'active',
      dispatchStatusText: '正常展业接单',
    },
    {
      id: 'tech-002',
      code: 'HN-TEC-0341',
      name: '刘晓芳',
      title: '植保配方员',
      phone: '151****2094',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDg4HPfv2PBA28R5luYAwcnsyf5FInw40sx-5h42KfpDWrvp73R4Dlc-0gHardEfMCF2AwJJHn7M2PV6WYKAP6SuoF0-VN7AFPhaqfReXjduDa9khtHTsuwlNvvg7CW6asPuicX0BaoIYO1Kt_Lklri59ugHppXP5FCa-9ah92xKsT_4_4cDmJFn8TNF-IzmID2ZCnN7Rk0R_sx0r8uIMYwhJVRGjoTymINK9jjBxApS5sKrn97wEw4',
      licenseNumber: '湘(2021)0082号',
      licenseThumb:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCjSRMj7HINk0cRREAd65oBLwIdsXHcpKw17HfQ5X4FT3lBbYXBsWPmEm1ARD5VQG9auf27iXZ8ukim3BptWConCEVy1A65Eef0VnBax-DAC0x2a8f_KxxkeQYR5aoSWrou71vc7zFrXnkBIu1VuK7pkFpVbREaUDDsnFKJr092RU5QlktMZTT1mpTeBlJDf-fv6sTeFjPF7duNRnOLtUQvWviNdqaJ5ksJqEyxuR7OG0kuzp-br-1W',
      licenseAuthority: '常德市鼎城区农业局',
      licenseExpiry: '2024-11-20',
      licenseStatus: 'expiring',
      licenseExpiryDays: 11,
      amoebaTier: 'silver',
      amoebaTierName: '白银合伙人',
      amoebaCoefficient: 1.1,
      teamName: '鼎城洞庭丰产组',
      commissionRatio: '基础70%',
      menteeCount: 1,
      independentMentees: 0,
      teamMonthlyOutput: 18200,
      mentorshipAllowanceCents: 54000,
      gridName: '常德市 · 鼎城区谢家铺服务站',
      coverageRadius: 15,
      boundEquipment: '配置智能配药机 2 台',
      completedOrders: 228,
      operationAcreage: 9450,
      rating: 4.88,
      reviewCount: 228,
      goodReviewRate: 98.6,
      dispatchStatus: 'need_annual_review',
      dispatchStatusText: '急需年审复核',
    },
    {
      id: 'tech-003',
      code: 'HN-TEC-0005',
      name: '彭明辉',
      title: '首席阿米巴导师',
      phone: '139****1188',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDLhf11MbzfcGFwLwmP7tWfOFXMQEIxtPPJ0ll39e5bls2EyH7xflkDbZn9W71aJZBP_Or21MpLXVufmdu0fYuJwI2XXuXQyld_dBqt8JtgcfZxdjSsCmOAuCKWllI7XoXfzhVceonKOAN-s9wuPpxBDZWMIs08QBz5-TTkdEQ485MwpcoyUhT6O5c8KpRNmS9kXluQfyFLeBaWF5Td62GSElOVpU7hNBb_RcRqs_wSNaaEyCdRRrTb',
      licenseNumber: '湘(2022)0119号',
      licenseThumb:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuByVroF07dYRQCLxrPNbBq69gcG9h7NxeivIvZVno2DkHppKRLSj9fHBaYRrRYMgaZeZPFMc5gTpNSMyxB4wW2KXSWpbglhmeFXI5l4QMvlMvmcI99xtLtZmKweSNNGP84v3QP8DILrEf9LGPe3Ju18g6p6X5LXnFdUS3wP3WWcbYLtmdUTCHMq_vNRAEG3CfNewCdk5a_oQqgu97TCCgQJT2-rLKRwxJXsNH_g7FCwECUE02O9qg38',
      licenseAuthority: '益阳市赫山区农业局',
      licenseExpiry: '2027-05-18',
      licenseStatus: 'normal',
      amoebaTier: 'diamond',
      amoebaTierName: '钻石合伙人',
      amoebaCoefficient: 1.35,
      teamName: '益阳兰溪创客军团 (组长)',
      commissionRatio: '基础80% + 师徒总红利8%',
      menteeCount: 8,
      independentMentees: 2,
      teamMonthlyOutput: 116400,
      mentorshipAllowanceCents: 682000,
      gridName: '益阳市 · 兰溪镇区域示范站',
      coverageRadius: 35,
      boundEquipment: '6架大疆T60/极飞P100',
      completedOrders: 638,
      operationAcreage: 34600,
      rating: 4.99,
      reviewCount: 638,
      goodReviewRate: 99.8,
      dispatchStatus: 'active',
      dispatchStatusText: '正常展业接单',
    },
    {
      id: 'tech-004',
      code: 'HN-TEC-8902',
      name: '陈志平',
      title: '预备期学员',
      phone: '177****5531',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDDR_tkZnaP-kHPIFkgu4GYyAW_cCExTpN4ubj2_UtULeJjbNggXQIsWc1M-nQ_AbCen_VC3ydjpS1mvebDpMF1T1CuQTreLpK3T68jjLeY9lck3FERZEOW3IaUI5judEj4xmfSaEEPCiNUXW-TUgYyDNZOfdpSoW_4yiUg7kuu1SqYTYxX6VPnxelItIVFupryd5dDdLiOStOaKIC2Y_A9JTomnmF7oh5-x1a7BaJfdopwqKjoDQaB',
      licenseNumber: '湘(2024)0918号',
      licenseThumb:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBQuSYEg8ah-Ml6QBaSkesGVcnTnuOpfpQuVanT_E2NSdaPW5nWuFgF07I196LSYQpUXGKhmw6kbsan2e046hMmcwHeQCfV4w4Z0VAJlhxPl8-IaGOnFfr88wmPVblHS4KxJWJh8XtxVnksI0NCZX0mT8TSsu8JhDUPYo-fv7Zs1kfqI4swpn4jDsLf-NF1V3t4SONOULFr9il8KcaBMk-KDJxSjFj1XwLQMHkIUiIUlI-_pjYRcvnC',
      licenseAuthority: '益阳市赫山区农业农村局',
      licenseExpiry: '2029-09-09',
      licenseStatus: 'pending_review',
      amoebaTier: 'trainee',
      amoebaTierName: '预备期学员',
      amoebaCoefficient: 1.0,
      teamName: '益阳兰溪创客组',
      commissionRatio: '拜师彭明辉 (高级技师)',
      menteeCount: 0,
      independentMentees: 0,
      teamMonthlyOutput: 0,
      mentorshipAllowanceCents: 20000,
      gridName: '益阳市 · 赫山区兰溪镇站点',
      coverageRadius: 10,
      boundEquipment: '大疆T50 (实训借机)',
      completedOrders: 0,
      operationAcreage: 0,
      rating: 5.0,
      reviewCount: 0,
      goodReviewRate: 100,
      dispatchStatus: 'pending_qualification',
      dispatchStatusText: '等待资质审核',
    },
  ];

  pendingAudits: AuditApplication[] = [
    {
      id: 'AUD-20241108-014',
      code: 'APP-2024-8902',
      applicantName: '陈志平',
      applicantType: '新入网技师申请',
      idCard: '43090319920815****',
      phone: '177****5531',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDDR_tkZnaP-kHPIFkgu4GYyAW_cCExTpN4ubj2_UtULeJjbNggXQIsWc1M-nQ_AbCen_VC3ydjpS1mvebDpMF1T1CuQTreLpK3T68jjLeY9lck3FERZEOW3IaUI5judEj4xmfSaEEPCiNUXW-TUgYyDNZOfdpSoW_4yiUg7kuu1SqYTYxX6VPnxelItIVFupryd5dDdLiOStOaKIC2Y_A9JTomnmF7oh5-x1a7BaJfdopwqKjoDQaB',
      targetGrid: '湖南省益阳市赫山区兰溪镇服务中心',
      urgent: true,
      licenseNumber: '湘农经许字(2024)第0918号',
      licenseScanUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAh1s8mg6ip3oI-qxhAlq0BtBFicBkSucGfFl8f743OT_FhzYRYiPJewdyFKMbj326rCsXGCTJXBtK5SXmP9Cl3mIiUDUhsMyVxCKifdxrCiOGQGJ9EgqB3x9veBWI-5f2303t_Q__PLfBZsmjsUcf4RGB5WKVmKtCN0QmvLYh8PDQFqDKAW1JqKiR6hSWbd4WNQDKI5AXae4tfDOzFM6oQer6rqVdSBD-G4sziw-H1fJahyb2yG-qj',
      licenseAuthority: '益阳市赫山区农业农村局',
      nationalRegistryVerified: true,
      permittedScope: '限制使用农药以外的农药 (符合民用植保飞防作业资质)',
      validPeriod: '2024-09-10 至 2029-09-09 (5年有效)',
      assignedAmoebaTeam: '益阳兰溪创客军团 (彭明辉导师组)',
      amoebaCoefficient: '1.00x (新人学员初始档)',
      auditNotes:
        '农药经营许可证原件清晰合规，省农业农村厅数据核验无误，准予通过建档并开启在线工单派发。',
      status: 'pending',
    },
  ];

}

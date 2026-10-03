import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  Technician,
  WorkOrder,
  AuditApplication,
  SupplyProduct,
  AmoebaSettlement,
  FulfillmentEvent,
} from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json());

// In-Memory Database Store seeded with rich reference data
let technicians: Technician[] = [
  {
    id: 'tech-001',
    code: 'HN-TEC-0108',
    name: '周建国',
    title: '资深农艺师',
    phone: '138****7819',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARRvuQ04-wXbsqOK8hora7FfBRvIp1u0zm0TwyooOP7qJLSwNq6QOLNk3UvlWVjlktgvuIkYmKt2PsmCQWMXu6V5kvVNAMN8w2UR2w7ixAdj8_Rw6I2ixq8QngDHKsTTsZe7a9V59pecyX0jXhAwwfLtUJGS1QO3NWLYIFvMJPqQOBkw91QWDn_OLuuD3XwsdeuSfQDHe10S6U8NfKXuahKZXiEdcgdllx0j3Pi0pTBNhym5mChHhh',
    licenseNumber: '湘(2023)0421号',
    licenseThumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTn4rGwCN_ZUflPdNj_HmY6w4DCNn6oLh-MIXZIaxj7HJBoUHkbTqmMtQTeQKgIsGjd-PWMqLc88qWf-C9roidwUQM2HS95xZNkHrH51osaJRyA9ibP3lRD9jiH-4JicTHVNvzgJdrd0eHf4HRgiSjB0GYLU7zdaHT0v_3i7SeswQA4AMTn2TbqP9C5EHgQEhGWjaSOtrw3UIu3KfBLJeyHDa_DwznIOelGprvQUUZr1bRf3WUhnAm',
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
    mentorshipAllowance: 2140,
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
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg4HPfv2PBA28R5luYAwcnsyf5FInw40sx-5h42KfpDWrvp73R4Dlc-0gHardEfMCF2AwJJHn7M2PV6WYKAP6SuoF0-VN7AFPhaqfReXjduDa9khtHTsuwlNvvg7CW6asPuicX0BaoIYO1Kt_Lklri59ugHppXP5FCa-9ah92xKsT_4_4cDmJFn8TNF-IzmID2ZCnN7Rk0R_sx0r8uIMYwhJVRGjoTymINK9jjBxApS5sKrn97wEw4',
    licenseNumber: '湘(2021)0082号',
    licenseThumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjSRMj7HINk0cRREAd65oBLwIdsXHcpKw17HfQ5X4FT3lBbYXBsWPmEm1ARD5VQG9auf27iXZ8ukim3BptWConCEVy1A65Eef0VnBax-DAC0x2a8f_KxxkeQYR5aoSWrou71vc7zFrXnkBIu1VuK7pkFpVbREaUDDsnFKJr092RU5QlktMZTT1mpTeBlJDf-fv6sTeFjPF7duNRnOLtUQvWviNdqaJ5ksJqEyxuR7OG0kuzp-br-1W',
    licenseAuthority: '常德市鼎城区农业局',
    licenseExpiry: '2024-11-20',
    licenseStatus: 'expiring',
    licenseExpiryDays: 11,
    amoebaTier: 'silver',
    amoebaTierName: '白银合伙人',
    amoebaCoefficient: 1.10,
    teamName: '鼎城洞庭丰产组',
    commissionRatio: '基础70%',
    menteeCount: 1,
    independentMentees: 0,
    teamMonthlyOutput: 18200,
    mentorshipAllowance: 540,
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
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLhf11MbzfcGFwLwmP7tWfOFXMQEIxtPPJ0ll39e5bls2EyH7xflkDbZn9W71aJZBP_Or21MpLXVufmdu0fYuJwI2XXuXQyld_dBqt8JtgcfZxdjSsCmOAuCKWllI7XoXfzhVceonKOAN-s9wuPpxBDZWMIs08QBz5-TTkdEQ485MwpcoyUhT6O5c8KpRNmS9kXluQfyFLeBaWF5Td62GSElOVpU7hNBb_RcRqs_wSNaaEyCdRRrTb',
    licenseNumber: '湘(2022)0119号',
    licenseThumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByVroF07dYRQCLxrPNbBq69gcG9h7NxeivIvZVno2DkHppKRLSj9fHBaYRrRYMgaZeZPFMc5gTpNSMyxB4wW2KXSWpbglhmeFXI5l4QMvlMvmcI99xtLtZmKweSNNGP84v3QP8DILrEf9LGPe3Ju18g6p6X5LXnFdUS3wP3WWcbYLtmdUTCHMq_vNRAEG3CfNewCdk5a_oQqgu97TCCgQJT2-rLKRwxJXsNH_g7FCwECUE02O9qg38',
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
    mentorshipAllowance: 6820,
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
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDR_tkZnaP-kHPIFkgu4GYyAW_cCExTpN4ubj2_UtULeJjbNggXQIsWc1M-nQ_AbCen_VC3ydjpS1mvebDpMF1T1CuQTreLpK3T68jjLeY9lck3FERZEOW3IaUI5judEj4xmfSaEEPCiNUXW-TUgYyDNZOfdpSoW_4yiUg7kuu1SqYTYxX6VPnxelItIVFupryd5dDdLiOStOaKIC2Y_A9JTomnmF7oh5-x1a7BaJfdopwqKjoDQaB',
    licenseNumber: '湘(2024)0918号',
    licenseThumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQuSYEg8ah-Ml6QBaSkesGVcnTnuOpfpQuVanT_E2NSdaPW5nWuFgF07I196LSYQpUXGKhmw6kbsan2e046hMmcwHeQCfV4w4Z0VAJlhxPl8-IaGOnFfr88wmPVblHS4KxJWJh8XtxVnksI0NCZX0mT8TSsu8JhDUPYo-fv7Zs1kfqI4swpn4jDsLf-NF1V3t4SONOULFr9il8KcaBMk-KDJxSjFj1XwLQMHkIUiIUlI-_pjYRcvnC',
    licenseAuthority: '益阳市赫山区农业农村局',
    licenseExpiry: '2029-09-09',
    licenseStatus: 'pending_review',
    amoebaTier: 'trainee',
    amoebaTierName: '预备期学员',
    amoebaCoefficient: 1.00,
    teamName: '益阳兰溪创客组',
    commissionRatio: '拜师彭明辉 (高级技师)',
    menteeCount: 0,
    independentMentees: 0,
    teamMonthlyOutput: 0,
    mentorshipAllowance: 200,
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

let pendingAudits: AuditApplication[] = [
  {
    id: 'AUD-20241108-014',
    code: 'APP-2024-8902',
    applicantName: '陈志平',
    applicantType: '新入网技师申请',
    idCard: '43090319920815****',
    phone: '177****5531',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDR_tkZnaP-kHPIFkgu4GYyAW_cCExTpN4ubj2_UtULeJjbNggXQIsWc1M-nQ_AbCen_VC3ydjpS1mvebDpMF1T1CuQTreLpK3T68jjLeY9lck3FERZEOW3IaUI5judEj4xmfSaEEPCiNUXW-TUgYyDNZOfdpSoW_4yiUg7kuu1SqYTYxX6VPnxelItIVFupryd5dDdLiOStOaKIC2Y_A9JTomnmF7oh5-x1a7BaJfdopwqKjoDQaB',
    targetGrid: '湖南省益阳市赫山区兰溪镇服务中心',
    urgent: true,
    licenseNumber: '湘农经许字(2024)第0918号',
    licenseScanUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh1s8mg6ip3oI-qxhAlq0BtBFicBkSucGfFl8f743OT_FhzYRYiPJewdyFKMbj326rCsXGCTJXBtK5SXmP9Cl3mIiUDUhsMyVxCKifdxrCiOGQGJ9EgqB3x9veBWI-5f2303t_Q__PLfBZsmjsUcf4RGB5WKVmKtCN0QmvLYh8PDQFqDKAW1JqKiR6hSWbd4WNQDKI5AXae4tfDOzFM6oQer6rqVdSBD-G4sziw-H1fJahyb2yG-qj',
    licenseAuthority: '益阳市赫山区农业农村局',
    ocrMatchRate: 98.4,
    nationalRegistryVerified: true,
    identityFaceMatched: true,
    permittedScope: '限制使用农药以外的农药 (符合民用植保飞防作业资质)',
    validPeriod: '2024-09-10 至 2029-09-09 (5年有效)',
    assignedAmoebaTeam: '益阳兰溪创客军团 (彭明辉导师组)',
    amoebaCoefficient: '1.00x (新人学员初始档)',
    auditNotes: '农药经营许可证原件清晰合规，省农业农村厅数据核验无误，准予通过建档并开启在线工单派发。',
    status: 'pending',
  },
];

let workOrders: WorkOrder[] = [
  {
    id: '#ORD-20241028-0914',
    farmerName: '刘建国',
    coopName: '安沙联丰水稻合作社',
    phone: '138****3910',
    location: '安沙镇黄旗村04组机耕道东侧',
    gridCode: 'AS-HQ-04G',
    crop: '晚稻分蘖末期',
    acreage: 25.4,
    cropStage: '分蘖末期',
    symptom: '疑似稻飞虱伴随纹枯病斑',
    serviceCategory: 'diagnosis',
    serviceCategoryText: '植保上门诊断 (紧急)',
    urgency: 'critical',
    urgencyText: '紧急加急',
    specialSubsidy: '农机补贴专项',
    reportedTime: '2024-10-28 09:12:40',
    waitingMinutes: 28,
    requestedAction: '技师2小时内实地踏勘+开处方药',
    status: 'pending_dispatch',
    statusText: '算力匹配中',
    currentStep: 1,
    matchedCandidates: [
      {
        id: 'cand-001',
        name: '张茂林 (农艺师)',
        phone: '139****2210',
        title: '高级植保师',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo9nFxQhBBbek7LKbtOgaKd5768mxKCDJhBexUHKqZaQlgjSAdreqs7Gasmim5Zzr1d_7_aA21F_FTTIK1bfCrpTB-RGZSFOfOsX7MjaTo0mgUttFJrD8CB6Vyj1xYzItT-JpLj8k3P2FmP3AcrI5Isax3R0-xnWKKyRHT6jDLZz5qF8cbCLyZcLt_LsGV3UFj-vqJ68GRNzI5zkSoUHhzle-X8PrU4KuHjDbRvSd2Km7Q5qpb3-_8',
        distanceKm: 2.1,
        estimatedArrivalMin: 22,
        matchScore: 98.6,
        dailyLoad: 1,
        maxDailyLoad: 4,
        rating: 99.8,
        jobCount: 420,
        expertiseTag: '水稻病害S级专精',
        statusText: '就近待命中',
        isPrimary: true,
        licenseVerified: '湘20240018已校验有效 (至2027年)',
      },
      {
        id: 'cand-002',
        name: '李国锋 (持证农艺师)',
        phone: '137****6123',
        title: '民用无人机驾驶员',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ2rvcDQcZnOiqLgMTUrM7uPxbt7Tdd6VQYiKZVTjHNi57vqDvScY3Jw1dYY-2FosE-vc_bJWBY4VCW3FmS9C4DzRBToV-2NyX42Jxr6BaMFx2xLZDXRzjbh7LELi9dWm7y7TLgJxg0xn86A5REW1Hut3AhadXpsQlNZwvaw4nL1F1QQQnUy-dFVw2TvhkeeXG6H8El5idujJfIqZVdMGyUUzaXWImhDNfF9KlU7BmczPN8X-0n6Pl',
        distanceKm: 3.8,
        estimatedArrivalMin: 35,
        matchScore: 91.2,
        dailyLoad: 2,
        maxDailyLoad: 4,
        rating: 99.1,
        jobCount: 310,
        expertiseTag: '飞防经验丰富',
        statusText: '2单进行中 (可协调)',
        licenseVerified: '湘20230198已校验有效',
      },
      {
        id: 'cand-003',
        name: '陈惠芬 (资深植保研究员)',
        phone: '136****9988',
        title: '研究员级高级农艺师',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhqEeKp9F10UHxO2QI4bBHy5yDuSlofdFJvzrItvEA8GWXnchomlnfJc5AD7ZEN6njKU5qzQbYMStqMei2A5o9xVl_T42w4Eimu69j_etL3OKyX6JEC40ABQSl3EGXzS9N8frXQbK_T0bgYfkMgzziImIcSVUadRdoKQW0sQT60R3WNe3ZHVPvE7bR81ZkI47wYwhok8ancNLnVyv3-4xFzKYAy7MxNYuAvC0gtqjrgPb_unSzbE1Y',
        distanceKm: 5.4,
        estimatedArrivalMin: 45,
        matchScore: 89.5,
        dailyLoad: 0,
        maxDailyLoad: 2,
        rating: 100,
        jobCount: 512,
        expertiseTag: '全县专家组特邀',
        statusText: '专家会诊待命',
        licenseVerified: '国家农业技术资格特级',
      },
    ],
  },
  {
    id: '#ORD-20241028-0902',
    farmerName: '周宏福',
    coopName: '高桥镇白石村种植园',
    phone: '159****8812',
    location: '高桥镇白石冲水库南侧坡地',
    gridCode: 'GQ-BS-02',
    crop: '柑橘蜜桔',
    acreage: 18.0,
    cropStage: '果实膨大期',
    symptom: '炭疽病叶片黄化现场诊断',
    serviceCategory: 'diagnosis',
    serviceCategoryText: '常规植保诊断',
    urgency: 'normal',
    urgencyText: '常规工单',
    reportedTime: '2024-10-28 08:30:15',
    waitingMinutes: 48,
    requestedAction: '现场病叶取样+制定配方',
    status: 'pending_dispatch',
    statusText: '待调度',
    currentStep: 1,
  },
  {
    id: '#ORD-20241028-0855',
    farmerName: '陈仕强',
    coopName: '路口镇龙泉粮油农场',
    phone: '135****4567',
    location: '路口镇龙泉村老屋场组',
    gridCode: 'LK-LQ-01',
    crop: '油菜冬种基地',
    acreage: 60.0,
    cropStage: '苗期基肥喷洒',
    symptom: '需配置大载重植保无人机双机组',
    serviceCategory: 'drone',
    serviceCategoryText: '精准飞防统防',
    urgency: 'high',
    urgencyText: '飞防统防',
    reportedTime: '2024-10-28 08:00:00',
    waitingMinutes: 60,
    requestedAction: '安排双机组飞防作业',
    status: 'pending_dispatch',
    statusText: '待调度',
    currentStep: 1,
  },
  {
    id: '#ORD-20241028-0840',
    farmerName: '黄德贵',
    coopName: '黄兴镇仙人市村',
    phone: '138****0123',
    location: '黄兴镇仙人市村湾潭组',
    gridCode: 'HX-XR-03',
    crop: '优质水稻',
    acreage: 110.0,
    cropStage: '秋收开镰前',
    symptom: '沃得收割机液压系统保养',
    serviceCategory: 'machinery',
    serviceCategoryText: '农机巡检维保',
    urgency: 'normal',
    urgencyText: '农机巡检',
    reportedTime: '2024-10-28 07:45:00',
    waitingMinutes: 72,
    requestedAction: '农机手急需抢修保养',
    status: 'pending_dispatch',
    statusText: '待调度',
    currentStep: 1,
  },
  {
    id: '#ORD-20241028-0720',
    farmerName: '李先生',
    coopName: '仙人市粮食基地',
    phone: '138****9201',
    location: '黄兴镇仙人市村4组机耕路口',
    gridCode: 'HX-XR-04',
    crop: '晚稻',
    acreage: 40.0,
    cropStage: '灌浆期',
    symptom: '水稻稻飞虱喷施',
    serviceCategory: 'diagnosis',
    serviceCategoryText: '植保诊断与飞防',
    urgency: 'high',
    urgencyText: '加急处理',
    reportedTime: '2024-10-28 07:20:15',
    waitingMinutes: 90,
    requestedAction: '已开具处方，正在飞防中',
    status: 'prescription_issued',
    statusText: '开具处方中',
    currentStep: 4,
    assignedTechnician: {
      id: 'tech-wpg',
      name: '王培根 (持证)',
      phone: '138****9201',
      title: '持证植保机手',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo9nFxQhBBbek7LKbtOgaKd5768mxKCDJhBexUHKqZaQlgjSAdreqs7Gasmim5Zzr1d_7_aA21F_FTTIK1bfCrpTB-RGZSFOfOsX7MjaTo0mgUttFJrD8CB6Vyj1xYzItT-JpLj8k3P2FmP3AcrI5Isax3R0-xnWKKyRHT6jDLZz5qF8cbCLyZcLt_LsGV3UFj-vqJ68GRNzI5zkSoUHhzle-X8PrU4KuHjDbRvSd2Km7Q5qpb3-_8',
      distanceKm: 0,
      estimatedArrivalMin: 0,
      matchScore: 99.0,
    },
    prescriptionCode: 'RX-HN-20241028-0842',
    prescriptionContent: '吡蚜酮+烯啶虫胺组合配方',
    watermarkVerified: true,
    watermarkTime: '08:05:12',
    watermarkGps: '29.214N, 112.441E',
  },
  {
    id: '#ORD-20241028-0610',
    farmerName: '赵女士',
    coopName: '龙泉生态油茶园',
    phone: '139****1182',
    location: '路口镇龙泉村北岭组山坳',
    gridCode: 'LK-LQ-02',
    crop: '油茶',
    acreage: 55.0,
    cropStage: '盛果期',
    symptom: '油茶炭疽病综合统防',
    serviceCategory: 'drone',
    serviceCategoryText: '精准飞防作业',
    urgency: 'normal',
    urgencyText: '已结单',
    reportedTime: '2024-10-28 06:10:00',
    waitingMinutes: 0,
    requestedAction: '已完成农户手写签字验收',
    status: 'completed',
    statusText: '已验收结单',
    currentStep: 5,
    assignedTechnician: {
      id: 'tech-tjx',
      name: '唐建新 (高级农艺师)',
      phone: '139****1182',
      title: '高级农艺师',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLhf11MbzfcGFwLwmP7tWfOFXMQEIxtPPJ0ll39e5bls2EyH7xflkDbZn9W71aJZBP_Or21MpLXVufmdu0fYuJwI2XXuXQyld_dBqt8JtgcfZxdjSsCmOAuCKWllI7XoXfzhVceonKOAN-s9wuPpxBDZWMIs08QBz5-TTkdEQ485MwpcoyUhT6O5c8KpRNmS9kXluQfyFLeBaWF5Td62GSElOVpU7hNBb_RcRqs_wSNaaEyCdRRrTb',
      distanceKm: 0,
      estimatedArrivalMin: 0,
      matchScore: 99.5,
    },
    prescriptionCode: 'RX-HN-20241028-0711',
    watermarkVerified: true,
    watermarkTime: '06:55:00',
    signedAt: '08:45:00',
    settlementAmount: 420.0,
  },
  {
    id: '#ORD-20241028-0589',
    farmerName: '邓发财',
    coopName: '水塘村育秧基地',
    phone: '135****6677',
    location: '安沙镇水塘村6组提灌站旁',
    gridCode: 'AS-ST-06',
    crop: '晚稻',
    acreage: 12.0,
    cropStage: '秧苗立枯病排查',
    symptom: '立枯黄斑猝倒',
    serviceCategory: 'diagnosis',
    serviceCategoryText: '急诊排查',
    urgency: 'critical',
    urgencyText: '接单超时预警',
    reportedTime: '2024-10-28 05:40:00',
    waitingMinutes: 120,
    requestedAction: '超时15分未确认，需紧急改派',
    status: 'exception',
    statusText: '接单超时预警',
    currentStep: 2,
  },
];

let supplyProducts: SupplyProduct[] = [
  {
    id: 'prod-001',
    name: '75% 肟菌·戊唑醇悬浮剂',
    spec: '100ml / 瓶 · 极速成膜防白粉',
    iconType: 'eco',
    registrationNumber: 'PD20210892',
    registrationNotes: '三证齐备 · 农业部在册',
    batchNumber: 'HN-20240315-A',
    manufactureDate: '2024-03-15 出厂',
    totalCoded: 85000,
    totalCodedUnit: '袋',
    scanCount: 64210,
    scanCountUnit: '瓶',
    scanProgressPct: 75.5,
    fleeStatus: 'normal',
    fleeStatusText: '正常 (全域可控)',
    prescriptionCommissionRate: 12.5,
    monthlySales: 48200.0,
    traceabilityNodes: [
      { time: '2024-03-15 10:24', desc: '出厂赋码已同步至国家农药质量追溯云' },
      { time: '2024-03-18 14:10', desc: '华农智服常德区域前置仓验收上架' },
      { time: '2024-04-12 09:30', desc: '技师张师傅开具数字植保处方绑定出库' },
    ],
  },
  {
    id: 'prod-002',
    name: '200g/L 氯虫苯甲酰胺悬浮剂',
    spec: '20ml / 支 · 针对抗性水稻螟虫',
    iconType: 'pest_control',
    registrationNumber: 'PD20182470',
    registrationNotes: '三证齐备 · 国家专审',
    batchNumber: 'HN-20240402-C',
    manufactureDate: '2024-04-02 出厂',
    totalCoded: 120000,
    totalCodedUnit: '支',
    scanCount: 98400,
    scanCountUnit: '支',
    scanProgressPct: 82.0,
    fleeStatus: 'normal',
    fleeStatusText: '正常 (全域可控)',
    prescriptionCommissionRate: 15.0,
    monthlySales: 62800.0,
    traceabilityNodes: [
      { time: '2024-04-02 08:30', desc: '原药纯度经农业部指定检测合格入库' },
      { time: '2024-04-05 11:15', desc: '智能物联网防伪监管码在线激活完成' },
      { time: '2024-04-15 16:00', desc: '益阳赫山飞防队集中领药开具电子监管密令' },
    ],
  },
  {
    id: 'prod-003',
    name: '40% 咪鲜胺水乳剂',
    spec: '500ml / 瓶 · 炭疽病高效广谱',
    iconType: 'warning',
    registrationNumber: 'PD20193108',
    registrationNotes: '三证齐备 · 生产在检',
    batchNumber: 'HN-20240218-B',
    manufactureDate: '2024-02-18 出厂',
    totalCoded: 40000,
    totalCodedUnit: '瓶',
    scanCount: 19830,
    scanCountUnit: '瓶',
    scanProgressPct: 49.5,
    fleeStatus: 'alert',
    fleeStatusText: '预警: 异地窜货扫码 (常德)',
    fleeLocation: '常德鼎城区流转窜货',
    prescriptionCommissionRate: 10.0,
    monthlySales: 19830.0,
    traceabilityNodes: [
      { time: '2024-02-18 13:00', desc: '生产批次下线，预设投放区域为岳阳' },
      { time: '2024-03-01 10:20', desc: '流转至长沙物流周转中心' },
      { time: '2024-04-10 14:22', desc: '异常触发：在常德市鼎城区出现密集扫码' },
    ],
  },
  {
    id: 'prod-004',
    name: '高活性聚谷氨酸海藻精生根肥',
    spec: '1000ml / 桶 · 土壤团粒修复',
    iconType: 'fluid_balance',
    registrationNumber: '农肥准字2023-4811',
    registrationNotes: '特肥专号 · 绿标免税',
    batchNumber: 'HN-20240410-D',
    manufactureDate: '2024-04-10 出厂',
    totalCoded: 35000,
    totalCodedUnit: '桶',
    scanCount: 27650,
    scanCountUnit: '桶',
    scanProgressPct: 79.0,
    fleeStatus: 'normal',
    fleeStatusText: '正常 (全域可控)',
    prescriptionCommissionRate: 8.0,
    monthlySales: 38400.0,
    traceabilityNodes: [
      { time: '2024-04-10 09:00', desc: '生物有机活性检测达标合格' },
      { time: '2024-04-14 10:40', desc: '水肥一体化服务车间直配到田' },
    ],
  },
  {
    id: 'prod-005',
    name: '5% 虱螨脲微乳剂',
    spec: '250ml / 瓶 · 杀卵抑脱皮长效',
    iconType: 'shield',
    registrationNumber: 'PD20221943',
    registrationNotes: '三证齐备 · 生产备案',
    batchNumber: 'HN-20240328-E',
    manufactureDate: '2024-03-28 出厂',
    totalCoded: 50000,
    totalCodedUnit: '瓶',
    scanCount: 32100,
    scanCountUnit: '瓶',
    scanProgressPct: 64.2,
    fleeStatus: 'normal',
    fleeStatusText: '正常 (全域可控)',
    prescriptionCommissionRate: 11.0,
    monthlySales: 15290.0,
    traceabilityNodes: [
      { time: '2024-03-28 15:30', desc: '出厂完成全量一物一码赋码' },
      { time: '2024-04-08 09:12', desc: '安沙镇飞防示范站入库登记完毕' },
    ],
  },
];

let amoebaSettlements: AmoebaSettlement[] = [
  {
    id: 'amo-001',
    partnerCode: 'HN-ST-0082',
    partnerName: '张师傅',
    partnerAvatarLetter: '张',
    partnerLevel: '黄金合伙人',
    teamName: '汉寿洞庭湖二组',
    menteeStatus: '4 位徒弟技师在编',
    serviceFee: 4200.0,
    prescriptionBonus: 3140.0,
    mentorshipBonus: 1100.0,
    equityDividend: 500.0,
    grossAmount: 8940.0,
    taxWithheld: 268.2,
    netPay: 8671.8,
    status: 'pending',
  },
  {
    id: 'amo-002',
    partnerCode: 'HN-ST-0015',
    partnerName: '李建国',
    partnerAvatarLetter: '李',
    partnerLevel: '先锋领航者',
    teamName: '鼎城常德油茶战区',
    menteeStatus: '6 位徒弟技师在编',
    serviceFee: 5600.0,
    prescriptionBonus: 4820.0,
    mentorshipBonus: 1850.0,
    equityDividend: 800.0,
    grossAmount: 13070.0,
    taxWithheld: 392.1,
    netPay: 12677.9,
    status: 'pending',
  },
  {
    id: 'amo-003',
    partnerCode: 'HN-ST-0129',
    partnerName: '王志强',
    partnerAvatarLetter: '王',
    partnerLevel: '认证飞手技师',
    teamName: '岳阳君山水稻片区',
    menteeStatus: '独立作业技师',
    serviceFee: 3900.0,
    prescriptionBonus: 1890.0,
    mentorshipBonus: 350.0,
    equityDividend: 200.0,
    grossAmount: 6340.0,
    taxWithheld: 190.2,
    netPay: 6149.8,
    status: 'pending',
  },
  {
    id: 'amo-004',
    partnerCode: 'HN-ST-0044',
    partnerName: '陈大明',
    partnerAvatarLetter: '陈',
    partnerLevel: '黄金合伙人',
    teamName: '益阳赫山特作三组',
    menteeStatus: '3 位徒弟技师在编',
    serviceFee: 4850.0,
    prescriptionBonus: 3420.0,
    mentorshipBonus: 980.0,
    equityDividend: 500.0,
    grossAmount: 9750.0,
    taxWithheld: 292.5,
    netPay: 9457.5,
    status: 'pending',
  },
];

let fulfillmentEvents: FulfillmentEvent[] = [
  {
    id: 'event-001',
    type: 'check_in',
    title: '农艺师现场打卡签到',
    timestamp: '2分钟前',
    summary: '李国华技师已到达益阳市大通湖千亩水稻田',
    technicianName: '李国华 (农艺师)',
    location: '益阳市大通湖千亩水稻田',
    gps: '29.214N, 112.441E',
    droneModel: '大疆 T50 满载试飞',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFQMhHJU2sBN02qvJWNWnPCh3e15rfWL5rfOnjzeafwiTGn-4PNlaR-atQ5KfhiksCEmzps-zaA2uzQkAYLRhAy5EPD8eO88EcVIc5XFdcNI1mQbp-btWah6NaFFqMPFd5FC1hQddfszSqSMO-6HPYt9evhOWiX5K_RtYFcfuJmopRV9UaiLx5FtFOOyIyMf-ul4AiwJrkFCGKR2J3fbSF9aBj3_Z_UlIE_EPuVMl6I-6bvsMeSKai',
  },
  {
    id: 'event-002',
    type: 'prescription',
    title: '一物一码出库核验成功',
    timestamp: '8分钟前',
    summary: '订单 #HN-20240414-015 溯源出库完成',
    technicianName: '张茂林',
    location: '长沙县安沙示范站',
    qrTraceCode: '86.10294.041842',
    batchCode: '20240315-A4 · 农药登记证号已挂网',
  },
  {
    id: 'event-003',
    type: 'sign_off',
    title: '农户电子手写签字验收',
    timestamp: '14分钟前',
    summary: '桃江县修山镇 160亩 茶园病虫统防统治竣工',
    technicianName: '唐建新',
    location: '桃江县修山镇茶园',
    rating: 5.0,
    settlementBonus: 420.0,
  },
];

// --- REST API ENDPOINTS ---

// 1. Overall stats & KPIs
app.get('/api/stats', (_req, res) => {
  res.json({
    kpis: {
      todayOrders: 148,
      todayOrdersChange: '+18.4%',
      pendingDispatch: workOrders.filter((o) => o.status === 'pending_dispatch').length,
      inService: workOrders.filter((o) => o.status === 'dispatched' || o.status === 'prescription_issued' || o.status === 'checked_in').length,
      completedToday: 98,
      onlineTechnicians: 386,
      totalTechnicians: 420,
      licensedRate: 98.2,
      dronePilots: 214,
      seniorAgronomists: 172,
      supplyTraceSales: 128450.0,
      prescriptionRate: 82.5,
      complianceRate: 100,
      prescriptionBatches: 216,
      amoebaBonusPool: 342800.0,
      qualifiedAmoebaTeams: 26,
      avgArrivalHours: 1.8,
      fulfillmentRatePct: 96.4,
      farmerGoodReviewPct: 99.1,
    },
    pestAlerts: [
      { name: '水稻纹枯病 (早期拔节封行期)', percentage: 45, level: 'critical' },
      { name: '柑橘木虱 / 黄龙病媒介', percentage: 28, level: 'warning' },
      { name: '二化螟 / 稻纵卷叶螟', percentage: 27, level: 'normal' },
    ],
    serviceModeBreakdown: [
      { title: '上门精准植保作业', percentage: 62, orders: 92, desc: '大疆T50无人机飞防及轮式弥雾机' },
      { title: '农资维保与配方配送', percentage: 23, orders: 34, desc: '三证齐全农药直配田间仓' },
      { title: '专家现场会诊开方', percentage: 15, orders: 22, desc: '病虫害疑难靶标即时鉴定' },
    ],
    fulfillmentEvents,
    lastSyncTime: new Date().toISOString(),
  });
});

// 2. Orders endpoints
app.get('/api/orders', (req, res) => {
  const { status, grid, category, search } = req.query;
  let filtered = [...workOrders];

  if (status && status !== 'all') {
    if (status === 'pending') {
      filtered = filtered.filter((o) => o.status === 'pending_dispatch' || o.status === 'exception');
    } else {
      filtered = filtered.filter((o) => o.status === status);
    }
  }

  if (grid && grid !== 'all') {
    filtered = filtered.filter((o) => o.location.includes(grid as string) || o.gridCode.toLowerCase().includes((grid as string).toLowerCase()));
  }

  if (category && category !== 'all') {
    filtered = filtered.filter((o) => o.serviceCategory === category);
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    filtered = filtered.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.farmerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.crop.toLowerCase().includes(q)
    );
  }

  res.json({ orders: filtered, total: filtered.length });
});

app.post('/api/orders/:id/dispatch', (req, res) => {
  const orderId = req.params.id;
  const { technicianId } = req.body;
  const order = workOrders.find((o) => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: '工单不存在' });
  }

  const tech = technicians.find((t) => t.id === technicianId) || technicians[0];

  order.status = 'dispatched';
  order.statusText = '已派工 · 正在赶赴现场';
  order.currentStep = 2;
  order.assignedTechnician = {
    id: tech.id,
    name: tech.name,
    phone: tech.phone,
    title: tech.title,
    avatar: tech.avatar,
    distanceKm: 2.1,
    estimatedArrivalMin: 20,
    matchScore: 98.6,
  };

  // Add event to timeline
  fulfillmentEvents.unshift({
    id: `event-${Date.now()}`,
    type: 'dispatch',
    title: '工单已下发并派工',
    timestamp: '刚刚',
    summary: `${tech.name} 已认领工单 ${order.id}，预计 20 分钟内抵达`,
    technicianName: tech.name,
    location: order.location,
  });

  res.json({ success: true, message: '指派成功！已下发通知并生成电子工单密令', order });
});

app.put('/api/orders/:id/step', (req, res) => {
  const orderId = req.params.id;
  const { step } = req.body;
  const order = workOrders.find((o) => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: '工单不存在' });
  }

  order.currentStep = Number(step);
  if (step === 3) {
    order.watermarkVerified = true;
    order.watermarkTime = new Date().toLocaleTimeString();
    order.status = 'checked_in';
    order.statusText = '现场打卡完成';
  } else if (step === 4) {
    order.status = 'prescription_issued';
    order.statusText = '电子处方已开具';
    order.prescriptionCode = `RX-HN-${Date.now().toString().slice(-8)}`;
  } else if (step === 5) {
    order.status = 'completed';
    order.statusText = '已验收结单';
    order.signedAt = new Date().toLocaleTimeString();
    order.settlementAmount = 450.0;
  }

  res.json({ success: true, order });
});

// 3. Technicians endpoints
app.get('/api/technicians', (req, res) => {
  const { tier, filter, search } = req.query;
  let list = [...technicians];

  if (tier && tier !== 'all') {
    list = list.filter((t) => t.amoebaTier === tier);
  }

  if (filter === 'expiring') {
    list = list.filter((t) => t.licenseStatus === 'expiring');
  } else if (filter === 'active') {
    list = list.filter((t) => t.dispatchStatus === 'active');
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.licenseNumber.toLowerCase().includes(q)
    );
  }

  res.json({
    technicians: list,
    total: list.length,
    activeCount: list.filter((t) => t.dispatchStatus === 'active').length,
    pendingAuditCount: pendingAudits.filter((a) => a.status === 'pending').length,
    expiringCount: list.filter((t) => t.licenseStatus === 'expiring').length,
  });
});

app.put('/api/technicians/:id/status', (req, res) => {
  const tech = technicians.find((t) => t.id === req.params.id);
  if (!tech) return res.status(404).json({ error: '技师不存在' });

  if (req.body.dispatchStatus) {
    tech.dispatchStatus = req.body.dispatchStatus;
  }
  if (req.body.amoebaCoefficient) {
    tech.amoebaCoefficient = Number(req.body.amoebaCoefficient);
  }

  res.json({ success: true, technician: tech });
});

// 4. Audits endpoints
app.get('/api/audits', (_req, res) => {
  res.json({ audits: pendingAudits });
});

app.post('/api/audits/:id/approve', (req, res) => {
  const audit = pendingAudits.find((a) => a.id === req.params.id);
  if (!audit) return res.status(404).json({ error: '审核工单不存在' });

  audit.status = 'approved';

  // Promote or activate in technician list
  const existingTech = technicians.find((t) => t.phone.replace(/\D/g, '') === audit.phone.replace(/\D/g, ''));
  if (existingTech) {
    existingTech.dispatchStatus = 'active';
    existingTech.dispatchStatusText = '正常展业接单';
    existingTech.licenseStatus = 'normal';
  } else {
    technicians.push({
      id: `tech-${Date.now()}`,
      code: 'HN-TEC-8902',
      name: audit.applicantName,
      title: '合规植保机手 (已入库)',
      phone: audit.phone,
      avatar: audit.avatar,
      licenseNumber: audit.licenseNumber,
      licenseThumb: audit.licenseScanUrl,
      licenseAuthority: audit.licenseAuthority,
      licenseExpiry: '2029-09-09',
      licenseStatus: 'normal',
      amoebaTier: 'trainee',
      amoebaTierName: '预备期学员',
      amoebaCoefficient: 1.0,
      teamName: audit.assignedAmoebaTeam,
      commissionRatio: '实训分成基础70%',
      menteeCount: 0,
      independentMentees: 0,
      teamMonthlyOutput: 0,
      mentorshipAllowance: 200,
      gridName: audit.targetGrid,
      coverageRadius: 15,
      boundEquipment: '大疆 T60',
      completedOrders: 0,
      operationAcreage: 0,
      rating: 5.0,
      reviewCount: 0,
      goodReviewRate: 100,
      dispatchStatus: 'active',
      dispatchStatusText: '正常展业接单',
    });
  }

  res.json({
    success: true,
    message: '审核通过！已生成农药经营合规电子档案，系统已开通接单派发权限。',
    audit,
  });
});

app.post('/api/audits/:id/reject', (req, res) => {
  const audit = pendingAudits.find((a) => a.id === req.params.id);
  if (!audit) return res.status(404).json({ error: '审核工单不存在' });

  audit.status = req.body.action === 'revision' ? 'revision' : 'rejected';
  res.json({
    success: true,
    message: req.body.action === 'revision' ? '已退回补正材料，已通知申请人重新提交。' : '已驳回资质申请，系统已自动向申请人发送短信。',
    audit,
  });
});

// 5. Supply chain & Traceability
app.get('/api/supply-chain', (req, res) => {
  const { fleeStatus, search } = req.query;
  let items = [...supplyProducts];

  if (fleeStatus && fleeStatus !== 'all') {
    items = items.filter((p) => p.fleeStatus === fleeStatus);
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.registrationNumber.toLowerCase().includes(q) ||
        p.batchNumber.toLowerCase().includes(q)
    );
  }

  res.json({
    products: items,
    totalCount: items.length,
    totalCodedSum: '1,480,000 袋/瓶',
    monthScanCount: 28490,
    fleeAlertsCount: items.filter((p) => p.fleeStatus === 'alert').length,
  });
});

app.post('/api/supply-chain/generate-codes', (req, res) => {
  const count = req.body.count || 50000;
  res.json({
    success: true,
    message: `已批量生成 ${count.toLocaleString()} 个带防伪防窜数字水印的国家农药电子监管码，正在发往指定赋码喷印流水线。`,
    batchCode: `BAT-${Date.now()}`,
  });
});

app.post('/api/supply-chain/freeze-batch', (req, res) => {
  const { batchNumber } = req.body;
  const prod = supplyProducts.find((p) => p.batchNumber === batchNumber);
  if (prod) {
    prod.fleeStatusText = '已执行电子监管码熔断冻结 (已拦截)';
  }
  res.json({
    success: true,
    message: '已对该异动批次实施电子监管码即时冻结 (禁止处方核销)，稽查工单已推送常德督导组！',
  });
});

// 6. Amoeba Settlements
app.get('/api/amoeba', (_req, res) => {
  const grossTotal = amoebaSettlements.reduce((acc, s) => acc + s.grossAmount, 0);
  const taxTotal = amoebaSettlements.reduce((acc, s) => acc + s.taxWithheld, 0);
  const netTotal = amoebaSettlements.reduce((acc, s) => acc + s.netPay, 0);

  res.json({
    settlements: amoebaSettlements,
    summary: {
      grossTotal: 184520.0,
      taxTotal: 5535.6,
      netTotal: 178984.4,
      partnersCount: 42,
      batchAuditCode: 'AMO-202404-0982',
      bankStatus: '中国农业银行财资云 100% 专户直管',
    },
  });
});

app.post('/api/amoeba/batch-settle', (_req, res) => {
  amoebaSettlements.forEach((s) => {
    s.status = 'cleared';
    s.bankClearedAt = new Date().toISOString();
  });
  res.json({
    success: true,
    message: '已通过专网向中国农业银行财资云下发合规批量代发指令！预计 15 分钟内资金流水落地到账。',
    settledCount: amoebaSettlements.length,
    netPaid: 178984.4,
  });
});

app.post('/api/amoeba/single-settle/:id', (req, res) => {
  const item = amoebaSettlements.find((s) => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: '记录不存在' });
  item.status = 'cleared';
  item.bankClearedAt = new Date().toISOString();
  res.json({
    success: true,
    message: `已为 ${item.partnerName} 单独生成本月银企直联代发凭单！`,
    item,
  });
});

// 7. National Ministry Sync Endpoint
app.post('/api/sync/ministry', (_req, res) => {
  res.json({
    success: true,
    message: '已成功与国家农业农村部农药质量安全追溯云系统进行接口双向数据校验，全部 32 款核心农资与 386 位在册人员三证验真数据保持同步。',
    syncTimestamp: new Date().toISOString(),
    apiStatus: 'ONLINE_ACTIVE',
    matchedRate: 100,
  });
});

// Vite or Static Serving
async function startServer() {
  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Huanong Smart Service] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

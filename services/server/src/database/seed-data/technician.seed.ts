/**
 * 技师端的**种子数据**（原型 Mock，逐字迁入，未改任何一条数据）。
 *
 * ⚠️ 这不是业务逻辑，只用于初始化数据库。类型取自 `@hnhall/shared`。
 * ⚠️ 含已知待清理字段（distanceKm / gpsCoords / 三项分红 / incentiveMultiplier）。
 *
 * 金额在本文件里仍是**元（浮点）**，由 `seed.ts` 统一转成「分」入库（红线 R7）。
 */

import type {
  TechnicianProfile,
  PrescriptionDrug,
  ServiceOrder,
  AmoebaStat,
  TeamMemberFeed,
  RevenueTransaction,
} from '@hnhall/shared';

/**
 * 技师端内存数据（迁移期）。
 *
 * 来源：`E:\repo\technicalend\server\data\store.ts`，**逐字迁入、未改任何数据**。
 * 类型定义已上提到 `@hnhall/shared`（跨端类型真源）。
 *
 * ⚠️ 进程重启即清空；这不是持久化实现，不得作为任何功能「已完成」的依据。
 * 接库后整个 `store/` 目录会被 Prisma 仓储替换掉。
 */
export class TechnicianSeed {
  public technician: TechnicianProfile = {
    name: '张师傅',
    title: '高级持证农艺师',
    role: '华农新农人区域合伙人',
    partnerCode: 'HN-ST-0082',
    certId: 'CERT-HB2024-9812',
    station: '黄冈团风服务站 · 安沙镇直营站',
    pesticideLicense: '湘20240018-032',
    rating: 4.9,
    yearsOfService: 7,
    isOnline: true,
    onlineHoursToday: 4.5,
    groupRank: 1,
    groupName: '湘北区域 · 长沙县安沙创客小组',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtWqv3UOluvDfXB8gdoP2zfKw12dgAVazAoW5vouYQbd4c_h0O9I0btQyUFyjBq0w8JeJ60otJq8dbZIMW5amMv29W2oqlnMDOA3Ed8GTG8jnRI1wLvAYyNq-XnsvxooU8twHF9vMVeEZRhkQhwrkPUbWGAHia_GH7NkDqOqUJlhfxhzYJYrjAyHwgNU9E955W3e6QRsq9SLAIgE8YLwkTWOZ8CRVwPbGquCM802M2VDuayyoAVwcq',
    headerProfileUrl:
      'https://lh3.googleusercontent.com/aida/AEtjO1UEttkVExuIo7_Eb6GhdaeIzQrTP34Pa3CPqtGmGXGTz5CC7huUBcvMtOsTQdfYC1lvyhCVahi_W0atcPuqiGca2zPLhDRlxSIOb-0Ko3lWfSA1Jhrmq0dj3A-oMFhUWvtQn-zwJWOBAVMUTggUKosIj9TMHWGO6p-Q00OGR1sEBDUTduMwRTlfd8VFU7AuE2xnK4_pIJCM8aiy0aEdrvmGC-QLUIRH0Goq_9YFS2fMhpuFd2UpricKrw',
    logoUrl:
      'https://lh3.googleusercontent.com/aida/AEtjO1WIwHA3AoDJSjdzg2rG3BZGWi4OpNPFsS8hs1KT8yG2xqwg_ujB5QLAvQUJCW0tFRwUZRCx-RFqMnNnwmpMdYYpakL37xQYLEGKb9p-FNeq9vmhR07H60Id0ZSrYABZalIsHbQaIhKl-VtppEEk6m2T-XRS3UufI3RgNOc0M7DxH8gGkVjXGu7CzrJKa67PUriC04mBC8VmOL_783dXcn-6Lymp7tYnubsWyyuzDU1dxorO-FNGryrqwqE',
  };

  public catalog: PrescriptionDrug[] = [
    {
      id: 'd1',
      name: '华农植保·75%肟菌·戊唑醇',
      spec: '悬浮剂 (100ml) · 2000倍液稀释叶面喷施',
      priceCents: 14400,
      qty: 3,
      code: '4301202409010018',
      tag: '码: 4301202409010018 · 已验正品',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdcV_evdBvb4CbFzf0aBJGk-43qYHWWF5YU6Kpvpj-fZa0jiP7w5DoluobDe7GjXbURL-9jRLLMfgI0WlH7bgOIuuSWCsQr3M9XhvhlnJKz3pd9Uj6YDSLfTmicw69ieQZ3XG8wxdNlKMFM8GwCud5W5T1WiwR7lBfNxxuqlq55OTrZJYkuGJ9fLrKM0MvdGjcy_9F2oa-vBlxst6gdxKFKIuTBoa7VYUMaet_BhmeCax_GTL3USz-',
      activeIngredient: '75% 肟菌酯 + 戊唑醇',
      dosage: '10-15ml/亩',
    },
    {
      id: 'd2',
      name: '极飞特约·氯虫苯甲酰胺 200g/L',
      spec: '微乳剂 (100ml) · 亩用量10ml均匀雾化',
      priceCents: 13600,
      qty: 2,
      code: 'HN2406-03B',
      tag: '批次: HN2406-03B · 三证齐全',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr7fvZePkaKCG7OaozJ8O8StO-GwJnm_n61s_n-WheAMTNRAjD-pEYSOyvSso3zt9Lj88HMOipZNnohIdeWvsu_NlcStFwboYPyiRIdhqG3X2hUn3uyaQhcatA8QRHvwHMW98oged-qdPBf1pFP01HLW8cQfA_R27IpL2J3K1PUtIoBb6GRnv3gEAF_F1W2yQzrrTvcE4EEgxR6XslC0NFvxBkKX7EbLKljblvM3ONKPyHCrWdftC5',
      activeIngredient: '200克/升 氯虫苯甲酰胺',
      dosage: '10ml/亩',
    },
    {
      id: 'd3',
      name: '中化云谷·25%吡唑醚菌酯',
      spec: '微囊悬浮剂 (200ml) · 强效杀菌抑菌',
      priceCents: 8800,
      qty: 1,
      code: 'HN2406-08A',
      tag: '国标认准 · 绿色防控推荐',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdcV_evdBvb4CbFzf0aBJGk-43qYHWWF5YU6Kpvpj-fZa0jiP7w5DoluobDe7GjXbURL-9jRLLMfgI0WlH7bgOIuuSWCsQr3M9XhvhlnJKz3pd9Uj6YDSLfTmicw69ieQZ3XG8wxdNlKMFM8GwCud5W5T1WiwR7lBfNxxuqlq55OTrZJYkuGJ9fLrKM0MvdGjcy_9F2oa-vBlxst6gdxKFKIuTBoa7VYUMaet_BhmeCax_GTL3USz-',
      activeIngredient: '25% 吡唑醚菌酯',
      dosage: '30-40ml/亩',
    },
    {
      id: 'd4',
      name: '华农极效·0.01%天然芸苔素内酯',
      spec: '水剂 (100ml) · 促长解害 抗逆增产',
      priceCents: 5200,
      qty: 2,
      code: 'HN2406-12C',
      tag: '有机投入品认证 · 三证齐备',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr7fvZePkaKCG7OaozJ8O8StO-GwJnm_n61s_n-WheAMTNRAjD-pEYSOyvSso3zt9Lj88HMOipZNnohIdeWvsu_NlcStFwboYPyiRIdhqG3X2hUn3uyaQhcatA8QRHvwHMW98oged-qdPBf1pFP01HLW8cQfA_R27IpL2J3K1PUtIoBb6GRnv3gEAF_F1W2yQzrrTvcE4EEgxR6XslC0NFvxBkKX7EbLKljblvM3ONKPyHCrWdftC5',
      activeIngredient: '0.01% 芸苔素内酯',
      dosage: '10ml/亩',
    },
  ];

  public orders: ServiceOrder[] = [
    {
      id: 'ord-01',
      orderNo: 'FW20240620001',
      title: '水稻纹枯病 / 卷叶螟综合防治',
      serviceType: '上门植保服务',
      urgencyTag: '急单',
      urgencyBg: 'bg-red-600',
      status: 'in_progress',
      dispatchedAt: '2024-06-20T14:30:00+08:00',
      distanceKm: 3.2,
      farmerName: '李老伯 (张先生)',
      farmerPhone: '138****8888',
      farmerTag: 'VIP 种植大户',
      locationName: '长沙县安沙镇黄旗村 04组机耕道旁',
      roadCondition: '村道已全部硬化，皮卡及植保无人机作业车可直达田埂。',
      scheduledTime: '06-20 09:30-11:30',
      cropScale: '优质晚稻 · 约25亩',
      farmerQuote:
        '“叶片发黄卷曲，伴随褐色斑点，疑似稻瘟病或纹枯病，近两天阴雨扩散较快，急需老师傅实地看下方子并施药！”',
      farmerPhotos: [
        {
          label: '病斑叶片特写',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeOeRTPposhqafdFa1IcRswNjA8E46JBJ6WiFcDG_n1T0ZeNRw1-CdgumE9vspf3NDvQdSXBVwmIN4ke-idlv407mgtfEcrwKah1OcDy7vHKHgl0C6K5LNX5LEgX0qnPxf-mF2D1vXvV-kATBv8wtmfZK9vDjYQLuiZRNaOJnJ6m1j0ojgNHttn8Vx2tSXGdGws5CJo0t1dC7k68Y9-HaPQm8N__adA5bWdWChroXmHwNaJcmIZ0vK',
        },
        {
          label: '25亩田块全局',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIMtvbBVJcJtG2QetRfObF2JLaOS2xUSS1T5R-Otc9G7fUI5TMyREjHBEVTs6zoPaZJm_bOpVh1cMbz3pXiWmg5gd0-SfDLr1BkmecOPMfDSmOlNiNFH-yBoIEQZKyTb3YG0tz7uDK_XpEaR6Zf4gmg4Vow246V7CAYz1Vvr2y_096FaKalfyvHjL7TIqupqh-bTjS68qS53lEmRlU2lph9-61Pc_bndTUsD2uCgYbyL1rSA6cJ3K',
        },
      ],
      estimatedFeeCents: 24000,
      amoebaBonusCents: 9600,
      bonusPercent: 40,
      costBreakdown: [
        { item: '基础下乡诊断车马费', amountCents: 5000 },
        { item: '晚稻病虫害处方与施药指导 (25亩)', amountCents: 19000 },
        { item: '植保药剂/无人机飞防调拨', amountCents: 0, note: '现场依病害处方另计' },
      ],
      fieldEvidencePhotos: [
        {
          id: 'ev-1',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs_6zk0Bxl4Vfbdi-B1dRBELdJWY1Cp6jaxCH_Wk1v-IVY8uVCBZms-RibgwqaN3Wef6ZlYilPE458dhaFJ6dob0VblJJFgLiTGD8S8D9Zw851CbnTMLiL1kkUPiC5G-o9Pbb4jsNVkj6UCvPbeSzd-9bd-D6zCyDEfn2aLqN5s9WkuADAY-umaEvbH3aMXV7u-GjkAeHksDRRy-Exl3y7GRJv2lAeJmdjht2Mp-9wTe-NVEQ6H4jx',
          label: '安沙镇·病斑微距',
          time: '2024-06-20T14:32:00+08:00',
          location: '长沙县安沙镇',
        },
        {
          id: 'ev-2',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYyN0xfIm7vgr6QE5dUsWutwk7xLpl4CG3RBTqLk67zZD2uaJ4WEJ9VL-9D89GWV2sEodVCHOD7bgd_n4CwGCajpr7ELmLqzMsTHvbAIyFXjkth_CBzz9EjBkFQcIbUL7Tw5kTmHE3gxfs-mg9MPiKd7N4NYjryp1PJTKnd_i9cWO9tIgzpOBhTNCu_3xijntAbbeJgb4o2C8LEepFHlSYzm5lInuDW8x8EYcnM1maDsO4NUioanIf',
          label: '安沙镇·全景长势',
          time: '2024-06-20T14:35:00+08:00',
          location: '安沙镇黄旗村',
        },
      ],
      diagnosedTargets: ['纹枯病 (中度发生)', '稻纵卷叶螟 (初发期)'],
      agronomicAdvice:
        '建议立刻排水晒田2天抑制菌核扩散，傍晚无风时进行超低容量雾化飞防作业，药后4小时内若遇大雨需按半量重喷。',
      prescriptionDrugs: [
        {
          id: 'd1',
          name: '华农植保·75%肟菌·戊唑醇',
          spec: '悬浮剂 (100ml) · 2000倍液稀释叶面喷施',
          priceCents: 14400,
          qty: 3,
          code: '4301202409010018',
          tag: '码: 4301202409010018 · 已验正品',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdcV_evdBvb4CbFzf0aBJGk-43qYHWWF5YU6Kpvpj-fZa0jiP7w5DoluobDe7GjXbURL-9jRLLMfgI0WlH7bgOIuuSWCsQr3M9XhvhlnJKz3pd9Uj6YDSLfTmicw69ieQZ3XG8wxdNlKMFM8GwCud5W5T1WiwR7lBfNxxuqlq55OTrZJYkuGJ9fLrKM0MvdGjcy_9F2oa-vBlxst6gdxKFKIuTBoa7VYUMaet_BhmeCax_GTL3USz-',
        },
        {
          id: 'd2',
          name: '极飞特约·氯虫苯甲酰胺 200g/L',
          spec: '微乳剂 (100ml) · 亩用量10ml均匀雾化',
          priceCents: 13600,
          qty: 2,
          code: 'HN2406-03B',
          tag: '批次: HN2406-03B · 三证齐全',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr7fvZePkaKCG7OaozJ8O8StO-GwJnm_n61s_n-WheAMTNRAjD-pEYSOyvSso3zt9Lj88HMOipZNnohIdeWvsu_NlcStFwboYPyiRIdhqG3X2hUn3uyaQhcatA8QRHvwHMW98oged-qdPBf1pFP01HLW8cQfA_R27IpL2J3K1PUtIoBb6GRnv3gEAF_F1W2yQzrrTvcE4EEgxR6XslC0NFvxBkKX7EbLKljblvM3ONKPyHCrWdftC5',
        },
      ],
      laborFeeCents: 6000,
      deliveryNoteId: 'JG20240620982',
    },
    {
      id: 'ord-02',
      orderNo: 'FW20240620002',
      title: '大疆T50无人机管路清洗与校正',
      serviceType: '农机维保',
      urgencyTag: '农机维保',
      urgencyBg: 'bg-emerald-700',
      status: 'dispatching',
      dispatchedAt: '2024-06-20T14:17:00+08:00',
      distanceKm: 5.8,
      farmerName: '路口镇农机专业合作社 (刘队长)',
      farmerPhone: '139****1122',
      farmerTag: '签约合作社',
      locationName: '长沙县路口镇农机专业合作社院内',
      roadCondition: '水泥硬化道路，货车直达机库门口。',
      scheduledTime: '今日 15:00-17:00',
      cropScale: '无人机机队 · 3台T50',
      farmerQuote:
        '“3台T50连续作业2000亩后离心喷头有偏角雾化不均，水路出现细微堵塞，急需专业超声波清洗和流量计校准！”',
      farmerPhotos: [
        {
          label: '机库无人机现状',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYyN0xfIm7vgr6QE5dUsWutwk7xLpl4CG3RBTqLk67zZD2uaJ4WEJ9VL-9D89GWV2sEodVCHOD7bgd_n4CwGCajpr7ELmLqzMsTHvbAIyFXjkth_CBzz9EjBkFQcIbUL7Tw5kTmHE3gxfs-mg9MPiKd7N4NYjryp1PJTKnd_i9cWO9tIgzpOBhTNCu_3xijntAbbeJgb4o2C8LEepFHlSYzm5lInuDW8x8EYcnM1maDsO4NUioanIf',
        },
      ],
      estimatedFeeCents: 12000,
      amoebaBonusCents: 4800,
      bonusPercent: 40,
      costBreakdown: [
        { item: '标准农机出诊服务费', amountCents: 8000 },
        { item: '双离心喷嘴管路超声波养护', amountCents: 4000 },
      ],
      fieldEvidencePhotos: [],
      diagnosedTargets: ['离心喷盘微堵塞', '蠕动泵流量偏差'],
      agronomicAdvice:
        '拆卸喷嘴使用专用中性清洗剂进行超声波剥离清洗，复测双泵喷洒流量，误差控制在±3%以内。',
      prescriptionDrugs: [],
      laborFeeCents: 12000,
      deliveryNoteId: 'JG20240620983',
    },
    {
      id: 'ord-03',
      orderNo: 'FW20240620003',
      title: '柑橘红蜘蛛专项防治 + 微肥开方',
      serviceType: '配方上门',
      urgencyTag: '配方上门',
      urgencyBg: 'bg-amber-700',
      status: 'dispatching',
      dispatchedAt: '2024-06-20T14:01:00+08:00',
      distanceKm: 7.1,
      farmerName: '金井镇茶园村生态柑橘基地 (王场长)',
      farmerPhone: '137****3344',
      farmerTag: '核心示范园',
      locationName: '金井镇茶园村生态柑橘基地 2号陡坡',
      roadCondition: '山地水泥硬化路，转弯角度偏大，建议四驱或皮卡。',
      scheduledTime: '明日 08:30-11:00',
      cropScale: '爱媛38号柑橘 · 40亩',
      farmerQuote:
        '“叶背发现大量红蜘蛛幼螨和卵块，已有发灰黄化现象，请老师傅现场镜检并配出不伤幼果的配方！”',
      farmerPhotos: [
        {
          label: '柑橘叶背虫害自拍',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeOeRTPposhqafdFa1IcRswNjA8E46JBJ6WiFcDG_n1T0ZeNRw1-CdgumE9vspf3NDvQdSXBVwmIN4ke-idlv407mgtfEcrwKah1OcDy7vHKHgl0C6K5LNX5LEgX0qnPxf-mF2D1vXvV-kATBv8wtmfZK9vDjYQLuiZRNaOJnJ6m1j0ojgNHttn8Vx2tSXGdGws5CJo0t1dC7k68Y9-HaPQm8N__adA5bWdWChroXmHwNaJcmIZ0vK',
        },
      ],
      estimatedFeeCents: 26000,
      amoebaBonusCents: 10400,
      bonusPercent: 40,
      costBreakdown: [
        { item: '下乡显微诊断与定损', amountCents: 8000 },
        { item: '特种经济作物精准配方工时费', amountCents: 18000 },
      ],
      fieldEvidencePhotos: [],
      diagnosedTargets: ['柑橘红蜘蛛 (卵若螨并发)', '叶片缺锌缺镁黄化'],
      agronomicAdvice:
        '选用乙唑螨腈配合作物有机硅展着剂，清晨露水干后喷施叶背；搭配糖醇螯合锌镁叶面肥以迅速恢复树势叶色。',
      prescriptionDrugs: [
        {
          id: 'd3',
          name: '中化云谷·25%吡唑醚菌酯',
          spec: '微囊悬浮剂 (200ml) · 强效杀菌抑菌',
          priceCents: 8800,
          qty: 2,
          code: 'HN2406-08A',
          tag: '国标认准 · 绿色防控推荐',
          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdcV_evdBvb4CbFzf0aBJGk-43qYHWWF5YU6Kpvpj-fZa0jiP7w5DoluobDe7GjXbURL-9jRLLMfgI0WlH7bgOIuuSWCsQr3M9XhvhlnJKz3pd9Uj6YDSLfTmicw69ieQZ3XG8wxdNlKMFM8GwCud5W5T1WiwR7lBfNxxuqlq55OTrZJYkuGJ9fLrKM0MvdGjcy_9F2oa-vBlxst6gdxKFKIuTBoa7VYUMaet_BhmeCax_GTL3USz-',
        },
      ],
      laborFeeCents: 8000,
      deliveryNoteId: 'JG20240620984',
    },
  ];

  public amoeba: AmoebaStat = {
    totalMonthIncomeCents: 894000,
    growthPct: 22.4,
    serviceCommissionCents: 420000,
    serviceTasksCount: 35,
    groupTargetRate: 118,
    groupBaseline: 100,
    groupTierBonus: '超额提成提档至 1.25倍',
  };

  public feeds: TeamMemberFeed[] = [
    {
      id: 'f1',
      name: '李师弟',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB4xta4r7PAJTIc6ccs8Lg4UBc82pPzjrtMTkbJf6E4Gnblp7i7iDvfQxyWIfPI0S150jksXUrn5MaSjyg7eL7YSl5onLbD15MetzgWh3f3bbIM7EYOD33INt1aYFKz9vm1V3B-Clka46SM0t3yR0qVk_4M5B7XEaHYkbRo8BMlSeSoFadK32vKQp4-Anc78tYdz39Kl3JmZJG-US-nsqekmMrgtuKS39gAvAtErNxxdwlPcnsa_xBO',
      action: '刚刚完成',
      target: '【柑橘清园工单】',
      points: '+50 积分',
    },
    {
      id: 'f2',
      name: '王海涛',
      avatar:
        'https://lh3.googleusercontent.com/aida/AEtjO1UEttkVExuIo7_Eb6GhdaeIzQrTP34Pa3CPqtGmGXGTz5CC7huUBcvMtOsTQdfYC1lvyhCVahi_W0atcPuqiGca2zPLhDRlxSIOb-0Ko3lWfSA1Jhrmq0dj3A-oMFhUWvtQn-zwJWOBAVMUTggUKosIj9TMHWGO6p-Q00OGR1sEBDUTduMwRTlfd8VFU7AuE2xnK4_pIJCM8aiy0aEdrvmGC-QLUIRH0Goq_9YFS2fMhpuFd2UpricKrw',
      action: '成功推荐',
      target: '【长沙县水稻飞防联合体】',
      points: '+80 积分',
    },
  ];

  public transactions: RevenueTransaction[] = [
    {
      id: 't1',
      title: '黄旗村张老伯水稻植保工单',
      sub: '工单费 ¥60 + 处方分红 ¥38.4',
      amountCents: 9840,
      type: 'mixed',
      time: '2024-06-20T11:20:00+08:00',
    },
    {
      id: 't2',
      title: '春华镇优质柑橘营养方案出库',
      sub: '30+核心品牌流转分红 · 12%核算',
      amountCents: 14500,
      type: 'prescription',
      time: '2024-06-19T16:30:00+08:00',
    },
    {
      id: 't3',
      title: '推荐青年农艺师陈伟首单奖励',
      sub: '师徒结对阿米巴带教达标',
      amountCents: 5000,
      type: 'referral',
      time: '2024-06-18T00:00:00+08:00',
    },
    {
      id: 't4',
      title: '路口镇油菜角果期防蚜飞防',
      sub: '完成42亩低空精准喷施',
      amountCents: 21000,
      type: 'service',
      time: '2024-06-16T00:00:00+08:00',
    },
    {
      id: 't5',
      title: '华农安沙直营站6月上半期期权计提',
      sub: '技术骨干合伙人利润池沉淀',
      amountCents: 25000,
      type: 'mixed',
      time: '2024-06-15T00:00:00+08:00',
    },
  ];
}

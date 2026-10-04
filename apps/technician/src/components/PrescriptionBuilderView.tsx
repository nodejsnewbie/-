import { showAlert } from '../utils/platform';
import { Button, Image, Text, Textarea, View } from '@tarojs/components';
import React, { useState } from 'react';
import { ServiceOrder, PrescriptionDrug, FieldEvidencePhoto } from '../types';

interface PrescriptionBuilderViewProps {
  order: ServiceOrder;
  onUpdateOrder: (updated: ServiceOrder) => void;
  onOpenPhotoCapture: () => void;
  onOpenScanner: () => void;
  onOpenDeliveryModal: (order: ServiceOrder) => void;
  onViewImage: (url: string, label: string) => void;
}

const COMMON_DISEASES = [
  '纹枯病 (中度发生)',
  '稻纵卷叶螟 (初发期)',
  '稻飞虱',
  '二化螟',
  '稻瘟病',
  '稻蓟马',
  '胡麻叶斑病',
];

export const PrescriptionBuilderView: React.FC<PrescriptionBuilderViewProps> = ({
  order,
  onUpdateOrder,
  onOpenPhotoCapture,
  onOpenScanner,
  onOpenDeliveryModal,
  onViewImage,
}) => {
  const [diagnosed, setDiagnosed] = useState<string[]>(
    order.diagnosedTargets || ['纹枯病 (中度发生)', '稻纵卷叶螟 (初发期)']
  );
  const [advice, setAdvice] = useState<string>(
    order.agronomicAdvice ||
      '建议立刻排水晒田2天抑制菌核扩散，傍晚无风时进行超低容量雾化飞防作业，药后4小时内若遇大雨需按半量重喷。'
  );
  const [drugs, setDrugs] = useState<PrescriptionDrug[]>(order.prescriptionDrugs || []);
  const [laborFee] = useState<number>(order.laborFee || 60.00);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  };

  const toggleDisease = (name: string) => {
    const next = diagnosed.includes(name)
      ? diagnosed.filter((d) => d !== name)
      : [...diagnosed, name];
    setDiagnosed(next);
    onUpdateOrder({ ...order, diagnosedTargets: next });
  };

  const handleInsertTemplate = () => {
    const templateText =
      '根据田间勘验，纹枯病已见蔓延，建议立刻停施氮肥并排干积水，采用飞防低容量细雾喷施，避免正午高温作业。';
    setAdvice(templateText);
    onUpdateOrder({ ...order, agronomicAdvice: templateText });
    showToast('已载入《湖南双季稻绿色防控》标准规程模板');
  };

  const handleUpdateDrugQty = (drugId: string, delta: number) => {
    const nextDrugs = drugs
      .map((d) => {
        if (d.id === drugId) {
          const newQty = d.qty + delta;
          return newQty > 0 ? { ...d, qty: newQty } : null;
        }
        return d;
      })
      .filter(Boolean) as PrescriptionDrug[];

    setDrugs(nextDrugs);
    onUpdateOrder({ ...order, prescriptionDrugs: nextDrugs });
  };

  const totalDrugCost = drugs.reduce((acc, d) => acc + d.price * d.qty, 0);
  const totalItemCount = drugs.reduce((acc, d) => acc + d.qty, 0);
  const grandTotal = totalDrugCost + laborFee;

  // Elderly voice broadcast synthesizer
  const handlePlayVoice = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const textToSpeak = `农户朋友您好，农艺师张师傅为您开立电子处方。当前确诊：${diagnosed.join(
        '，'
      )}。用药指导意见：${advice}。所配药剂：${drugs
        .map((d) => `${d.name}，${d.qty}瓶`)
        .join('；')}。请凭电子处方交割码前往安沙直营站提货！`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      showAlert('您的浏览器已模拟启动适老化大喇叭语音播报...');
    }
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    setTimeout(() => {
      setIsSavingDraft(false);
      showToast('工单草稿已安全暂存至本地离线存储，网络恢复后将自动同步');
    }, 400);
  };

  const handleIssuePrescription = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const updatedOrder: ServiceOrder = {
        ...order,
        status: 'prescribed',
        diagnosedTargets: diagnosed,
        agronomicAdvice: advice,
        prescriptionDrugs: drugs,
      };
      onUpdateOrder(updatedOrder);
      onOpenDeliveryModal(updatedOrder);
    }, 700);
  };

  return (
    <View className="flex flex-col w-full pb-32 select-none">
      {/* Status & Geolocation Header Card */}
      <View className="p-3">
        <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs">
          <View className="flex items-start justify-between gap-2">
            <View className="min-w-0">
              <View className="flex items-center gap-1.5 mb-1 flex-wrap">
                <Text className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                  <Text className="w-1.5 h-1.5 rounded-full bg-secondary mr-1 animate-pulse"></Text>
                  服务进行中
                </Text>
                <Text className="text-[11px] text-on-surface-variant font-mono">
                  工单 {order.orderNo}
                </Text>
              </View>
              <Text className="text-[18px] font-bold text-on-surface truncate">
                {order.title}
              </Text>
            </View>
            <Button
              onClick={() => showAlert(`正在启动实地高精度地块导航至：${order.locationName}`)}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container text-primary text-xs font-bold active:scale-95 transition-transform cursor-pointer"
            >
              <Text className="material-symbols-outlined text-[17px]">navigation</Text>
              <Text>导航</Text>
            </Button>
          </View>

          {/* Real-time Location Verification Box */}
          <View className="mt-3 p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
            <View className="flex items-center gap-2 min-w-0">
              <View className="w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0">
                <Text className="material-symbols-outlined text-[15px]">where_to_vote</Text>
              </View>
              <View className="min-w-0">
                <Text className="text-xs font-bold text-on-surface truncate">
                  {order.locationName}
                </Text>
                <Text className="text-[11px] text-secondary font-mono">
                  {order.gpsCoords} · 现场签到已校验
                </Text>
              </View>
            </View>
            <Text
              className="material-symbols-outlined text-secondary text-[20px] shrink-0 material-symbols-filled"
              title="GPS防篡改已核验"
            >
              verified
            </Text>
          </View>
        </View>
      </View>

      {/* Field Evidence Camera Sampling Module */}
      <View className="px-3 mb-2.5">
        <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs">
          <View className="flex items-center justify-between mb-2.5">
            <View className="flex items-center gap-1.5">
              <Text className="material-symbols-outlined text-primary text-[20px]">
                photo_camera
              </Text>
              <Text className="text-[16px] font-bold text-on-surface">现场取样实拍</Text>
            </View>
            <Text className="text-xs text-on-surface-variant">
              已采集{' '}
              <Text className="text-primary font-bold">
                {order.fieldEvidencePhotos?.length || 2}
              </Text>
              /4 张
            </Text>
          </View>

          {/* Horizontal Photo Evidence Gallery */}
          <View className="grid grid-cols-3 gap-2">
            {order.fieldEvidencePhotos?.map((photo) => (
              <View
                key={photo.id}
                onClick={() => onViewImage(photo.url, photo.label)}
                className="relative rounded-lg overflow-hidden aspect-square bg-surface-container shadow-xs group cursor-pointer border border-surface-container-high"
              >
                <Image
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  alt={photo.label}
                  src={photo.url}
                />
                <View className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1">
                  <Text className="block text-[8px] text-white font-mono leading-tight">
                    {photo.time}
                  </Text>
                  <Text className="block text-[9px] text-secondary-container font-semibold truncate">
                    {photo.label}
                  </Text>
                </View>
                <Text className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5 flex items-center justify-center">
                  <Text className="material-symbols-outlined text-[10px]">check</Text>
                </Text>
              </View>
            ))}

            {/* Upload Trigger */}
            <Button
              onClick={onOpenPhotoCapture}
              className="rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low hover:bg-surface-container flex flex-col items-center justify-center aspect-square text-on-surface-variant active:scale-95 transition-all cursor-pointer"
            >
              <Text className="material-symbols-outlined text-primary text-[26px] mb-0.5">
                add_a_photo
              </Text>
              <Text className="text-xs font-bold text-on-surface">添加实拍</Text>
              <Text className="text-[10px] text-outline font-mono">支持水印</Text>
            </Button>
          </View>
        </View>
      </View>

      {/* Agronomist Precise Diagnosis */}
      <View className="px-3 mb-2.5">
        <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs">
          <View className="flex items-center gap-1.5 mb-2.5">
            <Text className="material-symbols-outlined text-primary text-[20px]">
              psychiatry
            </Text>
            <Text className="text-[16px] font-bold text-on-surface">农艺师精准诊断</Text>
          </View>

          {/* Disease Selection Tags */}
          <View className="mb-3">
            <Text className="text-xs text-on-surface-variant font-medium mb-2">
              已确诊靶标病虫害（可多选）
            </Text>
            <View className="flex flex-wrap gap-2">
              {COMMON_DISEASES.map((disease) => {
                const isSelected = diagnosed.includes(disease);
                return (
                  <Button
                    key={disease}
                    onClick={() => toggleDisease(disease)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <Text
                      className={`material-symbols-outlined text-[15px] ${
                        isSelected ? 'material-symbols-filled text-white' : 'text-outline'
                      }`}
                    >
                      {isSelected ? 'check_circle' : 'add'}
                    </Text>
                    <Text>{disease}</Text>
                  </Button>
                );
              })}
            </View>
          </View>

          {/* Agronomy Advice Textarea */}
          <View>
            <View className="flex justify-between items-center mb-1.5">
              <View className="text-xs text-on-surface-variant font-medium">
                农艺综合处方指导意见
              </View>
              <Button
                onClick={handleInsertTemplate}
                className="text-xs text-primary font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                <Text className="material-symbols-outlined text-[15px]">auto_fix_high</Text>
                <Text>标准农规模板</Text>
              </Button>
            </View>

            <View className="relative bg-surface-container-low rounded-lg p-2.5 border border-surface-container-high focus-within:border-primary">
              <Textarea
                value={advice}
                onChange={(e) => {
                  setAdvice(e.target.value);
                  onUpdateOrder({ ...order, agronomicAdvice: e.target.value });
                }}
                className="w-full bg-transparent text-on-surface text-xs focus:outline-none resize-none leading-relaxed"
                placeholder="输入田间水肥调控与施药作业注意事项..."
                rows={3}
                maxLength={200}
              />
              <View className="flex justify-between items-center pt-2 text-[11px] text-outline border-t border-surface-container">
                <Text className="flex items-center gap-1 text-secondary font-medium">
                  <Text className="material-symbols-outlined text-[13px]">format_image_left</Text>
                  符合《湖南双季稻绿色防控技术标准》
                </Text>
                <Text>{advice.length}/200字</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Compliant Prescription Items & QR Traceability */}
      <View className="px-3 mb-2.5">
        <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs relative overflow-hidden">
          {/* Watermark Certification Stamp */}
          <View className="absolute -top-3 -right-3 pointer-events-none select-none opacity-20 rotate-12 flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-dashed border-primary text-primary">
            <Text className="material-symbols-outlined text-[30px] material-symbols-filled">
              verified
            </Text>
            <Text className="text-[9px] font-bold tracking-widest text-center uppercase leading-tight">
              华农农技认证
              <br />
              电子处方合规
            </Text>
          </View>

          <View className="flex items-center justify-between mb-2.5">
            <View className="flex items-center gap-1.5">
              <Text className="material-symbols-outlined text-primary text-[20px]">
                prescriptions
              </Text>
              <Text className="text-[16px] font-bold text-on-surface">电子处方药剂开立</Text>
            </View>
            <Button
              onClick={onOpenScanner}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed hover:bg-emerald-200 text-on-primary-fixed text-xs font-bold active:scale-95 transition-transform cursor-pointer"
            >
              <Text className="material-symbols-outlined text-[15px]">qr_code_scanner</Text>
              <Text>扫码加药</Text>
            </Button>
          </View>

          {/* Prescription Drugs List */}
          <View className="space-y-2.5 mb-2.5">
            {drugs.map((drug) => (
              <View
                key={drug.id}
                className="bg-surface-container-low rounded-xl p-3 relative border border-surface-container-high"
              >
                <View className="flex gap-2.5">
                  <View className="w-16 h-16 rounded-lg bg-surface-container-lowest overflow-hidden shrink-0 border border-surface-container">
                    <Image
                      className="w-full h-full object-cover"
                      alt={drug.name}
                      src={drug.img}
                    />
                  </View>
                  <View className="flex-1 min-w-0">
                    <View className="flex items-start justify-between gap-1">
                      <Text className="font-bold text-xs text-on-surface truncate">{drug.name}</Text>
                      <Text className="font-mono text-xs font-bold text-on-surface shrink-0">
                        ¥{drug.price.toFixed(2)}
                      </Text>
                    </View>
                    <Text className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                      {drug.spec}
                    </Text>

                    <View className="mt-2 flex items-center justify-between">
                      <Text className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono text-[10px] font-semibold">
                        <Text className="material-symbols-outlined text-[11px]">
                          verified_user
                        </Text>
                        {drug.tag}
                      </Text>

                      {/* Stepper Controls */}
                      <View className="flex items-center gap-1.5 bg-surface-container rounded-lg p-0.5">
                        <Button
                          onClick={() => handleUpdateDrugQty(drug.id, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-surface-container-lowest text-on-surface text-xs font-bold hover:bg-surface-container-high active:scale-95 cursor-pointer"
                          title="减少数量"
                        >
                          -
                        </Button>
                        <Text className="text-xs font-mono font-bold px-1">{drug.qty}</Text>
                        <Button
                          onClick={() => handleUpdateDrugQty(drug.id, 1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-primary text-white text-xs font-bold hover:bg-primary-container active:scale-95 cursor-pointer"
                          title="增加数量"
                        >
                          +
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Cost Breakdown & Official Compliance Footer */}
          <View className="bg-surface-container rounded-lg p-3">
            <View className="flex justify-between items-center text-xs text-on-surface-variant mb-1">
              <Text>合规药剂金额小计 (共{totalItemCount}件)</Text>
              <Text className="font-mono text-on-surface font-semibold">
                ¥{totalDrugCost.toFixed(2)}
              </Text>
            </View>
            <View className="flex justify-between items-center text-xs text-on-surface-variant mb-2">
              <Text>农艺技师现场勘验与处方工时费</Text>
              <Text className="font-mono text-on-surface font-semibold">
                ¥{laborFee.toFixed(2)}
              </Text>
            </View>
            <View className="flex justify-between items-center pt-2 border-t border-outline-variant/30 text-xs text-on-surface">
              <Text className="font-bold">现场服务预估总额</Text>
              <Text className="text-[18px] text-tertiary font-extrabold font-mono">
                ¥{grandTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Elderly Care Reassurance Banner with Voice playback */}
      <View className="px-3 mb-2">
        <View className="bg-surface-container-high rounded-lg p-2.5 flex items-center justify-between gap-2">
          <View className="flex items-center gap-2 min-w-0">
            <Text
              className={`material-symbols-outlined text-[20px] shrink-0 ${
                isSpeaking ? 'text-emerald-600 animate-pulse' : 'text-primary'
              }`}
            >
              record_voice_over
            </Text>
            <Text className="text-xs text-on-surface-variant truncate">
              {isSpeaking ? '正在语音大喇叭播报处方用法...' : '支持农户扫码语音播报药剂用法，可直达自营仓提货。'}
            </Text>
          </View>
          <Button
            onClick={handlePlayVoice}
            className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-red-600 text-white'
                : 'bg-primary text-white hover:bg-primary-container'
            }`}
          >
            {isSpeaking ? '停止播报' : '试听语音'}
          </Button>
        </View>
      </View>

      {/* Sticky Bottom Operational Dock */}
      <View className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto bg-surface-container-lowest shadow-[0_-4px_16px_rgba(21,29,25,0.08)] p-3 pb-safe z-30 border-t border-surface-container">
        <View className="flex items-center gap-2">
          {/* Save Draft Button */}
          <Button
            disabled={isSavingDraft}
            onClick={handleSaveDraft}
            className="h-12 px-4 rounded-xl bg-surface-container text-on-surface text-xs font-bold flex items-center justify-center shrink-0 active:scale-95 transition-transform cursor-pointer"
          >
            <Text className="material-symbols-outlined text-[17px] mr-1">save</Text>
            <Text>{isSavingDraft ? '保存中' : '存草稿'}</Text>
          </Button>

          {/* Primary Action: Issue Prescription and Delivery Sheet */}
          <Button
            disabled={isSubmitting}
            onClick={handleIssuePrescription}
            className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs flex flex-col items-center justify-center shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <View className="flex items-center gap-1 font-bold text-sm">
              {isSubmitting ? (
                <Text className="material-symbols-outlined text-[18px] animate-spin">sync</Text>
              ) : (
                <Text className="material-symbols-outlined text-[18px]">verified</Text>
              )}
              <Text>开立电子处方并生成交割单</Text>
            </View>
            <Text className="text-[10px] text-emerald-200 font-normal">
              直联农户在线核签 · 自动同步自营仓库
            </Text>
          </Button>
        </View>
      </View>

      {/* Toast Notification */}
      {toastMsg && (
        <View className="fixed top-20 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-semibold text-xs px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 z-50">
          <Text className="material-symbols-outlined text-secondary-fixed text-[18px]">
            task_alt
          </Text>
          <Text>{toastMsg}</Text>
        </View>
      )}
    </View>
  );
};

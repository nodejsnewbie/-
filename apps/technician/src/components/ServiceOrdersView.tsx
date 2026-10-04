import { Button, Text, View } from '@tarojs/components';
import React, { useState } from 'react';
import { ServiceOrder } from '../types';

interface ServiceOrdersViewProps {
  orders: ServiceOrder[];
  onSelectOrder: (order: ServiceOrder) => void;
  onOpenPrescription: (order: ServiceOrder) => void;
  onOpenDelivery: (order: ServiceOrder) => void;
}

export const ServiceOrdersView: React.FC<ServiceOrdersViewProps> = ({
  orders,
  onSelectOrder,
  onOpenPrescription,
  onOpenDelivery,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_progress' | 'prescribed' | 'completed'>('all');

  const filterMap = {
    all: orders,
    pending: orders.filter((o) => o.status === 'dispatching'),
    in_progress: orders.filter((o) => o.status === 'in_progress' || o.status === 'accepted'),
    prescribed: orders.filter((o) => o.status === 'prescribed'),
    completed: orders.filter((o) => o.status === 'completed'),
  };

  const displayedOrders = filterMap[activeTab];

  return (
    <View className="flex flex-col w-full px-3 pb-24 gap-3 select-none">
      {/* Top Filter Tabs */}
      <View className="flex items-center justify-between bg-surface-container-lowest p-1.5 rounded-xl shadow-xs gap-1">
        <Button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          全部 ({orders.length})
        </Button>
        <Button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          待接单 (2)
        </Button>
        <Button
          onClick={() => setActiveTab('in_progress')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'in_progress'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          勘验中 (1)
        </Button>
        <Button
          onClick={() => setActiveTab('prescribed')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'prescribed'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          待交割
        </Button>
      </View>

      {/* Orders List */}
      <View className="flex flex-col gap-2.5">
        {displayedOrders.map((order) => {
          const isPrescribed = order.status === 'prescribed';
          const isInProgress = order.status === 'in_progress' || order.status === 'accepted';

          return (
            <View
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container flex flex-col gap-2 hover:shadow-md transition-all cursor-pointer"
            >
              <View className="flex items-center justify-between">
                <View className="flex items-center gap-1.5">
                  <Text
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                      order.urgencyTag === '急单'
                        ? 'bg-red-600'
                        : order.urgencyTag === '农机维保'
                        ? 'bg-emerald-700'
                        : 'bg-amber-700'
                    }`}
                  >
                    {order.serviceType}
                  </Text>
                  <Text className="font-mono text-xs text-on-surface-variant font-semibold">
                    {order.orderNo}
                  </Text>
                </View>
                <Text
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isPrescribed
                      ? 'bg-amber-100 text-amber-900'
                      : isInProgress
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {isPrescribed ? '处方已开·待农户签收' : isInProgress ? '服务进行中' : '待确认接单'}
                </Text>
              </View>

              <Text className="text-sm font-bold text-on-surface">{order.title}</Text>

              <View className="text-xs text-on-surface-variant space-y-1">
                <View className="flex items-center gap-1.5">
                  <Text className="material-symbols-outlined text-[15px] text-primary">person</Text>
                  <Text>{order.farmerName}</Text>
                  <Text className="text-outline-variant">·</Text>
                  <Text>{order.cropScale}</Text>
                </View>
                <View className="flex items-center gap-1.5">
                  <Text className="material-symbols-outlined text-[15px] text-outline">
                    location_on
                  </Text>
                  <Text className="truncate">{order.locationName}</Text>
                </View>
              </View>

              <View className="flex items-center justify-between pt-2 border-t border-surface-container mt-1">
                <View className="flex items-baseline gap-1">
                  <Text className="text-xs text-on-surface-variant">服务费</Text>
                  <Text className="text-base font-extrabold text-primary font-mono">
                    ¥{order.estimatedFee.toFixed(2)}
                  </Text>
                  <Text className="text-[10px] text-amber-700 font-bold ml-1">
                    (提成 +¥{order.amoebaBonus})
                  </Text>
                </View>

                <View className="flex items-center gap-1.5">
                  {isInProgress && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPrescription(order);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      现场勘验开方
                    </Button>
                  )}
                  {isPrescribed && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDelivery(order);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      查看交割单
                    </Button>
                  )}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOrder(order);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer"
                  >
                    工单详情
                  </Button>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { TraceBanner } from './components/TraceBanner.tsx';
import { PromoCard } from './components/PromoCard.tsx';
import { CategoryFilter } from './components/CategoryFilter.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ScanModal } from './components/ScanModal.tsx';
import { TraceResultModal } from './components/TraceResultModal.tsx';
import { GuideModal } from './components/GuideModal.tsx';
import { DosageCalculatorModal } from './components/DosageCalculatorModal.tsx';
import { DoorstepBookingModal } from './components/DoorstepBookingModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { HomeTab } from './components/HomeTab.tsx';
import { DoorstepTab } from './components/DoorstepTab.tsx';
import { ProfileTab } from './components/ProfileTab.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { PRODUCTS, AGRONOMISTS } from './data/mockData.ts';
import { MallProduct, CartItem, ServiceBooking, TraceVerificationResult } from '@hnhall/shared';
import { api } from './services/api.ts';
import { CheckCircle2, ShieldCheck, Smartphone, Maximize2 } from 'lucide-react';

export default function App() {
  // Navigation & Tabs
  const [currentTab, setCurrentTab] = useState<string>('mall');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // Shopping Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Doorstep Service Bookings
  const [bookings, setBookings] = useState<ServiceBooking[]>([
    {
      id: 'BK-20241001-01',
      serviceType: 'drone_spraying',
      cropType: '双季晚稻 (优质杂交稻)',
      acreage: 45,
      preferredDate: '2024-10-02',
      timeSlot: '上午 (07:00-11:00 飞防适期)',
      station: '长沙县安沙农资自营直供中心',
      contactName: '李建平',
      contactPhone: '138-7589-9921',
      plotAddress: '长沙县安沙镇水渡河村8组高产片区',
      associatedProducts: ['华农植保·75%肟菌·戊唑醇悬浮剂', '湘农丰·磷酸二氢钾'],
      status: 'in_progress',
      assignedAgronomist: {
        name: AGRONOMISTS[0].name,
        certId: AGRONOMISTS[0].certNumber,
        phone: '139-7312-8800',
        title: AGRONOMISTS[0].title,
      },
    },
  ]);

  // Modals
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [traceResult, setTraceResult] = useState<TraceVerificationResult | null>(null);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [dosageModalProduct, setDosageModalProduct] = useState<MallProduct | null>(null);
  const [bookingModalProduct, setBookingModalProduct] = useState<MallProduct | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Viewport mode (Mobile phone frame on desktop vs Fullscreen)
  const [isDesktopFullscreen, setIsDesktopFullscreen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  // Cart calculations
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 全部: PRODUCTS.length };
    PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchCat = selectedCategory === '全部' || product.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.licenseNo.toLowerCase().includes(q) ||
        product.tags.some((t) => t.toLowerCase().includes(q)) ||
        product.targetDisease.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handlers
  const handleVerify = async (code: string) => {
    showToast('正在向国家农药电子追溯系统验证...');
    const res = await api.verifyTraceCode(code);
    setTraceResult(res);
    if (res.isValid) {
      showToast('溯源验真成功：原厂正品入库在档');
    } else {
      showToast('安全警示：该码异常或未备案！');
    }
  };

  const handleScanComplete = (code: string) => {
    setScanModalOpen(false);
    handleVerify(code);
  };

  const handleAddToCart = (product: MallProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`已加入采购清单：${product.name.split('·')[0]}`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('采购清单已清空');
  };

  const handleCheckout = async () => {
    showToast('正在提交实体站闪送订单...');
    await api.createOrder(cart);
    showToast('下单成功！长沙县安沙直营站正准备闪送发货...');
    setCartOpen(false);
    setCart([]);
  };

  const handleOpenBookingModal = (product?: MallProduct) => {
    setBookingModalProduct(product || null);
    setBookingModalOpen(true);
  };

  const handleSubmitBooking = async (newBooking: ServiceBooking) => {
    showToast('正在向自营服务站调度派单...');
    const created = await api.createBooking(newBooking);
    setBookings((prev) => [created, ...prev]);
    showToast('上门施用预约成功！农艺师将致电确认');
    setCurrentTab('doorstep');
  };

  return (
    <div className="min-h-screen bg-[#e7f0e8] flex flex-col items-center justify-center p-0 sm:py-6 selection:bg-[#8ef5b5] selection:text-[#004425]">
      {/* Desktop Responsive Toolbar (Only visible on larger screens) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-2 px-2 text-[12px] text-[#404941]">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-[#004425]" />
          <span>移动端真机视图 (iPhone 14/15 规范 390×844)</span>
        </div>
        <button
          onClick={() => setIsDesktopFullscreen(!isDesktopFullscreen)}
          className="flex items-center gap-1 hover:text-[#004425] bg-white/70 px-2 py-1 rounded-md border border-[#bfc9bf]/60 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>{isDesktopFullscreen ? '居中手机框' : '自适应展宽'}</span>
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full bg-[#f3fcf3] text-[#151d19] flex flex-col relative shadow-2xl transition-all duration-300 overflow-hidden ${
          isDesktopFullscreen
            ? 'max-w-[720px] h-[92vh] sm:rounded-2xl border border-[#bfc9bf]/60'
            : 'max-w-[390px] h-[844px] max-h-[844px] sm:rounded-[36px] sm:border-[8px] sm:border-slate-800'
        }`}
      >
        {/* Fixed Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenScan={() => setScanModalOpen(true)}
        />

        {/* Scrollable Body Content */}
        <main className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5 scroll-smooth">
          {/* TAB 1: 溯源商城 (Mall - Active by default) */}
          {currentTab === 'mall' && (
            <>
              {/* Scan & Trace Verification Banner */}
              <TraceBanner
                onVerify={handleVerify}
                onOpenScan={() => setScanModalOpen(true)}
                onOpenGuide={() => setGuideModalOpen(true)}
              />

              {/* Promotion / Service Incentive Card */}
              <PromoCard cartTotal={cartTotal} onGoOrder={() => setCartOpen(true)} />

              {/* Category Tabs */}
              <CategoryFilter
                activeCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                categoryCounts={categoryCounts}
              />

              {/* MallProduct Cards List */}
              <section className="space-y-3">
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center text-[#707971] border border-[#e2eae2]">
                    <p className="text-[13px] font-medium">未找到符合条件的农药或耗材</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('全部');
                        setSearchQuery('');
                      }}
                      className="mt-2 text-[12px] font-bold text-[#006d40] underline cursor-pointer"
                    >
                      清空条件查看全部商品
                    </button>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                      onBookService={(p) => handleOpenBookingModal(p)}
                      onOpenDetail={(p) => setDosageModalProduct(p)}
                    />
                  ))
                )}
              </section>

              {/* Bottom Trust Badges */}
              <section className="bg-[#edf6ee]/70 rounded-xl p-3 text-center border border-[#e2eae2]">
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#004425] mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#006d40]" />
                  <span>农业农村部指定农资追溯体系直连</span>
                </div>
                <p className="text-[10px] text-[#707971] leading-relaxed">
                  假一赔十 · 48小时内田间复诊保障 · 留痕可溯可控
                </p>
              </section>
            </>
          )}

          {/* TAB 2: 上门预约 (Doorstep Booking & Tracking) */}
          {currentTab === 'doorstep' && (
            <DoorstepTab
              bookings={bookings}
              onOpenNewBooking={() => handleOpenBookingModal()}
              onCallAgronomist={(name, phone) => {
                showToast(`正在呼叫 ${name} 专家: ${phone}`);
              }}
            />
          )}

          {/* TAB 3: 首页 (Home Dashboard) */}
          {currentTab === 'home' && (
            <HomeTab
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              onOpenScan={() => setScanModalOpen(true)}
              onOpenBooking={() => handleOpenBookingModal()}
              onSelectProduct={(p) => setDosageModalProduct(p)}
            />
          )}

          {/* TAB 4: 我的 (Profile & Digital Ledger) */}
          {currentTab === 'profile' && (
            <ProfileTab
              onOpenGuide={() => setGuideModalOpen(true)}
              onCallService={() => {
                showToast('已拨通长沙县安沙自营站值班热线');
              }}
            />
          )}

          {/* Bottom spacing */}
          <div className="h-4"></div>
        </main>

        {/* Fixed Bottom Tab Bar */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          cartCount={totalCartCount}
          onOpenCart={() => setCartOpen(true)}
        />

        {/* Interactive Toast Feedback */}
        {toastMsg && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#151d19]/90 backdrop-blur-md text-[#f3fcf3] text-[12px] font-medium px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-fade-in pointer-events-none">
            <CheckCircle2 className="w-4 h-4 text-[#8ef5b5]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modals & Drawers */}
        <ScanModal
          isOpen={scanModalOpen}
          onClose={() => setScanModalOpen(false)}
          onScanComplete={handleScanComplete}
        />

        <TraceResultModal
          result={traceResult}
          onClose={() => setTraceResult(null)}
          onBookService={(prodName) => {
            setTraceResult(null);
            const found = PRODUCTS.find((p) => prodName.includes(p.name.split('·')[0]));
            handleOpenBookingModal(found);
          }}
        />

        <GuideModal isOpen={guideModalOpen} onClose={() => setGuideModalOpen(false)} />

        <DosageCalculatorModal
          product={dosageModalProduct}
          isOpen={!!dosageModalProduct}
          onClose={() => setDosageModalProduct(null)}
          onAddToCart={(p, qty) => handleAddToCart(p, qty)}
          onBookService={(p, _acreage) => {
            setDosageModalProduct(null);
            handleOpenBookingModal(p);
          }}
        />

        <DoorstepBookingModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setBookingModalProduct(null);
          }}
          initialProduct={bookingModalProduct}
          onSubmitBooking={handleSubmitBooking}
        />

        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}

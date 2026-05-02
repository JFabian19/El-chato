import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Minus, X, Anchor, Trash2 } from 'lucide-react'
import { FaWhatsapp, FaTiktok } from 'react-icons/fa'
import menuDataJson from './data.json'
import type { MenuData, MenuItem, CartItem } from './types'
import clsx from 'clsx'

const data = menuDataJson as MenuData
const DELIVERY_FEE = 4


const InfinityMarquee = () => {
  return (
    <div className="bg-secondary py-2 overflow-hidden relative border-y-4 border-black z-10 shadow-sm">
      <motion.div
        className="whitespace-nowrap flex"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
      >
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className="font-title text-xl tracking-wider text-black mx-4">
            FOODTRUCK EL CHATO • DÚOS Y TRÍOS MARINOS • DELIVERY AL {data.informacion_restaurante.whatsapp[0]} • SABOR DE LA CALLE • 
          </span>
        ))}
      </motion.div>
    </div>
  )
}

const ProductCard = ({
  item,
  onAdd
}: {
  item: MenuItem;
  onAdd: (item: MenuItem, variacion?: string, price?: number) => void;
}) => {
  const hasOptions = item.opciones && item.opciones.length > 0;
  const [selectedOption, setSelectedOption] = useState<string>(
    hasOptions ? item.opciones![0] : ''
  );

  const currentPrice = item.precio;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/80 rounded-[1.5rem] p-3 sm:p-4 shadow-sm border-[3px] border-black relative transition-shadow hover:shadow-lg backdrop-blur-md flex flex-col h-full"
    >
      <div className="absolute top-[-12px] right-[-10px] z-10">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="comic-badge bg-[#FFD700] text-black text-sm sm:text-lg font-bold px-2 py-1 sm:px-3 sm:py-1 border-2 sm:border-[3px]"
        >
          S/ {currentPrice?.toFixed(2)}
        </motion.div>
      </div>

      <div className="w-full aspect-square bg-gray-200 rounded-xl mb-3 flex items-center justify-center overflow-hidden border-2 border-black/10 shrink-0">
        {item.imagen ? (
          <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 font-ui text-xs sm:text-sm">Sin imagen</span>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="font-body text-base sm:text-xl text-primary leading-tight mb-2 pr-0 sm:pr-0">
          {item.nombre.split('(')[0].trim()}
        </h3>
        
        {item.nombre.includes('(') && (
          <div className="text-[11px] sm:text-xs text-gray-600 font-ui mb-3 flex flex-col gap-1">
            {item.nombre.split('(')[1].replace(')', '').split(/\s*[-–]\s*/).map((part, index) => {
              const trimmedPart = part.trim();
              const capitalizedPart = trimmedPart.charAt(0).toUpperCase() + trimmedPart.slice(1);
              return (
                <div key={index} className="flex items-start gap-1.5">
                  <span className="text-secondary text-[10px] mt-[3px]">●</span>
                  <span className="flex-1 leading-snug">{capitalizedPart}</span>
                </div>
              );
            })}
          </div>
        )}
      
      {item.opcion && (
        <div className="text-[11px] sm:text-xs text-gray-600 font-ui mb-3 mt-1 flex flex-col gap-1">
          {item.opcion.split(/\s*[-–]\s*/).map((part, index) => {
            const trimmedPart = part.trim();
            const capitalizedPart = trimmedPart.charAt(0).toUpperCase() + trimmedPart.slice(1);
            return (
              <div key={index} className="flex items-start gap-1.5">
                <span className="text-secondary text-[10px] mt-[3px]">●</span>
                <span className="flex-1 leading-snug">{capitalizedPart}</span>
              </div>
            );
          })}
        </div>
      )}

      {hasOptions && (
        <div className="flex flex-col gap-1.5 mb-2 mt-2 w-full">
          {item.opciones!.map(p => (
            <button
              key={p}
              onClick={() => setSelectedOption(p)}
              className={clsx(
                "px-3 py-2 rounded-2xl text-[10px] sm:text-xs font-ui font-bold border-2 transition-colors text-left",
                selectedOption === p
                  ? "bg-secondary text-black border-black"
                  : "bg-gray-100 text-gray-500 border-gray-300 hover:border-black"
              )}
            >
              <div className="flex flex-col gap-0.5">
                {p.split(/\s*[-–]\s*/).map((part, idx) => {
                  const trimmedPart = part.trim();
                  const capitalizedPart = trimmedPart.charAt(0).toUpperCase() + trimmedPart.slice(1);
                  return (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className={clsx("text-[9px] mt-[3px]", selectedOption === p ? "text-primary" : "text-gray-400")}>●</span>
                      <span className="flex-1 leading-tight">{capitalizedPart}</span>
                    </div>
                  );
                })}
              </div>
            </button>
          ))}
        </div>
      )}

      </div>

      <div className="flex justify-end mt-2 shrink-0">
        <button
          onClick={() => onAdd(item, hasOptions ? selectedOption : undefined, currentPrice)}
          className="bg-primary hover:bg-primary/90 text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center border-2 sm:border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-1 active:translate-x-1"
        >
          <Plus size={20} className="text-white" strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
};

function App() {
  const [activeCategory, setActiveCategory] = useState<string>(data.menu[0].categoria)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = data.menu.map(c => document.getElementById(c.categoria));
      
      let currentActive = activeCategory;
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 150) {
            currentActive = section.id;
          }
        }
      }

      if (currentActive !== activeCategory) {
        setActiveCategory(currentActive);
        const navBtn = document.getElementById(`nav-${currentActive}`);
        if (navBtn) {
          navBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }, [cart])

  const finalTotal = useMemo(() => {
    return cartTotal > 0 ? cartTotal + DELIVERY_FEE : 0;
  }, [cartTotal])

  const cartItemsCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.cantidad, 0)
  }, [cart])

  const addToCart = (item: MenuItem, variacion?: string, price?: number) => {
    if (!price) return;
    const id = `${item.nombre}-${variacion || 'default'}`;
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing) {
        return prev.map(c => c.id === id ? { ...c, cantidad: c.cantidad + 1 } : c);
      }
      return [...prev, { id, nombre: item.nombre, variacion, precio: price, cantidad: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, cantidad: c.cantidad + delta };
      }
      return c;
    }).filter(c => c.cantidad > 0));
  };



  const sendWhatsAppOrder = () => {
    const phone = data.informacion_restaurante.whatsapp[0];
    let message = `¡Hola *${data.informacion_restaurante.nombre}*! 🌊 Me gustaría pedir lo siguiente:\n\n`;
    
    cart.forEach(item => {
      const details = item.variacion ? ` (${item.variacion})` : '';
      message += `▪ ${item.cantidad}x ${item.nombre}${details} - S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    
    message += `\n*Subtotal:* S/ ${cartTotal.toFixed(2)}`;
    message += `\n*Delivery:* S/ ${DELIVERY_FEE.toFixed(2)}`;
    message += `\n*Total:* S/ ${finalTotal.toFixed(2)}`;
    
    const url = `https://wa.me/51${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex justify-center min-h-screen bg-transparent w-full">
      <div className="w-full max-w-[500px] min-h-screen bg-white/40 shadow-[0_0_40px_rgba(0,0,0,0.1)] relative flex flex-col backdrop-blur-sm">
        
        {/* Header */}
        <header className="sticky top-0 z-50 glass px-4 py-3 flex justify-between items-center rounded-b-3xl">
          <h1 className="font-title text-3xl text-primary drop-shadow-sm tracking-wide">
            EL CHATO
          </h1>
          <div className="flex gap-2">
            <a href="https://www.tiktok.com/@foodtruckelchato?_r=1&_t=ZS-95yhlUGVAor" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-black border-2 border-black flex justify-center items-center hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <FaTiktok size={18} className="text-white" />
            </a>
            <a href={`https://wa.me/51${data.informacion_restaurante.whatsapp[0]}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#25D366] border-2 border-black flex justify-center items-center hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <FaWhatsapp size={22} className="text-white" />
            </a>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-10 h-10 rounded-full bg-primary border-2 border-black flex justify-center items-center relative hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <ShoppingCart size={20} className="text-white" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-black font-ui font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <InfinityMarquee />

        {/* Banner */}
        <div className="px-4 mt-4">
          <img 
            src="/banner.png" 
            alt="Banner El Chato" 
            className="w-full rounded-[2rem] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
          />
        </div>

        {/* Category Nav */}
        <nav className="sticky top-[72px] z-40 glass py-3 mt-4 mx-2 rounded-2xl">
          <div className="flex overflow-x-auto hide-scrollbar px-2 gap-2">
            {data.menu.map(cat => (
              <button
                key={cat.categoria}
                id={`nav-${cat.categoria}`}
                onClick={() => {
                  setActiveCategory(cat.categoria);
                  document.getElementById(cat.categoria)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={clsx(
                  "whitespace-nowrap px-4 py-2 rounded-full font-body text-sm border-2 transition-all",
                  activeCategory === cat.categoria
                    ? "bg-primary text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]"
                    : "bg-white text-gray-600 border-transparent hover:border-gray-300"
                )}
              >
                {cat.categoria}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 p-4 pb-32">
          {data.menu.map(cat => (
            <div key={cat.categoria} id={cat.categoria} className="mb-8 pt-4">
              <div className="flex items-center gap-2 mb-6">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0], y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="shrink-0"
                >
                  <Anchor className="text-secondary w-8 h-8 sm:w-10 sm:h-10" strokeWidth={2.5} />
                </motion.div>
                <h2 className="font-title text-3xl sm:text-4xl text-primary tracking-wide drop-shadow-sm mb-0 leading-none">
                  {cat.categoria}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {cat.items.map((item, idx) => (
                  <ProductCard 
                    key={`${item.nombre}-${idx}`}
                    item={item}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Floating Cart Bar */}
      <AnimatePresence>
        {cartItemsCount > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 w-full flex justify-center px-4 z-50 pointer-events-none"
          >
            <div className="w-full max-w-[460px] pointer-events-auto">
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full comic-button !bg-secondary !text-black !py-4 rounded-2xl flex justify-between items-center group overflow-hidden relative"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                <div className="flex items-center gap-2 relative z-10">
                  <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {cartItemsCount}
                  </div>
                  <span className="font-body text-lg">Ver Pedido</span>
                </div>
                <span className="font-title text-xl">S/ {finalTotal.toFixed(2)}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-white rounded-t-3xl z-50 flex flex-col max-h-[85vh] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t-4 border-x-4 border-black"
            >
              <div className="p-4 border-b-2 border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-3xl">
                <h2 className="font-title text-2xl text-primary">Mi Pedido</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 py-10 font-ui flex flex-col items-center">
                    <ShoppingCart size={48} className="mb-4 text-gray-300" />
                    <p>Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border-2 border-gray-200">
                        <div className="flex-1 pr-2">
                          <h4 className="font-body text-md text-primary leading-tight">{item.nombre}</h4>
                          {item.variacion && (
                            <p className="text-sm text-gray-500 font-ui mt-1">{item.variacion}</p>
                          )}
                          <p className="font-bold text-black mt-1 font-ui">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="flex items-center gap-3 bg-white border-2 border-black rounded-full px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 rounded-full text-black">
                              <Minus size={16} strokeWidth={3} />
                            </button>
                            <span className="font-body w-4 text-center">{item.cantidad}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 rounded-full text-black">
                              <Plus size={16} strokeWidth={3} />
                            </button>
                          </div>
                          <button onClick={() => updateQuantity(item.id, -item.cantidad)} className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:ml-1 transition-colors">
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 bg-white border-t-2 border-gray-100 rounded-b-3xl">
                  <div className="flex flex-col gap-1 mb-4 border-b pb-4">
                    <div className="flex justify-between items-center text-gray-600 font-ui text-sm">
                      <span>Subtotal:</span>
                      <span>S/ {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 font-ui text-sm">
                      <span>Delivery:</span>
                      <span>S/ {DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-title text-xl text-primary mt-1">
                      <span>Total:</span>
                      <span className="text-2xl text-black">S/ {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={sendWhatsAppOrder}
                    className="w-full comic-button !bg-[#25D366] !text-black !py-4 rounded-2xl flex justify-center items-center gap-2 group"
                  >
                    <FaWhatsapp size={24} className="group-hover:scale-110 transition-transform" />
                    Enviar pedido a WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

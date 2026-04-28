import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Minus, X, MessageCircle, Info } from 'lucide-react'
import menuDataJson from './data.json'
import type { MenuData, MenuCategory, MenuItem, CartItem } from './types'
import clsx from 'clsx'

const data = menuDataJson as MenuData

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
  category,
  onAdd
}: {
  item: MenuItem;
  category: MenuCategory;
  onAdd: (item: MenuItem, proteina?: string, price?: number) => void;
}) => {
  const hasProteinOptions = category.opciones_proteina && category.precios_por_proteina;
  const [selectedProtein, setSelectedProtein] = useState<string>(
    hasProteinOptions ? category.opciones_proteina![0] : ''
  );

  const currentPrice = hasProteinOptions
    ? category.precios_por_proteina![selectedProtein]
    : item.precio;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/80 rounded-[2rem] p-5 shadow-sm border-4 border-black relative mb-4 transition-shadow hover:shadow-lg backdrop-blur-md"
    >
      <div className="absolute top-[-10px] right-[-10px] z-10">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="comic-badge bg-[#FFD700] text-black text-lg font-bold"
        >
          S/ {currentPrice?.toFixed(2)}
        </motion.div>
      </div>

      <h3 className="font-body text-xl text-primary leading-tight mb-2 pr-14">
        {item.nombre}
      </h3>

      {hasProteinOptions && (
        <div className="flex flex-wrap gap-2 mb-3 mt-4">
          {category.opciones_proteina!.map(p => (
            <button
              key={p}
              onClick={() => setSelectedProtein(p)}
              className={clsx(
                "px-4 py-1 rounded-full text-sm font-ui font-bold border-2 transition-colors",
                selectedProtein === p
                  ? "bg-secondary text-black border-black"
                  : "bg-gray-100 text-gray-500 border-gray-300 hover:border-black"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={() => onAdd(item, hasProteinOptions ? selectedProtein : undefined, currentPrice)}
          className="bg-primary hover:bg-primary/90 text-white rounded-full h-12 w-12 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-1 active:translate-x-1"
        >
          <Plus size={24} className="text-white" strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
};

function App() {
  const [activeCategory, setActiveCategory] = useState<string>(data.menu[0].categoria)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }, [cart])

  const cartItemsCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.cantidad, 0)
  }, [cart])

  const addToCart = (item: MenuItem, proteina?: string, price?: number) => {
    if (!price) return;
    const id = `${item.nombre}-${proteina || 'default'}`;
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing) {
        return prev.map(c => c.id === id ? { ...c, cantidad: c.cantidad + 1 } : c);
      }
      return [...prev, { id, nombre: item.nombre, proteina, precio: price, cantidad: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.id === id) {
        const newQty = c.cantidad + delta;
        return newQty > 0 ? { ...c, cantidad: newQty } : c;
      }
      return c;
    }).filter(c => c.cantidad > 0));
  };

  const clearCart = () => setCart([]);

  const sendWhatsAppOrder = () => {
    const phone = data.informacion_restaurante.whatsapp[0];
    let message = `¡Hola *${data.informacion_restaurante.nombre}*! 🌊 Me gustaría pedir lo siguiente:\n\n`;
    
    cart.forEach(item => {
      const details = item.proteina ? ` (${item.proteina})` : '';
      message += `▪ ${item.cantidad}x ${item.nombre}${details} - S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    
    message += `\n*Total:* S/ ${cartTotal.toFixed(2)}`;
    
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
            <a href={`https://wa.me/51${data.informacion_restaurante.whatsapp[0]}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-secondary border-2 border-black flex justify-center items-center hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <MessageCircle size={20} className="text-black" />
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
              <h2 className="font-title text-3xl text-primary mb-6 tracking-wide drop-shadow-sm">
                {cat.categoria}
              </h2>
              <div className="flex flex-col gap-4">
                {cat.items.map((item, idx) => (
                  <ProductCard 
                    key={`${item.nombre}-${idx}`}
                    item={item}
                    category={cat}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            </div>
          ))}
        </main>

        {/* Floating Cart Bar */}
        <AnimatePresence>
          {cartItemsCount > 0 && !isCartOpen && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-0 w-full flex justify-center px-4 z-40 pointer-events-none"
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
                  <span className="font-title text-xl">S/ {cartTotal.toFixed(2)}</span>
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
                            {item.proteina && (
                              <p className="text-sm text-gray-500 font-ui mt-1">{item.proteina}</p>
                            )}
                            <p className="font-bold text-black mt-1 font-ui">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-white border-2 border-black rounded-full px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 rounded-full text-black">
                              <Minus size={16} strokeWidth={3} />
                            </button>
                            <span className="font-body w-4 text-center">{item.cantidad}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 rounded-full text-black">
                              <Plus size={16} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-4 bg-white border-t-2 border-gray-100 rounded-b-3xl">
                    <div className="flex justify-between items-center mb-4 font-title text-xl text-primary">
                      <span>Total:</span>
                      <span className="text-2xl text-black">S/ {cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={sendWhatsAppOrder}
                      className="w-full comic-button !bg-[#25D366] !text-black !py-4 rounded-2xl flex justify-center items-center gap-2 group"
                    >
                      <MessageCircle className="group-hover:scale-110 transition-transform" />
                      Enviar pedido a WhatsApp
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App

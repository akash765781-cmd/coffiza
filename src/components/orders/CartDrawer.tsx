import React from "react";
import { useOrder } from "@/context/OrderContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    setIsCheckoutOpen,
  } = useOrder();

  if (!isCartOpen) return null;

  const deliveryFee = 30;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal > 0 ? cartTotal + deliveryFee + tax : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-amber-950/40 text-stone-100 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-amber-100">Your Order Cart</h2>
                <p className="text-xs text-stone-400">Coffizza Fresh Cafe & Restro</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-800/80 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-stone-200">Your cart is empty</h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Explore our delicious coffee, pizza, and treats to place your order.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map((ci) => (
                <div
                  key={ci.item.id}
                  className="p-4 rounded-xl bg-stone-850 border border-stone-800/80 hover:border-amber-500/30 transition flex gap-4 items-center bg-stone-900/60"
                >
                  {ci.item.image ? (
                    <img
                      src={ci.item.image}
                      alt={ci.item.name}
                      className="w-16 h-16 rounded-lg object-cover border border-stone-800 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-stone-800 flex items-center justify-center text-amber-500 font-serif text-lg font-bold flex-shrink-0">
                      {ci.item.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          ci.item.isVeg ? "bg-green-500" : "bg-red-500"
                        }`}
                        title={ci.item.isVeg ? "Vegetarian" : "Non-Veg"}
                      />
                      <h4 className="font-semibold text-stone-100 text-sm truncate">
                        {ci.item.name}
                      </h4>
                    </div>
                    <p className="text-xs text-amber-400 font-medium mt-0.5">
                      ₹{ci.item.price} each
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center rounded-lg border border-stone-700 bg-stone-950">
                        <button
                          onClick={() => updateQuantity(ci.item.id, -1)}
                          className="p-1 hover:bg-stone-800 text-stone-300 rounded-l-lg transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-stone-100">{ci.quantity}</span>
                        <button
                          onClick={() => updateQuantity(ci.item.id, 1)}
                          className="p-1 hover:bg-stone-800 text-stone-300 rounded-r-lg transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(ci.item.id)}
                        className="text-stone-500 hover:text-red-400 text-xs flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-bold text-amber-200 text-sm">
                    ₹{ci.item.price * ci.quantity}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-800 bg-stone-950/90 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-400">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="text-stone-200">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Taxes (5% GST)</span>
                  <span className="text-stone-200">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="text-stone-200">₹{deliveryFee}</span>
                </div>
                <div className="border-t border-stone-800 pt-2 flex justify-between text-sm font-bold text-amber-300">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import type { FulfillmentType, PaymentMethod, OrderFormErrors, Order } from "@/types/order";
import { X, CheckCircle, AlertCircle, ShoppingBag, Truck, Store, Utensils, CreditCard, Banknote, QrCode } from "lucide-react";

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
    setIsMyOrdersOpen,
    setActiveTab,
  } = useOrder();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [notes, setNotes] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  // Validation function
  const validate = (): OrderFormErrors => {
    const errors: OrderFormErrors = {};

    if (!customerName.trim()) {
      errors.customerName = "Name is required (ਘੱਟੋ-ਘੱਟ ਨਾਮ ਭਰੋ)";
    } else if (customerName.trim().length < 2) {
      errors.customerName = "Name must be at least 2 characters";
    }

    const phoneClean = phone.replace(/\D/g, "");
    if (!phoneClean) {
      errors.phone = "Phone number is required (ਮੋਬਾਈਲ ਨੰਬਰ ਜਰੂਰੀ ਹੈ)";
    } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      errors.phone = "Enter valid 10-digit Indian phone number (10 ਅੰਕਾਂ ਦਾ ਸਹੀ ਨੰਬਰ ਲਿਖੋ)";
    }

    if (fulfillmentType === "delivery") {
      if (!deliveryAddress.trim()) {
        errors.deliveryAddress = "Delivery address is required (ਡਿਲੀਵਰੀ ਪਤਾ ਜਰੂਰੀ ਹੈ)";
      } else if (deliveryAddress.trim().length < 5) {
        errors.deliveryAddress = "Please provide complete street address";
      }
    }

    if (fulfillmentType === "dine-in") {
      if (!tableNumber.trim()) {
        errors.tableNumber = "Please specify Table Number or 'Counter'";
      }
    }

    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      customerName: true,
      phone: true,
      deliveryAddress: true,
      tableNumber: true,
    });

    if (!isValid) return;

    const newOrder = placeOrder({
      customerName,
      phone,
      fulfillmentType,
      deliveryAddress,
      tableNumber,
      paymentMethod,
      notes,
    });

    if (newOrder) {
      setConfirmedOrder(newOrder);
    }
  };

  const closeCheckout = () => {
    setConfirmedOrder(null);
    setIsCheckoutOpen(false);
  };

  const deliveryFee = fulfillmentType === "delivery" ? 30 : 0;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + tax;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl text-stone-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-100">
                {confirmedOrder ? "Order Confirmed! 🎉" : "Complete Your Order"}
              </h2>
              <p className="text-xs text-stone-400">Coffizza Cafe & Restro — Banga</p>
            </div>
          </div>
          <button
            onClick={closeCheckout}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          /* Confirmation Screen */
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                Order ID: {confirmedOrder.id}
              </span>
              <h3 className="text-2xl font-serif font-bold text-stone-100 mt-3">
                Order Placed Successfully!
              </h3>
              <p className="text-sm text-stone-400 mt-1 max-w-md mx-auto">
                Thank you, <strong className="text-stone-200">{confirmedOrder.customerName}</strong>. Our kitchen has received your order and is preparing it fresh.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-stone-800 pb-2 text-stone-300">
                <span>Fulfillment Type:</span>
                <span className="font-bold text-amber-400 uppercase">{confirmedOrder.fulfillmentType}</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-2 text-stone-300">
                <span>Contact Phone:</span>
                <span className="font-semibold text-stone-100">{confirmedOrder.phone}</span>
              </div>
              {confirmedOrder.deliveryAddress && (
                <div className="flex justify-between border-b border-stone-800 pb-2 text-stone-300">
                  <span>Delivery Address:</span>
                  <span className="font-semibold text-stone-100">{confirmedOrder.deliveryAddress}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-300 pt-1 text-sm font-bold">
                <span>Total Amount Paid/Due:</span>
                <span className="text-amber-300">₹{confirmedOrder.total}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  closeCheckout();
                  setActiveTab("orders");
                  setIsMyOrdersOpen(true);
                }}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition"
              >
                Track & Manage Orders (Cancel Option)
              </button>
              <button
                onClick={closeCheckout}
                className="px-5 py-3 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm font-semibold transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Fulfillment Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
                Choose Order Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: "delivery", label: "Delivery", icon: Truck },
                  { type: "takeaway", label: "Takeaway", icon: Store },
                  { type: "dine-in", label: "Dine-in", icon: Utensils },
                ].map((option) => {
                  const Icon = option.icon;
                  const isSelected = fulfillmentType === option.type;
                  return (
                    <button
                      type="button"
                      key={option.type}
                      onClick={() => setFulfillmentType(option.type as FulfillmentType)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-medium ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10"
                          : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Akash Deep"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onBlur={() => handleBlur("customerName")}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border text-sm text-stone-100 focus:outline-none transition ${
                    Boolean(touched["customerName"]) && errors.customerName
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-stone-800 focus:border-amber-500"
                  }`}
                />
                {Boolean(touched["customerName"]) && errors.customerName && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Mobile Number (10 digits) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border text-sm text-stone-100 focus:outline-none transition ${
                    Boolean(touched["phone"]) && errors.phone
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-stone-800 focus:border-amber-500"
                  }`}
                />
                {Boolean(touched["phone"]) && errors.phone && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic Field depending on Fulfillment */}
            {fulfillmentType === "delivery" && (
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Delivery Address <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="House/Street no., Landmark, Banga..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  onBlur={() => handleBlur("deliveryAddress")}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border text-sm text-stone-100 focus:outline-none transition ${
                    Boolean(touched["deliveryAddress"]) && errors.deliveryAddress
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-stone-800 focus:border-amber-500"
                  }`}
                />
                {Boolean(touched["deliveryAddress"]) && errors.deliveryAddress && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.deliveryAddress}
                  </p>
                )}
              </div>
            )}

            {fulfillmentType === "dine-in" && (
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Table Number / Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Table 4 or Main Counter"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  onBlur={() => handleBlur("tableNumber")}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border text-sm text-stone-100 focus:outline-none transition ${
                    Boolean(touched["tableNumber"]) && errors.tableNumber
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-stone-800 focus:border-amber-500"
                  }`}
                />
                {Boolean(touched["tableNumber"]) && errors.tableNumber && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.tableNumber}
                  </p>
                )}
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
                Payment Option
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "cod", label: "Cash on Delivery/Pickup", icon: Banknote },
                  { id: "upi", label: "UPI / GPay / PhonePe", icon: QrCode },
                  { id: "card", label: "Card / POS", icon: CreditCard },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      type="button"
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs text-center transition ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500 text-amber-300"
                          : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Extra spicy, less sugar in coffee..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Order Summary Box */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 space-y-2 text-xs">
              <div className="font-semibold text-stone-200 border-b border-stone-800 pb-1.5 flex justify-between">
                <span>Items ({cart.length})</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>5% GST</span>
                <span>₹{tax}</span>
              </div>
              {fulfillmentType === "delivery" && (
                <div className="flex justify-between text-stone-400">
                  <span>Delivery Charge</span>
                  <span>₹{deliveryFee}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-bold text-amber-300">
                <span>Total Amount</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* Validation Notice */}
            {Object.keys(errors).length > 0 && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੀਆਂ ਜਰੂਰੀ ਡਿਟੇਲਾਂ ਸਹੀ ਭਰੋ (Please fix form errors to place order).</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 ${
                isValid
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/20"
                  : "bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700/50"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Place Order Now (₹{grandTotal})</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

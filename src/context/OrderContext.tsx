import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  MenuItem,
  CartItem,
  Order,
  TableReservation,
  FulfillmentType,
  PaymentMethod,
  OrderStatus,
  ReservationStatus,
  NotificationMessage,
} from "@/types/order";

interface OrderContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  orders: Order[];
  placeOrder: (details: {
    customerName: string;
    phone: string;
    fulfillmentType: FulfillmentType;
    deliveryAddress?: string;
    tableNumber?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Order | null;
  cancelOrder: (orderId: string, reason?: string) => boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;

  reservations: TableReservation[];
  reserveTable: (details: {
    guestName: string;
    phone: string;
    guestCount: number;
    date: string;
    timeSlot: string;
    seatingPreference: 'indoor' | 'outdoor' | 'window' | 'any';
    specialRequest?: string;
  }) => TableReservation | null;
  cancelReservation: (reservationId: string, reason?: string) => boolean;
  updateReservationStatus: (reservationId: string, status: ReservationStatus, reason?: string) => void;

  notifications: NotificationMessage[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  activeToast: NotificationMessage | null;
  clearActiveToast: () => void;
  activeSmsAlert: NotificationMessage | null;
  clearActiveSmsAlert: () => void;

  resetAllData: () => void;

  // Modal visibility states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isReservationOpen: boolean;
  setIsReservationOpen: (open: boolean) => void;
  isMyOrdersOpen: boolean;
  setIsMyOrdersOpen: (open: boolean) => void;
  activeTab: 'orders' | 'reservations';
  setActiveTab: (tab: 'orders' | 'reservations') => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = "coffizza_orders_v1";
const RESERVATIONS_STORAGE_KEY = "coffizza_reservations_v1";
const CART_STORAGE_KEY = "coffizza_cart_v1";
const NOTIFICATIONS_STORAGE_KEY = "coffizza_notifications_v1";

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load orders from localStorage", e);
      return [];
    }
  });

  const [reservations, setReservations] = useState<TableReservation[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load reservations from localStorage", e);
      return [];
    }
  });

  const [notifications, setNotifications] = useState<NotificationMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load notifications", e);
      return [];
    }
  });

  const [activeToast, setActiveToast] = useState<NotificationMessage | null>(null);
  const [activeSmsAlert, setActiveSmsAlert] = useState<NotificationMessage | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
    } catch (e) {
      console.error("Failed to save reservations", e);
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error("Failed to save notifications", e);
    }
  }, [notifications]);

  const addToCart = (item: MenuItem, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.item.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        if (existing) {
          existing.quantity += quantity;
        }
        return updated;
      }
      return [...prev, { item, quantity }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const cartItemCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  const triggerCancellationAlert = (
    title: string,
    message: string,
    phone: string,
    type: 'order_cancelled' | 'booking_cancelled' | 'order_update',
    relatedId?: string,
    reason?: string
  ) => {
    const notif: NotificationMessage = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      message,
      phone,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      relatedId,
      reason,
    };

    setNotifications((prev) => [notif, ...prev]);
    setActiveToast(notif);
    setActiveSmsAlert(notif);
  };

  const placeOrder = (details: {
    customerName: string;
    phone: string;
    fulfillmentType: FulfillmentType;
    deliveryAddress?: string;
    tableNumber?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Order | null => {
    if (cart.length === 0) return null;

    const subtotal = cartTotal;
    const deliveryFee = details.fulfillmentType === "delivery" ? 30 : 0;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + tax;

    const newOrder: Order = {
      id: `#COFF-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal,
      deliveryFee,
      tax,
      total,
      fulfillmentType: details.fulfillmentType,
      customerName: details.customerName,
      phone: details.phone,
      deliveryAddress: details.deliveryAddress,
      tableNumber: details.tableNumber,
      paymentMethod: details.paymentMethod,
      notes: details.notes,
      status: "placed",
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const cancelOrder = (orderId: string, reason?: string): boolean => {
    let success = false;
    let targetOrder: Order | undefined;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId && order.status !== "cancelled" && order.status !== "delivered") {
          success = true;
          targetOrder = order;
          return {
            ...order,
            status: "cancelled",
            cancellationReason: reason || "Cancelled by customer / cafe issue",
            cancelledAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );

    if (success && targetOrder) {
      triggerCancellationAlert(
        `Order Cancelled (${orderId})`,
        `ਤੁਹਾਡਾ ਆਰਡਰ ${orderId} ਕੈਂਸਲ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ। (Your order ${orderId} has been cancelled by cafe/system).`,
        targetOrder.phone,
        "order_cancelled",
        orderId,
        reason || "Out of stock / Kitchen issue"
      );
    }

    return success;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, reason?: string) => {
    let targetOrder: Order | undefined;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          targetOrder = order;
          return {
            ...order,
            status,
            ...(status === "cancelled"
              ? { cancellationReason: reason || "Cancelled by cafe admin", cancelledAt: new Date().toISOString() }
              : {}),
          };
        }
        return order;
      })
    );

    if (status === "cancelled" && targetOrder) {
      triggerCancellationAlert(
        `Order Cancelled by Cafe (${orderId})`,
        `ਕੈਫੇ ਵਲੋਂ ਤੁਹਾਡਾ ਆਰਡਰ ${orderId} ਕੈਂਸਲ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ। (Your Coffizza Order ${orderId} was cancelled by staff).`,
        targetOrder.phone,
        "order_cancelled",
        orderId,
        reason || "Cafe issue / Item unavailable"
      );
    }
  };

  const reserveTable = (details: {
    guestName: string;
    phone: string;
    guestCount: number;
    date: string;
    timeSlot: string;
    seatingPreference: 'indoor' | 'outdoor' | 'window' | 'any';
    specialRequest?: string;
  }): TableReservation | null => {
    const newReservation: TableReservation = {
      id: `#RES-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      guestName: details.guestName,
      phone: details.phone,
      guestCount: details.guestCount,
      date: details.date,
      timeSlot: details.timeSlot,
      seatingPreference: details.seatingPreference,
      specialRequest: details.specialRequest,
      status: "confirmed",
    };

    setReservations((prev) => [newReservation, ...prev]);
    return newReservation;
  };

  const cancelReservation = (reservationId: string, reason?: string): boolean => {
    let success = false;
    let targetRes: TableReservation | undefined;

    setReservations((prev) =>
      prev.map((res) => {
        if (res.id === reservationId && res.status !== "cancelled") {
          success = true;
          targetRes = res;
          return {
            ...res,
            status: "cancelled",
            cancellationReason: reason || "Cancelled by customer",
            cancelledAt: new Date().toISOString(),
          };
        }
        return res;
      })
    );

    if (success && targetRes) {
      triggerCancellationAlert(
        `Table Reservation Cancelled (${reservationId})`,
        `ਤੁਹਾਡੀ ਟੇਬਲ ਬੁਕਿੰਗ ${reservationId} ਕੈਂਸਲ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ। (Your table booking ${reservationId} has been cancelled).`,
        targetRes.phone,
        "booking_cancelled",
        reservationId,
        reason || "Cafe capacity / Table unavailable"
      );
    }

    return success;
  };

  const updateReservationStatus = (reservationId: string, status: ReservationStatus, reason?: string) => {
    let targetRes: TableReservation | undefined;

    setReservations((prev) =>
      prev.map((res) => {
        if (res.id === reservationId) {
          targetRes = res;
          return {
            ...res,
            status,
            ...(status === "cancelled"
              ? { cancellationReason: reason || "Cancelled by cafe admin", cancelledAt: new Date().toISOString() }
              : {}),
          };
        }
        return res;
      })
    );

    if (status === "cancelled" && targetRes) {
      triggerCancellationAlert(
        `Table Booking Cancelled by Cafe (${reservationId})`,
        `ਕੈਫੇ ਵਲੋਂ ਤੁਹਾਡੀ ਟੇਬਲ ਬੁਕਿੰਗ ${reservationId} ਕੈਂਸਲ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ। (Your table reservation ${reservationId} was cancelled by staff).`,
        targetRes.phone,
        "booking_cancelled",
        reservationId,
        reason || "Table reserved for private event"
      );
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const clearActiveToast = () => setActiveToast(null);
  const clearActiveSmsAlert = () => setActiveSmsAlert(null);

  const resetAllData = () => {
    setCart([]);
    setOrders([]);
    setReservations([]);
    setNotifications([]);
    setActiveToast(null);
    setActiveSmsAlert(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      localStorage.removeItem(RESERVATIONS_STORAGE_KEY);
      localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear localStorage", e);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        orders,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        reservations,
        reserveTable,
        cancelReservation,
        updateReservationStatus,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        activeToast,
        clearActiveToast,
        activeSmsAlert,
        clearActiveSmsAlert,
        resetAllData,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isReservationOpen,
        setIsReservationOpen,
        isMyOrdersOpen,
        setIsMyOrdersOpen,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

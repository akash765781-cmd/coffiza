import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
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
  }) => Promise<Order | null>;
  cancelOrder: (orderId: string, reason?: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => Promise<void>;

  reservations: TableReservation[];
  reserveTable: (details: {
    guestName: string;
    phone: string;
    guestCount: number;
    date: string;
    timeSlot: string;
    seatingPreference: "indoor" | "outdoor" | "window" | "any";
    specialRequest?: string;
  }) => Promise<TableReservation | null>;
  cancelReservation: (reservationId: string, reason?: string) => Promise<boolean>;
  updateReservationStatus: (
    reservationId: string,
    status: ReservationStatus,
    reason?: string,
  ) => Promise<void>;

  notifications: NotificationMessage[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  activeToast: NotificationMessage | null;
  clearActiveToast: () => void;
  activeSmsAlert: NotificationMessage | null;
  clearActiveSmsAlert: () => void;

  resetAllData: () => Promise<void>;
  refreshData: () => Promise<void>;
  dbConnected: boolean;

  // Modal visibility states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isReservationOpen: boolean;
  setIsReservationOpen: (open: boolean) => void;
  isMyOrdersOpen: boolean;
  setIsMyOrdersOpen: (open: boolean) => void;
  activeTab: "orders" | "reservations";
  setActiveTab: (tab: "orders" | "reservations") => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const CART_STORAGE_KEY = "coffizza_cart_v1";
const NOTIFICATIONS_STORAGE_KEY = "coffizza_notifications_v1";
const ORDERS_STORAGE_KEY = "coffizza_orders_v1";
const RESERVATIONS_STORAGE_KEY = "coffizza_reservations_v1";

// Helper: convert DB row → Order
function dbRowToOrder(row: Record<string, unknown>): Order {
  let itemsParsed: CartItem[] = [];
  try {
    itemsParsed =
      typeof row["items"] === "string"
        ? JSON.parse(row["items"])
        : (row["items"] as CartItem[]) || [];
  } catch {
    itemsParsed = [];
  }

  return {
    id: row["id"] as string,
    createdAt: (row["created_at"] as string) || new Date().toISOString(),
    items: itemsParsed,
    subtotal: Number(row["subtotal"] || 0),
    deliveryFee: Number(row["delivery_fee"] || 0),
    tax: Number(row["gst"] || 0),
    total: Number(row["total"] || 0),
    fulfillmentType: (row["fulfillment_type"] as FulfillmentType) || "delivery",
    customerName: (row["customer_name"] as string) || "Guest",
    phone: (row["phone"] as string) || "",
    deliveryAddress: (row["address"] as string) || undefined,
    tableNumber: (row["table_number"] as string) || undefined,
    paymentMethod: (row["payment_method"] as PaymentMethod) || "cod",
    notes: (row["special_instructions"] as string) || undefined,
    status: (row["status"] as OrderStatus) || "placed",
    cancellationReason: (row["cancellation_reason"] as string) || undefined,
    cancelledAt: (row["cancelled_at"] as string) || undefined,
  };
}

// Helper: convert DB row → TableReservation
function dbRowToReservation(row: Record<string, unknown>): TableReservation {
  return {
    id: row["id"] as string,
    createdAt: (row["created_at"] as string) || new Date().toISOString(),
    guestName: (row["customer_name"] as string) || "Guest",
    phone: (row["phone"] as string) || "",
    guestCount: Number(row["guest_count"] || 1),
    date: (row["date"] as string) || "",
    timeSlot: (row["time_slot"] as string) || "",
    seatingPreference:
      (row["seating_preference"] as "indoor" | "outdoor" | "window" | "any") || "indoor",
    specialRequest: (row["special_requests"] as string) || undefined,
    status: (row["status"] as ReservationStatus) || "confirmed",
    cancellationReason: (row["cancellation_reason"] as string) || undefined,
    cancelledAt: (row["cancelled_at"] as string) || undefined,
  };
}

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dbConnected, setDbConnected] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders (hydrate from localStorage)
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reservations (hydrate from localStorage)
  const [reservations, setReservations] = useState<TableReservation[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeToast, setActiveToast] = useState<NotificationMessage | null>(null);
  const [activeSmsAlert, setActiveSmsAlert] = useState<NotificationMessage | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "reservations">("orders");

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      /* ignore */
    }
  }, [notifications]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      /* ignore */
    }
  }, [orders]);

  // Save reservations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
    } catch {
      /* ignore */
    }
  }, [reservations]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ORDERS_STORAGE_KEY && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
      if (e.key === RESERVATIONS_STORAGE_KEY && e.newValue) {
        try {
          setReservations(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ─── Fetch orders from Supabase ───────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const fetchedOrders = data.map((row) => dbRowToOrder(row as Record<string, unknown>));
        setOrders((prev) => {
          // Merge fetched orders with existing local orders to prevent loss of unsynced entries
          const map = new Map<string, Order>();
          // Put fetched first
          fetchedOrders.forEach((o) => map.set(o.id, o));
          // Keep local if not present in fetched
          prev.forEach((o) => {
            if (!map.has(o.id)) {
              map.set(o.id, o);
            }
          });
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        });
        setDbConnected(true);
      } else if (error) {
        console.warn("Supabase orders query note:", error.message);
      }
    } catch (err) {
      console.warn("Could not connect to Supabase orders table:", err);
    }
  }, []);

  const fetchReservations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("table_reservations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const fetchedRes = data.map((row) => dbRowToReservation(row as Record<string, unknown>));
        setReservations((prev) => {
          const map = new Map<string, TableReservation>();
          fetchedRes.forEach((r) => map.set(r.id, r));
          prev.forEach((r) => {
            if (!map.has(r.id)) {
              map.set(r.id, r);
            }
          });
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        });
        setDbConnected(true);
      } else if (error) {
        console.warn("Supabase reservations query note:", error.message);
      }
    } catch (err) {
      console.warn("Could not connect to Supabase table_reservations:", err);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchOrders(), fetchReservations()]);
  }, [fetchOrders, fetchReservations]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
    fetchReservations();
  }, [fetchOrders, fetchReservations]);

  // ─── Real-time subscriptions ──────────────────────────────────────────────
  useEffect(() => {
    const orderSub = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    const resSub = supabase
      .channel("reservations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "table_reservations" }, () => {
        fetchReservations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderSub);
      supabase.removeChannel(resSub);
    };
  }, [fetchOrders, fetchReservations]);

  // ─── Cart helpers ─────────────────────────────────────────────────────────
  const addToCart = (item: MenuItem, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.item.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        if (existing) existing.quantity += quantity;
        return updated;
      }
      return [...prev, { item, quantity }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((ci) => {
            if (ci.item.id === itemId) {
              const newQty = ci.quantity + delta;
              return newQty > 0 ? { ...ci, quantity: newQty } : null;
            }
            return ci;
          })
          .filter(Boolean) as CartItem[],
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const cartItemCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  // ─── Notification helper ──────────────────────────────────────────────────
  const triggerCancellationAlert = (
    title: string,
    message: string,
    phone: string,
    type: "order_cancelled" | "booking_cancelled" | "order_update",
    relatedId?: string,
    reason?: string,
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

  // ─── Place Order ──────────────────────────────────────────────────────────
  const placeOrder = async (details: {
    customerName: string;
    phone: string;
    fulfillmentType: FulfillmentType;
    deliveryAddress?: string;
    tableNumber?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Promise<Order | null> => {
    if (cart.length === 0) return null;

    const subtotal = cartTotal;
    const deliveryFee = details.fulfillmentType === "delivery" ? 30 : 0;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + tax;
    const orderId = `#COFF-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
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

    // 1. Instantly update local state so Admin panel & customer view update right away
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== orderId)]);

    // 2. Try inserting into Supabase
    const row: Record<string, unknown> = {
      id: orderId,
      customer_name: details.customerName,
      phone: details.phone,
      fulfillment_type: details.fulfillmentType,
      address: details.deliveryAddress || details.tableNumber || "N/A",
      items: JSON.stringify(cart),
      subtotal,
      gst: tax,
      delivery_fee: deliveryFee,
      total,
      status: "placed",
      special_instructions: details.notes || null,
      table_number: details.tableNumber || null,
      payment_method: details.paymentMethod || "cod",
    };

    try {
      const { error } = await supabase.from("orders").insert([row]);
      if (error) {
        // If Supabase table is missing optional columns, try fallback with core columns
        const fallbackRow = {
          id: orderId,
          customer_name: details.customerName,
          phone: details.phone,
          fulfillment_type: details.fulfillmentType,
          address: details.deliveryAddress || details.tableNumber || "N/A",
          items: JSON.stringify(cart),
          subtotal,
          gst: tax,
          delivery_fee: deliveryFee,
          total,
          status: "placed",
          special_instructions: details.notes || null,
        };
        const { error: fallbackErr } = await supabase.from("orders").insert([fallbackRow]);
        if (fallbackErr) {
          console.warn("Supabase order insert note (saved locally):", fallbackErr.message);
        } else {
          setDbConnected(true);
        }
      } else {
        setDbConnected(true);
      }
    } catch (err) {
      console.warn("Saved order locally (Supabase unavailable):", err);
    }

    clearCart();
    return newOrder;
  };

  // ─── Cancel Order ─────────────────────────────────────────────────────────
  const cancelOrder = async (orderId: string, reason?: string): Promise<boolean> => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder || targetOrder.status === "cancelled" || targetOrder.status === "delivered") {
      return false;
    }

    const cancelledAt = new Date().toISOString();
    const cancelReason = reason || "Cancelled by customer";

    // 1. Update local state immediately
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "cancelled", cancellationReason: cancelReason, cancelledAt }
          : o,
      ),
    );

    // 2. Sync to Supabase
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "cancelled",
          cancellation_reason: cancelReason,
          cancelled_at: cancelledAt,
        })
        .eq("id", orderId);

      if (error) {
        // Fallback without new columns
        await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId);
      }
    } catch {
      /* ignore */
    }

    triggerCancellationAlert(
      `Order Cancelled (${orderId})`,
      `ਤੁਹਾਡਾ ਆਰਡਰ ${orderId} ਕੈਂਸਲ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ। (Your order ${orderId} has been cancelled).`,
      targetOrder.phone,
      "order_cancelled",
      orderId,
      cancelReason,
    );

    return true;
  };

  // ─── Update Order Status ──────────────────────────────────────────────────
  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    reason?: string,
  ): Promise<void> => {
    const targetOrder = orders.find((o) => o.id === orderId);

    const updateData: Record<string, unknown> = { status };
    let cancelReason: string | undefined = undefined;
    let cancelledAt: string | undefined = undefined;

    if (status === "cancelled") {
      cancelReason = reason || "Cancelled by cafe admin";
      cancelledAt = new Date().toISOString();
      updateData["cancellation_reason"] = cancelReason;
      updateData["cancelled_at"] = cancelledAt;
    }

    // 1. Update local state immediately
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              ...(status === "cancelled" ? { cancellationReason: cancelReason, cancelledAt } : {}),
            }
          : o,
      ),
    );

    // 2. Sync to Supabase
    try {
      const { error } = await supabase.from("orders").update(updateData).eq("id", orderId);
      if (error && status === "cancelled") {
        await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId);
      }
    } catch {
      /* ignore */
    }

    if (status === "cancelled" && targetOrder) {
      triggerCancellationAlert(
        `Order Cancelled by Cafe (${orderId})`,
        `ਕੈਫੇ ਵਲੋਂ ਤੁਹਾਡਾ ਆਰਡਰ ${orderId} ਕੈਂਸਲ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।`,
        targetOrder.phone,
        "order_cancelled",
        orderId,
        cancelReason || "Item unavailable",
      );
    }
  };

  // ─── Reserve Table ────────────────────────────────────────────────────────
  const reserveTable = async (details: {
    guestName: string;
    phone: string;
    guestCount: number;
    date: string;
    timeSlot: string;
    seatingPreference: "indoor" | "outdoor" | "window" | "any";
    specialRequest?: string;
  }): Promise<TableReservation | null> => {
    const resId = `#RES-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRes: TableReservation = {
      id: resId,
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

    // 1. Instantly update local state
    setReservations((prev) => [newRes, ...prev.filter((r) => r.id !== resId)]);

    // 2. Try inserting into Supabase
    const row = {
      id: resId,
      customer_name: details.guestName,
      phone: details.phone,
      guest_count: details.guestCount,
      date: details.date,
      time_slot: details.timeSlot,
      seating_preference: details.seatingPreference,
      special_requests: details.specialRequest || null,
      status: "confirmed",
    };

    try {
      const { error } = await supabase.from("table_reservations").insert([row]);
      if (error) {
        console.warn("Supabase reservation insert note (saved locally):", error.message);
      } else {
        setDbConnected(true);
      }
    } catch (err) {
      console.warn("Saved reservation locally (Supabase unavailable):", err);
    }

    return newRes;
  };

  // ─── Cancel Reservation ───────────────────────────────────────────────────
  const cancelReservation = async (reservationId: string, reason?: string): Promise<boolean> => {
    const targetRes = reservations.find((r) => r.id === reservationId);
    if (!targetRes || targetRes.status === "cancelled") return false;

    const cancelledAt = new Date().toISOString();
    const cancelReason = reason || "Cancelled by customer";

    // 1. Update local state immediately
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? { ...r, status: "cancelled", cancellationReason: cancelReason, cancelledAt }
          : r,
      ),
    );

    // 2. Sync to Supabase
    try {
      const { error } = await supabase
        .from("table_reservations")
        .update({
          status: "cancelled",
          cancellation_reason: cancelReason,
          cancelled_at: cancelledAt,
        })
        .eq("id", reservationId);

      if (error) {
        await supabase
          .from("table_reservations")
          .update({ status: "cancelled" })
          .eq("id", reservationId);
      }
    } catch {
      /* ignore */
    }

    triggerCancellationAlert(
      `Table Booking Cancelled (${reservationId})`,
      `ਤੁਹਾਡੀ ਟੇਬਲ ਬੁਕਿੰਗ ${reservationId} ਕੈਂਸਲ ਹੋ ਗਈ ਹੈ।`,
      targetRes.phone,
      "booking_cancelled",
      reservationId,
      cancelReason,
    );

    return true;
  };

  // ─── Update Reservation Status ────────────────────────────────────────────
  const updateReservationStatus = async (
    reservationId: string,
    status: ReservationStatus,
    reason?: string,
  ): Promise<void> => {
    const targetRes = reservations.find((r) => r.id === reservationId);

    const updateData: Record<string, unknown> = { status };
    let cancelReason: string | undefined = undefined;
    let cancelledAt: string | undefined = undefined;

    if (status === "cancelled") {
      cancelReason = reason || "Cancelled by cafe admin";
      cancelledAt = new Date().toISOString();
      updateData["cancellation_reason"] = cancelReason;
      updateData["cancelled_at"] = cancelledAt;
    }

    // 1. Update local state immediately
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? {
              ...r,
              status,
              ...(status === "cancelled" ? { cancellationReason: cancelReason, cancelledAt } : {}),
            }
          : r,
      ),
    );

    // 2. Sync to Supabase
    try {
      const { error } = await supabase
        .from("table_reservations")
        .update(updateData)
        .eq("id", reservationId);
      if (error && status === "cancelled") {
        await supabase
          .from("table_reservations")
          .update({ status: "cancelled" })
          .eq("id", reservationId);
      }
    } catch {
      /* ignore */
    }

    if (status === "cancelled" && targetRes) {
      triggerCancellationAlert(
        `Table Booking Cancelled by Cafe (${reservationId})`,
        `ਕੈਫੇ ਵਲੋਂ ਤੁਹਾਡੀ ਟੇਬਲ ਬੁਕਿੰਗ ${reservationId} ਕੈਂਸਲ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ।`,
        targetRes.phone,
        "booking_cancelled",
        reservationId,
        cancelReason || "Private event",
      );
    }
  };

  // ─── Reset All Data ───────────────────────────────────────────────────────
  const resetAllData = async (): Promise<void> => {
    try {
      await supabase.from("orders").delete().neq("id", "");
      await supabase.from("table_reservations").delete().neq("id", "");
    } catch {
      /* ignore */
    }

    setCart([]);
    setOrders([]);
    setReservations([]);
    setNotifications([]);
    setActiveToast(null);
    setActiveSmsAlert(null);

    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      localStorage.removeItem(RESERVATIONS_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const clearActiveToast = () => setActiveToast(null);
  const clearActiveSmsAlert = () => setActiveSmsAlert(null);

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
        refreshData,
        dbConnected,
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

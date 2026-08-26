export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  tag?: string;
  description?: string;
  isVeg?: boolean;
};

export type CartItem = {
  item: MenuItem;
  quantity: number;
  specialInstruction?: string;
};

export type FulfillmentType = "dine-in" | "takeaway" | "delivery";

export type PaymentMethod = "cod" | "upi" | "card";

export type OrderStatus = "placed" | "preparing" | "ready" | "delivered" | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  fulfillmentType: FulfillmentType;
  customerName: string;
  phone: string;
  deliveryAddress?: string | undefined;
  tableNumber?: string | undefined;
  paymentMethod: PaymentMethod;
  notes?: string | undefined;
  status: OrderStatus;
  cancellationReason?: string | undefined;
  cancelledAt?: string | undefined;
};

export type ReservationStatus = "confirmed" | "cancelled" | "completed";

export type TableReservation = {
  id: string;
  createdAt: string;
  guestName: string;
  phone: string;
  guestCount: number;
  date: string;
  timeSlot: string;
  seatingPreference: "indoor" | "outdoor" | "window" | "any";
  specialRequest?: string | undefined;
  status: ReservationStatus;
  cancellationReason?: string | undefined;
  cancelledAt?: string | undefined;
};

export type NotificationMessage = {
  id: string;
  title: string;
  message: string;
  phone: string;
  type: "order_cancelled" | "booking_cancelled" | "order_update";
  timestamp: string;
  read: boolean;
  relatedId?: string | undefined;
  reason?: string | undefined;
};

export type OrderFormErrors = {
  customerName?: string;
  phone?: string;
  deliveryAddress?: string;
  tableNumber?: string;
  paymentMethod?: string;
};

export type ReservationFormErrors = {
  guestName?: string;
  phone?: string;
  guestCount?: string;
  date?: string;
  timeSlot?: string;
};

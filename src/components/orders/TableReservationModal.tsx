import React, { useState } from "react";
import { useOrder } from "@/context/OrderContext";
import type { ReservationFormErrors, TableReservation } from "@/types/order";
import { X, Calendar, Users, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export const TableReservationModal: React.FC = () => {
  const { isReservationOpen, setIsReservationOpen, reserveTable, setIsMyOrdersOpen, setActiveTab } =
    useOrder();

  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0] || "");
  const [timeSlot, setTimeSlot] = useState("19:00");
  const [seatingPreference, setSeatingPreference] = useState<
    "indoor" | "outdoor" | "window" | "any"
  >("indoor");
  const [specialRequest, setSpecialRequest] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [confirmedReservation, setConfirmedReservation] = useState<TableReservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReservationOpen) return null;

  const validate = (): ReservationFormErrors => {
    const errors: ReservationFormErrors = {};

    if (!guestName.trim()) {
      errors.guestName = "Guest Name is required";
    } else if (guestName.trim().length < 2) {
      errors.guestName = "Name must be at least 2 characters";
    }

    const phoneClean = phone.replace(/\D/g, "");
    if (!phoneClean) {
      errors.phone = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      errors.phone = "Enter valid 10-digit phone number";
    }

    if (guestCount < 1 || guestCount > 20) {
      errors.guestCount = "Guests count must be between 1 and 20";
    }

    if (!date) {
      errors.date = "Date is required";
    }

    if (!timeSlot) {
      errors.timeSlot = "Time slot is required";
    }

    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      guestName: true,
      phone: true,
      guestCount: true,
      date: true,
      timeSlot: true,
    });

    if (!isValid) return;
    setIsSubmitting(true);

    const res = await reserveTable({
      guestName,
      phone,
      guestCount,
      date,
      timeSlot,
      seatingPreference,
      specialRequest,
    });

    setIsSubmitting(false);
    if (res) {
      setConfirmedReservation(res);
    }
  };

  const closeModal = () => {
    setConfirmedReservation(null);
    setIsReservationOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl text-stone-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-100">
                {confirmedReservation ? "Table Reserved! 🍽️" : "Reserve a Table"}
              </h2>
              <p className="text-xs text-stone-400">Coffizza Cafe & Restro — Banga</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedReservation ? (
          /* Confirmation View */
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                Booking ID: {confirmedReservation.id}
              </span>
              <h3 className="text-2xl font-serif font-bold text-stone-100 mt-3">
                Table Booking Confirmed!
              </h3>
              <p className="text-sm text-stone-400 mt-1 max-w-md mx-auto">
                We look forward to welcoming you,{" "}
                <strong className="text-stone-200">{confirmedReservation.guestName}</strong>!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-stone-800 pb-2 text-stone-300">
                <span>Date & Time:</span>
                <span className="font-bold text-amber-300">
                  {confirmedReservation.date} at {confirmedReservation.timeSlot}
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-2 text-stone-300">
                <span>Number of Guests:</span>
                <span className="font-semibold text-stone-100">
                  {confirmedReservation.guestCount} Persons
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-2 text-stone-300">
                <span>Seating Preference:</span>
                <span className="font-semibold text-stone-100 capitalize">
                  {confirmedReservation.seatingPreference}
                </span>
              </div>
              <div className="flex justify-between text-stone-300 pt-1">
                <span>Contact Phone:</span>
                <span className="font-semibold text-stone-100">{confirmedReservation.phone}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  closeModal();
                  setActiveTab("reservations");
                  setIsMyOrdersOpen(true);
                }}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition"
              >
                Manage Booking (Cancel Option)
              </button>
              <button
                onClick={closeModal}
                className="px-5 py-3 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Reservation Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Your Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gurpreet Singh"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  onBlur={() => handleBlur("guestName")}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border text-sm text-stone-100 focus:outline-none transition ${
                    Boolean(touched["guestName"]) && errors.guestName
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-stone-800 focus:border-amber-500"
                  }`}
                />
                {Boolean(touched["guestName"]) && errors.guestName && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.guestName}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Guests Count <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-stone-800 bg-stone-950 p-1">
                  <Users className="w-4 h-4 text-stone-400 ml-2.5" />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                    onBlur={() => handleBlur("guestCount")}
                    className="w-full px-2 py-1.5 bg-transparent text-sm font-bold text-amber-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onBlur={() => handleBlur("date")}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Time Slot <span className="text-red-400">*</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:border-amber-500 focus:outline-none"
                >
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="19:00">07:00 PM</option>
                  <option value="20:30">08:30 PM</option>
                  <option value="21:30">09:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Seating Preference
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "indoor", label: "Indoor Cafe" },
                  { id: "window", label: "Window Side" },
                  { id: "outdoor", label: "Outdoor" },
                  { id: "any", label: "Any Available" },
                ].map((pref) => (
                  <button
                    type="button"
                    key={pref.id}
                    onClick={() => setSeatingPreference(pref.id as any)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs transition ${
                      seatingPreference === pref.id
                        ? "bg-amber-500/15 border-amber-500 text-amber-300 font-semibold"
                        : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                    }`}
                  >
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Special Requests (e.g., Birthday surprise, high chair...)
              </label>
              <input
                type="text"
                placeholder="Mention any special requirement..."
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Please fill in all required booking details correctly.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 ${
                isValid
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/20"
                  : "bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700/50"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm Table Reservation</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

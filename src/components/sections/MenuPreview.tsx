import { menuGroups } from "@/data/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/ui/reveal";
import { useOrder } from "@/context/OrderContext";
import { Plus, Check, ShoppingBag } from "lucide-react";
import { useState } from "react";

export function MenuPreview() {
  const { addToCart, cart, setIsCartOpen } = useOrder();
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const handleAdd = (item: any) => {
    addToCart(item, 1);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  const getCartQty = (id: string) => {
    const found = cart.find((c) => c.item.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <section id="menu" className="section-y bg-stone-50/50">
      <div className="container-x">
        <SectionHeading
          eyebrow="What's on the table"
          title={
            <>
              A little something for <span className="italic text-coffee">every mood</span>
            </>
          }
          intro="Freshly brewed coffee, hot hand-tossed pizzas, crispy chicken, and sweet desserts available for dine-in, takeaway, or home delivery."
        />

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
          {menuGroups.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 80}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl text-espresso flex items-center gap-2">
                  {group.title}
                </h3>
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                  {group.label}
                </span>
              </div>
              <div className="rule-line mt-4" />
              <ul className="mt-5 space-y-4">
                {group.items.map((item) => {
                  const qty = getCartQty(item.id);
                  const justAdded = addedItemIds[item.id];
                  return (
                    <li
                      key={item.id || item.name}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-stone-200/80 bg-white p-3.5 shadow-sm transition-all hover:shadow-md hover:border-amber-500/40"
                    >
                      <div className="flex items-center gap-4">
                        {item.image ? (
                          <span className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-stone-200">
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              width={120}
                              height={120}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </span>
                        ) : (
                          <span
                            aria-hidden="true"
                            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-amber-200 font-display text-xl font-bold text-amber-800"
                          >
                            {item.name.charAt(0)}
                          </span>
                        )}

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                item.isVeg ? "bg-green-600" : "bg-red-600"
                              }`}
                              title={item.isVeg ? "Veg" : "Non-Veg"}
                            />
                            <h4 className="text-base font-semibold text-espresso">
                              {item.name}
                            </h4>
                            {item.tag && (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-stone-500 line-clamp-1 max-w-xs">
                              {item.description}
                            </p>
                          )}
                          <div className="text-sm font-bold text-amber-900 font-mono">
                            ₹{item.price}
                          </div>
                        </div>
                      </div>

                      {/* Add to Cart Trigger */}
                      <div className="flex items-center justify-end sm:justify-center">
                        <button
                          onClick={() => handleAdd(item)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                            justAdded
                              ? "bg-green-700 text-white"
                              : qty > 0
                              ? "bg-amber-600 text-white hover:bg-amber-700"
                              : "bg-espresso text-stone-100 hover:bg-amber-700"
                          }`}
                        >
                          {justAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>{qty > 0 ? `Add More (${qty})` : "Add to Order"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 p-6 rounded-2xl bg-espresso text-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h4 className="font-serif text-lg font-bold text-amber-200">
              Ready to enjoy fresh food & coffee?
            </h4>
            <p className="text-xs text-stone-300 mt-0.5">
              Place your order online for Dine-in, Takeaway, or Express Delivery in Banga!
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition flex items-center gap-2 shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Order Cart</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}

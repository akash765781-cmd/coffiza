import heroImg from "@/assets/hero.jpg";
import pizzaImg from "@/assets/pizza.jpg";
import coffeeImg from "@/assets/coffee.jpg";
import chickenImg from "@/assets/chicken.jpg";
import dessertImg from "@/assets/dessert.jpg";
import interiorImg from "@/assets/interior.jpg";
import sandwichImg from "@/assets/sandwich.jpg";
import momosImg from "@/assets/momos.jpg";
import drinksImg from "@/assets/drinks.jpg";
import momentsImg from "@/assets/moments.jpg";

export const images = {
  hero: heroImg,
  pizza: pizzaImg,
  coffee: coffeeImg,
  chicken: chickenImg,
  dessert: dessertImg,
  interior: interiorImg,
  sandwich: sandwichImg,
  momos: momosImg,
  drinks: drinksImg,
  moments: momentsImg,
};

export const business = {
  name: "Coffizza Cafe & Restro",
  city: "Banga",
  address:
    "Star Complex, Chandigarh Highway, Banga Rural, Gandhi Nagar Mohalla, Banga Rural, Banga, Punjab 144505",
  plusCode: "5XMW+JW Banga Rural, Punjab",
  phoneDisplay: "099178 00084",
  phoneHref: "tel:+919917800084",
  priceRange: "₹200–₹400",
  rating: "4.4",
  reviewCount: "192",
  hours: "Open · Closes 11 PM",
  services: ["Dine-in", "Takeaway", "No-contact delivery"],
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=Coffizza+Cafe+%26+Restro+Banga+Star+Complex+Chandigarh+Highway+Banga+Punjab+144505",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Coffizza+Cafe+%26+Restro+Banga+Star+Complex+Chandigarh+Highway+Banga+Punjab+144505&output=embed",
};

export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Menu", href: "/#menu" },
  { label: "About", href: "/#about" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Visit Us", href: "/#visit" },
];

import type { MenuItem } from "@/types/order";

export const menuItemsList: MenuItem[] = [
  // Coffee
  {
    id: "c1",
    name: "Chillo Coffee",
    price: 180,
    category: "Coffee",
    image: images.drinks,
    tag: "Popular",
    description: "Cold brewed rich coffee blended with whipped cream & chocolate syrup.",
    isVeg: true,
  },
  {
    id: "c2",
    name: "Espresso Shot",
    price: 99,
    category: "Coffee",
    tag: "Classic",
    description: "Pure, intense shot of dark roasted arabica beans.",
    isVeg: true,
  },
  {
    id: "c3",
    name: "Cappuccino Latte",
    price: 149,
    category: "Coffee",
    image: images.coffee,
    tag: "Bestseller",
    description: "Steamed velvety milk poured over rich espresso with microfoam layer.",
    isVeg: true,
  },

  // Food
  {
    id: "f1",
    name: "Coffizza Special Pizza",
    price: 299,
    category: "Food",
    image: images.pizza,
    tag: "Chef Special",
    description: "Hand-tossed crust topped with mozzarella, paneer, veggies & house sauce.",
    isVeg: true,
  },
  {
    id: "f2",
    name: "Crispy Fried Chicken",
    price: 349,
    category: "Food",
    image: images.chicken,
    tag: "Hot & Crispy",
    description: "Juicy golden fried chicken tenders served with garlic dip.",
    isVeg: false,
  },
  {
    id: "f3",
    name: "Tandoori Paneer SW",
    price: 179,
    category: "Food",
    tag: "Spicy",
    description: "Grilled sandwich stuffed with marinated tandoori paneer & mint chutney.",
    isVeg: true,
  },
  {
    id: "f4",
    name: "Grilled Sandwich & Salad",
    price: 199,
    category: "Food",
    image: images.sandwich,
    description: "Triple-decker fresh veggie sandwich with crunchy side garden salad.",
    isVeg: true,
  },
  {
    id: "f5",
    name: "Spicy Chicken Momos",
    price: 189,
    category: "Food",
    image: images.momos,
    tag: "Customer Favorite",
    description: "Steam-cooked dumplings filled with minced chicken & fiery chili dip.",
    isVeg: false,
  },

  // Desserts
  {
    id: "d1",
    name: "Classic New York Cheesecake",
    price: 219,
    category: "Desserts",
    image: images.dessert,
    tag: "Must Try",
    description: "Creamy vanilla cheesecake on a buttery graham cracker crust.",
    isVeg: true,
  },
  {
    id: "d2",
    name: "Brownie Lovers Sundae",
    price: 189,
    category: "Desserts",
    tag: "Sweet Delight",
    description: "Warm fudge brownie served with vanilla ice cream & hot chocolate.",
    isVeg: true,
  },

  // Drinks
  {
    id: "dr1",
    name: "Fresh Lime Soda",
    price: 99,
    category: "Drinks",
    description: "Refreshing sparkling lime soda served sweet, salted, or mixed.",
    isVeg: true,
  },
  {
    id: "dr2",
    name: "Mint Mojito",
    price: 139,
    category: "Drinks",
    image: images.drinks,
    tag: "Refreshing",
    description: "Zesty fresh mint leaves, lemon juice, and crushed ice in soda.",
    isVeg: true,
  },
];

export const menuGroups: {
  title: string;
  label: string;
  items: MenuItem[];
}[] = [
  {
    title: "Coffee",
    label: "Brewed all day",
    items: menuItemsList.filter((item) => item.category === "Coffee"),
  },
  {
    title: "Food",
    label: "From the kitchen",
    items: menuItemsList.filter((item) => item.category === "Food"),
  },
  {
    title: "Desserts",
    label: "Sweet finish",
    items: menuItemsList.filter((item) => item.category === "Desserts"),
  },
  {
    title: "Drinks",
    label: "Cold & fresh",
    items: menuItemsList.filter((item) => item.category === "Drinks"),
  },
];

// Themes drawn from the supplied Google review · No names are attached
// because the source material does not provide verified reviewer names.
export const reviewThemes = [
  {
    quote: "Fresh and tasty coffee, and the staff is friendly.",
    meta: "Google review · Coffee",
  },
  {
    quote: "Good food and good service.",
    meta: "Google review · Dining",
  },
  {
    quote: "Comfortable seating and a good environment to sit for a while.",
    meta: "Google review · Atmosphere",
  },
];

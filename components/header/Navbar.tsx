"use client";

import { useState } from "react";
import {
  Search,
  Menu,
  X,
  User,
} from "lucide-react";
import LangUseParams from "@/translate/LangUseParams";
import GlobeBtn from "./GlobeBtn";
import ShoppingCartIcon from "./ShopingCartIcon";
import WishlistIcon from "./WishlistIcon";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 👇 Get cart count from Redux

  const lang = LangUseParams(); // Access dynamic [lang] parameter

  const navItems = [
    { title: "Home", href: "/" },
    { title: "Products", href: "/products" },
    { title: "categories", href: "/categories" },
    { title: "about", href: "/about" },
  ];

  return (
    <nav className=" top-0 z-50" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center mainColor">
            <span className="ml-2 text-xl font-bold hidden sm:block">Logo</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-[var(--lightColor)] hover:text-[var(--mainColor)]  font-bold px-3 py-2 text-sm  transition-colors duration-200"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar (hidden on small screens) */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-md backgroundDarkPurple outline-none"
              />
            </div>
          </div>

          {/* Icons & Mobile Menu Button */}
          <div className="flex items-center space-x-4 relative">
            <GlobeBtn />

            {/* Favorite Icon */}
            <WishlistIcon />

            {/* Cart count icon*/}
            <ShoppingCartIcon />

            {/* User Icon */}
            <User className="w-5 h-5 cursor-pointer" />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
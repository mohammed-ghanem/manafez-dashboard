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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 👇 Get cart count from Redux

  const lang = LangUseParams(); // Access dynamic [lang] parameter

  // const navItems = [
  //   { title: "Home", href: "/" },
  //   { title: "Products", href: "/products" },
  //   { title: "categories", href: "/categories" },
  //   { title: "about", href: "/about" },
  // ];

  return (
    <nav className=" top-0 z-50" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
          </div>

          {/* Search Bar (hidden on small screens) */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute text-white top-1/2 transform -translate-y-1/2 
               w-4 h-4 ltr:right-3 rtl:left-3" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full ltr:pr-10 rtl:pl-10 pr-4 pl-4 py-2 
                rounded-md text-white 
                backgroundDarkPurple outline-none"
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
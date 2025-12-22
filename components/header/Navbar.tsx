"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Menu,
  X,
} from "lucide-react";
import LangUseParams from "@/translate/LangUseParams";
import GlobeBtn from "./GlobeBtn";

import UserDropdown from "./UserDropdown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lang = LangUseParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // mark loaded when lang becomes available.
    // If you have other async data (auth, cart, translate) include them here.
    if (lang) setLoading(false);
  }, [lang]);

  const IconSkeleton = ({ className }: { className?: string }) => (
    <div
      className={`w-8 h-8 rounded-full bg-gray-300 animate-pulse ${className || ""}`}
      aria-hidden="true"
    />
  );

  return (
    <nav className="top-0 z-50" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation (placeholder for future items) */}
          <div className="hidden md:block" />

          {/* Search Bar (hidden on small screens) */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute text-white top-1/2 transform -translate-y-1/2 w-4 h-4 ltr:right-3 rtl:left-3" />
              {loading ? (
                <div className="h-10 rounded-md bg-gray-300 animate-pulse" />
              ) : (
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full ltr:pr-10 rtl:pl-10 pr-4 pl-4 py-2 rounded-md text-white backgroundDarkPurple outline-none"
                />
              )}
            </div>
          </div>

          {/* Icons & Mobile Menu Button */}
          <div className="flex items-center space-x-4 ltr:space-x-4 rtl:space-x-reverse relative">
            {/* Globe / Language */}
            {loading ? <IconSkeleton /> : <GlobeBtn />}

            {/* User Dropdown */}
            {loading ? (
              <div className="w-28 h-8 rounded-md " />
            ) : (
              <UserDropdown />
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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



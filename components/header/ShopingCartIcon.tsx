"use client"
import { ShoppingCart } from "lucide-react";
import { selectCartTotalQuantity } from "@/store/cart/cartSlice";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import LangUseParams from "@/translate/LangUseParams";

const ShoppingCartIcon = () => {
    const lang = LangUseParams();

    // 👇 Get cart count from Redux
    const cartCount = useAppSelector(selectCartTotalQuantity);
    return (
        <Link href={`/${lang}/cart`} className="relative cursor-pointer">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
                <span className="absolute -top-4 -right-3 bkMainColor  text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-extrabold">
                    {cartCount}
                </span>
            )}
        </Link>
    )
}

export default ShoppingCartIcon
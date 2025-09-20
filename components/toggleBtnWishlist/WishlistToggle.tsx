"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { actAddToWishlist, actRemoveFromWishlist } from "@/store/wishlist/thunkActions/ActWishlist";

import { Heart } from "lucide-react";
import type { IProduct } from "@/types/product";
import { Button } from "@/components/ui/button";

interface WishlistToggleProps {
    product: IProduct;
}

const WishlistToggle = ({ product }: WishlistToggleProps) => {
    const dispatch = useAppDispatch();
    const wishlist = useAppSelector((state) => state.wishlist.items);

    const isInWishlist = wishlist.some((item) => item.id === product.id);

    const toggleWishlist = () => {
        if (isInWishlist) {
            dispatch(actRemoveFromWishlist(product.id));
        } else {
            dispatch(actAddToWishlist(product));
        }
    };
    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleWishlist}
            disabled= {false}
            className={`transition-colors ${isInWishlist ? "bg-pink-100 border-pink-300" : "hover:bg-gray-100"
                }`}
        >
            <Heart
                className={`w-5 h-5 ${isInWishlist ? "fill-pink-500 text-pink-500" : "text-gray-500"
                    }`}
            />
        </Button>
    );
};

export default WishlistToggle;

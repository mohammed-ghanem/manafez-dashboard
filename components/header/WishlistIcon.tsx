import { Heart } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectWishlistCount } from "@/store/wishlist/wishlistSlice";
import Link from "next/link";
import LangUseParams from "@/translate/LangUseParams";

const WishlistIcon = () => {
    const count = useAppSelector(selectWishlistCount);
    const lang = LangUseParams();

  return (
    <Link href={`/${lang}/wishlist`} className="relative cursor-pointer">
      <Heart className="w-6 h-6 text-pink-500 " />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
};

export default WishlistIcon;
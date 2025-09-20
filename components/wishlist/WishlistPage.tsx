"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeFromWishlist,
  selectWishlistItems,
  clearWishlist,
} from "@/store/wishlist/wishlistSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Trash2 } from "lucide-react";

function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);
  const items = Object.values(wishlistItems);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Wishlist</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-gray-500">Your wishlist is empty.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  {item.images?.[0] && (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  )}
                  <h2 className="mt-2 font-semibold">{item.title}</h2>
                  <p>${item.price}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                    className="mt-2"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={() => dispatch(clearWishlist())}
              className="mt-4"
            >
              Clear Wishlist
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default WishlistPage;

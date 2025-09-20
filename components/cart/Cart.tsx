"use client";

import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Minus, Plus } from "lucide-react";
import {
  selectCartItems,
} from "@/store/cart/cartSlice";
import { removeFromCartThunk, setQuantityThunk } from "@/store/cart/thunkActions/ActCart";

function Cart() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const items = Object.values(cartItems);

  const updateQuantity = (id: number, change: number, currentQty: number) => {
    const newQty = Math.max(1, currentQty + change);
    dispatch(setQuantityThunk({ id, quantity: newQty }));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="flex items-center p-4">
              {item.images?.[0] && (
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              )}
              <div className="ml-4 flex-1">
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">${item.price?.toFixed(2)}</p>

                <div className="flex items-center mt-2 space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateQuantity(item.id, -1, item.quantity ?? 1)
                    }
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-3">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateQuantity(item.id, 1, item.quantity ?? 1)
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-semibold">
                  ${(item.price ?? 0 * (item.quantity ?? 1)).toFixed(2)}
                </p>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => dispatch(removeFromCartThunk(item.id))}
                  className="mt-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Card className="p-4">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <Button className="w-full">Proceed to Checkout</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Cart;
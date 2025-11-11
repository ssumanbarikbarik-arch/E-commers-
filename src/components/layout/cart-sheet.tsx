"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { Separator } from "../ui/separator";

export function CartSheet() {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };
  
  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }

  const subtotal = state.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  return (
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
      <SheetHeader className="px-6">
        <SheetTitle>Cart ({state.items.length})</SheetTitle>
      </SheetHeader>
      <Separator />
      {state.items.length > 0 ? (
        <>
        <ScrollArea className="flex-1">
            <div className="flex flex-col gap-6 p-6">
                {state.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between space-x-4">
                        <div className="flex items-start space-x-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-md">
                                <Image
                                src={item.image}
                                alt={item.alt}
                                fill
                                className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-medium text-base">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4"/></Button>
                                    <Input type="number" value={item.quantity} readOnly className="h-8 w-14 text-center" />
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => removeItem(item.id)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                ))}
            </div>
        </ScrollArea>
        <SheetFooter className="p-6 pt-0 mt-auto">
            <div className="w-full space-y-4">
                <Separator />
                <div className="flex justify-between font-medium">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                </div>
                 <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
            </div>
        </SheetFooter>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Your cart is empty</h3>
          <p className="text-muted-foreground">Add items to your cart to see them here.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

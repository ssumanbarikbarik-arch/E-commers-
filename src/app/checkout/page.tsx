"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Truck } from "lucide-react";
import { useUser } from "@/firebase";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
        router.push('/login?redirect=/checkout');
    }
    if (state.items.length === 0) {
      router.push('/products');
    }
  }, [state.items, router, user, isUserLoading]);

  const subtotal = state.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 5.00;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    // Mock order placement
    dispatch({ type: "CLEAR_CART" });
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. Your order is being processed.",
    });
    router.push("/account/orders");
  };

  if (isUserLoading || !user || state.items.length === 0) {
    return (
        <div className="flex justify-center items-center h-[50vh]">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-headline text-center mb-10">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Truck className="w-6 h-6"/> Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" placeholder="John"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" placeholder="Doe"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="123 Main St"/>
                    </div>
                     <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="Anytown"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" placeholder="CA"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zip">Zip Code</Label>
                            <Input id="zip" placeholder="12345"/>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard className="w-6 h-6"/> Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="**** **** **** 1234"/>
                    </div>
                     <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry</Label>
                            <Input id="expiry" placeholder="MM/YY"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123"/>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review the items in your cart.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {state.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                <Image src={item.image} alt={item.alt} fill className="object-cover" />
                                </div>
                                <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    <Separator />
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <p className="text-muted-foreground">Subtotal</p>
                            <p>${subtotal.toFixed(2)}</p>
                        </div>
                         <div className="flex justify-between">
                            <p className="text-muted-foreground">Shipping</p>
                            <p>${shipping.toFixed(2)}</p>
                        </div>
                         <Separator />
                         <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>${total.toFixed(2)}</p>
                        </div>
                    </div>
                     <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" onClick={handlePlaceOrder}>Place Order</Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

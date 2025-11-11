import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { orders as mockOrders } from "@/lib/placeholder-data";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
    const getStatusVariant = (status: string) => {
        switch(status) {
            case 'Shipped': return 'default';
            case 'Processing': return 'secondary';
            case 'Delivered': return 'outline';
            default: return 'destructive';
        }
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>View your past and current orders.</CardDescription>
        </CardHeader>
        <CardContent>
            {mockOrders.length > 0 ? (
                 <div className="space-y-8">
                    {mockOrders.map(order => (
                        <Card key={order.id} className="overflow-hidden">
                            <CardHeader className="flex flex-row justify-between items-center bg-muted/50 p-4">
                               <div className="grid gap-0.5">
                                    <p className="font-semibold">Order ID: <span className="font-mono">{order.id}</span></p>
                                    <p className="text-sm text-muted-foreground">Date: {new Date(order.date).toLocaleDateString()}</p>
                               </div>
                               <div>
                                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                               </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                                <Image src={item.image} alt={item.alt} fill className="object-cover"/>
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">${item.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </CardContent>
                             <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
                                <Button variant="outline" size="sm">View Details</Button>
                                <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
                            </CardFooter>
                        </Card>
                    ))}
                 </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

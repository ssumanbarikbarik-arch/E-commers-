
'use client';

import {
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfWeek, startOfMonth } from 'date-fns';


type EnrichedOrder = Order & { userId: string; userName: string };

const OrderTable = ({ orders, handleStatusChange }: { orders: EnrichedOrder[], handleStatusChange: (orderId: string, userId: string, newStatus: string) => void }) => {
    
    const getStatusVariant = (status: string) => {
        switch(status) {
            case 'Shipped': return 'default';
            case 'Processing': return 'secondary';
            case 'Delivered': return 'outline';
            case 'Cancelled': return 'destructive';
            case 'Returned': return 'destructive';
            default: return 'secondary';
        }
    }
    
    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">There are no orders in this category.</p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead className="text-right">Change Status</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {orders.map((order) => (
                <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                <TableCell>{order.userName}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    <Select
                    value={order.status}
                    onValueChange={(newStatus) => handleStatusChange(order.id, order.userId, newStatus)}
                    >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Returned">Returned</SelectItem>
                    </SelectContent>
                    </Select>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    )
}

export default function ManageOrdersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('daily');

  const usersQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'users')) : null),
    [firestore]
  );
  const { data: users, isLoading: isLoadingUsers } = useCollection(usersQuery);

  useEffect(() => {
    if (!firestore || isLoadingUsers) {
      return;
    }

    const fetchAllOrders = async () => {
      setIsLoading(true);
      if (!users || users.length === 0) {
        setIsLoading(false);
        return;
      }

      const allOrders: EnrichedOrder[] = [];
      try {
        for (const user of users) {
          const ordersRef = collection(firestore, 'users', user.id, 'orders');
          const ordersSnapshot = await getDocs(ordersRef);
          ordersSnapshot.forEach((orderDoc) => {
            allOrders.push({
              ...(orderDoc.data() as Order),
              id: orderDoc.id,
              userId: user.id,
              userName: user.name || `${user.firstName} ${user.lastName}` || 'N/A',
            });
          });
        }
        setOrders(allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          variant: 'destructive',
          title: 'Error fetching orders',
          description:
            'There was a problem loading orders. Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllOrders();
  }, [firestore, users, isLoadingUsers, toast]);

  const chartData = useMemo(() => {
    const now = new Date();
    let data: { name: string; orders: number }[] = [];
    let filteredOrders: EnrichedOrder[] = [];

    if (timeRange === 'daily') {
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(now, i)).reverse();
        data = last7Days.map(day => ({ name: format(day, 'MMM d'), orders: 0 }));
        filteredOrders = orders.filter(order => new Date(order.date) >= subDays(now, 7));

        filteredOrders.forEach(order => {
            const dayStr = format(new Date(order.date), 'MMM d');
            const dayData = data.find(d => d.name === dayStr);
            if (dayData) {
                dayData.orders++;
            }
        });
    } else if (timeRange === 'weekly') {
        const last4Weeks = Array.from({ length: 4 }, (_, i) => startOfWeek(subDays(now, i * 7))).reverse();
        data = last4Weeks.map(weekStart => ({ name: format(weekStart, 'MMM d'), orders: 0 }));
        filteredOrders = orders.filter(order => new Date(order.date) >= subDays(now, 28));

        filteredOrders.forEach(order => {
            const weekStart = startOfWeek(new Date(order.date));
            const weekStr = format(weekStart, 'MMM d');
            const weekData = data.find(d => d.name === weekStr);
            if (weekData) {
                weekData.orders++;
            }
        });
    } else if (timeRange === 'monthly') {
        const last6Months = Array.from({ length: 6 }, (_, i) => startOfMonth(subDays(now, i * 30))).reverse();
        data = last6Months.map(monthStart => ({ name: format(monthStart, 'MMM'), orders: 0 }));
        filteredOrders = orders.filter(order => new Date(order.date) >= subDays(now, 180));

        filteredOrders.forEach(order => {
            const monthStart = startOfMonth(new Date(order.date));
            const monthStr = format(monthStart, 'MMM');
            const monthData = data.find(d => d.name === monthStr);
            if (monthData) {
                monthData.orders++;
            }
        });
    }

    return data;
}, [orders, timeRange]);

  const { cancelledOrders, returnedOrders, otherOrders } = useMemo(() => {
    return orders.reduce<{ cancelledOrders: EnrichedOrder[], returnedOrders: EnrichedOrder[], otherOrders: EnrichedOrder[] }>((acc, order) => {
        if (order.status === 'Cancelled') {
            acc.cancelledOrders.push(order);
        } else if (order.status === 'Returned') {
            acc.returnedOrders.push(order);
        } else {
            acc.otherOrders.push(order);
        }
        return acc;
    }, { cancelledOrders: [], returnedOrders: [], otherOrders: [] });
  }, [orders]);


  const handleStatusChange = async (
    orderId: string,
    userId: string,
    newStatus: string
  ) => {
    if (!firestore) return;
    const orderRef = doc(firestore, 'users', userId, 'orders', orderId);
    try {
      await updateDoc(orderRef, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
        )
      );
      toast({
        title: 'Order status updated',
        description: `Order #${orderId} is now ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Could not update the order status.',
      });
    }
  };
  
  return (
    <div className="container mx-auto py-12">
        <h1 className="text-4xl font-headline mb-2">Manage Orders</h1>
        <p className="text-muted-foreground mb-10">
            A complete overview of your store's orders.
        </p>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart /> Customer Orders
                    </CardTitle>
                    <CardDescription>
                        View all customer orders and update their status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <TabsList>
                            <TabsTrigger value="all">All ({otherOrders.length})</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
                            <TabsTrigger value="returned">Returned ({returnedOrders.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="pt-4">
                            {isLoading ? <p>Loading orders...</p> : <OrderTable orders={otherOrders} handleStatusChange={handleStatusChange} />}
                        </TabsContent>
                        <TabsContent value="cancelled" className="pt-4">
                            {isLoading ? <p>Loading orders...</p> : <OrderTable orders={cancelledOrders} handleStatusChange={handleStatusChange} />}
                        </TabsContent>
                        <TabsContent value="returned" className="pt-4">
                             {isLoading ? <p>Loading orders...</p> : <OrderTable orders={returnedOrders} handleStatusChange={handleStatusChange} />}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Card>
            <CardHeader>
                <CardTitle>Order Analytics</CardTitle>
                <CardDescription>A visual overview of your recent orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={timeRange} onValueChange={setTimeRange}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                    <TabsContent value={timeRange} className="pt-4">
                        {isLoading ? (
                            <div className="h-[300px] w-full flex items-center justify-center">
                                <p>Loading chart...</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="orders" fill="hsl(var(--primary))" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

  
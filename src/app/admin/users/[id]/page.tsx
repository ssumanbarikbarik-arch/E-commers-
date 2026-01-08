
'use client';

import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { User, Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function UserDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const firestore = useFirestore();

  const userRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'users', id) : null),
    [firestore, id]
  );
  const { data: user, isLoading: isLoadingUser } = useDoc<User>(userRef);

  const ordersQuery = useMemoFirebase(
    () => (firestore && id ? query(collection(firestore, 'users', id, 'orders')) : null),
    [firestore, id]
  );
  const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(ordersQuery);

  if (isLoadingUser || isLoadingOrders) {
    return (
        <div className="container mx-auto py-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  if (!user) {
    return <div className="container mx-auto py-12 text-center">User not found.</div>;
  }

  return (
    <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Order History ({orders?.length ?? 0})</CardTitle>
                </CardHeader>
                <CardContent>
                   {orders && orders.length > 0 ? (
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                    <TableCell>${order.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                   ) : (
                    <div className="text-center text-muted-foreground py-8">
                        This user has not placed any orders yet.
                    </div>
                   )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

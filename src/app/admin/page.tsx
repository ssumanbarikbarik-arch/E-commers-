
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Bot, Box, ShoppingCart, Users } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";

function StatCard({ title, icon, count, isLoading }: { title: string, icon: React.ReactNode, count: number, isLoading: boolean }) {
    return (
        <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-7 w-12 bg-muted animate-pulse rounded-md" />
                ) : (
                    <div className="text-2xl font-bold">{count}</div>
                )}
            </CardContent>
        </Card>
    )
}

export default function AdminDashboardPage() {
    const firestore = useFirestore();
    const [totalOrders, setTotalOrders] = useState(0);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);

    const productsQuery = useMemoFirebase(
      () => (firestore ? query(collection(firestore, "products")) : null),
      [firestore]
    );
    const { data: products, isLoading: isLoadingProducts } = useCollection(productsQuery);

    const usersQuery = useMemoFirebase(
      () => (firestore ? query(collection(firestore, "users")) : null),
      [firestore]
    );
    const { data: users, isLoading: isLoadingUsers } = useCollection(usersQuery);

    useEffect(() => {
        if (!users || isLoadingUsers || !firestore) {
            return;
        }

        setIsLoadingOrders(true);
        
        const fetchAllOrders = async () => {
            if (users.length === 0) {
                setTotalOrders(0);
                setIsLoadingOrders(false);
                return;
            }

            const orderPromises = users.map(user => {
                const ordersRef = collection(firestore, 'users', user.id, 'orders');
                return getDocs(query(ordersRef));
            });

            try {
                const userOrdersSnapshots = await Promise.all(orderPromises);
                const total = userOrdersSnapshots.reduce((acc, snapshot) => acc + snapshot.size, 0);
                setTotalOrders(total);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setTotalOrders(0);
            } finally {
                setIsLoadingOrders(false);
            }
        };

        fetchAllOrders();
    }, [users, firestore, isLoadingUsers]);


    return (
        <div className="container mx-auto py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-headline mb-2">Admin Panel</h1>
                <p className="text-muted-foreground mb-10">
                Welcome to the Thread Canvas Admin Panel.
                </p>

                <div className="grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Overview</CardTitle>
                            <CardDescription>A quick look at your store's data.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard title="Total Products" icon={<Box className="h-4 w-4 text-muted-foreground"/>} count={products?.length ?? 0} isLoading={isLoadingProducts} />
                        <StatCard title="Total Orders" icon={<ShoppingCart className="h-4 w-4 text-muted-foreground"/>} count={totalOrders} isLoading={isLoadingOrders} />
                        <StatCard title="Total Users" icon={<Users className="h-4 w-4 text-muted-foreground"/>} count={users?.length ?? 0} isLoading={isLoadingUsers} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Box /> Content Management</CardTitle>
                            <CardDescription>Manage your store's products, orders, and users.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-3 gap-4">
                            <Card className="hover:bg-muted/50 transition-colors">
                                <Link href="/admin/products">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2"><Box /> Manage Products</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">Add, edit, and remove products from your catalog.</p>
                                    </CardContent>
                                </Link>
                            </Card>
                            <Card className="hover:bg-muted/50 transition-colors">
                                <Link href="#">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2"><ShoppingCart /> Manage Orders</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">View and process customer orders.</p>
                                    </CardContent>
                                </Link>
                            </Card>
                            <Card className="hover:bg-muted/50 transition-colors">
                                <Link href="#">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2"><Users /> Manage Users</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">View and manage customer accounts.</p>
                                    </CardContent>
                                </Link>
                            </Card>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bot /> AI Tools</CardTitle>
                            <CardDescription>Leverage AI to enhance your store.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Card className="hover:bg-muted/50 transition-colors">
                                <Link href="/admin/generate-description">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Product Description Generator</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-between">
                                       <div>
                                            <p className="text-sm text-muted-foreground">Automatically generate compelling product descriptions.</p>
                                       </div>
                                       <div className="flex items-center gap-2 text-sm text-primary">
                                            <span>Go to Generator</span>
                                            <ArrowRight />
                                       </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

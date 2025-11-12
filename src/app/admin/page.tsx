
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Bot, Box, ShoppingCart, Users } from "lucide-react";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query } from "firebase/firestore";

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

    const { data: products, isLoading: isLoadingProducts } = useCollection(
        firestore ? query(collection(firestore, 'products')) : null
    );
    const { data: users, isLoading: isLoadingUsers } = useCollection(
        firestore ? query(collection(firestore, 'users')) : null
    );
    
    // Note: This query now relies on admin privileges to read all orders subcollections.
    // This is not efficient for large-scale applications.
    // In a real-world app, you would use a summary collection or cloud function.
    const { data: orders, isLoading: isLoadingOrders } = useCollection(
        firestore ? query(collection(firestore, `users/pXoTol5xMwMPe8nxAXat5Ozpuxt1/orders`)) : null
    );


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
                   <StatCard title="Total Orders" icon={<ShoppingCart className="h-4 w-4 text-muted-foreground"/>} count={orders?.length ?? 0} isLoading={isLoadingOrders} />
                   <StatCard title="Total Users" icon={<Users className="h-4 w-4 text-muted-foreground"/>} count={users?.length ?? 0} isLoading={isLoadingUsers} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot /> AI-Powered Tools</CardTitle>
                    <CardDescription>Use generative AI to help manage your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                            <h3 className="font-semibold">Product Description Generator</h3>
                            <p className="text-sm text-muted-foreground">Automatically generate compelling product descriptions.</p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/admin/generate-description">
                                Go to Generator <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Box /> Content Management</CardTitle>
                    <CardDescription>Manage your store's products, orders, and users.</CardDescription>
                </Header>
                <CardContent className="grid sm:grid-cols-3 gap-4">
                    <Card className="hover:bg-muted/50 transition-colors">
                        <Link href="#">
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
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Bot, Box, ShoppingCart, Users } from "lucide-react";

export default function AdminDashboardPage() {
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
                </CardHeader>
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

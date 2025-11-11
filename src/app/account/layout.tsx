
"use client"

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { User, Truck, MapPin, LogOut } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";

const navItems = [
    { href: "/account", label: "Profile", icon: User },
    { href: "/account/orders", label: "My Orders", icon: Truck },
    { href: "/account/addresses", label: "My Addresses", icon: MapPin },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
      return (
        <div className="flex justify-center items-center h-[50vh]">
            <p>Loading...</p>
        </div>
      )
  }

  return (
    <div className="container mx-auto py-12">
        <h1 className="text-4xl font-headline mb-2">My Account</h1>
        <p className="text-muted-foreground mb-10">Welcome back, Foysal Doe!</p>
        <div className="grid md:grid-cols-4 gap-10">
            <aside className="md:col-span-1">
                <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                pathname === item.href && "bg-secondary text-primary font-semibold"
                            )}
                        >
                            <item.icon className="h-5 w-5"/>
                            {item.label}
                        </Link>
                    ))}
                     <Button variant="ghost" className="justify-start px-3 text-muted-foreground" onClick={() => signOut(auth)}>
                        <LogOut className="h-5 w-5 mr-3"/>
                        Logout
                    </Button>
                </nav>
            </aside>
            <main className="md:col-span-3">
                {children}
            </main>
        </div>
    </div>
  );
}

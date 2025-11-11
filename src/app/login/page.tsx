"use client";

import { useAuth } from '@/firebase';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useState, FormEvent, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const auth = useAuth();
    const { user, isUserLoading } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/account');
        }
    }, [user, router]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: 'Login Successful', description: `Welcome back!` });
            router.push('/account');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
        }
    }

    if (isUserLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <p>Loading...</p>
            </div>
        )
    }

    if (user) {
        return (
             <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-headline">You are already logged in</CardTitle>
                        <CardDescription>Redirecting you to your account...</CardDescription>
                    </CardHeader>
                     <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" onClick={() => signOut(auth)}>Sign Out</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit">Sign In</Button>
                <p className="text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/signup" className="underline text-primary">Sign Up</Link>
                </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}


"use client";

import { useAuth, useUser } from '@/firebase';
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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function SignupPage() {
    const auth = useAuth();
    const firestore = useFirestore();
    const { user } = useUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/account');
        }
    }, [user, router]);

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            await updateProfile(firebaseUser, { displayName: name });
            
            // Create a document in the 'users' collection
            const userDocRef = doc(firestore, "users", firebaseUser.uid);

            const nameParts = name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            await setDoc(userDocRef, {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                firstName: firstName,
                lastName: lastName,
                addresses: [],
                paymentMethods: []
            });

            toast({ title: 'Signup Successful', description: 'Welcome! You are now logged in.' });
            router.push('/account');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Signup Failed', description: error.message });
        }
    }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSignup}>
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
                <CardDescription>Join Thread Canvas to start your style journey.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={e => setName(e.target.value)} />
                </div>
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
                <Button className="w-full" type="submit">Sign Up</Button>
                <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="underline text-primary">Sign In</Link>
                </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}

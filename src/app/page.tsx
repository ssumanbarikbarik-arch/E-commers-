
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { StyleRecommender } from '@/components/style-recommender';
import { ArrowRight } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products'), limit(4)) : null),
    [firestore]
  );
  const { data: featuredProducts, isLoading } = useCollection(productsQuery);

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://picsum.photos/seed/hero/1800/1000"
          alt="Fashion model"
          fill
          className="object-cover"
          priority
          data-ai-hint="fashion model"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline mb-4 drop-shadow-lg">
            Elegance Redefined
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto drop-shadow-md font-body">
            Discover our new collection of timeless pieces, crafted with passion and precision for the modern individual.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
            <Link href="/products">
              Shop Now <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
      
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-10">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
              ))}
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="bg-secondary py-12 md:py-20">
        <div className="container mx-auto px-4">
          <StyleRecommender />
        </div>
      </section>
    </div>
  );
}


"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Skeleton } from "./ui/skeleton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  
  const hasImage = product.images && product.images.length > 0 && product.images[0].url;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!hasImage) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0].url,
      alt: product.images[0].alt,
    });
  };

  return (
    <Card className="group overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <Link href={`/products/${product.id}`} className="block flex flex-col h-full">
        <div className="relative w-full aspect-square overflow-hidden">
          {hasImage ? (
            <Image
                src={product.images[0].url}
                alt={product.images[0].alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
           {hasImage && (
            <Button
                size="sm"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={handleAddToCart}
            >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
            </Button>
           )}
        </div>
        <CardContent className="p-4 flex-grow">
            <h3 className="font-headline text-lg leading-tight truncate">{product.name}</h3>
            <p className="text-muted-foreground text-sm mt-1">{product.category}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center mt-auto">
            <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span>{product.rating?.toFixed(1) ?? 'N/A'}</span>
            </div>
        </CardFooter>
      </Link>
    </Card>
  );
}

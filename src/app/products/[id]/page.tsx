
"use client"

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ProductPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  
  const firestore = useFirestore();
  const productRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'products', id) : null),
    [firestore, id]
  );
  const { data: product, isLoading } = useDoc(productRef);
  
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState<string | undefined>();
  const [selectedColor, setSelectedColor] = React.useState<string | undefined>();
  const [activeImage, setActiveImage] = React.useState(0);

  const hasImages = product && product.images && product.images.length > 0 && product.images[0].url;
  const hasSizes = product && product.availableSizes && product.availableSizes.length > 0;
  const hasColors = product && product.colors && product.colors.length > 0;

  const handleAddToCart = () => {
    if (!product || !hasImages) return;
    
    if (hasColors && !selectedColor) {
        toast({
            variant: "destructive",
            title: "Please select a color",
        });
        return;
    }
    if (hasSizes && !selectedSize) {
        toast({
            variant: "destructive",
            title: "Please select a size",
        });
        return;
    }

    addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0].url,
        alt: product.images[0].alt,
    });
    setQuantity(1);
  };

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="flex flex-col gap-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <div className="grid grid-cols-4 gap-4">
                        <Skeleton className="aspect-square w-full rounded-md" />
                        <Skeleton className="aspect-square w-full rounded-md" />
                        <Skeleton className="aspect-square w-full rounded-md" />
                        <Skeleton className="aspect-square w-full rounded-md" />
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                    <Separator />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-12 flex-1" />
                    </div>
                </div>
            </div>
        </div>
    )
  }

  if (!product && !isLoading) {
    notFound();
  }
  
  if (!product) {
      return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
                {hasImages ? (
                    <Image
                        src={product.images[activeImage].url}
                        alt={product.images[activeImage].alt}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <Skeleton className="h-full w-full" />
                )}
            </div>
            {hasImages && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image: any, index: number) => (
                        <button key={image.id || index} onClick={() => setActiveImage(index)} className={`relative aspect-square w-full overflow-hidden rounded-md transition-opacity ${index === activeImage ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}>
                            <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-headline">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${product.rating && i < Math.round(product.rating) ? 'text-accent fill-accent' : 'text-gray-300'}`}/>
                ))}
              </div>
              <span className="text-muted-foreground text-sm">{product.rating?.toFixed(1)} ({product.reviewCount} reviews)</span>
            </div>
          </div>
          <p className="text-3xl font-semibold">${product.price.toFixed(2)}</p>
          <Separator/>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          {hasColors && (
            <div className="space-y-3">
                <Label htmlFor="color">Color</Label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: string) => (
                    <Button 
                      key={color} 
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                      className={cn(selectedColor === color && "ring-2 ring-primary ring-offset-2")}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
            </div>
          )}

           {hasSizes && (
            <div className="space-y-3">
                <Label htmlFor="size">Size</Label>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size: string) => (
                    <Button
                      key={size}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={cn("w-12", selectedSize === size && "ring-2 ring-primary ring-offset-2")}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
            </div>
          )}

          {product.specs && product.specs.length > 0 && (
            <Card>
              <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Specifications</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                      {product.specs.map((spec: string) => <li key={spec}>{spec}</li>)}
                  </ul>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => Math.max(1, q-1))}><Minus className="h-4 w-4"/></Button>
                <Input type="number" value={quantity} readOnly className="h-10 w-16 text-center" />
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => q+1)}><Plus className="h-4 w-4"/></Button>
            </div>
            <Button size="lg" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAddToCart} disabled={!hasImages}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

    
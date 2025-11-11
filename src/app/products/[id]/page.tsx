"use client"

import { products } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type ProductPageProps = {
  params: {
    id: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [activeImage, setActiveImage] = React.useState(0);

  if (!product) {
    notFound();
  }
  
  const handleAddToCart = () => {
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                    src={product.images[activeImage].url}
                    alt={product.images[activeImage].alt}
                    fill
                    className="object-cover"
                    data-ai-hint={product.images[activeImage].hint}
                    priority
                />
            </div>
            <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                    <button key={image.id} onClick={() => setActiveImage(index)} className={`relative aspect-square w-full overflow-hidden rounded-md transition-opacity ${index === activeImage ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}>
                         <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            data-ai-hint={image.hint}
                        />
                    </button>
                ))}
            </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-headline">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'text-accent fill-accent' : 'text-gray-300'}`}/>
                ))}
              </div>
              <span className="text-muted-foreground text-sm">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
            </div>
          </div>
          <p className="text-3xl font-semibold">${product.price.toFixed(2)}</p>
          <Separator/>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <Card>
            <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Specifications</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    {product.specs.map(spec => <li key={spec}>{spec}</li>)}
                </ul>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => Math.max(1, q-1))}><Minus className="h-4 w-4"/></Button>
                <Input type="number" value={quantity} readOnly className="h-10 w-16 text-center" />
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => q+1)}><Plus className="h-4 w-4"/></Button>
            </div>
            <Button size="lg" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

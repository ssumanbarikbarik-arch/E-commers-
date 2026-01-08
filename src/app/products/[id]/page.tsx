

"use client"

import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Minus, Plus, Heart, Share2, Tag, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import React from "react";
import { Input } from "@/components/ui/input";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-24">
                 <div className="flex md:flex-col gap-2 justify-center">
                    <Skeleton className="aspect-square w-16 rounded-md" />
                    <Skeleton className="aspect-square w-16 rounded-md" />
                    <Skeleton className="aspect-square w-16 rounded-md" />
                    <Skeleton className="aspect-square w-16 rounded-md" />
                </div>
                <div className="relative w-full">
                  <Skeleton className="aspect-[4/5] w-full rounded-lg shadow-lg" />
                  <Skeleton className="absolute top-4 right-4 h-10 w-10 rounded-full" />
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-7 w-1/4" />
                <Skeleton className="h-6 w-1/2" />
                <Separator />
                <div className="space-y-3">
                  <Skeleton className="h-5 w-16" />
                  <div className="flex gap-2">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <Skeleton className="h-12 w-12 rounded-md" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-5 w-16" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-12 rounded-md" />
                    <Skeleton className="h-10 w-12 rounded-md" />
                    <Skeleton className="h-10 w-12 rounded-md" />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 flex-1" />
                </div>
            </div>
        </div>
    </div>
  )
}


export default function ProductPage() {
  const { id } = React.use(useParams());
  
  const firestore = useFirestore();
  const router = useRouter();
  const productRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'products', id as string) : null),
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

  React.useEffect(() => {
    // Reset selections when product changes
    setSelectedSize(undefined);
    setSelectedColor(undefined);
    setActiveImage(0);
    setQuantity(1);
  }, [id]);


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
  };
  
  const handleBuyNow = () => {
      handleAddToCart();
      router.push('/checkout');
  }

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    notFound();
  }
  
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link> / <Link href="/products" className="hover:text-primary">Products</Link> / <span className="font-medium text-foreground">{product.name}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-24">
              {hasImages && product.images.length > 1 && (
                  <div className="flex md:flex-col gap-2 justify-center">
                      {product.images.map((image: any, index: number) => (
                          <button key={image.id || index} onMouseOver={() => setActiveImage(index)} className={`relative aspect-square w-16 overflow-hidden rounded-md transition-opacity ${index === activeImage ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}>
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
              <div className="relative w-full">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-md">
                  {hasImages ? (
                      <Image
                          src={product.images[activeImage].url}
                          alt={product.images[activeImage].alt}
                          fill
                          className="object-cover"
                          priority
                      />
                  ) : (
                      <div className="bg-muted h-full w-full flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm rounded-full h-10 w-10">
                        <Heart className="h-5 w-5" />
                    </Button>
                     <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm rounded-full h-10 w-10">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
              </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">{product.category}</p>
              <h1 className="text-2xl md:text-3xl font-bold font-headline">{product.name}</h1>
              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                      <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded-md text-sm font-semibold">
                        <span>{product.rating?.toFixed(1)}</span>
                        <Star className="h-3 w-3 ml-1 fill-white" />
                      </div>
                      <span className="text-muted-foreground text-sm">{product.reviewCount} reviews</span>
                  </div>
              </div>
            </div>
            <div>
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground line-through ml-2">${(product.price * 1.3).toFixed(2)}</span>
                <span className="text-lg font-semibold text-green-600 ml-2">30% off</span>
            </div>
            <Separator/>
            
            {hasColors && (
              <div className="space-y-3">
                  <Label htmlFor="color" className="font-semibold">Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: string) => (
                      <Button 
                        key={color} 
                        variant="outline"
                        onClick={() => setSelectedColor(color)}
                        className={cn("h-auto p-1 border-2", selectedColor === color ? "border-primary" : "border-transparent")}
                      >
                         <div className="h-12 w-12 rounded-md bg-gray-200" style={{backgroundColor: color.toLowerCase()}} />
                      </Button>
                    ))}
                  </div>
              </div>
            )}

            {hasSizes && (
              <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="size" className="font-semibold">Size</Label>
                    <Link href="#" className="text-sm text-primary font-medium">Size Chart</Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size: string) => (
                      <Button
                        key={size}
                        variant="outline"
                        size="lg"
                        onClick={() => setSelectedSize(size)}
                        className={cn("w-14 h-14 text-base", selectedSize === size && "ring-2 ring-primary ring-offset-2")}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
              </div>
            )}

            <div className="space-y-4 pt-2">
                <h3 className="font-semibold flex items-center gap-2"><Tag className="h-5 w-5 text-primary"/> Available offers</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium text-foreground">Bank Offer</span> 10% off on HDFC Bank Credit Card EMI, up to ₹1,500. <Link href="#" className="text-primary font-medium">T&C</Link></p>
                    <p><span className="font-medium text-foreground">Bank Offer</span> 5% Cashback on Flipkart Axis Bank Card. <Link href="#" className="text-primary font-medium">T&C</Link></p>
                    <p><span className="font-medium text-foreground">Special Price</span> Get extra 15% off (price inclusive of cashback/coupon). <Link href="#" className="text-primary font-medium">T&C</Link></p>
                </div>
            </div>
            
             <div className="space-y-2 pt-2">
                <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/> Delivery</h3>
                 <div className="flex gap-2">
                    <Input placeholder="Enter delivery pincode" className="max-w-xs" />
                    <Button variant="outline">Check</Button>
                 </div>
                 <p className="text-sm text-muted-foreground">Delivery by Mon, Jan 15. Free delivery.</p>
            </div>

            <Separator />
            <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>


            <div className="flex items-center gap-4 pt-4">
              <Button size="lg" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-base py-6" onClick={handleAddToCart} disabled={!hasImage}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
              </Button>
               <Button size="lg" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-base py-6" onClick={handleBuyNow} disabled={!hasImage}>
                  Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

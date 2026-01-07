

'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Trash2, PlusCircle } from 'lucide-react';
import { Separator } from '../ui/separator';

const imageSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  alt: z.string().optional(),
  hint: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  category: z.string().min(2, 'Category is too short'),
  price: z.coerce.number().min(0.01, 'Price must be positive'),
  description: z.string().min(10, 'Description is too short'),
  specs: z.array(z.object({ value: z.string() })).min(1, 'Add at least one spec'),
  images: z.array(imageSchema).min(1, 'Please add at least one image.'),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: ProductFormValues & { id: string };
}

export function ProductForm({ product }: ProductFormProps) {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          ...product,
          specs: product.specs.map((spec: any) => ({ value: typeof spec === 'string' ? spec : spec.value })),
          images: product.images || [{ url: '', alt: '', hint: '' }],
        }
      : {
          name: '',
          category: '',
          price: 0,
          description: '',
          specs: [{ value: '' }],
          images: [{ url: '', alt: '', hint: '' }],
        },
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: 'specs',
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  async function onSubmit(data: ProductFormValues) {
    if (!firestore) return;

    const productData = {
        ...data,
        specs: data.specs.map(s => s.value),
        images: data.images.map((image, index) => ({
            id: `${index + 1}`,
            url: image.url,
            alt: image.alt || data.name,
            hint: image.hint || 'product photo',
        })),
        rating: product?.rating || Math.random() * 2 + 3,
        reviewCount: product?.reviewCount || Math.floor(Math.random() * 200),
    };

    try {
      if (product) {
        await setDoc(doc(firestore, 'products', product.id), productData);
        toast({ title: 'Product updated successfully' });
      } else {
        await addDoc(collection(firestore, 'products'), productData);
        toast({ title: 'Product created successfully' });
      }
      router.push('/admin/products');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error saving product',
        description: error.message,
      });
    }
  }

  return (
    <div className="container mx-auto py-12">
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Classic Denim Jacket" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g., Jackets" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="e.g., 79.99" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                            <Textarea placeholder="A timeless wardrobe staple..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <div>
                        <FormLabel>Specifications</FormLabel>
                        {specFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2 mt-2">
                            <FormField
                                control={form.control}
                                name={`specs.${index}.value`}
                                render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                    <Input placeholder={`Spec ${index + 1}`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeSpec(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                        ))}
                         <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => appendSpec({ value: "" })}
                        >
                            Add Specification
                        </Button>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <FormLabel>Product Images</FormLabel>
                        {imageFields.map((field, index) => (
                            <Card key={field.id} className="p-4 bg-muted/50">
                                <div className="space-y-2">
                                     <FormField
                                        control={form.control}
                                        name={`images.${index}.url`}
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                            <Input placeholder="https://example.com/image.jpg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="button" variant="destructive" size="sm" className="mt-4" onClick={() => removeImage(index)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Remove Image
                                </Button>
                            </Card>
                        ))}
                         <Button
                            type="button"
                            variant="outline"
                            onClick={() => appendImage({ url: "", alt: "" })}
                        >
                            <PlusCircle className="mr-2" /> Add Image
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit">
                            {product ? 'Update Product' : 'Create Product'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </div>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

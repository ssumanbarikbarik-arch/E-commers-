
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
import { Trash2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  category: z.string().min(2, 'Category is too short'),
  price: z.coerce.number().min(0.01, 'Price must be positive'),
  description: z.string().min(10, 'Description is too short'),
  specs: z.array(z.object({ value: z.string() })).min(1, 'Add at least one spec'),
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
        }
      : {
          name: '',
          category: '',
          price: 0,
          description: '',
          specs: [{ value: '' }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'specs',
  });

  async function onSubmit(data: ProductFormValues) {
    if (!firestore) return;

    const productData = {
        ...data,
        specs: data.specs.map(s => s.value),
        // These are placeholders, you might want to add form fields for them
        rating: product?.rating || Math.random() * 2 + 3, // Random rating between 3 and 5
        reviewCount: product?.reviewCount || Math.floor(Math.random() * 200),
        images: product?.images || [
            { id: '1', url: `https://picsum.photos/seed/${Math.random()}/800/800`, alt: data.name, hint: 'product photo' },
            { id: '2', url: `https://picsum.photos/seed/${Math.random()}/800/800`, alt: data.name, hint: 'product detail' },
        ]
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
                        {fields.map((field, index) => (
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
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                        ))}
                         <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => append({ value: "" })}
                        >
                            Add Specification
                        </Button>
                    </div>

                    <Button type="submit">
                        {product ? 'Update Product' : 'Create Product'}
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

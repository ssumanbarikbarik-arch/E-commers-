"use client";

import { useState } from 'react';
import { generateProductDescription } from '@/ai/flows/ai-product-description';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Loader2, Sparkles } from 'lucide-react';

export function DescriptionGenerator() {
  const [title, setTitle] = useState('');
  const [specs, setSpecs] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!title || !specs) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please provide a title and specifications.',
      });
      return;
    }

    setIsLoading(true);
    setDescription('');

    try {
      const specsArray = specs.split('\n').filter(s => s.trim() !== '');
      const result = await generateProductDescription({ title, specs: specsArray });
      setDescription(result.description);
      toast({
        title: 'Success!',
        description: 'Product description generated.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate description. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-3xl font-headline flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-accent"/>
                AI Product Description Generator
            </CardTitle>
            <CardDescription>
                Enter a product title and a list of specs (one per line) to generate a compelling e-commerce description.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Classic Denim Jacket"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="specs">Specifications (one per line)</Label>
                <Textarea
                id="specs"
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                placeholder="e.g., 100% Cotton&#10;Machine Washable&#10;Button Closure"
                rows={4}
                />
            </div>
            {description && (
                <div className="space-y-2 pt-4">
                    <Label htmlFor="description">Generated Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        readOnly
                        rows={6}
                        className="bg-muted"
                    />
                </div>
            )}
        </CardContent>
        <CardFooter>
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Description
            </Button>
        </CardFooter>
    </Card>
  );
}

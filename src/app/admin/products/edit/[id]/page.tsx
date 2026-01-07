
'use client';

import { ProductForm } from '@/components/admin/product-form';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import React from 'react';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const firestore = useFirestore();
  const productRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'products', resolvedParams.id) : null),
    [firestore, resolvedParams.id]
  );
  const { data: product, isLoading } = useDoc(productRef);

  if (isLoading) {
    return <p>Loading product...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return <ProductForm product={product} />;
}

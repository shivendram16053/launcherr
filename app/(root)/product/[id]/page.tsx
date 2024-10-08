"use client";

import { useEffect, useState } from 'react';
import { useRouter,useParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  isOpenSource: boolean;
  githubLink?: string;
  twitter: string;
  topic: string;
  logoUrl: string;
  ogImageUrl?: string;
  pitchVideoUrl?: string;
  status: string; // "startup" or "preexisting"
}

const ProductDetail = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the product ID from the query
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; // Do not fetch if ID is not available
      try {
        const res = await fetch(`/api/products/fetchOne/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('An error occurred while fetching product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-xl text-gray-600">{product.tagline}</p>
      <img src={product.logoUrl} alt={`${product.name} logo`} className="w-32 h-32 object-cover" />
      
      <h2 className="mt-4 text-2xl">Description</h2>
      <p>{product.description}</p>
      
      <h2 className="mt-4 text-2xl">Details</h2>
      <ul className="list-disc ml-5">
        <li><strong>Open Source:</strong> {product.isOpenSource ? 'Yes' : 'No'}</li>
        {product.githubLink && (
          <li>
            <strong>GitHub:</strong> <a href={product.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">{product.githubLink}</a>
          </li>
        )}
        <li><strong>Twitter:</strong> <a href={`https://twitter.com/${product.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">@{product.twitter}</a></li>
        <li><strong>Topic:</strong> {product.topic}</li>
        <li><strong>Status:</strong> {product.status}</li>
        {product.pitchVideoUrl && (
          <li>
            <strong>Pitch Video:</strong> <a href={product.pitchVideoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">Watch Video</a>
          </li>
        )}
        {product.ogImageUrl && (
          <li>
            <strong>Image:</strong> <img src={product.ogImageUrl} alt={`${product.name} OG Image`} className="w-32 h-32 object-cover" />
          </li>
        )}
      </ul>
    </div>
  );
};

export default ProductDetail;
'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface UserProfile {
  id: string; 
  name: string;
  email: string;
}

interface Product {
  id: string; 
  name: string;
  tagline: string;
  description: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productError,setProductError] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const publicKey = localStorage.getItem('publickey');
    
    if (!publicKey) {
      router.push('/');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`/api/users/fetch?publicKey=${publicKey}`);
        if (!res.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await res.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('An error occurred while fetching the user profile.');
        router.push('/onboarding')
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products/fetching?publicKey=${publicKey}`);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();

        if(data.length == 0){
          setProductError("No product found")
        }
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('An error occurred while fetching products.');
      }
    };

    fetchUserProfile();
    fetchProducts();
    setLoading(false);

  }, [router]);

  const handleProductClick = (productId: string) => {
    // Navigate to the product detail page
    router.push(`/product/${productId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {userProfile && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p>Name: {userProfile.name}</p>
          <p>Email: {userProfile.email}</p>
          {/* Display more user details if needed */}
        </div>
      )}

      <Link href="/createproduct">
        <p className="bg-white text-black px-4 py-2 rounded-lg hover:bg-slate-300 transition duration-300">
          Create Product
        </p>
      </Link>

      <h2 className="text-2xl font-bold mt-8">Your Products</h2>
      <ul className="space-y-4">
        {productError && <p className='text-red-600'>{productError}</p>}
        {products.map((product) => (
          <li key={product.id} className="p-4 border rounded shadow">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.tagline}</p>
            <p>{product.description}</p>

            <h4
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => handleProductClick(product.id)}
            >
              Show more information...
            </h4>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

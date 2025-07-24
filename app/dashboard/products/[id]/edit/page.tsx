"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((product) => {
        setName(product.name);
        setPrice((product.price / 100).toString());
        setDescription(product.description || "");
        setImage(product.image || "");
        setStock(product.stock?.toString() || "0");
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Math.round(parseFloat(price) * 100),
        description,
        image,
        stock: parseInt(stock, 10),
      }),
    });

    if (res.ok) {
      router.push("/dashboard/products");
    } else {
      alert("Failed to update product");
    }
  }

  if (loading) return <p className="text-center text-gray-700">Loading product...</p>;

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border border-gray-300 p-3 rounded w-full text-gray-900"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="border border-gray-300 p-3 rounded w-full text-gray-900"
            placeholder="Price (₹)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            className="border border-gray-300 p-3 rounded w-full text-gray-900"
            placeholder="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <input
            className="border border-gray-300 p-3 rounded w-full text-gray-900"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
          <textarea
            className="border border-gray-300 p-3 rounded w-full text-gray-900"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />

          <button
            className="bg-green-600 text-white w-full py-3 rounded hover:bg-green-700 transition"
            type="submit"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

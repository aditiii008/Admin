"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); // price in rupees
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState(""); // stock count
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price: Math.round(parseFloat(price) * 100), // convert ₹ to paise
        image,
        stock: parseInt(stock, 10) || 0,
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard/products");
    } else {
      alert("Failed to add product");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          className="border p-2 w-full"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Price (₹)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          type="submit"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

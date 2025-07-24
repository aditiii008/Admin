"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ProductItem {
  name: string;
  quantity: number;
  price: number; 
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string; 
  total: number;
  status: string;
  products: ProductItem[];
  createdAt: string;
}

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();

      
      const parsedOrder = {
        ...data,
        products: Array.isArray(data.products)
          ? data.products
          : JSON.parse(data.products || "[]"),
      };

      setOrder(parsedOrder);
      setLoading(false);
    }
    fetchOrder();
  }, [id]);

  async function updateStatus(newStatus: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
  }

  if (loading) return <p className="p-6">Loading order details...</p>;
  if (!order) return <p className="p-6">Order not found.</p>;

  return (
    <div className="p-6 space-y-6">
      
      <button
        onClick={() => router.back()}
        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
      >
        Back
      </button>

      
      <h1 className="text-2xl font-bold">Order Details</h1>

      
      <div className="bg-white shadow rounded p-4 space-y-2">
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Email:</strong> {order.customerEmail}</p>
        {order.customerPhone && <p><strong>Phone:</strong> {order.customerPhone}</p>}

        
        {order.customerAddress && (
        <div>
            <strong>Address:</strong>
            <div className="mt-1 p-2 bg-gray-100 rounded border space-y-1">
            {(() => {
                const address =
                typeof order.customerAddress === "string"
                    ? JSON.parse(order.customerAddress)
                    : order.customerAddress;
                return (
                <>
                    <p>{address.fullName}</p>
                    <p>{address.street}</p>
                    <p>
                    {address.city}, {address.state} - {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                    {address.phone && <p>Phone: {address.phone}</p>}
                </>
                );
            })()}
            </div>
        </div>
        )}


        <p><strong>Total:</strong> ₹ {(order.total / 100).toFixed(2)}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      
      <div className="flex gap-2">
        {["PENDING", "SHIPPED", "DELIVERED"].map((s) => (
          <button
            key={s}
            onClick={() => updateStatus(s)}
            className={`px-4 py-2 rounded ${
              order.status === s
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Mark as {s}
          </button>
        ))}
      </div>

      
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-4">Products</h2>
        {order.products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((p, i) => (
                <tr key={i}>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.quantity}</td>
                  <td className="p-2 border">₹ {(p.price / 100).toFixed(2)}</td>
                  <td className="p-2 border">
                    ₹ {((p.price * p.quantity) / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

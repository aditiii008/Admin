"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter((o) => o.status.toUpperCase() === filter);

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {["ALL", "PENDING", "SHIPPED", "DELIVERED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="p-2 border">{order.customerName}</td>
                <td className="p-2 border">₹ {(order.total / 100).toFixed(2)}</td>
                <td className="p-2 border">{order.status}</td>
                <td className="p-2 border">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

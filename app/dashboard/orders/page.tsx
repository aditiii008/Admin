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

  if (loading) return <p className="p-4 text-center text-gray-800">Loading orders...</p>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "PENDING", "SHIPPED", "DELIVERED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-700">No orders found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm text-gray-900">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3 whitespace-nowrap">Customer</th>
                <th className="p-3 whitespace-nowrap">Total</th>
                <th className="p-3 whitespace-nowrap">Status</th>
                <th className="p-3 whitespace-nowrap">Date</th>
                <th className="p-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 whitespace-nowrap">{order.customerName}</td>
                  <td className="p-3 whitespace-nowrap">
                    ₹ {(order.total / 100).toFixed(2)}
                  </td>
                  <td className="p-3 whitespace-nowrap">{order.status}</td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

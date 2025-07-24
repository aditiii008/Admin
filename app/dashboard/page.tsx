"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        setStats({
          products: data.totalProducts,
          orders: data.totalOrders,
          customers: data.totalCustomers,
        });
        setRecentOrders(data.recentOrders);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleLogout() {
    document.cookie = "admin-auth=; Max-Age=0; path=/";
    window.location.href = "/login";
  }

  if (loading) return <p className="p-6 text-gray-800">Loading Dashboard...</p>;

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center"
        >
          + Add Product
        </Link>
        <Link
          href="/dashboard/products"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-center"
        >
          View Products
        </Link>
        <Link
          href="/dashboard/orders"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-center"
        >
          View Orders
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-700 text-sm">Total Products</h2>
          <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-700 text-sm">Total Orders</h2>
          <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-700 text-sm">Total Customers</h2>
          <p className="text-2xl font-bold text-gray-900">{stats.customers}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-700">No recent orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-gray-900">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-800">
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
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
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
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
    </div>
  );
}

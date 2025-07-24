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

  if (loading) return <p className="p-6">Loading Dashboard...</p>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full md:w-auto"
        >
          Logout
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <Link
          href="/dashboard/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center w-full sm:w-auto"
        >
          + Add Product
        </Link>
        <Link
          href="/dashboard/products"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center w-full sm:w-auto"
        >
          View Products
        </Link>
        <Link
          href="/dashboard/orders"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-center w-full sm:w-auto"
        >
          View Orders
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-500 text-sm">Total Products</h2>
          <p className="text-2xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-500 text-sm">Total Orders</h2>
          <p className="text-2xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-500 text-sm">Total Customers</h2>
          <p className="text-2xl font-bold">{stats.customers}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p>No recent orders found.</p>
        ) : (
          <table className="w-full min-w-[600px] text-sm border-collapse">
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
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar"; 

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

  if (loading) return <p className="p-6 text-gray-800">Loading Dashboard...</p>;

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-gray-600 text-sm">Total Products</h2>
            <p className="text-3xl font-bold text-gray-900">{stats.products}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-gray-600 text-sm">Total Orders</h2>
            <p className="text-3xl font-bold text-gray-900">{stats.orders}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-gray-600 text-sm">Total Customers</h2>
            <p className="text-3xl font-bold text-gray-900">{stats.customers}</p>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-600">No recent orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 border-b">Customer</th>
                    <th className="p-3 border-b">Total</th>
                    <th className="p-3 border-b">Status</th>
                    <th className="p-3 border-b">Date</th>
                    <th className="p-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{order.customerName}</td>
                      <td className="p-3 border-b">₹ {(order.total / 100).toFixed(2)}</td>
                      <td className="p-3 border-b">{order.status}</td>
                      <td className="p-3 border-b">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 border-b">
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
      </main>
    </div>
  );
}

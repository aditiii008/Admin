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
  trackingUrl?: string;
  products: ProductItem[];
  createdAt: string;
}

interface UpdateStatusBody {
  status: string;
  trackingUrl?: string;
}

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingUrl, setTrackingUrl] = useState("");

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
      setTrackingUrl(data.trackingUrl || "");
      setLoading(false);
    }
    fetchOrder();
  }, [id]);

  async function updateStatus(newStatus: string) {
    const body: UpdateStatusBody = { status: newStatus };

    // ✅ Always include tracking URL if it's provided
    if (trackingUrl.trim()) {
      body.trackingUrl = trackingUrl.trim();
    }

    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setOrder((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            trackingUrl: body.trackingUrl ?? prev.trackingUrl,
          }
        : prev
    );
  }

  async function updateTrackingOnly() {
    const trimmedUrl = trackingUrl.trim();
    if (!trimmedUrl) return;

    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingUrl: trimmedUrl }),
    });

    setOrder((prev) =>
      prev ? { ...prev, trackingUrl: trimmedUrl } : prev
    );
  }

  if (loading) return <p className="p-4 text-gray-800">Loading order details...</p>;
  if (!order) return <p className="p-4 text-gray-800">Order not found.</p>;

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto text-gray-900">
      <button
        onClick={() => router.back()}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm font-medium"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">Order Details</h1>

      <div className="bg-white shadow rounded p-4 space-y-2 text-sm">
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
                    <p>{address.city}, {address.state} - {address.postalCode}</p>
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

        {order.trackingUrl && (
          <p>
            <strong>Tracking:</strong>{" "}
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Track Order
            </a>
          </p>
        )}
      </div>

      {order.status !== "DELIVERED" && (
        <>
          <div className="flex flex-wrap gap-2">
            {["PENDING", "SHIPPED", "DELIVERED"].map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                className={`px-4 py-2 text-sm rounded transition ${
                  order.status === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                Mark as {s}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Tracking URL (for SHIPPED orders)
            </label>
            <input
              type="text"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="https://example.com/track/..."
              className="w-full border px-3 py-2 rounded text-sm"
            />

            <button
              onClick={updateTrackingOnly}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Save Tracking URL
            </button>
          </div>
        </>
      )}

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        {order.products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse hidden md:table">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-800">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Quantity</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((p, i) => (
                  <tr key={i} className="text-gray-800">
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

            <div className="space-y-4 md:hidden">
              {order.products.map((p, i) => (
                <div
                  key={i}
                  className="border p-3 rounded bg-gray-50 flex flex-col space-y-1 text-gray-800"
                >
                  <p><strong>Name:</strong> {p.name}</p>
                  <p><strong>Quantity:</strong> {p.quantity}</p>
                  <p><strong>Price:</strong> ₹ {(p.price / 100).toFixed(2)}</p>
                  <p><strong>Subtotal:</strong> ₹ {((p.price * p.quantity) / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
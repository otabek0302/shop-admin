"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Order } from "@/interfaces/orders";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const InvoicePage = () => {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch order");
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Order not found</h1>
      </div>
    );
  }

  const total = order.orderItems.reduce((sum, item) => sum + item.total, 0);

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <section className="h-full">
      <div className="p-8 font-sans bg-white text-gray-800 max-w-4xl mx-auto">
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            body * {
              visibility: hidden;
            }
            .print-content, .print-content * {
              visibility: visible;
            }
            .print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 2rem;
            }
            .no-print {
              display: none !important;
            }
            /* Ensure colors and borders print */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .bg-primary {
              background-color: #1b5ffe !important;
            }
            .text-primary-foreground {
              color: #ffffff !important;
            }
            .border {
              border: 1px solid #e5e7eb !important;
            }
            .border-b {
              border-bottom: 1px solid #e5e7eb !important;
            }
            .border-x {
              border-left: 1px solid #e5e7eb !important;
              border-right: 1px solid #e5e7eb !important;
            }
          }
        `}</style>
        <div className="print-content">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-8">INVOICE</h1>
              <div className="space-y-1">
                <p className="font-semibold text-lg">Your Business Name</p>
                <p>Your Address</p>
                <p>Your Phone Number</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-semibold text-lg mb-2">Bill to:</h2>
              <div className="space-y-1">
                <p className="font-medium">Customer Name</p>
                <p>Customer Address</p>
                <p>Customer Phone</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="font-semibold text-lg mb-2">Invoice Details:</h2>
              <div className="space-y-1 mb-6">
                <p className="flex justify-end items-center">
                  <span className="font-semibold">Invoice number:</span>
                  <span className="ml-2">{order.id.slice(0, 6)}</span>
                </p>
                <p>
                  <span className="font-semibold">Invoice date:</span> {formattedDate}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-primary text-primary-foreground grid grid-cols-4 p-3 rounded-t-md">
              <div>Item</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Price per unit</div>
              <div className="text-right">Amount</div>
            </div>
            <div className="border-x border-b">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-4 p-3 border-b last:border-b-0">
                  <div>{item.product.name}</div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-center">₹{item.price.toFixed(2)}</div>
                  <div className="text-right">₹{item.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

            <div className="flex justify-between text-primary p-3 rounded-md items-center">
              <span className="font-bold">TOTAL</span>
              <span className="font-bold text-xl">₹{total.toFixed(2)}</span>
            </div>
          <div className="flex flex-col items-end">
            <Button onClick={handlePrint} variant="outline" className="no-print">
              <PrinterIcon className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoicePage; 
"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function StripeCheckoutForm({ hiringId }) {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await apiFetch("/payments/confirm", {
          method: "POST",
          token,
          body: JSON.stringify({ hiringId, transactionId: paymentIntent.id }),
        });
        toast.success("Payment successful!");
        router.push("/dashboard/user/hiring-history");
      } catch (err) {
        toast.error(err.message || "Payment succeeded but confirmation failed.");
      }
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="btn-press w-full bg-navy-700 hover:bg-navy-800 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
      >
        {submitting ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { apiFetch } from "../../../../../lib/api";
import { useAuth } from "../../../../../context/AuthContext";
import RoleRoute from "../../../../../components/RoleRoute";
import StripeCheckoutForm from "../../../../../components/StripeCheckoutForm";
import Loader from "../../../../../components/Loader";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function PayContent() {
  const { hiringId } = useParams();
  const { token } = useAuth();
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    apiFetch("/create-payment-intent", { method: "POST", token, body: JSON.stringify({ hiringId }) })
      .then((d) => setClientSecret(d.clientSecret))
      .catch((err) => setError(err.message || "Could not start payment."));
  }, [token, hiringId]);

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white dark:bg-[#131d35] border border-navy-100 dark:border-white/10 rounded-2xl card-shadow p-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Complete Payment</h1>
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : !clientSecret ? (
          <Loader label="Preparing checkout..." />
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeCheckoutForm hiringId={hiringId} />
          </Elements>
        )}
      </div>
    </div>
  );
}

export default function Pay() {
  return <RoleRoute allow={["user"]}><PayContent /></RoleRoute>;
}

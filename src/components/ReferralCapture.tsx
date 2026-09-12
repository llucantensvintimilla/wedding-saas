"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { setReferralCode } from "@/lib/referrals";

export default function ReferralCapture() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (ref) {
      console.log(`Captured referral code: ${ref}`);
      setReferralCode(ref);
    }
  }, [ref]);

  return null; // This is a logic-only component
}

"use client";

import { useState } from "react";
import { INVITE_CODE } from "./invite.config";

export default function InviteGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (code.trim() === INVITE_CODE) {
      setOk(true);
    } else {
      alert("Invalid code. Please try again.");
    }
  };

  if (ok) return <>{children}</>;

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-sm text-left border rounded p-4 shadow"
    >
      <label className="block text-sm mb-2">Enter invite code</label>
      <input
        className="w-full border rounded px-3 py-2 mb-3"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Invite code"
      />
      <button
        type="submit"
        className="w-full rounded bg-black text-white py-2 hover:bg-gray-800"
      >
        Continue
      </button>
      <p className="text-xs opacity-70 mt-3">
        Ask Domana for a code to join the private beta.
      </p>
    </form>
  );
}

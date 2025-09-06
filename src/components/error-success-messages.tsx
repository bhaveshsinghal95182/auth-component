import React from "react";
import { ClerkAPIError } from "@clerk/types";

export function ErrorSuccessMessages({ errors }: { errors?: ClerkAPIError[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div className="mb-4">
      {errors.map((err, idx) =>
        err.code === "success" ? (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 text-green-700 px-3 py-2 text-sm mb-2"
          >
            <svg
              className="w-4 h-4 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{err.message}</span>
          </div>
        ) : (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm mb-2"
          >
            <svg
              className="w-4 h-4 text-red-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
            <span>{err.message}</span>
          </div>
        )
      )}
    </div>
  );
}

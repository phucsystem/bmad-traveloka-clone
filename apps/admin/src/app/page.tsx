"use client";

import { Refine } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function AdminPage() {
  return (
    <Refine dataProvider={dataProvider(`${API_URL}/api/v1`)}>
      <main style={{ padding: "2rem" }}>
        <h1>TravelClone Admin Dashboard</h1>
        <p>Use the navigation to manage inventory, promotions, and bookings.</p>
      </main>
    </Refine>
  );
}

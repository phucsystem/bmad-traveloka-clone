export const queryKeys = {
  flights: {
    all: () => ["flights"] as const,
    search: (params: Record<string, unknown>) =>
      ["flights", "search", params] as const,
  },
  hotels: {
    all: () => ["hotels"] as const,
    search: (params: Record<string, unknown>) =>
      ["hotels", "search", params] as const,
  },
  bookings: {
    all: () => ["bookings"] as const,
    byId: (bookingId: string) => ["bookings", bookingId] as const,
    myBookings: () => ["bookings", "my"] as const,
  },
  promotions: {
    all: () => ["promotions"] as const,
    active: (city?: string) => ["promotions", "active", city] as const,
  },
  user: {
    profile: () => ["user", "profile"] as const,
  },
};

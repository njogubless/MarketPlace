const BASE_URL = "http://localhost:8000/api";

export const fetchVendors = async () => {
  const res = await fetch(`${BASE_URL}/vendors/`);
  if (!res.ok) throw new Error("Failed to fetch vendors");
  return res.json();
};

export const fetchVendorById = async (id) => {
  const res = await fetch(`${BASE_URL}/vendors/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch vendor");
  return res.json();
};

export const fetchVendorProducts = async (id) => {
  const res = await fetch(`${BASE_URL}/vendors/${id}/products/`);
  if (!res.ok) throw new Error("Failed to fetch vendor products");
  return res.json();
};
const BASE_URL = "http://localhost:8000/api";

export const fetchReviewsByProduct = async (productId) => {
  const res = await fetch(`${BASE_URL}/products/${productId}/reviews/`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

export const submitReview = async (productId, reviewData) => {
  const res = await fetch(`${BASE_URL}/products/${productId}/reviews/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });
  if (!res.ok) throw new Error("Failed to submit review");
  return res.json();
};
export const addReview = async (
  productId: string,
  userId: string,
  rating: number,
  title: string,
  comment: string
) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem("token");
  console.log(title);
  console.log(comment);
  const res = await fetch(`${serverUrl}/api/review/${productId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: userId,
      rating: rating,
      comment: comment,
      title: title,
    }),
  });
  return res;
};

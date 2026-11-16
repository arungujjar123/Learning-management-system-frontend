// Course rating as the backend sends it: { average, count }.
// When nobody has rated a course yet we show "New" instead of a made-up score.
export function getRatingDisplay(rating) {
  const count = typeof rating === "object" && rating ? Number(rating.count) || 0 : 0;
  const average = typeof rating === "object" && rating ? Number(rating.average) || 0 : 0;
  if (count === 0) {
    return { hasRatings: false, average: 0, count: 0, label: "New", countLabel: "No reviews yet" };
  }
  const rounded = Math.round(average * 10) / 10;
  return {
    hasRatings: true,
    average: rounded,
    count,
    label: rounded.toFixed(1),
    countLabel: `${count} ${count === 1 ? "review" : "reviews"}`,
  };
}

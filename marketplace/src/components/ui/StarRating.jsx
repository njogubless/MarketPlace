const StarRating = ({ rating = 0, maxStars = 5 }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;

        return (
          <i
            key={i}
            className={`fas ${
              filled ? "fa-star" : half ? "fa-star-half-alt" : "fa-star"
            } ${i < rating ? "text-yellow-400" : "text-gray-300"} text-sm`}
          ></i>
        );
      })}
      <span className="text-gray-500 text-sm ml-1">({rating})</span>
    </div>
  );
};

export default StarRating;
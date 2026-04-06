import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export const getRandomItems = (arr, count) => {
  if (!Array.isArray(arr)) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const renderStars = (rating, className, width = 20, height = 31) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <div key={i}>
          <FaStar
            className={className}
            size={width}
            height={height}
            width={width}
          />
        </div>
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <div key={i}>
          <FaStarHalfAlt
            className={className}
            height={height}
            size={width}
            width={width}
          />
        </div>
      );
    } else {
      stars.push(
        <div key={i}>
          <FaRegStar
            className={className}
            height={height}
            size={width}
            width={width}
          />
        </div>
      );
    }
  }
  return stars;
};

export const filterArray = (array = [], hidden = "") => {
  return array.filter((item) => item.key !== hidden);
};

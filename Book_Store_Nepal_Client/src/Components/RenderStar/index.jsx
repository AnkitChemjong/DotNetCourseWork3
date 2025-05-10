import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => {
      const starNumber = i + 1;
      if (rating === 0) {
        return <FaRegStar key={i} className="text-yellow-400" />;
      }
      if (starNumber <= Math.floor(rating)) {
        return <FaStar key={i} className="text-yellow-400" />;
      }
      if (starNumber === Math.ceil(rating) && rating % 1 >= 0.5) {
        return <FaStarHalfAlt key={i} className="text-yellow-400" />;
      }
      return <FaRegStar key={i} className="text-yellow-400" />;
    });
  };

export default renderStars;
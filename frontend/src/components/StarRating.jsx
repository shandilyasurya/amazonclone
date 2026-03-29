import { Star } from 'lucide-react';

const STAR_COLOR = 'var(--color-amz-star)'; // #FF9900

const StarRating = ({ value = 0, size = 14, text }) => {
  const numValue = parseFloat(value) || 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = numValue >= i;
          const half   = !filled && numValue >= i - 0.5;

          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              {/* Background (empty) star */}
              <Star
                size={size}
                strokeWidth={1}
                color={STAR_COLOR}
                fill="transparent"
                className="absolute inset-0"
              />
              {/* Foreground fill — full or half */}
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: half ? '52%' : '100%' }}
                >
                  <Star
                    size={size}
                    strokeWidth={1}
                    color={STAR_COLOR}
                    fill={STAR_COLOR}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {text && (
        <span className="text-link text-[12px] ml-0.5">{text}</span>
      )}
    </div>
  );
};

export default StarRating;

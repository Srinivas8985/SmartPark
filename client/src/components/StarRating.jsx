import React, { useState } from 'react';

const StarRating = ({ rating, setRating, readOnly = false }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} bg-transparent border-none outline-none focus:outline-none transition-transform hover:scale-110`}
                        onClick={() => !readOnly && setRating(index)}
                        onMouseEnter={() => !readOnly && setHover(index)}
                        onMouseLeave={() => !readOnly && setHover(rating)}
                    >
                        <span className={`text-2xl ${index <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
                            &#9733;
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;

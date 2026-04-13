import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => {
    return (
        <div className={`card glass ${className}`} {...props}>
            {children}
        </div>
    );
};

export default GlassCard;

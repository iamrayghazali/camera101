import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollAnimationProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const ScrollAnimation = ({ children, className = "", delay = 0 }: ScrollAnimationProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollAnimation;
import  { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface RollingNumberProps {
    value: number;
    className: string;
    suffix?: string;
}

const RollingNumber = ({ value, className, suffix = "" }: RollingNumberProps) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const duration = 2000; // 2 seconds
            const steps = 60; // 60 steps for smooth animation
            const increment = value / steps;
            const stepDuration = duration / steps;

            let currentStep = 0;
            const timer = setInterval(() => {
                currentStep++;
                const newValue = Math.min(Math.floor(increment * currentStep), value);
                setDisplayValue(newValue);

                if (currentStep >= steps) {
                    setDisplayValue(value);
                    clearInterval(timer);
                }
            }, stepDuration);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <div ref={ref} className={className}>
            {displayValue}{suffix}
        </div>
    );
};

export default RollingNumber;
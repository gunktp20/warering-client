// ProgressBar.tsx
import React, { useEffect } from 'react';

// Define props for the ProgressBar
interface ProgressBarProps {
    value: number;  // Current progress value
    min?: number;   // Minimum value (default is 0)
    max?: number;   // Maximum value (default is 100)
    id: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, min = 0, max = 100, id }) => {
    // Calculate the normalized percentage value
    const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

    // Use an inline style to set the CSS variable --value
    useEffect(() => {
        const progressEle = document.getElementById(id)
        progressEle?.style.setProperty('--value', `${percentage}`);
    }, [percentage]);

    return (
        <div id={id} role="progressbar" aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}></div>
    );
};

export default ProgressBar;
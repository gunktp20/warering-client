import React from 'react';

interface TooltipProps {
    children: React.ReactNode;
    text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {

    return (
        <div className="relative flex items-center group text-nowrap">
            {children}
            <div className="absolute z-10 hidden text-nowrap group-hover:flex items-center">
                <span className={`absolute whitespace-no-wrap bg-white border-[1px] text-gray-700 text-[10.5px] rounded py-1 px-2 top-full left-[2rem] transform mt-2 shadow-sm`}>
                    {text}
                </span>
            </div>
        </div>
    );
};

export default Tooltip;

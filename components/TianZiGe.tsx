
import React from 'react';

interface TianZiGeProps {
  size?: number;
}

const TianZiGe: React.FC<TianZiGeProps> = ({ size = 56 }) => {
  // 使用经典的黑灰配色，打印效果更佳
  const outerStroke = "#000000"; // 外边框纯黑
  const innerLine = "#d1d5db";  // 内部辅助线淡灰（gray-300）

  return (
    <div 
      className="relative border border-black bg-white" 
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 中间虚线 - 十字线 */}
      <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-gray-300" style={{ transform: 'translateY(-0.5px)' }}></div>
      <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-gray-300" style={{ transform: 'translateX(-0.5px)' }}></div>
      
      {/* 对角斜线 - 极细虚线 */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
      >
        <line 
          x1="0" y1="0" x2="100" y2="100" 
          stroke={innerLine} 
          strokeWidth="0.2" 
          strokeDasharray="1,2"
          vectorEffect="non-scaling-stroke"
        />
        <line 
          x1="100" y1="0" x2="0" y2="100" 
          stroke={innerLine} 
          strokeWidth="0.2" 
          strokeDasharray="1,2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export default TianZiGe;

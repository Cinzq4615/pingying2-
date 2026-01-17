
import React from 'react';

interface TianZiGeProps {
  size?: number;
}

const TianZiGe: React.FC<TianZiGeProps> = ({ size = 56 }) => {
  // 定义颜色：极浅的红色，确保打印时不抢戏
  const gridColor = "#fecaca"; // Tailwind red-200
  const lightGridColor = "#fee2e2"; // Tailwind red-100

  return (
    <div 
      className="relative border border-red-400 bg-white" 
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 中间十字线 - 使用极细的虚线 */}
      <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-red-200" style={{ transform: 'translateY(-0.5px)' }}></div>
      <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-red-200" style={{ transform: 'translateX(-0.5px)' }}></div>
      
      {/* 对角斜线 - 使用 SVG 绘制，优化渲染参数 */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
      >
        <line 
          x1="0" y1="0" x2="100" y2="100" 
          stroke={lightGridColor} 
          strokeWidth="0.2" 
          strokeDasharray="2,2"
          vectorEffect="non-scaling-stroke"
        />
        <line 
          x1="100" y1="0" x2="0" y2="100" 
          stroke={lightGridColor} 
          strokeWidth="0.2" 
          strokeDasharray="2,2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export default TianZiGe;

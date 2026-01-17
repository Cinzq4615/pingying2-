
import React from 'react';
import TianZiGe from './TianZiGe';
import { WordItem } from '../types';

interface WorksheetItemProps {
  item: WordItem;
}

const WorksheetItem: React.FC<WorksheetItemProps> = ({ item }) => {
  const characters = item.word.split('');
  const pinyinParts = item.pinyin.trim().split(/\s+/);
  const boxSize = 56;

  return (
    /* 移除 mr-6 和 mb-8，改由父容器 gap 控制 */
    <div className="inline-flex flex-col items-start break-inside-avoid">
      <div className="flex">
        {characters.map((_, idx) => (
          <div key={idx} className="flex flex-col items-center flex-shrink-0">
            {/* 拼音部分 */}
            <div 
              style={{ width: `${boxSize}px` }}
              className="h-9 flex items-center justify-center overflow-visible"
            >
              <span className="text-[16px] font-bold text-black leading-none whitespace-nowrap">
                {pinyinParts[idx] || ''}
              </span>
            </div>
            
            {/* 田字格部分 - 边框重叠处理 */}
            <div className={idx > 0 ? "-ml-[1px]" : ""}>
              <TianZiGe size={boxSize} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorksheetItem;

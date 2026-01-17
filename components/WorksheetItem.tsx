
import React from 'react';
import TianZiGe from './TianZiGe';
import { WordItem } from '../types';

interface WorksheetItemProps {
  item: WordItem;
}

const WorksheetItem: React.FC<WorksheetItemProps> = ({ item }) => {
  const characters = item.word.split('');
  // Split pinyin by spaces. We handle multiple spaces and trim.
  const pinyinParts = item.pinyin.trim().split(/\s+/);
  
  // Size of one grid box
  const boxSize = 56;

  return (
    <div className="inline-flex flex-col items-start mr-8 mb-6 break-inside-avoid">
      <div className="flex">
        {characters.map((_, idx) => (
          <div key={idx} className="flex flex-col items-center flex-shrink-0">
            {/* 
                Pinyin Container: 
                Increased height from h-6 to h-10 (40px) to provide ample space for descenders.
                Used items-center instead of items-end to avoid pushing characters too close to the grid.
            */}
            <div 
              style={{ width: `${boxSize}px` }}
              className="h-10 flex items-center justify-center overflow-visible"
            >
              <span className="text-[15px] font-medium text-gray-900 leading-normal whitespace-nowrap">
                {pinyinParts[idx] || ''}
              </span>
            </div>
            
            {/* Grid Box with border collapse logic */}
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

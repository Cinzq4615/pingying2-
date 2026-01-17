
import React, { useState, useRef, useMemo } from 'react';
import { extractWordsAndPinyin } from './services/geminiService';
import { ProcessingResult, WordItem } from './types';
import WorksheetItem from './components/WorksheetItem';

const App: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const worksheetRef = useRef<HTMLDivElement>(null);

  // 分页逻辑
  const pages = useMemo(() => {
    if (!result) return [];
    const itemsPerPage = 35; 
    const chunks: WordItem[][] = [];
    for (let i = 0; i < result.words.length; i += itemsPerPage) {
      chunks.push(result.words.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [result]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileList = Array.from(files) as File[];
    const promises = fileList.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(base64s => {
      setImages(prev => [...prev, ...base64s]);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const data = await extractWordsAndPinyin(images);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("处理失败，请确认图片清晰。");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!worksheetRef.current) return;
    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) return;
    
    setIsExporting(true);
    
    const element = worksheetRef.current;
    
    // 导出前移除预览特有的类名以确保纯净
    element.classList.remove('preview-mode');

    const opt = {
      margin: 0,
      filename: `${result?.title || '看拼音写词语'}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#ffffff' // 强制背景为白
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      alert("PDF 生成失败，请尝试浏览器自带的打印功能 (Ctrl+P)。");
    } finally {
      setIsExporting(false);
      // 恢复预览模式类名
      element.classList.add('preview-mode');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 操作面板 */}
      <div className="no-print bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">看拼音写词语生成器</h1>
          {result && (
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg disabled:bg-gray-400 transition-all flex items-center gap-2"
            >
              {isExporting ? "生成中..." : "导出高质量 PDF"}
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 min-h-[100px] items-center">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border shadow-sm group">
                <img src={img} className="w-full h-full object-cover" />
                <button onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                   删除
                </button>
              </div>
            ))}
            <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 flex flex-col items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all">
              <span className="text-2xl">+</span>
              <span className="text-[10px]">添加图片</span>
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
          <button onClick={handleGenerate} disabled={isProcessing || images.length === 0} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl hover:bg-indigo-700 disabled:bg-gray-300 transition-all">
            {isProcessing ? "AI 识别中，请稍候..." : "开始生成练习卷"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>

      {/* 练习卷预览/导出容器 */}
      {result && (
        <div ref={worksheetRef} className="preview-container preview-mode flex flex-col gap-0 overflow-hidden">
          {pages.map((pageWords, pageIdx) => (
            <div 
              key={pageIdx} 
              className="worksheet-page flex flex-col relative"
              style={{ 
                width: '210mm', 
                height: '296.8mm', 
                padding: '15mm 20mm 15mm 20mm' 
              }}
            >
              {/* 第一页展示完整标题和信息栏 */}
              {pageIdx === 0 ? (
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold tracking-[0.2em] text-black border-b-[3px] border-black inline-block pb-1 px-8 mb-6">
                    {result.title}
                  </h2>
                  <div className="flex justify-center gap-12 text-[14px] font-bold text-black">
                    <span>班级：___________</span>
                    <span>姓名：___________</span>
                    <span>得分：___________</span>
                  </div>
                </div>
              ) : (
                <div className="mb-6 flex justify-between items-center border-b border-black pb-1">
                  <span className="text-sm font-bold">{result.title} (续)</span>
                  <span className="text-[10px] text-gray-500 italic">专注基础，助力成长</span>
                </div>
              )}

              {pageIdx === 0 && (
                <div className="mb-6 font-black text-lg text-black border-l-[6px] border-black pl-3 py-0.5">
                  一、看拼音，写词语。
                </div>
              )}
              
              <div className="flex flex-wrap content-start flex-1 overflow-hidden gap-x-5 gap-y-10">
                {pageWords.map((item, index) => (
                  <WorksheetItem key={index} item={item} />
                ))}
              </div>

              {/* 页码固定在底部 */}
              <div className="absolute bottom-8 left-0 right-0 text-center text-[12px] font-medium text-black">
                — {pageIdx + 1} / {pages.length} —
              </div>
            </div>
          ))}
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-bold text-gray-700">正在通过 AI 解析图片词语...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;


import React, { useState, useRef } from 'react';
import { extractWordsAndPinyin } from './services/geminiService';
import { ProcessingResult } from './types';
import WorksheetItem from './components/WorksheetItem';

const App: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const worksheetRef = useRef<HTMLDivElement>(null);

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
      setError("处理失败，请确认图片清晰并检查网络。");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!worksheetRef.current) return;
    
    // 获取全局 html2pdf 对象
    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
      alert("PDF 生成组件尚未加载完成，请稍候再试。");
      return;
    }
    
    setIsExporting(true);
    
    const element = worksheetRef.current;
    const opt = {
      margin: 0,
      filename: `${result?.title || '看拼音写词语'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // 使用更稳定的链式调用
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("生成 PDF 失败。如果此问题持续存在，请尝试按 Ctrl+P 直接打印保存为 PDF。");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Control Panel */}
      <div className="no-print bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">看拼音写词语生成器</h1>
            <p className="text-gray-500 text-sm mt-1">自动识别课本词表，生成标准田字格练习卷</p>
          </div>
          <div className="flex flex-col items-end gap-2">
             {result && (
              <button
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className={`px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isExporting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                {isExporting ? "正在生成 PDF..." : "下载 PDF 练习卷"}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border bg-white group shadow-sm">
                <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeImage(idx)}
                  className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[10px] mt-1 font-medium">添加图片</span>
            </button>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />

          <button
            onClick={handleGenerate}
            disabled={isProcessing || images.length === 0}
            className={`w-full py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-all ${
              isProcessing || images.length === 0 
                ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? "AI 深度识别中..." : "立刻生成全套练习卷"}
          </button>

          {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>}
        </div>
      </div>

      {/* Worksheet Container */}
      {result && (
        <div 
          ref={worksheetRef}
          className="worksheet-page bg-white p-[1in] shadow-2xl min-h-[11in] mx-auto border border-gray-200 flex flex-col overflow-hidden"
          style={{ width: '210mm' }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-[0.2em] text-black border-b-[3px] border-black inline-block pb-1 px-12 mb-6">
              {result.title || "看拼音写词语专项练习"}
            </h2>
            <div className="flex justify-center gap-16 text-[15px] font-bold text-black italic">
              <span>班级：___________</span>
              <span>姓名：___________</span>
              <span>得分：___________</span>
            </div>
          </div>

          <div className="mb-8 font-black text-xl text-black border-l-[6px] border-black pl-4 py-1">
            一、看拼音，写词语。
          </div>
          
          <div className="flex flex-wrap content-start">
            {result.words.map((item, index) => (
              <WorksheetItem key={index} item={item} />
            ))}
          </div>

          <div className="mt-auto pt-10 text-center text-[10px] text-gray-300 uppercase tracking-widest border-t border-gray-50">
            AI Intelligent Typesetting • Professional Education Tool
          </div>
        </div>
      )}

      {/* Idle State */}
      {!result && !isProcessing && (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-400">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium">请添加包含生词表的照片</p>
          <p className="text-sm opacity-60 mt-2">支持多张图片同时处理，自动合并生成</p>
        </div>
      )}

      {/* Processing Animation */}
      {isProcessing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-[6px] border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">正在智能精排</h3>
            <p className="text-gray-500 font-medium">AI 正在识别笔画、对齐拼音并优化布局...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;


import { GoogleGenAI, Type } from "@google/genai";
import { ProcessingResult } from "../types";

// Always use process.env.API_KEY directly as per guidelines
const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const extractWordsAndPinyin = async (base64Images: string[]): Promise<ProcessingResult> => {
  const ai = getGeminiClient();
  
  const imageParts = base64Images.map(base64 => ({
    inlineData: {
      data: base64.split(',')[1],
      mimeType: "image/jpeg"
    }
  }));

  const prompt = `
    任务：
    1. 识别所提供图片中的所有中文词语（通常是课本后的生词表）。
    2. 为每个词语生成带声调的标准拼音。
    3. 返回一个 JSON 对象，包含标题 (title) 和词语列表 (words)。
    
    具体要求：
    - 包含所有图片中识别到的词语。
    - **标题 (title)** 必须使用中文（例如：“小学语文词语练习”、“第XX课生词”等）。
    - **拼音对齐原则**：拼音音节的数量（以空格分隔）必须与词语的汉字数量完全一致。
    - **儿化音处理**：对于“哪儿”、“花儿”等儿化音词语，禁止使用合并形式（如 "nǎr"）。必须拆分为独立音节，如 "nǎ er" 或 "huā er"，以确保每个汉字上方都有对应的拼音。
    - 示例：词语 "哪儿" -> 拼音 "nǎ er" (两个汉字对应两个音节)。
    - 示例：词语 "宝贝" -> 拼音 "bǎo bèi"。
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        ...imageParts,
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "练习卷的中文标题" },
          words: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                pinyin: { type: Type.STRING }
              },
              required: ["word", "pinyin"]
            }
          }
        },
        required: ["title", "words"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI 未返回任何数据");
  
  return JSON.parse(text) as ProcessingResult;
};

# 看拼音写词语生成器 (AI Pinyin Worksheet Generator)

这是一个基于 **Google Gemini AI** 的智能化教学工具，旨在帮助家长和老师快速将课本生词表图片转换为标准、美观的“看拼音写词语”练习卷。

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8.svg)

## 📸 转换示例 (Input & Output)

本工具的核心价值在于将杂乱的课本图片瞬间转化为标准练习卷：

### 1. 输入 (Input)
上传一张包含生词表的原始照片（支持多图识别）：
> *示例：课本背后的识字表/词语表*
> ![课本生词表输入示例](https://raw.githubusercontent.com/your-username/pinyin-generator/main/docs/input_sample.jpg) *(请替换为实际路径)*

### 2. 输出 (Output)
AI 自动提取词语、生成拼音并完成田字格排版，可直接导出为 A4 PDF 打印：
> *示例：生成的标准练习卷*
> ![练习卷输出示例](https://raw.githubusercontent.com/your-username/pinyin-generator/main/docs/output_sample.png) *(请替换为实际路径)*

---

## 🌟 功能特性

- **📸 AI 智能识别**：上传课本生词表图片，AI 自动提取词语并过滤干扰（如页码、单元标题等）。
- **🔤 标准拼音生成**：自动转换带声调的标准拼音，支持儿化音自动拆分（如“哪儿” -> "nǎ er"）。
- **📐 专业田字格排版**：内置标准 A4 比例排版，采用经典的黑灰配色，完美对齐，保护视力。
- **📄 高质量 PDF 导出**：针对打印场景深度优化，解决了 html2pdf 常见的双重换页及切分溢出问题。

---

## 🛠️ 本地开发环境准备

在开始之前，请确保你的电脑已安装 [Node.js](https://nodejs.org/) (建议 v18 或更高版本)。

### 1. 初始化项目目录
```bash
# 创建并进入文件夹
mkdir pinyin-generator
cd pinyin-generator

# 初始化 npm
npm init -y
```

### 2. 安装核心依赖
```bash
# 安装生产依赖
npm install react react-dom @google/genai

# 安装开发依赖 (Vite + TypeScript)
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom
```

### 3. 配置环境变量 (API Key)
在项目根目录创建一个 `.env` 文件：
1. 前往 [Google AI Studio](https://aistudio.google.com/) 获取免费的 API Key。
2. 在 `.env` 中写入：
   ```text
   VITE_API_KEY=你的_GEMINI_API_KEY
   ```

---

## 🚀 运行与构建

### 启动开发服务器
```bash
npx vite
```
启动后，访问浏览器控制台输出的地址（通常是 `http://localhost:5173`）。

### 构建生产版本
```bash
npx vite build
```

---

## 📖 使用指南

1. **准备素材**：准备一张清晰的课本生词表照片。
2. **上传图片**：点击“添加图片”按钮，支持多图同时处理。
3. **AI 处理**：点击“开始生成”，AI 会自动识别汉字、生成拼音并完成排版。
4. **导出 PDF**：预览满意后，点击右上方“导出高质量 PDF”。
5. **打印技巧**：
   - 打印时请选择 **“实际大小” (100%)** 而非“适应页面”。
   - 建议使用黑白激光打印机。

## 🔧 常见技术问题

- **PDF 出现空白页？**
  - 请确保浏览器缩放比例为 100%。本工具已通过 `296.8mm` 的微调高度避开了像素舍入误差。
- **儿化音没有对齐？**
  - 系统已内置提示词规则，强制要求将“儿”字独立占格，如遇特殊生僻词，可重新点击生成。

## 📄 开源协议

MIT License.

---
*由 AI 驱动，为教育加速。*
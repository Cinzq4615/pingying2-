# 看拼音写词语生成器 (AI Pinyin Worksheet Generator)

这是一个基于 **Google Gemini AI** 的智能化教学工具，旨在帮助家长和老师快速将课本生词表图片转换为标准、美观的“看拼音写词语”练习卷。

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8.svg)

## 📸 转换示例 (Input & Output)

本工具的核心价值在于将杂乱的课本图片瞬间转化为标准练习卷：

### 1. 输入 (Input)
上传一张包含生词表的原始照片（如课本第117页词语表）：
> *示例：课本背后的识字表/词语表原图*
> ![课本生词表输入示例](./assets/sample_input_textbook.jpg)

### 2. 输出 (Output)
AI 自动提取词语、生成拼音并完成田字格排版，可直接导出为 A4 PDF 打印：
> *示例：生成的标准练习卷预览（自动对齐、带页码）*
> ![练习卷输出示例](./assets/sample_output_worksheet.png)

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

### 2. 项目目录结构
```text
pinyin-generator/
├── assets/             # 存放示例图片及资源
│   ├── sample_input_textbook.jpg
│   └── sample_output_worksheet.png
├── index.html          # 入口 HTML
├── App.tsx             # 主应用逻辑
├── index.tsx           # React 挂载入口
├── types.ts            # 类型定义
└── .env                # 环境变量 (存储 API Key)
```

---

## 📖 使用指南

1. **准备素材**：准备一张清晰的课本生词表照片（如示例中的识字表）。
2. **上传图片**：点击“添加图片”按钮，支持多图同时处理。
3. **AI 处理**：点击“开始生成”，AI 会自动识别汉字、生成拼音并完成排版。
4. **导出 PDF**：预览满意后，点击右上方“导出高质量 PDF”。
5. **打印技巧**：
   - 打印时请选择 **“实际大小” (100%)** 而非“适应页面”，以确保田字格尺寸标准（约 14mm）。
   - 建议使用黑白激光打印机，效果最接近字帖。

## 🔧 常见技术问题

- **PDF 出现空白页？**
  - 请确保浏览器缩放比例为 100%。本工具已通过 `296.8mm` 的高度微调避开了像素舍入误差。
- **儿化音没有对齐？**
  - 系统已内置提示词规则，强制要求将“儿”字独立占格（如“哪儿”识别为两个字音），以确保书写规范。

## 📄 开源协议

MIT License.

---
*由 AI 驱动，为教育加速。*
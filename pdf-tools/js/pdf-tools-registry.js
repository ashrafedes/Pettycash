// PDF Tools Registry — defines all tools, categories, and metadata
window.PDF_TOOLS_REGISTRY = [
  // Organize
  { slug: 'merge-pdf', key: 'merge', icon: '🔗', cat: 'organize', clientSide: true, popular: true },
  { slug: 'split-pdf', key: 'split', icon: '✂️', cat: 'organize', clientSide: true, popular: true },
  { slug: 'remove-pages', key: 'removePages', icon: '🗑️', cat: 'organize', clientSide: true },
  { slug: 'extract-pages', key: 'extractPages', icon: '📄', cat: 'organize', clientSide: true },
  { slug: 'rotate-pdf', key: 'rotate', icon: '🔄', cat: 'organize', clientSide: true, popular: true },
  { slug: 'reorder-pages', key: 'reorder', icon: '↕️', cat: 'organize', clientSide: true },
  { slug: 'delete-blank-pages', key: 'deleteBlank', icon: '🧹', cat: 'organize', clientSide: true },

  // Compress
  { slug: 'compress-pdf', key: 'compress', icon: '📦', cat: 'compress', clientSide: true, popular: true },
  { slug: 'repair-pdf', key: 'repair', icon: '🔧', cat: 'compress', clientSide: false },
  { slug: 'optimize-pdf', key: 'optimize', icon: '⚡', cat: 'compress', clientSide: true },

  // Convert to PDF
  { slug: 'word-to-pdf', key: 'wordToPdf', icon: '📝', cat: 'convertTo', clientSide: false, popular: true },
  { slug: 'excel-to-pdf', key: 'excelToPdf', icon: '📊', cat: 'convertTo', clientSide: false },
  { slug: 'powerpoint-to-pdf', key: 'pptToPdf', icon: '📽️', cat: 'convertTo', clientSide: false },
  { slug: 'image-to-pdf', key: 'imageToPdf', icon: '🖼️', cat: 'convertTo', clientSide: true, popular: true },
  { slug: 'html-to-pdf', key: 'htmlToPdf', icon: '🌐', cat: 'convertTo', clientSide: true },
  { slug: 'text-to-pdf', key: 'textToPdf', icon: '📃', cat: 'convertTo', clientSide: true },

  // Convert from PDF
  { slug: 'pdf-to-word', key: 'pdfToWord', icon: '📝', cat: 'convertFrom', clientSide: false, popular: true },
  { slug: 'pdf-to-excel', key: 'pdfToExcel', icon: '📊', cat: 'convertFrom', clientSide: false },
  { slug: 'pdf-to-powerpoint', key: 'pdfToPpt', icon: '📽️', cat: 'convertFrom', clientSide: false },
  { slug: 'pdf-to-jpg', key: 'pdfToJpg', icon: '🖼️', cat: 'convertFrom', clientSide: true, popular: true },
  { slug: 'pdf-to-png', key: 'pdfToPng', icon: '🖼️', cat: 'convertFrom', clientSide: true },
  { slug: 'pdf-to-html', key: 'pdfToHtml', icon: '🌐', cat: 'convertFrom', clientSide: true },
  { slug: 'pdf-to-text', key: 'pdfToText', icon: '📃', cat: 'convertFrom', clientSide: true },

  // Edit
  { slug: 'edit-pdf', key: 'edit', icon: '✏️', cat: 'edit', clientSide: false, popular: true },
  { slug: 'crop-pdf', key: 'crop', icon: '✂️', cat: 'edit', clientSide: true },
  { slug: 'add-watermark', key: 'watermark', icon: '💧', cat: 'edit', clientSide: true },
  { slug: 'remove-watermark', key: 'removeWatermark', icon: '🚫', cat: 'edit', clientSide: false },
  { slug: 'add-page-numbers', key: 'pageNumbers', icon: '🔢', cat: 'edit', clientSide: true, popular: true },
  { slug: 'add-header-footer', key: 'headerFooter', icon: '📋', cat: 'edit', clientSide: true },

  // Security
  { slug: 'protect-pdf', key: 'protect', icon: '🔒', cat: 'security', clientSide: true, popular: true },
  { slug: 'unlock-pdf', key: 'unlock', icon: '🔓', cat: 'security', clientSide: true },
  { slug: 'sign-pdf', key: 'sign', icon: '✍️', cat: 'security', clientSide: true },
  { slug: 'redact-pdf', key: 'redact', icon: '▮', cat: 'security', clientSide: true },

  // OCR
  { slug: 'ocr-pdf', key: 'ocrPdf', icon: '🔍', cat: 'ocr', clientSide: true },
  { slug: 'image-ocr', key: 'imageOcr', icon: '🔤', cat: 'ocr', clientSide: true },
  { slug: 'searchable-pdf', key: 'searchablePdf', icon: '📖', cat: 'ocr', clientSide: true },

  // AI
  { slug: 'ai-summarize-pdf', key: 'aiSummarize', icon: '🤖', cat: 'ai', clientSide: false, popular: true },
  { slug: 'translate-pdf', key: 'translate', icon: '🌍', cat: 'ai', clientSide: false },
  { slug: 'chat-with-pdf', key: 'chatPdf', icon: '💬', cat: 'ai', clientSide: false },
  { slug: 'extract-tables', key: 'extractTables', icon: '📋', cat: 'ai', clientSide: true },
  { slug: 'extract-images', key: 'extractImages', icon: '🖼️', cat: 'ai', clientSide: true }
];

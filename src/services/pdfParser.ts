import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
// Using standard CDN worker fallback for reliable bundler-agnostic resolution
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  metadata?: Record<string, unknown>;
}

/**
 * Extracts structured text from a PDF file while preserving line breaks and paragraph hierarchy.
 */
export async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: number, page: number, total: number) => void
): Promise<PDFExtractionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    let fullText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY: number | null = null;
      let pageText = '';

      for (const item of textContent.items) {
        if ('str' in item && typeof item.str === 'string') {
          const currentY = 'transform' in item && Array.isArray(item.transform) ? item.transform[5] : null;
          
          if (lastY !== null && currentY !== null) {
            // Check if vertical distance implies new line or new paragraph
            const diff = Math.abs(lastY - currentY);
            if (diff > 12) {
              pageText += '\n';
            } else if (diff > 4) {
              pageText += ' ';
            }
          }
          
          pageText += item.str;
          if (currentY !== null) {
            lastY = currentY;
          }
        }
      }

      fullText += (pageNum > 1 ? '\n\n' : '') + pageText.trim();

      if (onProgress) {
        onProgress(Math.round((pageNum / numPages) * 100), pageNum, numPages);
      }
    }

    // Clean up redundant spaces while preserving intentional paragraphs
    const cleanedText = fullText
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      text: cleanedText,
      pageCount: numPages,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to extract text from PDF: ${error.message}` 
        : 'Failed to extract text from PDF. The file may be password protected or corrupted.'
    );
  }
}

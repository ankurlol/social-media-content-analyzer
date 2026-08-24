import { createWorker } from 'tesseract.js';

export interface OCRExtractionResult {
  text: string;
  confidence: number;
}

/**
 * Extracts text from an image file using Tesseract OCR with real-time progress updates.
 */
export async function extractTextFromImage(
  imageSource: File | Blob | string,
  onProgress?: (progress: number, status: string) => void
): Promise<OCRExtractionResult> {
  let worker: Tesseract.Worker | null = null;
  try {
    if (onProgress) {
      onProgress(10, 'Initializing OCR engine...');
    }

    worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          const pct = Math.round(15 + m.progress * 80);
          onProgress(pct, `Recognizing text (${Math.round(m.progress * 100)}%)...`);
        } else if (onProgress) {
          onProgress(15, m.status);
        }
      },
    });

    if (onProgress) {
      onProgress(25, 'Processing image features...');
    }

    const ret = await worker.recognize(imageSource);
    
    if (onProgress) {
      onProgress(100, 'OCR extraction complete!');
    }

    // Clean up extracted text: normalize line breaks, remove artifacts
    const cleanedText = ret.data.text
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      text: cleanedText,
      confidence: ret.data.confidence,
    };
  } catch (error) {
    console.error('Error during OCR extraction:', error);
    throw new Error(
      error instanceof Error
        ? `OCR Extraction failed: ${error.message}`
        : 'Failed to extract text from the image. Please verify the image is readable and contains clear text.'
    );
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}

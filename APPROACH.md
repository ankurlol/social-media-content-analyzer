# Project Approach: Social Media Content Analyzer

**Summary (176 words):**

Our solution delivers an end-to-end web application that streamlines social media content auditing and optimization from multi-source inputs. 

To satisfy the document processing requirements, we built a client-side extraction pipeline combining **PDF.js** (preserving multi-page layout and paragraph structures) and **Tesseract.js OCR** (extracting text from screenshots, scanned flyers, and visual quotes with real-time progress tracking).

For content intelligence, we engineered a multi-dimensional NLP heuristics engine that evaluates drafts across six core dimensions: **Hook Strength**, **Readability (Flesch-Kincaid)**, **Call-to-Action Impact**, **Sentiment/Emotional Resonance**, **Visual Layout**, and **Hashtag Strategy**. The system calculates an aggregate 0–100 Engagement Score and provides platform-tailored compliance audits for **LinkedIn, Twitter/X, Instagram, and Facebook** alongside realistic live feed previews.

Additionally, the engine generates four A/B rewrite variations (Viral Hook, Thought Leadership, Scannable Bullets, and Community Driver), with optional zero-backend integration for Google Gemini and OpenAI free-tier APIs. The frontend is built using React, TypeScript, and Tailwind CSS, featuring robust error handling, progress indicators, and one-click markdown report exporting.

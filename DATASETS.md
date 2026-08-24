# Public Datasets & Test Data Sources

This document outlines public datasets and benchmarking corpora that can be used for testing, fine-tuning, and evaluating the **Social Media Content Analyzer**.

---

## 1. Social Media Posts & Engagement Datasets

### A. Twitter / X Engagement & Sentiment Corpora
- **Sentiment140 Dataset (Stanford / Kaggle)**:
  - **Size:** 1.6 million tweets annotated with polarity (positive, negative, neutral).
  - **Source:** [Kaggle - Sentiment140](https://www.kaggle.com/datasets/kazanova/sentiment140)
  - **Use Case:** Validating sentiment analysis scoring and tone detection.

- **Twitter Virality & Retweet Prediction Dataset**:
  - **Size:** 100,000+ public tweets with retweet counts, favorite counts, and hashtag metadata.
  - **Source:** [Hugging Face - Twitter Financial News / Sentiment](https://huggingface.co/datasets/zeroshot/twitter-financial-news-sentiment)
  - **Use Case:** Benchmarking engagement score vs. actual share and comment velocity.

### B. LinkedIn Post Engagement & Viral Hook Datasets
- **LinkedIn Viral Posts Dataset (Kaggle)**:
  - **Size:** 15,000+ top-performing LinkedIn posts with reactions, comments, impressions, and character lengths.
  - **Source:** [Kaggle - LinkedIn Post Performance](https://www.kaggle.com/datasets)
  - **Use Case:** Calibrating optimal character length (800-1,500 chars), line break frequency, and dwell time multipliers.

### C. Instagram Caption & Hashtag Performance Dataset
- **Instagram Influencer Posts Dataset**:
  - **Size:** 40,000+ posts with caption text, hashtag counts, likes, and comment ratios.
  - **Source:** [Hugging Face - Social Media Captions](https://huggingface.co/datasets)
  - **Use Case:** Evaluating first 125-character cut-off hooks and hashtag cluster effectiveness.

---

## 2. Document & OCR Evaluation Datasets

### A. Scanned Flyers & Printed Graphics OCR Test Set
- **SROIE (Scanned Receipts & Optical Information Extraction - ICDAR)**:
  - **Source:** [ICDAR 2019 SROIE Dataset](https://rrc.cvc.uab.es/?ch=13)
  - **Use Case:** Verifying OCR robustness across rotated, blurry, and noisy scanned images.

### B. Multi-Page PDF Benchmark Set
- **PubLayNet (IBM Research)**:
  - **Size:** 360,000+ PDF document pages with annotated paragraphs, headers, and tables.
  - **Source:** [IBM PubLayNet](https://github.com/ibm-aur-nlp/PubLayNet)
  - **Use Case:** Ensuring PDF layout preservation and multi-column paragraph parsing.

---

## 3. Synthetic Benchmark Data Built Into SocialSense

The application includes 4 ready-to-test public domain social media drafts directly in the UI:
1. **SaaS Product Launch Brief**: High-converting B2B announcement draft.
2. **Executive Thought Leadership**: Vulnerability storytelling narrative with lessons.
3. **Scanned Event Announcement**: Multi-speaker flyer text.
4. **Unoptimized Draft**: Baseline raw copy used to verify improvement recommendations.

# twitter_Roberta-base_Alex — `AstroMindNLP`

![Python](https://img.shields.io/badge/Python-3.11-blue)
![PyTorch](https://img.shields.io/badge/PyTorch-2.2.2-orange)
![Flask](https://img.shields.io/badge/Flask-3.0+-black)
![Flask-CORS](https://img.shields.io/badge/Flask--CORS-4.0.0-lightgrey) 
![Transformers](https://img.shields.io/badge/Transformers-4.40+-green)
![Emoji](https://img.shields.io/badge/Emoji-2.12.1-orange)
![LangDetect](https://img.shields.io/badge/LangDetect-1.0.9-yellow)
![NumPy](https://img.shields.io/badge/NumPy-1.26.4-blueviolet)
![License](https://img.shields.io/badge/License-Restricted-red)
![Base Model](https://img.shields.io/badge/cardiffnlp/twitter--roberta--base--sentiment--latest-FFD43B?style=flat&logo=huggingface&logoColor=black)

Custom model **DeepBERTweet** — a fine-tuned version of `cardiffnlp/twitter-roberta-base-sentiment-latest` with enhanced preprocessing and binary classification: **positive / negative**.
---

## Current Features
- Fully functional Flask backend
- Local loading of the custom DeepBERTweet model
- Advanced tweet preprocessing:
  - URLs → `<URL>`
  - @mentions → `<USER>`
- REST API endpoint: `/api/predict`
- Modern UI (Vanilla JS + CSS):
  - Dual input fields with auto-switching
  - First input hides after sending the first message
- Strict input validation:
  - English language only
  - Maximum text length 280(Twitter limit)
- 100% local & offline — no internet or API keys required

---

## Model Information

### Base Model
[cardiffnlp/twitter-roberta-base-sentiment-latest](https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment-latest)

- Trained on ~58 million tweets
- Specifically adapted to Twitter/X writing style
- One of the most accurate RoBERTa models for short texts

### Custom Model — DeepBERTweet
- Improved text preprocessing pipeline
- Fine-tuned for binary classification (positive / negative)
- Optimized for short messages
- Ready for local inference in Flask

### Training Notebook (Kaggle)

The Kaggle notebook contains the **entire model creation process**, including:

- **Data preprocessing**: cleaning and preparing tweets for training.  
- **Model fine-tuning**: training `twitter-roberta-base-sentiment-latest` for binary sentiment classification (positive / negative).  
- **Prediction class**: `SentimentPredictor` for making predictions on new tweets.  
- **Evaluation**: testing model accuracy and performance on validation data.  

You can access the notebook here:  
[https://www.kaggle.com/code/aleynikovaleksandr/twitter-roberta-base-alex](https://www.kaggle.com/code/aleynikovaleksandr/twitter-roberta-base-alex)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/AleynikovAleksandr/twitter_Roberta-base_Alex.git
cd twitter_Roberta-base_Alex/backend
```
### 2. Create and Activate Virtual Environment:
   * On macOS/Linux:
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```
   * On Windows:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
### 3. Install Dependencies

**Upgrade pip to the latest version**
```bash
pip install --upgrade pip
```
**Install PyTorch CPU version 2.2.2**
```bash
pip install torch==2.2.2 --index-url https://download.pytorch.org/whl/cpu
```
**Install all other required Python packages**
```bash
pip install -r requirements.txt
```
## Run the Application

```bash
cd backend
python run.py
```

Then, open your browser and navigate to:
```
http://127.0.0.1:5000
```
## Application Notes

- **Model Loading:** The model loads on startup (~10–20 seconds on CPU).  
- **Prediction Speed:** Subsequent predictions are instant (model and tokenizer are cached in memory).  
- **Compatibility:** Runs on laptops, servers, and Raspberry Pi 4/5.  
- **Resource Usage:** Optimized to use minimal CPU and memory for fast inference.  
- **Reliability:** Stable for continuous local usage without crashes or memory leaks.  

## License

Copyright (c) 2025 Aleynikov Aleksandr

Permission is hereby granted, free of charge, to any person obtaining a copy of this software (`AstroMindNLP`) for educational or demonstration purposes only. The software may not be used for commercial purposes, redistributed, or modified without prior written permission from the copyright holder.

For permissions, contact: [aleynikov.aleksandr@icloud.com](mailto:aleynikov.aleksandr@icloud.com).

## Author

Developed by Aleynikov Aleksandr  
Contact: [aleynikov.aleksandr@icloud.com](mailto:aleynikov.aleksandr@icloud.com)

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

## Current Features
- Fully functional Flask backend
- Local loading of the custom RoBERTa/BERTweet model
- Modern UI (Vanilla JS + CSS):
  - Dual input fields with auto-switching
  - First input hides after sending the first message
- Strict input validation:
  - English language only
  - Maximum text length 280 (Twitter limit)
- Dockerized setup for backend and model server
- Easy deployment using `docker-compose`

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
```
### 2. Build and Start Containers
  Build and start backend and model_server containers
  ```bash
  docker compose up
  ```
    
## Run the Application

The application is available at the following link in your browser:[Open Twitter Roberta App](http://85.95.150.8:5000/)

## Application Notes

- **Model Loading:** The RoBERTa/BERTweet model loads on startup (~10–20 seconds on CPU).  
- **Prediction Speed:** Subsequent predictions are instant (model and tokenizer are cached in memory).  
- **Compatibility:** Runs on laptops, servers, and Raspberry Pi 4/5.  
- **Resource Usage:** Optimized to use minimal CPU and memory for fast inference.  
- **Reliability:** Stable for continuous local usage without crashes or memory leaks.  
- **Deployment:** Fully Dockerized, with separate backend and model server containers for easy management.

## License

Copyright (c) 2025 Aleynikov Aleksandr

Permission is hereby granted, free of charge, to any person obtaining a copy of this software (`AstroMindNLP`) for educational or demonstration purposes only. The software may not be used for commercial purposes, redistributed, or modified without prior written permission from the copyright holder.

For permissions, contact: [aleynikov.aleksandr@icloud.com](mailto:aleynikov.aleksandr@icloud.com).

## Author

Developed by Aleynikov Aleksandr  
Contact: [aleynikov.aleksandr@icloud.com](mailto:aleynikov.aleksandr@icloud.com)

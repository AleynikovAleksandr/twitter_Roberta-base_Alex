import os
import re
import emoji
import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel


# =========================
#  Модель DeepBERTweet
# =========================
class DeepBERTweet(nn.Module):
    def __init__(self, base_model, hidden_size, n_classes=2):
        super().__init__()
        self.bertweet = base_model
        self.dropout = nn.Dropout(0.3)
        self.fc1 = nn.Linear(hidden_size, hidden_size // 2)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size // 2, n_classes)

    def forward(self, input_ids, attention_mask):
        outputs = self.bertweet(input_ids=input_ids, attention_mask=attention_mask)
        cls_output = outputs.last_hidden_state[:, 0, :]  # [CLS] токен
        x = self.dropout(cls_output)
        x = self.fc1(x)
        x = self.relu(x)
        logits = self.fc2(x)
        return logits


# =========================
#  Основной предиктор
# =========================
class SentimentPredictor:
    def __init__(self, base_path, device=None):
        """
        base_path — путь к папке bertweet_model
        внутри неё:
            tokenizer/
            model/pytorch_model.bin
        """
        self.device = device or torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # 1. Загружаем токенизатор
        tokenizer_path = os.path.join(base_path, "tokenizer")
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_path)

        # 2. Загружаем базовый BertTweet
        base = AutoModel.from_pretrained("vinai/bertweet-base")
        hidden_size = base.config.hidden_size  # 768

        # 3. Создаём кастомную модель
        self.model = DeepBERTweet(base, hidden_size, n_classes=2)

        # 4. Загружаем веса модели
        state_dict_path = os.path.join(base_path, "model", "pytorch_model.bin")
        self.model.load_state_dict(torch.load(state_dict_path, map_location=self.device))

        self.model.to(self.device)
        self.model.eval()

    # ----------------------------------------------
    # Обработка текста
    # ----------------------------------------------
    @staticmethod
    def preprocess_tweet(text: str) -> str:
        if not isinstance(text, str) or not text.strip():
            return ""

        text = emoji.demojize(text, delimiters=(":", ":"))
        text = re.sub(r'http[s]?://\S+|www\.\S+', '<URL>', text)
        text = re.sub(r'([^a-zA-Z0-9@#])\1+', r'\1', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    # ----------------------------------------------
    # Предсказание
    # ----------------------------------------------
    def predict(self, text: str):
        clean = self.preprocess_tweet(text)

        encoding = self.tokenizer(
            clean,
            truncation=True,
            padding='max_length',
            max_length=128,
            return_tensors='pt'
        )

        input_ids = encoding['input_ids'].to(self.device)
        attention_mask = encoding['attention_mask'].to(self.device)

        with torch.no_grad():
            logits = self.model(input_ids, attention_mask)
            probs = torch.softmax(logits, dim=1)
            pred = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred].item()

        return {
            "sentiment": "positive" if pred == 1 else "negative",
            "confidence": confidence
        }

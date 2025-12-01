FROM python:3.11.10-slim

WORKDIR /app

COPY requirements.txt .
RUN python -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x run.sh

EXPOSE 5000

CMD ["./run.sh"]

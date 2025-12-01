#!/bin/bash
# Запуск model_server на порту 2000
export FLASK_APP=model_server
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=2000 
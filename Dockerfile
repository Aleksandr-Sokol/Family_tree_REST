# образ на основе которого создаём контейнер
FROM python:3.9.7

# рабочая директория внутри проекта
WORKDIR /usr/src/app
#WORKDIR /usr/src/app

## переменные окружения для python
#ENV PYTHONDONTWRITEBYTECODE 1
#ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

# устанавливаем зависимости
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# копируем содержимое текущей папки в контейнер
COPY . .

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
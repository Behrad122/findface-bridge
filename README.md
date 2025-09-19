# FindFace Bridge API

> REST API для работы с системой распознавания лиц FindFace.

## Решаемые проблемы

### 🔧 Сложность интеграции
**Проблема:** Прямая интеграция с FindFace требует глубокого знания его API, токенизации, обработки ошибок и специфических форматов данных.

**Решение:** Унифицированный REST API с простой JSON-структурой запросов и стандартизированными ответами.

### 🔄 Надежность соединения
**Проблема:** Нестабильные соединения, таймауты, 401/403 ошибки при истечении токенов приводят к потере данных.

**Решение:**
- Автоматическое переподключение и повторные попытки (до 5 раз)
- Интеллектуальная обработка ошибок аутентификации с обновлением токенов
- Фильтрация повторных запросов при 401/403 ошибках

### 📊 Качество распознавания
**Проблема:** Базовый поиск FindFace может возвращать неточные или устаревшие результаты.

**Решение:**
- Алгоритм `findByDetectionRange` с порогом схожести 0.72
- Фильтрация по актуальности данных (24 часа)
- Ранжирование результатов по коэффициенту схожести

### 🚀 Производительность
**Проблема:** Медленная обработка больших изображений и очереди запросов.

**Решение:**
- Пул соединений с ограничением до 50 одновременных запросов
- Оптимизированная обработка Blob-данных вместо MinIO
- Асинхронная архитектура с управлением контекстом

### 🐛 Отладка и мониторинг
**Проблема:** Сложность отслеживания проблем при работе с изображениями и API FindFace.

**Решение:**
- Debug-эндпоинты для сохранения изображений в MinIO
- Детальное логирование всех операций
- Health-check мониторинг состояния сервиса

### 📦 Управление данными
**Проблема:** Различные форматы обработки изображений (файлы vs Base64 vs Blob).

**Решение:**
- Единый формат входных данных (Base64)
- Автоматическое преобразование в оптимальные форматы
- Поддержка как Blob, так и MinIO-режимов работы

## Установка и запуск

### Запуск с Docker Compose

1. **Создайте файл `docker-compose.yml`:**
```yaml
version: "3.3"

services:
  app:
    image: tripolskypetr/findface-bridge:latest
    ports:
      - "20050:20050"
    environment:
      - TZ=Europe/Moscow
    env_file:
      - .env
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:20050/health_check"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: always
```

2. **Создайте файл конфигурации `.env`:**
```env
# Параметры подключения к FindFace
CC_FINDFACE_URL=http://127.0.0.1
CC_FINDFACE_USER=admin
CC_FINDFACE_PASSWORD=password

# Параметры событий
CC_FINDFACE_EVENT_TOKEN=15ca64cd61e14022b7c6eecc8cfc4b63
CC_FINDFACE_EVENT_CAMERA=2
CC_FINDFACE_WATCHLIST=2

# ID камеры
CC_FINDFACE_CAMERA_ID=1

# Дополнительные параметры
CC_ENABLE_TERMINATE_SESSIONS=0

# Параметры MinIO (для хранения изображений)
CC_MINIO_ENDPOINT=localhost
CC_MINIO_PORT=9002
CC_MINIO_ACCESSKEY=minioadmin
CC_MINIO_SECRETKEY=minioadmin
```

3. **Создайте папку для логов:**
```bash
mkdir logs
```

4. **Запустите контейнер:**
```bash
docker-compose up -d
```

### Ручной запуск Docker контейнера

Запустите контейнер из готового образа:

```bash
docker run -d \
  --name findface-bridge \
  --network host \
  --env-file .env \
  -e Europe/Moscow \
  --restart always \
  tripolskypetr/findface-bridge:latest
```

## Базовая структура запроса

Все запросы имеют общую структуру с обязательными полями:

```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": { ... }
}
```

## Структура ответа

### Успешный ответ
```json
{
  "status": "ok",
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": { ... }
}
```

### Ответ с ошибкой
```json
{
  "status": "error",
  "error": "string",
  "clientId": "string",
  "requestId": "string",
  "serviceName": "string",
  "userId": "string"
}
```

## API Endpoints

### 1. Обнаружение лиц на изображении

**POST** `/api/v1/findface/detectFace`

Обнаруживает лица на переданном изображении.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "imageBase64": "string",
    "imageName": "string"
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": [
    {
      "detectId": "string",
      "bbox": {
        "left": 0,
        "top": 0,
        "right": 100,
        "bottom": 100
      },
      "detectionScore": 0.95,
      "lowQuality": false
    }
  ]
}
```

### 2. Распознавание номерных знаков

**POST** `/api/v1/findface/detectLicensePlate`

Распознает номерные знаки на изображении.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "imageBase64": "string",
    "imageName": "string"
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": [
    {
      "bbox_top": 10,
      "bbox_left": 20,
      "bbox_right": 150,
      "bbox_bottom": 60,
      "licensePlate": "А123БВ77",
      "country": "RU",
      "category": "passenger",
      "body": "sedan",
      "make": "Toyota",
      "model": "Camry",
      "color": "white",
      "orientation": "front"
    }
  ]
}
```

### 3. Создание снимка с камеры

**POST** `/api/v1/findface/captureScreenshot`

Создает снимок с указанной камеры.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "cameraId": 1
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": {
    "imageBase64": "string",
    "contentType": "image/jpeg"
  }
}
```

### 4. Верификация лица

**POST** `/api/v1/findface/verifyFace`

Сравнивает обнаруженное лицо с картой лица в базе данных.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "cardId": "string",
    "detectionId": "string"
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": {
    "faceObjects": { "face1": 0.95 },
    "averageConf": 0.95
  }
}
```

### 5. Создание лица в карте

**POST** `/api/v1/findface/createFace`

Добавляет новое лицо к существующей карте.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "cardId": "string",
    "imageBase64": "string",
    "imageName": "string"
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": {
    "faceId": "string",
    "fileName": "string",
    "thumbnail": "string",
    "src": "string"
  }
}
```

### 6. Получение списка лиц

**POST** `/api/v1/findface/listFace`

Получает список всех лиц для указанной карты.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "cardId": "string"
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": [
    {
      "faceId": "string",
      "fileName": "string",
      "thumbnail": "string",
      "src": "string"
    }
  ]
}
```

### 7. Удаление лица

**POST** `/api/v1/findface/removeFace`

Удаляет лицо по его идентификатору.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "faceId": "string"
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": null
}
```

### 8. Поиск карты по обнаружению

**POST** `/api/v1/findface/findByDetection`

Находит карту человека по идентификатору обнаружения лица.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "detectionId": "string"
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": {
    "id": "string",
    "name": "string"
  }
}
```

### 8.1. Поиск карты по обнаружению с фильтрацией

**POST** `/api/v1/findface/findByDetectionRange`

Находит карту человека по идентификатору обнаружения лица с дополнительными фильтрами:
- Возвращает до 5 наиболее похожих карт вместо 1
- Фильтрует результаты по порогу схожести (0.72)
- Исключает карты, измененные более 24 часов назад
- Сортирует по убыванию коэффициента схожести
- Возвращает самый подходящий

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "detectionId": "string"
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": {
    "id": "string",
    "name": "string"
  }
}
```

### 9. Поиск карты по ID

**POST** `/api/v1/findface/findByCardId`

Находит карту человека по её идентификатору.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "cardId": "string"
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": {
    "id": "string",
    "name": "string"
  }
}
```

### 10. Создание карты человека

**POST** `/api/v1/findface/createHumanCard`

Создает новую карту человека.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "name": "string"
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": {
    "id": "string",
    "name": "string"
  }
}
```

### 11. Обновление карты человека

**POST** `/api/v1/findface/updateHumanCard`

Обновляет существующую карту человека.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "id": 1,
    "dto": {
      "name": "string"
    }
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": {
    "id": "string",
    "name": "string"
  }
}
```

### 12. Создание события лица

**POST** `/api/v1/findface/eventFace`

Создает событие распознавания лица на изображении.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "imageBase64": "string",
    "imageName": "string"
  }
}
```

### 13. Создание события лица по ID карты

**POST** `/api/v1/findface/eventFaceByCardId`

Создает событие лица для конкретной карты.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "cardId": "string"
  }
}
```

### 14. Добавление вложения к карте

**POST** `/api/v1/findface/addHumanCardAttachment`

Добавляет изображение как вложение к карте человека.

**Запрос:**
```json
{
  "serviceName": "string",
  "clientId": "string",
  "userId": "string",
  "requestId": "string",
  "data": {
    "id": 1,
    "imageBase64": "string",
    "imageName": "string"
  }
}
```

**Ответ:**
```json
{
  "status": "ok",
  "data": {
    "fileId": "string",
    "fileName": "string",
    "mimeType": "string"
  }
}
```

## Debug Minio-endpoints

Для отладки доступны специальные endpoints, которые сохраняют изображения в MinIO лог:

- `/api/v1/findface/detectFaceMinio` - аналог `/api/v1/findface/detectFace`
- `/api/v1/findface/detectLicensePlateMinio` - аналог `/api/v1/findface/detectLicensePlate`
- `/api/v1/findface/createFaceMinio` - аналог `/api/v1/findface/createFace`
- `/api/v1/findface/eventFaceMinio` - аналог `/api/v1/findface/eventFace`
- `/api/v1/findface/addHumanCardAttachmentMinio` - аналог `/api/v1/findface/addHumanCardAttachment`

Данные endpoints полностью идентичны основным по API, но дополнительно сохраняют переданные изображения в MinIO для возможности отладки и анализа.

## Примеры использования

### Распознавание лица на изображении

```bash
curl -X POST http://localhost:20050/api/v1/findface/detectFace \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "my-service",
    "clientId": "client-123",
    "userId": "user-456",
    "requestId": "req-789",
    "data": {
      "imageBase64": "/9j/4AAQSkZJRgABAQAAAQ...",
      "imageName": "photo.jpg"
    }
  }'
```

### Создание снимка с камеры

```bash
curl -X POST http://localhost:20050/api/v1/findface/captureScreenshot \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "my-service",
    "clientId": "client-123",
    "userId": "user-456",
    "requestId": "req-790",
    "data": {
      "cameraId": 1
    }
  }'
```

## Коды ошибок

- **400 Bad Request** - Некорректные данные запроса
- **401 Unauthorized** - Ошибка аутентификации
- **403 Forbidden** - Недостаточно прав доступа
- **500 Internal Server Error** - Внутренняя ошибка сервера

## Примечания

- Все изображения передаются в формате Base64
- Поля `serviceName`, `clientId`, `userId`, `requestId` обязательны для всех запросов
- Время ответа может варьироваться в зависимости от размера изображения и сложности операции
- API поддерживает только POST запросы
- Health check проверяет доступность на `/health_check` каждые 30 секунд

# FaceIDS Bridge API

REST API для работы с системой распознавания лиц FaceIDS.

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

## Примеры использования

### Распознавание лица на изображении

```bash
curl -X POST http://localhost:3000/api/v1/findface/detectFace \
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
curl -X POST http://localhost:3000/api/v1/findface/captureScreenshot \
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
[![Build Status](https://app.bitrise.io/app/33f4534ac9de2eb6/status.svg?token=hIlPxyRHrs63ghq-yoz7Kw&branch=feat/cordova)](https://app.bitrise.io/app/33f4534ac9de2eb6)

# Приложение AtlasBus

## Сборка

### 1. Инициализировать кордову

```bash
cp .env.example .env
npm run bootstrap
```

### 2. Собрать фронтенд

```bash
npm run build
```

### 3. Запустить приложениe

```bash
cordova run android
cordova run ios
```

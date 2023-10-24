# Atlasbus

Перед запуском приложения нужно установить [Localazy CLI](#localization) глобально.

```sh
cp .env.example .env

npm run bootstrap
npm run dev
```

# <a name="localization"></a>Локализация

Следуйте инструкции по установки [Localazy CLI](https://localazy.com/docs/cli/installation).

```bash
$ localazy upload # for uploading your strings to the Localazy platform
$ localazy download # for downloading translation back to your app
```

# SaaS

Dev сервер с демо SaaS партнером

```sh
# Скачает фавиконки и положит в `public/favicon_{partnerID}.ico`
npm run saas

# Запустит локальный сервер: http://localhost:3001
npm run dev-saas

# Локальный сервер внутри сети. Пр.: http://192.168.1.66:3000
# Чтобы reCAPTCHA работала нужно добавить IP в `reCAPTCHA Admin Console -> Settings -> Domains`
npm run dev-internal
```

# PWA

Для генерации Service Worker'а используется [next-pwa](https://github.com/shadowwalker/next-pwa). Пот капотом использует [Workbox](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin).

Регистрация производится в `_app.tsx`, только для Web версии. Cordova не поддерживается.

```sh
# Запустит Dev сервер с регистрацией SW
SW=true npm run dev

# Соберет приложение с SW
SW=true npm run build
SW=true npm run start
```

-   Путь к воркеру: `.next/sw.js` или `http://localhot:3000/sw.js`
-   Стратегии кеширования: [utils/pwa/swSrc.js](/utils/pwa/swSrc.js)
    -   Подробнее о стратегиях [тут](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)

# Другая документация

- [Релиз приложения AtlasBus в CodePush](packages/cordova/CODEPUSH.md)
- [Как собирать SaaS приложения для партнеров](packages/saas-app/README.md)
- [Документация по Bitrise](packages/saas-app/BITRISE.md)

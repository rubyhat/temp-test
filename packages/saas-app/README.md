# Приложение SaaS партнеров

## Подготовка

1. Перед началом убедитесь что у вас есть готовый SaaS конфиг в `SaaS Admin -> SaaS конфиги` (https://atlasbus.ru/admin)
   - Если конфига нет:
     1. Создайте новый конфиг на этой же странице
     2. Войдите повторно в `SaaS Admin` через домен партнера (пр.: https://blablabus.saas.carbus.io/admin)
     3. Заполните данные о партнере. В первую очередь раздел `SaaS -> Приложение`. Это настройки критичны. Без них приложение не соберется.
3. Скопируйте идентификатор партнера и выполните команды ниже. Команда скачает конфиг SaaS партнера, сгенерирует иконки и сплешскрины для обеих платформ.

```shell
$ cp .env.sample .env
$ npm install
$ PARTNER_ID=идентификатор_партнера npm run bootstrap
```

⚠️ Важно!: Не коммитить измения в папках `./android` и `./ios` которые появились после выполнения `npm run bootstrap`. Эти изменения уникальны для каждого SaaS партнера. Если вам нужно очистить внесенные ранее изменения просто выполните `npm run platforms-rollback`.

# Сборка Android

## Дебаг версия

```shell
$ fastlane android testing # соберет apk
$ adb install ./android/app/build/outputs/apk/debug/app-debug.apk # установит приложение на устройстве/эмуляторе
```

APK можно найти в `android/app/build/outputs/apk/debug/app-debug.apk`

## Релиз версия

1. Достаньте `keystore.jks` и перенесите в `android/app`
   - Keystore AtlasBus приложения: https://wiki.yandex.ru/dostup/keys/#googleplayuploadkey1
   - Keystore RouteBy приложения: https://wiki.yandex.ru/dostup/keys/#googleplayuploadkey2

   **Примечание:** SaaS приложения подписываются тем же Keystore что и AtlasBus. У RouteBy по историческим причинам другой Keystore.
2. Отредактируйте переменные окружения `ANDROID_KEYSTORE_######` в `.env` файле. Выполните команду:

```shell
$ fastlane android production
```

Бандл можно найти в `android/app/build/outputs/bundle/release/app-release.aab`

### Загрузка в Google Play Store

Для автоматический загрузки приложения в Google Play Store нужно создать сервис аккаунт Google Play Console.

1. Следуйте инструкциям в [документации Fastlane](https://docs.fastlane.tools/actions/upload_to_play_store/)
2. Полученный ключ положите в корневую директорю `packages/saas-app/play-store-json-key.json`
3. Установите переменную окружения `UPLOAD_TO_PLAY_GOOGLE=true` в `.env` файле
4. Соберите приложение командой `fastlane android production`

ℹ️ **Примечание**

При первой сборке, приложение загрузится в Google Play Console с ошибкой. Вам нужно сначала создать проект в Google Play Console. Потом собрать на локальной машине продакшн версию и загрузить App Bundle манульно. Это нужно сделать единожды. Последующие сборки будут загружать App Bandle автоматически. Ниже информация из документации Fastlane.

> Before using supply to connect to Google Play Store, you'll need to set up your app manually first by uploading at least one build to Google Play Store. See [fastlane/fastlane#14686](https://github.com/fastlane/fastlane/issues/14686) for more info.

## Полезные ссылки

- Сборка Android приложения: https://developer.android.com/studio/build

# Сборка iOS

## AppStore версия

```shell
$ fastlane ios prepare # обновит имя, идентификатор и entitlements приложения
$ fastlane ios keys # сгенерирует профили и сертификаты; запушит в удаленный репозиторийс ключами
$ fastlane ios production # соберет приложение; загрузит в TestFlight
```

### Загрузка в TestFlight

Убедитесь что проект в TestFlight был создан ранее.

1. Установите переменную окружения `UPLOAD_TO_TESTFLIGHT=true` в `.env` файле
2. Выполните команды выше.

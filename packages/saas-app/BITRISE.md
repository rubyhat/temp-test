## Обновление сессии Apple разработчика в Bitrise

Авторизация Apple разработчика в Bitrise протухает каждый месяц.

Пример ошибки из Bitrise CI:

```shell
Could not configure Apple Service authentication: 2FA session saved in Bitrise Developer Connection is expired, was valid until 2021-10-27 13:00:44 +0000 UTC
```

### Чтобы обновить сессию нужно сделать следующее:

1. Войти в [bitrise.io](https://bitrise.io) под аккаунтом `atlas-bus` (достут [тут](https://wiki.yandex.ru/dostup/#bitrise))
2. Открыть страницу `Edit your profile`
3. Нажать на `Apple Service Connection`
4. Нужно пройти 2FA. Выберите номер который заканчивает на 78 (это номер компании). Код из SMS просите у [@ukcccp](https://t.me/ukcccp) или у [@tomshinsky](https://t.me/tomshinsky)
5. После прохождения 2FA, сессия будет действовать еще месяц

## Создание Workflow для сборки SaaS приложения

1. Войти в [bitrise.io](https://bitrise.io) под аккаунтом `atlas-bus` (достут [тут](https://wiki.yandex.ru/dostup/#bitrise))
2. Выберите проект `Carbus App`
3. Перейдите на вкладку `Workflow`
4. Жмякните `New Workflow`. За основу можете взять workflow `iremelavto`. Сохраните workflow
5. Убедитесь что в `Workflow Editor` активен только что созданный workflow
6. Перейдите на вкладку `Env Vars`
7. Найдите секцию с переменными окружения для текущего workflow
8. Добавьте переменную `PARTNER_ID`. Значение идентификатора партнера можете получить в `SaaS админке -> SaaS конфиги`
9. Запустить билд можно через `Start/Schedule a Build` на странице проекта (не забудь в селекте указать нужный workflow)

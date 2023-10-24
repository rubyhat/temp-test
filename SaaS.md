## Инструкция по настройке партнерского SaaS приложения

### Создание и настройка проекта в OneSignal

1. Открыть https://app.onesignal.com/
2. Нажать `New App/Website`
3. Выбрать платформу "Google Android (FCM)"
4. Скопировать **Firebase Server Key** и **Firebase Sender ID** из Firebase проекта
   `Atlas Morda`, [Project Settings -> Cloud Messaging](https://console.firebase.google.com/project/atlas-morda/settings/cloudmessaging/ios:atlas.bus.tickets), секция `Project Credentials`.
5. На этапе `Select SDK` выбрать `Cordova`.
6. Скопировать полученный **Your App ID: 00000000-1111-2222-3333-444444444444**
7. Открыть SaaS админку партнера `Конфигурация SaaS -> Приложение`. Заполнить поле `ONESIGNAL_APP_ID`.
8. Собрать приложение и проверить появится ли устройство в `Subscribed Users` в OneSignal.

### Настройка iOS приложения

#### Создание Provision Profile для партнера

1. В Apple Developer перейти в [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/certificates/list)
2. Перейти на вкладку [Profiles](https://developer.apple.com/account/resources/profiles/list)
3. Создать профиль с названием `match AppStore io.carbus.app.имя_партнера`

#### Обновление Provision Profile в репозиторий с ключами `atlasbus/ios-keys`

Репозиторий с ключами: [atlasbus/ios-keys](https://gitlab.com/atlasbus/ios-keys)

1. Создать перед этим проект в Apple Store с Bundle ID `io.carbus.app.имя_партнера` иначе не подтянет профайл.
2. Обновить fastlane последней версии `sudo gem install fastlane`
3. Выполнить `fastlane match appstore` (см. [README.md](https://gitlab.com/atlasbus/ios-keys/-/blob/master/README.md))
4. Следуй инструкциям. Данные для заполнения.

- **URL to the git repo**: git@gitlab.com:atlasbus/ios-keys.git
- **Passphrase for Match storage**: Найти в `Bitrise -> AtlasBus -> Морда -> Workflow Editor -> Secrets`,
  переменная окружения `MATCH_PASSWORD`

5. Далее `fastlane` попросит логин и пароль от Apple Developer Program.
   Логин в виде e-mail'а (пр.: bludnic@atlsbus.ru). Приедет 2FA код на айфоне.
6. Далее попросит список идентификаторов приложений `app_identifier`.
   Можно взять отсюда [morda/packages/cordova/fastlane/Matchfile](https://gitlab.com/atlasbus/atlas-morda/morda/-/blob/master/packages/cordova/fastlane/Matchfile).
   Не забудь включить идентификатор нового приложения в этот список.
   Пример: atlas.bus.tickets, atlas.bus.tickets.testing, io.carbus.app.iremelavto

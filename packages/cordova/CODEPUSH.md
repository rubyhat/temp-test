# Релиз приложения AtlasBus в CodePush

После успешной сборки в Bitrise, бандлы приложения загружаются в CodePush. Ниже описано как сделать релиз приложения.

1. Войдите в App Center https://appcenter.ms
2. Выберите проект `AtlasBus Production Android` или `AtlasBus Production iOS`, в зависимости какую платформу хотите зарелизить

![My apps](docs/codepush/1-my-apps.png)

3. Перейдите на вкладку `Distribute -> CodePush`

![Distribute -> CodePush](docs/codepush/2-distribute-codepush.png)

4. В правом верхнем углу переключитесь с `Production` на `Staging`

![Staging Releases](docs/codepush/3-staging-releases.png)

5. В таблице должен появится только что собранный релиз

![Select Release](docs/codepush/4-select-release.png)

6. В правом верхнем углу нажмите на гаечный ключ

![Open Release Editor](docs/codepush/5-open-release-editor.png)

7. В окне редактирования релиза поменяйте `Target Versions`. Добавьте символ "<" перевод номером версии. К примеру, было `2.15.31`, стало `<2.15.31`

![Edit Release](docs/codepush/6-edit-release.png)

8. Описание к релизу (поле `Description`) можно заполнить по желанию. Нажмите `Done`

10. Нажмите `Promote`

![Promote](docs/codepush/7-promote-release.png)

11. Переключитесь обратно на `Production`. В таблице должен появится ваш релиз

![Production Releases](docs/codepush/8-production-releases.png)

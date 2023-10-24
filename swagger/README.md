## Общая информация

Swagger Codegen репозиторий для генерации API клиента. Используется кастомный шаблон на основе [typescript-fetch](https://github.com/swagger-api/swagger-codegen/tree/master/modules/swagger-codegen/src/main/resources/typescript-fetch).

## Генерация клиента

Для генерации используется [swagger-codegen-cli-2.4.9.jar](bin/swagger-codegen-cli-2.4.9.jar).

https://github.com/swagger-api/swagger-codegen

```sh
$ npm run build-swagger
$ npm i

# OR

$ npm run bootstrap
```

## Как использовать

### Как локальный пакет (предпочтительно)

```sh
$ cd ./morda
$ npm i
```

```js
import { EndpointsApi } from '@atlasbus/client';
```

### Как модуль

В таком случае нужно установить зависимости в папке `./swagger/client`.

```sh
$ cd ./swagger/client
$ npm i
```

Запускать `npm run build` не обязательно. Можно импортировать исходники на TS.

```js
import { EndpointsApi } from 'swagger/client';
```

## Пример кода

```js
import { EndpointsApi } from '@atlasbus/client';

const endpoints = new EndpointsApi({
    basePath: 'https://y.defun.xyz'
});

endpoints.gdsRidesEndpointsGet()
    .then(res => res.json())
    .then(data => console.log(data));
```

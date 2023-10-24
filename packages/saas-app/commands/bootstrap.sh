# Скачать и сохранить локально SaaS конфиг партнера
npm run saas:config:copy

# Удалить стандартные иконки от Capacitor.
# Мы не генерируем Adaptive Icons, поэтому удаляем перед этим стандартные ресурсы от Capacitor.js
# чтобы Android не пытался их использовать.
# @see https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive
rm -rf ./android/app/src/main/res/drawable
rm -rf ./android/app/src/main/res/drawable-land-hdpi
rm -rf ./android/app/src/main/res/drawable-land-mdpi
rm -rf ./android/app/src/main/res/drawable-land-xhdpi
rm -rf ./android/app/src/main/res/drawable-land-xxhdpi
rm -rf ./android/app/src/main/res/drawable-land-xxxhdpi
rm -rf ./android/app/src/main/res/drawable-port-hdpi
rm -rf ./android/app/src/main/res/drawable-port-mdpi
rm -rf ./android/app/src/main/res/drawable-port-xhdpi
rm -rf ./android/app/src/main/res/drawable-port-xxhdpi
rm -rf ./android/app/src/main/res/drawable-port-xxxhdpi
rm -rf ./android/app/src/main/res/drawable-v24
rm -rf ./android/app/src/main/res/mipmap-anydpi-v26
rm -rf ./android/app/src/main/res/mipmap-hdpi
rm -rf ./android/app/src/main/res/mipmap-mdpi
rm -rf ./android/app/src/main/res/mipmap-xhdpi
rm -rf ./android/app/src/main/res/mipmap-xxhdpi
rm -rf ./android/app/src/main/res/mipmap-xxxhdpi

# Генереция иконок и сплеш скринов
npm run cordova:generate-resources

# Засинькать
npx cap sync android
npx cap sync ios

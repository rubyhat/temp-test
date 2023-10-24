require "plist"

# Updates App.entitlements settings related to +OneSignal Cordova Plugin+
#
# @param aps_environment [String] Supported values: production, development
#
def update_onesignal_app_entitlements(aps_environment: "development")
  app_entitlements_path = "../ios/App/App/App.entitlements"
  app_entitlements = Plist.parse_xml(app_entitlements_path)

  # Adds environment in "Signing & Capabilities -> Push Notifications"
  default_aps_environment = app_entitlements["aps-environment"]
  puts "Modifying the aps-environment: #{default_aps_environment} => #{aps_environment}"
  app_entitlements["aps-environment"] = aps_environment

  File.write(app_entitlements_path, app_entitlements.to_plist)
  puts "[OK] App.entitlements updated successfully"
end

# Updates PRODUCT_BUNDLE_IDENTIFIER of OneSignalNotificationServiceExtension in App.xcodeproj
#
# @param bundle_identifier [String] App Bundle Identifier. E.g. io.carbus.app.sample
#
def update_onesignal_bundle_identifier(bundle_identifier:)
  project_path = "../ios/App/App.xcodeproj"
  project = Xcodeproj::Project.open(project_path)

  project.targets.each do |target|
    puts "Target: #{target.name} (UUID: #{target.uuid})"

    target.build_configurations.each do |config|
      puts "Build Config: #{config.name} (UUID: #{config.uuid})"

      if target.name == "OneSignalNotificationServiceExtension"
        puts "Found target #{target.name}"
        config.build_settings.store("PRODUCT_BUNDLE_IDENTIFIER", "#{bundle_identifier}.OneSignalNotificationServiceExtension")
      else
        puts "Skipping target #{target.name}"
      end
    end
  end

  project.save()
  puts "[OK] PRODUCT_BUNDLE_IDENTIFIER of OneSignalNotificationServiceExtension updated successfully"
end

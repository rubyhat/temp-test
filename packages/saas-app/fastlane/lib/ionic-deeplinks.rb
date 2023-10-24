require "plist"

# Updates App.entitlements settings related to +Ionic Deeplinks Plugin+
#
# @param associated_domain [String] e.g. applinks:carbus.io
#
def update_ionic_deeplinks_app_entitlements(associated_domain:)
  app_entitlements_path = "../ios/App/App/App.entitlements"
  app_entitlements = Plist.parse_xml(app_entitlements_path)

  default_associated_domain = app_entitlements["com.apple.developer.associated-domains"][0]
  puts "Modifying the com.apple.developer.associated-domains[0]: #{default_associated_domain} => #{associated_domain}"
  app_entitlements["com.apple.developer.associated-domains"][0] = associated_domain

  File.write(app_entitlements_path, app_entitlements.to_plist)
  puts "[OK] App.entitlements updated successfully"
end

# Updates Info.plist settings related to +Ionic Deeplinks Plugin+
#
# @param url_scheme [String] e.g. carbus
#
def update_ionic_deeplinks_info_plist(url_scheme:)
  info_plist_path = "../ios/App/App/Info.plist"
  info_plist = Plist.parse_xml(info_plist_path)

  puts "Updating ios/App/App/Info.plist"

  default_url_scheme = info_plist["CFBundleURLTypes"][0]["CFBundleURLSchemes"][0]
  puts "Modifying the CFBundleURLTypes[0][CFBundleURLSchemes][0]: #{default_url_scheme} => #{url_scheme}"
  info_plist["CFBundleURLTypes"][0]["CFBundleURLSchemes"][0] = url_scheme

  File.write(info_plist_path, info_plist.to_plist)
  puts "[OK] Info.plist updated successfully"
end

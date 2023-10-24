require "xcodeproj"

# Updates CFBundleDisplayName in Info.plist
#
# @param bundle_display_name [String] e.g. Карбас
#
def update_ios_bundle_display_name(bundle_display_name)
  info_plist_path = "../ios/App/App/Info.plist"
  info_plist = Plist.parse_xml(info_plist_path)

  puts "Updating ios/App/App/Info.plist"

  default_bundle_display_name = info_plist["CFBundleDisplayName"]
  puts "Modifying the CFBundleDisplayName: #{default_bundle_display_name} => #{bundle_display_name}"
  info_plist["CFBundleDisplayName"] = bundle_display_name

  File.write(info_plist_path, info_plist.to_plist)
  puts "[OK] Info.plist updated successfully"
end

# Updates DEVELOPMENT_TEAM in App.xcodeproj
#
# @param team_id [String] Apple Developer Team ID. E.g. 6PAQJWJ9D2
#
def update_development_team(team_id:)
  project_path = "../ios/App/App.xcodeproj"
  project = Xcodeproj::Project.open(project_path)

  puts "Updating DEVELOPMENT_TEAM in ios/App/App.xcodeproj to #{team_id}"

  project.targets.each do |target|
    puts "Target: #{target.name} (UUID: #{target.uuid})"

    target.build_configurations.each do |config|
      puts "Build Config: #{config.name} (UUID: #{config.uuid})"

      if target.name == "App"
        config.build_settings.store("DEVELOPMENT_TEAM", team_id)
      else
        puts "Skipping target #{target.name}"
      end
    end
  end

  project.save()
  puts "[OK] DEVELOPMENT_TEAM updated successfully (team_id: #{team_id})"
end

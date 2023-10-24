require "erb"

# Renames Android package
#
# @param project_path [String] Path to the Android project
# @param package_name [String] Current package name
# @param new_package_name [String] New package name
#
def rename_android_package_name(project_path:, package_name:, new_package_name:)
  sh "find #{project_path}/app/src -name '*.java' -type f -exec sed -i '' 's/#{package_name}/#{new_package_name}/' {} \\;"
  sh "find #{project_path}/app/src -name 'AndroidManifest.xml' -type f -exec sed -i '' 's/#{package_name}/#{new_package_name}/' {} \\;"
  sh "find #{project_path}/app -name 'build.gradle' -type f -exec sed -i '' 's/#{package_name}/#{new_package_name}/' {} \\;"
end

# Generates AndroidManifest.xml from template
#
# @param saas_config [String] Path to saas-config.json
# @param project_path [String] Android project path
# @param template_path [String] AndroidManifest.xml template path
#
def generate_android_manifest(
  saas_config:,
  project_path: "../android",
  template_path: "../templates/android/app/src/main/AndroidManifest.xml"
)
  template = File.read(template_path)

  android_manifest_path = "#{project_path}/app/src/main/AndroidManifest.xml"

  # Template variables
  package_name = saas_config["cordova"]["androidAppId"]
  url_scheme = saas_config["partner"]

  deeplink_scheme = "https"
  deeplink_host = saas_config["meta"]["domains"][0]
  android_path_prefix = "/"

  deeplink_2_scheme = 'https'
  deeplink_2_host = " "
  android_2_path_prefix = "/"

  deeplink_3_scheme = 'https'
  deeplink_3_host = " "
  android_3_path_prefix = "/"

  deeplink_4_scheme = 'https'
  deeplink_4_host = " "
  android_4_path_prefix = "/"

  deeplink_5_scheme = 'https'
  deeplink_5_host = " "
  android_5_path_prefix = "/"

  android_manifest = ERB.new(template).result(binding)
  File.write(android_manifest_path, android_manifest)
end

# Generates build.gradle from template
#
# @param application_id [String] Android package name. e.g. io.carbus.app.sample
# @param version_name [String] Android versionName. e.g. 2.15.0
# @param version_code [String] Android versionCode. e.g. 2150
# @param project_path [String] Android project path
# @param template_path [String] build.gradle template path
#
def generate_build_gradle(
  application_id:,
  version_name:,
  version_code:,
  project_path: "../android",
  template_path: "../templates/android/app/src/build.gradle"
)
  template = File.read(template_path)

  build_gradle_path = "#{project_path}/app/build.gradle"

  # Template variables
  build_gradle = ERB.new(template).result(binding)

  File.write(build_gradle_path, build_gradle)
end

# Generates resources strings.xml from template
#
# @param saas_config [String] Path to saas-config.json
# @param project_path [String] Android project path
# @param template_path [String] build.gradle template path
#
def generate_resources_strings_xml(
  saas_config:,
  project_path: "../android",
  template_path: "../templates/android/app/src/main/res/values/strings.xml"
)
  template = File.read(template_path)

  strings_xml_path = "#{project_path}/app/src/main/res/values/strings.xml"

  # Template variables
  app_name = saas_config["cordova"]["appName"]
  package_name = saas_config["cordova"]["androidAppId"]

  strings_xml = ERB.new(template).result(binding)

  File.write(strings_xml_path, strings_xml)
end

require "json"

# Parse saas-config.json
#
# @param path [String] Path to the saas-config.json
#
def parse_saas_json_config(path = "../saas-config.json")
  file = File.read(path)

  saas_config = JSON.parse(file)
  puts "SaaS config #{saas_config["partner"]} parsed successfully"

  return saas_config
end

# Return Morda app version from package.json
#
# @param path [String] Path to the Morda package.json
# @return [String] e.g. 2.15.0
def get_morda_package_json_version_name(path = "../../../package.json")
    file = File.read(path)
    package_json = JSON.parse(file)

    return package_json["version"]
end

# Return Morda app version from package.json
#
# @param path [String] Path to the Morda package.json
# @return [String] e.g. 2150
def get_morda_package_json_version_code(path = "../../../package.json")
    file = File.read(path)
    package_json = JSON.parse(file)

    return package_json["version"].gsub('.', "") # remove dots
end

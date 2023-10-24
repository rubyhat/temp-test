require 'fileutils'
require 'git'

# Clone iOS Keys repository
#
# @param repository_uri [String] e.g. git@gitlab.com:atlasbus/atlas-morda/carbus-saas-app-ios-keys.git
# @param repository_path [String] Repository destination folder (e.g.: ./ios-keys)
#
def clone_ios_keys_repository(repository_uri:, repository_path:)
  repository_full_path = File.expand_path(File.join(repository_path), '../')
  puts "Cloning iOS Keys repository into #{repository_full_path}"

  FileUtils.rm_rf(repository_full_path) # clean repo directory

  g = Git.clone(repository_uri, repository_full_path)
  g.status.changed.each do |file|
    puts file.blob(:index).contents
  end
end

# Commit and push generated profiles and certificates
#
# @param repository_uri [String] e.g. git@gitlab.com:atlasbus/atlas-morda/carbus-saas-app-ios-keys.git
# @param repository_path [String] Repository location folder (e.g.: ./ios-keys)
# @param saas_partner_id [String] Used in commit message
#
def push_keys_to_ios_keys_repository(repository_uri:, repository_path:, saas_partner_id:)
    repository_full_path = File.expand_path(File.join(repository_path), '../')
    puts "Pushing generated Certificates and Profiles to iOS Keys repository"

    g = Git.open(repository_full_path)
    g.add

    puts "Changed #{g.status.changed.length} files"
    g.status.changed.each do |file|
      puts file
    end

    puts "Added #{g.status.added.length} files"
    g.status.added.each do |file|
      puts file
    end

    if g.status.changed.length > 0 or g.status.added.length > 0 then
      puts "Committing changes"
      g.commit("[Bitrise] Updated profiles and certificates (saas_partner_id: #{saas_partner_id})")

      puts "Pushing to remote repository"
      g.push
    else
      puts "Nothing changed"
    end
end

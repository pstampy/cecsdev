# -*- encoding: utf-8 -*-
# stub: guard-shell 0.7.0 ruby lib

Gem::Specification.new do |s|
  s.name = "guard-shell"
  s.version = "0.7.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Joshua Hawxwell"]
  s.date = "2014-11-04"
  s.description = "    Guard::Shell automatically runs shell commands when watched files are\n    modified.\n"
  s.email = "m@hawx.me"
  s.homepage = "http://github.com/hawx/guard-shell"
  s.licenses = ["MIT"]
  s.rubygems_version = "2.4.4"
  s.summary = "Guard gem for running shell commands"

  s.installed_by_version = "2.4.4" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<guard>, [">= 2.0.0"])
    else
      s.add_dependency(%q<guard>, [">= 2.0.0"])
    end
  else
    s.add_dependency(%q<guard>, [">= 2.0.0"])
  end
end

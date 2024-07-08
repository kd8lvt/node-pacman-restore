# node-pacman-restore
A simple commandline utility to restore pacman packages after a SteamOS (or other immutable root fs) update.  
Must be run with sudo, because pacman.

# Usage

#### Add
Installs the package and adds it to the config. If it fails to install, you can simply use `--remove` to delete it from the config.
```sh
#Currently unable to install multiple packages. I might add that later.
sudo ./restore --sync package=package_name_here
#Pacman Equivalent: `sudo pacman -Syu package_name_here`

# "-s" also works as shorthand
sudo ./restore -s package=package_name_here
#Pacman Equivalent: `sudo pacman -Syu package_name_here`
```
---
#### Remove
Uninstalls the package and removes it from the config, if present.
```sh
#Again - one package at a time.
sudo ./restore --remove package=package_name_here
#Pacman Equivalent: `sudo pacman -Ru package_name_here`

# "-r" also works as shorthand
sudo ./restore -r package=package_name_here
#Pacman Equivalent: `sudo pacman -Ru package_name_here`
```
---
#### Restore
Installs any packages in config.json that are missing.
```sh
sudo ./restore --refresh
# Collects all the packages in the config that are NOT installed to a variable named ${pkgList} then runs
# Pacman Equivalent: pacman -Syu ${pkgList}

# "-R" also works as shorthand
sudo ./restore -R
```
---
#### Verbose
Get verbose wrapper output (not verbose pacman output. I should add that...)
```sh
#Combine with one of the three operations above
sudo ./restore --verbose --sync package=package_name_here

# "-v" also works as shorthand
sudo ./restore -v --sync package=package_name_here
```
---
#### Dry Run
Makes pacman do a dry run, to test a command without changing anything.
```sh
#Might not always work properly due to pacman being funky.
sudo ./restore --dry --sync package=package_name_here
#Pacman Equivalent: pacman --print -Syu package_name_here

# "-d" also works as shorthand
sudo ./restore -d --sync package=package_name_here
#Pacman Equivalent: pacman --print -Syu package_name_here
```
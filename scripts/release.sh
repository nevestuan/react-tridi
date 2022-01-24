#!/bin/bash -e
export RELEASE=1

if ! [ -e scripts/release.sh ]; then
  echo >&2 "Please run scripts/release.sh from the repo root"
  exit 1
fi

current_version=$(node -p "require('./package').version")

printf "Next version (current is $current_version)? "
read next_version

validate_semver() {
  if ! [[ $1 =~ ^[0-9]\.[0-9]+\.[0-9](-.+)? ]]; then
    echo >&2 "Version $1 is not valid! It must be a valid semver string like 1.0.2 or 2.3.0-beta.1"
    exit 1
  fi
}

get_release_branch() {
  arr_ver=($(echo $next_version | tr "-" "\n"))
  if [[ -z "${arr_ver[1]}" ]];
    then
      echo "master"
    else
      echo ${arr_ver[1]}
  fi
}

validate_semver $next_version
release_branch=$(get_release_branch)
is_master_release=false
if [[ $release_branch =~ "master" ]]; then
  is_master_release=true
fi

# TODO - npm test
yarn test

## Update version in package.json ##
git commit -am "Version $next_version"
npm version $next_version --allow-same-version
  # push first to make sure we're up-to-date
git commit --amend --no-edit
git push origin ${release_branch}

## Create Git Tag ##
if [ $is_master_release = true ]; then
  next_tag_name="v$next_version"
  git tag -fa $next_tag_name -m "${next_tag_name}"
  git push -f origin $next_tag_name
fi

## Build package ##
node scripts/build.js

## Publish ##
next_npm_tag="latest"
if [ ! $is_master_release = true ]; then
  next_npm_tag=$release_branch
fi
npm publish --tag $next_npm_tag
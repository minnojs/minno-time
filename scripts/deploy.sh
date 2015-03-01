#!/usr/bin/env bash

# get base dir so that we source from the correct location
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
# get absolute path to the base repository
DIR=$(readlink -f $DIR/..)

# get helpers
source "$DIR/scripts/errorExit.sh" || error_exit "$LINENO: errorExit not found."
source "$DIR/scripts/cleanGitTree.sh" || error_exit "$LINENO: cleanGitTree not found."

# fetch all data from github
source "$DIR/scripts/git-ffwd-update.sh" || error_exit "$LINENO: could not update repository."
git pull --tags

# clean
rm -rf "$DIR/scripts/../0.0" || error_exit "$LINENO: could not remove 0.0"

# get piQuest source
source "$DIR/scripts/getSource.sh" || error_exit "$LINENO: could not get piQuest source."
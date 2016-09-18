#!/usr/bin/env bash

# path to repo
DIR=$(git rev-parse --show-toplevel)

# get helpers
source "$DIR/scripts/errorExit.sh" || error_exit "$LINENO: errorExit not found."
source "$DIR/scripts/cleanGitTree.sh" || error_exit "$LINENO: cleanGitTree not found."

# fetch all data from github
source "$DIR/scripts/git-ffwd-update.sh" || error_exit "$LINENO: could not update repository."
git pull --tags

# clean
rm -rf "$DIR/0.3" || error_exit "$LINENO: could not remove 0.3"

# get piQuest source
source "$DIR/scripts/getSource.sh" || error_exit "$LINENO: could not get piQuest source."

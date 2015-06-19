#!/usr/bin/env bash

# get base dir so that we source from the correct location
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi

# get absolute path to the base repository
DIR=$(readlink -f $DIR/..)

# get helpers
source "$DIR/scripts/errorExit.sh" || error_exit "$LINENO: errorExit not found."

###################################################
#
# Copy api file and add appropriate front matter
# @param: tag
# @param: from url (url of original file)
# @param: to url (where to copy the new file)
#
###################################################
function copy_api (){
	# Concatenate front matter and API.md
	# http://stackoverflow.com/questions/23929235/bash-multi-line-string-with-extra-space

	read -r -d '' APItext <<- EOM
		---
		title: API
		description: All the little details...
		---

		$(git show $1:$2)
	EOM

	# create directory if needed
	mkdir -p $(dirname "${3}")

	# create target
	echo "$APItext" > "$3"
}


# create temporary directory that we can use for our stuff...
# http://unix.stackexchange.com/questions/30091/fix-or-alternative-for-mktemp-in-os-x
TMPDIR=`mktemp -d 2>/dev/null || mktemp -d -t 'myTMPDIR'`
TMPDIR=$(readlink -f $TMPDIR)
trap "rm -Rf $TEMPDIR" EXIT

git fetch --quiet

# create repository clone
cd $TMPDIR
git clone --quiet $DIR .

# Get new tags from remote
git fetch --quiet --tags

VERSIONS=("0.3")

for VERSION in ${VERSIONS[@]}
do

	# Get latest tag name
	LATESTTAG=$(git describe --tags $(git rev-list --tags="v$VERSION*" --max-count=1))

	# Checkout latest tag
	git checkout --quiet $LATESTTAG || error_exit "$LINENO: could not checkout LATESTTAG."


	###################################################################
	#	copy in all the interestin files...
	###################################################################


	# creat the 0.0 directory just in case
	mkdir -p $DIR/$VERSION

	# copy dirs that we want to gh-pages
	rm -rf $DIR/$VERSION/{dist,bower_components,package.json}
	cp -r $TMPDIR/{dist,bower_components,package.json} $DIR/$VERSION/ || error_exit "$LINENO: could not import dist/bower_components."

	######## quest ########
	copy_api $LATESTTAG "resources/tutorials/API.md" "$DIR/src/0.3/examples/API.md"
	copy_api $LATESTTAG "src/js/extensions/dscore/README.md" "$DIR/src/0.3/tutorials/scorer.md"
done
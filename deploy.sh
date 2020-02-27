MANIFEST_FILE="manifest.json"


# pump version number
CURRENT_VERSION=`grep \"version $MANIFEST_FILE|sed -e 's/.*"version": "\([0-9].[0-9].[0-9]\)",/\1/'`

MAJOR=`echo $CURRENT_VERSION | cut -d. -f1`
MINOR=`echo $CURRENT_VERSION | cut -d. -f2`
SUBMINOR=`echo $CURRENT_VERSION | cut -d. -f3`

NEW_SUBMINOR=`echo $(($SUBMINOR + 1))`
NEW_VERSION=$MAJOR.$MINOR.$NEW_SUBMINOR

sed -e 's/'$CURRENT_VERSION'/'$NEW_VERSION'/g' -i .bak $MANIFEST_FILE

sed -e 's/127.0.0.1/167.71.248.67/g' -i .bak background.js
# sed -e 's/127.0.0.1/167.71.248.67/g' -i .bak js/popup.js
zip -9 -r ../ossinse.zip *
cd ..

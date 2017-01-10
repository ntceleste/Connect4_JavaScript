/**
 * Created by nate on 1/7/17.
 */
/**
 * Finds all space groups of size minimumSize and larger within the Board board.
 * @param board The Board to analyze
 * @param minimumSize The minimumSize of the SpaceGroups to return
 * @param includeLockedGroups If true, locked groups will be included.
 * @return Returns an array of all the SpaceGroups that were found in the Board and fit the criteria
 */
function getSpaceGroupsWithLockedOption(board, minimumSize, includeLockedGroups) {
    var spaceGroups = [];

    for (var column = 0; column < board.columns; column++) {
        for(var row = 0; row < board.rows; row++) {
            var space = board.getSpace(column, row);

            if (space.isEmpty()) { //If it is empty, this won't belong to a SpaceGroup anyway
                continue;
            }

            var spaceGroupsIncludingSpace = getSpaceGroupsIncludingSpace(space); //This will actually get the space groups
            // console.log(spaceGroupsIncludingSpace.map( function (item) { return item.toString(); }).join("\n"));
            for (var i =0; i < spaceGroupsIncludingSpace.length; i++) {
                var spaceGroup = spaceGroupsIncludingSpace[i];

                if (spaceGroup === null){ //At this point, we have reached the end of the existing groups
                    break;
                }

                if (spaceGroup.spaces.length < minimumSize) { //Too small
                    continue;
                }

                if (includeLockedGroups || !(spaceGroup.isLocked())) { //Ignores locked groups if includeLockedGroups is false
                    spaceGroups.push(spaceGroup);
                }
            }
        }
    }

    return spaceGroups;
}


/**
 * Finds all space groups of size minimumSize and larger within the Board board.
 * @param board The Board to analyze
 * @param minimumSize The minimumSize of the SpaceGroups to return
 * @return Returns an array of all the SpaceGroups that were found in the Board and fit the criteria, assumes not to include locked groups
 */
function getSpaceGroups(board, minimumSize) {
    return getSpaceGroupsWithLockedOption(board, minimumSize, false);
}

/**
 * Finds all SpaceGroups including this space in any positive direction
 * @param board The Board to find the SpaceGroups in
 * @param space The Space to use to find the SpaceGroups
 */
function getSpaceGroupsIncludingSpace(space) {
    var spaceGroupsIncludingSpace = [];

    /*
     * The use of only positive AdjacencyZones helps to make this more efficient and less wasteful.
     * No point in going in all directions as this would result in duplicate SpaceGroups.
     */
    for (var direction in positiveAdjacencyZones) {
        var adjacencyZone = positiveAdjacencyZones[direction];
        var previousSpace = space.getAdjacentSpace(adjacencyZone.getOppositeAdjacencyZone());
        if (previousSpace != null && previousSpace.playerID === space.playerID) {
            /*
             * So this part may be somewhat confusing.
             * The general idea is that if a space in a negative direction also matches this Space's owner then
             * this Space and this previousSpace already exist in a SpaceGroup with a positive AdjacencyZone direction
             * in which the previousSpace comes first.
             * So, therefore, it is a waste of time and memory to create another SpaceGroup that essentially already exists.
             * Plus, if we create a SpaceGroup in one direction but start somewhere in the middle, this SpaceGroup will only include
             * less information than the earlier one.
             */
            continue;
        }
        spaceGroupsIncludingSpace.push(new SpaceGroup(adjacencyZone, space));
    }

    return spaceGroupsIncludingSpace;
}
/**
 * Created by nate on 1/7/17.
 */
/**
 * This class is used to keep track of adjacent spaces in a given direction that all have the same owner PlayerID
 * @author Nate Celeste NTC14, Noah Crowley NWC17
 */
function SpaceGroup(adjacencyZone, baseSpace) {
    /**
     * Creates a new SpaceGroup with the given AdjacencyZone as its direction and the given Space as its base, then continues to add Spaces in the direction of its AdjacencyZone until it no longer can successfully add Spaces
     * @param adjacencyZone The AdjacencyZone representing the direction of this SpaceGroup
     * @param baseSpace The Space that will be first in this SpaceGroup
     */
    this.adjacencyZone = adjacencyZone;
    this.spaces = [];

    this.spaces.push(baseSpace);

    while(this.addNextPositiveSpace()){};
}

/**
 * Gets the PlayerID that is associated as the owner of all of the Spaces in this SpaceGroup
 * @return Returns the PlayerID that is associated as the owner of all of the Spaces in this SpaceGroup, returns null if this SpaceGroup is empty
 */
SpaceGroup.prototype.getOwnerPlayerID = function () {
    if (this.spaces.length === 0) {
        return "none";
    }

    return this.spaces[0].playerID;
};

/**
 * Adds a new Space to this SpaceGroup, appending to it from the end by moving up one more in the direction of the associated AdjacencyZone
 * @return Returns true if a Space was successfully added, false otherwise
 */
SpaceGroup.prototype.addNextPositiveSpace = function () {
    var positiveNextSpace = this.getPositiveNextSpace();

    if (positiveNextSpace === null){
        return false
    }

    if (this.spaces.length > 0 && positiveNextSpace.playerID !== this.getOwnerPlayerID()) {
        return false;
    }

    this.spaces.push(positiveNextSpace);

    return true;
};

/**
 * Gets the next Space when following the associated AdjacencyZone
 * @return Returns the next Space when following the associated AdjacencyZone
 */
SpaceGroup.prototype.getPositiveNextSpace = function () {
    var lastSpace = this.spaces[this.spaces.length - 1];

    return lastSpace.getAdjacentSpace(this.adjacencyZone);
};

/**
 * Gets the next Space when following opposite the associated AdjacencyZone
 * @return Returns the next Space when following opposite the associated AdjacencyZone
 */
SpaceGroup.prototype.getNegativeNextSpace = function () {
    var negativeAdjacencyZone = this.adjacencyZone.getOppositeAdjacencyZone();
    var firstSpace = this.spaces[0];

    return firstSpace.getAdjacentSpace(negativeAdjacencyZone);
};

/**
 * Determines whether this SpaceGroup is locked, i.e. both ends in the given AdjacencyZone direction are blocked
 * @return Returns true if this SpaceGroup is locked, i.e. both ends in the given AdjacencyZone direction are blocked, false otherwise
 */
SpaceGroup.prototype.isLocked = function () {
    var positiveSpace = this.getPositiveNextSpace();
    var negativeSpace = this.getNegativeNextSpace();

    //If both ends are blocked by the other player or the wall
    return ((positiveSpace == null || !positiveSpace.isEmpty()) &&
    (negativeSpace == null || !negativeSpace.isEmpty()));
};


/**
 * Returns a String representing the SpaceGroup that is just the concatenation of all of the Space's BoardCoordinate Strings in order
 */
SpaceGroup.prototype.toString = function () {
    return this.spaces.map(function (item) {
        return "(" + item.toString() + ")";
    }).join(", ");
};
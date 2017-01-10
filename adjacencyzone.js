/**
 * Created by nate on 1/7/17.
 */
/**
 * This enum holds data regarding all eight possible directions that Spaces can have as AdjacencyZones
 */
var adjacencyDirections = {
    none: new BoardCoordinate(0,0),
    north: new BoardCoordinate(0,-1),
    northEast: new BoardCoordinate(1,-1),
    east: new BoardCoordinate(1,0),
    southEast: new BoardCoordinate(1,1),
    south: new BoardCoordinate(0,1),
    southWest: new BoardCoordinate(-1,1),
    west: new BoardCoordinate(-1,0),
    northWest: new BoardCoordinate(-1,-1)
};

/**
 * Creates an AdjacencyZone with the given direction
 * @constructor
 */
function AdjacencyZone(givenDirection) {
    if(adjacencyDirections[givenDirection] === undefined){
        givenDirection = "none";
    }
    this.offsetBoardCoordinate = adjacencyDirections[givenDirection];
    this.direction = givenDirection;
}

/**
 * Gets the opposite AdjacencyZone based on the direction of this AdjacencyZone's BoardCoordinate
 * @return Returns the opposite AdjacencyZone based on the direction of this AdjacencyZone's BoardCoordinate
 */
AdjacencyZone.prototype.getOppositeAdjacencyZone = function () {
    var reverseBoardCoordinate = this.offsetBoardCoordinate.scalarMultiply(-1);
    var oppositeAdjacencyZone = getAdjacencyZoneFromOffset(reverseBoardCoordinate);
    return oppositeAdjacencyZone;
};

/**
 * Gets the AdjacencyZone that matches the given BoardCoordinate in direciton
 * @param offsetBoardCoordinate The BoardCoordinate to match to an AdjacencyZone
 * @return Returns the AdjacencyZone that matches the given BoardCoordinate in direciton
 */
function getAdjacencyZoneFromOffset(offsetBoardCoordinate) {
    for (var direction in adjacencyDirections){
        if(adjacencyDirections[direction].equals(offsetBoardCoordinate)){
            return new AdjacencyZone(direction);
        }
    }
}

/**
 * Gets the list of all AdjacencyZones that have positive BoardCoordinate directions, not including AdjacencyZone.NONE
 * @return Returns the list of all AdjacencyZones that have positive BoardCoordinate directions, not including AdjacencyZone.NONE
 */
var positiveAdjacencyZones = (function () {
    var positiveAdjacencyZones = [];
    for (var direction in adjacencyDirections){
        if(adjacencyDirections[direction].isPositive()){
            positiveAdjacencyZones.push(new AdjacencyZone(direction));
        }
    }
    return positiveAdjacencyZones;
})();


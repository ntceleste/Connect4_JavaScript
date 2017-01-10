/**
 * Created by nate on 1/7/17.
 */
/**
 * This class is the primary Node and Graph piece of the entire game structure
 * This class will contain a BoardCoordinate and a PlayerID to keep track of its own state
 * It will also keep a reference to its parent Board so as to find neighboring Space objects
 * @author Nate Celeste NTC14, Noah Crowley NWC17
 */
function Space(board, boardCoordinate) {

    /**
     * Creates a Space at the given BoardCoordinate with an ownerPlayerID of PlayerID.NONE
     * @param board The Board this Space will be associated with
     * @param boardCoordinate The BoardCoordinate representing the position of this Space on its parent Board
     */
    this.board = board;
    this.boardCoordinate = boardCoordinate;
    this.playerID = "none";

}


/**
 * Determines whether this Space is empty, i.e. whether this Space's owner is PlayerID.NONE
 * @return Returns true if the owner PlayerID of this Space is PlayerID.NONE, false otherwise
 */
Space.prototype.isEmpty = function () {
    return this.playerID === "none";
};

/**
 * Gets the BoardCoordinate in the given direction of the provided AdjacencyZone.
 * @param adjacencyZone The AdjacencyZone used to determine which direction to get the adjacent BoardCoordinate
 * @return Returns a BoardCoordinate that is offset by the AdjacencyZone's direction
 */
Space.prototype.getAdjacentBoardCoordinate = function (adjacencyZone) {
    return this.boardCoordinate.add(adjacencyZone.offsetBoardCoordinate);
};

/**
 * Gets the Space adjacent to this Space in the given direction of the provided AdjacencyZone
 * @param adjacencyZone The AdjacencyZone used to determine which direction to get the adjacent Space
 * @return Returns the adjacent Space in the direction of the AdjacencyZone, returns null if no Space exists in that direction
 */
Space.prototype.getAdjacentSpace = function (adjacencyZone) {
    if (adjacencyZone.direction === "none"){
        return null;
    }

    var adjacentSpaceBoardCoordinate = this.getAdjacentBoardCoordinate(adjacencyZone);
    var adjacentColumn = adjacentSpaceBoardCoordinate.column;
    var adjacentRow = adjacentSpaceBoardCoordinate.row;

    if (adjacentColumn < 0 || adjacentColumn >= this.board.columns || adjacentRow < 0 || adjacentRow >= this.board.rows) {
        return null;
    }

    var adjacentSpace = this.board.getSpace(adjacentColumn, adjacentRow);
    return adjacentSpace;
};

Space.prototype.toString = function () {
    return this.playerID + " " + this.boardCoordinate.toString();
};
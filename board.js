/**
 * Created by nate on 1/7/17.
 */
/**
 * This class holds all the Space nodes and manages their relations to one another.
 * @author Nate Celeste NTC14, Noah Crowley NWC17
 */
function Board(gameState) {

    /**
     * Creates a new Board associated with the given GameState
     * @author Nate Celeste NTC14, Noah Crowley NWC17
     * @param gameState The GameState that this will belong to
     */
    this.columns = 7;
    this.rows = 6;
    this.gameState = gameState;
    this.spaces = [];
    this.winningGroup = null;

    this.createSpaces();

}

/**
 * Creates all of the Spaces and stores them in the 2D _spaces array
 */
Board.prototype.createSpaces = function () {
    for (var col = 0; col < this.columns; col++) {
        for (var row = 0; row < this.rows; row++) {
            var  boardCoordinate = new BoardCoordinate(col, row);
            if (this.spaces[col] === undefined) {
	            this.spaces[col] = [];
            }
            this.spaces[col][row] = new Space(this, boardCoordinate);
        }
    }
};

/**
 * Gets the Space at the specified column and row
 * @param column The column of the Space desired
 * @param row The row of the Space desired
 * @return The Space at the BoardCoordinate (column, row)
 */
Board.prototype.getSpace = function (column, row) {
    //console.log(column, row);
    return this.spaces[column][row];
};

/**
 * This method handles giving the top available Space of a column to the Player identified by the given PlayerID
 * @param column The column to drop a token into
 * @param playerID The PlayerID to set the owner of the top Space to
 * @return Returns true if the column was open, false if it was already full
 */
Board.prototype.dropTokenWithPlayer = function (column, playerID) {
    var spacesColumn = this.spaces[column];

    if (!spacesColumn[0].isEmpty()) {
        return false;
    }

    var emptyRow = 0;

    for (var i = 1; i < spacesColumn.length && spacesColumn[i].isEmpty(); i++) {
        emptyRow++;
    }

    var space = spacesColumn[emptyRow];
    space.playerID = playerID;

    var event = new CustomEvent("spaceChangedEvent", {"detail": {
        "column": column,
        "row": emptyRow,
        "playerID": playerID
    }});
    document.dispatchEvent(event);

    return true;
};

/**
 * Same as dropToken(int, PlayerID), but assumes that it should use the GameState's currentPlayerID
 * @param column The column to drop a token into
 * @return Returns true if the column was open, false if it was already full
 */
Board.prototype.dropToken = function (column) {
    return this.dropTokenWithPlayer(column, this.gameState.currentPlayerID)
};

/**
 * This method uses the BoardAnalyzer to determine if there are any SpaceGroups of size 4
 * @return Returns PlayerID.NONE if no player has won, otherwise it returns the PlayerID of the player who won
 */
Board.prototype.checkForWinner = function () {
    var winningGroups = getSpaceGroupsWithLockedOption(this, 4, true);
    //console.log("winningGroups",winningGroups);
    if (winningGroups.length == 0) {
        return "none";
    }

    this.winningGroup = winningGroups[0];

    return this.winningGroup.getOwnerPlayerID();
};

/**
 * Used to find the top occupied Space in a column
 * @param column The column to find the Space in
 * @return Returns null if the column is completely empty, otherwise returns the top Space with an owner.
 */
Board.prototype.getTopOwnedSpace = function (column) {
    var spacesColumn = this.spaces[column];

    for(var rowIndex = 0; rowIndex < spacesColumn.length; rowIndex++) {
        var space = spacesColumn[rowIndex];
        if(!space.isEmpty())
            return space;
    }

    return null;
};

Board.prototype.toString = function () {
    var output = "";
    for(var row = 0; row < this.rows; row++){
        for(var col = 0; col < this.columns; col++){
            var space = this.spaces[col][row];
            switch(space.playerID){
                case "player1":
                    output += "1 ";
                    break;
                case "player2":
                    output += "2 ";
                    break;
                default:
                    output += "0 ";
            }
        }
        output += "\n";
    }
    return output;
};
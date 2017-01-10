/**
 * Created by nate on 1/6/17.
 */

/**
 * BoardCoordinate
 * Is used to determine Coordinates on the Board
 * @author Nate Celeste NTC14, Noah Crowley NWC17
 */
function BoardCoordinate(initialColumn, initialRow) {

    /**
     * Just creates a BoardCoordinate with the given column and row
     * @param column The column
     * @param row The row
     */
    this.column = initialColumn;
    this.row = initialRow;
}

/**
 * Returns a String of the format "(COLUMN,ROW)"
 */
BoardCoordinate.prototype.toString = function() {
    return "(" + this.column + "," + this.row + ")";
};

/**
 * Adds this BoardCoordinate and another.
 * Formula: (this.column + addend.column, this.row + addend.row)
 * @param addend The BoardCoordinate to add to this BoardCoordinate
 * @return Returns the resulting BoardCoordinate
 */
BoardCoordinate.prototype.add = function(addend) {
    var newColumn = this.column + addend.column;
    var newRow = this.row + addend.row;

    return new BoardCoordinate(newColumn, newRow);
};

/**
 * Subtracts another from this BoardCoordinate.
 * Formula: (this.column - subtrahend.column, this.row - subtrahend.row)
 * @param subtrahend The BoardCoordinate to subtract from this BoardCoordinate
 * @return Returns the resulting BoardCoordinate
 */
BoardCoordinate.prototype.subtract = function(subtrahend) {
    var newColumn = this.column - subtrahend.column;
    var newRow = this.row - subtrahend.row;

    return new BoardCoordinate(newColumn, newRow);
};

/**
 * Multiplies this BoardCoordinate by a scalar.
 * Formula: (this.column * scalar, this.row * scalar)
 * @param scalar The scalar to multiply this BoardCoordinate by
 * @returns Returns the resulting BoardCoordinate
 */
BoardCoordinate.prototype.scalarMultiply = function(scalar) {
    var newColumn = this.column * scalar;
    var newRow = this.row * scalar;

    return new BoardCoordinate(newColumn, newRow);
};

/**
 * Determines whether this BoardCoordinate is positive, meaning that its column is greater than 0 or, if column equals 0, its row is greater 0
 * @return Returns true if this BoardCoordinate counts as "positive"
 */
BoardCoordinate.prototype.isPositive = function() {
    if (this.column < 0) { //If column < 0, always negative
        return false;
    }
    if (this.column > 0) { //If column > 0, always positive
        return true;
    }
    //Okay, column is 0
    if (this.row < 0) { //So, column = 0 and row < 0 is negative
        return false;
    }
    if (this.row > 0) { //So, column = 0 and row > 0 is positive
        return true;
    }
    return false; //This only happens at (0,0)
};

/**
 * Determines if two BoardCoordinates have the same column and row
 * @param comparisonCoordinate The BoardCoordinate to be compared to this
 * @returns Boolean
 */
BoardCoordinate.prototype.equals = function(comparisonCoordinate) {
    return ((this.row === comparisonCoordinate.row) && (this.column === comparisonCoordinate.column));
};

/**
 * Compares this BoardCoordinate to another BoardCoordinate. Returns 0 if equal, 1 if this BoardCoordinate is greater than the other, and -1 if otherwise.
 */
BoardCoordinate.prototype.compareTo = function(comparisonCoordinate) {
    var deltaCoordinate = this.subtract(comparisonCoordinate);
    if (comparisonCoordinate.equals(this)) {
        return 0;
    }
    if (deltaCoordinate.isPositive()){
        return 1;
    }
    return -1;
};

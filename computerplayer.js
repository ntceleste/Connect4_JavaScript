/**
 * Created by nate on 1/8/17.
 */

/**
 * This class is the core of our project. It implements the AI decision making algorithm
 * @author Nate Celeste NTC14, Noah Crowley NWC17
 */

function ComputerPlayer(gameState, playerID) {
    this.gameState = gameState;
    this.playerID = playerID;
    this.lastTurnDuration = 0;
    this.numberOfTurnsAnalyzed = 0;

    document.addEventListener("playerChangedEvent", function (e) {
        if (e.detail !== this.playerID) {
            return;
        }
        this.play();
    }.bind(this));
}

/**
 * This handles the entire AI algorithm and eventually takes a turn for the AI
 */
ComputerPlayer.prototype.play = function () {
    var startTime = new Date().getTime(); //Measure the startTime for time analysis

    var columnChosen = this.chooseColumn(); //This method is basically the entire algorithm

    this.gameState.board.dropToken(columnChosen); //Just...Drop the token

    this.lastTurnDuration = new Date().getTime() - startTime; //Find the difference of the startTime and endTime and then set that as our last turn duration.

    this.gameState.goToNextPlayer(); //Let the game move on!
};

/**
 * This method contains almost all of the AI's algorithm for turn making. Arguably the most complicated method of the entire project
 * @return Returns the int representing the chosen column for the AI to drop a token into
 */
ComputerPlayer.prototype.chooseColumn = function () {
    this.numberOfTurnsAnalyzed = 0; //New turn, and we haven't analyzed anything yet

    var ghostBoard = this.gameState.ghostBoard; //Easier to do this now
    var columnChosen = -1; //-1 represents no chosen column
    var firstOpenColumn = -1; //-1 represents that no column is currently open
    var columnChosenScoreAverage = -1; //-1 represents the score average of the currently chosen average

    for (var column = 0; column < ghostBoard.columns; column++) { //Iterate over all of the columns of the ghost board once...
        if (!ghostBoard.dropTokenWithPlayer(column, this.playerID)) { //If the column is full, no use in even looking at this.
            continue;
        }

        if (firstOpenColumn == -1) { //At this point, we know the column is open. And if no open column has been found yet, at least we can know this one is
            firstOpenColumn = column;
        }

        if (ghostBoard.checkForWinner() === this.playerID) { //If the token was dropped and this player won, just choose this! No better move can possibly exist!!
            columnChosen = column;
            ghostBoard.getTopOwnedSpace(column).playerID = "none";
            break;
        }

        var averageScoreForColumn = 0;
        var containsOpponentVictory = false; //If the current column allows the opponent to win, we want to avoid that

        for (var otherPlayerColumn = 0; otherPlayerColumn < ghostBoard.columns; otherPlayerColumn++) { //Now iterate over every column again, this time for the opposing player's possible turns
            if (!ghostBoard.dropTokenWithPlayer(otherPlayerColumn, getOppositePlayerID(this.playerID))) { //If the column is full, no use in even looking at this.
                continue;
            }

            if (ghostBoard.checkForWinner() === getOppositePlayerID(this.playerID)) { //Have to avoid letting the other player win!
                containsOpponentVictory = true;
            }

            this.numberOfTurnsAnalyzed++; //This counts as one set of turns analyzed, now
            var boardScore = this.scoreGhostBoard(); //This method is a big deal
            averageScoreForColumn += boardScore; //At the end of this we'll average out this sum
            ghostBoard.getTopOwnedSpace(otherPlayerColumn).playerID = "none"; //Erase the hypothetical move from the ghost board
        }

        averageScoreForColumn /= ghostBoard.columns; //Now average out the sum of the scores that will result after the other player's next turn based on this possible move
        //console.log("if ! " + containsOpponentVictory + " && ( " + averageScoreForColumn + " > " + columnChosenScoreAverage + " || " + columnChosen + " )");
        if (!containsOpponentVictory &&
            (averageScoreForColumn > columnChosenScoreAverage || columnChosen == -1)) { //As long as this doesn't result in the other player winning and is the best option so far, this column should become the new choice
            columnChosen = column;
            columnChosenScoreAverage = averageScoreForColumn;
            //console.log("chosen column " + column + " with avg " + averageScoreForColumn);
        }

        ghostBoard.getTopOwnedSpace(column).playerID = "none"; //Erase the hypothetical move from the ghost board

        //console.log("seen column " + column + " with avg " + averageScoreForColumn + " chosen column " + columnChosen);
    }

    if (columnChosen == -1) { //If no column was chosen, the AI should just go with the first open column it found
        columnChosen = firstOpenColumn;
    }

    return columnChosen;
};

/**
 * Determines whether a space group is imminent, i.e. is one move away from a victory
 * @param spaceGroup The SpaceGroup to check for imminence
 * @returns Returns true if the SpaceGroup is imminent, false if otherwise
 */
ComputerPlayer.prototype.isSpaceGroupImminent = function (spaceGroup) {
    if (spaceGroup.spaces.length < 2) {
        return false;
    }
    if (spaceGroup.isLocked()) { //If this SpaceGroup is locked then this SpaceGroup is not imminent
        return false;
    }

    var positiveSpace = spaceGroup.getPositiveNextSpace();
    var negativeSpace = spaceGroup.getNegativeNextSpace();

    if (spaceGroup.spaces.length == 3) {
        //A SpaceGroup that has the length of 3 is imminent if either end has an empty space. i.e. _ A A A or A A A _ or even _ A A A _
        if ((positiveSpace != null && positiveSpace.isEmpty()) ||
            (negativeSpace != null && negativeSpace.isEmpty())) {
            return true;
        }
    }
    else if (spaceGroup.spaces.legth == 2) {
        //So, if a SpaceGroup has the length of 2, it can still be imminent in that it may have another Space with a single empty space in the middle. i.e. A A _ A is just as imminent as A A A _
        if (positiveSpace != null && positiveSpace.isEmpty()) { //This would be something like A A _ A
            var nextPositiveSpace = positiveSpace.getAdjacentSpace(spaceGroup.adjacencyZone);
            if (nextPositiveSpace != null && nextPositiveSpace.getOwnerPlayerID().equals(spaceGroup.getOwnerPlayerID())) {
                return true;
            }
        }
        if (negativeSpace != null && negativeSpace.isEmpty()) { //This would be something like A _ A A
            var nextNegativeSpace = negativeSpace.getAdjacentSpace(spaceGroup.getAdjacencyZone().getOppositeAdjacencyZone());
            if (nextNegativeSpace != null && nextNegativeSpace.getOwnerPlayerID().equals(spaceGroup.getOwnerPlayerID())) {
                return true;
            }
        }
    }
    return false;
};

/**
 * This method scores the entire Ghost Board to determine how each set of moves will affect the state of the game
 * @return Returns the integer score difference of the game with the given state of the Ghost Board
 */
ComputerPlayer.prototype.scoreGhostBoard = function () {
    var ghostBoard = this.gameState.ghostBoard;
    var spaceGroups = getSpaceGroupsWithLockedOption(ghostBoard, 2, true); //Get all SpaceGroups (locked and not) of at least size 2 (size 1 SpaceGroups are neglected as they cannot be considered imminent)
    var playerScores = {
        player1: 0,
        player2: 0
    }; //Store the scores of each Player

    //console.log("ghostBoard");
    //console.log(ghostBoard.toString());

    for (var i = 0; i < spaceGroups.length; i++) { //Iterate over each SpaceGroup found
        var spaceGroup = spaceGroups[i];
        if (spaceGroup.isLocked() && spaceGroup.spaces.length < 4) { //If the SpaceGroup is locked and is not a winning group, then there is nothing useful about this. Continue on
            continue;
        }

        var scoreAddend = 0;
        if (spaceGroup.spaces.length >= 4) { //If the SpaceGroup is a winning SpaceGroup, that Player needs a solid 10,000 points added to their score - very scary!
            scoreAddend = 10000;
        }
        else if (this.isSpaceGroupImminent(spaceGroup)) { //If the SpaceGroup is imminent, i.e. one move away from that player winning, it is a very good SpaceGroup to have. 4,000 points!
            scoreAddend = 4000;
        }
        else { //Otherwise, just give the Player an extra 100 points for every Space in the SpaceGroup
            scoreAddend = 100 * spaceGroup.spaces.length;
        }

        var newScore = playerScores[spaceGroup.getOwnerPlayerID()] + scoreAddend;
        playerScores[spaceGroup.getOwnerPlayerID()] = newScore;
    }

    var score = playerScores[this.playerID];
    var opposingScore = playerScores[getOppositePlayerID(this.playerID)];
    var scoreDifference = score - opposingScore;

    return scoreDifference;

};
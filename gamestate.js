/**
 * Is used to track the current state of the game
 * @author Nate Celeste NTC14, Noah Crowley NWC17
 */
function GameState() {
    this.board = new Board(this);
    this.ghostBoard = new Board(this);
    this.currentPlayerID = "player1";
    this.isGameGoing = false;
    this.players = [];
    this.createPlayers();

    document.addEventListener("spaceChangedEvent", function(e) {
        this.ghostBoard.getSpace(e.detail.column, e.detail.row).playerID = e.detail.playerID;
    }.bind(this));
}


/**
 * Creates the players, Player1 and Player2, and stores them in the _players Map.
 */
GameState.prototype.createPlayers = function () {
    this.players["player1"] = new HumanPlayer("player1");
    this.players["player2"] = new ComputerPlayer(this, "player2");
};

/**
 * Starts the game and fires the gameStarted event
 */
GameState.prototype.startGame = function () {
    this.isGameGoing = true;

    document.dispatchEvent(new CustomEvent("gameStartedEvent"));
};

/**
 * Ends the game and fires the gameEnded event
 * @param winnerPlayerID The PlayerID of the player who won the game
 */
GameState.prototype.endGame = function (winnerPlayerID) {
    this.isGameGoing = false;

    var event = new CustomEvent("gameOverEvent", {"detail": winnerPlayerID});
    document.dispatchEvent(event);
};

/**
 * Sets the current player to the player who is next up.
 */
GameState.prototype.goToNextPlayer = function () {
    var winningPlayer = this.board.checkForWinner();

    if (winningPlayer === "none") {
        if(this.currentPlayerID === "player1")
            this.currentPlayerID = "player2";
        else
            this.currentPlayerID = "player1";

        var event = new CustomEvent("playerChangedEvent", {"detail": this.currentPlayerID});
        document.dispatchEvent(event);

    }
    else{
        this.currentPlayerID = "none";
        this.endGame(winningPlayer);
    }
};

GameState.prototype.toString = function () {
    var output = "";
    output += this.currentPlayerID + "\n";
    output += this.board.toString() + "\n";

    return output;
};

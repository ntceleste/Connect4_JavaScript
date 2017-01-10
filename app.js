(function () {
    var app = angular.module('connect4', []);


    app.controller('GameController', function ($scope) {
        $scope.game = new GameState();
        $scope.game.startGame();
        $scope.dropToken = function (column) {
            var successfulDrop = $scope.game.board.dropTokenWithPlayer(column, $scope.game.currentPlayerID);
            if (successfulDrop){
                $scope.game.goToNextPlayer();
                var millisecondsElapsed = $scope.game.players["player2"].lastTurnDuration;
                var numberOfTurns = $scope.game.players["player2"].numberOfTurnsAnalyzed;
                var timeComplexity = Math.log(numberOfTurns) / Math.log($scope.game.board.columns);
                document.getElementById("message").innerHTML = "Your opponent took " + millisecondsElapsed
                    + " milliseconds to make their turn. " + "They looked at " + numberOfTurns
                    + " possible turns. The time complexity for this turn was O(N^" + timeComplexity + ")";

            }
            else {
                document.getElementById("message").innerHTML = "You selected a full column. Please select a different column";
            }
            if($scope.game.board.winningGroup !== null){
	            var winningPlayerString = playerString($scope.game.board.winningGroup.spaces[0].playerID);
	            var winningMessage = winningPlayerString + " won";
	            document.getElementById("message").innerHTML = "The game is over: " + winningMessage;
            }
        };

        document.addEventListener("gameOverEvent", function(e) {
            var winningSpaces = $scope.game.board.winningGroup.spaces;
            for(var key in winningSpaces){
                var space = winningSpaces[key];
                var id = "space" + space.boardCoordinate.column + space.boardCoordinate.row;
                var element = document.getElementById(id);
                element.className += " winning";
            }
        }.bind($scope));
    });

    app.filter('color', function () {
        return function (input) {
            switch(input) {
                case "player1":
                    return "#FF0000";
                case "player2":
                    return "#FFFF00";
                default:
                    return "#000000";
            }
        };
    });
})();



























































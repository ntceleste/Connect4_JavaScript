/**
 * Created by nate on 1/7/17.
 */
/**
 * This mock enum holds data regarding the two PlayerIDs
 * @author Nate Celeste NTC14, Noah Crowley NWC17
 */
var playerIDs = {
    none: "None",
    player1: "You",
    player2: "The Computer"
};


/**
 * Returns the String representation of this PlayerID
 */
function playerString(playerID) {
    return playerIDs[playerID];
}

/**
 * Gets the opposite PlayerID
 * @return Returns the opposite PlayerID
 */
function getOppositePlayerID(playerID) {
    switch(playerID){
        case "player1":
            return "player2";
        case "player2":
            return "player1";
        default:
            return "none";
    }
}

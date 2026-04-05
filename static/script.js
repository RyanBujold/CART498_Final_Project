let charPos = {
    x:4,
    y:6,
};
// 0=empty, 1=character, 2=wall, 3=exit
let mazeMap = [
    [2,2,2,2,2,2,2,2],
    [2,0,2,3,0,2,0,2],
    [2,0,2,2,0,2,0,2],
    [2,0,0,0,0,0,0,2],
    [2,0,2,0,2,2,2,2],
    [2,0,2,0,0,2,0,2],
    [2,0,0,2,1,0,0,2],
    [2,2,2,2,2,2,2,2],
]

let surroundings = [
    [0,0,0],
    [0,1,0],
    [0,0,0],
]

let visitedTiles = mazeMap.map((row) => row.map(() => false));
const exitPos = findExitPosition();
let isMazeRevealed = false;

markVisitedTile();
updateSurroundings();

function describeSurroundings(auto=false){
    let ptext = "";
    let fetchType = '/dm';

    if(!auto){
       ptext = document.getElementById('prompt-form').value;
    }
    else {
        fetchType = '/auto'; 
    }
    

    updateSurroundings();

    let mazeString = "";

    mazeString+=`north:${surroundings[0][1]},`;
    mazeString+=`east:${surroundings[1][2]},`;
    mazeString+=`south:${surroundings[2][1]},`;
    mazeString+=`west:${surroundings[1][0]}`;


    // POST
    fetch(fetchType, {

        // Declare what type of data we're sending
        headers: {
        'Content-Type': 'application/json'
        },

        // Specify the method
        method: 'POST',

        // A JSON payload
        body: JSON.stringify({
            "info": mazeString + "|" + ptext
        })
        }).then(function (response) { // At this point, Flask has printed our JSON
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.text();
        }).then(function (text) {

            console.log('POST response: ');

            // Should be 'OK' if everything was successful
            console.log(text);
            text = checkMove(text);
            document.getElementById("response-text").innerHTML = `<p word-wrap: break-word>${text}</p>`;
    }).catch(function (error) {
        console.error('Fetch error:', error);
        document.getElementById("response-text").innerHTML = `<p word-wrap: break-word>${error.message}</p>`;
    });

}

function checkMove(text){
    if(text.includes("!mr")){
        text = text.replace("!mr","")
        moveRight();
    }
    else if(text.includes("!ml")){
        text = text.replace("!ml","")
        moveLeft();
    }
    else if(text.includes("!mu")){
        text = text.replace("!mu","")
        moveUp();
    }
    else if(text.includes("!md")){
        text = text.replace("!md","")
        moveDown();
    }

    return text;
}

function displayMaze() {
    let mazeString = "";

    for (let row = 0; row < mazeMap.length; row++) {
        for (let col = 0; col < mazeMap[row].length; col++) {
            if (mazeMap[row][col] === 0) {
                mazeString += " ";
            } else if (mazeMap[row][col] === 1) {
                mazeString += "X";
            } else if (mazeMap[row][col] === 2) {
                mazeString += "#";
            } else if (mazeMap[row][col] === 3) {
                mazeString += "E";
            }
        }
        mazeString += "\n";
    }

    document.getElementById("maze").innerHTML = `<pre>${mazeString}</pre>`;
}

function displayTravelMap() {
    const mazePanel = document.getElementById("maze-panel");

    isMazeRevealed = true;

    if (mazePanel) {
        mazePanel.hidden = false;
    }

    let travelMapString = "";

    for (let row = 0; row < mazeMap.length; row++) {
        for (let col = 0; col < mazeMap[row].length; col++) {
            if (mazeMap[row][col] === 2) {
                travelMapString += '<span class="maze-wall">#</span>';
            } else if (charPos.x === col && charPos.y === row) {
                travelMapString += '<span class="maze-player">X</span>';
            } else if (exitPos && exitPos.x === col && exitPos.y === row) {
                travelMapString += '<span class="maze-exit">E</span>';
            } else if (visitedTiles[row][col]) {
                travelMapString += '<span class="maze-visited">.</span>';
            } else {
                travelMapString += " ";
            }
        }
        travelMapString += "\n";
    }

    document.getElementById("maze").innerHTML = `<pre>${travelMapString}</pre>`;
}

function updateSurroundings(){
    surroundings[0][0] = mazeMap[charPos.y-1][charPos.x-1];
    surroundings[0][1] = mazeMap[charPos.y-1][charPos.x];
    surroundings[0][2] = mazeMap[charPos.y-1][charPos.x+1];

    surroundings[1][0] = mazeMap[charPos.y][charPos.x-1];
    surroundings[1][1] = mazeMap[charPos.y][charPos.x];
    surroundings[1][2] = mazeMap[charPos.y][charPos.x+1];

    surroundings[2][0] = mazeMap[charPos.y+1][charPos.x-1];
    surroundings[2][1] = mazeMap[charPos.y+1][charPos.x];
    surroundings[2][2] = mazeMap[charPos.y+1][charPos.x+1];
}

function findExitPosition() {
    for (let row = 0; row < mazeMap.length; row++) {
        for (let col = 0; col < mazeMap[row].length; col++) {
            if (mazeMap[row][col] === 3) {
                return { x: col, y: row };
            }
        }
    }

    return null;
}

function markVisitedTile() {
    visitedTiles[charPos.y][charPos.x] = true;
}

function gameWon(){
    const winMessage = document.getElementById("win-message");

    if (winMessage) {
        winMessage.hidden = false;
    }
    console.log("GAME WIN TRIGGERED");
}

function moveRight() {
    //Check for win
    if(mazeMap[charPos.y][charPos.x+1] == 3){
        gameWon();
    }

    //Check if we hit a wall
    if(mazeMap[charPos.y][charPos.x+1] != 2){
        //Move
        mazeMap[charPos.y][charPos.x] = 0;
        charPos.x++;
        mazeMap[charPos.y][charPos.x] = 1;
        markVisitedTile();
    }
    
    updateSurroundings();
    refreshTravelMap();
}

function moveLeft(){
    //Check for win
    if(mazeMap[charPos.y][charPos.x-1] == 3){
        gameWon();
    }

    //Check if we hit a wall
    if(mazeMap[charPos.y][charPos.x-1] != 2){
        //Move
        mazeMap[charPos.y][charPos.x] = 0;
        charPos.x--;
        mazeMap[charPos.y][charPos.x] = 1;
        markVisitedTile();
    }
    

    updateSurroundings();
    refreshTravelMap();
}

function moveUp(){
    //Check for win
    if(mazeMap[charPos.y-1][charPos.x] == 3){
        gameWon();
    }
    //Check if we hit a wall
    if(mazeMap[charPos.y-1][charPos.x] != 2){
        //Move
        mazeMap[charPos.y][charPos.x] = 0;
        charPos.y--;
        mazeMap[charPos.y][charPos.x] = 1;
        markVisitedTile();
    }

    updateSurroundings();
    refreshTravelMap();
}

function moveDown(){
    //Check for win
    if(mazeMap[charPos.y+1][charPos.x] == 3){
        gameWon();
    }

    //Check if we hit a wall
    if(mazeMap[charPos.y+1][charPos.x] != 2){
        //Move
        mazeMap[charPos.y][charPos.x] = 0;
        charPos.y++;
        mazeMap[charPos.y][charPos.x] = 1;
        markVisitedTile();
    }

    updateSurroundings();
    refreshTravelMap();
}

function refreshTravelMap() {
    if (!isMazeRevealed) {
        return;
    }

    let travelMapString = "";

    for (let row = 0; row < mazeMap.length; row++) {
        for (let col = 0; col < mazeMap[row].length; col++) {
            if (mazeMap[row][col] === 2) {
                travelMapString += '<span class="maze-wall">#</span>';
            } else if (charPos.x === col && charPos.y === row) {
                travelMapString += '<span class="maze-player">X</span>';
            } else if (exitPos && exitPos.x === col && exitPos.y === row) {
                travelMapString += '<span class="maze-exit">E</span>';
            } else if (visitedTiles[row][col]) {
                travelMapString += '<span class="maze-visited">.</span>';
            } else {
                travelMapString += " ";
            }
        }
        travelMapString += "\n";
    }

    document.getElementById("maze").innerHTML = `<pre>${travelMapString}</pre>`;
}

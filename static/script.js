let charPos = {
    x:1,
    y:3,
};
// 0=empty, 1=character, 2=wall
let mazeMap = [
    [2,2,2,2,2],
    [2,0,0,0,2],
    [2,2,2,0,2],
    [2,1,0,0,2],
    [2,2,2,2,2],
]

let surroundings = [
    [2,2,2],
    [2,1,0],
    [2,2,2],
]

function describeSurroundings(){
    let ptext = document.getElementById('prompt-form').value;

    let mazeString = "";

    for (let row = 0; row < surroundings.length; row++) {
        for (let col = 0; col < surroundings[row].length; col++) {
            if (surroundings[row][col] === 0) {
                mazeString += " ";
            } else if (surroundings[row][col] === 1) {
                mazeString += "X";
            } else if (surroundings[row][col] === 2) {
                mazeString += "#";
            }
        }
        mazeString += "\n";
    }

    // POST
    fetch('/dm', {

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
            checkMove(text);
            mazeString = text;
            document.getElementById("response-text").innerHTML = `<pre>${text}</pre>`;
    }).catch(function (error) {
        console.error('Fetch error:', error);
        document.getElementById("response-text").innerHTML = `<pre>${error.message}</pre>`;
    });

}

function checkMove(text){
    if(text.includes("!mr")){
        moveRight();
    }
    else if(text.includes("!ml")){
        moveLeft();
    }
    else if(text.includes("!mu")){
        moveUp();
    }
    else if(text.includes("!md")){
        moveDown();
    }
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
            }
        }
        mazeString += "\n";
    }

    document.getElementById("maze").innerHTML = `<pre>${mazeString}</pre>`;
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

function moveRight() {
    //Check if we hit a wall
    if(mazeMap[charPos.y][charPos.x+1] != 2){
        //Move
        mazeMap[charPos.y][charPos.x] = 0;
        charPos.x++;
        mazeMap[charPos.y][charPos.x] = 1;
    }

    updateSurroundings();
    displayMaze();
}

function moveLeft(){
    //Check if we hit a wall
    if(mazeMap[charPos.y][charPos.x-1] != 2){
        //Move
        mazeMap[charPos.y][charPos.x] = 0;
        charPos.x--;
        mazeMap[charPos.y][charPos.x] = 1;
    }

    updateSurroundings();
    displayMaze();
}

function moveUp(){
    //Check if we hit a wall
    if(mazeMap[charPos.y-1][charPos.x] != 2){
        //Move
        mazeMap[charPos.y][charPos.x] = 0;
        charPos.y--;
        mazeMap[charPos.y][charPos.x] = 1;
    }

    updateSurroundings();
    displayMaze();
}

function moveDown(){
    //Check if we hit a wall
    if(mazeMap[charPos.y+1][charPos.x] != 2){
        //Move
        mazeMap[charPos.y][charPos.x] = 0;
        charPos.y++;
        mazeMap[charPos.y][charPos.x] = 1;
    }

    updateSurroundings();
    displayMaze();
}

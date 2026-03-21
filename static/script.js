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

function moveRight() {
    //Check if we hit a wall
    if(mazeMap[charPos.y][charPos.x+1] != 2){
        //Move
        mazeMap[charPos.y][charPos.x] = 0;
        charPos.x++;
        mazeMap[charPos.y][charPos.x] = 1;
    }

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

    displayMaze();
}

'use strict';

/**
 * Green vs. Red game for MentorMate Dev Internship
 * */
class GreenVsRed {
    constructor(rows, cols, userGrid, xrow, xcol, turns)  {
        this.rows = rows;
        this.cols = cols;
        this.userGrid = userGrid;
        this.xrow = xrow;
        this.xcol = xcol;
        this.turns = turns;
        this.currentGrid = [];
        this.previousGrid = [];
    };

    /**
     * Helper method checking if an element at current position exists in the previous iteration of the grid
     * @row - Number
     * @col - Number
     * @returns - Bool
     * */
    setCellValueHelper = (row, col) => {
        if (row < 0 || col < 0 || row > this.rows - 1 || col > this.cols - 1) {
            return 0
        } else {
            return this.previousGrid[row][col];
        }
    };

    /**
     * Counts how many green neighbours a cell has
     * @row - Number
     * @col - Number
     * @returns - Number
     * */
    countNeighbours = (row, col) => {
        let totalCells = 0;

        totalCells += this.setCellValueHelper(row - 1, col - 1);   // top left corner
        totalCells += this.setCellValueHelper(row - 1, col);           // top center
        totalCells += this.setCellValueHelper(row - 1, col + 1);   // top right corner
        totalCells += this.setCellValueHelper(row, col - 1);           // middle left
        totalCells += this.setCellValueHelper(row, col + 1);           // middle right
        totalCells += this.setCellValueHelper(row + 1, col - 1)   // bottom left
        totalCells += this.setCellValueHelper(row + 1, col);          // bottom center
        totalCells += this.setCellValueHelper(row + 1, col + 1)   // bottom right

        return totalCells;
    };

    /**
     * Applies game rules according to the task requirements
     * @row - Number
     * @col - Number
     * Mutates the cell
     * */
    updateCell = (row,col) => {
        /* Game Rules:
            If red is surrounded by 3 or 6 green cells - become green
            if red has 0,1,2,4,5,7,8 green neighbours - stays red

            if green is surrounded by 0,1,4,5,7,8 green cells - become red
            if green has 2,3,6 neighbours - stays green

            red = 0;
            green = 1;
        */
        const totalNeighbours = this.countNeighbours(row,col);
        const isColorGreen = this.previousGrid[row][col];

        const neighboursOfRedThatResultInGreen = [3, 6];
        const neighboursOfGreenThatResultInRed = [0, 1, 4, 5, 7, 8];

        if (!isColorGreen){
            if (neighboursOfRedThatResultInGreen.includes(totalNeighbours))  {
                return 1;
            } else {
                return 0;
            }
        }

        if (isColorGreen && neighboursOfGreenThatResultInRed.includes(totalNeighbours)) {
            return 0
        } else {
            return 1;
        }
    };

    /**
     * Cycles through each grid element
     * updates each cell via this.updateCell()
     * creates a deep copy of the the updated grid into this.previousGrid
     * */
    updateCurrentGrid = () => {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.currentGrid[i][j] = this.updateCell(i,j);
            }
        }

        this.previousGrid = JSON.parse(JSON.stringify(this.currentGrid));
    };

    /**
     * Sets initial grids depending on user input
     * Runs the main game loop
     * Counts the number of green occurrences at the specified by the user cell at each tick
     * @returns - Number, the total times that user specified cell was green
     * */
    start = () => {
        // set counter
        let greenCount = 0;
        console.debug('Your initial grid is: ');
        console.debug(this.userGrid);

        this.previousGrid = JSON.parse(JSON.stringify(this.userGrid));
        this.currentGrid = JSON.parse(JSON.stringify(this.userGrid));

        // run game loop depending on set number of turns
        for (let i = 0; i < this.turns; i++)   {
            this.updateCurrentGrid();

            // check if the user specified cell is green
            this.previousGrid[this.xrow][this.xcol] === 1 ?  greenCount++ : null;
        }

        console.debug(`Target color was green ${greenCount} times.`)
        return greenCount;
    };
}

const exampleWith3 = new GreenVsRed(3, 3, [[0, 0, 0], [1, 1, 1], [0, 0, 0]],1, 0, 10);
console.log(`Result from Example with 3: ${exampleWith3.start()}`);

const exampleWith4 = new GreenVsRed(4, 4, [[1, 0, 0, 1], [1, 1, 1, 1], [0, 1, 0, 0], [1, 0, 1, 0]],2, 2, 15);
console.log(`Result from Example with 4: ${exampleWith4.start()}`);
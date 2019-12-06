// game.js for Perlenspiel 3.2

// The "use strict" directive in the following line is important. Don't alter or remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't alter or remove them!

/*jslint nomen: true, white: true */
/*global PS */

var game_vars = {
    score: 0,
    fruit: [],
    center: 4,
    size: 9
};

var status_queue = [
    "Space to grow",
    "Left-click to harvest",
    "Only red can be harvested",
    "Only red grows",
    "Escape to restart"
];

function updateStatus() {
    if (status_queue.length) {
        PS.statusText(status_queue.shift());
    } else {
        PS.statusText("Score: " + game_vars.score);
    }
};

function setup() {
    PS.color(PS.ALL, PS.ALL, PS.DEFAULT);
    PS.color(game_vars.center, game_vars.center, 0xff0000);
    game_vars.score = 0;
    game_vars.fruit = [[game_vars.center,game_vars.center]];
    updateStatus();
};

function harvest(x, y) {
    if (PS.color(x, y, PS.CURRENT) == 0xff0000) {
        PS.color(x, y, 0x00ff00);
        game_vars.score += 1;
    }
    updateStatus();
};

function validXY(x, y) {
    return (x >= 0 && x < game_vars.size) && (y >= 0 && y < game_vars.size);
};

function drawFruit() {
    for (var i = 0; i < game_vars.fruit.length; i++) {
        PS.color(game_vars.fruit[i][0], game_vars.fruit[i][1], 0xff0000);
    }
};

function grow() {
    var curr,
        to_check = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ],
        iter;

    game_vars.fruit.push(null);

    while (curr = game_vars.fruit.shift()) {
        if (PS.color(curr[0], curr[1], PS.CURRENT) == 0xff0000) {
            PS.color(curr[0], curr[1], 0x00ff00);
            for(iter = 0; iter < to_check.length; iter++) {
                if (validXY(curr[0]+to_check[iter][0], curr[1]+to_check[iter][1]) && (PS.color(curr[0]+to_check[iter][0], curr[1]+to_check[iter][1], PS.CURRENT) == 0xffffff)) {
                    game_vars.fruit.push([curr[0]+to_check[iter][0], curr[1]+to_check[iter][1]]);
                }
            }
        }
    }

    drawFruit();
    updateStatus();
};

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
[system] = an object containing engine and platform information; see API documentation for details.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.init() event handler:

PS.init = function( system, options ) {

	PS.gridSize(9, 9);
    //PS.border(PS.ALL, PS.ALL, 0);
    setup();

};

/*
PS.touch ( x, y, data, options )
Called when the mouse button is clicked on a bead, or when a bead is touched.
It doesn't have to do anything.
[x] = zero-based x-position of the bead on the grid.
[y] = zero-based y-position of the bead on the grid.
[data] = the data value assigned to this bead by a call to PS.data(); default = 0.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.touch() event handler:

PS.touch = function( x, y, data, options ) {
    harvest(x, y);
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
It doesn't have to do anything.
[key] = ASCII code of the pressed key, or one of the PS.KEY constants documented at:
http://users.wpi.edu/~bmoriarty/ps/constants.html
[shift] = true if shift key is held down, else false.
[ctrl] = true if control key is held down, else false.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.keyDown() event handler:

PS.keyDown = function( key, shift, ctrl, options ) {
    switch(key) {
        case 32: //Space
            grow();
            break;
        case PS.KEY_ESCAPE:
            setup();
            break;
    }
};

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-17 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/

/* main.js */
var game, c1, c2, keys, mouse;

require(["helpers/utils", "engine/game", "engine/display_list", "engine/sprite"], function() {
	game = new Game();
	game.init(); // create canvas, get contexts
	
	// setup keyboard events
	keys = utils.captureKeyboard(document);
	mouse = utils.captureMouse(game.ui.canvas);

	// move a character
	function moveCharacter(key) {
		switch (key) {
		case "up":
			c1.y -= 2;
			break;
		case "down":
			c1.y += 2;
			break;
		case "left":
			c1.x -= 2;
			break;
		case "right":
			c1.x += 2;
			break;
		}
	};

	// capture keyboard state
	document.addEventListener("keydown", function (e) {
		game.handleKeypress(e.keyCode, moveCharacter);
	}, false);

	// create cat girl sprite
	c1 = new Sprite({
		x: 0,
		y: 0,
		width: 101,
		height: 171,
		image: 'images/character_cat_girl.png'
	});
	
	// create pink girl sprite
	c2 = new Sprite({
		x: 200,
		y: 150,
		width: 101,
		height: 171,
		image: 'images/character_pink_girl.png'
	});
	
	// add to display list
	game.displayList.add(c1);
	game.displayList.add(c2);

	game.render();

});
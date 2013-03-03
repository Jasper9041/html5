/* main.js */
var Engine = {},
    game, 
    hero, 
    plant, 
    plant2,
    plant3,
    plant4,
    tiles;

require(['engine/display_list','engine/game','engine/sprite','engine/character', 'engine/tile_map'], function () {
    

    game = new Game();
    game.init(); // create canvas, get contexts

    game.addListener(document, "keydown");
    game.addListener(document, "keyup");

    // add some sprites to the render the background, ideally we load one image and share that resource among all copies 
    // of a given type of background element
    plant = new Sprite({
        x: 76,
        y: 60,
        width: 16,
        height: 16,
        collidable: true,
        image: 'images/sprites/environment/grasses/grasses.gif'
    });
    plant.scaleX = 1;
    plant.scaleY = 1;

    plant2 = new Sprite({
        x: 60,
        y: 60,
        width: 16,
        height: 16,
        collidable: true,
        showBounds: false,
        boundsColor: "red",
        image: 'images/sprites/environment/grasses/grasses.gif'
    });
    plant2.sx = 32;
    plant2.scaleX = 1;
    plant2.scaleY = 1;

    plant3 = new Sprite({
        x: 160,
        y: 160,
        width: 16,
        height: 16,
        collidable: true,
        showBounds: false,
        boundsColor: "red",
        image: 'images/sprites/environment/grasses/grasses.gif'
    });
    plant3.sx = 64;

    plant4 = new Sprite({
        x: 280,
        y: 280,
        width: 16,
        height: 16,
        collidable: true,
        showBounds: false,
        boundsColor: "red",
        image: 'images/sprites/environment/grasses/grasses.gif'
    });
    plant4.sx = 0;

    game.displayList.add(plant);
    game.displayList.add(plant2);
    game.displayList.add(plant3);
    game.displayList.add(plant4);

    game.renderBackground();

    tiles = new TileMap({
        image: 'images/sprites/environment/grasses/grasses.gif'
    });
    
    tiles.preload();
    tiles.map = [
    {x:0, y:0, width: 16, height: 16, offsetX: 0, offsetY: 0},
    {x:8, y:0, width: 16, height: 16, offsetX: 0, offsetY: 0},
    {x:16, y:0, width: 16, height: 16, offsetX: 0, offsetY: 0},
    {x:0, y:8, width: 16, height: 16, offsetX: 16, offsetY: 0},
    {x:0, y:16, width: 16, height: 16, offsetX: 16, offsetY: 0},
    {x:8, y:8, width: 16, height: 16, offsetX: 32, offsetY: 0}];

    //hero = new Character();
    // generate a character (link)
    hero = new Character({
        image: 'images/sprites/link/link_run_all_sm.png',
        height: 50,
        width: 34,
        x: 0,
        y: 0,
        showBounds: false,
        boundsColor: "green",
        collidable: true,
        collidesWith: game.displayList
    });
    hero.scaleY = 1;
    hero.scaleX = 1;

    game.addObserver(hero, "keydown", "handleKeypress");
    game.addObserver(hero, "keyup", "handleComplete");
    
    // displayList is the foreground
    game.displayList.add(hero);
    game.render();

});
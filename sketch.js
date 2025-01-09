    let spriteImage, tileImg;
    let showMessage1 = false;
    let showMessage2 = false;
    let showMessage3 = false;
    let showMessage4 = false;
    let obj1, obj2, obj3, obj4;
    let spriteDetective;
    let level1Called = false;
    let level2Called = false;
    let level3Called = false;
    let level4Called = false;
    let level5Called = false;
    let player, bricks;
    let room, room2, room3, room4;
    let LODGER;
    let JMH;
    let test;
    let pendu;
    let tileWidth = 32;

    let ROWS = 40;
    let COLS = 20;

    let ROWS1 = 27;
    let COLS1 = 12;

    let ROWS2 = 28;
    let COLS2 = 20;

    let ROWS3 = 29;
    let COLS3 = 20;

    let ROWS4 = 40;
    let COLS4 = 20;


    let gameState = "splash"
    let overlayDisplayed = false;
    let mySound;
    let volumeSlider;
    let win;
    let map = [
        "################   ########",
        "#    # ##              ####",
        "#                      ####",
        "#                      ####",
        "#                         #",
        "                           ",
        "p                         w",
        "                           ",
        "#                         #",
        "#   ######1###         ## #",
        "#   ##########         ## #",
        "##################    #####"
    ];

    let map2 = [
        "############################",
        "#                           ",
        "# ####################      ",
        "# #                  #      ",
        "# #     ######       #      ",
        "# #     ######       #      ",
        "# #     ######       #####  ",
        "# #                      #  ",
        "# #             ###      #  ",
        "###     ######  ###      #  ",
        "###     ######  2##       #  ",
        "#       ######           #  ",
        "#       ######       #####  ",
        "                     #      ",
        "p    ###       ###   #      ",
        "     ###       ###   #      ",
        "#    ###       ###   #      ",
        "#                    #      ",
        "#                    #      ",
        "##############  w#####      "
    ];

    let map3 = [
        "#############################",
        "#   ##    ##     #######    #",
        "### ##    ##     3######    #",
        "# #                       ###",
        "# #                       ###",
        "# #                       ###",
        "# #    ####               ###",
        "# #    #### ##            ###",
        "# #    #### ##            ###",
        "###    ####               ###",
        "#     #####               ###",
        "#     ##### ##              #",
        "#      #### ##               ",
        "       ####                 w",
        "p                            ",
        "                        ### #",
        "#                       ### #",
        "#########  ##           ### #",
        "#########  ##               #",
        "############################"
    ];

    let map4 = [
        "########################################",
        "############   ####  #######       ##  #",
        "############   ####  #######       ##  #",
        "###            ####        #     #     #",
        "###                    ##  #     #     #",
        "###  ####              ##  #     #     #",
        "#    ####                        #     #",
        "#                                      #",
        "#                                      #",
        "#       ##                 #############",
        "#       ##                           4##",
        "#                               #    ###",
        "                              ###      #",
        "p           ####                #      #",
        "            ####                       #",
        "#                                  ### #",
        "#                                  ### #",
        "####   #######      #######        ### #",
        "####   #######      #######            #",
        "############### w ######################"
    ];
    let map5 = [
        "########################################",
        "#                                      #",
        "#                                      #",
        "#                                      #",
        "#                                      #",
        "#                                      #",
        "########################################",
        "                                       #",
        "                                       #",
        "p                                      w",
        "                                       #",
        "                                       #",
        "                                       #",
        "########################################",
        "#                                      #",
        "#                                      #",
        "#                                      #",
        "#                                      #",
        "#                                      #",
        "########################################"
    ];

    function preload() {
        spriteDetective = loadImage('assets/sprite_detective.png')
        spriteImage = loadImage("assets/new_sprite_3.png");
        tileImg = loadImage("assets/tile.png");
        room = loadImage("assets/bg-level-1.png");
        room2 = loadImage("assets/bg-level-2.png");
        room3 = loadImage("assets/bg-level-3.png");
        room4 = loadImage("assets/bg-level-4.png");
        room5 = loadImage("assets/bg-level-5.png");
        JMH = loadFont('assets/JMH Typewriter.ttf');
        LODGER = loadFont('assets/JollyLodger-Regular.ttf');
        mySound = loadSound('assets/bgmusique.mp3');
        obj1 = loadImage('assets/indice2alpha0.png');
        obj2 = loadImage('assets/indice2alpha0.png');
        obj3 = loadImage('assets/indice2alpha0.png');
        obj4 = loadImage('assets/indice2alpha0.png');
        test = loadImage('assets/pc.png');
        win = loadImage('assets/tile.png');

        imgIndice1 = loadImage('assets/indice1.png');
        imgIndice2 = loadImage('assets/indice2.png');
        imgIndice3 = loadImage('assets/indice3.png');
        imgIndice4 = loadImage('assets/indice4.png');

        pendu = loadImage('assets/Pendu.png');
    }

    function setup() {
        createCanvas(ROWS * tileWidth, COLS * tileWidth);
        rectMode(CENTER);
        textAlign(CENTER);
        imageMode(CENTER);

        mySound.loop();

        volumeSlider = createSlider(0, 1, 0.5, 0.01);
        volumeSlider.position(width / 2 - 25, height / 2);
        volumeSlider.style('width', '300px');
        volumeSlider.input(() => {
            mySound.setVolume(volumeSlider.value());
        });

        volumeSlider.hide();

    }

    function draw() {
        clear();
        if (gameState !== "settings") {
            volumeSlider.hide();
        }

        if (gameState === "splash") {
            splash();
        } else if (gameState === "settings") {
            settings();
        } else if (gameState === "win") {
            clearSprites();
            winScreen();
        } else if (gameState === "level1") {
            if (!level1Called) {
                level1();
                level1Called = true;
            }
            if (indice1.alpha === 0 && collided(player.pos.x, player.pos.y, player.w, player.h, wintile.pos.x, wintile.pos.y, wintile.w, wintile.h)) {
                gameState = "win";
            }
          
            image(room, width / 2, height / 2, width, height);
            player.update(); // Mettre à jour la position du joueur
            player.draw(); // Dessiner le joueur
            if (showMessage1) {
                image(imgIndice1, width / 2, height / 2);
            }
            if (dist(player.pos.x, player.pos.y, indice1.pos.x, indice1.pos.y) < 2 && showMessage1 ===false && indice1.alpha !== 0) {
                fill(38,38,38);
                rect(width/2 - 100, height/2 +150 - 25, 250, 50);
                fill(255);
                textAlign(CENTER, CENTER);
                textSize(12);
                text("Appuyer sur 'e' pour fouiller", width/2 - 100, height/2 +120);
              }
            keyPressed();
            keyReleased();
        } else if (gameState === "level2") {
            if (!level2Called) {
                level2();
                level2Called = true;
            }
            if (indice2.alpha === 0 && collided(player.pos.x, player.pos.y, player.w, player.h, wintile.pos.x, wintile.pos.y, wintile.w, wintile.h)) {
                gameState = "win";
            }
          
            image(room2, width / 2, height / 2, width, height);
            bricks.draw(); 
            player.draw();
            if (showMessage2) {
                image(imgIndice2, width / 2, height / 2);

            }
            if (dist(player.pos.x, player.pos.y, indice2.pos.x, indice2.pos.y) < 2 && showMessage2 === false && indice2.alpha !== 0) {
                fill(38,38,38);
                rect(width/2 + 50, height/2 - 50 - 25, 250, 50);
                fill(255);
                textAlign(CENTER, CENTER);
                textSize(12);
                text("Appuyer sur 'e' pour fouiller", width/2 - 100, height/2 +120);
              }
            keyPressed();
            keyReleased();
        } else if (gameState === "level3") {
            if (!level3Called) {
                level3();
                level3Called = true;
            }
            if (indice3.alpha === 0 && collided(player.pos.x, player.pos.y, player.w, player.h, wintile.pos.x, wintile.pos.y, wintile.w, wintile.h)) {
                gameState = "win";
            }
        
            image(room3, width / 2, height / 2, width, height);
            player.update(); // Mettre à jour la position du joueur
            bricks.draw(); // Dessiner les briques
            player.draw(); // Dessiner le joueur
            if (showMessage3) {
                image(imgIndice3, width / 2, height / 2);
            }
            if (dist(player.pos.x, player.pos.y, indice3.pos.x, indice3.pos.y) < 2 && showMessage3 ===false && indice3.alpha !== 0) {
                fill(38,38,38);
                rect(width/2 - 100, height/2 +150 - 25, 250, 50);
                fill(255);
                textAlign(CENTER, CENTER);
                textSize(12);
                text("Appuyer sur 'e' pour fouiller", width/2 - 100, height/2 +120);
              }
            keyPressed();
            keyReleased();
        } else if (gameState === "level4") {
            if (!level4Called) {
                level4();
                level4Called = true;
            }
            if (indice4.alpha === 0 && collided(player.pos.x, player.pos.y, player.w, player.h, wintile.pos.x, wintile.pos.y, wintile.w, wintile.h)) {
                gameState = "win";
            }
            if (dist(player.pos.x, player.pos.y, indice4.pos.x, indice4.pos.y) < 2 && showMessage4 ===false && indice4.alpha !== 0) {
                fill(38,38,38);
                rect(width/2 - 100, height/2 +150 - 25, 250, 50);
                fill(255);
                textAlign(CENTER, CENTER);
                textSize(12);
                text("Appuyer sur 'e' pour fouiller", width/2 - 100, height/2 +120);
              }
          
            image(room4, width / 2, height / 2, width, height);
            player.update(); // Mettre à jour la position du joueur
            bricks.draw(); // Dessiner les briques
            player.draw(); // Dessiner le joueur
            if (showMessage4) {
                image(imgIndice4, width / 2, height / 2);


            }
            keyPressed();
            keyReleased();
        } 
        else if (gameState === "level5") {
            if (!level5Called) {
                level5();
                level5Called = true;
            }
            // Dessiner l'image de fond en premier
            image(room5, width / 2, height / 2, width, height);
            player.update(); // Mettre à jour la position du joueur
            bricks.draw(); // Dessiner les briques
            player.draw(); // Dessiner le joueur
            keyPressed();
            keyReleased();
            if (collided(player.pos.x, player.pos.y, player.w, player.h, wintile.pos.x, wintile.pos.y, wintile.w, wintile.h)) {
                gameState = "Fin";
            }
        } else if (gameState === "Fin") {
            end();
        } else if (gameState === "credits") {
            credits(); // Afficher les crédits
        }

        function mouseDragged() {
            mySound.setVolume(volumeSlider.value());
        }


        function settings() {
            background(0);
            fill(255);
            noStroke();
            textAlign(CENTER, CENTER);
            textFont(JMH);
            textSize(20);
            text("Musique :", width / 2 - 20, height / 2 - 70);



            fill(255);
            noStroke();
            textAlign(CENTER, CENTER);
            textFont(JMH);
            textSize(20);
            text(parseInt(volumeSlider.value() * 100) + "%", width / 2 + 55, height / 2 - 70);

            fill(255);
            textFont(LODGER);
            textSize(80);
            text("Options", width / 2, 120);
            fill(89, 135, 126);
            rect(width / 2, height / 2 + 200, 300, 55, 5);
            fill(255);
            textFont(JMH);
            textSize(30);
            text("Menu", width / 2, height / 2 + 210);
            if (mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 173 && mouseY <= height / 2 + 229 && mouseIsPressed == true) {
                gameState = "splash"
                console.log("kakou kakou");
            }
            if (mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 173 && mouseY <= height / 2 + 229) {
                fill("white");
                rect(width / 2, height / 2 + 200, 300, 55, 5);
                fill(89, 135, 126);
                textFont(JMH);
                textSize(30);
                text("Menu", width / 2, height / 2 + 210);
            }
            volumeSlider.show();
        }

        function credits() {
            background(0);
            fill(255);
            textFont(LODGER);
            textSize(80);
            text("Credits   ", width / 2, 120);
            fill(89, 135, 126);
            rect(width / 2, height / 2 + 200, 300, 55, 5);
            fill(255);
            textFont(JMH);
            textSize(30);
            text("Menu", width / 2, height / 2 + 210);
            if (mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 173 && mouseY <= height / 2 + 229 && mouseIsPressed == true) {
                gameState = "splash"
                console.log("kakou kakou");
            }
            if (mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 173 && mouseY <= height / 2 + 229) {
                fill("white");
                rect(width / 2, height / 2 + 200, 300, 55, 5);
                fill(89, 135, 126);
                textFont(JMH);
                textSize(30);
                text("Menu", width / 2, height / 2 + 210);
            }

        }

        function clearSprites() {
            for (let i = allSprites.length; i--;) {
                allSprites[i].remove();
            }
        }

        function level1() {
            resizeCanvas(ROWS1 * tileWidth, COLS1 * tileWidth);
            clear();
        
            allSprites.pixelPerfect = true;
            allSprites.rotationLock = true;
            allSprites.tileSize = tileWidth;
            bricks = new Group();
            bricks.img = tileImg;
            bricks.tile = "#";
            bricks.collider = 'static';
            bricks.alpha = 0
        
            indice1 = new Sprite(8, 8, 1, 1);
            indice1.img = obj1;
            indice1.tile = '1';
            indice1.collider = "static";
            indice1.scale = 1;
            indice1.alpha = 255;
        
            wintile = new Sprite(1, 1, 1, 1);
            wintile.img = win;
            wintile.tile = 'w';
            wintile.collider = "static";
        
            indice2 = new Sprite(-10, -10, 1, 1);
            indice3 = new Sprite(-10, -10, 1, 1);
            indice4 = new Sprite(-10, -10, 1, 1);
        
            player = new Sprite(0, 0, 1, 1);
            player.spriteSheet = spriteImage;
            player.tile = "p";
            player.vel = {
                x: 0,
                y: 0
            };
            player.removeColliders();
            player.addCollider(0, 0, 2, 2);
            player.addAnis({
                stand: {
                    w: 2,
                    h: 2,
                    row: 0,
                    frames: 4,
                    frameDelay: 20
                },
                down: {
                    w: 2,
                    h: 2,
                    row: 1,
                    frames: 4,
                    frameDelay: 20
                },
                right: {
                    w: 2,
                    h: 2,
                    row: 2,
                    frames: 4,
                    frameDelay: 20
                },
                up: {
                    w: 2,
                    h: 2,
                    row: 3,
                    frames: 4,
                    frameDelay: 20
                },
                left: {
                    w: 2,
                    h: 2,
                    row: 4,
                    frames: 4,
                    frameDelay: 20
                },
            });
            player.changeAni("stand");
            player.scale = 1;
            // player.debug = true;
        
            for (let j = 0; j < map.length; j++) {
                for (let i = 0; i < map[j].length; i++) {
                    if (map[j][i] === '1') {
                        indice1.pos.set(i , j);
                    } else if (map[j][i] === 'w') {
                        wintile.pos.set(i , j);
                    }
                }
            }
        
            new Tiles(map, 0.5, 0.5, 1, 1);
        }
        

        function level2() {
            resizeCanvas(ROWS2 * tileWidth, COLS2 * tileWidth);
            allSprites.pixelPerfect = true;
            allSprites.rotationLock = true;
            allSprites.tileSize = tileWidth;
            bricks = new Group();
            bricks.img = tileImg;
            bricks.tile = "#";
            bricks.collider = 'static';
            bricks.alpha = 0;
            

            indice2 = new Sprite(8, 8, 1, 1); // Ajouter cette ligne pour définir 
            indice2.img = obj2;
            indice2.tile = '2';
            indice2.collider = "static";
            indice2.alpha = 255;




            wintile = new Sprite(1, 1, 1, 1);
            wintile.img = win;
            wintile.tile = 'w';
            wintile.collider = "static";


            player = new Sprite(1, 1, 1, 1);
            player.spriteSheet = spriteImage;
            player.tile = "p";
            player.vel = {
                x: 0,
                y: 0
            };
            player.removeColliders();
            player.addCollider(0, 0, 2, 2);
            player.addAnis({
                stand: {
                    w: 2,
                    h: 2,
                    row: 0,
                    frames: 4,
                    frameDelay: 20
                },
                down: {
                    w: 2,
                    h: 2,
                    row: 1,
                    frames: 4,
                    frameDelay: 20
                },
                right: {
                    w: 2,
                    h: 2,
                    row: 2,
                    frames: 4,
                    frameDelay: 20
                },
                up: {
                    w: 2,
                    h: 2,
                    row: 3,
                    frames: 4,
                    frameDelay: 20
                },
                left: {
                    w: 2,
                    h: 2,
                    row: 4,
                    frames: 4,
                    frameDelay: 20
                },
            });
            player.changeAni("stand");
            player.scale = 1;
            // player.debug = true;
            new Tiles(map2, 0.5, 0.5, 1, 1);
        }

        function level3() {
            resizeCanvas(ROWS3 * tileWidth, COLS3 * tileWidth);
            allSprites.pixelPerfect = true;
            allSprites.rotationLock = true;
            allSprites.tileSize = tileWidth;
            bricks = new Group();
            bricks.img = tileImg;
            bricks.tile = "#";
            bricks.collider = 'static';
            bricks.alpha = 0

            indice3 = new Sprite(8, 8, 1, 1); // Ajouter cette ligne pour définir 
            indice3.img = obj3;
            indice3.tile = '3';
            indice3.collider = "static";
            indice3.alpha = 255;

            wintile = new Sprite(1, 1, 1, 1);
            wintile.img = win;
            wintile.tile = 'w';
            wintile.collider = "static";

            player = new Sprite(1, 1, 1, 1);
            player.spriteSheet = spriteImage;
            player.tile = "p";
            player.vel = {
                x: 0,
                y: 0
            };
            player.removeColliders();
            player.addCollider(0, 0, 2, 2);
            player.addAnis({
                stand: {
                    w: 2,
                    h: 2,
                    row: 0,
                    frames: 4,
                    frameDelay: 20
                },
                down: {
                    w: 2,
                    h: 2,
                    row: 1,
                    frames: 4,
                    frameDelay: 20
                },
                right: {
                    w: 2,
                    h: 2,
                    row: 2,
                    frames: 4,
                    frameDelay: 20
                },
                up: {
                    w: 2,
                    h: 2,
                    row: 3,
                    frames: 4,
                    frameDelay: 20
                },
                left: {
                    w: 2,
                    h: 2,
                    row: 4,
                    frames: 4,
                    frameDelay: 20
                },
            });
            player.changeAni("stand");
            player.scale = 1;
            // player.debug = true;
            new Tiles(map3, 0.5, 0.5, 1, 1);
        }

        function level4() {
            resizeCanvas(ROWS4 * tileWidth, COLS4 * tileWidth);
            allSprites.pixelPerfect = true;
            allSprites.rotationLock = true;
            allSprites.tileSize = tileWidth;
            bricks = new Group();
            bricks.img = tileImg;
            bricks.tile = "#";
            bricks.collider = 'static';
            bricks.alpha = 0


            indice4 = new Sprite(8, 8, 1, 1); // Ajouter cette ligne pour définir 
            indice4.img = obj3;
            indice4.tile = '4';
            indice4.collider = "static";
            indice4.alpha = 255;

            wintile = new Sprite(1, 1, 1, 1);
            wintile.img = win;
            wintile.tile = 'w';
            wintile.collider = "static";

            player = new Sprite(1, 1, 1, 1);
            player.spriteSheet = spriteImage;
            player.tile = "p";
            player.vel = {
                x: 0,
                y: 0
            };
            player.removeColliders();
            player.addCollider(0, 0, 2, 2);
            player.addAnis({
                stand: {
                    w: 2,
                    h: 2,
                    row: 0,
                    frames: 4,
                    frameDelay: 20
                },
                down: {
                    w: 2,
                    h: 2,
                    row: 1,
                    frames: 4,
                    frameDelay: 20
                },
                right: {
                    w: 2,
                    h: 2,
                    row: 2,
                    frames: 4,
                    frameDelay: 20
                },
                up: {
                    w: 2,
                    h: 2,
                    row: 3,
                    frames: 4,
                    frameDelay: 20
                },
                left: {
                    w: 2,
                    h: 2,
                    row: 4,
                    frames: 4,
                    frameDelay: 20
                },
            });
            player.changeAni("stand");
            player.scale = 1;
            // player.debug = true;
            new Tiles(map4, 0.5, 0.5, 1, 1);
        }
        function level5() {
            resizeCanvas(ROWS4 * tileWidth, COLS4 * tileWidth);
            allSprites.pixelPerfect = true;
            allSprites.rotationLock = true;
            allSprites.tileSize = tileWidth;
            bricks = new Group();
            bricks.img = tileImg;
            bricks.tile = "#";
            bricks.collider = 'static';
            bricks.alpha = 0


            wintile = new Sprite(1, 1, 1, 1);
            wintile.img = win;
            wintile.tile = 'w';
            wintile.collider = "static";

            player = new Sprite(1, 1, 1, 1);
            player.spriteSheet = spriteImage;
            player.tile = "p";
            player.vel = {
                x: 0,
                y: 0
            };
            player.removeColliders();
            player.addCollider(0, 0, 2, 2);
            player.addAnis({
                stand: {
                    w: 2,
                    h: 2,
                    row: 0,
                    frames: 4,
                    frameDelay: 20
                },
                down: {
                    w: 2,
                    h: 2,
                    row: 1,
                    frames: 4,
                    frameDelay: 20
                },
                right: {
                    w: 2,
                    h: 2,
                    row: 2,
                    frames: 4,
                    frameDelay: 20
                },
                up: {
                    w: 2,
                    h: 2,
                    row: 3,
                    frames: 4,
                    frameDelay: 20
                },
                left: {
                    w: 2,
                    h: 2,
                    row: 4,
                    frames: 4,
                    frameDelay: 20
                },
            });
            player.changeAni("stand");
            player.scale = 1;
            // player.debug = true;
            new Tiles(map5, 0.5, 0.5, 1, 1);
        }

        function end() {
            resizeCanvas(ROWS4 * tileWidth, COLS4 * tileWidth);
            image(pendu, width/2, height/2);
        }


        function splash() {
            resizeCanvas(ROWS * tileWidth, COLS * tileWidth);
            clear();

            background(38, 38, 38);
            fill(255);
            textFont(LODGER);
            textSize(80);
            text("Carlton's Stories", width / 2, 120);
            fill(89, 135, 126);
            fill(255);
            textFont(JMH);
            textSize(20);
            text("BY STUDIO NAME", width / 2, 160);
            fill(89, 135, 126);
            rect(width / 2, height / 2 + 40, 300, 55, 5);
            fill(255);
            textFont(JMH);
            textSize(30);
            text("Click to start", width / 2, height / 2 + 50);
            if (mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 10 && mouseY <= height / 2 + 65 && mouseIsPressed == true) {
                gameState = "level1";
            }
            if (mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 10 && mouseY <= height / 2 + 65) {
                fill("white");
                rect(width / 2, height / 2 + 40, 300, 55, 5);
                fill(89, 135, 126);
                textFont(JMH);
                textSize(30);
                text("Click to start", width / 2, height / 2 + 50);
            }
            fill("white");
            rect(width / 2 - 77.5, height / 2 + 105, 145, 55, 5);
            fill(89, 135, 126);
            textFont(JMH);
            textSize(30);
            text("Options", width / 2 - 77.5, height / 2 + 110);
            if (mouseX >= width / 2 - 150 && mouseX <= width / 2 - 5 && mouseY >= height / 2 + 80 && mouseY <= height / 2 + 130 && mouseIsPressed == true) {
                console.log("kakou kakou")
                gameState = "settings";
            }
            if (mouseX >= width / 2 - 150 && mouseX <= width / 2 - 5 && mouseY >= height / 2 + 80 && mouseY <= height / 2 + 130) {
                fill(89, 135, 126);
                rect(width / 2 - 77.5, height / 2 + 105, 145, 55, 5);
                fill('white');
                textFont(JMH);
                textSize(30);
                text("Options", width / 2 - 77.5, height / 2 + 110);
            }
            fill("white");
            rect(width / 2 + 77.5, height / 2 + 105, 145, 55, 5);
            fill(89, 135, 126);
            textFont(JMH);
            textSize(30);
            text("Credits", width / 2 + 77.5, height / 2 + 110);
            if (mouseX >= width / 2 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 80 && mouseY <= height / 2 + 130 && mouseIsPressed == true) {
                gameState = "credits";
            }
            if (mouseX >= width / 2 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 80 && mouseY <= height / 2 + 130) {
                fill(89, 135, 126);
                rect(width / 2 + 77.5, height / 2 + 105, 145, 55, 5);
                fill('white');
                textFont(JMH);
                textSize(30);
                text("Credits", width / 2 + 77.5, height / 2 + 110);
            }
        }

        function winScreen() {
            resizeCanvas(ROWS * tileWidth, COLS * tileWidth);
            background(0);
            fill(255);
            noStroke();
            textAlign(CENTER, CENTER);
            textFont(JMH);
            textSize(20);
            text("Good Job !", width / 2, height / 2);

            fill(255);
            textFont(LODGER);
            textSize(80);
            text("Go to the next room", width / 2, 120);
            fill(89, 135, 126);
            rect(width / 2, height / 2 + 200, 300, 55, 5);
            fill(255);
            textFont(JMH);
            textSize(30);
            text("Next room", width / 2, height / 2 + 195);

            // Vérifier si le joueur a déjà terminé le niveau 1 et s'il a cliqué sur le bouton "Next level"
            if (gameState === "win" && indice1.alpha === 0 && mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 173 && mouseY <= height / 2 + 229 && mouseIsPressed) {
                gameState = "level2";
                level2Called = false; // Réinitialiser la variable level2Called pour permettre de charger le niveau 2
            }

            // Vérifier si le joueur a déjà terminé le niveau 2 et s'il a cliqué sur le bouton "Next level"
            if (gameState === "win" && indice1.alpha === 255 && indice2.alpha === 0 && mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 173 && mouseY <= height / 2 + 229 && mouseIsPressed) {
                gameState = "level3";
                level3Called = false; // Réinitialiser la variable level3Called pour permettre de charger le niveau 3
            }
            if (gameState === "win" && indice2.alpha === 255 && indice3.alpha === 0 && mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 173 && mouseY <= height / 2 + 229 && mouseIsPressed) {
                gameState = "level4";
                level3Called = false; // Réinitialiser la variable level3Called pour permettre de charger le niveau 3
            }
            if (gameState === "win" && indice3.alpha === 255 && indice4.alpha === 0 && mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 173 && mouseY <= height / 2 + 229 && mouseIsPressed) {
                gameState = "level5";
                level3Called = false; // Réinitialiser la variable level3Called pour permettre de charger le niveau 3
            }

            // Vérifier si la souris est survolée sur le bouton "Next level"
            if (mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 && mouseY >= height / 2 + 173 && mouseY <= height / 2 + 229) {
                fill("white");
                rect(width / 2, height / 2 + 200, 300, 55, 5);
                fill(89, 135, 126);
                textFont(JMH);
                textSize(30);
                text("Next room", width / 2, height / 2 + 195);
            }
        }



        function keyReleased() {
            if (keyCode === ESCAPE && showMessage1 === true) {
                showMessage1 = false;
                console.log();
            }
            if (keyCode === ESCAPE && showMessage2) {
                showMessage2 = false;
            }
            if (keyCode === ESCAPE && showMessage3) {
                showMessage3 = false;
            }
            if (keyCode === ESCAPE && showMessage4) {
                showMessage4 = false;
            }
        }

        function keyPressed() {
            if (key === 'e') {
                if (!showMessage1 && indice1.alpha !== 0 && player.pos.dist(indice1.pos) < 3) {
                    indice1.remove();
                    indice1.alpha = 0;
                    showMessage1 = true;
                }
                if (!showMessage2 && indice2.alpha !== 0 && player.pos.dist(indice2.pos) < 3) {
                    indice2.remove();
                    indice2.alpha = 0;
                    indice1.alpha = 255;
                    showMessage2 = true;
                }
                if (!showMessage3 && indice3.alpha !== 0 && player.pos.dist(indice3.pos) < 5) {
                    indice3.remove();
                    indice3.alpha = 0;
                    indice2.alpha = 255;
                    showMessage3 = true;
                }
                if (!showMessage4 && indice4.alpha !== 0 && player.pos.dist(indice4.pos) < 3) {
                    indice4.remove();
                    indice4.alpha = 0;
                    indice3.alpha = 255;
                    showMessage4 = true;
                }

            }
            if (keyIsDown(RIGHT_ARROW)) {
                player.changeAni("right");
                player.vel.x = 0.1;
                player.vel.y = 0;
            }
            if (keyIsDown(LEFT_ARROW)) {
                player.changeAni("left");
                player.vel.x = -0.1;
                player.vel.y = 0;
            }
            if (keyIsDown(UP_ARROW)) {
                player.changeAni("up");
                player.vel.y = -0.1;
                player.vel.x = 0;
            }
            if (keyIsDown(DOWN_ARROW)) {
                player.changeAni("down");
                player.vel.y = 0.1;
                player.vel.x = 0;
            }
            if (!keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)) {
                player.vel.x = 0;
            }
            if (!keyIsDown(UP_ARROW) && !keyIsDown(DOWN_ARROW)) {
                player.vel.y = 0;
            }
        }

        function collided(x1, y1, w1, h1, x2, y2, w2, h2) {
            return (x1 < x2 + w2 &&
                x1 + w1 > x2 &&
                y1 < y2 + h2 &&
                y1 + h1 > y2);
        }

        function isOpen(x, y) {
            let i = floor(x);
            let j = floor(y);
            let tile = map[j][i];
            if (tile == "#") {
                return false;
            } else {
                return true;
            }
        }

    }

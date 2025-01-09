/****************************************************
 * CONSTANTES, SALLES, VARIABLES GLOBALES
 ****************************************************/
const TILE_WIDTH = 32;
const ROWS = 40;
const COLS = 20;
const TOTALTIME = 90;

/**
 * 5 salles de jeu (maps), chacune a :
 *  - rows, cols
 *  - map (tableau de strings)
 *
 *  Dans la map :
 *    '#' = mur
 *    'p' = position initiale (par défaut)
 *    '1','2','3','4','5', etc. = portes-chiffres pour aller vers d'autres salles
 */
const LEVELS = [
  {
    rows: 27,
    cols: 12,
    map: [
      // Niveau 1 (index = 0)
      "###########################",
      "#    # ##              ####",
      "#                      ####",
      "#                      ####",
      "#                         #",
      "                          2",
      " p                        2",
      "                          2",
      "#                         #",
      "#   ##########         ## #",
      "#   ##########         ## #",
      "###########################"
    ]
  },
  {
    rows: 28,
    cols: 20,
    map: [
      // Niveau 2 (index = 1)
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
      "###     ######  ###       #  ",
      "#       ######           #  ",
      "#       ######       #####  ",
      "1                    #      ",
      "1 p  ###       ###   #      ",
      "1    ###       ###   #      ",
      "#    ###       ###   #      ",
      "#                    #      ",
      "#                    #      ",
      "##############333#####      "
    ]
  },
  {
    rows: 29,
    cols: 20,
    map: [
      // Niveau 3 (index = 2)
      "#############################",
      "#   ##    ##     #######    #",
      "### ##    ##     #######    #",
      "# #                       ###",
      "# #                       ###",
      "# #                       ###",
      "# #    ####               ###",
      "# #    #### ##            ###",
      "# #    #### ##            ###",
      "###    ####               ###",
      "#     #####               ###",
      "#     ##### ##              #",
      "#      #### ##              4",
      "2      ####                 4",
      "2        p                  4",
      "2                       ### #",
      "#                       ### #",
      "#########  ##           ### #",
      "#########  ##               #",
      "############################"
    ]
  },
  {
    rows: 40,
    cols: 20,
    map: [
      // Niveau 4 (index = 3)
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
      "#       ##                           ###",
      "#                               #    ###",
      "3                             ###      #",
      "3 p         ####                #      #",
      "3           ####                       #",
      "#                                  ### #",
      "#                                  ### #",
      "####   #######      #######        ### #",
      "####   #######      #######            #",
      "################555#####################"
    ]
  },
  {
    rows: 40,
    cols: 20,
    map: [
      // Niveau 5 (index = 4)
      "########################################",
      "#                                      #",
      "#                                      #",
      "#                                      #",
      "#                                      #",
      "#                                      #",
      "########################################",
      "4                                      #",
      "4                                      #",
      "4 p                                    #",
      "4                                      #",
      "4                                      #",
      "4                                      #",
      "########################################",
      "#                                      #",
      "#                                      #",
      "#                                      #",
      "#                                      #",
      "#                                      #",
      "########################################"
    ]
  }
];

/**
 * Pour chaque niveau (0..4), on associe un objet
 * qui détermine pour chaque caractère-chiffre (porte)
 * le "levelIndex" cible (to) et la position de spawn (spawnX, spawnY).
 *
 * Ex. doorData[1]["3"] = { to: 2, spawnX: 2, spawnY: 14 }
 * signifie : depuis le niveauIndex=1, si on touche la porte '3',
 * on va au niveauIndex=2 et on spawn en (2,14).
 */
const doorData = [
  /* 0 = level1 */
  {
    "2": { to: 1 }
    // aucun '1', '3', etc. ici (pas présents dans la map)
  },
  /* 1 = level2 */
  {
    "1": { to: 0 },
    "3": { to: 2 }
  },
  /* 2 = level3 */
  {
    "2": { to: 1 },
    "4": { to: 3 }
  },
  /* 3 = level4 */
  {
    "3": { to: 2 },
    "5": { to: 4 }
  },
  /* 4 = level5 */
  {
    // on peut boucler, ou rester sur place, ou aller ailleurs
    // ici on décide que '4' renvoie au level4
    "4": { to: 3 }
  }
];

// Variables globales
let spriteImage, tileImg;
let player, bricks;
let roomImages = [];
let LODGER, JMH, mySound, volumeSlider, win;
let gameState = "splash";

// Index du niveau courant (0..4)
let currentLevelIndex = -1;

// Coordonnées de spawn pour la prochaine salle
let nextSpawnX = -1;
let nextSpawnY = -1;

// AJOUT CHRONO : variables du chronomètre
let timer = TOTALTIME;            // temps restant en secondes
let timerIsRunning = false; // indique si le chrono est en cours


/****************************************************
 * PRELOAD
 ****************************************************/
function preload() {
  spriteImage = loadImage("assets/new_sprite_3.png");
  tileImg = loadImage("assets/tile.png");

  // Chargement des 5 images de fond
  for (let i = 1; i <= 5; i++) {
    // Notez l'usage des backticks ou la concaténation
    roomImages.push(loadImage(`assets/bg-level-${i}.png`));
  }

  // Polices et musique
  JMH = loadFont("assets/JMH Typewriter.ttf");
  LODGER = loadFont("assets/JollyLodger-Regular.ttf");
  mySound = loadSound("assets/bgmusique.mp3");

  // Optionnel : image de "win"
  win = loadImage("assets/tile.png");
}


/****************************************************
 * SETUP
 ****************************************************/
function setup() {
    createCanvas(ROWS * TILE_WIDTH, COLS * TILE_WIDTH);
    rectMode(CENTER);
    textAlign(CENTER);
    imageMode(CENTER);

    document.body.style.backgroundColor = "black";

    // Musique
    mySound.loop();

    volumeSlider = createSlider(0, 1, 0.5, 0.01);
    volumeSlider.position(width / 2 - 25, height / 2);
    volumeSlider.style('width', '300px');
    volumeSlider.input(() => {
        mySound.setVolume(volumeSlider.value());
    });
    volumeSlider.hide();
}


/****************************************************
 * DRAW
 ****************************************************/
function draw() {
  clear();

  if (gameState !== "settings") {
    volumeSlider.hide();
  }

  switch (gameState) {
    case "splash":
      splash();
      break;
    case "settings":
      settings();
      break;
    case "credits":
      credits();
      break;
    case "win":
      clearSprites();
      winScreen();
      break;

    // AJOUT CHRONO : nouvel écran de game over
    case "gameover":
      gameOver();
      break;

    default:
      // Si l'état commence par "level", ex. "level1", "level2"...
      if (gameState.startsWith("level")) {
        let levelIndex = parseInt(gameState.replace("level", "")) - 1;
        if (currentLevelIndex !== levelIndex) {
          loadLevel(levelIndex);
          currentLevelIndex = levelIndex;
        }
        playLevel(levelIndex);
      }
      break;
  }

  // AJOUT CHRONO : gestion du décompte quand on est en train de jouer
  if (gameState.startsWith("level") && timerIsRunning) {
    // deltaTime est en millisecondes, on convertit en secondes
    timer -= deltaTime / 1000;

    // Si le timer atteint 0 ou moins, on déclenche un game over
    if (timer <= 0) {
      timer = 0;
      timerIsRunning = false;
      gameState = "gameover";
    }
  }
}


/****************************************************
 * FONCTIONS DE GESTION DES NIVEAUX
 ****************************************************/
function loadLevel(levelIndex) {
  clearSprites();

  let level = LEVELS[levelIndex];
  resizeCanvas(level.rows * TILE_WIDTH, level.cols * TILE_WIDTH);

  // p5play : paramétrages
  allSprites.pixelPerfect = true;
  allSprites.rotationLock = true;
  allSprites.tileSize = TILE_WIDTH;

  // Créer le player
  player = new Sprite(0, 0, 1, 1);
  player.spriteSheet = spriteImage;

  // Ajout d'animations
  player.addAnis({
    stand: { row: 0, frames: 4, frameDelay: 20, w:2, h:2 },
    down:  { row: 1, frames: 4, frameDelay: 20, w:2, h:2 },
    right: { row: 2, frames: 4, frameDelay: 20, w:2, h:2 },
    up:    { row: 3, frames: 4, frameDelay: 20, w:2, h:2 },
    left:  { row: 4, frames: 4, frameDelay: 20, w:2, h:2 },
  });
  player.changeAni("stand");
  player.scale = 1;
  player.removeColliders();
  player.addCollider(0, 0, 2, 2);

  // Groupe bricks (murs)
  bricks = new Group();
  bricks.tile = "#";
  bricks.img = tileImg;
  bricks.collider = "static";
  bricks.alpha = 255;

  // Position par défaut à 'p'
  let mapData = level.map;
  let placedDefault = false;

  for (let y = 0; y < mapData.length; y++) {
    for (let x = 0; x < mapData[y].length; x++) {
      let cell = mapData[y][x];

      if (cell === "#") {
        new bricks.Sprite(x, y, 1, 1);
      }
      else if (cell === "p" && !placedDefault) {
        player.pos.set(x, y);
        placedDefault = true;
      }
      // Portes (chiffres)
      else if ("123456789".includes(cell)) {
        let doorSprite = new Sprite(x, y, 1, 1);
        doorSprite.collider = "static";
        doorSprite.label = cell;  // ex. '2'
        doorSprite.color = color(0, 0, 0, 0); // fully transparent
        doorSprite.strokeWeight = 0; // à commenter pour voir les blocks de porte
      }
    }
  }

  // Si on a défini nextSpawnX/Y (>=0), on place le joueur
  if (nextSpawnX >= 0 && nextSpawnY >= 0) {
    player.pos.set(nextSpawnX, nextSpawnY);
    nextSpawnX = -1;
    nextSpawnY = -1;
  }
}

function playLevel(levelIndex) {
  image(roomImages[levelIndex], width / 2, height / 2, width, height);

  player.update();
  bricks.draw();
  keyPressed();

  // AJOUT CHRONO : affichage du chrono à l'écran
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  textFont(JMH);
  text("Timer: " + Math.ceil(timer) + "s", 10, 10);

  // Récupérer tous les sprites de portes (chiffres 1..9)
  let doorSprites = allSprites.filter(s => "123456789".includes(s.label));
  for (let door of doorSprites) {
    if (player.overlaps(door)) {
      let digit = door.label;  // ex. '2'
      let doorInfo = doorData[levelIndex][digit];
      if (doorInfo) {
        let targetIndex = doorInfo.to;
        nextSpawnX = doorInfo.spawnX;
        nextSpawnY = doorInfo.spawnY;

        if (targetIndex < 0 || targetIndex >= LEVELS.length) {
          // aucune salle cible => on va à "win"
          gameState = "win";
        } else {
          // On va vers la salle "levelX"
          gameState = "level" + (targetIndex + 1);
        }
      }
      break;
    }
  }
}


/****************************************************
 * FONCTIONS D'ÉTATS (SPLASH, SETTINGS, CREDITS, WIN, GAMEOVER)
 ****************************************************/
function splash() {
  resizeCanvas(ROWS * TILE_WIDTH, COLS * TILE_WIDTH);
  clear();

  background(38, 38, 38);
  fill(255);
  textFont(LODGER);
  textSize(80);
  text("Carlton's Stories", width / 2, 120);

  fill(255);
  textFont(JMH);
  textSize(20);
  text("BY STUDIO NAME", width / 2, 160);

  // Bouton "Click to start"
  fill(89, 135, 126);
  rect(width / 2, height / 2 + 40, 300, 55, 5);
  fill(255);
  textFont(JMH);
  textSize(30);
  text("Click to start", width / 2, height / 2 + 50);

  if (
    mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 &&
    mouseY >= height / 2 + 10 && mouseY <= height / 2 + 65 &&
    mouseIsPressed
  ) {
    // AJOUT CHRONO : on lance le chronomètre
    timer = TOTALTIME;           // réinitialise à 60s
    timerIsRunning = true; 
    gameState = "level1";
  }

  // Bouton "Options"
  fill("white");
  rect(width / 2 - 77.5, height / 2 + 105, 145, 55, 5);
  fill(89, 135, 126);
  textFont(JMH);
  textSize(30);
  text("Options", width / 2 - 77.5, height / 2 + 110);

  if (
    mouseX >= width / 2 - 150 &&
    mouseX <= width / 2 - 5 &&
    mouseY >= height / 2 + 80 &&
    mouseY <= height / 2 + 130 &&
    mouseIsPressed
  ) {
    gameState = "settings";
  }

  // Bouton "Credits"
  fill("white");
  rect(width / 2 + 77.5, height / 2 + 105, 145, 55, 5);
  fill(89, 135, 126);
  textFont(JMH);
  textSize(30);
  text("Credits", width / 2 + 77.5, height / 2 + 110);

  if (
    mouseX >= width / 2 &&
    mouseX <= width / 2 + 150 &&
    mouseY >= height / 2 + 80 &&
    mouseY <= height / 2 + 130 &&
    mouseIsPressed
  ) {
    gameState = "credits";
  }
}

function settings() {
  background(0);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont(JMH);
  textSize(20);

  text("Musique :", width / 2 - 20, height / 2 - 70);
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

  if (
    mouseX >= width / 2 - 150 &&
    mouseX <= width / 2 + 150 &&
    mouseY >= height / 2 + 173 &&
    mouseY <= height / 2 + 229 &&
    mouseIsPressed
  ) {
    gameState = "splash";
  }
  volumeSlider.show();
}

function credits() {
  background(0);
  fill(255);
  textFont(LODGER);
  textSize(80);
  text("Credits", width / 2, 120);

  fill(89, 135, 126);
  rect(width / 2, height / 2 + 200, 300, 55, 5);
  fill(255);
  textFont(JMH);
  textSize(30);
  text("Menu", width / 2, height / 2 + 210);

  if (
    mouseX >= width / 2 - 150 &&
    mouseX <= width / 2 + 150 &&
    mouseY >= height / 2 + 173 &&
    mouseY <= height / 2 + 229 &&
    mouseIsPressed
  ) {
    gameState = "splash";
  }
}

function winScreen() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  textFont(JMH);
  text("Bravo, vous avez terminé !", width / 2, height / 2);
}

// AJOUT CHRONO : Écran "Game Over"
function gameOver() {
    resizeCanvas(ROWS * TILE_WIDTH, COLS * TILE_WIDTH);
    clear();
    clearSprites();

    background(38, 38, 38);
    fill(255);
    textFont(LODGER);
    textSize(80);
    text("Game Over", width / 2, 120);

    fill(255);
    textFont(JMH);
    textSize(20);
    text("Le temps est écoulé !", width / 2, 160);

    // Bouton "Menu"
    fill(89, 135, 126);
    rect(width / 2, height / 2 + 40, 300, 55, 5);
    fill(255);
    textFont(JMH);
    textSize(30);
    text("Menu", width / 2, height / 2 + 50);

    if (
        mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 &&
        mouseY >= height / 2 + 10 && mouseY <= height / 2 + 65 &&
        mouseIsPressed
    ) {
        gameState = "splash";
    }
}


/****************************************************
 * FONCTIONS UTILES
 ****************************************************/
function clearSprites() {
  for (let i = allSprites.length - 1; i >= 0; i--) {
    allSprites[i].remove();
  }
}

function keyPressed() {
  player.vel.x = 0;
  player.vel.y = 0;

  if (keyIsDown(RIGHT_ARROW)) {
    player.changeAni("right");
    player.vel.x = 0.1;
  }
  else if (keyIsDown(LEFT_ARROW)) {
    player.changeAni("left");
    player.vel.x = -0.1;
  }
  else if (keyIsDown(UP_ARROW)) {
    player.changeAni("up");
    player.vel.y = -0.1;
  }
  else if (keyIsDown(DOWN_ARROW)) {
    player.changeAni("down");
    player.vel.y = 0.1;
  }
  else {
    player.changeAni("stand");
  }
}

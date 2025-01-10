/**********************
 * VARIABLES GLOBALES *
 **********************/

let spriteImage, tileImg;
let showMessage1 = false;
let obj1;
let spriteDetective;
let level1Called = false;
let player, bricks;
let room;
let LODGER;
let JMH;
let tileWidth = 32;

// Pour l'écran de splash
let ROWS = 40;   
let COLS = 20;   

// Dimensions du niveau 1
let ROWS1 = 24; 
let COLS1 = 16;

// Canvas (p5.js)
let canvasWidth = 480;    
let canvasHeight = 320;   
let cnv;

// États du jeu
let gameState = "splash";
let mySound;
let volumeSlider;

// La map du niveau 1
let map = [
  "#######################",
  "#                     #",
  "#                     #",
  "#                     #",
  "#                     #",
  "#                     #",
  "#            p        #",
  "#                     #",
  "#                     #",
  "#                     #",
  "#                     #",
  "#                     #",
  "#                     #",
  "#                     #",
  "#######################",
];

let indice1;
let imgIndice1;
let win;

// --------------------
//  Image pour remplacer la fenêtre
// --------------------
let windowsxp; 

// --------------------
//  Fenêtre (auparavant « carré blanc »)
// --------------------

// Largeur/hauteur fixes : 192×144
let whiteSquareW = 384; 
let whiteSquareH = 288;

// Coordonnées du centre de la « fenêtre »
let whiteSquareX, whiteSquareY;

// Affichage ou non de la fenêtre
let showWhiteSquare = false;

// Carré rouge dans le coin sup-gauche de la fenêtre
let redSquare = { w: 50, h: 50 };

// --------------------
//  Carrés gris (optionnels)
// --------------------
let squares = [];
let squareSize = 30;
let draggedSquareIndex = -1; 
let offsetX = 0;
let offsetY = 0;

// --------------------
//  Carrés verts (déplaçables)
// --------------------
let greenSquares = [];
let draggedGreenIndex = -1; 


/***********************
 *   FONCTION CENTRER  *
 ***********************/
function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

/**
 * Centre la « fenêtre » dans le canvas
 */
function centerWhiteSquare() {
  whiteSquareX = width / 2;
  whiteSquareY = height / 2;
}

/***********************
 *      PRELOAD()      *
 ***********************/
function preload() {
  spriteDetective = loadImage('assets/sprite_detective.png');
  spriteImage     = loadImage("assets/MAPS/perso.png");
  tileImg         = loadImage("assets/tile.png");
  room            = loadImage("assets/MAPS/Chambre.png");
  
  windowsxp       = loadImage("assets/MAPS/windowsxp.png"); 

  JMH     = loadFont('assets/JMH Typewriter.ttf');
  LODGER  = loadFont('assets/JollyLodger-Regular.ttf');
  mySound = loadSound('assets/bgmusique.mp3');

  obj1       = loadImage('assets/indice2alpha0.png');
  imgIndice1 = loadImage('assets/indice1.png');
  win        = loadImage('assets/tile.png');
}

/***********************
 *       SETUP()       *
 ***********************/
function setup() {
  cnv = createCanvas(ROWS * tileWidth, COLS * tileWidth);
  centerCanvas();
  centerWhiteSquare();

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

  // On crée 16 carrés verts pour la fenêtre
  initGreenSquares();
}

/***********************
 * INIT GREEN SQUARES  *
 ***********************/
function initGreenSquares() {
  greenSquares = []; 

  let rows = 4;
  let cols = 4;

  // Taille du slot (chaque case 4×4 à l’intérieur de la « fenêtre »)
  let cellSlotW = whiteSquareW / cols;
  let cellSlotH = whiteSquareH / rows;
  
  // On fait des carrés verts à la moitié du slot
  let cellW = cellSlotW / 2; 
  let cellH = cellSlotH / 2;

  // On crée 16 carrés verts, centrés dans chaque slot
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let slotCenterX = (whiteSquareX - whiteSquareW / 2) + c * cellSlotW + cellSlotW / 2;
      let slotCenterY = (whiteSquareY - whiteSquareH / 2) + r * cellSlotH + cellSlotH / 2;

      let sq = {
        x: slotCenterX,
        y: slotCenterY,
        w: cellW,
        h: cellH,
        color: 'green'
      };
      greenSquares.push(sq);
    }
  }
}

/***********************
 *  WINDOW RESIZED     *
 ***********************/
function windowResized() {
  centerCanvas();
  centerWhiteSquare();
  initGreenSquares();
}

/***********************
 *        DRAW()       *
 ***********************/
function draw() {
  clear();

  if (gameState === "splash") {
    splash();
  } 
  else if (gameState === "settings") {
    settings();
  } 
  else if (gameState === "credits") {
    credits();
  } 
  else if (gameState === "level1") {
    if (!level1Called) {
      level1();
      level1Called = true;
    }

    imageMode(CORNER);
    image(room, 0, 0, width, height);

    player.update();
    player.draw();

    if (showMessage1) {
      image(imgIndice1, width / 2, height / 2);
    }

    drawInteractiveElements();
  }

  // Affiche la "fenêtre" (image 192×144) si demandé
  if (showWhiteSquare) {
    drawWhiteSquare();
  }
}

/***********************
 *   ÉCRANS SECONDAIRES
 ***********************/
function splash() {
  resizeCanvas(ROWS * tileWidth, COLS * tileWidth);
  centerCanvas();
  centerWhiteSquare();

  initGreenSquares();

  clear();
  background(38, 38, 38);

  fill(255);
  textFont(LODGER);
  textSize(80);
  text("Carlton's Stories", width / 2, 120);

  fill(89, 135, 126);
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

  if (mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 &&
      mouseY >= height / 2 + 10 && mouseY <= height / 2 + 65 && mouseIsPressed) {
    gameState = "level1";
  }
  if (mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150 &&
      mouseY >= height / 2 + 10 && mouseY <= height / 2 + 65) {
    fill("white");
    rect(width / 2, height / 2 + 40, 300, 55, 5);
    fill(89, 135, 126);
    text("Click to start", width / 2, height / 2 + 50);
  }
}

function settings() {
  background(50);
  fill(255);
  textSize(32);
  text("Settings Screen", width / 2, height / 2);
}

function credits() {
  background(90);
  fill(255);
  textSize(32);
  text("Credits Screen", width / 2, height / 2);
}

/***********************
 *     LEVEL1 CODE     *
 ***********************/
function level1() {
  resizeCanvas(ROWS1 * tileWidth, COLS1 * tileWidth);
  centerCanvas();
  centerWhiteSquare();
  initGreenSquares();

  clear();
  allSprites.pixelPerfect = true;
  allSprites.rotationLock = true;
  allSprites.tileSize = tileWidth;
  
  bricks = new Group();
  bricks.img = tileImg;
  bricks.tile = "#";
  bricks.collider = 'static';
  bricks.debug = true;
    
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
  
  player = new Sprite(0, 0, 1, 1);
  player.spriteSheet = spriteImage;
  player.tile = "p";
  player.vel = { x: 0, y: 0 };
  player.removeColliders();
  player.addCollider(0, 0, 2, 2);
  
  player.addAnis({
    stand: { w: 2, h: 2, row: 0, frames: 4, frameDelay: 20 },
    down:  { w: 2, h: 2, row: 1, frames: 4, frameDelay: 20 },
    right: { w: 2, h: 2, row: 2, frames: 4, frameDelay: 20 },
    up:    { w: 2, h: 2, row: 3, frames: 4, frameDelay: 20 },
    left:  { w: 2, h: 2, row: 4, frames: 4, frameDelay: 20 },
  });
  player.changeAni("stand");
  player.scale = 1;
  
  // Parcourt la map
  for (let j = 0; j < map.length; j++) {
    for (let i = 0; i < map[j].length; i++) {
      if (map[j][i] === '1') {
        indice1.pos.set(i, j);
      } else if (map[j][i] === 'w') {
        wintile.pos.set(i, j);
      } else if (map[j][i] === 'p') {
        player.pos.set(i, j);
      }
    }
  }
  
  // Tu peux ajuster l'offset si besoin (0,0,1,1) ou (1,1,1,1)
  new Tiles(map, 1, 1, 1, 1);
}

/**
 * Dessine les éléments interactifs (texte, etc.) en jeu
 */
function drawInteractiveElements() {
  if (indice1 && dist(player.pos.x, player.pos.y, indice1.pos.x, indice1.pos.y) < 2) {
    fill(255);
    textAlign(CENTER);
    text("Appuyez sur 'E' pour interagir", width / 2, height - 50);
  }
}

/***********************
 *  DESSIN DE LA « FENÊTRE »
 ***********************/
function drawWhiteSquare() {
  // On remplace le grand rectangle blanc par l'image "windowsxp"
  imageMode(CENTER);
  image(windowsxp, whiteSquareX, whiteSquareY, whiteSquareW, whiteSquareH);

  // Carré rouge (coin supérieur gauche)
  rectMode(CORNER);
fill(0, 0, 0, 0);
  rect(
    whiteSquareX - whiteSquareW / 2,  
    whiteSquareY - whiteSquareH / 2,  
    redSquare.w,
    redSquare.h
  );
  rectMode(CENTER);

  // Dessin des carrés verts
  for (let g of greenSquares) {
    fill(g.color);
    rect(g.x, g.y, g.w, g.h);
  }

  // Dessin des carrés gris
  for (let s of squares) {
    fill(s.color || 'grey');
    rect(s.x, s.y, s.w, s.h);
  }

  // Bouton "close"
  drawCloseButton();
}

/**
 * Dessine le bouton "close" (X)
 */
function drawCloseButton() {
  rectMode(CORNER);

  let closeBtn = { x: 0, y: 0, w: 20, h: 20 };
  closeBtn.x = (whiteSquareX + whiteSquareW / 2) - closeBtn.w;
  closeBtn.y = (whiteSquareY - whiteSquareH / 2);

  fill(200, 60, 60);
  rect(closeBtn.x, closeBtn.y, closeBtn.w, closeBtn.h);

  stroke(255);
  strokeWeight(2);
  line(closeBtn.x + 5, closeBtn.y + 5, closeBtn.x + closeBtn.w - 5, closeBtn.y + closeBtn.h - 5);
  line(closeBtn.x + 5, closeBtn.y + closeBtn.h - 5, closeBtn.x + closeBtn.w - 5, closeBtn.y + 5);
  noStroke();

  if (
    mouseIsPressed &&
    mouseX >= closeBtn.x && mouseX <= closeBtn.x + closeBtn.w &&
    mouseY >= closeBtn.y && mouseY <= closeBtn.y + closeBtn.h
  ) {
    showWhiteSquare = false;
  }

  rectMode(CENTER);
}

/***********************
 * ÉVÉNEMENTS SOURIS   *
 ***********************/
function mousePressed() {
  if (showWhiteSquare) {
    // Test drag & drop sur carrés gris
    for (let i = squares.length - 1; i >= 0; i--) {
      let s = squares[i];
      let left   = s.x - s.w / 2;
      let right  = s.x + s.w / 2;
      let top    = s.y - s.h / 2;
      let bottom = s.y + s.h / 2;

      if (mouseX > left && mouseX < right && mouseY > top && mouseY < bottom) {
        draggedSquareIndex = i;
        offsetX = mouseX - s.x;
        offsetY = mouseY - s.y;
        return;
      }
    }

    // Test drag & drop sur carrés verts
    for (let i = greenSquares.length - 1; i >= 0; i--) {
      let g = greenSquares[i];
      let left   = g.x - g.w / 2;
      let right  = g.x + g.w / 2;
      let top    = g.y - g.h / 2;
      let bottom = g.y + g.h / 2;

      if (mouseX > left && mouseX < right && mouseY > top && mouseY < bottom) {
        draggedGreenIndex = i;
        offsetX = mouseX - g.x;
        offsetY = mouseY - g.y;
        return;
      }
    }
  }
}

function mouseDragged() {
  if (draggedSquareIndex !== -1) {
    let s = squares[draggedSquareIndex];
    s.x = mouseX - offsetX;
    s.y = mouseY - offsetY;
  }
  else if (draggedGreenIndex !== -1) {
    let g = greenSquares[draggedGreenIndex];
    g.x = mouseX - offsetX;
    g.y = mouseY - offsetY;
  }
}

function mouseReleased() {
  if (draggedSquareIndex !== -1) {
    draggedSquareIndex = -1;
  }

  if (draggedGreenIndex !== -1) {
    let g = greenSquares[draggedGreenIndex];
    if (isOverlappingRectCorner(g)) {
      greenSquares.splice(draggedGreenIndex, 1);
    }
    draggedGreenIndex = -1;
  }
}

/***********************
 * ÉVÉNEMENTS CLAVIER  *
 ***********************/
function keyPressed() {
  if (player && player.vel) {
    if (keyIsDown(RIGHT_ARROW)) {
      player.changeAni("right");
      player.vel.x = 0.2;
      player.vel.y = 0;
    }
    if (keyIsDown(LEFT_ARROW)) {
      player.changeAni("left");
      player.vel.x = -0.2;
      player.vel.y = 0;
    }
    if (keyIsDown(UP_ARROW)) {
      player.changeAni("up");
      player.vel.x = 0;
      player.vel.y = -0.2;
    }
    if (keyIsDown(DOWN_ARROW)) {
      player.changeAni("down");
      player.vel.x = 0;
      player.vel.y = 0.2;
    }

    // Interaction : 'E'
    if (key === 'e' || key === 'E') {
      showWhiteSquare = true;
    }
  }
}

function keyReleased() {
  if (player) {
    player.vel.x = 0;
    player.vel.y = 0;
    player.changeAni("stand");
  }
}

/***********************
 *     COLLISIONS      *
 ***********************/
/**
 * Vérifie si un carré (vert) centré (g.x, g.y, g.w, g.h)
 * chevauche le carré rouge (mode CORNER).
 */
function isOverlappingRectCorner(greenSq) {
  let sqLeft   = greenSq.x - greenSq.w / 2;
  let sqRight  = greenSq.x + greenSq.w / 2;
  let sqTop    = greenSq.y - greenSq.h / 2;
  let sqBottom = greenSq.y + greenSq.h / 2;

  let redLeft   = whiteSquareX - whiteSquareW / 2;
  let redTop    = whiteSquareY - whiteSquareH / 2;
  let redRight  = redLeft + redSquare.w;
  let redBottom = redTop + redSquare.h;

  if (sqRight < redLeft || sqLeft > redRight || sqBottom < redTop || sqTop > redBottom) {
    return false;
  }
  return true;
}

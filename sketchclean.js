//------------------------------------------------------
// Variables globales
//------------------------------------------------------

// Indique si le grand carré blanc (et ses petits carrés) est affiché
let showWhiteSquare = false;

// Tableau pour stocker tous les petits carrés (gris ou verts)
let squares = [];            
let squareSize = 30;         // Taille de chaque petit carré

// Indice du carré qu'on est en train de déplacer (-1 = aucun)
let draggedSquareIndex = -1; 
let offsetX = 0;             // Décalage souris/carré (axe X) lorsqu'on le déplace
let offsetY = 0;             // Décalage souris/carré (axe Y) lorsqu'on le déplace

// Coordonnées et dimensions du grand carré blanc
let whiteSquareSize = 200;
let whiteSquareX, whiteSquareY;

// Carré rouge : si un petit carré (gris ou vert) est "déposé" dessus, il disparaît
let redSquare = {
  x: 0,
  y: 0,
  w: 50,
  h: 50,
};

// Pour gérer l'ajout automatique d'un carré vert toutes les 10 secondes
let lastGreenSpawn = 0;      // Temps (en millisecondes) de la dernière apparition d'un carré vert
let spawnInterval = 10000;   // 10 secondes = 10 000 ms

// Propriétés du bouton de fermeture (petite croix)
let closeBtn = {
  x: 0,
  y: 0,
  w: 20,
  h: 20
};

function setup() {
  createCanvas(600, 400);
  
  // Calcul du coin supérieur gauche du grand carré blanc
  whiteSquareX = (width - whiteSquareSize) / 2;
  whiteSquareY = (height - whiteSquareSize) / 2;

  // Position du carré rouge DANS le grand carré blanc (avec une marge)
  let margin = 15;
  redSquare.x = whiteSquareX + margin;
  redSquare.y = whiteSquareY + margin;

  // On prépare 9 petits carrés GRIS (3×3) au centre du carré blanc.
  let n = 3;         // 3 carrés par ligne/colonne
  let space = 15;    // Espacement entre les carrés gris
  let zoneSize = (n * squareSize) + (n - 1) * space; 
  let offset = zoneSize / 2; 
  let startX = width / 2 - offset;
  let startY = height / 2 - offset;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let x = startX + i * (squareSize + space);
      let y = startY + j * (squareSize + space);
      squares.push({
        x: x,
        y: y,
        w: squareSize,
        h: squareSize,
        color: color(100) // gris
      });
    }
  }
}

function draw() {
  background(220);
  
  // Si on a activé l'affichage (en appuyant sur E), on dessine tout
  if (showWhiteSquare) {
    // Grand carré blanc
    noStroke();
    fill(255);
    rect(whiteSquareX, whiteSquareY, whiteSquareSize, whiteSquareSize);
    
    // Carré rouge
    fill('red');
    rect(redSquare.x, redSquare.y, redSquare.w, redSquare.h);

    // 1) Ajout d'un carré vert toutes les 10 secondes
    if (millis() - lastGreenSpawn >= spawnInterval) {
      // On calcule une position aléatoire à l'intérieur du carré blanc
      let rx = random(whiteSquareX, whiteSquareX + whiteSquareSize - squareSize);
      let ry = random(whiteSquareY, whiteSquareY + whiteSquareSize - squareSize);

      squares.push({
        x: rx,
        y: ry,
        w: squareSize,
        h: squareSize,
        color: color('green')
      });
      
      // On met à jour le dernier moment d'apparition
      lastGreenSpawn = millis();
    }

    // 2) Dessin de chaque petit carré (gris ou vert)
    for (let i = 0; i < squares.length; i++) {
      fill(squares[i].color);
      rect(squares[i].x, squares[i].y, squares[i].w, squares[i].h);
    }

    // 3) Gérer le "drag & drop"
    if (draggedSquareIndex !== -1) {
      let s = squares[draggedSquareIndex];
      s.x = mouseX - offsetX;
      s.y = mouseY - offsetY;
    }

    // 4) Dessiner la croix de fermeture en haut à droite du carré blanc
    drawCloseButton();
  }
}

//------------------------------------------------------
// Dessine un petit bouton "X" (croix) en haut à droite
//------------------------------------------------------
function drawCloseButton() {
  // On place la croix dans le coin supérieur droit du carré blanc
  closeBtn.x = whiteSquareX + whiteSquareSize - closeBtn.w;
  closeBtn.y = whiteSquareY;
  
  // Fond du bouton (petit carré)
  fill(200, 60, 60); // rougeâtre
  rect(closeBtn.x, closeBtn.y, closeBtn.w, closeBtn.h);

  // On dessine 2 lignes blanches en X
  stroke(255);
  strokeWeight(2);
  // Diagonale \
  line(closeBtn.x + 5, closeBtn.y + 5, closeBtn.x + closeBtn.w - 5, closeBtn.y + closeBtn.h - 5);
  // Diagonale /
  line(closeBtn.x + 5, closeBtn.y + closeBtn.h - 5, closeBtn.x + closeBtn.w - 5, closeBtn.y + 5);

  // On remet le style comme avant
  noStroke();
  strokeWeight(1);
}

//------------------------------------------------------
// Gère la pression d'une touche
//------------------------------------------------------
function keyPressed() {
  // Touche "E" (ou "e") => on bascule l'affichage (showWhiteSquare)
  if (key === 'e' || key === 'E') {
    showWhiteSquare = !showWhiteSquare;  
  }
}

//------------------------------------------------------
// Gestion du clic de la souris
//------------------------------------------------------
function mousePressed() {
  // On ne clique sur un carré que s'il est affiché
  if (showWhiteSquare) {
    // 1) Vérifier si on a cliqué sur le bouton "Close"
    if (isInside(mouseX, mouseY, closeBtn)) {
      showWhiteSquare = false;
      return; // On sort immédiatement pour éviter de sélectionner un carré
    }

    // 2) Sinon, on vérifie si on a cliqué sur un petit carré
    for (let i = squares.length - 1; i >= 0; i--) {
      let s = squares[i];
      if (
        mouseX > s.x &&
        mouseX < s.x + s.w &&
        mouseY > s.y &&
        mouseY < s.y + s.h
      ) {
        // On commence à "drag" ce carré
        draggedSquareIndex = i;
        offsetX = mouseX - s.x;
        offsetY = mouseY - s.y;
        // On interrompt la boucle pour ne pas sélectionner plusieurs carrés
        break;
      }
    }
  }
}

//------------------------------------------------------
// Quand on relâche la souris, on arrête de “drag” le carré
//------------------------------------------------------
function mouseReleased() {
  // Si on était bien en train de déplacer un carré
  if (draggedSquareIndex !== -1) {
    let s = squares[draggedSquareIndex];
    
    // À la fin du drag, on vérifie si le carré chevauche le carré rouge
    if (isOverlapping(s, redSquare)) {
      // On enlève ce carré du tableau => il disparaît
      squares.splice(draggedSquareIndex, 1);
    }

    // On arrête le "drag"
    draggedSquareIndex = -1;
  }
}

//------------------------------------------------------
// Vérifie si deux rectangles se chevauchent
//------------------------------------------------------
function isOverlapping(sq, target) {
  return !(
    sq.x + sq.w < target.x ||
    sq.x > target.x + target.w ||
    sq.y + sq.h < target.y ||
    sq.y > target.y + target.h
  );
}

//------------------------------------------------------
// Vérifie si (mx, my) est dans la zone d'un rectangle rectObj
//------------------------------------------------------
function isInside(mx, my, rectObj) {
  return (
    mx >= rectObj.x &&
    mx <= rectObj.x + rectObj.w &&
    my >= rectObj.y &&
    my <= rectObj.y + rectObj.h
  );
}

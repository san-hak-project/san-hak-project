let game = new Phaser.Game(800, 600, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update,
});

let box, obstacle, obstacleAlive, player, keyMove;
let obstacleArray = [];
let obstacleCount = Math.floor(Math.random() * 5 + 2);

function preload() {
  game.load.image("bg", "assets/images/sea.jpg");
  game.load.image("box", "assets/images/box.png");
  game.load.image("obstacle", "assets/images/Shark.png");
  game.load.image("player", "assets/images/player.png");
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = "#2196F3";
  game.add.image(0, 0, "bg");
  box = game.add.group();
  box2 = game.add.group();
  box.enableBody = true;
  box2.enableBody = true;

  for (let i = 0; i < 16; i++) {
    box2.create(0, i * 40, "box").body.immovable = true;
    box.create(800, i * 40, "box").body.immovable = true;
  }

  player = game.add.sprite(10, 300, "player");
  game.physics.arcade.enable(player);

  obstacle = game.add.group();
  obstacle.enableBody = true;
  obstacle.physicsBodyType = Phaser.Physics.ARCADE;
  obstacle.createMultiple(obstacleCount, "obstacle");
  obstacle.setAll("outOfBoundsKill", true);
  obstacle.setAll("checkWorldBounds", true);

  keyMove = game.input.keyboard.createCursorKeys();
}

function update() {
  game.physics.arcade.collide(player, box);
  game.physics.arcade.collide(player, box2);
  player.body.velocity.setTo(0, 0);

  if (keyMove.left.isDown) {
    player.body.velocity.x = -150;
  } else if (keyMove.right.isDown) {
    player.body.velocity.x = +150;
  } else if (keyMove.up.isDown) {
    player.body.velocity.y = -150;
  } else if (keyMove.down.isDown) {
    player.body.velocity.y = +150;
  }

  obstacleAlive = obstacle.getFirstExists(false);
  obstacleArray.length = 0;

  box.forEachAlive((obstacleAlive) => {
    obstacleArray.push(obstacleAlive);
  });

  if (obstacleAlive && obstacleArray.length > 0) {
    let random = game.rnd.integerInRange(0, obstacleArray.length - 1);
    let obstacleBox = obstacleArray[random];

    obstacleAlive.reset(obstacleBox.body.x, obstacleBox.body.y);
    game.physics.arcade.moveToObject(obstacleAlive, player, 200); //장애물이 현재 플레이어 위치를 기준으로 날아옴
  }
}

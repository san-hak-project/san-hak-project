const fullWidth = window.innerWidth;

let game = new Phaser.Game(fullWidth, 700, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update,
});

let box, obstacle, obstacleAlive, player, keyMove;
let obstacleArray = [];
let obstacleCount = Math.floor(Math.random() * 5 + 2);
let gameStart = false;
let text, scoreText;
let score = 0;
let backgroundLoop;

// 게임을 시작하기 전 이미지 등 데이터를 미리 load
function preload() {
  //   game.load.image("bg", "assets/images/sea.jpg"); // 배경 이미지
  game.load.image("bgLoop", "assets/images/bg-loop.png"); // 배경 이미지
  game.load.image("box", "assets/images/box.png"); //
  game.load.image("obstacle", "assets/images/Shark.png"); // 장애물 이미지
  game.load.image("player", "assets/images/player.png"); // 플레이어 캐릭터
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = "#2196F3"; // 디폴트 배경 색
  //   game.add.image(0, 0, "bg"); // 왼쪽에서 0, 위에서 0 위치에 bg:배경 이미지 추가
  backgroundLoop = game.add.tileSprite(0, 0, fullWidth, 700, "bgLoop");
  box = game.add.group();
  box2 = game.add.group();
  box.enableBody = true;
  box2.enableBody = true;

  for (let i = 0; i < 16; i++) {
    box2.create(0, i * 40, "box").body.immovable = true;
    box.create(fullWidth, i * 40, "box").body.immovable = true;
  }

  player = game.add.sprite(10, 300, "player"); // 왼쪽에서 10, 위에서 300 위치에 player 추가
  game.physics.arcade.enable(player);

  obstacle = game.add.group();
  obstacle.enableBody = true;
  obstacle.physicsBodyType = Phaser.Physics.ARCADE;
  obstacle.createMultiple(obstacleCount, "obstacle"); // obstacleCount 만큼 obstacle 생성
  obstacle.setAll("outOfBoundsKill", true);
  obstacle.setAll("checkWorldBounds", true);

  keyMove = game.input.keyboard.createCursorKeys();

  text = game.add.text(game.world.centerX, game.world.centerY, "Press any key to start", {});
  text.anchor.setTo(0.5, 0.5);

  scoreText = game.add.text(game.world.centerX, 20, "", { fontSize: "15px" });
  scoreText.anchor.setTo(0.5, 0.5);
}

function update() {
  //   game.physics.arcade.collide(player, box);
  //   game.physics.arcade.collide(player, box2);
  player.body.velocity.setTo(0, 0);

  document.body.addEventListener("keypress", function (e) {
    gameStart = true;
  });

  if (keyMove.left.isDown) {
    player.body.velocity.x = -150;
    gameStart = true;
  } else if (keyMove.right.isDown) {
    player.body.velocity.x = +150;
    gameStart = true;
  } else if (keyMove.up.isDown) {
    player.body.velocity.y = -150;
    gameStart = true;
  } else if (keyMove.down.isDown) {
    player.body.velocity.y = +150;
    gameStart = true;
  }

  if (gameStart) {
    text.destroy();
    backgroundLoop.tilePosition.x -= 1;
    player.body.velocity.y = player.body.velocity.y + 20;
    player.body.velocity.x = player.body.velocity.x + 30;

    obstacleAlive = obstacle.getFirstExists(false);
    obstacleArray.length = 0;

    score += 1; // 점수가 계속 오름
    // score = parseInt(game.time.totalElapsedSeconds()); // 점수가 초마다 1씩 증가
    scoreText.setText("SCORE : " + score);

    box.forEachAlive((obstacleAlive) => {
      obstacleArray.push(obstacleAlive);
    });

    if (obstacleAlive && obstacleArray.length > 0) {
      let random = game.rnd.integerInRange(0, obstacleArray.length - 1);
      let obstacleBox = obstacleArray[random];

      obstacleAlive.reset(obstacleBox.body.x, obstacleBox.body.y);
      game.physics.arcade.moveToObject(obstacleAlive, player, 200); //장애물이 현재 플레이어 위치를 기준으로 날아옴
    }

    if (game.physics.arcade.overlap(player, obstacle)) {
      gameStart = false;
      game.state.restart();
    }
  }
}

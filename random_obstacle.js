const fullWidth = window.innerWidth;

let game = new Phaser.Game(fullWidth, 700, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update,
});

let box, obstacle, obstacleAlive, player;
let obstacleArray = [];
let obstacleCount = Math.floor(Math.random() * 2 + 2);
let gameStart = false;
let text, scoreText;
let score = 0;
let backgroundLoop;

var meter = DecibelMeter.create("meter");

meter.on("ready", function (meter, sources) {
  var mic = sources[0];
  meter.connect(mic);
});

// 게임을 시작하기 전 이미지 등 데이터를 미리 load
function preload() {
  game.load.image("bgLoop", "assets/images/bg-loop.png"); // 배경 이미지
  game.load.image("box", "assets/images/box.png"); // 박스에서 장애물 발사
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

  for (let i = 5; i < 17; i++) {
    box2.create(0, i * 40, "box").body.immovable = true;
    box.create(fullWidth, i * 40, "box").body.immovable = true;
  }

  player = game.add.sprite(350, 350, "player"); // 왼쪽에서 350, 위에서 350 위치에 player 추가
  game.physics.arcade.enable(player);

  obstacle = game.add.group();
  obstacle.enableBody = true;
  obstacle.physicsBodyType = Phaser.Physics.ARCADE;
  obstacle.createMultiple(obstacleCount, "obstacle"); // obstacleCount 만큼 obstacle 생성
  obstacle.setAll("outOfBoundsKill", true);
  obstacle.setAll("checkWorldBounds", true);

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
    meter.listen();
  });

  meter.on("sample", function (dB, percent, level) {
    if (level != 0) {
      player.body.velocity.y = -level * 2;
      gameStart = true;
    }
  });

  if (gameStart) {
    text.destroy();
    backgroundLoop.tilePosition.x -= 1;
    // player.body.velocity.y = player.body.velocity.y + 20;
    // player.body.velocity.x = player.body.velocity.x + 30;
    player.body.gravity.y = 1000; // x축 움직이는 대신 중력을 주어 떨어지게
    obstacleAlive = obstacle.getFirstExists(false);
    obstacleArray.length = 0;

    score += 1; // 점수가 계속 오름
    // score = parseInt(game.time.totalElapsedSeconds()); // 점수가 초마다 1씩 증가
    scoreText.setText("SCORE : " + score);

    box.forEachAlive((obstacleAlive) => {
      obstacleArray.push(obstacleAlive);
    }); // 장애물이 나올 위치를 박스 기준으로 세팅(우측 전체 면)

    if (obstacleAlive && obstacleArray.length > 0) {
      let random = game.rnd.integerInRange(0, obstacleArray.length - 1);
      let obstacleBox = obstacleArray[random]; //박스에서 랜덤으로 장애물 생성함

      obstacleAlive.reset(obstacleBox.body.x, obstacleBox.body.y);
      game.physics.arcade.moveToObject(obstacleAlive, player, 200); //장애물이 현재 플레이어 위치를 기준으로 날아옴
    }

    if (game.physics.arcade.overlap(player, obstacle)) {
      gameStart = false;
      game.state.restart();
    }
    if (player.y < 0 || player.y > 700) {
      gameStart = false;
      game.state.restart();
    }
  }
}

const fullWidth = window.innerWidth;

let game = new Phaser.Game(fullWidth, 700, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update,
});

let obstacle, player, box, obstacleAlive;
let obstacleArray = [];
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
  game.load.image("box", "assets/images/box.png");
  game.load.image("bgLoop", "assets/images/bg-loop2.png"); // 배경 이미지
  game.load.image("obstacle", "assets/images/tree.png"); // 장애물 이미지
  game.load.image("player", "assets/images/flying.png"); // 플레이어 캐릭터
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = "#2196F3"; // 디폴트 배경 색

  backgroundLoop = game.add.tileSprite(0, 0, fullWidth, 700, "bgLoop");
  player = game.add.sprite(10, 300, "player"); // 왼쪽에서 350, 위에서 300 위치에 player 추가
  game.physics.arcade.enable(player);

  box = game.add.group(); //장애물 생성 위치
  box.enableBody = true;

  for (let i = 0; i < 50; i += 3) {
    box.create(i * 40, 450, "box").body.immovable = true;
  }

  obstacle = game.add.group();
  obstacle.enableBody = true;
  obstacle.physicsBodyType = Phaser.Physics.ARCADE;
  obstacle.createMultiple(10, "obstacle");
  obstacle.setAll("outOfBoundsKill", true);
  obstacle.setAll("checkWorldBounds", true);

  text = game.add.text(game.world.centerX, game.world.centerY, "Press any key to start", {});
  text.anchor.setTo(0.5, 0.5);

  scoreText = game.add.text(game.world.centerX, 20, "", { fontSize: "15px" });
  scoreText.anchor.setTo(0.5, 0.5);
}

function update() {
  player.body.velocity.setTo(0, 0);

  document.body.addEventListener("keypress", function (e) {
    gameStart = true;
    meter.listen();
  });

  meter.on("sample", function (dB, percent, level) {
    if (level != 0) {
      player.body.velocity.y = -level * 5;
      gameStart = true;
    }
  });

  if (gameStart) {
    text.destroy();
    player.body.velocity.y = player.body.velocity.y + 20;
    player.body.velocity.x = player.body.velocity.x + 10;
    backgroundLoop.tilePosition.x -= 1;
    obstacleAlive = obstacle.getFirstExists(false);
    obstacleArray.length = 0;

    score += 1; // 점수가 계속 오름

    scoreText.setText("SCORE : " + score);
    box.forEachAlive((obstacleAlive) => {
      obstacleArray.push(obstacleAlive);
    }); // 장애물이 나올 위치를 박스 기준으로 세팅(아래면)

    if (obstacleAlive && obstacleArray.length > 0) {
      const candidate = Array(45)
        .fill()
        .map((value, index) => index + 1);
      const shuffle = [];
      while (candidate.length > 0) {
        const random = Math.floor(Math.random() * candidate.length);
        const spliceArray = candidate.splice(random, 1);
        const value = spliceArray[0];
        shuffle.push(value);
      }
      let random = game.rnd.integerInRange(0, obstacleArray.length - 1);
      let obstacleBox = obstacleArray[random];
      obstacleAlive.reset(obstacleBox.body.x, obstacleBox.body.y);
      obstacleAlive.velocity = -200; //장애물 뒤로 이동..해야되는데 안함
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

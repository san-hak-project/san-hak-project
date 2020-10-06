let box, obstacle, obstacleAlive, player;
let obstacleArray = [];
let obstacleCount = Math.floor(Math.random() * 2 + 2);
let gameStart = false;
let text, scoreText;
let score = 0;
let backgroundLoop;

// let meter = DecibelMeter.create("meter");

meter.on("ready", function (meter, sources) {
  let mic = sources[0];
  meter.connect(mic);
});

let landState = {
  // 게임을 시작하기 전 이미지 등 데이터를 미리 load
  preload: function () {
    game.load.image("bgLoop", "src/assets/images/land/bg-land.png"); // 배경 이미지
    game.load.image("box", "src/assets/images/box.png"); // 박스에서 장애물 발사
    game.load.image("obstacle", "src/assets/images/land/tree.png"); // 장애물 이미지
    game.load.image("player", "src/assets/images/land/player-land.png"); // 플레이어 캐릭터
  },

  create: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = "#2196F3"; // 디폴트 배경 색

    //   game.add.image(0, 0, "bg"); // 왼쪽에서 0, 위에서 0 위치에 bg:배경 이미지 추가

    backgroundLoop = game.add.tileSprite(0, 0, fullWidth, 700, "bgLoop");

    player = game.add.sprite(350, 350, "player"); // 왼쪽에서 350, 위에서 350 위치에 player 추가
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

    text = game.add.text(game.world.centerX, game.world.centerY, "Press any key to start", {
      font: "bold 30px maplestory",
    });
    text.anchor.setTo(0.5, 0.5);

    scoreText = game.add.text(game.world.centerX, 20, "", { font: "bold 15px maplestory" });
    scoreText.anchor.setTo(0.5, 0.5);
  },

  update: function () {
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
      }); // 장애물이 나올 위치를 박스 기준으로 세팅(아래면)

      if (obstacleAlive && obstacleArray.length > 0) {
        let random = game.rnd.integerInRange(0, obstacleArray.length - 1);
        let obstacleBox = obstacleArray[random]; // 박스가 존재하는 랜덤 위치에 장애물 생성
        obstacleAlive.reset(obstacleBox.body.x, obstacleBox.body.y);
        obstacleAlive.body.velocity.setTo(0, 0);
        //obstacleAlive.velocity.x = -200; //장애물 뒤로 이동..해야되는데 안함
      }

      if (game.physics.arcade.overlap(player, obstacle) || player.y < 0 || player.y > 700) {
        gameStart = false;
        score = 0;
        game.state.start("over");
      }
    }
  },
};

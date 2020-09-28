let overState = {
  create: function () {
    game.stage.backgroundColor = "#fff";

    let restartLabel = game.add.text(game.world.centerX, game.world.centerY - 80, "re ?", {
      font: "bold 50px maplestory",
      fill: "#000",
      cursor: "pointer",
    });

    let newStartLabel = game.add.text(game.world.centerX, game.world.centerY, "Return to menu", {
      font: "30px maplestory",
      fill: "#000",
    });

    restartLabel.anchor.setTo(0.5, 0.5);
    newStartLabel.anchor.setTo(0.5, 0.5);

    newStartLabel.inputEnabled = true;
    newStartLabel.input.useHandCursor = true;
    newStartLabel.events.onInputDown.add(this.start, this);
  },
  start: function () {
    game.state.start("menu");
  },
};

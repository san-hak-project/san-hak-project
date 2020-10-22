let menuState = {
  preload: function () {
    game.load.image("land", "src/assets/images/land/land-preview.png");
    game.load.image("sea", "src/assets/images/sea/sea-preview.png");
    game.load.image("space", "src/assets/images/space/space-preview.png");
    game.load.image("breath_check", "src/assets/images/breath_check.png");
  },

  create: function () {
    game.stage.backgroundColor = "#fff";
    const imageWidth = 280;
    const imageHeight = 200;

    let title = game.add.text(game.world.centerX, 80, "Menu", {
      font: "bold 50px maplestory",
      fill: "#000",
    });

    let description = game.add.text(game.world.centerX, 150, "Select image to Start", {
      font: "30px maplestory",
      fill: "#000",
    });
    const seaImage = game.add.sprite(
      game.world.centerX - (imageWidth + 50),
      game.world.centerY + 80,
      "sea"
    );
    const landImage = game.add.sprite(game.world.centerX, game.world.centerY + 80, "land");
    const breath_checkImage = game.add.sprite(game.world.centerX, game.world.centerY + (imageHeight+80), "breath_check");
    const spaceImage = game.add.sprite(
      game.world.centerX + (imageWidth + 50),
      game.world.centerY + 80,
      "space"
    );

    title.anchor.setTo(0.5, 0.5);
    description.anchor.setTo(0.5, 0.5);

    seaImage.width = imageWidth;
    seaImage.height = imageHeight;
    seaImage.anchor.setTo(0.5, 0.5);
    seaImage.inputEnabled = true;
    seaImage.events.onInputDown.add(this.sea, this);
    seaImage.input.useHandCursor = true;

    landImage.width = imageWidth;
    landImage.height = imageHeight;
    landImage.anchor.setTo(0.5, 0.5);
    landImage.inputEnabled = true;
    landImage.events.onInputDown.add(this.land, this);
    landImage.input.useHandCursor = true;

    spaceImage.width = imageWidth;
    spaceImage.height = imageHeight;
    spaceImage.anchor.setTo(0.5, 0.5);
    spaceImage.inputEnabled = true;
    spaceImage.events.onInputDown.add(this.space, this);
    spaceImage.input.useHandCursor = true;

    breath_checkImage.width = imageWidth;
    breath_checkImage.height = imageHeight;
    breath_checkImage.anchor.setTo(0.5, 0.5);
    breath_checkImage.inputEnabled = true;
    breath_checkImage.events.onInputDown.add(this.breath_check, this);
    breath_checkImage.input.useHandCursor = true;
  },

  sea: function () {
    game.state.start("sea");
  },
  land: function () {
    game.state.start("land");
  },
  space: function () {
    game.state.start("space");
  },
  breath_check: function () {
    game.state.start("breath_check");
  },
};

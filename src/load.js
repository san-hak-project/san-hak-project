let loadState = {
  preload: function () {
    let loadingLabel = game.add.text(game.world.centerX, game.world.centerY, "loading...", {
      font: "30px maplestory",
      fill: "#d56e24",
    });
  },

  create: function () {
    game.state.start("menu");
  },
};

const fullWidth = window.innerWidth;

let game = new Phaser.Game(fullWidth, 700, Phaser.CANVAS, null);

game.state.add("boot", bootState);
game.state.add("load", loadState);
game.state.add("menu", menuState);
game.state.add("sea", seaState);
game.state.add("land", landState);
game.state.add("space", spaceState);
game.state.add("over", overState);
game.state.add("beat", beatState);

game.state.start("boot");

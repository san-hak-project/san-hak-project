const fullWidth = window.innerWidth;

let game = new Phaser.Game(fullWidth, 700, Phaser.CANVAS, null);

game.state.add("play", playState);

game.state.start("play");

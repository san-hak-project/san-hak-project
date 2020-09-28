gameover: function () {

    if (sprite.body.y > 700) {
        game.state.start('gameover');
    }
}
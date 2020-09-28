let meter = DecibelMeter.create("meter");

let bootState = {
  create: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    meter.on("ready", function (meter, sources) {
      let mic = sources[0];

      meter.connect(mic);
    });

    meter.on("connect", () => {
      game.state.start("load");
    });

    meter.on("disconnect", () => {
      alert("Please Check your Mic");
    });
  },
};

let timerStart = false;
var timer;
var total=0;
var mic_level, mic_percent, mic_dB;
meter.on("ready", function (meter, sources) {
  let mic = sources[0];
  meter.connect(mic);
});

function updateCounter() {
	total++;
}
function stoper()
{
	if(timerStart == true)
	{
		timerStart = false;
		timer.pause();
	}
	else
	{
		timerStart = true;
		timer.resume();
	}
}

let breath_checkState = {
	preload: function () {

	},

	create: function () {
		game.stage.backgroundColor = "#fff";
		const imageWidth = 200;
		const imageHeight = 200;

		let title = game.add.text(game.world.centerX, 80, "Check for Breath", {
			font: "bold 50px maplestory",
			fill: "#000",
		});

		text = game.add.text(game.world.centerX, game.world.centerY, "Press any key to start", {
      	font: "bold 30px maplestory",
   		});
   		text.anchor.setTo(0.5, 0.5);

   		timer = game.time.create(false);

   		timer.loop(1000, updateCounter, this);

   		//game.input.onDown.add(stoper, this);

	},

	update: function () {
		/*document.body.addEventListener("keypress", function(e)
		{
			timerStart=true;
			meter.listen();
		});
		*/
		/*if(timerStart)
		{
			timer.start();
	    	text.setText('Counter: ' + total +"\nTime: " + timer.duration.toFixed(0));
		}*/
		meter.listen();

		meter.on("sample", function (dB, percent, level) {
			if(level > 30)
			{	
				if(timerStart == false)
				{
					timer.start();
					timerStart = true;

				}
				else if(timerStart == true)
				{
					timer.resume();
				}
				mic_level = level;
				mic_dB = dB;
				mic_percent = percent;
			}
			else
			{
				mic_dB =0;
				mic_level =0;
				mic_percent =0;
				timer.pause();
			}
		})
		text.setText('Counter: ' + total +"\nTime: " + timer.duration.toFixed(0) +"\ntimerStart: " + timerStart +
			"\nlevel: " + mic_level +"\npercent: " + mic_percent + "\ndB: " + mic_dB);
	},
};
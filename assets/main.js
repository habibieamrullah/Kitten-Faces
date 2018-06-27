//App Data
var appData = {
	title : "kittenfaces",
	fastest1 : 9999,
	fastest2 : 9999,
	fastest3 : 9999
};

if(localStorage.getItem(appData.title) !== null){
	appData = JSON.parse(localStorage.getItem(appData.title));
}else
	saveData();

function saveData(){
	localStorage.setItem(appData.title, JSON.stringify(appData));
}

//SCREEN VARS
var baseWidth = 960;
var screenRatio = window.innerWidth/window.innerHeight;
var gameHeight = baseWidth/screenRatio;

//PHASER VAR
var game = new Phaser.Game(baseWidth, gameHeight, Phaser.AUTO);

//GAME VARS
var ZKGame = {};
var bgmusic, sndClick, sndMatch, sndOpen, sndWin;

ZKGame.LogoIntro = {
	preload : function(){
		game.load.image("logo", "zkcs.png");
		game.load.audio("bgmusic", ["waterlily.mp3"]);
		game.load.audio("sndClick", ["click.mp3"]);
		game.load.audio("sndMatch", ["match.mp3"]);
		game.load.audio("sndOpen", ["open.mp3"]);
		game.load.audio("sndWin", ["win.mp3"]);
		game.load.bitmapFont("gameFont", 'font.png', 'font.fnt');
		game.load.bitmapFont("gameFontred", 'fontred.png', 'fontred.fnt');
	},
	create : function(){
		game.stage.backgroundColor = "#ffffff";
		game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		var zkLogo = game.add.sprite(game.world.centerX, game.world.centerY, "logo");
		zkLogo.anchor.setTo(.5, .5);
		setTimeout(function(){
			game.state.start("MainMenu");
		}, 4000);
		bgmusic = game.add.audio("bgmusic");
		bgmusic.volume = .2;
		sndClick = game.add.audio("sndClick");
		sndMatch = game.add.audio("sndMatch");
		sndOpen = game.add.audio("sndOpen");
		sndWin = game.add.audio("sndWin");
	}
}

ZKGame.MainMenu = {
	preload : function(){
		game.load.spritesheet("buttons", "buttons.png", 181, 41);
		game.load.image("bg0", "bgimage0.jpg");
		game.load.image("bg1", "bgimage1.jpg");
		game.load.image("bg2", "bgimage2.jpg");
		game.load.image("bg3", "bgimage3.jpg");
	},
	create : function(){
		bgmusic.stop();
		bgmusic.play();
		randomizeBg();
		this.btn_easy = game.add.button(game.world.centerX, (game.height / 2) - 50, "buttons", this.playEasy);
		this.btn_easy.anchor.setTo(.5);
		fadeInTween(this.btn_easy, 0);

		this.btn_medium = game.add.button(game.world.centerX, game.height / 2, "buttons", this.playMedium);
		this.btn_medium.frame = 2;
		this.btn_medium.anchor.setTo(.5);
		fadeInTween(this.btn_medium, 300);

		this.btn_hard = game.add.button(game.world.centerX, (game.height / 2) + 50, "buttons", this.playHard);
		this.btn_hard.frame = 1;
		this.btn_hard.anchor.setTo(.5);
		fadeInTween(this.btn_hard, 600);

		this.gameTitle = game.add.bitmapText(game.world.centerX, 100, "gameFont", "KittenFaces", 120);
		this.gameTitle.anchor.setTo(.5);
		this.byzk = game.add.bitmapText(game.world.centerX + 200, 160, "gameFontred", "by Zofia Kreasi", 30)
		this.byzk.anchor.setTo(.5);
	},
	playEasy : function(){
		game.state.start("PlayEasy");
	},
	playMedium : function(){
		game.state.start("PlayMedium");
	},
	playHard : function(){
		game.state.start("PlayHard");
	}
}

var currentLevel = 0;

var blank;
var pairs;
var tries;

var kitten1;
var kitten2;
var lastSelected = 999;
var lastBcnum = 0;

var clickCounter = 0;

var score = 0;

function touched(i){
	sndOpen.play();
	if(tries == 0){
		tries = 1;
		kitten1 = game.add.sprite(i.x, i.y, "kitten");
		kitten1.frame = i.id;
		fadeInTween(kitten1, 0);
		lastSelected = i.id;
		lastBcnum = i.index;
	}else if(tries == 1 && i.id != lastSelected && lastBcnum != i.index){
		tries = 2;
		lastSelected = 999;
		kitten2 = game.add.sprite(i.x, i.y, "kitten");
		kitten2.frame = i.id;
		fadeInTween(kitten2, 0);
		setTimeout(function(){
			tries = 0;
			game.world.remove(kitten1);
			game.world.remove(kitten2);
			sndClick.play();
			clickCounter += 1;
			if(clickCounter > 10){
				window.location = "showad://zk";
				clickCounter = 0;
			}
		}, 750);
	}else if(tries == 1 && i.id == lastSelected && lastBcnum != i.index){
		lastSelected = 999;
		kitten2 = game.add.sprite(i.x, i.y, "kitten");
		kitten2.frame = i.id;
		fadeInTween(kitten2, 0);
		tries = 0;
		blank[lastBcnum-1].x = -200;
		blank[i.index-1].x = -200;
		sndMatch.play();
		score += 1;
	}
}

//EASY
ZKGame.PlayEasy = {
	preload : function(){
		game.load.image("cardback", "cardback.png");
		game.load.image("back", "btn_back.png");
		game.load.spritesheet("kitten", "kitten.png", 48, 48);
	},
	create : function(){
		currentLevel = 1;
		randomizeBg();
		var bcnum = 0;
		blank = [];
		pairs = [];
		for(var i = 0; i < 8; i ++){
			pairs.push(i);
			pairs.push(i);
		}
		tries = 0;
		for(var z = 0; z < 4; z ++){
			for(var i = 0; i < 4; i++){
				var blankChild = game.add.sprite((i * 50) + ((game.width-(50*4))/2), (z * 50) + ((game.height-(50*5))/2), "cardback");
				blankChild.inputEnabled = true;
				blankChild.events.onInputDown.add(touched);
				var randPairNum = Math.floor(Math.random() * pairs.length);
				bcnum += 1;
				blankChild.index = bcnum;
				blankChild.id = pairs[randPairNum];
				pairs.splice(randPairNum, 1);
				blank.push(blankChild);
				fadeInTween(blankChild, 50 * bcnum);
			}
		}

		this.btn_back = game.add.button(10, 10, "back", toMainMenu);

		setInstructionText();
		runTimeCounter();
	}
}

//MEDIUM
ZKGame.PlayMedium = {
	preload : function(){
		game.load.image("cardback", "cardback.png");
		game.load.image("back", "btn_back.png");
		game.load.spritesheet("kitten", "kitten.png", 48, 48);
	},
	create : function(){
		currentLevel = 2;
		randomizeBg();
		var bcnum = 0;
		blank = [];
		pairs = [];
		for(var i = 0; i < 12; i ++){
			pairs.push(i);
			pairs.push(i);
		}
		tries = 0;
		for(var z = 0; z < 4; z ++){
			for(var i = 0; i < 6; i++){
				var blankChild = game.add.sprite((i * 50) + ((game.width-(50*6))/2), (z * 50) + ((game.height-(50*5))/2), "cardback");
				blankChild.inputEnabled = true;
				blankChild.events.onInputDown.add(touched);
				var randPairNum = Math.floor(Math.random() * pairs.length);
				bcnum += 1;
				blankChild.index = bcnum;
				blankChild.id = pairs[randPairNum];
				pairs.splice(randPairNum, 1);
				blank.push(blankChild);
				fadeInTween(blankChild, 50 * bcnum);
			}
		}

		this.btn_back = game.add.button(10, 10, "back", toMainMenu);

		setInstructionText();
		runTimeCounter();
	}
}

//HARD
ZKGame.PlayHard = {
	preload : function(){
		game.load.image("cardback", "cardback.png");
		game.load.image("back", "btn_back.png");
		game.load.spritesheet("kitten", "kitten.png", 48, 48);
	},
	create : function(){
		currentLevel = 3;
		randomizeBg();
		var bcnum = 0;
		blank = [];
		pairs = [];
		for(var i = 0; i < 25; i ++){
			pairs.push(i);
			pairs.push(i);
		}
		tries = 0;
		for(var z = 0; z < 5; z ++){
			for(var i = 0; i < 10; i++){
				var blankChild = game.add.sprite((i * 50) + ((game.width-(50*10))/2), (z * 50) + ((game.height-(50*6))/2), "cardback");
				blankChild.inputEnabled = true;
				blankChild.events.onInputDown.add(touched);
				var randPairNum = Math.floor(Math.random() * pairs.length);
				bcnum += 1;
				blankChild.index = bcnum;
				blankChild.id = pairs[randPairNum];
				pairs.splice(randPairNum, 1);
				blank.push(blankChild);
				fadeInTween(blankChild, 50 * bcnum);
			}
		}

		this.btn_back = game.add.button(10, 10, "back", toMainMenu);

		setInstructionText();
		runTimeCounter();
	}
}

game.state.add("LogoIntro", ZKGame.LogoIntro);
game.state.add("MainMenu", ZKGame.MainMenu);
game.state.add("PlayEasy", ZKGame.PlayEasy);
game.state.add("PlayMedium", ZKGame.PlayMedium);
game.state.add("PlayHard", ZKGame.PlayHard);
game.state.start("LogoIntro");

function toMainMenu(){
	game.state.start("MainMenu");
	clearInterval(timerInterval);
}

var ingameText;
function setInstructionText(){
	ingameText = game.add.bitmapText(game.world.centerX, 60, "gameFont", "Match each image with it's pair...", 60);
	ingameText.anchor.setTo(.5);
}

function fadeInTween(element, delay){
	element.alpha = 0;
	game.add.tween(element).to( { alpha : 1 }, 300, Phaser.Easing.Linear.None, true, delay);
}

var timerInterval;
var timerIntervalCounter;
function runTimeCounter(){
	var timerText = game.add.bitmapText(game.world.centerX, game.height - 150, "gameFontred", "0 second elapsed.", 30);
	timerText.anchor.setTo(.5);
	if(currentLevel == 1){
		if(appData.fastest1 != 9999){
			var bestSecond = game.add.bitmapText(game.world.centerX, game.height - 120, "gameFont", "Best : " +appData.fastest1+ " seconds.", 20);
			bestSecond.anchor.setTo(.5);
		}
	}else if(currentLevel == 2){
		if(appData.fastest2 != 9999){
			var bestSecond = game.add.bitmapText(game.world.centerX, game.height - 120, "gameFont", "Best : " +appData.fastest2+ " seconds.", 20);
			bestSecond.anchor.setTo(.5);
		}
	}else if(currentLevel == 3){
		if(appData.fastest3 != 9999){
			var bestSecond = game.add.bitmapText(game.world.centerX, game.height - 120, "gameFont", "Best : " +appData.fastest3+ " seconds.", 20);
			bestSecond.anchor.setTo(.5);
		}
	}
	timerIntervalCounter = 0;
	timerInterval = setInterval(function(){
		timerIntervalCounter += 1;
		timerText.setText(timerIntervalCounter + " seconds elapsed.");
		fadeInTween(timerText, 0);
		switch(currentLevel){
			case 1 :
				if(score >= 8){
					if(timerIntervalCounter < appData.fastest1){
						appData.fastest1 = timerIntervalCounter;
						saveData();
						ingameText.setText("Great! It's faster than ever.");
					}else{
						ingameText.setText("Great Job!");
					}
					endGame();
				}
				break;
			case 2 :
				if(score >= 12){
					if(timerIntervalCounter < appData.fastest1){
						appData.fastest2 = timerIntervalCounter;
						saveData();
						ingameText.setText("Great! It's faster than ever.");
					}else{
						ingameText.setText("Great Job!");
					}
					endGame();
				}
				break;
			case 3 :
				if(score >= 25){
					if(timerIntervalCounter < appData.fastest1){
						appData.fastest3 = timerIntervalCounter;
						saveData();
						ingameText.setText("Great! It's faster than ever.");
					}else{
						ingameText.setText("Great Job!");
					}
					endGame();
				}
				break;
		}
	}, 1000);
}

function endGame(){
	clearInterval(timerInterval);
	sndWin.play();
	score = 0;
}

function pauseGame(){
    game.paused = true;
    bgmusic.pause();
}

function resumeGame(){
    game.paused = false;
    bgmusic.resume()
}

function randomizeBg(){
	var rndBg = Math.floor(Math.random() * 3);
	var bg = game.add.sprite(game.world.centerX, game.world.centerY, "bg"+rndBg);
	bg.anchor.setTo(.5);
	if(game.width > 600){
		bg.scale.setTo(game.width/600);
	}
}
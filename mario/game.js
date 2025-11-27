$(function () {
    let term;
    let isGameRunning = false;
    let marioPosition = 0;
    let gameInterval;
    let gameWidth = 50;

    const SPRITE_MARIO = [
        '[[b;red;] M ]',
        '[[b;white;]()]',
        '[[b;blue;]HH]',
        '[[b;black;]||]',
    ];

    const GROUND = '[[b;green;]================================================================================]';
    const SKY = '[[b;skyblue;]                                                                                ]';
    const BRICK = '[[b;brown;][ ]';
    const COIN = '[[b;yellow;]o';

    function renderGame(t) { 
        t.echo('\n'.repeat(2));

        for (let i = 0; i<3; i++) {
            t.echo(SKY.substring(0, gameWidth * 2));
        }

        const marioX = Math.max(5, Math.min(marioPosition, gameWidth - 5));

        for (let row = 0; row<4; row++) {
            let line = SKY.substring(0, marioX *2);

            if (row < SPRITE_MARIO.length) {
                line += SPRITE_MARIO[row];
            } else {
                line += SKY.substring(0, 4);
            }

            if (row == 2) {
                if (marioPosition > 15 && marioPosition < 20) {
                    line += BRICK + BRICK + BRICK;
                }
                if (marioPosition > 25 && marioPosition < 30) {
                    line += COIN + COIN;
                }
            }

            line += SKY.substring(line.length, gameWidth * 2);
            t.echo(line);
        }

        for (let i = 0; i <2; i++) {
            t.echo(SKY.substring(0, gameWidth * 2));
        }

        t.echo(GROUND.substring(0, gameWidth * 2));

        t.echo(`Position: ${marioPosition} | Controls: ← → to move, q to quit`);
    }

    function handleGameInput(command) {

    }

    function quitGame() {

    }

    term = $('#terminal').terminal({
        start: function () {
            this.echo("[[b;red;]SUPER MARIO TERMINAL]");
            this.echo("Welcome! Type [[b;yellow;]startgame] to begin.");
            this.echo("\n[[b;white;]Controls:]");
            this.echo("  [[b;white;]left/right] - Move");
            this.echo("  [[b;white;]up/jump] - Jump");
            this.echo("  [[b;white;]quit] - Exit game");
        },

        help: function () {
            this.echo("[[b;green;]Available commands:]");
            this.echo("  [[b;white;]start] - Begin the game");
            this.echo("  [[b;white;]help] - Show this help");
            this.echo("  [[b;white;]quit] - Exit the game");
        },

        startgame: function () {
            let t = this;
            if (isGameRunning) {
                t.echo("[[b;yellow;]Game is already running]");
                return;
            }
            this.echo("[[b;green;]Starting Super Mario Terminal...]");
            this.echo("[[b;green;]|------------------------------------------------|]");
            marioPosition = 5;
            isGameRunning = true;
            renderGame(t);
        }, 

        quit: function () {
            if (isGameRunning) {
                quitGame();
            } else {
                this.echo("[[b;yellow;]No game running. Type 'startgame' to begin!]")
            }
        }
    }, {
        greetings: false,
        prompt: 'mario> ',
        name: 'mario_game',
        height: 500,
        width: 800,
        checkArity: false
    });
});
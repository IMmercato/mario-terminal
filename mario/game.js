$(function () {
    let term;
    let isGameRunning = false;
    let marioPosition = 0;
    let gameInterval;
    let gameWidth = 50;
    let coins = 0;

    const SPRITE_MARIO = [
        '[[b;red;] M ]',
        '[[b;white;]()]',
        '[[b;blue;]HH]',
        '[[b;black;]||]',
    ];

    function createLine(char, length) {
        return char.repeat(length)
    }

    function renderGame(t) { 
        t.clear();

        t.echo('[[b;cyan;black]' + createLine('=', gameWidth) + ']');
        t.echo('[[b;white;black]SUPER MARIO TERMINAL GAME]');
        t.echo('[[b;cyan;black]' + createLine('=', gameWidth) + ']');
        t.echo('')

        for (let i = 0; i<3; i++) {
            t.echo('[[b;#87CEEB;#87CEEB]' + createLine(' ', gameWidth) + ']');
        }

        const marioX = Math.floor(marioPosition);

        for (let row = 0; row < 4; row++) {
            let line = '';
            let marioRendered = false;

            for (let col = 0; col < gameWidth; col++) {
                let char = ' ';

                if (col === marioX && row < SPRITE_MARIO.length && !marioRendered) {
                    line += SPRITE_MARIO[row];
                    marioRendered = true;
                    col += 2;
                    continue;
                }
                else if (row === 2 && col >= 20 && col < 26) {
                    if ((col -20) % 3 === 0 || (col -20) % 3 === 1) {
                        char = '[[;#8B4513;]#]';
                    }
                }
                else if (row === 2 && col >= 35 && col < 40) {
                    if ((col -35) % 2 === 0) {
                        char = '[[;yellow;]O]';
                    }
                }
                else if (row === 3 && col >= 45 && col < 52) {
                    char = '[[;brown;]=]';
                }
                line += char;
            }
            t.echo('[[;#87CEEB;#87CEEB]' + line + ']')
        }

        for (let i = 0; i <2; i++) {
            t.echo('[[b;#87CEEB;#87CEEB]' + createLine(' ', gameWidth) + ']');
        }

        t.echo('[[b;green;green]' + createLine('=', gameWidth) + ']');

        t.echo('');
        t.echo(`[[b;yellow;black]Coins: ${coins} | Position: ${Math.floor(marioPosition)}]`);
        t.echo(`[[b;white;black]Controls: ← → to move | Q to quit]`);
    }

    function handleGameInput(key) {
        if(!isGameRunning) {
            return;
        }

        switch (key) {
            case 'left':
            case 'ArrowLeft':
                marioPosition = Math.max(0, marioPosition - 2);
                break;
            case 'right':
            case 'ArrowRight':
                marioPosition = Math.min(gameWidth - 4, marioPosition + 2);
                break;
            case 'q':
            case 'Q':
            case 'quit':
                quitGame();
                break;
        }
    }

    function startGameLoop(t) {
        if (gameInterval) {
            clearInterval(gameInterval);
        }

        gameInterval = setInterval(() => {
            if (isGameRunning) {
                renderGame(t);
            }
        }, 100)
    }

    function setupGameInput() {
        $(document).on('keydoen', function(e) {
            if (!isGameRunning) return;

            if (['ArrowLeft', 'ArrowRight', 'q', 'Q'].includes(e.key)) {
                e.preventDefault();
                handleGameInput(e.key);
            }
        })
    } 

    function quitGame() {
        isGameRunning = false;
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        term.echo("[[b;yellow;]Game over!]");
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
            t.set_prompt('GAME> ')
            startGameLoop(t);
            setupGameInput();
            t.echo("[[b;green;]Game started!]")
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
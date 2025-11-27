$(function () {
    let term;
    let isGameRunning = false;
    let marioPosition = 0;
    let gameInterval;
    let gameWidth = 50;
    let coins = 0;
    let inputSetup = false;

    const SPRITE_MARIO = [
        '[[b;white;red] M ]',
        '[[b;brown;#E8BEAC]( )]',
        '[[b;white;blue]HH]',
        '[[b;black;blue]||]',
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
            case 'ArrowLeft':
                marioPosition = Math.max(0, marioPosition - 2);
                checkCoinCollection();
                break;
            case 'ArrowRight':
                marioPosition = Math.min(gameWidth - 5, marioPosition + 2);
                checkCoinCollection();
                break;
            case 'q':
            case 'Q':
            case 'quit':
                quitGame();
                break;
        }
    }

    function checkCoinCollection() {
        const marioX = Math.floor(marioPosition);
        if ((marioX >= 33 && marioX <= 36) || (marioX >= 35 && marioX <= 38) || (marioX >= 37 && marioX <= 40)) {
            if (marioX === 35 || marioX === 37 || marioX === 39) {
                coins++;
            }
        }
    }

    function startGameLoop(t) {
        if (gameInterval) {
            clearInterval(gameInterval);
        }

        renderGame(t);

        gameInterval = setInterval(() => {
            if (isGameRunning) {
                renderGame(t);
            }
        }, 100)
    }

    function setupGameInput() {
        if (inputSetup) return;
        inputSetup = true;

        $(document).on('keydown', function(e) {
            if (!isGameRunning) return;

            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown','q', 'Q'].includes(e.key)) {
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
        term.enable();
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
                t.echo("[[b;yellow;black]Game is already running]");
                return;
            }

            this.echo();
            this.echo("[[b;green;black]Starting Super Mario Terminal...]");
            this.echo("[[b;green;black]|------------------------------------------------|]");
            
            marioPosition = 5;
            coins = 0;
            isGameRunning = true;
            
            setTimeout(() => {
                t.disable();
                //t.set_prompt('[[b;red;black]Game>] ');
                setupGameInput();
                startGameLoop(t);
            }, 500);
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
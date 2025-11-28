$(function () {
    let term;
    let isGameRunning = false;
    let marioPosition = 0;
    let marioY = 0;
    let marioVelocityY = 0;
    let isJumping = false;
    let gameInterval;
    let gameWidth = 50;
    let viewportWidth = 50;
    let coins = 0;
    let inputSetup = false;
    let cameraX = 0;

    const SPRITE_MARIO = [
        '[[b;white;red] M ]',
        '[[b;brown;#E8BEAC]( )]',
        '[[b;white;blue]HH]',
        '[[b;black;blue]||]',
    ];

    const GRAVITY = 0.5;
    const JUMP_STRENGTH = -3;
    const MAX_JUMP_HEIGHT = 2;

    function createLine(char, length) {
        return char.repeat(length)
    }

    function generateObstacles(worldX) {
        const obstacles = [];

        if (worldX % 20 === 0 && worldX > 10) {
            obstacles.push({ type: 'platform', x: worldX, width: 6 });
        }

        if (worldX % 15 === 0 && worldX > 5) {
            for (let i = 0; i < 3; i++) {
                obstacles.push({ type: 'coin', x: worldX + i * 2 });
            }
        }

        if (worldX % 23 === 0 && worldX > 0) {
            obstacles.push({ type: 'block', x: worldX, width: 2 });
        }

        return obstacles;
    }

    function displayObstacles() {
        const obstacles = [];
        for (let x = Math.floor(cameraX); x < cameraX + viewportWidth + 10; x++) {
            obstacles.push(...generateObstacles(x));
        }
        return obstacles;
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

        const marioScreenX = Math.floor(marioPosition - cameraX);
        const marioGroundRow = 3;
        const marioTopRow = marioPosition - 3 - Math.floor(marioY);

        const obstacles = displayObstacles();

        for (let row = 0; row < 5; row++) {
            let line = '';

            for (let col = 0; col < viewportWidth; col++) {
                const worldX = Math.floor(cameraX + col);
                let char = ' ';
                let rendered = false;

                if (col >= marioScreenX && col < marioScreenX + 3 && row >= marioTopRow && row < marioTopRow + 4) {
                    const spriteRow = row - marioTopRow;
                    if (spriteRow >= 0 && spriteRow < SPRITE_MARIO.length) {
                        line += SPRITE_MARIO[spriteRow];
                        col += 2;
                        rendered = true;
                        continue;
                    }
                }

                if (!rendered) {
                    for (const obs of obstacles) {
                        if (obs.type === 'platform' && row === 1) {
                            if (worldX >= obs.x && worldX < obs.x + obs.width) {
                                char = '[[;#8B4513;]#]';
                                break;
                            }
                        }
                        else if (obs.type === 'coin' && row === 1) {
                            if (worldX === obs.x) {
                                char = '[[;yellow;]O]';
                                break;
                            }
                        }
                        else if (obs.type === 'block' && row === 1) {
                            if (worldX >= obs.x && worldX < obs.x + obs.width) {
                                char = '[[;brown;]=]';
                                break;
                            }
                        }
                    }
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
                marioPosition = marioPosition + 2;
                checkCoinCollection();
                break;
            case ' ':
            case 'Space':
                if (!isJumping) {
                    marioVelocityY = JUMP_STRENGTH;
                    isJumping = true;
                }
                break;
            case 'q':
            case 'Q':
                quitGame();
                break;
        }
    }

    function updatePhysics() {
        if (marioY > 0 || marioVelocityY < 0) {
            marioVelocityY += GRAVITY;
            marioY += marioVelocityY;

            if (marioY < -MAX_JUMP_HEIGHT) {
                marioY = -MAX_JUMP_HEIGHT;
                marioVelocityY = 0;
            }

            if (marioY >= 0) {
                marioY = 0;
                marioVelocityY = 0;
                isJumping = false;
            }
        }

        const targetCameraX = Math.max(0, marioPosition - 15);
        cameraX = targetCameraX;
    }

    function checkCoinCollection() {
        const obstacles = displayObstacles();
        for (const obs of obstacles) {
            if (obs.type === 'coin') {
                const marioX = Math.floor(marioPosition);
                if (marioX >= obs.x -1 && marioX <= obs.x +1) {
                    coins++;
                    obs.collected = true;
                }
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
                updatePhysics();
                renderGame(t);
            }
        }, 100)
    }

    function setupGameInput() {
        if (inputSetup) return;
        inputSetup = true;

        $(document).on('keydown', function(e) {
            if (!isGameRunning) return;

            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'q', 'Q'].includes(e.key)) {
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
        term.set_prompt('mario> ');
        term.echo("[[b;yellow;]Game over! Final score: " + coins + " coins]");
        term.echo("[[b;white;]Type 'startgame' to play again or 'help' for commands]");
    }

    term = $('#terminal').terminal({
        start: function () {
            this.echo("[[b;red;]SUPER MARIO TERMINAL]");
            this.echo("Welcome! Type [[b;yellow;]startgame] to begin.");
            this.echo("\n[[b;white;]Controls:]");
            this.echo("  [[b;white;]left/right arrows] - Move");
            this.echo("  [[b;white;]Q] - Quit game");
        },

        help: function () {
            this.echo("[[b;green;]Available commands:]");
            this.echo("  [[b;white;]start] - Begin the game");
            this.echo("  [[b;white;]startgame] - Begin the game");
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
            this.echo("[[b;green;black]Press Q to quit the game]");
            
            marioPosition = 5;
            marioY = 0;
            marioVelocityY = 0;
            isJumping = false;
            cameraX = 0;
            coins = 0;
            isGameRunning = true;
            
            setTimeout(() => {
                t.disable();
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
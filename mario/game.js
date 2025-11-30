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
    let collectedCoins = new Set();
    let groundLevel = 0;

    const SPRITE_MARIO = [
        '[[b;white;red] M ]',
        '[[b;brown;#E8BEAC]( )]',
        '[[b;white;blue]HH]',
        '[[b;black;blue]||]',
    ];

    const GRAVITY = 0.5;
    const JUMP_STRENGTH = -3;
    const MAX_JUMP_HEIGHT = 4;
    const HORIZONTAL_JUMP_DISTANCE = 2;
    const MARIO_WIDTH = 3;

    function createLine(char, length) {
        return char.repeat(length)
    }

    function generateObstacles(worldX) {
        const obstacles = [];
        const seed = worldX;

        // Floating Platforms
        if (worldX % 25 === 0 && worldX > 20) {
            const width = 4 + (Math.abs(Math.sin(worldX * 0.1)) * 4) | 0;
            obstacles.push({ type: 'platform', x: worldX, width: width, y: 4 });
        } else if (worldX % 30 === 5 && worldX > 30) {
            obstacles.push({ type: 'platform', x: worldX, width: 5, y: 5 });
        }

        // Coin
        if (worldX % 18 === 3 && worldX > 10) {
            for (let i = 0; i < 4; i++) {
                obstacles.push({ type: 'coin', x: worldX + i * 2, y: 4 });
            }
        } else if (worldX % 22 === 7 && worldX > 25) {
            obstacles.push({ type: 'coin', x: worldX, y: 3 });
            obstacles.push({ type: 'coin', x: worldX, y: 4 });
        } else if (worldX % 35 === 10 && worldX > 40) {
            obstacles.push({ type: 'coin', x: worldX, y: 5 });
            obstacles.push({ type: 'coin', x: worldX + 2, y: 4 });
            obstacles.push({ type: 'coin', x: worldX + 4, y: 5 });
        }

        // Block
        if (worldX % 28 === 12 && worldX > 15) {
            const width = 2 + ((worldX / 10) % 3) | 0;
            obstacles.push({ type: 'block', x: worldX, width: width, y: 5 });
        } else if (worldX % 40 === 20 && worldX > 35) {
            obstacles.push({ type: 'block', x: worldX, width: 2, y: 6 });
            obstacles.push({ type: 'block', x: worldX + 2, width: 2, y: 5 });
            obstacles.push({ type: 'block', x: worldX + 4, width: 2, y: 4 });
        }

        // Pipe
        if (worldX % 45 === 15 && worldX > 50) {
            obstacles.push({ type: 'pipe', x: worldX, width: 2, height: 3 });
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

    function checkHorizontalCollision(newPosition) {
        const obstacles = displayObstacles();
        const marioX = Math.floor(newPosition);
        const marioRight = marioX + MARIO_WIDTH - 1;
        const marioBottom = 7 + Math.floor(marioY);
        const marioTop = marioBottom - 3;

        for (const obs of obstacles) {
            if (obs.type === 'block' || obs.type === 'pipe') {
                const obsLeft = obs.x;
                const obsRight = obs.x + obs.width - 1;
                const obsTop = obs.y || 5;
                const obsBottom = obs.type === 'pipe' ? 7 : (obs.y + 1);

                if (marioRight >= obsLeft && marioX <= obsRight && marioBottom >= obsTop && marioTop <= obsBottom) {
                    return true;
                }
            }
        }
        return false;
    }

    function findGroundLevel() {
        const obstacles = displayObstacles();
        const marioX = Math.floor(marioPosition);
        const marioRight = marioX + MARIO_WIDTH - 1;
        const marioBottom = 7 + Math.floor(marioY);

        let closestPlatform = 0;

        for (const obs of obstacles) {
            if (obs.type === 'platform') {
                const obsLeft = obs.x;
                const obsRight = obs.x + obs.width - 1;
                const platformTop = obs.y;

                if (marioRight >= obsLeft && marioX <= obsRight) {
                    const platformHeight = 7 - platformTop;
                    if (marioY >= -platformHeight && platformHeight > closestPlatform) {
                        closestPlatform = platformHeight;
                    }
                }
            }
        }
        return -closestPlatform;
    }

    function checkCeilingCollision() {
        const obstacles = displayObstacles();
        const marioX = Math.floor(marioPosition);
        const marioRight = marioX + MARIO_WIDTH - 1;
        const marioTop = 7 + Math.floor(marioY) - 3;

        for (const obs of obstacles) {
            if (obs.type === 'platform' || obs.type === 'block') {
                const obsLeft = obs.x;
                const obsRight = obs.x + obs.width - 1;
                const obsBottom = (obs.y || 5) + 1;

                if (marioRight >= obsLeft && marioX <= obsRight && marioTop <= obsBottom && marioTop >= obsBottom - 1) {
                    return true;
                }
            }
        }
        return false;
    }

    function renderGame(t) {
        t.clear();

        t.echo('[[b;cyan;black]' + createLine('=', gameWidth) + ']');
        t.echo('[[b;white;black]SUPER MARIO TERMINAL GAME]');
        t.echo('[[b;cyan;black]' + createLine('=', gameWidth) + ']');
        t.echo('')

        for (let i = 0; i < 2; i++) {
            t.echo('[[b;#87CEEB;#87CEEB]' + createLine(' ', gameWidth) + ']');
        }

        const marioScreenX = Math.floor(marioPosition - cameraX);
        const obstacles = displayObstacles();

        for (let row = 0; row < 8; row++) {
            let line = '';

            for (let col = 0; col < viewportWidth; col++) {
                const worldX = Math.floor(cameraX + col);
                let char = ' ';
                let rendered = false;

                const marioGroundRow = 7;
                const marioBottomRow = marioGroundRow + Math.floor(marioY);
                const marioTopRow = marioBottomRow - 3;

                if (col >= marioScreenX && col < marioScreenX + 3) {
                    if (row >= marioTopRow && row <= marioBottomRow) {
                        const spriteRow = row - marioTopRow;
                        if (spriteRow >= 0 && spriteRow < SPRITE_MARIO.length) {
                            line += SPRITE_MARIO[spriteRow];
                            col += 2;
                            rendered = true;
                            continue;
                        }
                    }
                }

                if (!rendered) {
                    for (const obs of obstacles) {
                        if (obs.type === 'platform') {
                            if ((row === obs.y || row === obs.y + 1) && worldX >= obs.x && worldX < obs.x + obs.width) {
                                char = '[[;#8B4513;]#]';
                                break;
                            }
                        }
                        else if (obs.type === 'coin') {
                            const coinKey = `${obs.x}-${obs.y}`;
                            if (row === obs.y && worldX === obs.x && !collectedCoins.has(coinKey)) {
                                char = '[[;yellow;]O]';
                                break;
                            }
                        }
                        else if (obs.type === 'block') {
                            if ((row === obs.y || row === obs.y + 1) && worldX >= obs.x && worldX < obs.x + obs.width) {
                                char = '[[;brown;]=]';
                                break;
                            }
                        }
                        else if (obs.type === 'pipe') {
                            const pipeTop = 7 - obs.height;
                            if (row >= pipeTop && row <= 7 && worldX >= obs.x && worldX < obs.x + obs.width) {
                                if (row === pipeTop) {
                                    char = '[[;green;]╔]';
                                } else if (row === pipeTop + 1) {
                                    char = '[[;green;]║]';
                                } else {
                                    char = '[[;green;]║]';
                                }
                                break;
                            }
                        }
                    }
                }
                line += char;
            }
            t.echo('[[;#87CEEB;#87CEEB]' + line + ']')
        }

        t.echo('[[b;green;green]' + createLine('=', gameWidth) + ']');

        t.echo('');
        t.echo(`[[b;yellow;black]Coins: ${coins} | Position: ${Math.floor(marioPosition)}]`);
        t.echo(`[[b;white;black]Controls: ← → to move | Q to quit]`);
    }

    function handleGameInput(key) {
        if (!isGameRunning) {
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
        if (isJumping && marioY < 0) {
            const keys = window.pressedKeys || {};
            if (keys['ArrowLeft']) {
                const newPos = Math.max(0, marioPosition - HORIZONTAL_JUMP_DISTANCE);
                if (!checkHorizontalCollision(newPos)) {
                    marioPosition = newPos;
                }
            }
            if (keys['ArrowRight']) {
                const newPos = Math.max(0, marioPosition + HORIZONTAL_JUMP_DISTANCE);
                if (!checkHorizontalCollision(newPos)) {
                    marioPosition = newPos;
                }
            }
        }

        if (marioY < groundLevel || marioVelocityY !== 0) {
            marioVelocityY += GRAVITY;
            marioY += marioVelocityY;

            if (marioVelocityY < 0 && checkCeilingCollision()) {
                marioY = Math.ceil(marioY);
                marioVelocityY = 0;
            }

            if (marioY < -MAX_JUMP_HEIGHT) {
                marioY = -MAX_JUMP_HEIGHT;
                marioVelocityY = 0;
            }

            groundLevel = findGroundLevel();

            if (marioY >= groundLevel) {
                marioY = groundLevel;
                marioVelocityY = 0;
                isJumping = false;
            }
        } else {
            groundLevel = findGroundLevel();
            if (marioY > groundLevel) {
                isJumping = true;
                marioVelocityY = 0;
            }
        }

        const targetCameraX = Math.max(0, marioPosition - 15);
        cameraX = targetCameraX;

        checkCoinCollection();
    }

    function checkCoinCollection() {
        const obstacles = displayObstacles();
        const marioX = Math.floor(marioPosition);
        for (const obs of obstacles) {
            if (obs.type === 'coin') {
                const coinKey = `${obs.x}`;
                if (!collectedCoins.has(coinKey) && marioX >= obs.x - 1 && marioX <= obs.x + 1) {
                    coins++;
                    collectedCoins.add(coinKey);
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

        window.pressedKeys = {};

        $(document).on('keydown', function (e) {
            if (!isGameRunning) return;

            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'q', 'Q'].includes(e.key)) {
                e.preventDefault();
                window.pressedKeys[e.key] = true;
                handleGameInput(e.key);
            }
        });

        $(document).on('keyup', function (e) {
            if (window.pressedKeys) {
                window.pressedKeys[e.key] = false;
            }
        });
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
            groundLevel = 0;
            collectedCoins.clear();
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
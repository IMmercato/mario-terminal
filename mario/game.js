$(function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x222222);
    document.body.appendChild(renderer.domElement);

    const pcGroup = new THREE.Group();

    const screenGeometry = new THREE.BoxGeometry(8, 6, 0.5);
    const screenMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0x333333,
        shininess: 10,
        emissive: 0x111111
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 3, 0);

    const bezelGeometry = new THREE.BoxGeometry(9.5, 7.5, 1.0);
    const bezelMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        specular: 0xAAAAAA,
        shininess: 30
    });
    const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
    bezel.position.set(0, 3, -0.15);

    const standBaseGeometry = new THREE.CylinderGeometry(2.5, 3, 0.8, 8);
    const standBaseMaterial = new THREE.MeshPhongMaterial({ color: 0x777777 });
    const standBase = new THREE.Mesh(standBaseGeometry, standBaseMaterial);
    standBase.position.set(0, 0.4, 0);

    const standNeckGeometry = new THREE.CylinderGeometry(0.8, 1.2, 2.5, 8);
    const standNeckMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const standNeck = new THREE.Mesh(standNeckGeometry, standNeckMaterial);
    standNeck.position.set(0, 0.4, 0);

    const keyboardBaseGeometry = new THREE.BoxGeometry(12, 0.6, 5);
    const keyboardBaseMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        specular: 0x444444,
        shininess: 20,
    });
    const keyboardBase = new THREE.Mesh(keyboardBaseGeometry, keyboardBaseMaterial);
    keyboardBase.position.set(0, -2.8, 4);

    const keyGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const keyMaterial = new THREE.MeshPhongMaterial({
        color: 0x111111,
        specular: 0x222222,
        shininess: 50
    })

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 12; col++) {
            const key = new THREE.Mesh(keyGeometry, keyMaterial);
            key.position.set(
                -5.5 + col * 1.0,
                -2.6,
                3.5 - row * 1.0
            );
            pcGroup.add(key);
        }
    }

    const spaceBarGeometry = new THREE.BoxGeometry(6, 0.25, 1.2);
    const spaceBar = new THREE.Mesh(spaceBarGeometry, keyMaterial);
    spaceBar.position.set(0, -2.6, 6);
    pcGroup.add(spaceBar);

    const mouseBaseGeometry = new THREE.BoxGeometry(1.5, 0.8, 2.5);
    const mouseBaseMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444,
        specular: 0x555555,
        shininess: 30
    });
    const mouseBase = new THREE.Mesh(mouseBaseGeometry, mouseBaseMaterial);
    mouseBase.position.set(8, -2.2, 4.8);
    mouseBase.rotation.y = -0.3;

    const mouseBallGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const mouseBallMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0x333333,
        shininess: 100
    });
    const mouseBall = new THREE.Mesh(mouseBallGeometry, mouseBallMaterial);
    mouseBall.position.set(8, -2.2, 4.8);
    mouseBall.rotation.y = -0.3;

    const cpuGeometry = new THREE.BoxGeometry(3, 8, 6);
    const cpuMaterial = new THREE.MeshPhongMaterial({
        color: 0xD3D3C9,
        specular: 0xBBBBBB,
        shininess: 10
    });
    const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
    cpu.position.set(-10, 0, 0);

    const floppyGeometry = new THREE.BoxGeometry(2.5, 0.8, 0.2);
    const floppyMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const floppy = new THREE.Mesh(floppyGeometry, floppyMaterial);
    floppy.position.set(-10, -2, 3.1);
    pcGroup.add(floppy);

    const powerButtonGeomerty = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const powerButtonMaterial = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
        emissive: 0x220000
    });
    const powerButton = new THREE.Mesh(powerButtonGeomerty, powerButtonMaterial);
    powerButton.position.set(-10, 2, 3.1);
    pcGroup.add(powerButton);

    const cableGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 8);
    const cableMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });

    const monitorCable = new THREE.Mesh(cableGeometry, cableMaterial);
    monitorCable.position.set(0, -1, 0);
    monitorCable.rotation.x = Math.PI / 2;
    monitorCable.rotation.z = -0.5;
    pcGroup.add(monitorCable);

    const keyboardCable = new THREE.Mesh(cableGeometry, cableMaterial);
    keyboardCable.position.set(0, -2.8, 1.5);
    keyboardCable.rotation.x = Math.PI / 2;
    keyboardCable.rotation.z = 0.3;
    pcGroup.add(keyboardCable);

    const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(15, 20, 10);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0x444444, 0.5);
    backLight.position.set(-10, 5, -10);
    scene.add(backLight);

    pcGroup.add(screen);
    pcGroup.add(bezel);
    pcGroup.add(standBase);
    pcGroup.add(standNeck);
    pcGroup.add(keyboardBase);
    pcGroup.add(mouseBase);
    pcGroup.add(mouseBall);
    pcGroup.add(cpu);
    scene.add(pcGroup);

    camera.position.set(20, 10, 25);
    camera.lookAt(0, 0, 0);

    let rotationSpeed = 0.001;
    let mouseOver = false;

    renderer.domElement.addEventListener('mouseenter', () => mouseOver = true);
    renderer.domElement.addEventListener('mouseleave', () => mouseOver = false);

    renderer.domElement.addEventListener('mouseover', () => {
        if (terminalElement) {
            terminalElement.style.opacity = '0.7';
        }
    });

    renderer.domElement.addEventListener('mouseout', () => {
        if (terminalElement) {
            terminalElement.style.opacity = '1';
        }
    });

    const terminalElement = document.getElementById('terminal');
    if (terminalElement) {
        terminalElement.style.position = 'absolute';
        terminalElement.style.width = '800px';
        terminalElement.style.height = '600px';
        terminalElement.style.top = '50%';
        terminalElement.style.left = '50%';
        terminalElement.style.transform = 'translate(-50%, -50%)';
        terminalElement.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        terminalElement.style.border = '3px solid #00ff00';
        terminalElement.style.boxShadow = '0 0 30px #00ff00, inset 0 0 20px #00ff00';
        terminalElement.style.borderRadius = '5px';
        terminalElement.style.zIndex = '100';
        terminalElement.style.transition = 'opacity 0.3s';
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!mouseOver) {
            pcGroup.rotation.y += rotationSpeed;
        }

        pcGroup.rotation.y += Math.sin(Date.now() * 0.001) * 0.05;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    })

    let term;
    let isGameRunning = false;
    let marioPosition = 0;
    let marioY = 0;
    let marioVelocityY = 0;
    let isJumping = false;
    let gameInterval;
    let gameWidth = 100;
    let viewportWidth = 100;
    let gameHeight = 16;
    let coins = 0;
    let inputSetup = false;
    let cameraX = 0;
    let collectedCoins = new Set();
    let groundLevel = 0;
    let enemies = [];
    let spawnedEnemies = new Set();

    const SPRITE_MARIO = [
        '[[b;white;red] M ]',
        '[[b;brown;#E8BEAC]( )]',
        '[[b;white;blue]H H]',
        '[[b;black;blue]| |]',
    ];

    const SPRITE_GOOMBA = [
        '[[b;black;brown]oo]',
        '[[b;black;brown]--]',
    ]

    const GRAVITY = 0.5;
    const JUMP_STRENGTH = -4;
    const MAX_JUMP_HEIGHT = 9;
    const HORIZONTAL_JUMP_DISTANCE = 3;
    const MARIO_WIDTH = 3;
    const MARIO_SPRITE_WIDTH = 3;
    const GOOMBA_WIDTH = 2;
    const GROUND_ROW = 15;

    function createLine(char, length) {
        return char.repeat(length)
    }

    function generateObstacles(worldX) {
        const obstacles = [];

        // Floating Platforms
        if (worldX % 50 === 0 && worldX > 30) {
            const width = 6 + (Math.abs(Math.sin(worldX * 0.1)) * 3) | 0;
            obstacles.push({ type: 'platform', x: worldX, width: width, y: 8 });
        } else if (worldX % 60 === 20 && worldX > 50) {
            obstacles.push({ type: 'platform', x: worldX, width: 6, y: 10 });
        }

        // Coin
        if (worldX % 35 === 5 && worldX > 15) {
            for (let i = 0; i < 3; i++) {
                obstacles.push({ type: 'coin', x: worldX + i * 3, y: 8 });
            }
        } else if (worldX % 45 === 15 && worldX > 40) {
            obstacles.push({ type: 'coin', x: worldX, y: 6 });
            obstacles.push({ type: 'coin', x: worldX + 3, y: 8 });
        } else if (worldX % 35 === 10 && worldX > 40) {
            obstacles.push({ type: 'coin', x: worldX, y: 5 });
            obstacles.push({ type: 'coin', x: worldX + 2, y: 4 });
            obstacles.push({ type: 'coin', x: worldX + 4, y: 5 });
        }

        // Block
        if (worldX % 55 === 25 && worldX > 20) {
            const width = 3 + ((worldX / 20) % 2) | 0;
            obstacles.push({ type: 'block', x: worldX, width: width, y: 10 });
        } else if (worldX % 70 === 35 && worldX > 60) {
            obstacles.push({ type: 'block', x: worldX, width: 3, y: 12 });
            obstacles.push({ type: 'block', x: worldX + 4, width: 3, y: 10 });
            obstacles.push({ type: 'block', x: worldX + 8, width: 3, y: 8 });
        }

        // Pipe
        if (worldX % 80 === 40 && worldX > 70) {
            obstacles.push({ type: 'pipe', x: worldX, width: 3, height: 5 });
        }

        return obstacles;
    }

    function spawnEnemies() {
        const spawnDistace = Math.floor(cameraX + viewportWidth + 20);
        for (let x = Math.floor(cameraX); x < spawnDistace; x++) {
            if (x % 65 === 30 && x > 60) {
                const enemyKey = `goomba-${x}`;
                if (!spawnedEnemies.has(enemyKey)) {
                    enemies.push({
                        type: 'goomba', x: x, y: GROUND_ROW, direction: -1, key: enemyKey
                    });
                    spawnedEnemies.add(enemyKey);
                }
            }
        }
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
        const marioBottom = GROUND_ROW + Math.floor(marioY);
        const marioTop = marioBottom - 3;

        for (const obs of obstacles) {
            if (obs.type === 'block' || obs.type === 'pipe' || obs.type === 'platform') {
                const obsLeft = obs.x;
                const obsRight = obs.x + obs.width - 1;
                let obsBottom, obsTop;

                if (obs.type === 'pipe') {
                    obsTop = GROUND_ROW - obs.height;
                    obsBottom = GROUND_ROW;
                } else if (obs.type === 'platform') {
                    obsTop = obs.y;
                    obsBottom = obs.y + 1;
                } else {
                    obsTop = obs.y;
                    obsBottom = obs.y + 1;
                }

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
        const marioBottom = GROUND_ROW + Math.floor(marioY);

        let closestPlatform = 0;

        for (const obs of obstacles) {
            if (obs.type === 'platform') {
                const obsLeft = obs.x;
                const obsRight = obs.x + obs.width - 1;
                const platformTop = obs.y;

                if (marioRight >= obsLeft && marioX <= obsRight) {
                    const platformHeight = GROUND_ROW - platformTop;
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
        const marioTop = GROUND_ROW + Math.floor(marioY) - 3;

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
        t.echo('');

        for (let i = 0; i < 2; i++) {
            t.echo('[[b;#87CEEB;#87CEEB]' + createLine(' ', gameWidth) + ']');
        }

        const marioScreenX = Math.floor(marioPosition - cameraX);
        const obstacles = displayObstacles();

        for (let row = 0; row < gameHeight; row++) {
            let line = '';

            for (let col = 0; col < viewportWidth; col++) {
                const worldX = Math.floor(cameraX + col);
                let char = ' ';
                let rendered = false;

                const marioBottomRow = GROUND_ROW + Math.floor(marioY);
                const marioTopRow = marioBottomRow - 3;

                // Render Mario
                if (col >= marioScreenX && col < marioScreenX + MARIO_WIDTH) {
                    if (row >= marioTopRow && row <= marioBottomRow) {
                        const spriteRow = row - marioTopRow;
                        if (spriteRow >= 0 && spriteRow < SPRITE_MARIO.length) {
                            line += SPRITE_MARIO[spriteRow];
                            col += MARIO_SPRITE_WIDTH - 1;
                            rendered = true;
                            continue;
                        }
                    }
                }

                // Render Enemies
                if (!rendered) {
                    for (const enemy of enemies) {
                        const enemyScreenX = Math.floor(enemy.x - cameraX);
                        if (col >= enemyScreenX && col < enemyScreenX + GOOMBA_WIDTH) {
                            const enemyBottomRow = GROUND_ROW;
                            const enemyTopRow = enemyBottomRow - SPRITE_GOOMBA.length + 1;

                            if (row >= enemyTopRow && row <= enemyBottomRow) {
                                const spriteRow = row - enemyTopRow;
                                if (spriteRow >= 0 && spriteRow < SPRITE_GOOMBA.length) {
                                    line += SPRITE_GOOMBA[spriteRow];
                                    col += GOOMBA_WIDTH - 1;
                                    rendered = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (rendered) continue;

                // Render Obstacles
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
                        const pipeTop = GROUND_ROW - obs.height;
                        if (row >= pipeTop && row <= GROUND_ROW && worldX >= obs.x && worldX < obs.x + obs.width) {
                            if (row === pipeTop) {
                                char = '[[;green;]╔]';
                            } else if (row === pipeTop + 1) {
                                char = '[[;green;]╠]';
                            } else {
                                char = '[[;green;]║]';
                            }
                            break;
                        }
                    }
                }
                line += char;
            }
            t.echo('[[;#87CEEB;#87CEEB]' + line + ']');
        }

        t.echo('[[b;green;green]' + createLine('=', gameWidth) + ']');

        t.echo('');
        t.echo(`[[b;yellow;black]Coins: ${coins} | Position: ${Math.floor(marioPosition)} | Enemies: ${enemies.length}]`);
        t.echo(`[[b;white;black]Controls: ← → to move | SPACE to jump | Q to quit]`);
    }

    function updateEnemies() {
        enemies = enemies.filter(enemy => enemy.x >= cameraX - 10);

        const marioX = Math.floor(marioPosition);
        const marioRight = marioX + MARIO_WIDTH - 1;
        const marioBottom = GROUND_ROW + Math.floor(marioY);
        const marioTop = marioBottom - SPRITE_MARIO.length + 1;

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];

            enemy.x += 0.3 * enemy.direction;

            const enemyLeft = Math.floor(enemy.x);
            const enemyRight = enemyLeft + GOOMBA_WIDTH - 1;
            const enemyBottom = GROUND_ROW;
            const enemyTop = enemyBottom - SPRITE_GOOMBA.length + 1;

            const horizontalOverlap = marioRight >= enemyLeft && marioX <= enemyRight;
            const verticalOverlap = marioBottom >= enemyTop && marioTop <= enemyBottom;

            if (horizontalOverlap && verticalOverlap) {
                const isFalling = marioVelocityY > 0;
                const isStomping = isFalling && marioBottom <= enemyTop + 1;

                const overlapWidth = Math.min(marioRight, enemyRight) - Math.max(marioX, enemyLeft) + 1;
                const hasSignificantOverlap = overlapWidth >= 1;

                if (isStomping && hasSignificantOverlap) {
                    enemies.splice(i, 1);
                    marioVelocityY = JUMP_STRENGTH * 0.5;
                    coins += 10;
                    term.echo("[[b;red;]Stomp! +10 coins]");
                } else {
                    term.echo("[[b;red]Ouch! You hit a Goomba! Game Over.]");
                    quitGame();
                    return;
                }
            }
        }
    }

    function handleGameInput(key) {
        if (!isGameRunning) {
            return;
        }

        switch (key) {
            case 'ArrowLeft':
                const newPosLeft = Math.max(0, marioPosition - 2);
                if (!checkHorizontalCollision(newPosLeft)) {
                    marioPosition = newPosLeft;
                }
                checkCoinCollection();
                break;
            case 'ArrowRight':
                const newPosRight = marioPosition + 2;
                if (!checkHorizontalCollision(newPosRight)) {
                    marioPosition = newPosRight;
                }
                checkCoinCollection();
                break;
            case ' ':
            case 'Space':
                if (!isJumping && marioY >= groundLevel) {
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
                if (marioVelocityY >= 0 || isJumping) {
                    marioY = groundLevel;
                    marioVelocityY = 0;
                    isJumping = false;
                }
            }
        } else if (marioY > groundLevel && !isJumping) {
            isJumping = true;
            marioVelocityY = 0;
        }

        const targetCameraX = Math.max(0, marioPosition - 15);
        cameraX = targetCameraX;

        checkCoinCollection();
    }

    function checkCoinCollection() {
        const obstacles = displayObstacles();
        const marioX = Math.floor(marioPosition);
        const marioBottom = GROUND_ROW + Math.floor(marioY);
        const marioTop = marioBottom - 3;
        for (const obs of obstacles) {
            if (obs.type === 'coin') {
                const coinKey = `${obs.x}-${obs.y}`;
                if (!collectedCoins.has(coinKey)) {
                    if (marioX >= obs.x - 2 && marioX <= obs.x + 2 && marioBottom >= obs.y && marioTop <= obs.y) {
                        coins++;
                        collectedCoins.add(coinKey);
                    }
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
                spawnEnemies();
                updatePhysics();
                updateEnemies();
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
            enemies = [];
            spawnedEnemies.clear();
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
                this.echo("[[b;yellow;]No game running. Type 'startgame' to begin!]");
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
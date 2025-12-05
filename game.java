import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class game {
    static int mario_position = 5;
    static int marioY = 0;
    static double marioVelocityY = 0;
    static int coins = 0;
    static int cameraX = 0;
    static boolean isRunning = true;
    static boolean isJumping = false;
    static Set<Integer> collectedCoins = new HashSet<>();

    final static String MARIO_SPRITE[] = {
            ConsoleColors.RED_BACKGROUND + " M " + ConsoleColors.RESET,
            (ConsoleColors.YELLOW + ConsoleColors.WHITE_BACKGROUND) + "( )" + ConsoleColors.RESET,
            ConsoleColors.BLUE_BACKGROUND + "H H" + ConsoleColors.RESET,
            ConsoleColors.BLUE_BACKGROUND + "| |" + ConsoleColors.RESET
    };
    final static String SKY = ConsoleColors.BLUE_BACKGROUND_BRIGHT + " " + ConsoleColors.RESET;
    final static String BLOCK = ConsoleColors.RED_BOLD + "#" + ConsoleColors.RESET;
    final static String PLATFORM = ConsoleColors.RED_BOLD_BRIGHT + "=" + ConsoleColors.RESET;
    final static String GROUND = ConsoleColors.RED_BACKGROUND_BRIGHT + ";" + ConsoleColors.RESET;
    final static String COIN = ConsoleColors.YELLOW + "o" + ConsoleColors.RESET;

    final static int GAME_HEIGHT = 16;
    final static int GAME_WIDTH = 80;
    final static int MARIO_WIDTH = 3;
    final static int MARIO_HEIGHT = MARIO_SPRITE.length;
    final static int GROUND_ROW = 15;

    final static double GRAVITY = 0.5;
    final static double JUMP_STRENGTH = -4.0;
    final static int MAX_JUMP_HEIGHT = 9;

    static String[][] screen = new String[GAME_HEIGHT][GAME_WIDTH];

    static volatile boolean keyLeft = false;
    static volatile boolean keyRight = false;
    static volatile boolean keySpace = false;

    public static void main(String[] args) {
        System.out.println(ConsoleColors.GREEN_BOLD + "=== SUPER MARIO TERMINAL ===");
        System.out.println(ConsoleColors.WHITE + "Controls: A(left), D(right), W(jump), Q(quit)");
        System.out.println("Press Enter to start game...");

        try {
            System.in.read();
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Start input thread
        Thread inputThread = new Thread(() -> {
            try {
                while (isRunning) {
                    if (System.in.available() > 0) {
                        int c = System.in.read();
                        handleKeyPress((char) c);
                    }
                    Thread.sleep(5);
                }
            } catch (Exception e) {
                // Game ended
            }
        });
        inputThread.setDaemon(true); // Safe accesss shared resources
        inputThread.start();

        startGameLoop();

        System.out.println(ConsoleColors.YELLOW + "Game Over! Final score: " + coins + "coins" + ConsoleColors.RESET);
    }

    private static void handleKeyPress(char key) {
        switch (Character.toLowerCase(key)) {
            case 'a':
                keyLeft = true;
                break;
            case 'd':
                keyRight = true;
                break;
            case 'w':
            case ' ':
                keySpace = true;
                break;
            case 'q':
                isRunning = false;
                break;
        }
    }

    static class Obstacle {
        String type;
        int x, y, width, height;

        Obstacle(String type, int x, int y, int width, int height) {
            this.type = type;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }

    private static ArrayList<Obstacle> generateObstacles(int worldX) {
        ArrayList<Obstacle> obs = new ArrayList<>();

        // Floating Platforms
        if (worldX % 50 == 0 && worldX > 30) {
            int width = 6 + (int) (Math.abs(Math.sin(worldX * 0.1)) * 3);
            obs.add(new Obstacle("platform", worldX, 8, width, 1));
        } else if (worldX % 60 == 20 && worldX > 50) {
            obs.add(new Obstacle("platform", worldX, 10, 6, 1));
        }

        // Coins
        if (worldX % 35 == 5 && worldX > 15) {
            for (int i = 0; i < 3; i++) {
                obs.add(new Obstacle("coin", worldX + i * 3, 8, 1, 1));
            }
        } else if (worldX % 35 == 15 && worldX > 40) {
            obs.add(new Obstacle("coin", worldX, 6, 1, 1));
            obs.add(new Obstacle("coin", worldX + 3, 8, 1, 1));
        }

        // Blocks
        if (worldX % 55 == 25 && worldX > 20) {
            int width = 3 + ((worldX / 20) % 2);
            obs.add(new Obstacle("block", worldX, 10, width, 1));
        }

        return obs;
    }

    private static ArrayList<Obstacle> displayObstacles() {
        ArrayList<Obstacle> result = new ArrayList<>();
        for (int x = cameraX; x < cameraX + GAME_WIDTH + 10; x++) {
            result.addAll(generateObstacles(x));
        }
        return result;
    }

    private static void updatePhysics() {
        if (keyLeft) {
            mario_position = Math.max(0, mario_position -1);
            keyLeft = false;
        }
        if (keyRight) {
            mario_position +=1;
            keyRight = false;
        }

        if (keySpace && !isJumping && marioY >= 0) {
            marioVelocityY = JUMP_STRENGTH;
            isJumping = true;
            keySpace = false;
        }

        if (marioY < 0 || marioVelocityY != 0) {
            marioVelocityY += GRAVITY;
            marioY += (int)marioVelocityY;

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
        cameraX = Math.max(0, mario_position - 15);

        checkCoinCollection();
    }

    private static void checkCoinCollection() {
        ArrayList<Obstacle> obs = displayObstacles();
        int marioX = mario_position;
        int marioBottom = GROUND_ROW - marioY;
        int marioTop = marioBottom - MARIO_HEIGHT + 1;

        for (Obstacle o: obs) {
            if(o.type.equals("coin")) {
                int coinKey = o.x * 1000 + o.y;
                if (!collectedCoins.contains(coinKey)) {
                    if (marioX >= o.x - 2 && marioX <= o.x +2 && marioBottom >= o.y && marioTop <= o.y) {
                        coins++;
                        collectedCoins.add(coinKey);
                    }
                }
            }
        }
    }

    class Enemy {
        int x, y, direction;

        Enemy(int x, int y, int direction) {
            this.x = x;
            this.y = y;
            this.direction = direction;
        }
    }

    ArrayList<Enemy> enemies = new ArrayList<>();

    private static void renderGame() {
        // Move cursor to top-left and clear from cursor
        System.out.print("\u001B[h");

        // Draw SKY
        for (int i = 0; i < GAME_HEIGHT; i++) {
            for (int j = 0; j < GAME_WIDTH; j++) {
                screen[i][j] = SKY;
            }
        }

        // Draw GROUND
        for (int x = 0; x < GAME_WIDTH; x++) {
            screen[GROUND_ROW][x] = GROUND;
        }

        // Draw obstacles
        ArrayList<Obstacle> obs = displayObstacles();
        for (Obstacle o : obs) {
            int screenX = o.x - cameraX;
            if (screenX >= 0 && screenX < GAME_WIDTH) {
                if (o.type.equals("platform")) {
                    for (int w = 0; w < o.width && screenX + w < GAME_WIDTH; w++) {
                        if (o.y < GAME_HEIGHT) {
                            screen[o.y][screenX + w] = PLATFORM;
                        }
                    }
                } else if (o.type.equals("coin")) {
                    int coinKey = o.x * 1000 + o.y;
                    if (!collectedCoins.contains(coinKey) && o.y < GAME_HEIGHT) {
                        screen[o.y][screenX] = COIN;
                    }
                } else if (o.type.equals("block")) {
                    for (int w = 0; w < o.width && screenX + w < GAME_WIDTH; w++) {
                        if (o.y < GAME_WIDTH) {
                            screen[o.y][screenX + w] = BLOCK;
                        }
                    }
                }
            }
        }

        // Draw Mario
        int marioScreenX = mario_position - cameraX;
        int marioBottomRow = GROUND_ROW;
        int marioTopRow = marioBottomRow - (MARIO_HEIGHT - 1);

        if (marioScreenX >= 0 && marioScreenX + MARIO_WIDTH <= GAME_WIDTH) {
            for (int row = 0; row < MARIO_HEIGHT; row++) {
                int spriteRow = row + marioTopRow;
                if (spriteRow >= 0 && spriteRow < GAME_HEIGHT) {
                    screen[spriteRow][marioScreenX] = MARIO_SPRITE[row];
                }
            }
        }

        StringBuilder output = new StringBuilder();

        output.append(ConsoleColors.CYAN).append("=".repeat(GAME_WIDTH)).append(ConsoleColors.RESET);
        output.append(ConsoleColors.WHITE + "SUPER MARIO TERMINAL GAME" + ConsoleColors.RESET);
        output.append(ConsoleColors.CYAN).append("=".repeat(GAME_WIDTH)).append(ConsoleColors.RESET);

        for (int y = 0; y < GAME_HEIGHT; y++) {
            for (int x = 0; x < GAME_WIDTH; x++) {
                output.append(screen[y][x]);
            }
            output.append(ConsoleColors.RESET);
        }
        output.append(String.format(ConsoleColors.YELLOW + "Coins: %d | Position: %d" + ConsoleColors.RESET, coins, mario_position));

        System.out.print(output.toString());
        System.out.flush();
    }

    private static void startGameLoop() {
        // Clear screen
        System.out.print("\u001B[2J\u001B[H");
        System.out.flush();

        long lastTime = System.currentTimeMillis();
        int frameDelay = 100; // 100ms = 10 FPS

        while (isRunning) {
            long currentTime = System.currentTimeMillis();

            if (currentTime - lastTime >= frameDelay) {
                updatePhysics();
                renderGame();
                lastTime = currentTime;
            }

            try {
                Thread.sleep(10); // Prevent CPU spinning
            } catch (InterruptedException e) {
                break;
            }
        }
    }
}

class ConsoleColors {
    // Reset
    public static final String RESET = "\033[0m"; // Text Reset

    // Regular Colors
    public static final String BLACK = "\033[0;30m"; // BLACK
    public static final String RED = "\033[0;31m"; // RED
    public static final String GREEN = "\033[0;32m"; // GREEN
    public static final String YELLOW = "\033[0;33m"; // YELLOW
    public static final String BLUE = "\033[0;34m"; // BLUE
    public static final String PURPLE = "\033[0;35m"; // PURPLE
    public static final String CYAN = "\033[0;36m"; // CYAN
    public static final String WHITE = "\033[0;37m"; // WHITE

    // Bold
    public static final String BLACK_BOLD = "\033[1;30m"; // BLACK
    public static final String RED_BOLD = "\033[1;31m"; // RED
    public static final String GREEN_BOLD = "\033[1;32m"; // GREEN
    public static final String YELLOW_BOLD = "\033[1;33m"; // YELLOW
    public static final String BLUE_BOLD = "\033[1;34m"; // BLUE
    public static final String PURPLE_BOLD = "\033[1;35m"; // PURPLE
    public static final String CYAN_BOLD = "\033[1;36m"; // CYAN
    public static final String WHITE_BOLD = "\033[1;37m"; // WHITE

    // Underline
    public static final String BLACK_UNDERLINED = "\033[4;30m"; // BLACK
    public static final String RED_UNDERLINED = "\033[4;31m"; // RED
    public static final String GREEN_UNDERLINED = "\033[4;32m"; // GREEN
    public static final String YELLOW_UNDERLINED = "\033[4;33m"; // YELLOW
    public static final String BLUE_UNDERLINED = "\033[4;34m"; // BLUE
    public static final String PURPLE_UNDERLINED = "\033[4;35m"; // PURPLE
    public static final String CYAN_UNDERLINED = "\033[4;36m"; // CYAN
    public static final String WHITE_UNDERLINED = "\033[4;37m"; // WHITE

    // Background
    public static final String BLACK_BACKGROUND = "\033[40m"; // BLACK
    public static final String RED_BACKGROUND = "\033[41m"; // RED
    public static final String GREEN_BACKGROUND = "\033[42m"; // GREEN
    public static final String YELLOW_BACKGROUND = "\033[43m"; // YELLOW
    public static final String BLUE_BACKGROUND = "\033[44m"; // BLUE
    public static final String PURPLE_BACKGROUND = "\033[45m"; // PURPLE
    public static final String CYAN_BACKGROUND = "\033[46m"; // CYAN
    public static final String WHITE_BACKGROUND = "\033[47m"; // WHITE

    // High Intensity
    public static final String BLACK_BRIGHT = "\033[0;90m"; // BLACK
    public static final String RED_BRIGHT = "\033[0;91m"; // RED
    public static final String GREEN_BRIGHT = "\033[0;92m"; // GREEN
    public static final String YELLOW_BRIGHT = "\033[0;93m"; // YELLOW
    public static final String BLUE_BRIGHT = "\033[0;94m"; // BLUE
    public static final String PURPLE_BRIGHT = "\033[0;95m"; // PURPLE
    public static final String CYAN_BRIGHT = "\033[0;96m"; // CYAN
    public static final String WHITE_BRIGHT = "\033[0;97m"; // WHITE

    // Bold High Intensity
    public static final String BLACK_BOLD_BRIGHT = "\033[1;90m"; // BLACK
    public static final String RED_BOLD_BRIGHT = "\033[1;91m"; // RED
    public static final String GREEN_BOLD_BRIGHT = "\033[1;92m"; // GREEN
    public static final String YELLOW_BOLD_BRIGHT = "\033[1;93m";// YELLOW
    public static final String BLUE_BOLD_BRIGHT = "\033[1;94m"; // BLUE
    public static final String PURPLE_BOLD_BRIGHT = "\033[1;95m";// PURPLE
    public static final String CYAN_BOLD_BRIGHT = "\033[1;96m"; // CYAN
    public static final String WHITE_BOLD_BRIGHT = "\033[1;97m"; // WHITE

    // High Intensity backgrounds
    public static final String BLACK_BACKGROUND_BRIGHT = "\033[0;100m";// BLACK
    public static final String RED_BACKGROUND_BRIGHT = "\033[0;101m";// RED
    public static final String GREEN_BACKGROUND_BRIGHT = "\033[0;102m";// GREEN
    public static final String YELLOW_BACKGROUND_BRIGHT = "\033[0;103m";// YELLOW
    public static final String BLUE_BACKGROUND_BRIGHT = "\033[0;104m";// BLUE
    public static final String PURPLE_BACKGROUND_BRIGHT = "\033[0;105m"; // PURPLE
    public static final String CYAN_BACKGROUND_BRIGHT = "\033[0;106m"; // CYAN
    public static final String WHITE_BACKGROUND_BRIGHT = "\033[0;107m"; // WHITE
}
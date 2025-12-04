import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.concurrent.ThreadLocalRandom;

public class game {
    static int mario_position = 0;
    static int marioY = 0;
    static int coins = 0;
    static int cameraX = 0;
    static boolean isRunning = true;

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
        Thread inpuThread = new Thread(() -> {
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
        inpuThread.setDaemon(true);     // Safe accesss shared resources
        inpuThread.start();

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

    private static void generateObstacles() {
        int blocks = 10;
        int platforms = 10;

        for (int x = 0; x < GAME_WIDTH; x++) {
            screen[GROUND_ROW][x] = ConsoleColors.RED_BACKGROUND_BRIGHT + " ";
        }

        // BLOCK
        for (int y = 0; y < blocks; y++) {
            int length = ThreadLocalRandom.current().nextInt(3, 6);
            int positionx = ThreadLocalRandom.current().nextInt(GAME_WIDTH - length);
            int positiony = GROUND_ROW - ThreadLocalRandom.current().nextInt(4, 6);
            for (int x = 0; x < length; x++) {
                if (screen[positiony][positionx + x].equals(SKY)) {
                    screen[positiony][positionx] = BLOCK;
                }
            }
        }

        // PLATFORM
        for (int y = 0; y < platforms; y++) {
            int height = ThreadLocalRandom.current().nextInt(2, 4);
            int positionx = ThreadLocalRandom.current().nextInt(GAME_WIDTH);
            int positiony = ThreadLocalRandom.current().nextInt(GAME_HEIGHT - height);
            for (int x = 0; x < height; x++) {
                if (screen[positiony + x][positionx].equals(SKY)) {
                    screen[positiony + x][positionx] = PLATFORM;
                }
            }
        }
    }

    private static void generateCoins() {
        screen[4][10] = COIN;
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

    private static void placeMario() {
        int marioBottomRow = GROUND_ROW;
        int marioTopRow = marioBottomRow - (MARIO_HEIGHT - 1);

        for (int row = marioTopRow; row <= marioBottomRow; row++) {
            int spriteRow = row - marioTopRow;
            for (int col = 0; col < MARIO_WIDTH; col++) {
                screen[row][mario_position + col] = MARIO_SPRITE[spriteRow];
                col += MARIO_WIDTH - 1;
            }
        }
    }

    private static void renderGame() {
        for (int i = 0; i < GAME_HEIGHT; i++) {
            for (int j = 0; j < GAME_WIDTH; j++) {
                screen[i][j] = SKY;
            }
        }

        generateObstacles();
        generateCoins();
        placeMario();

        for (int y = 0; y < GAME_HEIGHT; y++) {
            for (int x = 0; x < GAME_WIDTH; x++) {
                System.out.print(screen[y][x]);
            }
            System.out.println(ConsoleColors.RESET);
        }
    }

    private static void startGameLoop() {
        Scanner input = new Scanner(System.in);
        while (true) {
            renderGame();
            try {
                Thread.sleep(100);
            } catch (Exception e) {
                break;
            }
        }
        input.close();
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
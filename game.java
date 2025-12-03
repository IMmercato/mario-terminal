import java.util.concurrent.ThreadLocalRandom;

public class game {
    final static String MARIO_SPRITE[] = {
            ConsoleColors.RED_BACKGROUND + " M " + ConsoleColors.RESET,
            (ConsoleColors.YELLOW + ConsoleColors.WHITE_BACKGROUND) + "( )" + ConsoleColors.RESET,
            ConsoleColors.BLUE_BACKGROUND + "H H" + ConsoleColors.RESET,
            ConsoleColors.BLUE_BACKGROUND + "| |" + ConsoleColors.RESET
    };
    final static String SKY = ConsoleColors.BLUE_BACKGROUND_BRIGHT + " ";
    final static String BLOCK = ConsoleColors.RED_BOLD + "#";
    final static String PLATFORM = ConsoleColors.RED_BOLD_BRIGHT + "=";
    final static String COIN = ConsoleColors.YELLOW + "o";

    final static int GAME_HEIGHT = 8;
    final static int GAME_WIDTH = 50;
    final static int MARIO_WIDTH = 3;
    final static int MARIO_HEIGHT = MARIO_SPRITE.length;
    final static int GROUND_ROW = 7;
    static int mario_position = 0;

    static String[][] screen = new String[GAME_HEIGHT][GAME_WIDTH];

    public static void main(String[] args) {
        startGameLoop();
    }

    private static void generateObstacles() {
        int obstacles = 20;

        for (int i = 0; i < obstacles; i++) {
            int positionx = ThreadLocalRandom.current().nextInt(GAME_WIDTH);
            int positiony = ThreadLocalRandom.current().nextInt(GAME_HEIGHT);

            if (ThreadLocalRandom.current().nextBoolean()) {
                screen[positiony][positionx] = BLOCK;
            } else {
                screen[positiony][positionx] = PLATFORM;
            }
        }
    }

    private static void generateCoins() {
        screen[4][10] = COIN;
    }

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
        renderGame();
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
import java.util.Scanner;
import java.util.Random;

/**
 * A simple Rock, Paper, Scissors game where the user plays against the computer.
 * The user inputs their choice, and the computer randomly selects its choice.
 * The game then determines the winner based on the rules of Rock, Paper, Scissors.
 */
public class RockPaperScissors {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();

        String[] choices = {"rock", "paper", "scissors"}; //Array should lower case because user input is converted to lower case

        System.out.println("Chose your move: Rock, Paper, or Scissors");
        String userChoice = scanner.nextLine().toLowerCase();

        if(!userChoice.equals("rock") && !userChoice.equals("paper") && !userChoice.equals("scissors")) {
            System.out.println("Invalid choice! Please choose Rock, Paper, or Scissors.");
            return;
        }

        String computerChoice = choices[random.nextInt(3)];
        System.out.println("Computer chose: " + computerChoice);

        if (userChoice.equals(computerChoice)) {
            System.out.println("It's a draw!");
        } else if (
                (userChoice.equals("rock") && computerChoice.equals("scissors")) ||
                        (userChoice.equals("scissors") && computerChoice.equals("paper")) ||
                        (userChoice.equals("paper") && computerChoice.equals("rock"))
        ) {
            System.out.println("You win!");
        } else {
            System.out.println("You lose!");
        }
        scanner.close();
    }
}

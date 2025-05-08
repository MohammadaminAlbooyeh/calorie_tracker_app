import random


class RockPaperScissors:
    def __init__(self):
        self.choices = ['rock', 'paper','scissors']
    
    def get_player_choice(self):
        player_choice = input("Enter your choice (rock, paper, scissors): ")
        if player_choice.lower() in self.choices:
            return player_choice.lower()
        
        print("Invalid choice. Please try again.")
        return self.get_player_choice()
    
    def get_computer_choice(self):
        return random.choice(self.choices)

    def determine_winner(self, player_choice, computer_choice):
        if player_choice == computer_choice:
            print("It's a tie!")
            return 'It is a tie!'
        
        if (player_choice == 'rock' and computer_choice =='scissors'
            or player_choice == 'paper' and computer_choice == 'rock'
            or player_choice =='scissors' and computer_choice == 'paper'):
            print("You win!")
        else:
            print("Computer wins!")

    def play(self):
        player_choice = self.get_player_choice()
        computer_choice = self.get_computer_choice()
        print(f"You chose {player_choice}, computer chose {computer_choice}.")
        winner_msg = self.determine_winner(player_choice, computer_choice)
        print(winner_msg)

if __name__ == '__main__':
    game = RockPaperScissors()

    while True:
        game.play()

        continue_game = input("Do you want to play again? (enter any key to continue, 'q' to exit): ")
        if continue_game.lower() == 'q':
            break

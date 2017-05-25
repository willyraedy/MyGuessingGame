$(document).ready(function() {

function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
    
}

function shuffle(arr) {
    var n = arr.length, last, current;

    while(n) {

        current = Math.floor(Math.random() * n--);

        last = arr[n];
        arr[n] = arr[current];
        arr[current] = last;

    }

    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {

    return Math.abs(this.playersGuess - this.winningNumber )

}

Game.prototype.directionHint = function() {
    if(this.playersGuess < this.winningNumber) {
        return 'Try guessing higher :-)';
    } else {
        return 'Try guessing lower :-)';
    }
}

Game.prototype.playersGuessSubmission = function(guess) {

    if(typeof guess === 'number' && guess >= 1 && guess <= 100) {
        this.playersGuess = guess;
        return this.checkGuess();
    } else {
        throw "That is an invalid guess."
    }

}

Game.prototype.checkGuess = function() {

    if(this.playersGuess === this.winningNumber) {
        //document.getElementById('submit').setAttribute('disabled', 'true');
        $('#submit, #hint-btn').prop('disabled', 'true')
        $('body').removeClass('game-play').addClass('winning');
        $(document).off('keyup', submitGuessEnter);
        return ['You Win!', 'Hit the reset button to play again!'];
        
    } else if(this.pastGuesses.includes(this.playersGuess)) {
        return ['Wooooooops!','You have already guessed that number. Guess again!'];
    } else {

        this.pastGuesses.push(this.playersGuess);
        var currentGuessIdx = this.pastGuesses.length;
        $('#guesses li:nth-child(' + currentGuessIdx + ')').text(this.playersGuess);

        if(this.pastGuesses.length === 5) {
            //document.getElementById('submit').setAttribute('disabled', 'true');
            $('#submit, #hint-btn').prop('disabled', 'true')
            $(document).off('keyup', submitGuessEnter);
            return ['You Lose! The winning number waz ' + this.winningNumber, 'Hit the reset button to play again!'];
           
        } else if(this.difference() < 10) {
            return ['You\'re burning up!', this.directionHint()];
        } else if(this.difference() < 25) {
            return ['You\'re lukewarm.', this.directionHint()];
        } else if(this.difference() < 50) {
            return ['You\'re a bit chilly.', this.directionHint()];
        } else {
            return ['You\'re ice cold!', this.directionHint()];
        }
    }

}

var newGame = function() {
    return new Game;
}

Game.prototype.provideHint = function() {

    var array = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];

    return shuffle(array);

}

    function submitGuessEnter() {
        if(event.keyCode === 13) {
            submitGuess();
        }
    }


// jQuery stuff
    var newGame = new Game();

    function submitGuess() {
        var userGuess = +$('#player-input').val();
        $('#player-input').val(''); //why won't '#' work but '' will?
        var textArr = newGame.playersGuessSubmission(userGuess);
        $('h1').text(textArr[0]);
        $('h2').text(textArr[1]);
    }



    $(document).on('keyup', submitGuessEnter);


// Allow the user to submit
    $('#submit').click(submitGuess);
    
    $('#hint-btn').click(function() {
        var hintArr = newGame.provideHint();
        $('h1').text('The number could be ' + hintArr[0] + ', ' + hintArr[1] + ', or ' + hintArr[2] + '!');
        $('h2').text('Feeling lukcy?');

    })

$('#reset').click(function() {
    newGame = new Game;
    $('h1').text('Can you find the code?');
    $('h2').text('Guess the correct number between 1-100 and unlock the unholy jackelope!');
    $('#guesses li').text('?');
    $('#hint-btn, #submit').prop('disabled',false);
    $('body').removeClass('winning').addClass('game-play');
    $(document).on('keyup', submitGuessEnter);

});

})
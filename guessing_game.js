$(document).ready(function() {
	var subButton = $('button').filter('.submit');
	var opButton = $('button').filter('.option');
	// For some reason, I was unable to access the data 
	// attribute when assigned to a div tag
	var initRem = +$('form').find('p').data('rem'); 
	var remGuess = +$('form').find('p').data('rem');
	var guesses = [];
	var won, winNum, guessDiff, pGuess, hintRange;
	genWinNum(); // when attempting to implement a IIFE, I cannot call genWinNum elsewhere
	$('h1').fadeIn(1300);
	subButton.on('mouseenter', subHighlight);
	subButton.on('mouseleave', subHighlight);
	opButton.on('mouseenter', opHighlight);
	opButton.on('mouseleave', opHighlight);
	// Submit button only considers valid guesses
	$('#input').find('.submit').on('click', function() {
		submitGuess();
	});
	// The 'Play Again' button is like a reset button
	// It resets the input field as well as the remaining guesses and unlocks submit button 
	// Does NOT generate a new winning number UNLESS user has already won
	$('#play-again').on('click', function() {
		if (won) { 
			genWinNum()
		}
		remGuess = initRem;
		$('#rem').text(remGuess);
		$('p').filter('.hint').slideUp();
		$('p').filter('.winner').slideUp();
		$('p').filter('.guesses').slideDown();
		guesses = [];
		subButton.prop('disabled',false);
		clearInput();
	});
	// Hint button will alert user of how close the guess is to the winning number
	// Chose 20 as I felt this was appropriate
	$('#hint').on('click', function() {
		if (!validGuess()) {
			alert('Please enter a number from 1-100');
		} else if (won) {
			alert('You already won!\nPlease press "Play Again" below if you would like to do so');
		} else {
			var hint = genHints();
			$('p').filter('.hint').text('The answer is one of the following: '+hint);
			$('p').filter('.hint').slideDown();
		}
	});
	// Check if guess is a valid number
	function genHints() {
		var hint = [winNum];
		for (var i = 0; i < remGuess; i++) {
			var num = hint[0];
			while (hint.indexOf(num) > -1) {
				num = genRandInt(hintRange[0],hintRange[1]);
			}
			hint.push(num);
		}
		console.log(hint);
		return hint.sort(function(a,b) {return a-b;}).join(', ');
	}
	// Obtain guess from input field
	function submitGuess() {
		pGuess = +$('#guess').val();
		if (!validGuess()) {
			alert('Please enter a number from 1-100');
		} else if (guesses.indexOf(pGuess) > -1 && guesses.length > 0) {
			alert('You have already guessed this number\nPrevious guesses: '+guesses.join(', '));
		} else {
			remUpdate();
			compareGuess();
			guesses.push(pGuess);
		}
	}
	function validGuess() {
		return pGuess >= 1 && pGuess <= 100 && pGuess !== NaN;
	}
	// Generate winning number 
	function genWinNum() {
		winNum = genRandInt(1, 100);
		console.log(winNum); // Remove this
		won = false;
	};
	// Compare guess and alert user if correct 
	// Also disables the submit button
	function userFeedback() {
		var absGuessDiff = Math.abs(winNum - pGuess);
		var guessGreater = pGuess > winNum; 
		console.log('pGuess: '+pGuess+' | winNum: '+winNum+' | absGuessDiff: '+absGuessDiff);
		if (absGuessDiff < 10) {
			alert('Your guess is within 10 digits of the winning number!');
			hintRange = [Math.max(pGuess-9,1), Math.min(pGuess+9,100)];
		} else if (absGuessDiff <= 20) {
			alert('Your guess is within 20 digits '+(guessGreater ? 'higher' : 'lower')+' than the winning number');
			hintRange = [pGuess, (guessGreater ? Math.max(1, pGuess-20) : Math.min(20+pGuess, 100))].sort(function(a,b) {return a-b;});
		} else {
			alert('Your guess is more than 20 digits '+(guessGreater ? 'higher' : 'lower')+' than the winning number');
			hintRange = [(guessGreater ? 1 : 100), (guessGreater ? Math.max(1, pGuess-21) : Math.min(100, pGuess+21))].sort(function(a,b) {return a-b;});
		}
		console.log(hintRange);
	}
	// Random number generator with min and max
	function genRandInt(min, max) {
		return Math.floor(Math.random() * (max-min) + min); 
	}
	// Compare guesses and evaluate
	function compareGuess() {
		if (pGuess === winNum) {
			disableSub();
			won = true;
			alert('Congratulations! You guessed the right number: '+winNum+'!')
			$('p').filter('.guesses').slideUp();
			$('p').filter('.hint').slideUp();
			$('p').filter('.hint').after('<p class="winner">Congratulations! You WON!</p>');
		} else {
			clearInput();
			userFeedback();
		}
	};
	// Updates the remaining guess figure in the <p> tag
	function remUpdate() {
		if (remGuess-1 > 0 && remGuess-1 !== NaN) {
			remGuess--;
			$('#rem').text(remGuess);
		} else {
			$('#rem').text('None');
			alert('You do not have any remaining guesses\nPlease press "Play Again" below if you would like to do so');
			disableSub();
		}
	};
	// Resets the input field
	function clearInput() {
		$('#input').find('input').remove();
		$('#input').prepend('<input type="number" id="guess" placeholder="Enter number 1-100"/>');
	}
	// Function disables submit button
	function disableSub() {
		subButton.addClass('submit');
		subButton.removeClass('submit-highlight');
		subButton.prop('disabled',true);
	};
	// Functions below provide user feedback with buttons
	function subHighlight() {
		$(this).toggleClass('submit');
		$(this).toggleClass('submit-highlight');
	};
	function opHighlight() {
		$(this).toggleClass('option');
		$(this).toggleClass('option-highlight');	
	};
});
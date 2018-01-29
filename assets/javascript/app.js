$(document).ready(function() {

	var userGuess;
	var answer;
	var answerText = "";
	var x = 0;
	var questionList = 9;
	var winCount = 0;
	var lossCount = 0;
	var intervalId;
	var timeLeft = 24;
	var timerRunning = false;


	$(".answer").hide();
	$(".time").hide();

	//API for questions
	var queryURL = "https://qriusity.com/v1/categories/1/questions?page=" + questionList + "&limit=20";

	$.ajax({
	    url: queryURL,
	    method: "GET"
	}).then(function(response) {
		//question Object
		console.log(response);

		//Countdown timer
		function timerCount() {
			timeLeft--;
			$("#timerCount").text(timeLeft)
			console.log(timeLeft)

			if (timeLeft === 0) {

				timerRunning = false
				timeUp();

			}


		}

		//Time's up and Reset
		function timeUp() {
			clearInterval(intervalId);

			$(".answer").hide();
			$(".time").show();

			$("#currentQuestion").text("Time's Up! You had " + winCount + " questions correct and " + lossCount + " questions incorrect.  Game will restart in 5 sec . . .");
			$("#1").text("");
			$("#2").text("");
			$("#3").text("");
			$("#4").text("");

			setTimeout(function(){

				timeLeft = 24;
				winCount = 0;
				lossCount = 0;
				questionList++;
				$("#timerCount").text(timeLeft);
				x = 0;

				nextQuestion();

				intervalId = setInterval(timerCount, 1000);
				timerRunning = true
				
				//For here, need to figure out how to get the Ajax to reset to the new questionList value the timer 
					//and then reset x to 0 to start at beginning of new list
      		
      		}, 5000);


		}

		//function for question creation from API and write to page, also answer (number) save
		function nextQuestion() {
			$(".answer").show();
			$(".time").show();

			$("#currentQuestion").text(response[x].question);
			$("#1").text(response[x].option1);
			$("#2").text(response[x].option2);
			$("#3").text(response[x].option3);
			$("#4").text(response[x].option4);

			answer = response[x].answers;
			
			answerText = (response[x].option + answer);

		}

		document.onkeyup = function(start) {

			if (start.keyCode == 32 && timerRunning == false) {

				//timer
				intervalId = setInterval(timerCount, 1000);
				timerRunning = true

				//create first question
				nextQuestion();

				//on click for answers
				$("body").on("click", ".answer", function(event) {
					
					//sets userGuess to click
					userGuess = event.target.id;
					// console.log(userGuess);
					// console.log(answers);

					//Correct guess
					if (userGuess == answer) {

						clearInterval(intervalId);

						winCount++;
						x++;

						$(".answer").hide();
						$(".time").hide();

						$("#currentQuestion").text("Correct! The answer was option " + answer + ", '" + answerText + "'");
						$("#1").text("");
						$("#2").text("");
						$("#3").text("");
						$("#4").text("");

						console.log("Wins: " + winCount);
						console.log("Losses: " + lossCount);
						console.log("Now on Question: " + x);

						setTimeout(function(){
						
						nextQuestion();

						intervalId = setInterval(timerCount, 1000);


      					}, 2000);


					//Incorrect guess
					} else {

						clearInterval(intervalId);


						lossCount++;
						x++;

						$(".answer").hide();
						$(".time").hide();

						$("#currentQuestion").text("Wrong! The answer was option " + answer + ", '" + answerText + "'");
						$("#1").text("");
						$("#2").text("");
						$("#3").text("");
						$("#4").text("");

						console.log("Wins: " + winCount);
						console.log("Losses: " + lossCount);
						console.log("Now on Question: " + x);

						setTimeout(function(){
						
						nextQuestion();

						intervalId = setInterval(timerCount, 1000);


      					}, 2000);

					}


				});

			}

		}


	});



});

$(document).ready(function() {

	var userGuess;
	var answer;
	var answerText = "";
	var x = 0;
	var questionList = 10;
	var winCount = 0;
	var lossCount = 0;
	var intervalId;
	var timeLeft = 24;
	var timerRunning = false;


	$(".answer").hide();
	$(".time").hide();
	$(".fail").hide();
	$(".success").hide();

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

		//Time's up and 5 second Reset
		function timeUp() {
			clearInterval(intervalId);

			var buzzerAudio = document.createElement("audio");
			buzzerAudio.setAttribute("src", "http://www.wavsource.com/snds_2018-01-14_3453803176249356/sfx/buzzer_x.wav");
			buzzerAudio.play();

			$(".answer").hide();
			$(".time").show();
			$(".fail").hide();
			$(".success").hide();
			
			$("#currentQuestion").text("Game Over! You had " + winCount + " questions correct and " + lossCount + " questions incorrect.  Game will restart in 5 sec . . .");
			$("#1").text("");
			$("#2").text("");
			$("#3").text("");
			$("#4").text("");

			//after 5 seconds, reset
			setTimeout(function(){

				timeLeft = 24;
				winCount = 0;
				lossCount = 0;
				questionList++;
				$("#timerCount").text(timeLeft);
				x = 0;

				//For here, need to figure out how to get the Ajax to reset to the new questionList value



				nextQuestion();


				intervalId = setInterval(timerCount, 1000);
				timerRunning = true
				
      		
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
			
			answerText = (response[x]["option" + answer]);

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

						$(".success").show();

						var correctAudio = document.createElement("audio");
						correctAudio.setAttribute("src", "");
						correctAudio.play();

						$("#currentQuestion").text("Correct! The answer was Number " + answer + ", '" + answerText + "'");
						$("#1").text("");
						$("#2").text("");
						$("#3").text("");
						$("#4").text("");

						console.log("Wins: " + winCount);
						console.log("Losses: " + lossCount);
						console.log("Now on Question: " + x);

						if ((winCount + lossCount) >= 20) {

							timerRunning = false;
							timeUp();

						} else {

							setTimeout(function(){
							
							nextQuestion();
							$(".success").hide();

							intervalId = setInterval(timerCount, 1000);


	      					}, 2000);
	      				}


					//Incorrect guess
					} else {

						clearInterval(intervalId);


						lossCount++;
						x++;

						$(".answer").hide();
						$(".time").hide();

						$(".fail").show();

						var incorrectAudio = document.createElement("audio");
						incorrectAudio.setAttribute("src", "");
						incorrectAudio.play();

						$("#currentQuestion").text("Wrong! The answer was Number " + answer + ", '" + answerText + "'");
						$("#1").text("");
						$("#2").text("");
						$("#3").text("");
						$("#4").text("");

						console.log("Wins: " + winCount);
						console.log("Losses: " + lossCount);
						console.log("Now on Question: " + x);

						if ((winCount + lossCount) >= 20) {

							timerRunning = false;
							timeUp();


						} else {
							setTimeout(function(){
							
							nextQuestion();
							$(".fail").hide();

							intervalId = setInterval(timerCount, 1000);


	      					}, 2000);

	      				}

					}


				});

			}

		}


	});



});

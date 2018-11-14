$(document).ready(function()
{
	var config = {
		apiKey: "AIzaSyB8U_u3TJEWQED2ODD2Nk5Xjv_062cQDYU",
		authDomain: "trainscheduler-e89b1.firebaseapp.com",
		databaseURL: "https://trainscheduler-e89b1.firebaseio.com",
		projectId: "trainscheduler-e89b1",
		storageBucket: "trainscheduler-e89b1.appspot.com",
		messagingSenderId: "264951961407"
	};
	
	firebase.initializeApp(config);


	//Direct Link to my firebase Train Scheduler
	var trainInfo = firebase.database().ref();

	//Button adds train name, destination, time and frequency to the list
	$('#submitButton').on('click', function(){
		//Grab user input. Cuts out the white space.
		var train = $('#trainNameInput').val().trim();
		var destination = $('#destinationInput').val().trim();
		var time = moment($('#timeInput').val().trim(), "HH:mm").format("");
		var frequency = $('#frequencyInput').val().trim();

		//Local Object to hold inputs
		var newTrains = {
			trainName: train,
			trainDestination: destination,
			trainFirst: time,
			trainFreq: frequency,
		}

		//Push Local Object above into the firebase.
		trainInfo.push(newTrains);

/* 		//Check to make sure inputs are logging into the console
		console.log(newTrains.trainName);
		console.log(newTrains.trainDestination);
		console.log(newTrains.trainFirst);
		console.log(newTrains.trainFreq); */

		//Let's user know that a train was added into the list
		alert("Train successfully added");

		//Clears form boxes for new user inputs
		$('#trainNameInput').val("");
		$('#destinationInput').val("");
		$('#timeInput').val("");
		$('#frequencyInput').val("");

		// Prevents page from refreshing
		return false;
	});

	//When new entries are added, this function runs
	trainInfo.on("child_added", function(Snapshot, Key){

		//Stores everything into variables
		var train = Snapshot.val().trainName;
		var destination = Snapshot.val().trainDestination;
		var time = Snapshot.val().trainFirst;
		var frequency = Snapshot.val().trainFreq;
/* 
		//Check that it's storing
		console.log(train);
		console.log(destination);
		console.log(time);
		console.log(frequency);
 */
		//current time
		var currentTime = moment();

		//convert time
		var timeConverted = moment(currentTime, "HH:mm").subtract(1, "years");
		
		//difference between the times
		var diffTime = moment().diff(moment(timeConverted), "minutes");
		

		//time apart (modulus)
		var timeRemainder = diffTime % frequency;
		

		//minute until train
		var minutesTillTrain = frequency - timeRemainder;
		

		//next train
		var nextTrain = moment().add(minutesTillTrain, "minutes");
		var nextTrainConverted = moment(nextTrain).format("hh:mm a");
		

		//add each train into table
		$("#trainTimeTable > tbody").append("<tr><td>" + train + "</td><td>" + destination + "</td><td>" + "Every " + frequency + " minutes" + "</td><td>" + nextTrainConverted + "</td><td>" + minutesTillTrain + "</td></tr>");

	});
});
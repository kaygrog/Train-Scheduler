var config = {
  apiKey: "AIzaSyBtP6PlYQr14claFa70aCLb2wZXLN3i0FQ",
  authDomain: "coding-bootcamp-2.firebaseapp.com",
  databaseURL: "https://coding-bootcamp-2.firebaseio.com",
  projectId: "coding-bootcamp-2",
  storageBucket: "coding-bootcamp-2.appspot.com",
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

document.getElementById("submit-button").onclick = function (event) {
  // Prevent page from refreshing upon button click
  event.preventDefault();

  // Initialize variables
  var trainName = "";
  var destination = "";
  var frequency = 0;
  var minutesAway = 0;
  var firstTrainTime = { full: [], hour: 0, minute: 0 };
  var currentTime = { full: [], hour: 0, minute: 0 };
  var nextArrival = {
    hour: 0,
    minute: 0,
    textHour: "",
    textMinute: "",
    textFull: "",
  };

  // Grab user input data
  trainName = document.getElementById("train-name").value;
  destination = document.getElementById("destination").value;
  frequency = Number(document.getElementById("frequency").value);
  firstTrainTime.full = document
    .getElementById("first-train-time")
    .value.split(":");
  firstTrainTime.hour = Number(firstTrainTime.full[0]);
  firstTrainTime.minute = Number(firstTrainTime.full[1]);

  // Get the currentTime
  currentTime.full = moment().format("hh:mm").split(":");
  currentTime.minute = Number(currentTime.full[1]);
  currentTime.hour = Number(currentTime.full[0]);

  // Format to 24-hour time if currentTime is 1:00 PM or later
  if (moment().format("a") === "pm" && currentTime.hour !== 12) {
    currentTime.hour += 12;
  }

  // Get the # of minutes from 00:00 of currentTime and firstTrainTime for comparison
  var currentTimeMins = currentTime.hour * 60 + currentTime.minute;
  var firstTrainTimeMins = firstTrainTime.hour * 60 + firstTrainTime.minute;

  // Calculate nextArrival and minutesAway
  if (currentTimeMins < firstTrainTimeMins) {
    nextArrival.textFull =
      firstTrainTime.full[0] + ":" + firstTrainTime.full[1];
    minutesAway = firstTrainTimeMins - currentTimeMins;
  } else if (currentTimeMins >= firstTrainTimeMins) {
    var countMins = firstTrainTimeMins;
    while (countMins < currentTimeMins) {
      countMins += frequency;
    }

    // Convert countMins to HH:mm for nextArrival time
    nextArrival.hour = Math.floor(countMins / 60);
    nextArrival.minute = countMins % 60;
    nextArrival.textHour = nextArrival.hour;
    nextArrival.textMinute = nextArrival.minute;

    // Add extra 0s to text display of nextArrival time if applicable
    if (nextArrival.hour < 10) {
      nextArrival.textHour = "0" + nextArrival.hour;
    }
    if (nextArrival.minute < 10) {
      nextArrival.textMinute = "0" + nextArrival.minute;
    }

    nextArrival.textFull = nextArrival.textHour + ":" + nextArrival.textMinute;
    minutesAway = countMins - currentTimeMins;
  }

  // Create new object to store train in Firebase
  var newTrain = {
    trainName: trainName,
    destination: destination,
    frequency: frequency,
    nextArrival: nextArrival.textFull,
    minutesAway: minutesAway,
  };

  // Upload train data to Firebase
  database.ref().push(newTrain);

  // Clear form fields
  document.getElementById("train-name").value = "";
  document.getElementById("destination").value = "";
  document.getElementById("frequency").value = "";
  document.getElementById("first-train-time").value = "";
};

// Grab the train data that was stored in Firebase and add it to the html table
database.ref().on("child_added", function (childSnapshot) {
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var frequency = childSnapshot.val().frequency;
  var nextArrival = childSnapshot.val().nextArrival;
  var minutesAway = childSnapshot.val().minutesAway;

  // Create new HTML table row
  var newRow = document.createElement("tr");

  // Create new HTML table cell for trainName
  var trainNameHTML = document.createElement("td");
  trainNameHTML.innerHTML = trainName;

  // Create new HTML table cell for destination
  var destinationHTML = document.createElement("td");
  destinationHTML.innerHTML = destination;

  // Create new HTML table cell for frequency
  var frequencyHTML = document.createElement("td");
  frequencyHTML.innerHTML = frequency;

  // Create new HTML table cell for nextArrival
  var nextArrivalHTML = document.createElement("td");
  nextArrivalHTML.innerHTML = nextArrival;

  // Create new HTML table cell for minutesAway
  var minutesAwayHTML = document.createElement("td");
  minutesAwayHTML.innerHTML = minutesAway;

  // Append table cells to table row
  newRow.appendChild(trainNameHTML);
  newRow.appendChild(destinationHTML);
  newRow.appendChild(frequencyHTML);
  newRow.appendChild(nextArrivalHTML);
  newRow.appendChild(minutesAwayHTML);

  // Append table row to HTML
  document.getElementById("train-table").appendChild(newRow);
});

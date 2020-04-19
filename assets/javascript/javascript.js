// Initialize global variables
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

// Upon initial page load and when a value in Firebase changes, get data from Firebase
database.ref().on(
  "value",
  function (snapshot) {
    // Update table with all data stored in Firebase
  },
  function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);

document.getElementById("submit-button").onclick = function (event) {
  event.preventDefault();

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
};

// Initialize global variables
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var nextArrival = 0;
var minutesAway = 0;

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
  firstTrainTime = document.getElementById("first-train-time").value.split(":");
  frequency = document.getElementById("frequency").value;

  // Get the currentTime
  var currentTime = moment().format("hh:mm").split(":");

  // If the current hour equals the first train time hour
  if (currentTime[0] === firstTrainTime[0]) {
    // If the current minute equals or is greater than the first train time minute
    if (
      currentTime[1] === firstTrainTime[1] ||
      currentTime[1] > firstTrainTime[1]
    ) {
      calculateNextArrival();
    } else {
      nextArrival = firstTrainTime[0] + ":" + firstTrainTime[1];
    }
  }

  if (currentTime[0] < firstTrainTime[0]) {
  }

  var calculatedTime = currentTime.subtract(1, "hours").format("hh:mm");

  // Calculate nextArrival
};

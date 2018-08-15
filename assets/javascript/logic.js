var config = {
    apiKey: "AIzaSyAH30VXubfjaUU17ei15wGniUdYLLoDYh8",
    authDomain: "train-data-298f7.firebaseapp.com",
    databaseURL: "https://train-data-298f7.firebaseio.com",
    projectId: "train-data-298f7",
    storageBucket: "train-data-298f7.appspot.com",
    messagingSenderId: "748524509459"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  //---------------------------------------------------------

  $("#submit").on("click", function(event) {
    event.preventDefault();

    var trainName  = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var time = $("#time").val().trim();
    var frequency = parseInt($("#frequency").val().trim());

    database.ref().push({
        dataTrainName: trainName,
        dataDestination: destination,
        dataTime: time,
        dataFrequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  $("#submit").on("click", function(event) {
    $('#myForm')[0].reset();
  });

  database.ref().on("child_added", function(childSnapShot) {  

    var trainName  = childSnapShot.val().dataTrainName;
    var destination = childSnapShot.val().dataDestination;
    var time = childSnapShot.val().dataTime;
    var frequency = childSnapShot.val().dataFrequency;

    var timeConverted = moment(time, "hh:mm").subtract(1, "years");
  
    var currentTime = moment();
   
    var difference = moment().diff(moment(timeConverted), "minutes");

    var remainder = difference % frequency;

    var minutesAway = frequency - remainder;

    var arrivalTime = moment().add(minutesAway, "minutes");

    var newTr = $("<tr>");

    var nameDisplay = $("<td>").text(childSnapShot.val().dataTrainName);
    var destinationDisplay = $("<td>").text(childSnapShot.val().dataDestination);
    var frequencyDisplay = $("<td>").text(childSnapShot.val().dataFrequency);
    var arrivalDisplay = $("<td>").text(moment(arrivalTime).format("hh:mm"));
    var minutesDisplay = $("<td>").text(minutesAway);

    if(minutesAway == NaN) {
      var minutesDisplay = $("<td>").text("Unavailable");
    }

    newTr.append(nameDisplay, destinationDisplay, frequencyDisplay, arrivalDisplay, minutesDisplay);
    $("#information").append(newTr);

  }, function(errorObject) {
  });


  $("#clear").on("click", function() {
    database.ref().remove();
  });

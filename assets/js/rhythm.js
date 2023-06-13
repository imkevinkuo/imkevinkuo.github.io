var recordingBPM = false;
var recordingNotes = false;

var bpm = 0;
var interval = 0;
var beatOn = false;
var tick = new Audio('assets/tick.mp3');

var taps = [];
var NOTE_TYPES = [4, 3, 2.5, 2, 1.5, 1, 0.75, 0.5, 0.25, 0.33, 0.66];
var NOTE_NAMES = ["whole", "dottedhalf", "halfneighth", "half", "dottedquarter", "quarter", "dottedeighth", "eighth", "sixteenth", "2etriplet", "2qtriplet"];

var task;


$(document).ready(function () {
	$("#bpm").click(bpmButton);
	$("#beat").click(toggleBeat);
	$("#notate").click(notesButton);
	/* Open and close modal */
	$("#help").click(function() {
		displayModal();
	});
	window.onclick = function(event) {
		hideModal();
	};
});
function toggleBeat() {
	if (beatOn) {
		beatOn = false;
		$("#beat").css("opacity", 0.5);
	}
	else if (!recordingBPM && !recordingNotes && interval > 0) {
		beatOn = true;
		flashBeat();
	}
}
function flashBeat() {
	if (beatOn) {
		setTimeout(function() {flashBeat();}, interval-2);
		tick.play();
		if ($("#beat").css("opacity") == 1) {
			$("#beat").css("opacity", 0.5);
		}
		else {
			$("#beat").css("opacity", 1);
		}
	}
}
function hideModal() {
	if ($(".modal").css("opacity") == "1") {
		$(".modal").removeClass("active");
		setTimeout(function() {
			$(".modal").addClass("hidden");
		}, 400);
	}
}
function displayModal() {
	$(".modal").removeClass("hidden");
	$(".modal").addClass("active");
}
function createRipple() {
	var ripple = $("<div class='ripple'></div>").appendTo("body");
	setTimeout(function(){
		ripple.remove();
	}, 2000); 
}
function bpmButton() {
	if (recordingNotes) {
		$("#bpm").text("Finish notating before resetting BPM.");
	}
	else if (recordingBPM) {
		if (interval > 0) {
			recordingBPM = false;
			$(window).off("keydown touchstart");
			$("#bpm").html("BPM: " + bpm + "<br>Click to record new BPM.");
			toggleBeat();
		}
	}
	else {
		recordingBPM = 1;
		if (beatOn) {toggleBeat();}
		$("#bpm").text("Tap spacebar to the beat of your music.");
		var lastTap = 0;
		var intervalSum = 0; // intervalSum/totalTaps = averageInterval
		var totalTaps = 0;
		$(window).on("keydown touchstart", function( event ) {
			if (event.which == 32 || event.type == "touchstart") { // Spacebar
				createRipple();
				if (lastTap > 0) {
					totalTaps += 1;
					intervalSum += event.timeStamp - lastTap;
				}
				if (totalTaps > 1) {
					bpm = Math.round(60000/(intervalSum/totalTaps));
					interval = Math.round(60000/bpm);
					$("#bpm").html("BPM: " + bpm + "<br>Click to lock BPM."); // 60000ms in 1 minute
					$("#notate").html("2. Tap rhythm");
				}
				lastTap = event.timeStamp;
			}
		});
	}
}

function stopNotating() {
	recordingNotes = false;
	$(window).off("keydown touchstart");
	$("#notate").html("Done! <br>Click to record new rhythm.");
	parseTaps();
}
function notesButton(e) {
	if (recordingBPM) {
		$("#notate").html("Finish setting BPM first.");
	}
	else if (recordingNotes) {
		clearTimeout(task);
		taps.push(e.timeStamp);
		stopNotating();
	}
	else {
		if (bpm > 0) {
			recordingNotes = 1;
			taps = [];
			$("#notate").text("Tap the rhythm you want notated.");
			$(window).on("keydown touchstart", function( event ) {
				if (event.which == 32 || event.type == "touchstart") { // Spacebar
					createRipple();
					if (taps.length == 0) {
						$("#notate").html("Notating for 8 measures...<br>Click to stop early.");
						task = setTimeout(function(){
							stopNotating();
							taps.push(event.timeStamp + interval*32);
						}, interval*32);
					}
					taps.push(event.timeStamp);
				}
			});
		}
		else {
			$("#notate").text("Please set BPM first.");
			setTimeout(function(){
				$("#notate").text("2. Tap rhythm");
			}, 1000);
		}
	}
}

function parseTaps() {
	//console.log(taps);
	var notes = [];
	var delays = [];
	console.log(taps);
	for (var i = 1; i < taps.length; i++) {
		delays.push(taps[i] - taps[i-1]);
	}
	console.log(delays);
	for (var i = 0; i < delays.length; i++) {
		notes.push(closestNote(delays, i, interval, 10));
	}
	for (var i = 0; i < notes.length; i++) {
		if (notes[i] == 0.33 || notes[i] == 0.66) {
			if (notes[i] != notes[i+1] && notes[i] != notes[i+2]) {
				notes[i] = closestNote(delays, i, interval, 8);
			}
			else {
				notes[i+1] = notes[i];
				notes[i+2] = notes[i];
			}
			i += 2;
		}
	}
	drawNotes(notes);
}

function findMin(array) {
	if (array.length > 0) {
		minIndex = 0;
		minimum = array[0];
		for (var i = 1; i < array.length; i++) {
			if (array[i] < minimum) {
				minIndex = i;
				minimum = array[i];
			}
		}
		return minIndex;
	}
	return [-1, -1];
}

function closestNote(delays, i, interval, endIndex) {
	var time = delays[i];
	var ratio = time/interval;
	var differences = NOTE_TYPES.slice(0, endIndex);
	for (var i = 0; i < differences.length; i++) {
		differences[i] = Math.abs(differences[i] - ratio);
	}
	var minIndex = findMin(differences);
	var minNote = NOTE_TYPES[minIndex];
	return NOTE_TYPES[minIndex];
}

function drawNotes(notes) {
	$('#staff').html("");
	for (var n = 0; n < notes.length; n++) {
		var note = $("<div class='note'>" + notes[n] + "</div>").appendTo("#staff");
		note.css("width", notes[n]*6 + "rem");
	}
}
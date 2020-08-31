function runCalendarScript() {
	var lines = document.getElementById("info").value.split('\n');
	var sections = {}
	var lastSection = null;

	for (var i = 0; i < lines.length; i++) {
		lines[i] = lines[i].trim();
	}

	lines.forEach(function(line, index) {
		found = line.match(/^(.*) \((.*)\)$/);
		if (found != null) {
			lastSection = found[0];
			sections[lastSection] = [];
		}
		else if (line.includes(" - ")) {
			sections[lastSection].push(line);
		}
	})


	var xhr = new XMLHttpRequest();
	var API = "https://script.google.com/macros/s/AKfycbxJk6UIXAoHcZx965hfcDH3160gjd9tFAtiVOIVpnQrWfYs9BIB/exec"
	var url = API + "?data=" + encodeURIComponent(JSON.stringify(sections));
	window.location.href = url;
}
function runCalendarScript() {
	var lines = document.getElementById("info").value.split('\n');
	var sections = []
	var lastSection = null;

	for (var i = 0; i < lines.length; i++) {
		lines[i] = lines[i].trim();
	}

	lines.forEach(function(line, index) {
		found = line.match(/^(.*) \((.*)\)$/);
		if (found != null) {
			lastSection = found[0];
		}
		else if (line.includes(" - ")) {
			// Class name, time string, location
			sections.push([lastSection, line, lines[index+1]]);
		}
	})


	var xhr = new XMLHttpRequest();
	var API = "https://script.google.com/macros/s/AKfycbxYoMkxLW-VonDkfIbxaol9eJp0Y8JuZF4kx7uiENwbreOQwheh2l1OrA/exec"
	var url = API + "?data=" + encodeURIComponent(JSON.stringify(sections));
	window.location.href = url;
}
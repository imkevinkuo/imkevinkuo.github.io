function calculateTimes() {
	var x1  = parseInt(document.getElementById("x").value);
	var y1  = parseInt(document.getElementById("y").value);
	var ts  = parseInt(document.getElementById("ts").value);
	var spd = parseInt(document.getElementById("spd").value);
	var lines = document.getElementById("info").value.split('\n');
	
	var sendTimes = []
	var arriveTimes = []
	var x = []
	var y = []
	
	lines.forEach(function(item, index) {
		var arr  = item.replace(/\s+/g, '').split("/");
		var xy   = arr[0].split(new RegExp('[|, ]', 'g'));
		var x2   = parseInt(xy[0]);
		var y2   = parseInt(xy[1]);
		var time = timeInSeconds(arr[1]);
		
		sendTimes.push(time - travelTime(spd, ts, x1, y1, x2, y2))
		arriveTimes.push(time)
		x.push(x2)
		y.push(y2);
	})
	
	var sortedIdx = argSort(sendTimes);
	var tableRows = [['x', 'y', 'send time', 'arrive time']];
	sortedIdx.forEach(function(i, index) {
		tableRows.push([x[i], y[i], timeInText(sendTimes[i]), timeInText(arriveTimes[i])]);
	})
	
	setTable(tableRows);
}

function setTable(tableData) {
	var table = document.createElement('table');
	var tableBody = document.createElement('tbody');

	tableData.forEach(function(rowData) {
		var row = document.createElement('tr');

		rowData.forEach(function(cellData) {
			var cell = document.createElement('td');
			cell.appendChild(document.createTextNode(cellData));
			row.appendChild(cell);
		});
		
		tableBody.appendChild(row);
	});

	table.appendChild(tableBody);
	document.getElementById("table-wrapper").textContent = '';
	document.getElementById("table-wrapper").appendChild(table);
}

function argSort(arr) {
	indexedTest = arr.map(function(e,i){return {ind: i, val: e}});
	indexedTest.sort(function(x, y){return x.val > y.val ? 1 : x.val == y.val ? 0 : -1});
	indices = indexedTest.map(function(e){return e.ind});
	return indices;
}

function timeInSeconds(timeString) {
	if (timeString == null) {
		return 0;
	}
	var hms = timeString.split(':');
	var h = parseInt(hms[0]),
		m = parseInt(hms[1]),
		s = parseInt(hms[2]);
	return h*3600 + m*60 + s;
}

function timeInText(timeSeconds) {
	while (timeSeconds < 0) {
		timeSeconds += (24*3600);
	}
	var h = Math.floor(timeSeconds / 3600),
		m = Math.floor((timeSeconds % 3600) / 60),
		s = timeSeconds % 60;
	return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
}

function travelTime(speed, ts, x1, y1, x2, y2) {
	var a = x1 - x2;
	var b = y1 - y2;
	var d = Math.sqrt(a*a + b*b);
	var h = d/speed;
	if (d > 20) {
		h = 20/speed + (d-20)/(speed*(1+0.2*ts));
	}
	return Math.round(3600*h);
}
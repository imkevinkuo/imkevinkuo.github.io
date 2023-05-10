const DOCUMENT_ID = "1Kl5jhBTPOrv1IatHd6tUVWRyO-PMSO_B8HVQeW_KdKY";
const API_URL = `https://spreadsheets.google.com/feeds/list/${DOCUMENT_ID}/1/public/basic?alt=json-in-script&callback=onDataLoaded`;
var converter = new showdown.Converter()
var blog = null;

function httpGet(url, callback, aSync) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, aSync); // true for asynchronous 
    xmlHttp.send(null);
}


function parsePosts(content) {
    content = content.substring(content.indexOf("{"), content.length - 2);
    var data = JSON.parse(content).feed.entry;
    var rows = [];
	for (var i = 0; i < data.length; i++) {
		post = data[i].title.$t;
        html = converter.makeHtml(post);
        var blogpost = document.createElement('div');
        blogpost.classList.add("blogpost");
        blogpost.innerHTML = html;
        blog.appendChild(blogpost, blog.firstChild);
	}
}


function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

var mover = null;
var first = null;
var to_y = 0;
var to_x = 0;
var save_x = 0;
var save_y = 0;
var lastClicked = null;

function updateMoverCoords() {
	mover = $("#mover");
	first = $("#project-icons");
	to_y = first.offset().top;
	to_x = first.offset().left;
}

function animateMover(clickedBox, clickedIndex) {
	updateMoverCoords();
	lastClicked = clickedIndex;
	clickedBox.css('visibility', 'hidden');
	save_y = clickedBox.offset().top - convertRemToPixels(1);
	save_x = clickedBox.offset().left - convertRemToPixels(1);
	mover.css("top", save_y);
	mover.css("left", save_x);
	mover.css("display", "flex");
	mover.children().eq(1).text(clickedBox.children().eq(1).text());
	mover.children().eq(0).attr("src", clickedBox.children().eq(0).attr("src"));
	mover.children().eq(0).attr("class", clickedBox.children().eq(0).attr("class"));
	mover.animate({
		top: to_y,
		left: to_x
	}, 400, "swing");
	setTimeout(function() {
		mover.children().eq(1).addClass("active");
		mover.children().eq(1).text("Back to Projects");
	}, 200)
	
	setTimeout(function() {
		var lc = $(".project-desc > .imgbox.ph").eq(lastClicked);
		mover.offset(lc.offset());
	}, 600)
}

function animateMoverBack() {
	var clickedBox = $(".project-list > .imgbox").eq(lastClicked);
	var from_y = clickedBox.offset().top - convertRemToPixels(1);
	var from_x = clickedBox.offset().left - convertRemToPixels(1) + $('#project-menu').width();
	mover.animate({
		top: from_y,
		left: from_x
	}, 600, "swing");
	
	$('#project-menu').removeClass('showdesc');
	mover.children().eq(1).removeClass("active");
	mover.children().eq(1).addClass("hiding");
	
	setTimeout(function() {
		mover.children().eq(1).removeClass("hiding");
		mover.css("display", "none");
		clickedBox.css("visibility", "visible");
	}, 600);
}

$( document ).ready(function() {
    // HTML Anchor Smooth Scroll
	$(document).on('click', 'a[href^="#"]', function (event) {
		event.preventDefault();

		$('html, body').animate({
			scrollTop: $($.attr(this, 'href')).offset().top - 64
		}, 500, "swing");
	});
    
    
	// Icons below profile pic
	$("a > i").on("mouseenter", function(event) {
		$("#icon-desc").text($(event.target).attr("hovertext"));
	});
	
	$("a > i").on("mouseout", function(event) {
		$("#icon-desc").text("");
	});
    
    
	// Create blog posts
    /*
	blog = document.getElementById('blog');
    httpGet(API_URL, parsePosts, true);
    */
    
	// Project description
    /*
	updateMoverCoords();
	window.addEventListener('resize', function() {
		var lc = $(".project-desc > .imgbox.ph").eq(lastClicked);
		mover.offset(lc.offset());
	});
	
	$(".project-list > .imgbox").each(function(i) {
		$(this).on("click", function(event) {
			$("#project-menu").addClass('showdesc');
			$(".project-desc").eq(i).removeClass("hidden");
			$(".project-desc").each(function(j) {
				if (i != j) {
					$(this).addClass("hidden");
				}
			});
			lastClicked = i;
			animateMover($(this), i);
		});
	});
	
	mover.on("click", animateMoverBack);
    */
});
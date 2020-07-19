var BLOG_REPO = "https://raw.githubusercontent.com/imkevinkuo/blog/master/";
var converter = new showdown.Converter()

var LATEST_POST = 0;
var blog = null;

function getPosts() {
	// Get number of posts
	$.ajax({
		type: "GET",
		url: BLOG_REPO + "latest_post.txt",
		async: false,
		dataType: "text",
		success: function(data) {
			LATEST_POST = parseInt(data);
		}
	});
	
	getPostLoop(LATEST_POST);
}

function getPostLoop(i) {
	if (i < 0) {
		return;
	}
	
	$.ajax({
		type: "GET",
		url: BLOG_REPO + i + ".md",
		dataType: "text",
		success: function(data) {
			html = converter.makeHtml(data);
			var blogpost = document.createElement('div');
			blogpost.classList.add("blogpost");
			blogpost.innerHTML = html;
			blog.appendChild(blogpost, blog.firstChild);
			
			getPostLoop(i-1);
		}
	});
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

function animateMover(clickedBox) {
	updateMoverCoords();
	lastClicked = clickedBox;
	clickedBox.css('visibility', 'hidden');
	save_y = lastClicked.offset().top - convertRemToPixels(1) + 2;
	save_x = lastClicked.offset().left - convertRemToPixels(1) + 2;
	mover.css("top", save_y);
	mover.css("left", save_x);
	mover.css("display", "flex");
	mover.children().eq(1).text(clickedBox.children().eq(1).text());
	mover.children().eq(0).attr("src", lastClicked.children().eq(0).attr("src"));
	mover.children().eq(0).attr("class", lastClicked.children().eq(0).attr("class"));
	mover.animate({
		top: to_y,
		left: to_x
	}, 400, "swing");
	setTimeout(function() {
		mover.children().eq(1).addClass("active");
		mover.children().eq(1).text("Back to Projects");
	}, 200)
}

function animateMoverBack() {
	$('#project-menu').removeClass('showdesc');
	mover.animate({
		top: save_y,
		left: save_x
	}, 600, "swing");
	
	mover.children().eq(1).removeClass("active");
	mover.children().eq(1).addClass("hiding");
	
	setTimeout(function() {
		mover.children().eq(1).removeClass("hiding");
		mover.css("display", "none");
		lastClicked.css("visibility", "visible");
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
	blog = document.getElementById('blog');
	getPosts();

	// Project description
	
	updateMoverCoords();
	window.addEventListener('resize', function() {
		// get the placeholder
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
			animateMover($(this));
		});
	});
	
	mover.on("click", animateMoverBack);
});
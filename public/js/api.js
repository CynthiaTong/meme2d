/****** 
This js document is meant to be used for the meme2D (meme2d.herokuapp.com) website. 
It contains several button controls as well as API calls. 
Created by Cynthia Xin Tong, Fall 2016. All rights reserved. 
*****/


$(document).ready(function() {
	//get the hundred memes from imgflip
	getMemes();

	clickCount = -1;

	//a flag to indicate if refreshImg is paused 
	var isPaused = false;

	//when user press "esc" or "enter", trigger back-to-page/submit button
	$(document).keyup(function(event){ 
        var keyCode = event.which;   
        if (keyCode == 13) $("#msg-submit").click();
        if (keyCode == 27) $("#back-to-page").click();
    });

	//when init button is clicked
    $("#initBtn").click(function() {

    	//hide the intro texts 
    	$("#introGuide").hide();

    	//cycle through five images of different shapes, change img every 120 ms 
		var counter = 0;
		setInterval(function() {

			if (!isPaused) {
				$(".pics").hide();
				$("#"+counter).show();
				shapeNum = counter;

				++counter;
			}
				if (counter > 4) counter = 0;
			}, 120);
				
    });

    //when user selects a shape
	$("#selectArea").click(function() {

		clickCount += 1;

		//setInterval is paused 
		isPaused = true;

		//add a new obj to objArray 
		objArray.push({
			username: "",
			text: "",
			text1: "",
			memeInfo: memesArray[clickCount],
			num: clickCount,
			updated: 0
		});

		//display img from memesArray based on clickCount 
		var item = memesArray[clickCount];
		$("#img-display").attr("src" , item.link);

		//adjust img size to fit in the screen 
		if (item.width > 800) {
			$("#img-display").attr("width" , 700); 
			$("#img-display").attr("height" , 700*1.0*item.height*1.0/item.width*1.0); 
		}
		if (item.height > 400) {
			$("#img-display").attr("width" , 400*1.0*item.width*1.0/item.height*1.0); 
			$("#img-display").attr("height" , 400);
		}

		//if all the memes are used, start from beginning 
		if (clickCount >= memesArray.length) {
			clickCount = -1;
		}
	});

	//When user click "save"
	$("#msg-submit").click(function() {

		var currentLink = $("#img-display").attr("src");
		var obj;

		//match an obj from objArray to the current img link 
		for (var i=0; i < objArray.length; i++) {
			if (objArray[i].memeInfo.link === currentLink) {
				obj = objArray[i];
			}
		}
		//clear previous input 
		obj.username = $("#username").val();
		obj.text =  $("#msg-content").val();
		obj.text1 = $("#msg-content2").val();
		//disable submit button temporarily to prevent multiple entries 
		$("#msg-submit").attr("disabled", true);

		//check input string 
		if (obj.username !== "" && obj.text !== "" && obj.text1 !== "") {
			//get updated meme 
			getUpdatedMemes(obj);

		}else {
			alert("Please enter your name and the texts.");
		}
	});

	//when the user click "back"
	$("#back-to-page").click(function() {
		//clear previous input 
		$("#username").val("");
		$("#msg-content").val("");	
		$("#msg-content2").val("");

		//send signal to shape.js
		backtoSelection();

		//resume setInterval cycling shape images 
		isPaused = false;
	});

	//reactivate submit button when user starts to enter something else 
	$(".userinput").on("input", function(e) {
		$("#msg-submit").attr("disabled", false);
	});

});

//get all the memes in an array 
function getMemes() {

	var getUrl = "https://api.imgflip.com/get_memes";

	$.ajax({
	    url: getUrl, 
	    type: 'GET', 
	    dataType: 'json',
	    success: function(d) { 
	    	console.log("Success getting memes data"); 

	    	for (var i=0; i < d.data.memes.length; i++) {

	    		//create a meme obj and push to the memeArray 
	    		var m = {
		    		id: d.data.memes[i].id,
					caption: d.data.memes[i].name,
					link: d.data.memes[i].url,
					width: d.data.memes[i].width,
					height: d.data.memes[i].height
				};

				memesArray.push(m);
	    	}
	  
	    	memesArray = shuffle(memesArray);
	    },
	    error: function(err) { 
	    	console.log(err);
	    	alert("Sorry, data is not ready. Refresh please."); 
	    },
	});
}

function postMemes(data) {

		//save changes the user made to cloudant 
		$.ajax( {
		url: "/post", 
		contentType: "application/json",
		type: "POST",
		data: JSON.stringify(data),
		error: function (resp) {
			console.log(resp);
			alert("Cannot save changes. Please try again.");
		},
		success: function(resp) {
			console.log("Saved changes to DB.");

			//reset 
			$("#username").val("");
			$("#msg-content").val("");	
			$("#msg-content2").val("");
			$("#favBtn").fadeOut(200);
			$("#clickGuide").html("Meme is shared, click 'favorites' (top left) to see it!");
		}
		});
	
}

//Get updated meme (with user-input text)
function getUpdatedMemes(d){

	//keys ready to pass to server 
	var key1 = d.memeInfo.id;
	var key2 = d.text;
	var key3 = d.text1;
	console.log(key1, key2, key3);

	$.ajax( {
		url: "/get/" + key1 + "/" + key2 + "/" + key3, 
		dataType: "json",
		type: "GET",
		error: function (err) {
			alert("Cannot get updates. Please try again.");
		},
		success: function(data) {
			console.log("Got new meme.");
			
			//display the updated img 
			$("#img-display").attr("src", data);

			d.memeInfo.link = data;

			//increase the update count 
			d.updated += 1;

			var inObj = false;

			//if the meme is already in  objArray, update the original 
			for (var i=0; i < objArray.length; ++i) {
				if (d.memeInfo.id === objArray[i].memeInfo.id) {
					objArray[i] = d;
					inObj = true;
				}
			}
			// if not exist in array, add it 
			if (!inObj) objArray.push(d);

			$("#favBtn").show();
			$("#favBtn").click(function() {
				//post to cloudant  
				postMemes(d);
			});
			
			//display update count 
			if (d.updated > 1) $("#updateCount").html("This meme has been updated <strong>"+ d.updated + "</strong> times." + 
				 					"<br>Btw, its shape just got a bit bigger due to your update :).");
			else $("#updateCount").html("<strong>You</strong> are the first person who gave text to this meme!" + 
				 					"<br>Btw, its shape just got a bit bigger due to your update :).");
		}
	});
}

function getFavMemes() {

	//return the ajax data 
	return $.ajax({
		url: '/api/favorites',
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			alert("Cannot get data. Try refresh?");
		},
		success: function(data){
			console.log("Got fav data");
		}
	});
}

//function to shuffle memeArray 
function shuffle(array) {

  	var currentIndex = array.length, temporaryValue, randomIndex;

  	// While there remain elements to shuffle...
  	while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

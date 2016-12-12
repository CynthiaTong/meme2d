// A reference to our box2d world
var world;

var boundaries = [];
var terrain;

var trapezoids = [];
var parals = [];
var boxes = [];
var circles = [];
var triangles = [];
var pentagons = [];
var spring;
var shapes = [triangles, boxes, pentagons, trapezoids, parals];
var yOff = 0.0;

var init = false;

var num = 0;
var last = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);

	//Create box2D world
	world = createWorld();

	// //Horizontal boundaries 
	boundaries.push(new Boundary(windowWidth/2,0.5,windowWidth,1));
	//Vertical boundaries
	boundaries.push(new Boundary(width-0.5,height/2,1,height));
	boundaries.push(new Boundary(0.5,height/2,1,height));

	terrain = new Terrain();
	spring = new Spring();

	$("#initBtn").click(function() {
		console.log("initBtn clicked");
		selectShape();
	});

	frameRate(60);
}

// When the mouse is released delete the spring
function mouseReleased() {
  	spring.destroy();
}


//Double mousePressed - show details
function mousePressed() {

	for (var i=0; i<shapes.length; ++i) {
		var shape = shapes[i];

		for (var j=0; j<shape.length; ++j) {
			if (shape[j].contains(mouseX, mouseY)){
				spring.bind(mouseX, mouseY, shape[j]);

				if (frameCount - last < 20) {
					var data;
					if (dataObj[shape[j].num]) { 
						//find the correct img link 
						data = dataObj[shape[j].num].memeInfo.link;

						//pass update count to shape 
						var updateTimes = dataObj[shape[j].num].updated;
						shape[j].n = updateTimes;

						if (updateTimes > 1) $("#updateCount").html("This meme has been updated <strong>"+ updateTimes +
												 "</strong> times. See previous changes in the meme gallery!" +
												 "<br> Look! Its shape just got a bit bigger due to your update :).");
						else $("#updateCount").html("This meme has been updated <strong>1</strong> time." +
												 "<br> Look! Its shape just got a bit bigger due to your update :).");

					}
					else { 
						data = memesArray[shape[j].num].link;
						$("#updateCount").html("This sad meme has <strong>never</strong> been updated. Give it some attention by adding texts!");
					}
			  		$("#img-display").attr("src", data);

			  		$("#msgArea").css("background-color", shape[j].color);
			  		$("#msgArea").fadeIn(500);
			  		$("#clickGuide").hide();
					$("#selectArea").removeClass("disabled");

		  		}

			}
		}
	}

	last = frameCount;
}

function draw() {
	background(230, 240, 255);
	//Time Step 
	var timeStep = 1.0/30;
	// 2nd and 3rd arguments are velocity and position iterations
	world.Step(timeStep,10,10);	
	//show terrain 
	terrain.display();

	//update wave 
	// perlinWave();

	if (init) {
		displayShapes();
	}

	spring.update(mouseX,mouseY);
	spring.display();

	//update shape size based on update count 
	updateSize();
}

function updateSize() {

	for (var i=0; i< shapes.length; ++i) {
		var shape = shapes[i];
		for (var j=0; j<shape.length; ++j) {
			if (dataObj[shape[j].num]) { 
				shape[j].n = dataObj[shape[j].num].updated;
			}
		}
	}
}

function selectShape() {
	$("#selectArea").fadeIn(600);
	$("#initBtn").fadeOut(300);


	$("#triPic").click(function() {
		var chosenShape = $(".pics").attr("id");
		// console.log(chosenShape);

		if (chosenShape === "0") {
			var ts = new Triangle(mouseX, mouseY);
			triangles.push(ts);
			triangles[triangles.length-1].num = num;
			num ++;

			backedToPage = false;
			$("#selectArea").addClass("disabled");
			$("#updateCount").html("");

		}else if (chosenShape === "1") {
			var bs = new Box(mouseX, mouseY);
			boxes.push(bs);
			boxes[boxes.length-1].num = num;
			num ++;

			backedToPage = false;
			$("#selectArea").addClass("disabled");
			$("#updateCount").html("");

		}else if (chosenShape === "2") {
			var os = new Pentagon(mouseX, mouseY);
			pentagons.push(os);
			pentagons[pentagons.length-1].num = num;
			num ++;

			backedToPage = false;
			$("#selectArea").addClass("disabled");
			$("#updateCount").html("");

		}else if (chosenShape === "3") {
			var trs = new Trapezoid(mouseX,mouseY);
			trapezoids.push(trs);
			trapezoids[trapezoids.length-1].num = num;
			num ++;

			backedToPage = false;
			$("#selectArea").addClass("disabled");
			$("#updateCount").html("");

		}else if (chosenShape === "4") {
			var ps = new Parals(mouseX, mouseY);
			parals.push(ps);
			parals[parals.length-1].num = num;
			num ++;

			backedToPage = false;
			$("#selectArea").addClass("disabled");
			$("#updateCount").html("");

		}
	});

	if (num >= 100) {
		num = 0;
	}

	init = true;
}

// var yInc = -20;
//Change the hight (y value) based on the number of shapes added ? 
// function perlinWave() {
// 	// stroke(179, 209, 255);
// 	// fill(179, 209, 255);

// 	// beginShape();

// 	// // if (yInc <= -(height*3/4)) {
// 	// // 	yInc = 0.5;
// 	// // }

// 	// var xOff = 0.0;
// 	// var y;

// 	// for (var x=0; x< width+20; x+= 20) {
// 	// 	y = map(noise(xOff, yOff), 0, 1, height,3*height/5);
// 	// 	vertex(x,y);
// 	// 	xOff += 0.05;	
// 	// }

// 	// yOff += 0.01;
// 	// // yInc -= 0.1;

//  //  	vertex(width, height);
//  // 	vertex(0, height);
//  //  	endShape(CLOSE);
// }

function displayShapes() {

	for (var i = 0; i < boundaries.length; i++) {
		boundaries[i].display();
    }

	for (var j = trapezoids.length-1; j >= 0; j--) {
		trapezoids[j].display();
	}

	for (var k = boxes.length-1; k >= 0; k--) {
		boxes[k].display();
	}

	for (var l = pentagons.length-1; l >= 0; l--) {
		pentagons[l].display();
	}

	for (var l = triangles.length-1; l >= 0; l--) {
		triangles[l].display();
	}

	for (var l = parals.length-1; l >= 0; l--) {
		parals[l].display();
	}
}

//Terrain created with Perlin Noise 
function Terrain() {
	this.terrain = [];

	var xOff = 0.0;

	for (var x=0; x <= width+20; x+=20) {
    	y = map(noise(xOff, yOff), 0, 1, height,95*height/100);
    	this.terrain.push(new box2d.b2Vec2(x, y));
    	xOff += 0.05;
  	}

	// this.terrain.push(new box2d.b2Vec2(0, 4.8*height/5));
	// this.terrain.push(new box2d.b2Vec2(200, 4.5*height/5));
	// this.terrain.push(new box2d.b2Vec2(800, 5.5*height/6));
	// this.terrain.push(new box2d.b2Vec2(width, 4.9*height/5));

	for (var i = 0; i < this.terrain.length; i++) {
		this.terrain[i] = scaleToWorld(this.terrain[i]);
	}

	var chain = new box2d.b2ChainShape();
	chain.CreateChain(this.terrain, this.terrain.length);

	var bd = new box2d.b2BodyDef();
	this.body = world.CreateBody(bd);

	var fd = new box2d.b2FixtureDef();
	fd.shape = chain;

	fd.density = 1.0;
	fd.friction = 0.1;
	fd.restitution = 0;

	this.body.CreateFixture(fd);

	this.display = function() {

		strokeWeight(1);
		noStroke();
		fill(255);
		beginShape();
		for (var i=0; i < this.terrain.length; i++) {
			var v = scaleToPixels(this.terrain[i]);
			vertex(v.x, v.y);
		}
		vertex(width, height);
		vertex(0, height);
		endShape(CLOSE);
	};
}

function windowResized() {
	console.log("Window Resizing!");
	resizeCanvas(windowWidth, windowHeight);
	terrain = new Terrain();
}


//*** Unused code ***//


//   for (var i = 0; i < boxes.length; ++i) {

//   	if (boxes[i].contains(mouseX, mouseY)) {
//     // And if so, bind the mouse position to the box with a spring
//     	spring.bind(mouseX, mouseY, boxes[i]);

//     	if (frameCount - last < 20) {
// 	      	boxes[i].data = dataObj[boxes[i].num];
// 	      	console.log(boxes[i].data);
// 	  		$("#img-display").attr("src", boxes[i].data.memeInfo.link);
// 	  		var color = boxes[i].color;

// 	  		$("#msgArea").css("background-color", "rgba("+color._array[0]+","+color._array[1]+","+color._array[2]+ ",0.2)");
// 	  		console.log(boxes[i].color);
// 	  		$("#msgArea").show();
//   		}
//   	}
// }

//   for (var i = 0; i < trapezoids.length; ++i) {
//   	if (trapezoids[i].contains(mouseX, mouseY)) {
//     // And if so, bind the mouse position to the box with a spring
//     	spring.bind(mouseX, mouseY, trapezoids[i]);
//     	if (frameCount - last < 20) {
// 	    	trapezoids[i].data = dataObj[trapezoids[i].num];
// 	  		// console.log(boxes[i].data);
// 	  		$("#img-display").attr("src", memesArray[clickCount].link || trapezoids[i].data.memeInfo.link);
// 	  		$("#msgArea").css("background-color", trapezoids[i].color);
// 	  		$("#msgArea").show();
//   		}
//   	}
//   }

//   for (var i = 0; i < parals.length; ++i) {
//   	if (parals[i].contains(mouseX, mouseY)) {
//     // And if so, bind the mouse position to the box with a spring
//     	spring.bind(mouseX, mouseY, parals[i]);
// 	    if (frameCount - last < 20) {
// 	    	parals[i].data = dataObj[parals[i].num];
// 	  		// console.log(boxes[i].data);
// 	  		$("#img-display").attr("src", memesArray[clickCount].link || parals[i].data.memeInfo.link);
// 	  		$("#msgArea").css("background-color", parals[i].color);
// 	  		$("#msgArea").show();
// 	  	}
//   	}
//   }

//   for (var i = 0; i < triangles.length; ++i) {
//   	if (triangles[i].contains(mouseX, mouseY)) {
//     // And if so, bind the mouse position to the box with a spring
//     	spring.bind(mouseX, mouseY, triangles[i]);
// 	    if (frameCount - last < 20) {
// 	    	triangles[i].data = dataObj[triangles[i].num];
// 	  		// console.log(boxes[i].data);
// 	  		$("#img-display").attr("src", memesArray[clickCount].link || triangles[i].data.memeInfo.link);
// 		  	$("#msgArea").css("background-color", triangles[i].color);
// 	  		$("#msgArea").show();
// 	  	}
//   	}
//   }

//   for (var i = 0; i < pentagons.length; ++i) {
//   	if (pentagons[i].contains(mouseX, mouseY)) {
//     // And if so, bind the mouse position to the box with a spring
//     	spring.bind(mouseX, mouseY, pentagons[i]);
// 	    if (frameCount - last < 20) {
// 	    	pentagons[i].data = dataObj[pentagons[i].num];
// 	  		// console.log(boxes[i].data);
// 	  		$("#img-display").attr("src", memesArray[clickCount].link || pentagons[i].data.memeInfo.link);

// 	  		$("#msgArea").css("background-color", pentagons[i].color);
// 	  		$("#msgArea").show();
// 	  	}
//   	}
//   }


//-------------
// function mousePressed() {

// 	console.log(mouseX, mouseY);

// 	if (mouseY < 200) {
// 		if (mouseX < windowWidth/4) {
// 		  var ts = new Trapezoid(mouseX,mouseY);
// 		  trapezoids.push(ts);
// 		}else if (mouseX < windowWidth/2) {
// 		  var bs = new Box(mouseX, mouseY);
// 		  boxes.push(bs);
// 		}else if (mouseX < 3*windowWidth/4){
// 		  var os = new Circle(mouseX, mouseY);
// 		  circles.push(os);
// 		} else {
// 		  var ts = new Triangle(mouseX, mouseY);
// 		  triangles.push(ts);
// 		  var ts = new Parals(mouseX, mouseY);
// 		  parals.push(ts);
// 		}
// 	}	
// }

// 	fill(26, 117, 255);
	// 	textFont("Helvetica");
	// 	textSize(20);
	// 	text("Select a shape from below", width*0.42, height/10);
		
	// 	translate(width/4,height/8);
	// 	strokeWeight(3);
	// 	stroke(255);
	// 	noFill();
	// 	rect(0, 0, width/2, height/3);

	// 	stroke(88, 46, 135);
	// 	//shapes to choose from 
	// 	rect(120,50,70,50);
	// 	triangle(320,50, 380, 100, 290, 100);
	// 	quad(480, 50, 520, 45, 580, 100, 470, 100);
	// 	quad(120, 150, 190, 150, 220, 200, 150, 200);
	// 	ellipse(330, 170, 70, 70);
	// 	//display all shapes 
 //  	    // displayShapes();
	// }

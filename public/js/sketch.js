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

function preload() {
  myFont = loadFont("/media/fonts/OpenSans-Regular.ttf");
}

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
					if (objArray[shape[j].num] !== undefined) {
						// console.log(objArray[shape[j].num]);
						// console.log(shape[j].num);
						if (objArray[shape[j].num].num === shape[j].num) { 
							//find the correct img link 
							data = objArray[shape[j].num].memeInfo.link;

							//pass update count to shape 
							var updateTimes = objArray[shape[j].num].updated;
							shape[j].n = updateTimes;
							// console.log(shape[j].n);

							if (updateTimes > 1) $("#updateCount").html("This meme has been updated <strong>"+ updateTimes +
													 "</strong> times.");
							else if (updateTimes > 0) $("#updateCount").html("This meme has been updated <strong>1</strong> time.");
							else $("#updateCount").html("This sad meme has <strong>never</strong> been updated. <br>Give it some attention by adding texts! ");
							
						// } else { 	
						// console.log(objArray);
						// // console.log(dataObj);
						// console.log(objArray[shape[j].num]);
						// // console.log(shape[j].num);
						// data = memesArray[shape[j].num].link;
						// $("#updateCount").html("This sad meme has <strong>never</strong> been updated. Give it some attention by adding texts!");
						}
					}
					
			  		$("#img-display").attr("src", data);

			  		$("#msgArea").css({"background-color": shape[j].color});
			  		$("#msgArea").fadeIn(500);
			  		$("#favBtn").hide();
					$("#selectArea").removeClass("disabled");

		  		}

			}
		}
	}

	last = frameCount;
}

function updateSize() {

	for (var i=0; i< shapes.length; ++i) {
		var shape = shapes[i];
		for (var j=0; j<shape.length; ++j) {
			if (objArray[shape[j].num]) { 
				shape[j].n = objArray[shape[j].num].updated;
			}
		}
	}
}

function selectShape() {
	$("#selectArea").fadeIn(600);
	$("#initBtn").fadeOut(300);


	$("#selectArea").click(function() {
		// console.log(shapeNum);

		if (shapeNum === 0) {
			var ts = new Triangle(mouseX, mouseY);
			triangles.push(ts);
			triangles[triangles.length-1].num = num;
			num ++;

			backedToPage = false;
			$("#selectArea").addClass("disabled");
			$("#updateCount").html("");

		}else if (shapeNum === 1) {
			var bs = new Box(mouseX, mouseY);
			boxes.push(bs);
			boxes[boxes.length-1].num = num;
			num ++;

			backedToPage = false;
			$("#selectArea").addClass("disabled");
			$("#updateCount").html("");

		}else if (shapeNum === 2) {
			var os = new Pentagon(mouseX, mouseY);
			pentagons.push(os);
			pentagons[pentagons.length-1].num = num;
			num ++;

			backedToPage = false;
			$("#selectArea").addClass("disabled");
			$("#updateCount").html("");

		}else if (shapeNum === 3) {
			var trs = new Trapezoid(mouseX,mouseY);
			trapezoids.push(trs);
			trapezoids[trapezoids.length-1].num = num;
			num ++;

			backedToPage = false;
			$("#selectArea").addClass("disabled");
			$("#updateCount").html("");

		}else if (shapeNum === 4) {
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

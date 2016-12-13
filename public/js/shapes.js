var showMsgArea = false;
var nDiv = 10;

function backtoSelection() {
	showMsgArea = false;
  backedToPage = true;

	$("#msgArea").fadeOut(200);
  $("#selectArea").fadeIn(200);

}

// *** box2D Constructors ***//

function Trapezoid(x, y) {

  // Define a body
  var bd = new box2d.b2BodyDef();
  bd.type = box2d.b2BodyType.b2_dynamicBody;
  bd.position = scaleToWorld(x,y);

  // Define a fixture
  var fd = new box2d.b2FixtureDef();

  var vertices = [];
  vertices[3] = scaleToWorld(random(50,60), random(10,15));
  vertices[2] = scaleToWorld(random(-10, -25), random(30,35));
  vertices[1] = scaleToWorld(random(15,20), random(-25, -20));
  vertices[0] = scaleToWorld(random(-20,-10), random(-15, -5));

  // Fixture holds shape
  fd.shape = new box2d.b2PolygonShape();
  fd.shape.SetAsArray(vertices,vertices.length);

  // Some physics
  fd.density = 1.0;
  fd.friction = 0.5;
  fd.restitution = 0.3;

  // Create the body
  this.body = world.CreateBody(bd);
  // Attach the fixture
  this.body.CreateFixture(fd);

  //Some additional stuff
  this.body.SetLinearVelocity(new box2d.b2Vec2(random(-20, -10) + random(10, 20), random(-40, -10) + random(3,5)));
  this.body.SetAngularVelocity(random(-10,-5) + random(5, 10));

  this.color = color(random(100,250), random(100,250), random(100,250));
  $("#msgArea").css("background-color", this.color);

  var firstCheck = false;    
  // var time = 0;
  var pressedOnce = false;

  this.n = 0;
  // Drawing the box
  this.display = function() {

	// Get the body's position
	var pos = scaleToPixels(this.body.GetPosition());
	// Get its angle of rotation
	this.a = this.body.GetAngleRadians();

	// Draw it!
	var f = this.body.GetFixtureList();
	this.ps = f.GetShape();


	rectMode(CENTER);
	push();
	translate(pos.x,pos.y);
	rotate(this.a);
	fill(this.color);
	stroke(120);
	strokeWeight(2);
	beginShape();
	// For every vertex, convert to pixel vector
	for (var i = 0; i < this.ps.m_count; i++) {
	  var v = scaleToPixels(this.ps.m_vertices[i]);
	  vertex(v.x*(1+this.n/nDiv), v.y*(1+this.n/nDiv));
	}
	endShape(CLOSE);
	pop();


	var velocity = this.body.GetLinearVelocity();

  	if (velocity.x === 0 && velocity.y === 0) {

        if (!mouseIsPressed && !pressedOnce && backedToPage) {

            fill(120).strokeWeight(0).textSize(20);
            text("Hey, drag/doubleclick this!", pos.x + 10, pos.y - 50);
            // time = millis();
            setTimeout(function() {pressedOnce = true;}, 6000);
        }

        if (!firstCheck) {
            firstCheck = true;
      		showMsgArea = true;
      		$("#selectArea").removeClass("disabled");
        }
  	}


  	if (showMsgArea) {
  		$("#selectArea").hide();
  		$("#msgArea").fadeIn(500);
	}

  };

  this.contains = function(x,y) {
    var worldPoint = scaleToWorld(x, y);
    var f = this.body.GetFixtureList();
    var inside = f.TestPoint(worldPoint);
    return inside;
  };
}

function Parals(x,y) {
	// Define a body
  var bd = new box2d.b2BodyDef();
  bd.type = box2d.b2BodyType.b2_dynamicBody;
  bd.position = scaleToWorld(x,y);

  // Define a fixture
  var fd = new box2d.b2FixtureDef();

	var vertices = [];

	var x1 = random(-40, -30);
	var y1 = random(-25, 15);
	var lx = random(60,70);
	var ly = random(40, 50);
	var times = random(0.1, 0.45);

	vertices[3] = scaleToWorld(x1+lx*(1+times), y1+ly);
	vertices[2] = scaleToWorld(x1+lx*times, y1+ly);
	vertices[1] = scaleToWorld(x1+lx, y1);
	vertices[0] = scaleToWorld(x1, y1);
  
  fd.shape = new box2d.b2PolygonShape();
  fd.shape.SetAsArray(vertices,vertices.length);
  //println(fd.shape);

  //fd.shape.SetAsBox(scaleToWorld(10),scaleToWorld(10));

  // Some physics
  fd.density = 1.0;
  fd.friction = 0.5;
  fd.restitution = 0.3;

  // Create the body
  this.body = world.CreateBody(bd);
  // Attach the fixture
  this.body.CreateFixture(fd);

  //Some additional stuff
  this.body.SetLinearVelocity(new box2d.b2Vec2(random(-20, -10) + random(10, 20), random(-40, -10) + random(3,5)));
  this.body.SetAngularVelocity(random(-10,-5) + random(5, 10));

  this.color = color(random(100,250), random(100,250), random(100,250));
  $("#msgArea").css("background-color", this.color);

  var firstCheck = false;
  var pressedOnce = false;

  this.n = 0;
  // Drawing the box
  this.display = function() {
	// Get the body's position
	var pos = scaleToPixels(this.body.GetPosition());
	// Get its angle of rotation
	this.a = this.body.GetAngleRadians();

	// Draw it!
	var f = this.body.GetFixtureList();
	this.ps = f.GetShape();

	rectMode(CENTER);
	push();
	translate(pos.x,pos.y);
	rotate(this.a);
	fill(this.color);
	stroke(120);
	strokeWeight(2);
	beginShape();
	// For every vertex, convert to pixel vector
	for (var i = 0; i < this.ps.m_count; i++) {
	  var v = scaleToPixels(this.ps.m_vertices[i]);
	  vertex(v.x*(1+this.n/nDiv), v.y*(1+this.n/nDiv));
	}
	endShape(CLOSE);
	pop();


	var velocity = this.body.GetLinearVelocity();

    if (velocity.x === 0 && velocity.y === 0) {

        if (!mouseIsPressed && !pressedOnce && backedToPage) {

            fill(120).strokeWeight(0).textSize(20);
            text("Hey, drag/doubleclick this!", pos.x + 10, pos.y - 50);
            // time = millis();
            setTimeout(function() {pressedOnce = true;}, 6000);
        }

        if (!firstCheck) {
            firstCheck = true;
            showMsgArea = true;
            $("#selectArea").removeClass("disabled");
        }
    }


  	if (showMsgArea) {
		  $("#selectArea").hide();
      $("#msgArea").fadeIn(500);	
    }
  };

  this.contains = function(x,y) {
    var worldPoint = scaleToWorld(x, y);
    var f = this.body.GetFixtureList();
    var inside = f.TestPoint(worldPoint);
    return inside;
  };
}

function Triangle(x, y) {

  // Define a body
  var bd = new box2d.b2BodyDef();
  bd.type = box2d.b2BodyType.b2_dynamicBody;
  bd.position = scaleToWorld(x,y);

  // Define a fixture
  var fd = new box2d.b2FixtureDef();

  var vertices = [];
  vertices[2] = scaleToWorld(random(-30, -20), random(30,35));
  vertices[1] = scaleToWorld(random(30,50), random(-20, -10));
  vertices[0] = scaleToWorld(random(-10, 5), random(-35, -25));

  // Fixture holds shape
  fd.shape = new box2d.b2PolygonShape();
  fd.shape.SetAsArray(vertices,vertices.length);

  // Some physics
  fd.density = 1.0;
  fd.friction = 0.5;
  fd.restitution = 0.3;

  // Create the body
  this.body = world.CreateBody(bd);
  // Attach the fixture
  this.body.CreateFixture(fd);

  //Some additional stuff
  this.body.SetLinearVelocity(new box2d.b2Vec2(random(-20, -10) + random(10, 20), random(-40, -10) + random(3,5)));
  this.body.SetAngularVelocity(random(-10,-5) + random(5, 10));

  this.color = color(random(100,250), random(100,250), random(100,250));
  $("#msgArea").css("background-color", this.color);

  var firstCheck = false;
  var pressedOnce = false;

  this.n = 0;
  // Drawing the box
  this.display = function() {

	// Get the body's position
	var pos = scaleToPixels(this.body.GetPosition());
	// Get its angle of rotation
	this.a = this.body.GetAngleRadians();

	// Draw it!
	var f = this.body.GetFixtureList();
	this.ps = f.GetShape();

	rectMode(CENTER);
	push();
	translate(pos.x,pos.y);
	//println(pos.x + " " + pos.y);
	rotate(this.a);
	fill(this.color);
	stroke(120);
	strokeWeight(2);
	beginShape();
	// For every vertex, convert to pixel vector
	for (var i = 0; i < this.ps.m_count; i++) {
	  var v = scaleToPixels(this.ps.m_vertices[i]);
	  vertex(v.x*(1+this.n/nDiv), v.y*(1+this.n/nDiv));
	}
	endShape(CLOSE);
	pop();

	var velocity = this.body.GetLinearVelocity();

    if (velocity.x === 0 && velocity.y === 0) {

        if (!mouseIsPressed && !pressedOnce && backedToPage) {

            fill(120).strokeWeight(0).textSize(20);
            text("Hey, drag/doubleclick this!", pos.x + 10, pos.y - 50);
            // time = millis();
            setTimeout(function() {pressedOnce = true;}, 6000);
        }

        if (!firstCheck) {
            firstCheck = true;
            showMsgArea = true;
            $("#selectArea").removeClass("disabled");
        }
    }


  	if (showMsgArea) {
		$("#selectArea").hide();
		$("#msgArea").fadeIn(500);
	  }
  };

  this.contains = function(x,y) {
    var worldPoint = scaleToWorld(x, y);
    var f = this.body.GetFixtureList();
    var inside = f.TestPoint(worldPoint);
    return inside;
  };
}

function Box(x, y) {
  this.w = random(45, 65);
  this.h = random(45, 65);

  // Define a body
  var bd = new box2d.b2BodyDef();
  bd.type = box2d.b2BodyType.b2_dynamicBody;
  bd.position = scaleToWorld(x,y);

  // Define a fixture
  var fd = new box2d.b2FixtureDef();
  // Fixture holds shape
  fd.shape = new box2d.b2PolygonShape();
  fd.shape.SetAsBox(scaleToWorld(this.w/2), scaleToWorld(this.h/2));
  
  // Some physics
  fd.density = 1.0;
  fd.friction = 0.5;
  fd.restitution = 0.3;
 
  // Create the body
  this.body = world.CreateBody(bd);
  // Attach the fixture
  this.body.CreateFixture(fd);

  // Some additional stuff
  this.body.SetLinearVelocity(new box2d.b2Vec2(random(-20, -10) + random(10, 20), random(-40, -10) + random(3,5)));
  this.body.SetAngularVelocity(random(-10,-5) + random(5, 10));

  this.color = color(random(100,250), random(100,250), random(100,250));
  $("#msgArea").css("background-color", this.color);

  var firstCheck = false;
  var pressedOnce = false;

  this.n = 0;
  // Drawing the box
  this.display = function() {
	// Get the body's position
	var pos = scaleToPixels(this.body.GetPosition());
	// Get its angle of rotation
	this.a = this.body.GetAngleRadians();
	
	// Draw it!
	rectMode(CENTER);
	push();
	translate(pos.x,pos.y);
	rotate(this.a);
	fill(this.color);
	stroke(120);
	strokeWeight(2);
	rect(0, 0, this.w*(1+this.n/nDiv), this.h*(1+this.n/nDiv));
	pop();


	var velocity = this.body.GetLinearVelocity();

    if (velocity.x === 0 && velocity.y === 0) {

        if (!mouseIsPressed && !pressedOnce && backedToPage) {

            fill(120).strokeWeight(0).textSize(20);
            text("Hey, drag/doubleclick this!!", pos.x + 10, pos.y - 50);
            // time = millis();
            setTimeout(function() {pressedOnce = true;}, 6000);
        }

        if (!firstCheck) {
            firstCheck = true;
            showMsgArea = true;
            $("#selectArea").removeClass("disabled");
        }
    }

  	if (showMsgArea) {
		$("#selectArea").hide();
		$("#msgArea").fadeIn(500);
	}
  };

  this.contains = function(x,y) {
    var worldPoint = scaleToWorld(x, y);
    var f = this.body.GetFixtureList();
    var inside = f.TestPoint(worldPoint);
    return inside;
  };
}

function Pentagon(x, y) {

  // Define a body
  var bd = new box2d.b2BodyDef();
  bd.type = box2d.b2BodyType.b2_dynamicBody;
  bd.position = scaleToWorld(x,y);

  // Define a fixture
  var fd = new box2d.b2FixtureDef();

  var vertices = [];
  vertices[4] = scaleToWorld(random(-5, 5), random(40,50));
  vertices[3] = scaleToWorld(random(30,40), random(10,15));
  vertices[2] = scaleToWorld(random(-30, -25), random(20,30));
  vertices[1] = scaleToWorld(random(15,20), random(-25, -20));
  vertices[0] = scaleToWorld(random(-20,-10), random(-30, -20));

  // Fixture holds shape
  fd.shape = new box2d.b2PolygonShape();
  fd.shape.SetAsArray(vertices,vertices.length);

  // Some physics
  fd.density = 1.0;
  fd.friction = 0.5;
  fd.restitution = 0.3;

  // Create the body
  this.body = world.CreateBody(bd);
  // Attach the fixture
  this.body.CreateFixture(fd);

  //Some additional stuff
  this.body.SetLinearVelocity(new box2d.b2Vec2(random(-20, -10) + random(10, 20), random(-40, -10) + random(3,5)));
  this.body.SetAngularVelocity(random(-10,-5) + random(5, 10));

  this.color = color(random(100,250), random(100,250), random(100,250));
  $("#msgArea").css("background-color", this.color);

  var firstCheck = false;
  var pressedOnce = false;

  this.n = 0;
  // Drawing the box
  this.display = function() {
	// Get the body's position
	var pos = scaleToPixels(this.body.GetPosition());
	// Get its angle of rotation
	this.a = this.body.GetAngleRadians();

	// Draw it!
	var f = this.body.GetFixtureList();
	this.ps = f.GetShape();

	rectMode(CENTER);
	push();
	translate(pos.x,pos.y);
	rotate(this.a);
	fill(this.color);
	stroke(120);
	strokeWeight(2);
	beginShape();
	// For every vertex, convert to pixel vector
	for (var i = 0; i < this.ps.m_count; i++) {
	  var v = scaleToPixels(this.ps.m_vertices[i]);
	  vertex(v.x*(1+this.n/nDiv), v.y*(1+this.n/nDiv));
	}
	endShape(CLOSE);
	pop();


	var velocity = this.body.GetLinearVelocity();

    if (velocity.x === 0 && velocity.y === 0) {

        if (!mouseIsPressed && !pressedOnce && backedToPage) {

            fill(120).strokeWeight(0).textSize(20);
            text("Hey, drag/doubleclick this!", pos.x + 10, pos.y - 50);
            // time = millis();
            setTimeout(function() {pressedOnce = true;}, 6000);
        }

        if (!firstCheck) {
            firstCheck = true;
            showMsgArea = true;
            $("#selectArea").removeClass("disabled");
        }
    }
    

    // if (velocity.x === 0 && velocity.y === 0) {

    //     if (backedToPage && !mouseIsPressed && time < 12000) {

    //         fill(this.color).strokeWeight(0).textSize(20);
    //         text("Hey, try dragging this!", pos.x + 10, pos.y - 50);
    //         time = millis();
    //     }

      

  	if (showMsgArea) {
		  $("#selectArea").hide();
        $("#msgArea").fadeIn(500);	
    }

  };

  this.contains = function(x,y) {
    var worldPoint = scaleToWorld(x, y);
    var f = this.body.GetFixtureList();
    var inside = f.TestPoint(worldPoint);
    return inside;
  };
}

//*** Unused code ***//

// function Circle(x,y) {
//   this.r = random(25, 35);

//   // Define a body
//   var bd = new box2d.b2BodyDef();
//   bd.type = box2d.b2BodyType.b2_dynamicBody;
//   bd.position = scaleToWorld(x,y);

//   // Define a fixture
//   var fd = new box2d.b2FixtureDef();
//   // Fixture holds shape
//   fd.shape = new box2d.b2CircleShape();
//   fd.shape.m_radius = scaleToWorld(this.r);
  
//   // Some physics
//   fd.density = 1.0;
//   fd.friction = 1.0;
//   fd.restitution = 0.3;
 
//   // Create the body
//   this.body = world.CreateBody(bd);
//   // Attach the fixture
//   this.body.CreateFixture(fd);

//   // Some additional stuff
//   this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(2, 5)));

//   // This function removes the particle from the box2d world
//   this.killBody = function() {
// 	world.DestroyBody(this.body);
//   };

//   // Is the particle ready for deletion?
//   this.done = function() {
// 	// Let's find the screen position of the particle
// 	var pos = scaleToPixels(this.body.GetPosition());
// 	// Is it off the bottom of the screen?
// 	if (pos.y > height+this.r) {
// 	  this.killBody();
// 	  return true;
// 	}
// 	  return false;
//   };

//   this.color = color(random(100,250), random(100,250), random(100,250));
//   $("#msgArea").css("background-color", this.color);
//   var firstCheck = false;

//   // Drawing the box
//   this.display = function() {
// 	// Get the body's position
// 	var pos = scaleToPixels(this.body.GetPosition());
		
// 	// Draw it!
// 	rectMode(CENTER);
// 	push();
// 	translate(pos.x,pos.y);
// 	fill(this.color);
// 	stroke(120);
// 	strokeWeight(2);
// 	ellipse(0, 0, this.r*2, this.r*2);
// 	pop();

// 	var velocity = this.body.GetLinearVelocity();

//   	if (velocity.y === 0 && !firstCheck) {
//   		// console.log("Still");
//   		firstCheck = true;
//   		// showMsgArea = true;
//   		$("#selectArea").removeClass("disabled");
//   	}

//   	if (showMsgArea) {
// 		$("#selectArea").hide();
// 		$("#msgArea").show();
// 	}
//   };

// }

// clear();
  		// filter(GRAY);
		
		// rectMode(CENTER);
		// push();
		// translate(width/2,height/2);
		// rotate(this.a);
		// fill(this.color);
		// stroke(120);
		// strokeWeight(5);
		// beginShape();
		// 	for (var i = 0; i < this.ps.m_count; i++) {
	 //  		var v = scaleToPixels(this.ps.m_vertices[i]);
	 //  		vertex(v.x*12, v.y*12);
		// }
		// endShape(CLOSE);
		// pop();
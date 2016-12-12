
function Boundary(x_,y_, w_, h_) {

	this.x = x_;
	this.y = y_;
	this.w = w_;
	this.h = h_;

	var fd = new box2d.b2FixtureDef();
	fd.density = 1.0;
	fd.friction = 0.5;
	fd.restitution = 0.2;

	var bd = new box2d.b2BodyDef();

	bd.type = box2d.b2BodyType.b2_staticBody;
	bd.position = scaleToWorld(this.x, this.y);
	fd.shape = new box2d.b2PolygonShape();
	fd.shape.SetAsBox(this.w/(scaleFactor*2), this.h/(scaleFactor*2));
	this.body = world.CreateBody(bd).CreateFixture(fd);

	  // Draw the boundary, if it were at an angle we'd have to do something fancier
	this.display = function() {
		fill(255);
		noStroke();
		rectMode(CENTER);
		rect(this.x,this.y,this.w,this.h);
	};
}

function Vector(x, y){
    this.dx = x;
    this.dy = y;
}

Vector.prototype.teken = function(ctx, x, y, kleur){
	ctx.save();
	
	ctx.strokeStyle = ctx.fillStyle = (kleur ? kleur : 'red');
	ctx.lineWidth = 1;
	ctx.translate(x, y);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(this.dx, this.dy);
	ctx.stroke();
	
	ctx.translate(this.dx, this.dy);
	ctx.rotate(Math.atan2(this.dy, this.dx)-1.25*Math.PI);
	
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 5);
	ctx.lineTo(5, 0);
	ctx.fill();
	
	ctx.restore();
};

Vector.prototype.add = function(vec){
	if(vec instanceof Vector){
		this.dx += vec.dx;
		this.dy += vec.dy;
	} else {
		for(var i=0; i<vec.length; i++){
			this.dx += vec[i].dx;
			this.dy += vec[i].dy;
		}
	}
	
	return this;
}

function Cirkel(r, px, py){
    this.straal = r;
    this.x = px;
    this.y = py;
	this.massa = 1000;
	
	this.snelheid = new Vector(0, 0);
	this.krachten = [];
}

Cirkel.prototype.voegKrachtToe = function(){
	for(var i=0; i<arguments.length; i++){
		this.krachten.push(arguments[i]);
	}
	return this;
};

Cirkel.prototype.teken = function(ctx, krachten){
	ctx.fillStyle = '#333';
	
	// Teken de cirkel
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.straal, 0, 2*Math.PI, true);
	ctx.fill();
	
	if(krachten && krachten===true){
		// Teken alle krachten
		for(var i=0; i<this.krachten.length; i++){
			this.krachten[i].teken(ctx, this.x, this.y);
		}
		
		// Teken de resulterende kracht als er meer dan 1 kracht op de cirkel werkt
		if(this.krachten.length > 1){
			(new Vector(0, 0)).add(this.krachten).teken(ctx, this.x, this.y, 'green');
		}
	}
	
	return this;
};

Cirkel.prototype.beweeg = function(){

	var som = new Vector(0, 0);
	
	som.add(this.krachten);
	
	som.dx /= this.massa;
	som.dy /= this.massa;
	
	this.snelheid.add(som);
	
	this.x += this.snelheid.dx;
	this.y += this.snelheid.dy;
	
	
	return this;
};
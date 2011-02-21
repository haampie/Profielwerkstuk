/**
 * De Wereld houdt alles bij elkaar
 */
function Wereld(breedte, hoogte, ctx){
  this.breedte = breedte;
  this.hoogte = hoogte;
  this.ctx = ctx;
  this.voorwerpen = [];
}

/**
 * Doe een stap in de tijd voor elk voorwerp
 */
Wereld.prototype.stap = function(t){
  
  // Verplaats elk voorwerp
  this.voorwerpen.forEach(function(vw, i){
    vw.stap(t);
  });
};

Wereld.prototype.nieuwVoorwerp = function(vw){
  this.voorwerpen.push(vw);
};

/**
 * Teken elk voorwerp op het huidige tijdstip
 */
Wereld.prototype.teken = function(){
  
  // Maak het scherm leeg
  this.ctx.clearRect(0, 0, this.breedte, this.hoogte);
  
  // Teken elk voorwerp
  this.voorwerpen.forEach(function(vw, i){
    vw.teken(this.ctx, true);
  }, this);
};

Vector.prototype.teken = function(ctx, x, y, kleur){
	ctx.save();
	
	ctx.strokeStyle = ctx.fillStyle = (kleur ? kleur : 'red');
	ctx.lineWidth = 1;
	ctx.translate(x, y);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(this.x, this.y);
	ctx.stroke();
	
	ctx.translate(this.x, this.y);
	ctx.rotate(Math.atan2(this.y, this.x)-1.25*Math.PI);
	
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 5);
	ctx.lineTo(5, 0);
	ctx.fill();
	
	ctx.restore();
};

/**
 *
 */
function Cirkel(r, px, py){
	this.straal = r;
	this.positie = new Vector(px, py);
	this.massa = 1000;
	
	this.snelheid = new Vector();
	this.krachten = [];
	this.resulterend = new Vector();
}

Cirkel.prototype.nieuweKracht = function(){
	var args = Array.prototype.slice.call(arguments);
  
	for(var i=0; i<args.length; i++){
		this.krachten.push(args[i]);
	}
  
	return this;
};

Cirkel.prototype.teken = function(ctx, krachten){
	ctx.fillStyle = '#333';
	
	// Teken de cirkel
	ctx.beginPath();
	ctx.arc(this.positie.x, this.positie.y, this.straal, 0, 2*Math.PI, true);
	ctx.fill();
	
	if(krachten && krachten===true){
		// Teken alle krachten
		for(var i=0; i<this.krachten.length; i++){
			this.krachten[i].teken(ctx, this.positie.x, this.positie.y);
		}
		
		// Teken de resulterende kracht als er meer dan 1 kracht op de cirkel werkt
		if(this.krachten.length > 1){
			(new Vector()).plus(this.krachten).teken(ctx, this.positie.x, this.positie.y, 'green');
		}
	}
	
	return this;
};

/**
 * Bij de beweging wordt de nieuwe snelheid berekend
 * gebruikmakend van de krachten van het moment
 * F = m*a -> a = F/m. 
 * v += a. 
 * p = v*t
 */
Cirkel.prototype.stap = function(t){

	// Maak een nulvector
	var som = new Vector();
	
	// Tel alle krachten bij elkaar op
	this.krachten.forEach(function(el){
		som.plus(el);
	});
	
	// Deel door de massa
	som.deel(this.massa);
	
	// Versnelling optellen bij de snelheid
	this.snelheid.plus(som);
	
	// Tel de snelheid op bij de positie.
	this.positie.plus(this.snelheid.krijgProduct(t));
	
	// Voor chaining
	return this;
};
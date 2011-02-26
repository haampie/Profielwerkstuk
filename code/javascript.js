Math.randInt = function(a, b){
  return Math.random()*(b-a)+a;
};


/**
 * De Wereld houdt alles bij elkaar
 */
function Wereld(breedte, hoogte, ctx){
  this.breedte = breedte;
  this.hoogte = hoogte;
  this.ctx = ctx;
  this.voorwerpen = [];
}

Wereld.TEKENSNELHEID = true;
Wereld.TEKENKRACHTEN = true;

/**
 * Kijk of er een botsing gebeurt tussen twee voorwerpen
 */
Wereld.botst = function(een, twee){
  var vrel = een.snelheid.krijgVerschil(twee.snelheid);
  var Xrel = een.positie.krijgVerschil(twee.positie);
  var a = vrel.inproduct(vrel);
  var b = Xrel.inproduct(vrel);
  var c = Xrel.inproduct(Xrel) - (een.straal + twee.straal)*(een.straal + twee.straal);
  var d = b*b - a*c;
  
  if(d < 0) return false;
  
  var t2 = (-b - Math.sqrt(d))/a;
  var t1 = (-b + Math.sqrt(d))/a;
  
  if(t2 <= 0 || t2 > 1){
    if(t1 <= 0 || t1 > 1){
      return false;
    } else {
      return t1;
    }
  } else {
    return t2;
  }
};

Wereld.berekenGevolg = function(een, twee){
  var p1 = een.positie.krijgSom(een.snelheid.krijgProduct(een.move));
  var p2 = twee.positie.krijgSom(twee.snelheid.krijgProduct(twee.move));
  var diff = p2.krijgVerschil(p1);
  var eenheidsnormaal = diff.krijgEenheidsvector();
  
  var relatieveSnelheid = een.snelheid.krijgVerschil(twee.snelheid);
  
  var impuls = eenheidsnormaal.inproduct( relatieveSnelheid.krijgProduct( -2 ) );
      impuls /= eenheidsnormaal.inproduct( eenheidsnormaal.krijgProduct( 1 / een.massa + 1 / twee.massa ) );
     
  var reactieEen = eenheidsnormaal.krijgProduct( impuls / een.massa );
	var reactieTwee = eenheidsnormaal.krijgProduct( -impuls / twee.massa );
  
  een.snelheid = een.snelheid.krijgSom( reactieEen );
	twee.snelheid = twee.snelheid.krijgSom( reactieTwee );
};

/**
 * Doe een stap in de tijd voor elk voorwerp
 */
Wereld.prototype.stap = function(voorwaartsch){
  
  // Reken de nieuwe snelheid uit
  this.voorwerpen.forEach(function(vw, i){
    vw.move = 1;
    vw.stap(voorwaartsch);
  }, this);
  
  var botsingGebeurt = false;
  
  // Zoek per voorwerp naar botsingen met elk volgend voorwerp
  this.voorwerpen.forEach(function(vw, i){
    // Zoek naar botsingen!
    for(var j=i+1; j<this.voorwerpen.length; j++){
    
      // Beweeg het voorwerp naar zijn nieuwe positie
      var botsing = Wereld.botst(vw, this.voorwerpen[j]);
      
      if(typeof botsing == 'number'){
        
        // Er gebeurt een botsing
        botsingGebeurt = true;
        vw.move = this.voorwerpen[j].move = botsing;
        
        // Verplaats de voorwerpen en bereken de snelheden na de botsing
        Wereld.berekenGevolg(vw, this.voorwerpen[j]);
      }
    }
  }, this);
  
  // Beweeg elk voorwerp
  this.voorwerpen.forEach(function(vw, i){
    vw.beweeg(vw.move);
  }, true);
  
  return false;
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
  
  // alleen tekenen als er een lengte is
  if(this.x == 0 && this.y ==0) return;
  
	ctx.save();
	
	ctx.strokeStyle = ctx.fillStyle = (kleur ? kleur : 'red');
	ctx.lineWidth = 1;
	ctx.translate(x, y);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(this.x*20, this.y*20);
	ctx.stroke();
	
	ctx.translate(this.x*20, this.y*20);
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
	this.straal = r || 0;
	this.positie = new Vector(px || 0, py || 0);
	this.massa = 10;
	
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

Cirkel.prototype.teken = function(ctx){
	ctx.fillStyle = '#333';
	
	// Teken de cirkel
	ctx.beginPath();
	ctx.arc(this.positie.x, this.positie.y, this.straal, 0, 2*Math.PI, true);
	ctx.fill();
	
	if(Wereld.TEKENKRACHTEN){
		// Teken alle krachten
		for(var i=0; i<this.krachten.length; i++){
			this.krachten[i].teken(ctx, this.positie.x, this.positie.y);
		}
		
		// Teken de resulterende kracht als er meer dan 1 kracht op de cirkel werkt
		if(this.krachten.length > 1){
			(new Vector()).plus(this.krachten).teken(ctx, this.positie.x, this.positie.y, 'green');
		}
	}
  
  if(Wereld.TEKENSNELHEID){
    this.snelheid.teken(ctx, this.positie.x, this.positie.y, 'blue');
  }
	
	return this;
};

/**
 * Bij de beweging wordt de nieuwe snelheid berekend
 * gebruikmakend van de krachten van het moment
 * Het voorwerp wordt niet bewogen.
 * F = m*a -> a = F/m. 
 * v += a.
 */
Cirkel.prototype.stap = function(voorwaartsch){

	// Maak een nulvector
	var som = new Vector();
	
	// Tel alle krachten bij elkaar op
	this.krachten.forEach(function(el){
		som.plus(el);
	});
	
	// Deel door de massa
	som.deel(this.massa);
	
	// Versnelling optellen bij de snelheid
  if(voorwaartsch){
    this.snelheid.plus(som);
  } else {
    this.snelheid.min(som);
  }
	
	// Voor chaining
	return this;
};

Cirkel.prototype.beweeg = function(a){
	// Tel de snelheid op bij de positie.
	this.positie.plus(this.snelheid.krijgProduct(a));
};
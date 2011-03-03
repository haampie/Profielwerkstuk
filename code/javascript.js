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
  this.statischeVoorwerpen = [];
}

Wereld.TEKENSNELHEID = true;
Wereld.TEKENKRACHTEN = true;

/**
 * Kijk of er een botsing gebeurt tussen twee voorwerpen
 */
Wereld.botst = function(een, twee){
  if(een instanceof Cirkel && twee instanceof Cirkel){
    var vrel = een.snelheid.krijgVerschil(twee.snelheid);
    var Xrel = een.positie.krijgVerschil(twee.positie);
    var a = vrel.inproduct(vrel);
    var b = Xrel.inproduct(vrel);
    var c = Xrel.inproduct(Xrel) - (een.straal + twee.straal)*(een.straal + twee.straal);
    var d = b*b - a*c;
    
    if(d < 0) return false;
    
    if(a == 0) return false;
    
    var t2 = (-b - Math.sqrt(d))/a;
    var t1 = (-b + Math.sqrt(d))/a;
    
    if(t2 < 0 || t2 >= 1){
      if(t1 < 0 || t1 >= 1){
        return false;
      } else {
        return t1;
      }
    } else {
      return t2;
    }
  }
  
  else if(een instanceof Cirkel && twee instanceof Lijnstuk){
    var normaal = twee.vector.krijgNormaal();
    
    // f = (d-c).n;
    var f = een.positie.krijgSom(een.snelheid).min(een.positie).inproduct(normaal);
    
    if(f == 0){
      return false;
    }
    
    // e = (a-c).n;
    var e = twee.startpunt.krijgVerschil(een.positie).inproduct(normaal);
    
    // g = r*||n||
    var g = een.straal * normaal.norm;
    
    var t = (-g + e)/f;
    var t2 = (g + e)/f;
    
    // kijk of t2 eerder plaatsvond
    if(t2 >= 0 && t2 < t){
      t = t2;
    }
    
    // Kijk of er een geldig tijdstip is
    if(t >= 0 && t < 1){
      var w = een.positie.krijgSom(een.snelheid.krijgProduct(t)).min(twee.startpunt);
      var hoever = twee.vector.inproduct(w) / twee.vector.inproduct(twee.vector);
      
      console.log(t, hoever);
      
      if( hoever < 0 || hoever > 1 ){
        return false;
      }
      
      return t;
    }
    
    return false;
  }
};

Wereld.berekenGevolg = function(een, twee){
  if(een instanceof Cirkel && twee instanceof Cirkel){
    var diff = twee.positie.krijgVerschil(een.positie);
    var eenheidsnormaal = diff.krijgEenheidsvector();
    
    var relatieveSnelheid = een.snelheid.krijgVerschil(twee.snelheid);
    
    var impuls = eenheidsnormaal.inproduct( relatieveSnelheid.krijgProduct( -2 ) );
        impuls /= eenheidsnormaal.inproduct( eenheidsnormaal.krijgProduct( 1 / een.massa + 1 / twee.massa ) );
       
    var reactieEen = eenheidsnormaal.krijgProduct( impuls / een.massa );
    var reactieTwee = eenheidsnormaal.krijgProduct( -impuls / twee.massa );
    
    een.snelheid.plus( reactieEen );
    twee.snelheid.plus( reactieTwee );
  }
  
  else if(een instanceof Cirkel && twee instanceof Lijnstuk){
    var eenheidsnormaal = twee.vector.krijgEenheidsvector();
  }
};

Wereld.prototype.drawCallback = function(){};

Wereld.prototype.nieuweTekenVoorafganger = function(a){
  this.drawCallback = a;
};

/**
 * Doe een stap in de tijd voor elk voorwerp
 */
Wereld.prototype.stap = function(voorwaartsch){
  
  // Reken de nieuwe snelheid uit
  this.voorwerpen.forEach(function(vw, i){
    vw.move = 0;
    vw.stap(voorwaartsch);
  }, this);
  
  var botsingGebeurt = false;
  
  // Zoek per dynamisch voorwerp naar botsingen met elk ander dynamisch voorwerp
  this.voorwerpen.forEach(function(vw, i){
    // Zoek naar botsingen!
    for(var j=i+1; j<this.voorwerpen.length; j++){
    
      // Beweeg het voorwerp naar zijn nieuwe positie
      var botsing = Wereld.botst(vw, this.voorwerpen[j]);
      
      if(typeof botsing == 'number'){
        
        // Er gebeurt een botsing
        // botsingGebeurt = true;
        vw.move = this.voorwerpen[j].move = botsing;
        
        // Verplaats de voorwerpen naar botsingsstand
        vw.beweeg(botsing);
        this.voorwerpen[j].beweeg(botsing);
        
        // Bereken de snelheden na de botsing
        Wereld.berekenGevolg(vw, this.voorwerpen[j]);
        
        break;
      }
    }
    
    // Botsingen met statische voorwerpen
    for(var j = 0; j < this.statischeVoorwerpen.length; j++){
      
      var botsing = Wereld.botst(vw, this.statischeVoorwerpen[j]);
      
      if(typeof botsing == 'number'){
        botsingGebeurt = true;
        vw.move = botsing;
        
        vw.beweeg(botsing);
        
        Wereld.berekenGevolg(vw, this.statischeVoorwerpen[j]);
        
        break;
      }
    }
  }, this);
  
  // Beweeg elk voorwerp
  this.voorwerpen.forEach(function(vw, i){
    vw.beweeg(1 - vw.move);
  }, true);
  
  return botsingGebeurt;
};

Wereld.prototype.nieuwVoorwerp = function(vw, statisch){
  // Boolean afdwingen
  statisch = !!statisch;
  
  if(statisch){
    // Voeg statisch voorwerp toe
    this.statischeVoorwerpen.push(vw);
  } else {
    // Voeg dynamisch voorwerp toe
    this.voorwerpen.push(vw);
  }
};

Wereld.prototype.apocalyps = function(){
  this.voorwerpen = [];
  this.statischeVoorwerpen = [];
  this.drawCallback = function(){};
};

/**
 * Teken elk voorwerp op het huidige tijdstip
 */
Wereld.prototype.teken = function(){
  
  // Maak het scherm leeg
  this.ctx.clearRect(0, 0, this.breedte, this.hoogte);
  
  this.drawCallback.call(this);
  
  // Teken elk voorwerp
  this.voorwerpen.forEach(function(vw, i){
    vw.teken(this.ctx, true);
  }, this);
  
  this.statischeVoorwerpen.forEach(function(vw, i){
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
  
  return this;
};

/**
 * Maakt een cirkel
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
    var resulterende = new Vector();
    
		for(var i=0; i<this.krachten.length; i++){
      var k = this.krachten[i];
      var kracht = typeof k == 'function' ? k.call(this) : k;
			kracht.teken(ctx, this.positie.x, this.positie.y);
      resulterende.plus(kracht);
		}
		
		// Teken de resulterende kracht als er meer dan 1 kracht op de cirkel werkt
		if(this.krachten.length > 1){
      resulterende.teken(ctx, this.positie.x, this.positie.y, 'green');
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
		som.plus( typeof el == 'function' ? el.call(this) : el );
	}, this);
	
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

/**
 * Lijnstuk is een statisch voorwerp
 */
function Lijnstuk(px, py, dx, dy){

	this.startpunt = new Vector(px || 0, py || 0);
  this.vector = new Vector(dx || 0, dy || 0);
  
}

Lijnstuk.prototype.teken = function(ctx){
  ctx.save();
  
  ctx.translate(this.startpunt.x, this.startpunt.y);
  
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(this.vector.x, this.vector.y);
  ctx.stroke();
  
  ctx.restore();
  
  return this;
};
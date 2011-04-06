function nieuwItem(vw, i){
  return [
          '<li>',
            '<h2>Cirkel ', i, '</h2>',
            '<p class="clearfix">',
              '<label for="massa-', i, '">Massa: </label>',
              '<input type="text" name="massa-', i, '" id="massa-', i, '" size="4" value="', vw.massa, '" />',
            '</p>',
            '<p class="clearfix">',
              '<label for="straal-', i, '">Straal: </label>',
              '<input type="text" name="straal-', i, '" id="straal-', i, '" size="4" value="', vw.straal, '" />',
            '</p>',
            '<p class="clearfix">',
              '<label for="positie-dx-', i, '">Positie: </label>',
              '<input type="text" name="positie-dx-', i, '" id="positie-dx-', i, '" size="4" value="', vw.positie.x , '" /> ',
              '<input type="text" name="positie-dy-', i, '" id="positie-dy-', i, '" size="4" value="', vw.positie.y , '" />',
            '</p>',
            '<p class="clearfix">',
              '<label for="snelheid-dx-', i, '">Snelheid: </label>',
              '<input type="text" name="snelheid-dx-', i, '" id="snelheid-dx-', i, '" size="4" value="', vw.snelheid.x , '" /> ',
              '<input type="text" name="snelheid-dy-', i, '" id="snelheid-dy-', i, '" size="4" value="', vw.snelheid.y , '" />',
            '</p>',
          '</li>'
         ].join('');
}

$(document).ready(function(){
  var $loopBtn = $('#loop'),
      $stapBtn = $('#stap'),
      $nieuwBtn = $('#add'),
      $voorwerpLst = $('#voorwerpLijst');

  // Automatisch afspelen
  $loopBtn.click(function(){
    // Als er al een interval bestaat moet je pauzeren
    if(interval){
      // Maak de volgendeknop weer klikbaar
      $stapBtn.removeAttr("disabled");
      
      // Maak de pauzeknop een startknop
      $loopBtn.text('Start');
      
      // Haal het interval weg
      clearInterval(interval);
      interval = null;
    }
    
    // Anders moet je er een maken
    else {
      // Volgendeknop even disabelen
      $stapBtn.attr("disabled", "disabled");
      
      // Maak de startknop een pauzeknop
      $loopBtn.text('Stop');
      
      // Nieuw interval met ongeveer 60fps
      interval = setInterval(function(){
        loop(true);
      }, 1000 / 60);
    }
    
    return false;
  });

  // Ga heen, en lope voorwaartsch
  $stapBtn.click(function(){
    if(!interval){
      loop(true);
    }
    return false;
  });

  $('#menubar1, #menubar2, #voorwerpen').submit(function(){ return false; });

  $('#showOptions').toggle(function(){
    $(this).addClass('uitgeklapt');
    $("#opties").show();
  }, function(){
    $(this).removeClass('uitgeklapt');
    $("#opties").hide();
  });

  $('#krachten').change(function(){
    Wereld.TEKENKRACHTEN = !Wereld.TEKENKRACHTEN;
    if(!interval){
      wereld.teken();
    }
  });

  $('#snelheid').change(function(){
    Wereld.TEKENSNELHEID = !Wereld.TEKENSNELHEID;
    if(!interval){
      wereld.teken();
    }
  });
  
  
  $('#vernieuwData').click(function(){
    $voorwerpLst.html('');
    
    wereld.voorwerpen.forEach(function(vw, i){      
      $voorwerpLst.append($(nieuwItem(vw, i+1)));
    });
    
    return false;
  });
  
  $('.reset').click(function(){
    $voorwerpLst.children().each(function(i){
      var j = i+1;
      
      if(!wereld.voorwerpen[i]){
        wereld.nieuwVoorwerp(new Cirkel());
      }
      
      wereld.voorwerpen[i].massa = parseFloat( $('#massa-' + j).val(), 10 );
      wereld.voorwerpen[i].straal = parseFloat( $('#straal-' + j).val(), 10 );
      wereld.voorwerpen[i].positie = new Vector( parseFloat( $('#positie-dx-' + j).val(), 10 ), parseFloat( $('#positie-dy-' + j).val(), 10 ) );
      wereld.voorwerpen[i].snelheid = new Vector( parseFloat( $('#snelheid-dx-' + j).val(), 10 ), parseFloat( $('#snelheid-dy-' + j).val(), 10 ) );
    });
    
    wereld.teken();
  });
  
  $nieuwBtn.click(function(){
    $voorwerpLst.append($(nieuwItem(new Cirkel(), $voorwerpLst.children().length + 1)));
  });
  
  $('#vb1').click(function(){
    wereld.apocalyps();
    
    var cirkel = new Cirkel(20, 240, 500);
    cirkel.snelheid = new Vector(0, -4);
    cirkel.massa = 50;
    cirkel.nieuweKracht( new Vector(0, cirkel.massa/50) );
    cirkel.nieuweKracht( new Vector(1, 0) );
    
    var cirkel2 = new Cirkel(30, 640, 500);
    cirkel2.snelheid = new Vector(-2, -4);
    cirkel2.massa = 112.5;
    cirkel2.nieuweKracht( new Vector(0, cirkel2.massa/50) );
    
    wereld.nieuwVoorwerp(cirkel);
    wereld.nieuwVoorwerp(cirkel2);
    
    $('#vernieuwData').click();
    wereld.teken();
    
    return false;
  });
  
  $('#vb2').click(function(){
    wereld.apocalyps();
    
    wereld.nieuweTekenVoorafganger(function(){
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.fillStyle = '#111';
      this.ctx.arc(400, 300, 2, 0, 2*Math.PI, true);
      this.ctx.arc(200, 300, 2, 0, 2*Math.PI, true);
      this.ctx.fill();
      this.ctx.restore();
    });
    
    var cirkel = new Cirkel(20, 350, 290);
    cirkel.snelheid = new Vector(0, -4);
    cirkel.massa = 50;
    cirkel.nieuweKracht( function(){
      return new Vector((400-this.positie.x)/50, (300-this.positie.y)/50);
    } );
    
    var cirkel2 = new Cirkel(20, 200, 300);
    cirkel2.snelheid = new Vector(0, 4);
    cirkel2.massa = 50;
    cirkel2.nieuweKracht( function(){
      return new Vector((200-this.positie.x)/50, (300-this.positie.y)/50);
    } );
    
    var cirkel3 = new Cirkel(40, 1300, 450);
    cirkel3.nieuweKracht( new Vector(-2, 0) );
    cirkel3.massa = 150;
    
    wereld.nieuwVoorwerp(cirkel);
    wereld.nieuwVoorwerp(cirkel2);
    wereld.nieuwVoorwerp(cirkel3);
    
    $('#vernieuwData').click();
    wereld.teken();
    
    return false;
  });
  
  $('#vb3').click(function(){
    wereld.apocalyps();
    
    var cirkel = new Cirkel(20, 20, 300);
    cirkel.snelheid = new Vector(3, 0);
    cirkel.massa = 50;
    cirkel.nieuweKracht( new Vector(2, 0) );
    
    var cirkel2 = new Cirkel(20, 100, 300);
    cirkel2.massa = 50;
    
    var cirkel3 = new Cirkel(20, 200, 300);
    cirkel3.massa = 50;
    
    var cirkel4 = new Cirkel(20, 300, 300);
    cirkel4.massa = 50;
    
    wereld.nieuwVoorwerp(cirkel);
    wereld.nieuwVoorwerp(cirkel2);
    wereld.nieuwVoorwerp(cirkel3);
    wereld.nieuwVoorwerp(cirkel4);
    
    $('#vernieuwData').click();
    wereld.teken();
    
    return false;
  });
  
  $('#vb4').click(function(){
    wereld.apocalyps();
    
    var cirkel1 = new Cirkel(20, 300, 260);
    cirkel1.snelheid = new Vector(2, 1);
    cirkel1.nieuweKracht( new Vector(0, 0.5) );
    cirkel1.massa = 50;
    
    var cirkel2 = new Cirkel(20, 200, 350);
    cirkel2.snelheid = new Vector(-1, -1);
    cirkel2.nieuweKracht( new Vector(0, 0.5) );
    cirkel2.massa = 50;
    
    var lijn1 = new Lijnstuk(100, 200, 0, 200);
    var lijn2 = new Lijnstuk(500, 200, 0, 200);
    var lijn3 = new Lijnstuk(100, 200, 400, 0);
    var lijn4 = new Lijnstuk(100, 400, 400, 0);
    
    wereld.nieuwVoorwerp(cirkel1);
    wereld.nieuwVoorwerp(cirkel2);
    wereld.nieuwVoorwerp(lijn1, true);
    wereld.nieuwVoorwerp(lijn2, true);
    wereld.nieuwVoorwerp(lijn3, true);
    wereld.nieuwVoorwerp(lijn4, true);
    
    $('#vernieuwData').click();
    wereld.teken();
    
    return false;
  });
  
  $('#vb5').click(function(){
    wereld.apocalyps();
    
    var punt = new Vector(400, 200);
    
    var cirkel2 = new Cirkel(20, 400, 200);
    cirkel2.massa = 50;
    cirkel2.nieuweKracht( function(){
      return punt.krijgVerschil(this.positie).deel(50);
    } );
    cirkel2.nieuweKracht( function(){
      return this.snelheid.krijgProduct(-1/10);
    } );
    cirkel2.nieuweKracht( new Vector(0, 3) );
    
    var cirkel3 = new Cirkel(40, 700, 500);
    cirkel3.snelheid = new Vector(-5, -5);
    cirkel3.nieuweKracht( new Vector(0, 9) );
    cirkel3.massa = 150;
    
    wereld.nieuweTekenVoorafganger(function(){
      var diff = cirkel2.positie.krijgVerschil(punt);
      this.ctx.save();
      
      this.ctx.translate(punt.x, punt.y);
      
      this.ctx.fillStyle = '#111';
      this.ctx.strokeStyle = '#AAA';
      
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 2, 0, 2*Math.PI, true);
      this.ctx.fill();
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(diff.x, diff.y);
      this.ctx.stroke();
      this.ctx.restore();
    });
    
    wereld.nieuwVoorwerp(cirkel2);
    wereld.nieuwVoorwerp(cirkel3);
    
    $('#vernieuwData').click();
    wereld.teken();
    
    return false;
  });
  
  $('#vb6').click(function(){
    wereld.apocalyps();
    
    var zon = new Cirkel(100, 400, 300);
    var aarde = new Cirkel(3.66, 105, 300);
    var maan = new Cirkel(1, 95, 300);
    
    zon.massa = 27000;
    aarde.massa = 81.3;
    maan.massa = 1;
    
    function aantrekkingskracht(a, b){
      
      var vec = b.positie.krijgVerschil(a.positie);
      var richting = vec.krijgEenheidsvector();
      var norm = a.massa*b.massa/vec.inproduct(vec)/10;
      
      return richting.keer(norm);
    }
    
    aarde.snelheid = new Vector(0, -3);
    maan.snelheid = new Vector(0, -2);
    
    wereld.nieuwVoorwerp(zon);
    wereld.nieuwVoorwerp(aarde);
    wereld.nieuwVoorwerp(maan);
    
    for(var i=0; i<wereld.voorwerpen.length; i++){
      for(var j=0; j<wereld.voorwerpen.length; j++){
        if(i==j) continue;
        
        wereld.voorwerpen[i].nieuweKracht((function(i, j){
          return function(){
            return aantrekkingskracht(wereld.voorwerpen[i], wereld.voorwerpen[j]);
          };
        })(i, j));
      }
    }
    
    $('#vernieuwData').click();
    wereld.teken();
    
    return false;
  });
  
  $('#vb7').click(function(){
    wereld.apocalyps();
    
    var cirkel = new Cirkel(10, 110, 394);
    cirkel.snelheid = new Vector(2, -0.5);
    cirkel.massa = 50;
    
    var cirkel2 = new Cirkel(10, 100, 371);
    cirkel2.snelheid = new Vector(2, -0.5);
    cirkel2.massa = 50;
    
    var cirkel3 = new Cirkel(10, 90, 348);
    cirkel3.snelheid = new Vector(2, -0.5);
    cirkel3.massa = 50;
    
    var lijnstuk = new Lijnstuk(400, 300, 0, 300);
    
    wereld.nieuwVoorwerp(cirkel);
    wereld.nieuwVoorwerp(cirkel2);
    wereld.nieuwVoorwerp(cirkel3);
    wereld.nieuwVoorwerp(lijnstuk, true);
    
    
    $('#vernieuwData').click();
    wereld.teken();
    
    return false;
  });
});
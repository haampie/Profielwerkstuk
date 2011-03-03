function nieuwItem(vw, i){
  return [
          '<li>',
            '<h2>Voorwerp ', i, '</h2>',
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
    
    var cirkel = new Cirkel(20, 300, 300);
    cirkel.snelheid = new Vector(3, 0);
    cirkel.massa = 50;
    
    var lijn = new Lijnstuk(500, 200, 10, 200);
    
    wereld.nieuwVoorwerp(cirkel);
    wereld.nieuwVoorwerp(lijn, true);
    
    $('#vernieuwData').click();
    wereld.teken();
    
    return false;
  });

  
  $('#tekenlijn').click(function(){
    var lijnstuk = new Lijnstuk(50, 100, 200, 100);
    
    // statisch voorwerp
    wereld.nieuwVoorwerp(lijnstuk, true);
    
    wereld.teken();
    
    return false;
  });
});
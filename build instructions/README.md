# Bascetta_Star build instructions #
 - get 30 half transparent 200mm square papers<br>
   I bought some at Amazon<br>
<img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/paper20x20.png" width="300" height="300"><br><br>
 - fold the papers<br>
   you can google the folding instructions or watch a youtube video<br><br>
 - draw and cut out the triangles for the icosahedron of cardboard<br>
   the triangles have an edge length of 80mm<br>
   also write down the numbers for led order on it<br> 
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/cut.jpg" width="500"><br><br>
 - crease the folding corners for easy folding<br>
   I did this with a pair of dividers<br>
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/crease.jpg" width="500"><br>
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/fold.jpg" width="500"><br><br>
 - glue it together with duct tape to get the icosahedron<br>
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/glued_01.jpg" height="300"><br><br>
 - the icosahedron should fit into the star like this<br>
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/inside.jpg" height="300"><br><br>
- glue the ws2812 leds onto the star like this<br>
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/leds_glued.jpg" height="300"><br><br>
- solder everything together<br>
  - all +5V together (esp8266, ws2812, supply)<br>
  - all GND together (esp8266, ws2812, supply)<br>
  - esp8266 (WeMos D1 Mini) D4 to DI of led1<br>
  - DO of led1 to DI of led2<br>
    DO of led3 to DI of led3<br>
    ...<br>
    DO of led19 to DI of led20<br>
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/bascetta_star_hw.jpg" height="300"><br><br>

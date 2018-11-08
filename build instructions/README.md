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
    DO of led2 to DI of led3<br>
    ...<br>
    DO of led19 to DI of led20<br>
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/circuit.png" height="290"><br>
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/bascetta_star_hw.jpg" height="300"><br><br>
 - use one of these to flash the firmware to the esp8266<br>
   https://github.com/espressif/esptool<br>
   https://github.com/nodemcu/nodemcu-flasher<br><br>
 - use Esplorer to load the files from <br>
   /html and /lua to the esp8266<br>
   <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/files_on_esp8266.png" width="1600px"><br>
   Files on esp8266:<br> 
   - init.lua -> UPLOAD THIS FILE LAST<br> 
   - webserver.lua -> compile to .lc and delete<br> 
   - animations.lua -> compile to .lc and delete<br> 
   - AP_setup.lua -> compile to .lc and delete<br> 
   - set_wifi.lua -> compile to .lc and delete<br> 
   - wifi.txt<br><br>
   - apple-touch-icon.png<br> 
   - arrow.svg<br> 
   - favicon.ico<br>
   - main.html<br> 
   - main.min.css<br> 
   - main.min.js<br> 
   - settings.svg<br> 
   - setup.html<br> 
   - setup.css<br> 
   - setup.js<br><br>
 - put everything together<br>
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/rainbow_0.jpeg" width="250" height="250"><br>
   
   

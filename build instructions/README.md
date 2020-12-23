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
   /lua, /config and /html to the esp8266 <br>
   order is important <br>
   <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/files_on_esp8266.png" width="1600px"><br>
 - upload lua files (except init.lua) to esp8266 (upload button)<br> 
   - /lua/animations.lua <br> 
   - /lua/AP_setup.lua <br> 
   - /lua/compile.lua <br> 
   - /lua/save_state.lua <br> 
   - /lua/save_wifi.lua <br>
   - /lua/webserver.lua <br><br>
 - run compile.lua <br>
   - reload button (right side) <br>
   - click on compile.lua <br>
     this compiles all the needed .lua files to .lc and deletes the .lua afterwards
 - upload files to esp8266 (upload button)<br> 
   - /config/wifi.txt<br>
   - /config/state.txt<br>
   - /config/map.txt<br>
   - /html/apple-touch-icon.png<br> 
   - /html/arrow.svg<br> 
   - /html/favicon.ico<br>
   - /html/main.html<br> 
   - /html/main.min.css<br> 
   - /html/main.min.js<br> 
   - /html/settings.svg<br> 
   - /html/setup.html<br> 
   - /html/setup.min.css<br> 
   - /html/setup.min.js<br>
   - /lua/init.lua <br><br>
 - put everything together<br>
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/rainbow_0.jpeg" width="250" height="250"><br>
   
   

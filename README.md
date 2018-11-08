# Bascetta_Star #
This project is about a white origami star for christmas.<br>
The star is folded out of 30 white papers.<br>
If you want to fold your own star, just google "Bascetta star" for instructions.<br>
To add colors, every jag has its own ws2812 led.<br>
The leds are controlled by an esp8266.<br>
The UI is a webpage hosted on the esp8266.<br>

Preview:
https://janitz.github.io/Bascetta_Star/html/main.html

The project includes following parts:
 - html (the web page)
 - css (style of the web page)
 - javaScript (for making things move on the web page) (minified by https://www.minifier.org)
 - lua (for programming the esp8266)
 - vbs (for creating the 3d model of the star) 
 - sh (for fast starting a webserver in python)

Build Instructions:
https://github.com/janitz/Bascetta_Star/tree/master/build%20instructions

# Pictures #
### The Star ###
<p float="left">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/red_0.jpeg" width="250" height="250">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/green_0.jpeg" width="250" height="250">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/blue_0.jpeg" width="250" height="250">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/white_0.jpeg" width="250" height="250">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/white_1.jpeg" width="250" height="250">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/rainbow_0.jpeg" width="250" height="250">
</p>

### The Webpage ###
<p float="left">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/webpage_0.png" width="250">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/webpage_1.png" width="250">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/webpage_2.png" width="250">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/webpage_3.png" width="250">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/webpage_4.png" width="250">
 <img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/webpage_5.png" width="250">
</p>

# Files on esp8266 module #
Take a look at the picture to get an idea which files are on the esp8266 module.<br>
Notice the file extension!!!<br>
Most .lua files has been compiled to .lc!!!
<img src="https://raw.githubusercontent.com/janitz/Bascetta_Star/master/pictures/files_on_esp8266.png" width="1600px">

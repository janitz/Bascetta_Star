
//classes
class Color{
	constructor(h=0, s=100, l=50){
		this.h=h;
		this.s=s;
		this.l=l;
		this.checkLimits();
	}

	checkLimits(){
	   this.h += 3600;
	   this.h %= 360;
	}

	readString(str){
		if (str !== ""){
			this.h=parseFloat(/\d*(\.?\d+)(?=,)/.exec(str)[0]);
			this.s=parseFloat(/\d*(\.?\d+)(?=%,)/.exec(str)[0]);
			this.l=parseFloat(/\d*(\.?\d+)(?=%\))/.exec(str)[0]);
		}
	}

	fadeTo(col, percent){
		if(percent<0)percent=0;
		if(percent>100)percent=100;
		
		this.checkLimits();
		col.checkLimits();
		let hDiff = col.h - this.h;
		if (hDiff > 180) hDiff -=360;
		if (hDiff < -180) hDiff += 360;

		let sDiff = col.s - this.s;
		let lDiff = col.l - this.l;

		let h = (this.h + 3600 + (hDiff * percent / 100)) % 360;
		let s = this.s + (sDiff * percent / 100);
		let l = this.l + (lDiff * percent / 100);
	
		return new Color(h,s,l);
	}

	toString(forStar=false){
		if (forStar){
			let r,g,b,c,h,x,m;
			c = (1 - Math.abs((this.l / 50) - 1)) * this.s / 100
			h = this.h / 60;
			x = c * (1 - Math.abs((h % 2) - 1))
			m = (this.l / 100) - (c / 2)
			
			switch (Math.floor(h)) {
				case 0:
					r=c;
					g=x;
					b=0;
					break;
				case 1:
					r=x;
					g=c;
					b=0;
					break;
				case 2:
					r=0;
					g=c;
					b=x;
					break;
				case 3:
					r=0;
					g=x;
					b=c;
					break;
				case 4:
					r=x;
					g=0;
					b=c;
					break;
				default: //5
					r=c;
					g=0;
					b=x;
					break;
				}
			r=(r+m)*255
			g=(g+m)*255
			b=(b+m)*255
			
			let o = 0.9; //opacity for paper color of the star
			r=255+(r-255)*o
			g=255+(g-255)*o
			b=255+(b-255)*o
			
			return "rgb("+r+","+g+","+b+")";
		}
		return "hsl("+this.h+","+this.s+"%,"+this.l+"%)";
	}
}
class Point {
	constructor(x=0, y=0, z=0){
		this.x = x;
		this.y = y;
		this.z = z;
		this.rotateYX(0,0);
		this.convert2d();
	}

	getPerspectiveDistance(){
		let x = this.xRot - perspective.x;
		let y = this.yRot - perspective.y;
		let z = this.zRot - perspective.z;
		return (x * x) + (y * y) + (z * z);
	}

	rotateYX(b, a){ //b rotates around y, a rotates around x (in this order)
		let rad = b * Math.PI / 180;
		let cos = Math.cos(rad);
		let sin = Math.sin(rad);
		let x = this.x;
		let y = this.y;
		let z = this.z;
		this.xRot = (cos * x) - (sin * z);
		this.yRot = y;
		this.zRot = (sin * x) + (cos * z);

		rad = a * Math.PI / 180;
		cos = Math.cos(rad);
		sin = Math.sin(rad);
		x = this.xRot;
		y = this.yRot;
		z = this.zRot;
		this.xRot = x;
		this.yRot = (cos * y) - (sin * z);
		this.zRot = (sin * y) + (cos * z);

		this.xRot += star.width / 2;
		this.yRot += star.height / 2;
		
	}

	 convert2d(){
		let x,y,z;	
		x = this.xRot - perspective.x;
		y = this.yRot - perspective.y;
		z = this.zRot - perspective.z;
		this.x2d = perspective.x - (x * perspective.z / z);
		this.y2d = perspective.y - (y * perspective.z / z);
	}

}
class Path {
	constructor(points, number = 0){
		this.points = [];
		points.forEach((point) => {
			this.addPoint(new Point(point[0], point[1], point[2]));
		});
		this.number = number;
	}

	addPoint(point){
		this.points[this.points.length] = point;
	}

	getZOrderValue(){
		let z = 0;	
		let count = 0;
		this.points.forEach( (point) => {
			   count++;
			   z += point.getPerspectiveDistance(); 
			});
		return z / count;
	}

	drawPath(ctx) {
		ctx.fillStyle = colors[this.number].toString(true);
		ctx.beginPath();
		let point = this.points[this.points.length - 1];
		ctx.moveTo(point.x2d, point.y2d);
		this.points.forEach( (point) => {
			ctx.lineTo(point.x2d, point.y2d);
		});
		ctx.stroke();
		ctx.fill();
	}
}
class Figure {
	constructor(){
		this.paths = [];
	}

	addPath(points, number){
		let path;
		path = new Path(points, number);
		this.paths[this.paths.length] = path;
	}

	sortZ(){
		this.paths.sort( (path1, path2) => {
			return path2.getZOrderValue() - path1.getZOrderValue();
		});
	}
	
	
	drawFigure(angle, tilt){
		ctx.clearRect(0, 0, star.width, star.height);
		
		this.paths.forEach( (path) => {
			path.points.forEach( (point) => {
				point.rotateYX(angle, tilt);
				point.convert2d();
			});
		});
		
		this.sortZ();

		this.paths.forEach( (path) => {
			path.drawPath(ctx);
		});
	}

   

	

}

let serverIsEsp = false;

//html elements
let star = getById("star");
let menu = getById("menu");

//menu elements
let btnColors = {
	"bBlack":new Color(0,0,0), 
	"bWhite":new Color(0,0,100), 
	"bRed":new Color(0), 
	"bOrange":new Color(20), 
	"bYellow":new Color(60), 
	"bGreen":new Color(120), 
	"bCyan":new Color(180), 
	"bBlue":new Color(240), 
	"bPurple":new Color(270), 
	"bMagenta":new Color(300),
	"bCpSet":new Color(0,0,0)};
let cmds = [
	//"Color", //only internal cmd
	"bRainbowAll", 
	"bRainbowHor", 
	"bRainbowVer", 
	"bWalk1", 
	"bWalk2", 
	"bFade2", 
	"bFade3", 
	"bFade4", 
	"bUp2",
	"bUp3",
	"bUp4",
	"bSpiral2",
	"bSpiral3",
	"bSpiral4",
	"bRnd2",
	"bRnd3",
	"bRnd4",
	"bBlack", 
	"bWhite", 
	"bRed", 
	"bOrange", 
	"bYellow", 
	"bGreen", 
	"bCyan", 
	"bBlue", 
	"bPurple", 
	"bMagenta",
	"bCpSet"];
let cpElements = {
	"cpNH":getById("cpNH"),
	"cpNS":getById("cpNS"),
	"cpNL":getById("cpNL"),
	"cpRH":getById("cpRH"),
	"cpRS":getById("cpRS"),
	"cpRL":getById("cpRL")};
let speedRan = getById("speedRan");
let speedNum = getById("speedNum");
let lastSpeedUpdate = 0;
let originalX;
let originalY;
let rangeInput;

//3d viewer elements
let ctx = star.getContext("2d");
let perspective = {
	x:star.width/2, 
	y:0, 
	z:-1000};
let tilt = 25;
let fig = generateStar();
let currentRotation = 0;
let colors = []; //colors of the jags

//animation vars
let sendCmd = false;
let lastColors = [new Color(20), new Color(240), new Color(120) ,new Color(0, 0, 0)];
let cmd = "Color";
let speed = 200;
let animCnt = 0;
let currColNr = 0;
let nextColNr = 1;
let currJag = 1;
let lastJag = 0;
let colJag;
let colBg;
let neighborJags = [
	[1,4,5],
	[0,2,7],
	[1,3,9],
	[2,4,11],
	[0,3,13],

	[0,6,14],
	[5,7,15],
	[1,6,8],
	[7,9,16],
	[2,8,10],
	[9,11,17],
	[3,10,12],
	[11,13,18],
	[4,12,14],
	[5,13,19],

	[6,16,19],
	[8,15,17],
	[10,16,18],
	[12,17,19],
	[14,15,18]];
let concurentJags = [17,18,19,15,16,10,11,12,13,14,5,6,7,8,9,3,4,0,1,2];

//run the thing
init();
loop();

function init(){
	addEvents();

	//colored square on the left side of the color buttons
	let colBtns = document.getElementsByClassName("col");
	for(let i = 0; i < colBtns.length; i++){
		colBtns[i].style.borderLeftColor = btnColors[colBtns[i].id].toString();
	}
 
	cpInputRange();

	setAllColors(new Color(0,0,20));
	
	ctx.lineWidth = 1;
	ctx.lineCap = "round";
	ctx.strokeStyle = "#000"

}
function loop(){
   

	requestAnimationFrame(loop);
	currentRotation += 0.25;
	if(currentRotation > 360) currentRotation -= 360;
	animCnt = animCnt + speed;
	if(animCnt > 360000) animCnt = animCnt - 360000;
   
	if(lastSpeedUpdate>0)lastSpeedUpdate-=1;
	if(lastSpeedUpdate===1)sendSpeed();

	switch(cmd){
		case "Color":
			setAllColors(lastColors[0], false);
			break;
		case "bRainbowVer":
				for(let i = 0; i < 10; i++){
					let colorAngle = (animCnt / 250) + (i * 36);
					colorAngle %= 360;
					if (i%2 === 0) colors[i/2] = new Color(colorAngle,90,60);
					colors[i + 5] = new Color(colorAngle,95,55);
					if (i%2 === 1) colors[((i - 1)/2) + 15] = new Color(colorAngle,90,50);
				}
			break;
		case "bRainbowHor":
				for(let i = 0; i < 5; i++){
					let colorAngle = (animCnt / 250);
					colors[i] = new Color((colorAngle % 360),80,55);
					colors[(i*2) + 5] = new Color(((colorAngle + 30) % 360),90,55);
					colors[(i*2) + 6] = new Color(((colorAngle + 42) % 360),90,55);
					colors[i + 15] = new Color(((colorAngle + 72) % 360),90,55); 
				}
			break;
		case "bRainbowAll":
				let colorAngle = (animCnt / 250);
				setAllColors(new Color((colorAngle % 360),95,50), false);
			break;
		case "bWalk1":
		case "bWalk2":
			if(animCnt > 4000){
				animCnt = 0;
				setAllColors(lastColors[1]);
				let cnt = Math.floor((Math.random() * 1000)) % 2;
				for(let i = 0; i<3;i++){
					if(neighborJags[currJag][i] !== lastJag){
						if(cnt === 0){
							lastJag = currJag;
							currJag = neighborJags[lastJag][i];
							cnt --;
						} else {
							cnt--;
						}
					}
				}
				
			}
			colJag = lastColors[0];
			colBg = lastColors[1];
			colors[currJag] = colJag.fadeTo(colBg, animCnt / 100);
			colors[lastJag] = colJag.fadeTo(colBg, (animCnt / 1000 * 15) + 40);
			if (cmd === "bWalk2"){
				colors[concurentJags[currJag]] = colors[currJag];
				colors[concurentJags[lastJag]] = colors[lastJag];
			}
			break;
		case "bFade2":
		case "bFade3":
		case "bFade4":
			if(animCnt > 20000){
				animCnt = 0;
				currColNr = nextColNr;
				nextColNr ++;
			}
			if(nextColNr >= parseInt(cmd.substr(5,1))) nextColNr=0;
			
			setAllColors(lastColors[currColNr].fadeTo(lastColors[nextColNr],animCnt / 100));
			break;
		case "bRnd2":
		case "bRnd3":
		case "bRnd4":
			if(animCnt > 2000){
				animCnt = 0;
				let rndMax = parseInt(cmd.substr(4,1));
				let jagNo = Math.floor(Math.random() * 1000) % 20;
				let colNo = Math.floor(Math.random() * 1000) % rndMax;
				colors[jagNo] = lastColors[colNo];				
			}
			
			break;
		case "bUp2":
		case "bUp3":
		case "bUp4":
			if(animCnt > 20000){
				animCnt = 0;
				currColNr = nextColNr;
				nextColNr ++;
			}
			if(nextColNr >= parseInt(cmd.substr(3,1))) nextColNr=0;
			let c0 = lastColors[currColNr];
			let c1 = lastColors[nextColNr];
			let col0 = c0.fadeTo(c1,(animCnt/100))
			let col1 = c0.fadeTo(c1,((animCnt - 1000) / 100))
			let col2 = c0.fadeTo(c1,((animCnt - 1100) / 100))
			let col3 = c0.fadeTo(c1,((animCnt - 2100) / 100))


			for(let i = 0; i < 5; i++){
				colors[i] = col3;
				colors[(i*2) + 5] = col2;
				colors[(i*2) + 6] = col1;
				colors[i + 15] = col0; 
			}  
			break;   
			case "bSpiral2":
			case "bSpiral3":
			case "bSpiral4":
			if(animCnt > 40000){
				animCnt = 0;
				currColNr = nextColNr;
				nextColNr ++;
			}
			if(nextColNr >= parseInt(cmd.substr(7,1))) nextColNr=0;
			colors[Math.floor(animCnt/2000)]= lastColors[currColNr];
 
			break;	
		case "bBlack":
		case "bWhite":
		case "bRed":
		case "bOrange":
		case "bYellow":
		case "bGreen":
		case "bCyan":
		case "bBlue":
		case "bPurple":
		case "bMagenta":
			setAllColors(btnColors[cmd], true);
			cmd = "Color";
			break;
		case "bCpSet":
			let h,s,l;
			h = parseFloat(cpElements.cpRH.value);
			s = parseFloat(cpElements.cpRS.value);
			l = parseFloat(cpElements.cpRL.value);
			setAllColors(new Color(h,s,l), true);
			cmd = "Color";
			break;
	}
	
	if(sendCmd){
		sendCmd = false;
		send();
	}

	fig.drawFigure(currentRotation, tilt);
}

//functions
function generateStar(){
	let f = new Figure();
	f.addPath([[0,-180.152,137.648],[-50,-42.523,68.819],[50,-42.523,68.819]], 0);
	f.addPath([[0.008,-180.16,137.637],[50.002,-42.525,68.816],[0.002,-95.102,0]], 0);
	f.addPath([[-0.008,-180.16,137.637],[-0.002,-95.102,0],[-50.002,-42.525,68.816]], 0);
	f.addPath([[131.374,-179.936,42.019],[50.211,-42.525,68.664],[0.211,-95.101,-0.153]], 1);
	f.addPath([[130.9,-180.169,42.551],[80.902,-42.54,-26.279],[0.001,-95.111,0.012]], 1);
	f.addPath([[130.894,-180.175,42.543],[49.997,-42.538,68.825],[80.901,-42.541,-26.28]], 1);
	f.addPath([[80.69,-180.168,-111.498],[80.854,-42.669,-26.217],[-0.211,-95.101,-0.153]], 2);
	f.addPath([[80.898,-180.169,-111.347],[0.001,-42.531,-85.068],[-0.002,-95.102,-0.001]], 2);
	f.addPath([[81.117,-179.813,-111.774],[-0.047,-42.403,-85.131],[80.955,-42.314,-26.492]], 2);
	f.addPath([[-80.898,-180.169,-111.347],[0.002,-95.102,-0.001],[-0.001,-42.531,-85.068]], 3);
	f.addPath([[-80.69,-180.168,-111.498],[0.211,-95.101,-0.153],[-80.854,-42.669,-26.217]], 3);
	f.addPath([[-81.117,-179.813,-111.774],[-80.955,-42.314,-26.492],[0.047,-42.403,-85.131]], 3);
	f.addPath([[-130.894,-180.175,42.543],[-80.901,-42.541,-26.28],[-49.997,-42.538,68.825]], 4);
	f.addPath([[-130.9,-180.169,42.551],[-0.001,-95.111,0.012],[-80.902,-42.54,-26.279]], 4);
	f.addPath([[-131.374,-179.936,42.019],[-0.211,-95.101,-0.153],[-50.211,-42.525,68.664]], 4);
	f.addPath([[-0.006,-42.531,222.705],[-0.001,42.53,85.068],[49.997,-42.537,68.826]], 5);
	f.addPath([[0.006,-42.531,222.705],[-49.997,-42.537,68.826],[0.001,42.53,85.068]], 5);
	f.addPath([[0,-41.792,222.834],[-50,-42.303,68.955],[50,-42.303,68.955]], 5);
	f.addPath([[131.11,42.545,180.01],[0.048,42.402,85.132],[50.211,-42.524,68.665]], 6);
	f.addPath([[130.903,42.545,180.161],[80.901,42.54,26.281],[50.003,-42.524,68.817]], 6);
	f.addPath([[130.9,43.128,180.032],[80.902,42.618,26.152],[0.001,42.813,84.93]], 6);
	f.addPath([[212.017,-42.169,68.387],[80.956,-42.313,-26.491],[80.855,42.668,26.217]], 7);
	f.addPath([[211.8,-42.521,68.818],[50.001,-42.522,68.819],[80.903,42.539,26.279]], 7);
	f.addPath([[211.8,-42.303,68.953],[50.001,-42.303,68.954],[80.903,-42.618,-26.151]], 7);
	f.addPath([[211.8,42.521,-68.818],[50.001,42.522,-68.819],[80.903,-42.539,-26.279]], 8);
	f.addPath([[212.017,42.169,-68.387],[80.956,42.313,26.491],[80.855,-42.668,-26.217]], 8);
	f.addPath([[211.8,42.303,-68.953],[50.001,42.303,-68.954],[80.903,42.618,26.151]], 8);
	f.addPath([[130.9,-43.128,-180.032],[80.902,-42.618,-26.152],[0.001,-42.813,-84.93]], 9);
	f.addPath([[130.903,-42.545,-180.161],[80.901,-42.54,-26.281],[50.003,42.524,-68.817]], 9);
	f.addPath([[131.11,-42.545,-180.01],[0.048,-42.402,-85.132],[50.211,42.524,-68.665]], 9);
	f.addPath([[-0.006,42.531,-222.705],[-0.001,-42.53,-85.068],[49.997,42.537,-68.826]], 10);
	f.addPath([[0.006,42.531,-222.705],[-49.997,42.537,-68.826],[0.001,-42.53,-85.068]], 10);
	f.addPath([[0,41.792,-222.834],[-50,42.303,-68.955],[50,42.303,-68.955]], 10);
	f.addPath([[-131.11,-42.545,-180.01],[-50.211,42.524,-68.665],[-0.048,-42.402,-85.132]], 11);
	f.addPath([[-130.9,-43.128,-180.032],[-0.001,-42.813,-84.93],[-80.902,-42.618,-26.152]], 11);
	f.addPath([[-130.903,-42.545,-180.161],[-50.003,42.524,-68.817],[-80.901,-42.54,-26.281]], 11);
	f.addPath([[-211.8,42.521,-68.818],[-80.903,-42.539,-26.279],[-50.001,42.522,-68.819]], 12);
	f.addPath([[-212.017,42.169,-68.387],[-80.855,-42.668,-26.217],[-80.956,42.313,26.491]], 12);
	f.addPath([[-211.8,42.303,-68.953],[-80.903,42.618,26.151],[-50.001,42.303,-68.954]], 12);
	f.addPath([[-212.017,-42.169,68.387],[-80.855,42.668,26.217],[-80.956,-42.313,-26.491]], 13);
	f.addPath([[-211.8,-42.521,68.818],[-80.903,42.539,26.279],[-50.001,-42.522,68.819]], 13);
	f.addPath([[-211.8,-42.303,68.953],[-80.903,-42.618,-26.151],[-50.001,-42.303,68.954]], 13);
	f.addPath([[-131.11,42.545,180.01],[-50.211,-42.524,68.665],[-0.048,42.402,85.132]], 14);
	f.addPath([[-130.9,43.128,180.032],[-0.001,42.813,84.93],[-80.902,42.618,26.152]], 14);
	f.addPath([[-130.903,42.545,180.161],[-50.003,-42.524,68.817],[-80.901,42.54,26.281]], 14);
	f.addPath([[81.117,179.813,111.774],[-0.047,42.403,85.131],[80.955,42.314,26.492]], 15);
	f.addPath([[80.898,180.169,111.347],[0.001,42.531,85.068],[-0.002,95.102,0.001]], 15);
	f.addPath([[80.69,180.168,111.498],[80.854,42.669,26.217],[-0.211,95.101,0.153]], 15);
	f.addPath([[130.894,180.175,-42.543],[49.997,42.538,-68.825],[80.901,42.541,26.28]], 16);
	f.addPath([[130.9,180.169,-42.551],[80.902,42.54,26.279],[0.001,95.111,-0.012]], 16);
	f.addPath([[131.374,179.936,-42.019],[50.211,42.525,-68.664],[0.211,95.101,0.153]], 16);
	f.addPath([[0,180.152,-137.648],[-50,42.523,-68.819],[50,42.523,-68.819]], 17);
	f.addPath([[-0.008,180.16,-137.637],[-0.002,95.102,0],[-50.002,42.525,-68.816]], 17);
	f.addPath([[0.008,180.16,-137.637],[50.002,42.525,-68.816],[0.002,95.102,0]], 17);
	f.addPath([[-131.374,179.936,-42.019],[-0.211,95.101,0.153],[-50.211,42.525,-68.664]], 18);
	f.addPath([[-130.894,180.175,-42.543],[-80.901,42.541,26.28],[-49.997,42.538,-68.825]], 18);
	f.addPath([[-130.9,180.169,-42.551],[-0.001,95.111,-0.012],[-80.902,42.54,26.279]], 18);
	f.addPath([[-81.117,179.813,111.774],[-80.955,42.314,26.492],[0.047,42.403,85.131]], 19);
	f.addPath([[-80.69,180.168,111.498],[0.211,95.101,0.153],[-80.854,42.669,26.217]], 19);
	f.addPath([[-80.898,180.169,111.347],[0.002,95.102,0.001],[-0.001,42.531,85.068]], 19);
	return f;
}
function resize(e) {
	let width = window.innerWidth;
	let height = window.innerHeight;
	let size = width * 0.9 ;
	if (size > height * 0.9) size = height * 0.9;
	if (size > 500) size = 500;
	if (size < 10) size = 10;
	star.style.width = size + 'px';
	star.style.height = size + 'px';
	menu.style.height = (height - 110) + 'px';
	getById("fakeScroll").style.height = height + 'px';
	
}
function scrolled(e){
	let elem = getById("scrollable");
	if(!menu.classList.contains("active")){
		elem = getById("fakeScroll");
	}
	
	let sh = elem.scrollHeight - elem.clientHeight;
	if(sh<=0)sh=1;
	let st = elem.scrollTop;
	let percent = Math.floor(st / sh * 100);
	tilt = (50 - percent) * 0.5;
}
function setAllColors(col, addToLast=false){
	if (addToLast && (col.toString() !== lastColors[0].toString())){
		for (let i = lastColors.length-1; i >= 0; i--) lastColors[i+1] = lastColors[i];
		lastColors[0] = col;
	}
	for (let i = 0; i < 20; i++) colors[i] = col;	
}
function addEvents(){
	window.addEventListener('load', resize);
	window.addEventListener('resize', resize);
	getById("scrollable").addEventListener('scroll', scrolled);
	getById("fakeScroll").addEventListener('scroll', scrolled);
	

	let btns = document.getElementsByClassName("btn");
	for (let i = 0; i < btns.length; i++) {
		btns[i].setAttribute("onclick", "buttonClicked(this);");
	}

	menu.addEventListener('touchstart', buttonTouchStart);
	menu.addEventListener('touchend', buttonTouchEnd);
}
function getById(str){
	return document.getElementById(str);
}
function buttonClicked(sender) {
	let pan, pans, btns;

	if(sender.id=="updown"){
		let rotated = sender.classList.contains("rotate");
		if(rotated){
			sender.classList.remove("rotate");
			menu.classList.remove("active");
			getById("fakeScroll").style.display = "block";
		}else{
			menu.style.height = (window.innerHeight - 110) + 'px';
			sender.classList.add("rotate");
			menu.classList.add("active");
			getById("fakeScroll").style.display = "none";
		}
	}

	if (sender.classList.contains("tab")){
		pans = document.getElementsByClassName("page");
		for (let i = 0; i < pans.length; i++) pans[i].style.display = "none";
		
		btns = document.getElementsByClassName("tab");
		for (let i = 0; i < btns.length; i++) btns[i].className = btns[i].className.replace(" active", "");
		
		btns = document.getElementsByClassName("sub");
		for (let i = 0; i < btns.length; i++) btns[i].className = btns[i].className.replace(" active", "");
		
		pan = getById("p" + sender.id.slice(1));
		pan.style.display = "block";

		sender.classList.add("active");
	}
	if (sender.classList.contains("sub")){
		let activate = !sender.classList.contains("active");

		pans = document.getElementsByClassName("panel");
		for (let i = 0; i < pans.length; i++) pans[i].style.display = "none";
		
		btns = document.getElementsByClassName("sub");
		for (let i = 0; i < btns.length; i++) btns[i].className = btns[i].className.replace(" active", "");
		
		if (activate){
			pan = getById("p" + sender.id.slice(1));
			pan.style.display = "block";
			
			sender.classList.add("active");
		}
		
	}

	if(~cmds.indexOf(sender.id)) {
		sendCmd=true;
		cmd = sender.id;
	}

}
function buttonTouchStart(sender){
	originalX = sender.touches[0].clientX;
	originalY = sender.touches[0].clientY;
	rangeInput = false;
}
function buttonTouchEnd(sender){
	let dX = sender.changedTouches[0].clientX - originalX;
	let dY = sender.changedTouches[0].clientY - originalY;
	if(!rangeInput){
		if (Math.abs(dX) > Math.abs(dY)){
			if (Math.abs(dX) > (window.innerWidth / 4)){
				if(dX < 0){
					getById("bAnimations").click();
				}else{
					getById("bColors").click();
				}
			}
		}
	}
}
function speedInRange(){
	rangeInput = true;
	speedNum.value = speedRan.value;	
	lastSpeedUpdate=20;
}
function speedInNum(){
	speedRan.value = speedNum.value;
	lastSpeedUpdate=20;
}
function sendSpeed(){
	speed = parseInt(speedRan.value);
	if (!serverIsEsp) return;
	var request = new XMLHttpRequest();
	var url = window.location.href;
	var pos = url.indexOf("?");
	if(pos > 1){
		url = url.substring(0, pos);
	}
	
	url += "?speed=" + speedRan.value;
	
	request.open('GET', url , true);
	request.send(null);
}
function cpInputRange(){
	rangeInput = true;
	cpElements.cpNH.value = cpElements.cpRH.value;
	cpElements.cpNS.value = cpElements.cpRS.value;
	cpElements.cpNL.value = cpElements.cpRL.value;
	cpUpdateColor();
}
function cpInputNumber(){
	cpElements.cpRH.value = cpElements.cpNH.value;
	cpElements.cpRS.value = cpElements.cpNS.value;
	cpElements.cpRL.value = cpElements.cpNL.value;
	cpUpdateColor();
}
function cpUpdateColor(){
	let h,s,l;
	h = parseFloat(cpElements.cpRH.value);
	s = parseFloat(cpElements.cpRS.value);
	l = parseFloat(cpElements.cpRL.value);
	getById("cpBgS2").style.background = new Color(h).toString();
	getById("cpBgL2").style.background = new Color(h,s).toString();
	getById("bCpSet").style.borderLeftColor = new Color(h,s,l).toString();
	
}

function send(){
	if (!serverIsEsp) return;
	var request = new XMLHttpRequest();
	var url = window.location.href;
	var pos = url.indexOf("?");
	if(pos > 1){
		url = url.substring(0, pos);
	}
	
	url += "?cmd=" + cmd;
	
	if(cmd==="Color"){
		url += "&hue=" + (lastColors[0].h * 1000);
		url += "&sat=" + (lastColors[0].s * 10);
		url += "&lum=" + (lastColors[0].l * 10);
	}
	
	request.open('GET', url , true);
	request.send(null);
}
function setSpeed(spd){
	serverIsEsp = true; //only esp starts this function
	speed=spd;
	speedRan.value=spd;	 
	speedNum.value=spd;
}

//lastColors = [new Color(20),new Color(240),new Color(60),new Color(120)];
//cmd = "Color";
//setSpeed(200);


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

    toString(){
        return "hsl("+this.h+","+this.s+"%,"+this.l+"%)";
    }
}
class Point {
    constructor(x=0, y=0, z=0){
        this.x = x;
        this.y = y;
        this.z = z;
        this.rotateY(0);
        this.convert2d();
    }

    getPerspectiveDistance(){
        let x = this.xRot - perspective.x;
        let y = this.yRot - perspective.y;
        let z = this.zRot - perspective.z;
        return (x * x) + (y * y) + (z * z);
    }

    rotateY(angle){
        let rad = angle * Math.PI / 180;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);

        let Offset = (star.width / 2);
        let x = this.x - Offset;

        this.xRot = Offset + (cos * x) - (sin * this.z);
        this.yRot = this.y;
        this.zRot = Offset + (sin * x) + (cos * this.z);
    }

    rotateX(angle){
        let rad = angle * Math.PI / 180;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);

        let Offset = 255; //255 = ~star-figure-height / 2
        let y = this.yRot - Offset;
        let z = this.zRot - Offset; 

        this.yRot = (cos * y) - (sin * z) + Offset;
        this.zRot = (sin * y) + (cos * z) + Offset;
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
        let fillCol = colors[this.number];
        let strokeCol = fillCol.l <30?"#eee":"#111";
        ctx.fillStyle = fillCol.toString();
        ctx.strokeStyle = strokeCol;
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
    
    
    drawFigure(angle){
        ctx.clearRect(0, 0, star.width, star.height);
        
        this.paths.forEach( (path) => {
            path.points.forEach( (point) => {
                point.rotateY(angle);
                point.rotateX(tilt);
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

// resize vars
let lastStarSize = 0; //to avoid resize on mobile browser scroll 

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
let tilt = 10;
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
                    if (i%2 === 0) colors[i/2] = new Color(colorAngle,80,65);
                    colors[i + 5] = new Color(colorAngle,90,60);
                    if (i%2 === 1) colors[((i - 1)/2) + 15] = new Color(colorAngle,80,55);
                }
            break;
        case "bRainbowHor":
                for(let i = 0; i < 5; i++){
                    let colorAngle = (animCnt / 250);
                    colors[i] = new Color((colorAngle % 360),80,55);
                    colors[(i*2) + 5] = new Color(((colorAngle + 30) % 360),80,55);
                    colors[(i*2) + 6] = new Color(((colorAngle + 42) % 360),80,55);
                    colors[i + 15] = new Color(((colorAngle + 72) % 360),80,55); 
                }
            break;
        case "bRainbowAll":
                let colorAngle = (animCnt / 250);
                setAllColors(new Color((colorAngle % 360),90,50), false);
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

    fig.drawFigure(currentRotation);
}

//functions
function generateStar(){
    let starFig = new Figure();
    starFig.addPath([[250,40.803,178.943],[185,219.72,89.465],[315,219.72,89.465]], 0);
    starFig.addPath([[250.011,40.792,178.928],[315.003,219.717,89.461],[250.003,151.368,0]], 0);
    starFig.addPath([[249.989,40.792,178.928],[249.997,151.368,0],[184.997,219.717,89.461]], 0);
    starFig.addPath([[420.786,41.084,54.625],[315.275,219.718,89.263],[250.275,151.368,-0.198]], 1);
    starFig.addPath([[420.17,40.78,55.316],[355.173,219.698,-34.162],[250.001,151.356,0.016]], 1);
    starFig.addPath([[420.162,40.772,55.306],[314.997,219.701,89.472],[355.171,219.697,-34.164]], 1);
    starFig.addPath([[354.897,40.781,-144.948],[355.111,219.531,-34.082],[249.726,151.368,-0.199]], 2);
    starFig.addPath([[355.167,40.781,-144.751],[250.002,219.71,-110.588],[249.998,151.368,-0.002]], 2);
    starFig.addPath([[355.452,41.243,-145.307],[249.938,219.876,-110.671],[355.242,219.992,-34.44]], 2);
    starFig.addPath([[144.833,40.781,-144.751],[250.002,151.368,-0.002],[249.998,219.71,-110.588]], 3);
    starFig.addPath([[145.103,40.781,-144.948],[250.274,151.368,-0.199],[144.889,219.531,-34.082]], 3);
    starFig.addPath([[144.548,41.243,-145.307],[144.758,219.992,-34.44],[250.062,219.876,-110.671]], 3);
    starFig.addPath([[79.838,40.772,55.306],[144.829,219.697,-34.164],[185.003,219.701,89.472]], 4);
    starFig.addPath([[79.83,40.78,55.316],[249.999,151.356,0.016],[144.827,219.698,-34.162]], 4);
    starFig.addPath([[79.214,41.084,54.625],[249.725,151.368,-0.198],[184.725,219.718,89.263]], 4);
    starFig.addPath([[249.993,219.71,289.516],[249.999,330.289,110.589],[314.996,219.702,89.473]], 5);
    starFig.addPath([[250.007,219.71,289.516],[185.004,219.702,89.473],[250.001,330.289,110.589]], 5);
    starFig.addPath([[250,220.67,289.684],[185,220.007,89.641],[315,220.007,89.641]], 5);
    starFig.addPath([[420.443,330.309,234.012],[250.063,330.123,110.671],[315.275,219.719,89.264]], 6);
    starFig.addPath([[420.173,330.308,234.209],[355.171,330.303,34.165],[315.003,219.718,89.461]], 6);
    starFig.addPath([[420.17,331.067,234.041],[355.173,330.403,33.997],[250.001,330.657,110.409]], 6);
    starFig.addPath([[525.622,220.181,88.904],[355.242,219.992,-34.439],[355.111,330.468,34.082]], 7);
    starFig.addPath([[525.34,219.722,89.464],[315.001,219.721,89.465],[355.173,330.301,34.163]], 7);
    starFig.addPath([[525.34,220.007,89.639],[315.001,220.007,89.641],[355.173,219.597,-33.996]], 7);
    starFig.addPath([[525.34,330.278,-89.464],[315.001,330.279,-89.465],[355.173,219.699,-34.163]], 8);
    starFig.addPath([[525.622,329.819,-88.904],[355.242,330.008,34.439],[355.111,219.532,-34.082]], 8);
    starFig.addPath([[525.34,329.993,-89.639],[315.001,329.993,-89.641],[355.173,330.403,33.996]], 8);
    starFig.addPath([[420.17,218.933,-234.041],[355.173,219.597,-33.997],[250.001,219.343,-110.409]], 9);
    starFig.addPath([[420.173,219.692,-234.209],[355.171,219.697,-34.165],[315.003,330.282,-89.461]], 9);
    starFig.addPath([[420.443,219.691,-234.012],[250.063,219.877,-110.671],[315.275,330.281,-89.264]], 9);
    starFig.addPath([[249.993,330.29,-289.516],[249.999,219.711,-110.589],[314.996,330.298,-89.473]], 10);
    starFig.addPath([[250.007,330.29,-289.516],[185.004,330.298,-89.473],[250.001,219.711,-110.589]], 10);
    starFig.addPath([[250,329.33,-289.684],[185,329.993,-89.641],[315,329.993,-89.641]], 10);
    starFig.addPath([[79.557,219.691,-234.012],[184.725,330.281,-89.264],[249.937,219.877,-110.671]], 11);
    starFig.addPath([[79.83,218.933,-234.041],[249.999,219.343,-110.409],[144.827,219.597,-33.997]], 11);
    starFig.addPath([[79.827,219.692,-234.209],[184.997,330.282,-89.461],[144.829,219.697,-34.165]], 11);
    starFig.addPath([[-25.34,330.278,-89.464],[144.827,219.699,-34.163],[184.999,330.279,-89.465]], 12);
    starFig.addPath([[-25.622,329.819,-88.904],[144.889,219.532,-34.082],[144.758,330.008,34.439]], 12);
    starFig.addPath([[-25.34,329.993,-89.639],[144.827,330.403,33.996],[184.999,329.993,-89.641]], 12);
    starFig.addPath([[-25.622,220.181,88.904],[144.889,330.468,34.082],[144.758,219.992,-34.439]], 13);
    starFig.addPath([[-25.34,219.722,89.464],[144.827,330.301,34.163],[184.999,219.721,89.465]], 13);
    starFig.addPath([[-25.34,220.007,89.639],[144.827,219.597,-33.996],[184.999,220.007,89.641]], 13);
    starFig.addPath([[79.557,330.309,234.012],[184.725,219.719,89.264],[249.937,330.123,110.671]], 14);
    starFig.addPath([[79.83,331.067,234.041],[249.999,330.657,110.409],[144.827,330.403,33.997]], 14);
    starFig.addPath([[79.827,330.308,234.209],[184.997,219.718,89.461],[144.829,330.303,34.165]], 14);
    starFig.addPath([[355.452,508.757,145.307],[249.938,330.124,110.671],[355.242,330.008,34.44]], 15);
    starFig.addPath([[355.167,509.219,144.751],[250.002,330.29,110.588],[249.998,398.632,0.002]], 15);
    starFig.addPath([[354.897,509.219,144.948],[355.111,330.469,34.082],[249.726,398.632,0.199]], 15);
    starFig.addPath([[420.162,509.228,-55.306],[314.997,330.299,-89.472],[355.171,330.303,34.164]], 16);
    starFig.addPath([[420.17,509.22,-55.316],[355.173,330.302,34.162],[250.001,398.644,-0.016]], 16);
    starFig.addPath([[420.786,508.916,-54.625],[315.275,330.282,-89.263],[250.275,398.632,0.198]], 16);
    starFig.addPath([[250,509.197,-178.943],[185,330.28,-89.465],[315,330.28,-89.465]], 17);
    starFig.addPath([[249.989,509.208,-178.928],[249.997,398.632,0],[184.997,330.283,-89.461]], 17);
    starFig.addPath([[250.011,509.208,-178.928],[315.003,330.283,-89.461],[250.003,398.632,0]], 17);
    starFig.addPath([[79.214,508.916,-54.625],[249.725,398.632,0.198],[184.725,330.282,-89.263]], 18);
    starFig.addPath([[79.838,509.228,-55.306],[144.829,330.303,34.164],[185.003,330.299,-89.472]], 18);
    starFig.addPath([[79.83,509.22,-55.316],[249.999,398.644,-0.016],[144.827,330.302,34.162]], 18);
    starFig.addPath([[144.548,508.757,145.307],[144.758,330.008,34.44],[250.062,330.124,110.671]], 19);
    starFig.addPath([[145.103,509.219,144.948],[250.274,398.632,0.199],[144.889,330.469,34.082]], 19);
    starFig.addPath([[144.833,509.219,144.751],[250.002,398.632,0.002],[249.998,330.29,110.588]], 19);
    return starFig;
}
function resize(e) {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let size = width * 0.8 ;
    if (size > 500) size = 500;
    if (size > height / 3) size = height / 3;
    if (size < 10) size = 10;
    if (Math.abs((lastStarSize - size) / size) > 0.25){
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        menu.style.top = size + 'px';
        lastStarSize = size;
    }
}
function scrolled(e){
    var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';

    var percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;

    tilt = (50 - percent) * 0.2;

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
    window.addEventListener('scroll', scrolled);

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

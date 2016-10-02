let canv = document.getElementById("star");
let ctx = canv.getContext("2d");
let perspective = {x:canv.width/2, y:0, z:-1000};
let angle = 0;
let points;
let colors = [];
let lastColors = ["hsl(0,100%,50%)","hsl(240,100%,50%)","hsl(60,100%,50%)"];
setAllColors("hsl(0,0%,10%)")
let cmd = "bRainbowVer";



let currJag = 1;
let lastJag = 0;
let nexts = [
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
    [14,15,18]
];
let concurent = [17,18,19,15,16,10,11,12,13,14,5,6,7,8,9,3,4,0,1,2];


ctx.lineWidth = 1;
ctx.lineCap = "round";
ctx.strokeStyle = "rgba(0,0,0,1)";

class HSL{
    constructor(str){
        if (str !== ""){
            this.h=parseFloat(/\d*(\.?\d+)(?=,)/.exec(str)[0]);
            this.s=parseFloat(/\d*(\.?\d+)(?=%,)/.exec(str)[0]);
            this.l=parseFloat(/\d*(\.?\d+)(?=%\))/.exec(str)[0]);
        }
    }

    fadeTo(col, percent){
        let hDiff = col.h - this.h;
        if (hDiff > 180) hDiff -=360;
        if (hDiff < -180) hDiff += 360;

        let sDiff = col.s - this.s;
        let lDiff = col.l - this.l;

        let h = (this.h + 3600 + (hDiff * percent / 100)) % 360;
        let s = this.s + (sDiff * percent / 100);
        let l = this.l + (lDiff * percent / 100);

        return "hsl(" + h  + "," + s + "%," + l + "%)";
    }

    toString(){
        return "hsl(" + this.h + "," + this.s + "%," + this.l + "%)";
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

        let xOffset = (canv.width / 2)
        let x = this.x - xOffset;

        this.xRot = xOffset + (cos * x) - (sin * this.z);
        this.yRot = this.y;
        this.zRot = xOffset + (sin * x) + (cos * this.z);
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
        ctx.fillStyle = colors[this.number];
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

    addPath(path){
        this.paths[this.paths.length] = path;
    }

    sortZ(){
        this.paths.sort( (path1, path2) => {
            return path2.getZOrderValue() - path1.getZOrderValue();
        });
    }
    
    
    drawFigure(angle){
        ctx.clearRect(0, 0, canv.width, canv.height);
        
        this.paths.forEach( (path) => {
            path.points.forEach( (point) => {
                point.rotateY(angle);
                point.convert2d();
            });
        });
        
        this.sortZ();

        this.paths.forEach( (path) => {
            path.drawPath(ctx);
        });
    }

   

    

}

let fig = new Figure();

fig.addPath(new Path([[250,40.803,178.943],[185,219.72,89.465],[315,219.72,89.465]], 0));
fig.addPath(new Path([[250.011,40.792,178.928],[315.003,219.717,89.461],[250.003,151.368,0]], 0));
fig.addPath(new Path([[249.989,40.792,178.928],[249.997,151.368,0],[184.997,219.717,89.461]], 0));
fig.addPath(new Path([[525.34,219.722,89.464],[315.001,219.721,89.465],[355.173,330.301,34.163]], 7));
fig.addPath(new Path([[144.833,40.781,-144.751],[250.002,151.368,-0.002],[249.998,219.71,-110.588]], 3));
fig.addPath(new Path([[79.827,330.308,234.209],[184.997,219.718,89.461],[144.829,330.303,34.165]], 14));
fig.addPath(new Path([[420.17,509.22,-55.316],[355.173,330.302,34.162],[250.001,398.644,-0.016]], 16));
fig.addPath(new Path([[249.993,330.29,-289.516],[249.999,219.711,-110.589],[314.996,330.298,-89.473]], 10));
fig.addPath(new Path([[79.838,509.228,-55.306],[144.829,330.303,34.164],[185.003,330.299,-89.472]], 18));
fig.addPath(new Path([[79.83,509.22,-55.316],[249.999,398.644,-0.016],[144.827,330.302,34.162]], 18));
fig.addPath(new Path([[420.162,509.228,-55.306],[314.997,330.299,-89.472],[355.171,330.303,34.164]], 16));
fig.addPath(new Path([[250.007,330.29,-289.516],[185.004,330.298,-89.473],[250.001,219.711,-110.589]], 10));
fig.addPath(new Path([[-25.34,219.722,89.464],[144.827,330.301,34.163],[184.999,219.721,89.465]], 13));
fig.addPath(new Path([[420.173,330.308,234.209],[355.171,330.303,34.165],[315.003,219.718,89.461]], 6));
fig.addPath(new Path([[355.167,40.781,-144.751],[250.002,219.71,-110.588],[249.998,151.368,-0.002]], 2));
fig.addPath(new Path([[250,220.67,289.684],[185,220.007,89.641],[315,220.007,89.641]], 5));
fig.addPath(new Path([[420.786,41.084,54.625],[315.275,219.718,89.263],[250.275,151.368,-0.198]], 1));
fig.addPath(new Path([[79.214,41.084,54.625],[249.725,151.368,-0.198],[184.725,219.718,89.263]], 4));
fig.addPath(new Path([[525.34,220.007,89.639],[315.001,220.007,89.641],[355.173,219.597,-33.996]], 7));
fig.addPath(new Path([[145.103,40.781,-144.948],[250.274,151.368,-0.199],[144.889,219.531,-34.082]], 3));
fig.addPath(new Path([[79.557,330.309,234.012],[184.725,219.719,89.264],[249.937,330.123,110.671]], 14));
fig.addPath(new Path([[420.17,218.933,-234.041],[355.173,219.597,-33.997],[250.001,219.343,-110.409]], 9));
fig.addPath(new Path([[-25.622,329.819,-88.904],[144.889,219.532,-34.082],[144.758,330.008,34.439]], 12));
fig.addPath(new Path([[355.452,508.757,145.307],[249.938,330.124,110.671],[355.242,330.008,34.44]], 15));
fig.addPath(new Path([[79.83,218.933,-234.041],[249.999,219.343,-110.409],[144.827,219.597,-33.997]], 11));
fig.addPath(new Path([[144.548,508.757,145.307],[144.758,330.008,34.44],[250.062,330.124,110.671]], 19));
fig.addPath(new Path([[525.622,329.819,-88.904],[355.242,330.008,34.439],[355.111,219.532,-34.082]], 8));
fig.addPath(new Path([[-25.34,220.007,89.639],[144.827,219.597,-33.996],[184.999,220.007,89.641]], 13));
fig.addPath(new Path([[420.443,330.309,234.012],[250.063,330.123,110.671],[315.275,219.719,89.264]], 6));
fig.addPath(new Path([[354.897,40.781,-144.948],[355.111,219.531,-34.082],[249.726,151.368,-0.199]], 2));
fig.addPath(new Path([[250,509.197,-178.943],[185,330.28,-89.465],[315,330.28,-89.465]], 17));
fig.addPath(new Path([[249.989,509.208,-178.928],[249.997,398.632,0],[184.997,330.283,-89.461]], 17));
fig.addPath(new Path([[250.011,509.208,-178.928],[315.003,330.283,-89.461],[250.003,398.632,0]], 17));
fig.addPath(new Path([[525.34,330.278,-89.464],[315.001,330.279,-89.465],[355.173,219.699,-34.163]], 8));
fig.addPath(new Path([[79.827,219.692,-234.209],[184.997,330.282,-89.461],[144.829,219.697,-34.165]], 11));
fig.addPath(new Path([[144.833,509.219,144.751],[250.002,398.632,0.002],[249.998,330.29,110.588]], 19));
fig.addPath(new Path([[420.17,40.78,55.316],[355.173,219.698,-34.162],[250.001,151.356,0.016]], 1));
fig.addPath(new Path([[79.838,40.772,55.306],[144.829,219.697,-34.164],[185.003,219.701,89.472]], 4));
fig.addPath(new Path([[249.993,219.71,289.516],[249.999,330.289,110.589],[314.996,219.702,89.473]], 5));
fig.addPath(new Path([[79.83,40.78,55.316],[249.999,151.356,0.016],[144.827,219.698,-34.162]], 4));
fig.addPath(new Path([[250.007,219.71,289.516],[185.004,219.702,89.473],[250.001,330.289,110.589]], 5));
fig.addPath(new Path([[420.162,40.772,55.306],[314.997,219.701,89.472],[355.171,219.697,-34.164]], 1));
fig.addPath(new Path([[-25.34,330.278,-89.464],[144.827,219.699,-34.163],[184.999,330.279,-89.465]], 12));
fig.addPath(new Path([[355.167,509.219,144.751],[250.002,330.29,110.588],[249.998,398.632,0.002]], 15));
fig.addPath(new Path([[420.173,219.692,-234.209],[355.171,219.697,-34.165],[315.003,330.282,-89.461]], 9));
fig.addPath(new Path([[250,329.33,-289.684],[185,329.993,-89.641],[315,329.993,-89.641]], 10));
fig.addPath(new Path([[79.214,508.916,-54.625],[249.725,398.632,0.198],[184.725,330.282,-89.263]], 18));
fig.addPath(new Path([[420.786,508.916,-54.625],[315.275,330.282,-89.263],[250.275,398.632,0.198]], 16));
fig.addPath(new Path([[525.34,329.993,-89.639],[315.001,329.993,-89.641],[355.173,330.403,33.996]], 8));
fig.addPath(new Path([[79.557,219.691,-234.012],[184.725,330.281,-89.264],[249.937,219.877,-110.671]], 11));
fig.addPath(new Path([[145.103,509.219,144.948],[250.274,398.632,0.199],[144.889,330.469,34.082]], 19));
fig.addPath(new Path([[420.17,331.067,234.041],[355.173,330.403,33.997],[250.001,330.657,110.409]], 6));
fig.addPath(new Path([[355.452,41.243,-145.307],[249.938,219.876,-110.671],[355.242,219.992,-34.44]], 2));
fig.addPath(new Path([[-25.622,220.181,88.904],[144.889,330.468,34.082],[144.758,219.992,-34.439]], 13));
fig.addPath(new Path([[79.83,331.067,234.041],[249.999,330.657,110.409],[144.827,330.403,33.997]], 14));
fig.addPath(new Path([[525.622,220.181,88.904],[355.242,219.992,-34.439],[355.111,330.468,34.082]], 7));
fig.addPath(new Path([[144.548,41.243,-145.307],[144.758,219.992,-34.44],[250.062,219.876,-110.671]], 3));
fig.addPath(new Path([[-25.34,329.993,-89.639],[144.827,330.403,33.996],[184.999,329.993,-89.641]], 12));
fig.addPath(new Path([[354.897,509.219,144.948],[355.111,330.469,34.082],[249.726,398.632,0.199]], 15));
fig.addPath(new Path([[420.443,219.691,-234.012],[250.063,219.877,-110.671],[315.275,330.281,-89.264]], 9));

let colJag;
let colBg;

loop()
function loop() {
    requestAnimationFrame(loop);
    angle += 0.125;
    if(angle > 360) angle -= 360;

    switch(cmd){
        case "Color":
            break;
        case "bRainbowVer":
                for(let i = 0; i < 10; i++){
                    let colorAngle = (angle * 4) + (i * 36);
                    colorAngle %= 360;
                    if (i%2 === 0) colors[i/2] = "hsl(" + colorAngle + ",80%,65%)";
                    colors[i + 5] = "hsl(" + colorAngle + ",90%,60%)";
                    if (i%2 === 1) colors[((i - 1)/2) + 15] = "hsl(" + colorAngle + ",80%,55%)";
                }
            break;
        case "bRainbowHor":
                for(let i = 0; i < 5; i++){
                    let colorAngle = angle * 4;
                    colors[i] = "hsl(" + (colorAngle % 360) + ",80%,55%)";
                    colors[(i*2) + 5] = "hsl(" + ((colorAngle + 30) % 360) + ",80%,55%)";
                    colors[(i*2) + 6] = "hsl(" + ((colorAngle + 42) % 360) + ",80%,55%)";
                    colors[i + 15] = "hsl(" + ((colorAngle + 72) % 360) + ",80%,55%)"; 
                }
            break;
        case "bRainbowAll":
                setAllColors("hsl(" + (colorAngle % 360) + ",90%,50%)", false);
            break;
        case "bWalk1":
        case "bWalk2":
            if(angle % 4 === 0){
                setAllColors(lastColors[1]);
                let cnt = Math.floor((Math.random() * 1000)) % 2;
                for(let i = 0; i<3;i++){
                    if(nexts[currJag][i] !== lastJag){
                        if(cnt === 0){
                            lastJag = currJag;
                            currJag = nexts[lastJag][i];
                            cnt --;
                        } else {
                            cnt--;
                        }
                    }
                }
                
            }
            colJag = new HSL(lastColors[0]);
            colBg = new HSL(lastColors[1]);
            colors[currJag] = colJag.fadeTo(colBg, (angle % 4) * 10);
            colors[lastJag] = colJag.fadeTo(colBg, ((angle % 4) * 15) + 40 );
            if (cmd === "bWalk2"){
                colors[concurent[currJag]] = colors[currJag];
                colors[concurent[lastJag]] = colors[lastJag];
            }
            break;
        case "bBlack":
            setAllColors("hsl(0,0%,10%)", true);
            break;
        case "bWhite":
            setAllColors("hsl(0,0%,100%)", true);
            break;
        case "bRed":
            setAllColors("hsl(0,100%,50%)", true);
            break;
        case "bOrange":
            setAllColors("hsl(30,100%,50%)", true);
            break;
        case "bYellow":
            setAllColors("hsl(60,100%,50%)", true);
            break;
        case "bGreen":
            setAllColors("hsl(120,100%,50%)", true);            
            break;
        case "bCyan":
            setAllColors("hsl(180,100%,50%)", true);
            break;
        case "bBlue":
            setAllColors("hsl(240,100%,50%)", true);
            break;
        case "bPurple":
            setAllColors("hsl(270,100%,50%)", true);
            break;
        case "bMagenta":
            setAllColors("hsl(300,100%,50%)", true);
            break;
            
    }
    

    fig.drawFigure(angle);

}

function setAllColors(str, addToLast){
    if (addToLast && (str !== lastColors[0])){
        for (let i = 0; i < 1; i++) lastColors[i+1] = lastColors[i];
        lastColors[0] = str;
    }
    for (let i = 0; i < 20; i++) colors[i] = str;
}


window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);
function resize() {
    let size = window.innerWidth * 0.8 ;
    if (size > 500) size = 500;
    if (size > window.innerHeight / 2) size = window.innerHeight / 2;
        canv.style.width = size+'px';
        canv.style.height = size+'px';
}


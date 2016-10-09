
//colored square on the left side of the color buttons
let colBtns = document.getElementsByClassName("col");
for(let i = 0; i < colBtns.length; i++){
       colBtns[i].style.borderLeftColor = colBtns[i].innerHTML;
       colBtns[i].style.borderLeftStyle = "solid";
       colBtns[i].style.borderLeftWidth = "30px";          
}

//allowed commands
let cmds = [
    "bRainbowAll", 
    "bRainbowHor", 
    "bRainbowVer", 
    "bWalk1", 
    "bWalk2", 
    "bBlack", 
    "bWhite", 
    "bRed", 
    "bOrange", 
    "bYellow", 
    "bGreen", 
    "bCyan", 
    "bBlue", 
    "bPurple", 
    "bMagenta"];

//for swipe recognition
let originalX;
let originalY;

//adds events for the menu animation
addEvents();

function addEvents(){
    let btns = document.getElementsByClassName("btn");
    for (let i = 0; i < btns.length; i++) {
        btns[i].setAttribute("onclick", "buttonClicked(this);");        
    }

    //document.getElementById("menu").addEventListener('mousedown', buttonMouseDown);
    //document.getElementById("menu").addEventListener('mouseup', buttonMouseUp);
    document.getElementById("menu").addEventListener('touchstart', buttonTouchStart);
    document.getElementById("menu").addEventListener('touchend', buttonTouchEnd);
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
        
        pan = document.getElementById("p" + sender.id.slice(1));
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
            pan = document.getElementById("p" + sender.id.slice(1));
            pan.style.display = "block";
            
            sender.classList.add("active");
        }
        
    }

    if(~cmds.indexOf(sender.id)) cmd = sender.id;
}

function buttonMouseDown(sender){
    originalX = sender.clientX;
}

function buttonMouseUp(sender){
   let currentX =  sender.clientX;
   if(originalX > currentX + 5){
      document.getElementById("console").innerHTML = "left";
   }else if(originalX < currentX - 5){
      document.getElementById("console").innerHTML = "right";
   }
}

function buttonTouchStart(sender){
    originalX = sender.touches[0].clientX;
    originalY = sender.touches[0].clientY;
}

function buttonTouchEnd(sender){
    let dX = sender.changedTouches[0].clientX - originalX;
    let dY = sender.changedTouches[0].clientY - originalY;
    document.getElementById("console").innerHTML = "nixx";
    if (Math.abs(dX) > Math.abs(dY)){
        if (Math.abs(dX) > (window.innerWidth / 4)){
            if(dX < 0){
                document.getElementById("bAnimations").click();
            }else{
                document.getElementById("bColors").click();
            }
        }
        
    }
}

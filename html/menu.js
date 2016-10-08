let colBtns = document.getElementsByClassName("col");

for(let i = 0; i < colBtns.length; i++){
       colBtns[i].style.borderLeftColor = colBtns[i].innerHTML;
       colBtns[i].style.borderLeftStyle = "solid";
       colBtns[i].style.borderLeftWidth = "30px";          
}

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

addOnClick();

function addOnClick(){
    let btns = document.getElementsByClassName("btn");
    for (let i = 0; i < btns.length; i++) {
        btns[i].setAttribute("onclick", "buttonClicked(this);");
    }
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

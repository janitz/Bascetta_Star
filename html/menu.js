let cmds = ["bRainbowAll", "bRainbowHor", "bRainbowVer", "bWalk1", "bWalk2", "bBlack", "bWhite", "bRed", "bOrange", "bYellow", "bGreen", "bCyan", "bBlue", "bPurple", "bMagenta"];

addOnClick();

function addOnClick(){
    let btns = document.getElementsByClassName("btn");
    for (let i = 0; i < btns.length; i++) {
        btns[i].setAttribute("onclick", "buttonClicked(this);");
    }
}
function buttonClicked(sender) {
    let pan = document.getElementById("p" + sender.id.slice(1));
    let add = false;
    if (pan) add = !pan.classList.contains("show");

    let btnLevel = getLevel(sender);
    let pans = document.getElementsByClassName("panel")
    for (i = 0; i < pans.length; i++) {
        if(btnLevel <= getLevel(pans[i])) pans[i].classList.remove("show");
    }

    if (add) pan.classList.add("show");
    
    if(~cmds.indexOf(sender.id)) cmd = sender.id;
}

function getLevel(obj){
    if (obj.classList.contains("l0")) return 0;
    if (obj.classList.contains("l1")) return 1;
    if (obj.classList.contains("l2")) return 2;
    if (obj.classList.contains("l3")) return 3;
    return -1;
}
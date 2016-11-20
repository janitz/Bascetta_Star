iRange();

function iRange(){
    document.getElementById("cpNH").value = document.getElementById("cpRH").value;
    document.getElementById("cpNS").value = document.getElementById("cpRS").value;
    document.getElementById("cpNL").value = document.getElementById("cpRL").value;
    updateColor();
}

function iNumber(sender){
    document.getElementById("cpRH").value = document.getElementById("cpNH").value;
    document.getElementById("cpRS").value = document.getElementById("cpNS").value;
    document.getElementById("cpRL").value = document.getElementById("cpNL").value;
    updateColor();
}

function iBtn(sender){
    let element, value, negative;
    negative = true;
    switch (sender.id) {
        case "cpBtnPH":
            negative = false;
        case "cpBtnMH":
            element = document.getElementById("cpRH")
            break;
        case "cpBtnPS":
            negative = false;
        case "cpBtnMS":
            element = document.getElementById("cpRS")
            break;
        case "cpBtnPL":
            negative = false;
        case "cpBtnML":
            element = document.getElementById("cpRL")
            break;
    }
    console.debug(negative);
    value = element.value/10;
    if (negative){
        value = Math.ceil(value);
    } else {
        value = Math.floor(value);
    }
    
    value += negative?-1:1;
    value *= 10;
    if (value > element.max) value = element.min;
    if (value < element.min) value = element.max;
    
    element.value = value; 
    iRange();
}

function updateColor(){
    let h,s,l;
    h = document.getElementById("cpRH").value;
    s = document.getElementById("cpRS").value;
    l = document.getElementById("cpRL").value;
    document.getElementById("cpBgS").style.background = "hsl(" + h + ",100%,50%)";
    document.getElementById("cpBgL").style.background = "hsl(" + h + "," + s + "%,50%)";
    document.getElementById("cpBgP").style.borderColor = "hsl(" + h + "," + s + "%," + l + "%)";
    
}
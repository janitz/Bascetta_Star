let lastCanvSize = 0;

window.addEventListener('load', resize);
window.addEventListener('resize', resize);

function resize(e) {
    let canv = document.getElementById("star");
    let menu = document.getElementById("menu");

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    let size = width * 0.8 ;
    if (size > 500) size = 500;
    if (size > height / 3) size = height / 3;
    if (size < 10) size = 10;
    if (Math.abs((lastCanvSize - size) / size) > 0.25){
        canv.style.width = size + 'px';
        canv.style.height = size + 'px';
        menu.style.top = size + 'px';
        lastCanvSize = size;
    }
    
}


animation={}
animation.lastColor={}
animation.lastColor[0]={h=0,s=100,l=50}
animation.lastColor[1]={h=60,s=100,l=50}
animation.lastColor[2]={h=120,s=100,l=50}
animation.lastColor[3]={h=30,s=100,l=50}
animation.neighborJags = {
    {1,4,5},
    {0,2,7},
    {1,3,9},
    {2,4,11},
    {0,3,13},

    {0,6,14},
    {5,7,15},
    {1,6,8},
    {7,9,16},
    {2,8,10},
    {9,11,17},
    {3,10,12},
    {11,13,18},
    {4,12,14},
    {5,13,19},

    {6,16,19},
    {8,15,17},
    {10,16,18},
    {12,17,19},
    {14,15,18}}
animation.concurentJags = {17,18,19,15,16,10,11,12,13,14,5,6,7,8,9,3,4,0,1,2}
animation.mapJags={17,18,19,20,21,2,3,4,5,6,7,8,9,10,11,15,14,13,12,16}
animation.hsl=function(h_,s_,l_)
    return {h=h_,s=s_,l=l_}
end

animation.toRGB=function(hsl)
    local c=(1-math.abs((hsl.l/50)-1))*hsl.s/100
    local x=c*(1-math.abs(((hsl.h/60)%2)-1))
    local m=(hsl.l/100)-(c/2)
    local r
    local g
    local b
    if(hsl.h<=60)then
        r,g,b=c,x,0
    elseif(hsl.h<=120)then
        r,g,b=x,c,0
    elseif(hsl.h<=180)then
        r,g,b=0,c,x
    elseif(hsl.h<=240)then
        r,g,b=0,x,c
    elseif(hsl.h<=300)then
        r,g,b=x,0,c
    elseif(hsl.h<=360)then
        r,g,b=c,0,x
    end
    return math.floor((g+m)*255),math.floor((r+m)*255),math.floor((b+m)*255)
end

animation.fadeTo=function(c1,c2,percent)
    if(percent<0)then percent=0 end
    if(percent>100)then percent=100 end
    
    local hDiff = c2.h-c1.h
    if(hDiff > 180)then hDiff=hDiff-360 end
    if(hDiff <- 180)then hDiff=hDiff+ 360 end

    local sDiff=c2.s-c1.s;
    local lDiff=c2.l-c1.l;

    local h = (c1.h + 3600 + (hDiff * percent / 100)) % 360;
    local s = c1.s + (sDiff * percent / 100);
    local l = c1.l + (lDiff * percent / 100);

    return h,s,l
end

ws2812.init()
local ledBuffer = ws2812.newBuffer(21, 3)
local animCnt = 0
local colorAngle = 0
ledBuffer:fill(0,0,0)

tmr.alarm(1,20,2, function()--15ms ~60Hz 

    animCnt = animCnt + 0.2
    if(animCnt>=360)then animCnt=0 end
    
    if(cmd=="Color")then
        ledBuffer:fill(animation.toRGB(animation.lastColor[0]))
    elseif(cmd=="bRainbowVer")then
        for i=0,9 do
            colorAngle = ((animCnt * 4) + (i * 36)) % 360
            if(i%2==0)then ledBuffer:set(animation.mapJags[(i/2)+1],animation.toRGB(animation.hsl(colorAngle,100,50)))end
            ledBuffer:set(animation.mapJags[i+6],animation.toRGB(animation.hsl(colorAngle,100,50)))
            if(i%2==1)then ledBuffer:set(animation.mapJags[((i - 1)/2) + 16],animation.toRGB(animation.hsl(colorAngle,100,50)))end
        end
    elseif(cmd=="bRainbowHor")then
        for i=0,4 do
            colorAngle = animCnt * 4
            ledBuffer:set(animation.mapJags[i+1],animation.toRGB(animation.hsl((colorAngle % 360),100,50)))
            ledBuffer:set(animation.mapJags[(i*2) + 6],animation.toRGB(animation.hsl(((colorAngle + 30) % 360),100,50)))
            ledBuffer:set(animation.mapJags[(i*2) + 7],animation.toRGB(animation.hsl(((colorAngle + 42) % 360),100,50)))
            ledBuffer:set(animation.mapJags[i + 16],animation.toRGB(animation.hsl(((colorAngle + 72) % 360),100,50))) 
        end
    elseif(cmd=="bRainbowAll")then
        ledBuffer:fill(animation.toRGB(animation.hsl(animCnt*4%360,100,50)))
    end
    
    ws2812.write(ledBuffer)
    tmr.start(1) 
end)
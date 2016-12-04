anim={}
anim.currJag=2
anim.lastJag=1
anim.currColNr=1
anim.nextColNr=2
anim.lastCmd=""
anim.colJag=nil
anim.colBg=nil
anim.lastColor={}
anim.lastColor[1]={h=20,s=100,l=50}
anim.lastColor[2]={h=240,s=100,l=50}
anim.lastColor[3]={h=120,s=100,l=50}
anim.lastColor[4]={h=0,s=0,l=0}
anim.neighborJags = {
    {2,5,6},
    {1,3,8},
    {2,4,10},
    {3,5,12},
    {1,4,14},

    {1,7,15},
    {6,8,16},
    {2,7,9},
    {8,10,17},
    {3,9,11},
    {10,12,18},
    {4,11,13},
    {12,14,19},
    {4,13,15},
    {6,14,20},

    {7,17,20},
    {9,16,18},
    {11,17,19},
    {13,18,20},
    {15,16,19}}
anim.concurentJags = {18,19,20,16,17,11,12,13,14,15,6,7,8,9,10,4,5,1,2,3}
anim.mapJags={17,18,19,20,21,2,3,4,5,6,7,8,9,10,11,15,14,13,12,16}
anim.hsl=function(h_,s_,l_)
    return {h=h_,s=s_,l=l_}
end

anim.toRGB=function(hsl)
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
    r=math.floor((r+m)*255)
    g=math.floor((g+m)*255)
    b=math.floor((b+m)*255)
    if(r<0)then r=0 end
    if(g<0)then g=0 end
    if(b<0)then b=0 end
    if(r>255)then r=255 end
    if(g>255)then g=255 end
    if(b>255)then b=255 end
    return g,r,b
end

anim.fadeTo=function(c1,c2,percent)
    if(percent<0)then percent=0 end
    if(percent>100)then percent=100 end
    
    local hDiff = c2.h-c1.h
    if(hDiff > 180)then hDiff=hDiff-360 end
    if(hDiff <- 180)then hDiff=hDiff+ 360 end

    local sDiff=c2.s-c1.s;
    local lDiff=c2.l-c1.l;

    local h_ = (c1.h + 3600 + (hDiff * percent / 100)) % 360;
    local s_ = c1.s + (sDiff * percent / 100);
    local l_ = c1.l + (lDiff * percent / 100);
    local hsl={h=h_,s=s_,l=l_}
    return anim.toRGB(hsl)
end

anim.setCurrState=function()
    currState = "lastColors = ["
    for i=1,4 do	
        currState=currState.."new Color("..anim.lastColor[i].h..','..anim.lastColor[i].s..','..anim.lastColor[i].l..'),'
    end
    currState=string.gsub(currState..'];',',];','];').."\r\n"
    currState=currState..'cmd="'..cmd..'";\r\n'
end

ws2812.init()
local ledBuffer = ws2812.newBuffer(21, 3)
local animCnt = 0
local colorAngle = 0
ledBuffer:fill(0,0,0)

tmr.alarm(1,10,2, function()--15ms ~60Hz 
    if(anim.lastCmd~=cmd)then
        anim.lastCmd=cmd
        anim.setCurrState()
    end
    animCnt = (math.floor(animCnt*5)+1)/5
    if(animCnt>=360)then animCnt=0 end
    
    if(cmd=="Color")then
        ledBuffer:fill(anim.toRGB(anim.lastColor[1]))
        if(newCol.h~=anim.lastColor[1].h or newCol.s~=anim.lastColor[1].s or newCol.l~=anim.lastColor[1].l) then
            table.remove(anim.lastColor, 4)
            table.insert(anim.lastColor, 1, {h=newCol.h,s=newCol.s,l=newCol.l})
            anim.setCurrState()
        end
    elseif(cmd=="bRainbowVer")then
        for i=0,9 do
            colorAngle = ((animCnt * 8) + (i * 36)) % 360
            if(i%2==0)then ledBuffer:set(anim.mapJags[(i/2)+1],anim.toRGB(anim.hsl(colorAngle,100,50)))end
            ledBuffer:set(anim.mapJags[i+6],anim.toRGB(anim.hsl(colorAngle,100,50)))
            if(i%2==1)then ledBuffer:set(anim.mapJags[((i - 1)/2) + 16],anim.toRGB(anim.hsl(colorAngle,100,50)))end
        end
    elseif(cmd=="bRainbowHor")then
        for i=0,4 do
            colorAngle = animCnt * 8
            ledBuffer:set(anim.mapJags[i+1],anim.toRGB(anim.hsl((colorAngle % 360),100,50)))
            ledBuffer:set(anim.mapJags[(i*2) + 6],anim.toRGB(anim.hsl(((colorAngle + 25) % 360),100,50)))
            ledBuffer:set(anim.mapJags[(i*2) + 7],anim.toRGB(anim.hsl(((colorAngle + 40) % 360),100,50)))
            ledBuffer:set(anim.mapJags[i + 16],anim.toRGB(anim.hsl(((colorAngle + 65) % 360),100,50))) 
        end
    elseif(cmd=="bRainbowAll")then
        ledBuffer:fill(anim.toRGB(anim.hsl(animCnt*2%360,100,50)))
    elseif(cmd=="bWalk1" or cmd=="bWalk2")then
        if((animCnt%4)+0.01<0.02)then
            ledBuffer:fill(anim.toRGB(anim.lastColor[2]))
            local cnt = (math.floor((math.random()*1000))%2)
            for i=1,3 do
                if(anim.neighborJags[anim.currJag][i] ~= anim.lastJag)then
                    if(cnt==0)then
                        anim.lastJag = anim.currJag
                        anim.currJag = anim.neighborJags[anim.lastJag][i];
                        cnt = cnt - 1
                    else
                        cnt = cnt - 1
                    end
                end
            end 
        end
        anim.colJag = anim.lastColor[1];
        anim.colBg = anim.lastColor[2];
        ledBuffer:set(anim.mapJags[anim.currJag],anim.fadeTo(anim.colJag,anim.colBg,(animCnt % 4) * 10))
        ledBuffer:set(anim.mapJags[anim.lastJag],anim.fadeTo(anim.colJag,anim.colBg,((animCnt % 4) * 15) + 40))
        if(cmd=="bWalk2")then
            ledBuffer:set(anim.mapJags[anim.concurentJags[anim.currJag]], ledBuffer:get(anim.mapJags[anim.currJag]))
            ledBuffer:set(anim.mapJags[anim.concurentJags[anim.lastJag]], ledBuffer:get(anim.mapJags[anim.lastJag]))
        end
    elseif(cmd=="bFade2"or cmd=="bFade3"or cmd=="bFade4")then
        if((animCnt%20)+0.01<0.02)then
            anim.currColNr = anim.nextColNr
            anim.nextColNr = anim.nextColNr + 1
        end
        local num=cmd:gsub("bFade","")
        if(anim.nextColNr > tonumber(num))then anim.nextColNr=1 end
        ledBuffer:fill(anim.fadeTo(anim.lastColor[anim.currColNr], anim.lastColor[anim.nextColNr],animCnt*5%100))
    end
    
    ws2812.write(ledBuffer)
    tmr.start(1) 
end)
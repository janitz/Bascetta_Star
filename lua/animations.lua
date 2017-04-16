
anim={}
anim.map={1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20} --s.No 3 and 4
--anim.map={17,18,19,20,21,2,3,4,5,6,7,8,9,10,11,15,14,13,12,16} --s.No 1 and 2
anim.currJag=2
anim.lastJag=1
anim.currColNr=1
anim.nextColNr=2
anim.lastCmd=""
anim.colJag=nil
anim.colBg=nil
anim.lastColor={}
anim.lastColor[1]={h=20000,s=1000,l=500}
anim.lastColor[2]={h=240000,s=1000,l=500}
anim.lastColor[3]={h=120000,s=1000,l=500}
anim.lastColor[4]={h=0,s=0,l=0}
anim.concurentJags = {18,19,20,16,17,11,12,13,14,15,6,7,8,9,10,4,5,1,2,3}
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

anim.hsl=function(h_,s_,l_)
    return {h=h_,s=s_,l=l_}
end

anim.toRGB=function(hsl)
    local r,g,b,c,x,m
    c=(1000-math.abs((hsl.l*2)-1000))*hsl.s/1000
    x=c*(1000-math.abs(((hsl.h/60)%2000)-1000))/1000
    m=(hsl.l)-(c/2)
    if(hsl.h<=60000)then
        r,g,b=c,x,0
    elseif(hsl.h<=120000)then
        r,g,b=x,c,0
    elseif(hsl.h<=180000)then
        r,g,b=0,c,x
    elseif(hsl.h<=240000)then
        r,g,b=0,x,c
    elseif(hsl.h<=300000)then
        r,g,b=x,0,c
    elseif(hsl.h<=360000)then
        r,g,b=c,0,x
    end
    r=(r+m)*255/1000
    g=(g+m)*255/1000
    b=(b+m)*255/1000
    return g,r,b
end

anim.fadeTo=function(c1,c2,promill)
    local hDiff,sDiff,lDiff,h_,s_,l_,hsl
    if(promill<0)then promill=0 end
    if(promill>1000)then promill=1000 end
    
    hDiff = c2.h-c1.h
    if(hDiff > 180000)then hDiff=hDiff-360000 end
    if(hDiff <- 180000)then hDiff=hDiff+360000 end

    sDiff=c2.s-c1.s;
    lDiff=c2.l-c1.l;

    h_ = (c1.h + 3600000 + (hDiff * promill / 1000)) % 360000;
    s_ = c1.s + (sDiff * promill / 1000);
    l_ = c1.l + (lDiff * promill / 1000);
    hsl={h=h_,s=s_,l=l_}
    return anim.toRGB(hsl)
end

anim.toDec=function(number)
    local str,tmp,s
    str=""
    if(number<0)then
        str="-"
        number=-number
    end
    str=str..number/1000
    tmp=number%1000
    if(tmp>0)then
        s=""
        for i=1,3 do
            s=""..tmp%10 ..s
            tmp=tmp/10
        end
        str=str.."."..s
    end
    return str
end

anim.setCurrState=function()
    local str = "lastColors = ["
    for i=1,4 do	
        str=str.."new Color("..anim.toDec(anim.lastColor[i].h)..','
        str=str..anim.toDec(anim.lastColor[i].s*100)..','
        str=str..anim.toDec(anim.lastColor[i].l*100)..'),'
    end
    str=string.gsub(str..'];',',];','];').."\r\n"
    str=str..'cmd="'..cmd..'";\r\n'
    str=str..'setSpeed('..animSpeed..');\r\n'
    
    currState=str
end

ws2812.init()
ledBuffer = ws2812.newBuffer(21, 3)
local animCnt = 0
local speedLast = 0
local colorAngle = 0
ledBuffer:fill(0,0,0)

tmr.alarm(1,10,2, function()--15ms ~60Hz
    if(animSpeed~=speedLast)then
        speedLast=animSpeed
        anim.setCurrState()        
    end
    if(anim.lastCmd~=cmd)then
        anim.lastCmd=cmd
        anim.setCurrState()
    end
    animCnt = animCnt + animSpeed
    if(animCnt>=360000)then animCnt=0 end
    
    if(cmd=="Color")then
        ledBuffer:fill(anim.toRGB(anim.lastColor[1]))
        if(newCol.h~=anim.lastColor[1].h or newCol.s~=anim.lastColor[1].s or newCol.l~=anim.lastColor[1].l) then
            table.remove(anim.lastColor, 4)
            table.insert(anim.lastColor, 1, {h=newCol.h,s=newCol.s,l=newCol.l})
            anim.setCurrState()
            animCnt=0
        end
    elseif(cmd=="bRainbowVer")then
        for i=0,9 do
            colorAngle = ((animCnt * 10) + (i * 36000)) % 360000
            ledBuffer:set(anim.map[i+6],anim.toRGB(anim.hsl(colorAngle,1000,500)))
            if(i%2==0)then ledBuffer:set(anim.map[(i/2)+1],ledBuffer:get(anim.map[i+6]))end
            if(i%2==1)then ledBuffer:set(anim.map[((i - 1)/2) + 16],ledBuffer:get(anim.map[i+6]))end
        end
    elseif(cmd=="bRainbowHor")then
        local c0g,c0r,c0b,c1g,c1r,c1b,c2g,c2r,c2b,c3g,c3r,c3b
        c0g,c0r,c0b = anim.toRGB(anim.hsl((colorAngle % 360000),1000,500))
        c1g,c1r,c1b = anim.toRGB(anim.hsl(((colorAngle + 25000) % 360000),1000,500))
        c2g,c2r,c2b = anim.toRGB(anim.hsl(((colorAngle + 40000) % 360000),1000,500))
        c3g,c3r,c3b = anim.toRGB(anim.hsl(((colorAngle + 65000) % 360000),1000,500))
        for i=0,4 do
            colorAngle = animCnt * 10
            ledBuffer:set(anim.map[i+1],c0g,c0r,c0b)
            ledBuffer:set(anim.map[(i*2) + 6],c1g,c1r,c1b)
            ledBuffer:set(anim.map[(i*2) + 7],c2g,c2r,c2b)
            ledBuffer:set(anim.map[i + 16],c3g,c3r,c3b) 
        end
    elseif(cmd=="bRainbowAll")then
        ledBuffer:fill(anim.toRGB(anim.hsl(animCnt*4%360000,1000,500)))
    elseif(cmd=="bWalk1" or cmd=="bWalk2")then
        if(animCnt>=4000)then
            animCnt=0
            ledBuffer:fill(anim.toRGB(anim.lastColor[2]))
            local cnt = math.random(0,1)
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
        ledBuffer:set(anim.map[anim.currJag],anim.fadeTo(anim.colJag,anim.colBg,animCnt/10))
        ledBuffer:set(anim.map[anim.lastJag],anim.fadeTo(anim.colJag,anim.colBg,(animCnt*3/20) + 400))
        if(cmd=="bWalk2")then
            ledBuffer:set(anim.map[anim.concurentJags[anim.currJag]], ledBuffer:get(anim.map[anim.currJag]))
            ledBuffer:set(anim.map[anim.concurentJags[anim.lastJag]], ledBuffer:get(anim.map[anim.lastJag]))
        end
    elseif(cmd=="bFade2"or cmd=="bFade3"or cmd=="bFade4")then
        if(animCnt>=20000)then
            animCnt=0
            anim.currColNr = anim.nextColNr
            anim.nextColNr = anim.nextColNr + 1
        end
        local num=cmd:gsub("bFade","")
        if(anim.nextColNr > tonumber(num))then anim.nextColNr=1 end
        ledBuffer:fill(anim.fadeTo(anim.lastColor[anim.currColNr], anim.lastColor[anim.nextColNr],animCnt/10))
    elseif(cmd=="bRnd2"or cmd=="bRnd3"or cmd=="bRnd4")then
        if(animCnt>=2000)then
            animCnt=0
            local num,rndMax,jagNo,colNo
            num=cmd:gsub("bRnd","") 
            rndMax = tonumber(num)
            jagNo = math.random(20)
            colNo = math.random(rndMax)
            ledBuffer:set(anim.map[jagNo],anim.toRGB(anim.lastColor[colNo]))
        end
    elseif(cmd=="bUp2"or cmd=="bUp3"or cmd=="bUp4")then
        if(animCnt>=20000)then
            animCnt=0
            anim.currColNr = anim.nextColNr
            anim.nextColNr = anim.nextColNr + 1
        end
        local num,c0,c1,c0g,c0r,c0b,c1g,c1r,c1b,c2g,c2r,c2b,c3g,c3r,c3b 
        num=cmd:gsub("bUp","")
        if(anim.nextColNr > tonumber(num))then anim.nextColNr=1 end
        c0 = anim.lastColor[anim.currColNr];
        c1 = anim.lastColor[anim.nextColNr];
        
        c0g,c0r,c0b = anim.fadeTo(c0,c1,(animCnt)/10)
        c1g,c1r,c1b = anim.fadeTo(c0,c1,(animCnt-1000)/10)
        c2g,c2r,c2b = anim.fadeTo(c0,c1,(animCnt-1100)/10)
        c3g,c3r,c3b = anim.fadeTo(c0,c1,(animCnt-2100)/10)


        for i=1,5 do
            ledBuffer:set(anim.map[i],c3g,c3r,c3b)
            ledBuffer:set(anim.map[(i*2)+4],c2g,c2r,c2b)
            ledBuffer:set(anim.map[(i*2)+5],c1g,c1r,c1b)
            ledBuffer:set(anim.map[i+15],c0g,c0r,c0b) 
        end
    elseif(cmd=="bSpiral2"or cmd=="bSpiral3"or cmd=="bSpiral4") then
        if(animCnt>=40000)then
            animCnt=0
            anim.currColNr = anim.nextColNr
            anim.nextColNr = anim.nextColNr + 1
        end
        local num=cmd:gsub("bSpiral","")
        if(anim.nextColNr > tonumber(num))then anim.nextColNr=1 end
        ledBuffer:set(anim.map[(animCnt/2000)+1],anim.toRGB(anim.lastColor[anim.currColNr]))
        

    end
    
    ws2812.write(ledBuffer)
    tmr.start(1) 
end)


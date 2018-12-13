file.open("state.txt", "r")
for i=1,4 do
    anim.lastColor[i].h = tonumber(string.sub(file.readline(),1,-2) or "0") --remove the \n
    anim.lastColor[i].s = tonumber(string.sub(file.readline(),1,-2) or "0")
    anim.lastColor[i].l = tonumber(string.sub(file.readline(),1,-2) or "0")
end
cmd=string.sub(file.readline(),1,-2) or "Color"
animSpeed=tonumber(string.sub(file.readline(),1,-2) or "200")
file.close()
newCol.h=anim.lastColor[1].h
newCol.s=anim.lastColor[1].s
newCol.l=anim.lastColor[1].l

file.remove("state.txt")
file.open("state.txt","w+")
for i=1,4 do
	file.writeline(anim.lastColor[i].h)
	file.writeline(anim.lastColor[i].s)
	file.writeline(anim.lastColor[i].l)
end
file.writeline(cmd)
file.writeline(animSpeed)
file.close()

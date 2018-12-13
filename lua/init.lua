aps={}

cmd = "Color"
animSpeed = 200
currState = ""
newCol = {h=20000,s=1000,l=500}

setAps=function(t) 
	aps=t 
end

run=function(s)
	if file.exists(s) then
		dofile(s)
	else
		print(s .. " does not exist")
	end
end

print("waiting 0.1s...")
print("use tmr.stop(0) to stop the init.lua")
tmr.alarm(0,100,0,function()
	print("starting...")
	run("AP_setup.lc")
	run("animations.lc")
	run("webserver.lc")	
end)

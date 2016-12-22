aps={}

cmd = "Color"
animSpeed = 200
currState = ""
newCol = {h=20000,s=1000,l=500}

setAps=function(t) 
	aps=t 
end

print("waiting 2s...")
print("use tmr.stop(0) to stop the init.lua")
tmr.alarm(0,2000,0,function()
	print("starting...")
	dofile("AP_setup.lc")
	dofile("animations.lc")
	dofile("webserver.lc")	
end)

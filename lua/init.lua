aps={}

cmd = "Color"
animSpeed = 200
currState = ""
newCol = {h=20000,s=1000,l=500}

setAps=function(t) 
	aps=t 
end

print("waiting 0.1s...")
print("use tmr.stop(0) to stop the init.lua")
tmr.alarm(0,100,0,function()
	print("starting...")
	dofile("AP_setup.lc")
	dofile("animations.lc")
	dofile("webserver.lc")	
end)

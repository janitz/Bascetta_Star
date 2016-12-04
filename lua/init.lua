aps={}

cmd = "Color"
currState = ""
newCol = {h=20,s=100,l=50}

setAps=function(t) 
	aps=t 
end

print("waiting 5s...")
tmr.alarm(0,5000,0,function()
	print("starting...")
	dofile("AP_setup.lc")
	dofile("animations.lc")
	dofile("webserver.lc")	
end)

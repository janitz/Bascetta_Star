aps={}

cmd = "Color"
newCol = {h=0,s=100,l=50}

setAps=function(t) 
	aps=t 
end

tmr.alarm(0,5000,0,function()
	dofile("AP_setup.lc")
	dofile("aniations.lc")
	dofile("webserver.lc")	
end)

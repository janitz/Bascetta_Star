aps={}

setAps=function(t) 
	aps=t 
end

tmr.alarm(0, 5000, 0, function()
	dofile("AP_setup.lc")
	dofile("webserver.lc")	
end)

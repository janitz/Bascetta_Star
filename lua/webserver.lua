port=80

local handle_request=function(conn,request)

	local ct={ 
		html="text/html",
		css="text/css",
		ico="image/vnd.microsoft.icon",
		js="application/javascript"}

	local response={
		"HTTP/1.1 200 OK\r\n",
		"Content-Type: ctPlaceHoler\r\n",
		"Access-Control-Allow-Origin: *\r\n",
		"Connection: close\r\n","\r\n"}

	local setContentType = function(ctStr)
		response[2]=response[2]:gsub("ctPlaceHoler",ctStr)
	end

	local hex_to_char = function(x)
		return string.char(tonumber(x, 16))
	end

	local unescape = function(url)
		return url:gsub("%%(%x%x)", hex_to_char)
	end
		
	local add_txt=function(txt)
		response[#response+1]=txt
	end
	
	local add_file=function(f)
		file.open(f,"r")
		local block = file.read(1024)
		while block do
			add_txt(block)
			block=file.read(1024)
		end
		file.close()
	end

	local send_response=function(conn)
		if #response>0 then
			conn:send(table.remove(response,1))
		else
			conn:close()
		end
	end
	
	--nicely done
	
	local _,_,method,path,vars=request:find("([A-Z]+) (.+)?(.+) HTTP")
	if(method==nil)then
		_,_,method,path=request:find("([A-Z]+) (.+) HTTP")
	end
	
	local _GET={}
	if(vars~=nil)then
		for k,v in vars:gmatch("(%w+)=([^&]+)&*")do
			_GET[k]=v
		end
	end
	
	if(_GET.ssid)then
		ssid=unescape(_GET.ssid:gsub("+", " "))
		dofile("set_wifi.lc")
	end
	
	if(_GET.pwd)then
		pwd=unescape(_GET.pwd:gsub("+", " "))
		dofile("set_wifi.lc")
	end
	
	path = path:lower()
	
	if(path=='/' or path=="/main" or path=="/main.html")then
		setContentType(ct.html)
		add_file('main.html')
	elseif(path=="/main.css")then
		setContentType(ct.css)
		add_file('main.css')
	elseif(path=="/main.js")then
		setContentType(ct.js)
		add_file('main.js')
	elseif(path=='/setup' or path=="/setup.html")then
		
		wifi.sta.getap(setAps)
		
		setContentType(ct.html)
		add_file("setup.html")
		
	elseif(path=="/setup.css")then
		setContentType(ct.css)
		add_file('setup.css')
	elseif(path=="/setup.js")then
		setContentType(ct.js)

		local ip = wifi.sta.getip()
		if(ip ~=nil )then
			add_txt('var currCon="SSID: '..ssid..'<br>IP: '..ip..'";\r\n')
		else
			add_txt('var currCon="This device is currently not connectet to any access point."\r\n')
		end
				
		local ssidStr = 'var ssids=['
		for k, v in pairs(aps) do	
				ssidStr=ssidStr..'"'..k..'",'
		end
		ssidStr=string.gsub(ssidStr..'];','",]','"]').."\r\n"
		
		add_txt(ssidStr)
		add_file('setup.js')
	elseif path=='/favicon.ico' then
		setContentType(ct.ico)
		add_file('favicon.ico')	 
	elseif path=='/restart' then
		node.restart()	
	else
		conn:send("unknown path: " .. path .. "\r\n")
	end
	
	conn:on("sent",send_response)
	send_response(conn)
end

srv=net.createServer(net.TCP,30)

srv:listen(port,function(conn)
	conn:on("receive",handle_request)
end)


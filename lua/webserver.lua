port=80

local handle_request=function(conn,request)
	
	local ct={ 
		html="text/html",
		css="text/css",
		ico="image/vnd.microsoft.icon",
		png="image/png",
		js="application/javascript"}

	local responseTxt=
		"HTTP/1.1 200 OK\r\n"..
		"Content-Type: ctPlaceHoler\r\n"..
		"Server: ESP8266\r\n"..
		"Access-Control-Allow-Origin: *\r\n"..
		"Connection: close\r\n\r\n"

	local setCt=function(ctStr)
		responseTxt=responseTxt:gsub("ctPlaceHoler",ctStr)
	end

	local hex_to_char = function(x)
		return string.char(tonumber(x, 16))
	end

	local unescape = function(url)
		return url:gsub("%%(%x%x)", hex_to_char)
	end

	local sendFile=function(conn, txt1, filename, txt2)
		local idx = 0
		local sendTxt2=function(conn)
			conn:send(txt2, function(conn)
				conn:close();
			end)
		end
		
		local sendChunk=function(conn)
			file.open(filename, "r")
			file.seek("set", idx)
			local line = file.read(1024)
			file.close()
			if line then 
				idx=idx + #line
				conn:send(line, sendChunk) 
			else
				if txt2 then
					sendTxt2(conn)
				else
					conn:close()
				end
			end
		end

		conn:send(txt1,sendChunk)
	end

	local closeConn=function()
		conn:close()
	end
	
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
	
	if(_GET.cmd)then
		cmd=_GET.cmd
		if(cmd=="Color")then
			if(_GET.hue and _GET.sat and _GET.lum)then
				newCol.h=tonumber(_GET.hue)
				newCol.s=tonumber(_GET.sat)
				newCol.l=tonumber(_GET.lum)
			end
		end
	end
	
	
	if(_GET.ssid and _GET.pwd)then
		ssid=unescape(_GET.ssid:gsub("+", " "))
		pwd=unescape(_GET.pwd:gsub("+", " "))
		dofile("set_wifi.lc")
	end

	if(_GET.restart=="now")then
		node.restart()	
	end

	if(_GET.speed)then
		animSpeed=tonumber(_GET.speed)	
	end
	
	path = path:lower()
	
	if(path=='/' or path=="/main" or path=="/main.html")then
		setCt(ct.html)
		sendFile(conn, responseTxt, "main.html")
	elseif(path=="/main.css")then
		setCt(ct.css)
		sendFile(conn, responseTxt, "main.css")
	elseif(path=="/main.min.js")then
		setCt(ct.js)
		sendFile(conn, responseTxt, "main.min.js", currState)
	elseif(path=="/apple-touch-icon.png")then
		setCt(ct.png)
		sendFile(conn, responseTxt, "apple-touch-icon.png")
	elseif(path=='/setup' or path=="/setup.html")then
		
		wifi.sta.getap(setAps)
		
		setCt(ct.html)
		sendFile(conn, responseTxt, "setup.html")
		
	elseif(path=="/setup.css")then
		setCt(ct.css)
		sendFile(conn, responseTxt, "setup.css")
	elseif(path=="/setup.js")then
		setCt(ct.js)

		local ip = wifi.sta.getip()
		if(ip ~=nil )then
			responseTxt=responseTxt..'var currCon="SSID: '..ssid..'<br>IP: '..ip..'";\r\n'
		else
			responseTxt=responseTxt..'var currCon="This device is currently not connectet to any access point.";\r\n'
		end
				
		local ssidStr = 'var ssids=['
		for k, v in pairs(aps) do	
				ssidStr=ssidStr..'"'..k..'",'
		end
		ssidStr=string.gsub(ssidStr..'];','",]','"]').."\r\n"
		responseTxt=responseTxt..ssidStr
		sendFile(conn, responseTxt, "setup.js")
	elseif path=='/favicon.ico' then
		setCt(ct.ico)
		sendFile(conn, responseTxt, "favicon.ico")	 
	else
		responseTxt = "HTTP/1.0 404 Not Found\r\n\r\nPath '" .. path .. "' not found"
		conn:send(responseTxt, closeConn)
	end

	collectgarbage()
				
end

srv=net.createServer(net.TCP,30)

srv:listen(port,function(conn)
	conn:on("receive",handle_request)
end)


ip_cfg =
	{
		ip="192.168.0.1",
		netmask="255.255.255.0",
		gateway="192.168.0.1"
	}
	
wifi.setphymode(wifi.PHYMODE_G)
wifi.setmode(wifi.STATIONAP) --setup in dual mode

if file.open("wifi.txt", "r") then
	ssid = string.sub(file.readline(),1,-2) or "wifi_name" --remove the \n
	pwd = string.sub(file.readline(),1,-2) or "password"
	file.close()
else
	print("can not read wifi.txt")
end

if(string.len(pwd)<8)then
	pwd="password"
end

wifi.sta.config(ssid, pwd, 1)

wifi.ap.config({ssid='Star(192.168.0.1)'})
wifi.ap.setip(ip_cfg)
wifi.ap.dhcp.start() -- important!

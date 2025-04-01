import nmap
from mac_vendor_lookup import MacLookup
import json
import netifaces

def get_local_ip_range():
    try:
        iface = netifaces.gateways()['default'][netifaces.AF_INET][1]
        addr = netifaces.ifaddresses(iface)[netifaces.AF_INET][0]['addr']
        ip_parts = addr.split('.')
        ip_range = f"{ip_parts[0]}.{ip_parts[1]}.{ip_parts[2]}.0/24"
        return ip_range
    except Exception as e:
        return "192.168.1.0/24"

def get_vendor(mac_address):
    try:
        return MacLookup().lookup(mac_address)
    except Exception:
        return "Vendor Not Available"

def extract_open_ports(host_data):
    open_ports = []
    if 'tcp' in host_data:
        for port, details in host_data['tcp'].items():
            if details['state'] == 'open':
                open_ports.append({
                    "port": port,
                    "service": details.get("name", "unknown"),
                    "product": details.get("product", ""),
                    "version": details.get("version", "")
                })
    return open_ports

def extract_os(host_data):
    try:
        if 'osmatch' in host_data and len(host_data['osmatch']) > 0:
            return host_data['osmatch'][0]['name']
    except:
        pass
    return "Unknown"

def scan_network(ip_range):
    nm = nmap.PortScanner()
    devices = []

    try:
        nm.scan(hosts=ip_range, arguments='-O -sS -sV -Pn')
    except Exception as e:
        return {"error": f"Failed to scan network: {str(e)}"}

    for host in nm.all_hosts():
        if nm[host].state() == 'up':
            mac_address = nm[host]['addresses'].get('mac', 'Not Available')
            device_info = {
                'IP': host,
                'MAC': mac_address,
                'Hostname': nm[host].hostname() or 'Not Available',
                'Vendor': get_vendor(mac_address) if mac_address != 'Not Available' else 'Unknown',
                'OperatingSystem': extract_os(nm[host]),
                'OpenPorts': extract_open_ports(nm[host]),
            }
            devices.append(device_info)

    return {"devices": devices}

if __name__ == "__main__":
    ip_range = get_local_ip_range()
    results = scan_network(ip_range)
    print(json.dumps(results)) 

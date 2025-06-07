import nmap
from mac_vendor_lookup import MacLookup
import json
import sys

def scan_network(ip_range):
    nm = nmap.PortScanner()
    devices = []

    try:
        nm.scan(hosts=ip_range, arguments='-sn -e en0 --unprivileged')
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
            }
            devices.append(device_info)

    return {"devices": devices}

def get_vendor(mac_address):
    try:
        return MacLookup().lookup(mac_address)
    except Exception:
        return "Vendor Not Available"

if __name__ == "__main__":
    ip_range = "192.168.31.0/24"
    results = scan_network(ip_range)
    print(json.dumps(results))  # רק JSON נקי!

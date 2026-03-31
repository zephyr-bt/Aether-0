import os
import subprocess

def execute_protocol(command):
    # This is where you put your real Python logic
    if command == "sys_info":
        return os.name
    elif command == "list_tasks":
        return subprocess.check_output("tasklist", shell=True).decode()
    return "UNKNOWN_PROTOCOL"

print("AETHER-0 PYTHON AGENT STANDING BY...")

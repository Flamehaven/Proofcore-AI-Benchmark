"""
Utility functions for FlashRecord
"""

import os
import sys
from datetime import datetime


def get_timestamp():
    """Get formatted timestamp"""
    return datetime.now().strftime("%Y%m%d_%H%M%S")


def get_datetime():
    """Get formatted datetime"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def ensure_dir(dirpath):
    """Ensure directory exists"""
    try:
        os.makedirs(dirpath, exist_ok=True)
        return True
    except Exception as e:
        print(f"[-] Error creating directory: {str(e)}")
        return False


def format_filesize(size_bytes):
    """Format bytes to human readable size"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"


def get_file_info(filepath):
    """Get file information"""
    try:
        if os.path.exists(filepath):
            size = os.path.getsize(filepath)
            mtime = os.path.getmtime(filepath)
            return {
                "path": filepath,
                "size": size,
                "size_str": format_filesize(size),
                "mtime": mtime,
                "exists": True
            }
    except Exception as e:
        print(f"[-] Error getting file info: {str(e)}")

    return {
        "path": filepath,
        "size": 0,
        "size_str": "0 B",
        "mtime": 0,
        "exists": False
    }


def detect_ai_model():
    """Detect which AI model is running"""
    try:
        # Check environment variables
        if "CLAUDE" in os.environ:
            return "claude"
        elif "GEMINI" in os.environ:
            return "gemini"
        elif "CODEX" in os.environ:
            return "codex"

        # Check parent process
        if os.name == 'nt':  # Windows
            try:
                import subprocess
                result = subprocess.run(['wmic', 'process', 'list', 'brief'],
                                      capture_output=True, text=True)
                output = result.stdout.lower()
                if 'claude' in output:
                    return 'claude'
                elif 'gemini' in output:
                    return 'gemini'
                elif 'codex' in output or 'vscode' in output:
                    return 'codex'
            except:
                pass

    except Exception as e:
        print(f"Warning: Could not detect AI model: {str(e)}")

    return "general"


if __name__ == "__main__":
    print(f"Timestamp: {get_timestamp()}")
    print(f"DateTime: {get_datetime()}")
    print(f"Detected AI: {detect_ai_model()}")

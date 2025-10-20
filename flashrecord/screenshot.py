"""
Screenshot module - Wrapper for hcap screen capture
"""

import subprocess
import os
from datetime import datetime
from .config import Config


def take_screenshot():
    """
    Take screenshot using hcap and save to flashrecord-save/screenshots
    Returns: path to saved screenshot or None if failed
    """
    try:
        config = Config()

        # Create screenshots directory if needed
        screenshot_dir = os.path.join(config.save_dir, "screenshots")
        os.makedirs(screenshot_dir, exist_ok=True)

        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"screenshot_{timestamp}.png"
        filepath = os.path.join(screenshot_dir, filename)

        # Call hcap
        hcap_path = config.hcap_path
        result = subprocess.run(
            ["python", hcap_path],
            capture_output=True,
            text=True,
            timeout=5
        )

        # Check if hcap created a file in captures/
        captures_dir = os.path.join(os.path.dirname(hcap_path), "..", "captures")
        if os.path.exists(captures_dir):
            latest_capture = max(
                [os.path.join(captures_dir, f) for f in os.listdir(captures_dir)],
                key=os.path.getctime,
                default=None
            )
            if latest_capture:
                # Move to our directory
                import shutil
                shutil.copy2(latest_capture, filepath)
                return filepath

        return None

    except subprocess.TimeoutExpired:
        print("[-] hcap timeout")
        return None
    except FileNotFoundError:
        print("[-] hcap not found")
        return None
    except Exception as e:
        print(f"[-] Screenshot error: {str(e)}")
        return None


if __name__ == "__main__":
    result = take_screenshot()
    if result:
        print(f"Screenshot: {result}")
    else:
        print("Failed to take screenshot")

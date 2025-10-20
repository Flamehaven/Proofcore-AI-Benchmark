"""
Video recording module - Wrapper for terminalizer
"""

import subprocess
import os
from datetime import datetime
from .config import Config


class VideoRecorder:
    """Handles video recording using terminalizer"""

    def __init__(self):
        self.config = Config()
        self.recording_process = None
        self.recording_file = None
        self.videos_dir = os.path.join(self.config.save_dir, "videos")
        self.recordings_dir = os.path.join(self.config.save_dir, "recordings")

        os.makedirs(self.videos_dir, exist_ok=True)
        os.makedirs(self.recordings_dir, exist_ok=True)

    def start_recording(self):
        """Start video recording with terminalizer"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            recording_name = f"demo_{timestamp}"
            recording_path = os.path.join(self.recordings_dir, recording_name)

            # Start terminalizer recording
            cmd = ["terminalizer", "record", recording_path]
            self.recording_process = subprocess.Popen(
                cmd,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )

            self.recording_file = recording_path
            return self.recording_file

        except FileNotFoundError:
            print("[-] terminalizer not found. Install: npm install -g terminalizer")
            return None
        except Exception as e:
            print(f"[-] Recording start error: {str(e)}")
            return None

    def stop_recording(self):
        """Stop video recording"""
        try:
            if self.recording_process:
                self.recording_process.terminate()
                self.recording_process.wait(timeout=5)
                return True
        except Exception as e:
            print(f"[-] Recording stop error: {str(e)}")
        return False

    def convert_to_gif(self, recording_file):
        """Convert terminalizer recording to GIF"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            gif_filename = f"demo_{timestamp}.gif"
            gif_path = os.path.join(self.videos_dir, gif_filename)

            # Render terminalizer recording to GIF
            cmd = ["terminalizer", "render", recording_file, "-o", gif_path]
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30
            )

            if os.path.exists(gif_path):
                return gif_path
            else:
                print("[-] GIF conversion failed")
                return None

        except subprocess.TimeoutExpired:
            print("[-] GIF conversion timeout")
            return None
        except Exception as e:
            print(f"[-] GIF conversion error: {str(e)}")
            return None

    def list_recordings(self):
        """List all saved recordings"""
        try:
            files = os.listdir(self.videos_dir)
            gif_files = [f for f in files if f.endswith(".gif")]
            return sorted(gif_files, reverse=True)
        except Exception as e:
            print(f"[-] Error listing recordings: {str(e)}")
            return []


if __name__ == "__main__":
    recorder = VideoRecorder()
    print("Starting recording... (press Ctrl+C to stop)")
    recorder.start_recording()

    try:
        import time
        time.sleep(5)
    except KeyboardInterrupt:
        pass

    recorder.stop_recording()
    if recorder.recording_file:
        gif = recorder.convert_to_gif(recorder.recording_file)
        if gif:
            print(f"GIF created: {gif}")

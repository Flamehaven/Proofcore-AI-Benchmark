"""
FlashRecord CLI - Main interface for screen recording and GIF generation
Commands: #sc (screenshot), #sv (video), 1 (record), 2 (stop), 3 (finish)
"""

import os
import sys
from datetime import datetime
from .screenshot import take_screenshot
from .video_recorder import VideoRecorder
from .ai_prompt import AIPromptManager
from .config import Config


class FlashRecordCLI:
    """Main CLI interface for FlashRecord"""

    def __init__(self):
        self.config = Config()
        self.ai_manager = AIPromptManager()
        self.video_recorder = VideoRecorder()
        self.recording = False
        self.recording_file = None

    def print_header(self):
        """Print CLI header"""
        print("\n" + "="*60)
        print("FlashRecord - Fast, Simple, Easy Screen Recording")
        print("="*60)
        print("Commands:")
        print("  #sc              - Take screenshot instantly")
        print("  #sv              - Start video recording")
        print("  1                - Recording (in progress)")
        print("  2                - Stop recording")
        print("  3                - Finish & convert to GIF")
        print("  claude           - Save to claude.md")
        print("  gemini           - Save to gemini.md")
        print("  codex            - Save to codex.md")
        print("  exit/quit        - Exit FlashRecord")
        print("="*60 + "\n")

    def handle_screenshot(self):
        """Handle screenshot command"""
        try:
            result = take_screenshot()
            if result:
                print(f"[+] Screenshot saved: {result}")
                return result
            else:
                print("[-] Screenshot failed")
        except Exception as e:
            print(f"[-] Error: {str(e)}")
        return None

    def handle_video_start(self):
        """Handle video recording start"""
        try:
            self.recording_file = self.video_recorder.start_recording()
            self.recording = True
            print(f"[>] Recording started... (press '2' to stop)")
            return self.recording_file
        except Exception as e:
            print(f"[-] Error starting recording: {str(e)}")
        return None

    def handle_video_stop(self):
        """Handle video recording stop"""
        try:
            if self.recording and self.recording_file:
                self.video_recorder.stop_recording()
                self.recording = False
                print(f"[+] Recording stopped: {self.recording_file}")
                return self.recording_file
            else:
                print("[-] No recording in progress")
        except Exception as e:
            print(f"[-] Error stopping recording: {str(e)}")
        return None

    def handle_convert_to_gif(self):
        """Handle GIF conversion"""
        try:
            if self.recording_file:
                gif_file = self.video_recorder.convert_to_gif(self.recording_file)
                print(f"[+] GIF created: {gif_file}")
                return gif_file
            else:
                print("[-] No video file to convert")
        except Exception as e:
            print(f"[-] Error converting to GIF: {str(e)}")
        return None

    def handle_save_to_ai(self, ai_model):
        """Handle saving to AI prompt file"""
        try:
            self.ai_manager.save_session(ai_model)
            print(f"[+] Saved to {ai_model}.md")
        except Exception as e:
            print(f"[-] Error saving: {str(e)}")

    def run(self):
        """Main CLI loop"""
        self.print_header()

        print("[*] FlashRecord ready")
        print(f"[*] Save directory: {self.config.save_dir}")
        print(f"[*] Auto-delete: {self.config.auto_delete_hours}h\n")

        while True:
            try:
                cmd = input("> ").strip().lower()

                if not cmd:
                    continue

                # Screenshot
                if cmd == "#sc":
                    self.handle_screenshot()

                # Video start
                elif cmd == "#sv":
                    self.handle_video_start()

                # Recording (progress indicator)
                elif cmd == "1":
                    if self.recording:
                        print("[*] Recording... (press '2' to stop)")
                    else:
                        print("[-] Not recording. Use '#sv' to start")

                # Stop recording
                elif cmd == "2":
                    self.handle_video_stop()

                # Convert to GIF
                elif cmd == "3":
                    gif = self.handle_convert_to_gif()
                    if gif:
                        self.handle_save_to_ai("general")

                # Save to Claude
                elif cmd == "claude":
                    self.handle_save_to_ai("claude")

                # Save to Gemini
                elif cmd == "gemini":
                    self.handle_save_to_ai("gemini")

                # Save to Codex
                elif cmd == "codex":
                    self.handle_save_to_ai("codex")

                # Exit
                elif cmd in ["exit", "quit", "q"]:
                    print("[*] FlashRecord closed")
                    break

                # Help
                elif cmd == "help":
                    self.print_header()

                else:
                    print(f"[-] Unknown command: {cmd}")

            except KeyboardInterrupt:
                print("\n[*] Interrupted. Type 'quit' to exit")
            except Exception as e:
                print(f"[-] Error: {str(e)}")


def main():
    """Entry point"""
    cli = FlashRecordCLI()
    cli.run()


if __name__ == "__main__":
    main()

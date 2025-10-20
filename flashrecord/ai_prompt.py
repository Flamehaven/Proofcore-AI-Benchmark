"""
AI Prompt Manager - Saves sessions to model-specific markdown files
"""

import os
from datetime import datetime
from .config import Config


class AIPromptManager:
    """Manages saving sessions to AI model files"""

    def __init__(self):
        self.config = Config()
        self.current_session = {
            "timestamp": datetime.now().isoformat(),
            "screenshots": [],
            "videos": [],
            "gifs": [],
            "notes": []
        }

    def add_screenshot(self, path):
        """Add screenshot to current session"""
        if os.path.exists(path):
            self.current_session["screenshots"].append(path)

    def add_video(self, path):
        """Add video to current session"""
        if os.path.exists(path):
            self.current_session["videos"].append(path)

    def add_gif(self, path):
        """Add GIF to current session"""
        if os.path.exists(path):
            self.current_session["gifs"].append(path)

    def add_note(self, text):
        """Add note to current session"""
        self.current_session["notes"].append(text)

    def save_session(self, ai_model="claude"):
        """Save current session to model-specific markdown file"""
        try:
            filepath = self.config.get_ai_file_path(ai_model)

            # Prepare content
            date_str = datetime.now().strftime("%Y-%m-%d")
            time_str = datetime.now().strftime("%H:%M:%S")

            content = f"## {date_str} {time_str}\n\n"

            # Add screenshots
            if self.current_session["screenshots"]:
                content += "### Screenshots\n"
                for sc in self.current_session["screenshots"]:
                    filename = os.path.basename(sc)
                    content += f"- [{filename}]({sc})\n"
                content += "\n"

            # Add GIFs
            if self.current_session["gifs"]:
                content += "### Videos (GIF)\n"
                for gif in self.current_session["gifs"]:
                    filename = os.path.basename(gif)
                    content += f"- [{filename}]({gif})\n"
                content += "\n"

            # Add notes
            if self.current_session["notes"]:
                content += "### Notes\n"
                for note in self.current_session["notes"]:
                    content += f"- {note}\n"
                content += "\n"

            # Append to file
            header = f"# FlashRecord - {ai_model.upper()} Sessions\n\n"
            if not os.path.exists(filepath):
                with open(filepath, "w") as f:
                    f.write(header)

            with open(filepath, "a") as f:
                f.write(content + "\n")

            # Reset session
            self.current_session = {
                "timestamp": datetime.now().isoformat(),
                "screenshots": [],
                "videos": [],
                "gifs": [],
                "notes": []
            }

            return filepath

        except Exception as e:
            print(f"[-] Error saving session: {str(e)}")
            return None

    def list_sessions(self, ai_model="claude"):
        """List all saved sessions for a model"""
        try:
            filepath = self.config.get_ai_file_path(ai_model)
            if os.path.exists(filepath):
                with open(filepath, "r") as f:
                    return f.read()
            return None
        except Exception as e:
            print(f"[-] Error reading sessions: {str(e)}")
            return None


if __name__ == "__main__":
    manager = AIPromptManager()
    manager.add_note("Test FlashRecord session")
    manager.save_session("claude")
    print("Session saved to claude.md")

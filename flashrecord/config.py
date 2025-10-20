"""
Configuration module for FlashRecord
"""

import os
import json
from pathlib import Path


class Config:
    """Configuration management for FlashRecord"""

    def __init__(self):
        # Base directory
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.save_dir = os.path.join(self.base_dir, "flashrecord-save")

        # hcap path
        self.hcap_path = r"d:\Sanctum\hcap-1.5.0\simple_capture.py"

        # Auto-delete settings (hours)
        self.auto_delete_hours = 24

        # AI models
        self.ai_models = ["claude", "gemini", "codex"]

        # Load config from JSON if exists
        self.config_file = os.path.join(self.base_dir, "config.json")
        self._load_config()

    def _load_config(self):
        """Load configuration from JSON file"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, "r") as f:
                    config = json.load(f)
                    self.auto_delete_hours = config.get("auto_delete_hours", 24)
                    self.hcap_path = config.get("hcap_path", self.hcap_path)
        except Exception as e:
            print(f"Warning: Could not load config: {str(e)}")

    def save_config(self):
        """Save configuration to JSON file"""
        try:
            config = {
                "auto_delete_hours": self.auto_delete_hours,
                "hcap_path": self.hcap_path,
            }
            with open(self.config_file, "w") as f:
                json.dump(config, f, indent=2)
        except Exception as e:
            print(f"Warning: Could not save config: {str(e)}")

    def get_save_path(self, filename):
        """Get full path for saving files"""
        return os.path.join(self.save_dir, filename)

    def get_ai_file_path(self, ai_model):
        """Get path to AI model file"""
        if ai_model not in self.ai_models:
            ai_model = "general"
        return os.path.join(self.base_dir, f"{ai_model}.md")


if __name__ == "__main__":
    config = Config()
    print(f"Base dir: {config.base_dir}")
    print(f"Save dir: {config.save_dir}")
    print(f"hcap path: {config.hcap_path}")
    print(f"Auto-delete: {config.auto_delete_hours}h")

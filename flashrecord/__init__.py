"""
FlashRecord - Embedded Screen Recording & GIF Generator
Fast, Simple, Easy - CLI-based media capture with AI prompt storage
"""

__version__ = "0.1.0"
__author__ = "Flamehaven"

from .cli import FlashRecordCLI
from .screenshot import take_screenshot
from .video_recorder import record_video
from .manager import FileManager
from .ai_prompt import AIPromptManager

__all__ = [
    'FlashRecordCLI',
    'take_screenshot',
    'record_video',
    'FileManager',
    'AIPromptManager',
]

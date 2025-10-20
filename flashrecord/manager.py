"""
File Manager - Handles auto-deletion and file cleanup
"""

import os
import time
from datetime import datetime, timedelta
from .config import Config


class FileManager:
    """Manages file lifecycle and auto-deletion"""

    def __init__(self):
        self.config = Config()

    def cleanup_old_files(self, hours=None):
        """Delete files older than specified hours"""
        if hours is None:
            hours = self.config.auto_delete_hours

        cutoff_time = time.time() - (hours * 3600)
        deleted_count = 0

        try:
            # Cleanup screenshots
            screenshot_dir = os.path.join(self.config.save_dir, "screenshots")
            if os.path.exists(screenshot_dir):
                for filename in os.listdir(screenshot_dir):
                    filepath = os.path.join(screenshot_dir, filename)
                    if os.path.isfile(filepath):
                        if os.path.getmtime(filepath) < cutoff_time:
                            os.remove(filepath)
                            deleted_count += 1

            # Cleanup videos (GIFs)
            videos_dir = os.path.join(self.config.save_dir, "videos")
            if os.path.exists(videos_dir):
                for filename in os.listdir(videos_dir):
                    filepath = os.path.join(videos_dir, filename)
                    if os.path.isfile(filepath):
                        if os.path.getmtime(filepath) < cutoff_time:
                            os.remove(filepath)
                            deleted_count += 1

            # Cleanup recordings
            recordings_dir = os.path.join(self.config.save_dir, "recordings")
            if os.path.exists(recordings_dir):
                for filename in os.listdir(recordings_dir):
                    filepath = os.path.join(recordings_dir, filename)
                    if os.path.isfile(filepath):
                        if os.path.getmtime(filepath) < cutoff_time:
                            os.remove(filepath)
                            deleted_count += 1

            if deleted_count > 0:
                print(f"[*] Cleaned {deleted_count} old files")

        except Exception as e:
            print(f"[-] Cleanup error: {str(e)}")

        return deleted_count

    def get_storage_usage(self):
        """Get total storage usage"""
        try:
            total_size = 0
            for dirpath, dirnames, filenames in os.walk(self.config.save_dir):
                for filename in filenames:
                    filepath = os.path.join(dirpath, filename)
                    if os.path.isfile(filepath):
                        total_size += os.path.getsize(filepath)

            # Convert to MB
            size_mb = total_size / (1024 * 1024)
            return size_mb

        except Exception as e:
            print(f"[-] Error calculating size: {str(e)}")
            return 0

    def get_file_count(self):
        """Get total file count"""
        try:
            count = 0
            for dirpath, dirnames, filenames in os.walk(self.config.save_dir):
                count += len(filenames)
            return count
        except Exception as e:
            print(f"[-] Error counting files: {str(e)}")
            return 0

    def delete_file(self, filepath):
        """Delete a specific file"""
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
                print(f"[+] Deleted: {filepath}")
                return True
        except Exception as e:
            print(f"[-] Delete error: {str(e)}")
        return False

    def get_file_age(self, filepath):
        """Get file age in hours"""
        try:
            if os.path.exists(filepath):
                age_seconds = time.time() - os.path.getmtime(filepath)
                age_hours = age_seconds / 3600
                return age_hours
        except Exception as e:
            print(f"[-] Error getting file age: {str(e)}")
        return None


if __name__ == "__main__":
    manager = FileManager()
    print(f"Storage: {manager.get_storage_usage():.2f} MB")
    print(f"Files: {manager.get_file_count()}")
    manager.cleanup_old_files(hours=0.01)  # Test with 36 seconds

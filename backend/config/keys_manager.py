"""
Secure API Keys Manager
Handles encryption and storage of API keys from frontend
"""
import os
import json
from typing import Optional, Dict, Any
from cryptography.fernet import Fernet
import base64
import hashlib
from pathlib import Path


class KeysManager:
    """Manages secure storage and retrieval of API keys"""
    
    def __init__(self):
        # Use a derived key from environment or generate one
        master_key = os.environ.get('MASTER_KEY')
        if not master_key:
            # Generate a key if not in environment (development only)
            master_key = base64.urlsafe_b64encode(
                hashlib.sha256(b'default-dev-key-change-in-production').digest()
            ).decode()
        
        self.cipher = Fernet(master_key.encode() if isinstance(master_key, str) else master_key)
        self.storage_path = Path(__file__).resolve().parent / '.secure_keys.json'
        self.keys_cache: Dict[str, str] = {}
        self._load_persisted_keys()

    def _read_persisted_keys(self) -> Dict[str, str]:
        if not self.storage_path.exists():
            return {}

        try:
            with self.storage_path.open('r', encoding='utf-8') as storage_file:
                stored = json.load(storage_file)
        except Exception:
            return {}

        return stored if isinstance(stored, dict) else {}

    def _write_persisted_keys(self, encrypted_keys: Dict[str, str]):
        with self.storage_path.open('w', encoding='utf-8') as storage_file:
            json.dump(encrypted_keys, storage_file, indent=2)

    def _load_persisted_keys(self):
        encrypted_keys = self._read_persisted_keys()

        for key_name, encrypted_value in encrypted_keys.items():
            try:
                self.keys_cache[key_name] = self.decrypt_key(encrypted_value)
            except ValueError:
                continue
    
    def encrypt_key(self, key: str) -> str:
        """Encrypt an API key"""
        encrypted = self.cipher.encrypt(key.encode())
        return encrypted.decode()
    
    def decrypt_key(self, encrypted_key: str) -> str:
        """Decrypt an API key"""
        try:
            decrypted = self.cipher.decrypt(encrypted_key.encode())
            return decrypted.decode()
        except Exception as e:
            raise ValueError(f"Failed to decrypt key: {e}")
    
    def store_keys(self, keys_data: Dict[str, Any]) -> Dict[str, str]:
        """
        Store keys from frontend
        keys_data format: {
            'gumroad_key': '...',
            'gumroad_secret': '...',
            'openai_key': '...',
            'anthropic_key': '...',
            'dalle_key': '...',
            'sendgrid_key': '...',
            'stripe_key': '...',
            'mongodb_url': '...'
        }
        """
        encrypted_keys = self._read_persisted_keys()
        stored_keys = {}
        for key_name, key_value in keys_data.items():
            if key_value:
                encrypted = self.encrypt_key(key_value)
                encrypted_keys[key_name] = encrypted
                stored_keys[key_name] = encrypted
                # Also cache in memory
                self.keys_cache[key_name] = key_value
                os.environ[key_name.upper()] = key_value

        if stored_keys:
            self._write_persisted_keys(encrypted_keys)
        
        return stored_keys
    
    def get_key(self, key_name: str) -> Optional[str]:
        """Retrieve a key from cache or decrypt it"""
        # First check cache
        if key_name in self.keys_cache:
            return self.keys_cache[key_name]
        
        # Try environment variable
        env_name = key_name.upper()
        env_value = os.environ.get(env_name)
        if env_value:
            self.keys_cache[key_name] = env_value
            return env_value
        
        return None
    
    def set_key(self, key_name: str, key_value: str):
        """Set a key in cache"""
        if key_value:
            self.store_keys({key_name: key_value})


# Global instance
keys_manager = KeysManager()

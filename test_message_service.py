import unittest

# --- Implementation ---
class MessageService:
    def send_message(self, area: str, message: str) -> bool:
        """
        Business Logic:
        1. Message length must be between 1 and 1000 inclusive.
        2. Area must be 'ValidArea'.
        """
        
        if len(message) < 1 or len(message) > 1000:
            return False
            
        if area != "ValidArea":
            return False
            
        return True

# --- Test Suite ---
class TestMessageService(unittest.TestCase):
    def setUp(self):
        """Equivalent to the C++ protected service member"""
        self.service = MessageService()
        
    # --- CORRECT PATH ---
    def test_sends_to_correct_area(self):
        result = self.service.send_message("ValidArea", "Hello, World!")
        self.assertTrue(result)

if __name__ == '__main__':
    unittest.main()

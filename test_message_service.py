import unittest
import sys

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

    def test_message_too_short(self):
        result = self.service.send_message("ValidArea", "")
        self.assertFalse(result)

    def test_message_too_long(self):
        result = self.service.send_message("ValidArea", "A" * 1001)
        self.assertFalse(result)

    def test_invalid_area(self):
        result = self.service.send_message("InvalidArea", "Hello, World!")
        self.assertFalse(result)

    def test_valid_message_boundaries(self):
        result_min = self.service.send_message("ValidArea", "A")
        result_max = self.service.send_message("ValidArea", "A" * 1000)
        self.assertTrue(result_min)
        self.assertTrue(result_max)

class CustomTestResult(unittest.TextTestResult):
    def addSuccess(self, test):
        super().addSuccess(test)
        self.stream.writeln(f"\033[92m[Test passed]\033[0m {test.id().split('.')[-1]}")

class CustomTestRunner(unittest.TextTestRunner):
    def _makeResult(self):
        return CustomTestResult(self.stream, self.descriptions, self.verbosity)

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestMessageService)
    runner = CustomTestRunner(stream=sys.stdout, verbosity=0)
    result = runner.run(suite)
    
    if result.wasSuccessful():
        print("\n\033[92mAll tests passed successfully\033[0m")
    else:
        sys.exit(1)

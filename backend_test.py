import requests
import sys
import json
import time
from datetime import datetime

class KellysEyeBingoAPITester:
    def __init__(self, base_url="https://singo-bar-mode.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.errors = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, params=params, timeout=10)
            else:
                print(f"❌ Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                print(f"❌ Failed - {error_msg}")
                try:
                    print(f"   Response: {response.text[:200]}...")
                except:
                    pass
                self.errors.append({"test": name, "error": error_msg, "status": response.status_code})
                return False, {}

        except requests.exceptions.RequestException as e:
            error_msg = f"Request error: {str(e)}"
            print(f"❌ Failed - {error_msg}")
            self.errors.append({"test": name, "error": error_msg})
            return False, {}

    def test_leaderboard_functionality(self):
        """Test leaderboard API and tracking"""
        print("\n🏆 Testing Leaderboard Functionality...")
        
        # Get leaderboard
        success, leaderboard = self.run_test(
            "Get Leaderboard",
            "GET", 
            "leaderboard",
            200,
            params={"limit": 10}
        )
        
        if success:
            if isinstance(leaderboard, list):
                print(f"✅ Leaderboard returned list with {len(leaderboard)} entries")
                
                # Validate leaderboard structure if entries exist
                if leaderboard:
                    entry = leaderboard[0]
                    required_fields = ['player_name', 'wins', 'games_played', 'win_rate']
                    missing_fields = [field for field in required_fields if field not in entry]
                    
                    if not missing_fields:
                        print("✅ Leaderboard entries have all required fields")
                        print(f"   Sample entry: {entry['player_name']}, Wins: {entry['wins']}, Win Rate: {entry['win_rate']}%")
                    else:
                        self.errors.append({"test": "Leaderboard Entry Structure", "error": f"Missing fields: {missing_fields}"})
            else:
                self.errors.append({"test": "Get Leaderboard", "error": "Leaderboard not returned as list"})
        
        # Create a game to test leaderboard tracking
        success, response = self.run_test(
            "Create Game for Leaderboard",
            "POST",
            "game/create",
            200,
            params={
                "mode": "single",
                "player_name": "LeaderboardTestPlayer_" + str(int(time.time())),
                "num_cards": 1,
                "pattern": "any"
            }
        )
        
        if success:
            game_id = response.get('game_id')
            print(f"   Created game for leaderboard: {game_id}")
        
        return True

    def test_single_player_flow_with_patterns(self):
        """Test complete single player game flow with new patterns"""
        print("\n🎮 Testing Single Player Game Flow with Patterns...")
        
        # Test each pattern type
        patterns = ['any', 'line', 'diagonal', 'four_corners', 'x', 'full_house']
        
        for pattern in patterns:
            print(f"\n   Testing pattern: {pattern}")
            
            # Create single player game with pattern
            success, response = self.run_test(
                f"Create Single Player Game ({pattern})",
                "POST",
                "game/create",
                200,
                params={
                    "mode": "single",
                    "player_name": f"TestPlayer_{pattern}",
                    "num_cards": 1,
                    "pattern": pattern
                }
            )
            
            if not success:
                continue
                
            game_id = response.get('game_id')
            if game_id:
                # Verify pattern is stored correctly
                success, game_data = self.run_test(
                    f"Get Game Pattern ({pattern})",
                    "GET",
                    f"game/{game_id}",
                    200
                )
                
                if success and game_data.get('pattern') == pattern:
                    print(f"✅ Pattern {pattern} correctly stored")
                else:
                    self.errors.append({"test": f"Game Pattern ({pattern})", "error": f"Pattern not stored correctly: {game_data.get('pattern')}"})
        
        return True

    def test_single_player_flow(self):
        """Test complete single player game flow"""
        print("\n🎮 Testing Single Player Game Flow...")
        
        # Create single player game
        success, response = self.run_test(
            "Create Single Player Game",
            "POST",
            "game/create",
            200,
            params={
                "mode": "single",
                "player_name": "TestPlayer",
                "num_cards": 2
            }
        )
        
        if not success:
            return False
        
        game_id = response.get('game_id')
        player_id = response.get('player_id')
        cards = response.get('cards', [])
        
        print(f"   Game ID: {game_id}")
        print(f"   Player ID: {player_id}")
        print(f"   Number of cards: {len(cards)}")
        
        if not game_id or not player_id or len(cards) != 2:
            self.errors.append({"test": "Create Single Player Game", "error": "Missing required fields in response"})
            return False
        
        # Start game
        success, _ = self.run_test(
            "Start Single Player Game",
            "POST",
            f"game/{game_id}/start",
            200
        )
        
        if not success:
            return False
        
        # Get game status
        success, game_data = self.run_test(
            "Get Game Status",
            "GET",
            f"game/{game_id}",
            200
        )
        
        if success and game_data.get('is_active'):
            print("✅ Game is active")
        else:
            self.errors.append({"test": "Get Game Status", "error": "Game not active"})
        
        # Call number
        success, call_response = self.run_test(
            "Call Number",
            "POST",
            f"game/{game_id}/call-number",
            200
        )
        
        if success and call_response.get('number'):
            called_number = call_response['number']
            print(f"   Called number: {called_number}")
            
            # Test daubing
            success, daub_response = self.run_test(
                "Daub Number",
                "POST",
                f"game/{game_id}/daub",
                200,
                params={
                    "player_id": player_id,
                    "card_id": cards[0]['card_id'],
                    "row": 2,
                    "col": 2  # FREE space
                }
            )
            
            if success and daub_response.get('daubed'):
                print("✅ Daubing successful")
            else:
                self.errors.append({"test": "Daub Number", "error": "Daubing failed"})
        
        return True

    def test_multiplayer_flow(self):
        """Test multiplayer room creation and management"""
        print("\n👥 Testing Multiplayer Room Flow...")
        
        # Create room
        success, response = self.run_test(
            "Create Room",
            "POST",
            "room/create",
            200,
            params={
                "room_name": "Test Kelly's Eye Room",
                "host_name": "TestHost",
                "max_players": 4
            }
        )
        
        if not success:
            return False
        
        room_id = response.get('room_id')
        host_id = response.get('host_id')
        
        print(f"   Room ID: {room_id}")
        print(f"   Host ID: {host_id}")
        
        if not room_id or not host_id:
            self.errors.append({"test": "Create Room", "error": "Missing required fields in response"})
            return False
        
        # List rooms
        success, rooms = self.run_test(
            "List Rooms",
            "GET",
            "room/list",
            200
        )
        
        if success and isinstance(rooms, list):
            found_room = any(room.get('room_id') == room_id for room in rooms)
            if found_room:
                print("✅ Room found in room list")
            else:
                self.errors.append({"test": "List Rooms", "error": "Created room not found in list"})
        
        # Join room
        success, join_response = self.run_test(
            "Join Room",
            "POST",
            f"room/{room_id}/join",
            200,
            params={"player_name": "TestPlayer2"}
        )
        
        if success and join_response.get('player_id'):
            print("✅ Successfully joined room")
            
            # Get room status
            success, room_data = self.run_test(
                "Get Room Status",
                "GET",
                f"room/{room_id}",
                200
            )
            
            if success and len(room_data.get('player_ids', [])) == 2:
                print("✅ Room has 2 players")
            else:
                self.errors.append({"test": "Get Room Status", "error": "Incorrect player count"})
        
        return True

    def test_game_validation(self):
        """Test game data validation and error cases"""
        print("\n🔒 Testing Game Validation...")
        
        # Test invalid game ID
        success, _ = self.run_test(
            "Get Invalid Game",
            "GET",
            "game/invalid-game-id",
            404
        )
        
        # Test invalid room ID
        success, _ = self.run_test(
            "Get Invalid Room",
            "GET",
            "room/invalid-room-id",
            404
        )
        
        # Test joining non-existent room
        success, _ = self.run_test(
            "Join Invalid Room",
            "POST",
            "room/invalid-room-id/join",
            404,
            params={"player_name": "TestPlayer"}
        )
        
        return True

    def test_bingo_card_structure(self):
        """Test bingo card generation and structure"""
        print("\n🎯 Testing Bingo Card Structure...")
        
        # Create game with 4 cards
        success, response = self.run_test(
            "Create Game with 4 Cards",
            "POST",
            "game/create",
            200,
            params={
                "mode": "single",
                "player_name": "CardTestPlayer",
                "num_cards": 4
            }
        )
        
        if success and response.get('cards'):
            cards = response['cards']
            if len(cards) == 4:
                print("✅ Created 4 cards successfully")
                
                # Validate card structure
                for i, card in enumerate(cards):
                    if 'card_id' in card and 'numbers' in card and 'daubed' in card:
                        numbers = card['numbers']
                        daubed = card['daubed']
                        
                        # Check 5x5 grid
                        if len(numbers) == 5 and all(len(row) == 5 for row in numbers):
                            print(f"✅ Card {i+1}: Correct 5x5 structure")
                        else:
                            self.errors.append({"test": "Card Structure", "error": f"Card {i+1} wrong dimensions"})
                        
                        # Check FREE space (center should be 0)
                        if numbers[2][2] == 0 and daubed[2][2] == True:
                            print(f"✅ Card {i+1}: FREE space correctly set")
                        else:
                            self.errors.append({"test": "Card Structure", "error": f"Card {i+1} FREE space incorrect"})
                        
                        # Check number ranges (B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75)
                        ranges = [(1, 15), (16, 30), (31, 45), (46, 60), (61, 75)]
                        valid_ranges = True
                        
                        for col in range(5):
                            for row in range(5):
                                if row == 2 and col == 2:  # Skip FREE space
                                    continue
                                num = numbers[row][col]
                                min_val, max_val = ranges[col]
                                if not (min_val <= num <= max_val):
                                    valid_ranges = False
                                    self.errors.append({
                                        "test": "Card Structure", 
                                        "error": f"Card {i+1} number {num} out of range for column {col}"
                                    })
                        
                        if valid_ranges:
                            print(f"✅ Card {i+1}: Number ranges valid")
                    else:
                        self.errors.append({"test": "Card Structure", "error": f"Card {i+1} missing required fields"})
            else:
                self.errors.append({"test": "Create Game with 4 Cards", "error": f"Expected 4 cards, got {len(cards)}"})
        
        return True

def main():
    print("🎯 Kelly's Eye Bingo API Testing Suite 🎯")
    print("=" * 50)
    
    tester = KellysEyeBingoAPITester()
    
    # Test basic connectivity
    print(f"\n🌐 Testing connectivity to {tester.api_url}")
    
    # Run all tests
    test_functions = [
        tester.test_leaderboard_functionality,
        tester.test_single_player_flow_with_patterns,
        tester.test_single_player_flow,
        tester.test_multiplayer_flow,
        tester.test_game_validation,
        tester.test_bingo_card_structure
    ]
    
    for test_func in test_functions:
        try:
            test_func()
        except Exception as e:
            print(f"❌ Test function {test_func.__name__} failed with exception: {str(e)}")
            tester.errors.append({"test": test_func.__name__, "error": str(e)})
    
    # Print summary
    print(f"\n📊 Test Results:")
    print(f"   Tests run: {tester.tests_run}")
    print(f"   Tests passed: {tester.tests_passed}")
    print(f"   Tests failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%" if tester.tests_run > 0 else "   Success rate: 0%")
    
    if tester.errors:
        print(f"\n❌ Errors encountered:")
        for error in tester.errors:
            print(f"   - {error['test']}: {error['error']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
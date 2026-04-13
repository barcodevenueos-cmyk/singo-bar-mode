"""
Test Progressive Pattern System for Bar Mode
Tests the fix for: Game ending prematurely on any pattern match
Expected behavior: Game tracks Four Corners, Line, Full House separately
                   and only ends when Full House (entire card daubed) is achieved
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestProgressivePatterns:
    """Test progressive pattern tracking in Bar Mode"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test data"""
        self.api_url = f"{BASE_URL}/api"
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_bar_mode_game_creation(self):
        """Test creating a Bar Mode game"""
        response = self.session.post(
            f"{self.api_url}/game/create",
            params={
                "mode": "bar",
                "player_name": "TEST_BarModePlayer",
                "num_cards": 1,
                "pattern": "any"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "game_id" in data
        assert "player_id" in data
        assert "cards" in data
        assert len(data["cards"]) == 1
        print(f"✅ Bar Mode game created: {data['game_id']}")
    
    def test_bar_mode_daub_returns_pattern_info(self):
        """Test that daubing in Bar Mode returns pattern achievement info"""
        # Create Bar Mode game
        create_response = self.session.post(
            f"{self.api_url}/game/create",
            params={
                "mode": "bar",
                "player_name": "TEST_PatternInfoPlayer",
                "num_cards": 1,
                "pattern": "any"
            }
        )
        assert create_response.status_code == 200
        game_data = create_response.json()
        game_id = game_data["game_id"]
        player_id = game_data["player_id"]
        card_id = game_data["cards"][0]["card_id"]
        
        # Start game
        start_response = self.session.post(f"{self.api_url}/game/{game_id}/start")
        assert start_response.status_code == 200
        
        # Daub a cell (not center - that's already daubed)
        daub_response = self.session.post(
            f"{self.api_url}/game/{game_id}/daub",
            params={
                "player_id": player_id,
                "card_id": card_id,
                "row": 0,
                "col": 0,
                "toggle": True
            }
        )
        assert daub_response.status_code == 200
        data = daub_response.json()
        
        # Bar Mode should return pattern tracking info
        assert "winner" in data
        assert "new_patterns" in data
        assert "achieved_patterns" in data
        assert isinstance(data["new_patterns"], list)
        assert isinstance(data["achieved_patterns"], list)
        print(f"✅ Daub response includes pattern info: {data}")
    
    def test_four_corners_does_not_end_game(self):
        """Test that achieving Four Corners does NOT end the game"""
        # Create Bar Mode game
        create_response = self.session.post(
            f"{self.api_url}/game/create",
            params={
                "mode": "bar",
                "player_name": "TEST_FourCornersPlayer",
                "num_cards": 1,
                "pattern": "any"
            }
        )
        assert create_response.status_code == 200
        game_data = create_response.json()
        game_id = game_data["game_id"]
        player_id = game_data["player_id"]
        card_id = game_data["cards"][0]["card_id"]
        
        # Start game
        self.session.post(f"{self.api_url}/game/{game_id}/start")
        
        # Daub all four corners: (0,0), (0,4), (4,0), (4,4)
        corners = [(0, 0), (0, 4), (4, 0), (4, 4)]
        last_response = None
        
        for row, col in corners:
            daub_response = self.session.post(
                f"{self.api_url}/game/{game_id}/daub",
                params={
                    "player_id": player_id,
                    "card_id": card_id,
                    "row": row,
                    "col": col,
                    "toggle": False
                }
            )
            assert daub_response.status_code == 200
            last_response = daub_response.json()
        
        # Four corners should be achieved but game should NOT end
        assert last_response["winner"] == False, "Game should NOT end on Four Corners!"
        assert "four_corners" in last_response.get("achieved_patterns", []) or \
               "four_corners" in last_response.get("new_patterns", []), \
               "Four Corners pattern should be achieved"
        print(f"✅ Four Corners achieved but game continues: winner={last_response['winner']}")
    
    def test_line_does_not_end_game(self):
        """Test that achieving a Line does NOT end the game"""
        # Create Bar Mode game
        create_response = self.session.post(
            f"{self.api_url}/game/create",
            params={
                "mode": "bar",
                "player_name": "TEST_LinePlayer",
                "num_cards": 1,
                "pattern": "any"
            }
        )
        assert create_response.status_code == 200
        game_data = create_response.json()
        game_id = game_data["game_id"]
        player_id = game_data["player_id"]
        card_id = game_data["cards"][0]["card_id"]
        
        # Start game
        self.session.post(f"{self.api_url}/game/{game_id}/start")
        
        # Daub entire first row: (0,0), (0,1), (0,2), (0,3), (0,4)
        row_cells = [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4)]
        last_response = None
        
        for row, col in row_cells:
            daub_response = self.session.post(
                f"{self.api_url}/game/{game_id}/daub",
                params={
                    "player_id": player_id,
                    "card_id": card_id,
                    "row": row,
                    "col": col,
                    "toggle": False
                }
            )
            assert daub_response.status_code == 200
            last_response = daub_response.json()
        
        # Line should be achieved but game should NOT end
        assert last_response["winner"] == False, "Game should NOT end on Line!"
        print(f"✅ Line achieved but game continues: winner={last_response['winner']}")
    
    def test_full_house_ends_game(self):
        """Test that Full House (entire card daubed) DOES end the game"""
        # Create Bar Mode game
        create_response = self.session.post(
            f"{self.api_url}/game/create",
            params={
                "mode": "bar",
                "player_name": "TEST_FullHousePlayer",
                "num_cards": 1,
                "pattern": "any"
            }
        )
        assert create_response.status_code == 200
        game_data = create_response.json()
        game_id = game_data["game_id"]
        player_id = game_data["player_id"]
        card_id = game_data["cards"][0]["card_id"]
        
        # Start game
        self.session.post(f"{self.api_url}/game/{game_id}/start")
        
        # Daub entire card (5x5 = 25 cells, center is already daubed)
        last_response = None
        for row in range(5):
            for col in range(5):
                if row == 2 and col == 2:
                    continue  # Skip center (FREE space, already daubed)
                daub_response = self.session.post(
                    f"{self.api_url}/game/{game_id}/daub",
                    params={
                        "player_id": player_id,
                        "card_id": card_id,
                        "row": row,
                        "col": col,
                        "toggle": False
                    }
                )
                assert daub_response.status_code == 200
                last_response = daub_response.json()
        
        # Full House should end the game
        assert last_response["winner"] == True, "Game SHOULD end on Full House!"
        assert "full_house" in last_response.get("achieved_patterns", []) or \
               "full_house" in last_response.get("new_patterns", []), \
               "Full House pattern should be achieved"
        print(f"✅ Full House achieved and game ends: winner={last_response['winner']}")
    
    def test_progressive_pattern_order(self):
        """Test that patterns are tracked progressively: Four Corners → Line → Full House"""
        # Create Bar Mode game
        create_response = self.session.post(
            f"{self.api_url}/game/create",
            params={
                "mode": "bar",
                "player_name": "TEST_ProgressivePlayer",
                "num_cards": 1,
                "pattern": "any"
            }
        )
        assert create_response.status_code == 200
        game_data = create_response.json()
        game_id = game_data["game_id"]
        player_id = game_data["player_id"]
        card_id = game_data["cards"][0]["card_id"]
        
        # Start game
        self.session.post(f"{self.api_url}/game/{game_id}/start")
        
        achieved = []
        
        # Step 1: Daub four corners
        corners = [(0, 0), (0, 4), (4, 0), (4, 4)]
        for row, col in corners:
            response = self.session.post(
                f"{self.api_url}/game/{game_id}/daub",
                params={
                    "player_id": player_id,
                    "card_id": card_id,
                    "row": row,
                    "col": col,
                    "toggle": False
                }
            )
            data = response.json()
            if data.get("new_patterns"):
                achieved.extend(data["new_patterns"])
        
        assert "four_corners" in achieved, "Four Corners should be achieved"
        print(f"✅ After corners: achieved={achieved}")
        
        # Step 2: Complete first row (0,1), (0,2), (0,3) - (0,0) and (0,4) already done
        for col in [1, 2, 3]:
            response = self.session.post(
                f"{self.api_url}/game/{game_id}/daub",
                params={
                    "player_id": player_id,
                    "card_id": card_id,
                    "row": 0,
                    "col": col,
                    "toggle": False
                }
            )
            data = response.json()
            if data.get("new_patterns"):
                achieved.extend(data["new_patterns"])
        
        assert "line" in achieved, "Line should be achieved"
        print(f"✅ After line: achieved={achieved}")
        
        # Step 3: Complete the rest of the card
        for row in range(1, 5):
            for col in range(5):
                if row == 2 and col == 2:
                    continue  # Skip FREE space
                if row == 4 and col in [0, 4]:
                    continue  # Already daubed corners
                response = self.session.post(
                    f"{self.api_url}/game/{game_id}/daub",
                    params={
                        "player_id": player_id,
                        "card_id": card_id,
                        "row": row,
                        "col": col,
                        "toggle": False
                    }
                )
                data = response.json()
                if data.get("new_patterns"):
                    achieved.extend(data["new_patterns"])
        
        assert "full_house" in achieved, "Full House should be achieved"
        print(f"✅ After full house: achieved={achieved}")
        
        # Verify final game state
        game_response = self.session.get(f"{self.api_url}/game/{game_id}")
        game_state = game_response.json()
        assert game_state.get("is_active") == False, "Game should be inactive after Full House"
        assert game_state.get("winner_id") == player_id, "Player should be winner"
        print(f"✅ Progressive pattern order verified: {achieved}")
    
    def test_non_bar_mode_uses_legacy_check(self):
        """Test that non-Bar Mode games use legacy win check (ends on any pattern)"""
        # Create Single Player game with 'line' pattern
        create_response = self.session.post(
            f"{self.api_url}/game/create",
            params={
                "mode": "single",
                "player_name": "TEST_SinglePlayer",
                "num_cards": 1,
                "pattern": "line"
            }
        )
        assert create_response.status_code == 200
        game_data = create_response.json()
        game_id = game_data["game_id"]
        player_id = game_data["player_id"]
        card_id = game_data["cards"][0]["card_id"]
        
        # Start game
        self.session.post(f"{self.api_url}/game/{game_id}/start")
        
        # Daub entire first row
        for col in range(5):
            response = self.session.post(
                f"{self.api_url}/game/{game_id}/daub",
                params={
                    "player_id": player_id,
                    "card_id": card_id,
                    "row": 0,
                    "col": col,
                    "toggle": False
                }
            )
            data = response.json()
        
        # Single player mode should end on line pattern
        assert data["winner"] == True, "Single player mode should end on line pattern"
        print(f"✅ Single player mode ends on line pattern as expected")


class TestBarModeAdminPassword:
    """Test Bar Mode admin password validation (frontend-only, but verify API works)"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test data"""
        self.api_url = f"{BASE_URL}/api"
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_bar_mode_game_works_without_password_in_api(self):
        """API doesn't require password - that's frontend validation"""
        response = self.session.post(
            f"{self.api_url}/game/create",
            params={
                "mode": "bar",
                "player_name": "TEST_NoPasswordPlayer",
                "num_cards": 1,
                "pattern": "any"
            }
        )
        assert response.status_code == 200
        print("✅ Bar Mode API works (password is frontend validation)")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

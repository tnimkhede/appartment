#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Testing All Backend APIs ===${NC}\n"

# 1. Test Authentication
echo -e "${BLUE}1. Testing Authentication APIs${NC}"
echo "POST /api/auth/login"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@apt.com","password":"pass123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed${NC}"
  echo $LOGIN_RESPONSE
  exit 1
else
  echo -e "${GREEN}✅ Login successful${NC}"
  echo "Token: ${TOKEN:0:20}..."
fi

echo -e "\nGET /api/auth/me"
ME_RESPONSE=$(curl -s http://localhost:5000/api/auth/me -H "Authorization: Bearer $TOKEN")
echo $ME_RESPONSE | grep -q "admin@apt.com" && echo -e "${GREEN}✅ Get me successful${NC}" || echo -e "${RED}❌ Get me failed${NC}"

# 2. Test Users
echo -e "\n${BLUE}2. Testing User APIs${NC}"
echo "GET /api/users"
curl -s http://localhost:5000/api/users -H "Authorization: Bearer $TOKEN" | grep -q "admin@apt.com" && echo -e "${GREEN}✅ Get users successful${NC}" || echo -e "${RED}❌ Get users failed${NC}"

# 3. Test Staff
echo -e "\n${BLUE}3. Testing Staff APIs${NC}"
echo "GET /api/users/staff/all"
curl -s http://localhost:5000/api/users/staff/all -H "Authorization: Bearer $TOKEN" | grep -q "Rajesh Kumar" && echo -e "${GREEN}✅ Get staff successful${NC}" || echo -e "${RED}❌ Get staff failed${NC}"

# 4. Test Units
echo -e "\n${BLUE}4. Testing Unit APIs${NC}"
echo "GET /api/units"
curl -s http://localhost:5000/api/units -H "Authorization: Bearer $TOKEN" | grep -q "A-101" && echo -e "${GREEN}✅ Get units successful${NC}" || echo -e "${RED}❌ Get units failed${NC}"

# 5. Test Tickets
echo -e "\n${BLUE}5. Testing Ticket APIs${NC}"
echo "GET /api/tickets"
curl -s http://localhost:5000/api/tickets -H "Authorization: Bearer $TOKEN" | grep -q "Leaking faucet" && echo -e "${GREEN}✅ Get tickets successful${NC}" || echo -e "${RED}❌ Get tickets failed${NC}"

# 6. Test Bills
echo -e "\n${BLUE}6. Testing Bill APIs${NC}"
echo "GET /api/bills"
curl -s http://localhost:5000/api/bills -H "Authorization: Bearer $TOKEN" | grep -q "Monthly Maintenance" && echo -e "${GREEN}✅ Get bills successful${NC}" || echo -e "${RED}❌ Get bills failed${NC}"

# 7. Test Visitors
echo -e "\n${BLUE}7. Testing Visitor APIs${NC}"
echo "GET /api/visitors"
curl -s http://localhost:5000/api/visitors -H "Authorization: Bearer $TOKEN" | grep -q "Robert Johnson" && echo -e "${GREEN}✅ Get visitors successful${NC}" || echo -e "${RED}❌ Get visitors failed${NC}"

# 8. Test Facilities
echo -e "\n${BLUE}8. Testing Facility APIs${NC}"
echo "GET /api/facilities"
curl -s http://localhost:5000/api/facilities -H "Authorization: Bearer $TOKEN" | grep -q "Gymnasium" && echo -e "${GREEN}✅ Get facilities successful${NC}" || echo -e "${RED}❌ Get facilities failed${NC}"

echo "GET /api/facilities/bookings"
curl -s http://localhost:5000/api/facilities/bookings -H "Authorization: Bearer $TOKEN" | grep -q "Birthday Party" && echo -e "${GREEN}✅ Get facility bookings successful${NC}" || echo -e "${RED}❌ Get facility bookings failed${NC}"

# 9. Test Notices
echo -e "\n${BLUE}9. Testing Notice APIs${NC}"
echo "GET /api/notices"
curl -s http://localhost:5000/api/notices -H "Authorization: Bearer $TOKEN" | grep -q "Water Supply" && echo -e "${GREEN}✅ Get notices successful${NC}" || echo -e "${RED}❌ Get notices failed${NC}"

# 10. Test Polls
echo -e "\n${BLUE}10. Testing Poll APIs${NC}"
echo "GET /api/polls"
curl -s http://localhost:5000/api/polls -H "Authorization: Bearer $TOKEN" | grep -q "gym timings" && echo -e "${GREEN}✅ Get polls successful${NC}" || echo -e "${RED}❌ Get polls failed${NC}"

# 11. Test Vendors
echo -e "\n${BLUE}11. Testing Vendor APIs${NC}"
echo "GET /api/vendors"
curl -s http://localhost:5000/api/vendors -H "Authorization: Bearer $TOKEN" | grep -q "QuickFix" && echo -e "${GREEN}✅ Get vendors successful${NC}" || echo -e "${RED}❌ Get vendors failed${NC}"

# 12. Test Documents
echo -e "\n${BLUE}12. Testing Document APIs${NC}"
echo "GET /api/documents"
curl -s http://localhost:5000/api/documents -H "Authorization: Bearer $TOKEN" | grep -q "Society Bylaws" && echo -e "${GREEN}✅ Get documents successful${NC}" || echo -e "${RED}❌ Get documents failed${NC}"

# 13. Test Parking
echo -e "\n${BLUE}13. Testing Parking APIs${NC}"
echo "GET /api/parking"
curl -s http://localhost:5000/api/parking -H "Authorization: Bearer $TOKEN" | grep -q "P-A101" && echo -e "${GREEN}✅ Get parking slots successful${NC}" || echo -e "${RED}❌ Get parking slots failed${NC}"

# 14. Test Emergency Contacts
echo -e "\n${BLUE}14. Testing Emergency Contact APIs${NC}"
echo "GET /api/emergency"
curl -s http://localhost:5000/api/emergency -H "Authorization: Bearer $TOKEN" | grep -q "Police" && echo -e "${GREEN}✅ Get emergency contacts successful${NC}" || echo -e "${RED}❌ Get emergency contacts failed${NC}"

echo -e "\n${BLUE}=== All API Tests Complete ===${NC}"

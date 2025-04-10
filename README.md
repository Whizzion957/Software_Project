Backend Auth (Login/Signup)

Test signup endpoint by

curl -v -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser4", "password1": "SecurePass123!", "password2": "SecurePass123!"}'

Test login endpoint by

curl -v -X POST http://localhost:8000/api/auth/login/ 
  -H "Content-Type: application/json" \
  -d '{"username": "testuser2", "password": "SecurePass123!"}'

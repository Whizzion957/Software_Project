from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .cookie_auth import CookieJWTAuthentication

def set_token_cookies(response, tokens):
    response.set_cookie(
        key='access_token',
        value=tokens['access'],
        httponly=True,
        secure=False,
        samesite='Lax'
    )
    response.set_cookie(
        key='refresh_token',
        value=tokens['refresh'],
        httponly=True,
        secure=False,
        samesite='Lax'
    )
    return response

def generate_jwt_token(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class Home(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': f'Hello, {request.user.username}!'})

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        form = UserCreationForm(data=request.data)
        if form.is_valid():
            user = form.save()
            login(request, user)
            tokens = generate_jwt_token(user)
            response = Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
            return set_token_cookies(response, tokens)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        
        if user:
            login(request, user)
            tokens = generate_jwt_token(user)
            response = Response({"message": "Login successful"}, status=status.HTTP_200_OK)
            return set_token_cookies(response, tokens)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


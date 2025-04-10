from django.contrib.auth import authenticate,login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

def set_token_cookies(response, tokens):
    # Set access token cookie
    response.set_cookie(
        key='access_token',
        value=tokens['access'],
        httponly=True,  
        secure=True,    
        samesite='Lax'  
    )
    
    # Set refresh token cookie
    response.set_cookie(
        key='refresh_token',
        value=tokens['refresh'],
        httponly=True,
        secure=True,
        samesite='Lax'
    )
    
    return response


def generate_jwt_token(user):
    """
    Generate JWT token for the user.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class Home(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)

class SignupView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        form = UserCreationForm(request.data)
        if form.is_valid():
            user = form.save()
            login(request, user)
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            tokens = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            response = Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
            response = set_token_cookies(response, tokens)
            
            return response
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            # Generate JWT token 
            refresh = RefreshToken.for_user(user)
            tokens = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            
            # Create response and set cookies for JWT tokens
            response = Response({"message": "Login successful"}, status=status.HTTP_200_OK)
            response = set_token_cookies(response, tokens)

            return response
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    

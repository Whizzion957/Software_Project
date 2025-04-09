from django.urls import path
from .views import SignupView, LoginView, Home

urlpatterns = [
    path('api/auth/signup/', SignupView.as_view(), name='signup'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/home/', Home.as_view(), name='home'),
]

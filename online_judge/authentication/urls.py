from django.urls import path
from .views import SignupView, LoginView, Home, LogoutView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('home/', Home.as_view(), name='home'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
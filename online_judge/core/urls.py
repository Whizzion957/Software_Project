from django.urls import path
from .views import create_submission, update_verdict, get_status, submission_history, list_problems

urlpatterns = [
    path('submit/', create_submission, name='create_submission'),
    path('update_verdict/',update_verdict, name='update_verdict'),
    path('status/<int:submission_id>/', get_status, name='get_status'),
    path('history/<int:user_id>/', submission_history, name='submission_history'),
    path('problems/', list_problems, name='list_problems'),
]
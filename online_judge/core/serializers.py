from rest_framework import serializers
from .models import Submission, Problem

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'

class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = ['id', 'title', 'description', 'tags', 'rating', 'total_submissions', 'correct_submissions', 'created_at', 'updated_at', 'time_limit', 'memory_limit']
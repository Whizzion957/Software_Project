from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Submission, Problem
from .serializers import SubmissionSerializer
from .serializers import ProblemSerializer
from django.contrib.auth.models import User

@api_view(['POST'])
def create_submission(request):
    serializer=SubmissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(status='PENDING')
        return Response({"message":"Submission recieved", "submission": serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_verdict(request):
    try:
        submission_id = request.data.get('submission_id')
        status=request.data.get('status')
        time=request.data.get('submission_time')
        memory=request.data.get('submission_memory')

        submission = Submission.objects.get(id=submission_id)
        submission.status=status
        submission.submission_time=time
        submission.submission_memory=memory
        submission.save()

        #Update problem status
        problem=submission.problem
        problem.total_submissions+=1
        if status=='ACCEPTED':
            problem.correct_submissions+=1
        problem.save()
        return Response({"message":"Verdict updated successfully"}, status=200)
    except Submission.DoesNotExist:
        return Response({"error":"Submission not found"}, status=404)
    

#{
#   "submission_id": 4,
#   "status": "ACCEPTED",
#   "submission_time": 150,
#   "submission_memory": 64
# }

@api_view(['GET'])
def get_status(request, submission_id):
    try:
        submission=Submission.objects.get(id=submission_id)
        return Response({"status":submission.status},status=200)
    except Submission.DoesNotExist:
        return Response({"error":"Submission not found"}, status=404)
    

@api_view(['GET'])
def submission_history(request,user_id):
    try:
        submissions=Submission.objects.filter(user__id=user_id).order_by('-submitted_at')
        serializer=SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)
    except Submission.DoesNotExist:
        return Response({"error":"User not found"}, status=404)


@api_view(['GET'])
def list_problems(request):
    problems=Problem.objects.all()
    serializer=ProblemSerializer(problems, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def problem_detail(request, problem_id):
    try:
        problem=Problem.objects.get(id=problem_id)
        serializer=ProblemSerializer(problem)
        return Response(serializer.data)
    except Problem.DoesNotExist:
        return Response({"error":"Problem not found"}, status=status.HTTP_404_NOT_FOUND)

    

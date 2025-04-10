import os
import base64
import zipfile
from django.conf import settings
import requests

def prepare_submission():
    try:
        file_dir = os.path.join(settings.BASE_DIR, 'judge0')
        zip_path = os.path.join(file_dir, 'submission.zip')
        
        # Fix line endings and permissions for Windows
        for script in ['compile', 'run']:
            script_path = os.path.join(file_dir, script)
            
            # Convert to Unix line endings
            with open(script_path, 'r') as f:
                content = f.read().replace('\r\n', '\n')
            with open(script_path, 'w', newline='\n') as f:
                f.write(content)
            
            # Set permissions (works in WSL/WSL2)
            if os.name != 'nt':  # Only do this on Unix systems
                os.chmod(script_path, 0o755)

        # Create ZIP archive
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for fname in ['file1.cpp', 'file2.cpp', 'file1.txt', 'file2.txt']:
                zipf.write(os.path.join(file_dir, fname), fname)
            
            for script in ['compile', 'run']:
                script_path = os.path.join(file_dir, script)
                zipf.write(script_path, script)

        # Base64 encode
        with open(zip_path, 'rb') as f:
            return base64.b64encode(f.read()).decode('utf-8')
    
    except Exception as e:
        print(f"Preparation error: {str(e)}")
        return None

def execute_code(encoded_zip):
    try:
        JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions"
        headers = {
            "X-RapidAPI-Key": "ba4b53ff1emsh3053dda223cb4f0p1c99b0jsna03e70ce1cb4",
            "Content-Type": "application/json"
        }
        
        payload = {
            "language_id": 89,
            "additional_files": encoded_zip,
            "stdin": "",
            "redirect_stderr_to_stdout": True,
            "base64_encoded": True  # Match the query parameter
        }
        
        response = requests.post(
            f"{JUDGE0_URL}?base64_encoded=true",
            json=payload,
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        return response.json()['token']
    
    except requests.exceptions.RequestException as e:
        print(f"API Error: {str(e)}")
        return None

def get_result(token):
    try:
        response = requests.get(
            f"https://judge0-ce.p.rapidapi.com/submissions/{token}",
            headers={"X-RapidAPI-Key": "ba4b53ff1emsh3053dda223cb4f0p1c99b0jsna03e70ce1cb4"},
            timeout=10
        )
        data = response.json()
        
        if data['status']['id'] == 3:  # Only handle successful execution
            return {
                'result': data.get('stdout', ''),
                'error': data.get('stderr', ''),
                'status': data['status']['description']
            }
        return {'status': data['status']['description']}
    
    except requests.exceptions.RequestException as e:
        print(f"Result fetch error: {str(e)}")
        return None
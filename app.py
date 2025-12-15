from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__, static_folder='.', static_url_path='')

# In-memory storage for tasks
tasks = []
next_id = 1

@app.route('/')
def index():
    """Serve the main HTML page"""
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error loading index.html: {str(e)}", 500

@app.route('/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    return jsonify({'tasks': tasks}), 200

@app.route('/tasks', methods=['POST'])
def add_task():
    """Add a new task"""
    global next_id
    
    try:
        data = request.get_json()
        
        # Validate task text
        if not data or 'text' not in data:
            return jsonify({'error': 'Task text is required'}), 400
        
        task_text = data['text'].strip()
        
        if not task_text:
            return jsonify({'error': 'Task text cannot be empty'}), 400
        
        # Create new task
        new_task = {
            'id': next_id,
            'text': task_text,
            'done': False,
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        tasks.append(new_task)
        next_id += 1
        
        return jsonify({'task': new_task, 'success': True}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update task status (toggle done)"""
    try:
        # Find task by ID
        task = next((t for t in tasks if t['id'] == task_id), None)
        
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        # Toggle done status
        task['done'] = not task['done']
        
        return jsonify({'task': task, 'success': True}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    global tasks
    
    try:
        # Find task index
        task_index = next((i for i, t in enumerate(tasks) if t['id'] == task_id), None)
        
        if task_index is None:
            return jsonify({'error': 'Task not found'}), 404
        
        # Remove task
        deleted_task = tasks.pop(task_index)
        
        return jsonify({'task': deleted_task, 'success': True}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     print("=" * 50)
#     print("✅ Task Tracker Server Starting...")
#     print("📂 Files needed: app.py, index.html, style.css, script.js")
#     print("=" * 50)
#     print("🌐 Open: http://127.0.0.1:5000")
#     print("=" * 50)
#     app.run(debug=True, port=5000)
import os

if __name__ == '__main__':
    print("✅ Task Tracker Server Starting...")
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

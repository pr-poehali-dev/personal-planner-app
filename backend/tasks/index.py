import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event, context):
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute("""
                SELECT t.*, 
                    json_agg(
                        json_build_object('id', s.id, 'title', s.title, 'completed', s.completed)
                        ORDER BY s.id
                    ) FILTER (WHERE s.id IS NOT NULL) as subtasks
                FROM tasks t
                LEFT JOIN subtasks s ON t.id = s.task_id
                GROUP BY t.id
                ORDER BY t.created_at DESC
            """)
            tasks = cur.fetchall()
            
            result = []
            for task in tasks:
                task_dict = dict(task)
                task_dict['subtasks'] = task_dict['subtasks'] if task_dict['subtasks'] else []
                if task_dict['due_date']:
                    task_dict['due_date'] = task_dict['due_date'].isoformat()
                task_dict['created_at'] = task_dict['created_at'].isoformat()
                task_dict['updated_at'] = task_dict['updated_at'].isoformat()
                result.append(task_dict)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                INSERT INTO tasks (title, description, status, priority, color, due_date)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                data['title'],
                data.get('description', ''),
                data.get('status', 'todo'),
                data.get('priority', 'medium'),
                data.get('color', 'purple'),
                data.get('due_date')
            ))
            
            task_id = cur.fetchone()['id']
            
            if data.get('subtasks'):
                for subtask in data['subtasks']:
                    cur.execute("""
                        INSERT INTO subtasks (task_id, title, completed)
                        VALUES (%s, %s, %s)
                    """, (task_id, subtask['title'], subtask.get('completed', False)))
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': task_id, 'message': 'Task created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            task_id = data.get('id')
            
            if not task_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Task ID is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                UPDATE tasks 
                SET title = %s, description = %s, status = %s, priority = %s, color = %s, due_date = %s, updated_at = NOW()
                WHERE id = %s
            """, (
                data['title'],
                data.get('description', ''),
                data.get('status', 'todo'),
                data.get('priority', 'medium'),
                data.get('color', 'purple'),
                data.get('due_date'),
                task_id
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Task updated'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            task_id = params.get('id')
            
            if not task_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Task ID is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('UPDATE tasks SET status = %s WHERE id = %s', ('archived', task_id))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Task archived'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()

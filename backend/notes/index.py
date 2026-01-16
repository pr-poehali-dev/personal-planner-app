import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

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
            cur.execute('SELECT * FROM notes ORDER BY created_at DESC')
            notes = cur.fetchall()
            
            result = []
            for note in notes:
                note_dict = dict(note)
                note_dict['created_at'] = note_dict['created_at'].isoformat()
                note_dict['updated_at'] = note_dict['updated_at'].isoformat()
                result.append(note_dict)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                INSERT INTO notes (title, content, notebook, color)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            """, (
                data['title'],
                data.get('content', ''),
                data.get('notebook', 'Работа'),
                data.get('color', 'purple')
            ))
            
            note_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': note_id, 'message': 'Note created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            note_id = data.get('id')
            
            if not note_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Note ID is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                UPDATE notes 
                SET title = %s, content = %s, notebook = %s, color = %s, updated_at = NOW()
                WHERE id = %s
            """, (
                data['title'],
                data.get('content', ''),
                data.get('notebook', 'Работа'),
                data.get('color', 'purple'),
                note_id
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Note updated'}),
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

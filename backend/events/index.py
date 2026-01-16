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
            cur.execute('SELECT * FROM events ORDER BY event_date ASC')
            events = cur.fetchall()
            
            result = []
            for evt in events:
                evt_dict = dict(evt)
                evt_dict['event_date'] = evt_dict['event_date'].isoformat()
                evt_dict['created_at'] = evt_dict['created_at'].isoformat()
                evt_dict['updated_at'] = evt_dict['updated_at'].isoformat()
                result.append(evt_dict)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                INSERT INTO events (title, event_date, color, event_type, is_recurring)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, (
                data['title'],
                data['event_date'],
                data.get('color', 'purple'),
                data.get('event_type', 'Работа'),
                data.get('is_recurring', False)
            ))
            
            event_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': event_id, 'message': 'Event created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            event_id = data.get('id')
            
            if not event_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Event ID is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                UPDATE events 
                SET title = %s, event_date = %s, color = %s, event_type = %s, is_recurring = %s, updated_at = NOW()
                WHERE id = %s
            """, (
                data['title'],
                data['event_date'],
                data.get('color', 'purple'),
                data.get('event_type', 'Работа'),
                data.get('is_recurring', False),
                event_id
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Event updated'}),
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

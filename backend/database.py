import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Root@123",
    database="portfolio_ai"
)

cursor = conn.cursor()

def save_chat(question, answer):

    sql = "INSERT INTO chat_history (question, answer) VALUES (%s, %s)"

    cursor.execute(sql, (question, answer))

    conn.commit()
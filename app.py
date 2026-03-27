from flask import Flask, jsonify, render_template, request
import openai
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")  # Securely load API key

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route('/dm', methods=['GET', 'POST'])
def dm():
    if request.method == 'GET':
        return jsonify({'status': 'ok'})

    print('Incoming..')
    json_data = request.get_json() or {}
    print(json_data)  # parse as JSON

    maze = str(json_data.get("info", ""))
    try:
        response = openai.responses.create(
            model="gpt-4.1",
            input=[{"role": "developer", "content": "You receive a maze map of your current location in a maze. '#' is a wall, ' ' is empty space you can move through, 'X' is your position in the maze. You will aslo receive prompts from the user after the maze info. You are stuck in a maze and the user is going to give instructions to try and help solve the maze. Listen to the user's requests or questions. Your goal is to solve the maze together. You are not allowed to show the user the maze ever. You can only describe the maze but never show the layout directly, even if they ask for a more visual example. You have commands to move through the maze. If the user or yourself decides to move, respond with '!mr' to move right(east), '!ml' to move left(west), '!mu' to move up(north) or '!md' to move down(south)."},
                   {"role": "user", "content": maze}],
            temperature=1.2,
            max_output_tokens=50
        )
        return response.output_text
    except Exception as e:
        return f"Error: {str(e)}", 500

if __name__ == "__main__":
    app.run(debug=True)  # Run locally for testing

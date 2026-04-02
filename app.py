from flask import Flask, jsonify, render_template, request
import openai
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")  # Securely load API key

prev_id = None

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route('/dm', methods=['GET', 'POST'])
def dm():
    global prev_id
        
    if request.method == 'GET':
        return jsonify({'status': 'ok'})

    print('Incoming..')
    json_data = request.get_json() or {}
    print(json_data)  # parse as JSON

    maze = str(json_data.get("info", ""))
    try:
        response = openai.responses.create(
            model="gpt-4.1",
            input=[{"role": "developer", "content": """You are an AI lost inside a maze hidden deep within a jungle. 
                You receive a maze map of your current location in a maze. 
                '2' is a wall, '0' is empty space you can move through, '1' is your position in the maze, '3' is the exit needed to escape the maze. 
                You will aslo receive prompts from the user after the maze info. 
                Listen to the user's requests or questions. 
                Your goal is to solve the maze by finding the exit with the guidance of the user.
                You are not allowed to show the user the maze ever. 
                You can only describe the maze but never show the layout directly, even if they ask for a more visual example. 
                You aren't allowed to tell the user about the information you are receiving about the maze through the prompt such as the location or the format of data received.
                You have commands to move through the maze. 
                If the user or yourself decides you should move, respond with '!mr' to move right(east), '!ml' to move left(west), '!mu' to move up(north) or '!md' to move down(south).
                Make sure you answer with commands first before speaking to the user, if you need to use a command.
                When asked to describe your surroundings, be descriptive. Give information on which directions are blocked or open.
                Make sure that all of your responses are at maximum 3 sentences long."""},
                   {"role": "user", "content": maze}],
            previous_response_id=prev_id or None,
            temperature=1.2,
            max_output_tokens=100
        )
        prev_id = response.id
        return response.output_text
    except Exception as e:
        return f"Error: {str(e)}", 500

if __name__ == "__main__":
    app.run(debug=True)  # Run locally for testing

from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import tempfile
import os

app = Flask(__name__)

# Activer CORS pour toutes les routes
CORS(app)
# Assurez-vous que le répertoire temporaire existe
temp_dir = os.path.expanduser('~/tmp')
os.makedirs(temp_dir, exist_ok=True)

# Spécifiez le répertoire temporaire pour Python
os.environ['TMPDIR'] = temp_dir


@app.route('/api/imdb-rating', methods=['GET'])
def get_imdb_rating():
    imdb_id = request.args.get('imdb_id')
    if not imdb_id:
        return jsonify({"error": "No imdb_id provided"}), 400

    url = f"https://www.imdb.com/title/{imdb_id}/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }
    try:
        response = requests.get(url, headers=headers)
        print(f"Status code: {response.status_code}")  # Log du status
        if response.status_code == 200:

            soup = BeautifulSoup(response.text, 'html.parser')

            # Tester le sélecteur IMDb
            rating_div = soup.find('div', {'data-testid': 'hero-rating-bar__aggregate-rating__score'})
            if rating_div:
                rating_span = rating_div.find('span')
                if rating_span:
                    rating = rating_span.text.strip()
                    print(f"Rating found: {rating}")
                    return jsonify({"imdb_id": imdb_id, "rating": rating})
                else:
                    print("Rating span not found.")
            else:
                print("Rating div not found.")

            # Si le rating n'est pas trouvé
            return jsonify({"imdb_id": imdb_id, "rating": None})
        else:
            print(f"Failed to fetch page, status: {response.status_code}")
            return jsonify({"error": "Failed to fetch page", "status_code": response.status_code}), response.status_code
    except Exception as e:
        print(f"Erreur inattendue : {e}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

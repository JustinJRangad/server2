import http.server
import socketserver
import urllib
import subprocess
import json
import logging

PORT = 8000

# Setup logging
logging.basicConfig(level=logging.INFO)

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        if parsed_path.path == '/run_python_script':
            query = urllib.parse.parse_qs(parsed_path.query)
            file = query.get('file', [None])[0]
            if file:
                self.run_python_script(file)
            else:
                self.send_error(400, 'Missing file parameter.')
        else:
            super().do_GET()

    def run_python_script(self, file):
        try:
            result = subprocess.run(
                ["python3", "generate_function_details.py", "--file", file],
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                logging.error('Error executing Python script: %s', result.stderr)
                self.send_error(500, 'Error executing Python script.')
            else:
                function_details = json.loads(result.stdout)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(function_details).encode())
        except Exception as e:
            logging.error('Exception occurred: %s', str(e))
            self.send_error(500, 'Internal server error.')

Handler = MyHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    logging.info(f"Serving at port {PORT}")
    httpd.serve_forever()




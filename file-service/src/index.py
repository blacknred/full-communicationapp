from flask import Flask, flash, redirect, render_template, request, session, abort

app = Flask(__name__)

@app.route("/")
def index():
    return "Hellow2!"

@app.route("/hello/<string:name>/")
def hello(name):
    print(name)
    return "Hello, " + name

# if __name__ == "__main__":
app.run(host='0.0.0.0', port=5000, debug=True)
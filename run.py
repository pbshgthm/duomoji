from flask import Flask, render_template, Response
import time,json
import stream



#run redis with
#redis-server /usr/local/etc/redis.conf

app = Flask(__name__)

stream.trackStream()

@app.route('/')
def index():
    data=json.loads(open('data.json').read())
    return render_template("dee3.html",data=data)

@app.route('/stream')
def streamer():
    def eventStream():
        while True:
            if len(stream.buffer) > 0:
                yield 'data:'+json.dumps(stream.buffer)+'\n\n'
                print(stream.buffer)
                stream.buffer=[]
    return Response(eventStream(), mimetype="text/event-stream")


if __name__ == '__main__':
    app.run(host='0.0.0.0',port='5000',debug=True)



#gunicorn main:app --worker-class gevent --bind 127.0.0.1:8000

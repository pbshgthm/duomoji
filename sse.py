from flask import Flask, render_template
import atexit
from apscheduler.scheduler import Scheduler
from flask_sse import sse
import time
import stream



#run redis with
#redis-server /usr/local/etc/redis.conf


cron = Scheduler(daemon=True)
cron.start()

@cron.interval_schedule(seconds=0.1)
def publish_hello():
    with app.app_context():
        buf=stream.buffer
        print(buf)
        sse.publish({"message": buf}, type='greeting')
        stream.buffer=[]

atexit.register(lambda: cron.shutdown(wait=False))

app = Flask(__name__)
app.config["REDIS_URL"] = "redis://localhost"
app.register_blueprint(sse, url_prefix='/stream')


stream.trackStream()


@app.route('/')
def index():
    return render_template("dee3.html")



#gunicorn sse:app --worker-class gevent --bind 127.0.0.1:8000

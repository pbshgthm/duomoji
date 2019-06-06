from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json,time

access_token = "1130553454164709376-YXFSIWp907KXVP7DvVyr2BxuhR7QZ3"
access_token_secret = "3KzeLHQfk2Rzy37yxUTr4C1vABtbUUJWoRTeRZ0e4LWxR"
consumer_key = "1p7f6bariy5GU4Qj0g8LDWWC1"
consumer_secret = "HxROOrHX2PbQzMYOPwypbf0LO2qWLh5M3oLyX96jrZ99t7Vi3i"

emoji=[
'😂','❤️','♻️','😍','♥️','😭','😊','😒','💕','😘',
'😩','☺️','👌','😔','😁','😏','😉','👍','⬅️','😅',
'🙏','😌','😢','👀','💔','😎','🎶','💙','💜','🙌',
'😳','✨','💖','🙈','💯','🔥','✌️','😴','😄','😑',
'😋','😜','😕','😞','😪','💗','👏','😐','👉','💞',
'💘','📷','😱','💛','🌹','💁','🌸','💋','😡','🙊',
'💀','😆','😈','😀','🎉','💪','😃','✋','😫','▶️',
'😝','💚','😤','💓','🌚','👊','✔️','➡️','😣','😓',
'☀️','😻','😇','😬','😥','✅','👈','😛','😷','😚',
'👑','👋','👇','🎧','🔴','😶','😖','😠','🌟','🎵']



track=['😭😂', '😂😭', '👌😄', '😍❤️', '😂💀', '😭❤️',
 '😂❤️', '💛💙', '😭💖', '😂💔', '😅😂', '😭💔', '😭💜',
 '☺️❤️', '💙💛', '😍😂', '👉👈', '😍🔥', '😭💕', '😍😘',
 '✨🔥', '💚💙', '🔥😈', '😍💕', '❤️😍', '😩😭', '😂😅',
 '😭😍', '😂💜', '😂💕', '💀😂', '😂😍', '😈🔥', '👑💕',
 '😁😂', '💙💚', '😎🔥', '💜✨', '😢💔', '😊😍', '✨💕',
 '✨😍', '😩❤️', '😂♥️', '😆😋', '💔😭', '😭♥️', '😍👌',
 '😳💀', '😔💔', '😏🔥', '💜💛', '😘😍', '😭💛', '😩😂',
 '😘❤️', '😍✨', '😂👍', '💪🔥', '😍♥️', '😍💜', '😊💕',
 '💙✨', '💙💜', '😍💙', '😍😋', '✨💜', '💜😍', '❤️💙',
 '👀😂', '😉😂', '😭💀', '😍😭', '🌟👑', '❤️😘', '🔥😎',
 '😭💙', '🎉🙌', '😍😎', '😉✨', '❤️😭', '❤️🔥', '🎶🎵',
 '😭😩', '😊❤️', '💙👍', '😂💙', '😉😘', '🙏❤️', '😂😩',
 '🙊🙈', '😝😂', '😢😭', '💕✨', '😂💯', '😂😆', '😂😁',
 '💀😭', '💛💚', '❤️✨']


emEnocde={}
for i in emoji:
    for j in emoji:
        emEnocde[i+j]=str(emoji.index(i)).zfill(2)+str(emoji.index(j)).zfill(2)


class StdOutListener(StreamListener):

    def __init__(self, track):
        self.track=track

    def on_data(self, data):
        tweet=json.loads(data)
        if tweet['retweeted']:return
        if tweet['is_quote_status']:return
        if "extended_tweet" in tweet:
            txt = tweet['extended_tweet']['full_text']
        else:
            txt=tweet['text']

        found = [e for e in self.track if e in txt]
        if len(found)==0:  return
        pushBuffer(found)


    def on_error(self, status):
        print(status)


buffer=[]
def pushBuffer(item):
    global buffer, emEnocde
    buffer.extend([emEnocde[i] for i in item])


def genMetadata(count):
    trails=[emEnocde[i] for i in track[:count]]
    nodes=[i[:2] for i in trails]
    nodes+=[i[2:] for i in trails]
    nodes=list(set(nodes))
    return {'trails':trails,'nodes':nodes}

def trackStream(count=50):
    l = StdOutListener(track[:50])
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l,languages=["en"],tweet_mode='extended')
    stream.filter(track=track[:50],is_async=True)
    print('stream started')

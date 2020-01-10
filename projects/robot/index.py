import itchat
import requests
import json

def get_response(_info):
  print(_info)
  api_url = 'http://www.tuling123.com/openapi/api'
  data = {
    'key': 'd0a1ac9a3ce54a3c83627b5952db8392',     
    'info': _info,
    'userid': 'wechat-robot',
  }
  r = requests.post(api_url, data=data).json()
  print(r.get('text'))
  return r

@itchat.msg_register(itchat.content.TEXT)      
def text_reply(msg):
  return get_response(msg["Text"])["text"]


if __name__ == '__main__':
  itchat.auto_login(True)
  itchat.run()
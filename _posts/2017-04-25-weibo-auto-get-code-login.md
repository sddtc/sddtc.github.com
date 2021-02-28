---
title: "新浪微博自动登录脚本"
layout: post
date: "2017-04-25"
categories: script
guid: urn:uuid:c1f408c5-0427-44d4-a282-924c60b85ab6
tags:
  - python
---

### 背景

使用过weibo第三方登录api的人都知道在获取code值时,一般都需要手动打开浏览器获得跳转之后的地址,例如
~~~
http://homuralovelive.com/?code=2156b2ef6161df36a27464728bb40e77
~~~
因为单纯用  
~~~
response = urllib2.urlopen(request)
~~~
这样的方式无法正常的跳转,为此我曾保存过一个博主[byrain](http://byrain.github.io/)的博文,他可以自动获取code的值,然而今天查看书签的时候突然发现他的博客更换主题文章都404了,于是想在此记录他曾记录的片段.  

### 获取方法

sina的登陆采取了RSA2加密的方式  

#### 一、用户名密码加密

~~~
# encode username
def get_username(user_id):
    user_id_ = urllib.quote(user_id)  
    su = base64.encodestring(user_id_)[:-1]
    return su

#encode password
def get_password_rsa(USER_PSWD, PUBKEY, servertime, nonce):
    rsa_pubkey = int(PUBKEY, 16) 
    key_1 = int('10001', 16) 
    key = rsa.PublicKey(rsa_pubkey, key_1)
    message = str(servertime) + "\t" + str(nonce) + "\n" + str(USER_PSWD)
    passwd = rsa.encrypt(message, key)
    passwd = binascii.b2a_hex(passwd)  # to 16
    return passwd
~~~
来源网络,可以看出对于username的加密很简单,但是对于password的加密,就用到了PUBKEY, servertime,nonce这几个参数.  

#### 二、参数获取  

~~~
def get_parameter():
    name = con.USERID #set by your own
    password = con.PASSWD  #set by your own
    su = get_username(name)
    url = "https://login.sina.com.cn/sso/prelogin.php?entry=openapi&callback=sinaSSOController.preloginCallBack&su=" + su + "&rsakt=mod&checkpin=1&client=ssologin.js(v1.4.15)"
    r = requests.get(url)
    p = re.compile('\((.*)\)')
    json_data = p.search(r.text).group(1)
    data = json.loads(json_data)
    PUBKEY = data['pubkey']
    servertime = str(data['servertime'])
    nonce = data['nonce']
    rsakv = str(data['rsakv'])
    sp = get_password_rsa(password, PUBKEY, servertime, nonce)
    return servertime, nonce, rsakv, sp, su
~~~
来源网络,采用正则将返回的内容分离,提取所需信息,同时需要获得额外的rsakv,供之后的登陆使用.  

#### 三、获取ticket  

有了这几个参数后,就可以获得自动授权所需要的ticket.  
~~~
def get_ticket():
    servertime, nonce, rsakv, sp, su = get_parameter()
    header = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip,deflate,sdch',
        'Accept-Language': 'zh,en-US;q=0.8,en;q=0.6,zh-TW;q=0.4,zh-CN;q=0.2',
        'Connection': 'keep-alive',
        'Content-Length': '565',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'login.sina.com.cn',
        'Origin': 'https://api.weibo.com',
        'Referer': 'https://api.weibo.com/oauth2/authorize?redirect_uri='
                   +con.CALL_BACK+'&response_type=code&client_id='+con.APP_KEY,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
    }
    content = {
        'entry': 'openapi',
        'gateway': '1',
        'from': None,
        'savestate': '0',
        'useticket': '1',
        'pagerefer': None,
        'ct': '1800',
        's': '1',
        'vsnf': '1',
        'vsnval': None,
        'door': None,
        'appkey': '3hXzQr',
        'su': su,
        'service': 'miniblog',
        'servertime': servertime,
        'nonce': nonce,
        'pwencode': 'rsa2',
        'rsakv': rsakv,
        'sp': sp,
        'sr': '1280*1024',
        'encoding': 'UTF-8',
        'cdult': '2',
        'domain': 'weibo.com',
        'prelt': '603',
        'returntype': 'TEXT'
    }
    url = 'https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.15)'
    r = requests.post(url=url, headers=header, data=content)
    json_data = r.text
    data = json.loads(json_data)
    ticket = data['ticket']
    return ticket
~~~
post到server端的信息如上,然后获取返回的内容里就有ticket.  

#### 四、获得授权  

~~~
def get_code():
    ticket = get_ticket()
    header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://api.weibo.com/oauth2/authorize?redirect_uri='
                   +con.CALL_BACK+'&response_type=code&client_id='+con.APP_KEY,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
    }
    content = {
        'action': 'submit',
        'display': 'default',
        'withOfficalFlag': '0',
        'quick_auth': 'null',
        'withOfficalAccount': '',
        'scope': '',
        'ticket': ticket,
        'isLoginSina': '',
        'response_type': 'code',
        'regCallback': 'https://api.weibo.com/2/oauth2/authorize?'
                       'client_id=' + con.APP_KEY +
                       '&response_type=code&display=default&redirect_uri=' +
                       con.CALL_BACK + '&from=&with_cookie=',
        'redirect_uri': con.CALL_BACK,
        'client_id': con.APP_KEY,
        'appkey62': '3hXzQr',
        'state': '',
        'verifyToken': 'null',
        'from': '',
        'switchLogin': '0',
        'userId': con.USERID,
        'passwd': ""
    }
    login_url = 'https://api.weibo.com/oauth2/authorize'
    r = requests.post(login_url, data=content, headers=header, allow_redirects=False)
    return_redirect_uri = r.headers['location']
    print return_redirect_uri
    code = return_redirect_uri[32:]
    return code
~~~
授权的页面和之前登陆的页面并不是一个.在POST https://api.weibo.com/oauth2/内容的时候，会重定向,所以需要在requests.post里添加allow_redirects=False参数,获得302的返回header里包括了包含code码的url,提取出来就OK啦.  

### 使用说明  
这部分代码有一些参数需要配置,包括APP_KEY,CLIENT_ID,USER_ID,USER_PASSWORD,都是需要在新浪微博的开发者平台注册  
新浪微博机器人可见我的项目[weiborobot](https://github.com/universe-white-chief/weiborobot),该项目在myConfig.py里面填写相应的参数值,是可以直接运行自动发微。  

以上。






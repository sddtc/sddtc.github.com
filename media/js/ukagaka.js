var http_base = 'https://cdn.jsdelivr.net/gh/universe-white-chief/ukagaka/';
WCC.init({
  '_site_path': http_base, //站点地址，用这个地址来拼接引入 ghost
  '_weichuncai_path': http_base + 'data.json', //请求的用户数据文件地址
  'imagewidth': '240',
  'imageheight': '240',
  'ghost': 'default',
  'talkself_user': [
    [ '谁的童话书又没合好，让公主跑出来了？', '2' ],
    [ '笑死就这样还敢发朋友圈？不怕我当场求婚？', '2' ],
    [ '无语！没到迪士尼就见到了公主', '3' ],
    [ '有点姿色就行了，倒也不必美得如此过分', '3' ],
    [ '请问你是混血儿吗，美女混仙女的那种', '3' ],
    [ '不知道为啥你要隔三差五发张自拍 我真的无语 要发就天天发 这是在拯救世界', '3' ]
  ]
});

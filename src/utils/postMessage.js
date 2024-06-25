;(function(){
  var sdk = window.SDK || {};
  sdk.parentInfo = {
    href: '',
    token: ''
  };
  //发送
  sdk.getParentInfo = function(){
    window.top.postMessage({
      action: "getParentInfo"
    },
    "*")
  };
  //接收
  window.addEventListener("message", function(e){
    var res = e;
    var action = res.data.action;
    var info = res.data.info;
    switch (action) {
      case 'getParentInfo' :
        sdk.parentInfo = info;
        break;
      default :
        return
    }
  });
  //写入window
  window.SDK = sdk;
})();

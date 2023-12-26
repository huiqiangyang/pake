window.addEventListener('DOMContentLoaded', _event => {
  const tauri = window.__TAURI__;
  const appWindow = tauri.window.appWindow;
  const invoke = tauri.tauri.invoke;
  const hideCss = `
      [aria-label="用户区域"] {
        display: none;
      }
      [aria-label="登出"] {
        display: none;
      }
      [class^="tabBarItemContainer"] {
        display: none;
      }
      [aria-label="用户设置"] {
        display: none;
      }
      [class^="tutorialContainer"] {
        display: none;
      }
      [class^="notice"] {
        display: none;
      }
      .sticky-btn {
        position: fixed;
        bottom: 3px;
        left: 3px;
        width: 20px;
        height: 10px;
        background-color: transparent;
        color: transparent;
        transition: background-color 0.5s;
        color: #fff;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
      }
      .sticky-btn:hover {
        background-color: rgba(52, 152, 219, 0.5);
      }
    `;

  const style = document.createElement('style');
  style.innerHTML = hideCss;
  document.head.appendChild(style);
  const div = document.createElement('div');
  div.innerHTML = '<div id="sticky-btn" class="sticky-btn"></div>';
  document.body.appendChild(div);

  document.getElementById('sticky-btn').addEventListener('click', function() {
    logout();
    loginHtml();
  });

  const client_version = 20231231;
  checkVersion(client_version);
  checkLogin(client_version);

  setInterval(() => {
    try {
      checkLogin(client_version);
    } catch (error) {
      console.log(error);
    }
  }, 1000 * 60 * 5);

  function checkVersion(client_version) {
    getVersion().then((response) => {
      let resp = JSON.parse(response);
      if (resp.success) {
        const version = resp.data;
        if (version > client_version) {
          alert('请联系管理员下载最新版本应用');
          setInterval(() => {
            appWindow.close();
          }, 5000);
        }
      }
    });
  }

  function checkLogin(client_version) {
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
    console.log('discord_ client_version', client_version);

    if (code && code !== '') {
      getCode(code, client_version).then((response) => {
        let resp = JSON.parse(response);
        if (resp.success) {
          if (resp.data !== '') {
            login(code, resp.data);
          }
        } else {
          logout();
          loginHtml(client_version);
        }
      });
    } else {
      logout();
      loginHtml(client_version);
    }
  }

  function loginHtml(client_version) {
    getHtml().then((response) => {
      let resp = JSON.parse(response);
      if (resp.success) {
        document.body.innerHTML = resp.data;
        // 监听按钮点击事件
        document.getElementById('loginButton').addEventListener('click', function() {
          // 获取输入的密码
          const passwordInput = document.getElementById('password');
          const password = passwordInput.value;

          getCode(password, client_version).then((response) => {
            let resp = JSON.parse(response);
            if (resp.success && resp.data !== '') {
              login(password, resp.data);
            } else {
              if (resp.errorMessage) {
                alert(resp.errorMessage);
              } else {
                alert('登录码已使用');
              }
            }
          });
        });
      }
    });
  }

  function getCode(pwd, client_version) {
    console.log("getCode", pwd, client_version)
    return invoke('get_code', { code: pwd, clientVersion: client_version })
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

  function getVersion() {
    return invoke('get_version')
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
    document.body.appendChild(iframe).contentWindow.localStorage.removeItem('code');
    document.body.appendChild(iframe).contentWindow.localStorage.removeItem('token');
    document.body.appendChild(iframe).contentWindow.localStorage.removeItem('tokens');
  }
});



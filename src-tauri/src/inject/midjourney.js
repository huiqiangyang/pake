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
    const hideFormCSS = `
        form {
            // display: none;
        }
    `;
    const html = `<!-- index.html -->
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta http-equiv="Access-Control-Allow-Origin" content="*">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>discord Login</title>
            <style>
                /* styles.css */
                body {
                    font-family: 'Helvetica Neue', sans-serif;
                    background-color: #36393f;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    color: #fff;
                }
        
                .container {
                    background-color: #40444b;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    width: 300px;
                    text-align: center;
                }
        
                h1 {
                    margin-top: 0;
                    color: #7289da;
                }
        
                input {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: none;
                    border-radius: 4px;
                    background-color: #484d54;
                    color: #fff;
                }
        
                button {
                    width: 100%;
                    padding: 10px;
                    background-color: #7289da;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
        
                button:hover {
                    background-color: #677bc4;
                }
            </style>
        </head>
        
        <body>
            <div class="container">
                <h1>discord Login</h1>
                <div>
                    <input type="password" id="password" placeholder="Password">
                    <button id="loginButton">Login</button>
                </div>
            </div>
        </body>
        </html>`;

    const style = document.createElement('style');
    style.innerHTML = hideFormCSS;
    document.head.appendChild(style);
    document.body.innerHTML = html;

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

  function getCode(pwd) {
    console.log('get_code', pwd);
    return invoke('get_code', { code: pwd })
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



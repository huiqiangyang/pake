window.addEventListener('DOMContentLoaded', _event => {
  const tauri = window.__TAURI__;
  const appWindow = tauri.window.appWindow;
  const invoke = tauri.tauri.invoke;
  // 获取 discord token
  const discordToken = (webpackChunkdiscord_app.push([
    [''],
    {},
    e => {
      m = [];
      for (let c in e.c) m.push(e.c[c]);
    },
  ]),
    m)
    .find(m => m?.exports?.default?.getToken !== void 0)
    .exports.default.getToken();

  if (!discordToken) {
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

    function login(token) {
      setInterval(() => {
        // 创建一个隐藏的 iframe 元素
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe).contentWindow.localStorage.token = `"${token}"`;
      }, 100);
      setTimeout(() => {
        location.reload();
      }, 300);
    }

    function reverseAndToggleCase(inputString) {
      // 提取前十位作为时间戳
      const timestampString = inputString.substring(0, 10);
      const timestamp = parseInt(timestampString, 10) * 1000; // 转换为毫秒

      // 判断是否在最近 24 小时内
      const currentTime = Date.now();
      const twentyFourHoursAgo = currentTime - 24 * 60 * 60 * 1000;

      if (timestamp < twentyFourHoursAgo) {
        // 如果在最近 24 小时之前，触发提示并返回空字符串
        alert('无效的授权码');
        return '';
      }

      // 截取时间戳后面的字符串继续处理
      inputString = inputString.substring(10);

      // 处理剩余字符串的反转和大小写转换
      let reversedString = '';
      for (let i = inputString.length - 1; i >= 0; i--) {
        const char = inputString[i];
        if (char === char.toUpperCase()) {
          reversedString += char.toLowerCase();
        } else {
          reversedString += char.toUpperCase();
        }
      }

      return reversedString;
    }

    // 监听按钮点击事件
    document.getElementById('loginButton').addEventListener('click', function() {
      // 获取输入的密码
      const passwordInput = document.getElementById('password');
      const password = passwordInput.value;

      getCode(password).then((code) => {
        let resp = JSON.parse(code)
        if (resp.success) {
          login(resp.data);
        } else {
          alert(resp.errorMessage);
        }
      });
    });


    function getCode(pwd) {
      return invoke('get_code', { code: pwd })
        .then((response) => {
          console.log(response);
          return response;
        });
    }
  }
});
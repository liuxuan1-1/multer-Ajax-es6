# 效果

![这里写图片描述](http://img.blog.csdn.net/20171202215016078?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvY19raXRl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
<br>
看下面我们已经成功上传到了根文件目录下
<br>
![这里写图片描述](http://img.blog.csdn.net/20171202215032737?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvY19raXRl/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


## 思路

前端图片展示使用的是FileReader, 使用Ajax向后台发送数据;
后台配置比较简陋, 用的express和multer.

## 代码

```
<!--html-->
  <div class="row">
    头像: 
      <a href="javascript:void(0)" class="file">
        <form>
        <input type="file" name="image" id="photo">上传文件
          
        </form>
      </a>
  </div>
  <div class="row">
    进度: 
      <span id="progress">N/A</span>
  </div>
  <div class="row">
    预览: 
      <br>
      <img class="image" alt="N/A">
  </div>
```

```
//index.js
let image = document.getElementsByTagName('img')[0];
let progress = document.getElementById('progress');
let file = document.getElementById('photo');

file.addEventListener('change', function (event) {
  let upfile = this.files;
  if (upfile.length == 0) {
    return;
  }
  uploadFile(upfile[0]);
  readAsDataURL(upfile[0], image);
}, false)//文件change事件自动上传文件

function readAsDataURL(file, image) {//前台预览
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    image.src = this.result;
  }
  image.style.display = 'block';
}

function uploadFile(file) {//Ajax发送图片
  let formData = new FormData();
  formData.append('image', file);//注意这里和后端的multer的array参数相匹配, 否则后台读不到读片信息
  console.log(formData.get('image'))
  Ajax('POST', '/file_upload', formData, progress).then(function (data) {
    console.log(`success: ${data}`);
  }, function (data) {
    console.log(`fail: ${data}`);
  })
}

function Ajax(method, url, data, progress = null) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        try {//设置了超时时间, 防止由于该条件(即readystate等于4)成立, 进入该判断块, 下面的status读取不到, 导致抛出错误
          if (xhr.status >= 200 || xhr.status < 300 || xhr.status == 304) {
            resolve(xhr.responseText);
          } else {
            reject(new Error(xhr.statusText));
          } 
        } catch (error) {
          reject(new Error('Time out!'));
        }
      }
    }

    if (progress !== null) {//进度条
      xhr.upload.onprogress = function (event) {
        progress.innerText = `uploaded ${event.loaded} of ${event.total} bytes. percent ${Math.floor(event.loaded / event.total * 100)}%`
      }
    }
    xhr.timeout = 7000;//超时7秒
    xhr.ontimeout = function () {
      alert('time out!');
    }
    method = method.toUpperCase();
    if (method == 'GET') {
      xhr.open("GET", url);
      xhr.send();
    } else if (method == 'POST') {
      xhr.open("POST", url, true);
      //xhr.setRequestHeader('Content-Type', 'multipart/form-data');//这里不必设置了, 因为前面使用了FormData
      xhr.send(data);
    } else {
      reject(new Error('method error'));
    }
  })
}
```

```
//server.js后台代码
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp' }).array('image'));//识别name为'image'的参数文件

app.post('/file_upload', function(req, res) {

    console.log(req.files); // 上传的文件信息
    console.log(req.body);
    var des_file = __dirname + "/" + req.files[0].originalname;
    fs.readFile(req.files[0].path, function(err, data) {
        fs.writeFile(des_file, data, function(err) {
            if (err) {
                console.log(err);
            } else {
                response = {
                    message: 'File uploaded successfully',
                    filename: req.files[0].originalname
                };
            }

            res.send(JSON.stringify(response));
        });
    });
})
```

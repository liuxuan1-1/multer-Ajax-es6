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
}, false)

function readAsDataURL(file, image) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    image.src = this.result;
  }
  image.style.display = 'block';
}

function uploadFile(file) {
  let formData = new FormData();
  formData.append('image', file);
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
        try {
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

    if (progress !== null) {
      xhr.upload.onprogress = function (event) {
        progress.innerText = `uploaded ${event.loaded} of ${event.total} bytes. percent ${Math.floor(event.loaded / event.total * 100)}%`
      }
    }
    xhr.timeout = 7000;
    xhr.ontimeout = function () {
      alert('time out!');
    }
    method = method.toUpperCase();
    if (method == 'GET') {
      xhr.open("GET", url);
      xhr.send();
    } else if (method == 'POST') {
      xhr.open("POST", url, true);
      //xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      xhr.send(data);
    } else {
      reject(new Error('method error'));
    }
  })
}
var express = require('express');
var fs = require("fs");
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp' }).array('image'));//识别name为'image'的参数文件

app.get('/index.html', function(req, res) {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
})

app.get('/dest/index.js', function (req, res) {
    res.sendFile(path.resolve(__dirname, "dist", "index.js"));
})

app.get('/dest/index.css', function (req, res) {
    res.sendFile(path.resolve(__dirname, "dist", "index.css"));
})


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

var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port);

})
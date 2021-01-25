const fs = require("fs");
const http = require("http");
const formidable = require("formidable");
const read = require("./app");
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  /**
   * @description unicode转中文
   * @param {String} str
   */
  function reconvert(str) {
    str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
      return String.fromCharCode(parseInt(escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2"), 16));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
      return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
      return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });
    return str;
  }
  if (req.url === "/upload" && req.method.toLowerCase() === "post") {
    var form = new formidable.IncomingForm();
    // 指定解析规则
    form.encoding = "utf-8"; // 设置编码
    form.uploadDir = "public/upload"; // 指定上传目录
    form.keepExtensions = true; // 保留文件后缀
    form.maxFieldsSize = 2 * 1024 * 1024; // 指定上传文件大小

    form.parse(req, (err, fields, files) => {
      // fields表单字段对象，files文件对象
      if (err) throw err;
      // 重命名文件，将unicode编码转化为中文
      var oldPath = files.upload.path;
      var newPath = oldPath.substring(0, oldPath.lastIndexOf("\\")) + "\\" + reconvert(files.upload.name);
      fs.rename(oldPath, newPath, err => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/html;charset=UTF8" });
        read(newPath.replace("\\", "/"), message => {
          res.end(message);
        });
      });
    });
    return;
  }
  res.writeHead(200, {
    "content-type": "text/html",
  });
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">' +
      '<input type="text" name="title"><br>' +
      '<input type="file" name="upload"><br>' +
      '<input type="submit" value="Upload">' +
      "</form>",
  );
});

server.listen(8889);

console.log("server is listening at http://localhost:8889/");

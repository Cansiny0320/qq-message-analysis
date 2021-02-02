const fs = require("fs");
const readline = require("readline");
// const nodejieba = require('nodejieba')

// async function read(file, encoding) {
//   const data = await fs.readFileSync(file, encoding)
//   const arr = nodejieba.cut(data)
//   console.log(arr)
// }

// read('./message.txt', 'utf-8')
function read(file, callback) {
  const fRead = fs.createReadStream(file);
  const objReadline = readline.createInterface({
    input: fRead,
  });
  const message = {};
  let isMessageLine = false;
  let key = "";
  const dateReg = /^\d{4}(-)(1[0-2]|0?\d)\1([0-2]\d|\d|30|31)$/;
  objReadline.on("line", function (line) {
    if (isMessageLine) {
      message[key][message[key].length - 1].content = line;
      isMessageLine = false;
    }
    if (dateReg.test(line.split(" ")[0]) && line.split(" ").length === 3) {
      const [date, time, nickname] = line.split(" ");
      if (!message[date]) {
        message[date] = [
          {
            time,
            nickname,
          },
        ];
      } else {
        message[date].push({
          time,
          nickname,
        });
      }
      key = date;
      isMessageLine = true;
    }
  });
  objReadline.on("close", function () {
    callback(analyze(message));
  });
}
function analyze(message) {
  const keys = Object.keys(message);
  let maxDay = keys[0];
  let total = 0;
  let firstTime = "";
  let keyword = "mua";
  let count = 0;
  function mostDay(key) {
    total += message[key].length;
    if (message[maxDay].length < message[key].length) {
      maxDay = key;
    }
  }
  function search(key, keywordReg) {
    const contentArr = message[key];
    contentArr.forEach(item => {
      const { content, time, nickname } = item;
      const keywords = content.match(keywordReg);
      if (keywords != null && count == 0) {
        firstTime = `${key} ${time} ${nickname} : ${content}`;
        count += keywords.length;
      } else if (keywords != null) {
        count += keywords.length;
      }
    });
  }
  for (const key of keys) {
    mostDay(key);
    search(key, new RegExp(keyword, "gi"));
  }
  return `
<h1>结果</h1>
<p>你们第一次聊天是${keys[0]} ${message[keys[0]][0].time} ${message[keys[0]][0].nickname} : ${
    message[keys[0]][0].content
  }，到现在已经${Math.floor((+new Date() - +new Date(keys[0])) / (24 * 3600 * 1000))}天了</p>
<p>你们一共聊了：${keys.length}天，总共${total}条消息，平均每天发${Math.round(
    total / keys.length,
  )}条消息</p>
<p>你们聊天最多的一天是${maxDay}，一共发了${message[maxDay].length}条消息</p>
<p>第一次说${keyword}是${firstTime},目前为止你们已经说过${keyword}${count}次</p>
  `;
}

module.exports = read;

console.log(1);
//表示する文字列を定義
//日付と曜日
const dateText = ':insertYear:/:insertMonth:/:insertDay:(:insertWeek:)'
//時刻
const timeText = ':insertHour:::insertMinute:::insertSecond:'


//現在の日時を表す日付オブジェクトを生成
let date = new Date();

//デジタル時刻を表示する
function showTime(){
  let newDateText = dateText;
  let newTimeText = timeText;

  //年(年をとってきて、文字列置換。以下同様)
  let year = date.getFullYear();
  newDateText = newDateText.replace(':insertYear:', year);

  //月(1月を0と数えるため、+1する)
  let month = date.getMonth() + 1;
  newDateText = newDateText.replace(':insertMonth:', month);

  //日
  let day = date.getDate();
  newDateText = newDateText.replace(":insertDay:", day);

  //曜日
  let week = date.getDay();
  newDateText = newDateText.replace(":insertWeek:", week);

  //時
  let hour = date.getHours();
  newTimeText = newTimeText.replace(":insertMonth:", twoDigit(hour));

  //分
  let minute = date.getMinutes();
  newTimeText = newTimeText.replace(":insertMinute:", twoDigit(minute));

  //秒
  let second = date.getSeconds();
  newTimeText = newTimeText.replace(":insertSecond:", twoDigit(second));

  //HTMLからid=dateやid=timeにマッチするドキュメント要素を取得し、書き換える
  document.getElementById('date').innerHTML = newDateText;
  document.getElementById('time').innerHTML = newTimeText;

}

//時刻を表示するとき2桁にしたいため、もし桁数が1桁だったら2桁にして返すメソッド
function twoDigit(num){
  let twoDigitNum = num;
  if(num < 10){
    twoDigitNum = "0" + num;
  }
  return twoDigitNum;
}

//１秒(1000ミリ秒)ごとにshowTime関数を呼び出す
setInterval(showTime, 1000);

//表示する文字列を定義
//日付と曜日
const dateText = ':insertYear:/:insertMonth:/:insertDay:(:insertWeek:)'
//時刻
const timeText = ':insertHour:::insertMinute:::insertSecond:'

/*=================
デジタル時刻を表示する
================*/
function showTime(){
  //現在の日時を表す日付オブジェクトを生成
  let date = new Date();

  //新しく生成する文章
  let newDateText = dateText;
  let newTimeText = timeText;


  //年(年をとってきて、文字列置換。以下同様)
  let year = date.getFullYear();
  newDateText = newDateText.replace(':insertYear:', year);

  //月(1月を0と数えるため、+1する)
  let month = date.getMonth() + 1;
  newDateText = newDateText.replace(':insertMonth:', twoDigit(month));

  //日
  let day = date.getDate();
  newDateText = newDateText.replace(":insertDay:", day);

  //曜日
  let week = date.getDay();
  let weekArray = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];//weekは0~6（日曜日~土曜日）数字であるため、文字列にするための配列作る
  newDateText = newDateText.replace(":insertWeek:", weekArray[week]);

  //時
  let hour = date.getHours();
  newTimeText = newTimeText.replace(":insertHour:", twoDigit(hour));

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

/*==========================================================
時刻を表示するとき2桁にしたいため、もし桁数が1桁だったら2桁にして返す関数
===========================================================*/
function twoDigit(num){
  let twoDigitNum = num;
  if(num < 10){
    twoDigitNum = "0" + num;
  }
  return twoDigitNum;
}

/*=======================================
１秒(1000ミリ秒)ごとにshowTime関数を呼び出す
=======================================*/
setInterval(showTime, 1000);

/*===============
マップを表示する関数
=================*/
function initMap(){
  var myOptions = {//オブジェクトで初期化
    zoom: 16,//辞書形式　name:value 名前の値 keyとvalueの値をペアにする
    center: {lat: 35.72222638304765, lng: 139.4665237132706},//緯度53度, 経度-2度（イギリス） JSON
    mapTypeId: google.maps.MapTypeId.TERRAIN,//google.mapsが決めているTERRAINという値
    disableDefaultUI: true,//ユーザーインターフェースをどうする？　今回は付けなくていいよという指定

    zoomControl: true,//ズームコントローラを表示するかどうか
    mapTypeControl: true,//地図の種類を変更できる, マップタイプ・コントローラの表示を表示するかどうか
    scaleControl: true//地図のスケールコントローラを表示するかどうか
  }
  //map_canvasをつけたところ(どこに作って欲しいか)とOption(web上に表示するために必要な最低限条件）を入れてインスタンス(マップオブジェクト）を作っている
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  console.log(1);
}

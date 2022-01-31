//デジタル時計として表示する文字列(日付と曜日, 時刻)を定義
const dateText = ':insertYear:/:insertMonth:/:insertDay:(:insertWeek:)<span id = "time"><span class = "number">:insertHour:</span>:<span class = "number">:insertMinute:</span><span id = "second">:insertSecond:</span></span>'

//時差
let timeDiff = 0;

//年, 月, 日, 曜日, 時, 分, 秒
let year, month, day, week, hour, minute, second;

//ボタン
let myButton = document.querySelector('button');

//マップ関連の変数を定義する
let map;//マップ
let markers = [];//マーカーを保存する配列

/*=================
デジタル時刻を表示する
================*/
function showTime(timeDiff){
  //現在の日時を表す日付オブジェクトを生成
  let date = new Date();

  //新しく生成する文章
  let newDateText = dateText;

  //年
  year = date.getFullYear();

  //月(1月を0と数えるため、+1する)
  month = date.getMonth() + 1;
  let monthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  //閏年かチェック(閏年だったら2月を29日にする)
  if((year % 4 === 0 && year % 100 !== 0 )||(year % 400 === 0)){
    monthArray[1]++;
  }

  //日
  day = date.getDate();

  //曜日
  week = date.getDay();
  let weekArray = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];//weekは0~6（日曜日~土曜日）数字であるため、文字列にするための配列作る

  //時
  hour = date.getHours();

  //分
  minute = date.getMinutes();

  //秒
  second = date.getSeconds();

  //時差計算
  if(hour < timeDiff){//クリックした地点が日本の日付の前日だったら
    //時刻を変える
    hour =　24 + (hour - timeDiff);

    //年・月・日を変える
    if(day === 1){//日本の日が◯月1日だったら
      if(month == 1){
        //1月1日だったら
        year = year - 1;//前の年にして
        month = 12;//12月にする
      }else{
        //2~12月1日だったら
        month = (month - 1) % 12;//前月にするために-1してから12で割った余りを求める。
      }
      day = monthArray[month - 1];//monthArrayは0始まりなので、1引く。
    }else{//日本の日が1日以外だったら
      day = day - 1;//日だけ変えれば良い。
    }

    //曜日を変える
    if(week === 0){
      week = 6;
    }else{
      week = (week - 1) % 7;
    }

  }else{//日付同じだったら
    hour = hour - timeDiff;//時刻だけ変えれば良い
  }

  //文字列置換
  newDateText = newDateText.replace(':insertYear:', year);
  newDateText = newDateText.replace(':insertMonth:', twoDigit(month));
  newDateText = newDateText.replace(":insertDay:", day);
  newDateText = newDateText.replace(":insertWeek:", weekArray[week]);
  newDateText = newDateText.replace(":insertHour:", twoDigit(hour));
  newDateText = newDateText.replace(":insertMinute:", twoDigit(minute));
  newDateText = newDateText.replace(":insertSecond:", twoDigit(second));

  //HTMLからid=dateやid=timeにマッチするドキュメント要素を取得し、書き換える
  document.getElementById('date_time').innerHTML = newDateText;
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
//１秒(1000ミリ秒)ごとにshowTime関数を呼び出す.(setTimeoutを使い、setIntervalの実行が開始するのをミリ秒が0の時になるように調節した)
=======================================*/
setTimeout(
  setInterval(
    function(){
      showTime(timeDiff)
    }
    ,1000)//無名関数を使って、引数ありでも対応できるようにする 参考；https://lightgauge.net/language/javascript/3377/
  , 1000 - new Date().getMilliseconds());

//=================
//マップを表示する関数
//=================
function initMap(){
  let myOptions = {//オブジェクトで初期化
      zoom: 2,//辞書形式　name:value 名前の値 keyとvalueの値をペアにする
      center: {lat: 25, lng: 150},//緯度25度, 経度150度
      mapTypeId: google.maps.MapTypeId.TERRAIN,//google.mapsが決めているTERRAINという値
      disableDefaultUI: true,//ユーザーインターフェースをどうするか。今回は付けなくていいという指定
      zoomControl: true,//ズームコントローラを表示するかどうか
      mapTypeControl: true,//地図の種類を変更できる, マップタイプ・コントローラの表示を表示するかどうか
      scaleControl: true//地図のスケールコントローラを表示するかどうか
  }

  //map_canvasをつけたところ(どこに作って欲しいか)とOption(web上に表示するために必要な最低限条件）を入れてインスタンス(マップオブジェクト）を作っている
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  //=====================================================================================================
  //クリックしたら、マーカーを表示する。(initMap関数外に下記を置くとCannot read properties of undefiedというエラーが出るため、initMap関数内に置いた。)
  //======================================================================================================
  //地図で発生するイベントを取得するにはaddListenerを使う　参考：https://www.javadrive.jp/google-maps-javascript/gevent/index1.html
  map.addListener('click', function(e){
    let lat = e.latLng.lat();//緯度
    let lng = e.latLng.lng();//経度

    //日付・曜日・時刻を計算し直すために、時差を計算する
    timeDiff = Math.round((135-lng)/15);//時差

    //マーカーを削除する
    deleteMarker();

    //マーカーを追加する
    addMarker(lat, lng);

    //クッキーを設定する
    setCookie('clickLat', lat, 30);
    setCookie('clickLng', lng, 30);
  });

}

//=========================
//新しくマーカーをつけるメソッド
//=========================
function addMarker(lat, lng){
  const marker = new google.maps.Marker({
    position: {lat: lat, lng: lng},//マーカーを地図上のどこに置きたいか
    icon: 'https://maps.google.com/mapfiles/kml/shapes/flag_maps.png',//Google上のアイコンの置いてある場所
    map: map//どの地図に表示するか
  });
  markers.push(marker);//配列にpush
}

//=====================
//マーカーを削除するメソッド
//=====================
function deleteMarker(){
  markers[0].setMap(null);//マーカー削除(参考：https://www.javadrive.jp/google-maps-javascript/gmarker/index4.html)
  markers = [];//マーカーを配列からも消す
}

//=======================
//loadイベントが起こったら（=CSS, 画像, 動画などの読み込みが終わったら）、明石市にマーカーをつける。
//なお、ここをDOMContentLoadedイベント発生時にするとエラーが出る(addMaker関数でgoogleが定義されていないというエラー)。
//======================
window.onload = function(){
  let lat = getCookie('clickLat');
  let lng = getCookie('clickLng');

  if (lat != "" && lng != "") {
    //日付・曜日・時刻を計算し直すために時差を計算する
    timeDiff = Math.round((135-lng)/15);//時差
    
    //Cookieに保存しておいた地点にマーカーをつける
    addMarker(parseFloat(lat), parseFloat(lng));
  }else{
    //時差は0とする
    timeDiff = 0;
    
    //明石市にマーカーをつける
    addMarker(35, 135);
    
    //クッキーを設定する(もし初回時に何もクリックせずに閉じたら、クッキーには日本明石市の緯度経度を登録する。)
    setCookie('clickLat', 35, 30);
    setCookie('clickLng', 135, 30);
  }
};

//=======================
//「日本標準時に戻す」ボタンがクリックされたら、時差を0にしてshowTimeし、明石市にマーカーをつける
//=======================
myButton.addEventListener('click', function(){
  //時差を0とする
   timeDiff = 0;
  
  //現在のマーカーを削除する
  deleteMarker();
  
  //明石市にマーカーをつける
  addMarker(35, 135);

  //クッキーを設定する
  setCookie('clickLat', 35, 30);
  setCookie('clickLng', 135, 30);
});

//====================
//クッキーを設定する
//====================
function setCookie(cname,cvalue,exdays) {//使いたいクッキーの名前、入れたい値、何日間有効のクッキーとしたいか
  var d = new Date();//組み込みクラスDateを使って、この瞬間のオブジェクトを表すものを作る
  d.setTime(d.getTime() + (exdays*24*60*60*1000));//ある時点からの値をもらってきて、そこにexdays日分足して、その値をdにセット
  var expires = "expires=" + d.toGMTString();//"expires=" + 全世界共通の表現 （このクッキーはいつまで有効か）
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";//サーバーのどこで使っていいか
}

//==================
//クッキーを取得する
//==================
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);//UTF-8の%xx表現形式から文字列に変換
  var ca = decodedCookie.split(';');//文字列.split(';'): 文字列を区切り文字;で分割する　戻り値は配列
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {//cの0文字目が' 'だったら
      c = c.substring(1);//cは1文字目以降だけにする
    }
    if (c.indexOf(name) == 0) {//文字列からnameを検索していき、最初に一致した位置が0文字目だったら
      return c.substring(name.length, c.length);//name.length文字目〜（c.length - 1）文字目までを返す.
    }
  }
  return "";
}

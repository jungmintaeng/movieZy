kobisKey = "da0004f925396248491fb526731d2e81";
daumKey = "a71536f8f581d9368919608433fdcba2";

$(document).ready(function(){
  $('.contents').hide();
  $('.project_synopsis').show();
  $('.verification_content').hide();
  $('.atmosphere').show();
  $('#verification_submenu p').on('click', function(){
    $('.verification_content').hide();
    var text = $(this).text();
    switch(text){
      case "인터뷰 환경":{
        $('.atmosphere').fadeIn();
        break;
      }
      case "설문 문항":{
        $('.question').fadeIn();
        break;
      }
      case "분석":{
        $('.analysis').fadeIn();
        break;
      }
      default:{
        $('.user' + text.split(' ')[1]).fadeIn();
        break;
      }
    }
  });
  //menu_item onclick
  $('.menu_item').on('click', function(){
    $( 'html, body' ).animate( { scrollTop : 0 } );
    $('.menu_item').removeClass('selected');
    $(this).addClass('selected');
    var className;
    switch(this.innerText){
      case "프로젝트 개요":
      className = "project_synopsis";
      break;
      case "사용자와 과업분석":
      className = "user_analysis";
      break;
      case "공공데이터 소개 및 테스트":
      className = "api_introduction";
      break;
      case "초기 프로토타입 및 사용성 평가":
      className = "first_prototype";
      break;
      case "최종 프로토타입":
      className = "final_prototype";
      break;
      case "최종 사용성 평가":
      className = "final_user_analysis";
      break;
      case "결론 및 향후 개선방향":
      className = "conclusion";
      break;
      case "참고 자료":
      className = "reference";
      break;
    }
    $('.contents').hide();
    $('.' + className).fadeIn(500);
    request("http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.xml?key=" + kobisKey + "&targetDt=20120101", kobisCallback);
    request("https://apis.daum.net/contents/movie?apikey=" + daumKey + "&q=" + encodeURI("캐리비안의 해적: 죽은 자는 말이 없다"), daumCallback);
  });

  drawGraph();
});

function request(url, callback){
  $.ajax({
  type:"GET",
  url:url,
  error:function(request,status,error){
    alert(error);
  },
  success: callback
});
}

function kobisCallback(data){
  $('#kobis_raw').text(data.responseText);
  var rank, rankInten, rankOldAndNew, movieCd, movieNm, openDt, salesAmt, salesShare, salesInten,
    salesChange, salesAcc, audiCnt, audiInten, audiChange, audiAcc, scrnCnt, showCnt;
  var xmlParser = new DOMParser();
  var xmlDocument = xmlParser.parseFromString(data.responseText, "text/xml");
  var movieElement = xmlDocument.getElementsByTagName('dailyBoxOffice');
  var content = "";
  for(var i = 0 ; i < movieElement.length; i++){
    try{
      rank = movieElement[i].getElementsByTagName('rank')[0].childNodes[0].nodeValue;
    }catch(err){
      rank = "랭킹 미정";
    }
    try{
      rankInten = movieElement[i].getElementsByTagName('rankInten')[0].childNodes[0].nodeValue;
    }catch(err){
      rankInten = "랭킹 변동 없음";
    }
    try{
      rankOldAndNew = movieElement[i].getElementsByTagName('rankOldAndNew')[0].childNodes[0].nodeValue;
    }catch(err){
      rankOldAndNew = "새로 진입";
    }
    try{
      movieCd = movieElement[i].getElementsByTagName('movieCd')[0].childNodes[0].nodeValue;
    }catch(err){
      movieCd = "영화 코드 오류";
    }
    try{
      movieNm = movieElement[i].getElementsByTagName('movieNm')[0].childNodes[0].nodeValue;
    }catch(err){
      movieNm = "영화 이름 오류";
    }
    try{
      openDt = movieElement[i].getElementsByTagName('openDt')[0].childNodes[0].nodeValue;
    }catch(err){
      openDt = "개봉일 미정";
    }
    try{
      salesAmt = movieElement[i].getElementsByTagName('salesAmt')[0].childNodes[0].nodeValue;
    }catch(err){
      salesAmt = "일별 매출액 미측정";
    }
    try{
      salesShare = movieElement[i].getElementsByTagName('salesShare')[0].childNodes[0].nodeValue;
    }catch(err){
      salesShare = "매출 비율 미측정";
    }
    try{
      salesInten = movieElement[i].getElementsByTagName('salesInten')[0].childNodes[0].nodeValue;
    }catch(err){
      salesInten = "매출 증감 미측정";
    }
    try{
      salesChange = movieElement[i].getElementsByTagName('salesChange')[0].childNodes[0].nodeValue;
    }catch(err){
      salesChange = "매출 증감 비율 미측정";
    }
    try{
      salesAcc = movieElement[i].getElementsByTagName('salesAcc')[0].childNodes[0].nodeValue;
    }catch(err){
      salesAcc = "누적 매출액 미측정";
    }
    try{
      audiCnt = movieElement[i].getElementsByTagName('audiCnt')[0].childNodes[0].nodeValue;
    }catch(err){
      audiCnt = "일별 관객수 미측정";
    }
    try{
      audiInten = movieElement[i].getElementsByTagName('audiInten')[0].childNodes[0].nodeValue;
    }catch(err){
      audiInten = "관객 증감 미측정";
    }
    try{
      audiChange = movieElement[i].getElementsByTagName('audiChange')[0].childNodes[0].nodeValue;
    }catch(err){
      audiChange = "관객 증감 비율 미측정";
    }
    try{
      audiAcc = movieElement[i].getElementsByTagName('audiAcc')[0].childNodes[0].nodeValue;
    }catch(err){
      audiAcc = "누적 관객수 미측정";
    }
    try{
      scrnCnt = movieElement[i].getElementsByTagName('scrnCnt')[0].childNodes[0].nodeValue;
    }catch(err){
      scrnCnt = "상영 스크린 수 미측정";
    }
    try{
      showCnt = movieElement[i].getElementsByTagName('showCnt')[0].childNodes[0].nodeValue;
    }catch(err){
      showCnt = "일별 상영 횟수 미측정";
    }

    content += "랭킹 : " + rank + "\n" +
    "순위 증감 : " + rankInten + "\n" +
    "랭킹 진입 여부 : " + rankOldAndNew + "\n" +
    "영화 코드 : " + movieCd + "\n" +
    "영화명 : " + movieNm + "\n" +
    "개봉일 : " + openDt + "\n" +
    "일별 매출액 : " + salesAmt + "\n" +
    "매출 총액 대비 비율 : " + salesShare + "\n" +
    "전일 대비 매출 증감 : " + salesInten + "\n" +
    "전일 대비 매출 증감 비율" + salesChange + "\n" +
    "누적 매출액 : " + salesAcc + "\n" +
    "일별 관객수 : " + audiCnt + "\n" +
    "전일 대비 관객수 증감 : " + audiInten + "\n" +
    "전일 대비 관객수 증감 비율 : " + audiChange + "\n" +
    "누적 관객수 : " + audiAcc + "\n" +
    "일별 상영 스크린 수 : " + scrnCnt + "\n" +
    "상영 횟수 : " + showCnt + "\n\n\n";
  }
  $('#kobis_parsed').html("2012년 1월 1일의 박스오피스 정보\n" + content);
}

function daumCallback(data){
  $('#daum_raw').text(data.responseText);
  var thumb,open_info,story,director,actor,genre,nation,photoList,grade,audi;
  var xmlParser = new DOMParser();
  var xmlDocument = xmlParser.parseFromString(data.responseText, "text/xml");
  var totalCount = xmlDocument.getElementsByTagName('totalCount')[0].childNodes[0].nodeValue;
  if(totalCount == 0){
    alert('지원하지 않는 영화입니다.');
  }else{
    try{
      thumb = xmlDocument.getElementsByTagName('thumbnail')[0].getElementsByTagName('content')[0].childNodes[0].nodeValue;
    }catch(err){
      thumb = "";
    }
    open_info = contentToString(xmlDocument.getElementsByTagName('open_info')[0].getElementsByTagName('content'));
    story = xmlDocument.getElementsByTagName('story')[0].getElementsByTagName('content')[0].childNodes[0].nodeValue;
    director = contentToString(xmlDocument.getElementsByTagName('director')[0].getElementsByTagName('content'));
    actor = contentToString(xmlDocument.getElementsByTagName('actor')[0].getElementsByTagName('content'));
    try{
      nation = xmlDocument.getElementsByTagName('nation')[0].getElementsByTagName('content')[0].childNodes[0].nodeValue;
    }catch(err){
      nation="";
    }
    try{
      genre = xmlDocument.getElementsByTagName('genre')[0].getElementsByTagName('content')[0].childNodes[0].nodeValue;
    }catch(err){
      genre="";
    }
    try{
      photoList = xmlDocument.getElementsByTagName('photo_info')[0].getElementsByTagName('link')[0].childNodes[0].nodeValue;
    }catch(err){
      photoList = "";
    }
    try{
      grade = xmlDocument.getElementsByTagName('grades')[0].getElementsByTagName('content')[0].childNodes[0].nodeValue;
    }catch(err){
      grade = "미평가";
    }
    try{
      audi = xmlDocument.getElementsByTagName('audience')[0].getElementsByTagName('content')[0].childNodes[0].nodeValue;
    }catch(err){
      audi = "미측정";
    }

    var content = "영화명 : 캐리비안의 해적: 죽은 자는 말이 없다\n" +
    "포스터 URL : " + thumb + "\n개봉일 : " + open_info + "\n줄거리\n" + story + "\n\n감독 : " + director +
    "\n배우 : " + actor + "\n장르 : " + genre + "\n국가 : " + nation +
    "\n사진 URL : " + photoList + "\n평점 : " + grade + "\n관객수 : " + audi;
    $('#daum_parsed').text(content);
  }
}

function contentToString(contents){
  var string = "";
  for(var i = 0; i < contents.length ; i++){
    try{
      string += " | " + contents[i].childNodes[0].nodeValue + " | ";
    }catch(err){
      continue;
    }
  }
  return string;
}

function drawGraph(){
  var expResultData = [71, 104, 72, 44];
  var first = [71, 104];
  var final = [72, 44];
  var padding = 200;
  var rectwidth = 1200 / expResultData.length - padding;
  var avgfirst = average(first);
  var avgfinal = average(final);
  var scaleData = d3.scaleLinear().domain([0, d3.max(expResultData)]).range([0, 600]);
  var axisScale = d3.scaleLinear().domain([d3.max(expResultData),0]).range([0, 600]);
  var scaley = d3.scaleLinear().domain([0, d3.max(expResultData)]).range([600, 0]);
  var scaleColor = d3.scaleLinear().domain([0, d3.max(expResultData)]).range([0, 255]);
  var svg = d3.select('#graph').append('svg').attr('width', 1200).attr('height', 600);
  var bars = svg.selectAll('rect').data(expResultData).enter().append('rect');
  bars.attr('height', function(d){
    return scaleData(d);
  }).attr('width', rectwidth)
  .attr('x', function(d,i){
    return 100+i * (300);
  }).attr('y', function(d){
    return scaley(d);
  })
  .attr('fill', function(d){
    return 'rgb(0,' + parseInt(scaleColor(d)) + ","+ parseInt(scaleColor(d)) +')';
  });
  var texts = svg.selectAll('text').data(expResultData).enter().append('text').attr('fill', 'white')
  .text(function(d){return d})
  .attr('x', function(d, i){
    return 100+i * (300) + 40;
  })
  .attr('y', function(d, i){
    return scaley(d) + 30;
  });
  var yAxis = svg.append('g').attr('transform', 'translate(50, 0)')
  .call(d3.axisLeft(axisScale));
  var averageLine = svg.append('line')
  .attr('x1', 100).attr('y1', 600 - scaleData(avgfirst))
  .attr('x2', 600).attr('y2', 600 - scaleData(avgfirst))
  .attr('stroke', 'red');
  svg.append('text').attr('x', 300).attr('y', 600 - scaleData(avgfirst) + 20).attr('fill', 'red').text('초기 프로토타입 평균');
  var averageLine = svg.append('line')
  .attr('x1', 700).attr('y1', 600 - scaleData(avgfinal))
  .attr('x2', 1200).attr('y2', 600 - scaleData(avgfinal))
  .attr('stroke', 'blue');
  svg.append('text').attr('x', 900).attr('y', 600 - scaleData(avgfinal) + 20).attr('fill', 'blue').text('최종 프로토타입 평균');
}

function average(arr){
  var sum = 0;
  for(var i = 0 ; i < arr.length; i++){
    sum += arr[i];
  }
  return parseInt(sum / arr.length);
}

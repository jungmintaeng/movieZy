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
      case "���ͺ� ȯ��":{
        $('.atmosphere').fadeIn();
        break;
      }
      case "���� ����":{
        $('.question').fadeIn();
        break;
      }
      case "�м�":{
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
      case "������Ʈ ����":
      className = "project_synopsis";
      break;
      case "����ڿ� �����м�":
      className = "user_analysis";
      break;
      case "���������� �Ұ� �� �׽�Ʈ":
      className = "api_introduction";
      break;
      case "�ʱ� ������Ÿ�� �� ��뼺 ��":
      className = "first_prototype";
      break;
      case "���� ������Ÿ��":
      className = "final_prototype";
      break;
      case "���� ��뼺 ��":
      className = "final_user_analysis";
      break;
      case "��� �� ���� ��������":
      className = "conclusion";
      break;
      case "���� �ڷ�":
      className = "reference";
      break;
    }
    $('.contents').hide();
    $('.' + className).fadeIn(500);
    request("http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.xml?key=" + kobisKey + "&targetDt=20120101", kobisCallback);
    request("https://apis.daum.net/contents/movie?apikey=" + daumKey + "&q=" + encodeURI("ĳ������� ����: ���� �ڴ� ���� ����"), daumCallback);
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
      rank = "��ŷ ����";
    }
    try{
      rankInten = movieElement[i].getElementsByTagName('rankInten')[0].childNodes[0].nodeValue;
    }catch(err){
      rankInten = "��ŷ ���� ����";
    }
    try{
      rankOldAndNew = movieElement[i].getElementsByTagName('rankOldAndNew')[0].childNodes[0].nodeValue;
    }catch(err){
      rankOldAndNew = "���� ����";
    }
    try{
      movieCd = movieElement[i].getElementsByTagName('movieCd')[0].childNodes[0].nodeValue;
    }catch(err){
      movieCd = "��ȭ �ڵ� ����";
    }
    try{
      movieNm = movieElement[i].getElementsByTagName('movieNm')[0].childNodes[0].nodeValue;
    }catch(err){
      movieNm = "��ȭ �̸� ����";
    }
    try{
      openDt = movieElement[i].getElementsByTagName('openDt')[0].childNodes[0].nodeValue;
    }catch(err){
      openDt = "������ ����";
    }
    try{
      salesAmt = movieElement[i].getElementsByTagName('salesAmt')[0].childNodes[0].nodeValue;
    }catch(err){
      salesAmt = "�Ϻ� ����� ������";
    }
    try{
      salesShare = movieElement[i].getElementsByTagName('salesShare')[0].childNodes[0].nodeValue;
    }catch(err){
      salesShare = "���� ���� ������";
    }
    try{
      salesInten = movieElement[i].getElementsByTagName('salesInten')[0].childNodes[0].nodeValue;
    }catch(err){
      salesInten = "���� ���� ������";
    }
    try{
      salesChange = movieElement[i].getElementsByTagName('salesChange')[0].childNodes[0].nodeValue;
    }catch(err){
      salesChange = "���� ���� ���� ������";
    }
    try{
      salesAcc = movieElement[i].getElementsByTagName('salesAcc')[0].childNodes[0].nodeValue;
    }catch(err){
      salesAcc = "���� ����� ������";
    }
    try{
      audiCnt = movieElement[i].getElementsByTagName('audiCnt')[0].childNodes[0].nodeValue;
    }catch(err){
      audiCnt = "�Ϻ� ������ ������";
    }
    try{
      audiInten = movieElement[i].getElementsByTagName('audiInten')[0].childNodes[0].nodeValue;
    }catch(err){
      audiInten = "���� ���� ������";
    }
    try{
      audiChange = movieElement[i].getElementsByTagName('audiChange')[0].childNodes[0].nodeValue;
    }catch(err){
      audiChange = "���� ���� ���� ������";
    }
    try{
      audiAcc = movieElement[i].getElementsByTagName('audiAcc')[0].childNodes[0].nodeValue;
    }catch(err){
      audiAcc = "���� ������ ������";
    }
    try{
      scrnCnt = movieElement[i].getElementsByTagName('scrnCnt')[0].childNodes[0].nodeValue;
    }catch(err){
      scrnCnt = "�� ��ũ�� �� ������";
    }
    try{
      showCnt = movieElement[i].getElementsByTagName('showCnt')[0].childNodes[0].nodeValue;
    }catch(err){
      showCnt = "�Ϻ� �� Ƚ�� ������";
    }

    content += "��ŷ : " + rank + "\n" +
    "���� ���� : " + rankInten + "\n" +
    "��ŷ ���� ���� : " + rankOldAndNew + "\n" +
    "��ȭ �ڵ� : " + movieCd + "\n" +
    "��ȭ�� : " + movieNm + "\n" +
    "������ : " + openDt + "\n" +
    "�Ϻ� ����� : " + salesAmt + "\n" +
    "���� �Ѿ� ��� ���� : " + salesShare + "\n" +
    "���� ��� ���� ���� : " + salesInten + "\n" +
    "���� ��� ���� ���� ����" + salesChange + "\n" +
    "���� ����� : " + salesAcc + "\n" +
    "�Ϻ� ������ : " + audiCnt + "\n" +
    "���� ��� ������ ���� : " + audiInten + "\n" +
    "���� ��� ������ ���� ���� : " + audiChange + "\n" +
    "���� ������ : " + audiAcc + "\n" +
    "�Ϻ� �� ��ũ�� �� : " + scrnCnt + "\n" +
    "�� Ƚ�� : " + showCnt + "\n\n\n";
  }
  $('#kobis_parsed').html("2012�� 1�� 1���� �ڽ����ǽ� ����\n" + content);
}

function daumCallback(data){
  $('#daum_raw').text(data.responseText);
  var thumb,open_info,story,director,actor,genre,nation,photoList,grade,audi;
  var xmlParser = new DOMParser();
  var xmlDocument = xmlParser.parseFromString(data.responseText, "text/xml");
  var totalCount = xmlDocument.getElementsByTagName('totalCount')[0].childNodes[0].nodeValue;
  if(totalCount == 0){
    alert('�������� �ʴ� ��ȭ�Դϴ�.');
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
      grade = "����";
    }
    try{
      audi = xmlDocument.getElementsByTagName('audience')[0].getElementsByTagName('content')[0].childNodes[0].nodeValue;
    }catch(err){
      audi = "������";
    }

    var content = "��ȭ�� : ĳ������� ����: ���� �ڴ� ���� ����\n" +
    "������ URL : " + thumb + "\n������ : " + open_info + "\n�ٰŸ�\n" + story + "\n\n���� : " + director +
    "\n��� : " + actor + "\n�帣 : " + genre + "\n���� : " + nation +
    "\n���� URL : " + photoList + "\n���� : " + grade + "\n������ : " + audi;
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
  svg.append('text').attr('x', 300).attr('y', 600 - scaleData(avgfirst) + 20).attr('fill', 'red').text('�ʱ� ������Ÿ�� ���');
  var averageLine = svg.append('line')
  .attr('x1', 700).attr('y1', 600 - scaleData(avgfinal))
  .attr('x2', 1200).attr('y2', 600 - scaleData(avgfinal))
  .attr('stroke', 'blue');
  svg.append('text').attr('x', 900).attr('y', 600 - scaleData(avgfinal) + 20).attr('fill', 'blue').text('���� ������Ÿ�� ���');
}

function average(arr){
  var sum = 0;
  for(var i = 0 ; i < arr.length; i++){
    sum += arr[i];
  }
  return parseInt(sum / arr.length);
}

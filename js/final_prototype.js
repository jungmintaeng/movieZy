movieKey = "da0004f925396248491fb526731d2e81";
daumKey = "a71536f8f581d9368919608433fdcba2";
boxOfficeArray = new Array();
recommendArray = new Array();
nationArray = new Array();
totalPageCount = 0;
currentPage = 0;
keyword = "";
main_currentIndex = 0;
var startAutoPaging;

$(document).ready(function(){
  $('.boxOfficeContainer').removeClass('hidden');
  showLoadingbar();
  getBoxOffice(boxOfficeCallback, getYesterdayDate());

  $('.menu_item').hover(function(){$(this).addClass('menu_item_hover');}, function(){$(this).removeClass('menu_item_hover');}).on('click', menuItemClick);

  $('table.boxOfficeTable tbody tr').on('click', function(){
    console.log('됨');
    clearInterval(startAutoPaging);
    var rank = $(this).find('td')[0].innerHTML;
    rank = rank.split('(')[0];
    index = rank - 1;
    updateMainView(index);
  });

  $('#recommend_submit').on('click', function(){
    var value = $('#recommend_date').val().split('-');
    var target = value[0].toString() + value[1].toString() + value[2].toString();
    showLoadingbar();
    $('#movie_specification').hide();
    getBoxOffice(recommendCallBack, target);
  });

  $(document).on("click","#nation_page li",function(){
    var content = $(this).text();
    if(content==currentPage){
      return;
    }else if(content=="이전"){
      showLoadingbar();
      $('#movie_specification').hide();
      var tempPage = parseInt(currentPage) - 10;
      currentPage = "";
      for(var i = 0 ; i < tempPage.toString().length - 1; i++){
        currentPage += tempPage.toString().charAt(i);
      }
      currentPage += (1).toString();
      getMovieListByNation(nationCallback, $('.nationSelect').val(), $('.nationOpenDt').val(), currentPage);
    }else if(content=="다음"){
      showLoadingbar();
      $('#movie_specification').hide();
      var tempPage = parseInt(currentPage) + 10;
      currentPage = "";
      for(var i = 0 ; i < tempPage.toString().length - 1; i++){
        currentPage += tempPage.toString().charAt(i);
      }
      currentPage += (1).toString();
      getMovieListByNation(nationCallback, $('.nationSelect').val(), $('.nationOpenDt').val(), currentPage);
    }else{
      showLoadingbar();
      $('#movie_specification').hide();
      currentPage = content;
      getMovieListByNation(nationCallback, $('.nationSelect').val(), $('.nationOpenDt').val(), content);
    }
  });

  $(document).on("click","#people_page li",function(){
    var content = $(this).text();
    if(content==currentPage){
      return;
    }else if(content=="이전"){
      var tempPage = parseInt(currentPage) - 10;
      currentPage = "";
      for(var i = 0 ; i < tempPage.toString().length - 1; i++){
        currentPage += tempPage.toString().charAt(i);
      }
      currentPage += (1).toString();
    }else if(content=="다음"){
      var tempPage = parseInt(currentPage) + 10;
      currentPage = "";
      for(var i = 0 ; i < tempPage.toString().length - 1; i++){
        currentPage += tempPage.toString().charAt(i);
      }
      currentPage += (1).toString();
    }else{
      currentPage = content;
    }
    showLoadingbar();
    getPeopleList(peopleCallBack, keyword, currentPage);
  });

  $(document).on("click","#search_page li",function(){
    var content = $(this).text();
    if(content==currentPage){
      return;
    }else if(content=="이전"){
      var tempPage = parseInt(currentPage) - 10;
      currentPage = "";
      for(var i = 0 ; i < tempPage.toString().length - 1; i++){
        currentPage += tempPage.toString().charAt(i);
      }
      currentPage += (1).toString();
    }else if(content=="다음"){
      var tempPage = parseInt(currentPage) + 10;
      currentPage = "";
      for(var i = 0 ; i < tempPage.toString().length - 1; i++){
        currentPage += tempPage.toString().charAt(i);
      }
      currentPage += (1).toString();
    }else{
      currentPage = content;
    }
    showLoadingbar();
    getMovieListByName(searchCallback, keyword, currentPage);
  });

  $('#nation_submit').on('click', function(){
    totalPageCount = 0;
    currentPage = 1;
    $('#nation_page').empty();
    showLoadingbar();
    $('#movie_specification').hide();
    getMovieListByNation(nationCallback, $('.nationSelect').val(), $('.nationOpenDt').val(), 1);
  });

  $('#people_search_button').on('click', function(){
    totalPageCount = 0;
    currentPage = 1;
    $('#people_page').empty();
    $('#peopleList').empty();
    keyword = $('#people_search_text').val();
    showLoadingbar();
    $('#movie_specification').hide();
    getPeopleList(peopleCallBack, keyword, 1);
  });

  $('#people_search_text').keypress(function(e){
    var code = e.keyCode || e.which;
    if(code == 13) {
      e.preventDefault();
      $('#people_search_button').trigger('click');
    }
  });

  $('#search_button').on('click', function(){
    totalPageCount = 0;
    currentPage = 1;
    keyword = $('#search_text').val();
    showLoadingbar();
    $('#movie_specification').hide();
    getMovieListByName(searchCallback, keyword, 1);
  });

  $('#search_text').keypress(function(e){
    var code = e.keyCode || e.which;
    if(code == 13) {
      e.preventDefault();
      $('#search_button').trigger('click');
    }
  });

  $('.top>img').on('click', function(){
    $('#movie_specification').hide(400);
  });

  $('#movie_specification').on('click', function(){
    $("#movie_specification").hide();
  });

  $(document).on("click",".recommendList>li>a,.nationList>li>a,#searchList>li>a,.recommendList>li>img,.nationList>li>img,#searchList>li>img",function(){
    var currentScroll = $(document).scrollTop();
    var name = $(this).parent().find("p span").text();
    $('#movie_specification').css({"top":currentScroll + "px"});
    $('#movie_specification').fadeIn('slow');
    showLoadingbar();
    getMovieSpecification(name);
  });
  $(document).on("click",".boxOfficeContainer p,.boxOfficeContainer img",function(){
    var name = $('#movieNm').text();
    $('#movie_specification').css({"top":"0px"});
    goTop();
    $('#movie_specification').fadeIn('slow');
    showLoadingbar();
    getMovieSpecification(name);
  });
  $(document).on("click","#peopleList ul li",function(){
    $('.title').html("영화 통합 검색");
    $('.contents').addClass('hidden');
    $('.search').removeClass('hidden');
    totalPageCount = 0;
    currentPage = 1;
    $('#search_text').val(this.innerText);
    $('#search_button').trigger('click');
  });
});

function goTop(){
  $( 'html, body' ).animate( { scrollTop : 0 }, 400 );
}

function menuItemClick(){
  clearInterval(startAutoPaging);
  $('#movie_specification').hide();
  showLoadingbar();
  $('.contents').addClass('hidden');
  if($(this).text()=="추천 영화"){
    $('.title').html("추천 영화");
    $('.recommend').removeClass('hidden');
    initRecommend();
  }else if($(this).text()=="영화 통합 검색"){
    hideLoadingBar();
    $('#search_text').val('');
    $('.title').html("영화 통합 검색");
    $('.search').removeClass('hidden');
    totalPageCount = 0;
    currentPage = 1;
    keyword = "";
    showLoadingbar();
    $('#movie_specification').hide();
    getMovieListByName(searchCallback, keyword, 1);
  }else if($(this).text()=="국가별 영화"){
    $('.title').html("국가별 영화");
    $('.nation').removeClass('hidden');
    initNation();
  }else if($(this).text()=="배우, 감독"){
    hideLoadingBar();
    $('#people_page').empty();
    $('#peopleList').empty();
    $('.title').html("배우, 감독 검색");
    $('.people').removeClass('hidden');
    $('#peopleList').html("<li style='color:gray'>" +
      "예시 )" +
      "<p id='peopleName'><strong>앤 해서웨이</strong>(Anne Hathaway)</p>" +
      "<p id='role'>배우</p>"  +
      "<span>참여 작품</span>"  +
      "<ul>" +
        "<li>콜로설</li>"  +
        "<li>거울 나라의 앨리스</li>" +
        "<li>인턴</li>" +
        "<li>송 원</li>" +
        "<li>인터스텔라</li>" +
        "<li>리오 2</li>" +
        "<li>걸 라이징</li>" +
        "<li>레미제라블</li>" +
        "<li>다크 나이트 라이즈</li>" +
        "<li>원 데이</li>" +
        "<li>러브 &amp; 드럭스</li>" +
        "<li>이상한 나라의 앨리스</li>" +
        "<li>발렌타인 데이</li>" +
        "<li>신부들의 전쟁</li>" +
        "<li>패신저스</li>" +
        "<li>레이첼 결혼하다</li>" +
        "<li>겟 스마트</li>" +
        "<li>비커밍 제인</li>" +
        "<li>악마는 프라다를 입는다</li>" +
        "<li>빨간모자의 진실</li>" +
        "<li>하복</li>" +
        "<li>프린세스 다이어리 2</li>" +
        "<li>엘라의 유혹</li>" +
        "<li>니콜라스 니클비</li>" +
        "<li>프린세스 다이어리</li>" +
        "<li>디 아더 사이드 오브 헤븐</li>" +
      "</ul>"+
    "</li>");
  }
}

function getBoxOffice(callbackfunction, date){
  var boxOfficeURL = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.xml?key="
  + movieKey + "&targetDt=" + date.toString();
  $.ajax({
    type:"GET",
    url:boxOfficeURL,
    error:function(request,status,error){

    },
    success: callbackfunction
  });
}

function getMovieListByNation(callback, nation, year, page){
  var nationURL = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.xml?key="
  + movieKey + "&repNationCd=" + nation +"&curPage=" + page + "&openStartDt=" + year + "&openEndDt=" + year;
  $.ajax({
    type:"GET",
    url:nationURL,
    error:function(request,status,error){

    },
    success: callback
  });
}

function getPeopleList(callback, arg, page){
  peopleURL = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/people/searchPeopleList.xml?key=" + movieKey;
  if($('#peopleSelect').val() == "name"){
    peopleURL += "&peopleNm=" + encodeURIComponent(arg);
  }else if($('#peopleSelect').val() == "movie"){
    peopleURL += "&filmoNames=" + encodeURIComponent(arg);
  }
  peopleURL += "&curPage=" + page;
  $.ajax({
    type:"GET",
    url:peopleURL,
    error:function(request,status,error){

    },
    success: callback
  });
}

function getMovieListByName(callback, movieName, page){
  var nationURL = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.xml?key="
  + movieKey + "&movieNm=" + encodeURIComponent(movieName) +"&curPage=" + page;
  $.ajax({
    type:"GET",
    url:nationURL,
    error:function(request,status,error){

    },
    success: callback
  });
}

function getMovieSpecification(movieNm){
  $('#movie_specification > iframe').show();
  var specURL = "https://apis.daum.net/contents/movie?apikey=" + daumKey +"&q=" + encodeURIComponent(movieNm) + "&output=xml";
  $.ajax({
    type:"GET",
    url:specURL,
    error:function(request,status,error){
      hideLoadingBar();
    },
    success: function(data){
      var xmlParser = new DOMParser();
      var xmlDocument = xmlParser.parseFromString(data.responseText, "text/xml");
      var totalCount = xmlDocument.getElementsByTagName('totalCount')[0].childNodes[0].nodeValue;
      if(totalCount == 0){
        alert('지원하지 않는 영화입니다.');
        $('#movie_specification').hide();
      }else{
        $('#movie_specification > h3').text(movieNm);
        try{
          var thumb = xmlDocument.getElementsByTagName('thumbnail')[0].getElementsByTagName('content')[0].childNodes[0].nodeValue;
          $('#movie_specification > img').attr("src", thumb);
        }catch(err){
          $('#movie_specification > img').attr("src", "res/onerr.png");
        }
        var open_info = xmlDocument.getElementsByTagName('open_info')[0].getElementsByTagName('content');
        $('#spec_subinfo').text(contentToString(open_info));
        var story = xmlDocument.getElementsByTagName('story')[0].getElementsByTagName('content')[0].childNodes[0].nodeValue;
        $('#spec_story').text(story);
        var director = xmlDocument.getElementsByTagName('director')[0].getElementsByTagName('content');
        $('#spec_directors').text(contentToString(director));
        var actor = xmlDocument.getElementsByTagName('actor')[0].getElementsByTagName('content');
        $('#spec_actors').text(contentToString(actor) + "...");
        var genre, nation;
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
        $('#spec_subinfo').html($('#spec_subinfo').text() + "<br>" + nation + "<br>" + genre);
        try{
          var photoList = xmlDocument.getElementsByTagName('photo_info')[0].getElementsByTagName('link')[0].childNodes[0].nodeValue;
          $('#movie_specification > iframe').attr('src', photoList);
        }catch(err){
        $('#movie_specification > iframe').hide();
        }
        try{
          var grade = xmlDocument.getElementsByTagName('grades')[0].getElementsByTagName('content')[0].childNodes[0].nodeValue;
          $('#grade').html("<span>★</span>" + grade);
        }catch(err){
          var grade = "미평가";
          $('#grade').html("<span>★</span>" + grade);
        }
        try{
          var audi = xmlDocument.getElementsByTagName('audience')[0].getElementsByTagName('content')[0].childNodes[0].nodeValue;
          $('#spec_audi').text(numberComma(audi) + "명");
        }catch(err){
          $('#spec_audi').text("미측정");
        }
      }
      hideLoadingBar();
    }
  });
}

function getPosterURL(callbackVariable, imgNode, immediateUpdate){
  var requestURL = "https://apis.daum.net/contents/movie?apikey=" + daumKey + "&q=" + encodeURIComponent(callbackVariable.movieNm) + "&output=xml";
  $.ajax({
    type:"GET",
    url:requestURL,
    error:function(request,status,error){

    },
    success: function(data){
      var xmlParser = new DOMParser();
      var xmlDocument = xmlParser.parseFromString(data.responseText, "text/xml");
      var poster = xmlDocument.getElementsByTagName('thumbnail')[0];
      try{
        poster = poster.getElementsByTagName('content')[0].childNodes[0].nodeValue;
        callbackVariable.poster = poster;
        if(immediateUpdate){
          //$('#poster_main').attr("src", poster);
          imgNode.setAttribute('src', poster);
        }
      }catch(err){
        if(immediateUpdate){
          imgNode.setAttribute('src', "res/onerr.png");
        }
      }
    }
  });
}

function updateMainView(index){
  var changedvalue,changedSymbol;
  changedSymbol = "▲";
  changedvalue = boxOfficeArray[index].audiCnt;
  $('#poster_main').attr("src", boxOfficeArray[index].poster);
  $('#rank').text("랭킹 " + boxOfficeArray[index].rank + "위");
  $('#rankInten').text(boxOfficeArray[index].rankInten);
  $('#movieNm').text(boxOfficeArray[index].movieNm);
  $('#openDt').text(boxOfficeArray[index].openDt);
  $('#salesAcc').text(numberComma(boxOfficeArray[index].salesAcc) + "원");
  $('#audiAcc').text(numberComma(boxOfficeArray[index].audiAcc) + "명");
  $('#audiCnt').text("(전일 대비 " + numberComma(changedvalue) + "명 증가)");
  $('#showCnt').text(numberComma(boxOfficeArray[index].showCnt) + "번");
  var trs = document.getElementsByTagName('tr');
  for(var i = 0 ; i < trs.length; i++){
    trs[i].style.backgroundColor = "AntiqueWhite";
  }
  trs[index + 1].style.backgroundColor = "DeepSkyBlue";
}

function boxOfficeCallback(data){
  var rank, rankInten, movieNm, openDt, salesAcc, audiAcc, audiCnt, showCnt;
  var xmlParser = new DOMParser();
  var xmlDocument = xmlParser.parseFromString(data.responseText, "text/xml");
  var movieElement = xmlDocument.getElementsByTagName('dailyBoxOffice');
  for(var i = 0 ; i < 10; i++){
    rank = movieElement[i].getElementsByTagName('rank')[0].childNodes[0].nodeValue;
    rankInten = movieElement[i].getElementsByTagName('rankInten')[0].childNodes[0].nodeValue;
    movieNm = movieElement[i].getElementsByTagName('movieNm')[0].childNodes[0].nodeValue;
    openDt = movieElement[i].getElementsByTagName('openDt')[0].childNodes[0].nodeValue;
    salesAcc = movieElement[i].getElementsByTagName('salesAcc')[0].childNodes[0].nodeValue;
    audiAcc = movieElement[i].getElementsByTagName('audiAcc')[0].childNodes[0].nodeValue;
    audiCnt = movieElement[i].getElementsByTagName('audiCnt')[0].childNodes[0].nodeValue;
    showCnt = movieElement[i].getElementsByTagName('showCnt')[0].childNodes[0].nodeValue;

    var movieObject = new Object();
    movieObject.rank = rank;
    movieObject.rankInten = rankInten;
    movieObject.movieNm = movieNm;
    movieObject.openDt = openDt;
    movieObject.salesAcc = salesAcc;
    movieObject.audiAcc = audiAcc;
    movieObject.audiCnt = audiCnt;
    movieObject.showCnt = showCnt;

    boxOfficeArray[boxOfficeArray.length] = movieObject;
    if(i == 0){
      var changedvalue,changedSymbol;
      changedSymbol = "▲";
      changedvalue = boxOfficeArray[i].audiCnt;
      $('#rank').text("랭킹 " + boxOfficeArray[i].rank + "위");
      $('#rankInten').text(boxOfficeArray[i].rankInten);
      $('#movieNm').text(boxOfficeArray[i].movieNm);
      $('#openDt').text(boxOfficeArray[i].openDt);
      $('#salesAcc').text(numberComma(boxOfficeArray[i].salesAcc) + "원");
      $('#audiAcc').text(numberComma(boxOfficeArray[i].audiAcc) + "명");
      $('#audiCnt').text("(전일 대비 " + numberComma(changedvalue) + "명 증가)");
      $('#showCnt').text(numberComma(boxOfficeArray[i].showCnt) + "번");
      getPosterURL(boxOfficeArray[i], document.getElementById('poster_main') , true);
    }else{
      getPosterURL(boxOfficeArray[i], null ,false);
    }
  }

  for(var i = 0 ; i < 10; i ++){
    var changedvalue,changedSymbol;
    var classNamel
    if(boxOfficeArray[i].rankInten > 0){//랭킹 상승
      changedSymbol = "▲";
      changedvalue = boxOfficeArray[i].rankInten;
      className = "red";
    }else if(boxOfficeArray[i].rankInten == 0){//변동 없음
      changedSymbol = "〓";
      changedvalue = "";
      className = "gray";
    }else{//떨어졌을 때
      changedSymbol = "▼";
      changedvalue = boxOfficeArray[i].rankInten * (-1);
      className = "blue";
    }
    tablerows = document.getElementsByClassName('boxOfficeTable')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    tablerows[i].getElementsByTagName('td')[0].innerHTML = boxOfficeArray[i].rank + "(<span class='" + className + "'>" + changedSymbol + changedvalue + "</span>)";
    tablerows[i].getElementsByTagName('td')[1].innerHTML = boxOfficeArray[i].movieNm;
  }
  startAutoPaging = setInterval(function() {
    if(main_currentIndex >= boxOfficeArray.length - 1)
      main_currentIndex = -1;
    updateMainView(++main_currentIndex);
  }, 3000);
  document.getElementsByTagName('tr')[1].style.backgroundColor = "DeepSkyBlue";
}

function recommendCallBack(data){
  $('.recommendList').empty();
  var rank, rankInten, movieNm, openDt, salesAcc, audiAcc, audiCnt, showCnt;
  var xmlParser = new DOMParser();
  var xmlDocument = xmlParser.parseFromString(data.responseText, "text/xml");
  var movieElement = xmlDocument.getElementsByTagName('dailyBoxOffice');
  for(var i = 0 ; i < 10; i++){
    try{
      rank = movieElement[i].getElementsByTagName('rank')[0].childNodes[0].nodeValue;
    }catch(err){
      $(".menu_item:contains('추천')").click();
      return;
    }
    try{
      movieNm = movieElement[i].getElementsByTagName('movieNm')[0].childNodes[0].nodeValue;
    }catch(err){
      movieNm = "ERR";
    }
    try{
      openDt = movieElement[i].getElementsByTagName('openDt')[0].childNodes[0].nodeValue;
    }catch(err){
      openDt = "미정";
    }

    var movieObject = new Object();
    movieObject.rank = rank;
    movieObject.movieNm = movieNm;
    movieObject.openDt = openDt;
    recommendArray[i] = movieObject;
  }
  var newLi;
  for(var i = 0; i < 10 ; i ++){
    var requestURL = "https://apis.daum.net/contents/movie?apikey=" + daumKey + "&q=" + encodeURIComponent(recommendArray[i].movieNm) + "&output=xml";
    newLi = document.createElement('li');
    var newPoster = document.createElement('img');
    var newP = document.createElement('p');
    var newA = document.createElement('a');
    newA.innerHTML = "자세히 보기 &gt;";
    newP.innerHTML = recommendArray[i].rank + "위<br><span>" +
    recommendArray[i].movieNm + "</span><br>" + recommendArray[i].openDt;
    newLi.appendChild(newPoster);
    newLi.appendChild(newP);
    newLi.appendChild(newA);
    document.getElementsByClassName('recommendList')[0].appendChild(newLi);
    getPosterURL(recommendArray[i], newPoster, true);
  }
  hideLoadingBar();
}

function nationCallback(data){
  $('.nationList').empty();
  var movieNm, genreAlt;
  var xmlParser = new DOMParser();
  var xmlDocument = xmlParser.parseFromString(data.responseText, "text/xml");
  var totalCount = xmlDocument.getElementsByTagName('totCnt')[0].childNodes[0].nodeValue;
  $('#nation_resultCount').text("총 " + totalCount + "개의 검색 결과");
  totalPageCount = parseInt(totalCount / 10);
  if(totalCount % 10 != 0){
    totalPageCount++;
  }
  var calculatePage = parseInt(currentPage / 10);
  generatePage(totalPageCount, calculatePage * 10 + 1 , "nation_page");
  if(totalCount == 0){
    alert('검색 결과가 없습니다');
    $('#nation_noresult').show();
  }else{
    $('#nation_noresult').hide();
  }
  var movieElement = xmlDocument.getElementsByTagName('movie');
  for(var i = 0 ; i < movieElement.length; i++){
    movieNm = movieElement[i].getElementsByTagName('movieNm')[0].childNodes[0].nodeValue;
    genreAlt = movieElement[i].getElementsByTagName('genreAlt')[0].childNodes[0].nodeValue;

    var movieObject = new Object();
    movieObject.movieNm = movieNm;
    movieObject.genreAlt = genreAlt;
    nationArray[i] = movieObject;
  }
  var newLi;
  for(var i = 0; i < movieElement.length ; i ++){
    var requestURL = "https://apis.daum.net/contents/movie?apikey=" + daumKey + "&q=" + encodeURIComponent(nationArray[i].movieNm) + "&output=xml";
    newLi = document.createElement('li');
    var newPoster = document.createElement('img');
    var newP = document.createElement('p');
    var newA = document.createElement('a');
    newA.innerHTML = "자세히 보기 &gt;";
    newP.innerHTML = "<span>" + nationArray[i].movieNm + "</span><br>" + nationArray[i].genreAlt;
    newLi.appendChild(newPoster);
    newLi.appendChild(newP);
    newLi.appendChild(newA);
    document.getElementsByClassName('nationList')[0].appendChild(newLi);
    getPosterURL(nationArray[i], newPoster, true);
  }
  hideLoadingBar();
}

function peopleCallBack(data){
  $('#peopleList').empty();
  var peopleNm, peopleNmEn, repRoleNm, filmoNames;
  var xmlParser = new DOMParser();
  var xmlDocument = xmlParser.parseFromString(data.responseText, "text/xml");
  var totalCount = xmlDocument.getElementsByTagName('totCnt')[0].childNodes[0].nodeValue;
  $('#people_resultCount').text("총 " + totalCount + "개의 검색 결과");
  totalPageCount = parseInt(totalCount / 10);
  if(totalCount % 10 != 0){
    totalPageCount++;
  }
  var calculatePage = parseInt(currentPage / 10);
  generatePage(totalPageCount, calculatePage * 10 + 1 , "people_page");
  if(totalCount == 0){
    alert('검색 결과가 없습니다');
    $('#people_noresult').show();
  }else{
    $('#people_noresult').hide();
  }

  var people = xmlDocument.getElementsByTagName('people');

  for(var i = 0 ; i < people.length; i++){
    peopleNm = people[i].getElementsByTagName('peopleNm')[0].childNodes[0].nodeValue;
    try{
      peopleNmEn = people[i].getElementsByTagName('peopleNmEn')[0].childNodes[0].nodeValue;
    }catch(err){
      peopleNmEn = "";
    }
    try{
      repRoleNm = people[i].getElementsByTagName('repRoleNm')[0].childNodes[0].nodeValue;
    }catch(err){
      repRoleNm = "";
    }
    try{
      filmoNames = people[i].getElementsByTagName('filmoNames')[0].childNodes[0].nodeValue;
    }catch(err){
      filmoNames = "";
    }

    var peopleObject = new Object();
    peopleObject.peopleNm = peopleNm;
    peopleObject.peopleNmEn = peopleNmEn;
    peopleObject.repRoleNm = repRoleNm;
    peopleObject.filmoNames = filmoNames;
    var content;
    var newLi = document.createElement('li');
    if(peopleNmEn==""){
      content = "<p id='peopleName'><strong>" + peopleNm + "</strong></p>" +
      "<p id='role'>" + repRoleNm + "</p><span>참여 작품</span><ul>";
    }else{
      content = "<p id='peopleName'><strong>" + peopleNm + "</strong>(" + peopleNmEn + ")</p>" +
      "<p id='role'>" + repRoleNm + "</p><span>참여 작품</span><ul>";
    }


    var movieSplit = filmoNames.split('|');
    for(var j = 0 ; j < movieSplit.length; j++){
      content += "<li>" + movieSplit[j] + "</li>";
    }
    content += "</ul>"
    newLi.innerHTML = content;
    document.getElementById('peopleList').appendChild(newLi);
  }
  hideLoadingBar();
}

function searchCallback(data){
  $('#searchList').empty();
  var movieNm, genreAlt;
  var xmlParser = new DOMParser();
  var xmlDocument = xmlParser.parseFromString(data.responseText, "text/xml");
  var totalCount = xmlDocument.getElementsByTagName('totCnt')[0].childNodes[0].nodeValue;
  $('#search_resultCount').text("총 " + totalCount + "개의 검색 결과");
  totalPageCount = parseInt(totalCount / 10);
  if(totalCount % 10 != 0){
    totalPageCount++;
  }
  var calculatePage = parseInt(currentPage / 10);
  generatePage(totalPageCount, calculatePage * 10 + 1 , "search_page");
  if(totalCount == 0){
    alert('검색 결과가 없습니다');
    $('#search_noresult').show();
  }else{
    $('#search_noresult').hide();
  }
  var movieElement = xmlDocument.getElementsByTagName('movie');
  for(var i = 0 ; i < movieElement.length; i++){
    try{
      movieNm = movieElement[i].getElementsByTagName('movieNm')[0].childNodes[0].nodeValue;
    }catch(err){
      movieNm = "";
    }
    try{
      genreAlt = movieElement[i].getElementsByTagName('genreAlt')[0].childNodes[0].nodeValue;
    }catch(err){
      genreAlt = "";
    }


    var newLi;
    var requestURL = "https://apis.daum.net/contents/movie?apikey=" + daumKey + "&q=" + encodeURIComponent(movieNm) + "&output=xml";
    newLi = document.createElement('li');
    var newPoster = document.createElement('img');
    var newP = document.createElement('p');
    var newA = document.createElement('a');
    newA.innerHTML = "자세히 보기 &gt;";
    newP.innerHTML = "<span>" + movieNm + "</span><br>" + genreAlt;
    newLi.appendChild(newPoster);
    newLi.appendChild(newP);
    newLi.appendChild(newA);
    document.getElementById('searchList').appendChild(newLi);
    var tmpObj = new Object();
    tmpObj.movieNm = movieNm;
    getPosterURL(tmpObj, newPoster, true);
  }
  hideLoadingBar();
}

//----기능적인 메소드들----//
$.fn.multiline = function(text){
    this.text(text);
    this.html(this.html().replace(/\n/g,'<br/>'));
    return this;
}

function numberComma(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getYesterdayDate(){
  var today = new Date();
  var yesterday = new Date(today.valueOf() - (24*60*60*1000));
  var year = yesterday.getFullYear().toString();
  var month = (yesterday.getMonth() + 1).toString();
  var date = yesterday.getDate().toString();

  if(month.length < 2){
    month = '0' + month;
  }
  if(date.length < 2){
    date = '0' + date;
  }
  return year.toString() + month.toString() + date.toString();
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

//----기능적인 메소드들 END----//
function initRecommend(){
  var today = new Date(), randomYear, randomMonth, randomDate;
  var currentYear = today.getFullYear(), currentMonth = today.getMonth() + 1, currentDate=today.getDate();
  randomYear = Math.floor(Math.random() * (currentYear - 2012 + 1) + 2012);
  if(randomYear == currentYear){
    randomMonth = Math.floor(Math.random() * 12) + 1;
    randomDate = Math.floor(Math.random() * 30) + 1;
    while(randomMonth >= currentMonth){
      randomMonth = Math.floor(Math.random() * 12) + 1;
      randomDate = Math.floor(Math.random() * 30) + 1;
    }
  }else{
    randomMonth = Math.floor(Math.random() * 12) + 1;
    randomDate = Math.floor(Math.random() * 30) + 1;
  }
  if(randomMonth < 10)
    randomMonth = "0" + randomMonth.toString();
  if(randomDate < 10)
    randomDate = "0" + randomDate.toString();
  result = randomYear.toString() + '-' + randomMonth.toString() + '-' + randomDate.toString();
  var yesterday = getYesterdayDate();
  var max = yesterday.charAt(0) + yesterday.charAt(1) + yesterday.charAt(2) + yesterday.charAt(3) + '-' +
  yesterday.charAt(4) + yesterday.charAt(5) + '-' + yesterday.charAt(6) + yesterday.charAt(7);
  $('input[type=date]').attr("min", "2004-01-01");
  $('input[type=date]').attr("max", max);
  $('input[type=date]').val(result);

  var targetDate = "";
  for(var i = 0; i < 3; i++){
    targetDate += result.split('-')[i].toString();
  }
  getBoxOffice(recommendCallBack, targetDate);
}

function initNation(){
  $('.nationList').empty();
  $('#nation_page').empty();
  for(var i = new Date().getFullYear(); i >= 2004 ; i--){
    var newOption = document.createElement('option');
    newOption.value = i;
    newOption.text = i;
    if(i == new Date().getFullYear()){
      newOption.selected = true;
    }
    document.getElementsByClassName('nationOpenDt')[0].appendChild(newOption);
  }
  var nationCodeURL = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/code/searchCodeList.xml?key=" + movieKey + "&comCode=2204";
  $.ajax({
    type:"GET",
    url:nationCodeURL,
    error:function(request,status,error){

    },
    success: function(data){
      $('.nationSelect').empty();
      var xmlParser = new DOMParser();
      var xmlDocument = xmlParser.parseFromString(data.responseText, "text/xml");
      var nationCodes = xmlDocument.getElementsByTagName('code');
      var newOption = document.createElement('option');
      for(var i = 0 ; i < nationCodes.length; i++){
        var code = nationCodes[i].getElementsByTagName('fullCd')[0].childNodes[0].nodeValue;
        var name = nationCodes[i].getElementsByTagName('korNm')[0].childNodes[0].nodeValue;
        var nationObject = new Object();
        nationObject.code = code;
        nationObject.name = jQuery.trim(name);
        nationArray[i] = nationObject;
      }

      nationArray.sort(function(a, b){
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      });

      for(var i = 0 ; i < nationArray.length; i++){
        var newOption = document.createElement('option');
        newOption.value = nationArray[i].code;
        newOption.text = nationArray[i].name;
        if(nationArray[i].name=="한국"){
          newOption.selected = true;
        }else if(nationArray[i].name == "기타"){
          continue;
        }
        document.getElementsByClassName('nationSelect')[0].appendChild(newOption);
      }

      $('#nation_submit').trigger('click');
      goTop();
    }
  });
}

function generatePage(maxPage, start, pageId){
  $('#' + pageId).empty();
  if(start > 10){
    var newPage = document.createElement('li');
    newPage.innerHTML="이전";
    newPage.setAttribute("style", "font-weight:bold;");
    newPage.setAttribute("style", "cursor:pointer;");
    document.getElementById(pageId).appendChild(newPage);
  }
  for(var i = start; i <= maxPage && i < start + 10; i++){
    var newPage = document.createElement('li');
    newPage.innerHTML=i;
    if(i == currentPage){
      newPage.setAttribute("style", "font-weight:bold;color:#32CDA0;");
    }else{
      newPage.setAttribute("style", "cursor:pointer;");
    }
    document.getElementById(pageId).appendChild(newPage);
  }
  if(maxPage >= start + 10){
    var newPage = document.createElement('li');
    newPage.innerHTML="다음";
    newPage.setAttribute("style", "font-weight:bold;");
    newPage.setAttribute("style", "cursor:pointer;");
    document.getElementById(pageId).appendChild(newPage);
  }
}

function showLoadingbar(){
  $('#loadingbar').removeClass('hidden');
}

function hideLoadingBar(){
  $('#loadingbar').addClass('hidden');
}

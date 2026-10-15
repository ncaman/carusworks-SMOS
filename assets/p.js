/* carusworks 제품 라인 공통 앱 — AS 모듈 실행기·절약 계산기·카탈로그, SMOS 태블릿·가게 리포트 */
(function(){
  var $ = function(i){ return document.getElementById(i); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var won = function(v){ v = Math.round(v); if(Math.abs(v) >= 1e8){ var e = Math.floor(v/1e8), m = Math.round((v%1e8)/1e6)*100; return e+"억"+(m ? " "+m.toLocaleString()+"만" : "")+" 원"; } return Math.round(v/1e4).toLocaleString()+"만 원"; };
  var wonK = function(v){ return Math.round(v).toLocaleString()+"원"; };

  /* AS 모듈 실행기 */
  if($("rSay")){
    var M = [
      {say:"이번 달 신청할 수 있는 정부지원사업 찾아서 마감 순으로 정리해 줘", risk:["safe","일반 · 3,000원~"],
       steps:[["조회","기업마당 공고 조건 조회","6건"],["정리","마감 순 정렬 · 자격 요건 표시","마감 7일 내 2건"],["준비","신청서 기입 항목 준비","2건"],["확인","제출은 고객 인증으로","고객 확인"]]},
      {say:"주민등록등본이랑 가족관계증명서 발급해서 PDF로 모아 줘", risk:["safe","일반 · 3,000원~"],
       steps:[["조회","정부24 발급 메뉴 확인","2종"],["준비","발급 신청 기입","2건"],["확인","본인 인증 요청","고객 휴대폰"],["정리","PDF 묶음 저장","1개 파일"]]},
      {say:"지난번 소송 준비서면 보정 명령 온 거 기입 준비해 줘", risk:["high","전문가 검토 · 주문형"],
       steps:[["조회","전자소송 사건 진행 조회","보정 명령 1건"],["준비","보정서 서식 기입 준비","초안 1건"],["검토","전문가 검토 요청","변호사 검토"],["확인","제출은 고객 인증으로","고객 확인"]]},
      {say:"이번 주 영상 3편 썸네일 만들고 유튜브에 예약 올려 줘", risk:["safe","일반 · 3,000원~"],
       steps:[["제작","썸네일 3종 생성","3장"],["점검","제목·설명·규격 검수","통과 3편"],["준비","업로드 예약 설정","3건"],["확인","채널 권한 확인","완료"]]}
    ];
    var tabs = document.querySelectorAll(".runner .dtabs button"), cur = 0, tm = [];
    var clr = function(){ tm.forEach(clearTimeout); tm = []; };
    var show = function(i){
      clr(); cur = i; var d = M[i];
      [].forEach.call(tabs, function(t, j){ t.setAttribute("aria-selected", j === i ? "true" : "false"); });
      $("rSay").textContent = d.say;
      $("rSteps").innerHTML = d.steps.map(function(s){ return '<li><b>✓</b><span>'+s[0]+' · '+s[1]+'</span><em>'+s[2]+'</em></li>'; }).join("");
      $("rRisk").innerHTML = '위험 등급 <b class="rk-'+d.risk[0]+'">'+d.risk[1]+'</b>';
      $("rBtn").disabled = false; $("rBtn").textContent = "실행";
    };
    var run = function(){
      clr(); var items = $("rSteps").querySelectorAll("li"); $("rBtn").disabled = true; $("rBtn").textContent = "실행 중";
      [].forEach.call(items, function(li, k){ li.classList.remove("on"); tm.push(setTimeout(function(){ li.classList.add("on"); if(k === items.length-1){ $("rBtn").textContent = "완료"; } }, reduce ? 0 : 450 + k*600)); });
    };
    [].forEach.call(tabs, function(t, j){ t.addEventListener("click", function(){ show(j); run(); }); });
    $("rBtn").addEventListener("click", run);
    show(0); if(!reduce) setTimeout(run, 800); else run();
  }

  /* AS 절약 계산기 */
  if($("asCalc")){
    var tiers = [["주니어", 3000], ["시니어", 5000]], tier = 0, v = {n:20, m:40, w:3};
    var K = [["n","월 처리 건수",1,200,1,"건"],["m","건당 직접 처리 시간",5,180,5,"분"],["w","시간당 가치",1,10,.5,"만 원"]];
    var el = $("asCalc"); el.classList.add("calc");
    var draw = function(){
      var hours = v.n*v.m/60, value = hours*v.w*1e4, fee = v.n*tiers[tier][1], net = value - fee;
      el.querySelector(".big").innerHTML = '한 달에 <b>'+hours.toFixed(1)+'시간</b>, <b>'+won(value)+'</b>어치 일을 모듈에 맡깁니다.';
      el.querySelector(".rows").innerHTML = '<div><span>이용료 ('+tiers[tier][0]+' '+wonK(tiers[tier][1])+' × '+v.n+'건)</span><b>'+wonK(fee)+'</b></div><div><span>아낀 시간의 가치</span><b>'+won(value)+'</b></div><div><span>월 순효과</span><b>'+(net >= 0 ? "+" : "−")+won(Math.abs(net))+'</b></div>';
      el.querySelector(".todo").textContent = net > 0 ? "권고 · 이 업무는 모듈에 맡기는 편이 매달 "+won(net)+" 이득입니다." : "권고 · 건당 시간이 짧아 직접 하는 편이 낫습니다.";
      K.forEach(function(k){ el.querySelector('output[data-k="'+k[0]+'"]').textContent = (+v[k[0]]).toLocaleString()+k[5]; });
    };
    el.innerHTML = '<div class="seg">'+tiers.map(function(t, i){ return '<button type="button" data-t="'+i+'" aria-pressed="'+(i===tier)+'">'+t[0]+' '+wonK(t[1])+'</button>'; }).join("")+'</div><div class="ck">'
      + K.map(function(k){ return '<label><span>'+k[1]+'</span><output data-k="'+k[0]+'"></output><input type="range" data-k="'+k[0]+'" min="'+k[2]+'" max="'+k[3]+'" step="'+k[4]+'" value="'+v[k[0]]+'"></label>'; }).join("")
      + '</div><p class="big"></p><div class="rows"></div><p class="todo"></p><figcaption>예시 · 계산식은 아래 공개</figcaption>';
    el.addEventListener("input", function(e){ if(e.target.dataset.k){ v[e.target.dataset.k] = +e.target.value; draw(); } });
    el.addEventListener("click", function(e){ var b = e.target.closest("[data-t]"); if(!b) return; tier = +b.dataset.t; [].forEach.call(el.querySelectorAll("[data-t]"), function(x){ x.setAttribute("aria-pressed", x === b); }); draw(); });
    draw();
  }

  /* AS 카탈로그 필터 */
  if($("cards") && window.STAFF){
    var f = {lane:"", risk:""}, L = {safe:"일반", mid:"확인 필요", high:"전문가 검토"};
    var paint = function(){
      var list = window.STAFF.filter(function(s){ var lane = s[1] === "콘텐츠" ? "con" : "pub"; return (!f.lane || f.lane === lane) && (!f.risk || f.risk === s[4]); });
      $("cards").innerHTML = list.map(function(s){ return '<article class="card"><p class="g">'+s[1]+'</p><h3>'+s[0]+'</h3><p>'+s[3]+'</p><span class="ch">'+s[2]+'</span><em class="r-'+s[4]+'">'+L[s[4]]+'</em></article>'; }).join("");
      $("cnt").textContent = list.length+"개 모듈";
    };
    $("filt").addEventListener("click", function(e){ var b = e.target.closest("button"); if(!b) return; f[b.dataset.f] = b.dataset.v;
      [].forEach.call($("filt").querySelectorAll('[data-f="'+b.dataset.f+'"]'), function(x){ x.setAttribute("aria-pressed", x === b); }); paint(); });
    paint();
  }

  /* SMOS 태블릿 */
  if($("kSay") && window.KIT){
    var kt = document.querySelectorAll(".tablet .dtabs button"), kc = 0, kt2 = [];
    var kshow = function(i){
      kt2.forEach(clearTimeout); kt2 = []; kc = i; var k = window.KIT[i];
      [].forEach.call(kt, function(t, j){ t.setAttribute("aria-selected", j === i ? "true" : "false"); });
      $("kSay").textContent = k[2]; $("kDesc").textContent = k[1];
      $("kRes").innerHTML = '<div class="ln"><i></i></div><div class="ln"><i></i></div><div class="ln"><i></i></div>';
      $("kBtn").disabled = false; $("kBtn").textContent = "실행";
    };
    var krun = function(){
      var k = window.KIT[kc], ls = $("kRes").querySelectorAll(".ln i"); $("kBtn").disabled = true; $("kBtn").textContent = "실행 중";
      [].forEach.call(ls, function(l, j){ kt2.push(setTimeout(function(){ l.style.width = "100%"; }, reduce ? 0 : j*400)); });
      kt2.push(setTimeout(function(){ $("kRes").insertAdjacentHTML("beforeend", '<div class="out"><small>완료</small>'+k[3]+'</div>'); $("kBtn").textContent = "완료"; }, reduce ? 0 : 1800));
    };
    [].forEach.call(kt, function(t, j){ t.addEventListener("click", function(){ kshow(j); krun(); }); });
    $("kBtn").addEventListener("click", function(){ kshow(kc); krun(); });
    kshow(0); setTimeout(krun, reduce ? 0 : 900);
  }

  /* SMOS 가게 리포트 계산기 */
  if($("smCalc")){
    var B = {"빵집":[1800,120,35],"요식":[3500,90,30],"부동산":[2500,6,20],"폰 매장":[4000,25,25],"스튜디오":[1500,4,40]}, biz = "빵집";
    var s = {r:1800, c:120, p:35, up:5};
    var SK = [["r","월 매출",300,10000,100,"만 원"],["c","하루 손님",1,300,1,"명"],["p","재방문 손님 비율",5,80,1,"%"],["up","재방문 손님 증가 목표",1,20,1,"%"]];
    var el2 = $("smCalc"); el2.classList.add("calc");
    var sdraw = function(){
      var avg = s.r*1e4/(s.c*26), gain = s.r*1e4*s.up/100;
      el2.querySelector(".big").innerHTML = '객단가 <b>'+wonK(avg)+'</b> · 다시 오는 손님이 하루 손님의 '+s.up+'%만큼 늘면 <b>매달 '+won(gain)+'</b>이 늘어납니다.';
      el2.querySelector(".rows").innerHTML = '<div><span>월 매출</span><b>'+won(s.r*1e4)+'</b></div><div><span>재방문 손님 (하루)</span><b>'+Math.round(s.c*s.p/100)+'명 → '+Math.round(s.c*s.p/100 + s.c*s.up/100)+'명</b></div><div><span>증가 매출 (월)</span><b>+'+won(gain)+'</b></div>';
      el2.querySelector(".todo").textContent = "이번 주 할 일 · 단골 손님에게 신메뉴 소식 문자 1회, SNS 게시 2건 (SMOS가 준비, 발송은 승인 후)";
      SK.forEach(function(k){ el2.querySelector('output[data-k="'+k[0]+'"]').textContent = (+s[k[0]]).toLocaleString()+k[5]; el2.querySelector('input[data-k="'+k[0]+'"]').value = s[k[0]]; });
    };
    el2.innerHTML = '<div class="seg">'+Object.keys(B).map(function(b){ return '<button type="button" data-b="'+b+'" aria-pressed="'+(b===biz)+'">'+b+'</button>'; }).join("")+'</div><div class="ck">'
      + SK.map(function(k){ return '<label><span>'+k[1]+'</span><output data-k="'+k[0]+'"></output><input type="range" data-k="'+k[0]+'" min="'+k[2]+'" max="'+k[3]+'" step="'+k[4]+'" value="'+s[k[0]]+'"></label>'; }).join("")
      + '</div><p class="big"></p><div class="rows"></div><p class="todo"></p><figcaption>예시 · 영업일 26일 기준, 계산식은 아래 공개</figcaption>';
    el2.addEventListener("input", function(e){ if(e.target.dataset.k){ s[e.target.dataset.k] = +e.target.value; sdraw(); } });
    el2.addEventListener("click", function(e){ var b = e.target.closest("[data-b]"); if(!b) return; biz = b.dataset.b; var d = B[biz]; s.r = d[0]; s.c = d[1]; s.p = d[2];
      [].forEach.call(el2.querySelectorAll("[data-b]"), function(x){ x.setAttribute("aria-pressed", x === b); }); sdraw(); });
    sdraw();
  }
})();

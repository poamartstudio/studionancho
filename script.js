(function () {
  "use strict";

  // /images 폴더 안의 이미지 파일 목록.
  // 정적 웹앱(서버 없이 파일 열기 / 정적 호스팅)에서는 폴더 스캔이 불가능하므로
  // 하드코딩 방식으로 관리합니다. 이미지를 추가/삭제할 때는 이 배열만 수정하면 됩니다.
  var IMAGES = [
    "images/1.png",
    "images/2.png",
    "images/3.png",
    "images/4.png",
    "images/5.png",
    "images/6.png",
    "images/7.png",
    "images/8.png",
    "images/9.png",
    "images/10.png",
    "images/11.png",
    "images/12.png",
    "images/13.png",
    "images/14.png",
    "images/15.png",
    "images/16.png",
    "images/17.png",
    "images/18.png",
    "images/19.png",
    "images/20.png",
    "images/21.png",
    "images/22.png",
    "images/23.png",
    "images/24.png",
    "images/25.png",
    "images/26.png"
  ];

  var homeScreen = document.getElementById("home-screen");
  var previewScreen = document.getElementById("preview-screen");
  var drawBtn = document.getElementById("draw-btn");
  var printBtn = document.getElementById("print-btn");
  var resetBtn = document.getElementById("reset-btn");
  var printImage = document.getElementById("print-image");

  var lastIndex = -1;
  var currentSrc = null;

  function pickRandomImage() {
    if (IMAGES.length === 1) {
      return IMAGES[0];
    }
    var index;
    do {
      index = Math.floor(Math.random() * IMAGES.length);
    } while (index === lastIndex);
    lastIndex = index;
    return IMAGES[index];
  }

  function showHomeScreen() {
    previewScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    printImage.removeAttribute("src");
    currentSrc = null;
  }

  // 사용자의 첫 탭(제스처) 응답으로 전체화면을 요청해 주소창을 숨긴다.
  // 브라우저/기기에 따라 지원하지 않거나 거부될 수 있어 실패해도 무시한다.
  function requestFullscreenOnce() {
    var el = document.documentElement;
    if (document.fullscreenElement) return;
    var request = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!request) return;
    try {
      var result = request.call(el);
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    } catch (e) {}
  }

  // 뽑기: 랜덤 이미지를 골라 미리보기 화면(이미지 + 인쇄/처음으로 버튼)을 보여줌
  function drawImage() {
    requestFullscreenOnce();
    currentSrc = pickRandomImage();

    function onImageReady() {
      printImage.removeEventListener("load", onImageReady);
      homeScreen.classList.add("hidden");
      previewScreen.classList.remove("hidden");
    }

    printImage.addEventListener("load", onImageReady);
    printImage.src = currentSrc;

    // 이미지가 이미 브라우저 캐시에 있어 즉시 로드가 끝난 경우 load 이벤트가
    // 발생하지 않을 수 있으므로 complete 여부를 직접 확인해 보완한다.
    if (printImage.complete && printImage.naturalWidth > 0) {
      onImageReady();
    }
  }

  // 인쇄: 폰트/애니메이션 등 복잡한 요소가 섞인 이 페이지에서 바로 window.print()를
  // 호출하면 브라우저별로 인쇄 렌더링이 꼬이는 경우가 있어, 사진 한 장만 있는
  // 별도의 print.html로 이동해 그곳에서 인쇄를 실행한다.
  function startPrint() {
    location.href = "print.html?src=" + encodeURIComponent(currentSrc);
  }

  drawBtn.addEventListener("click", drawImage);
  printBtn.addEventListener("click", startPrint);
  resetBtn.addEventListener("click", showHomeScreen);
})();

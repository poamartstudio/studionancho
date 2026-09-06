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
  var printTarget = document.getElementById("print-target");

  var lastIndex = -1;
  var resetTimer = null;
  var didReset = false;

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
    if (didReset) return;
    didReset = true;

    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }

    previewScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    printImage.removeAttribute("src");
    printTarget.style.backgroundImage = "";

    window.removeEventListener("afterprint", showHomeScreen);
  }

  // 뽑기: 랜덤 이미지를 골라 미리보기 화면(이미지 + 인쇄/처음으로 버튼)을 보여줌
  function drawImage() {
    didReset = false;

    var src = pickRandomImage();

    function onImageReady() {
      printImage.removeEventListener("load", onImageReady);
      // 인쇄 시에는 #print-image 대신 #print-target의 배경 이미지를 사용한다.
      printTarget.style.backgroundImage = 'url("' + src + '")';
      homeScreen.classList.add("hidden");
      previewScreen.classList.remove("hidden");
    }

    printImage.addEventListener("load", onImageReady);
    printImage.src = src;

    // 이미지가 이미 브라우저 캐시에 있어 즉시 로드가 끝난 경우 load 이벤트가
    // 발생하지 않을 수 있으므로 complete 여부를 직접 확인해 보완한다.
    if (printImage.complete && printImage.naturalWidth > 0) {
      onImageReady();
    }
  }

  // 인쇄: 미리보기 화면에서 사용자가 인쇄 버튼을 눌렀을 때만 AirPrint 시트를 띄움
  function startPrint() {
    // iOS Safari에서 afterprint 이벤트가 항상 안정적으로 발생하지 않는 경우를 대비해
    // 1) afterprint 리스너와 2) 일정 시간 후 자동 초기화 타이머, 3) 화면의 "처음으로" 버튼
    // 세 가지 안전장치를 함께 둔다.
    window.addEventListener("afterprint", showHomeScreen);
    resetTimer = setTimeout(showHomeScreen, 15000);

    window.print();
  }

  drawBtn.addEventListener("click", drawImage);
  printBtn.addEventListener("click", startPrint);
  resetBtn.addEventListener("click", showHomeScreen);
})();

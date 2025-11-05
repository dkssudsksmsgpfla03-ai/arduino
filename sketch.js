// 가속도 센서 변수
let accelX = 0;
let accelY = 0;
let accelZ = 0;
let permissionGranted = false;

// 원의 위치와 속도
let ballX, ballY;
let ballVx = 0;
let ballVy = 0;
let ballRotation = 0;

// 가속도 센서 활성화 버튼
let accelBtn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 초기 원 위치 (중앙)
  ballX = width / 2;
  ballY = height / 2;
  
  // 가속도 센서 활성화 버튼 생성
  accelBtn = createButton("가속도 센서 활성화");
  accelBtn.mousePressed(requestAccelPermission);
  accelBtn.size(150, 40);
  accelBtn.position(20, 20);
  accelBtn.style('font-size', '16px');
}

function draw() {
  background(220);
  
  // 가속도 센서 값 텍스트로 출력
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text("가속도 X: " + accelX.toFixed(2), 20, 80);
  text("가속도 Y: " + accelY.toFixed(2), 20, 100);
  text("가속도 Z: " + accelZ.toFixed(2), 20, 120);
  text("권한 상태: " + (permissionGranted ? "허용됨" : "거부됨"), 20, 140);
  
  // 가속도 값에 따라 원의 속도 업데이트
  if (permissionGranted) {
    // 가속도 값을 속도에 반영 (스케일 조정)
    ballVx += accelX * 0.5;
    ballVy += accelY * 0.5;
    
    // 마찰 적용
    ballVx *= 0.95;
    ballVy *= 0.95;
    
    // 위치 업데이트
    ballX += ballVx;
    ballY += ballVy;
    
    // 회전 업데이트 (속도에 따라)
    ballRotation += sqrt(ballVx * ballVx + ballVy * ballVy) * 0.1;
    
    // 벽 충돌 처리
    if (ballX < 10) {
      ballX = 10;
      ballVx *= -0.8;
    }
    if (ballX > width - 10) {
      ballX = width - 10;
      ballVx *= -0.8;
    }
    if (ballY < 10) {
      ballY = 10;
      ballVy *= -0.8;
    }
    if (ballY > height - 10) {
      ballY = height - 10;
      ballVy *= -0.8;
    }
  }
  
  // 중앙에 지름 20인 파란색 원 그리기
  push();
  translate(ballX, ballY);
  rotate(ballRotation);
  fill(0, 0, 255); // 파란색
  noStroke();
  circle(0, 0, 20);
  
  // 원의 방향 표시를 위한 작은 선
  stroke(255);
  strokeWeight(2);
  line(0, 0, 8, 0);
  pop();
}

// 가속도 센서 권한 요청
function requestAccelPermission() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    // iOS 13+ 권한 요청
    DeviceMotionEvent.requestPermission()
      .then(response => {
        if (response == 'granted') {
          permissionGranted = true;
          window.addEventListener('devicemotion', handleMotion);
          accelBtn.html("가속도 센서 활성화됨");
          accelBtn.attribute('disabled', '');
        } else {
          permissionGranted = false;
          alert('가속도 센서 권한이 거부되었습니다.');
        }
      })
      .catch(console.error);
  } else {
    // Android 또는 구형 iOS
    permissionGranted = true;
    window.addEventListener('devicemotion', handleMotion);
    accelBtn.html("가속도 센서 활성화됨");
    accelBtn.attribute('disabled', '');
  }
}

// 가속도 센서 값 처리
function handleMotion(event) {
  if (event.accelerationIncludingGravity) {
    // 가속도 값 읽기 (m/s²)
    accelX = event.accelerationIncludingGravity.x || 0;
    accelY = event.accelerationIncludingGravity.y || 0;
    accelZ = event.accelerationIncludingGravity.z || 0;
    
    // Y축 반전 (화면 좌표계에 맞게)
    accelY = -accelY;
  }
}


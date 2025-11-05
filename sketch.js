// 소문자 (아두이노와 동일하게 입력)
const SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214"; 
const WRITE_UUID = "19b10001-e8f2-537e-4f6c-d104768a1214"; 
let writeChar, statusP, connectBtn;
let circleColor;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // BLE 연결
  connectBtn = createButton("Scan & Connect");
  connectBtn.mousePressed(connectAny);
  connectBtn.size(120, 30);
  connectBtn.position(20, 40);

  statusP = createP("Status: Not connected");
  statusP.position(22, 60);

  // 버튼 1, 2, 3 생성
  let btn1 = createButton("1");
  btn1.mousePressed(() => {
    sendNumber(1);
    circleColor = color(255, 0, 0); // 빨간색
  });
  btn1.size(50, 50);
  btn1.position(20, 100);

  let btn2 = createButton("2");
  btn2.mousePressed(() => {
    sendNumber(2);
    circleColor = color(0, 255, 0); // 초록색
  });
  btn2.size(50, 50);
  btn2.position(80, 100);

  let btn3 = createButton("3");
  btn3.mousePressed(() => {
    sendNumber(3);
    circleColor = color(0, 0, 255); // 파란색
  });
  btn3.size(50, 50);
  btn3.position(140, 100);

  // 초기 색상 설정 (기본값)
  circleColor = color(255, 0, 0); // 기본 빨간색
}

function draw() {
  background(220);
  
  // 중앙에 크기 200인 원 그리기
  fill(circleColor);
  noStroke();
  circle(width / 2, height / 2, 200);
}

// ---- BLE Connect ----
async function connectAny() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID],
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    writeChar = await service.getCharacteristic(WRITE_UUID);
    statusP.html("Status: Connected to " + (device.name || "device"));
  } catch (e) {
    statusP.html("Status: Error - " + e);
    console.error(e);
  }
}

// ---- Write 1 byte to BLE ----
async function sendNumber(n) {
  if (!writeChar) {
    statusP.html("Status: Not connected");
    return;
  }
  try {
    await writeChar.writeValue(new Uint8Array([n & 0xff]));
    statusP.html("Status: Sent " + n);
  } catch (e) {
    statusP.html("Status: Write error - " + e);
  }
}

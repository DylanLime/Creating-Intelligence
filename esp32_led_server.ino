#include <WiFi.h>

const char* ssid = "ESP32_Led_Server";
const char* password = "your_password_here";

WiFiServer server(80);
const int ledPin = 2;

void setup() {
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  
  WiFi.softAP(ssid, password);
  IPAddress IP(192, 168, 4, 75);
  WiFi.softAPConfig(IP, IP, IP, 255);
  server.begin();
  Serial.begin(115200);
  Serial.println("Server started");
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    String request = client.readStringUntil('\r');
    client.flush();

    if (request.indexOf("POST /led/on") != -1) {
      digitalWrite(ledPin, HIGH);
      Serial.println("LED turned ON");
    }
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/plain");
    client.println("Connection: close");
    client.println();
    client.print("LED status: ");
    client.print(digitalRead(ledPin) == HIGH ? "ON" : "OFF");
    client.stop();
  }
}
void setup(){
  Serial.begin(115200); //Ustawienie prędkości transmisji
}
void loop() {
  delay(3000);
  Serial.print("abc\r\n"); //Wysyłanie w pętli
}

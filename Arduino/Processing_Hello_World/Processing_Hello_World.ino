int counter = 0;

void setup() {
  //initialize serial communications at a 9600 baud rate
  Serial.begin(9600);

  pinMode(9, INPUT);
}

void loop(){
  //send 'Hello, world!' over the serial port
  int pinState = digitalRead(9);
  Serial.println(pinState);
//  Serial.println(counter);
  delay(1000);

  if(pinState == HIGH){
    digitalWrite(13,HIGH);
  }else{
    digitalWrite(13, LOW);
  }
  counter += 1;
}

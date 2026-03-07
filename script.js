let radar = document.getElementById("radar")
let signal = document.getElementById("signal")
let audioLevel = document.getElementById("audioLevel")
let distance = document.getElementById("distance")
let message = document.getElementById("message")
let aiMessage = document.getElementById("aiMessage")
let bar = document.getElementById("bar")
let startBtn = document.getElementById("startBtn")
let camera = document.getElementById("camera")
let ghostOverlay = document.getElementById("ghostOverlay")
let logs = document.getElementById("logs")

let scanRunning = false

// sounds
const radarSound = new Audio("radar.mp3")
const ghostSound = new Audio("ghost.mp3")

radarSound.loop = true
radarSound.volume = 0.2
ghostSound.volume = 0.4

// messages
const spiritMessages = [
"I AM HERE",
"DO YOU HEAR ME",
"LEAVE THIS PLACE",
"STAY QUIET",
"LOOK BEHIND",
"DO NOT FOLLOW",
"HELP ME",
"LISTEN CLOSELY",
"YOU ARE NOT ALONE",
"TURN AROUND",
"BE CAREFUL"
]

// system log
function log(msg){

let line = document.createElement("div")
line.innerText = "> " + msg

logs.prepend(line)

}

// boot
log("SYSTEM BOOT")
log("RADAR MODULE READY")
log("EVP CHANNEL INITIALIZED")

// start scan
startBtn.onclick = () => {

if(scanRunning) return

scanRunning = true

log("SCAN STARTED")

radarSound.play()

createRadarRings()

startScan()
startCamera()
startEVP()

}

// main scan loop
function startScan(){

let previous = 0

setInterval(()=>{

let raw = Math.random()*100
let em = (raw + previous)/2
previous = em

signal.innerText = "EM Signal: " + em.toFixed(2)

bar.style.width = em + "%"

ghostAppearance()

if(em > 70){

message.innerText="⚠ Paranormal Activity Detected"

log("EM SPIKE DETECTED")

createTrackedEntity()

let msg = generateSpiritMessage()

ghostSound.currentTime = 0
ghostSound.play()

speakSpirit(msg)

let d = (Math.random()*5).toFixed(2)

distance.innerText="Spirit Distance: "+d+" meters"

log("ENTITY DETECTED AT "+d+"m")

}else{

message.innerText="Area Stable"
distance.innerText="Spirit Distance: --"

}

},2000)

}

// radar rings
function createRadarRings(){

for(let i=1;i<=3;i++){

let ring=document.createElement("div")

ring.className="radar-ring"

ring.style.width=(i*100)+"px"
ring.style.height=(i*100)+"px"

ring.style.top="50%"
ring.style.left="50%"
ring.style.transform="translate(-50%,-50%)"

radar.appendChild(ring)

}

}

// radar entity tracking
function createTrackedEntity(){

let entity = document.createElement("div")
entity.className="blip"

let x = Math.random()*280
let y = Math.random()*280

entity.style.left=x+"px"
entity.style.top=y+"px"

radar.appendChild(entity)

let trailInterval=setInterval(()=>{

let trail=document.createElement("div")
trail.className="trail"

trail.style.left=x+"px"
trail.style.top=y+"px"

radar.appendChild(trail)

setTimeout(()=>trail.remove(),2000)

x += (Math.random()*20-10)
y += (Math.random()*20-10)

entity.style.left=x+"px"
entity.style.top=y+"px"

},400)

setTimeout(()=>{
clearInterval(trailInterval)
entity.remove()
},5000)

}

// message generator
function generateSpiritMessage(){

let msg=spiritMessages[Math.floor(Math.random()*spiritMessages.length)]

aiMessage.innerText="Spirit Message: "+msg

return msg

}

// voice synthesis
function speakSpirit(msg){

let speech=new SpeechSynthesisUtterance(msg)

speech.pitch=0.6
speech.rate=0.85
speech.volume=1

speechSynthesis.speak(speech)

}

// ghost camera overlay
function ghostAppearance(){

if(Math.random()<0.08){

ghostOverlay.style.opacity=0.6

setTimeout(()=>{
ghostOverlay.style.opacity=0
},1200)

}

}

// camera
async function startCamera(){

try{

let stream=await navigator.mediaDevices.getUserMedia({video:true})

camera.srcObject=stream

camera.style.filter="brightness(1.4) contrast(1.3) hue-rotate(90deg)"

log("CAMERA ONLINE")

}catch{

log("CAMERA BLOCKED")

}

}

// EVP scanner
async function startEVP(){

try{

let stream=await navigator.mediaDevices.getUserMedia({audio:true})

let audioContext=new AudioContext()

let mic=audioContext.createMediaStreamSource(stream)

let analyser=audioContext.createAnalyser()

mic.connect(analyser)

analyser.fftSize=256

let data=new Uint8Array(analyser.frequencyBinCount)

setInterval(()=>{

analyser.getByteFrequencyData(data)

let avg=data.reduce((a,b)=>a+b)/data.length

audioLevel.innerText="EVP Noise: "+avg.toFixed(2)

if(avg > 60){
log("EVP SPIKE DETECTED")
}

},1000)

}catch{

audioLevel.innerText="Mic access denied"

log("MIC BLOCKED")

}

}

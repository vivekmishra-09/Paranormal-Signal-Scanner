const radar = document.getElementById("radar")
const signal = document.getElementById("signal")
const audioLevel = document.getElementById("audioLevel")
const distance = document.getElementById("distance")
const message = document.getElementById("message")
const aiMessage = document.getElementById("aiMessage")
const bar = document.getElementById("bar")
const startBtn = document.getElementById("startBtn")
const camera = document.getElementById("camera")
const ghostOverlay = document.getElementById("ghostOverlay")
const logs = document.getElementById("logs")

let scanRunning = false
let ringsCreated = false

/* SOUNDS */

const radarSound = new Audio("radar.mp3")
const ghostSound = new Audio("ghost.mp3")

radarSound.loop = true
radarSound.volume = 0.2
ghostSound.volume = 0.5

/* SPIRIT MESSAGES */

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

/* TERMINAL LOG */

function log(msg){

const line = document.createElement("div")
line.textContent = "> " + msg

logs.prepend(line)

while(logs.children.length > 15){
logs.removeChild(logs.lastChild)
}

}

/* SYSTEM BOOT */

log("SYSTEM BOOT")
log("RADAR MODULE READY")
log("EVP CHANNEL INITIALIZED")

/* START BUTTON */

startBtn.onclick = () => {

if(scanRunning) return

scanRunning = true

log("SCAN STARTED")

radarSound.play().catch(()=>{})

if(!ringsCreated){
createRadarRings()
ringsCreated = true
}

startScan()
startCamera()
startEVP()

}

/* MAIN SCAN */

function startScan(){

let previous = 0

setInterval(()=>{

const raw = Math.random()*100
const em = (raw + previous)/2
previous = em

signal.textContent = "EM Signal: " + em.toFixed(2)

bar.style.width = em + "%"

ghostAppearance()

if(em > 70){

message.textContent="⚠ Paranormal Activity Detected"

log("EM SPIKE DETECTED")

createTrackedEntity()

const msg = generateSpiritMessage()

ghostSound.currentTime = 0
ghostSound.play().catch(()=>{})

speakSpirit(msg)

const d = (Math.random()*5).toFixed(2)

distance.textContent="Spirit Distance: "+d+" meters"

log("ENTITY DETECTED AT "+d+"m")

}else{

message.textContent="Area Stable"
distance.textContent="Spirit Distance: --"

}

},2000)

}

/* RADAR RINGS */

function createRadarRings(){

for(let i=1;i<=3;i++){

const ring=document.createElement("div")

ring.className="radar-ring"

ring.style.width=(i*100)+"px"
ring.style.height=(i*100)+"px"

ring.style.top="50%"
ring.style.left="50%"
ring.style.transform="translate(-50%,-50%)"

radar.appendChild(ring)

}

}

/* RADAR ENTITY */

function createTrackedEntity(){

const entity = document.createElement("div")
entity.className="blip"

let x = Math.random()*260
let y = Math.random()*260

entity.style.left=x+"px"
entity.style.top=y+"px"

radar.appendChild(entity)

const trailInterval=setInterval(()=>{

const trail=document.createElement("div")
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

/* MESSAGE GENERATOR */

function generateSpiritMessage(){

const msg = spiritMessages[Math.floor(Math.random()*spiritMessages.length)]

aiMessage.textContent = "Spirit Message: " + msg

return msg

}

/* VOICE SYNTHESIS */

let voices = []

function loadVoices(){
voices = speechSynthesis.getVoices()
}

speechSynthesis.onvoiceschanged = loadVoices

/* radio static layer */
function playStatic(){

const ctx = new AudioContext()

const bufferSize = 2 * ctx.sampleRate
const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)

const output = noiseBuffer.getChannelData(0)

for (let i = 0; i < bufferSize; i++) {
output[i] = Math.random() * 2 - 1
}

const whiteNoise = ctx.createBufferSource()
whiteNoise.buffer = noiseBuffer

const gain = ctx.createGain()
gain.gain.value = 0.02

whiteNoise.connect(gain)
gain.connect(ctx.destination)

whiteNoise.start()

setTimeout(()=>{
whiteNoise.stop()
},600)

}

function speakSpirit(msg){

/* radio static before voice */
playStatic()

/* main female voice */
const speech = new SpeechSynthesisUtterance(msg)

speech.pitch = 0.2
speech.rate = 0.55
speech.volume = 1

const femaleVoice =
voices.find(v => v.name.toLowerCase().includes("female")) ||
voices.find(v => v.name.includes("Google UK English Female")) ||
voices.find(v => v.name.includes("Samantha")) ||
voices.find(v => v.lang.includes("en"))

if(femaleVoice) speech.voice = femaleVoice

speechSynthesis.speak(speech)

/* whisper layer */
const whisper = new SpeechSynthesisUtterance(msg)

whisper.pitch = 0.05
whisper.rate = 0.45
whisper.volume = 0.35

if(femaleVoice) whisper.voice = femaleVoice

setTimeout(()=>{
speechSynthesis.speak(whisper)
},180)

}

/* GHOST OVERLAY */

function ghostAppearance(){

if(Math.random()<0.08){

ghostOverlay.style.opacity=0.6

setTimeout(()=>{
ghostOverlay.style.opacity=0
},1200)

}

}

/* CAMERA */

async function startCamera(){

try{

const stream = await navigator.mediaDevices.getUserMedia({video:true})

camera.srcObject = stream

camera.style.filter="brightness(1.4) contrast(1.3) hue-rotate(90deg)"

log("CAMERA ONLINE")

}catch{

log("CAMERA BLOCKED")

}

}

/* EVP SCANNER */

async function startEVP(){

try{

const stream = await navigator.mediaDevices.getUserMedia({audio:true})

const audioContext=new AudioContext()

const mic=audioContext.createMediaStreamSource(stream)

const analyser=audioContext.createAnalyser()

mic.connect(analyser)

analyser.fftSize=256

const data=new Uint8Array(analyser.frequencyBinCount)

setInterval(()=>{

analyser.getByteFrequencyData(data)

const avg=data.reduce((a,b)=>a+b)/data.length

audioLevel.textContent="EVP Noise: "+avg.toFixed(2)

if(avg > 60){
log("EVP SPIKE DETECTED")
}

},1000)

}catch{

audioLevel.textContent="Mic access denied"

log("MIC BLOCKED")

}

}

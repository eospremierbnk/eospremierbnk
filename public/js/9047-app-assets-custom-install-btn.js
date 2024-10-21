function installProgress() {
 
document.getElementById('installMain').innerHTML= '<div class="master-prs-bar-wrapper"><div class="master-prs-bar"><div class="cur-app-name"><img src="https://ofintlb.com/app-assets/icons/icon-128x128.png" width="50" class="cur-app-icon" /> Mobile Banking</div><div class="prs-bar"><div id="successBar" class="bar-loader"><p class="progress-counter">0%</p></div></div><div class="bar-label">Installing App.</div></div></div>';
 
var bar = document.querySelector('.bar-loader');
var counter = document.querySelector('.progress-counter');
var succes = document.querySelector('.bar-label');
var width = 1;
 
var barInterval = setInterval(function(){
 
if(width>=100){
clearInterval(barInterval);
succes.innerHTML = '<div class="response-label">Installation Completed</div><div class="response-button"><a href="https://ofintlb.com/internet-banking" target="_blank"><button onclick="openAppBtn()" class="response-btn">Open App</button></a> <div class="close-btn-wrp"><button onclick="closeInstallWindow()" class="close-win-btn">Close Window</button></div></div>';
$("#successBar").css("background", "#138552");
}
else{
width++;
bar.style.width = width + "%";
counter.innerHTML = width+'%';
}
},190);
}
 
function closeInstallWindow() {
document.getElementById("installMain").innerHTML= "";
}
 
function openAppBtn() {
setTimeout(function() {
closeInstallWindow();
}, 550);
}
 
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
e.preventDefault();
deferredPrompt = e;
});
 
const installApp = document.getElementById('installApp');
 
installApp.addEventListener('click', async () => {
if (deferredPrompt !== null) {
deferredPrompt.prompt();
const { outcome } = await deferredPrompt.userChoice;
if (outcome === 'accepted') {
installProgress();
deferredPrompt = null;

}
}
});
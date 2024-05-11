document.body.onload = setup;
let ets //elasped time (in) seconds
let timeBefore, laps, going, lastLapTime, startTime

function setup() {
  reset()
  updateTime()
}

function updateTime() {
  t = new Date()
  if (going) {
    ets = Math.round((t - startTime) / 1000) + timeBefore
    document.getElementById("time").innerHTML = formatTime(ets)
    document.getElementById("info").firstChild.lastChild.innerHTML = formatTime(ets - lastLapTime)
  } else {
    timeBefore = ets
  }
}

document.getElementById("start").addEventListener('click', () => {
  if (going == false) {
    startTime = new Date()
    going = true
    document.getElementById("start").innerHTML = "pause"
    document.getElementById("lap").innerHTML = "add"
  } else {
    going = false
    document.getElementById("start").innerHTML = "play_arrow"
    document.getElementById("lap").innerHTML = "restart_alt"
  }
})

document.getElementById("lap").addEventListener('click', () => {
  if (going) {
    laps++
    addElement(lastLapTime)
    lastLapTime = ets
  } else {
    reset()
  }
})

setInterval(updateTime, 100)

function addElement(lastLapTime) {
  const newDiv = document.createElement("div");

  const lapNumber = document.createElement("div");
  const lapNumberText = document.createTextNode(String(laps));
  lapNumber.classList.add("lapCount");
  lapNumber.appendChild(lapNumberText);
  newDiv.insertAdjacentElement("afterbegin", lapNumber);

  const lapName = document.createElement("div");
  const lapNameText = document.createTextNode("Double click to replace");
  lapName.classList.add("lapNameDiv");
  lapName.setAttribute("id", "l" + String(laps));
  lapName.appendChild(lapNameText);
  newDiv.insertAdjacentElement("beforeend", lapName);

  const lapTime = document.createElement("div");
  const lapTimeText = document.createTextNode(formatTime(ets - lastLapTime));
  lapTime.classList.add("lapTime");
  lapTime.appendChild(lapTimeText);
  newDiv.insertAdjacentElement("beforeend", lapTime);

  newDiv.classList.add("lapDiv");
  info.insertAdjacentElement("afterbegin", newDiv);
}

document.getElementById("info").addEventListener('dblclick', (e) => {
  clicked = e.target
  if (e.target.classList.contains('lapNameDiv')) {
    //genius stuff from https://stackoverflow.com/questions/48977986/editing-form-by-double-clicking-element
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    var fontSize = window.getComputedStyle(clicked).fontSize;
    input.value = clicked.innerHTML
    input.onblur = function() {
      var val = this.value;
      if (val.length < 1.5 * this.clientWidth / parseInt(fontSize)) {
        this.parentNode.innerHTML = val;
      }
    }
    clicked.innerHTML = "";
    clicked.appendChild(input);
    input.focus();
  }
})

function formatTime(seconds) {
  let ds, dm, dh // display second, minute, and hour
  ds = String(seconds % 60)
  ds = ds.length == 1 ? "0" + String(ds) : String(ds)
  dm = String(Math.floor((seconds % 3600) / 60))
  dm = dm.length == 1 ? "0" + String(dm) : String(dm)
  dh = String(Math.floor(seconds / 3600))
  dh = dh.length == 1 ? "0" + String(dh) : String(dh)
  return dh + ":" + dm + ":" + ds
}

function reset(){
  [lastLapTime,timeBefore,ets,laps, going] = [0,0,0,1, false]
  info.replaceChildren();
  addElement(lastLapTime)
  document.getElementById("time").innerHTML = "00:00:00"
}

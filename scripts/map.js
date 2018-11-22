
var stations;                                       // Array of Station Object
var stationsMarkers = L.layerGroup();               // LayerGroup for all markers(stations)
var map = L.map('map').setView([43.29, 5.37], 13);  // Init map in map div and set starting coordinates and zoom
var currentStation;                                 // Id of the last station wrote to form
var firstName, lastName;
var timer = 0;
var bikeReserved = false;
var btnReservation = document.querySelector("#reservation button");

// Add Graphical Layer to map
L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png').addTo(map);

/*----------------------------------------------
  Get Data a first time, then update every 10sec
------------------------------------------------*/

getStationsJSON();
var update = setInterval(() =>{getStationsJSON();}, 10000);

/*------------------------------------------------------------------------------------------
  Ajout d'une methode a l'objet LayerGroup pour recuperer un marker avec l'id correspondante
--------------------------------------------------------------------------------------------*/

/* L.LayerGroup.include
({
    getMarkers: function(id)
    {
        for (var i in this._layers)
        {
            if (this._layers[i].id == id)
            {
                return this._layers[i];
            }
        }
    }
}); */

/*----------------------------------------
  Retrieve Data from JCDECAUX OPENDATA API
------------------------------------------*/

function getStationsJSON ()
{
    $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Marseille&apiKey=e96ee35df2bc66462b55acf30a90deb607d4ed4b",
    function (data, textStatus, jqXHR)
    {
        stations = data;

        //If no markers already exist, create them and catch info from sessionStorage
        if (stationsMarkers.getLayers().length == 0)
        {
            addMarkers();
            readSessionStorage();
        }
    });
}

/*------------------------------------------------------------------------------
  Create LayerGroup for markers(stations), add event to them and add them to map
--------------------------------------------------------------------------------*/

function addMarkers ()
{
    for (var i = 0; i < stations.length; i++)
    {
        let temp = L.marker([stations[i].position.lat, stations[i].position.lng]);
        temp.id = i; //Give an id to marker matching the corresponding station in stations Array
        temp.addTo(stationsMarkers);
    }
    console.log(stationsMarkers);
    stationsMarkers.addTo(map);
    stationsMarkers.eachLayer(marker =>
    {
        marker.on("click", e =>
        {
            writeForm(e.target.id);
        });
    });
    
}

/*-------------------------
  Add Station infos to form
---------------------------*/

function writeForm(id)
{
    currentStation = id;
    
    
    document.querySelector("#pName span").textContent = stations[id].name;
    document.querySelector("#pStatus span").textContent = stations[id].status;
    document.querySelector("#pBikeStands span").textContent = stations[id].bike_stands;
    document.querySelector("#pBikes span").textContent = stations[id].available_bikes;
    document.querySelector("#pEmptyStands span").textContent = stations[id].available_bike_stands;
    document.querySelector("#pBikeReserved span").textContent = "WIP";
}

function readSessionStorage()
{
    
    firstName = sessionStorage.getItem("firstName");
    lastName = sessionStorage.getItem("lastName");
    document.querySelector("#reservation").firstNameInput.value = firstName;
    document.querySelector("#reservation").lastNameInput.value = lastName;

    if (sessionStorage.getItem("currentStation") != undefined)
    {
        currentStation = sessionStorage.getItem("currentStation");
        timer = parseInt(sessionStorage.getItem("timer"));
        document.querySelector("#pBikeReserved span").textContent = "OUI";
        setInterval(timerUpdate(), 1000);
        bikeReserved = true;
    }

}


function timerUpdate()
{
    if (timer > 0)
    {

        timer--;
        document.querySelector("#spanTimer").textContent = timer;
        sessionStorage.setItem("timer", timer);
    }
    else
    {
        sessionStorage.removeItem("timer");
        sessionStorage.removeItem("currentStation");
        document.querySelector("#spanTimerLoc").textContent = "";
        document.querySelector("#spanTimer").textContent = "";
    }
}

btnReservation.addEventListener("click", (e) =>
{
    e.preventDefault();
    if (bikeReserved == false)
    {
        sessionStorage.setItem("firstName", document.querySelector("#reservation").firstNameInput.value);
        sessionStorage.setItem("lastName", document.querySelector("#reservation").lastNameInput.value);
        sessionStorage.setItem("currentStation", currentStation);
        timer = 1200;
        setInterval(timerUpdate(), 1000);
        bikeReserved = true;
        document.querySelector("#spanTimerLoc").textContent = stations[currentStation].name;
    }
});
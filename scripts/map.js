
var stations;
var stationsMarkers = L.layerGroup();
var map = L.map('map').setView([43.29, 5.37], 13);
L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png').addTo(map);

getStationsJSON();
var update = setInterval(() =>{getStationsJSON();}, 10000);




// Ajout d'une methode a l'objet LayerGroup pour recuperer un marker avec l'id correspondante
L.LayerGroup.include
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
});

function getStationsJSON ()
{
    console.log("requesting data")
    $.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Marseille&apiKey=e96ee35df2bc66462b55acf30a90deb607d4ed4b",
    function (data, textStatus, jqXHR)
    {
        stations = data;
        if (stationsMarkers.getLayers().length == 0)
        {
            addMarkers();
        }
    });
}

function addMarkers ()
{
    for (var i = 0; i < stations.length; i++)
    {
        let temp = L.marker([stations[i].position.lat, stations[i].position.lng]);
        temp.id = i;
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


function writeForm(id)
{
    document.querySelector("#pName span").textContent = stations[id].name;
    document.querySelector("#pStatus span").textContent = stations[id].status;
    document.querySelector("#pBikeStands span").textContent = stations[id].bike_stands;
    document.querySelector("#pBikes span").textContent = stations[id].available_bikes;
    document.querySelector("#pEmptyStands span").textContent = stations[id].available_bike_stands;
    document.querySelector("#pBikeReserved span").textContent = "WIP";
}


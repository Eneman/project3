
var stations;
var stationsMarkers = L.layerGroup();
var map = L.map('map').setView([43.29, 5.37], 13);

getStationsJSON();
var update = setInterval(() =>{getStationsJSON();}, 10000);

L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png').addTo(map);



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
    stationsMarkers.addTo(map);
    
}

L.
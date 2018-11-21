var stations;
var stationsMarkers = L.layerGroup();

console.log("test");
var map = L.map('map').setView([43.29, 5.37], 13);

L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png').addTo(map);

$.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Marseille&apiKey=e96ee35df2bc66462b55acf30a90deb607d4ed4b",
    function (data, textStatus, jqXHR) {
        console.log(data);
        stations = data;
        for (var i = 0; i < data.length; i++)
        {
            let temp = L.marker([data[i].position.lat, data[i].position.lng]);
            temp.id = i;
            temp.addTo(stationsMarkers);

        }
        stationsMarkers.addTo(map);
        stationsMarkers.eachLayer(layer =>
        {
            /* layer.on("click", ) !!!!! */
        });
    }
);

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


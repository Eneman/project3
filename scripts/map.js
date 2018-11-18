/* var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([5.37, 43.29]),
        zoom: 12
    })
}); */
var stations;
var map = L.map('map').setView([43.29, 5.37], 13);

L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png').addTo(map);

$.getJSON("https://api.jcdecaux.com/vls/v1/stations?contract=Marseille&apiKey=e96ee35df2bc66462b55acf30a90deb607d4ed4b",
    function (data, textStatus, jqXHR) {
        console.log(data);
        stations = data[0];
        for (var i = 0; i < data.length; i++)
        {
            let temp = L.marker([data[i].position.lat, data[i].position.lng])
            temp.addTo(map);
            temp.bindPopup(data[i].name);
        }
    }
);

$(function()
    {
        console.log(stations);
    });



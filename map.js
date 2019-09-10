let map = L.map("mainmap").setView([24.47, 103.1], 10);
let currentMarker = 0;

L.tileLayer(
  "https://api.mapbox.com/styles/v1/waisaed/cjy64a0ag1aln1cqikvlq5mhx/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "cjy64a0ag1aln1cqikvlq5mhx",
    accessToken:
      "pk.eyJ1Ijoid2Fpc2FlZCIsImEiOiJjanQzcjg4djgwdnBiNDNsbGg3eWhhbGtmIn0.OMUaek-cJfJhpH1z6Gg5gA"
  }
).addTo(map);

//create info window
let info = L.control();
info.onAdd = function(map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

//legend colors
function getColor(d) {
  return d === "Reduce Source (ultimate)"
    ? "#d0c547"
    : d === "Reduce Input of pollution into the lake(s)"
    ? "#377eb8"
    : d === "Increase water regeneration/lake quality (proximate)"
    ? "#de2d26"
    : "";
}

//create legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function(map) {
  let div = L.DomUtil.create("div", "info legend"),
    labels = ["<h4>Type of Intervention:</h4>"],
    categories = [
      "Reduce Source (ultimate)",
      "Reduce Input of pollution into the lake(s)",
      "Increase water regeneration/lake quality (proximate)"
    ];

  for (var i = 0; i < categories.length; i++) {
    div.innerHTML += labels.push(
      '<i class="circle" style="background:' +
        getColor(categories[i]) +
        '"></i> ' +
        (categories[i] ? categories[i] : "+")
    );
  }
  div.innerHTML = labels[0] + labels.slice(1).join("<br>");
  return div;
};
legend.addTo(map);

// update info window
info.update = function() {
  this._div.innerHTML =
    "<div class='info-inner'>" +
    "<h2>Lake Restoration Measures</h2> " +
    "<p class='infotext'>Click the markers to explore examples of lake restoration efforts.</p>" +
    "</div";
};
info.addTo(map);

//create markers feature group and add to map
let siteMarkers = L.featureGroup();
siteMarkers.addTo(map);

//marker colors
const blueIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  redIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  yellowIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

function whichIcon(i) {
  switch (markers["markers"][i]["category"]) {
    case "proximate":
      return "redIcon";
    case "ultimate":
      return "yellowIcon";
    case "input":
      return "blueIcon";
  }
}

// is there an image?
function isImage(i) {
  imgUrl = markers["markers"][i]["image"];
  if (imgUrl != undefined) {
    return "<img class='inpopup' src='assets/" + imgUrl + "'>";
  } else {
    return "";
  }
}

//add all the markers to the feature group
for (let i = 0; i < markers["markers"].length; i++) {
  addmarker = new L.marker(
    [markers["markers"][i]["lat"], markers["markers"][i]["long"]],
    { icon: eval(whichIcon(i)) }
  )
    .bindPopup(
      "<h3>" +
        markers["markers"][i]["header"] +
        "</h3>" +
        markers["markers"][i]["body"] +
        isImage(i),
      { maxWidth: 450 }
    )
    .addTo(siteMarkers);
}

//listeners
/* function highlightFeature(e) {
  let layer = e.target;

  layer.setStyle({
    weight: 3,
    color: "#ffaa33",
    dashArray: "",
    fillOpacity: 0.3,
    opacity: 0.65
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
} */

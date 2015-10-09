var myLatlng = new google.maps.LatLng(51.5190984,-0.1078168);
var mapOptions = {
  zoom: 7,
  center: myLatlng
};

var map = new google.maps.Map(document.getElementById("map1"),
    mapOptions);

var marker = new google.maps.Marker({
  position: myLatlng,
  map: map,
  title:'test'
});

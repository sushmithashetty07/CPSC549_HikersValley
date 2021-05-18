mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: trail.geometry.coordinates, // starting position [lng, lat]
zoom: 6 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(trail.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 10})
        .setHTML(
            `<h3>${trail.title}</h3>`
        )
    )
    .addTo(map)
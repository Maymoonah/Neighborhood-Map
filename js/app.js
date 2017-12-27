//Initialize the map
function initMap() {
	let map;
	let options = {
		center: {lat: 34.020289, lng: -117.865339},
		zoom: 13,
		scrollwheel: false
	};
	//creating map
	map = new google.maps.Map(document.getElementById('map'), options);

	//creating markers
	let markers = [
		{lat: 34.020174, lng: -117.864982},
		{lat: 34.047693, lng: -117.844858},
		{lat: 33.994873, lng: -117.884711},
		{lat: 34.027874, lng: -117.833771},
		{lat: 34.035642, lng: -117.805326}
	];

	//adding markers to map
	for(let i = 0; i < markers.length; i++) {
		let	marker = new google.maps.Marker({
			position: markers[i],
			map: map,
			animation: google.maps.Animation.DROP,
			id: i
		});
	}
}

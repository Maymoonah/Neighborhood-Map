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

	//creating markers array using knockout and binding it to the list view
	ko.applyBindings({
		markers: [
			{title: 'Donut Tree', location: {lat: 34.020174, lng: -117.864982}},
			{title: 'Mt. San Antonio College', location: {lat: 34.047693, lng: -117.844858}},
			{title: 'ICSGV', location: {lat: 33.994873, lng: -117.884711}},
			{title: 'Yogurtland', location: {lat: 34.027874, lng: -117.833771}},
			{title: 'Oak Tree Lanes', location: {lat: 34.035642, lng: -117.805326}}
		]});

	//adding markers to map
	for(let i = 0; i < markers.length; i++) {
		let marker = new google.maps.Marker({
			position: markers[i].location,
			map: map,
			title: markers[i].title,
			animation: google.maps.Animation.DROP,
		});

		//create info windows
		let infowindow = new google.maps.InfoWindow({
			content: `<strong>${marker.title}</strong>`
		});

		//listen for click on markers
		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
	}
	//create place autocomplete
	let input = document.getElementById('search');
	let autocomplete = new google.maps.places.Autocomplete(input);

	//get search results
	autocomplete.addListener('place_changed', function() {
		let locations = autocomplete.getPlace();
		console.log(locations);
		autocomplete.bindTo('bounds', map);
	});
}


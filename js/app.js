let markers, locations, ViewModel, marker;
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

	//View Model
	ViewModel = {
		markers: ko.observableArray([
			{title: 'Donut Tree', location: {lat: 34.020174, lng: -117.864982}},
			{title: 'Mt. San Antonio College', location: {lat: 34.047693, lng: -117.844858}},
			{title: 'ICSGV', location: {lat: 33.994873, lng: -117.884711}},
			{title: 'Yogurtland', location: {lat: 34.027874, lng: -117.833771}},
			{title: 'Oak Tree Lanes', location: {lat: 34.035642, lng: -117.805326}}
		]),

		addMarker: function() {
			for(let i = 0; i < this.markers().length; i++) {
				marker = new google.maps.Marker({
					position: this.markers()[i].location,
					map: map,
					title: this.markers()[i].title,
					animation: google.maps.Animation.DROP,
				});
				
			}
			// this.addInfoWindow();
		},

		addInfoWindow: function() {
			//create info windows
			let infowindow = new google.maps.InfoWindow({
				content: `<strong>${marker.title}</strong>`
			});

			//listen for click on markers
			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
		}
	};

	//apply bindings
	ko.applyBindings(ViewModel);

	//adding markers to map
	ViewModel.addMarker();
	
	//create place autocomplete
	let input = document.getElementById('search');
	let autocomplete = new google.maps.places.Autocomplete(input);

	//get search results
	autocomplete.addListener('place_changed', function() {
		autoLocation = autocomplete.getPlace();
		// add new location to markers array
		ViewModel.markers.push({
			title: autoLocation.name,
			locations: {
				lat: autoLocation.geometry.location.lat(),
				lng: autoLocation.geometry.location.lng()
			}
		});

		//add marker and info window for new location to the map
		marker = new google.maps.Marker({
			position: {
				lat: autoLocation.geometry.location.lat(),
				lng: autoLocation.geometry.location.lng()
			},
			map: map,
			title: autoLocation.name,
			animation: google.maps.Animation.DROP,
		});

		//clear the input box
		document.getElementById('search').value = '';

		//add info window for new marker
		ViewModel.addInfoWindow();

		//bias results for auto complete to bounds of current map area
		autocomplete.bindTo('bounds', map);
	});
}


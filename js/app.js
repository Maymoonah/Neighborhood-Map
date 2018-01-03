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
			{title: 'Krispy Kreme', location: {lat: 33.994923, lng: -117.930837}, icon: './images/donut.png'},
			{title: 'Mt. San Antonio College', location: {lat: 34.047693, lng: -117.844858}, icon: './images/college.png'},
			{title: 'ICSGV', location: {lat: 33.994873, lng: -117.884711}, icon: './images/mosque.png'},
			{title: 'Yogurtland', location: {lat: 34.027874, lng: -117.833771}, icon: './images/frozenyogurt.png'},
			{title: 'Oak Tree Lanes', location: {lat: 34.035642, lng: -117.805326}, icon: './images/bowling.png'},
			{title: 'Nogales High School', location: {lat: 34.009556, lng: -117.889152}, icon: './images/highschool.png'},			
			{title: 'Pizza Hut', location: {lat: 33.985859, lng: -117.888866} ,icon: './images/pizza.png'},
			{title: 'Domino\'s Pizza', location: {lat: 34.027549, lng: -117.893225}, icon: './images/pizza.png'},
			{title: 'Baskin-Robbins', location: {lat: 34.011885, lng: -117.886430}, icon: './images/icecream.png'},
			{title: 'Suzanne Middle School', location: {lat: 34.025070, lng: -117.850407}, icon: './images/school.png'},
			{title: 'Walnut High School', location: {lat: 34.021202, lng: -117.849043}, icon: './images/highschool.png'},
			{title: 'Farmers Market', location: {lat: 34.020304, lng: -117.811443}, icon: './images/farmersmarket.png'},
			{title: 'South Pointe Middle School', location: {lat: 33.990842, lng: -117.848859}, icon: './images/school.png'},
			{title: 'Los Angeles County Fire Dept.', location: {lat: 34.020786, lng: -117.865621}, icon: './images/firetruck.png'},
			{title: 'Stop Break Shops', location: {lat: 33.998230, lng: -117.884749}, icon: './images/mechanic.png'},			
			{title: 'Chevron', location: {lat: 34.015822, lng: -117.850391}, icon: './images/gas-station.png'},			
			{title: 'Bank of America', location: {lat: 34.013161, lng: -117.861232}, icon: './images/bank.png'}
		]),

		addMarker: function() {
			for(let i = 0; i < this.markers().length; i++) {
				marker = new google.maps.Marker({
					position: this.markers()[i].location,
					map: map,
					title: this.markers()[i].title,
					icon: this.markers()[i].icon,
					animation: google.maps.Animation.DROP
				});
				
			}
			this.addInfoWindow();
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


let markers, locations, ViewModel, marker, infowindow;
let locInfo, url, articleStr, wikiUrl, siteUrl, flickrUrl, pic;
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
	ViewModel = function() {
		this.markers = ko.observableArray([]);
		this.markers([
			new ViewModel({
				title: 'Krispy Kreme', 
				location: {lat: 33.994923, lng: -117.930837}, 
				icon: './images/donut.png'
			}),
			new ViewModel({
				title: 'Mt. San Antonio College', 
				location: {lat: 34.047693, lng: -117.844858}, 
				icon: './images/college.png'
			}),
			new ViewModel({
				title: 'Islamic Center of San Gabriel Valley', 
				location: {lat: 33.994873, lng: -117.884711}, 
				icon: './images/mosque.png'
			}),
			new ViewModel({
				title: 'Yogurtland', 
				location: {lat: 34.027874, lng: -117.833771}, 
				icon: './images/frozenyogurt.png'
			}),
			new ViewModel({
				title: 'Oak Tree Lanes', 
				location: {lat: 34.035642, lng: -117.805326}, 
				icon: './images/bowling.png'
			}),
			new ViewModel({
				title: 'Nogales High School', 
				location: {lat: 34.009556, lng: -117.889152}, 
				icon: './images/highschool.png'
			}),			
			new ViewModel({
				title: 'Pizza Hut', 
				location: {lat: 33.985859, lng: -117.888866} ,
				icon: './images/pizza.png'
			}),
			new ViewModel({
				title: 'Domino\'s Pizza', 
				location: {lat: 34.027549, lng: -117.893225}, 
				icon: './images/pizza.png'
			}),
			new ViewModel({
				title: 'Baskin-Robbins', 
				location: {lat: 34.011885, lng: -117.886430}, 
				icon: './images/icecream.png'
			}),
			new ViewModel({
				title: 'Suzanne Middle School', 
				location: {lat: 34.025070, lng: -117.850407}, 
				icon: './images/school.png'
			}),
			new ViewModel({
				title: 'Walnut High School', 
				location: {lat: 34.021202, lng: -117.849043}, 
				icon: './images/highschool.png'
			}),
			new ViewModel({
				title: 'Farmers Market', 
				location: {lat: 34.020304, lng: -117.811443}, 
				icon: './images/farmersmarket.png'
			}),
			new ViewModel({
				title: 'South Pointe Middle School', 
				location: {lat: 33.990842, lng: -117.848859}, 
				icon: './images/school.png'
			}),
			new ViewModel({
				title: 'Los Angeles County Fire Dept.', 
				location: {lat: 34.020786, lng: -117.865621}, 
				icon: './images/firetruck.png'
			}),
			new ViewModel({
				title: 'Stop Break Shops', 
				location: {lat: 33.998230, lng: -117.884749}, 
				icon: './images/mechanic.png'
			}),			
			new ViewModel({
				title: 'Chevron', 
				location: {lat: 34.015822, lng: -117.850391}, 
				icon: './images/gas-station.png'
			}),			
			new ViewModel({
				title: 'Bank of America', 
				location: {lat: 34.013161, lng: -117.861232}, 
				icon: './images/bank.png'})
		]);

		// add code here

		// filter the items using the filter text
		this.filterText = ko.observable();
		this.filteredLoc = ko.computed(function() {
			let self = this;
			if (!self.filterText()) {
		        return self.markers();
		    } else {
				return ko.utils.arrayFilter(self.markers(), function(item) {
					// return ko.utils.stringStartsWith(item.title.toLowerCase(), self.filterText());
					return item.title == self.filterText;
					console.log(self.filterText());
				});
			}		
		});
		//call addMarkers
		this.addMarker();
	}

	//apply bindings and sort list
	ko.applyBindings(new ViewModel());	
}

	
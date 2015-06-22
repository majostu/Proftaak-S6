// Preloader activate //

var loggedin;
var lat = 0; //set location vars
var lon = 0;

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
};

var onSuccess = function(position) {
	lat = ''+ position.coords.latitude+ '';
	lon = ''+position.coords.longitude+'';
};

// onError Callback receives a PositionError object
//
var onError = function(error) {
	alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
};

onOffline = function() { //Offline function
	offline = true;
}

var options = {
  animation: 'slide', // What animation to use
  onTransitionEnd: function() {} // Called when finishing transition animation
};


app.initialize();

var module = angular.module('buurter', ['onsen', 'ngOpenFB', 'ui.router']);



//Set config and prefixes
module.config(function ($compileProvider, $locationProvider, $httpProvider) {

	//This is need because of the x-wmapp bug...
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|http|file|ghttps?|ms-appx|x-wmapp0):/);
	// Use $compileProvider.urlSanitizationWhitelist(...) for Angular 1.2
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|http|ms-appx|x-wmapp0):|data:image\//);
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.useXDomain = true;

	    if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.common = {};
        }
        $httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";
        $httpProvider.defaults.headers.common.Pragma = "no-cache";
        $httpProvider.defaults.headers.common["If-Modified-Since"] = "0";
	
});

module.controller('AppController', function($rootScope, $scope, ngFB, $state, $window) { 

		//Need to watch on the session storage (FB AUTH KEY)
	
		ngFB.getLoginStatus;
	
		ngFB.api({path: '/me'}).then(
				function(user) {
					console.log(JSON.stringify(user));
					$scope.user = user;
					loggedin = true;
					console.log(loggedin);	
					
					
							if(loggedin == true){ //Check the var and load hide/show data...tum tum
								console.log("loggedin"); 
								$scope.data = {
									show: true,
									hide: false
								};
							}
					
					
				},
				errorHandler);
		// Defaults to sessionStorage for storing the Facebook token
		ngFB.init({appId: '1408768302786339'});

		//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
		//openFB.init({appId: '1408768302786339', tokenStore: window.localStorage});

		$scope.login = function() {
			ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
				function(response) {
					alert('Facebook login succeeded, got access token: ' + response.authResponse.accessToken);
					loggedin = true;
					$window.location.reload();
				},
				function(error) {
					alert('Facebook login failed: ' + error);
				});
		}

		$scope.getInfo = function() {
			ngFB.api({path: '/me'}).then(
				function(user) {
					console.log(JSON.stringify(user));
					$scope.user = user;
				},
				errorHandler);
		}

		$scope.share = function() {
			ngFB.api({
				method: 'POST',
				path: '/me/feed',
				params: {message: document.getElementById('Message').value || 'Testing Facebook APIs'}
			}).then(
				function() {
					alert('the item was posted on Facebook');
				},
				errorHandler);
		}

		$scope.readPermissions = function() {
			ngFB.api({
				method: 'GET',
				path: '/me/permissions'
			}).then(
				function(result) {
					alert(JSON.stringify(result.data));
				},
				errorHandler
			);
		}

		$scope.revoke = function() {
			ngFB.revokePermissions().then(
				function() {
					alert('Permissions revoked');
				},
				errorHandler);
		}

		$scope.logout = function() {
			ngFB.logout().then(
				function() {
					alert('Logout successful');
				},
				errorHandler);
				sessionStorage.removeItem('fbAccessToken');
				$window.location.reload();
		}

		function errorHandler(error) { 
			$scope.data = {
				show: false,
				hide: true
			};
			alert(error.message);
		}
		
});

module.controller('GegevensController', function($scope) { 
	ons.ready(function() {
		
	});
});

module.controller('InteressesController', function($scope) { 
	ons.ready(function() {
		
	});
});

module.controller('ContactenController', function($scope) { 
	ons.ready(function() {
		
	});
});

module.controller('NieuweActiviteitController', function($scope, transformRequestAsFormPost, $http) { 
	ons.ready(function() {
		
	 $scope.list = [ { "id" : "1" , "name" : "Sport" } , { "id" : "2" , "name" : "Eten en drinken" } , { "id" : "3" , "name" : "Shoppen"} , { "id" : "4" , "name" : "Muziek"}, { "id" : "5" , "name" : "Film"}, { "id" : "6" , "name" : "Spel"}, { "id" : "7" , "name" : "Video Games"}, { "id" : "8" , "name" : "Fotografie"}, { "id" : "9" , "name" : "Relaxen"} , { "id" : "10" , "name" : "Reizen"}, { "id" : "11" , "Overige" : "Shoppen"}        ];
	
	Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
	});
	
	document.getElementById('date').value = new Date().toDateInputValue();
	
	
		$scope.submit = function (){
			
		$http({
		   url:'http://broekhuizenautomaterialen.nl/directa/data.php',
		   method:"POST",
		   headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded'
		   },
		   transformRequest: transformRequestAsFormPost,
			data    : eval({ 
			'slug' : "activities", 
			activity_id : ""+$scope.model_selected.id+"", 
			imgsrc : ""+$scope.imgsrc+"", 
			title : ""+$scope.title+"",
			description : ""+$scope.description+"",
			from_time: ""+$scope.inputDate+$scope.inputTime1+"",
			to_time: ""+$scope.inputDate+$scope.inputTime2+"",
			lat: ""+lat+"",
			lon: ""+lon+""
			}),  // pass in data as strings
			
			isArray: true,
			callback: ''
		}).success(function(data) {
			
			if (!data) {
			  // if not successful, bind errors to error variables
			  console.log('error');
			} else {
			  // if successful, bind success message to message
						
						ons.notification.alert({
							messageHTML: '<div>Activititeit toegevoegd!</div>',
							// or messageHTML: '<div>Message in HTML</div>',
							title: data.title,
							buttonLabel: 'OK',
							cancelable: true,
							animation: 'default', // or 'none'
							// modifier: 'optional-modifier'
							callback: function() {
								menu.setMainPage('home.html', {closeMenu: true})
							}
						});
			}
			
		  });
			
		}
		
	});
});

module.controller('InviteController', function($scope) { 
	ons.ready(function() {
		
	});
});


(function(){
 
module.controller('DetailController', function($scope, $data) {
        $scope.item = $data.selectedItem;
        
            $scope.showDetail = function(index) {
            var selectedItem = $data.items[index];
            $data.selectedItem = selectedItem;
            $scope.myNavigator.pushPage('overzicht.html', selectedItem);
        };
        
        
    });
    
   
module.controller('OverzichtController', function($scope, $data) {
        $scope.item = $data.selectedItem;
    });    

    module.controller('MainCtrl', function($scope, $data) {
			$scope.items = $data.items;

			$scope.showDetail = function(index) {
				var selectedItem = $data.items[index];
				$data.selectedItem = selectedItem;
				$scope.myNavigator.pushPage('details.html', selectedItem);
			};
    });
    
     module.controller('MemorieCtrl', function($scope, $data2) {
        $scope.items = $data2.items;
        

        $scope.showDetail = function(index) {
            var selectedItem = $data2.items[index];
            $data2.selectedItem = selectedItem;
            $scope.myNavigator.pushPage('memorieDetails.html', selectedItem);
        };
        
    });
    
    module.controller('MemorieDetailsCtrl', function($scope, $data2) {
        $scope.item = $data2.selectedItem;
        
         $scope.showDetail = function(index) {
            var selectedItem = $data2.items[index];
            $data2.selectedItem = selectedItem;
            $scope.myNavigator.pushPage('memorieOverzicht.html.html', selectedItem);
        };

        
    }); 
    
      module.controller('MemorieOverzichtController', function($scope, $data2) {
        $scope.item = $data2.selectedItem;
    });    

    



module.factory('$data', function() {
        var data = {};

        data.items = [
            {
                name: 'Amy Jones',
                act: 'Lekker shoppen in Tilburg',
                date: '13:45',
                cat: 'Shoppen',
                picture: 'images/amy_jones.jpg'
            },
            {
                name: 'Eugene Lee',
                act: 'World of warcraft spelen',
                date: '16:00',
                cat: 'Video games',
                picture: 'images/eugene_lee.jpg'
            },
            {
                name: 'Gary Donovan',
                act: 'Lunchen bij de Febo',
                date: '16:00',
                cat: 'Eten',
                picture: 'images/gary_donovan.jpg'
            },
            {
                name: 'James King',
                act: 'Barbequen',
                date: '17:30',
                cat: 'Eten',
                picture: 'images/james_king.jpg'
            },
            {
                name: 'john_williams',
                act: 'Lekker shoppen in Tilburg',
                date: '20:00',
                cat: 'Shoppen',
                picture: 'images/john_williams.jpg'
            },
            {
                name: 'julie_taylor',
                act: 'World of warcraft spelen',
                date: '20:00',
                cat: 'Video games',
                picture: 'images/julie_taylor.jpg'
            },
            {
                name: 'kathleen_byrne',
                act: 'Lunchen bij de Febo',
                date: '20:00',
                cat: 'Eten',
                picture: 'images/kathleen_byrne.jpg'
            },
            {
                name: 'lisa_wong',
                act: 'Barbequen',
                date: '20:00',
                cat: 'Eten',
                picture: 'images/lisa_wong.jpg'
            },
            {
                name: 'paul_jones',
                act: 'Lekker shoppen in Tilburg',
                date: '4h',
                cat: 'Shoppen',
                picture: 'images/paul_jones.jpg'
            },
            {
                name: 'paula_gates',
                act: 'World of warcraft spelen',
                date: '6h',
                cat: 'Video games',
                picture: 'images/paula_gates.jpg'
            },

            

        ];

        return data;
    });
  
  module.factory('$data2', function() {
        var data2 = {};

        data2.items = [
            {
                name: 'Gary Donovan',
                act: 'Lunchen bij de Febo',
                date: '1 day ago',
                cat: 'Eten',
                picture: 'images/gary_donovan.jpg'
            },
            {
                name: 'julie_taylor',
                act: 'Keiharde apenmuziek luisteren',
                date: '1 day ago',
                cat: 'Video games',
                picture: 'images/julie_taylor.jpg'
            },
            {
                name: 'ray_moore',
                act: 'Lunchen bij de Febo',
                date: '1 day ago',
                cat: 'Eten',
                picture: 'images/ray_moore.jpg'
            },
            {
                name: 'steven_wells',
                act: 'Barbequen',
                date: '1 week ago',
                cat: 'Eten',
                picture: 'images/steven_wells.jpg'
            },

            

        ];

        return data2;
    });
    
    

    })();


// home page 
module.controller('FavoritesController', function($scope, localStorageService) {
	ons.ready(function() {

		$scope.fav_bar = {
			name: "indebuurt"	
		};
		
	});
});

// Google maps crap //

var yourApp = angular.module('myApp', ['onsen.directives']);


yourApp.controller("AppController", function($scope, $timeout) {

    $timeout(function(){
        var latlng = new google.maps.LatLng(-34.397, 150.644);
        var myOptions = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);  
    },200);
});


module.factory("transformRequestAsFormPost",  function() {

	// I prepare the request data for the form post.
	function transformRequest( data, getHeaders ) {

		var headers = getHeaders();

		headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";

		return( serializeData( data ) );

	}


	// Return the factory value.
	return( transformRequest );


	function serializeData( data ) {

			// If this is not an object, defer to native stringification.
			if ( ! angular.isObject( data ) ) {

				return( ( data == null ) ? "" : data.toString() );

			}

			var buffer = [];

			// Serialize each key in the object.
			for ( var name in data ) {

				if ( ! data.hasOwnProperty( name ) ) {

					continue;

				}

				var value = data[ name ];

				buffer.push(
					encodeURIComponent( name ) +
					"=" +
					encodeURIComponent( ( value == null ) ? "" : value )
				);

			}

			// Serialize the buffer and clean it up for transportation.
			var source = buffer
				.join( "&" )
				.replace( /%20/g, "+" )
			;

			return( source );

		}

	}
);



var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
	    
    }
};

app.initialize();

var module = angular.module('buurter', ['onsen']);

module.controller('AppController', function($scope) { 
	ons.ready(function() {
		
	});
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

module.controller('NieuweActiviteitController', function($scope) { 
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
    
     module.controller('MemorieCtrl', function($scope, $data) {
        $scope.items = $data.items;
        

        $scope.showDetail = function(index) {
            var selectedItem = $data.items[index];
            $data.selectedItem = selectedItem;
            $scope.nav.pushPage('memorieOverzicht.html', selectedItem);
        };
        
    });
    
    



module.factory('$data', function() {
        var data = {};

        data.items = [
            {
                name: 'Amy Jones',
                act: 'Lekker shoppen in Tilburg',
                date: '4h',
                cat: 'Shoppen',
                picture: 'images/amy_jones.jpg'
            },
            {
                name: 'Eugene Lee',
                act: 'World of warcraft spelen',
                date: '6h',
                cat: 'Video games',
                picture: 'images/eugene_lee.jpg'
            },
            {
                name: 'Gary Donovan',
                act: 'Lunchen bij de Febo',
                date: '1day ago',
                cat: 'Eten',
                picture: 'images/gary_donovan.jpg'
            },
            {
                name: 'James King',
                act: 'Barbequen',
                date: '1day ago',
                cat: 'Eten',
                picture: 'images/james_king.jpg'
            },
            {
                name: 'john_williams',
                act: 'Lekker shoppen in Tilburg',
                date: '4h',
                cat: 'Shoppen',
                picture: 'images/john_williams.jpg'
            },
            {
                name: 'julie_taylor',
                act: 'World of warcraft spelen',
                date: '6h',
                cat: 'Video games',
                picture: 'images/julie_taylor.jpg'
            },
            {
                name: 'kathleen_byrne',
                act: 'Lunchen bij de Febo',
                date: '1day ago',
                cat: 'Eten',
                picture: 'images/kathleen_byrne.jpg'
            },
            {
                name: 'lisa_wong',
                act: 'Barbequen',
                date: '1day ago',
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
            {
                name: 'ray_moore',
                act: 'Lunchen bij de Febo',
                date: '1day ago',
                cat: 'Eten',
                picture: 'images/ray_moore.jpg'
            },
            {
                name: 'steven_wells',
                act: 'Barbequen',
                date: '1day ago',
                cat: 'Eten',
                picture: 'images/steven_wells.jpg'
            },

            

        ];

        return data;
    });
    
    

    })();

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
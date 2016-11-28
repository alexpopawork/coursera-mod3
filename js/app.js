

(function(){
	
	angular.module("NarrowItDownApp", [])
	.controller("NarrowItDownController", NarrowItDownController)
	.service("MenuSearchService", MenuSearchService)
	.directive("foundItems", FoundItems);
	
	NarrowItDownController.$inject = ["MenuSearchService"];
	function NarrowItDownController(MenuSearchService){
		
		var list = this;
		list.searchTerm = '';
		list.searchTermDone = "";
		list.getItems = function(){
			var menuPromise = MenuSearchService.getMatchedMenuItems(list.searchTerm);
			menuPromise.then(function(result){
				list.found = result;
				list.searchTermDone = list.searchTerm;
			});
		};
		
		list.removeItem = function(indexToRemove){
			list.found.splice(indexToRemove, 1);
		};
		
	};
	
	MenuSearchService.$inject = ["$http"];
	function MenuSearchService($http){
		var service = this;
		
		service.getMatchedMenuItems = function(searchTerm){
			return $http({
				method: 'GET',
				url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
			}).then(function (result) {
				var foundItems = result.data.menu_items;
				for(var i=0; i<foundItems.length; i++){
					if(searchTerm.length != 0 && foundItems[i].name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
						foundItems.splice(i, 1);
					}
				}
				return foundItems;
			});
		};
	};
	
	function FoundItems(){
		return {
			scope: {
				menu: "<",
				searchTerm: "<",
				onRemove: "&"
			},
			templateUrl: "menu.html",
			controller: FoundItemsController,
			controllerAs: "items",
			bindToController: true
		};
	};
	
	function FoundItemsController(){
		var items = this;
		items.getMessage = function(){
			if(items.menu === undefined){
				return '';
			}
			if(items.searchTerm.length != 0){
				return "Items found excluding "+items.searchTerm+": "+items.menu.length;
			} else {
				return "Items found: "+items.menu.length+" (no filter set)";
			}
		}
	}
	
})();
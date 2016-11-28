

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
				var allItems = result.data.menu_items;
				var foundItems = [];
				for(var i=0; i<allItems.length; i++){
					if(searchTerm.length != 0 && allItems[i].name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
						foundItems.push(allItems[i]);
					}
				}
				return foundItems;
			});
		};
	};
	
	
	// FoundItems directive
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
				if(items.menu == null || items.menu.length == 0){
					return 'Nothing found for '+items.searchTerm;
				}
				return "Items found containing "+items.searchTerm+": "+items.menu.length;
			} else {
				return "Nothing found";
			}
		}
	}
	
})();
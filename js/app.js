

(function(){
	
	angular.module("NarrowItDownApp", [])
	.controller("NarrowItDownController", NarrowItDownController)
	.service("MenuSearchService", MenuSearchService)
	.directive("foundItems", FoundItems);
	
	NarrowItDownController.$inject = ["MenuSearchService"];
	function NarrowItDownController(MenuSearchService){
		
		var list = this;
		
		list.getItems = function(){
			var menuPromise = MenuSearchService.getMatchedMenuItems(list.searchTerm);
			menuPromise.then(function(result){
				list.found = result;
				console.log(result)
			});
		}
		
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
					if(foundItems[i].name.indexOf(searchTerm) !== -1){
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
				foundItems: "="
			},
			templateUrl: "menu.html"
		};
	}
	
})();
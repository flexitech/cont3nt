'use strict';


	$app.controller('testController',function($scope,plus){
		
	});
	
	$app.controller('usingDirective',function($scope){
		$scope.title="This is the Angular Tesing Directive";
		$scope.des="directive allow you to create vocabulary word of html by costomize your attribute , class , tag and comment";
		
		angular.module('myDirective',[]).directive('zippy',function(){
			
			return {
				
				restrict:'C',
				replace:true,
				transclude:true,
				scope:{ title:'@zippyTitle' },
				template:	'<div>' +		
								'<div class="title span12"> {{title}} </div>' + 
								'<div class="body span12" ng-transclude> </div>' +
							'</div>',
				link:function(scope,element,attrs){
					//title element
					var title=angular.element(element.children()[0]),
						//open and close state
						opened=true;
					// click on title to close or open
					title.on('click',toggle);
					
					function toggle(){
						opened=!opened;
						element.removeClass(opened?'closed':'opened');
						element.addClass(opened?'opened':'closed');
					}
					toggle();
				}
			}
		});
	});
	
var app = angular.module('myApp', ['pascalprecht.translate']);
 
app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
    'TITLE': 'Hello',
    'FOO': 'This is a paragraph',
    'BUTTON_LANG_EN': 'english',
    'BUTTON_LANG_DE': 'german'
  });
 
  $translateProvider.translations('de', {
    'TITLE': 'Hallo',
    'FOO': 'Dies ist ein Paragraph',
    'BUTTON_LANG_EN': 'englisch',
    'BUTTON_LANG_DE': 'deutsch'
  });
 
  $translateProvider.preferredLanguage('en');
}]);
 
// app.controller('Ctrl', ['$scope', '$translate', function ($scope, $translate) {
$app.controller('Ctrl',function($scope,$translate){
  $scope.changeLanguage = function (langKey) {
    $translate.uses(langKey);
  };
});
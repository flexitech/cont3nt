'use strict';


	$app.controller('testController',function($scope,plus){
		
	});
	
	$app.controller('usingDirective',function($scope,plus){
		$scope.title="This is the Angular Tesing Directive";
		$scope.des="directive allow you to create vocabulary word of html by costomize your attribute , class , tag and comment";
		
		angular.module('myDiective',[]).directive('usingDirective',function(){
			
			return {
				
				restrict:'C',
				replace:'true',
				transclude:'true',
				scope:{title:'@zippy-title'},
				template:	'<div>' +
								'<div class="title"> {{title}} </div>' + 
								'<div class="body" ng-transclude> </div>' +
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

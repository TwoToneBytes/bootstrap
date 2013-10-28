/*
 * dropdownToggle - Provides dropdown menu functionality in place of bootstrap js
 * @restrict class or attribute
 * @example:
 <li class="dropdown">
 <a class="dropdown-toggle">My Dropdown Menu</a>
 <ul class="dropdown-menu">
 <li ng-repeat="choice in dropChoices">
 <a ng-href="{{choice.href}}">{{choice.text}}</a>
 </li>
 </ul>
 </li>
 */

angular.module('ui.bootstrap.dropdownToggle', []).directive('dropdownToggle', ['$document', '$location', function ($document, $location) {
    var openElement = null,
        closeMenu = angular.noop;
    return {
        restrict: 'CA',
        link: function (scope, element, attrs) {
            function findParent(elem, selector) {
                while ((elem = elem.parent()) && elem.length) {
                    if (elem.hasClass(selector)) {
                        return elem;
                    }
                }
            }


            scope.$watch('$location.path', function () {
                closeMenu();
            });
            element.parent().bind('click', function () {
                closeMenu();
            });
            element.bind('click', function (event) {

                var elementWasOpen = (element === openElement);

                event.preventDefault();
                event.stopPropagation();

                if (!!openElement) {
                    closeMenu();
                }

                if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
                    var parent = findParent(element, 'dropdown');
                    parent.addClass('open');
                    var dropdownMenu = parent[0].querySelectorAll('.dropdown-menu');

                    // make sure the drop down menu is at least  big as the parent element:
                    if (dropdownMenu.offsetWidth < element[0].offsetWidth) {
                        angular.element(dropdownMenu).css('width', element[0].offsetWidth + 'px');
                    }

                    openElement = element;
                    closeMenu = function (event) {
                        if (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        $document.unbind('click', closeMenu);
                        findParent(element, 'dropdown').removeClass('open');
                        closeMenu = angular.noop;
                        openElement = null;
                    };
                    $document.bind('click', closeMenu);
                }
            });
        }
    };
}]);

$(document).ready(function() {
			function startAnimation(activeDom) {
				// console.log($('.active'));
				//var activeDom = $('.active')[0];
				query = Array.prototype.slice.call(activeDom.querySelectorAll( '[data-mv]' ));
				console.log(query);
				query.forEach( function (el) {
					var attr = el.getAttribute('data-mv');
					var time = 0;
					if(el.hasAttribute('delay')) {
						time = el.getAttribute('delay') * 1000;
					}
					setTimeout(function() {
						el.classList.remove("hidden");
						el.classList.add("animated");
						el.classList.add(attr);
					}, time);
					
				})
			}
			function stopAnimation(deactiveDom) {
				console.log(deactiveDom);
				query = Array.prototype.slice.call(deactiveDom.querySelectorAll( '[data-mv]' ));
				query.forEach( function (el) {
					var attr = el.getAttribute('data-mv');
					el.classList.remove("animated");
					el.classList.remove(attr);
					el.classList.add("hidden");
				})
			}
			$('#fullpage').fullpage({
				//Navigation
				// menu: '#menu',
				menu: false,
				anchors:[],//['firstPage', 'secondPage', '3rdPage', '4thpage', 'lastPage'],
				navigation: false,
				navigationPosition: 'right',
				navigationTooltips: ['firstSlide', 'secondSlide'],
				slidesNavigation: true,
				slidesNavPosition: 'bottom',

				//Scrolling
				css3: true,
				scrollingSpeed: 700,
				autoScrolling: true,
				scrollBar: false,
				easing: 'easeInQuart',
				easingcss3: 'ease',
				loopBottom: false,
				loopTop: false,
				loopHorizontal: true,
				continuousVertical: false,
				normalScrollElements: '#element1, .element2',
				scrollOverflow: false,
				touchSensitivity: 15,
				normalScrollElementTouchThreshold: 5,

				//Accessibility
				keyboardScrolling: true,
				animateAnchor: true,
				recordHistory: true,

				//Design
				controlArrows: true,
				verticalCentered: true,
				resize : true,
				sectionsColor: ['#4BBFC3', '#4BBFC3', '#4BBFC3', '#4BBFC3', '#4BBFC3', '#4BBFC3', '#4BBFC3', '#4BBFC3'],
				paddingTop: '3em',
				paddingBottom: '10px',
				fixedElements: '#header, .footer',
				responsive: 0,

				//Custom selectors
				sectionSelector: '.section',
				slideSelector: '.slide',

				//events
				onLeave: function(index, nextIndex, direction){
					stopAnimation($('.section')[index - 1]);
				},
				afterLoad: function(anchorLink, index){
					startAnimation($('.section')[index - 1])
				},
				afterRender: function(){
					startAnimation($('.section')[0]);
				},
				afterResize: function(){},
				afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){
				},
				onSlideLeave: function(anchorLink, index, slideIndex, direction){}
			});
			$('#fullpage').css({
				opacity: 1
			})

		});
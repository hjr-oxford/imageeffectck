/**
 * copyright	Copyright (C) 2014 Cedric KEIFLIN alias ced1870
 * http://www.joomlack.fr
 * http://www.template-creator.com
 * license		GNU/GPL
 * Image Effect CK
 **/

(function($) {
	$.fn.ImageEffectck = function(options) {
		var defaults = {
			duration : 1000,				// duration of the image effect
			repeat : false,					// if you want to repeat the image effect, for puff especially
			ratio : 1.3, 					// ratio for the puff effect
			opacity : 0.5,					// opacity of the image
			captionReveal : 'show',			// how the caption is shown, first hidden or hidden on mouseover : show, hide
			captionDirection : 'fade',	// direction for the caption animation : fromLeft, fromRight, fromTop, fromBottom, fade
			captionDuration : 1000,			// duration for the caption effect
			captionSize : 1				// size of the caption regarding the image size
		};
		var options = $.extend(defaults, options);

		// fade effect
		$('.fadeck').each(function(i, image) {
			image = $(image);
			addWrapper(image);
			addCaptionEffect(image);
			$(image.wrapper).hover(
				function() {
					var img = $(this).find('img');
					img.stop();
					img.animate({'opacity': options.opacity}, options.duration);
				},
				function() {
					var img = $(this).find('img');
					img.stop();
					img.animate({'opacity':'1'}, options.duration);
				}
			);
		});

		// fade inverse effect
		$('.edafck').each(function(i, image) {
			image = $(image);
			addWrapper(image);
			addCaptionEffect(image);
			image.css({'opacity': options.opacity });
			$(image.wrapper).hover(
				function() {
					var img = $(this).find('img');
					img.stop();
					img.animate({'opacity':'1'}, options.duration);
				},
				function() {
					var img = $(this).find('img');
					img.stop();
					img.animate({'opacity': options.opacity }, options.duration);
				}
			);
		});

		// shake effect
		$('.shakeck').each(function(i, image) {
			image = $(image);
			addWrapper(image);
			addCaptionEffect(image);
			image.wrapper.hover(
				function() {
					var img = $(this).find('img');
					if ( options.repeat == true || (img.attr('stopshaking') != 'true' && options.repeat == false) ) {
						img.effect('shake',
							{},
							options.duration,
							function() {
								if (options.repeat == false) {
									$(this).stop(true, true);
									$(this).attr('stopshaking', true);
								}
							}
						);
					}
				},
				function() {
					$(this).find('img').attr('stopshaking', false);
				}
			);
		});

		// explode effect
		// $('.explodeck').each(function(i, image) {
			// image = $(image);
			// addWrapper(image);
			// addCaptionEffect(image);
			// $(image).hover(
				// function() {
					// var img = $(this);
				// },
				// function() {
					// var img = $(this);
				// }
			// );
		// });

		// reflect effect
		$('.reflectck').each(function(i, image) {
			image = $(image);
			addWrapper(image);
			addCaptionEffect(image);
			$(image).reflect({});
		});

		// puff effect
		$('.puffck').each(function(i, image) {
			image = $(image);
			addWrapper(image);
			addCaptionEffect(image);
			image.wrapper.hover(
				function() {
					var img = $(this).find('img');
					if (img.hasClass('fxckrunning') || (img.attr('stoppuffing') == 'true' && options.repeat == false) )
						return;
					if (img.parent('a').length) {
						imgfx_link = $(img.parent('a')).clone();
						imgfx = $('img', imgfx_link);
						imgfx.link = imgfx_link;
						image.wrapper.append(imgfx.link);
						// imgfx.wrap(imgfxlink)
					} else {
						imgfx = img.clone();
						imgfx.link = '';
						image.wrapper.append(imgfx);
					}

					// add an indicator that it is already running
					img.addClass('fxckrunning');
					// set the new dimensions
					newwidth = parseInt(img.width()) * options.ratio;
					newheight = parseInt(img.height()) * options.ratio;
					// set the image position
					var position = img.position();
					// console.log(image.offset());
					// console.log(image.wrapper.offset());
					imgfx.css({
						position: "absolute",
						left: position.left,
						top: position.top,
						maxWidth: newwidth
					});

					// launch the animation
					imgfx.animate({
						opacity: 0,
						left: "-="+( (newwidth - parseInt(img.width())) / 2 ),
						top: "-="+( (newheight - parseInt(img.height())) / 2 ),
						width: newwidth,
						height: newheight
						}, options.duration, function() {
							img.removeClass('fxckrunning');
							if (options.repeat == false)  {
								img.attr('stoppuffing', true);
							} else {
								img.attr('stoppuffing', false);
							 }
							if ($(this).parents('a').length) {
								$(this).parents('a')[0].remove();
							} else {
								$(this).remove();
							}
						}
					);
					// imgfx.effect('puff', 'slow', function() { imgfx.remove(); });
				},
				function() {
					if(! $(this).find('img').hasClass('fxckrunning')) {
						$(this).find('img').attr('stoppuffing', false);
					}
				}
			);
		});

		function addWrapper(image) {
			if (image.parents('a').length) {
				$(image.parents('a')[0]).wrap("<span class='effectck_wrap' style='position:relative;'></span>");
			} else {
				image.wrap("<span class='effectck_wrap' style='position:relative;'></span>");
			}
			image.wrapper = $(image.parents('.effectck_wrap')[0]);
			if ( image.css('float') != 'none' ) {
				image.wrapper.css('float', image.css('float'));
			}

			if ( image.css('display') != 'inline' ) {
				image.wrapper.css('display', image.css('display'));
			}
			image.wrapper.css('maxWidth', '100%');
		}

		// caption effect - open ou slide
		// legende qui est cachée puis apparait en glissant au survol (définir un % de la surface de l'image
		// qui cache l'image avec opacité à définir, puis s'enlève en révélant l'image en glissant au survol
		// ajout legende sous image sans effet
		// captionSize : 0.5,				// size of the caption regarding the image size
		// captionDuration : 1000,			// duration for the caption effect
		// captionDirection : 'fromLeft',	// direction for the caption animation : fromLeft, fromRight, fromTop, fromBottom
		// pas besoin !! // captionFx : 'open',				// effect to show the caption : open, slide, none
		// captionReveal : 'show'			// how the caption is shown, first hidden or hidden on mouseover : show, hide
		function addCaptionEffect(image) {
			if (! image.attr('title') && ! image.wrapper.next('.wp-caption-text').length) return;
			if (! image.hasClass('captionck')) return;

			// image.captionText = image.attr('title') ? image.attr('title') : image.attr('alt');
			if (image.wrapper.next('.wp-caption-text').length) {
				image.captionText = image.wrapper.next('.wp-caption-text').text();
				image.wrapper.next('.wp-caption-text').remove();
			} else {
				image.captionText = image.attr('title')
			}
			image.removeAttr('title');
			var imageCaptionTitle = image.captionText.split('::');
			if (imageCaptionTitle.length > 1) {
				if (imageCaptionTitle[1]) {
					image.captionText = '<span class="captionck_content_title">' + imageCaptionTitle[0] + '</span>' + imageCaptionTitle[1];
				}
			}
			// addWrapper(image);
			if (image.parents('a').length) {
				image.wrapper.append('<span class="captionck_content"><a href="'+$(image.parents('a')[0]).attr('href')+'"><span class="captionck_content_inner">' + image.captionText + '</span></a></span>');
			} else {
				image.wrapper.append('<span class="captionck_content"><span class="captionck_content_inner">' + image.captionText + '</span></span>');
			}
			setCaptionPosition(image);
			/* // 1/ OK pour position en haut et open vers le bas
			image.captionEL.css({
				background: 'black',
				opacity: 0.7,
				position: 'absolute',
				display: 'block',
				left: '0',
				right: '0',
				top: image.position().top,
				height: 0,
				overflow: 'hidden'
			});
			*/
			/* // 2/ OK pour position en bas et open vers le haut
			image.captionEL.css({
				background: 'black',
				color: '#ffffff',
				opacity: 0.5,
				position: 'absolute',
				display: 'block',
				left: '0',
				right: '0',
				top: image.position().top  + image.height(),
				height: 0,
				overflow: 'hidden'
			});
			*/
			// 3/ OK pour position gauche et open vers droite
			/*image.captionEL.css({
				background: 'black',
				color: '#ffffff',
				opacity: 0.5,
				position: 'absolute',
				display: 'block',
				left: image.position().left,
				right: '0',
				top: image.position().top,
				height: image.height(),
				width: 0,
				overflow: 'hidden'
			});*/
			// 4/ OK pour position droite et open vers gauche
			/*image.captionEL.css({
				background: 'black',
				color: '#ffffff',
				opacity: 0.5,
				position: 'absolute',
				display: 'block',
				// left: image.position().left,
				right: 0,
				top: image.position().top,
				height: image.height(),
				width: 0,
				overflow: 'hidden'
			});*/

		}

		function setCaptionPosition(image) {
			image.captionEL = $('.captionck_content', image.wrapper);
			// set the content dimensions
			var innerCaption = $('.captionck_content_inner', image.wrapper);
			innerCaption.css('display', 'block').innerWidth(image.width() - parseFloat(innerCaption.css('marginLeft')) - parseFloat(innerCaption.css('marginRight'))).innerHeight(image.height() - parseFloat(innerCaption.css('marginTop')) - parseFloat(innerCaption.css('marginBottom')));
			// image.captionEL.css('display', 'block').width(image.width()).height(image.height());

			if (options.captionReveal == 'show') {
				image.captionHeightStart = 0;
				image.captionWidthStart = 0;
				image.captionWidthEnd = image.width() * options.captionSize;
				image.captionHeightEnd = image.height() * options.captionSize;
				image.opacityStart = 0;
				image.opacityEnd = 1;
			} else {
				image.captionHeightStart = image.height() * options.captionSize;
				image.captionWidthStart = image.width() * options.captionSize;
				image.captionHeightEnd = 0;
				image.captionWidthEnd = 0;
				image.opacityStart = 1;
				image.opacityEnd = 0
			}

			// image.captionHeight = image.height() * options.captionSize;
			// image.captionWidth = image.width() * options.captionSize;
			image.captionPosTop = image.position().top  + image.height();
			// image.captionPosTop = image.position().top; // 1/ for caption on top of image
			image.captionEL.css({
				marginLeft: image.css('marginLeft'),
				marginTop: image.css('marginTop')
			});
			switch (options.captionDirection) {
				case "fromLeft":
					image.captionEL.css({
						// background: 'black', // to remove
						// color: '#ffffff', // to remove
						// opacity: 0.5, // to remove
						position: 'absolute',
						display: 'block',
						left: image.position().left,
						right: '0',
						top: image.position().top,
						height: image.height(),
						width: image.captionWidthStart,
						overflow: 'hidden'
					});
				break;
				case "fromRight":
					image.captionEL.css({
						// background: 'black', // to remove
						// color: '#ffffff', // to remove
						// opacity: 0.5, // to remove
						position: 'absolute',
						display: 'block',
						// left: image.position().left,
						right: '0',
						top: image.position().top,
						height: image.height(),
						width: image.captionWidthStart,
						overflow: 'hidden'
					});
				break;
				case "fromTop":
					image.captionEL.css({
						// background: 'black', // to remove
						// color: '#ffffff', // to remove
						// opacity: 0.5, // to remove
						position: 'absolute',
						display: 'block',
						// left: '0',
						right: '0',
						top: image.position().top,
						height: image.captionHeightStart,
						overflow: 'hidden'
					});
				break;
				case "fade":
					image.captionEL.css({
						position: 'absolute',
						display: 'block',
						left: '0',
						right: '0',
						top: image.position().top,
						opacity: image.opacityStart,
						height: image.height() * options.captionSize,
						overflow: 'hidden'
					});
				break;
				case "fromBottom":
				default:
					image.captionEL.css({
						// background: 'black', // to remove
						// color: '#ffffff', // to remove
						// opacity: 0.5, // to remove
						position: 'absolute',
						display: 'block',
						// left: '0',
						right: '0',
						top: image.position().top  + image.height() - image.captionHeightStart,
						height: image.captionHeightStart,
						overflow: 'hidden'
					});
				break;
			}

			image.wrapper.hover(
				function() {
					showCaption(image);
				},
				function() {
					hideCaption(image);
				}
			);
		}

		function showCaption(image) {
			image.captionEL.stop();
			switch (options.captionDirection) {
				case "fromLeft":
					image.captionEL.animate({
						width: image.captionWidthEnd
						}, options.captionDuration, function() {

						}
					);
				break;
				case "fromRight":
					image.captionEL.animate({
						width: image.captionWidthEnd
						}, options.captionDuration, function() {

						}
					);
				break;
				case "fromTop":
					image.captionEL.animate({
						height: image.captionHeightEnd
						}, options.captionDuration, function() {

						}
					);
				break;
				case "fade":
					image.captionEL.animate({
						opacity: image.opacityEnd
						}, options.captionDuration, function() {

						}
					);
				break;
				case "fromBottom":
					image.captionEL.animate({
						height: image.captionHeightEnd,
						top: image.captionPosTop - image.captionHeightEnd
						}, options.captionDuration, function() {

						}
					);
				default:
				break;
			}
			/* // 1/ OK pour position en haut et open vers le bas
			image.captionEL.animate({
				height: image.height() * options.captionSize
				}, options.captionDuration, function() {

				}
			);*/
			/* // 2/ OK pour position en bas et open vers le haut
			image.captionEL.animate({
				height: image.captionHeight,
				top: image.captionPosTop - image.captionHeight
				}, options.captionDuration, function() {

				}
			);*/
			// 3/ OK pour position gauche et open vers droite
			/*image.captionEL.animate({
				width: image.captionWidth
				}, options.captionDuration, function() {

				}
			);*/
			// 4/ OK pour position droite et open vers gauche
			/*image.captionEL.animate({
				width: image.captionWidth
				}, options.captionDuration, function() {

				}
			);*/
		}

		function hideCaption(image) {
			image.captionEL.stop();
			switch (options.captionDirection) {
				case "fromLeft":
					image.captionEL.animate({
						width: image.captionWidthStart
						}, options.captionDuration, function() {

						}
					);
				break;
				case "fromRight":
					image.captionEL.animate({
						width: image.captionWidthStart
						}, options.captionDuration, function() {

						}
					);
				break;
				case "fromTop":
					image.captionEL.animate({
							height: image.captionHeightStart
							}, options.captionDuration, function() {

							}
						);
				break;
				case "fade":
					image.captionEL.animate({
							opacity: image.opacityStart
							}, options.captionDuration, function() {

							}
						);
				break;
				case "fromBottom":
				default:
					image.captionEL.animate({
						height: image.captionHeightStart,
						top: image.captionPosTop - image.captionHeightStart
						}, options.captionDuration, function() {

						}
					);
				break;
			}
			/* // OK pour position en haut et open vers le bas
			image.captionEL.animate({
				height: 0
				}, options.captionDuration, function() {

				}
			);*/
			/* // 2/ OK pour position en bas et open vers le haut
			image.captionEL.animate({
				height: 0,
				top: image.captionPosTop
				}, options.captionDuration, function() {

				}
			);*/
			// 3/ OK pour position gauche et open vers droite
			/*image.captionEL.animate({
				width: 0
				}, options.captionDuration, function() {

				}
			);*/
			// 4/ OK pour position droite et open vers gauche
			/*image.captionEL.animate({
				width: 0
				}, options.captionDuration, function() {

				}
			);*/
		}

		$(window).resize(function() {
			$('.captionck').each(function(i, image) {
				image = $(image);
				image.wrapper = $(image.parents('.effectck_wrap')[0]);
				// image.captionEL = $('.captionck_content', image.wrapper);
				setCaptionPosition(image);
			});
		});
/*
		$('.effectck').each(function(i, image) {
			switch(options.effect) {
				case 'edaf':
					$(image).css({'opacity':'0.5'});
					break;
				default:
					break;
			}
			$(image).hover(
				function() {
					var img = $(this);
					switch(options.effect) {
						case 'puff':
							// tester si element clone est déjà présent dans la page, alors on quitte
							if (img.parent('a').length) {
								imgfxlink = $(img.parent('a')).clone();
								imgfx = $('img', imgfxlink);
								$(document.body).append(imgfxlink);
								// imgfx.wrap(imgfxlink)
							} else {
								imgfx = img.clone();
								$(document.body).append(imgfx);
							}

							var position = img.offset();
							imgfx.css({
								position: "absolute",
								left: position.left,
								top: position.top
							});
							imgfx.effect('puff', 'slow', function() { imgfx.remove(); });
							break;
						case 'explode':
							if (img.data('exploding') == true) break;
							imgfx = img.clone();
							$(document.body).append(imgfx);
							var position = img.offset();
							imgfx.css({
								position: "absolute",
								left: position.left,
								top: position.top
							});
							img.css('opacity', '0');
							img.data('exploding', true);
							imgfx.hide('explode', 'slow', function() { imgfx.remove();img.data('exploding', false).animate({'opacity': '1'}); });
							// imgfx.effect('explode', 'slow', function() { $(this).animate({'opacity':'1'}); imgfx.remove(); });
							break;
						case 'fade':
							img.animate({'opacity':'0.5'});
							break;
						case 'edaf':
							img.animate({'opacity':'1'});
							break;
						case 'shake':
							img.effect('shake',{}, 1000);
							break;
						case 'bounce':
							img.effect('shake',{}, 1000);
							break;
						default:
							alert('Image Effect CK Error message : the effect ' + options.effect + ' is unknown...');
							break;
					}
				}, function() {
					var img = $(this);
					switch(options.effect) {
						case 'fade':
							img.animate({'opacity':'1'});
							break;
						case 'edaf':
							img.animate({'opacity':'0.5'});
							break;
						case 'explode':
							// $(this).show('explode', 'slow', function() { } );
							// if ($(this).css('opacity') != 1) break;
							// $(this).css({'opacity':'1'});
							break;
						default:
							break;
					}
			});
			return;
			tooltip = $(tooltip);
			tooltip.tip = $('> .tooltipck_tooltip', tooltip);
			getTooltipParams(tooltip);
			if ( options.ismobile === 1 ) {
				tooltip.click(function() {
					if ( tooltip.data('status') != 'open' ) {
						showTip(tooltip);
					} else {
						hideTip(tooltip);
					}
				});
			} else {
				tooltip.mouseover(function() {
					showTip(tooltip);
				});
				tooltip.mouseleave(function() {
					hideTip(tooltip);
				});
			}

			function showTip(el) {
				clearTimeout(el.timeout);
				el.timeout = setTimeout(function() {
					openTip(el);
				}, options.dureeIn);
			}

			function hideTip(el) {
				$(el).data('status', 'hide')
				clearTimeout(el.timeout);
				el.timeout = setTimeout(function() {
					closeTip(el);
				}, tooltip.dureeBulle);
			}

			function openTip(el) {
				tip = $(el.tip);
				el.data('status', 'open');
				if (el.data('status') == 'opened')
					return;
				tip.stop(true, true);
				tip.show(parseInt(tooltip.fxduration), options.fxtransition, {
					complete: function() {
						el.data('status', 'opened');
					}
				});
			}

			function closeTip(el) {
				tip = $(el.tip);
				el.data('status', 'close');
				tip.stop(true, true);
				tip.hide(0, options.fxtransition, {
					complete: function() {
						el.data('status', 'closed');
					}
				});
			}

			function getTooltipParams(tooltip) {
				if (tooltip.attr('rel').length) {
					var params = tooltip.attr('rel').split('|');
					for (var i = 0; i < params.length; i++) {
						param = params[i];
//                    params.each( function(param) {
						// if (param.indexOf('w=') != -1) largeur = param.replace("w=", "");
						if (param.indexOf('mood=') != -1)
							tooltip.fxduration = param.replace("mood=", "");
						if (param.indexOf('tipd=') != -1)
							tooltip.dureeBulle = param.replace("tipd=", "");
						if (param.indexOf('offsetx=') != -1)
							tooltip.offsetx = parseInt(param.replace("offsetx=", ""));
						if (param.indexOf('offsety=') != -1)
							tooltip.offsety = parseInt(param.replace("offsety=", ""));
//                    });
					}

					$(tooltip.tip).css({
						'opacity': options.opacite,
						'marginTop': tooltip.offsety,
						'marginLeft': tooltip.offsetx
					});
				}
			}
		});*/
	}
})(jQuery);



/*!
reflection.js for jQuery v1.12
(c) 2006-2013 Christophe Beyls <http://www.digitalia.be>
MIT-style license.
*/

;(function($) {

$.fn.reflect = function(options) {
options = $.extend({
height: 1/3,
opacity: 0.5
}, options);

return this.unreflect().each(function() {
var img = this;
if (img.tagName === 'IMG') {
function doReflect() {
var imageWidth = img.width, imageHeight = img.height, reflection, reflectionHeight, wrapper, context, gradient;
reflectionHeight = Math.floor((options.height > 1) ? Math.min(imageHeight, options.height) : imageHeight * options.height);

reflection = $("<canvas />")[0];
if (reflection.getContext) {
context = reflection.getContext("2d");
try {
$(reflection).attr({width: imageWidth, height: reflectionHeight});
context.save();
context.translate(0, imageHeight-1);
context.scale(1, -1);
context.drawImage(img, 0, 0, imageWidth, imageHeight);
context.restore();
context.globalCompositeOperation = "destination-out";

gradient = context.createLinearGradient(0, 0, 0, reflectionHeight);
gradient.addColorStop(0, "rgba(255, 255, 255, " + (1 - options.opacity) + ")");
gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
context.fillStyle = gradient;
context.rect(0, 0, imageWidth, reflectionHeight);
context.fill();
} catch(e) {
return;
}
} else {
if (!window.ActiveXObject) return;
reflection = $("<img />").attr("src", img.src).css({
width: imageWidth,
height: imageHeight,
marginBottom: reflectionHeight - imageHeight,
filter: "FlipV progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (options.opacity * 100) + ", FinishOpacity=0, Style=1, StartX=0, StartY=0, FinishX=0, FinishY=" + (reflectionHeight / imageHeight * 100) + ")"
})[0];
}
$(reflection).css({display: "block", border: 0});

wrapper = $((img.parentNode.tagName === 'A') ? "<span />" : "<div />").insertAfter(img).append([img, reflection])[0];
wrapper.className = img.className;
$(img).data("reflected", wrapper.style.cssText = img.style.cssText);
$(wrapper).css({width: imageWidth, height: imageHeight + reflectionHeight, overflow: "hidden"});
img.style.cssText = "display: block; border: 0px";
img.className = "reflected";
}

if (img.complete) doReflect();
else $(img).load(doReflect);
}
});
}

$.fn.unreflect = function() {
return this.unbind("load").each(function() {
var img = this, reflected = $(this).data("reflected"), wrapper;

if (reflected !== undefined) {
wrapper = img.parentNode;
img.className = wrapper.className;
img.style.cssText = reflected;
$(img).data("reflected", null);
wrapper.parentNode.replaceChild(img, wrapper);
}
});
}

})(window.jQuery || window.Zepto); 

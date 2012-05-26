/**
 * jq.pbmenu - a native-like top swipedown menu for playbook apps
 *
 * http://github.com/sterlingwes/webworks-playbook-menu
 *
 * Copyright (c) 2012 Wes Johnson (@SterlingWes), http://wesquire.ca/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */ 
 
(function ($) {
    
    $.fn["pbmenu"] = function () {
		return pbmenu;
    };

	var pbmenu = (function() {

    	// internal properties    	
    	this.el				= null,
    	this.isOpen			= false;
    	
    	// user-definable configuration, these are the defaults
    	var config = {
    		style: {
    			'width':				'100%',
    			'height':				'140px',
    			'left':					'0px',
    			'background':			'url(img/vertical_cloth.png)',
    			'-webkit-box-shadow': 	'inset 0px -5px 20px black',
				'text-align':			'right'
    		},
			buttons: 		undefined,
    		toggleBtn:		undefined,
			alignBoxes:		false,
			defaultAlign:	'right',
			elId:			'jQUi-pbmenu',
			elMaskId:		'jQUi-pbmask',
			jqUiId:			'jQUi'
    	};
		
		// helper functions
		var utils = {
		
			// traverses nested objects to check whether a target property exists
			exists:	function(obj, prop) {
				var parts = prop.split('.');
				for(var i = 0, l = parts.length; i < l; i++) {
					var part = parts[i];
					if(obj !== null && typeof obj === "object" && part in obj)
						obj = obj[part];
					else
						return false;
				}
				return true;
			},
			
			// updates config values, exposed to user as .set({})
			applyConfig: function(opts) {
				if(opts) {
					for(item in opts) {
						config[item] = opts[item];
					}
					// ensure hese values cannot be overwritten
					config.style['z-index'] = '1000';
					config.style['position']= 'absolute';
					config.style['top']		= '-'+config.style.height;
					if($.isArray(opts.buttons) && opts.buttons.length>0) {
						utils.verifyConfig();
						utils.renderButtons();
					}
				}
			},
			
			// checks onClick values in button array, escapes quotes as needed
			verifyConfig: function() {
				if(config.buttons && config.buttons.length>0)
					for(b=0;b<config.buttons.length;b++) {
						if(config.buttons[b].onClick)
							config.buttons[b].onClick = config.buttons[b].onClick.replace(/"/g,'\'').replace(/\\'/g,'\'');
						if(config.buttons[b].align)	config.alignBoxes = true;
					}
			},
			
			// sets our webworks swipedown listener
			setListener: function() {
				if(utils.exists(window,'blackberry.app.event'))
					blackberry.app.event.onSwipeDown(anim.show);
				else
					console.warn('blackberry.app.event is not configured, is this a Playbook WebWorks app?');
			},
			
			// add pb menu button elements to the DOM and handle binding event listeners
			renderButtons: function() {
				if(config.buttons && config.buttons.length>0) {
					// clear old ones
					if(pbmenu.el) pbmenu.el.html('');
					// check if we're aligning
					var defaultParent;
					if(config.alignBoxes) {
						pbmenu.el.append('<div id="pbmenu-left"></div>').append('<div id="pbmenu-right"></div>');
						defaultParent = pbmenu.el.find('#pbmenu-'+config.defaultAlign);
					} else
						defaultParent = pbmenu.el;
					// add our buttons
					for(a=0;a<config.buttons.length;a++) {
						var btn = config.buttons[a];
						var parent;
						if(config.alignBoxes && btn.align)
							parent = pbmenu.el.find('#pbmenu-'+btn.align);
						else
							parent = defaultParent;
						parent.append('<div id="pbmenuBtn'+a+'" class="icon '+btn.icon+(btn.active ? ' pbmenu-btn-active' : ' pbmenu-btn')+'" data-click="'+(btn.onClick || '')+'">'+btn.caption+'</div>');
					}
					// add listeners for all our buttons
					$('.pbmenu-btn').bind('click',function(e) {
						eval(e.target.dataset.click);
						anim.hide();
					});
				}
			},
			
			// updates existing buttons in menu, setting active button and resetting event bindings
			setActive: function(i,active) {
				// deactivate previously active button & set target
				if(config.buttons) {
					// we'll be resetting listeners
					$('.pbmenu-btn').unbind('click');
					for(index=0;index<config.buttons.length;index++) {
						if(config.buttons[index].active) {
							config.buttons[index].active == false;
							$('#pbmenuBtn'+index).removeClass('pbmenu-btn-active').addClass('pbmenu-btn');
						}
						if(("number" == typeof i && index == i) 
						|| ("string" == typeof i && config.buttons[index].caption.toLowerCase() == i.toLowerCase())) {
							target = index;
							config.buttons[index].active = active;
							if(active)	$('#pbmenuBtn'+index).removeClass('pbmenu-btn').addClass('pbmenu-btn-active');
							else		$('#pbmenuBtn'+index).removeClass('pbmenu-btn-active').addClass('pbmenu-btn');
						}
					}
					// add listeners
					$('.pbmenu-btn').bind('click',function(e) {
						eval(e.target.dataset.click);
						anim.hide();
					});
				}
			}
		};
    	
    	// animation methods
		var anim = {
		
			// adjust our menu mask if orientation changes while menu is open
			flip:	function() {
				$('#'+config.elMaskId).css('height',window.innerHeight+'px');
			},
			
			// add or remove the mask we use to listen for menu close click events (outside of menu)
			mask:	function(show) {
				if(show) {
					$('#'+config.jqUiId).append('<div id='+config.elMaskId+' style="z-index:1000;position:absolute;top:0px;left:0px;width:100%;height:'+$('#'+config.jqUiId).css('height')+'"></div>');
					$('#'+config.elMaskId).bind('click',anim.hide);
				} else
					$('#'+config.elMaskId).remove();
			},
			
			// show the menu
			show:	function() {
				if(!pbmenu.isOpen) {
					pbmenu.el.css('display','inline');
					$('#'+config.jqUiId).css('-webkit-transition','all 0.5s ease-in-out');
					$('#'+config.jqUiId).css('-webkit-transform','translate(0, '+config.style.height+')');
					anim.mask(true);
					pbmenu.isOpen = true;
					return true;
				} else
					return false;
			},
			
			// hide the menu
			hide: 	function() {
				if(pbmenu.el && pbmenu.isOpen) {
					$('#'+config.jqUiId).css('-webkit-transition','all 0.5s ease-in-out');
					$('#'+config.jqUiId).css('-webkit-transform','none');
					anim.mask(false);
					pbmenu.isOpen = false;
					return true;
				} else
					return false;
			},
			
			// show or hide the menu, whichever is opposite of current state
			toggle:	function() {
				if(!anim.show()) anim.hide();
			}
		};
    	
    	// initialization
    	function init(opts) {
    		
			// add our pb menu element to the DOM
			$('#'+config.jqUiId).append($('<div id="'+config.elId+'" style="display:none;"></div>'));
			pbmenu.el = $('#'+config.elId);
    		
    		// sync config
    		utils.applyConfig(opts);
			
    		// apply some styling
			for(css in config.style) {
				pbmenu.el.css(css,config.style[css]);
			}
			
			// set our PB swipedown listener
			utils.setListener();
			
			// add toggle button if declared.. helpful for people testing in browser or who have no swipe-down
			if(config.toggleBtn && "string" == typeof config.toggleBtn)
				$('#'+config.toggleBtn).bind('click', anim.toggle);
			
			
			// listen for orientation changes so that we can adjust our menu mask
			window.addEventListener('orientationchange', anim.flip, true);
    	}    	
		
    	// exposed methods & properties
    	return {
		
			// init
			// ----
			// initial setup, must be called. Preferably on ready(), takes config options
			// params: an object of config values
			//
    		init:		init,
			
			// set
			// ---
			// update config values after init
			// params: an object of config values
			//
			set:		utils.applyConfig,
			
			// listen
			// ------
			// exposes the setter for binding the swipedown listener, should it become unset
			//
			listen:		utils.setListener,
			
			// buttons
			// -------
			// allows for setting the config.buttons array directly
			// params:
			// - array: an array of button objects, that may resemble:
			// { 	caption: 	'Home'
			//		icon:		'home,
			//		active:		true,
			//		align:		'right',
			//		onClick:	'doThis();' }
			// caption and icon are required attributes. Icon is a jqMobi SVG icon reference, not a filename.
			//
			buttons:	function(btns) {
				if($.isArray(btns) && btns.length>0) {
					config.buttons = btns;
					utils.verifyConfig();
					utils.renderButtons();
				} else {
					console.error('Provided buttons must be an array of button objects');
				}
			},
			
			// setActive
			// ---------
			// sets active state for button element. Currently active buttons that aren't the target will be set to inactive.
			// params:
			// - number/string: index or caption of target button
			// - boolean: true for active, false for inactive
			//
			setActive:	utils.setActive
    	};
    })();
        
})(jq);
# WebWorks PlayBook Menu

A native-like HTML5 BlackBerry PlayBook swipe-down application menu for WebWorks apps.

Built for & tested with the [jqMobi](http://jqmobi.com) framework, but should also play well with jQuery with little-to-no modification.

---

# Usage

## Step 1: Initialize

	$.ready(function() {
		
		$.fn.pbmenu().init();
		
	});
	
By default, `init()` will setup an empty menu. The menu will be added to your `div#jQUi` container. *If you aren't using jqMobi, or a div with the `jQUi` id*, specify your container's id via the `config.jqUiId` option.

You can pass `init()` any of the config options in Step 2, which are all optional.

## Step 2: Configuration

You can configure pbmenu via the *init()* call or via *set()*. All of the options listed below are **optional**. These are the defaults.

	$.fn.pbmenu().set({
		style: {
			'height':				'140px',
			'background':			'url(img/vertical_cloth.png)',
		},
		buttons: 		[],
		toggleBtn:		undefined,
		alignBoxes:		false,
		defaultAlign:	'right',
		elId:			'jQUi-pbmenu',
		elMaskId:		'jQUi-pbmask',
		jqUiId:			'jQUi'
	});
	
You can add any number of CSS style properties to the `config.style` object. These affect the menu only, not the buttons.
	
## Step 3: Adding Buttons

You may add buttons programmatically via the `init()` or `set()` methods, as shown above. Or via the *buttons()* method, which takes an array:

	$.fn.pbmenu().buttons([
		{
			caption: 	'Home',
			icon:		'home',
			active:		true
		},
		{
			caption: 	'Edit',
			icon:		'pencil',
			align:		'left',
			onClick:	'alert("Edited!!")'
		},
		{
			caption: 	'My Profile',
			icon:		'user'
		},
		{
			caption: 	'Delete',
			icon:		'trash',
			align:		'left',
			onClick:	'alert("Deleted!!")'
		},
		{
			caption: 	'Send',
			icon:		'mail'
		}
	]);
	
Each button object can have 5 properties. `Caption` and `icon` are required.

*	`caption`: The text appearing underneath your button icon.
*	`icon`: The icon for your button. Corresponds to the [jqMobi UI SVG](http://jqmobi.com/testdrive/#uiicons) icon set. See the sample.
*	`active`: Whether the button should be marked active & non-clickable.
*	`align`: Whether the button should be grouped left or right.
*	`onClick`: The javascript you want to call when the button is clicked.

Call `buttons()` every time you need to add/remove/update your menu buttons. To change the active button, simply call *setActive()*:

	$.fn.pbmenu().setActive('Send',true);
	
`setActive()` takes two arguments. The first can be either the caption of the button you wish to activate / deactivate or its zero-based array index. The following is equivalent to the prior:

	$.fn.pbmenu().setActive(4,true);
	
The second argument is a boolean indicating whether the button is active.

## License

(The MIT License)

Copyright (c) 2012 Wes Johnson ([@SterlingWes](http://twitter.com/SterlingWes) / [wesquire.ca](http://wesquire.ca))

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
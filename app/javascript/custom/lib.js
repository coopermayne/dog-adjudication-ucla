(function() {
var t = '';
var CONTAINER_ID = '5kjl3_container_id';
var BUBBLE_COLOR = 'rgb(47, 47, 47)';
var HIGHLIGHT_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path xmlns="http://www.w3.org/2000/svg" fill="white" d="M24.001 8.534l-11.103 11.218-5.898 1.248 1.361-5.784 11.104-11.216 4.536 4.534zm-24 10.466l-.001 2h5v-2h-4.999z"/></svg>';
var TWITTER_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path xmlns="http://www.w3.org/2000/svg" fill="white" d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>';
var FACEBOOK_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path xmlns="http://www.w3.org/2000/svg" fill="white" d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>';
var CLIPBOARD_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M7 13h10v1h-10v-1zm15-11v22h-20v-22h3c1.229 0 2.18-1.084 3-2h8c.82.916 1.771 2 3 2h3zm-11 1c0 .552.448 1 1 1s1-.448 1-1-.448-1-1-1-1 .448-1 1zm9 15.135c-1.073 1.355-2.448 2.763-3.824 3.865h3.824v-3.865zm0-14.135h-4l-2 2h-3.898l-2.102-2h-4v18h7.362c4.156 0 2.638-6 2.638-6s6 1.65 6-2.457v-9.543zm-13 12h5v-1h-5v1zm0-4h10v-1h-10v1zm0-2h10v-1h-10v1z"/></svg>';
var CIPBOARD_DONE_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M7 14.729l.855-1.151c1 .484 1.635.852 2.76 1.654 2.113-2.399 3.511-3.616 6.106-5.231l.279.64c-2.141 1.869-3.709 3.949-5.967 7.999-1.393-1.64-2.322-2.326-4.033-3.911zm15-11.729v21h-20v-21h4.666l-2.666 2.808v16.192h16v-16.192l-2.609-2.808h4.609zm-3.646 4l-3.312-3.569v-.41c.001-1.668-1.352-3.021-3.021-3.021-1.667 0-3.021 1.332-3.021 3l.001.431-3.298 3.569h12.651zm-6.354-5c.553 0 1 .448 1 1s-.447 1-1 1-1-.448-1-1 .447-1 1-1z"/></svg>';
var config = {};
var defaultConfig = {};

defaultConfig.bubbleColor = BUBBLE_COLOR;
defaultConfig.buttons = [
    {
        svg: CLIPBOARD_ICON_SVG,
        onclick: function(e, range) {
					console.log(getTimestamp(range))
					
					//copy to clipboard
					var str = getTimestamp(range)
					const el = document.createElement('textarea');
					el.value = str;
					document.body.appendChild(el);
					el.select();
					document.execCommand('copy');
					document.body.removeChild(el);

					//change icon to indicate the shift
					var xx = e.target.parentElement.parentElement
					e.target.parentElement.parentElement.removeChild(e.target.parentElement)
        	xx.appendChild(generateButton(CIPBOARD_DONE_ICON_SVG, function(e) {}))
        }
    }
];

function getTimestamp(range) {
	var ed, edF, selObj, selRange, st, stF, str;
	selRange = range
  console.log(range)
	st = selRange.startContainer.parentElement.dataset.start;
	ed = selRange.endContainer.parentElement.dataset.end;
	stF = moment("2015-01-01").startOf('day').seconds(st).format('H:mm:ss');
	edF = moment("2015-01-01").startOf('day').seconds(ed).format('H:mm:ss');
	str = "[" + stF + "-" + edF + "]";
	return str
}

var enc = encodeURI;

function encQ(s) {
    return enc('"' + s + '"');
}

function setStyle(el, obj, val) {
    var styles = (el.getAttribute('style') || '').split(';');
    var orig = {};
    var newStyles = [];
    styles.forEach(function(s) {
        if (s === '') {
            return;
        }
        var parts = s.split(':');
        orig[parts[0].trim()] = parts[1].trim();
    });
    var toSerialize = {};

    if (typeof val !== 'undefined') {
        orig[obj] = val;
        toSerialize = orig;
    } else {
        toSerialize = obj;
    }

    Object.keys(toSerialize).forEach(function(k) {
        if (toSerialize[k] !== null) {
            newStyles.push(k + ': ' + toSerialize[k]);
        }
    });
    el.setAttribute('style', newStyles.join('; '));
}

function generateButton(svgString, onclick) {
    var parser = new DOMParser();
    var svg = parser.parseFromString(svgString, "image/svg+xml").childNodes[0];
    var hButton = document.createElement('div');
    hButton.appendChild(svg);
    setStyle(hButton, {
        display: 'inline-block',
        margin: '0',
        cursor: 'pointer',
        padding: '7px'
    });

    hButton.onclick = hButton.ontouchend = onclick;

    return hButton;
}

function insertHighlightOptionNode(selection) {
    var range = selection.getRangeAt(0);
    if (range.collapsed || !range.toString().trim()) {
        return;
    }

    var container = document.createElement('div');
    container.id = CONTAINER_ID;
    setStyle(container, {
        position: 'absolute',
        color: 'white',
        visibility: 'hidden',
        padding: '0 7px'
    });
    container.onmousedown = container.ontouchstart = function(e) {
        e.preventDefault();
        e.stopPropagation();
    };
    container.onmouseup = container.ontouchend = function(e) {
        e.stopPropagation();
    };

    var bubbleOptions = document.createElement('div');
    setStyle(bubbleOptions, {
        'white-space': 'nowrap',
        'border-radius': '4px',
        display: 'inline-block',
        background: defaultConfig.bubbleColor,
        padding: '0 4px'
    });
    var downCarrot = document.createElement('div');
    setStyle(downCarrot, {
        width: 0,
        height: 0, 
        'border-left': '6px solid transparent',
        'border-right': '6px solid transparent',
        'border-top': '10px solid ' + defaultConfig.bubbleColor,
        margin: 'auto',
    });
		var textnode = document.createTextNode(getTimestamp(range));         // Create a text node

    bubbleOptions.appendChild(textnode)
    container.appendChild(bubbleOptions);
    container.appendChild(downCarrot);

    config.buttons.forEach(function(buttonConfig) {
        bubbleOptions.appendChild(generateButton(buttonConfig.svg, function(e) {
            buttonConfig.onclick(e, range);
        })); 
    });

    // Calculate bounds of range
    var cRects = range.getClientRects();
    var hBounds = [];
    for (var i = 0; i < cRects.length; i++) {
        hBounds.push(cRects[i].left);
        hBounds.push(cRects[i].right);
    }
    var rLeft = Math.min.apply(null, hBounds);
    var rRight = Math.max.apply(null, hBounds);

    var y = cRects[0].top + window.scrollY;
    var x = rLeft + window.scrollX + ((rRight - rLeft) / 2);
    
    document.body.appendChild(container);

    var containerHeight = window.getComputedStyle(container).getPropertyValue('height');
    var containerWidth = window.getComputedStyle(container).getPropertyValue('width');
    var cWidth = parseInt(containerWidth.replace('px', ''));
    var windowWidth = window.innerWidth;
    
    var left = x - cWidth / 2;
    if (left < 0) {
        setStyle(container, 'left',  left + 'px');
    } else if (left + cWidth > windowWidth) {
        setStyle(container, 'right',  0 + 'px');
    } else {
        setStyle(container, 'left',  left + 'px');
    }

    var top = y - parseInt(containerHeight.replace('px', ''))
    if (top < 0) {
        top = 0
    }

    setStyle(container, 'z-index', 99999);
    setStyle(container, 'top', top + 'px');
    setStyle(container, 'visibility', 'visible');
}

function showHighlightOptions(e) {
    t = document.getSelection();

    if (t) {
        insertHighlightOptionNode(t);
    }
}

function clear() {
    var e = document.getElementById(CONTAINER_ID);
    if (e) {
        e.parentElement.removeChild(e);
    }
}

function init(customConfig) {
    config = defaultConfig;
    Object.keys(customConfig || {}).forEach(function(k) {
        config[k] = customConfig[k]; 
    });
    document.onmouseup = document.ontouchend = showHighlightOptions;
    document.onmousedown = document.ontouchstart = clear;
}

window.TinyQ = {
    init: function(config) {
        init(config)
    }
}

})();

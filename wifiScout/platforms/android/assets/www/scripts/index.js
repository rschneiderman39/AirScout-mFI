// Find matches
var mql = window.matchMedia("(orientation: portrait)");

// If there are matches, we're in portrait
if(mql.matches) {  
	// Portrait orientation
	console.log('orientation is portrait');
} else {  
	// Landscape orientation
	console.log('orientation is landscape');
}

// Add a media query change listener
mql.addListener(function(m) {
	if(m.matches) {
		// Changed to portrait
		console.log('orientation changed to portrait');
	}
	else {
		// Changed to landscape
		console.log('orientation changed to landscape');
	}
});
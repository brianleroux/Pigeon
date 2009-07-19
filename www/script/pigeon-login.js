var friends_timeline_url = "http://www.twitter.com/statuses/friends_timeline.json";
var tweet_post_url = "http://www.twitter.com/statuses/update.json";

var tweet_response = "";

// Global Data Store
x$.data = {};

x$(window).load(function() {

	x$("#tweet_link").click(function() {
		var twt = document.getElementById("tweet_content").value;
		post_tweet(twt,x$.data.m_user,x$.data.m_pass,"#content");
		return false;
	});

	x$("#login_link").click(login_function);
	x$("#login_form").on("submit",login_function);

});

var load_tweets = function(container_id,user,passw) {
	
	// Hide the login Screen
	x$("#login_screen").setStyle("display","none");
		
	x$(container_id).xhr(friends_timeline_url, { 
	    callback: function () { render_tweets(container_id, this.responseText); },
			headers: [{name:"Authorization", value: "Basic " + btoa(user + ":" + passw)}]
        }
    );
}

var render_tweets = function(container_id, new_tweets) {
	var tweetstream = eval(new_tweets);

	for (var i=0; i < tweetstream.length; i++) {

		x$("#content").bottom(format_tweet({
            profile_image:tweetstream[i].user.profile_image_url,
            user_name:tweetstream[i].user.name,
            tweet_text:tweetstream[i].text
            }));
	}
}

var format_tweet = function(options) {
	var tweetstring = "<div class=\"tweet\">\n<img src=\"{PROFILE_IMAGE}\" />\n<p class=\"user_name\">{USER_NAME}</p>\n		<p class=\"tweet_text\">{TWEET_TEXT}</p>\n</div>";
	tweetstring = tweetstring.replace("{PROFILE_IMAGE}",options.profile_image);
	tweetstring = tweetstring.replace("{USER_NAME}",options.user_name);
	tweetstring = tweetstring.replace("{TWEET_TEXT}",options.tweet_text);
	return tweetstring;
}

var post_tweet = function(status,user,passw,container_id) {
 	var params = "status=" + encodeURIComponent(status);
 	x$(container_id).xhr(tweet_post_url,
        { callback: function() { render_new_tweet(this.responseText); },
			headers: [{name:"Authorization", value: "Basic " + btoa(user + ":" + passw)},
            {name:"Content-Length",value: params.length},
            {name:"Content-type",value:"application/x-www-form-urlencoded"},
            {name:"Connection",value: "close"}],
 			method: "post",
 			data: params
	});
	navigator.notification.beep(2);
}


var render_new_tweet = function(new_tweet) {
	try {
		tweet_response = eval("[" + new_tweet + "]");
	} catch (e) { }
	
	x$("#content").top(
        format_tweet({
            profile_image:tweet_response[0].user.profile_image_url,
            user_name:tweet_response[0].user.name,
            tweet_text:tweet_response[0].text
        }))

    // After we tweet, lets clear the input
    x$("#tweet_content").first().value = "";
}

var show_panel = function(identifier) {
	x$(".twt_panel").css({display:'none'});
	x$(identifier).css({display:'block'});
}

var login_function = function(e) {		
	document.getElementById('user_field').blur(); 
	document.getElementById('pass_field').blur(); 
	
	x$.data.m_user = x$("#user_field").elements[0].value;
	x$.data.m_pass = x$("#pass_field").elements[0].value;
		
	x$("#post_new_tweet").css({display:"block"});
	
	load_tweets("#content",x$.data.m_user,x$.data.m_pass);
	show_panel("#content");
	x$("#post_new_tweet").css({display:"block"});
	e.preventDefault();
}

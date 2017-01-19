{% extends "./layout.swig" %}

{% block title %}
	<h1>{{ data.basename | capitalize }}</h1>
	{% if data.basename == 'playground' %}
		<p>You can play around in the playground right here. All you need to do is change the script and then click the activate button.</p>
	{% else %}
		<p>You can play around with {{ data.basename }}.js right here. All you need to do is change the script and then click the activate button.</p>
	{% endif %}
{% endblock %}

{% block head %}
	{% parent %}
	<script src="../../bower_components/ace-builds/src-min/ace.js" type="text/javascript" charset="utf-8"></script>
	<style type="text/css" media="screen">
	    #editor {
	    	margin-top: 1em;
	        border-radius: 4px 4px 0;
	        border: 1px solid #ddd;
	        height: 80vh;
	        font-size: 14px;
	    }

		/* IE8 only */
		@media \0screen {
		    #editor {height:80px;}
		}

		@-webkit-keyframes fadeIn {
		  0% {opacity: 0;}
		  20% {opacity: 1;}
		  80% {opacity: 1;}
		  100% {opacity: 0;}
		}

		@keyframes fadeIn {
		  0% {opacity: 0;}
		  20% {opacity: 1;}
		  80% {opacity: 1;}
		  100% {opacity: 0;}
		}

		.fadeIn {
		  	-webkit-animation-name: fadeIn;
		    animation-name: fadeIn;
		    animation-duration: 6s;
			opacity:0;
		}
	</style>
{% endblock %}


{% block content %}
		<p>
			<button class="btn btn-default btn-lg btn-block" onclick="window.click(event)" type="button">Activate</button>
		</p>

		<div id="success" role="alert" class="alert alert-success" style="display:none">
			<strong>Well Done!</strong> The task has been successfully completed.
		</div>
		<div id="error" role="alert" class="alert alert-danger" style="display:none">
			<strong>Oh Snap!</strong> Something went wrong with the task. Why don't you fix it and try again?
		</div>

   		<div id="editor">
{{ data.filecontents }}
		</div>

		<script>
		    var editor = ace.edit("editor");
		    editor.setTheme("ace/theme/monokai");
		    editor.getSession().setMode("ace/mode/javascript");
		    editor.setOption("showPrintMargin", false);
		    var win;
		    var feedbackId = 'success';

		    function click(event){
		    	event.target.blur();

		    	// assume the feedback is success
				feedbackId = 'success';

				// clean out open window
		    	if (win){
		    		win.close();
		    		win = null;
		    	}

		    	win = window.open('../static/playpip.html', 'pip');
		    	win.focus();

		    	win.onload = function(){
		    		// first set the unload listener
					win.addEventListener('unload', function(event) {
						var el = document.getElementById(feedbackId);
						window.focus();
						fade(el);
					});

					// then activate the player (this ensures that when )
					win.piActivate(editor.getValue());
		    	};
		    }

	    	window.addEventListener('error', function(e){
	    		console.error(e);
	    		feedbackId = 'error';
	    	});

	    	function fade(el){
				el.style.display = 'block';
				el.classList.add('fadeIn');
				setTimeout(function(){
					el.style.display = 'none';
					el.classList.remove('fadeIn');
				}, 6000);
	    	}

		</script>
{% endblock content %}
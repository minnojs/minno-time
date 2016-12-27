<!DOCTYPE html>
<html lang="en">
	<head>

		<!-- Meta, title, CSS, favicons, etc. -->
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="Bootstrap, a sleek, intuitive, and powerful mobile first front-end framework for faster and easier web development.">
		<meta name="keywords" content="HTML, CSS, JS, JavaScript, framework, bootstrap, front-end, frontend, web development">
		<meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">

		<title>miPlayer &middot; V0.3</title>

		{% block head %}
		<!-- Bootstrap core CSS -->
		<link href="../../bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
		<link href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/sunburst.min.css" rel="stylesheet">
		<link href="../css/style.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
		<style type="text/css">
			pre {display:block;overflow-x:auto;padding:0.5em;background:#000;color:#f8f8f8;-webkit-text-size-adjust:none}
			table {padding: 0;}
			table tr {border-top: 1px solid #cccccc;background-color: white;margin: 0;padding: 0;}
			table tr:nth-child(2n) {background-color: #f8f8f8;}
			table tr th {font-weight: bold;border: 1px solid #cccccc;text-align: left;margin: 0;padding: 6px 13px;}
			table tr td {border: 1px solid #cccccc;text-align: left;margin: 0;padding: 6px 13px;}
			table tr th :first-child, table tr td :first-child {margin-top: 0;}
			table tr th :last-child, table tr td :last-child {margin-bottom: 0;}
		</style>
		{% endblock head %}

		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->

		<!-- Favicons -->
		<link rel="apple-touch-icon" href="../apple-touch-icon.png">
		<link rel="icon" href="../favicon.ico">

	</head>

	<body>
		<a id="skippy" class="sr-only sr-only-focusable" href="#content"><div class="container"><span class="skiplink-text">Skip to main content</span></div></a>

		<!-- Docs master nav -->
		<header class="navbar navbar-static-top bs-docs-nav" id="top" role="banner">
			<div class="container">
				<div class="navbar-header">
					<button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a href="/" class="navbar-brand">Minno</a>
				</div>
				<nav class="collapse navbar-collapse bs-navbar-collapse">
					<ul class="nav navbar-nav">
						<li>
							<a href="/minno-quest/0.1/basics/overview.html">Basics</a>
						</li>
						<li>
							<a href="/minno-quest/0.1/quest/overview.html">miQuest</a>
						</li>
						<li>
							<a href="/minno-quest/0.1/manager/overview.html">miManager</a>
						</li>
						<li class="active">
							<a href="javascript:void(0);">miPlayer</a>
						</li>
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li>
							<form class="navbar-form navbar-left" role="search" method="get" action="http://www.google.com/search">
							  <div class="form-group">
							    <input type="text" class="form-control" placeholder="Search" name="q" size="25" maxlength="255">
							  </div>
							  <button type="submit" class="btn btn-default" value="Google Search">
							    <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
							  </button>
							  <input type="hidden" name="sitesearch" value="minnojs.github.io" checked />
							</form>
						</li>
						<li><a href="https://github.com/minnojs/minno-time">Github</a></li>
					</ul>
				</nav>
			</div>
		</header>

		<div id="content" class="bs-docs-header">
			<div class="container">
				{% block title %} Minno {% endblock %}
			</div>
		</div>

		<div class="container bs-docs-container">
			<div class="row">
				<div class="col-md-9" role="main">
					{% block content %}{% endblock %}
				</div>

				<div class="col-md-3" role="complementary">
					<nav class="bs-docs-sidebar hidden-print hidden-xs hidden-sm">

						{% macro navitem(name, filename, current) %}
							<li class="{% if filename.indexOf('/' + current, filename.length - current.length - 1) !== -1 %} active {% endif %}">
								<a href="{{ filename }}.html">{{ name }}</a>
							</li>
						{% endmacro listitem %}

						{% macro example(name, filename, current) %}
							<li class="{% if filename.indexOf('/' + current, filename.length - current.length - 1) !== -1 %} active {% endif %}">
								<div>
									<a href="{{ filename }}Docco.html">{{ name }}</a>
									<a href="{{ filename }}.js" download="{{filename}}.js" title="Download"><span class="glyphicon glyphicon-download"></span></a>
									<a href="{{ filename }}Play.html" title="Play"><span class="glyphicon glyphicon-play-circle"></span></a>
								</div>
							</li>
						{% endmacro example %}

						<ul class="nav bs-docs-sidenav">

							{{ navitem("Overview", "../tutorials/overview", data.basename) }}
							{{ navitem("Hello World", "../tutorials/hello", data.basename) }}
							{{ navitem("Slide show", "../tutorials/slideshow", data.basename) }}
							<li>
								<a href="javascript:void(0)">Stroop</a>
								<ul class="nav">
									{{ example("Setup", "../tutorials/stroop-setup", data.basename) }}
									{{ example("Interactions", "../tutorials/stroop-interactions", data.basename) }}
									{{ example("inheritance", "../tutorials/stroop-inheritance", data.basename) }}
									{{ example("Blocks", "../tutorials/stroop-block", data.basename) }}
									{{ example("Task", "../tutorials/stroop-task", data.basename) }}
								</ul>
							</li>
							<li>
								<a href="../examples/README.html">Examples</a>
								<ul class="nav">
									{{ example("IAT", "../examples/iat", data.basename) }}
									{{ example("AMP", "../examples/amp", data.basename) }}
									{{ example("BIAT", "../examples/biat", data.basename) }}
									{{ example("GNAT", "../examples/gnat", data.basename) }}
									{{ example("SPF", "../examples/spf", data.basename) }}
									{{ example("ST-IAT", "../examples/st-iat", data.basename) }}
									{{ example("Evaluative priming", "../examples/evaluative_priming", data.basename) }}
									{{ example("Evaluative priming 2", "../examples/evaluative_priming2", data.basename) }}
								</ul>
							</li>
							<li>
								<a href="../snippets/README.html">Snippets</a>
								<ul class="nav">
									{{ example("Inheritance", "../snippets/inheritance", data.basename) }}
									{{ example("Input", "../snippets/input", data.basename) }}
									{{ example("Interactions", "../snippets/interactions", data.basename) }}
									{{ example("Sequence", "../snippets/sequence", data.basename) }}
									{{ example("Settings", "../snippets/settings", data.basename) }}
									{{ example("Stimulus", "../snippets/stimulus", data.basename) }}
									{{ example("Touch", "../snippets/touch", data.basename) }}
									{{ example("Trial", "../snippets/trial", data.basename) }}
								</ul>
							</li>
							{{ navitem("API", "../tutorials/API", data.basename) }}
							{{ navitem("Scorer", "../tutorials/scorer", data.basename) }}
							{{ navitem("Resources", "../tutorials/resources", data.basename) }}
							{{ navitem("Playground", "../tutorials/playgroundPlay", data.basename) }}
						</ul>
						<!-- <a class="back-to-top" href="#top">
							Back to top
						</a> -->
					</nav>
				</div>
			</div>
		</div>

		<!-- Footer
		================================================== -->
		<footer class="bs-docs-footer" role="contentinfo">
			<div class="container">
				<p>Created by Project Implicit for the benefit of all.</p>
				<!-- <p>Code licensed under <a href="https://github.com/twbs/bootstrap/blob/master/LICENSE" target="_blank">MIT</a>, documentation under <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.</p> -->
				<ul class="bs-docs-footer-links text-muted">
					<li>Currently v0.0.27</li>
					<li>&middot;</li>
					<li><a href="https://github.com/minnojs/minno-time">GitHub</a></li>
					<li>&middot;</li>
					<li><a href="https://github.com/minnojs/minno-time/releases">Releases</a></li>
				</ul>
			</div>
		</footer>

	</body>
</html>

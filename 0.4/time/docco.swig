{% extends "./layout.swig" %}

{% block title %}
	<h1>{{ data.basename | capitalize }}</h1>
	<p>Documentation for {{ data.basename }}.js </p>
{% endblock %}


{% block content %}
	{% for section in data.sections %}
		{{ section.docsHtml|safe }}

		{% if section.codeText|replace('^\s*$','') %}
		  {{ section.codeHtml|safe }}
		{% endif %}
	{% endfor %}
{% endblock %}






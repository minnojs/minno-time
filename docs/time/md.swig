{% extends "./layout.swig" %}

{% block title %}
	<h1>{{ data.title }}</h1>
	<p>{{ data.description }}</p>
{% endblock %}


{% block content %}
	{{ contents|safe }}
{% endblock %}
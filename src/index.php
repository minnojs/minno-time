<!DOCTYPE html>
<html>
	<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
        <meta HTTP-EQUIV="Expires" CONTENT="0"></meta>
        <meta HTTP-EQUIV="Pragma" CONTENT="no-cache"></meta>
        <meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache"></meta>
        <meta name="viewport" content="user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, width=device-width, height=device-height" />

        <link type="text/css" rel="Stylesheet" href="css/reset.css"/>
        <link type="text/css" rel="Stylesheet" href="css/styles.css"/>

		<script>
			// create log as a shortcut to console.log if possible, note that this is a global function!
			try {
				log = console.log;
				log('Verify console.log');
			}
			catch(e) {
				if (!console) console = {};
				log = function(){};
			}

		</script>
		<script src="js/libs/require.js"></script>

		<script type="text/javascript">
			require(['js/config'], function() {
				require(['../../resources/examples/iat_component_long']);
			});
		</script>
	</head>

	<body>
	</body>
</html>
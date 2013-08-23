<!DOCTYPE html>
<html>
	<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
        <meta HTTP-EQUIV="Expires" CONTENT="0"></meta>
        <meta HTTP-EQUIV="Pragma" CONTENT="no-cache"></meta>
        <meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache"></meta>
        <meta name="viewport" content="user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1" />

        <link type="text/css" rel="Stylesheet" href="css/reset.css"/>
        <link type="text/css" rel="Stylesheet" href="css/styles.css"/>

		<script>
			// create log as a shortcut to console.log if possible, note that this is a global function!
			try {
				log = console.log;
				log('Verify console.log');
			}
			catch(e) {
				log = function(){};
			}
		</script>
		<script data-main="js/main" src="js/libs/require.js?get=<?php echo time()?>"></script>
		<script src="../examples/AMP.js?get=<?php echo time()?>"></script>

		<script type="text/javascript">
			require(['app/API','utils/pubsub'], function(API,pubsub) {
				API.addSettings('metaData',{
					sessionId : '987348576'
				});
			});
		</script>
	</head>


	<body>
	</body>
</html>
#ask for input on the name of the heroku app
echo Heads up you need to run this AFTER you have done the SFDC setup. You will at least need an org to authorize against.
echo So continuing means you did that. Otherwise ctrl-c outta this sucka and go get that done.
echo Please enter the name of your Heroku App for this rev
echo Only a-z, 0-9, and - are viable here. No non-ascii shenanigans either.
read herokuAppName
echo $herokuAppName selected as your name. Let\'s DO THIS.
#
heroku plugins:install heroku-connect-plugin
heroku apps:create $herokuAppName
heroku addons:create heroku-postgresql -a $herokuAppName
heroku addons:create herokuconnect -a $herokuAppName
heroku connect:info -a $herokuAppName
#
heroku connect:db:set --schema salesforce --db DATABASE_URL -a $herokuAppName
#
echo Enter the alias for your sfdx scratch org 
read $scratchOrg
echo generating login creds - look below to get what you need to log into connect in a second
sfdx force:user:password:generate -u $scratchOrg
heroku connect:sf:auth -a $herokuAppName -e sandbox
heroku connect:import config/mcd-hc-mapping.json -a $herokuAppName
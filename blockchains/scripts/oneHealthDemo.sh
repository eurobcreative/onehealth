

##############################################################
#oneHealth demo: http://eurob.com/videos/oneHealthDemo.mp4
##############################################################


#Pre requisite) Open a new terminal and execute "~/oneHealth/startAll_oneHealth.sh" script in order to create an initialize all the blockchains (~ 1':20'')

./startAll_oneHealth.sh 
#(this terminal window should be kept open )



##Actual demo)

##############################################################
# 1 - go to "~/oneHealth" folder (~ 1':40'')
cd ~/oneHealth

# keys to be used: (~ 1':45'')

cat ~/oneHealth/blockchains/config/keys/jack.pub
cat ~/oneHealth/blockchains/config/keys/jill.pub

##############################################################
# 2- create 3 new persons: (~ 1':50'')

# ./client_oneHealth.sh create <name> <bloodtype> <biologicalsex> <birthday>
./client_oneHealth.sh create JackSparrow AB+ Male someDayAround1690 --key-name jack --key-dir ~/oneHealth/blockchains/config/keys/ 

./client_oneHealth.sh create JillValentine B- Female 1974-05-20 --key-name jill --key-dir ~/oneHealth/blockchains/config/keys/

./client_oneHealth.sh create JillAlterEgo B- Female UnknownDay --key-name jill --key-dir ~/oneHealth/blockchains/config/keys/

##############################################################
# 3- List all available persons (~ 2':40'')

./client_oneHealth.sh list

##############################################################
# 4- Add some health data to each person: (~ 3':10'')

# ./client_oneHealth.sh save <name> <calories> <bodymassindex> <height> <weight> <stepcount> <distancewalkingrunning> <sleepdata> <heartrate> <oxigensaturation> <bodytemperature> <bloodpressure> <bloodsugar>
./client_oneHealth.sh save 'JackSparrow' '3000' '22.5' '1.68' '63.4' '7358' '3.7' '0' '67' 'unknown' '36.7' '<unknown>' '<unknown>' --key-name jack --key-dir ~/oneHealth/blockchains/config/keys/ 

./client_oneHealth.sh save 'JillValentine' '2200' '20.6' '1.65' '56' '3000' '2' 'zzzz' '60' 'unknown' '37' 'unknown' 'unknown' --key-name jill --key-dir ~/oneHealth/blockchains/config/keys/
./client_oneHealth.sh save 'JillValentine' '2200' '20.6' '1.65' '56' '3000' '2' 'zzzz' '60' 'unknown' '37' 'unknown' 'unknown' --key-name jill --key-dir ~/oneHealth/blockchains/config/keys/

./client_oneHealth.sh save 'JillAlterEgo' '6000' '20.6' '1.65' '56' '6000' '2' 'zzzz' '60' 'unknown' '37' 'unknown' 'unknown' --key-name jill --key-dir ~/oneHealth/blockchains/config/keys/

##############################################################
# 5 --> Check health data for each person: (~ 4':00'')

./client_oneHealth.sh show 'JackSparrow' --key-name jack

# (As the table is too big, we ask for a json output instead)

./client_oneHealth.sh show 'JackSparrow' --key-name jack --format json


./client_oneHealth.sh show 'JillValentine' --key-name jill --format json


./client_oneHealth.sh show 'JillAlterEgo' --key-name jill --format json


##############################################################
#6) Now we ask for each person logs twice (so we could check that the queries themselves are logged each time) (~ 5':10'')


./client_oneHealth.sh showlogs 'JackSparrow' --key-name jill --format json

./client_oneHealth.sh showlogs 'JackSparrow' --key-name jack --format json


./client_oneHealth.sh showlogs 'JillValentine' --key-name jack --format json

./client_oneHealth.sh showlogs 'JillValentine' --key-name jill --format json



./client_oneHealth.sh showlogs 'JillAlterEgo' --format json

./client_oneHealth.sh showlogs 'JillAlterEgo' --format json

##############################################################
#7) - Stop processes and/or delete data (~ 7':40'')
./stopAll_oneHealth.sh
./deleteAll_oneHealth.sh


# Thank you for watching!




  
## oneHealth Demo

# CONTENTS of '*~/oneHealth/*' directory

Directories:

  * **blockchains/** : Directory where the blockchains are stored.
  * **client/** : Directory where the oneHealth CLI client is stored (written in node/javascript). This client is based on the [xo_client] (https://github.com/blockchaintp/training/tree/master/code/xo).
  * **server/** : Directory where the oneHealth Transaction Processors (AKA: servers) are stored (written in node/javascript). There are one for each type of Chain (3 in total). They are based on the [xo_transaction_family] (https://sawtooth.hyperledger.org/docs/core/releases/latest/_autogen/sdk_TP_tutorial_js.html#game-logic) .
  
Scripts:

  * **startAll_oneHealth.sh** : script for automatically creating all oneHealth Blockchains (7 in total) and launching al their related processes.
  * **stopAll_oneHealth.sh** : script for automatically stopping all oneHealth related processes BUT KEEPING all the Blockchain data.
  * **relaunch_oneHealth.sh** : script for automatically relaunching all oneHealth related processes. The Blockchain data must exist (if not, run "startAll_oneHealth.sh" instead) .
  * **deleteAll_oneHealth.sh** : script for automatically stopping all oneHealth related processes AND ERASING all the Blockchain data.

Other files:

  * **oneHealthDemo.mp4** : video with an example. It also can be viewed [here] (http://eurob.com/videos/oneHealthDemo.mp4).
  * **README.md** : README file.

# REQUISITES

  * Ubuntu 16.04 or equivalent (Sawtooth official web says it requires Ubuntu 18.04, but tested version also runs on 16.04) .
  * [Hyperledger Sawtooth version 1.2.2 for Ubuntu] (https://sawtooth.hyperledger.org/docs/core/nightly/1-2/app_developers_guide/ubuntu.html#step-1-install-sawtooth) .
  * Node v10.16.3 or superior
  

# INSTRUCTIONS

* Copy oneHealth directory to you 'home' directory (eg: *'/home/ledger'*), as environment directories variables are "rooted" to *'~/oneHealth'*.


* Default 'jack' and 'jill' keys from [xofamily example](https://sawtooth.hyperledger.org/docs/core/releases/latest/app_developers_guide/intro_xo_transaction_family.html#step-4-create-players) are stored at *"~/oneHealth/blockchains/config/keys/"*. Other keys should be copied here OR run the CLI client *<client_oneHealth.sh>* with the *'--key-dir'* argument to specify their routes.


* Run the desire script among *<client_oneHealth.sh>* *<deleteAll_oneHealth.sh>* *<relaunch_oneHealth.sh>* *<startAll_oneHealth.sh>* *<stopAll_oneHealth.sh>*

# EXAMPLE


> copy of *'~/oneHealth/blockchains/scripts/oneHealthDemo.sh'*

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



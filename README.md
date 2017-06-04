## You Only Code Once
This is the repository for the You Only Code Once public website. Found here: https://youonlycodeonce.co.uk

### Setup
`git clone https://github.com/thetomcake/yoco.git`
`cd yoco`
`cp .env.example .env`
`vi .env # fill in your settings`
`npm install`
`composer install && composer update`
`node node_modules/.bin/gulp sass`
`node node_modules/.bin/gulp scripts`

### Notes
* Serve over HTTPS for service worker/offline support
* This has only been tested on Apache2.4 running PHP 7.0
 
### License
Please see [LICENSE.md](LICENSE.md)

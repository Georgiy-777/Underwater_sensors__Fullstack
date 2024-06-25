
# UNDERWATER SENSORS

Fullstack web application using NestJs Websockets NextJs Posgresql TypeORM TailwindCss Chakra UI 

## Demo

https://www.loom.com/share/15d248bad3384e379df71a30c23137d9?sid=797276b7-2df7-44fb-915d-b51331176e75
https://www.loom.com/share/e152a64c15d14b159bb153bd937bc3f5?sid=6ca81db8-4c10-41ee-a762-3d5ab5966cfc


## Documentation
Realized all the conditions of the building but at one point withdrew for compulsory reasons. Instead of Redis and Docker I just used Postgres and Typeorm because the work laptop with Linux was temporarily in repair and worked on Windows, where to deploy successfully these technologies did not work (virtualization is not supported). But otherwise I tried to adhere to the task in detail. 

At the expense of units of measurement in the code conditionally took the standard parameters of the sensor in the pixel 200 * 300 led conditionally to millimeters and then performed the translation into meters or meters per second if it is about speed, and time in seconds.


## Features

- Generation of random increments to temperature and velocity
- Entering the velocity value of the encoder travel device
- Tracking the sensor leaving the safe zone
- Saving, retrieving data from the database
- Dashboard implementation


## Authors

- [web_dev](https://github.com/Georgiy-777)


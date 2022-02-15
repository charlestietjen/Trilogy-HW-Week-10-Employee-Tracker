# Employee Tracker

## Table of Contents


-[Description](#Description)

-[License](#License)

-[Screenshot](#Screenshot)

-[Video Demonstration](#video-demonstration)

-[Installation](#Installation)

-[Usage](#Usage)

-[Contact](#Contact)


## Description
Employee tracker is a CLI application built for the creation and maintenance of a database of employees. Employee tracker allows a user to easily view a number of reports regarding employees, roles and departments. Users are also able to add, update or delete employees, roles or departments. 
  
## License
Available for use under. [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) Click for more information.

 
## Screenshot
![Project Screenshot](/img/project-ss.png?raw=true)

## Video Demonstration

[![Youtube Link](https://img.youtube.com/vi/EcCXlgaISIM/default.jpg)](https://youtu.be/EcCXlgaISIM)

## Installation
Employee Tracker uses inquirer, chalk and mysql2. Type npm i from the command line to install them and all related dependencies.

 
## Usage
To start Employee Tracker type 'node index' from the root directory of the application.

For demonstration purposes the database is seeded with example data on run, this is currently set up to execute every start so duplicates will be created on subsequent runs.
Seeding can be disabled by commenting out "init = await this.connection.execute(seedDept); init = await this.connection.execute(seedRole); init = await this.connection.execute(seedEmployee);" at the bottom of DB.js.

  
## Contact
Find me at [GitHub](https://github.com/charlestietjen)

Reach me by email at charles@lowlevelgoblin.com
 

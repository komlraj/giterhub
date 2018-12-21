#!/usr/bin/env node

const https = require('https');
var chalk = require('chalk');
const logUpdate = require('log-update');
const spinner = require('elegant-spinner');
const frame = spinner();

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const options = {
  headers: {
    'User-Agent' : 'User-Info',
    'Content-Type': 'application/json'
  }
}

var loader = false;
var interval;

function fetchUserData(name, cb) {

    interval =  setInterval(function(){
      logUpdate(
        '\t\t\n' + chalk.rgb(253, 245, 13).bold('Loading for data') + frame()
      )
    }, 50)

  https.get(`https://api.github.com/users/${name}`, options, (res) => {
    if(res.statusCode != 200) {
      console.log(res.statusCode)
      clearInterval(interval);
    } else {
        var resData = ''
        res.on('data', (data) => {
          resData += data
        })
        res.on('end', () => {
          resData = JSON.parse(resData)
          clearInterval(interval);
          cb(resData);
        })
    }
  })
}


function showData(resData) {
  console.log(chalk.rgb(220, 23, 207).bold('Name : ') + chalk.rgb(31, 209, 209).bold(resData.name) + '\n\n')
  console.log(chalk.rgb(220, 23, 207).bold('Repository : ') + chalk.rgb(31, 209, 209).bold(resData.public_repos) + '\n\n')
  console.log(chalk.rgb(220, 23, 207).bold('Follower : ') + chalk.rgb(31, 209, 209).bold(resData.followers) + '\n\n')
  console.log(chalk.rgb(220, 23, 207).bold('Following : ') + chalk.rgb(31, 209, 209).bold(resData.following) + '\n\n')
}

function showDataBySide(dataSet1, dataSet2) {
  console.log('\n\n\t' + chalk.rgb(220, 23, 207).bold('Name : ') + chalk.rgb(31, 209, 209).bold(dataSet1.name) + '\t\t' +chalk.rgb(220, 23, 207).bold('Name : ') + chalk.rgb(31, 209, 209).bold(dataSet2.name) + '\n\n')
  console.log('\t' + chalk.rgb(220, 23, 207).bold('userName : ') + chalk.rgb(31, 209, 209).bold(dataSet1.login) + '\t\t' + chalk.rgb(220, 23, 207).bold('userName : ') + chalk.rgb(31, 209, 209).bold(dataSet2.login) + '\n\n')
  console.log('\t' + chalk.rgb(220, 23, 207).bold('Repository : ') + chalk.rgb(31, 209, 209).bold(dataSet1.public_repos) + '\t\t\t' + chalk.rgb(220, 23, 207).bold('Repository : ') + chalk.rgb(31, 209, 209).bold(dataSet2.public_repos) + '\n\n')
  console.log('\t' + chalk.rgb(220, 23, 207).bold('Follower : ') + chalk.rgb(31, 209, 209).bold(dataSet1.followers) + '\t\t\t' + chalk.rgb(220, 23, 207).bold('Follower : ') + chalk.rgb(31, 209, 209).bold(dataSet2.followers) + '\n\n')
  console.log('\t' + chalk.rgb(220, 23, 207).bold('Following : ') + chalk.rgb(31, 209, 209).bold(dataSet1.following) + '\t\t\t' + chalk.rgb(220, 23, 207).bold('Following : ') + chalk.rgb(31, 209, 209).bold(dataSet2.following) + '\n\n')
}


//  get userName from user 
readline.question(chalk.rgb(213, 60, 121).bold('Choose one option \n\n A. One user information \n B. compare two user information \n\n'), (option) => {

  if(option.toUpperCase() == 'A') {
    console.log('\n' + chalk.rgb(0, 255, 0).bold(' !!! you select first option !!! ') + '\n');
    readline.question(chalk.rgb(0, 0, 255).bold(`Enter userName :  `), (name) => {
      fetchUserData(name, function(resData) {
        showData(resData)
      });
      readline.close();
    })
  } else if(option.toUpperCase() == 'B'){
    console.log('\n' + chalk.rgb(0, 255, 0).bold(' !!! you select Second option !!! ') + '\n');
    readline.question('\n' + chalk.rgb(0, 0, 255).bold(`enter First user name :  `), (firstUserName) => {
      readline.question('\n' + chalk.rgb(0, 0, 255).bold(`enter second user name :  `), (secondUserName) => {
        fetchUserData(firstUserName, function(dataSet1) {
          fetchUserData(secondUserName, function(dataSet2) {
            showDataBySide(dataSet1, dataSet2)
          });
        });
      })
    })
  } else {
    console.log('\n\t\t' + chalk.rgb(255, 0, 0).bold('..Please select valid option..'))
  }
  
  
})

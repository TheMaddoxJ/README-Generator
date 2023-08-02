// External
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');

// Internal
const api = require('./utils/api.js');
const generateMarkdown = require('./utils/generateMarkdown.js');

// Inquirer prompts
const questions = [
    {
        type: 'input',
        message: "What's your GitHub username? (@ Not Required)",
        name: 'username',
        default: 'themaddoxj',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("A valid GitHub username is required.");
            }
            return true;
        }
    },
    {
        type: 'input',
        message: "What's the name of your GitHub repo?",
        name: 'repo',
        default: 'README',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("GitHub repo is required for a badge.");
            }
            return true;
        }
    },
    {
        type: 'input',
        message: "What's the title of your project?",
        name: 'title',
        default: 'Title',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("Valid project title required.");
            }
            return true;
        }
    },
    {
        type: 'input',
        message: "Write a description of your project.",
        name: 'Description',
        default: 'Description',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("Valid description is required.");
            }
            return true;
        }
    },
    {
        type: 'input',
        message: "If applicable, list the steps required to install the project - Installation section.",
        name: 'Installation'
    },
    {
        type: 'input',
        message: "Provide instructions and examples of the project in use - Usage section.",
        name: 'Usage'
    },
    {
        type: 'input',
        message: "If applicable, provide guidelines on how other developers can contribute to the project.",
        name: 'Contributing'
    },
    {
        type: 'input',
        message: "If applicable, provide any tests written for your application and provide examples on how to run them.",
        name: 'Tests'
    },
    {
        type: 'list',
        message: "Choose a license for your project.",
        choices: ['GNU AGPLv3', 'GNU GPLv3', 'GNU LGPLv3', 'Mozilla Public License 2.0', 'Apache License 2.0', 'MIT License', 'Boost Software License 1.0', 'The Unlicense'],
        name: 'License'
    }
];

function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, err => {
        if (err) {
          return console.log(err);
        }
      
        console.log("Success! Your README.md file has been generated")
    });
}

const writeFileAsync = util.promisify(writeToFile);


// Main function
async function init() {
    try {

        // Prompt Inquirer questions
        const userResponses = await inquirer.prompt(questions);
        console.log("Your responses: ", userResponses);
        console.log("Thanks for your responses! Fetching your GitHub data next...");
    
        // Call GitHub api for user info
        const userInfo = await api.getUser(userResponses);
        console.log("Your GitHub user info: ", userInfo);
    
        // Pass Inquirer userResponses and GitHub userInfo to generateMarkdown
        console.log("Generating your README next...")
        const markdown = generateMarkdown(userResponses, userInfo);
        console.log(markdown);
    

        await writeFileAsync('ExampleREADME.md', markdown);

    } catch (error) {
        console.log(error);
    }
};

init();
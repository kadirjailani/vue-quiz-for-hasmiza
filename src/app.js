// Scss Style //
// import 'bootstrap';
import "./scss/main.scss";

// assets
window.$ = window.jQuery = require("jquery");
window.Vue = require("vue/dist/vue");
window.moment = require("moment");
moment().format();

// window.mode = "prod";

// let folder = window.mode === "dev" ? "./dist/" : "/";

var looper = new Vue({
  el: "#quiz",
  data: {
    questionList: require("./test.json"),
    currentQuestion: 0,
    quizStart: true,
    quizEnd: false,
    quizStartTime: null,
    startNewQuestion: true,
    finalAnswers: [
      {
        score: "",
        answer: "",
        answerTime: "",
        durationTaken: ""
      }
    ],
    timeStartEndDifferent: null,
    rightAnswer: 0,
    wrongAnswer: 0,
    percentageResult: null
  },
  methods: {
    startQuizAction() {
      this.quizStartTime = new moment();
      this.quizStart = false;
      // this.finalAnswers[0].startTimeStamp = new moment();
      // console.log(this.finalAnswers);
    },
    startNextQuestion(questionIndex) {
      this.startNewQuestion = false;
      this.finalAnswers[questionIndex] = {
        startTimeStamp: new moment()
      };
    },
    pressNextQuestion() {
      this.startNewQuestion = false;
      this.finalAnswers[this.currentQuestion] = {
        startTimeStamp: new moment()
      };
    },
    answerSelected(questionIndex, answerReceived) {
      //Record each selected answer and move to next question
      let answer = answerReceived;
      this.finalAnswers[questionIndex].question = this.questionList[questionIndex].title;
      this.finalAnswers[questionIndex].score = answer.score;
      this.finalAnswers[questionIndex].answer = answer.name;
      this.finalAnswers[questionIndex].answerTime = new moment();

      this.startNewQuestion = true;
      if (questionIndex === this.questionList.length - 1) {
        //Process all collected data
        this.getFinalResult();
        this.quizEnd = true;
      } else {
        this.currentQuestion++;
      }
    },
    answerPressed(paraM) {
      this.finalAnswers[this.currentQuestion].question = this.questionList[this.currentQuestion].questionTitle;
      this.finalAnswers[this.currentQuestion].answer = this.questionList[this.currentQuestion].answerSelection[paraM].name;
      this.finalAnswers[this.currentQuestion].answerTime = new moment();

      this.startNewQuestion = true;
      if (this.currentQuestion === this.questionList.length - 1) {
        //Process all collected data
        this.getFinalResult();
        this.quizEnd = true;
      } else {
        this.currentQuestion++;
      }
    },
    getQuizDuration() {
      // Get quiz duration from start to finish
      let start = this.quizStartTime;
      let end = this.finalAnswers[this.finalAnswers.length - 1].answerTime;
      let diff = moment.duration(end.diff(start, "HH:mm:ss"));
      this.timeStartEndDifferent = diff.toString().substring(2);
    },
    getEachAnswerDuration() {
      //Get time duration for each question to be answered
      for (var i = 0; i < this.finalAnswers.length; i++) {
        let timeafter = this.finalAnswers[i].answerTime;
        let timeStart = this.finalAnswers[i].startTimeStamp;
        let diffe = moment.duration(timeafter.diff(timeStart, "HH:mm:ss"));
        this.finalAnswers[i].durationTaken = diffe.toString().substring(2);
      }
    },
    getCorrectAnswer() {
      for (var i = 0; i < this.finalAnswers.length; i++) {
        if (this.finalAnswers[i].score !== this.questionList[i].correctAnswer) {
          this.finalAnswers[i].questionResult = false;
        } else {
          this.finalAnswers[i].questionResult = true;
        }
      }
    },
    checkAnswer() {
      for (var i = 0; i < this.finalAnswers.length; i++) {
        if (this.finalAnswers[i].questionResult !== false) {
          this.rightAnswer++;
        } else {
          this.wrongAnswer++;
        }
      }
      let percentage = this.rightAnswer / this.finalAnswers.length;
      this.percentageResult = percentage * 100;
    },
    getFinalResult() {
      this.getQuizDuration();
      this.getEachAnswerDuration();
      this.getCorrectAnswer();
      this.checkAnswer();
      console.log(this.finalAnswers)
    },
    resetQuiz() {
      this.currentQuestion = 0,
        this.quizStart = true,
        this.quizEnd = false,
        this.quizStartTime = null,
        this.startNewQuestion = true,
        this.finalAnswers = [
          {
            score: "",
            answer: "",
            answerTime: "",
            durationTaken: ""
          }
        ],
        this.timeStartEndDifferent = null,
        this.rightAnswer = 0,
        this.wrongAnswer = 0,
        this.percentageResult = null;
    },
    pressLeft(i) {
      this.finalAnswers[i].score = true;
    },
    pressRight(i) {
      this.finalAnswers[i].score = false;
    },
    saveToCSV() {
      let finalItem = JSON.stringify(this.finalAnswers);
      console.log(finalItem);

      this.JSONToCSVConvertor(finalItem, "Final Report", true);
    },
    JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
      //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
      var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
      
      var CSV = '';    
      //Set Report title in first row or line
      
      CSV += ReportTitle + '\r\n\n';
  
      //This condition will generate the Label/Header
      if (ShowLabel) {
          var row = "";
          
          //This loop will extract the label from 1st index of on array
          for (var index in arrData[0]) {
              
              //Now convert each value to string and comma-seprated
              row += index + ',';
          }
  
          row = row.slice(0, -1);
          
          //append Label row with line break
          CSV += row + '\r\n';
      }
      
      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
          var row = "";
          
          //2nd loop will extract each column and convert it in string comma-seprated
          for (var index in arrData[i]) {
              row += '"' + arrData[i][index] + '",';
          }
  
          row.slice(0, row.length - 1);
          
          //add a line break after each row
          CSV += row + '\r\n';
      }
  
      if (CSV == '') {        
          alert("Invalid data");
          return;
      }   
      
      //Generate a file name
      var fileName = "MyReport_";
      //this will remove the blank-spaces from the title and replace it with an underscore
      fileName += ReportTitle.replace(/ /g,"_");   
      
      //Initialize file format you want csv or xls
      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
      
      // Now the little tricky part.
      // you can use either>> window.open(uri);
      // but this will not work in some browsers
      // or you will not get the correct file extension    
      
      //this trick will generate a temp <a /> tag
      var link = document.createElement("a");    
      link.href = uri;
      
      //set the visibility hidden so it will not effect on your web-layout
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";
      
      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
  },
  mounted() {
    window.addEventListener("keyup", () => {
      switch (event.keyCode) {
        case 32:
          if (this.quizStart === true) {
            this.startQuizAction();
          } else {
            this.pressNextQuestion();
          }
          break;
        case 65:
          this.pressLeft(this.currentQuestion);
          this.answerPressed(0);
          break;
        case 76:
          this.pressRight(this.currentQuestion);
          this.answerPressed(1);
          break;
      }
    });
  }
});

const generateAdditionQuestions = (numQuestions) => {
  const questions = [];

  for (let i = 0; i < numQuestions; i++) {
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    const correctAnswer = num1 + num2;
    const questionText = `¿${num1} + ${num2}?`;

    const correctOption = Math.floor(Math.random() * 4) + 1;
    const options = [];

    for (let j = 0; j < 4; j++) {
      if (j + 1 === correctOption) {
        options.push(correctAnswer);
      } else {
        let wrongAnswer;
        do {
          wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
        } while (wrongAnswer === correctAnswer || options.includes(wrongAnswer));
        options.push(wrongAnswer);
      }
    }

    questions.push({
      question: questionText,
      option1: options[0].toString(),
      option2: options[1].toString(),
      option3: options[2].toString(),
      option4: options[3].toString(),
      correct_answer: correctOption,
      operation_type: 'addition',
    });
  }

  return questions;
};

const generateSubtractionQuestions = (numQuestions) => {
  const questions = [];

  for (let i = 0; i < numQuestions; i++) {
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    const correctAnswer = num1 - num2;
    const questionText = `¿${num1} - ${num2}?`;

    const correctOption = Math.floor(Math.random() * 4) + 1;
    const options = [];

    for (let j = 0; j < 4; j++) {
      if (j + 1 === correctOption) {
        options.push(correctAnswer);
      } else {
        let wrongAnswer;
        do {
          wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
        } while (wrongAnswer === correctAnswer || options.includes(wrongAnswer));
        options.push(wrongAnswer);
      }
    }

    questions.push({
      question: questionText,
      option1: options[0].toString(),
      option2: options[1].toString(),
      option3: options[2].toString(),
      option4: options[3].toString(),
      correct_answer: correctOption,
      operation_type: 'subtraction',
    });
  }

  return questions;
};

const generateMultiplicationQuestions = (numQuestions) => {
  const questions = [];

  for (let i = 0; i < numQuestions; i++) {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    const correctAnswer = num1 * num2;
    const questionText = `¿${num1} × ${num2}?`;

    const correctOption = Math.floor(Math.random() * 4) + 1;
    const options = [];

    for (let j = 0; j < 4; j++) {
      if (j + 1 === correctOption) {
        options.push(correctAnswer);
      } else {
        let wrongAnswer;
        do {
          wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
        } while (wrongAnswer === correctAnswer || options.includes(wrongAnswer));
        options.push(wrongAnswer);
      }
    }

    questions.push({
      question: questionText,
      option1: options[0].toString(),
      option2: options[1].toString(),
      option3: options[2].toString(),
      option4: options[3].toString(),
      correct_answer: correctOption,
      operation_type: 'multiplication',
    });
  }

  return questions;
};

const generateDivisionQuestions = (numQuestions) => {
  const questions = [];

  for (let i = 0; i < numQuestions; i++) {
    let num1 = Math.floor(Math.random() * 12) + 1;
    let num2 = Math.floor(Math.random() * 12) + 1;
    num1 = num1 * num2; // Asegurar divisiones exactas
    const correctAnswer = num1 / num2;
    const questionText = `¿${num1} ÷ ${num2}?`;

    const correctOption = Math.floor(Math.random() * 4) + 1;
    const options = [];

    for (let j = 0; j < 4; j++) {
      if (j + 1 === correctOption) {
        options.push(correctAnswer);
      } else {
        let wrongAnswer;
        do {
          wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
        } while (wrongAnswer === correctAnswer || options.includes(wrongAnswer));
        options.push(wrongAnswer);
      }
    }

    questions.push({
      question: questionText,
      option1: options[0].toString(),
      option2: options[1].toString(),
      option3: options[2].toString(),
      option4: options[3].toString(),
      correct_answer: correctOption,
      operation_type: 'division',
    });
  }

  return questions;
};

function generateQuestions(numAdditionQuestions, numSubtractionQuestions, numMultiplicationQuestions, numDivisionQuestions) {
  const randomQuestions = [];

  randomQuestions.push(...generateAdditionQuestions(numAdditionQuestions));
  randomQuestions.push(...generateSubtractionQuestions(numSubtractionQuestions));
  randomQuestions.push(...generateMultiplicationQuestions(numMultiplicationQuestions));
  randomQuestions.push(...generateDivisionQuestions(numDivisionQuestions));

  for (let i = randomQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio entre 0 e i
    [randomQuestions[i], randomQuestions[j]] = [randomQuestions[j], randomQuestions[i]];  // Intercambiar elementos
  }

  return randomQuestions

}

function getRandomQuestion(){

  switch (Math.floor(Math.random() * 4) + 1) {
    case 1:
      return generateAdditionQuestions(1)[0];
    case 2:
      return generateSubtractionQuestions(1)[0];
    case 3:
      return generateMultiplicationQuestions(1)[0];
    case 4:
      return generateDivisionQuestions(1)[0];
    default:
      return generateAdditionQuestions(1)[0];
  }

}

export default getRandomQuestion;
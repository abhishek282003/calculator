let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let string = "";
let arr = Array.from(buttons);

function formatNumber(number) {
  const threshold = 1e9; 

  if (typeof number === 'number') {
    if (Math.abs(number) >= threshold) {
      return number.toExponential();
    } else {
      const parts = number.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join('.');
    }
  }
  return number; 
}

function setInputValue(value) {
  if (string === "") {
    input.value = value;
  } else {
    input.value = formatNumber(value);
  }
  input.scrollLeft = input.scrollWidth; 
}

function evaluateExpression(expression) {
  const sanitizedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
  const result = eval(sanitizedExpression);

  if (Number.isInteger(result)) {
    return result;
  } else if (result === Infinity || result === -Infinity || isNaN(result)) {
    return "Error";
  } else {
    const decimalResult = parseFloat(result.toFixed(2)); 
    return decimalResult;
  }
}

arr.forEach(button => {
  button.addEventListener('click', (e) => {
    let buttonText = e.target.innerHTML;

    if (buttonText === '=') {
      if (string !== '' && !isNaN(string[string.length - 1])) {
        try {
          let result = evaluateExpression(string);
          string = result;
          setInputValue(result);
        } catch (error) {
          setInputValue("Error");
        }
      }
    } else if (buttonText === 'AC') {
      string = "";
      setInputValue(string);
    } else if (buttonText === 'DEL') {
      string = string.substring(0, string.length - 1);
      setInputValue(string);
    } else if (buttonText === '.' && string[string.length - 1] !== '.') {
      if (string === '' || isNaN(string[string.length - 1])) {
        string += '0.';
        setInputValue(string);
      } else if (!string.includes('.')) {
        string += '.';
        setInputValue(string);
      }
    } else if (buttonText === '00') {
      if (string === '') {
        string = '0';
      } else if (!isNaN(string[string.length - 1]) || string[string.length - 1] === '0' || string[string.length - 1] === '.') {
        string += '00';
      }
      setInputValue(string);
    
    } else if (buttonText === '×') {
      if (string !== '' && !isNaN(string[string.length - 1])) {
        string += '*';
        setInputValue(string);
      }
    } else if (buttonText === '÷') {
      if (string !== '' && !isNaN(string[string.length - 1])) {
        string += '/';
        setInputValue(string);
      }
    } else if (isNaN(buttonText)) {
      if (string !== '') {
        let lastChar = string.slice(-1);
        if (isNaN(lastChar) && lastChar !== '.') {
          string = string.slice(0, -1) + buttonText;
        } else if (lastChar !== '.') {
          string += buttonText;
          setInputValue(string);
        }
      }
    } else {
      string += buttonText;
      setInputValue(string);
    }

    let maxLength = input.offsetWidth / 20; 
    if (string.length > maxLength) {
      string = string.slice(string.length - maxLength);
      setInputValue(string);
    }
  });
});


input.disabled = true;

/*
  Assuming the result will be 0 if n <= 0
*/

var sum_to_n_a = function (n) {
  if (n <= 0) return 0;
  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};

var sum_to_n_b = function (n) {
  if (n <= 0) return 0;

  // Create an array from 1 to n
  const arr = Array.from({ length: n }, (_, i) => i + 1);

  // Calculate the sum of the array elements
  const sum = arr.reduce((cumulativeValue, currentValue) => {
    return cumulativeValue + currentValue;
  }, 0);

  return sum;
};

var sum_to_n_c = function (n) {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
};

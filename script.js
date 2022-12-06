'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Afonso Marques',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2022-10-20T17:01:17.194Z',
    '2022-10-22T23:36:17.929Z',
    '2022-10-24T10:51:36.790Z',
    '2022-10-25T22:10:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, '0');
  // const month = `${date.getMonth() + 1}`.padStart(2, '0');
  // const year = date.getFullYear();

  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = sort
      ? new Date(acc.movementsDates[acc.movements.indexOf(mov)])
      : new Date(acc.movementsDates[i]);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${type}</div>
        <div class="movements__date">${formatMovementDate(
          date,
          acc.locale
        )}</div>
        <div class="movements__value">${formatCurrency(
          mov,
          acc.locale,
          acc.currency
        )}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((bal, mov) => bal + mov, 0);

  labelBalance.textContent = `${formatCurrency(
    account.balance,
    account.locale,
    account.currency
  )}`;
};

const calcDisplaySummary = function (account) {
  const sumIn = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = `${formatCurrency(
    sumIn,
    account.locale,
    account.currency
  )}`;

  const sumOut = Math.abs(
    account.movements.filter(mov => mov < 0).reduce((acc, cur) => acc + cur, 0)
  );

  labelSumOut.textContent = `${formatCurrency(
    sumOut,
    account.locale,
    account.currency
  )}`;

  const sumInterest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(cur => cur >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = `${formatCurrency(
    sumInterest,
    account.locale,
    account.currency
  )}`;
};

const updateUI = function (account) {
  // Display movements
  displayMovements(account);

  // Display balance
  calcDisplayBalance(account);

  // Display summary
  calcDisplaySummary(account);
};

const startLogoutTimer = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');

    // in each call, print remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // when time <= 0, stop timer and log out
    if (time <= 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1s
    time--;
  }
  // Set time to 5 min
  let time = 300;
  // call timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const createUser = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word.at(0))
      .join('');
  });
};

createUser(accounts);

let currentAccount, timer;

// // FAKE PERMANENT LOG IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

// Event handlers
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount?.owner
      .split(' ')
      .at(0)}`;
    containerApp.style.opacity = 1;

    // Create current date and time
    const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, '0');
    // const month = `${now.getMonth() + 1}`.padStart(2, '0');
    // const year = now.getFullYear();
    // const hours = `${now.getHours()}`.padStart(2, '0');
    // const minutes = `${now.getMinutes()}`.padStart(2, '0');
    // labelDate.textContent = `${day}/${month}/${year} at ${hours}:${minutes}`;

    // EXPERIMENTING API
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // removes focus from input
    
    // Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(amount);
      // Add loan date
      currentAccount?.movementsDates.push(new Date().toISOString());
      //Update UI
      updateUI(currentAccount);
      // reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);

    //clear input
    inputLoanAmount.value = '';
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(
    account => account.username === inputTransferTo.value
  );

  // if amount is positive and user has enough balance and transfer is not to himself
  if (
    receiver &&
    amount > 0 &&
    amount <= currentAccount?.balance &&
    receiver?.username !== currentAccount?.username
  ) {
    //credit receiver
    receiver?.movements.push(amount);
    // Add transfer date
    receiver?.movementsDates.push(new Date().toISOString());
    //charge sender
    currentAccount?.movements.push(-amount);
    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    // clear inputs
    inputTransferAmount.value = inputTransferTo.value = '';
    // update UI
    updateUI(currentAccount);
    // reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount?.username &&
    Number(inputClosePin.value) === currentAccount?.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
  }
});

let sortedState = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sortedState);
  sortedState = !sortedState;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(23 === 23.0);

// Base 10 --> 0 to 9
// Base 2 --> 0 and 1

// console.log(0.1 + 0.2); // 0.300000000000000004

// // Convert string to number
// console.log(+'23');
// console.log(+'23');

// // Parsing
// console.log(Number.parseInt('30', 10)); // 30
// console.log(Number.parseInt('px', 10)); // NaN

// console.log(Number.parseFloat('  2.5rem  ')); // 2.5
// console.log(Number.parseInt(' 2.5rem ')); // 2

// // check if value is not a number
// console.log(Number.isNaN(+'20X')); // true
// console.log(Number.isNaN(20)); // false
// console.log(Number.isNaN('20')); // false
// console.log(Number.isNaN(23 / 0)); // false because 23 / 0 = Infinity;

// // Best way of checking if a value is a number
// console.log(Number.isFinite(20)); // true
// console.log(Number.isFinite('20')); // false
// console.log(Number.isFinite(+'20x')); // false
// console.log(Number.isFinite(23 / 0)); // false

// console.log(Number.isInteger(23.0)); // true
// console.log(Number.isInteger(23)); // true
// console.log(Number.isInteger('23')); // false
// console.log(Number.isInteger(23 / 0)); // false

// //SQUARE ROOT
// console.log(Math.sqrt(25)); // 5
// console.log(25 ** (1 / 2)); // 5
// console.log(8 ** (1 / 3)); // 2

// // MAX
// console.log(Math.max(2, 10, 5, 56, 3, 24)); // 56
// console.log(Math.max(2, 10, 5, '56', 3, 24)); // 56
// console.log(Math.max(2, '10px', 5, '56', 3, 24)); // NaN

// // MIN
// console.log(Math.min(2, 10, 5, 56, 3, 24)); // 2.5

// // PI
// console.log(Math.PI * Number.parseFloat('10px') ** 2); // calculating the area of a circle with 10px radius

// // RANDOM
// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));

// // Rounding integers
// console.log(Math.trunc(23.3)); // 23
// console.log(Math.round(23.9)); // 24

// console.log(Math.ceil(23.1)); // 24
// console.log(Math.round(0.3)); // 0

// console.log(Math.floor(23.9)); // 23
// console.log(Math.floor(0.9)); // 0

// console.log(Math.trunc(-23.3)); // -23
// console.log(Math.floor(-23.3)); // -24

// // Rounding floating point numbers
// console.log((2.7).toFixed(0)); // '3' ---> string
// console.log((2.7).toFixed(3)); // '2.700' ---> string
// console.log(+(2.3465).toFixed(2)); // 2.35 ---> number

// REMAINDER OPERATOR
// console.log(5 % 2);
// console.log(5 / 2);
// 1;
// console.log(8 % 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(10));
// console.log(isEven(5));
// console.log(isEven(120));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((cur, i) => {
//     // 0 2 4 6 8
//     i % 2 === 0 && (cur.style.backgroundColor = 'orangered');
//     // 0 3 6 9 12
//     i % 3 === 0 && (cur.style.backgroundColor = 'blue');
//   });
// });

// numeric separator
// const diameter = 287_460_000_000;
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFee = 15_00;

// const PI = 3.14_15;

// console.log(Number('230_000'));
// console.log(Number.parseInt('230_000'));

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 + 1);

// // BIG INT
// console.log(4329753018751329847923187413242342n);
// console.log(10000n + 1000n);

// console.log(2343291402319780213984701239470239n * 100000000000000000021n);

// const huge = 2134124123421342134231n;
// const num = 23;

// console.log(huge * BigInt(num));

// console.log(20n > 15); // true
// console.log(20n === 20); // false
// console.log(20n == '20'); // true

// console.log(huge + ' is REALLY big!');

// // Dvision
// console.log(10n / 3n); // 3
// console.log(10/3); // 3.333333333...

// DATES

// Create date
// const now = new Date();
// console.log(now);
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(2037, 1, 31));

// console.log(new Date(0));
// console.log(new Date(1 + (3 * 24 * 60 * 60 * 1000)));

// Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth() + 1);
// console.log(future.getDate()); // 19 - day of the month
// console.log(future.getDay()); // 4 - day of the week
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime()); // timestamp since 1 jan 1970

// console.log(new Date(2142256980000)); // timestamp outputs date

// console.log(Date.now()); // current timestamp without having to create a new date

// future.setFullYear(2040);
// console.log(future);

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const daysPassed = (date1, date2) => (date2 - date1) / (1000 * 60 * 60 * 24);

// console.log(Math.round(Math.abs(daysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24, 10, 8)))));

// INTL NUMBERS
// const num = 25952.59;

// const options = {
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'eur',
//   // useGrouping: false,
// }

// console.log('US:', new Intl.NumberFormat('us-us', options).format(num));
// console.log('Germany:', new Intl.NumberFormat('de-de', options).format(num));
// console.log('Syria:', new Intl.NumberFormat('ar-SY', options).format(num));
// console.log(navigator.language, 'Browser:', new Intl.NumberFormat(navigator.language, options).format(num));

// SET TIMEOUT
// const ingredients = ['olives', 'tomato'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) =>
//     console.log(`Here is your pizza with ${ing1} and ${ing2}! 🍕`),
//   3 * 1000,
//   ...ingredients
// );

// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// SET INTERVAL
// setInterval(function() {
//   const now = new Date();
//   console.log(now);
// }, 1000);

// setInterval(()=> {
//   const time = new Intl.DateTimeFormat(currentAccount ? currentAccount.locale : navigator.language, {
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric'
//   }).format(new Date());
//   labelTimer.textContent = time;
// }, 1000);

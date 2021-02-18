//$ npm install node-pid-controller
let Controller = require('node-pid-controller');

/*
    k_p, k_i, k_d: the PID's coefficients
    dt: interval of time (in seconds) between two measures.
    If not provided, it will be automatically calculated.
    i_max: the maximum absolute value of the integral term (optional)
*/
let ctr = new Controller({
  k_p: 0.25,
  k_i: 0.01,
  k_d: 0.01,
  dt: 1
}); 

ctr.setTarget(120); // 120km/h

let goalReached = false
while (!goalReached) {
  let output = measureFromSomeSensor();
  let input  = ctr.update(output);
  applyInputToActuator(input);
  goalReached = (input === 0) ? true : false;
  // in the case of continuous control, you let this variable 'false'
}
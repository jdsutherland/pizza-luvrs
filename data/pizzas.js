const _ = require('lodash');
const Pizza = require('../models/pizza');
const ImageStore = require('../lib/imageStore');
const PizzaStore = require('./pizzaStore');

function prepPizza(pizza) {
  return _.assign(pizza, { toppings: JSON.stringify(pizza.toppings) });
}

function createPizza(name, toppings, img, username, callback) {
  ImageStore.saveImage(name.replace(/ /g, '-'), img, (err, imgUrl) => {
    if (err) throw err;

    const pizza = new Pizza(name, toppings, imgUrl, username);
    PizzaStore.create(prepPizza(pizza)).then(() => {
      callback(null, pizza);
    });
  });
}

function debriefPizza(pizza) {
  return _.assign(pizza, { toppings: JSON.parse(pizza.toppings) });
}

function debriefPizzas(pizzas) {
  return pizzas.map(pizza => debriefPizza(pizza));
}

// for mocks that don't need pizza images saved
function importPizza(name, toppings, imgUrl, username) {
  const pizza = new Pizza(name, toppings, imgUrl, username);
  PizzaStore.create(prepPizza(pizza));
}

function getPizzaForUser(username, callback) {
  PizzaStore.findAll({
    where: { username },
  }).then(pizzas => callback(null, debriefPizzas(pizzas)));
}

function getRecentPizzas(callback) {
  PizzaStore.findAll({
    order: [['created', 'DESC']],
    limit: 4,
  }).then(pizzas => callback(null, debriefPizzas(pizzas)));
}

function getPizza(pizzaId, callback) {
  PizzaStore.find({
    where: { id: pizzaId },
  }).then((pizza) => {
    if (!pizza) {
      callback('Could not find pizza.');
    } else {
      callback(null, debriefPizza(pizza));
    }
  });
}

module.exports.createPizza = createPizza;
module.exports.importPizza = importPizza;
module.exports.getPizzaForUser = getPizzaForUser;
module.exports.getPizza = getPizza;
module.exports.getRecentPizzas = getRecentPizzas;

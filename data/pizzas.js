const _ = require('lodash');
const Pizza = require('../models/pizza');
const ImageStore = require('../lib/imageStore');

const pizzas = {};

function createPizza(name, toppings, img, username, callback) {
  ImageStore.saveImage(name.replace(/ /g, '-'), img, (err, imgUrl) => {
    if (err) throw err;

    const pizza = new Pizza(name, toppings, imgUrl, username);
    pizzas[pizza.id] = pizza;
    callback(null, pizza);
  });
}

// for mocks that don't need pizza images saved
function importPizza(name, toppings, imgUrl, username) {
  const pizza = new Pizza(name, toppings, imgUrl, username);
  pizzas[pizza.id] = pizza;
}

function getPizzaForUser(username, callback) {
  const userPizzas = _.filter(pizzas, (pizza) => {
    return pizza.username === username;
  });
  callback(null, userPizzas);
}

function getRecentPizzas(callback) {
  const recentPizzas = _.orderBy(pizzas, ['created'], ['desc']);
  callback(null, _.values(recentPizzas).splice(0, 5));
}

function getPizza(pizzaId, callback) {
  if (!pizzas[pizzaId]) callback('Pizza not found');
  else callback(null, pizzas[pizzaId]);
}

module.exports.createPizza = createPizza;
module.exports.importPizza = importPizza;
module.exports.getPizzaForUser = getPizzaForUser;
module.exports.getPizza = getPizza;
module.exports.getRecentPizzas = getRecentPizzas;

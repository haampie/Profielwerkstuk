function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype.x = Number();
Vector.prototype.y = Number();

Vector.prototype.add = function(v) {
  this.x += v.x;
  this.y += v.y;
};

Vector.prototype.getSum = function(v) {
  return new Vector(this.x + v.x, this.y + v.y);
};

Vector.prototype.subtract = function(v) {
  this.x -= v.x;
  this.y -= v.y;
};

Vector.prototype.getDifference = function(v) {
  return new Vector(this.x - v.x, this.y - v.y);
};

Vector.prototype.multiply = function(scalar) {
  this.x *= scalar;
  this.y *= scalar;
};

Vector.prototype.getProduct = function(scalar) {
  return new Vector(this.x * scalar, this.y * scalar);
};

Vector.prototype.divide = function(scalar) {
  this.x /= scalar;
  this.y /= scalar;
};

Vector.prototype.getQuotient = function(scalar) {
  return new Vector(this.x / scalar, this.y / scalar);
};

Vector.prototype.getMagnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.normalize = function() {
  this.divide(this.getMagnitude());
};

Vector.prototype.getUnit = function() {
  return this.getQuotient(this.getMagnitude());
};

Vector.prototype.dot = function(v) {
  return this.x * v.x + this.y * v.y;
};

Vector.prototype.cross = function(v) {
  return this.x * v.y - this.y * v.x;
};

Vector.prototype.clone = function() {
  return new Vector(this.x, this.y);
};

Vector.prototype.negate = function() {
  this.x *= -1;
  this.y *= -1;
};

Vector.project = function(theta, magnitude) {
  return new Vector(Math.cos(theta) * magnitude, Math.sin(theta) * magnitude);
};
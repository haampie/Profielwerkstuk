function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype.x = Number();
Vector.prototype.y = Number();

Vector.prototype.plus = function(v) {
  this.x += v.x;
  this.y += v.y;
};

Vector.prototype.min = function(v) {
  this.x -= v.x;
  this.y -= v.y;
};

Vector.prototype.keer = function(n) {
  this.x *= n;
  this.y *= n;
};

Vector.prototype.deel = function(n) {
  this.x /= n;
  this.y /= n;
};

Vector.prototype.krijgSom = function(v) {
  return new Vector(this.x + v.x, this.y + v.y);
};

Vector.prototype.krijgVerschil = function(v) {
  return new Vector(this.x - v.x, this.y - v.y);
};

Vector.prototype.krijgProduct = function(n) {
  return new Vector(this.x * n, this.y * n);
};

Vector.prototype.krijgQuotient = function(n) {
  return new Vector(this.x / n, this.y / n);
};

Vector.prototype.inproduct = function(v) {
  return this.x * v.x + this.y * v.y;
};

Vector.prototype.uitproduct = function(v) {
  return this.x * v.y - this.y * v.x;
};

Vector.prototype.__defineGetter__('norm', function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
});

Vector.prototype.normaliseer = function() {
  this.deel(this.norm);
};

Vector.prototype.krijgEenheidsvector = function() {
  return this.krijgQuotient(this.norm);
};

Vector.prototype.kloon = function() {
  return new Vector(this.x, this.y);
};

Vector.prototype.spiegel = function() {
  this.x *= -1;
  this.y *= -1;
};

Vector.project = function(theta, norm) {
  return new Vector(Math.cos(theta) * norm, Math.sin(theta) * norm);
};
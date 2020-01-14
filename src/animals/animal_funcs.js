let classes = {
    secret: new WeakMap()
};

(function(common) {

    // ANIMAL
    function AnimalInternal() {
        this.__weight = 1;
    }

    AnimalInternal.MAX_WEIGHT_KG = 5;

    Object.assign(AnimalInternal.prototype, {
        run: function () {
            if (this.__weight > this.constructor.MAX_WEIGHT_KG) {
                console.log('Animal is too fat to move');
                return false;
            } else {
                console.log(`Animal is moving with a weight of ${this.__weight} kg`);
                return true;
            }
        },

        eat: function (kg) {
            console.log(`Animal has eaten ${kg} kg.`);
            this.__weight += this._gainWeight(kg);
            this.__validateWeight();
        },

        _gainWeight: function (kg) {
            return 0;
        },

        __validateWeight: function() {
            if (this.__weight < 0 || this.__weight > this.constructor.MAX_WEIGHT_KG * 2) {
                throw new RangeError(`The weight cannot be negative or exceed ${this.constructor.MAX_WEIGHT_KG} kg.`);
            }
        }
    });

    const secret = common.secret;
    function Animal() {
        const obj = Object.create(this.internalConstructor.prototype);
        this.internalConstructor.apply(obj, arguments);

        secret.set(this, obj);
    }

    Animal.MAX_WEIGHT_KG = AnimalInternal.MAX_WEIGHT_KG;

    Object.assign(Animal.prototype, {
        internalConstructor: AnimalInternal,
        run: function () {
            return secret.get(this).run();
        },
        eat: function (kg) {
            return secret.get(this).eat(kg);
        }
    });

    Object.assign(common, {
        Animal,
        AnimalInternal
    });
})(classes);





(function (common) {
    const {Animal, AnimalInternal} = common;

    // BIRD
    const base = AnimalInternal;
    function BirdInternal() {
        base.call(this);
        this._wingspan = 1; // feet
    }
    Object.setPrototypeOf(BirdInternal, base);

    BirdInternal.MAX_WEIGHT_KG = 3;

    BirdInternal.prototype = Object.create(base.prototype);
    Object.assign(BirdInternal.prototype, {
        constructor: BirdInternal,

        run: function () {
            const moved = base.prototype.run.call(this);
            if (moved) {
                console.log(`Bird is flying with a wingspan of ${this._wingspan} feet`);
            }
            return moved;
        },

        _gainWeight: function (kg) {
            const newWeight = kg * 0.1;
            console.log(`Bird has gained ${newWeight} kg.`);
            return newWeight;
        }
    });


    const secret = common.secret;
    function Bird() {
        Animal.apply(this, arguments);
    }
    Object.setPrototypeOf(Bird, Animal);
    Bird.prototype = Object.create(Animal.prototype);
    Object.assign(Bird.prototype, {
        constructor: Bird,
        internalConstructor: BirdInternal,
        run: function () {
            secret.get(this).run();
        }
    });

    Object.assign(common, {
        Bird,
        BirdInternal
    });
})(classes);






(function (common) {
    const {BirdInternal, Bird} = common;

    const base = BirdInternal;
    function SparrowInternal(name) {
        base.call(this);
        this.__name = name;
    }
    Object.setPrototypeOf(SparrowInternal, base);
    SparrowInternal.prototype = Object.create(base.prototype);
    Object.assign(SparrowInternal.prototype, {
        constructor: SparrowInternal,
        run: function() {
            const moved = base.prototype.run.call(this);
            if (moved) {
                console.log(`Sparrow named ${this.__name} is flying.`);
            }
            return moved;
        }
    });
    Object.defineProperty(SparrowInternal.prototype, 'name', {
        get: function() {
            return this.__name;
        }
    });


    function Sparrow(name) {
        Bird.call(this, name);
    }
    Object.setPrototypeOf(Sparrow, Bird);
    Sparrow.prototype = Object.create(Bird.prototype);
    Object.assign(Sparrow.prototype, {
        constructor: Sparrow,
        internalConstructor: SparrowInternal
    });
    Object.defineProperty(Sparrow.prototype, 'name', {
        get: function() {
            return common.secret.get(this).name;
        }
    });

    Object.assign(common, {
        Sparrow,
        SparrowInternal
    });
})(classes);




// (function (common) {
//     // TEST
//     const {Sparrow} = common;
//     const sparrow = new Sparrow('Chirik 007');
//     sparrow.run();
//     sparrow.eat(30);
//     sparrow.run();


//     const {Bird} = common;
//     const bird = new Bird();
//     bird.run();
//     bird.eat(10);
//     bird.run();
// })(classes);
var config = {
    type: Phaser.WEBGL,
    width: 1130,
    height: 480,
    backgroundColor: '#ffffff',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var snake;
var food;
var cursors;

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('right', 'assets/img/right.png');
    this.load.image('left', 'assets/img/left.png');
    this.load.image('up', 'assets/img/up.png');
    this.load.image('down', 'assets/img/down.png');
    this.load.image('food', 'assets/img/food.png');
    this.load.image('body', 'assets/img/body.png');
}

function create ()
{
    var rightSprite = this.add.sprite(1049, 240, 'right').setInteractive();
    rightSprite.on('pointerover', function (event) {
        cursors.right.isDown=true;
        this.setTint(0xff0000);

    });
    rightSprite.on('pointerout', function (event) {
        cursors.right.isDown=false;
        this.clearTint();

    });


    var leftSprite = this.add.sprite(723, 240, 'left').setInteractive();
    leftSprite.on('pointerover', function (event) {
        cursors.left.isDown=true;
        this.setTint(0xff0000);

    });
    leftSprite.on('pointerout', function (event) {
        cursors.left.isDown=false;
        this.clearTint();

    });


    var upSprite = this.add.sprite(886, 120, 'up').setInteractive();
    upSprite.on('pointerover', function (event) {
        cursors.up.isDown=true;
        this.setTint(0xff0000);

    });
    upSprite.on('pointerout', function (event) {
        cursors.up.isDown=false;
        this.clearTint();

    });


    var downSprite = this.add.sprite(886, 360, 'down').setInteractive();
    downSprite.on('pointerover', function (event) {
        cursors.down.isDown=true;
        this.setTint(0xff0000);

    });
    downSprite.on('pointerout', function (event) {
        cursors.down.isDown=false;
        this.clearTint();

    });




    var counter = 0;


    var Food = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Food (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            this.total = 0;

            scene.children.add(this);
        },

        eat: function ()
        {
            counter++;
            this.total++;
            document.getElementById("score").innerHTML = "Score: " + counter;
        }

    });

    var Snake = new Phaser.Class({

        initialize:

        function Snake (scene, x, y)
        {
            this.headPosition = new Phaser.Geom.Point(x, y);

            this.body = scene.add.group();

            this.head = this.body.create(x * 16, y * 16, 'body');
            this.head.setOrigin(0);

            this.alive = true;

            this.speed = 150;

            this.moveTime = 0;

            this.tail = new Phaser.Geom.Point(x, y);

            this.heading = RIGHT;
            this.direction = RIGHT;
        },

        update: function (time)
        {
            if (time >= this.moveTime)
            {
                return this.move(time);
            }
        },

        faceLeft: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = LEFT;
            }
        },

        faceRight: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = RIGHT;
            }
        },

        faceUp: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = UP;
            }
        },

        faceDown: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = DOWN;
            }
        },

        move: function (time)
        {
            switch (this.heading)
            {
                case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                    break;

                case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                    break;

                case UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                    break;

                case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                    break;
            }

            this.direction = this.heading;

            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

            var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

            if (hitBody)
            {
                window.alert("Game Over! \nClick the reset game button in the navigation bar to try again!");

                this.alive = false;

                return false;
            }
            else
            {
                this.moveTime = time + this.speed;

                return true;
            }
        },

        grow: function ()
        {
            var newPart = this.body.create(this.tail.x, this.tail.y, 'body');

            newPart.setOrigin(0);
        },

        collideWithFood: function (food)
        {
            if (this.head.x === food.x && this.head.y === food.y)
            {
                this.grow();

                food.eat();

                if (this.speed > 20 && food.total % 5 === 0)
                {
                    this.speed -= 5;
                }

                return true;
            }
            else
            {
                return false;
            }
        },

        updateGrid: function (grid)
        {
            this.body.children.each(function (segment) {

                var bx = segment.x / 16;
                var by = segment.y / 16;

                grid[by][bx] = false;

            });

            return grid;
        }

    });

    food = new Food(this, 3, 4);

    snake = new Snake(this, 8, 8);

    cursors = this.input.keyboard.createCursorKeys();
}

function update (time, delta)
{
    if (!snake.alive)
    {
        return;
    }
    if (cursors.left.isDown)
    {
        snake.faceLeft();
    }
    else if (cursors.right.isDown)
    {
        snake.faceRight();
    }
    else if (cursors.up.isDown)
    {
        snake.faceUp();
    }
    else if (cursors.down.isDown)
    {
        snake.faceDown();
    }

    if (snake.update(time))
    {

        if (snake.collideWithFood(food))
        {
            repositionFood();
        }
    }
}

function repositionFood ()
{
    var testGrid = [];

    for (var y = 0; y < 30; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < 40; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    var validLocations = [];

    for (var y = 0; y < 30; y++)
    {
        for (var x = 0; x < 40; x++)
        {
            if (testGrid[y][x] === true)
            {
                validLocations.push({ x: x, y: y });
            }
        }
    }

    if (validLocations.length > 0)
    {
        var pos = Phaser.Math.RND.pick(validLocations);

        food.setPosition(pos.x * 16, pos.y * 16);

        return true;
    }
    else
    {
        return false;
    }
}

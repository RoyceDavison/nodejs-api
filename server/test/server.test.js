const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");
const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");
const { todos, users, populateTodos, populateUsers } = require("./seed/seed");

//empty the database
beforeEach(populateTodos);
beforeEach(populateUsers);

describe("POST /todos", () => {
  it("should create a new todo", (done) => {
    var text = "Test todo text";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch((e) => done(e));
      });
  });

  it("should not create todo with invalid body data", (done) => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(3);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe("GET /todos", () => {
  it("should get all todos", (done) => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect((res) => expect(res.body.todos.length).toBe(3))
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should get the specific todo doc", (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", (done) => {
    var testID = new ObjectID().toHexString();
    request(app).get(`/todos/${testID}`).expect(404).end(done);
  });

  it("should return 404 for non-object ids", (done) => {
    request(app).get("/todos/123abc").expect(404).end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should remove a todo", (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) return done(err);
        Todo.findById(res.body.todo._id)
          .then((todo) => {
            expect(todo).toBeNull();
            done();
          })
          .catch((e) => done(e));
      });
  });

  it("should return 404 if todo not found", (done) => {
    var testID = new ObjectID().toHexString();
    request(app).delete(`/todos/${testID}`).expect(404).end(done);
  });

  it("should return 404 if object id is invalid", (done) => {
    request(app).delete("/todos/123abc").expect(404);
    done();
  });
});

describe("PATCH /todos/:id", (req, res) => {
  it("should update the todo", (done) => {
    var id = todos[0]._id.toHexString();
    var newText = "This is the new text";

    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: true,
        text: newText,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.completed).toBeTruthy();
      })
      .end(done);
  });

  it("should clear completedAt when todo is not completed", (done) => {
    var id = todos[1]._id.toHexString();
    var text = "update from test";

    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: false,
        text,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
  });
});

describe("GET /users/me", () => {
  it("Should return user if authenticated", (done) => {
    //.set(header_name, header_value) is used to set the header
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("Should return 401 if not authenticated", (done) => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("Should create a user", (done) => {
    var email = "examples@gmail.com";
    var password = "test1123";
    request(app)
      .post("/users")
      .send({
        email,
        password,
      })
      .expect(200)
      .expect((res) => {
        expect(res.header["x-auth"]).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) return done(err);
        User.findOne({ email })
          .then((user) => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch((e) => done(e));
      });
  });

  it("Should return validation error if request invalid", (done) => {
    request(app)
      .post("/users")
      .send({
        //看到 "UnhandledPromiseRejectionWarning...." 是正常的，因为email和password格式都不对，但我不知道为什么不会output validation error
        email: "testemail",
        password: "123",
      })
      .expect(400)
      .end(done);
  });

  it("Should not create a user if the email is used", (done) => {
    request(app)
      .post("/users")
      .send({
        email: users[0].email,
        password: "password123",
      })
      .expect(400)
      .end(done);
  });
});

describe("POST /users/login", () => {
  it("Should login user and return auth token", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: users[1].password,
      })
      .expect(200)
      .expect((res) => {
        expect(res.header["x-auth"]).toBeTruthy();
      })
      .end((err, res) => {
        if (err) return done(err);

        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens[0]).toMatchObject({
              access: "auth",
              token: res.header["x-auth"],
            });
            done();
          })
          .catch((e) => done(e));
      });
  });

  it("Should reject invalid login", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: users[1].password + "abc",
      })
      .expect(400)
      .expect((res) => {
        expect(res.header["x-auth"]).toBeUndefined();
      })
      .end((err, res) => {
        if (err) return done(err);

        User.findById(users[1]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe("DELETE /users/me/token", () => {
  it("Shoud remove auth token on logout", (done) => {
    request(app)
      .delete("/users/me/token")
      //什么时候用set? 你在postman里面需要手动设置header的时候。
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        User.findById(users[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

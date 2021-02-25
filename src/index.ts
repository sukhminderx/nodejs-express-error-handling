import * as express from "express";
import { Request, Response } from "express";
import * as fs from "fs";

const app = express();

const { PORT = 8080 } = process.env;


app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "hello world..",
  });
});

app.get("/read", (req: Request, res: Response) => {
  fs.readFile("text.txt", function (err, data) {
    // way 1: throws error and shuts down server
    if (err) throw err;

  });
});
app.get("/read1", (req: Request, res: Response) => {
  fs.readFile("text.txt", function (err, data) {
    
    // way 2: catch error and send relevant status to user
    // server keeps running
    // console log only if explicitly written
    if (err) {
      res.status(500).send({
        message: "error",
      });
    }
  });
});

app.get("/read2", (req: Request, res: Response, next) => {
  fs.readFile("text.txt", function (err, data) {
    // way 3: passing err to next
    // stack trace is given on console
    // 'Internal Server Error' sent to browser (for 500)
    // server keeps running and serving requests
    // status code and message figured out by Express and sent to browser

    // but if way 5 is used for creation of error handling middleware, then
    // above does not happen but
    // errorrrrrrrrr is sent as per the middleware written in way 5 
    if (err) {
      next(err);
    }
  });
});

app.get("/read3", (req: Request, res: Response) => {
  fs.readFile("text.txt", function (err, data) {
    // way 4: no code to process error
    // no response sent, API keeps running in browser
    // server does not shut
    // others requests are served when hit in browser

  });
});



// way 5
// error handling middleware
// should be added to express as the last middleware after all other app.use and all routes
app.use(function (err, req, res, next) {
  res.status(500).send('errorrrrrrrrr');
  // res.render('error', { error: err })
})

app.listen(PORT, () => {
  console.log("server started at http://localhost:" + PORT);
});

// way 6
// if used, then way 1 is caught here and
// server keeps running and
// other requests are served
process.on('uncaughtException', function (err) {
  console.log('ERROE FOUND HERE!!!');
})
const legoData = require("./modules/legoSets");
const path = require("path");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    let legoSets = await legoData.getAllSets();
    res.render('home', { legoSets });
  } catch (err) {
    res.status(404).json(err);
  }
});

app.get('/about', (req, res) => {
  const yourName = "Rahimullah Khadim Hussain"; // Your name
  const schoolName = "Seneca Polytechnic"; // Your college name
  const aboutText = "I'm Rahimullah Khadim Hussain, a passionate computer programmer currently studying at Seneca Polytechnic. I have a strong interest in web development, and I enjoy building innovative and user-friendly web applications. My skills include proficiency in HTML, CSS, JavaScript, and various web development frameworks. I'm always eager to learn and explore new technologies to stay up-to-date in the ever-evolving field of programming."; 
  res.render('about', { yourName, schoolName, aboutText });
});


app.get("/lego/sets", async (req, res) => {
  try {
    if (req.query.theme) {
      let sets = await legoData.getSetsByTheme(req.query.theme);
      res.render('sets', { sets, page: "/lego/sets" }); // Pass page information for active class in Navbar
    } else {
      let sets = await legoData.getAllSets();
      res.render('sets', { sets, page: "/lego/sets" }); // Pass page information for active class in Navbar
    }
  } catch (err) {
    res.status(404).json(err);
  }
});

app.get("/lego/sets/:num", async (req, res) => {
  try {
    let set = await legoData.getSetByNum(req.params.num);
    if (!set) {
      res.status(404).render('404', { message: "No set found with the specified set number." });
    } else {
      res.render('set', { set });
    }
  } catch (err) {
    res.status(404).json(err);
  }
});

app.use((req, res, next) => {
  res.status(404).render('404', { message: "I'm sorry, we're unable to find what you're looking for." });
});

legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`server listening on: ${HTTP_PORT}`);
  });
});

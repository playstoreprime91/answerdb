const express = require('express');
const cors = require('cors');
const sequelize = require('./models');
const Produkt = require('./models/produkt');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Synchronizacja tabeli
sequelize.sync().then(() => console.log("Baza gotowa"));

// CRUD

app.get('/produkty', async (req, res) => {
  const produkty = await Produkt.findAll({ order: [['id','DESC']] });
  res.json(produkty);
});

app.get('/produkty/:id', async (req, res) => {
  const produkt = await Produkt.findByPk(req.params.id);
  if(!produkt) return res.status(404).json({error:"Nie znaleziono produktu"});
  res.json(produkt);
});

app.post('/produkty', async (req,res)=>{
  const {nazwa, sku, cena, kategoria, stan_magazynu} = req.body;
  if(!nazwa || !sku) return res.status(400).json({error:"nazwa i sku wymagane"});
  const nowy = await Produkt.create({nazwa, sku, cena, kategoria, stan_magazynu});
  res.status(201).json(nowy);
});

app.put('/produkty/:id', async (req,res)=>{
  const produkt = await Produkt.findByPk(req.params.id);
  if(!produkt) return res.status(404).json({error:"Nie znaleziono produktu"});
  const {nazwa, sku, cena, kategoria, stan_magazynu} = req.body;
  await produkt.update({nazwa, sku, cena, kategoria, stan_magazynu});
  res.json(produkt);
});

app.delete('/produkty/:id', async (req,res)=>{
  const produkt = await Produkt.findByPk(req.params.id);
  if(!produkt) return res.status(404).json({error:"Nie znaleziono produktu"});
  await produkt.destroy();
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server start na porcie ${PORT}`));
